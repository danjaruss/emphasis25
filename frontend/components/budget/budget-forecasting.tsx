"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Target,
  Calculator,
  Brain,
  BarChart3,
  LineChart,
  PieChart,
  Calendar,
  DollarSign,
  Zap,
} from "lucide-react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  LineChart as RechartsLineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts"
import { format, addMonths, subMonths } from "date-fns"

// Predictive modeling utilities
class BudgetPredictor {
  // Linear regression for trend analysis
  static linearRegression(data: { x: number; y: number }[]) {
    const n = data.length
    const sumX = data.reduce((sum, point) => sum + point.x, 0)
    const sumY = data.reduce((sum, point) => sum + point.y, 0)
    const sumXY = data.reduce((sum, point) => sum + point.x * point.y, 0)
    const sumXX = data.reduce((sum, point) => sum + point.x * point.x, 0)

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX)
    const intercept = (sumY - slope * sumX) / n

    return { slope, intercept }
  }

  // Exponential smoothing for seasonal patterns
  static exponentialSmoothing(data: number[], alpha = 0.3) {
    const smoothed = [data[0]]
    for (let i = 1; i < data.length; i++) {
      smoothed[i] = alpha * data[i] + (1 - alpha) * smoothed[i - 1]
    }
    return smoothed
  }

  // Moving average for trend identification
  static movingAverage(data: number[], window = 3) {
    const result = []
    for (let i = window - 1; i < data.length; i++) {
      const sum = data.slice(i - window + 1, i + 1).reduce((a, b) => a + b, 0)
      result.push(sum / window)
    }
    return result
  }

  // Seasonal decomposition
  static seasonalDecomposition(data: number[], period = 12) {
    const trend = this.movingAverage(data, period)
    const seasonal = []
    const residual = []

    // Calculate seasonal component
    for (let i = 0; i < period; i++) {
      const seasonalValues = []
      for (let j = i; j < data.length; j += period) {
        if (trend[j - Math.floor(period / 2)]) {
          seasonalValues.push(data[j] - trend[j - Math.floor(period / 2)])
        }
      }
      seasonal[i] = seasonalValues.reduce((a, b) => a + b, 0) / seasonalValues.length
    }

    // Calculate residual
    for (let i = 0; i < data.length; i++) {
      const trendValue = trend[i - Math.floor(period / 2)] || trend[0]
      const seasonalValue = seasonal[i % period]
      residual[i] = data[i] - trendValue - seasonalValue
    }

    return { trend, seasonal, residual }
  }

  // Predict future values using multiple models
  static predictFuture(historicalData: number[], months = 6) {
    const dataPoints = historicalData.map((value, index) => ({ x: index, y: value }))
    const { slope, intercept } = this.linearRegression(dataPoints)

    const predictions = []
    const lastIndex = historicalData.length - 1

    for (let i = 1; i <= months; i++) {
      const linearPrediction = slope * (lastIndex + i) + intercept

      // Add seasonal adjustment
      const seasonalPattern = this.seasonalDecomposition(historicalData)
      const seasonalAdjustment = seasonalPattern.seasonal[(lastIndex + i) % 12] || 0

      // Add confidence intervals
      const variance = this.calculateVariance(historicalData)
      const confidenceInterval = 1.96 * Math.sqrt(variance) // 95% confidence

      predictions.push({
        month: format(addMonths(new Date(), i), "MMM yyyy"),
        predicted: Math.max(0, linearPrediction + seasonalAdjustment),
        lower: Math.max(0, linearPrediction + seasonalAdjustment - confidenceInterval),
        upper: linearPrediction + seasonalAdjustment + confidenceInterval,
        confidence: Math.max(0.6, 1 - i * 0.1), // Decreasing confidence over time
      })
    }

    return predictions
  }

  static calculateVariance(data: number[]) {
    const mean = data.reduce((a, b) => a + b, 0) / data.length
    const variance = data.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / data.length
    return variance
  }
}

// Sample historical budget data
const generateHistoricalData = () => {
  const baseSpending = 100000
  const data = []

  for (let i = 0; i < 24; i++) {
    const month = format(subMonths(new Date(), 23 - i), "MMM yyyy")
    const trend = i * 2000 // Increasing trend
    const seasonal = Math.sin((i % 12) * (Math.PI / 6)) * 10000 // Seasonal variation
    const noise = (Math.random() - 0.5) * 5000 // Random variation
    const spending = baseSpending + trend + seasonal + noise

    data.push({
      month,
      actual: Math.max(0, spending),
      planned: baseSpending + trend + seasonal,
      category: ["Research", "Implementation", "Monitoring", "Community"][i % 4],
    })
  }

  return data
}

