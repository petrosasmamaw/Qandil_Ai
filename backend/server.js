import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import profileRoutes from "./routes/profileRoutes.js";
import aiAssistanceChatRoutes from "./routes/aiAssistanceChatRoutes.js";
import notesChatRoutes from "./routes/notesChatRoutes.js";
import assignmentGuideChatRoutes from "./routes/assignmentGuideChatRoutes.js";
import imageAnalyzerChatRoutes from "./routes/imageAnalyzerChatRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

// Initialize Express app
const app = express();

// Connect to Neon PostgreSQL
connectDB();

// CORS configuration for production (Vercel) & local development
const allowedOrigins = [
  "https://qandil-ai.vercel.app",
  "http://localhost:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app") ||
        process.env.NODE_ENV === "development"
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Root welcome / status endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    service: "Qandil AI Backend API",
    status: "healthy",
    version: "1.0.0",
    endpoints: {
      health: "/api/health",
      auth: "/api/auth",
      profiles: "/api/profiles",
      aiAssistance: "/api/ai-assistance-chat",
      notes: "/api/notes-chat",
      assignmentGuide: "/api/assignment-guide-chat",
      imageAnalyzer: "/api/image-analyzer-chat",
    },
  });
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend is running successfully",
    database: "Neon PostgreSQL connected",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/ai-assistance-chat", aiAssistanceChatRoutes);
app.use("/api/notes-chat", notesChatRoutes);
app.use("/api/assignment-guide-chat", assignmentGuideChatRoutes);
app.use("/api/image-analyzer-chat", imageAnalyzerChatRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : "",
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});

export default app;
