'use client';

import React from 'react';
import Link from 'next/link';
import { useLegalSaathi } from '../../../context/LegalSaathiContext';
import { CaseContextBanner } from '../../../components/CaseContextBanner';
import { EFIRGuidancePanel } from '../../../components/EFIRGuidancePanel';

export default function EFIRGuidancePage() {
  const { activeCase } = useLegalSaathi();
  const currentCase = activeCase;

  if (!currentCase) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold">No active case selected</h2>
        <Link href="/complaints" className="text-primary underline mt-2 block">Select a case</Link>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-background text-on-surface pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
        {/* Navigation Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-on-surface-variant">
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="text-primary dark:text-primary-fixed hover:text-secondary font-semibold transition-colors"
            >
              Dashboard
            </Link>
            <span>/</span>
            <Link
              href={`/cases/${currentCase.id}`}
              className="text-primary dark:text-primary-fixed hover:text-secondary font-semibold transition-colors"
            >
              Case #{currentCase.id}
            </Link>
            <span>/</span>
            <Link
              href="/actions"
              className="text-primary dark:text-primary-fixed hover:text-secondary font-semibold transition-colors"
            >
              Action Center
            </Link>
            <span>/</span>
            <span className="text-on-surface font-bold">e-FIR Guidance</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            <span className="font-mono text-xs">Pre-Reporting Dossier Preparation</span>
          </div>
        </div>

        {/* Case Context Banner */}
        <CaseContextBanner currentActionTitle="Structuring Facts for Police Reporting / e-FIR" caseId={currentCase.id} />

        {/* Main e-FIR Guidance Wizard */}
        <EFIRGuidancePanel currentCase={currentCase} />
      </div>
    </div>
  );
}
