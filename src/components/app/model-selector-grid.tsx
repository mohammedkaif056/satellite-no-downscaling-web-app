"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  Brain, 
  Cpu, 
  TrendingUp, 
  Info, 
  Filter, 
  Search,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Zap,
  BarChart3
} from 'lucide-react'

interface PerformanceMetrics {
  rmse: number
  mae: number
  r2: number
  accuracy?: number
}

interface ModelData {
  id: string
  name: string
  version: string
  description: string
  type: 'CNN' | 'LSTM' | 'Transformer' | 'Hybrid'
  status: 'active' | 'training' | 'deprecated'
  metrics: PerformanceMetrics
  supportedResolutions: Array<'1km' | '500m' | '250m'>
  trainingData: string
  lastUpdated: string
  computeTime: number // in minutes
  memoryUsage: string
  compatibility: string[]
}

interface ModelSelectorGridProps {
  onModelSelect: (modelId: string, resolution: string) => void
  selectedModel?: string
  selectedResolution?: string
  uploadedDataType?: string
  isLoading?: boolean
  models?: ModelData[]
}

const mockModels: ModelData[] = [
  {
    id: 'conv-resnet-v2',
    name: 'ConvResNet',
    version: 'v2.1',
    description: 'Deep residual convolutional network optimized for satellite NO₂ downscaling with attention mechanisms.',
    type: 'CNN',
    status: 'active',
    metrics: { rmse: 0.124, mae: 0.089, r2: 0.912 },
    supportedResolutions: ['1km', '500m', '250m'],
    trainingData: 'TROPOMI + Landsat 8 (2018-2023)',
    lastUpdated: '2024-01-15',
    computeTime: 3.2,
    memoryUsage: '2.4 GB',
    compatibility: ['TROPOMI', 'OMI', 'MODIS']
  },
  {
    id: 'lstm-attention-v1',
    name: 'LSTM-Attention',
    version: 'v1.5',
    description: 'Long short-term memory network with spatial attention for temporal NO₂ pattern modeling.',
    type: 'LSTM',
    status: 'active',
    metrics: { rmse: 0.138, mae: 0.095, r2: 0.895 },
    supportedResolutions: ['1km', '500m'],
    trainingData: 'Multi-sensor time series (2019-2023)',
    lastUpdated: '2024-01-10',
    computeTime: 5.7,
    memoryUsage: '3.1 GB',
    compatibility: ['TROPOMI', 'OMI']
  },
  {
    id: 'transformer-v3',
    name: 'EarthFormer',
    version: 'v3.0',
    description: 'Vision transformer architecture with Earth-specific inductive biases for atmospheric data.',
    type: 'Transformer',
    status: 'training',
    metrics: { rmse: 0.112, mae: 0.081, r2: 0.925 },
    supportedResolutions: ['500m', '250m'],
    trainingData: 'TROPOMI + Sentinel-2 (2020-2024)',
    lastUpdated: '2024-01-20',
    computeTime: 8.1,
    memoryUsage: '4.8 GB',
    compatibility: ['TROPOMI', 'Sentinel-2']
  },
  {
    id: 'hybrid-ensemble-v1',
    name: 'Hybrid Ensemble',
    version: 'v1.2',
    description: 'Ensemble of CNN and LSTM models with adaptive weighting based on input characteristics.',
    type: 'Hybrid',
    status: 'active',
    metrics: { rmse: 0.106, mae: 0.076, r2: 0.934 },
    supportedResolutions: ['1km', '500m', '250m'],
    trainingData: 'Multi-source ensemble dataset',
    lastUpdated: '2024-01-18',
    computeTime: 12.3,
    memoryUsage: '6.2 GB',
    compatibility: ['TROPOMI', 'OMI', 'MODIS', 'Sentinel-2']
  },
  {
    id: 'legacy-cnn-v1',
    name: 'Legacy CNN',
    version: 'v1.0',
    description: 'First generation convolutional neural network model. Maintained for compatibility.',
    type: 'CNN',
    status: 'deprecated',
    metrics: { rmse: 0.186, mae: 0.142, r2: 0.834 },
    supportedResolutions: ['1km'],
    trainingData: 'TROPOMI baseline (2018-2020)',
    lastUpdated: '2023-06-15',
    computeTime: 2.1,
    memoryUsage: '1.2 GB',
    compatibility: ['TROPOMI']
  }
]

