// const User = require('../../models/User')
const bcrypt = require('bcrypt')
const userController = require('express').Router()
const verifyToken = require('../../middlewares/verifyToken')
const User = require('../../models/User')

const rsa = require('../../rsa/rsa')

const public_rsa_key = 'MjI1NTg4OSw0MjY4MzQ3'
// update
userController.put("/profile/:userId", verifyToken, async (req, res) => {
  if (req.params.userId === req.user.id) {
      try {
        if(req.body.password){
          req.body.password = await rsa.encrypt(public_rsa_key, req.body.password)
        }
        const toSave = rsa.encryptedObjectValues(req.body, public_rsa_key)
        const response = await User.findByIdAndUpdate(req.params.userId, {$set: toSave}, {new: true})

        const {_id ,createdAt, updatedAt, __v,$__,$isNew, ...updatedUser} = response._doc

        const decryptedUpdatedUser = rsa.decryptedObjectValues(updatedUser, process.env.PRIVATE_RSA_KEY)

        // return res.status(200).json({...decryptedUpdatedUser,_id, createdAt, updatedAt, __v })
        return res.status(200).json({user : {...decryptedUpdatedUser,_id, createdAt, updatedAt, __v }})
      } catch (error) {
          return res.status(500).json(error.message)
      }
  } else {
      return res.status(403).json({ msg: "You can only change your own profile" })
  }
})

// Get a specific user
userController.get("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (user) {
      const { _id, createdAt, updatedAt, __v, password, ...userData } = user._doc;
      const decryptedUser = rsa.decryptedObjectValues(userData, process.env.PRIVATE_RSA_KEY);
      console.log(decryptedUser);
      return res.status(200).json({ user: { ...decryptedUser, _id, createdAt, updatedAt, __v } });
    } else {
      return res.status(404).json({ msg: "User not found" });
    }
  } catch (error) {
    return res.status(500).json({ msg: "Server error" });
  }
});

module.exports = userController