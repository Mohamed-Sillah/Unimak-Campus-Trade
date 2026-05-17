import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";
import api from "../services/api";

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showPopup, setShowPopup] = useState(false);

  // Polling to check for new notifications
  useEffect(() => {
    if (!user) return;

    const POLL_INTERVAL_MS = 60_000; // poll once per minute to avoid rate limits
    const BACKOFF_MS = 2 * 60_000; // 2 minutes backoff on 429

    let intervalId = null;
    let backoffTimeoutId = null;
    let stopped = false;

    const startInterval = () => {
      // clear any existing interval
      if (intervalId) clearInterval(intervalId);
      intervalId = setInterval(pollNotifications, POLL_INTERVAL_MS);
    };

    async function pollNotifications() {
      try {
        const token = localStorage.getItem("token");
        if (!token) return; // avoid sending "Bearer null" which causes 401

        const response = await api.get("/notifications");
        const data = response.data || response;
        setNotifications(Array.isArray(data) ? data : []);
        const unread = (data || []).filter((n) => !n.read).length;
        setUnreadCount(unread);
      } catch (err) {
        // If we hit a rate limit, back off for a bit rather than hammering the API
        const status = err?.response?.status;
        console.error("Error polling notifications:", err);
        if (status === 429 && !stopped) {
          console.warn(`Received 429 while polling notifications — backing off for ${BACKOFF_MS}ms`);
          stopped = true;
          if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
          }
          backoffTimeoutId = setTimeout(() => {
            stopped = false;
            pollNotifications();
            startInterval();
          }, BACKOFF_MS);
        }
      }
    }

    // Start polling
    startInterval();
    pollNotifications(); // initial fetch

    return () => {
      if (intervalId) clearInterval(intervalId);
      if (backoffTimeoutId) clearTimeout(backoffTimeoutId);
    };
  }, [user]);

  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now(),
      read: false,
      createdAt: new Date().toISOString(),
      ...notification,
    };
    setNotifications((prev) => [newNotification, ...prev]);
    setUnreadCount((prev) => prev + 1);
  };

  const markAsRead = useCallback(async (notificationId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      await api.patch(`/notifications/${notificationId}/read`);

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  }, []);

  const clearNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      await api.delete("/notifications/clear");
      setNotifications([]);
      setUnreadCount(0);
    } catch (err) {
      console.error("Error clearing notifications:", err);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        showPopup,
        setShowPopup,
        addNotification,
        markAsRead,
        clearNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotification = () => useContext(NotificationContext);