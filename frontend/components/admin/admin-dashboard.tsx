"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Users,
  FolderOpen,
  Activity,
  Globe,
  Search,
  Download,
  Eye,
  Edit,
  Trash2,
  Shield,
  Building,
  MapPin,
  DollarSign,
  BarChart3,
} from "lucide-react"

// Mock data for demonstration
const mockUsers = [
  {
    id: "1",
    full_name: "Dr. Sarah Johnson",
    email: "sarah.johnson@gov.fj",
    organization_type: "government",
    organization_name: "Ministry of Environment, Fiji",
    country: "Fiji",
    job_title: "Director of Climate Adaptation",
    created_at: "2024-01-15T10:30:00Z",
    last_login: "2024-01-20T14:22:00Z",
    status: "active",
    projects_count: 5,
    focus_areas: ["Climate Change Adaptation", "Marine Conservation"],
  },
  {
    id: "2",
    full_name: "Marcus Williams",
    email: "m.williams@caribbeanngo.org",
    organization_type: "ngo",
    organization_name: "Caribbean Environmental Alliance",
    country: "Barbados",
    job_title: "Program Manager",
    created_at: "2024-01-10T09:15:00Z",
    last_login: "2024-01-19T16:45:00Z",
    status: "active",
    projects_count: 3,
    focus_areas: ["Renewable Energy", "Sustainable Tourism"],
  },
  {
    id: "3",
    full_name: "Dr. Amelia Chen",
    email: "a.chen@pacific-research.edu",
    organization_type: "academic",
    organization_name: "Pacific Island Research Institute",
    country: "Samoa",
    job_title: "Research Director",
    created_at: "2024-01-08T11:20:00Z",
    last_login: "2024-01-18T13:30:00Z",
    status: "pending",
    projects_count: 1,
    focus_areas: ["Biodiversity Conservation", "Water Management"],
  },
]

const mockProjects = [
  {
    id: "1",
    name: "Coral Reef Restoration Initiative",
    description: "Large-scale coral restoration project",
    status: "active",
    created_by: "Dr. Sarah Johnson",
    country: "Fiji",
    budget: 750000,
    start_date: "2024-02-01",
    end_date: "2025-01-31",
    sdg_goals: [14, 15],
    risk_level: "medium",
    progress: 35,
  },
  {
    id: "2",
    name: "Solar Energy Transition Program",
    description: "Community solar panel installation",
    status: "active",
    created_by: "Marcus Williams",
    country: "Barbados",
    budget: 500000,
    start_date: "2024-01-15",
    end_date: "2024-12-15",
    sdg_goals: [7, 13],
    risk_level: "low",
    progress: 60,
  },
]

const mockSystemStats = {
  totalUsers: 156,
  activeUsers: 142,
  pendingUsers: 14,
  totalProjects: 89,
  activeProjects: 67,
  completedProjects: 22,
  totalBudget: 12500000,
  countriesRepresented: 23,
  organizationTypes: {
    government: 45,
    ngo: 38,
    academic: 28,
    private: 25,
    international: 15,
    community: 5,
  },
}

