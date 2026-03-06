require('dotenv').config();  
const bcrypt = require('bcrypt');
const { nanoid } = require("nanoid"); 
const jwt = require("jsonwebtoken");  
const admin = require("firebase-admin"); 
const User = require("../models/User");
const ExpressError = require("../util/ExpressError");

let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
let passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

const categories = ["waifu", "husbando"];
const randomCategory = categories[Math.floor(Math.random() * categories.length)];

let formatUserDataToSend = (user)=>{
    return {
      fullName: user.personal_info.fullName,
      username: user.personal_info.username,
      profile_img: user.personal_info.profile_img,
      _id: user._id
    }
}

module.exports.getUser = async(req, res)=>{
    
    const token = req.cookies.token; // Read token from cookie
    console.log("get user' + , idToken);
    if (!token) {
        return res.status(200).json({});
    }

    //Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user from DB
        const user = await User.findById(decoded.id);
    if (!user) {
        return res.status(200).json({});
    }

    req.user = user; 
    res.status(200).json(formatUserDataToSend(req.user));
}

module.exports.signUp = async (req, res, next) => {
    const { fullName, email, password } = req.body;
    console.log("signUp ' + fullName);
    // Validation
    if (!fullName || fullName.length < 3)
        throw new ExpressError(400, "Invalid name");
    if (!email || email.length < 3 || !emailRegex.test(email))
        throw new ExpressError(400, "Invalid email");
    if (!passwordRegex.test(password))
        throw new ExpressError(
            400,
            "Password must be at least 6 characters long and include at least one uppercase letter, one lowercase letter, and one number."
        );

    // Hash password
    const hash = await bcrypt.hash(password, 10);

    // Generate a unique username
    const baseUsername = fullName.split(" ")[0];
    let username;
    let exists = true;

    // Keep generating until a unique username is found
    while (exists) {
        const uniqueSuffix = nanoid(5);
        username = `${baseUsername}_${uniqueSuffix}`;
        exists = await User.findOne({ "personal_info.username": username });
    }

    // const response = await fetch(`https://nekos.best/api/v2/neko`);
    // const data = await response.json();
    // const avatarUrl = data.results[0].url;
    

    // // Create new user
    const user = new User({
        personal_info: { fullName, email, password: hash, username,}
    });
    await user.save();

    let acces_token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "3d"});
    res.cookie("token", acces_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : "None",
        maxAge: 3 * 24 * 60 * 60 * 1000             
    });
    req.user = user;
   return res.status(201).json(formatUserDataToSend(user));
    
}

//login 
module.exports.signIn = async(req, res, next)=>{
    let {email, password} = req.body;
    email = email.trim().toLowerCase();


    let user = await User.findOne({"personal_info.email": email});
    if(!user) throw new ExpressError(400, "Invalid Email");
    console.log("login" + user);
    let result = await bcrypt.compare(password, user.personal_info.password);
    if(!result) throw new ExpressError(400, "Incorrect password");
    let acces_token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "3d"});
    
    res.cookie("token", acces_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "None", 
        maxAge: 3 * 24 * 60 * 60 * 1000             
    });
    req.user = user;
    return res.status(200).json(formatUserDataToSend(user));
}

module.exports.logout = (req, res) => {
    // Clear the JWT cookie by setting it to an empty value
    res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "None"
});

    return res.status(200).json({ message: "Logged out successfully" });
}

module.exports.googleAuth = async(req, res)=>{
    const { idToken } = req.body;
    console.log("google auth ' + , idToken);
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const {email } = decodedToken;

    const fullName = decodedToken.name || "";
    //const profile_img = decodedToken.picture || "";


    let user = await User.findOne({"personal_info.email": email});

    if(!user){
        const baseUsername = fullName.split(" ")[0];
        let username;
        let exists = true;

        // Keep generating until a unique username is found
        while (exists) {
            const uniqueSuffix = nanoid(5);
            username = `${baseUsername}_${uniqueSuffix}`;
            exists = await User.findOne({ "personal_info.username": username });
        }

        // const response = await fetch(`https://nekos.best/api/v2/neko`);
        // const data = await response.json();
        // const avatarUrl = data.results[0].url;

        user = new User({
            personal_info:{fullName, email, username,},
            google_auth: true
        });
        await user.save();
    }

    const acces_token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "3d" });
    req.user = user;
    res.cookie("token", acces_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "None",
        maxAge: 3 * 24 * 60 * 60 * 1000
    });

    res.status(200).json(formatUserDataToSend(user));
}



