import express from "express";
import {
  getNotifications,
  markNotificationAsRead,
  clearNotifications,
} from "../controllers/notificationController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

/**
 * GET /api/notifications - Get all notifications for the logged-in user
 */
router.get("/", authMiddleware, getNotifications);

/**
 * PATCH /api/notifications/:id/read - Mark a notification as read
 */
router.patch("/:id/read", authMiddleware, markNotificationAsRead);

/**
 * DELETE /api/notifications/clear - Clear all notifications for the user
 */
router.delete("/clear", authMiddleware, clearNotifications);

export default router;
