let mongoose = require("mongoose");
let {Schema} =  require("mongoose");

let likeSchema = new Schema({
    user: {
        type:  Schema.Types.ObjectId,
        ref :"User",
    },
    blog: {
        type:  Schema.Types.ObjectId,
        ref :"Blog",
    }
})

let Like = new mongoose.model('Like', likeSchema);
module.exports = Like;