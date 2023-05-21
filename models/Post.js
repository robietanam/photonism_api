const mongoose = require("mongoose")

const PostSchema = new mongoose.Schema({
    photo: {
        type: [String],
        required: true,
    },
    desc: {
        type: String,
        required: true,
    },
    location: {
        type: [Number, Number],
        required: true,
    },
    likes: {
        type: [String],
        default: [],
    },
    userId: {
        type: String,
        required: true,
    }
}, {timestamps: true})

module.exports = mongoose.model("Post", PostSchema)