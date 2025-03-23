require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 5004;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✅ MongoDB Connected"))
    .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// User Schema
const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    contactNumber: String,
    profession: String,
    emergencyContacts: [{ name: String, phone: String }],
    profilePicture: String, // Store image URL or base64
});

const User = mongoose.model("User", UserSchema);

// 🔹 JWT Authentication Middleware
const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Expect "Bearer <token>"
    if (!token) return res.status(401).json({ message: "No token, authorization denied" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};

// ✅ Signup Route (Stores Profile Details)
app.post("/api/auth/signup", async (req, res) => {
    try {
        const { name, email, password, contactNumber, profession, emergencyContacts, profilePicture } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists!" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            contactNumber,
            profession,
            emergencyContacts,
            profilePicture,
        });

        await newUser.save();

        // Generate JWT Token
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.status(201).json({
            message: "User registered successfully!",
            token,
            userId: newUser._id, // Send userId to frontend
        });
    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ message: "Server Error", error });
    }
});

app.post("/api/auth/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign(
            { id: user._id, profileComplete: !!(user.contactNumber && user.profession) }, 
            process.env.JWT_SECRET, 
            { expiresIn: "2h" }
        );

        res.json({
            message: "Login successful!",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                contactNumber: user.contactNumber || "",
                profession: user.profession || "",
                emergencyContacts: user.emergencyContacts,
                profilePicture: user.profilePicture,
            },
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
});
// ✅ Get User Details (Protected Route)
app.get("/api/auth/me", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password"); // Exclude password
        if (!user) return res.status(404).json({ message: "User not found!" });
        res.json(user);
    } catch (error) {
        console.error("Fetch User Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

// ✅ Update Profile Route
app.put("/api/profile/update", authMiddleware, async (req, res) => {
    try {
        console.log("Incoming Profile Update Request:", req.body);

        const { contactNumber, profession, emergencyContacts, profilePicture } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id, // Use authenticated user's ID
            { contactNumber, profession, emergencyContacts, profilePicture },
            { new: true }
        );

        if (!updatedUser) return res.status(404).json({ message: "User not found!" });

        console.log("Updated User:", updatedUser);
        res.json({ message: "Profile updated successfully!", updatedUser });
    } catch (error) {
        console.error("Update Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

// ✅ Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
