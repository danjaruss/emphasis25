"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Brain, TrendingUp, AlertTriangle, Download, Share2, Settings, Zap, Target, BarChart3 } from "lucide-react"
import BudgetForecasting from "@/components/budget/budget-forecasting"
import { apiClient } from "@/lib/api"

export default function BudgetForecastingPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [projects, setProjects] = useState<any[]>([])
  const [selectedProject, setSelectedProject] = useState<string>("all")
  const [activeTab, setActiveTab] = useState("forecasting")

  // Fetch projects data
  useEffect(() => {
    async function fetchProjects() {
      try {
        setIsLoading(true)
        const { data, error } = await getProjects()

        if (error) {
          console.error("Error fetching projects:", error)
          return
        }

        if (data) {
          setProjects(data)
        }
      } catch (error) {
        console.error("Error in fetchProjects:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjects()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-emphasis-navy flex items-center">
            <Brain className="h-8 w-8 mr-3" />
            Budget Forecasting
          </h1>
          <p className="text-emphasis-teal mt-2">AI-powered predictive analytics for budget planning</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select Project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Configure
          </Button>

          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>

          <Button size="sm" className="bg-emphasis-teal hover:bg-emphasis-navy">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Accuracy</CardTitle>
            <Zap className="h-4 w-4 text-emphasis-teal" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold text-emphasis-navy">87.3%</div>
                <p className="text-xs text-muted-foreground">Model performance</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Forecast Horizon</CardTitle>
            <Target className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold text-emphasis-navy">12</div>
                <p className="text-xs text-muted-foreground">Months ahead</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Predicted Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold text-green-600">+12.5%</div>
                <p className="text-xs text-muted-foreground">Next 6 months</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Risk Level</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold text-yellow-600">Medium</div>
                <p className="text-xs text-muted-foreground">Budget volatility</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-1 md:grid-cols-4 w-full">
          <TabsTrigger value="forecasting">AI Forecasting</TabsTrigger>
          <TabsTrigger value="scenarios">Scenario Planning</TabsTrigger>
          <TabsTrigger value="models">Model Performance</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        {/* AI Forecasting Tab */}
        <TabsContent value="forecasting" className="space-y-6">
          {isLoading ? (
            <div className="space-y-6">
              <Skeleton className="h-[200px] w-full" />
              <Skeleton className="h-[400px] w-full" />
              <Skeleton className="h-[300px] w-full" />
            </div>
          ) : (
            <BudgetForecasting projectId={selectedProject === "all" ? undefined : selectedProject} />
          )}
        </TabsContent>

        {/* Scenario Planning Tab */}
        <TabsContent value="scenarios" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2" />
                Budget Scenario Planning
              </CardTitle>
              <CardDescription>Compare different budget scenarios and their implications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-green-200 bg-green-50">
                  <CardHeader>
                    <CardTitle className="text-green-800 flex items-center">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Optimistic Scenario
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Total Budget:</span>
                        <span className="font-bold text-green-700">$2.1M</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Growth Rate:</span>
                        <span className="font-bold text-green-700">+8.5%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Risk Level:</span>
                        <Badge className="bg-green-100 text-green-800 border-green-200">Low</Badge>
                      </div>
                      <div className="text-xs text-green-600 mt-2">
                        Assumes favorable market conditions and efficient resource utilization
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-blue-200 bg-blue-50">
                  <CardHeader>
                    <CardTitle className="text-blue-800 flex items-center">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Base Case Scenario
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Total Budget:</span>
                        <span className="font-bold text-blue-700">$2.5M</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Growth Rate:</span>
                        <span className="font-bold text-blue-700">+12.5%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Risk Level:</span>
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200">Medium</Badge>
                      </div>
                      <div className="text-xs text-blue-600 mt-2">
                        Most likely scenario based on current trends and historical data
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-red-200 bg-red-50">
                  <CardHeader>
                    <CardTitle className="text-red-800 flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Pessimistic Scenario
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Total Budget:</span>
                        <span className="font-bold text-red-700">$3.1M</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Growth Rate:</span>
                        <span className="font-bold text-red-700">+25.0%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Risk Level:</span>
                        <Badge className="bg-red-100 text-red-800 border-red-200">High</Badge>
                      </div>
                      <div className="text-xs text-red-600 mt-2">
                        Accounts for potential delays, cost overruns, and market volatility
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Model Performance Tab */}
        <TabsContent value="models" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="h-5 w-5 mr-2" />
                AI Model Performance
              </CardTitle>
              <CardDescription>Detailed analysis of prediction model accuracy and reliability</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Model Accuracy Metrics</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Mean Absolute Error</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        4.2%
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Root Mean Square Error</span>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        6.8%
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">R-squared Score</span>
                      <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                        0.873
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Prediction Confidence</span>
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                        87.3%
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Model Features</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span>Linear Regression</span>
                      <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Seasonal Decomposition</span>
                      <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Exponential Smoothing</span>
                      <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Risk Adjustment</span>
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Inflation Modeling</span>
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200">Enabled</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="h-5 w-5 mr-2" />
                AI-Generated Insights
              </CardTitle>
              <CardDescription>Intelligent recommendations based on budget analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border-blue-200 bg-blue-50">
                    <CardHeader>
                      <CardTitle className="text-blue-800 text-lg">Key Findings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm text-blue-700">
                        <li>• Budget growth trending 12.5% above historical average</li>
                        <li>• Seasonal peaks detected in Q4 (November-December)</li>
                        <li>• Implementation costs showing 8% variance from plan</li>
                        <li>• Risk factors suggest 10% contingency buffer needed</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-green-200 bg-green-50">
                    <CardHeader>
                      <CardTitle className="text-green-800 text-lg">Recommendations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm text-green-700">
                        <li>• Increase Q4 budget allocation by 15%</li>
                        <li>• Consider early procurement to avoid price inflation</li>
                        <li>• Implement monthly budget reviews for better control</li>
                        <li>• Establish contingency fund of $250K minimum</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <Card className="border-yellow-200 bg-yellow-50">
                  <CardHeader>
                    <CardTitle className="text-yellow-800 text-lg">Risk Alerts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-yellow-800">High Volatility Detected</p>
                          <p className="text-sm text-yellow-700">
                            Budget variance has increased 23% in the last quarter. Consider implementing tighter
                            controls.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-yellow-800">Inflation Impact</p>
                          <p className="text-sm text-yellow-700">
                            Current inflation rate of 3.5% may impact future costs. Budget adjustments recommended.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
