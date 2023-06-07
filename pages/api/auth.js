const authController = require('express').Router()
const User = require('../../models/User')
const bcrypt = require('bcrypt')
const dotenv = require('dotenv').config()
const jwt = require("jsonwebtoken")
const {encrypt, decrypt, encryptedObjectValues, decryptedObjectValues} = require('../../rsa/rsa.js')

const public_rsa_key = 'MjI1NTg4OSw0MjY4MzQ3'



authController.post('/register', async(req, res) => {
    try {
      const isExisting = await User.findOne({email: req.body.email})
      
      if(isExisting){
        return res.status(500).json({msg: "Email is already taken by another user."})
      }
      console.log('---------------- Test ----------------------')
      const encryptedMap = encryptedObjectValues(req.body, public_rsa_key);
      console.log(encryptedMap)
      const newUser = await User.create(encryptedMap)
      console.log(newUser._doc)
      console.log('------------------1---------------------')
      const {password,_id ,createdAt,updatedAt, __v, ...others} = newUser._doc
      
      const otherDecypted =  decryptedObjectValues(others, process.env.PRIVATE_RSA_KEY)

      console.log(otherDecypted)
      console.log('------------------2---------------------')
      const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET)

      return res.status(201).json({user: {...otherDecypted, _id , createdAt, updatedAt, __v,}, token})
    } catch (error) {
        return res.status(500).json(error.message)
    }
})

authController.post("/login", async(req, res) => {
    try {
      const user = await User.findOne({email: encrypt(public_rsa_key ,req.body.email)}) 
      

      if(!user){
        return res.status(500).json({msg: 'Wrong credentials. Try again!'})
      }
      let comparePass = false;
      //  const comparePass = await bcrypt.compare(req.body.password, user.password)
      if (encrypt(public_rsa_key, req.body.password) ==  user.password)
      {
        comparePass = true;
      }
      //  const comparePass = await bcrypt.compare(req.body.password, user.password)
       if(!comparePass){
        return res.status(500).json({msg: 'Wrong credentials. Try again!'})
       }
       

       const {password ,_id ,createdAt,updatedAt, __v, ...others} = user._doc
       const otherDecypted =  decryptedObjectValues(others, process.env.PRIVATE_RSA_KEY)

       const token = jwt.sign({id: user._id}, process.env.JWT_SECRET)

       return res.status(200).json({user:  {...otherDecypted, _id , createdAt, updatedAt, __v,}, token})
    } catch (error) {
        return res.status(500).json(error.message)
    }
})

module.exports = authController