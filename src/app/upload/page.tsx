import { FullwidthIconNavbar } from '@/components/navbars/fullwidth-icon-navbar'
import { NewsletterFooter } from '@/components/footers/newsletter-footer'
import { UploadPageWrapper } from '@/components/app/upload-page-client'
import { Home, Upload, Map, BarChart3, BookOpen, Info, Shield } from "lucide-react"

interface UserProfile {
  name: string
  email: string
  avatar?: string
  role: 'user' | 'admin'
}

export default function UploadPage() {
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
      
      <UploadPageWrapper />
      
      <NewsletterFooter />
    </main>
  )
}