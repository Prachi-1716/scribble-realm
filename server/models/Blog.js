let mongoose = require("mongoose");
let {Schema} =  require("mongoose");
// let User = require("./User");
// let Comment = require("./Comment");

const blogSchema = mongoose.Schema({

    title: {
        type: String,
        //required: true,
    },
    banner: {
        type: String,
        //required: true,
    },
    description: {
        type: String,
        maxlength: 250,
        required: true
    },
    content: {
        type: Array,
        required: true
    },
    tags: {
        type: [String],
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        //required: true,
        ref: "User"
    },
    activity: {
        total_likes: {
            type: Number,
            default: 0
        },
        total_comments: {
            type: Number,
            default: 0
        },
        total_reads: {
            type: Number,
            default: 0
        },
        total_parent_comments: {
            type: Number,
            default: 0
        },
    },
    draft: {
        type: Boolean,
        default: false
    }

}, 
{ 
    timestamps: {
        createdAt: 'publishedAt'
    } 

});

let Blog =  mongoose.model("Blog", blogSchema);

module.exports = Blog;
