"use client";

import { useRouter } from 'next/navigation';
import { useState, useCallback } from 'react';
import { Home, Upload, Map, BarChart3, BookOpen, Info, Shield } from 'lucide-react';
import { FullwidthIconNavbar } from '@/components/navbars/fullwidth-icon-navbar';
import { MinimalCenteredHero } from '@/components/heros/minimal-centered-hero';
import { ThreeColumnImageCards } from '@/components/feature/three-column-image-cards';
import { InteractiveGraphStats } from '@/components/stats/interactive-graph-stats';
import { NewsletterFooter } from '@/components/footers/newsletter-footer';

interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  items?: MenuItem[];
  adminOnly?: boolean;
}

interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
  role: "user" | "admin";
}

interface HomepageClientProps {
  navigationMenu: MenuItem[];
  user: UserProfile;
  activeJobsCount?: number;
}

export const HomepageClient = ({ navigationMenu, user, activeJobsCount = 0 }: HomepageClientProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Navigation handlers
  const handleSearch = useCallback((query: string) => {
    console.log("Searching for:", query);
    router.push(`/search?q=${encodeURIComponent(query)}`);
  }, [router]);

  const handleLogout = useCallback(() => {
    console.log("Logging out user");
    // Handle logout logic here
    router.push('/');
  }, [router]);

  const handleProfileClick = useCallback(() => {
    console.log("Opening profile");
    router.push('/profile');
  }, [router]);

  const handleJobHistoryClick = useCallback(() => {
    console.log("Opening job history");
    router.push('/jobs');
  }, [router]);

  const handleSettingsClick = useCallback(() => {
    console.log("Opening settings");
    router.push('/settings');
  }, [router]);

  const handleAdminPanelClick = useCallback(() => {
    console.log("Opening admin panel");
    router.push('/admin');
  }, [router]);

  return (
    <main className="min-h-screen bg-background">
      <FullwidthIconNavbar
        menu={navigationMenu}
        user={user}
        activeJobsCount={activeJobsCount}
        onSearch={handleSearch}
        onLogout={handleLogout}
        onProfileClick={handleProfileClick}
        onJobHistoryClick={handleJobHistoryClick}
        onSettingsClick={handleSettingsClick}
        onAdminPanelClick={handleAdminPanelClick}
      />
      
      <MinimalCenteredHero />
      <ThreeColumnImageCards />
      <InteractiveGraphStats />
      
      <NewsletterFooter />
    </main>
  );
};