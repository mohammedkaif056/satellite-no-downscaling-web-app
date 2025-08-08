"use client"

import { HomepageClient } from '@/components/app/homepage-client'
import { Home, Upload, Map, BarChart3, BookOpen, Info, Shield } from "lucide-react"

export default function HomePage() {
  const user = {
    name: 'Dr. Sarah Chen',
    email: 'sarah.chen@env-lab.org',
    role: 'admin' as const
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
    <HomepageClient 
      navigationMenu={navigationMenu}
      user={user}
      activeJobsCount={2}
    />
  )
}