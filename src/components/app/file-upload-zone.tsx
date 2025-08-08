"use client"

import { useState, useCallback, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Cloud, Upload, X, FileText, AlertCircle, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'

interface UploadFile extends File {
  id: string
  progress: number
  status: 'uploading' | 'completed' | 'error'
  error?: string
}

interface FileUploadZoneProps {
  onFilesUploaded: (files: File[]) => void
  onUploadProgress?: (fileId: string, progress: number) => void
  onUploadComplete?: (fileId: string) => void
  onUploadError?: (fileId: string, error: string) => void
  maxFileSize?: number
  acceptedFormats?: string[]
  className?: string
}

const SUPPORTED_FORMATS = ['.nc', '.tif', '.tiff', '.csv']
const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100MB
const FORMAT_DESCRIPTIONS = {
  '.nc': 'NetCDF files',
  '.tif': 'GeoTIFF files',
  '.tiff': 'GeoTIFF files',
  '.csv': 'CSV files'
}

export default function FileUploadZone({
  onFilesUploaded,
  onUploadProgress,
  onUploadComplete,
  onUploadError,
  maxFileSize = MAX_FILE_SIZE,
  acceptedFormats = SUPPORTED_FORMATS,
  className = ''
}: FileUploadZoneProps) {
  const [isDragActive, setIsDragActive] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<UploadFile[]>([])
  const [isHovered, setIsHovered] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): { isValid: boolean; error?: string } => {
    const extension = '.' + file.name.split('.').pop()?.toLowerCase()
    
    if (!acceptedFormats.includes(extension)) {
      return { 
        isValid: false, 
        error: `Unsupported format. Please use: ${acceptedFormats.join(', ')}` 
      }
    }
    
    if (file.size > maxFileSize) {
      return { 
        isValid: false, 
        error: `File too large. Maximum size: ${(maxFileSize / (1024 * 1024)).toFixed(0)}MB` 
      }
    }
    
    return { isValid: true }
  }

  const simulateUpload = (file: UploadFile) => {
    const uploadInterval = setInterval(() => {
      setUploadedFiles(prev => 
        prev.map(f => {
          if (f.id === file.id && f.status === 'uploading') {
            const newProgress = Math.min(f.progress + Math.random() * 20, 100)
            onUploadProgress?.(f.id, newProgress)
            
            if (newProgress >= 100) {
              clearInterval(uploadInterval)
              onUploadComplete?.(f.id)
              return { ...f, progress: 100, status: 'completed' as const }
            }
            
            return { ...f, progress: newProgress }
          }
          return f
        })
      )
    }, 200)
  }

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return

    const validFiles: File[] = []
    const newUploadFiles: UploadFile[] = []

    Array.from(files).forEach(file => {
      const validation = validateFile(file)
      
      if (validation.isValid) {
        validFiles.push(file)
        const uploadFile: UploadFile = {
          ...file,
          id: Math.random().toString(36).substring(2, 15),
          progress: 0,
          status: 'uploading'
        }
        newUploadFiles.push(uploadFile)
      } else {
        const errorFile: UploadFile = {
          ...file,
          id: Math.random().toString(36).substring(2, 15),
          progress: 0,
          status: 'error',
          error: validation.error
        }
        newUploadFiles.push(errorFile)
        onUploadError?.(errorFile.id, validation.error!)
      }
    })

    setUploadedFiles(prev => [...prev, ...newUploadFiles])
    
    // Simulate upload for valid files
    newUploadFiles.forEach(file => {
      if (file.status === 'uploading') {
        simulateUpload(file)
      }
    })

    if (validFiles.length > 0) {
      onFilesUploaded(validFiles)
    }
  }, [onFilesUploaded, onUploadProgress, onUploadComplete, onUploadError, maxFileSize, acceptedFormats])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragActive(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragActive(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragActive(false)
    handleFiles(e.dataTransfer.files)
  }, [handleFiles])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files)
  }, [handleFiles])

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId))
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className={`w-full space-y-6 ${className}`}>
      {/* Drop Zone */}
      <Card 
        className={`relative overflow-hidden transition-all duration-300 bg-surface border-2 border-dashed ${
          isDragActive 
            ? 'border-primary bg-primary/5 shadow-lg' 
            : 'border-border hover:border-primary/50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardContent className="p-12 text-center">
          <motion.div 
            className="flex flex-col items-center space-y-6"
            animate={{ 
              scale: isHovered ? 1.02 : 1,
              y: isDragActive ? -2 : 0 
            }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              animate={{ 
                rotate: isHovered ? 5 : 0,
                scale: isDragActive ? 1.1 : 1 
              }}
              transition={{ duration: 0.3 }}
              className={`p-6 rounded-full ${
                isDragActive ? 'bg-primary/20' : 'bg-muted'
              } transition-colors duration-300`}
            >
              <motion.div
                animate={{ y: isHovered ? -2 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <Cloud className={`h-12 w-12 ${
                  isDragActive ? 'text-primary' : 'text-muted-foreground'
                }`} />
              </motion.div>
            </motion.div>

            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-foreground">
                {isDragActive ? 'Drop files here' : 'Upload Scientific Data'}
              </h3>
              <p className="text-sm text-muted-foreground max-w-md">
                Drag and drop your files here, or click to browse. 
                Supported formats: NetCDF, GeoTIFF, CSV
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <Button 
                onClick={openFileDialog}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Choose Files
              </Button>
              
              <div className="text-xs text-muted-foreground text-center">
                <div>Maximum file size: {(maxFileSize / (1024 * 1024)).toFixed(0)}MB</div>
                <div className="flex flex-wrap justify-center gap-1 mt-1">
                  {acceptedFormats.map(format => (
                    <span key={format} className="px-2 py-1 bg-muted rounded text-xs">
                      {format}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </CardContent>
        
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedFormats.join(',')}
          onChange={handleFileInput}
          className="hidden"
        />
      </Card>

      {/* File List */}
      <AnimatePresence>
        {uploadedFiles.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-3"
          >
            <h4 className="text-sm font-medium text-foreground">
              Files ({uploadedFiles.length})
            </h4>
            
            <div className="space-y-2">
              {uploadedFiles.map((file) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="bg-surface">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className={`p-2 rounded-lg flex-shrink-0 ${
                            file.status === 'completed' ? 'bg-primary/10' :
                            file.status === 'error' ? 'bg-destructive/10' : 
                            'bg-muted'
                          }`}>
                            {file.status === 'completed' ? (
                              <Check className="h-4 w-4 text-primary" />
                            ) : file.status === 'error' ? (
                              <AlertCircle className="h-4 w-4 text-destructive" />
                            ) : (
                              <FileText className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h5 className="text-sm font-medium text-foreground truncate">
                                {file.name}
                              </h5>
                              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded flex-shrink-0">
                                {file.name.split('.').pop()?.toUpperCase()}
                              </span>
                            </div>
                            
                            <p className="text-xs text-muted-foreground">
                              {formatFileSize(file.size)}
                            </p>
                            
                            {file.status === 'uploading' && (
                              <div className="mt-2">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-xs text-muted-foreground">
                                    Uploading...
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {Math.round(file.progress)}%
                                  </span>
                                </div>
                                <Progress value={file.progress} className="h-1" />
                              </div>
                            )}
                            
                            {file.status === 'error' && file.error && (
                              <Alert className="mt-2">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription className="text-xs">
                                  {file.error}
                                </AlertDescription>
                              </Alert>
                            )}
                            
                            {file.status === 'completed' && (
                              <p className="text-xs text-primary mt-1">
                                Upload completed
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(file.id)}
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}