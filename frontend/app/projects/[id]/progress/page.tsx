"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/auth-provider"
import ProgressReporting from "@/components/project/progress-reporting"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { apiClient } from "@/lib/api"

interface Project {
  id: string
  name: string
  description: string
  status: string
  data: any
}

export default function ProjectProgressPage() {
  const params = useParams()
  const router = useRouter()
  const { user, loading } = useAuth()
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
      router.push("/projects")
    } finally {
      setIsLoading(false)
    }
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
            The project you're looking for doesn't exist or you don't have access to it.
          </p>
          <Link href="/projects">
            <Button className="mt-4">Back to Projects</Button>
          </Link>
        </div>
      </div>
    )
  }

  // Extract milestones from project data
  const milestones = project.data?.milestones || []

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Link href={`/projects/${project.id}`}>
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Project
              </Button>
            </Link>
            <div className="ml-4">
              <h1 className="text-xl font-semibold text-gray-900">{project.name}</h1>
              <p className="text-sm text-gray-600">Progress Reporting</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProgressReporting projectId={project.id} projectName={project.name} milestones={milestones} />
      </div>
    </div>
  )
}