export default function ModelSelectorGrid({
  onModelSelect,
  selectedModel,
  selectedResolution = '1km',
  uploadedDataType,
  isLoading = false,
  models = mockModels
}: ModelSelectorGridProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('active')
  const [hoveredModel, setHoveredModel] = useState<string | null>(null)

  const filteredModels = models.filter(model => {
    const matchesSearch = model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         model.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === 'all' || model.type === typeFilter
    const matchesStatus = statusFilter === 'all' || model.status === statusFilter
    const isCompatible = !uploadedDataType || model.compatibility.includes(uploadedDataType)
    
    return matchesSearch && matchesType && matchesStatus && isCompatible
  })

  const getStatusBadge = (status: ModelData['status']) => {
    const variants = {
      active: { variant: 'default' as const, icon: CheckCircle, color: 'text-emerald-600' },
      training: { variant: 'secondary' as const, icon: Clock, color: 'text-amber-600' },
      deprecated: { variant: 'outline' as const, icon: XCircle, color: 'text-red-600' }
    }
    const { variant, icon: Icon, color } = variants[status]
    
    return (
      <Badge variant={variant} className="capitalize">
        <Icon className={`w-3 h-3 mr-1 ${color}`} />
        {status}
      </Badge>
    )
  }

  const getTypeIcon = (type: ModelData['type']) => {
    const icons = {
      CNN: Brain,
      LSTM: TrendingUp,
      Transformer: Zap,
      Hybrid: Cpu
    }
    return icons[type]
  }

  const formatMetric = (value: number, decimals: number = 3) => {
    return value.toFixed(decimals)
  }

  if (isLoading) {
    return (
      <div className="bg-surface p-6 space-y-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full mb-4" />
                <Skeleton className="h-8 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (filteredModels.length === 0) {
    return (
      <div className="bg-surface p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search models..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="CNN">CNN</SelectItem>
              <SelectItem value="LSTM">LSTM</SelectItem>
              <SelectItem value="Transformer">Transformer</SelectItem>
              <SelectItem value="Hybrid">Hybrid</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="training">Training</SelectItem>
              <SelectItem value="deprecated">Deprecated</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <Brain className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No Models Found</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            No models match your current filters. Try adjusting your search criteria or check back later for new models.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery('')
              setTypeFilter('all')
              setStatusFilter('active')
            }}
            className="mt-4"
          >
            Clear Filters
          </Button>
        </div>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className="bg-surface p-6 space-y-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search models..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-32">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="CNN">CNN</SelectItem>
              <SelectItem value="LSTM">LSTM</SelectItem>
              <SelectItem value="Transformer">Transformer</SelectItem>
              <SelectItem value="Hybrid">Hybrid</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="training">Training</SelectItem>
              <SelectItem value="deprecated">Deprecated</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results count */}
        <div className="text-sm text-muted-foreground">
          Showing {filteredModels.length} of {models.length} models
          {uploadedDataType && (
            <span className="ml-2 text-accent">
              • Compatible with {uploadedDataType}
            </span>
          )}
        </div>

        {/* Model Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModels.map((model) => {
            const TypeIcon = getTypeIcon(model.type)
            const isSelected = selectedModel === model.id
            const isHovered = hoveredModel === model.id

            return (
              <Card 
                key={model.id}
                className={`relative cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  isSelected ? 'ring-2 ring-primary shadow-lg' : 'hover:shadow-md'
                } ${model.status === 'deprecated' ? 'opacity-75' : ''}`}
                onMouseEnter={() => setHoveredModel(model.id)}
                onMouseLeave={() => setHoveredModel(null)}
                onClick={() => onModelSelect(model.id, selectedResolution)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <TypeIcon className="w-5 h-5 text-accent" />
                      <div>
                        <CardTitle className="text-lg font-semibold">
                          {model.name}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {model.version}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      {getStatusBadge(model.status)}
                      <Badge variant="outline" className="text-xs">
                        {model.type}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {model.description}
                  </p>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Performance Metrics */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <BarChart3 className="w-4 h-4" />
                      Performance Metrics
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="text-center p-2 bg-muted/50 rounded">
                            <div className="text-xs text-muted-foreground">RMSE</div>
                            <div className="font-mono text-sm font-medium">
                              {formatMetric(model.metrics.rmse)}
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          Root Mean Square Error (lower is better)
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="text-center p-2 bg-muted/50 rounded">
                            <div className="text-xs text-muted-foreground">MAE</div>
                            <div className="font-mono text-sm font-medium">
                              {formatMetric(model.metrics.mae)}
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          Mean Absolute Error (lower is better)
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="text-center p-2 bg-muted/50 rounded">
                            <div className="text-xs text-muted-foreground">R²</div>
                            <div className="font-mono text-sm font-medium">
                              {formatMetric(model.metrics.r2)}
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          R-squared coefficient (higher is better)
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>

                  {/* Resolution Selection */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Resolution</Label>
                    <RadioGroup
                      value={isSelected ? selectedResolution : model.supportedResolutions[0]}
                      onValueChange={(value) => onModelSelect(model.id, value)}
                      className="flex gap-4"
                    >
                      {['1km', '500m', '250m'].map((resolution) => (
                        <div key={resolution} className="flex items-center space-x-2">
                          <RadioGroupItem
                            value={resolution}
                            id={`${model.id}-${resolution}`}
                            disabled={!model.supportedResolutions.includes(resolution as any)}
                            className={!model.supportedResolutions.includes(resolution as any) ? 'opacity-50' : ''}
                          />
                          <Label
                            htmlFor={`${model.id}-${resolution}`}
                            className={`text-sm cursor-pointer ${
                              !model.supportedResolutions.includes(resolution as any) 
                                ? 'opacity-50 cursor-not-allowed' 
                                : ''
                            }`}
                          >
                            {resolution}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  {/* Hover Details */}
                  {isHovered && (
                    <div className="absolute inset-0 bg-surface/95 backdrop-blur-sm p-4 rounded-lg border">
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center gap-2 font-medium">
                          <Info className="w-4 h-4" />
                          Technical Details
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Training Data:</span>
                            <span className="font-mono text-xs">{model.trainingData}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Compute Time:</span>
                            <span className="font-mono">{model.computeTime}min</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Memory:</span>
                            <span className="font-mono">{model.memoryUsage}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Updated:</span>
                            <span>{model.lastUpdated}</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground mb-1">Compatible with:</div>
                          <div className="flex flex-wrap gap-1">
                            {model.compatibility.map((comp) => (
                              <Badge key={comp} variant="secondary" className="text-xs">
                                {comp}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Selection Indicator */}
                  {isSelected && (
                    <div className="absolute top-2 right-2">
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-primary-foreground" />
                      </div>
                    </div>
                  )}

                  {/* Disabled Overlay */}
                  {model.status === 'deprecated' && (
                    <div className="absolute inset-0 bg-surface/80 backdrop-blur-sm flex items-center justify-center rounded-lg">
                      <div className="text-center">
                        <AlertCircle className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground font-medium">
                          Deprecated Model
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Not recommended for new projects
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </TooltipProvider>
  )
}