const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    username: { type: String, unique: true, sparse: true }, // sparse allows null but enforces uniqueness when set
    email: { type: String, unique: true },
    password: String,

    provider: {
        type: String,
        enum: ["local", "google", "github", "discord"],
        default: "local",
    },

    providerId: String,

    /* Profile Fields */
    profileCompleted: { type: Boolean, default: false },
    avatar: String,
    role: String,
    location: String,
    skills: [String],
    certifications: [{
        title: String,
        issuer: String,
        date: Date
    }],
    about: String,
    socialLinks: {
        twitter: String,
        linkedin: String,
        github: String,
        website: String
    }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
