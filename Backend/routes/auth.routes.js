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



/* REGISTER */
router.post("/register", async (req, res) => {
    const { firstName, lastName, username, email, password } = req.body;

    if (!email || !password)
        return res.status(400).json({ error: "Missing fields" });

    const exists = await User.findOne({ $or: [{ email }, { username }] });
    if (exists) return res.status(400).json({ error: "User already exists" });

    const hashed = await bcrypt.hash(password, 12);

    await User.create({
        firstName,
        lastName,
        username,
        email,
        password: hashed,
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

    req.login(user, (err) => {
        if (err) return next(err);
        res.json({
            success: true,
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
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

/* GITLAB */
router.get("/gitlab", passport.authenticate("gitlab", { scope: ["read_user"] }));

router.get(
    "/gitlab/callback",
    passport.authenticate("gitlab", {
        failureRedirect: "http://localhost:5173/login",
    }),
    (req, res) => {
        res.redirect("http://localhost:5173/oauth-success");
    }
);



module.exports = router;
