'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AppHeader } from './AppHeader';
import { AppFooter } from './AppFooter';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const pathname = usePathname();

  const isPublicLanding = pathname === '/';
  const isAuthPage = pathname === '/login' || pathname === '/register';

  // SCENARIO 1: Public Landing Page (Phase 4 Intact)
  if (isPublicLanding) {
    return (
      <div className="min-h-screen flex flex-col bg-background text-on-surface antialiased">
        <Header />
        <main className="flex-1 pt-20 w-full">{children}</main>
        <Footer />
      </div>
    );
  }

  // SCENARIO 2: Public Citizen Auth Gateway (Phase 5 Intact)
  if (isAuthPage) {
    return (
      <div className="min-h-screen flex flex-col bg-background text-on-surface antialiased">
        <Header />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
      </div>
    );
  }

  // SCENARIO 3: Authenticated Continuous Workspace (Consolidated Horizontal Architecture)
  return (
    <div className="min-h-screen flex flex-col bg-background text-on-surface antialiased">
      {/* 1. Global Authenticated Header with Clean Horizontal Navigation */}
      <AppHeader />

      {/* 2. Main Full-Width Content Container */}
      <main className="flex-1 w-full flex flex-col min-w-0 bg-slate-50/40 dark:bg-[#090D16]/40">
        {children}
      </main>

      {/* 3. In-App Minimal Footer */}
      <AppFooter />
    </div>
  );
};
