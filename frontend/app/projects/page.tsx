"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth/auth-provider"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Filter, Users, Calendar, DollarSign, Target } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
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
}

export default function ProjectsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("updated_at")

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      loadProjects()
    }
  }, [user])

  useEffect(() => {
    filterAndSortProjects()
  }, [projects, searchTerm, statusFilter, sortBy])

  const loadProjects = async () => {
    try {
      setIsLoading(true)

      // Get projects for the current user's client
      const projectsData = await apiClient.getProjects()
      console.log("Projects data received:", projectsData)
      console.log("Projects data type:", typeof projectsData)
      console.log("Is array:", Array.isArray(projectsData))
      
      // Check if it's a paginated response
      let projectsArray = []
      if (Array.isArray(projectsData)) {
        projectsArray = projectsData
      } else if (projectsData && typeof projectsData === 'object') {
        // Check if it's a paginated response
        if (projectsData.results && Array.isArray(projectsData.results)) {
          projectsArray = projectsData.results
        } else if (projectsData.data && Array.isArray(projectsData.data)) {
          projectsArray = projectsData.data
        } else {
          console.log("Unexpected data structure:", projectsData)
          projectsArray = []
        }
      }
      
      console.log("Final projects array:", projectsArray)
      setProjects(projectsArray)
    } catch (error) {
      console.error("Error loading projects:", error)
      setProjects([])
    } finally {
      setIsLoading(false)
    }
  }

  const filterAndSortProjects = () => {
    // Ensure projects is an array
    if (!Array.isArray(projects)) {
      setFilteredProjects([])
      return
    }

    let filtered = [...projects] // Create a copy to avoid mutating the original

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (project) =>
          project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply priority filter (using priority instead of status)
    if (statusFilter !== "all") {
      filtered = filtered.filter((project) => project.priority === statusFilter)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "created_at":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case "updated_at":
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
    })

    setFilteredProjects(filtered)
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

  const calculateProgress = (project: Project) => {
    // Simple progress calculation based on project fields
    let completedFields = 0
    const totalFields = 6 // Number of key fields

    if (project.name) completedFields++
    if (project.description) completedFields++
    if (project.sdgs?.length > 0) completedFields++
    if (project.location) completedFields++
    if (project.geographic_scope) completedFields++
    if (project.project_type) completedFields++

    return Math.round((completedFields / totalFields) * 100)
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brand-off-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-brand-navy">Projects</h1>
              <p className="text-sm text-brand-teal">Manage your SDG projects and track progress</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="outline" size="sm" className="border-brand-teal text-brand-teal hover:bg-brand-mint">
                  Dashboard
                </Button>
              </Link>
              <Link href="/projects/templates">
                <Button variant="outline" size="sm" className="border-brand-teal text-brand-teal hover:bg-brand-mint">
                  <Target className="h-4 w-4 mr-2" />
                  Browse Templates
                </Button>
              </Link>
              <Link href="/projects/new">
                <Button size="sm" className="bg-brand-navy hover:bg-brand-teal">
                  <Plus className="h-4 w-4 mr-2" />
                  New Project
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created_at">Date Created</SelectItem>
                <SelectItem value="name">Name</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Projects Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-2 bg-gray-200 rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 text-gray-400">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No projects found</h3>
            <p className="mt-2 text-gray-500">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filters"
                : "Get started by creating your first SDG project"}
            </p>
            {!searchTerm && statusFilter === "all" && (
              <Link href="/projects/new">
                <Button className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Project
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => {
              const progress = calculateProgress(project)

              return (
                <Card key={project.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg line-clamp-2">{project.name}</CardTitle>
                      <div className="flex flex-col gap-1">
                        <Badge className={getPriorityColor(project.priority)}>{project.priority}</Badge>
                        <Badge className={getProjectTypeColor(project.project_type)} variant="outline">
                          {project.project_type}
                        </Badge>
                      </div>
                    </div>
                    <CardDescription className="line-clamp-2">{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Progress */}
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Completion</span>
                        <span>{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>

                    {/* Project Stats */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                        <span>{formatDistanceToNow(new Date(project.created_at), { addSuffix: true })}</span>
                      </div>
                      <div className="flex items-center">
                        <Target className="h-4 w-4 mr-1 text-gray-400" />
                        <span>{project.location}</span>
                      </div>
                    </div>

                    {/* SDGs */}
                    {project.sdgs && project.sdgs.length > 0 && (
                      <div>
                        <span className="text-sm text-gray-600">SDGs:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {project.sdgs.slice(0, 3).map((sdg) => (
                            <Badge key={sdg.id} variant="secondary" className="text-xs" style={{ backgroundColor: sdg.color + '20', color: sdg.color }}>
                              SDG {sdg.number}
                            </Badge>
                          ))}
                          {project.sdgs.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{project.sdgs.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex justify-between items-center pt-2">
                      <div className="flex items-center text-xs text-gray-500">
                        <span>by {project.created_by?.first_name && project.created_by?.last_name
                          ? `${project.created_by.first_name} ${project.created_by.last_name}`
                          : project.created_by?.email || "Unknown"}</span>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/projects/${project.id}`}>
                          <Button size="sm" variant="outline">
                            View
                          </Button>
                        </Link>
                        <Link href={`/projects/${project.id}/edit`}>
                          <Button size="sm">Edit</Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
