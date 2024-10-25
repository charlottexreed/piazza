const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
    title:{
        type:String,
        require:true,
        min:3,
        max:30
    },
    topic:{
        type:[String],
        enum: ['Politics', 'Health', 'Sport', 'Tech'], //Array of strings that is then restricted
        require:true
    },
    body:{
        type:String,
        require:true,
        min:6,
        max:1024
    },
    post_time:{
        type:Date,
        default:Date.now
    },
    post_expiry_time:{
        type:Date,
        default:Date.now
    },
    post_status:{

    },
    post_owner:{

    },
    likes:{
        type:Number,
        default:0
    },
    dislikes:{
        type:Number,
        default:0
    },
    comments:{

    }

})

module.exports = mongoose.model('post', postSchema)