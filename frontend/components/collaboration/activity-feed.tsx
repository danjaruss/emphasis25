import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ProjectActivity } from "@/hooks/use-collaboration"
import { formatDistanceToNow } from "date-fns"
import { Activity } from "lucide-react"

interface ActivityFeedProps {
  activities: ProjectActivity[]
  isLoading?: boolean
}

export function ActivityFeed({ activities, isLoading = false }: ActivityFeedProps) {
  // Function to render activity details based on action type
  const renderActivityDetails = (activity: ProjectActivity) => {
    switch (activity.action) {
      case "project_created":
        return "created this project"
      case "project_updated":
        return `updated ${
          activity.details.fields_updated ? activity.details.fields_updated.join(", ") : "project details"
        }`
      case "comment_added":
        return `commented: "${activity.details.content.substring(0, 50)}${
          activity.details.content.length > 50 ? "..." : ""
        }"`
      case "stakeholder_added":
        return `added ${activity.details.stakeholder_name} as a stakeholder`
      case "milestone_added":
        return `added milestone: ${activity.details.milestone_name}`
      case "collaborator_added":
        return `added ${activity.details.collaborator_name} as a collaborator`
      default:
        return "performed an action"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Activity className="h-5 w-5 mr-2" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-4 text-center text-sm text-gray-500">Loading activity...</div>
        ) : activities.length === 0 ? (
          <div className="py-4 text-center text-sm text-gray-500">No recent activity</div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={activity.user?.avatar_url || undefined} />
                  <AvatarFallback>
                    {activity.user?.full_name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{activity.user?.full_name}</span>
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm">{renderActivityDetails(activity)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
