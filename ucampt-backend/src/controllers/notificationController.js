import { getDb } from "../config/database.js";

/**
 * Get all notifications for a user
 */
export async function getNotifications(req, res) {
  try {
    const db = getDb();
    const userId = req.user.id;

    const notifications = await db.all(
      `SELECT * FROM notifications WHERE userId = ? ORDER BY createdAt DESC LIMIT 50`,
      [userId]
    );

    res.json(notifications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

/**
 * Mark a notification as read
 */
export async function markNotificationAsRead(req, res) {
  try {
    const db = getDb();
    const { id } = req.params;
    const userId = req.user.id;

    // Verify notification belongs to user
    const notification = await db.get(
      `SELECT * FROM notifications WHERE id = ? AND userId = ?`,
      [id, userId]
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    await db.run(
      `UPDATE notifications SET read = 1 WHERE id = ?`,
      [id]
    );

    res.json({ message: "Notification marked as read" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

/**
 * Clear all notifications for a user
 */
export async function clearNotifications(req, res) {
  try {
    const db = getDb();
    const userId = req.user.id;

    await db.run(
      `DELETE FROM notifications WHERE userId = ?`,
      [userId]
    );

    res.json({ message: "All notifications cleared" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

/**
 * Create a notification (internal use)
 */
export async function createNotification(userId, type, message) {
  try {
    const db = getDb();
    await db.run(
      `INSERT INTO notifications (userId, type, message) VALUES (?, ?, ?)`,
      [userId, type, message]
    );
  } catch (err) {
    console.error("Error creating notification:", err);
  }
}

/**
 * Broadcast notification to all users
 */
export async function broadcastNotification(type, message) {
  try {
    const db = getDb();
    const users = await db.all(`SELECT id FROM users`);
    
    for (const user of users) {
      await createNotification(user.id, type, message);
    }
  } catch (err) {
    console.error("Error broadcasting notification:", err);
  }
}
