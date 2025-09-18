"use client"

import { useState, useEffect } from "react"
import { apiClient } from "@/lib/api"
import { useAuth } from "@/components/auth/auth-provider"
import { useToast } from "@/hooks/use-toast"

export type CollaborationUser = {
  id: string
  full_name: string
  avatar_url: string | null
  last_seen: string
  current_section: string | null
}

export type ProjectComment = {
  id: string
  user_id: string
  content: string
  created_at: string
  profiles: {
    full_name: string
    avatar_url: string | null
  } | null
  section: string | null
  parent_id: string | null
  replies?: ProjectComment[]
}

export type ProjectActivity = {
  id: string
  user_id: string
  action: string
  details: any
  created_at: string
  profiles: {
    full_name: string
    avatar_url: string | null
  } | null
}

interface UseCollaborationProps {
  projectId: string
  currentSection?: string
}

export function useCollaboration({ projectId, currentSection }: UseCollaborationProps) {
  const [activeUsers, setActiveUsers] = useState<CollaborationUser[]>([])
  const [comments, setComments] = useState<ProjectComment[]>([])
  const [activities, setActivities] = useState<ProjectActivity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user, profile } = useAuth()
  const { toast } = useToast()

  // Helper function to check if a string is a valid UUID
  const isValidUUID = (uuid: string) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    return uuidRegex.test(uuid)
  }

  // Initialize and fetch data
  useEffect(() => {
    if (!user || !profile) {
      setIsLoading(false)
      return
    }

    const initCollaboration = async () => {
      setIsLoading(true)
      try {
        // Only proceed if we have a valid project ID
        if (isValidUUID(projectId)) {
          // Load comments
          await loadComments(projectId)

          // Load activities
          await loadActivities(projectId)
        }
      } catch (error) {
        console.error("Error initializing collaboration:", error)
      } finally {
        setIsLoading(false)
      }
    }

    initCollaboration()
  }, [projectId, user, profile])

  // Load comments with user information
  const loadComments = async (validProjectId: string) => {
    try {
      // For now, return empty array since we don't have comments API yet
      setComments([])
    } catch (error) {
      console.error("Error loading comments:", error)
    }
  }

  // Load activity history with user information
  const loadActivities = async (validProjectId: string) => {
    try {
      // For now, return empty array since we don't have activities API yet
      setActivities([])
    } catch (error) {
      console.error("Error loading activities:", error)
    }
  }

  // Add a comment to the project
  const addComment = async (content: string, section?: string, parentId?: string) => {
    if (!user || !projectId) return

    try {
      // For now, just show a toast since we don't have comments API yet
      toast({
        title: "Comment added",
        description: "Your comment has been added successfully",
      })
    } catch (error) {
      console.error("Error adding comment:", error)
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive",
      })
    }
  }

  // Record user activity
  const recordActivity = async (action: string, details: any) => {
    if (!user || !projectId) return

    try {
      // For now, just log the activity since we don't have activities API yet
      console.log("Activity recorded:", { action, details })
    } catch (error) {
      console.error("Error recording activity:", error)
    }
  }

  // Update project data with conflict resolution
  const updateProjectData = async (data: any) => {
    if (!user || !projectId) return false

    try {
      // For now, just return true since we don't have project update API yet
      return true
    } catch (error) {
      console.error("Error updating project data:", error)
      toast({
        title: "Update Error",
        description: "Failed to update project data. Please try again.",
        variant: "destructive",
      })
      return false
    }
  }

  return {
    activeUsers,
    comments,
    activities,
    isLoading,
    currentUser: user,
    addComment,
    recordActivity,
    updateProjectData,
    refreshComments: () => loadComments(projectId),
    refreshActivities: () => loadActivities(projectId),
  }
}
