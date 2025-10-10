const express = require("express");
const router = express.Router();  
const {fetchBlog, updateBlog, addComment, fetchComments, fetchComment, deleteComment, fetchBlogs, deleteBlog, newBlog, postImage, handleLike, getLikeState}  = require("../controller/blogController"); 
const wrapAsync = require("../util/wrapAsync");
const isLoggedIn = require("../middleware");
const multer = require("multer");
const {storage} = require("../cloudeConfig");
const upload = multer({ storage }); 


router.get("/", wrapAsync(fetchBlogs)); 
router.post("/", isLoggedIn, upload.single("banner"), wrapAsync(newBlog));
router.post("/image", isLoggedIn, upload.single("image"), wrapAsync(postImage)); 


router.post("/:id/comments", isLoggedIn, wrapAsync(addComment));
router.get("/:id/comments", wrapAsync(fetchComments));
router.get("/:blogId/comments/:commentId", wrapAsync(fetchComment));
router.delete("/:id/comments/:commentId", isLoggedIn, wrapAsync(deleteComment));
//router.get("/search", wrapAsync(search));
router.get("/:id/likes",  wrapAsync(getLikeState));
router.patch("/:id/likes", isLoggedIn, wrapAsync(handleLike));


router.get("/:id", wrapAsync(fetchBlog));
router.patch("/:id", isLoggedIn, upload.single("banner"), wrapAsync(updateBlog));
router.delete("/:id", isLoggedIn, wrapAsync(deleteBlog));

module.exports = router;