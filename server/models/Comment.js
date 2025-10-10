let mongoose = require("mongoose");
let {Schema} =  require("mongoose");

const commentSchema = mongoose.Schema({
    
    blog_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Blog'
    },
    blog_author: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    comment: {
        type: String,
        required: true
    },
   children: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    commented_by: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    isReply: {
        type: Boolean,
         default: false
    },
    parent: {
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    },
},{ timestamps: { createdAt: 'commentedAt', updatedAt: false } });


let Comment =  mongoose.model("Comment", commentSchema)
module.exports = Comment;