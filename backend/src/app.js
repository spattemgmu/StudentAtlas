
import express from "express";
import cors from "cors";
import session from "express-session";
import healthRoutes from "./routes/healthRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { requireLogin } from "./middleware/requireLogin.js";
import documentRoutes from "./routes/documentRoutes.js";

// Create the Express application.
const app = express();

// Allow both StudentAtlas frontend development ports.
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174"
  ],
  credentials: true
}));

// Allow the backend to read JSON data.
app.use(express.json());

// Keep track of users who are logged in.
app.use(session({
  // Secret used to sign the session cookie.
  secret: process.env.SESSION_SECRET || "studentatlas-local-development-only",

  // Only save sessions when something changes.
  resave: false,

  // Do not create sessions for users who are not logged in.
  saveUninitialized: false,

  // Configure the session cookie.
  cookie: {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    maxAge: 24 * 60 * 60 * 1000
  }
}));

// Check whether the backend is running.
app.use("/api/health", healthRoutes);

// Require login before accessing applications.
app.use("/api/applications", requireLogin, applicationRoutes);

// Require login before accessing profile information.
app.use("/api/profile", requireLogin, profileRoutes);

app.use("/api/documents", requireLogin, documentRoutes);

// Handle registration, login, and logout.
app.use("/api/auth", authRoutes);

// Handle unexpected backend errors.
app.use((error, _request, response, _next) => {
  console.error(error);

  response.status(500).json({
    error: "Internal server error"
  });
});

export default app;
