'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useLegalSaathi } from '../../../../context/LegalSaathiContext';
import { CaseContextBanner } from '../../../../components/CaseContextBanner';
import { FactToLawTrace } from '../../../../components/FactToLawTrace';
import { LEGAL_EXPLANATION_TRACES } from '../../../../lib/mock-data';
import { LegalExplanationTrace } from '../../../../lib/types';

export default function WhyThisLawMayApplyPage() {
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
          <p className="text-xs text-on-surface-variant">The requested case dossier could not be found.</p>
          <Link href="/complaints" className="inline-block px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold">
            Back to Complaints
          </Link>
        </div>
      </div>
    );
  }

  // Retrieve matching explanation trace or synthesize from case data
  const trace: LegalExplanationTrace = LEGAL_EXPLANATION_TRACES[currentCase.id] || {
    caseId: currentCase.id,
    whatIUnderstand: currentCase.summary || currentCase.citizenStatement,
    legalIssue: {
      title: `${currentCase.category} Dispute & Statutory Non-Compliance`,
      category: currentCase.category,
      description: `Analysis of rights and reciprocal obligations arising under Indian law for ${currentCase.title}.`
    },
    relevantProvision: {
      title: currentCase.legalSources[0]?.title || 'Indian Contract Act, 1872',
      section: currentCase.legalSources[0]?.section || 'Section 73',
      authority: currentCase.legalSources[0]?.authority || 'Parliament of India',
      statutoryText: currentCase.legalSources[0]?.excerpt || 'When a contract has been broken, the party who suffers by such breach is entitled to receive compensation.'
    },
    whyItMayApply: `Based on the facts on record, this statutory provision may be relevant because:\n• The citizen entered into a lawful relationship within the territorial jurisdiction of ${currentCase.jurisdiction}.\n• Available facts indicate non-performance or refusal to honor agreed contractual terms.\n• The statutory period for compliance has elapsed without written justification.`,
    supportingFacts: currentCase.keyFacts.map((f, i) => `Fact #${i + 1}: ${f.statement} (${f.verificationStatus || 'Supported'})`),
    supportingEvidence: currentCase.evidenceList.map((e) => e.name),
    informationStillNeeded: [
      'Written correspondence confirming the counterparty acknowledged the initial transaction',
      'Bank statement or certified receipt validating the claimed amount'
    ],
    sourceId: currentCase.legalSources[0]?.id || 'ls1',
    nextAction: {
      title: currentCase.nextStep?.title || 'Issue Formal Demand Notice',
      description: currentCase.nextStep?.description || 'Prepare a formal statutory notice giving 15 days to remedy breach.',
      url: currentCase.nextStep?.actionUrl || '/draft/legal-notice',
      ctaText: currentCase.nextStep?.actionText || 'Proceed to Notice Assistant'
    }
  };

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
              Phase 3 • <strong className="text-on-surface">Statutory Grounding & Traceability</strong>
            </span>
          </div>
        </div>

        {/* Case Context Header Banner */}
        <CaseContextBanner currentActionTitle="Why This Law May Apply" caseId={currentCase.id} />

        {/* Page Hero Description */}
        <div className="bg-surface-container-lowest dark:bg-[#0F131C] border border-outline-variant/30 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">gavel</span>
              <h1 className="font-heading text-xl sm:text-2xl font-extrabold text-on-surface tracking-tight">
                Why This Law May Apply
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-on-surface-variant max-w-3xl leading-relaxed">
              Understand the precise statutory rationale linking your verified facts and evidence directly to Indian legal provisions, tribunals, and recommended procedural actions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <Link
              href={`/cases/${currentCase.id}/verification`}
              className="px-3.5 py-2 rounded-xl bg-surface-container-low dark:bg-[#161F30] hover:bg-surface-container text-primary dark:text-primary-fixed text-xs font-bold border border-outline-variant/40 transition-colors flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">fact_check</span>
              <span>Verify Facts</span>
            </Link>
            <Link
              href={`/cases/${currentCase.id}/sources/compare`}
              className="px-3.5 py-2 rounded-xl bg-secondary hover:bg-secondary-container text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <span className="material-symbols-outlined text-sm">compare_arrows</span>
              <span>Compare Sources</span>
            </Link>
          </div>
        </div>

        {/* Core Fact to Law Traceability Component */}
        <FactToLawTrace trace={trace} caseId={currentCase.id} />

        {/* Footer Navigation */}
        <div className="bg-surface-container-lowest dark:bg-[#0F131C] border border-outline-variant/30 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-on-surface-variant">
            <span>Next in Journey:</span>
            <strong className="text-on-surface block sm:inline sm:ml-1">Inspect Complete Procedural History on Timeline</strong>
          </div>
          <Link
            href={`/cases/${currentCase.id}/timeline`}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-primary hover:bg-secondary text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
          >
            <span>Proceed to Case Timeline</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
