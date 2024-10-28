const mongoose = require('mongoose')

//S
const interactionSchema = mongoose.Schema({
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    comment_body: {
        type: String,
        required: true,
        max: 500
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
})
module.exports = mongoose.model('interaction', interactionSchema)