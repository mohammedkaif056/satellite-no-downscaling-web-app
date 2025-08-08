"use client"

import React, { useState, useEffect } from 'react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { 
  Play, 
  Pause, 
  Square, 
  RotateCcw, 
  Trash2, 
  Download, 
  RefreshCw, 
  ChevronDown, 
  ChevronRight, 
  Filter,
  Clock,
  Cpu,
  MemoryStick,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react'

interface Job {
  id: string
  type: 'prediction' | 'training'
  status: 'pending' | 'running' | 'success' | 'failed'
  progress: number
  started: Date
  duration?: number
  estimatedTimeRemaining?: number
  resourceUsage?: {
    cpu: number
    memory: number
  }
  logs: string[]
  error?: string
  results?: string
}

interface JobQueueMonitorProps {
  jobs?: Job[]
  isAdmin?: boolean
  onCancelJob?: (jobId: string) => void
  onRetryJob?: (jobId: string) => void
  onDeleteJob?: (jobId: string) => void
  onDownloadResults?: (jobId: string) => void
  onRefresh?: () => void
}

const mockJobs: Job[] = [
  {
    id: 'job_001',
    type: 'prediction',
    status: 'running',
    progress: 65,
    started: new Date(Date.now() - 1200000),
    estimatedTimeRemaining: 480,
    resourceUsage: { cpu: 85, memory: 72 },
    logs: [
      'Starting prediction job...',
      'Loading model weights...',
      'Processing satellite data...',
      'Applying downscaling algorithms...'
    ]
  },
  {
    id: 'job_002',
    type: 'training',
    status: 'success',
    progress: 100,
    started: new Date(Date.now() - 3600000),
    duration: 3420,
    logs: [
      'Training job started',
      'Loading training data...',
      'Initializing neural network...',
      'Training completed successfully'
    ],
    results: 'model_v2.1.pkl'
  },
  {
    id: 'job_003',
    type: 'prediction',
    status: 'failed',
    progress: 0,
    started: new Date(Date.now() - 7200000),
    duration: 120,
    logs: [
      'Starting prediction job...',
      'Error: Invalid input data format'
    ],
    error: 'Input satellite data does not match expected schema'
  },
  {
    id: 'job_004',
    type: 'training',
    status: 'pending',
    progress: 0,
    started: new Date(),
    logs: ['Job queued for execution']
  }
]

