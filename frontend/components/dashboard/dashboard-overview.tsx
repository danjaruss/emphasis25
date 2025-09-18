"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  Folder,
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  Target,
  ArrowRight,
  Plus,
  Activity,
  Globe,
  FileText,
  AlertTriangle,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/components/auth/auth-provider"
import { apiClient } from '@/lib/api'
import { useEffect, useState } from 'react'

interface DashboardData {
  projectStats: {
    total: number;
    active: number;
    completed: number;
    onHold: number;
  };
  budgetData: Array<{
    month: string;
    planned: number;
    actual: number;
  }>;
  sdgDistribution: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  recentActivity: Array<{
    id: number;
    type: string;
    message: string;
    project: string;
    time: string;
    status: string;
  }>;
  upcomingMilestones: Array<{
    id: number;
    title: string;
    project: string;
    dueDate: string;
    status: string;
    progress: number;
  }>;
}

export function DashboardOverview() {
  const { profile } = useAuth()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dashboardData = await apiClient.getDashboardData()
        if (!dashboardData) {
          throw new Error('No data received from server')
        }
        setData(dashboardData)
      } catch (err) {
        console.error('Dashboard data error:', err)
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emphasis-teal mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <AlertTriangle className="h-12 w-12 mx-auto" />
          </div>
          <p className="text-gray-600">{error}</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-gray-600">No data available</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Refresh
          </Button>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500'
      case 'on-track':
        return 'bg-blue-500'
      case 'at-risk':
        return 'bg-yellow-500'
      case 'delayed':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'milestone':
        return <Calendar className="h-4 w-4" />
      case 'update':
        return <FileText className="h-4 w-4" />
      case 'team':
        return <Users className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-emphasis-teal to-emphasis-mint rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome back, {profile?.full_name || "User"}! 👋</h1>
            <p className="text-white/90">Here's what's happening with your sustainable development projects today.</p>
          </div>
          <div className="hidden md:flex space-x-3">
            <Button asChild variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
              <Link href="/projects/new">
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Link>
            </Button>
            <Button asChild variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
              <Link href="/reports">
                <BarChart className="h-4 w-4 mr-2" />
                View Reports
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.projectStats.total}</div>
            <p className="text-xs text-muted-foreground">
              {data.projectStats.active} active, {data.projectStats.completed} completed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.projectStats.active}</div>
            <p className="text-xs text-muted-foreground">
              {data.projectStats.onHold} on hold
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Projects</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.projectStats.completed}</div>
            <p className="text-xs text-muted-foreground">
              {((data.projectStats.completed / data.projectStats.total) * 100).toFixed(1)}% completion rate
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On Hold</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.projectStats.onHold}</div>
            <p className="text-xs text-muted-foreground">
              {((data.projectStats.onHold / data.projectStats.total) * 100).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Budget Overview Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emphasis-teal" />
              Budget Performance
            </CardTitle>
            <CardDescription>Planned vs. actual spending over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                planned: {
                  label: "Planned",
                  color: "hsl(var(--chart-1))",
                },
                actual: {
                  label: "Actual",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.budgetData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="planned" fill="var(--color-planned)" name="Planned" />
                  <Bar dataKey="actual" fill="var(--color-actual)" name="Actual" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* SDG Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-emphasis-teal" />
              SDG Focus Areas
            </CardTitle>
            <CardDescription>Distribution of projects by SDG category</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                value: {
                  label: "Projects",
                },
              }}
              className="h-[250px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.sdgDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.sdgDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="mt-4 space-y-2">
              {data.sdgDistribution.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span>{item.name}</span>
                  </div>
                  <span className="font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-emphasis-teal" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest updates from your projects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-4">
                  <div className="rounded-full bg-gray-100 p-2">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{activity.message}</p>
                    <p className="text-sm text-muted-foreground">
                      {activity.project} • {activity.time}
                    </p>
                  </div>
                  <div className={`h-2 w-2 rounded-full ${getStatusColor(activity.status)}`} />
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <Button asChild variant="ghost" className="w-full">
                <Link href="/activity">
                  View All Activity
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Milestones */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-emphasis-teal" />
              Upcoming Milestones
            </CardTitle>
            <CardDescription>Key deadlines and deliverables</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.upcomingMilestones.map((milestone) => (
                <div key={milestone.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{milestone.title}</p>
                      <p className="text-sm text-muted-foreground">{milestone.project}</p>
                    </div>
                    <div className={`h-2 w-2 rounded-full ${getStatusColor(milestone.status)}`} />
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="h-2 flex-1 rounded-full bg-gray-100">
                      <div
                        className="h-2 rounded-full bg-blue-500"
                        style={{ width: `${milestone.progress}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground">{milestone.progress}%</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Due: {new Date(milestone.dueDate).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <Button asChild variant="ghost" className="w-full">
                <Link href="/milestones">
                  View All Milestones
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-emphasis-teal" />
            Quick Actions
          </CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button asChild variant="outline" className="h-auto p-4 flex-col gap-2">
              <Link href="/projects/new">
                <FileText className="h-6 w-6 text-emphasis-teal" />
                <span className="font-medium">Create Project</span>
                <span className="text-xs text-gray-500">Start a new initiative</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto p-4 flex-col gap-2">
              <Link href="/projects/templates">
                <Folder className="h-6 w-6 text-emphasis-teal" />
                <span className="font-medium">Browse Templates</span>
                <span className="text-xs text-gray-500">Use proven frameworks</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto p-4 flex-col gap-2">
              <Link href="/stakeholders">
                <Users className="h-6 w-6 text-emphasis-teal" />
                <span className="font-medium">Manage Team</span>
                <span className="text-xs text-gray-500">Add collaborators</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto p-4 flex-col gap-2">
              <Link href="/reports">
                <FileText className="h-6 w-6 text-emphasis-teal" />
                <span className="font-medium">View Reports</span>
                <span className="text-xs text-gray-500">Analyze performance</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
