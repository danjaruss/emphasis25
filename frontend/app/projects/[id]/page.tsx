"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { notFound } from "next/navigation"
import { useAuth } from "@/components/auth/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CollaborationPanel } from "@/components/collaboration/collaboration-panel"
import {
  ArrowLeft,
  Edit,
  Users,
  Calendar,
  DollarSign,
  Target,
  MapPin,
  AlertTriangle,
  TrendingUp,
  Camera,
  BarChart3,
} from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow, format } from "date-fns"
import { apiClient } from "@/lib/api"

interface Project {
  id: number
  name: string
  description: string
  project_type: string
  priority: string
  location: string
  geographic_scope: string
  created_at: string
  created_by: {
    id: number
    first_name: string
    last_name: string
    email: string
  }
  client: {
    id: number
    name: string
  }
  sdgs?: Array<{
    id: number
    number: number
    title: string
    color: string
  }>
  sdg_targets?: Array<{
    id: number
    target_number: string
    title: string
  }>
  timeline?: {
    id: number
    start_date: string
    end_date: string
    total_budget: number
  }
  milestones?: Array<{
    id: number
    title: string
    description: string
    due_date: string
    completed: boolean
  }>
  objectives?: Array<{
    id: number
    text: string
  }>
  funding_sources?: Array<{
    id: number
    source: {
      id: number
      label: string
    }
  }>
}

