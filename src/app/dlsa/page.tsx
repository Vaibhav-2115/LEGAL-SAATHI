'use client';

import React, { useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useLegalSaathi } from '../../context/LegalSaathiContext';
import { CaseContextBanner } from '../../components/CaseContextBanner';
import { DLSAInfoCard } from '../../components/DLSAInfoCard';

function DLSAContent() {
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
            {currentCase && (
              <>
                <Link
                  href={`/cases/${currentCase.id}`}
                  className="text-primary dark:text-primary-fixed hover:text-secondary font-semibold transition-colors"
                >
                  Case #{currentCase.id}
                </Link>
                <span>/</span>
              </>
            )}
            <Link
              href="/actions"
              className="text-primary dark:text-primary-fixed hover:text-secondary font-semibold transition-colors"
            >
              Action Center
            </Link>
            <span>/</span>
            <span className="text-on-surface font-bold">DLSA & Free Legal Aid</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="font-mono text-xs">NALSA Helpline: 15100</span>
          </div>
        </div>

        {/* Case Context Banner */}
        <CaseContextBanner currentActionTitle="Seeking Free Legal Aid from DLSA" />

        {/* DLSA Component Card */}
        {currentCase ? (
          <DLSAInfoCard currentCase={currentCase} />
        ) : (
          <div className="bg-surface-container-lowest dark:bg-[#0F131C] rounded-2xl p-8 text-center">
            <p>Please select an active case from complaints to prepare a legal aid dossier.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DLSAPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-screen flex items-center justify-center p-8 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
            <span>Loading DLSA Clinic...</span>
          </div>
        </div>
      }
    >
      <DLSAContent />
    </Suspense>
  );
}
