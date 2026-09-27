'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useLegalSaathi } from '../../../context/LegalSaathiContext';
import { CaseContextBanner } from '../../../components/CaseContextBanner';
import { LegalNoticeEditor } from '../../../components/LegalNoticeEditor';
import { LegalNoticePreview } from '../../../components/LegalNoticePreview';
import { LegalNoticeDraft } from '../../../lib/types';
import { buildCaseSpecificDraft } from '../../../lib/draft-templates';

function LegalNoticeContent() {
  const searchParams = useSearchParams();
  const caseIdFromQuery = searchParams.get('caseId');
  const { cases, activeCase, activeCaseId, setActiveCaseId, legalNoticeDrafts, saveLegalNoticeDraft } = useLegalSaathi();
  const currentCase = (caseIdFromQuery ? cases.find((c) => c.id === caseIdFromQuery) : activeCase) || cases[0];
  const currentCaseId = currentCase?.id || 'LS-2026-0042';

  // Synchronize activeCaseId when specified in query param
  useEffect(() => {
    if (caseIdFromQuery && currentCase && currentCase.id !== activeCaseId) {
      setActiveCaseId(currentCase.id);
    }
  }, [caseIdFromQuery, currentCase, activeCaseId, setActiveCaseId]);

  // Build baseline initial draft from active case data
  const generateBaselineDraft = (): LegalNoticeDraft => {
    if (currentCase && legalNoticeDrafts[currentCase.id]) {
      return legalNoticeDrafts[currentCase.id];
    }
    if (currentCase) {
      return buildCaseSpecificDraft(currentCase);
    }
    return {
      recipientName: 'Opposite Party',
      recipientAddress: 'Jurisdiction of Dispute',
      senderName: 'Aggrieved Citizen',
      senderAddress: 'Correspondence Address',
      incidentDate: new Date().toLocaleDateString('en-IN'),
      demandedAmount: '₹65,000',
      curePeriodDays: 15,
      factsSummary: 'Dispute particulars recorded with Legal Saathi.',
      statutoryBasis: 'Indian Statutory Framework',
      demands: ['Immediate compliance within 15 statutory business days.']
    };
  };

  const [draft, setDraft] = useState<LegalNoticeDraft>(generateBaselineDraft);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');

  const handleSaveDraft = () => {
    if (currentCase) {
      saveLegalNoticeDraft(currentCase.id, draft);
      alert(`Legal notice draft for #${currentCase.id} saved successfully!`);
    }
  };

  const handleRegenerate = () => {
    if (confirm('Regenerate draft from active case facts and statutory citations?')) {
      setDraft(generateBaselineDraft());
    }
  };

  const handleExportPdf = () => {
    window.print();
  };

  const handleCopyText = () => {
    const text = `
FORMAL STATUTORY DEMAND NOTICE
Date: ${draft.incidentDate}

To,
${draft.recipientName} (${draft.recipientDesignation || ''})
${draft.recipientAddress}

From,
${draft.senderName}
${draft.senderAddress}

SUBJECT: Demand Notice for immediate settlement of ${draft.demandedAmount} under ${draft.statutoryBasis}.

Sir / Madam,
Under instructions from myself as aggrieved citizen, notice is hereby served upon you regarding continued failure to settle legitimate claims under Case #${currentCaseId}.

1. FACTS OF THE CASE:
${draft.factsSummary}

2. STATUTORY BASIS:
Violations of ${draft.statutoryBasis}.

3. DEMANDS:
${draft.demands.map((d, i) => `(${i + 1}) ${d}`).join('\n')}

You are provided ${draft.curePeriodDays} days from receipt of this notice to satisfy the demands, failing which appropriate tribunal and court proceedings shall be commenced.

Signoff,
${draft.senderName}
    `.trim();

    navigator.clipboard.writeText(text);
    alert('Full legal notice text copied to clipboard!');
  };

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
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
            <span className="text-on-surface font-bold">Legal Notice Builder</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-secondary"></span>
            <span className="font-mono text-xs">Pre-Litigation Recourse</span>
          </div>
        </div>

        {/* Case Context Banner */}
        <CaseContextBanner currentActionTitle="Drafting Statutory Demand Notice" caseId={currentCase.id} />

        {/* Mobile Tab Switcher */}
        <div className="lg:hidden flex items-center gap-2 bg-surface-container-low dark:bg-[#161F30] p-1.5 rounded-xl">
          <button
            onClick={() => setActiveTab('editor')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'editor'
                ? 'bg-primary text-white shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            1. Edit Details
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'preview'
                ? 'bg-primary text-white shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            2. Notice Preview
          </button>
        </div>

        {/* Desktop Split Screen / Mobile Switched Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT: Editor Panel (5 cols on Desktop) */}
          <div className={`lg:col-span-5 ${activeTab === 'preview' ? 'hidden lg:block' : 'block'}`}>
            <LegalNoticeEditor
              currentCase={currentCase}
              draft={draft}
              onDraftChange={setDraft}
              onSave={handleSaveDraft}
              onRegenerate={handleRegenerate}
            />
          </div>

          {/* RIGHT: Document Preview (7 cols on Desktop) */}
          <div className={`lg:col-span-7 ${activeTab === 'editor' ? 'hidden lg:block' : 'block'}`}>
            <LegalNoticePreview
              draft={draft}
              caseId={currentCase.id}
              onEditFieldsClick={() => setActiveTab('editor')}
              onUpdateDraft={(updated) => {
                setDraft(updated);
                saveLegalNoticeDraft(currentCase.id, updated);
              }}
              onSaveDraft={handleSaveDraft}
              onExportPdf={handleExportPdf}
              onCopyText={handleCopyText}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LegalNoticePage() {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-screen flex items-center justify-center p-8 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
            <span>Loading Legal Notice Drafter...</span>
          </div>
        </div>
      }
    >
      <LegalNoticeContent />
    </Suspense>
  );
}
