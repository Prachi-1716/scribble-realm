require('dotenv').config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const mongoose = require("mongoose");  
const cors = require("cors");
const cookieParser = require('cookie-parser'); 
const admin = require("firebase-admin");
const multer = require("multer");
const {storage} = require("./cloudeConfig");
const upload = multer({ storage });
//const serviceAccountKey = require("/run/secrets/serviceAccountKey.json");
const authRoutes = require("./routes/authRoutes"); 
const searchRoutes = require("./routes/searchRoutes"); 
const blogRoutes = require("./routes/blogRoutes");
const userRoutes = require("./routes/userRoutes");


//models
const User = require("./models/User");


(async function main() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("MongoDB connection error:", err);
    }
})();


app.listen(port, ()=>{
    console.log(`listening from port : ${port}` );
});

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://scribble-realm.onrender.com"
  ],

  credentials: true 
}));
app.set("trust proxy", 1); 

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
const serviceAccountKey = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey) // from Firebase
});

// Request logger middleware
// app.use((req, res, next) => {
//   console.log("-----------------------------");
//   console.log(`Method: ${req.method}`);
//   console.log(`URL: ${req.originalUrl}`);
//   console.log("Headers:", req.headers);
//   if (req.method === "POST" || req.method === "PATCH") {
//     console.log("Body:", req.body);
//   }
//   console.log("-----------------------------\n");
//   next();
// });

app.get("/", (req, res, next)=>{
    res.send("Server is working");
}); 

app.use("/api/auth",  authRoutes);   
app.use("/api/blogs", blogRoutes);
app.use("/api/search", searchRoutes); 
app.use("/api/users", userRoutes);

// app.post("/bannerImg", isLoggedIn, upload.single("banner"), wrapAsync((req, res)=>{
//     res.json({imageUrl: req.file.path});
// }))


app.use((err, req, res, next) => {
    console.log(err);
    if(err.code == 11000) return res.status(400).json({ message: "user already exists" });
    const status = err.status || 500;      
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
});