export function AdminDashboard() {
  const [users, setUsers] = useState(mockUsers)
  const [projects, setProjects] = useState(mockProjects)
  const [stats, setStats] = useState(mockSystemStats)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterCountry, setFilterCountry] = useState("all")

  const getOrgTypeIcon = (type: string) => {
    switch (type) {
      case "government":
        return <Shield className="h-4 w-4" />
      case "ngo":
        return <Users className="h-4 w-4" />
      case "academic":
        return <Users className="h-4 w-4" />
      case "private":
        return <Building className="h-4 w-4" />
      default:
        return <Users className="h-4 w-4" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "suspended":
        return <Badge className="bg-red-100 text-red-800">Suspended</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getRiskBadge = (level: string) => {
    switch (level) {
      case "low":
        return <Badge className="bg-green-100 text-green-800">Low Risk</Badge>
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800">Medium Risk</Badge>
      case "high":
        return <Badge className="bg-red-100 text-red-800">High Risk</Badge>
      default:
        return <Badge variant="secondary">{level}</Badge>
    }
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.organization_name?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || user.status === filterStatus
    const matchesCountry = filterCountry === "all" || user.country === filterCountry

    return matchesSearch && matchesStatus && matchesCountry
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-emphasis-navy">Admin Dashboard</h1>
          <p className="text-gray-600">Monitor and manage all system activity</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button size="sm" className="bg-emphasis-teal hover:bg-emphasis-navy">
            <Activity className="h-4 w-4 mr-2" />
            System Health
          </Button>
        </div>
      </div>

      {/* System Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeProjects}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+5</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(stats.totalBudget / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+8.2%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Countries</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.countriesRepresented}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+2</span> new countries
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="projects">Project Oversight</TabsTrigger>
          <TabsTrigger value="analytics">System Analytics</TabsTrigger>
          <TabsTrigger value="activity">Activity Log</TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Monitor and manage all registered users</CardDescription>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterCountry} onValueChange={setFilterCountry}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Countries</SelectItem>
                    <SelectItem value="Fiji">Fiji</SelectItem>
                    <SelectItem value="Barbados">Barbados</SelectItem>
                    <SelectItem value="Samoa">Samoa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarFallback>
                          {user.full_name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold">{user.full_name}</h4>
                          {getOrgTypeIcon(user.organization_type)}
                          {getStatusBadge(user.status)}
                        </div>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                          <span className="flex items-center">
                            <Building className="h-3 w-3 mr-1" />
                            {user.organization_name}
                          </span>
                          <span className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {user.country}
                          </span>
                          <span className="flex items-center">
                            <FolderOpen className="h-3 w-3 mr-1" />
                            {user.projects_count} projects
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Projects Tab */}
        <TabsContent value="projects" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Oversight</CardTitle>
              <CardDescription>Monitor all projects across the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockProjects.map((project) => (
                  <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold">{project.name}</h4>
                        {getRiskBadge(project.risk_level)}
                        <Badge variant="outline">{project.status}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{project.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span className="flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          {project.created_by}
                        </span>
                        <span className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {project.country}
                        </span>
                        <span className="flex items-center">
                          <DollarSign className="h-3 w-3 mr-1" />${project.budget.toLocaleString()}
                        </span>
                        <span className="flex items-center">
                          <BarChart3 className="h-3 w-3 mr-1" />
                          {project.progress}% complete
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Organization Types</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(stats.organizationTypes).map(([type, count]) => (
                    <div key={type} className="flex justify-between items-center">
                      <span className="capitalize">{type}</span>
                      <Badge variant="secondary">{count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Database Status</span>
                    <Badge className="bg-green-100 text-green-800">Healthy</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>API Response Time</span>
                    <Badge variant="secondary">125ms</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Active Sessions</span>
                    <Badge variant="secondary">89</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Storage Usage</span>
                    <Badge variant="secondary">67%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Activity Log Tab */}
        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>System-wide activity and audit trail</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    action: "User Registration",
                    user: "Dr. Amelia Chen",
                    details: "New user registered from Samoa",
                    timestamp: "2 hours ago",
                    type: "user",
                  },
                  {
                    action: "Project Created",
                    user: "Marcus Williams",
                    details: "Created 'Solar Energy Transition Program'",
                    timestamp: "4 hours ago",
                    type: "project",
                  },
                  {
                    action: "Budget Updated",
                    user: "Dr. Sarah Johnson",
                    details: "Updated budget for Coral Reef Restoration",
                    timestamp: "6 hours ago",
                    type: "budget",
                  },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 border rounded-lg">
                    <div className="flex-shrink-0">
                      <Activity className="h-5 w-5 text-emphasis-teal" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{activity.action}</span>
                        <Badge variant="outline" className="text-xs">
                          {activity.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{activity.details}</p>
                      <p className="text-xs text-gray-500">
                        by {activity.user} • {activity.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
