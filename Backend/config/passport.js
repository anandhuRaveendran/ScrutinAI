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
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

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
                user = await User.create({
                    email,
                    username: profile.displayName,
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
                user = await User.create({
                    email,
                    username: profile.username || profile.displayName,
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
                user = await User.create({
                    email,
                    username: profile.username,
                    provider: "discord",
                    providerId: profile.id,
                });
            }

            done(null, user);
        }
    )
);

module.exports = passport; // ✅ REQUIRED
