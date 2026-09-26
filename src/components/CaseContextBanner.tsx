'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLegalSaathi } from '../context/LegalSaathiContext';
import { CaseStatusBadge } from './CaseStatusBadge';

interface CaseContextBannerProps {
  currentActionTitle?: string;
  caseId?: string;
}

export const CaseContextBanner: React.FC<CaseContextBannerProps> = ({
  currentActionTitle,
  caseId
}) => {
  const { cases, activeCaseId, setActiveCaseId } = useLegalSaathi();
  const [switcherOpen, setSwitcherOpen] = useState(false);

  const targetId = caseId || activeCaseId;
  const currentCase = cases.find((c) => c.id === targetId) || cases[0];

  return (
    <aside aria-label="Active Case Context" className="w-full bg-surface-container-low dark:bg-[#0F131C] border border-outline-variant/40 rounded-2xl p-4 sm:p-5 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Case Core Identity */}
        <div className="flex flex-col gap-1.5 min-w-0">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-bold tracking-wider uppercase text-primary dark:text-primary-fixed text-[11px] bg-primary/10 dark:bg-primary/20 px-2 py-0.5 rounded">
              Active Case Context
            </span>
            <span className="text-on-surface-variant">•</span>
            <span className="font-mono font-bold text-on-surface text-xs">
              ID: {currentCase.id}
            </span>
            <CaseStatusBadge status={currentCase.status} size="sm" />
            <span className="text-on-surface-variant hidden sm:inline">•</span>
            <span className="text-xs text-on-surface-variant hidden sm:inline">
              Stage: <strong className="text-primary dark:text-primary-fixed">{currentCase.currentStage}</strong>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-heading text-lg sm:text-xl font-extrabold text-on-surface tracking-tight truncate">
              {currentCase.title}
            </h2>
            <span className="text-xs text-on-surface-variant font-medium">
              ({currentCase.category})
            </span>
          </div>

          {currentActionTitle && (
            <p className="text-xs text-secondary dark:text-secondary-fixed font-semibold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
              <span>Currently Preparing: <strong>{currentActionTitle}</strong></span>
            </p>
          )}
        </div>

        {/* Action Controls & Case Switcher */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {/* Quick Case Switcher */}
          <div className="relative">
            <button
              onClick={() => setSwitcherOpen(!switcherOpen)}
              className="px-3 py-1.5 rounded-lg bg-surface-container-lowest dark:bg-[#161F30] hover:bg-surface-container-high text-xs font-semibold text-on-surface border border-outline-variant/40 transition-colors flex items-center gap-1.5"
              type="button"
            >
              <span className="material-symbols-outlined text-sm text-secondary">swap_horiz</span>
              <span className="hidden sm:inline">Switch Case</span>
              <span className="material-symbols-outlined text-sm text-on-surface-variant">expand_more</span>
            </button>

            {switcherOpen && (
              <div className="absolute right-0 mt-1 w-72 bg-surface-container-lowest dark:bg-[#161F30] rounded-xl shadow-xl border border-outline-variant/40 py-2 z-50 text-xs">
                <div className="px-3 py-1 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider border-b border-outline-variant/30">
                  Select Active Case
                </div>
                {cases.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setActiveCaseId(c.id);
                      setSwitcherOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 hover:bg-surface-container-high dark:hover:bg-slate-700 transition-colors flex flex-col gap-0.5 ${
                      c.id === currentCase.id ? 'bg-primary/10 dark:bg-primary/20 font-bold' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[11px] text-primary dark:text-primary-fixed">{c.id}</span>
                      <span className="text-[10px] text-on-surface-variant">{c.category}</span>
                    </div>
                    <span className="truncate text-on-surface font-medium">{c.title}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Return to Case Workspace */}
          <Link
            href={`/cases/${currentCase.id}`}
            className="px-3.5 py-1.5 rounded-lg bg-surface-container-lowest dark:bg-[#161F30] hover:bg-surface-container-high text-primary dark:text-primary-fixed text-xs font-bold border border-outline-variant/40 transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <span className="material-symbols-outlined text-sm">dashboard</span>
            <span>Case Workspace</span>
          </Link>

          {/* Quick Chat Link */}
          <Link
            href="/chat"
            className="px-3.5 py-1.5 rounded-lg bg-primary hover:bg-secondary text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <span className="material-symbols-outlined text-sm">chat</span>
            <span>Ask Saathi</span>
          </Link>
        </div>
      </div>
    </aside>
  );
};
