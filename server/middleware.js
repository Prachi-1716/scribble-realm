require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("./models/User"); 

const isLoggedIn = async (req, res, next) => {
    //console.log(req.cookies.token);
    try {
        const token = req.cookies.token; // Read token from cookie
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        //Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch user from DB
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ message: "Unauthorized: User not found" });
        }

        req.user = user; // Attach user to request 
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
    }
};

module.exports = isLoggedIn;
