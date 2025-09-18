"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Bell, CheckCheck, X, MessageSquare, Milestone, Users, SettingsIcon, FolderOpen } from "lucide-react"
import { useNotifications, type Notification } from "@/hooks/use-notifications"
import { cn } from "@/lib/utils"
import Link from "next/link"
import Image from "next/image"

function getNotificationIcon(type: Notification["type"]) {
  switch (type) {
    case "project_update":
      return FolderOpen
    case "comment":
      return MessageSquare
    case "milestone":
      return Milestone
    case "collaboration":
      return Users
    case "system":
      return SettingsIcon
    default:
      return Bell
  }
}

function getNotificationColor(type: Notification["type"]) {
  switch (type) {
    case "project_update":
      return "text-emphasis-navy"
    case "comment":
      return "text-emphasis-teal"
    case "milestone":
      return "text-emphasis-light-green"
    case "collaboration":
      return "text-emphasis-mint"
    case "system":
      return "text-gray-500"
    default:
      return "text-gray-500"
  }
}

function formatTimeAgo(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return "Just now"
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
  return date.toLocaleDateString()
}

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false)
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications()

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id)
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative text-emphasis-teal hover:bg-emphasis-mint/50 hover:text-emphasis-navy"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500 text-white border-2 border-white"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
          <span className="sr-only">Notifications {unreadCount > 0 && `(${unreadCount} unread)`}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0 bg-white border-emphasis-light-blue/20">
        <div className="flex items-center justify-between p-4 border-b border-emphasis-light-blue/20">
          <h3 className="font-semibold text-emphasis-navy">Notifications</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs text-emphasis-teal hover:text-emphasis-navy"
            >
              <CheckCheck className="h-4 w-4 mr-1" />
              Mark all read
            </Button>
          )}
        </div>

        <ScrollArea className="h-[400px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Bell className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y divide-emphasis-light-blue/10">
              {notifications.map((notification) => {
                const Icon = getNotificationIcon(notification.type)
                const iconColor = getNotificationColor(notification.type)

                return (
                  <div
                    key={notification.id}
                    className={cn(
                      "p-4 hover:bg-emphasis-mint/20 transition-colors cursor-pointer group",
                      !notification.read && "bg-emphasis-mint/10",
                    )}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={cn("flex-shrink-0 mt-0.5", iconColor)}>
                        <Icon className="h-4 w-4" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p
                              className={cn(
                                "text-sm font-medium",
                                notification.read ? "text-gray-700" : "text-emphasis-navy",
                              )}
                            >
                              {notification.title}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                            {notification.project_name && (
                              <Link
                                href={`/projects/${notification.project_id}`}
                                className="text-xs text-emphasis-teal hover:text-emphasis-navy mt-1 inline-block"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {notification.project_name}
                              </Link>
                            )}
                          </div>

                          <div className="flex items-center space-x-1 ml-2">
                            {!notification.read && (
                              <div className="w-2 h-2 bg-emphasis-teal rounded-full flex-shrink-0" />
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                deleteNotification(notification.id)
                              }}
                              className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500">{formatTimeAgo(notification.created_at)}</span>
                          {notification.metadata?.user_name && (
                            <div className="flex items-center space-x-1">
                              {notification.metadata.avatar_url && (
                                <div className="relative h-4 w-4">
                                  <Image
                                    src={notification.metadata.avatar_url || "/placeholder.svg"}
                                    alt={notification.metadata.user_name}
                                    fill
                                    className="rounded-full object-cover"
                                  />
                                </div>
                              )}
                              <span className="text-xs text-gray-500">{notification.metadata.user_name}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </ScrollArea>

        {notifications.length > 0 && (
          <div className="p-3 border-t border-emphasis-light-blue/20">
            <Link
              href="/notifications"
              className="text-sm text-emphasis-teal hover:text-emphasis-navy block text-center"
              onClick={() => setIsOpen(false)}
            >
              View all notifications
            </Link>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
