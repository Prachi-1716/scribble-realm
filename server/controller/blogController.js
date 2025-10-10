let ExpressError = require("../util/ExpressError");
let Blog = require("../models/Blog");
let Comment = require("../models/Comment");
let Notification = require("../models/Notification");
let User = require("../models/User");
let Like = require("../models/Like");
let mongoose = require("mongoose");
const { cloudinary } = require("../cloudeConfig");  
const jwt = require("jsonwebtoken");  


module.exports.fetchBlog = async(req, res)=>{
    let {id, mode} = req.params;
    let count = mode === "edit" ? 0 : 1;

    let result = await Blog.findByIdAndUpdate(id, {$inc: {"activity.total_reads": count}}, {new: true})
    .populate("author", "personal_info.fullName personal_info.username personal_info.profile_img _id");
    if(!result) throw new ExpressError(400, "blog not found");
    let result2 = await User.findByIdAndUpdate(result.author._id, { $inc: { "account_info.total_reads": count } }, { new: true })
    return res.status(200).json(result);

}

module.exports.postImage = async(req, res)=>{ 
    let result = req.file?.path;
    if (!result) {
        return res.status(400).json({ success: false, message: "No file uploaded" });
    } 
    res.status(200).json({url: result, message: "file uploaded successfully"});
}

module.exports.newBlog = async(req, res)=>{
    let { title, description, content, tags, isDraft } = req.body; 
    let banner = req.file?.path;
    isDraft = isDraft === true || isDraft === "true";


    if (typeof content === "string") content = JSON.parse(content);
    if (typeof tags === "string") tags = JSON.parse(tags); 

    if (!isDraft && (!title || !banner || !description || !content || !tags?.length)) {
        throw new ExpressError(403, "Something is missing");
    }  

    let blog = new Blog({title, banner, description, content, tags, author: req.user._id, draft: isDraft});
    let result = await blog.save(); 

    if(!isDraft)  {
        let updatedResult = await User.findByIdAndUpdate(req.user._id, { $inc: { "account_info.total_posts": 1 } }, { new: true }); 
    }
    return res.status(200).json({message: "blog uploaded successfully"});
}
module.exports.handleLike = async(req, res)=>{ 
    let blogId = req.params.id;
    let userId =  req.user._id;
    let {increase} = req.body;
    let updated;
    if(increase) {
       let result = await Like.findOne({ user: userId, blog: blogId });
       if(result) throw new ExpressError(401, "You have already liked this blog");
        await Like.create({ user: userId, blog: blogId });
        updated = await Blog.findByIdAndUpdate(blogId, {$inc: {"activity.total_likes": 1}}, {new: true});
        // let blog = await Blog.findById(blogId);
        // console.log("blog  " + blog); 
        if (!req.user._id.equals(updated.author))  await Notification.create({ type: "like", blog: blogId, notification_for: updated.author, user: userId  });

    }else{
        updated = await Blog.findOneAndUpdate({ _id: blogId, "activity.total_likes": { $gt: 0 } }, { $inc: { "activity.total_likes": -1 } }, { new: true }  );
        await Like.deleteOne({blog: blogId, user: userId}); 
        await Notification.deleteOne({ type: "like", blog: blogId, notification_for: updated.author, user: userId  });
    }
    return res.status(200).json({ message: "liked", count: updated.activity.total_likes});
}

module.exports.getLikeState = async(req, res)=>{
    const token = req.cookies.token;  
    if (!token) {
        return res.status(200).json(false);
    }

    //Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user from DB
        const user = await User.findById(decoded.id);
    if (!user) {
        return res.status(200).json(false);
    }
    let blogId = req.params.id;
    let userId =  user.id;  

    let result = await Like.findOne({ user: userId, blog: blogId }); 
    if(result) return res.status(200).json(true);
    return res.status(200).json(false);
}

// module.exports.latestBlogs = async(req, res)=>{
//     let maxLimit = 7;
//     let { page } = req.query;

//     let blogs = await Blog.find({ draft: false })
//       .populate("author", "personal_info.fullName personal_info.username personal_info.profile_img -_id")
//       .sort({ publishedAt: -1 })
//       .select("_id banner title description activity tags publishedAt")
//       .skip((page-1) * maxLimit)
//       .limit(maxLimit);
//     //console.log(blogs);
//     return res.status(200).json(blogs);
// }

