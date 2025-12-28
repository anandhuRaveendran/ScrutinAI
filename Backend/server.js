require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const session = require("express-session"); // ✅ ADD THIS

const authRoutes = require("./routes/auth.routes");
const auditRoutes = require("./routes/audit.routes");
const userRoutes = require("./routes/user.routes");
const passport = require("./config/passport");

const app = express();

/* SESSION */
app.use(
  session({
    name: "scrutinai.sid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax", // ✅ "none" requires secure: true, but that breaks http://localhost. "lax" works for same-site (ports ignored).
      secure: false,   // false for http://localhost
    },
  })
);


/* PASSPORT */
app.use(passport.initialize());
app.use(passport.session());

/* BODY + CORS */
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

/* DB */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error(err));

/* ROUTES */
app.use("/auth", authRoutes);
app.use("/audit", auditRoutes);
app.use("/user", userRoutes);

app.get("/health", (_, res) => {
  res.json({ status: "OK" });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║  🛡️  Smart Contract Auditor API                       ║
║                                                       ║
║  Status: ✅ Running                                   ║
║  Port: ${PORT}                                        ║
║  URL: http://localhost:${PORT}                        ║
║                                                       ║
║  Ollama: LOCAL Installation                           ║
║  Host: http://localhost:11434                         ║
║  Model: llama3.2                                      ║
║                                                       ║
║  Endpoints:                                           ║
║  POST /audit/audit      - Full contract audit         ║
║  POST /audit/quick-scan - Quick security scan         ║
║  GET  /health           - Health check & models       ║
║  POST /auth/register    - User registration           ║
║  POST /auth/login       - User login                  ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
  `);
});
