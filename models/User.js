const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    namaLengkap: {
        type: String,
        required: true,
    },
    profileImage: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        min: 6,
    }
}, {timestamps: true})

module.exports = mongoose.model("User", UserSchema)