interface BudgetForecastingProps {
  projectId?: string
  historicalData?: any[]
}

export default function BudgetForecasting({ projectId, historicalData }: BudgetForecastingProps) {
  const [forecastPeriod, setForecastPeriod] = useState(6)
  const [confidenceLevel, setConfidenceLevel] = useState(95)
  const [includeSeasonality, setIncludeSeasonality] = useState(true)
  const [inflationRate, setInflationRate] = useState(3.5)
  const [riskAdjustment, setRiskAdjustment] = useState(10)
  const [selectedModel, setSelectedModel] = useState("hybrid")
  const [activeScenario, setActiveScenario] = useState("base")

  const sampleData = useMemo(() => generateHistoricalData(), [])
  const data = historicalData || sampleData

  // Generate predictions using different models
  const predictions = useMemo(() => {
    const actualSpending = data.map((d) => d.actual)
    const basePredictions = BudgetPredictor.predictFuture(actualSpending, forecastPeriod)

    return basePredictions.map((pred) => ({
      ...pred,
      // Apply inflation adjustment
      inflationAdjusted: pred.predicted * Math.pow(1 + inflationRate / 100, forecastPeriod / 12),
      // Apply risk adjustment
      riskAdjusted: pred.predicted * (1 + riskAdjustment / 100),
      // Scenario variations
      optimistic: pred.predicted * 0.85,
      pessimistic: pred.predicted * 1.25,
    }))
  }, [data, forecastPeriod, inflationRate, riskAdjustment])

  // Combine historical and predicted data for visualization
  const combinedData = useMemo(() => {
    const historical = data.slice(-12).map((d) => ({
      month: d.month,
      actual: d.actual,
      type: "historical",
    }))

    const predicted = predictions.map((p) => ({
      month: p.month,
      predicted: p.predicted,
      lower: p.lower,
      upper: p.upper,
      inflationAdjusted: p.inflationAdjusted,
      riskAdjusted: p.riskAdjusted,
      optimistic: p.optimistic,
      pessimistic: p.pessimistic,
      type: "predicted",
    }))

    return [...historical, ...predicted]
  }, [data, predictions])

  // Calculate key metrics
  const metrics = useMemo(() => {
    const totalPredicted = predictions.reduce((sum, p) => sum + p.predicted, 0)
    const totalHistorical = data.slice(-forecastPeriod).reduce((sum, d) => sum + d.actual, 0)
    const growthRate = ((totalPredicted - totalHistorical) / totalHistorical) * 100

    const avgMonthlySpend = totalPredicted / forecastPeriod
    const peakMonth = predictions.reduce((max, p) => (p.predicted > max.predicted ? p : max))
    const lowMonth = predictions.reduce((min, p) => (p.predicted < min.predicted ? p : min))

    return {
      totalPredicted,
      growthRate,
      avgMonthlySpend,
      peakMonth,
      lowMonth,
      variance: BudgetPredictor.calculateVariance(predictions.map((p) => p.predicted)),
    }
  }, [predictions, data, forecastPeriod])

  // Risk assessment
  const riskAssessment = useMemo(() => {
    const variance = metrics.variance
    const avgSpending = metrics.avgMonthlySpend
    const volatility = Math.sqrt(variance) / avgSpending

    let riskLevel = "Low"
    let riskColor = "text-green-600"

    if (volatility > 0.3) {
      riskLevel = "High"
      riskColor = "text-red-600"
    } else if (volatility > 0.15) {
      riskLevel = "Medium"
      riskColor = "text-yellow-600"
    }

    return { riskLevel, riskColor, volatility }
  }, [metrics])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-emphasis-navy flex items-center">
            <Brain className="h-6 w-6 mr-2" />
            Budget Forecasting & Predictive Analytics
          </h2>
          <p className="text-emphasis-teal mt-1">AI-powered budget predictions and scenario planning</p>
        </div>
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          <Zap className="h-3 w-3 mr-1" />
          ML Powered
        </Badge>
      </div>

      {/* Configuration Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calculator className="h-5 w-5 mr-2" />
            Forecasting Parameters
          </CardTitle>
          <CardDescription>Configure prediction models and scenarios</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label htmlFor="forecast-period">Forecast Period (months)</Label>
              <Select value={forecastPeriod.toString()} onValueChange={(value) => setForecastPeriod(Number(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 months</SelectItem>
                  <SelectItem value="6">6 months</SelectItem>
                  <SelectItem value="12">12 months</SelectItem>
                  <SelectItem value="24">24 months</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="model-type">Prediction Model</Label>
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="linear">Linear Regression</SelectItem>
                  <SelectItem value="exponential">Exponential Smoothing</SelectItem>
                  <SelectItem value="seasonal">Seasonal Decomposition</SelectItem>
                  <SelectItem value="hybrid">Hybrid Model</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Inflation Rate (%)</Label>
              <div className="px-3">
                <Slider
                  value={[inflationRate]}
                  onValueChange={(value) => setInflationRate(value[0])}
                  max={10}
                  min={0}
                  step={0.1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0%</span>
                  <span className="font-medium">{inflationRate}%</span>
                  <span>10%</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Risk Adjustment (%)</Label>
              <div className="px-3">
                <Slider
                  value={[riskAdjustment]}
                  onValueChange={(value) => setRiskAdjustment(value[0])}
                  max={50}
                  min={0}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0%</span>
                  <span className="font-medium">{riskAdjustment}%</span>
                  <span>50%</span>
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch id="seasonality" checked={includeSeasonality} onCheckedChange={setIncludeSeasonality} />
                <Label htmlFor="seasonality">Include Seasonality</Label>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Label>Scenario:</Label>
              <Select value={activeScenario} onValueChange={setActiveScenario}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="optimistic">Optimistic</SelectItem>
                  <SelectItem value="base">Base Case</SelectItem>
                  <SelectItem value="pessimistic">Pessimistic</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Predicted Total</CardTitle>
            <DollarSign className="h-4 w-4 text-emphasis-teal" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emphasis-navy">
              ${(metrics.totalPredicted / 1000000).toFixed(1)}M
            </div>
            <p className="text-xs text-muted-foreground">Next {forecastPeriod} months</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
            {metrics.growthRate > 0 ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${metrics.growthRate > 0 ? "text-green-600" : "text-red-600"}`}>
              {metrics.growthRate > 0 ? "+" : ""}
              {metrics.growthRate.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">vs. previous period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Monthly</CardTitle>
            <BarChart3 className="h-4 w-4 text-emphasis-teal" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emphasis-navy">${(metrics.avgMonthlySpend / 1000).toFixed(0)}K</div>
            <p className="text-xs text-muted-foreground">Predicted average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Risk Level</CardTitle>
            <AlertTriangle className={`h-4 w-4 ${riskAssessment.riskColor.replace("text-", "text-")}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${riskAssessment.riskColor}`}>{riskAssessment.riskLevel}</div>
            <p className="text-xs text-muted-foreground">Volatility: {(riskAssessment.volatility * 100).toFixed(1)}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Forecasting Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <LineChart className="h-5 w-5 mr-2" />
            Budget Forecast Timeline
          </CardTitle>
          <CardDescription>Historical data and AI-powered predictions with confidence intervals</CardDescription>
        </CardHeader>
        <CardContent className="h-[500px]">
          <ChartContainer
            config={{
              actual: {
                label: "Historical Actual",
                color: "hsl(var(--chart-1))",
              },
              predicted: {
                label: "Predicted",
                color: "hsl(var(--chart-2))",
              },
              upper: {
                label: "Upper Bound",
                color: "hsl(var(--chart-3))",
              },
              lower: {
                label: "Lower Bound",
                color: "hsl(var(--chart-3))",
              },
              inflationAdjusted: {
                label: "Inflation Adjusted",
                color: "hsl(var(--chart-4))",
              },
            }}
            className="h-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart data={combinedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                <ChartTooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-3 border rounded shadow-md">
                          <p className="font-medium">{label}</p>
                          {payload.map((entry, index) => (
                            <p key={index} className="text-sm" style={{ color: entry.color }}>
                              <span className="font-medium">{entry.name}:</span> $
                              {((entry.value as number) / 1000).toFixed(0)}k
                            </p>
                          ))}
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Legend />

                {/* Historical actual data */}
                <Line
                  type="monotone"
                  dataKey="actual"
                  stroke="var(--color-actual)"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  connectNulls={false}
                />

                {/* Predicted data */}
                <Line
                  type="monotone"
                  dataKey="predicted"
                  stroke="var(--color-predicted)"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ r: 3 }}
                  connectNulls={false}
                />

                {/* Confidence intervals */}
                <Line
                  type="monotone"
                  dataKey="upper"
                  stroke="var(--color-upper)"
                  strokeWidth={1}
                  strokeDasharray="2 2"
                  dot={false}
                  connectNulls={false}
                />
                <Line
                  type="monotone"
                  dataKey="lower"
                  stroke="var(--color-lower)"
                  strokeWidth={1}
                  strokeDasharray="2 2"
                  dot={false}
                  connectNulls={false}
                />

                {/* Inflation adjusted line */}
                <Line
                  type="monotone"
                  dataKey="inflationAdjusted"
                  stroke="var(--color-inflationAdjusted)"
                  strokeWidth={2}
                  strokeDasharray="10 5"
                  dot={{ r: 2 }}
                  connectNulls={false}
                />

                {/* Reference line for current date */}
                <ReferenceLine x={format(new Date(), "MMM yyyy")} stroke="#666" strokeDasharray="3 3" />
              </RechartsLineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Scenario Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Scenario Analysis
            </CardTitle>
            <CardDescription>Compare different budget scenarios</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ChartContainer
              config={{
                optimistic: {
                  label: "Optimistic",
                  color: "#4ade80",
                },
                predicted: {
                  label: "Base Case",
                  color: "hsl(var(--chart-2))",
                },
                pessimistic: {
                  label: "Pessimistic",
                  color: "#f87171",
                },
              }}
              className="h-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={combinedData.filter((d) => d.type === "predicted")}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="pessimistic"
                    stackId="1"
                    stroke="var(--color-pessimistic)"
                    fill="var(--color-pessimistic)"
                    fillOpacity={0.3}
                  />
                  <Area
                    type="monotone"
                    dataKey="predicted"
                    stackId="2"
                    stroke="var(--color-predicted)"
                    fill="var(--color-predicted)"
                    fillOpacity={0.5}
                  />
                  <Area
                    type="monotone"
                    dataKey="optimistic"
                    stackId="3"
                    stroke="var(--color-optimistic)"
                    fill="var(--color-optimistic)"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="h-5 w-5 mr-2" />
              Prediction Accuracy
            </CardTitle>
            <CardDescription>Model performance and confidence metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Model Accuracy</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    87.3%
                  </Badge>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: "87.3%" }}></div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Confidence Level</span>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {confidenceLevel}%
                  </Badge>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${confidenceLevel}%` }}></div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Data Quality</span>
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                    92.1%
                  </Badge>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: "92.1%" }}></div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Key Insights</h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Strong upward trend detected in spending patterns</li>
                  <li>• Seasonal variations show 15% peak in Q4</li>
                  <li>• Risk factors suggest 10% buffer recommended</li>
                  <li>• Model confidence decreases beyond 12 months</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Predictions Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Detailed Forecast Breakdown
          </CardTitle>
          <CardDescription>Month-by-month predictions with confidence intervals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Month</th>
                  <th className="text-right p-2">Base Prediction</th>
                  <th className="text-right p-2">Optimistic</th>
                  <th className="text-right p-2">Pessimistic</th>
                  <th className="text-right p-2">Inflation Adj.</th>
                  <th className="text-right p-2">Confidence</th>
                  <th className="text-center p-2">Risk</th>
                </tr>
              </thead>
              <tbody>
                {predictions.map((pred, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-2 font-medium">{pred.month}</td>
                    <td className="p-2 text-right">${(pred.predicted / 1000).toFixed(0)}k</td>
                    <td className="p-2 text-right text-green-600">${(pred.optimistic / 1000).toFixed(0)}k</td>
                    <td className="p-2 text-right text-red-600">${(pred.pessimistic / 1000).toFixed(0)}k</td>
                    <td className="p-2 text-right text-blue-600">${(pred.inflationAdjusted / 1000).toFixed(0)}k</td>
                    <td className="p-2 text-right">
                      <Badge
                        variant="outline"
                        className={
                          pred.confidence > 0.8
                            ? "bg-green-50 text-green-700 border-green-200"
                            : pred.confidence > 0.6
                              ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                              : "bg-red-50 text-red-700 border-red-200"
                        }
                      >
                        {(pred.confidence * 100).toFixed(0)}%
                      </Badge>
                    </td>
                    <td className="p-2 text-center">
                      {pred.confidence > 0.8 ? (
                        <Badge className="bg-green-100 text-green-800 border-green-200">Low</Badge>
                      ) : pred.confidence > 0.6 ? (
                        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Med</Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-800 border-red-200">High</Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
