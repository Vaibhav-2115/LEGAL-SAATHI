'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useLegalSaathi } from '../../../../context/LegalSaathiContext';
import { CaseContextBanner } from '../../../../components/CaseContextBanner';
import { CasePackagePreview } from '../../../../components/CasePackagePreview';

export default function CaseExportPage() {
  const params = useParams();
  const caseId = (params?.caseId as string) || 'LS-2026-0042';
  const { cases, userNotes } = useLegalSaathi();

  const currentCase = cases.find((c) => c.id === caseId) || cases[0];
  const notes = userNotes[caseId] || [];

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

  return (
    <div className="w-full min-h-screen bg-background text-on-surface pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
        {/* Navigation Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-on-surface-variant print:hidden">
          <Link
            href={`/cases/${currentCase.id}`}
            className="inline-flex items-center gap-1.5 font-semibold text-primary dark:text-primary-fixed hover:text-secondary transition-colors"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            <span>Back to Case Workspace</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span>
              Phase 3 • <strong className="text-on-surface">Case Package & Export Preview</strong>
            </span>
          </div>
        </div>

        {/* Case Context Header Banner */}
        <div className="print:hidden">
          <CaseContextBanner currentActionTitle="Prepare Case Package / Export" caseId={currentCase.id} />
        </div>

        {/* Hero Header */}
        <div className="bg-surface-container-lowest dark:bg-[#0F131C] border border-outline-variant/30 rounded-2xl p-6 sm:p-8 shadow-sm space-y-2 print:hidden">
          <div className="flex items-center gap-2 text-xs font-bold text-primary dark:text-primary-fixed uppercase tracking-wider">
            <span className="material-symbols-outlined text-base">inventory_2</span>
            <span>Case Package Preparation Suite</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
            Prepare Case Package / Export
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant max-w-3xl leading-relaxed">
            Review the complete structured dossier compiled from your verified facts, evidence locker, chronological events, and statutory provisions before exporting to PDF or JSON for legal counsel or tribunal filing.
          </p>
        </div>

        {/* Core Reviewable Case Package Preview */}
        <CasePackagePreview currentCase={currentCase} userNotes={notes} />
      </div>
    </div>
  );
}
