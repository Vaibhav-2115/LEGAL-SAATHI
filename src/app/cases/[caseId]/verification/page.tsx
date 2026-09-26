'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useLegalSaathi } from '../../../../context/LegalSaathiContext';
import { CaseContextBanner } from '../../../../components/CaseContextBanner';
import { VerificationSummary } from '../../../../components/VerificationSummary';
import { FactVerificationCard } from '../../../../components/FactVerificationCard';
import { FactVerificationStatus } from '../../../../lib/types';

export default function CaseVerificationPage() {
  const params = useParams();
  const caseId = (params?.caseId as string) || 'LS-2026-0042';
  const { cases, updateFactVerificationStatus, resolveFactConflict } = useLegalSaathi();

  const [filterStatus, setFilterStatus] = useState<FactVerificationStatus | 'ALL'>('ALL');

  // Case lookup
  const currentCase = cases.find((c) => c.id === caseId) || cases[0];

  if (!currentCase) {
    return (
      <div className="w-full min-h-screen bg-background text-on-surface py-12 px-4 max-w-5xl mx-auto">
        <div className="bg-surface-container-lowest dark:bg-[#0F131C] border border-outline-variant/40 rounded-2xl p-8 text-center space-y-4">
          <span className="material-symbols-outlined text-4xl text-error">error</span>
          <h1 className="font-heading text-xl font-bold">Case Not Found</h1>
          <p className="text-xs text-on-surface-variant">The requested case dossier could not be located in your active records.</p>
          <Link href="/complaints" className="inline-block px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold">
            Back to My Complaints
          </Link>
        </div>
      </div>
    );
  }

  const facts = currentCase.keyFacts || [];

  // Compute actual counts without fake accuracy meters
  const counts = {
    total: facts.length,
    confirmed: facts.filter((f) => f.verificationStatus === 'CONFIRMED').length,
    supported: facts.filter((f) => f.verificationStatus === 'SUPPORTED').length,
    needsVerification: facts.filter((f) => (f.verificationStatus || 'NEEDS_VERIFICATION') === 'NEEDS_VERIFICATION').length,
    missing: facts.filter((f) => f.verificationStatus === 'MISSING').length,
    conflicting: facts.filter((f) => f.verificationStatus === 'CONFLICTING').length
  };

  const conflictingFacts = facts.filter((f) => f.verificationStatus === 'CONFLICTING');

  const filteredFacts = facts.filter((fact) => {
    if (filterStatus === 'ALL') return true;
    const s = fact.verificationStatus || 'NEEDS_VERIFICATION';
    return s === filterStatus;
  });

  return (
    <div className="w-full min-h-screen bg-background text-on-surface pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
        {/* Navigation Breadcrumbs */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-on-surface-variant">
          <Link
            href={`/cases/${currentCase.id}`}
            className="inline-flex items-center gap-1.5 font-semibold text-primary dark:text-primary-fixed hover:text-secondary transition-colors"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            <span>Back to Case Workspace</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>
              Phase 3 • <strong className="text-on-surface">Fact & Verification Matrix</strong>
            </span>
          </div>
        </div>

        {/* Case Context Header Banner */}
        <CaseContextBanner currentActionTitle="Fact Verification Matrix" caseId={currentCase.id} />

        {/* Page Hero Description */}
        <div className="bg-surface-container-lowest dark:bg-[#0F131C] border border-outline-variant/30 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">fact_check</span>
              <h1 className="font-heading text-xl sm:text-2xl font-extrabold text-on-surface tracking-tight">
                Case Verification Matrix
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-on-surface-variant max-w-3xl leading-relaxed">
              Every factual assertion is audited against documentary records and citizen accounts. We distinguish strictly between confirmed, supported, unverified, missing, and conflicting information without fake percentage scores.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <Link
              href={`/cases/${currentCase.id}/explanation`}
              className="px-3.5 py-2 rounded-xl bg-secondary hover:bg-secondary-container text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <span className="material-symbols-outlined text-sm">gavel</span>
              <span>Why Law Applies</span>
            </Link>
            <Link
              href={`/cases/${currentCase.id}/missing-information`}
              className="px-3.5 py-2 rounded-xl bg-surface-container-low dark:bg-[#161F30] hover:bg-surface-container text-primary dark:text-primary-fixed text-xs font-bold border border-outline-variant/40 transition-colors flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">help_outline</span>
              <span>Fill Missing Info</span>
            </Link>
          </div>
        </div>

        {/* Verification Overview Section */}
        <VerificationSummary
          counts={counts}
          filterStatus={filterStatus}
          onFilterChange={(s) => setFilterStatus(s)}
        />

        {/* Conflicting Information Section (if any detected) */}
        {conflictingFacts.length > 0 && (
          <section aria-labelledby="conflicts-heading" className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-rose-600 text-xl">warning</span>
              <h2 id="conflicts-heading" className="font-heading text-base sm:text-lg font-bold text-rose-900 dark:text-rose-200">
                Conflicting Statements Requiring Attention ({conflictingFacts.length})
              </h2>
            </div>
            <p className="text-xs text-on-surface-variant">
              When opposing parties or different records present irreconcilable statements, Legal Saathi highlights the discrepancy neutrally for your review.
            </p>

            <div className="grid grid-cols-1 gap-4">
              {conflictingFacts.map((fact) => (
                <FactVerificationCard
                  key={fact.id}
                  fact={fact}
                  caseId={currentCase.id}
                  onUpdateStatus={(factId, status) => updateFactVerificationStatus(currentCase.id, factId, status)}
                  onResolveConflict={(factId, note) => resolveFactConflict(currentCase.id, factId, note)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Main Facts List */}
        <section aria-labelledby="all-facts-heading" className="space-y-4">
          <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">dataset</span>
              <h2 id="all-facts-heading" className="font-heading text-base sm:text-lg font-bold text-on-surface">
                Documented Facts on Record ({filteredFacts.length} of {facts.length})
              </h2>
            </div>
            {filterStatus !== 'ALL' && (
              <button
                type="button"
                onClick={() => setFilterStatus('ALL')}
                className="text-xs text-primary font-bold hover:underline"
              >
                Clear Filter
              </button>
            )}
          </div>

          {filteredFacts.length === 0 ? (
            <div className="bg-surface-container-lowest dark:bg-[#0F131C] border border-outline-variant/40 rounded-2xl p-8 text-center space-y-3">
              <span className="material-symbols-outlined text-3xl text-on-surface-variant">search_off</span>
              <p className="text-sm font-semibold text-on-surface">No facts match the selected status filter &ldquo;{filterStatus}&rdquo;.</p>
              <button
                type="button"
                onClick={() => setFilterStatus('ALL')}
                className="px-4 py-2 rounded-xl bg-surface-container-low dark:bg-[#161F30] text-xs font-bold text-primary hover:bg-surface-container"
              >
                View All Facts
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredFacts.map((fact) => (
                <FactVerificationCard
                  key={fact.id}
                  fact={fact}
                  caseId={currentCase.id}
                  onUpdateStatus={(factId, status) => updateFactVerificationStatus(currentCase.id, factId, status)}
                  onResolveConflict={(factId, note) => resolveFactConflict(currentCase.id, factId, note)}
                />
              ))}
            </div>
          )}
        </section>

        {/* Traceability Footer Navigation */}
        <div className="bg-surface-container-lowest dark:bg-[#0F131C] border border-outline-variant/30 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-on-surface-variant">
            <span>Next Step in Traceability:</span>
            <strong className="text-on-surface block sm:inline sm:ml-1">Understand Why This Law May Apply to These Facts</strong>
          </div>
          <Link
            href={`/cases/${currentCase.id}/explanation`}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-primary hover:bg-secondary text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
          >
            <span>Proceed to Statutory Explanation</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
