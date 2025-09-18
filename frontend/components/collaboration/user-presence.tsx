import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import type { CollaborationUser } from "@/hooks/use-collaboration"
import { formatDistanceToNow } from "date-fns"

interface UserPresenceProps {
  users: CollaborationUser[]
  maxDisplayed?: number
}

export function UserPresence({ users, maxDisplayed = 5 }: UserPresenceProps) {
  const displayedUsers = users.slice(0, maxDisplayed)
  const remainingCount = Math.max(0, users.length - maxDisplayed)

  if (users.length === 0) {
    return null
  }

  return (
    <div className="flex items-center space-x-1">
      <div className="flex -space-x-2">
        <TooltipProvider>
          {displayedUsers.map((user) => (
            <Tooltip key={user.id}>
              <TooltipTrigger asChild>
                <Avatar className="h-8 w-8 border-2 border-white">
                  <AvatarImage src={user.avatar_url || undefined} alt={user.full_name} />
                  <AvatarFallback>
                    {user.full_name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-sm">
                  <p className="font-medium">{user.full_name}</p>
                  <p className="text-xs text-gray-500">
                    {user.current_section ? `Viewing: ${user.current_section}` : "Browsing"}
                  </p>
                  <p className="text-xs text-gray-500">
                    Last active: {formatDistanceToNow(new Date(user.last_seen), { addSuffix: true })}
                  </p>
                </div>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>

        {remainingCount > 0 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Avatar className="h-8 w-8 border-2 border-white bg-gray-200">
                <AvatarFallback>+{remainingCount}</AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-sm">{remainingCount} more collaborators</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
      <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 hover:bg-green-50">
        {users.length} {users.length === 1 ? "collaborator" : "collaborators"} online
      </Badge>
    </div>
  )
}
