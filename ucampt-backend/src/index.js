import express from "express";
import cors from "cors";
import { fileURLToPath } from "url";
import path from "path";
import { initDatabase } from "./config/database.js";
import { seedDatabase } from "./seeders/seedDb.js";
import { PORT } from "./config/env.js";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import { generalLimiter } from "./middleware/rateLimiter.js";
import notificationRoutes from "./routes/notificationRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Apply a general rate limiter to all requests
app.use(generalLimiter);

// FIX: Serve the 'uploads' folder from the project root
// process.cwd() is the safest way to find the root folder
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
// app.use("/api/orders", orderRoutes);
app.use("/api/notifications", notificationRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Start server
async function start() {
  try {
    await initDatabase();
    await seedDatabase();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📚 API available at http://localhost:${PORT}/api`);
      console.log(`📸 Static uploads served at http://localhost:${PORT}/uploads`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

start();