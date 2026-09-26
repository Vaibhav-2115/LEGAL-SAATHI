'use client';

import React from 'react';
import Link from 'next/link';
import { useLegalSaathi } from '../../../context/LegalSaathiContext';
import { CaseContextBanner } from '../../../components/CaseContextBanner';
import { PrivacyConsentManager } from '../../../components/PrivacyConsentManager';

export default function ConsentAndPrivacyPage() {
  const { activeCaseId, cases } = useLegalSaathi();
  const currentCase = cases.find((c) => c.id === activeCaseId) || cases[0];

  return (
    <div className="w-full min-h-screen bg-background text-on-surface pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
        {/* Navigation Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-on-surface-variant">
          <Link
            href="/complaints"
            className="inline-flex items-center gap-1.5 font-semibold text-primary dark:text-primary-fixed hover:text-secondary transition-colors"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            <span>Back to My Complaints</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>
              <strong className="text-on-surface">Consent & Privacy Governance</strong>
            </span>
          </div>
        </div>

        {/* Case Context Header Banner */}
        <CaseContextBanner currentActionTitle="Consent & Privacy Governance" caseId={currentCase?.id} />

        {/* Hero Header */}
        <div className="bg-surface-container-lowest dark:bg-[#0F131C] border border-outline-variant/30 rounded-2xl p-6 sm:p-8 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
            <span className="material-symbols-outlined text-base">security</span>
            <span>Privacy By Design • DPDP Act 2023</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
            Consent & Privacy Center
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant max-w-3xl leading-relaxed">
            Legal Saathi gives you complete, transparent control over how your dispute data is stored, cross-referenced, and used. Inspect data categories, manage sharing preferences, or revoke participation at any time.
          </p>
        </div>

        {/* Privacy Consent Manager Component */}
        <PrivacyConsentManager caseId={currentCase?.id || 'LS-2026-0042'} />

        {/* Traceability Footer */}
        <div className="bg-surface-container-lowest dark:bg-[#0F131C] border border-outline-variant/30 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-on-surface-variant">
            <span>Explore Next:</span>
            <strong className="text-on-surface block sm:inline sm:ml-1">Review Voluntary Collective Action with Consent Safeguards</strong>
          </div>
          <Link
            href={`/cases/${currentCase?.id || 'LS-2026-0042'}/collective-action`}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-primary hover:bg-secondary text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
          >
            <span>Review Collective Action</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