// module.exports.TrendingBlogs = async(req, res)=>{
//     let maxLimit = 10;

//     let blogs = await Blog.find({ draft: false })
//       .populate("author", "personal_info.fullName personal_info.username personal_info.profile_img -_id")
//       .sort({ "activity.total_views": -1, "activity.total_likes": -1, publishedAt: -1 })
//       .select("_id banner title description activity tags publishedAt")
//       .limit(maxLimit);
//     //console.log(blogs);
//     return res.status(200).json(blogs);
// }
 
module.exports.updateBlog = async(req, res) =>{
    let {id} = req.params;
    let { title, description, content, tags, isDraft } = req.body; 
    let banner = req.file?.path ? req.file.path : req.body.bannerUrl;

    isDraft = isDraft === true || isDraft === "true";

    if (typeof content === "string") content = JSON.parse(content);
    if (typeof tags === "string") tags = JSON.parse(tags);   
    if (!isDraft && (!title || !banner || !description || !content || !tags?.length)) {
        throw new ExpressError(403, "Something is missing");
    } 

    let user = req.user;
    let blog = await Blog.findById(id);
    if(!blog) throw new ExpressError(400, "blog not found");
    if (String(blog.author) !== String(user._id)) return res.status(403).json({message: "you are not the author of this blog"});
    
    blog = await Blog.findByIdAndUpdate(id, {title, banner, description, content, tags, author: req.user._id, draft: isDraft}, {new: true});
    return res.status(200).json(blog);
}


module.exports.addComment = async (req, res) => {
    const { id } = req.params;              // blog id
    const { comment, parentId } = req.body; // comment text + optional parentId
    const { _id: userId } = req.user;       // logged-in user

    if (!comment) return res.status(403).json({ message: "Please write a comment" });

    // get blog author
    const blog = await Blog.findById(id).select("author");
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    const blog_author = blog.author;

    let parentComment;
    if(parentId){
        parentComment = await Comment.findById(parentId);
        if (!parentComment) return res.status(404).json({ message: "Parent comment not found" });

    }
    // create new comment or reply 
    const newComment = new Comment({
      blog_id: id,
      blog_author,
      comment,
      commented_by: userId,
      isReply: parentId ? true: false,
      parent: parentId ? parentId : null
    });

    const savedComment = await (await newComment.save()).populate("commented_by", "personal_info.username personal_info.profile_img");
        if(parentComment){
            parentComment.children.push(savedComment._id );
            await parentComment.save();
        } 
       await Blog.findByIdAndUpdate(id, {
          $inc: { "activity.total_comments": 1, "activity.total_parent_comments": parentId? 0: 1 }
        });

    // create notification
    const notificationData = {
        type: parentId? "reply" : "comment",
        blog: id,
        notification_for: parentComment? parentComment.commented_by: blog_author,
        user: userId,
        reply: savedComment._id,
        comment: savedComment._id,
        replied_on_comment: parentId
        }

    // avoid self-notifications
    if (String(notificationData.notification_for) !== String(userId)) {
      await Notification.create(notificationData);
    }

    return res.status(200).json(savedComment);
  
};


module.exports.fetchComments = async(req, res)=>{
    let {id} = req.params;  //blog id 
    let {skip} = req.query;
    let maxLimit = 5;
    let comments = await Comment.find({ blog_id: id, isReply: false })
    .populate("commented_by", "personal_info.username personal_info.profile_img")
    .skip(skip)
    .limit(maxLimit)
    .sort({"commentedAt": -1});
    return res.status(200).json(comments);
}

module.exports.fetchComment = async(req, res)=>{
    let {commentId} = req.params; 
    let result = await Comment.findById(commentId).populate("commented_by", "personal_info.username personal_info.profile_img");
    return res.status(200).json(result);
}

// let deleteRecursion = async(id)=>{
//     let comment = await Comment.findById(id);
//     if (!comment) return null;
//     for(let child of comment.children){
//         await deleteRecursion(child);
//     }
//     let res = await Comment.findByIdAndDelete(id);
//     return res;
// }

