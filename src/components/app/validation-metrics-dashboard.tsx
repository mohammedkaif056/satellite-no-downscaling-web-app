"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Download,
  BarChart3,
  ScatterChart,
  Map,
  FileText,
  Loader2,
  Info,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  ScatterChart as RechartsScatter,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
  PieChart,
  Pie
} from 'recharts'

interface ValidationMetric {
  id: string
  name: string
  value: number
  unit: string
  trend: 'up' | 'down' | 'stable'
  trendValue: number
  confidence?: number
  significance?: 'high' | 'medium' | 'low'
}

interface ErrorDistribution {
  range: string
  count: number
  percentage: number
}

interface ScatterPoint {
  predicted: number
  observed: number
  residual: number
  region?: string
}

interface RegionalPerformance {
  region: string
  rmse: number
  mae: number
  r2: number
  sampleSize: number
  status: 'excellent' | 'good' | 'fair' | 'poor'
}

interface SpatialError {
  lat: number
  lng: number
  residual: number
  magnitude: 'low' | 'medium' | 'high'
}

interface ValidationDashboardProps {
  modelId?: string
  validationData?: any[]
  onExport?: (format: 'pdf' | 'csv' | 'json') => void
  onMetricSelect?: (metricId: string) => void
  compareModels?: boolean
  isLoading?: boolean
}

