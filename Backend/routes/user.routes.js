const express = require("express");
const User = require("../models/User");

const router = express.Router();

const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ error: "Unauthorized" });
};

router.put("/update-profile", isAuthenticated, async (req, res) => {
    try {
        const { firstName, lastName, avatar, role, location, skills, certifications, about, socialLinks } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            {
                firstName,
                lastName,
                avatar,
                role,
                location,
                skills,
                certifications,
                about,
                socialLinks,
                profileCompleted: true
            },
            { new: true }
        );

        res.json({ success: true, user: updatedUser });
    } catch (error) {
        console.error("Profile update error:", error);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
