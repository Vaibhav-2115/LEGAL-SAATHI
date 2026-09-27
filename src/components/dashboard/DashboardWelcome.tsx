'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useLegalSaathi } from '@/context/LegalSaathiContext';

interface DashboardWelcomeProps {
  onOpenNewComplaint: () => void;
}

export const DashboardWelcome: React.FC<DashboardWelcomeProps> = ({ onOpenNewComplaint }) => {
  const { user } = useAuth();
  const { activeCase, cases, t } = useLegalSaathi();

  const userName = user?.name ? user.name.split(' ')[0] : 'Citizen';
  const activeCasesCount = cases.filter(
    (c) => c.status === 'UNDERSTANDING' || c.status === 'VERIFICATION' || c.status === 'READY FOR ACTION'
  ).length;

  return (
    <section className="bg-surface-container-lowest dark:bg-[#0F131C] border border-outline-variant/30 dark:border-[#1E293B] rounded-2xl p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left: Greeting and Context */}
        <div className="space-y-3 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-primary dark:text-primary-fixed">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="uppercase tracking-wider">CIVIC WORKSPACE ACTIVE</span>
            <span className="text-slate-300 dark:text-slate-600">•</span>
            <span className="text-on-surface-variant font-mono">
              DOK: {activeCase?.id || 'NEW WORKSPACE'}
            </span>
            <span className="text-slate-300 dark:text-slate-600">•</span>
            <span className="text-on-surface-variant font-medium">
              {activeCasesCount} Active {activeCasesCount === 1 ? 'Matter' : 'Matters'}
            </span>
          </div>

          <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-on-surface tracking-tight">
            Welcome back, {userName}.
          </h1>

          <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
            Your continuous legal workspace is synchronized. Review verified facts, manage statutory limitation deadlines, audit collected proofs, or consult the assistant under Indian law.
          </p>

        </div>

        {/* Right: Direct Workspace Actions */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenNewComplaint}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm hover:shadow transition-all"
          >
            <span className="material-symbols-outlined text-base">add_box</span>
            <span>+ {t.btnCreateCase}</span>
          </button>

          <Link
            href="/chat"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-surface-container-low dark:bg-[#161F30] hover:bg-surface-container-high border border-outline-variant/40 dark:border-[#334155] text-on-surface text-xs font-bold transition-all"
          >
            <span className="material-symbols-outlined text-base text-blue-600 dark:text-blue-400">forum</span>
            <span>{t.chatAssistantTitle}</span>
          </Link>
        </div>
      </div>
    </section>
  );
};
