"use client";

import React, { useState, useCallback } from 'react';
import ValidationMetricsDashboard from '@/components/app/validation-metrics-dashboard';

interface ValidationWrapperState {
  selectedMetric: string | null;
  isExporting: boolean;
  exportError: string | null;
  isLoading: boolean;
  error: string | null;
}

export const ValidationWrapper: React.FC = () => {
  const [state, setState] = useState<ValidationWrapperState>({
    selectedMetric: null,
    isExporting: false,
    exportError: null,
    isLoading: false,
    error: null
  });

  const mockValidationData = [
    {
      model: 'CNN-UNet',
      accuracy: 87.5,
      rmse: 2.3,
      mae: 1.8,
      r2: 0.85
    },
    {
      model: 'Random Forest',
      accuracy: 82.1,
      rmse: 2.8,
      mae: 2.1,
      r2: 0.79
    }
  ];

  const handleExport = useCallback(async (format: 'pdf' | 'csv' | 'json') => {
    setState(prev => ({ ...prev, isExporting: true, exportError: null }));
    
    try {
      // Simulate export delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create mock export data
      const exportData = {
        exportDate: new Date().toISOString(),
        validationData: mockValidationData,
        selectedMetric: state.selectedMetric
      };

      let content: string;
      let filename: string;
      let mimeType: string;

      switch (format) {
        case 'json':
          content = JSON.stringify(exportData, null, 2);
          filename = `validation_results_${Date.now()}.json`;
          mimeType = 'application/json';
          break;
        case 'csv':
          const headers = ['Model', 'Accuracy', 'RMSE', 'MAE', 'R2'];
          const rows = mockValidationData.map(d => [d.model, d.accuracy, d.rmse, d.mae, d.r2]);
          content = [headers, ...rows].map(row => row.join(',')).join('\n');
          filename = `validation_results_${Date.now()}.csv`;
          mimeType = 'text/csv';
          break;
        case 'pdf':
          content = 'PDF validation report would be generated here';
          filename = `validation_report_${Date.now()}.pdf`;
          mimeType = 'application/pdf';
          break;
        default:
          throw new Error('Unsupported export format');
      }

      // Create download link
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      console.log(`Exported validation data as ${format}`);
      setState(prev => ({ ...prev, isExporting: false }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isExporting: false,
        exportError: error instanceof Error ? error.message : 'Export failed'
      }));
    }
  }, [state.selectedMetric]);

  const handleMetricSelect = useCallback((metricId: string) => {
    setState(prev => ({ ...prev, selectedMetric: metricId }));
    console.log('Selected metric:', metricId);
  }, []);

  return (
    <div className="container mx-auto py-8">
      <div className="text-center space-y-4 mb-8">
        <h1 className="text-4xl font-bold text-foreground">Model Validation</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Validate model predictions against ground truth data and compare performance metrics
        </p>
      </div>
      
      <ValidationMetricsDashboard
        modelId="CNN-UNet"
        validationData={mockValidationData}
        onExport={handleExport}
        onMetricSelect={handleMetricSelect}
        compareModels={true}
        isLoading={state.isLoading}
      />
    </div>
  );
};