interface Collaborator {
  id: number
  role: string
  added_at: string
  user: {
    id: number
    first_name: string
    last_name: string
    email: string
  }
}

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user, loading } = useAuth()
  const [project, setProject] = useState<Project | null>(null)
  const [collaborators, setCollaborators] = useState<Collaborator[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  const projectId = params.id as string

  // Handle special routes that aren't project IDs
  useEffect(() => {
    if (projectId === "templates" || projectId === "new") {
      // These are handled by their own pages, redirect if somehow reached here
      if (projectId === "templates") {
        router.replace("/projects/templates")
        return
      }
      if (projectId === "new") {
        router.replace("/projects/new")
        return
      }
    }
  }, [projectId, router])

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth")
    }
  }, [user, loading, router])

  useEffect(() => {
    // Only load project if it's not a special route
    if (user && projectId && projectId !== "templates" && projectId !== "new") {
      loadProject()
      loadCollaborators()
    }
  }, [user, projectId])

  const loadProject = async () => {
    try {
      // Skip loading for special routes
      if (projectId === "templates" || projectId === "new") {
        return
      }

      // Check if the projectId is a valid number
      if (isNaN(Number(projectId))) {
        console.log("Invalid project ID format:", projectId)
        notFound()
        return
      }

      setIsLoading(true)

      const projectData = await apiClient.getProject(projectId)
      setProject(projectData)
    } catch (error) {
      console.error("Error loading project:", error)
      // For any other errors, show 404
      notFound()
    } finally {
      setIsLoading(false)
    }
  }

  const loadCollaborators = async () => {
    try {
      // Only load collaborators if we have a valid project ID
      if (isNaN(Number(projectId))) {
        return
      }

      // For now, set empty collaborators since we don't have this endpoint yet
      setCollaborators([])
    } catch (error) {
      console.error("Error loading collaborators:", error)
      // Don't fail the whole page if collaborators can't be loaded
    }
  }

  const getProjectTypeColor = (projectType: string) => {
    switch (projectType) {
      case "energy":
        return "bg-blue-100 text-blue-800"
      case "water":
        return "bg-cyan-100 text-cyan-800"
      case "waste":
        return "bg-green-100 text-green-800"
      case "agriculture":
        return "bg-yellow-100 text-yellow-800"
      case "tourism":
        return "bg-purple-100 text-purple-800"
      case "infrastructure":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-100 text-red-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const calculateProgress = () => {
    if (!project) return 0
    let completedFields = 0
    const totalFields = 6

    if (project.name) completedFields++
    if (project.description) completedFields++
    if (project.sdgs?.length > 0) completedFields++
    if (project.location) completedFields++
    if (project.geographic_scope) completedFields++
    if (project.project_type) completedFields++

    return Math.round((completedFields / totalFields) * 100)
  }

  // Show loading state
  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading project...</p>
        </div>
      </div>
    )
  }

  // Redirect to auth if not authenticated
  if (!user) {
    router.push("/auth")
    return null
  }

  // Handle special routes that aren't project IDs
  if (projectId === "templates" || projectId === "new") {
    return null // Let Next.js handle the redirect
  }

  // If no project is loaded and we're not loading, the notFound() should have been called
  if (!project) {
    return null
  }

  const data = project.data || {}
  const progress = calculateProgress()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/projects">
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Projects
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
                <p className="text-sm text-gray-600">
                  Created by {project.created_by?.first_name && project.created_by?.last_name
                    ? `${project.created_by.first_name} ${project.created_by.last_name}`
                    : project.created_by?.email || "Unknown"} •{" "}
                  {formatDistanceToNow(new Date(project.created_at), { addSuffix: true })}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className={getProjectTypeColor(project.project_type)}>{project.project_type}</Badge>
              <Badge className={getPriorityColor(project.priority)} variant="outline">
                {project.priority} Priority
              </Badge>
              <Link href={`/projects/${project.id}/analytics`}>
                <Button size="sm" variant="outline" className="bg-white hover:bg-gray-50">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Analytics
                </Button>
              </Link>
              <Link href={`/projects/${project.id}/progress`}>
                <Button size="sm" variant="outline" className="bg-white hover:bg-gray-50">
                  <Camera className="h-4 w-4 mr-2" />
                  Progress Report
                </Button>
              </Link>
              <Link href={`/projects/${project.id}/edit`}>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Project
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details">Project Details</TabsTrigger>
            <TabsTrigger value="collaborators">Collaborators</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Progress</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{progress}%</div>
                  <Progress value={progress} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Collaborators</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{collaborators.length}</div>
                  <p className="text-xs text-muted-foreground">Active team members</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Budget</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {project.timeline?.total_budget ? `$${Number(project.timeline.total_budget).toLocaleString()}` : "Not set"}
                  </div>
                  <p className="text-xs text-muted-foreground">Total allocated</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">SDG Goals</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{project.sdgs?.length || 0}</div>
                  <p className="text-xs text-muted-foreground">Goals addressed</p>
                </CardContent>
              </Card>
            </div>

            {/* Project Description */}
            <Card>
              <CardHeader>
                <CardTitle>Project Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{project.description}</p>
              </CardContent>
            </Card>

            {/* Quick Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {project.timeline?.start_date && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Start Date:</span>
                      <span className="text-sm font-medium">{format(new Date(project.timeline.start_date), "MMM dd, yyyy")}</span>
                    </div>
                  )}
                  {project.timeline?.end_date && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">End Date:</span>
                      <span className="text-sm font-medium">{format(new Date(project.timeline.end_date), "MMM dd, yyyy")}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Created:</span>
                    <span className="text-sm font-medium">
                      {formatDistanceToNow(new Date(project.created_at), { addSuffix: true })}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    Location & Scope
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {project.location && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Location:</span>
                      <span className="text-sm font-medium">{project.location}</span>
                    </div>
                  )}
                  {project.geographic_scope && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Scope:</span>
                      <span className="text-sm font-medium">{project.geographic_scope}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="details" className="space-y-6">
            {/* SDG Goals */}
            {project.sdgs && project.sdgs.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>SDG Alignment</CardTitle>
                  <CardDescription>UN Sustainable Development Goals addressed by this project</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {project.sdgs.map((sdg) => (
                      <Badge key={sdg.id} variant="secondary" style={{ backgroundColor: sdg.color + '20', color: sdg.color }}>
                        SDG {sdg.number} - {sdg.title}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Objectives */}
            {project.objectives && project.objectives.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Project Objectives</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {project.objectives.map((objective, index) => (
                      <li key={objective.id} className="flex items-start">
                        <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                          {index + 1}
                        </span>
                        <span>{objective.text}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Funding Sources */}
            {project.funding_sources && project.funding_sources.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Funding Sources</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {project.funding_sources.map((funding) => (
                      <li key={funding.id} className="flex items-center">
                        <DollarSign className="h-4 w-4 text-green-600 mr-2" />
                        <span>{funding.source.label}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="collaborators" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Team</CardTitle>
                <CardDescription>People working on this project</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Project Owner */}
                  <div className="flex items-center justify-between p-4 border rounded-lg bg-blue-50">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                        {project.created_by?.first_name?.charAt(0) || project.created_by?.email?.charAt(0) || "?"}
                      </div>
                      <div>
                        <p className="font-medium">
                          {project.created_by?.first_name && project.created_by?.last_name
                            ? `${project.created_by.first_name} ${project.created_by.last_name}`
                            : project.created_by?.email || "Unknown"}
                        </p>
                        <p className="text-sm text-gray-600">Project Owner</p>
                      </div>
                    </div>
                    <Badge>Owner</Badge>
                  </div>

                  {/* Collaborators */}
                  {collaborators.map((collaborator) => (
                    <div key={collaborator.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center text-white font-medium">
                          {collaborator.user?.first_name?.charAt(0) || collaborator.user?.email?.charAt(0) || "?"}
                        </div>
                        <div>
                          <p className="font-medium">
                            {collaborator.user?.first_name && collaborator.user?.last_name
                              ? `${collaborator.user.first_name} ${collaborator.user.last_name}`
                              : collaborator.user?.email || "Unknown"}
                          </p>
                          <p className="text-sm text-gray-600">{collaborator.user?.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{collaborator.role}</Badge>
                        <span className="text-xs text-gray-500">
                          Added {formatDistanceToNow(new Date(collaborator.added_at), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  ))}

                  {collaborators.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No collaborators added yet</p>
                      <p className="text-sm">Invite team members to collaborate on this project</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Milestones</CardTitle>
                <CardDescription>Key milestones and deadlines</CardDescription>
              </CardHeader>
              <CardContent>
                {project.milestones && project.milestones.length > 0 ? (
                  <div className="space-y-4">
                    {project.milestones.map((milestone, index) => (
                      <div key={milestone.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{milestone.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{milestone.description}</p>
                          {milestone.due_date && (
                            <p className="text-sm text-gray-500 mt-2">
                              Target: {format(new Date(milestone.due_date), "MMM dd, yyyy")}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No milestones defined yet</p>
                    <p className="text-sm">Add milestones to track project progress</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Collaboration Panel */}
      <CollaborationPanel projectId={projectId} currentSection={activeTab} />
    </div>
  )
}
