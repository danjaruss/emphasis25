"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/auth-provider"
import ProjectForm from "@/components/project-form"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/api"

interface Project {
  id: string
  name: string
  description: string
  status: string
  created_at: string
  updated_at: string
  data: any
  created_by: string
}

export default function EditProjectPage() {
  const params = useParams()
  const router = useRouter()
  const { user, loading } = useAuth()
  const { toast } = useToast()
  const [project, setProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const projectId = params.id as string

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user && projectId) {
      loadProject()
    }
  }, [user, projectId])

  const loadProject = async () => {
    try {
      setIsLoading(true)

      const { data, error } = await apiClient.get(`/projects/${projectId}/`)

      if (error) throw error
      setProject(data)
    } catch (error) {
      console.error("Error loading project:", error)
      toast({
        title: "Error",
        description: "Failed to load project for editing",
        variant: "destructive",
      })
      router.push("/projects")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (formData: any) => {
    if (!user || !project) {
      toast({
        title: "Error",
        description: "Unable to update project",
        variant: "destructive",
      })
      return
    }

    try {
      // Update the project in the database
      const { data, error } = await apiClient.put(`/projects/${projectId}/`, formData)

      if (error) throw error

      // Record project update activity
      await apiClient.post(`/project_activity/`, {
        project_id: projectId,
        user_id: user.id,
        action: "project_updated",
        details: {
          name: formData.name,
          fields_updated: ["project_data"],
        },
      })

      toast({
        title: "Project Updated",
        description: "Your SDG project has been updated successfully!",
      })

      router.push(`/projects/${projectId}`)
    } catch (error) {
      console.error("Error updating project:", error)
      toast({
        title: "Error",
        description: "Failed to update project. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleCancel = () => {
    router.push(`/projects/${projectId}`)
  }

  if (loading || isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading project...</p>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Project not found</h2>
          <p className="mt-2 text-gray-600">
            The project you're trying to edit doesn't exist or you don't have access to it.
          </p>
          <button onClick={() => router.push("/projects")} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
            Back to Projects
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ProjectForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        initialData={project.data}
        isEditing={true}
        projectId={projectId}
      />
    </div>
  )
}
