'use client';

import React, { useState } from 'react';
import { DashboardWelcome } from '@/components/dashboard/DashboardWelcome';
import { ContinueWorkSection } from '@/components/dashboard/ContinueWorkSection';
import { NextActionBanner } from '@/components/dashboard/NextActionBanner';
import { AskLegalSaathiPrompt } from '@/components/dashboard/AskLegalSaathiPrompt';
import { NewComplaintModal } from '@/components/dashboard/NewComplaintModal';

export default function DashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] bg-slate-50/50 dark:bg-[#090D16] text-slate-900 dark:text-slate-100 transition-colors pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
        
        {/* ========================================================================= */}
        {/* 1. WELCOME & PRIMARY WORKSPACE ACTIONS                                   */}
        {/* ========================================================================= */}
        <DashboardWelcome onOpenNewComplaint={() => setIsModalOpen(true)} />

        {/* ========================================================================= */}
        {/* 2. CONTINUE WORKING ON ACTIVE MATTER (Core Principle 1)                  */}
        {/* ========================================================================= */}
        <ContinueWorkSection />

        {/* ========================================================================= */}
        {/* 3. HIGH-PRIORITY PENDING TASKS (Core Principle 3)                        */}
        {/* ========================================================================= */}
        <NextActionBanner />

        {/* ========================================================================= */}
        {/* 4. START A NEW LEGAL QUERY (Core Principle 2)                            */}
        {/* ========================================================================= */}
        <AskLegalSaathiPrompt />

      </div>

      {/* New Complaint Modal */}
      <NewComplaintModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
