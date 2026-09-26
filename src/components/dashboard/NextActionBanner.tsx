'use client';

import React from 'react';
import Link from 'next/link';
import { useLegalSaathi } from '@/context/LegalSaathiContext';

export const NextActionBanner: React.FC = () => {
  const { activeCase, cases } = useLegalSaathi();
  const currentCase = activeCase || cases[0];

  if (!currentCase) return null;

  return (
    <section className="bg-amber-50/90 dark:bg-amber-950/30 border border-amber-300/80 dark:border-amber-800/60 rounded-2xl p-6 sm:p-7 shadow-xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-2 max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-800 dark:text-amber-300">
              High-Priority Action Required • Due within 3 days
            </span>
          </div>

          <h3 className="font-heading text-lg sm:text-xl font-bold text-slate-900 dark:text-amber-100">
            Docket {currentCase.id}: {currentCase.nextStep?.title || 'Review Dispute Evidence'}
          </h3>

          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {currentCase.nextStep?.description || currentCase.summary || 'Ensure your supporting documentation is organized and reviewed under relevant Indian statutory provisions.'}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-amber-900 dark:text-amber-400 font-semibold">
            <span>Dispute: <strong>{currentCase.title}</strong></span>
            {currentCase.claimAmount && (
              <>
                <span>•</span>
                <span>Claim Value: <strong>{currentCase.claimAmount}</strong></span>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0">
          <Link
            href={`/cases/${currentCase.id}/evidence`}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs transition-colors"
          >
            <span>Complete Evidence Checklist</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
          <Link
            href={`/cases/${currentCase.id}/timeline`}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white/80 dark:bg-[#161F30] hover:bg-white border border-amber-300/80 dark:border-amber-800 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors"
          >
            <span>Inspect Timeline</span>
          </Link>
        </div>
      </div>
    </section>
  );
};
