"use client"

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Layers, 
  Settings, 
  Download, 
  Maximize, 
  Minimize, 
  Info, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward,
  Loader2,
  AlertTriangle,
  Eye,
  EyeOff
} from 'lucide-react';

// TypeScript interfaces for geospatial data
interface CoordinateData {
  lat: number;
  lng: number;
  value: number;
  timestamp?: string;
}

interface LayerConfig {
  id: string;
  name: string;
  enabled: boolean;
  opacity: number;
  color: string;
  dataType: 'coarse' | 'fine' | 'ground_truth' | 'boundary' | 'basemap';
}

interface MapViewerProps {
  initialLayers?: LayerConfig[];
  onLayerChange?: (layerId: string, config: Partial<LayerConfig>) => void;
  onDataDownload?: (layerId: string, format: 'geotiff' | 'png' | 'stats') => void;
  onCoordinateHover?: (data: CoordinateData | null) => void;
  timeRange?: { start: Date; end: Date; current: Date };
  onTimeChange?: (time: Date) => void;
  loading?: boolean;
  error?: string;
}

const defaultLayers: LayerConfig[] = [
  { id: 'coarse', name: 'Original Resolution', enabled: true, opacity: 80, color: '#ef4444', dataType: 'coarse' },
  { id: 'fine', name: 'Downscaled Resolution', enabled: true, opacity: 80, color: '#16a34a', dataType: 'fine' },
  { id: 'ground_truth', name: 'Ground Truth', enabled: false, opacity: 60, color: '#0ea5e9', dataType: 'ground_truth' },
  { id: 'boundaries', name: 'Admin Boundaries', enabled: true, opacity: 40, color: '#64748b', dataType: 'boundary' },
];

