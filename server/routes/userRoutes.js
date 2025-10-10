const express = require("express");
const router = express.Router();  
const wrapAsync = require("../util/wrapAsync");
const isLoggedIn = require("../middleware"); 
const {changePassword, updateProfile, searchUser, getNotifications, readNotification, deleteNotification} = require("../controller/userController");
const multer = require("multer");
const {storage} = require("../cloudeConfig");
const upload = multer({ storage }); 

router.patch("/me/password", isLoggedIn, wrapAsync(changePassword)); 
router.delete("/me/notifications/:id", isLoggedIn, deleteNotification);
router.get("/me/notifications", isLoggedIn, wrapAsync(getNotifications));
router.patch("/me/notifications/read", isLoggedIn, wrapAsync(readNotification));
router.patch("/me", isLoggedIn, upload.single("profilePic"),  updateProfile);
router.get("/:id", wrapAsync(searchUser));

module.exports = router;