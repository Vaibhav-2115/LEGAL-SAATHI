'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useLegalSaathi } from '../../../../context/LegalSaathiContext';
import { CaseContextBanner } from '../../../../components/CaseContextBanner';
import { CaseTimelineView } from '../../../../components/CaseTimelineView';

export default function CaseTimelinePage() {
  const params = useParams();
  const caseId = (params?.caseId as string) || 'LS-2026-0042';
  const { cases, addTimelineEvent, updateTimelineEvent } = useLegalSaathi();

  const currentCase = cases.find((c) => c.id === caseId) || cases[0];

  if (!currentCase) {
    return (
      <div className="w-full min-h-screen bg-background text-on-surface py-12 px-4 max-w-5xl mx-auto">
        <div className="bg-surface-container-lowest dark:bg-[#0F131C] border border-outline-variant/40 rounded-2xl p-8 text-center space-y-4">
          <span className="material-symbols-outlined text-4xl text-error">error</span>
          <h1 className="font-heading text-xl font-bold">Case Not Found</h1>
          <p className="text-xs text-on-surface-variant">The requested case dossier could not be located.</p>
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
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-on-surface-variant">
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
              Phase 3 • <strong className="text-on-surface">Procedural History & Timeline</strong>
            </span>
          </div>
        </div>

        {/* Case Context Header Banner */}
        <CaseContextBanner currentActionTitle="Procedural Case Timeline" caseId={currentCase.id} />

        {/* Page Hero Description */}
        <div className="bg-surface-container-lowest dark:bg-[#0F131C] border border-outline-variant/30 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">history</span>
              <h1 className="font-heading text-xl sm:text-2xl font-extrabold text-on-surface tracking-tight">
                Case Chronology & Timeline
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-on-surface-variant max-w-3xl leading-relaxed">
              Maintain an unbroken audit trail of incidents, consultations, evidence uploads, statutory discoveries, and procedural notices dispatched.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <Link
              href={`/cases/${currentCase.id}/evidence`}
              className="px-3.5 py-2 rounded-xl bg-surface-container-low dark:bg-[#161F30] hover:bg-surface-container text-primary dark:text-primary-fixed text-xs font-bold border border-outline-variant/40 transition-colors flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">attachment</span>
              <span>Evidence Locker</span>
            </Link>
            <Link
              href={`/cases/${currentCase.id}/sources/compare`}
              className="px-3.5 py-2 rounded-xl bg-secondary hover:bg-secondary-container text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <span className="material-symbols-outlined text-sm">menu_book</span>
              <span>Compare Sources</span>
            </Link>
          </div>
        </div>

        {/* Core Timeline View */}
        <CaseTimelineView
          timeline={currentCase.timeline || []}
          caseId={currentCase.id}
          currentStage={currentCase.currentStage}
          nextStepTitle={currentCase.nextStep?.title}
          nextStepActionUrl={currentCase.nextStep?.actionUrl}
          onAddEvent={(evt) => addTimelineEvent(currentCase.id, evt)}
          onUpdateEvent={(id, updates) => updateTimelineEvent(currentCase.id, id, updates)}
        />

        {/* Traceability Footer */}
        <div className="bg-surface-container-lowest dark:bg-[#0F131C] border border-outline-variant/30 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-on-surface-variant">
            <span>Next in Journey:</span>
            <strong className="text-on-surface block sm:inline sm:ml-1">Compare Alternative Legal Sources Grounding This Dispute</strong>
          </div>
          <Link
            href={`/cases/${currentCase.id}/sources/compare`}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-primary hover:bg-secondary text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
          >
            <span>Compare Legal Sources</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
