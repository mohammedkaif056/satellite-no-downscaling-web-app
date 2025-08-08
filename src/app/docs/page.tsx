import { FullwidthIconNavbar } from '@/components/navbars/fullwidth-icon-navbar'
import { NewsletterFooter } from '@/components/footers/newsletter-footer'
import { Home, Upload, Map, BarChart3, BookOpen, Info, Shield } from "lucide-react"

interface UserProfile {
  name: string
  email: string
  avatar?: string
  role: 'user' | 'admin'
}

export default function DocsPage() {
  const user: UserProfile = {
    name: 'Dr. Sarah Chen',
    email: 'sarah.chen@env-lab.org',
    role: 'admin'
  }

  const navigationMenu = [
    {
      title: "Home",
      url: "/",
      icon: <Home className="size-5 shrink-0" />
    },
    {
      title: "Upload & Predict", 
      url: "/upload",
      icon: <Upload className="size-5 shrink-0" />
    },
    {
      title: "Map Viewer",
      url: "/map",
      icon: <Map className="size-5 shrink-0" />
    },
    {
      title: "Validation",
      url: "/validation",
      icon: <BarChart3 className="size-5 shrink-0" />
    },
    {
      title: "Documentation",
      url: "/docs",
      icon: <BookOpen className="size-5 shrink-0" />
    },
    {
      title: "About",
      url: "/about",
      icon: <Info className="size-5 shrink-0" />
    },
    {
      title: "Admin Panel",
      url: "/admin",
      icon: <Shield className="size-5 shrink-0" />,
      adminOnly: true
    }
  ]

  return (
    <main className="min-h-screen bg-background">
      <FullwidthIconNavbar
        menu={navigationMenu}
        user={user}
        activeJobsCount={2}
      />
      
      <div className="container mx-auto py-8 max-w-4xl">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-bold text-foreground">Documentation</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Comprehensive guide for using the NO₂ satellite data downscaling platform
          </p>
        </div>
        
        <div className="prose prose-gray max-w-none">
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">Getting Started</h2>
            <p className="text-muted-foreground mb-6">
              Welcome to our AI-powered NO₂ downscaling platform. This guide will help you get started with uploading data, running predictions, and analyzing results.
            </p>
            
            <div className="bg-muted p-6 rounded-lg mb-6">
              <h3 className="text-lg font-semibold mb-3">Quick Start</h3>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                <li>Upload your satellite data (NetCDF or GeoTIFF format)</li>
                <li>Select an AI model and target resolution</li>
                <li>Submit your prediction job</li>
                <li>Download high-resolution results</li>
              </ol>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">Supported Data Formats</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3">Input Formats</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• NetCDF (.nc) - Preferred</li>
                  <li>• GeoTIFF (.tif, .tiff)</li>
                  <li>• HDF5 (.h5, .hdf5)</li>
                </ul>
              </div>
              
              <div className="border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3">Output Formats</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• High-resolution NetCDF</li>
                  <li>• GeoTIFF with georeferencing</li>
                  <li>• CSV for point data</li>
                  <li>• JSON for visualization</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">Available Models</h2>
            <div className="space-y-4">
              <div className="border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-2">CNN-UNet v2.1</h3>
                <p className="text-muted-foreground mb-3">
                  Advanced convolutional neural network with U-Net architecture for high-quality downscaling.
                </p>
                <div className="flex gap-4 text-sm">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded">Accuracy: 87.5%</span>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">Resolution: 1km</span>
                  <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">Processing: 5-10 min</span>
                </div>
              </div>
              
              <div className="border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-2">Random Forest v1.8</h3>
                <p className="text-muted-foreground mb-3">
                  Tree-based ensemble method optimized for computational efficiency and interpretability.
                </p>
                <div className="flex gap-4 text-sm">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded">Accuracy: 82.1%</span>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">Resolution: 2km</span>
                  <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">Processing: 2-5 min</span>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">API Reference</h2>
            <div className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto">
              <h3 className="text-lg font-semibold mb-4 text-green-400">POST /api/predict</h3>
              <pre className="text-sm">
{`{
  "file_id": "upload_12345",
  "model": "cnn-unet-v2.1",
  "resolution": "1km",
  "region": {
    "lat_min": 40.0,
    "lat_max": 45.0,
    "lon_min": -75.0,
    "lon_max": -70.0
  }
}`}
              </pre>
              
              <h3 className="text-lg font-semibold mb-4 mt-6 text-blue-400">GET /api/job/{'{job_id}'}</h3>
              <pre className="text-sm">
{`{
  "status": "completed",
  "progress": 100,
  "download_url": "/api/download/result_12345.nc",
  "metrics": {
    "processing_time": "00:07:32",
    "output_size": "45.2 MB"
  }
}`}
              </pre>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">How accurate are the downscaling results?</h3>
                <p className="text-muted-foreground">
                  Our models achieve 85-90% accuracy when validated against ground truth measurements. 
                  Results vary by geographic region and atmospheric conditions.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">What is the maximum file size for uploads?</h3>
                <p className="text-muted-foreground">
                  Current upload limit is 500MB per file. For larger datasets, please contact our team 
                  for batch processing options.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">How long does processing take?</h3>
                <p className="text-muted-foreground">
                  Processing time depends on data size and model complexity. Typical jobs complete within 
                  5-15 minutes, with larger datasets taking up to 1 hour.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
      
      <NewsletterFooter />
    </main>
  )
}