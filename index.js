const express = require('express')
const dotenv = require('dotenv').config()
const mongoose = require('mongoose')
const authController = require('./pages/api/auth')
const postController = require('./pages/api/post')
const userController = require('./pages/api/user')
const app = express()

// connect db
mongoose.connect(process.env.MONGO_URL, () => console.log('Db is connected successfully'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/auth', authController)
app.use('/user', userController)
app.use('/post', postController)

// connect server
app.listen(process.env.PORT, () => console.log('Server is connected successfully'))