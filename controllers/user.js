const User = require('../models/User')
const bcrypt = require('bcrypt')
const userController = require('express').Router()
const verifyToken = require('../middlewares/verifyToken')

// update
userController.put("/profile/:userId", verifyToken, async (req, res) => {
  if (req.params.userId === req.user.id) {
      try {
        if(req.body.password){
          req.body.password = await bcrypt.hash(req.body.password, 10)
        }
        const updatedUser = await User.findByIdAndUpdate(req.params.userId, {$set: req.body}, {new: true})
        return res.status(200).json(updatedUser)
      } catch (error) {
          return res.status(500).json(error.message)
      }
  } else {
      return res.status(403).json({ msg: "You can only change your own profile" })
  }
})

module.exports = userController