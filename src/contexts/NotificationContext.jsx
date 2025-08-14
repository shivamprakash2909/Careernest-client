import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { axiosInstance } from '@/lib/axios';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [lastChecked, setLastChecked] = useState(null);

  // Get current user
  const getCurrentUser = () => {
    try {
      const userData = localStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  };

  // Fetch notifications from server
  // const fetchNotifications = useCallback(async () => {
  //   const user = getCurrentUser();
  //   if (!user) return;

    // setIsLoading(true);
    // try {
    //   const response = await axiosInstance.get('/api/notifications', {
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //   });

    //   if (response.data && Array.isArray(response.data)) {
    //     setNotifications(response.data);
    //     const unread = response.data.filter(notification => !notification.read).length;
    //     setUnreadCount(unread);
    //   }
    // } catch (error) {
    //   console.error('Error fetching notifications:', error);
    //   // If server is not available, use mock data for demo
    //   const mockNotifications = generateMockNotifications(user);
    //   setNotifications(mockNotifications);
    //   setUnreadCount(mockNotifications.filter(n => !n.read).length);
    // } finally {
    //   setIsLoading(false);
    // }
  // }, []);

  // Generate mock notifications for demo purposes
  const generateMockNotifications = (user) => {
    const mockData = [
      {
        id: 1,
        title: 'Application Status Updated',
        message: 'Your application for Software Developer at TechCorp has been reviewed.',
        type: 'application',
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
        priority: 'high'
      },
      {
        id: 2,
        title: 'New Job Match',
        message: 'A new job matching your skills has been posted: Frontend Developer at StartupXYZ',
        type: 'job_match',
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        priority: 'medium'
      },
      {
        id: 3,
        title: 'Profile Update Reminder',
        message: 'Complete your profile to increase your chances of getting hired.',
        type: 'reminder',
        read: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        priority: 'low'
      },
      {
        id: 4,
        title: 'Interview Scheduled',
        message: 'Your interview for Data Analyst position has been scheduled for tomorrow at 2 PM.',
        type: 'interview',
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6 hours ago
        priority: 'high'
      }
    ];

    // Add role-specific notifications
    if (user.role === 'recruiter') {
      mockData.push({
        id: 5,
        title: 'New Application Received',
        message: 'You have received 3 new applications for the Frontend Developer position.',
        type: 'new_application',
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
        priority: 'medium'
      });
    }

    return mockData;
  };

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId) => {
    try {
      // Update locally first for immediate feedback
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read: true }
            : notification
        )
      );

      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));

      // Send to server
      await axiosInstance.patch(`/api/notifications/${notificationId}/read`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      // Update locally first
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      );
      setUnreadCount(0);

      // Send to server
      await axiosInstance.patch('/api/notifications/mark-all-read', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  }, []);

  // Delete notification
  const deleteNotification = useCallback(async (notificationId) => {
    try {
      // Update locally first
      const notification = notifications.find(n => n.id === notificationId);
      if (notification && !notification.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }

      setNotifications(prev => prev.filter(n => n.id !== notificationId));

      // Send to server
      await axiosInstance.delete(`/api/notifications/${notificationId}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  }, [notifications]);

  // Add new notification (for real-time updates)
  const addNotification = useCallback((notification) => {
    setNotifications(prev => [notification, ...prev]);
    if (!notification.read) {
      setUnreadCount(prev => prev + 1);
    }
  }, []);

  // Simulate real-time notifications
  useEffect(() => {
    const user = getCurrentUser();
    if (!user) return;

    // Initial fetch
    // fetchNotifications();

    // Set up polling for real-time updates (every 30 seconds)
    const interval = setInterval(() => {
      // fetchNotifications();
    }, 30000);

    // Simulate incoming notifications for demo
    const demoInterval = setInterval(() => {
      const shouldAddNotification = Math.random() < 0.1; // 10% chance every 30 seconds
      if (shouldAddNotification) {
        const newNotification = {
          id: Date.now(),
          title: 'New Opportunity',
          message: 'A new job matching your profile has been posted!',
          type: 'job_match',
          read: false,
          createdAt: new Date().toISOString(),
          priority: 'medium'
        };
        addNotification(newNotification);
      }
    }, 30000);

    return () => {
      clearInterval(interval);
      clearInterval(demoInterval);
    };
  }, [addNotification]); //Fetch Notifications

  const value = {
    notifications,
    unreadCount,
    isLoading,
    lastChecked,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    addNotification,
    // fetchNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