export default function JobQueueMonitor({
  jobs = mockJobs,
  isAdmin = false,
  onCancelJob,
  onRetryJob,
  onDeleteJob,
  onDownloadResults,
  onRefresh
}: JobQueueMonitorProps) {
  const [filteredJobs, setFilteredJobs] = useState<Job[]>(jobs)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    let filtered = jobs

    if (statusFilter !== 'all') {
      filtered = filtered.filter(job => job.status === statusFilter)
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(job => job.type === typeFilter)
    }

    if (searchQuery) {
      filtered = filtered.filter(job => 
        job.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.type.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredJobs(filtered)
    setCurrentPage(1)
  }, [jobs, statusFilter, typeFilter, searchQuery])

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        onRefresh?.()
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [autoRefresh, onRefresh])

  const getStatusBadge = (status: Job['status']) => {
    const statusConfig = {
      pending: { variant: 'secondary' as const, icon: Clock, color: 'text-slate-500' },
      running: { variant: 'default' as const, icon: Play, color: 'text-blue-500' },
      success: { variant: 'secondary' as const, icon: CheckCircle, color: 'text-green-500' },
      failed: { variant: 'destructive' as const, icon: XCircle, color: 'text-red-500' }
    }

    const config = statusConfig[status]
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className="flex items-center gap-1.5">
        <Icon className={`h-3 w-3 ${config.color}`} />
        <span className="capitalize">{status}</span>
      </Badge>
    )
  }

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '-'
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const formatTimeRemaining = (seconds?: number) => {
    if (!seconds) return '-'
    const minutes = Math.floor(seconds / 60)
    return `~${minutes}m remaining`
  }

  const toggleRowExpansion = (jobId: string) => {
    const newExpandedRows = new Set(expandedRows)
    if (expandedRows.has(jobId)) {
      newExpandedRows.delete(jobId)
    } else {
      newExpandedRows.add(jobId)
    }
    setExpandedRows(newExpandedRows)
  }

  const openJobDetails = (job: Job) => {
    setSelectedJob(job)
    setIsDialogOpen(true)
  }

  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage)

  return (
    <div className="bg-surface space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-text-primary">Job Queue Monitor</h2>
          <Badge variant="secondary" className="flex items-center gap-1">
            {filteredJobs.filter(job => job.status === 'running').length} Running
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center space-x-2">
            <Switch
              id="auto-refresh"
              checked={autoRefresh}
              onCheckedChange={setAutoRefresh}
            />
            <Label htmlFor="auto-refresh" className="text-sm">Auto-refresh</Label>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Search</Label>
          <Input
            placeholder="Search jobs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium">Status</Label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="running">Running</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium">Type</Label>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="prediction">Prediction</SelectItem>
              <SelectItem value="training">Training</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-end">
          <Button variant="outline" size="sm" className="h-9 flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Clear Filters
          </Button>
        </div>
      </div>

      {/* Jobs Table */}
      <div className="border rounded-lg bg-surface">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>Job ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Started</TableHead>
              <TableHead>Duration</TableHead>
              {isAdmin && <TableHead>Resources</TableHead>}
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedJobs.map((job) => (
              <React.Fragment key={job.id}>
                <TableRow className="group">
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleRowExpansion(job.id)}
                      className="p-1 h-6 w-6"
                    >
                      {expandedRows.has(job.id) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{job.id}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {job.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(job.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3 min-w-[120px]">
                      <Progress value={job.progress} className="flex-1" />
                      <span className="text-xs text-muted-foreground min-w-[35px]">
                        {job.progress}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    {job.started.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-sm">
                    <div className="space-y-1">
                      <div>{formatDuration(job.duration)}</div>
                      {job.status === 'running' && job.estimatedTimeRemaining && (
                        <div className="text-xs text-muted-foreground">
                          {formatTimeRemaining(job.estimatedTimeRemaining)}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  {isAdmin && (
                    <TableCell>
                      {job.resourceUsage && (
                        <div className="flex items-center gap-2 text-xs">
                          <div className="flex items-center gap-1">
                            <Cpu className="h-3 w-3" />
                            {job.resourceUsage.cpu}%
                          </div>
                          <div className="flex items-center gap-1">
                            <MemoryStick className="h-3 w-3" />
                            {job.resourceUsage.memory}%
                          </div>
                        </div>
                      )}
                    </TableCell>
                  )}
                  <TableCell className="text-right">
                    <div className="flex items-center gap-1 justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openJobDetails(job)}
                        className="p-2 h-8 w-8"
                      >
                        <AlertCircle className="h-4 w-4" />
                      </Button>
                      
                      {job.status === 'pending' || job.status === 'running' ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onCancelJob?.(job.id)}
                          className="p-2 h-8 w-8 text-destructive hover:text-destructive"
                        >
                          <Square className="h-4 w-4" />
                        </Button>
                      ) : null}
                      
                      {job.status === 'failed' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRetryJob?.(job.id)}
                          className="p-2 h-8 w-8"
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      )}
                      
                      {job.status === 'success' && job.results && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDownloadResults?.(job.id)}
                          className="p-2 h-8 w-8"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                      
                      {(job.status === 'success' || job.status === 'failed') && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDeleteJob?.(job.id)}
                          className="p-2 h-8 w-8 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
                
                {expandedRows.has(job.id) && (
                  <TableRow>
                    <TableCell colSpan={isAdmin ? 9 : 8} className="p-0">
                      <div className="p-4 bg-muted/30 border-t">
                        <div className="space-y-3">
                          <h4 className="font-medium text-sm">Recent Logs</h4>
                          <ScrollArea className="h-24 w-full rounded border bg-surface p-2">
                            <div className="space-y-1">
                              {job.logs.map((log, index) => (
                                <div key={index} className="text-xs font-mono text-muted-foreground">
                                  {log}
                                </div>
                              ))}
                            </div>
                          </ScrollArea>
                          {job.error && (
                            <div className="text-sm text-destructive bg-destructive/10 p-2 rounded border">
                              <strong>Error:</strong> {job.error}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, filteredJobs.length)} of{' '}
            {filteredJobs.length} jobs
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className="w-8 h-8 p-0"
                  >
                    {page}
                  </Button>
                )
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Job Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] bg-surface">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              Job Details: {selectedJob?.id}
              {selectedJob && getStatusBadge(selectedJob.status)}
            </DialogTitle>
          </DialogHeader>
          
          {selectedJob && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Type</Label>
                  <p className="text-sm text-muted-foreground capitalize">
                    {selectedJob.type}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Started</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedJob.started.toLocaleString()}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Progress</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Progress value={selectedJob.progress} className="flex-1" />
                    <span className="text-sm text-muted-foreground">
                      {selectedJob.progress}%
                    </span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Duration</Label>
                  <p className="text-sm text-muted-foreground">
                    {formatDuration(selectedJob.duration)}
                  </p>
                </div>
              </div>

              {selectedJob.resourceUsage && isAdmin && (
                <div>
                  <Label className="text-sm font-medium">Resource Usage</Label>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-1">
                          <Cpu className="h-3 w-3" />
                          CPU
                        </span>
                        <span>{selectedJob.resourceUsage.cpu}%</span>
                      </div>
                      <Progress value={selectedJob.resourceUsage.cpu} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-1">
                          <MemoryStick className="h-3 w-3" />
                          Memory
                        </span>
                        <span>{selectedJob.resourceUsage.memory}%</span>
                      </div>
                      <Progress value={selectedJob.resourceUsage.memory} />
                    </div>
                  </div>
                </div>
              )}

              <div>
                <Label className="text-sm font-medium">Full Logs</Label>
                <ScrollArea className="h-48 w-full mt-2 rounded border bg-muted/30 p-3">
                  <div className="space-y-2">
                    {selectedJob.logs.map((log, index) => (
                      <div key={index} className="text-xs font-mono">
                        <span className="text-muted-foreground mr-2">
                          [{new Date().toLocaleTimeString()}]
                        </span>
                        {log}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              {selectedJob.error && (
                <div>
                  <Label className="text-sm font-medium text-destructive">Error Message</Label>
                  <div className="text-sm text-destructive bg-destructive/10 p-3 rounded border mt-2">
                    {selectedJob.error}
                  </div>
                </div>
              )}

              {selectedJob.results && (
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded border">
                  <div>
                    <Label className="text-sm font-medium">Results Available</Label>
                    <p className="text-sm text-muted-foreground">{selectedJob.results}</p>
                  </div>
                  <Button
                    onClick={() => onDownloadResults?.(selectedJob.id)}
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}