const ValidationMetricsDashboard = ({
  modelId,
  validationData = [],
  onExport,
  onMetricSelect,
  compareModels = false,
  isLoading = false
}: ValidationDashboardProps) => {
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
  const [zoomedChart, setZoomedChart] = useState<string | null>(null)

  // Mock data - in real implementation, this would come from props or API
  const metrics: ValidationMetric[] = [
    {
      id: 'rmse',
      name: 'RMSE',
      value: 2.34,
      unit: 'μg/m³',
      trend: 'down',
      trendValue: -0.12,
      confidence: 95,
      significance: 'high'
    },
    {
      id: 'mae',
      name: 'MAE',
      value: 1.87,
      unit: 'μg/m³',
      trend: 'down',
      trendValue: -0.08,
      confidence: 92,
      significance: 'high'
    },
    {
      id: 'r2',
      name: 'R²',
      value: 0.876,
      unit: '',
      trend: 'up',
      trendValue: 0.023,
      confidence: 89,
      significance: 'medium'
    },
    {
      id: 'bias',
      name: 'Bias',
      value: 0.15,
      unit: 'μg/m³',
      trend: 'stable',
      trendValue: 0.02,
      confidence: 87,
      significance: 'low'
    }
  ]

  const errorDistribution: ErrorDistribution[] = [
    { range: '-5 to -3', count: 23, percentage: 4.2 },
    { range: '-3 to -1', count: 89, percentage: 16.3 },
    { range: '-1 to 1', count: 312, percentage: 57.1 },
    { range: '1 to 3', count: 98, percentage: 17.9 },
    { range: '3 to 5', count: 24, percentage: 4.4 }
  ]

  const scatterData: ScatterPoint[] = Array.from({ length: 500 }, (_, i) => {
    const observed = Math.random() * 40 + 5
    const predicted = observed + (Math.random() - 0.5) * 6
    return {
      predicted,
      observed,
      residual: predicted - observed,
      region: ['North', 'South', 'East', 'West', 'Central'][Math.floor(Math.random() * 5)]
    }
  })

  const regionalPerformance: RegionalPerformance[] = [
    { region: 'North America', rmse: 2.1, mae: 1.6, r2: 0.89, sampleSize: 1250, status: 'excellent' },
    { region: 'Europe', rmse: 1.9, mae: 1.4, r2: 0.92, sampleSize: 980, status: 'excellent' },
    { region: 'Asia', rmse: 2.8, mae: 2.2, r2: 0.81, sampleSize: 1840, status: 'good' },
    { region: 'South America', rmse: 3.2, mae: 2.5, r2: 0.76, sampleSize: 620, status: 'fair' },
    { region: 'Africa', rmse: 3.8, mae: 3.1, r2: 0.68, sampleSize: 450, status: 'poor' }
  ]

  const spatialErrors: SpatialError[] = Array.from({ length: 200 }, (_, i) => ({
    lat: Math.random() * 180 - 90,
    lng: Math.random() * 360 - 180,
    residual: (Math.random() - 0.5) * 8,
    magnitude: Math.abs(Math.random() - 0.5) > 0.3 ? 'high' : Math.abs(Math.random() - 0.5) > 0.15 ? 'medium' : 'low'
  }))

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-primary" />
      case 'down':
        return <TrendingDown className="h-4 w-4 text-primary" />
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'bg-primary/10 text-primary border-primary/20'
      case 'good':
        return 'bg-accent/10 text-accent border-accent/20'
      case 'fair':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'poor':
        return 'bg-destructive/10 text-destructive border-destructive/20'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  const handleExport = (format: 'pdf' | 'csv' | 'json') => {
    if (onExport) {
      onExport(format)
    }
  }

  if (isLoading) {
    return (
      <div className="bg-surface min-h-screen p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-text-secondary">Calculating validation metrics...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-surface min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-text-primary">Validation Metrics Dashboard</h1>
            <p className="text-text-secondary mt-2">
              Comprehensive analysis of model performance and validation results
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={() => handleExport('pdf')}
              className="flex items-center space-x-2"
            >
              <FileText className="h-4 w-4" />
              <span>Export Report</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => handleExport('csv')}
              className="flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Export Data</span>
            </Button>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric) => (
            <Card 
              key={metric.id} 
              className="bg-card cursor-pointer hover:shadow-lg transition-shadow duration-200"
              onClick={() => onMetricSelect?.(metric.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-text-secondary">
                    {metric.name}
                  </CardTitle>
                  {getTrendIcon(metric.trend)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-text-primary">
                    {metric.value.toFixed(metric.id === 'r2' ? 3 : 2)}
                    <span className="text-lg text-text-secondary ml-1">{metric.unit}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-secondary">
                      {metric.trend === 'up' ? '+' : metric.trend === 'down' ? '' : '±'}
                      {Math.abs(metric.trendValue).toFixed(3)}
                    </span>
                    {metric.confidence && (
                      <span className="text-text-secondary">
                        {metric.confidence}% CI
                      </span>
                    )}
                  </div>
                  {metric.significance && (
                    <div className="flex items-center space-x-2">
                      {metric.significance === 'high' ? (
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                      ) : metric.significance === 'medium' ? (
                        <Info className="h-4 w-4 text-accent" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-yellow-500" />
                      )}
                      <span className="text-xs text-text-secondary capitalize">
                        {metric.significance} significance
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="scatter" className="flex items-center space-x-2">
              <ScatterChart className="h-4 w-4" />
              <span className="hidden sm:inline">Scatter Plot</span>
            </TabsTrigger>
            <TabsTrigger value="spatial" className="flex items-center space-x-2">
              <Map className="h-4 w-4" />
              <span className="hidden sm:inline">Spatial</span>
            </TabsTrigger>
            <TabsTrigger value="regional" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Regional</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Error Distribution */}
            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  <span>Error Distribution</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={errorDistribution}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="range" />
                      <YAxis />
                      <Tooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
                                <p className="font-semibold">{`Range: ${label} μg/m³`}</p>
                                <p className="text-primary">{`Count: ${payload[0].value}`}</p>
                                <p className="text-text-secondary">{`Percentage: ${errorDistribution.find(d => d.range === label)?.percentage}%`}</p>
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                      <Bar dataKey="count" fill="#16a34a" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Confidence Intervals */}
            <Card className="bg-card">
              <CardHeader>
                <CardTitle>Confidence Intervals & Uncertainty</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {metrics.slice(0, 2).map((metric) => (
                    <div key={metric.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{metric.name}</span>
                        <span className="text-sm text-text-secondary">{metric.confidence}% CI</span>
                      </div>
                      <div className="relative">
                        <Progress 
                          value={(metric.confidence || 0)} 
                          className="h-2"
                        />
                        <div className="flex justify-between text-xs text-text-secondary mt-1">
                          <span>{(metric.value - 0.2).toFixed(2)}</span>
                          <span className="font-medium">{metric.value.toFixed(2)}</span>
                          <span>{(metric.value + 0.2).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scatter" className="space-y-6">
            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ScatterChart className="h-5 w-5 text-primary" />
                  <span>Predicted vs Observed Values</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsScatter data={scatterData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        type="number" 
                        dataKey="observed" 
                        name="Observed"
                        domain={['dataMin - 2', 'dataMax + 2']}
                      />
                      <YAxis 
                        type="number" 
                        dataKey="predicted" 
                        name="Predicted"
                        domain={['dataMin - 2', 'dataMax + 2']}
                      />
                      <Tooltip
                        cursor={{ strokeDasharray: '3 3' }}
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload
                            return (
                              <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
                                <p className="font-semibold">Data Point</p>
                                <p className="text-primary">{`Observed: ${data.observed.toFixed(2)}`}</p>
                                <p className="text-accent">{`Predicted: ${data.predicted.toFixed(2)}`}</p>
                                <p className="text-text-secondary">{`Residual: ${data.residual.toFixed(2)}`}</p>
                                {data.region && <p className="text-text-secondary">{`Region: ${data.region}`}</p>}
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                      <Scatter dataKey="predicted" fill="#16a34a" fillOpacity={0.6} />
                      <ReferenceLine 
                        segment={[{ x: 0, y: 0 }, { x: 50, y: 50 }]} 
                        stroke="#64748b" 
                        strokeDasharray="5 5"
                      />
                    </RechartsScatter>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="spatial" className="space-y-6">
            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Map className="h-5 w-5 text-primary" />
                  <span>Spatial Error Distribution</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-12 bg-muted rounded-lg">
                    <Map className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-text-secondary">Interactive spatial error map would be rendered here</p>
                    <p className="text-sm text-text-secondary mt-2">
                      Showing {spatialErrors.length} validation points with color-coded residuals
                    </p>
                  </div>
                  
                  {/* Error Magnitude Legend */}
                  <div className="flex items-center justify-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-primary rounded-full"></div>
                      <span className="text-sm">Low Error (&lt; 1.5 μg/m³)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-accent rounded-full"></div>
                      <span className="text-sm">Medium Error (1.5-3.0 μg/m³)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-destructive rounded-full"></div>
                      <span className="text-sm">High Error (&gt; 3.0 μg/m³)</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="regional" className="space-y-6">
            <Card className="bg-card">
              <CardHeader>
                <CardTitle>Regional Performance Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Region</TableHead>
                        <TableHead className="text-right">RMSE</TableHead>
                        <TableHead className="text-right">MAE</TableHead>
                        <TableHead className="text-right">R²</TableHead>
                        <TableHead className="text-right">Sample Size</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {regionalPerformance.map((region) => (
                        <TableRow 
                          key={region.region}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => setSelectedRegion(region.region)}
                        >
                          <TableCell className="font-medium">{region.region}</TableCell>
                          <TableCell className="text-right font-mono">{region.rmse.toFixed(2)}</TableCell>
                          <TableCell className="text-right font-mono">{region.mae.toFixed(2)}</TableCell>
                          <TableCell className="text-right font-mono">{region.r2.toFixed(3)}</TableCell>
                          <TableCell className="text-right">{region.sampleSize.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(region.status)}>
                              {region.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Model Comparison Table (if compareModels is true) */}
            {compareModels && (
              <Card className="bg-card">
                <CardHeader>
                  <CardTitle>Model Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center p-8 bg-muted rounded-lg">
                    <p className="text-text-secondary">Model comparison table would be rendered here</p>
                    <p className="text-sm text-text-secondary mt-2">
                      Side-by-side performance metrics for multiple models
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default ValidationMetricsDashboard