'use client';

import React from 'react';
import Link from 'next/link';
import { useLegalSaathi } from '@/context/LegalSaathiContext';
import { CaseStatusBadge } from '@/components/CaseStatusBadge';

export const ContinueWorkSection: React.FC = () => {
  const { activeCase, cases } = useLegalSaathi();
  const currentCase = activeCase || cases[0];

  if (!currentCase) {
    return (
      <section className="p-8 rounded-2xl bg-surface-container-lowest dark:bg-[#0F131C] border border-outline-variant/30 text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-[#161F30] text-slate-400 flex items-center justify-center mx-auto">
          <span className="material-symbols-outlined text-2xl">folder_off</span>
        </div>
        <h3 className="font-heading text-base font-bold text-on-surface">No In-Progress Work Recorded</h3>
        <p className="text-xs text-on-surface-variant max-w-md mx-auto">
          Start your first dispute intake or ask a legal question to create a continuous case workspace.
        </p>
      </section>
    );
  }

  const evidenceProgress = Math.round(
    (currentCase.collectedEvidenceCount / (currentCase.totalEvidenceCount || 1)) * 100
  );

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-lg sm:text-xl font-bold text-on-surface">
            Continue Where You Left Off
          </h2>
          <p className="text-xs text-on-surface-variant">
            Resume active case analysis, draft filings, and pending evidence checklists.
          </p>
        </div>
        <Link
          href={`/cases/${currentCase.id}`}
          className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
        >
          <span>Open Case File</span>
          <span className="material-symbols-outlined text-sm">open_in_new</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Active Dispute Dossier Card (2 columns) */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-surface-container-lowest dark:bg-[#0F131C] border border-outline-variant/30 dark:border-[#1E293B] shadow-sm flex flex-col justify-between gap-5">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                  {currentCase.id}
                </span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className="text-xs text-on-surface-variant font-medium">
                  {currentCase.category}
                </span>
              </div>
              <CaseStatusBadge status={currentCase.status} size="sm" />
            </div>

            <div>
              <h3 className="font-heading text-xl font-bold text-on-surface leading-snug">
                {currentCase.title}
              </h3>
              <p className="text-xs sm:text-sm text-on-surface-variant mt-1.5 line-clamp-2 leading-relaxed">
                {currentCase.summary}
              </p>
            </div>

            {/* Evidence & Verification Progress Bar */}
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Evidence Locker Audit ({currentCase.collectedEvidenceCount} of {currentCase.totalEvidenceCount} items verified)
                </span>
                <span className="font-bold text-blue-600 dark:text-blue-400">{evidenceProgress}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-[#161F30] overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-300"
                  style={{ width: `${evidenceProgress}%` }}
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3 text-on-surface-variant">
              <span>Jurisdiction: <strong>{currentCase.jurisdiction}</strong></span>
              <span>•</span>
              <span>Updated: <strong>{currentCase.updatedAt}</strong></span>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href={`/cases/${currentCase.id}/evidence`}
                className="px-3 py-1.5 rounded-lg bg-surface-container-high dark:bg-[#161F30] hover:bg-surface-container-highest text-on-surface font-semibold transition-colors"
              >
                Audit Proofs
              </Link>
              <Link
                href={`/cases/${currentCase.id}`}
                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors shadow-xs flex items-center gap-1"
              >
                <span>Continue Case</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Secondary: In-Progress Legal Drafts (1 column) */}
        <div className="p-6 rounded-2xl bg-surface-container-lowest dark:bg-[#0F131C] border border-outline-variant/30 dark:border-[#1E293B] shadow-sm flex flex-col justify-between gap-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-heading text-sm font-bold text-on-surface uppercase tracking-wider text-slate-500 dark:text-slate-400">
                In-Progress Filings
              </h4>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                2 Drafts
              </span>
            </div>

            <div className="space-y-3">
              {/* Draft 1: Demand Notice */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#161F30]/80 border border-slate-200/60 dark:border-slate-800 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white">Statutory Demand Notice</span>
                  <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">Ready for Review</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Section 106 TPA notice for return of ₹65,000 security deposit.
                </p>
                <Link
                  href="/draft/legal-notice"
                  className="inline-flex items-center gap-1 font-bold text-blue-600 dark:text-blue-400 hover:underline pt-1 text-[11px]"
                >
                  <span>Review Draft Notice</span>
                  <span className="material-symbols-outlined text-xs">arrow_forward</span>
                </Link>
              </div>

              {/* Draft 2: RTI Application */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#161F30]/80 border border-slate-200/60 dark:border-slate-800 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white">RTI Application</span>
                  <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">Form Complete</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Section 6(1) query on municipal tenancy inspection logs.
                </p>
                <Link
                  href="/draft/rti"
                  className="inline-flex items-center gap-1 font-bold text-blue-600 dark:text-blue-400 hover:underline pt-1 text-[11px]"
                >
                  <span>Export RTI Draft</span>
                  <span className="material-symbols-outlined text-xs">arrow_forward</span>
                </Link>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>Encrypted local session cache</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">Auto-saved</span>
          </div>
        </div>
      </div>
    </section>
  );
};
