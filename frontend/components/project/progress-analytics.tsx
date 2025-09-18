"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { format, subDays, subMonths, parseISO } from "date-fns"
import {
  TrendingUp,
  Calendar,
  BarChart3,
  PieChartIcon,
  Clock,
  AlertTriangle,
  CheckCircle,
  Download,
  Share2,
} from "lucide-react"

interface ProgressAnalyticsProps {
  projectId: string
  projectName: string
}

// Sample data - in a real app, this would come from the database
const generateSampleData = () => {
  const today = new Date()
  const progressData = []

  // Generate 6 months of data
  for (let i = 180; i >= 0; i -= 7) {
    const date = subDays(today, i)
    const formattedDate = format(date, "yyyy-MM-dd")

    // Create some realistic patterns
    const plannedProgress = Math.min(100, Math.round((180 - i) * (100 / 180)))

    // Actual progress follows planned with some variance
    const variance = Math.sin(i / 20) * 10 // Create some oscillation
    const actualProgress = Math.max(0, Math.min(100, Math.round(plannedProgress + variance)))

    // Add some milestone completions
    const milestones = []
    if (i === 150) milestones.push("Project Kickoff")
    if (i === 120) milestones.push("Requirements Finalized")
    if (i === 90) milestones.push("Design Phase Complete")
    if (i === 60) milestones.push("Implementation Started")
    if (i === 30) milestones.push("Testing Phase")

    progressData.push({
      date: formattedDate,
      planned: plannedProgress,
      actual: actualProgress,
      milestones,
    })
  }

  return progressData
}

const sampleProgressData = generateSampleData()

// Sample milestone data
const milestonesData = [
  { name: "Project Kickoff", planned: "2023-12-01", actual: "2023-12-02", status: "completed" },
  { name: "Requirements Finalized", planned: "2024-01-01", actual: "2024-01-05", status: "completed" },
  { name: "Design Phase Complete", planned: "2024-02-01", actual: "2024-02-10", status: "completed" },
  { name: "Implementation Started", planned: "2024-03-01", actual: "2024-03-01", status: "completed" },
  { name: "Testing Phase", planned: "2024-04-01", actual: "2024-04-05", status: "completed" },
  { name: "User Acceptance Testing", planned: "2024-05-01", actual: null, status: "in-progress" },
  { name: "Deployment", planned: "2024-06-01", actual: null, status: "planned" },
]

// Sample status distribution data
const statusDistributionData = [
  { name: "On Track", value: 65, color: "#4ade80" },
  { name: "Delayed", value: 20, color: "#facc15" },
  { name: "At Risk", value: 10, color: "#f87171" },
  { name: "Completed", value: 5, color: "#60a5fa" },
]

// Sample resource allocation data
const resourceAllocationData = [
  { name: "Research", planned: 20, actual: 25 },
  { name: "Design", planned: 15, actual: 18 },
  { name: "Development", planned: 35, actual: 30 },
  { name: "Testing", planned: 15, actual: 12 },
  { name: "Deployment", planned: 10, actual: 8 },
  { name: "Documentation", planned: 5, actual: 7 },
]

// Sample risk trend data
const riskTrendData = [
  { month: "Dec", high: 5, medium: 8, low: 12 },
  { month: "Jan", high: 7, medium: 10, low: 10 },
  { month: "Feb", high: 4, medium: 12, low: 8 },
  { month: "Mar", high: 3, medium: 9, low: 14 },
  { month: "Apr", high: 2, medium: 7, low: 16 },
  { month: "May", high: 1, medium: 5, low: 18 },
]

