"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserApprovalSystem } from "./user-approval-system"
import {
  Users,
  FolderOpen,
  Search,
  Download,
  Eye,
  Edit,
  Shield,
  Building,
  MapPin,
  DollarSign,
  BarChart3,
  Flag,
  TrendingUp,
  AlertCircle,
  UserCheck,
} from "lucide-react"

interface JurisdictionAdminProps {
  jurisdiction: string
  userProfile: any
}

// Mock data for jurisdiction-specific view
const getJurisdictionData = (jurisdiction: string) => ({
  stats: {
    totalUsers: 156,
    activeProjects: 45,
    totalBudget: 12500000,
    completedProjects: 12,
    pendingApprovals: 3,
    monthlyGrowth: {
      users: 8.2,
      projects: 12.5,
      budget: 15.8,
    },
  },
  users: [
    {
      id: "1",
      full_name: "Dr. Maria Vuki",
      email: "m.vuki@usp.ac.fj",
      organization_type: "academic",
      organization_name: "University of the South Pacific",
      job_title: "Marine Biology Professor",
      created_at: "2024-01-15T10:30:00Z",
      last_login: "2024-01-20T14:22:00Z",
      status: "active",
      projects_count: 3,
      focus_areas: ["Marine Conservation", "Climate Change Adaptation"],
    },
    {
      id: "2",
      full_name: "Jone Ratunabuabua",
      email: "j.ratunabuabua@gov.fj",
      organization_type: "government",
      organization_name: "Ministry of Fisheries",
      job_title: "Senior Fisheries Officer",
      created_at: "2024-01-10T09:15:00Z",
      last_login: "2024-01-19T16:45:00Z",
      status: "active",
      projects_count: 2,
      focus_areas: ["Marine Conservation", "Food Security"],
    },
    {
      id: "3",
      full_name: "Salote Nasau",
      email: "s.nasau@wwf.org.fj",
      organization_type: "ngo",
      organization_name: "WWF Pacific",
      job_title: "Conservation Program Manager",
      created_at: "2024-01-08T11:20:00Z",
      last_login: "2024-01-18T13:30:00Z",
      status: "active",
      projects_count: 1,
      focus_areas: ["Biodiversity Conservation", "Marine Conservation"],
    },
  ],
  projects: [
    {
      id: "1",
      name: "Coral Reef Restoration - Suva Harbor",
      description: "Community-based coral restoration initiative",
      status: "active",
      created_by: "Dr. Maria Vuki",
      budget: 450000,
      start_date: "2024-02-01",
      end_date: "2025-01-31",
      sdg_goals: [14, 15],
      risk_level: "medium",
      progress: 35,
      location: "Suva Harbor, Fiji",
    },
    {
      id: "2",
      name: "Sustainable Fisheries Management",
      description: "Implementing sustainable fishing practices",
      status: "active",
      created_by: "Jone Ratunabuabua",
      budget: 320000,
      start_date: "2024-01-15",
      end_date: "2024-12-15",
      sdg_goals: [14, 2],
      risk_level: "low",
      progress: 60,
      location: "Lau Islands, Fiji",
    },
  ],
})

export function JurisdictionAdminDashboard({ jurisdiction, userProfile }: JurisdictionAdminProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterOrgType, setFilterOrgType] = useState("all")

  const data = getJurisdictionData(jurisdiction)

  const getOrgTypeIcon = (type: string) => {
    switch (type) {
      case "government":
        return <Shield className="h-4 w-4" />
      case "ngo":
        return <Users className="h-4 w-4" />
      case "academic":
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
        return <Badge className="bg-yellow-100 text-yellow-800">Pending Approval</Badge>
      case "suspended":
        return <Badge className="bg-red-100 text-red-800">Suspended</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const filteredUsers = data.users.filter((user) => {
    const matchesSearch =
      user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.organization_name?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || user.status === filterStatus
    const matchesOrgType = filterOrgType === "all" || user.organization_type === filterOrgType

    return matchesSearch && matchesStatus && matchesOrgType
  })

  return (
    <div className="space-y-6">
      {/* Jurisdiction Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg">
            <Flag className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-emphasis-navy">{jurisdiction} Administration</h1>
            <p className="text-gray-600">Manage users and projects for {jurisdiction}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button size="sm" className="bg-gradient-to-r from-blue-600 to-green-600 text-white">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </Button>
        </div>
      </div>

      {/* Jurisdiction Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+{data.stats.monthlyGrowth.users}%</span> this month
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.stats.activeProjects}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+{data.stats.monthlyGrowth.projects}%</span> this month
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(data.stats.totalBudget / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+{data.stats.monthlyGrowth.budget}%</span> this month
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.stats.completedProjects}</div>
            <p className="text-xs text-muted-foreground">Projects completed</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.stats.pendingApprovals}</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="approvals" className="space-y-4">
        <TabsList>
          <TabsTrigger value="approvals">
            <UserCheck className="h-4 w-4 mr-2" />
            User Approvals
          </TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="projects">Project Oversight</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* User Approvals Tab */}
        <TabsContent value="approvals" className="space-y-4">
          <UserApprovalSystem jurisdiction={jurisdiction} isSuperAdmin={false} />
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management - {jurisdiction}</CardTitle>
              <CardDescription>Manage approved users from your jurisdiction</CardDescription>

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
                <Select value={filterOrgType} onValueChange={setFilterOrgType}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Organization type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="government">Government</SelectItem>
                    <SelectItem value="ngo">NGO</SelectItem>
                    <SelectItem value="academic">Academic</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
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
              <CardTitle>Project Oversight - {jurisdiction}</CardTitle>
              <CardDescription>Monitor projects in your jurisdiction</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.projects.map((project) => (
                  <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold">{project.name}</h4>
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
                          {project.location}
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
                <CardTitle>{jurisdiction} Growth Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>User Growth</span>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="text-green-600 font-medium">+{data.stats.monthlyGrowth.users}%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Project Growth</span>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="text-green-600 font-medium">+{data.stats.monthlyGrowth.projects}%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Investment Growth</span>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="text-green-600 font-medium">+{data.stats.monthlyGrowth.budget}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Organization Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Government</span>
                    <Badge variant="secondary">45%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Academic</span>
                    <Badge variant="secondary">25%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>NGO</span>
                    <Badge variant="secondary">20%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Private</span>
                    <Badge variant="secondary">10%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{jurisdiction} Administration Settings</CardTitle>
              <CardDescription>Configure settings for your jurisdiction</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Auto-approve government users</h4>
                    <p className="text-sm text-gray-600">Automatically approve users from government organizations</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Budget approval threshold</h4>
                    <p className="text-sm text-gray-600">Set budget limits requiring approval</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Set Limits
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Notification preferences</h4>
                    <p className="text-sm text-gray-600">Configure admin notification settings</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Manage
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
