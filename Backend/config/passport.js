const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GithubStrategy = require("passport-github2").Strategy;
const DiscordStrategy = require("passport-discord").Strategy;
const User = require("../models/User");

/* SERIALIZE */
passport.serializeUser((user, done) => {
    done(null, user.id);
});

/* DESERIALIZE */
passport.deserializeUser(async (id, done) => {
    try {
        let user = await User.findById(id);

        // LAZY MIGRATION: Convert old username to firstName/lastName
        if (user && !user.firstName && user.username) {
            const parts = user.username.trim().split(" ");
            user.firstName = parts[0];
            user.lastName = parts.slice(1).join(" ") || "";
            await user.save();
        }

        done(null, user);
    } catch (err) {
        done(err);
    }
});

/* HELPER TO SPLIT NAMES */
const splitName = (fullName) => {
    const parts = (fullName || "").trim().split(" ");
    const firstName = parts[0] || "User";
    const lastName = parts.slice(1).join(" ") || "";
    return { firstName, lastName };
};

/* GOOGLE */
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "/auth/google/callback",
        },
        async (_, __, profile, done) => {
            const email = profile.emails[0].value;

            let user = await User.findOne({ email });
            if (!user) {
                const firstName = profile.name?.givenName || splitName(profile.displayName).firstName;
                const lastName = profile.name?.familyName || splitName(profile.displayName).lastName;

                user = await User.create({
                    email,
                    firstName,
                    lastName,
                    provider: "google",
                    providerId: profile.id,
                });
            }

            done(null, user);
        }
    )
);

/* GITHUB */
passport.use(
    new GithubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: "/auth/github/callback",
        },
        async (_, __, profile, done) => {
            const email = profile.emails?.[0]?.value;

            let user = await User.findOne({ email });
            if (!user) {
                const { firstName, lastName } = splitName(profile.displayName || profile.username);
                user = await User.create({
                    email,
                    firstName,
                    lastName,
                    provider: "github",
                    providerId: profile.id,
                });
            }

            done(null, user);
        }
    )
);

/* DISCORD */
passport.use(
    new DiscordStrategy(
        {
            clientID: process.env.DISCORD_CLIENT_ID,
            clientSecret: process.env.DISCORD_CLIENT_SECRET,
            callbackURL: "/auth/discord/callback",
            scope: ["identify", "email"],
        },
        async (_, __, profile, done) => {
            const email = profile.email;

            let user = await User.findOne({ email });
            if (!user) {
                const { firstName, lastName } = splitName(profile.global_name || profile.username);
                user = await User.create({
                    email,
                    firstName,
                    lastName,
                    provider: "discord",
                    providerId: profile.id,
                });
            }

            done(null, user);
        }
    )
);

module.exports = passport; // ✅ REQUIRED
