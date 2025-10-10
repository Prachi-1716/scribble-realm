let ExpressError = require("../util/ExpressError");
let Blog = require("../models/Blog");
let User = require("../models/User");
let Like = require("../models/Like");

module.exports.searchBlogs = async (req, res) => { 
    let maxLimit = 7;
    let { page = 1, category, query } = req.query;

    if (!category && !query) {
      throw new ExpressError(400, "Category or search query is required");
    }

    let blogFilter = { draft: false };

    // Category filter
    if (category) {
      blogFilter.tags = category;
    }

    // Query filter
    if (query) {
      blogFilter.$or = [
        { title: { $regex: query, $options: "i" } },
        { tags: { $regex: query, $options: "i" } } 
        // { description: { $regex: query, $options: "i" } }
      ];
    }

    // Search blogs
    let blogs = await Blog.find(blogFilter)
      .populate(
        "author",
        "personal_info.fullName personal_info.username personal_info.profile_img"
      )
      .sort({ publishedAt: -1 })
      .select("_id banner title description activity tags publishedAt")
      .skip((page - 1) * maxLimit)
      .limit(maxLimit);

    return res.status(200).json(blogs);

};


module.exports.searchUsers = async (req, res) => {
    let maxLimit = 7;
    let { page = 1, query } = req.query;

    // Search users if query is present
    let users = [];
    if (query) {
      users = await User.find({
        $or: [
          { "personal_info.fullName": { $regex: query, $options: "i" } },
          { "personal_info.username": { $regex: query, $options: "i" } }
        ]
      })
        .select("personal_info.fullName personal_info.username personal_info.profile_img _id")
        .skip((page - 1) * maxLimit)
        .limit(5);
    }

    return res.status(200).json(users);

};
