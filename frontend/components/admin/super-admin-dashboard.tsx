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
  Crown,
  AlertTriangle,
  TrendingUp,
  Server,
  Database,
} from "lucide-react"

// Mock data for super-admin view
const mockGlobalStats = {
  totalUsers: 1247,
  totalProjects: 342,
  totalBudget: 125000000,
  activeCountries: 23,
  systemHealth: 98.7,
  monthlyGrowth: {
    users: 12.3,
    projects: 8.7,
    budget: 15.2,
  },
  jurisdictionBreakdown: {
    Fiji: { users: 156, projects: 45, budget: 12500000, admins: 3 },
    Barbados: { users: 89, projects: 28, budget: 8750000, admins: 2 },
    Maldives: { users: 134, projects: 38, budget: 15200000, admins: 4 },
    Jamaica: { users: 201, projects: 52, budget: 18900000, admins: 5 },
    Samoa: { users: 67, projects: 19, budget: 6800000, admins: 2 },
    Seychelles: { users: 45, projects: 12, budget: 4200000, admins: 1 },
  },
}

const mockSystemAlerts = [
  {
    id: 1,
    type: "warning",
    title: "High Budget Variance in Fiji",
    description: "Multiple projects showing >20% budget overrun",
    jurisdiction: "Fiji",
    severity: "medium",
    timestamp: "2 hours ago",
  },
  {
    id: 2,
    type: "info",
    title: "New Admin Request",
    description: "Dr. Sarah Chen requesting admin access for Samoa",
    jurisdiction: "Samoa",
    severity: "low",
    timestamp: "4 hours ago",
  },
  {
    id: 3,
    type: "error",
    title: "System Performance Alert",
    description: "Database response time above threshold",
    jurisdiction: "Global",
    severity: "high",
    timestamp: "6 hours ago",
  },
]

const mockJurisdictionAdmins = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@gov.fj",
    jurisdiction: "Fiji",
    role: "admin",
    organization: "Ministry of Environment",
    lastActive: "2 hours ago",
    projectsManaged: 15,
    usersManaged: 45,
    status: "active",
  },
  {
    id: "2",
    name: "Marcus Williams",
    email: "m.williams@gov.bb",
    jurisdiction: "Barbados",
    role: "admin",
    organization: "Ministry of Blue Economy",
    lastActive: "1 day ago",
    projectsManaged: 12,
    usersManaged: 28,
    status: "active",
  },
  {
    id: "3",
    name: "Dr. Amina Hassan",
    email: "a.hassan@environment.mv",
    jurisdiction: "Maldives",
    role: "admin",
    organization: "Ministry of Environment",
    lastActive: "3 hours ago",
    projectsManaged: 18,
    usersManaged: 52,
    status: "active",
  },
]

