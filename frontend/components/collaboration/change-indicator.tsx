"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { formatDistanceToNow } from "date-fns"
import { Clock, User } from "lucide-react"

interface ChangeIndicatorProps {
  fieldName: string
  projectId: string
}

export function ChangeIndicator({ fieldName, projectId }: ChangeIndicatorProps) {
  const [lastChange, setLastChange] = useState<{
    user: string
    timestamp: string
  } | null>(null)

  useEffect(() => {
    // In a real app, this would fetch the last change for this field from the database
    // For demo purposes, we'll simulate this with random data
    const simulateLastChange = () => {
      const users = ["John Doe", "Jane Smith", "Alex Johnson"]
      const randomUser = users[Math.floor(Math.random() * users.length)]
      const randomTime = new Date(Date.now() - Math.floor(Math.random() * 86400000)) // Random time in the last 24 hours

      setLastChange({
        user: randomUser,
        timestamp: randomTime.toISOString(),
      })
    }

    simulateLastChange()
  }, [fieldName, projectId])

  if (!lastChange) return null

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="outline" className="ml-2 text-xs cursor-help">
            <Clock className="h-3 w-3 mr-1" />
            Updated
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-sm">
            <div className="flex items-center">
              <User className="h-3 w-3 mr-1" />
              <span>{lastChange.user}</span>
            </div>
            <div className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(lastChange.timestamp), { addSuffix: true })}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
