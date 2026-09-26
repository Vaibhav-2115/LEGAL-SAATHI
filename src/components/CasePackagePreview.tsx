'use client';

import React, { useState } from 'react';
import { LegalCase } from '../lib/types';

interface CasePackagePreviewProps {
  currentCase: LegalCase;
  userNotes?: string[];
}

export const CasePackagePreview: React.FC<CasePackagePreviewProps> = ({
  currentCase,
  userNotes = []
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const verifiedFacts = currentCase.keyFacts.filter(
    (f) => f.verificationStatus === 'CONFIRMED' || f.verificationStatus === 'SUPPORTED'
  );
  const unverifiedFacts = currentCase.keyFacts.filter(
    (f) => f.verificationStatus !== 'CONFIRMED' && f.verificationStatus !== 'SUPPORTED'
  );

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJSON = () => {
    const casePackageData = {
      packageTitle: `Legal Saathi Dossier Package — ${currentCase.id}`,
      generatedAt: new Date().toISOString(),
      caseMetadata: {
        id: currentCase.id,
        title: currentCase.title,
        category: currentCase.category,
        jurisdiction: currentCase.jurisdiction,
        status: currentCase.status,
        claimAmount: currentCase.claimAmount,
        createdAt: currentCase.createdAt
      },
      caseSummary: currentCase.summary,
      citizenStatement: currentCase.citizenStatement,
      facts: {
        verifiedCount: verifiedFacts.length,
        verified: verifiedFacts,
        pendingReviewCount: unverifiedFacts.length,
        pendingReview: unverifiedFacts
      },
      evidenceLocker: currentCase.evidenceList,
      timelineEvents: currentCase.timeline,
      statutoryGrounding: currentCase.legalSources,
      nextStep: currentCase.nextStep,
      citizenNotes: userNotes,
      disclaimer: 'Legal Saathi civic legal dossier for informational presentation and tribunal preparation.'
    };

    const blob = new Blob([JSON.stringify(casePackageData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Case_Package_${currentCase.id}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccess('Structured JSON package downloaded successfully.');
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  const handleCopyClipboard = () => {
    const textSummary = `LEGAL SAATHI DOSSIER: ${currentCase.id}
Title: ${currentCase.title}
Category: ${currentCase.category}
Jurisdiction: ${currentCase.jurisdiction}
Claim: ${currentCase.claimAmount || 'N/A'}
Status: ${currentCase.status}

SUMMARY:
${currentCase.summary}

VERIFIED FACTS (${verifiedFacts.length}):
${verifiedFacts.map((f, i) => `${i + 1}. ${f.statement} [${f.source}]`).join('\n')}

EVIDENCE LIST (${currentCase.evidenceList.length}):
${currentCase.evidenceList.map((e, i) => `${i + 1}. ${e.name} (${e.status})`).join('\n')}

STATUTORY SOURCES:
${currentCase.legalSources.map((s, i) => `${i + 1}. ${s.title} (${s.section})`).join('\n')}
`;

    navigator.clipboard.writeText(textSummary);
    setDownloadSuccess('Dossier summary copied to clipboard.');
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Action Toolbar */}
      <section
        aria-label="Export Actions"
        className="bg-surface-container-lowest dark:bg-[#0F131C] border border-outline-variant/40 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden"
      >
        <div>
          <h2 className="font-heading text-base sm:text-lg font-bold text-on-surface">
            Case Package Actions
          </h2>
          <p className="text-xs text-on-surface-variant">
            Export certified print document, structured JSON data, or copy a quick summary.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl bg-primary hover:bg-secondary text-white text-xs font-bold transition-colors shadow-sm flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">print</span>
            <span>Print / Save PDF</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadJSON}
            className="px-4 py-2.5 rounded-xl bg-surface-container-low dark:bg-[#161F30] hover:bg-surface-container border border-outline-variant/40 text-xs font-bold text-on-surface transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">download</span>
            <span>Export Structured JSON</span>
          </button>

          <button
            type="button"
            onClick={handleCopyClipboard}
            className="px-3 py-2.5 rounded-xl bg-surface-container-low dark:bg-[#161F30] hover:bg-surface-container border border-outline-variant/40 text-xs font-semibold text-on-surface transition-colors flex items-center gap-1"
            title="Copy plain-text summary"
          >
            <span className="material-symbols-outlined text-sm">content_copy</span>
          </button>
        </div>
      </section>

      {/* Toast Notification */}
      {downloadSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-lg flex items-center gap-2 print:hidden">
          <span className="material-symbols-outlined text-base">check_circle</span>
          <span>{downloadSuccess}</span>
        </div>
      )}

      {/* Reviewable Case Package Preview (Printable Section) */}
      <article
        aria-label="Certified Dossier Preview"
        className="bg-surface-container-lowest dark:bg-[#0F131C] border border-outline-variant/40 rounded-2xl p-6 sm:p-10 shadow-sm space-y-8 print:p-0 print:border-none print:shadow-none"
      >
        {/* Dossier Document Header */}
        <div className="border-b-2 border-primary/20 pb-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-primary dark:text-primary-fixed block">
              Official Legal Saathi Civic Dossier
            </span>
            <h1 className="font-heading text-2xl sm:text-3xl font-black text-on-surface">
              {currentCase.title}
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-on-surface-variant font-medium pt-1">
              <span>Category: <strong>{currentCase.category}</strong></span>
              <span>•</span>
              <span>Jurisdiction: <strong>{currentCase.jurisdiction}</strong></span>
              <span>•</span>
              <span>Claim Sum: <strong>{currentCase.claimAmount || 'Unspecified'}</strong></span>
            </div>
          </div>

          <div className="text-left sm:text-right text-xs text-on-surface-variant shrink-0 space-y-1">
            <div className="font-mono font-bold text-sm text-primary dark:text-primary-fixed">
              Dossier #{currentCase.id}
            </div>
            <div>Generated: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
            <div className="font-semibold text-emerald-600">Status: {currentCase.status}</div>
          </div>
        </div>

        {/* Section 1: Executive Case Summary */}
        <section aria-labelledby="summary-heading" className="space-y-2">
          <h2 id="summary-heading" className="text-xs font-extrabold uppercase tracking-wider text-primary dark:text-primary-fixed flex items-center gap-1.5 border-b border-outline-variant/30 pb-1.5">
            <span className="material-symbols-outlined text-sm">summarize</span>
            <span>1. Executive Summary & Citizen Statement</span>
          </h2>
          <p className="text-xs sm:text-sm text-on-surface leading-relaxed p-4 rounded-xl bg-surface-container-low dark:bg-[#161F30]/60 border border-outline-variant/20 italic">
            &ldquo;{currentCase.citizenStatement}&rdquo;
          </p>
          <div className="text-xs text-on-surface-variant pt-1">
            <strong>Factual Narrative:</strong> {currentCase.summary}
          </div>
        </section>

        {/* Section 2: Key Facts on Record */}
        <section aria-labelledby="facts-heading" className="space-y-3">
          <h2 id="facts-heading" className="text-xs font-extrabold uppercase tracking-wider text-primary dark:text-primary-fixed flex items-center gap-1.5 border-b border-outline-variant/30 pb-1.5">
            <span className="material-symbols-outlined text-sm">fact_check</span>
            <span>2. Key Factual Matrix ({currentCase.keyFacts.length} Facts)</span>
          </h2>

          <div className="space-y-3">
            <div>
              <h3 className="text-xs font-bold text-emerald-800 dark:text-emerald-300 mb-2 flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">verified</span>
                <span>Verified Facts ({verifiedFacts.length})</span>
              </h3>
              <ul className="space-y-2 text-xs">
                {verifiedFacts.map((fact) => (
                  <li key={fact.id} className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-300/40 flex items-start gap-2">
                    <span className="material-symbols-outlined text-emerald-600 text-sm shrink-0 mt-0.5">check_circle</span>
                    <div className="min-w-0">
                      <span className="font-semibold text-on-surface">{fact.statement}</span>
                      <div className="text-[10px] text-on-surface-variant mt-0.5">
                        Category: {fact.category} • Source: {fact.source} • Status: {fact.verificationStatus}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {unverifiedFacts.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-amber-800 dark:text-amber-300 mb-2 flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">pending_actions</span>
                  <span>Pending Further Verification / Conflicting ({unverifiedFacts.length})</span>
                </h3>
                <ul className="space-y-2 text-xs">
                  {unverifiedFacts.map((fact) => (
                    <li key={fact.id} className="p-3 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-300/40 flex items-start gap-2">
                      <span className="material-symbols-outlined text-amber-600 text-sm shrink-0 mt-0.5">info</span>
                      <div className="min-w-0">
                        <span className="font-semibold text-on-surface">{fact.statement}</span>
                        <div className="text-[10px] text-on-surface-variant mt-0.5">
                          Status: {fact.verificationStatus || 'NEEDS_VERIFICATION'}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>

        {/* Section 3: Evidence Inventory */}
        <section aria-labelledby="evidence-heading" className="space-y-3">
          <h2 id="evidence-heading" className="text-xs font-extrabold uppercase tracking-wider text-primary dark:text-primary-fixed flex items-center gap-1.5 border-b border-outline-variant/30 pb-1.5">
            <span className="material-symbols-outlined text-sm">attachment</span>
            <span>3. Evidence Inventory ({currentCase.evidenceList.length} Items)</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {currentCase.evidenceList.map((ev) => (
              <div key={ev.id} className="p-3 rounded-xl bg-surface-container-low dark:bg-[#161F30]/60 border border-outline-variant/30 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-on-surface">{ev.name}</span>
                  <span className="text-[10px] font-semibold text-primary">{ev.status}</span>
                </div>
                <div className="text-[11px] text-on-surface-variant">
                  Category: {ev.category} {ev.collectedAt && `• Collected: ${ev.collectedAt}`}
                </div>
                {ev.notes && (
                  <p className="text-[11px] text-on-surface-variant italic">&ldquo;{ev.notes}&rdquo;</p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Section 4: Chronological Timeline */}
        <section aria-labelledby="timeline-heading" className="space-y-3">
          <h2 id="timeline-heading" className="text-xs font-extrabold uppercase tracking-wider text-primary dark:text-primary-fixed flex items-center gap-1.5 border-b border-outline-variant/30 pb-1.5">
            <span className="material-symbols-outlined text-sm">timeline</span>
            <span>4. Procedural Timeline ({currentCase.timeline.length} Events)</span>
          </h2>

          <div className="space-y-2 text-xs">
            {currentCase.timeline.map((evt) => (
              <div key={evt.id} className="p-3 rounded-xl bg-surface-container-low dark:bg-[#161F30]/60 border border-outline-variant/30 flex items-start justify-between gap-4">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-on-surface">{evt.title}</span>
                    <span className="text-[10px] font-mono px-2 py-0.2 bg-primary/10 text-primary rounded">
                      {evt.stage}
                    </span>
                  </div>
                  <p className="text-on-surface-variant">{evt.description}</p>
                </div>
                <span className="text-[11px] text-on-surface-variant font-mono shrink-0">
                  {evt.date}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Section 5: Relevant Statutory Provisions */}
        <section aria-labelledby="sources-heading" className="space-y-3">
          <h2 id="sources-heading" className="text-xs font-extrabold uppercase tracking-wider text-primary dark:text-primary-fixed flex items-center gap-1.5 border-b border-outline-variant/30 pb-1.5">
            <span className="material-symbols-outlined text-sm">gavel</span>
            <span>5. Statutory Grounding & Sources ({currentCase.legalSources.length})</span>
          </h2>

          <div className="space-y-3 text-xs">
            {currentCase.legalSources.map((source) => (
              <div key={source.id} className="p-4 rounded-xl bg-surface-container-low dark:bg-[#161F30]/60 border border-outline-variant/30 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-on-surface text-sm">{source.title}</span>
                    <span className="font-mono text-primary font-bold">{source.section}</span>
                  </div>
                  <span className="text-[10px] text-on-surface-variant font-mono">{source.date}</span>
                </div>
                <p className="font-serif italic text-on-surface leading-relaxed p-2.5 rounded-lg bg-surface dark:bg-[#161F30] border-l-4 border-primary">
                  &ldquo;{source.excerpt}&rdquo;
                </p>
                <div className="text-[11px] text-on-surface-variant">
                  <strong>Relevance:</strong> {source.relevance}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 6: User Notes */}
        {userNotes.length > 0 && (
          <section aria-labelledby="notes-heading" className="space-y-2">
            <h2 id="notes-heading" className="text-xs font-extrabold uppercase tracking-wider text-primary dark:text-primary-fixed flex items-center gap-1.5 border-b border-outline-variant/30 pb-1.5">
              <span className="material-symbols-outlined text-sm">edit_note</span>
              <span>6. Citizen Casework Notes</span>
            </h2>
            <ul className="space-y-1.5 text-xs text-on-surface">
              {userNotes.map((note, idx) => (
                <li key={idx} className="p-2.5 rounded-lg bg-surface-container-low dark:bg-[#161F30]/60 border border-outline-variant/30">
                  {note}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Certification & Privacy Notice Footer */}
        <div className="border-t-2 border-primary/20 pt-4 text-[10px] text-on-surface-variant flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Certified under Legal Saathi Civic Information Protocol • DPDP Act 2023 Compliant</span>
          <span>End of Case Package • Dossier #{currentCase.id}</span>
        </div>
      </article>
    </div>
  );
};
