"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Mail, Bell, Clock, Calendar, Save, TestTube } from "lucide-react"
import {
  type EmailPreferences,
  type EmailFrequency,
  defaultEmailPreferences,
  generateEmailTemplate,
  sendEmail,
} from "@/lib/email-notifications"
import { useToast } from "@/hooks/use-toast"
import { useNotifications } from "@/hooks/use-notifications"

const frequencyOptions: { value: EmailFrequency; label: string; description: string }[] = [
  { value: "immediate", label: "Immediate", description: "Send email right away" },
  { value: "daily", label: "Daily Digest", description: "Once per day summary" },
  { value: "weekly", label: "Weekly Digest", description: "Once per week summary" },
  { value: "never", label: "Never", description: "No email notifications" },
]

const notificationTypes = [
  {
    key: "project_updates" as const,
    label: "Project Updates",
    description: "When projects are modified or updated",
    icon: "📋",
  },
  {
    key: "comments" as const,
    label: "Comments",
    description: "New comments on your projects",
    icon: "💬",
  },
  {
    key: "milestones" as const,
    label: "Milestones",
    description: "When project milestones are completed",
    icon: "🎯",
  },
  {
    key: "collaboration" as const,
    label: "Team Activity",
    description: "Team member joins, leaves, or role changes",
    icon: "👥",
  },
  {
    key: "system" as const,
    label: "System Updates",
    description: "Platform updates and announcements",
    icon: "⚙️",
  },
]

const timeOptions = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, "0")
  return { value: `${hour}:00`, label: `${hour}:00` }
})

const dayOptions = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
]

export function NotificationPreferences() {
  const [preferences, setPreferences] = useState<EmailPreferences>(defaultEmailPreferences)
  const [isLoading, setIsLoading] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const { toast } = useToast()
  const { notifications } = useNotifications()

  const updatePreference = (key: keyof EmailPreferences, value: any) => {
    setPreferences((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // In a real app, save to database
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Preferences saved",
        description: "Your email notification preferences have been updated.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save preferences. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const sendTestEmail = async () => {
    setIsTesting(true)
    try {
      // Create a test notification
      const testNotifications = notifications.slice(0, 3)
      if (testNotifications.length === 0) {
        toast({
          title: "No notifications",
          description: "No notifications available to test with.",
          variant: "destructive",
        })
        return
      }

      const template = generateEmailTemplate(testNotifications, "user@example.com", "daily")
      await sendEmail("user@example.com", template)

      toast({
        title: "Test email sent",
        description: "Check the console to see the email template that would be sent.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send test email.",
        variant: "destructive",
      })
    } finally {
      setIsTesting(false)
    }
  }

  const hasImmediateNotifications = Object.values(preferences).some(
    (value, index) => index < 5 && value === "immediate",
  )

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mail className="h-5 w-5 text-emphasis-teal" />
            <span>Email Notification Preferences</span>
          </CardTitle>
          <CardDescription>
            Choose how and when you want to receive email notifications about your projects.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Notification Type Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-emphasis-navy">Notification Types</h3>
            <div className="grid gap-4">
              {notificationTypes.map((type) => (
                <div
                  key={type.key}
                  className="flex items-center justify-between p-4 border border-emphasis-light-blue/20 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{type.icon}</span>
                    <div>
                      <Label className="text-sm font-medium text-emphasis-navy">{type.label}</Label>
                      <p className="text-sm text-emphasis-teal">{type.description}</p>
                    </div>
                  </div>
                  <Select
                    value={preferences[type.key]}
                    onValueChange={(value: EmailFrequency) => updatePreference(type.key, value)}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {frequencyOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div>
                            <div className="font-medium">{option.label}</div>
                            <div className="text-xs text-gray-500">{option.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Digest Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-emphasis-navy flex items-center space-x-2">
              <Clock className="h-5 w-5 text-emphasis-teal" />
              <span>Digest Settings</span>
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Daily Digest Time</Label>
                <Select
                  value={preferences.digest_time}
                  onValueChange={(value) => updatePreference("digest_time", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-emphasis-teal">When to send daily digest emails</p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Weekly Digest Day</Label>
                <Select
                  value={preferences.digest_day.toString()}
                  onValueChange={(value) => updatePreference("digest_day", Number.parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {dayOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value.toString()}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-emphasis-teal">Which day to send weekly digest emails</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Status and Actions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-emphasis-navy">Current Status</h3>
                <div className="flex items-center space-x-2 mt-2">
                  {hasImmediateNotifications && (
                    <Badge variant="secondary" className="bg-emphasis-mint text-emphasis-navy">
                      <Bell className="h-3 w-3 mr-1" />
                      Immediate alerts enabled
                    </Badge>
                  )}
                  <Badge variant="outline" className="border-emphasis-light-blue text-emphasis-teal">
                    <Calendar className="h-3 w-3 mr-1" />
                    Digest at {preferences.digest_time}
                  </Badge>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={sendTestEmail}
                  disabled={isTesting}
                  className="border-emphasis-light-blue text-emphasis-teal hover:bg-emphasis-mint/50"
                >
                  <TestTube className="h-4 w-4 mr-2" />
                  {isTesting ? "Sending..." : "Test Email"}
                </Button>

                <Button onClick={handleSave} disabled={isLoading} className="bg-emphasis-teal hover:bg-emphasis-navy">
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? "Saving..." : "Save Preferences"}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Email Preview Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-emphasis-navy">Email Preview</CardTitle>
          <CardDescription>This is how your email notifications will look</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border border-emphasis-light-blue/20 rounded-lg p-4 bg-emphasis-off-white">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-emphasis-navy rounded-full flex items-center justify-center text-white text-sm font-bold">
                PE
              </div>
              <div>
                <div className="font-medium text-emphasis-navy">project EMPHASIS</div>
                <div className="text-xs text-emphasis-teal">SUSTAINABLE ISLAND STATE SOLUTIONS</div>
              </div>
            </div>
            <div className="text-sm text-emphasis-teal mb-2">
              Subject: [Project EMPHASIS] Your daily project summary
            </div>
            <div className="text-sm text-gray-600">
              You have 3 updates across 2 categories including project updates and new comments...
            </div>
            <Button variant="link" className="text-xs text-emphasis-teal p-0 h-auto mt-2" onClick={sendTestEmail}>
              Send test email to see full preview
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