module.exports.deleteComment = async(req, res)=>{
    let {id, commentId} = req.params;
    let user = req.user;
    let comment = await Comment.findById(commentId);
    console.log(comment);
    if(!commentId || !comment) throw new ExpressError(400, "comment not found");
    if(String(user._id) !== String(comment.commented_by)) throw new ExpressError(401, "This comment is not your");

    const result = await Comment.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(commentId) } },
      {
        $graphLookup: {
          from: "comments",
          startWith: "$children",
          connectFromField: "children",
          connectToField: "_id",
          as: "descendants",
        },
      },
      {
        $project: {
          allIds: {
            $concatArrays: [["$_id"], "$descendants._id"], // combine self + all descendants
          },
        },
      },
    ]);
 
    const idsToDelete = result[0]?.allIds || [commentId];
 
    let deleteResult = await Comment.deleteMany({ _id: { $in: idsToDelete } }); 
    if (comment.parent) {
      await Comment.findByIdAndUpdate(comment.parent, {
        $pull: { children: comment._id },
      });
    }
 
    let deletedCount =  deleteResult.deletedCount;
    await Blog.findByIdAndUpdate(id, {$inc: {"activity.total_comments": -deletedCount}});
    return res.status(200).json(result);
}

//trending latest and blogs of a specific user 
module.exports.fetchBlogs = async (req, res) => {
  const { userId, type, page = 1 } = req.query;
  const maxLimit = 7;
  let blogs;

  if (userId) {
    // Fetch blogs by a specific user
    blogs = await Blog.find({ author: userId, draft: false })
      .populate(
        "author",
        "personal_info.fullName personal_info.username personal_info.profile_img"
      )
      .sort({ publishedAt: -1 })
      .select("_id banner title description activity tags publishedAt")
      .skip((page - 1) * maxLimit)
      .limit(maxLimit);
  } else if (type === "trending") {
    // Fetch trending blogs
    blogs = await Blog.find({ draft: false })
      .populate(
        "author",
        "personal_info.fullName personal_info.username personal_info.profile_img -_id"
      )
      .sort({ "activity.total_views": -1, "activity.total_likes": -1, publishedAt: -1 })
      .select("_id banner title description activity tags publishedAt")
      .limit(10); // trending limit
  } else {
    // Default: latest blogs
    blogs = await Blog.find({ draft: false })
      .populate(
        "author",
        "personal_info.fullName personal_info.username personal_info.profile_img -_id"
      )
      .sort({ publishedAt: -1 })
      .select("_id banner title description activity tags publishedAt")
      .skip((page - 1) * maxLimit)
      .limit(maxLimit);
  }

  res.status(200).json(blogs);
};


function getPublicIdFromUrl(url) {
  if (!url) return null;
  try {
    // Match everything after `/upload/` and before the file extension
    const match = url.match(/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z]+$/);
    return match ? match[1] : null; // e.g., bloggingWebsite/avu6sz8vvrj0ixv87d4a
  } catch {
    return null;
  }
}



module.exports.deleteBlog = async(req, res)=>{
  let {id} = req.params;
  let user = req.user;
  if(!user) throw new ExpressError(400, "You are not logged in");

  let blog = await Blog.findById(id);
  if (!blog) throw new ExpressError(404, "Blog not found");
  if (!user._id.equals(blog.author)) {
    throw new ExpressError(401, "You are not author of this blog");
  }

  const deleteResult = await Comment.deleteMany({ blog_id: id });
  await User.findByIdAndUpdate(user._id, {$inc: {"account_info.total_posts": -1, "account_info.total_reads": -blog.activity.total_reads}});

  if (blog.banner) {
    const bannerPublicId = getPublicIdFromUrl(blog.banner);
    if (bannerPublicId) await cloudinary.uploader.destroy(bannerPublicId);
  }

  // 🧹 Delete all content images (if any)
  const contentImages = blog.content
    .filter(item => item.type === "image" && item.url)
    .map(item => getPublicIdFromUrl(item.url))
    .filter(Boolean);

  if (contentImages.length > 0) {
    await Promise.all(contentImages.map(imgId => cloudinary.uploader.destroy(imgId)));
  }

  await Blog.findByIdAndDelete(id);
  res.status(200).json({ message: "Blog deleted successfully" });

}