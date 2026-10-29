import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import { runAllSeeds } from "./utils/seed.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import { logger } from "./utils/logger.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import branchRoutes from "./routes/branchRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import platformRoutes from "./routes/platformRoutes.js";
import surveyRoutes from "./routes/surveyRoutes.js";
import planRoutes from "./routes/planRoutes.js";
import quotaRoutes from "./routes/quotaRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import settingRoutes from "./routes/settingRoutes.js";
import inviteRoutes from "./routes/inviteRoutes.js";
import sellerRoutes from "./routes/sellerRoutes.js";

dotenv.config();

const app = express();

// Middlewares
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Request logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.info(`${req.method} ${req.originalUrl} ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/branches", branchRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/platforms", platformRoutes);
app.use("/api/surveys", surveyRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/quota", quotaRoutes);
app.use("/api/activity", activityRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/settings", settingRoutes);
app.use("/api/invites", inviteRoutes);
app.use("/api/seller", sellerRoutes);

// 404 & Error Handling
app.use(notFound);
app.use(errorHandler);

const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 5000;

// Connect DB, seed defaults, and start server with automatic port fallback
const startServer = async () => {
  try {
    await connectDB();
    await runAllSeeds();

    const listenOnPort = (port) => {
      const server = app.listen(port, () => {
        logger.info(`====================================================`);
        logger.info(` Bizorm Review Backend running on port ${port}`);
        logger.info(` Health endpoint: http://localhost:${port}/api/health`);
        logger.info(`====================================================`);
      });

      server.on("error", (err) => {
        if (err.code === "EADDRINUSE") {
          logger.warn(`Port ${port} is already in use. Automatically attempting port ${port + 1}...`);
          listenOnPort(port + 1);
        } else {
          logger.error(`Server error: ${err.message}`);
          process.exit(1);
        }
      });
    };

    listenOnPort(DEFAULT_PORT);
  } catch (error) {
    logger.error(`Server startup failure: ${error.message}`);
    process.exit(1);
  }
};

startServer();

export { app, startServer };
export default app;
