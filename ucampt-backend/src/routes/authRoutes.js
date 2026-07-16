import express from "express";
import { login, register } from "../controllers/authController.js";
import { authLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

// Apply stricter rate limiting on login to mitigate brute-force attacks
router.post("/login", authLimiter, login);
router.post("/register", register);

export default router;
