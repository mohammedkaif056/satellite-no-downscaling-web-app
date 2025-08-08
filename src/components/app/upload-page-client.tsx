"use client";

import { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, Upload, Brain } from 'lucide-react';
import FileUploadZone from '@/components/app/file-upload-zone';
import ModelSelectorGrid from '@/components/app/model-selector-grid';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'uploaded' | 'error';
  progress: number;
  error?: string;
}

interface SelectedModel {
  id: string;
  name: string;
  description: string;
  accuracy: number;
  resolution: string;
}

interface UploadPageWrapperProps {
  onPredictionStart?: (files: UploadedFile[], model: SelectedModel) => void;
  onError?: (error: string) => void;
}

export const UploadPageWrapper = ({ onPredictionStart, onError }: UploadPageWrapperProps) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [selectedModelId, setSelectedModelId] = useState<string>();
  const [selectedResolution, setSelectedResolution] = useState<string>('1km');
  const [isProcessing, setIsProcessing] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const handleFilesUploaded = useCallback((files: File[]) => {
    const newFiles: UploadedFile[] = files.map((file, index) => ({
      id: `file-${Date.now()}-${index}`,
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'uploading' as const,
      progress: 0,
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);
    setGlobalError(null);

    // Simulate upload process for each file
    newFiles.forEach((file, index) => {
      simulateFileUpload(file.id, index * 500);
    });
  }, []);

  const simulateFileUpload = (fileId: string, delay: number) => {
    setTimeout(() => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 15 + 5;
        
        if (progress >= 100) {
          setUploadedFiles(prev => prev.map(file => 
            file.id === fileId 
              ? { ...file, status: 'uploaded' as const, progress: 100 }
              : file
          ));
          clearInterval(interval);
        } else {
          setUploadedFiles(prev => prev.map(file => 
            file.id === fileId 
              ? { ...file, progress: Math.min(progress, 100) }
              : file
          ));
        }
      }, 100);
    }, delay);
  };

  const handleUploadProgress = useCallback((fileId: string, progress: number) => {
    setUploadedFiles(prev => prev.map(file => 
      file.id === fileId ? { ...file, progress } : file
    ));
  }, []);

  const handleUploadComplete = useCallback((fileId: string) => {
    setUploadedFiles(prev => prev.map(file => 
      file.id === fileId ? { ...file, status: 'uploaded' as const, progress: 100 } : file
    ));
  }, []);

  const handleUploadError = useCallback((fileId: string, error: string) => {
    setUploadedFiles(prev => prev.map(file => 
      file.id === fileId ? { ...file, status: 'error' as const, error } : file
    ));
    setGlobalError(error);
    onError?.(error);
  }, [onError]);

  const handleModelSelect = useCallback((modelId: string, resolution: string) => {
    setSelectedModelId(modelId);
    setSelectedResolution(resolution);
    setGlobalError(null);
  }, []);

  const getUploadStatusSummary = () => {
    const total = uploadedFiles.length;
    const uploaded = uploadedFiles.filter(f => f.status === 'uploaded').length;
    const errors = uploadedFiles.filter(f => f.status === 'error').length;
    
    return { total, uploaded, errors };
  };

  const { total, uploaded, errors } = getUploadStatusSummary();

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">Upload & Predict</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Upload your satellite data and select an AI model to generate high-resolution environmental maps
        </p>
      </div>

      {/* Global Error Display */}
      {globalError && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>{globalError}</AlertDescription>
        </Alert>
      )}

      {/* Status Summary */}
      {total > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Upload className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{total}</p>
                  <p className="text-sm text-muted-foreground">Total Files</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">{uploaded}</p>
                  <p className="text-sm text-muted-foreground">Uploaded</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {errors > 0 && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <XCircle className="h-5 w-5 text-destructive" />
                  <div>
                    <p className="text-2xl font-bold">{errors}</p>
                    <p className="text-sm text-muted-foreground">Errors</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-foreground">1. Upload Your Data</h2>
          <FileUploadZone
            onFilesUploaded={handleFilesUploaded}
            onUploadProgress={handleUploadProgress}
            onUploadComplete={handleUploadComplete}
            onUploadError={handleUploadError}
          />
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-foreground">2. Select Model & Resolution</h2>
          <ModelSelectorGrid
            onModelSelect={handleModelSelect}
            selectedModel={selectedModelId}
            selectedResolution={selectedResolution}
            uploadedDataType="TROPOMI"
          />
        </div>
      </div>
    </div>
  );
};