const bcrypt = require("bcrypt");
const User = require("../models/User");
const Notification = require("../models/Notification");
const Blog = require ("../models/Blog")
const ExpressError = require("../util/ExpressError");
const jwt = require("jsonwebtoken");  


const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

module.exports.changePassword = async (req, res, next) => { 
    const user = req.user; // attached via auth middleware

    // Ensure user is logged in
    if (!user) throw new ExpressError(401, "You must be logged in to change your password");

    // Block Google-auth users
    if (user.google_auth) {
      throw new ExpressError(403, "Password cannot be changed for Google-authenticated users");
    }

    const { currentPassword, newPassword, confirmPassword } = req.body;

    // Check for empty fields
    if (!currentPassword || !newPassword || !confirmPassword) {
      throw new ExpressError(400, "All fields are required");
    }

    // Check if current password is correct
    const isMatch = await bcrypt.compare(currentPassword, user.personal_info.password);
    if (!isMatch) throw new ExpressError(400, "Current password is incorrect");

    // Check if new password matches confirm password
    if (newPassword !== confirmPassword) {
      throw new ExpressError(400, "New password and confirm password do not match");
    }

    // Validate new password strength
    if (!passwordRegex.test(newPassword)) {
      throw new ExpressError(
        400,
        "Password must be at least 6 characters, include uppercase, lowercase, and a number"
      );
    }

    // Hash and save new password
    user.personal_info.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.status(200).json({ message: "Password changed successfully" });

};

module.exports.updateProfile = async (req, res) => {
  const userId = req.user._id;

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  // Profile image is already uploaded to Cloudinary via multer-storage-cloudinary
  if (req.file) {
    user.personal_info.profile_img = req.file.path; 
  } else if (req.body.profile_img) {
    user.personal_info.profile_img = req.body.profile_img;
  }

  // username validation
  if (req.body.username && req.body.username !== user.personal_info.username) {
    const existingUser = await User.findOne({
      "personal_info.username": req.body.username,
      _id: { $ne: userId },
    });
    if (existingUser) return res.status(400).json({ message: "Username is already taken" });
  }

  // Personal info
  if (req.body.fullName) user.personal_info.fullName = req.body.fullName.toLowerCase();
  if (req.body.username) user.personal_info.username = req.body.username;
  if (req.body.bio !== undefined) user.personal_info.bio = req.body.bio;

  // Social links
  const socialFields = ["facebook","github","instagram","twitter","youtube","websites","website"];
  socialFields.forEach(field => {
    if (req.body[field] !== undefined) {
      if (field === "website") user.social_links.website = req.body[field];
      else user.social_links[field] = req.body[field];
    }
  });

  const updatedUser = await user.save();
  res.status(200).json(updatedUser);
};



module.exports.searchUser = async (req, res) => { 
    let {id} = req.params;
    let user = await User.findById(id).select("-password -google_auth -updatedAt");
    return res.status(200).json(user);
};

module.exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    let { query, page = 1, type } = req.query;
    page = parseInt(page);

    if (query === "new") {
      const count = await Notification.countDocuments({ notification_for: userId, seen: false });
      return res.status(200).json(count);
    }

    // Build filter
    let filter = { notification_for: userId };
    if (type && type.toLowerCase() !== "all") {
      filter.type = type.toLowerCase();
    }

    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * 10)
      .limit(10)
      .populate("user", "personal_info.username personal_info.profile_img _id")
      .populate("blog", "_id title")
      .populate({
        path: "comment",
        select: "comment blog_id commented_by parent",
        populate: [
          { path: "commented_by", select: "personal_info.username personal_info.profile_img _id" },
          { path: "blog_id", select: "_id title" },
          {
            path: "parent",
            select: "comment commented_by",
            populate: { path: "commented_by", select: "personal_info.username personal_info.profile_img _id" }
          }
        ]
      })
      .populate({
        path: "reply",
        select: "comment blog_id commented_by parent",
        populate: [
          { path: "commented_by", select: "personal_info.username personal_info.profile_img _id" },
          { path: "blog_id", select: "_id title" },
          {
            path: "parent",
            select: "comment commented_by",
            populate: { path: "commented_by", select: "personal_info.username personal_info.profile_img _id" }
          }
        ]
      });

    return res.status(200).json(notifications);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};


module.exports.readNotification = async (req, res) => { 
  const { type } = req.body;
  const userId = req.user._id;

  let filter = { notification_for: userId };
  if (type && type.toLowerCase() !== "all") {
    filter.type = type.toLowerCase();
  }

  // Update notifications as seen
  const updated = await Notification.updateMany(filter, { $set: { seen: true } });

  // Return number of notifications updated
  res.json({ success: true, updatedCount: updated.modifiedCount });
};




module.exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params; // notification id
    const userId = req.user._id;

    const notification = await Notification.findOneAndDelete({
      _id: id,
      notification_for: userId
    });

    if (!notification) return res.status(404).json({ message: "Notification not found" });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};