const express = require("express");
const wrapAsync = require("../util/wrapAsync");
const router = express.Router();
const {getUser, signUp, signIn, logout, googleAuth} = require("../controller/authController");


router.get("/me", wrapAsync(getUser));
router.post("/register", wrapAsync(signUp));
router.post("/login", wrapAsync(signIn));
router.post("/logout", logout);
router.post("/google", wrapAsync(googleAuth));

module.exports = router;