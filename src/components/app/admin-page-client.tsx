"use client";

import React, { useState, useCallback } from 'react';
import JobQueueMonitor from '@/components/app/job-queue-monitor';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, AlertTriangle, Activity } from "lucide-react";

interface User {
  id: string;
  email: string;
  role: 'user' | 'admin';
}

interface AdminJobQueueWrapperProps {
  user: User;
}

export const AdminJobQueueWrapper: React.FC<AdminJobQueueWrapperProps> = ({ user }) => {
  const [isManagingJob, setIsManagingJob] = useState<string | null>(null);

  // Check admin permissions
  const hasAdminAccess = user.role === 'admin';

  const handleCancelJob = useCallback(async (jobId: string) => {
    if (!hasAdminAccess) return;

    try {
      setIsManagingJob(jobId);
      console.log('Cancelling job:', jobId);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Job cancelled successfully:', jobId);
    } catch (err) {
      console.error('Failed to cancel job:', err);
    } finally {
      setIsManagingJob(null);
    }
  }, [hasAdminAccess]);

  const handleRetryJob = useCallback(async (jobId: string) => {
    if (!hasAdminAccess) return;

    try {
      setIsManagingJob(jobId);
      console.log('Retrying job:', jobId);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Job retry initiated:', jobId);
    } catch (err) {
      console.error('Failed to retry job:', err);
    } finally {
      setIsManagingJob(null);
    }
  }, [hasAdminAccess]);

  const handleDeleteJob = useCallback(async (jobId: string) => {
    if (!hasAdminAccess) return;

    try {
      setIsManagingJob(jobId);
      console.log('Deleting job:', jobId);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Job deleted successfully:', jobId);
    } catch (err) {
      console.error('Failed to delete job:', err);
    } finally {
      setIsManagingJob(null);
    }
  }, [hasAdminAccess]);

  const handleDownloadResults = useCallback(async (jobId: string) => {
    if (!hasAdminAccess) return;

    try {
      setIsManagingJob(jobId);
      console.log('Downloading results for job:', jobId);
      
      // Simulate download
      const blob = new Blob(['Mock job results data'], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `job-${jobId}-results.txt`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      console.log('Results downloaded for job:', jobId);
    } catch (err) {
      console.error('Failed to download results:', err);
    } finally {
      setIsManagingJob(null);
    }
  }, [hasAdminAccess]);

  const handleRefreshJobs = useCallback(() => {
    console.log('Refreshing job queue');
    // Simulate refresh
  }, []);

  if (!hasAdminAccess) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Alert className="max-w-2xl mx-auto">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            You do not have sufficient permissions to access the admin panel. Please contact an administrator.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Admin Panel</h1>
            <Badge variant="secondary" className="ml-2">
              <Activity className="h-3 w-3 mr-1" />
              Live Monitoring
            </Badge>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Monitor system performance, manage job queues, and oversee model training
          </p>
        </div>
      </div>

      {/* System Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-sm text-muted-foreground">Active Jobs</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-amber-600" />
              <div>
                <p className="text-2xl font-bold">8</p>
                <p className="text-sm text-muted-foreground">Pending Jobs</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">156</p>
                <p className="text-sm text-muted-foreground">Completed Today</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-2xl font-bold">3</p>
                <p className="text-sm text-muted-foreground">Failed Jobs</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Job Queue Monitor */}
      <JobQueueMonitor
        isAdmin={hasAdminAccess}
        onCancelJob={handleCancelJob}
        onRetryJob={handleRetryJob}
        onDeleteJob={handleDeleteJob}
        onDownloadResults={handleDownloadResults}
        onRefresh={handleRefreshJobs}
      />
    </div>
  );
};