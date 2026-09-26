'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useLegalSaathi } from '../../../../../context/LegalSaathiContext';
import { CaseContextBanner } from '../../../../../components/CaseContextBanner';
import { SourceComparisonView } from '../../../../../components/SourceComparisonView';

export default function CompareLegalSourcesPage() {
  const params = useParams();
  const caseId = (params?.caseId as string) || 'LS-2026-0042';
  const { cases } = useLegalSaathi();

  const currentCase = cases.find((c) => c.id === caseId) || cases[0];

  if (!currentCase) {
    return (
      <div className="w-full min-h-screen bg-background text-on-surface py-12 px-4 max-w-5xl mx-auto">
        <div className="bg-surface-container-lowest dark:bg-[#0F131C] border border-outline-variant/40 rounded-2xl p-8 text-center space-y-4">
          <span className="material-symbols-outlined text-4xl text-error">error</span>
          <h1 className="font-heading text-xl font-bold">Case Not Found</h1>
          <p className="text-xs text-on-surface-variant">The requested case could not be located.</p>
          <Link href="/complaints" className="inline-block px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold">
            Back to Complaints
          </Link>
        </div>
      </div>
    );
  }

  // Pre-selected sources based on case category
  const initialSourceIds = currentCase.legalSources.length > 0
    ? currentCase.legalSources.map((s) => s.id)
    : ['ls1', 'ls2', 'ls3'];

  return (
    <div className="w-full min-h-screen bg-background text-on-surface pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
        {/* Navigation Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-on-surface-variant">
          <Link
            href={`/cases/${currentCase.id}`}
            className="inline-flex items-center gap-1.5 font-semibold text-primary dark:text-primary-fixed hover:text-secondary transition-colors"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            <span>Back to Case Workspace</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-secondary" />
            <span>
              Phase 3 • <strong className="text-on-surface">Comparative Legal Authorities</strong>
            </span>
          </div>
        </div>

        {/* Case Context Header Banner */}
        <CaseContextBanner currentActionTitle="Compare Legal Sources" caseId={currentCase.id} />

        {/* Page Hero Description */}
        <div className="bg-surface-container-lowest dark:bg-[#0F131C] border border-outline-variant/30 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">compare_arrows</span>
              <h1 className="font-heading text-xl sm:text-2xl font-extrabold text-on-surface tracking-tight">
                Compare Legal Sources & Precedents
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-on-surface-variant max-w-3xl leading-relaxed">
              Examine multiple statutory enactments, administrative rules, and Supreme Court judgments in parallel to evaluate alternative legal remedies for &ldquo;{currentCase.title}&rdquo;.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <Link
              href={`/cases/${currentCase.id}/explanation`}
              className="px-3.5 py-2 rounded-xl bg-surface-container-low dark:bg-[#161F30] hover:bg-surface-container text-primary dark:text-primary-fixed text-xs font-bold border border-outline-variant/40 transition-colors flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">gavel</span>
              <span>Why Law Applies</span>
            </Link>
            <Link
              href="/sources"
              className="px-3.5 py-2 rounded-xl bg-secondary hover:bg-secondary-container text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <span className="material-symbols-outlined text-sm">library_books</span>
              <span>All Sources Library</span>
            </Link>
          </div>
        </div>

        {/* Core Source Comparison View */}
        <SourceComparisonView
          caseId={currentCase.id}
          initialSourceIds={initialSourceIds}
          caseTitle={currentCase.title}
        />

        {/* Traceability Footer */}
        <div className="bg-surface-container-lowest dark:bg-[#0F131C] border border-outline-variant/30 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-on-surface-variant">
            <span>Next in Journey:</span>
            <strong className="text-on-surface block sm:inline sm:ml-1">Fill Missing Factual Gaps to Solidify Statutory Claim</strong>
          </div>
          <Link
            href={`/cases/${currentCase.id}/missing-information`}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-primary hover:bg-secondary text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
          >
            <span>Address Missing Information</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
