"use client";

import React, { useState, useCallback } from 'react';
import InteractiveMapViewer from '@/components/app/interactive-map-viewer';

interface TimeRange {
  start: Date;
  end: Date;
  current: Date;
}

interface CoordinateData {
  lat: number;
  lng: number;
  value: number;
  timestamp?: string;
}

export const MapViewerWrapper = () => {
  const [timeRange] = useState<TimeRange>({
    start: new Date('2024-01-01'),
    end: new Date('2024-12-31'),
    current: new Date('2024-06-15')
  });

  const handleLayerChange = useCallback((layerId: string, config: any) => {
    console.log('Layer changed:', layerId, config);
  }, []);

  const handleDataDownload = useCallback((layerId: string, format: string) => {
    console.log('Downloading data:', layerId, format);
    // Simulate download
    const link = document.createElement('a');
    link.download = `${layerId}-data.${format}`;
    link.href = 'data:text/plain;base64,VGhpcyBpcyBhIG1vY2sgZG93bmxvYWQ=';
    link.click();
  }, []);

  const handleCoordinateHover = useCallback((data: CoordinateData | null) => {
    console.log('Coordinate hovered:', data);
  }, []);

  const handleTimeChange = useCallback((time: Date) => {
    console.log('Time changed:', time);
  }, []);

  return (
    <div className="container mx-auto py-8">
      <div className="text-center space-y-4 mb-8">
        <h1 className="text-4xl font-bold text-foreground">Interactive Map Viewer</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Explore high-resolution NO₂ data with interactive maps and visualization controls
        </p>
      </div>
      
      <InteractiveMapViewer
        onLayerChange={handleLayerChange}
        onDataDownload={handleDataDownload}
        onCoordinateHover={handleCoordinateHover}
        timeRange={timeRange}
        onTimeChange={handleTimeChange}
      />
    </div>
  );
};