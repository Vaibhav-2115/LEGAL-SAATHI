'use client';

import React from 'react';
import { LegalCase } from '../lib/types';

interface EvidenceOverviewProps {
  currentCase: LegalCase;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
  onAddNewClick?: () => void;
}

export const EvidenceOverview: React.FC<EvidenceOverviewProps> = ({
  currentCase,
  filterStatus,
  setFilterStatus,
  onAddNewClick
}) => {
  const total = currentCase.evidenceList.length;
  const collected = currentCase.evidenceList.filter(
    (e) => e.status === 'VERIFIED' || e.status === 'COLLECTED'
  ).length;
  const missing = currentCase.evidenceList.filter((e) => e.status === 'MISSING').length;
  const reviewNeeded = currentCase.evidenceList.filter(
    (e) => e.status === 'REVIEW_NEEDED' || e.status === 'NEEDS_REVIEW'
  ).length;
  const notApplicable = currentCase.evidenceList.filter(
    (e) => e.status === 'NOT_APPLICABLE'
  ).length;

  return (
    <div className="w-full bg-surface-container-lowest dark:bg-[#0F131C] rounded-2xl p-5 sm:p-6 shadow-sm border border-outline-variant/30 flex flex-col gap-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-on-surface-variant mb-1 font-mono">
            <span className="w-2 h-2 rounded-full bg-secondary"></span>
            <span>Case ID: <strong>{currentCase.id}</strong></span>
            <span>•</span>
            <span>{currentCase.category}</span>
          </div>
          <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-primary dark:text-primary-fixed tracking-tight">
            Case Evidence Dossier
          </h2>
          <p className="text-xs text-on-surface-variant mt-1 leading-relaxed max-w-2xl">
            A solid legal claim under Indian civil law relies on verifiable documentary proof.
            Review collected records, upload pending documentation, and address missing items before formal filing.
          </p>
        </div>

        {onAddNewClick && (
          <button
            onClick={onAddNewClick}
            className="px-4 py-2.5 rounded-xl bg-primary hover:bg-secondary text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 shrink-0 self-start md:self-auto"
            type="button"
          >
            <span className="material-symbols-outlined text-base">upload_file</span>
            <span>Upload New Evidence</span>
          </button>
        )}
      </div>

      {/* Discrete Evidence Status Grid (No fake percentages) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
        <div className="bg-surface-container-low dark:bg-[#161F30]/80 rounded-xl p-3.5 border border-outline-variant/30 flex flex-col">
          <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
            Total Identified
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-on-surface font-mono">{total}</span>
            <span className="text-xs text-on-surface-variant">items in docket</span>
          </div>
        </div>

        <div className="bg-emerald-50 dark:bg-emerald-950/40 rounded-xl p-3.5 border border-emerald-200 dark:border-emerald-800/60 flex flex-col">
          <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider flex items-center gap-1">
            <span className="material-symbols-outlined text-xs">verified</span>
            Collected & Verified
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-emerald-900 dark:text-emerald-200 font-mono">
              {collected}
            </span>
            <span className="text-xs text-emerald-700 dark:text-emerald-400">proofs secured</span>
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/40 rounded-xl p-3.5 border border-amber-200 dark:border-amber-800/60 flex flex-col">
          <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider flex items-center gap-1">
            <span className="material-symbols-outlined text-xs">pending</span>
            Needs Review
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-amber-900 dark:text-amber-200 font-mono">
              {reviewNeeded}
            </span>
            <span className="text-xs text-amber-700 dark:text-amber-400">action required</span>
          </div>
        </div>

        <div className="bg-red-50 dark:bg-red-950/40 rounded-xl p-3.5 border border-red-200 dark:border-red-800/60 flex flex-col">
          <span className="text-[11px] font-bold text-red-800 dark:text-red-300 uppercase tracking-wider flex items-center gap-1">
            <span className="material-symbols-outlined text-xs">priority_high</span>
            Missing
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-red-900 dark:text-red-200 font-mono">
              {missing}
            </span>
            <span className="text-xs text-red-700 dark:text-red-400">critical to procure</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-outline-variant/30">
        <span className="text-xs font-bold text-on-surface-variant mr-1">Filter Dossier:</span>
        {[
          { id: 'ALL', label: `All Items (${total})` },
          { id: 'COLLECTED', label: `Collected (${collected})` },
          { id: 'NEEDS_REVIEW', label: `Needs Review (${reviewNeeded})` },
          { id: 'MISSING', label: `Missing (${missing})` },
          { id: 'NOT_APPLICABLE', label: `N/A (${notApplicable})` }
        ].map((btn) => (
          <button
            key={btn.id}
            onClick={() => setFilterStatus(btn.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterStatus === btn.id
                ? 'bg-primary-container text-white shadow-sm font-bold'
                : 'bg-surface-container-low dark:bg-[#161F30] text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
            }`}
            type="button"
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
};