export default function ProgressAnalytics({ projectId, projectName }: ProgressAnalyticsProps) {
  const [timeRange, setTimeRange] = useState("6m")
  const [chartType, setChartType] = useState("line")

  // Filter data based on selected time range
  const getFilteredData = () => {
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

    return sampleProgressData.filter((item) => {
      const itemDate = parseISO(item.date)
      return itemDate >= cutoffDate
    })
  }

  const filteredData = getFilteredData()

  // Format date for display
  const formatDate = (dateString: string) => {
    return format(parseISO(dateString), "MMM d")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Progress Analytics</h2>
          <p className="text-gray-600 mt-1">Visualize project progress trends and metrics over time</p>
        </div>
        <div className="flex items-center space-x-2">
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
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="progress" className="space-y-6">
        <TabsList>
          <TabsTrigger value="progress">Progress Trends</TabsTrigger>
          <TabsTrigger value="milestones">Milestone Tracking</TabsTrigger>
          <TabsTrigger value="status">Status Distribution</TabsTrigger>
          <TabsTrigger value="resources">Resource Allocation</TabsTrigger>
          <TabsTrigger value="risks">Risk Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="progress" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Progress Over Time
                  </CardTitle>
                  <CardDescription>Planned vs. actual progress percentage</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant={chartType === "line" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setChartType("line")}
                  >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Line
                  </Button>
                  <Button
                    variant={chartType === "area" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setChartType("area")}
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Area
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
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
                className="h-[400px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === "line" ? (
                    <LineChart data={filteredData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tickFormatter={formatDate} tick={{ fontSize: 12 }} />
                      <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} tick={{ fontSize: 12 }} />
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
                    </LineChart>
                  ) : (
                    <AreaChart data={filteredData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tickFormatter={formatDate} tick={{ fontSize: 12 }} />
                      <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} tick={{ fontSize: 12 }} />
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
                  )}
                </ResponsiveContainer>
              </ChartContainer>

              <div className="mt-6">
                <h4 className="font-medium text-sm mb-2">Key Milestones</h4>
                <div className="flex flex-wrap gap-2">
                  {filteredData
                    .filter((item) => item.milestones && item.milestones.length > 0)
                    .map((item, index) => (
                      <div key={index} className="flex items-center">
                        <Badge variant="outline" className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(item.date)}: {item.milestones.join(", ")}
                        </Badge>
                      </div>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Progress Velocity
                </CardTitle>
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
                    <BarChart
                      data={filteredData
                        .map((item, i, arr) => {
                          if (i === 0) return { ...item, velocity: item.actual }
                          const prevActual = arr[i - 1].actual
                          return {
                            ...item,
                            velocity: Math.max(0, item.actual - prevActual),
                          }
                        })
                        .filter((_, i) => i % 4 === 0)} // Show every 4th week
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tickFormatter={formatDate} tick={{ fontSize: 12 }} />
                      <YAxis tickFormatter={(value) => `${value}%`} tick={{ fontSize: 12 }} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="velocity" fill="var(--color-velocity)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Cumulative Progress
                </CardTitle>
                <CardDescription>Total progress accumulation</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ChartContainer
                  config={{
                    actual: {
                      label: "Actual Progress",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                  className="h-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={filteredData.filter((_, i) => i % 2 === 0)} // Show every other data point
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tickFormatter={formatDate} tick={{ fontSize: 12 }} />
                      <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} tick={{ fontSize: 12 }} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area
                        type="monotone"
                        dataKey="actual"
                        stroke="var(--color-actual)"
                        fill="var(--color-actual)"
                        fillOpacity={0.4}
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="milestones" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Milestone Completion
              </CardTitle>
              <CardDescription>Planned vs. actual milestone dates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Milestone</th>
                      <th className="text-left py-3 px-4">Planned Date</th>
                      <th className="text-left py-3 px-4">Actual Date</th>
                      <th className="text-left py-3 px-4">Variance</th>
                      <th className="text-left py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {milestonesData.map((milestone, index) => {
                      const planned = parseISO(milestone.planned)
                      const actual = milestone.actual ? parseISO(milestone.actual) : null
                      const variance = actual
                        ? Math.round((actual.getTime() - planned.getTime()) / (1000 * 60 * 60 * 24))
                        : null

                      return (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium">{milestone.name}</td>
                          <td className="py-3 px-4">{format(planned, "MMM d, yyyy")}</td>
                          <td className="py-3 px-4">
                            {milestone.actual ? format(parseISO(milestone.actual), "MMM d, yyyy") : "-"}
                          </td>
                          <td className="py-3 px-4">
                            {variance !== null ? (
                              <span
                                className={
                                  variance > 0 ? "text-red-600" : variance < 0 ? "text-green-600" : "text-gray-600"
                                }
                              >
                                {variance > 0 ? "+" : ""}
                                {variance} days
                              </span>
                            ) : (
                              "-"
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <Badge
                              className={
                                milestone.status === "completed"
                                  ? "bg-green-100 text-green-800 border-green-200"
                                  : milestone.status === "in-progress"
                                    ? "bg-blue-100 text-blue-800 border-blue-200"
                                    : "bg-gray-100 text-gray-800 border-gray-200"
                              }
                            >
                              {milestone.status === "completed" ? (
                                <CheckCircle className="h-3 w-3 mr-1" />
                              ) : milestone.status === "in-progress" ? (
                                <Clock className="h-3 w-3 mr-1" />
                              ) : (
                                <Calendar className="h-3 w-3 mr-1" />
                              )}
                              {milestone.status.replace("-", " ")}
                            </Badge>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              <div className="mt-8">
                <h4 className="font-medium mb-4">Milestone Timeline</h4>
                <ChartContainer
                  config={{
                    planned: {
                      label: "Planned Date",
                      color: "hsl(var(--chart-1))",
                    },
                    actual: {
                      label: "Actual Date",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={milestonesData.map((m) => ({
                        name: m.name,
                        planned: parseISO(m.planned).getTime(),
                        actual: m.actual ? parseISO(m.actual).getTime() : null,
                      }))}
                      layout="vertical"
                      margin={{ left: 150 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        type="number"
                        domain={["dataMin", "dataMax"]}
                        tickFormatter={(value) => format(new Date(value), "MMM yyyy")}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={150} />
                      <ChartTooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-white p-3 border rounded shadow-md">
                                <p className="font-medium">{payload[0].payload.name}</p>
                                <p className="text-sm">
                                  <span className="font-medium">Planned:</span>{" "}
                                  {format(new Date(payload[0].payload.planned), "MMM d, yyyy")}
                                </p>
                                {payload[0].payload.actual && (
                                  <p className="text-sm">
                                    <span className="font-medium">Actual:</span>{" "}
                                    {format(new Date(payload[0].payload.actual), "MMM d, yyyy")}
                                  </p>
                                )}
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                      <Legend />
                      <Bar dataKey="planned" fill="var(--color-planned)" />
                      <Bar dataKey="actual" fill="var(--color-actual)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="status" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChartIcon className="h-5 w-5 mr-2" />
                  Status Distribution
                </CardTitle>
                <CardDescription>Current project status breakdown</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={120}
                      innerRadius={60}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {statusDistributionData.map((entry, index) => (
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
                                <span className="font-medium">Value:</span> {payload[0].payload.value}%
                              </p>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Status Trend
                </CardTitle>
                <CardDescription>Status changes over time</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                <ChartContainer
                  config={{
                    onTrack: {
                      label: "On Track",
                      color: "#4ade80",
                    },
                    delayed: {
                      label: "Delayed",
                      color: "#facc15",
                    },
                    atRisk: {
                      label: "At Risk",
                      color: "#f87171",
                    },
                    completed: {
                      label: "Completed",
                      color: "#60a5fa",
                    },
                  }}
                  className="h-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={[
                        { month: "Dec", onTrack: 70, delayed: 20, atRisk: 10, completed: 0 },
                        { month: "Jan", onTrack: 65, delayed: 25, atRisk: 5, completed: 5 },
                        { month: "Feb", onTrack: 60, delayed: 20, atRisk: 10, completed: 10 },
                        { month: "Mar", onTrack: 55, delayed: 15, atRisk: 15, completed: 15 },
                        { month: "Apr", onTrack: 50, delayed: 10, atRisk: 15, completed: 25 },
                        { month: "May", onTrack: 45, delayed: 5, atRisk: 10, completed: 40 },
                      ]}
                      stackOffset="expand"
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} />
                      <Tooltip
                        formatter={(value: any) => [`${(value * 100).toFixed(0)}%`, ""]}
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-white p-3 border rounded shadow-md">
                                <p className="font-medium">{payload[0].payload.month}</p>
                                {payload.map((entry, index) => (
                                  <p key={index} className="text-sm" style={{ color: entry.color }}>
                                    <span className="font-medium">{entry.name}:</span> {(entry.value * 100).toFixed(0)}%
                                  </p>
                                ))}
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="completed"
                        stackId="1"
                        stroke="var(--color-completed)"
                        fill="var(--color-completed)"
                      />
                      <Area
                        type="monotone"
                        dataKey="onTrack"
                        stackId="1"
                        stroke="var(--color-onTrack)"
                        fill="var(--color-onTrack)"
                      />
                      <Area
                        type="monotone"
                        dataKey="delayed"
                        stackId="1"
                        stroke="var(--color-delayed)"
                        fill="var(--color-delayed)"
                      />
                      <Area
                        type="monotone"
                        dataKey="atRisk"
                        stackId="1"
                        stroke="var(--color-atRisk)"
                        fill="var(--color-atRisk)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Resource Allocation
              </CardTitle>
              <CardDescription>Planned vs. actual resource usage</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ChartContainer
                config={{
                  planned: {
                    label: "Planned Allocation",
                    color: "hsl(var(--chart-1))",
                  },
                  actual: {
                    label: "Actual Allocation",
                    color: "hsl(var(--chart-2))",
                  },
                }}
                className="h-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={resourceAllocationData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `${value}%`} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="planned" fill="var(--color-planned)" name="Planned" />
                    <Bar dataKey="actual" fill="var(--color-actual)" name="Actual" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Risk Trend Analysis
              </CardTitle>
              <CardDescription>Risk level distribution over time</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
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
                  <AreaChart data={riskTrendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
                    <Area type="monotone" dataKey="low" stackId="1" stroke="var(--color-low)" fill="var(--color-low)" />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