export function SuperAdminDashboard() {
  const [selectedJurisdiction, setSelectedJurisdiction] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "high":
        return <Badge className="bg-red-100 text-red-800">High</Badge>
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
      case "low":
        return <Badge className="bg-blue-100 text-blue-800">Low</Badge>
      default:
        return <Badge variant="secondary">{severity}</Badge>
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "info":
        return <Activity className="h-4 w-4 text-blue-600" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Super Admin Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg">
            <Crown className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-emphasis-navy">Super Admin Dashboard</h1>
            <p className="text-gray-600">Global EMPHASIS Platform Management</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Global Report
          </Button>
          <Button size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
            <Server className="h-4 w-4 mr-2" />
            System Health
          </Button>
        </div>
      </div>

      {/* Global Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Global Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockGlobalStats.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+{mockGlobalStats.monthlyGrowth.users}%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Global Projects</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockGlobalStats.totalProjects}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+{mockGlobalStats.monthlyGrowth.projects}%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Investment</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(mockGlobalStats.totalBudget / 1000000).toFixed(0)}M</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+{mockGlobalStats.monthlyGrowth.budget}%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockGlobalStats.systemHealth}%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">Excellent</span> performance
            </p>
          </CardContent>
        </Card>
      </div>

      {/* System Alerts */}
      <Card className="border-l-4 border-l-red-500">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <span>System Alerts</span>
            <Badge className="bg-red-100 text-red-800">{mockSystemAlerts.length}</Badge>
          </CardTitle>
          <CardDescription>Critical issues requiring attention</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockSystemAlerts.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {getAlertIcon(alert.type)}
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium">{alert.title}</h4>
                      {getSeverityBadge(alert.severity)}
                    </div>
                    <p className="text-sm text-gray-600">{alert.description}</p>
                    <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                      <MapPin className="h-3 w-3" />
                      <span>{alert.jurisdiction}</span>
                      <span>•</span>
                      <span>{alert.timestamp}</span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Investigate
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <Tabs defaultValue="jurisdictions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="jurisdictions">Jurisdiction Overview</TabsTrigger>
          <TabsTrigger value="admins">Admin Management</TabsTrigger>
          <TabsTrigger value="analytics">Global Analytics</TabsTrigger>
          <TabsTrigger value="system">System Management</TabsTrigger>
        </TabsList>

        {/* Jurisdictions Tab */}
        <TabsContent value="jurisdictions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Jurisdiction Performance</CardTitle>
              <CardDescription>Overview of all island nations and territories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {Object.entries(mockGlobalStats.jurisdictionBreakdown).map(([country, stats]) => (
                  <div key={country} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{country.slice(0, 2).toUpperCase()}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold">{country}</h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            {stats.users} users
                          </span>
                          <span className="flex items-center">
                            <FolderOpen className="h-3 w-3 mr-1" />
                            {stats.projects} projects
                          </span>
                          <span className="flex items-center">
                            <Shield className="h-3 w-3 mr-1" />
                            {stats.admins} admins
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">${(stats.budget / 1000000).toFixed(1)}M</div>
                      <div className="text-sm text-gray-500">Total Investment</div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Admin Management Tab */}
        <TabsContent value="admins" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Jurisdiction Administrators</CardTitle>
              <CardDescription>Manage regional and country-level administrators</CardDescription>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search administrators..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <Select value={selectedJurisdiction} onValueChange={setSelectedJurisdiction}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Filter by jurisdiction" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Jurisdictions</SelectItem>
                    <SelectItem value="Fiji">Fiji</SelectItem>
                    <SelectItem value="Barbados">Barbados</SelectItem>
                    <SelectItem value="Maldives">Maldives</SelectItem>
                  </SelectContent>
                </Select>
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                  <Users className="h-4 w-4 mr-2" />
                  Add Admin
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockJurisdictionAdmins.map((admin) => (
                  <div key={admin.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarFallback className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                          {admin.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold">{admin.name}</h4>
                          <Badge className="bg-purple-100 text-purple-800">Admin</Badge>
                          <Badge variant="outline">{admin.jurisdiction}</Badge>
                        </div>
                        <p className="text-sm text-gray-600">{admin.email}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                          <span className="flex items-center">
                            <Building className="h-3 w-3 mr-1" />
                            {admin.organization}
                          </span>
                          <span className="flex items-center">
                            <FolderOpen className="h-3 w-3 mr-1" />
                            {admin.projectsManaged} projects
                          </span>
                          <span className="flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            {admin.usersManaged} users
                          </span>
                          <span>Last active: {admin.lastActive}</span>
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

        {/* Global Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Platform Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>User Growth Rate</span>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="text-green-600 font-medium">+{mockGlobalStats.monthlyGrowth.users}%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Project Creation Rate</span>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="text-green-600 font-medium">+{mockGlobalStats.monthlyGrowth.projects}%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Investment Growth</span>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="text-green-600 font-medium">+{mockGlobalStats.monthlyGrowth.budget}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Database Performance</span>
                    <Badge className="bg-green-100 text-green-800">Excellent</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>API Response Time</span>
                    <Badge variant="secondary">125ms avg</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Uptime</span>
                    <Badge className="bg-green-100 text-green-800">99.9%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Active Sessions</span>
                    <Badge variant="secondary">1,247</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* System Management Tab */}
        <TabsContent value="system" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="h-5 w-5" />
                  <span>Database Management</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Backup Database
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Performance Analytics
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Shield className="h-4 w-4 mr-2" />
                  Security Audit
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Server className="h-5 w-5" />
                  <span>System Operations</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  <Activity className="h-4 w-4 mr-2" />
                  System Logs
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  User Analytics
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Globe className="h-4 w-4 mr-2" />
                  Global Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
