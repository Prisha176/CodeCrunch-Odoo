const express = require("express");
const cors = require("cors");
const twilio = require("twilio");
const multer = require("multer");

require("dotenv").config();

const app = express();
const express = require('express');


// Serve static files from uploads directory
app.use('/uploads', express.static('/uploads')); 
app.use(express.json());
// app.use(cors()); // Allow requests from frontend
app.use(cors({
    origin: "http://127.0.0.1:3002"  // Allow frontend access
}));

app.use("/uploads", express.static("uploads")); // ✅ Serve uploaded images

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

app.post("/home", async (req, res) => {
    console.log("🔹 POST request received:", req.body); // Debugging line
    try {
        const { phone, latitude, longitude } = req.body;
        if (!phone || !latitude || !longitude) {
            return res.status(400).json({ error: "Missing required parameters!" });
        }

        const locationUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
        const message = await client.messages.create({
            body: `📍 My Live Location: ${locationUrl}`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phone,
        });

        res.json({ success: true, message: "📍 SMS Sent!", sid: message.sid });
    } catch (error) {
        console.error("❌ Server Error:", error.message);
        res.status(500).json({ error: error.message });
    }
});

// ✅ Setup Multer for image uploads
const upload = multer({ dest: "uploads/" }); // Store images in "uploads/" folder

const posts = []; // Store posts in memory (Temporary storage)

// ✅ New Route: Handle Post Submissions
app.post("/posts", upload.single("image"), (req, res) => {
    console.log("🔹 Post submission received:", req.body);

    const text = req.body.text;
    const hashtags = req.body.hashtags || "";
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null; // Store image path

    if (!text) {
        return res.status(400).json({ error: "Post content is required!" });
    }

    const newPost = {
        id: posts.length + 1,
        text,
        hashtags,
        imageUrl,
        time: new Date().toLocaleString(),
    };

    posts.unshift(newPost);
    res.json({ success: true, message: "Post created!", post: newPost });
});

// app.post("/posts", (req, res) => {
//     console.log("🔹 Post submission received:", req.body);

//     const text = req.body.text;
//     const hashtags = req.body.hashtags || "";

//     if (!text) {
//         return res.status(400).json({ error: "Post content is required!" });
//     }

//     const newPost = {
//         id: posts.length + 1,
//         text,
//         hashtags,
//         time: new Date().toLocaleString(),
//     };

//     posts.unshift(newPost); // Add the new post to the top
//     res.json({ success: true, message: "Post created!", post: newPost });
// });

app.get("/posts", (req, res) => {
    res.json(posts); // Send all stored posts
});


app.listen(5000, () => console.log("✅ Server running on port 5000"));

// require("dotenv").config();
// const express = require("express");
// const twilio = require("twilio");
// const cors = require("cors");

// const app = express();
// app.use(express.json());
// app.use(cors());

// // Twilio credentials (stored in .env for security)
// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const twilioPhone = process.env.TWILIO_PHONE_NUMBER;
// const client = twilio(accountSid, authToken);

// // Endpoint to send SMS with live location
// app.post("/send-location", async (req, res) => {
//     const { phone, latitude, longitude } = req.body;
//     const locationUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

//     try {
//         const message = await client.messages.create({
//             body: `🚨 Emergency Alert! My Live Location: ${locationUrl}`,
//             from: twilioPhone,
//             to: phone,
//         });
//         res.json({ success: true, message: "SMS sent successfully!", sid: message.sid });
//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// });

// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