export default function InteractiveMapViewer({
  initialLayers = defaultLayers,
  onLayerChange,
  onDataDownload,
  onCoordinateHover,
  timeRange,
  onTimeChange,
  loading = false,
  error
}: MapViewerProps) {
  const [layers, setLayers] = useState<LayerConfig[]>(initialLayers);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false);
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false);
  const [hoveredData, setHoveredData] = useState<CoordinateData | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [resolution, setResolution] = useState([50]);
  const [selectedBasemap, setSelectedBasemap] = useState('satellite');
  
  const mapRef = useRef<HTMLDivElement>(null);

  const handleLayerToggle = useCallback((layerId: string) => {
    setLayers(prev => prev.map(layer => 
      layer.id === layerId 
        ? { ...layer, enabled: !layer.enabled }
        : layer
    ));
    
    const layer = layers.find(l => l.id === layerId);
    if (layer && onLayerChange) {
      onLayerChange(layerId, { enabled: !layer.enabled });
    }
  }, [layers, onLayerChange]);

  const handleOpacityChange = useCallback((layerId: string, opacity: number) => {
    setLayers(prev => prev.map(layer => 
      layer.id === layerId 
        ? { ...layer, opacity }
        : layer
    ));
    
    if (onLayerChange) {
      onLayerChange(layerId, { opacity });
    }
  }, [onLayerChange]);

  const handleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  const handleTimelinePlay = useCallback(() => {
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const handleDownload = useCallback((format: 'geotiff' | 'png' | 'stats') => {
    const enabledLayers = layers.filter(l => l.enabled);
    if (enabledLayers.length > 0 && onDataDownload) {
      onDataDownload(enabledLayers[0].id, format);
    }
  }, [layers, onDataDownload]);

  // Simulate map hover data
  const handleMapHover = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Simulate coordinate data
    const mockData: CoordinateData = {
      lat: 40.7128 + (y - rect.height / 2) * 0.001,
      lng: -74.0060 + (x - rect.width / 2) * 0.001,
      value: Math.random() * 50 + 10, // NO₂ concentration
      timestamp: new Date().toISOString()
    };
    
    setHoveredData(mockData);
    onCoordinateHover?.(mockData);
  }, [onCoordinateHover]);

  const colorScaleStops = [
    { value: 0, color: '#22c55e', label: 'Low' },
    { value: 25, color: '#eab308', label: 'Moderate' },
    { value: 50, color: '#f97316', label: 'High' },
    { value: 75, color: '#ef4444', label: 'Very High' }
  ];

  return (
    <div className="bg-surface w-full h-[800px] relative overflow-hidden rounded-lg border border-border">
      {/* Left Control Panel */}
      <div className={`absolute left-0 top-0 h-full bg-surface border-r border-border transition-transform duration-300 z-10 ${
        leftPanelCollapsed ? '-translate-x-full' : 'translate-x-0'
      }`}>
        <Card className="h-full w-80 rounded-none border-0 shadow-lg">
          <CardHeader className="pb-4 border-b border-border">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-text-primary flex items-center gap-2">
                <Layers className="h-5 w-5" />
                Layer Controls
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLeftPanelCollapsed(true)}
                className="p-1"
              >
                <EyeOff className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="p-4 space-y-6 overflow-y-auto flex-1">
            {/* Data Layers */}
            <div className="space-y-4">
              <h3 className="font-medium text-text-primary text-sm uppercase tracking-wide">Data Layers</h3>
              {layers.filter(l => l.dataType !== 'basemap').map(layer => (
                <div key={layer.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={layer.enabled}
                        onCheckedChange={() => handleLayerToggle(layer.id)}
                        className="data-[state=checked]:bg-primary"
                      />
                      <span className="text-sm font-medium text-text-primary">{layer.name}</span>
                    </div>
                    <Badge 
                      variant="outline" 
                      className="text-xs"
                      style={{ borderColor: layer.color, color: layer.color }}
                    >
                      {layer.dataType}
                    </Badge>
                  </div>
                  
                  {layer.enabled && (
                    <div className="ml-6 space-y-2">
                      <div className="flex items-center justify-between text-xs text-text-secondary">
                        <span>Opacity</span>
                        <span>{layer.opacity}%</span>
                      </div>
                      <Slider
                        value={[layer.opacity]}
                        onValueChange={([value]) => handleOpacityChange(layer.id, value)}
                        max={100}
                        step={5}
                        className="w-full"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Basemap Options */}
            <div className="space-y-4 border-t border-border pt-4">
              <h3 className="font-medium text-text-primary text-sm uppercase tracking-wide">Basemap</h3>
              <div className="grid grid-cols-2 gap-2">
                {['satellite', 'terrain', 'streets', 'dark'].map(basemap => (
                  <Button
                    key={basemap}
                    variant={selectedBasemap === basemap ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedBasemap(basemap)}
                    className="text-xs capitalize"
                  >
                    {basemap}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Control Panel */}
      <div className={`absolute right-0 top-0 h-full bg-surface border-l border-border transition-transform duration-300 z-10 ${
        rightPanelCollapsed ? 'translate-x-full' : 'translate-x-0'
      }`}>
        <Card className="h-full w-80 rounded-none border-0 shadow-lg">
          <CardHeader className="pb-4 border-b border-border">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-text-primary flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Map Controls
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setRightPanelCollapsed(true)}
                className="p-1"
              >
                <EyeOff className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="p-4 space-y-6 overflow-y-auto flex-1">
            {/* Resolution Comparison */}
            <div className="space-y-4">
              <h3 className="font-medium text-text-primary text-sm uppercase tracking-wide">Resolution</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-text-secondary">
                  <span>Comparison Split</span>
                  <span>{resolution[0]}%</span>
                </div>
                <Slider
                  value={resolution}
                  onValueChange={setResolution}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>

            {/* Color Scale Legend */}
            <div className="space-y-4 border-t border-border pt-4">
              <h3 className="font-medium text-text-primary text-sm uppercase tracking-wide">NO₂ Concentration</h3>
              <div className="space-y-2">
                {colorScaleStops.map((stop, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-sm border border-border"
                      style={{ backgroundColor: stop.color }}
                    />
                    <div className="flex-1 flex justify-between text-xs">
                      <span className="text-text-secondary">{stop.label}</span>
                      <span className="font-mono text-text-primary">{stop.value}+ μg/m³</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Data Info */}
            {hoveredData && (
              <div className="space-y-4 border-t border-border pt-4">
                <h3 className="font-medium text-text-primary text-sm uppercase tracking-wide flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  Cursor Data
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Latitude:</span>
                    <span className="font-mono text-text-primary">{hoveredData.lat.toFixed(6)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Longitude:</span>
                    <span className="font-mono text-text-primary">{hoveredData.lng.toFixed(6)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">NO₂ Value:</span>
                    <span className="font-mono text-text-primary">{hoveredData.value.toFixed(2)} μg/m³</span>
                  </div>
                </div>
              </div>
            )}

            {/* Download Options */}
            <div className="space-y-4 border-t border-border pt-4">
              <h3 className="font-medium text-text-primary text-sm uppercase tracking-wide flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export Data
              </h3>
              <div className="grid grid-cols-1 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload('geotiff')}
                  className="justify-start text-xs"
                >
                  Download GeoTIFF
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload('png')}
                  className="justify-start text-xs"
                >
                  Export as PNG
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload('stats')}
                  className="justify-start text-xs"
                >
                  Summary Statistics
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Panel Toggle Buttons */}
      {leftPanelCollapsed && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setLeftPanelCollapsed(false)}
          className="absolute left-4 top-4 z-20 shadow-lg"
        >
          <Eye className="h-4 w-4" />
        </Button>
      )}

      {rightPanelCollapsed && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setRightPanelCollapsed(false)}
          className="absolute right-4 top-4 z-20 shadow-lg"
        >
          <Eye className="h-4 w-4" />
        </Button>
      )}

      {/* Main Map Container */}
      <div 
        ref={mapRef}
        className={`h-full bg-muted-background transition-all duration-300 ${
          leftPanelCollapsed ? 'pl-0' : 'pl-80'
        } ${
          rightPanelCollapsed ? 'pr-0' : 'pr-80'
        }`}
        onMouseMove={handleMapHover}
        onMouseLeave={() => {
          setHoveredData(null);
          onCoordinateHover?.(null);
        }}
      >
        {/* Loading State */}
        {loading && (
          <div className="absolute inset-0 bg-surface/80 flex items-center justify-center z-20">
            <div className="flex items-center gap-3 text-text-primary">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="font-medium">Loading map data...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="absolute inset-0 bg-surface/80 flex items-center justify-center z-20">
            <div className="flex items-center gap-3 text-destructive">
              <AlertTriangle className="h-6 w-6" />
              <span className="font-medium">Error loading map: {error}</span>
            </div>
          </div>
        )}

        {/* Placeholder Map Content */}
        <div className="w-full h-full bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center relative">
          <div className="text-center text-text-secondary">
            <MapPin className="h-16 w-16 mx-auto mb-4 text-accent" />
            <p className="text-lg font-medium">Interactive Map Viewer</p>
            <p className="text-sm">Map integration with Mapbox GL JS or Leaflet</p>
          </div>

          {/* Hover Indicator */}
          {hoveredData && (
            <div className="absolute top-4 left-4 bg-surface/90 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg">
              <div className="text-xs space-y-1">
                <div className="font-medium text-text-primary">Coordinates</div>
                <div className="font-mono text-text-secondary">
                  {hoveredData.lat.toFixed(4)}, {hoveredData.lng.toFixed(4)}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Map Controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleFullscreen}
            className="shadow-lg bg-surface/90 backdrop-blur-sm"
          >
            {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Bottom Timeline */}
      {timeRange && (
        <div className="absolute bottom-0 left-0 right-0 bg-surface/90 backdrop-blur-sm border-t border-border p-4">
          <div className={`transition-all duration-300 ${
            leftPanelCollapsed ? 'pl-0' : 'pl-80'
          } ${
            rightPanelCollapsed ? 'pr-0' : 'pr-80'
          }`}>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="p-2"
                >
                  <SkipBack className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleTimelinePlay}
                  className="p-2"
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="p-2"
                >
                  <SkipForward className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex-1">
                <Slider
                  value={[timeRange.current.getTime()]}
                  min={timeRange.start.getTime()}
                  max={timeRange.end.getTime()}
                  step={86400000} // 1 day in milliseconds
                  onValueChange={([value]) => onTimeChange?.(new Date(value))}
                  className="w-full"
                />
              </div>
              
              <div className="text-sm font-mono text-text-primary min-w-0">
                {timeRange.current.toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}