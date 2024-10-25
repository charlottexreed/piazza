const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
    title:{
        type:String,
        required:true,
        min:3,
        max:70
    },
    topic:{
        type:[String],
        enum: ['Politics', 'Health', 'Sport', 'Tech'], //Array of strings that is then restricted
        required:true
    },
    body:{
        type:String,
        required:true,
        min:6,
        max:1024
    },
    upload_time:{
        type:Date,
        default:Date.now
    },
    expiry_time:{
        type:Date,
        required: true
    },
    status:{
        type: String,
        enum: ['Live', 'Expired'],
        default: 'Live'
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    interactions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Interaction'
    }]
})

module.exports = mongoose.model('post', postSchema)