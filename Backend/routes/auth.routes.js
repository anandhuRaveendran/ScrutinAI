const express = require("express");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const User = require("../models/User");

const router = express.Router();

router.get("/me", (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ authenticated: false });
    }

    res.json({
        authenticated: true,
        user: req.user,
    });
});



router.post("/register", async (req, res) => {
    const { firstName, lastName, username, email, password } = req.body;

    if (!email || !password || !username)
        return res.status(400).json({ error: "Missing required fields" });

    const emailExists = await User.findOne({ email });
    if (emailExists) return res.status(400).json({ error: "Email already exists" });

    const usernameExists = await User.findOne({ username });
    if (usernameExists) return res.status(400).json({ error: "Username already taken" });

    const hashed = await bcrypt.hash(password, 12);

    await User.create({
        firstName,
        lastName,
        username,
        email,
        password: hashed,
        skills: [],
        certifications: [],
        socialLinks: {}
    });

    res.status(201).json({ success: true });
});

/* LOGIN (SESSION BASED) */
router.post("/login", async (req, res, next) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Invalid credentials" });

    // LAZY MIGRATION for email login
    if (!user.firstName && user.username) {
        const parts = user.username.trim().split(" ");
        user.firstName = parts[0];
        user.lastName = parts.slice(1).join(" ") || "";
        await user.save();
    }

    req.login(user, (err) => {
        if (err) return next(err);
        res.json({
            success: true,
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                avatar: user.avatar,
                role: user.role,
                profileCompleted: user.profileCompleted,
                location: user.location,
                skills: user.skills,
                certifications: user.certifications,
                socialLinks: user.socialLinks,
                about: user.about
            },
        });
    });
});

/* LOGOUT */
router.post("/logout", (req, res) => {
    req.logout(() => {
        req.session.destroy(() => {
            res.clearCookie("scrutinai.sid");
            res.json({ success: true });
        });
    });
});

/* GOOGLE */
router.get("/google",
    passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
    "/google/callback",
    passport.authenticate("google", {
        failureRedirect: "http://localhost:5173/login",
    }),
    (req, res) => {
        // ✅ SESSION IS NOW SET
        res.redirect("http://localhost:5173/oauth-success");
    }
);

/* GITHUB */
router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));

router.get(
    "/github/callback",
    passport.authenticate("github", {
        failureRedirect: "http://localhost:5173/login",
    }),
    (req, res) => {
        res.redirect("http://localhost:5173/oauth-success");
    }
);

/* DISCORD */
router.get("/discord", passport.authenticate("discord"));

router.get(
    "/discord/callback",
    passport.authenticate("discord", {
        failureRedirect: "http://localhost:5173/login",
    }),
    (req, res) => {
        res.redirect("http://localhost:5173/oauth-success");
    }
);



module.exports = router;
