'use client';

import React from 'react';
import { FactVerificationStatus } from '../lib/types';

interface VerificationSummaryProps {
  counts: {
    total: number;
    confirmed: number;
    supported: number;
    needsVerification: number;
    missing: number;
    conflicting: number;
  };
  filterStatus: FactVerificationStatus | 'ALL';
  onFilterChange: (status: FactVerificationStatus | 'ALL') => void;
}

export const VerificationSummary: React.FC<VerificationSummaryProps> = ({
  counts,
  filterStatus,
  onFilterChange
}) => {
  return (
    <section aria-labelledby="verification-summary-heading" className="bg-surface-container-lowest dark:bg-[#0F131C] border border-outline-variant/40 rounded-2xl p-5 sm:p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-outline-variant/30 pb-4">
        <div>
          <h2 id="verification-summary-heading" className="font-heading text-lg sm:text-xl font-bold text-on-surface">
            Fact Verification Overview
          </h2>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
            Every legal premise is classified strictly by supporting documentation. No arbitrary accuracy scores.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto bg-surface-container-low dark:bg-[#161F30] px-3 py-1.5 rounded-lg border border-outline-variant/30">
          <span className="material-symbols-outlined text-primary text-base">fact_check</span>
          <span className="text-xs font-bold text-on-surface">
            {counts.total} Total Facts Documented
          </span>
        </div>
      </div>

      {/* Verification Status Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* CONFIRMED */}
        <button
          type="button"
          onClick={() => onFilterChange(filterStatus === 'CONFIRMED' ? 'ALL' : 'CONFIRMED')}
          className={`flex flex-col items-start p-3.5 rounded-xl border text-left transition-all ${
            filterStatus === 'CONFIRMED'
              ? 'ring-2 ring-emerald-500 bg-emerald-500/10 border-emerald-500'
              : 'border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20 hover:bg-emerald-100/50 dark:hover:bg-emerald-900/30'
          }`}
        >
          <div className="flex items-center justify-between w-full">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
              Confirmed
            </span>
            <span className="material-symbols-outlined text-emerald-600 text-lg">verified</span>
          </div>
          <span className="text-2xl font-black text-emerald-900 dark:text-emerald-100 mt-2">
            {counts.confirmed}
          </span>
          <span className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-0.5">
            Official document verified
          </span>
        </button>

        {/* SUPPORTED */}
        <button
          type="button"
          onClick={() => onFilterChange(filterStatus === 'SUPPORTED' ? 'ALL' : 'SUPPORTED')}
          className={`flex flex-col items-start p-3.5 rounded-xl border text-left transition-all ${
            filterStatus === 'SUPPORTED'
              ? 'ring-2 ring-blue-500 bg-blue-500/10 border-blue-500'
              : 'border-blue-500/30 bg-blue-50/50 dark:bg-blue-950/20 hover:bg-blue-100/50 dark:hover:bg-blue-900/30'
          }`}
        >
          <div className="flex items-center justify-between w-full">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-800 dark:text-blue-300">
              Supported
            </span>
            <span className="material-symbols-outlined text-blue-600 text-lg">check_circle</span>
          </div>
          <span className="text-2xl font-black text-blue-900 dark:text-blue-100 mt-2">
            {counts.supported}
          </span>
          <span className="text-[11px] text-blue-700 dark:text-blue-400 mt-0.5">
            Corroborated by record
          </span>
        </button>

        {/* NEEDS VERIFICATION */}
        <button
          type="button"
          onClick={() => onFilterChange(filterStatus === 'NEEDS_VERIFICATION' ? 'ALL' : 'NEEDS_VERIFICATION')}
          className={`flex flex-col items-start p-3.5 rounded-xl border text-left transition-all ${
            filterStatus === 'NEEDS_VERIFICATION'
              ? 'ring-2 ring-amber-500 bg-amber-500/10 border-amber-500'
              : 'border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20 hover:bg-amber-100/50 dark:hover:bg-amber-900/30'
          }`}
        >
          <div className="flex items-center justify-between w-full">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-800 dark:text-amber-300">
              Needs Verification
            </span>
            <span className="material-symbols-outlined text-amber-600 text-lg">pending_actions</span>
          </div>
          <span className="text-2xl font-black text-amber-900 dark:text-amber-100 mt-2">
            {counts.needsVerification}
          </span>
          <span className="text-[11px] text-amber-700 dark:text-amber-400 mt-0.5">
            Requires receipt or bill
          </span>
        </button>

        {/* MISSING */}
        <button
          type="button"
          onClick={() => onFilterChange(filterStatus === 'MISSING' ? 'ALL' : 'MISSING')}
          className={`flex flex-col items-start p-3.5 rounded-xl border text-left transition-all ${
            filterStatus === 'MISSING'
              ? 'ring-2 ring-slate-500 bg-slate-500/10 border-slate-500'
              : 'border-outline-variant/40 bg-surface-container-low dark:bg-[#161F30]/40 hover:bg-surface-container'
          }`}
        >
          <div className="flex items-center justify-between w-full">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-on-surface-variant">
              Missing
            </span>
            <span className="material-symbols-outlined text-on-surface-variant text-lg">help_outline</span>
          </div>
          <span className="text-2xl font-black text-on-surface mt-2">
            {counts.missing}
          </span>
          <span className="text-[11px] text-on-surface-variant mt-0.5">
            Key detail absent
          </span>
        </button>

        {/* CONFLICTING */}
        <button
          type="button"
          onClick={() => onFilterChange(filterStatus === 'CONFLICTING' ? 'ALL' : 'CONFLICTING')}
          className={`col-span-2 sm:col-span-1 flex flex-col items-start p-3.5 rounded-xl border text-left transition-all ${
            filterStatus === 'CONFLICTING'
              ? 'ring-2 ring-rose-500 bg-rose-500/10 border-rose-500'
              : 'border-rose-500/40 bg-rose-50/60 dark:bg-rose-950/25 hover:bg-rose-100/60 dark:hover:bg-rose-900/40'
          }`}
        >
          <div className="flex items-center justify-between w-full">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-rose-800 dark:text-rose-300">
              Conflicting
            </span>
            <span className="material-symbols-outlined text-rose-600 text-lg">warning</span>
          </div>
          <span className="text-2xl font-black text-rose-900 dark:text-rose-100 mt-2">
            {counts.conflicting}
          </span>
          <span className="text-[11px] text-rose-700 dark:text-rose-400 mt-0.5">
            Differing statements noted
          </span>
        </button>
      </div>

      {filterStatus !== 'ALL' && (
        <div className="mt-4 flex items-center justify-between text-xs text-on-surface-variant bg-surface-container-low dark:bg-[#161F30]/60 px-3 py-2 rounded-lg border border-outline-variant/30">
          <span>Filtering by status: <strong>{filterStatus}</strong></span>
          <button
            type="button"
            onClick={() => onFilterChange('ALL')}
            className="text-primary hover:underline font-bold"
          >
            Show All Facts
          </button>
        </div>
      )}
    </section>
  );
};
