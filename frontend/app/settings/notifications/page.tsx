"use client"

import { NotificationPreferences } from "@/components/settings/notification-preferences"

export default function NotificationSettingsPage() {
  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-emphasis-navy">Notification Settings</h1>
        <p className="text-emphasis-teal mt-2">
          Manage how you receive updates about your projects and team activities.
        </p>
      </div>

      <NotificationPreferences />
    </div>
  )
}
