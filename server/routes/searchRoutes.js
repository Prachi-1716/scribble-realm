const express = require("express");
const router = express.Router();  
const {searchBlogs, searchUsers}  = require("../controller/searchController"); 
const wrapAsync = require("../util/wrapAsync")


router.get("/blogs", wrapAsync(searchBlogs));
router.get("/users", wrapAsync(searchUsers));

module.exports = router;