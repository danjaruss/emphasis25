"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import {
  CalendarIcon,
  Download,
  BarChart3,
  TrendingUp,
  FileText,
  AlertTriangle,
  Clock,
  CheckCircle,
  PieChart,
  LineChart,
  Share2,
} from "lucide-react"
import { format, subMonths, parseISO } from "date-fns"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  LineChart as RechartsLineChart,
  Line,
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { apiClient } from "@/lib/api"

// Sample data for development and fallback
const sampleProjectStatusData = [
  { name: "On Track", value: 14, color: "#4ade80" },
  { name: "At Risk", value: 3, color: "#facc15" },
  { name: "Delayed", value: 1, color: "#f87171" },
  { name: "Completed", value: 6, color: "#60a5fa" },
]

const sampleSDGData = [
  { name: "SDG 6: Clean Water", value: 8, color: "#0ea5e9" },
  { name: "SDG 7: Clean Energy", value: 6, color: "#facc15" },
  { name: "SDG 13: Climate Action", value: 12, color: "#4ade80" },
  { name: "SDG 14: Life Below Water", value: 4, color: "#06b6d4" },
  { name: "SDG 15: Life on Land", value: 3, color: "#65a30d" },
  { name: "Other SDGs", value: 5, color: "#8b5cf6" },
]

const sampleBudgetData = [
  { name: "Research", planned: 250000, actual: 275000 },
  { name: "Implementation", planned: 800000, actual: 750000 },
  { name: "Monitoring", planned: 350000, actual: 325000 },
  { name: "Community", planned: 200000, actual: 230000 },
  { name: "Administration", planned: 150000, actual: 170000 },
  { name: "Evaluation", planned: 100000, actual: 90000 },
]

const sampleProgressData = Array.from({ length: 12 }, (_, i) => {
  const month = format(subMonths(new Date(), 11 - i), "MMM")
  // Create a pattern with some variance
  const planned = Math.min(100, Math.round((i + 1) * (100 / 12)))
  const variance = Math.sin(i / 2) * 10
  const actual = Math.max(0, Math.min(100, Math.round(planned + variance)))

  return {
    month,
    planned,
    actual,
  }
})

const sampleRiskData = [
  { month: "Jan", high: 5, medium: 8, low: 12 },
  { month: "Feb", high: 7, medium: 10, low: 10 },
  { month: "Mar", high: 4, medium: 12, low: 8 },
  { month: "Apr", high: 3, medium: 9, low: 14 },
  { month: "May", high: 2, medium: 7, low: 16 },
  { month: "Jun", high: 1, medium: 5, low: 18 },
]

