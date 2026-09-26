'use client';

import React, { useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useLegalSaathi } from '../../../context/LegalSaathiContext';
import { CaseContextBanner } from '../../../components/CaseContextBanner';
import { RTIStepper } from '../../../components/RTIStepper';

function RTIAssistantContent() {
  const searchParams = useSearchParams();
  const caseIdFromQuery = searchParams.get('caseId');
  const { cases, activeCase, activeCaseId, setActiveCaseId } = useLegalSaathi();
  const currentCase = (caseIdFromQuery ? cases.find((c) => c.id === caseIdFromQuery) : activeCase) || cases[0];

  // Synchronize activeCaseId when specified in query param
  useEffect(() => {
    if (caseIdFromQuery && currentCase && currentCase.id !== activeCaseId) {
      setActiveCaseId(currentCase.id);
    }
  }, [caseIdFromQuery, currentCase, activeCaseId, setActiveCaseId]);

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
              href="/dashboard"
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
            <span className="text-on-surface font-bold">RTI Assistant</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-secondary"></span>
            <span className="font-mono text-xs">Section 6(1) Public Records Requisition</span>
          </div>
        </div>

        {/* Case Context Banner */}
        <CaseContextBanner currentActionTitle="Preparing Right to Information (RTI) Application" caseId={currentCase.id} />

        {/* RTI Stepper Wizard */}
        <RTIStepper currentCase={currentCase} />
      </div>
    </div>
  );
}

export default function RTIAssistantPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-screen flex items-center justify-center p-8 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
            <span>Loading RTI Drafter...</span>
          </div>
        </div>
      }
    >
      <RTIAssistantContent />
    </Suspense>
  );
}
