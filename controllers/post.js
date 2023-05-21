const verifyToken = require('../middlewares/verifyToken')
const Post = require('../models/Post')
const postController = require('express').Router()

// get feed
postController.get('/', async(req, res) => {
    try {
        const posts = await Post.find({})

        return res.status(200).json(posts)
    } catch (error) {
        return res.status(500).json(error.message)
    }
})


// get specific posts
postController.get('/:id', async(req, res) => {
    try {
        const post = await Post.findById(req.params.id)

        post.likes = post.likes.length

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
        const newPost = await Post.create({...req.body, userId: req.user.id})

        return res.status(201).json(newPost)
    } catch (error) {
        return res.status(500).json(error.message)
    }
})

// update
postController.put('/:id', verifyToken, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)

        console.log(post)

        if(post.userId === req.user.id) {
            const updatedPost = await Post.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true})

            return res.status(200).json(updatedPost)
        } else {
            return res.status(403).json({msg: "You cant edit this post"})
        }
    } catch (error) {
        return res.status(500).json(error.message)
    }
})
// delete
postController.delete('/:id', verifyToken, async(req, res) => {
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



module.exports = postController