export default function ReportsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [projects, setProjects] = useState<any[]>([])
  const [timeRange, setTimeRange] = useState("6m")
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [projectStatusData, setProjectStatusData] = useState(sampleProjectStatusData)
  const [sdgData, setSdgData] = useState(sampleSDGData)
  const [budgetData, setBudgetData] = useState(sampleBudgetData)
  const [progressData, setProgressData] = useState(sampleProgressData)
  const [riskData, setRiskData] = useState(sampleRiskData)

  // Fetch projects data
  useEffect(() => {
    async function fetchProjects() {
      try {
        setIsLoading(true)
        const data = await apiClient.getProjects()

        if (data) {
          setProjects(data)

          // Process data for charts if we have real data
          if (data.length > 0) {
            processProjectData(data)
          }
        }
      } catch (error) {
        console.error("Error in fetchProjects:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjects()
  }, [])

  // Process project data for charts
  const processProjectData = (projectsData: any[]) => {
    // This would process real data from the database
    // For now, we'll use the sample data with slight modifications

    // Example: Adjust project status data based on number of projects
    const totalProjects = projectsData.length
    if (totalProjects > 0) {
      // Just a simple modification to show different data
      setProjectStatusData([
        { name: "On Track", value: Math.round(totalProjects * 0.6), color: "#4ade80" },
        { name: "At Risk", value: Math.round(totalProjects * 0.15), color: "#facc15" },
        { name: "Delayed", value: Math.round(totalProjects * 0.05), color: "#f87171" },
        { name: "Completed", value: Math.round(totalProjects * 0.2), color: "#60a5fa" },
      ])
    }
  }

  // Filter data based on selected time range
  const getFilteredData = (data: any[], dateKey = "month") => {
    const today = new Date()
    let cutoffDate

    switch (timeRange) {
      case "1m":
        cutoffDate = subMonths(today, 1)
        break
      case "3m":
        cutoffDate = subMonths(today, 3)
        break
      case "6m":
        cutoffDate = subMonths(today, 6)
        break
      case "1y":
        cutoffDate = subMonths(today, 12)
        break
      default:
        cutoffDate = subMonths(today, 6)
    }

    // For sample data that uses month names, we'll just take the last N items
    if (dateKey === "month" && typeof data[0][dateKey] === "string") {
      const months = timeRange === "1m" ? 1 : timeRange === "3m" ? 3 : timeRange === "6m" ? 6 : 12
      return data.slice(-months)
    }

    // For data with actual dates
    return data.filter((item) => {
      const itemDate = item[dateKey] instanceof Date ? item[dateKey] : parseISO(item[dateKey])
      return itemDate >= cutoffDate
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-emphasis-navy">Reports & Analytics</h1>
          <p className="text-emphasis-teal mt-2">Comprehensive insights and reporting for your SDG projects</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">Last Month</SelectItem>
              <SelectItem value="3m">Last 3 Months</SelectItem>
              <SelectItem value="6m">Last 6 Months</SelectItem>
              <SelectItem value="1y">Last Year</SelectItem>
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="w-[140px] justify-start">
                <CalendarIcon className="h-4 w-4 mr-2" />
                {date ? format(date, "MMM dd, yyyy") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
            </PopoverContent>
          </Popover>

          <Button size="sm" className="bg-emphasis-teal hover:bg-emphasis-navy">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <BarChart3 className="h-4 w-4 text-emphasis-teal" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold text-emphasis-navy">{projects.length || 24}</div>
                <p className="text-xs text-muted-foreground">+3 from last month</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold text-emphasis-navy">
                  {projectStatusData.find((item) => item.name === "On Track")?.value || 18}
                </div>
                <p className="text-xs text-muted-foreground">
                  {Math.round(
                    ((projectStatusData.find((item) => item.name === "On Track")?.value || 18) /
                      (projects.length || 24)) *
                    100,
                  )}
                  % of total projects
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <FileText className="h-4 w-4 text-emphasis-teal" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold text-emphasis-navy">
                  ${(budgetData.reduce((sum, item) => sum + item.planned, 0) / 1000000).toFixed(1)}M
                </div>
                <p className="text-xs text-muted-foreground">Across all projects</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold text-emphasis-navy">
                  {progressData[progressData.length - 1]?.actual || 68}%
                </div>
                <p className="text-xs text-muted-foreground">Average across projects</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Main Charts */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sdg">SDG Impact</TabsTrigger>
          <TabsTrigger value="budget">Budget</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Project Status Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="h-5 w-5 mr-2" />
                  Project Status Distribution
                </CardTitle>
                <CardDescription>Current status of all projects</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                {isLoading ? (
                  <div className="h-full w-full flex items-center justify-center">
                    <Skeleton className="h-[300px] w-[300px] rounded-full" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={projectStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={120}
                        innerRadius={60}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {projectStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-white p-3 border rounded shadow-md">
                                <p className="font-medium" style={{ color: payload[0].payload.color }}>
                                  {payload[0].payload.name}
                                </p>
                                <p className="text-sm">
                                  <span className="font-medium">Projects:</span> {payload[0].payload.value}
                                </p>
                                <p className="text-sm">
                                  <span className="font-medium">Percentage:</span>{" "}
                                  {(
                                    (payload[0].payload.value /
                                      projectStatusData.reduce((sum, item) => sum + item.value, 0)) *
                                    100
                                  ).toFixed(1)}
                                  %
                                </p>
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            {/* SDG Distribution Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  SDG Goals Distribution
                </CardTitle>
                <CardDescription>Projects by Sustainable Development Goal</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                {isLoading ? (
                  <div className="h-full w-full flex items-center justify-center">
                    <Skeleton className="h-[300px] w-full" />
                  </div>
                ) : (
                  <ChartContainer
                    config={{
                      value: {
                        label: "Projects",
                        color: "hsl(var(--chart-1))",
                      },
                    }}
                    className="h-full"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart data={sdgData} layout="vertical" margin={{ left: 120 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={120} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="value" fill="var(--color-value)" radius={[0, 4, 4, 0]}>
                          {sdgData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Progress Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <LineChart className="h-5 w-5 mr-2" />
                Project Progress Timeline
              </CardTitle>
              <CardDescription>Planned vs. actual progress over time</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              {isLoading ? (
                <div className="h-full w-full flex items-center justify-center">
                  <Skeleton className="h-[350px] w-full" />
                </div>
              ) : (
                <ChartContainer
                  config={{
                    planned: {
                      label: "Planned Progress",
                      color: "hsl(var(--chart-1))",
                    },
                    actual: {
                      label: "Actual Progress",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                  className="h-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={getFilteredData(progressData)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="planned"
                        stroke="var(--color-planned)"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 5 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="actual"
                        stroke="var(--color-actual)"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 5 }}
                      />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* SDG Impact Tab */}
        <TabsContent value="sdg" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                SDG Goals Distribution
              </CardTitle>
              <CardDescription>Projects by Sustainable Development Goal</CardDescription>
            </CardHeader>
            <CardContent className="h-[500px]">
              {isLoading ? (
                <div className="h-full w-full flex items-center justify-center">
                  <Skeleton className="h-[450px] w-full" />
                </div>
              ) : (
                <ChartContainer
                  config={{
                    value: {
                      label: "Projects",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={sdgData} layout="vertical" margin={{ left: 150 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={150} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="value" fill="var(--color-value)" radius={[0, 4, 4, 0]}>
                        {sdgData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>SDG Impact Metrics</CardTitle>
                <CardDescription>Key performance indicators by SDG goal</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sdgData.slice(0, 4).map((sdg, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium" style={{ color: sdg.color }}>
                          {sdg.name}
                        </span>
                        <Badge
                          style={{ backgroundColor: `${sdg.color}20`, color: sdg.color, borderColor: `${sdg.color}40` }}
                        >
                          {sdg.value} Projects
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span>Impact Score</span>
                          <span className="font-medium">{70 + Math.floor(Math.random() * 20)}%</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Beneficiaries</span>
                          <span className="font-medium">
                            {Math.floor(Math.random() * 50000 + 10000).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Sustainability Rating</span>
                          <span className="font-medium">{["A+", "A", "A-", "B+"][Math.floor(Math.random() * 4)]}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>SDG Alignment</CardTitle>
                <CardDescription>Project alignment with SDG targets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[
                    { name: "Direct Impact", value: 65 },
                    { name: "Indirect Impact", value: 42 },
                    { name: "Target Alignment", value: 78 },
                    { name: "Indicator Coverage", value: 53 },
                  ].map((metric, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{metric.name}</span>
                        <span className="text-sm">{metric.value}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-emphasis-teal h-2 rounded-full" style={{ width: `${metric.value}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Budget Tab */}
        <TabsContent value="budget" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Budget Allocation & Spending
              </CardTitle>
              <CardDescription>Planned vs. actual budget by category</CardDescription>
            </CardHeader>
            <CardContent className="h-[500px]">
              {isLoading ? (
                <div className="h-full w-full flex items-center justify-center">
                  <Skeleton className="h-[450px] w-full" />
                </div>
              ) : (
                <ChartContainer
                  config={{
                    planned: {
                      label: "Planned Budget",
                      color: "hsl(var(--chart-1))",
                    },
                    actual: {
                      label: "Actual Spending",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                  className="h-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={budgetData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                      <ChartTooltip
                        formatter={(value: any) => [`$${(value / 1000).toFixed(0)}k`, ""]}
                        content={<ChartTooltipContent />}
                      />
                      <Legend />
                      <Bar dataKey="planned" fill="var(--color-planned)" name="Planned" />
                      <Bar dataKey="actual" fill="var(--color-actual)" name="Actual" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Budget Summary</CardTitle>
                <CardDescription>Financial overview and metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Total Budget</p>
                      <p className="text-2xl font-bold text-emphasis-navy">
                        ${(budgetData.reduce((sum, item) => sum + item.planned, 0) / 1000000).toFixed(1)}M
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Total Spent</p>
                      <p className="text-2xl font-bold text-emphasis-navy">
                        ${(budgetData.reduce((sum, item) => sum + item.actual, 0) / 1000000).toFixed(1)}M
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Remaining</p>
                      <p className="text-2xl font-bold text-green-600">
                        $
                        {(
                          (budgetData.reduce((sum, item) => sum + item.planned, 0) -
                            budgetData.reduce((sum, item) => sum + item.actual, 0)) /
                          1000000
                        ).toFixed(1)}
                        M
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Utilization</p>
                      <p className="text-2xl font-bold text-emphasis-navy">
                        {Math.round(
                          (budgetData.reduce((sum, item) => sum + item.actual, 0) /
                            budgetData.reduce((sum, item) => sum + item.planned, 0)) *
                          100,
                        )}
                        %
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="text-sm font-medium mb-3">Budget Efficiency</h4>
                    <div className="space-y-2">
                      {budgetData.map((item, index) => {
                        const efficiency = (item.planned / item.actual) * 100
                        let color = "text-yellow-600"
                        if (efficiency > 105) color = "text-green-600"
                        if (efficiency < 95) color = "text-red-600"

                        return (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <span>{item.name}</span>
                            <span className={color}>
                              {efficiency > 100 ? "+" : ""}
                              {(efficiency - 100).toFixed(1)}%
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Funding Sources</CardTitle>
                <CardDescription>Budget allocation by funding source</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={[
                        { name: "Government Grants", value: 40, color: "#0ea5e9" },
                        { name: "Private Donors", value: 25, color: "#4ade80" },
                        { name: "Corporate Sponsors", value: 20, color: "#facc15" },
                        { name: "International Aid", value: 15, color: "#8b5cf6" },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {[
                        { name: "Government Grants", value: 40, color: "#0ea5e9" },
                        { name: "Private Donors", value: 25, color: "#4ade80" },
                        { name: "Corporate Sponsors", value: 20, color: "#facc15" },
                        { name: "International Aid", value: 15, color: "#8b5cf6" },
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-white p-3 border rounded shadow-md">
                              <p className="font-medium" style={{ color: payload[0].payload.color }}>
                                {payload[0].payload.name}
                              </p>
                              <p className="text-sm">
                                <span className="font-medium">Percentage:</span> {payload[0].payload.value}%
                              </p>
                              <p className="text-sm">
                                <span className="font-medium">Amount:</span> $
                                {(payload[0].payload.value * 18500).toLocaleString()}
                              </p>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Progress Tab */}
        <TabsContent value="progress" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <LineChart className="h-5 w-5 mr-2" />
                Project Progress Timeline
              </CardTitle>
              <CardDescription>Planned vs. actual progress over time</CardDescription>
            </CardHeader>
            <CardContent className="h-[500px]">
              {isLoading ? (
                <div className="h-full w-full flex items-center justify-center">
                  <Skeleton className="h-[450px] w-full" />
                </div>
              ) : (
                <ChartContainer
                  config={{
                    planned: {
                      label: "Planned Progress",
                      color: "hsl(var(--chart-1))",
                    },
                    actual: {
                      label: "Actual Progress",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                  className="h-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={getFilteredData(progressData)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="planned"
                        stroke="var(--color-planned)"
                        fill="var(--color-planned)"
                        fillOpacity={0.2}
                        strokeWidth={2}
                      />
                      <Area
                        type="monotone"
                        dataKey="actual"
                        stroke="var(--color-actual)"
                        fill="var(--color-actual)"
                        fillOpacity={0.2}
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Milestone Completion</CardTitle>
                <CardDescription>Key project milestones and status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Project Kickoff", planned: "Jan 15", actual: "Jan 16", status: "completed" },
                    { name: "Requirements Finalized", planned: "Feb 01", actual: "Feb 05", status: "completed" },
                    { name: "Design Phase Complete", planned: "Mar 15", actual: "Mar 20", status: "completed" },
                    { name: "Implementation Started", planned: "Apr 01", actual: "Apr 01", status: "completed" },
                    { name: "Testing Phase", planned: "May 15", actual: null, status: "in-progress" },
                    { name: "Deployment", planned: "Jun 30", actual: null, status: "planned" },
                  ].map((milestone, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div
                        className={cn(
                          "h-8 w-8 rounded-full flex items-center justify-center",
                          milestone.status === "completed"
                            ? "bg-green-100"
                            : milestone.status === "in-progress"
                              ? "bg-blue-100"
                              : "bg-gray-100",
                        )}
                      >
                        {milestone.status === "completed" ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : milestone.status === "in-progress" ? (
                          <Clock className="h-5 w-5 text-blue-600" />
                        ) : (
                          <Calendar className="h-5 w-5 text-gray-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{milestone.name}</p>
                        <div className="flex text-sm text-muted-foreground">
                          <span>Planned: {milestone.planned}</span>
                          <span className="mx-2">•</span>
                          <span>{milestone.actual ? `Completed: ${milestone.actual}` : "Not completed"}</span>
                        </div>
                      </div>
                      <Badge
                        className={cn(
                          milestone.status === "completed"
                            ? "bg-green-100 text-green-800 border-green-200"
                            : milestone.status === "in-progress"
                              ? "bg-blue-100 text-blue-800 border-blue-200"
                              : "bg-gray-100 text-gray-800 border-gray-200",
                        )}
                      >
                        {milestone.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Progress Velocity</CardTitle>
                <CardDescription>Weekly progress rate</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ChartContainer
                  config={{
                    velocity: {
                      label: "Weekly Progress Rate",
                      color: "hsl(var(--chart-3))",
                    },
                  }}
                  className="h-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart
                      data={progressData
                        .map((item, i, arr) => {
                          if (i === 0) return { ...item, velocity: item.actual }
                          const prevActual = arr[i - 1].actual
                          return {
                            ...item,
                            velocity: Math.max(0, item.actual - prevActual),
                          }
                        })
                        .filter((_, i) => i % 2 === 0)} // Show every other data point
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(value) => `${value}%`} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="velocity" fill="var(--color-velocity)" radius={[4, 4, 0, 0]} />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Risk Analysis Tab */}
        <TabsContent value="risk" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Risk Trend Analysis
              </CardTitle>
              <CardDescription>Risk level distribution over time</CardDescription>
            </CardHeader>
            <CardContent className="h-[500px]">
              {isLoading ? (
                <div className="h-full w-full flex items-center justify-center">
                  <Skeleton className="h-[450px] w-full" />
                </div>
              ) : (
                <ChartContainer
                  config={{
                    high: {
                      label: "High Risk",
                      color: "#f87171",
                    },
                    medium: {
                      label: "Medium Risk",
                      color: "#facc15",
                    },
                    low: {
                      label: "Low Risk",
                      color: "#4ade80",
                    },
                  }}
                  className="h-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={getFilteredData(riskData)} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="high"
                        stackId="1"
                        stroke="var(--color-high)"
                        fill="var(--color-high)"
                      />
                      <Area
                        type="monotone"
                        dataKey="medium"
                        stackId="1"
                        stroke="var(--color-medium)"
                        fill="var(--color-medium)"
                      />
                      <Area
                        type="monotone"
                        dataKey="low"
                        stackId="1"
                        stroke="var(--color-low)"
                        fill="var(--color-low)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Risk Factors</CardTitle>
                <CardDescription>Key risk categories and severity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Environmental Compliance", level: "high", score: 8.2 },
                    { name: "Budget Overruns", level: "medium", score: 6.5 },
                    { name: "Stakeholder Engagement", level: "low", score: 3.8 },
                    { name: "Technical Challenges", level: "medium", score: 5.9 },
                    { name: "Regulatory Changes", level: "high", score: 7.6 },
                  ].map((risk, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{risk.name}</span>
                        <Badge
                          className={cn(
                            risk.level === "high"
                              ? "bg-red-100 text-red-800 border-red-200"
                              : risk.level === "medium"
                                ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                                : "bg-green-100 text-green-800 border-green-200",
                          )}
                        >
                          {risk.level} risk
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className={cn(
                              "h-2 rounded-full",
                              risk.level === "high"
                                ? "bg-red-500"
                                : risk.level === "medium"
                                  ? "bg-yellow-500"
                                  : "bg-green-500",
                            )}
                            style={{ width: `${(risk.score / 10) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{risk.score}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk Mitigation</CardTitle>
                <CardDescription>Status of risk mitigation strategies</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Environmental Impact Assessment", status: "completed", date: "Feb 15" },
                    { name: "Budget Contingency Planning", status: "completed", date: "Mar 02" },
                    { name: "Stakeholder Communication Plan", status: "in-progress", date: "Ongoing" },
                    { name: "Technical Risk Assessment", status: "completed", date: "Apr 10" },
                    { name: "Regulatory Compliance Review", status: "scheduled", date: "Jun 05" },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div
                        className={cn(
                          "h-8 w-8 rounded-full flex items-center justify-center",
                          item.status === "completed"
                            ? "bg-green-100"
                            : item.status === "in-progress"
                              ? "bg-blue-100"
                              : "bg-gray-100",
                        )}
                      >
                        {item.status === "completed" ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : item.status === "in-progress" ? (
                          <Clock className="h-5 w-5 text-blue-600" />
                        ) : (
                          <Calendar className="h-5 w-5 text-gray-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{item.date}</p>
                      </div>
                      <Badge
                        className={cn(
                          item.status === "completed"
                            ? "bg-green-100 text-green-800 border-green-200"
                            : item.status === "in-progress"
                              ? "bg-blue-100 text-blue-800 border-blue-200"
                              : "bg-gray-100 text-gray-800 border-gray-200",
                        )}
                      >
                        {item.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Available Reports */}
      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-emphasis-navy">Available Reports</CardTitle>
            <CardDescription>Generate and download comprehensive project reports</CardDescription>
          </div>
          <Button variant="outline" size="sm" className="hidden md:flex">
            <Share2 className="h-4 w-4 mr-2" />
            Share Reports
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                title: "Project Summary Report",
                description: "Overview of all projects with key metrics",
                type: "PDF, Excel",
              },
              {
                title: "Financial Report",
                description: "Budget allocation and spending analysis",
                type: "PDF, Excel",
              },
              {
                title: "Progress Timeline",
                description: "Visual timeline of project milestones",
                type: "PDF, PNG",
              },
              {
                title: "Stakeholder Report",
                description: "Stakeholder engagement and feedback",
                type: "PDF, Word",
              },
              {
                title: "Impact Assessment",
                description: "Environmental and social impact metrics",
                type: "PDF, Excel",
              },
              {
                title: "Risk Analysis",
                description: "Risk factors and mitigation strategies",
                type: "PDF, Excel",
              },
            ].map((report, index) => (
              <Card key={index} className="border border-emphasis-light-blue/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-emphasis-navy">{report.title}</CardTitle>
                  <CardDescription className="text-xs">{report.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{report.type}</span>
                    <Button size="sm" variant="outline">
                      <Download className="h-3 w-3 mr-1" />
                      Generate
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
