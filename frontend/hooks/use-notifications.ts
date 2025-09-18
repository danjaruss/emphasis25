"use client"

import { useState, useEffect } from "react"

import { useAuth } from "@/components/auth/auth-provider"
import { queueEmailNotification, defaultEmailPreferences } from "@/lib/email-notifications"

export type Notification = {
  id: string
  type: "project_update" | "comment" | "milestone" | "collaboration" | "system"
  title: string
  message: string
  project_id?: string
  project_name?: string
  created_at: string
  read: boolean
  user_id: string
  metadata?: {
    action?: string
    section?: string
    user_name?: string
    avatar_url?: string
  }
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()

  // Load notifications
  useEffect(() => {
    if (!user) {
      setIsLoading(false)
      return
    }

    loadNotifications()
  }, [user])

  const loadNotifications = async () => {
    if (!user) return

    try {
      // For demo purposes, create some sample notifications
      const sampleNotifications: Notification[] = [
        {
          id: "1",
          type: "project_update",
          title: "Project Updated",
          message: "Solar Energy Initiative has been updated by Sarah Chen",
          project_id: "sample-1",
          project_name: "Solar Energy Initiative",
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          read: false,
          user_id: user.id,
          metadata: {
            action: "updated",
            section: "Implementation Plan",
            user_name: "Sarah Chen",
            avatar_url: "/images/avatars/avatar-2.png",
          },
        },
        {
          id: "2",
          type: "comment",
          title: "New Comment",
          message: "John Smith commented on Waste Management Program",
          project_id: "sample-2",
          project_name: "Waste Management Program",
          created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
          read: false,
          user_id: user.id,
          metadata: {
            action: "commented",
            section: "Budget Planning",
            user_name: "John Smith",
            avatar_url: "/images/avatars/avatar-3.png",
          },
        },
        {
          id: "3",
          type: "milestone",
          title: "Milestone Completed",
          message: "Phase 1 milestone completed for Renewable Energy Grid",
          project_id: "sample-3",
          project_name: "Renewable Energy Grid",
          created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
          read: true,
          user_id: user.id,
          metadata: {
            action: "milestone_completed",
            section: "Phase 1",
          },
        },
        {
          id: "4",
          type: "collaboration",
          title: "New Team Member",
          message: "Maria Rodriguez joined the Coastal Protection Project",
          project_id: "sample-4",
          project_name: "Coastal Protection Project",
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
          read: true,
          user_id: user.id,
          metadata: {
            action: "joined",
            user_name: "Maria Rodriguez",
            avatar_url: "/images/avatars/avatar-4.png",
          },
        },
        {
          id: "5",
          type: "system",
          title: "System Update",
          message: "New features available: PDF export and enhanced collaboration tools",
          created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
          read: true,
          user_id: user.id,
          metadata: {
            action: "system_update",
          },
        },
      ]

      setNotifications(sampleNotifications)
      setUnreadCount(sampleNotifications.filter((n) => !n.read).length)
    } catch (error) {
      console.error("Error loading notifications:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      setNotifications((prev) => prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n)))
      setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  const markAllAsRead = async () => {
    try {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
      setUnreadCount(0)
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
    }
  }

  const deleteNotification = async (notificationId: string) => {
    try {
      const notification = notifications.find((n) => n.id === notificationId)
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId))
      if (notification && !notification.read) {
        setUnreadCount((prev) => Math.max(0, prev - 1))
      }
    } catch (error) {
      console.error("Error deleting notification:", error)
    }
  }

  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refreshNotifications: loadNotifications,
  }
}
