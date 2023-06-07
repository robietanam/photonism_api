const verifyToken = require('../../middlewares/verifyToken')
const Post = require('../../models/Post')
const postController = require('express').Router()

const rsa = require('../../rsa/rsa')

const public_rsa_key = 'MjI1NTg4OSw0MjY4MzQ3'

// get feed
postController.get('/', async (req, res) => {
  try {
    const skip = parseInt(req.query.skip) || 0; // Get the page number from the query parameters, default to 1 if not provided
    const limit = parseInt(req.query.limit); // Get the number of posts per page from the query parameters, default to 10 if not provided

    const totalPosts = await Post.countDocuments({});
    const totalPages = Math.ceil(totalPosts / limit);

    const posts = await Post.find({}).skip(skip).limit(limit);

    const decryptedPosts = [];
    for (const post of posts) {
      const { _id, createdAt, updatedAt, __v, likes, location, photo, userId, ...getPost } = post._doc;
      const decryptedPost = rsa.decryptedObjectValues(getPost, process.env.PRIVATE_RSA_KEY);
      const updatedPost = { _id, createdAt, updatedAt, __v, likes, location, photo, userId, ...decryptedPost };
      decryptedPosts.push(updatedPost);
    }

    console.log(decryptedPosts);
    console.log('----------------------');
    return res.status(200).json({ posts: decryptedPosts, totalPages });
  } catch (error) {
    return res.status(500).json(error.message);
  }
});



// get specific posts
postController.get('/feed/:id', async(req, res) => {
    try {
        const posts = await Post.findById(req.params.id)
        const {_id , createdAt, updatedAt, __v, likes,location, photo, userId, ...getPost}  = posts._doc
        const decryptedPost = rsa.decryptedObjectValues(getPost, process.env.PRIVATE_RSA_KEY)
        const post = { _id , createdAt, updatedAt, __v, likes,location,likes,photo,userId,  ...decryptedPost}
        if (!post) {
            return res.status(400).json(error.message)
        } else{
            return res.status(200).json(post)
        }
    } catch (error) {
        return res.status(500).json(error.message)
    }
})

// create
postController.post('/', verifyToken, async (req, res) => {
    try {
        console.log(req.user.id)
        const {likes, location , photo, ...toEncrypt } = req.body
        console.log(toEncrypt)
        const encryptedBody = rsa.encryptedObjectValues(toEncrypt, public_rsa_key)
        const newPost = await Post.create({...encryptedBody,likes: likes, location: location,photo: photo, userId: req.user.id})
        const { desc, ...others} = newPost._doc
        const desc2 = rsa.decrypt( process.env.PRIVATE_RSA_KEY, desc) 
        return res.status(201).json({desc: desc2, _id , createdAt, updatedAt, __v, likes,userId, location})
    } catch (error) {
        return res.status(500).json(error.message)
    }
})

// update
postController.put('/feed/:id', verifyToken, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)

        console.log('gET URNRRNNRRN')
        if( post.userId === req.user.id) {
            var {desc, ...others} = req.body
            desc = rsa.encrypt( public_rsa_key, desc)
            const toSave = {...others, desc }
            console.log('------------ddadasdsdd-----')
            console.log(toSave);
            
            const thePost = await Post.findByIdAndUpdate(req.params.id, {$set: toSave}, {new: true})
            console.log(thePost)
            const  { _id , createdAt,  updatedAt,  __v, likes, photo, location,  userId , ...updatedPost} = thePost._doc
            desc = rsa.decryptedObjectValues(updatedPost, process.env.PRIVATE_RSA_KEY)
            return res.status(200).json({desc, _id , createdAt, updatedAt, __v, likes,userId, location})
        } else {
            return res.status(403).json({msg: "You cant edit this post"})
        }
    } catch (error) {
        return res.status(500).json(error.message)
    }
})
// delete
postController.delete('/feed/:id', verifyToken, async(req, res) => {
    try {
        const post = await Post.findById(req.params.id)

        if(!post){
            return res.status(500).json({msg: "No such post"})
        } else if(post.userId !== req.user.id){
            return res.status(403).json({msg: "You can delete only your own posts"})
        } else {
            await Post.findByIdAndDelete(req.params.id)
            return res.status(200).json({msg: "Post is successfully deleted"})
        }
    } catch (error) {
        return res.status(500).json(error.message)
    }
})

// like/dislikes
postController.put("/likeDislike/:id", verifyToken, async(req, res) => {
    try {
        const currentUserId = req.user.id
        const post = await Post.findById(req.params.id)

        if(post.likes.includes(currentUserId)){
           post.likes = post.likes.filter((id) => id !== currentUserId)
           await post.save()
           return res.status(200).json({msg: "Successfully unliked the post"})
        } else {
           post.likes.push(currentUserId)
           await post.save()
           return res.status(200).json({msg: "Successfully liked the post"})
        }
    } catch (error) {
        return res.status(500).json(error.message) 
    }
})

// populer post based on likes
postController.get('/popular', async (req, res) => {
  try {
    const posts = await Post.find({}).sort({ likes: -1 }).limit(10);

    const decryptedPosts = [];
    for (const post of posts) {
      const { _id, createdAt, updatedAt, __v, likes, location, photo, userId, ...getPost } = post._doc;
      const decryptedPost = rsa.decryptedObjectValues(getPost, process.env.PRIVATE_RSA_KEY);
      const updatedPost = { _id, createdAt, updatedAt, __v, likes, location, photo, userId, ...decryptedPost };
      decryptedPosts.push(updatedPost);
    }

    console.log(decryptedPosts);
    console.log('----------------------');
    return res.status(200).json(decryptedPosts);
  } catch (error) {
    return res.status(500).json(error.message);
  }
});

  

module.exports = postController