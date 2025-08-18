import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { axiosInstance } from "@/lib/axios";

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [lastChecked, setLastChecked] = useState(null);

  // Local cache of read notification IDs (by user)
  const getReadKeyForUser = (email) => `read-notifications:${email || "guest"}`;
  const loadReadSet = (email) => {
    try {
      const raw = localStorage.getItem(getReadKeyForUser(email));
      const arr = raw ? JSON.parse(raw) : [];
      return new Set(arr);
    } catch {
      return new Set();
    }
  };
  const persistReadSet = (email, set) => {
    try {
      localStorage.setItem(getReadKeyForUser(email), JSON.stringify(Array.from(set)));
    } catch {}
  };

  // Get current user
  const getCurrentUser = () => {
    try {
      const userData = localStorage.getItem("user");
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error("Error parsing user data:", error);
      return null;
    }
  };

  // Fetch notifications from server
  const fetchNotifications = useCallback(async () => {
    const user = getCurrentUser();
    if (!user) return;

    const jwt = localStorage.getItem("jwt");
    setIsLoading(true);
    try {
      const response = await axiosInstance.get("/api/notifications", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        params: { unreadOnly: "true" },
      });

      if (response.data && Array.isArray(response.data)) {
        const mapped = response.data.map((n) => ({
          id: n.id || n._id,
          title: n.title,
          message: n.message,
          type: n.type || "general",
          read: Boolean(n.read),
          createdAt: n.createdAt || n.created_at || new Date().toISOString(),
          priority: n.priority || "medium",
        }));
        // Filter out locally-read notifications as a fallback guard
        const readSet = loadReadSet(user?.email);
        const filtered = mapped.filter((n) => !readSet.has(n.id));
        setNotifications(filtered);
        setUnreadCount(filtered.length);
        setLastChecked(new Date().toISOString());
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      // Fallback to mock data
      const mockNotifications = generateMockNotifications(user || {});
      const readSet = loadReadSet(user?.email);
      const filtered = mockNotifications.filter((n) => !readSet.has(n.id));
      setNotifications(filtered);
      setUnreadCount(filtered.filter((n) => !n.read).length);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Generate mock notifications for demo purposes
  const generateMockNotifications = (user) => {
    const mockData = [
      {
        id: 1,
        title: "Application Status Updated",
        message: "Your application for Software Developer at TechCorp has been reviewed.",
        type: "application",
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
        priority: "high",
      },
      {
        id: 2,
        title: "New Job Match",
        message: "A new job matching your skills has been posted: Frontend Developer at StartupXYZ",
        type: "job_match",
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        priority: "medium",
      },
      {
        id: 3,
        title: "Profile Update Reminder",
        message: "Complete your profile to increase your chances of getting hired.",
        type: "reminder",
        read: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        priority: "low",
      },
      {
        id: 4,
        title: "Interview Scheduled",
        message: "Your interview for Data Analyst position has been scheduled for tomorrow at 2 PM.",
        type: "interview",
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6 hours ago
        priority: "high",
      },
    ];

    // Add role-specific notifications
    if (user.role === "recruiter") {
      mockData.push({
        id: 5,
        title: "New Application Received",
        message: "You have received 3 new applications for the Frontend Developer position.",
        type: "new_application",
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
        priority: "medium",
      });
    }

    return mockData;
  };

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId) => {
    try {
      // Remove locally for immediate feedback
      setNotifications((prev) => prev.filter((notification) => notification.id !== notificationId));

      // Update unread count
      setUnreadCount((prev) => Math.max(0, prev - 1));

      // Persist to local read-set to prevent re-show on refresh
      const user = getCurrentUser();
      const readSet = loadReadSet(user?.email);
      readSet.add(notificationId);
      persistReadSet(user?.email, readSet);

      // Send to server
      const jwt = localStorage.getItem("jwt");
      await axiosInstance.patch(`/api/notifications/${notificationId}/read`, null, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
      });
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      // Clear locally first
      setNotifications([]);
      setUnreadCount(0);

      // Persist all currently visible IDs as read
      const user = getCurrentUser();
      const existing = loadReadSet(user?.email);
      notifications.forEach((n) => existing.add(n.id));
      persistReadSet(user?.email, existing);

      // Send to server
      const jwt = localStorage.getItem("jwt");
      await axiosInstance.patch("/api/notifications/mark-all-read", null, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
      });
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  }, []);

  // Delete notification
  const deleteNotification = useCallback(
    async (notificationId) => {
      try {
        // Update locally first
        const notification = notifications.find((n) => n.id === notificationId);
        if (notification && !notification.read) {
          setUnreadCount((prev) => Math.max(0, prev - 1));
        }

        setNotifications((prev) => prev.filter((n) => n.id !== notificationId));

        // Persist as read to avoid re-show
        const user = getCurrentUser();
        const readSet = loadReadSet(user?.email);
        readSet.add(notificationId);
        persistReadSet(user?.email, readSet);

        // Send to server
        const jwt = localStorage.getItem("jwt");
        await axiosInstance.delete(`/api/notifications/${notificationId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
        });
      } catch (error) {
        console.error("Error deleting notification:", error);
      }
    },
    [notifications]
  );

  // Add new notification (for real-time updates)
  const addNotification = useCallback((notification) => {
    setNotifications((prev) => [notification, ...prev]);
    if (!notification.read) {
      setUnreadCount((prev) => prev + 1);
    }
  }, []);

  // Simulate real-time notifications
  useEffect(() => {
    const user = getCurrentUser();
    if (!user) return;

    // Initial fetch
    fetchNotifications();

    // Set up polling for real-time updates (every 30 seconds)
    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000);

    // Disable demo simulation when backend is available
    let demoInterval = null;

    return () => {
      clearInterval(interval);
      clearInterval(demoInterval);
    };
  }, [addNotification, fetchNotifications]); //Fetch Notifications

  const value = {
    notifications,
    unreadCount,
    isLoading,
    lastChecked,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    addNotification,
    fetchNotifications,
  };

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};
