'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useLegalSaathi } from '../../../context/LegalSaathiContext';
import { CaseContextBanner } from '../../../components/CaseContextBanner';
import { VERIFIED_LEGAL_SOURCES } from '../../../lib/mock-data';
import { StatutorySource } from '../../../lib/types';

export default function LegalSourceDetailPage() {
  const params = useParams();
  const sourceId = params?.id as string;
  const { activeCase, addLegalSourceToCase } = useLegalSaathi();

  // Find source in active case or global verified list
  const currentCase = activeCase;
  const source: StatutorySource | undefined =
    currentCase?.legalSources.find((s) => s.id === sourceId) ||
    VERIFIED_LEGAL_SOURCES.find((s) => s.id === sourceId) ||
    VERIFIED_LEGAL_SOURCES[0];

  const [added, setAdded] = useState(
    Boolean(currentCase?.legalSources.some((s) => s.id === source.id))
  );
  const [showFullText, setShowFullText] = useState(false);

  const handleAddToCase = () => {
    if (currentCase && source) {
      addLegalSourceToCase(currentCase.id, source);
      setAdded(true);
    }
  };

  return (
    <div className="w-full min-h-screen bg-background text-on-surface pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
        {/* Navigation Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-on-surface-variant">
          <Link
            href="/sources"
            className="inline-flex items-center gap-1.5 font-semibold text-primary dark:text-primary-fixed hover:text-secondary transition-colors"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            <span>Back to Legal Sources</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-secondary"></span>
            <span className="font-mono text-xs">Authority ID: <strong>{source.id}</strong></span>
          </div>
        </div>

        {/* Case Context Banner */}
        <CaseContextBanner currentActionTitle={`Reviewing Statutory Grounding: ${source.title}`} />

        {/* Main Source Header Card */}
        <div className="bg-surface-container-lowest dark:bg-[#0F131C] rounded-2xl p-6 sm:p-8 shadow-sm border border-outline-variant/30 flex flex-col gap-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-mono font-bold uppercase tracking-wider text-[11px] bg-secondary-fixed text-on-secondary-fixed-variant px-2.5 py-0.5 rounded-full">
                  {source.category || 'STATUTORY AUTHORITY'}
                </span>
                {source.verified && (
                  <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-bold text-xs bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full">
                    <span className="material-symbols-outlined text-xs">verified</span>
                    Official Gazette Record
                  </span>
                )}
                {source.date && (
                  <span className="text-on-surface-variant text-xs">
                    Enacted / Pronounced: <strong>{source.date}</strong>
                  </span>
                )}
              </div>

              <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-primary dark:text-primary-fixed tracking-tight">
                {source.title}
              </h1>

              <p className="text-base font-bold font-mono text-secondary dark:text-secondary-fixed">
                {source.section}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {added ? (
                <span className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  Linked to Active Case
                </span>
              ) : (
                <button
                  onClick={handleAddToCase}
                  className="px-4 py-2.5 rounded-xl bg-primary hover:bg-secondary text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                  type="button"
                >
                  <span className="material-symbols-outlined text-sm">bookmark_add</span>
                  <span>Add to Case Dossier</span>
                </button>
              )}

              {source.officialLink && (
                <a
                  href={source.officialLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2.5 rounded-xl bg-surface-container-low dark:bg-[#161F30] hover:bg-surface-container-high border border-outline-variant/40 text-on-surface text-xs font-semibold transition-colors flex items-center gap-1.5"
                >
                  <span>Official Document</span>
                  <span className="material-symbols-outlined text-sm">open_in_new</span>
                </a>
              )}
            </div>
          </div>

          {source.authority && (
            <div className="flex items-center gap-2 pt-2 border-t border-outline-variant/20 text-xs text-on-surface-variant">
              <span className="material-symbols-outlined text-secondary text-base">account_balance</span>
              <span>Promulgating Authority / Forum: <strong>{source.authority}</strong></span>
            </div>
          )}
        </div>

        {/* Plain-Language Explanation & Applicability Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Card 1: Plain-Language Explanation */}
          <div className="bg-surface-container-lowest dark:bg-[#0F131C] rounded-2xl p-6 shadow-sm border border-outline-variant/30 flex flex-col gap-3">
            <h3 className="font-heading text-base font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">translate</span>
              Plain-Language Explanation
            </h3>
            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              {source.relevance}
            </p>
          </div>

          {/* Card 2: Why This May Apply */}
          <div className="bg-surface-container-lowest dark:bg-[#0F131C] rounded-2xl p-6 shadow-sm border border-outline-variant/30 flex flex-col gap-3">
            <h3 className="font-heading text-base font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary dark:text-primary-fixed">help</span>
              Why This May Apply to Your Dispute
            </h3>
            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              {source.whyItMatters || 'This provision establishes legal obligations and citizen remedies applicable to the subject matter of your claim.'}
            </p>
          </div>
        </div>

        {/* Case Connections: Facts, Evidence, Actions */}
        <div className="bg-surface-container-lowest dark:bg-[#0F131C] rounded-2xl p-6 shadow-sm border border-outline-variant/30 flex flex-col gap-5">
          <h3 className="font-heading text-lg font-bold text-on-surface">
            Case Connections & Practical Next Steps
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            {/* Related Case Facts */}
            <div className="bg-surface-container-low dark:bg-[#161F30] p-4 rounded-xl space-y-2">
              <span className="font-bold text-on-surface block text-[11px] uppercase tracking-wider flex items-center gap-1 text-secondary">
                <span className="material-symbols-outlined text-sm">fact_check</span>
                Grounded Case Facts
              </span>
              <ul className="space-y-1.5 pl-4 list-disc text-on-surface-variant text-[11px]">
                {source.relatedFacts && source.relatedFacts.length > 0 ? (
                  source.relatedFacts.map((f, i) => <li key={i}>{f}</li>)
                ) : (
                  <li>Relevant to citizen factual assertions in docket.</li>
                )}
              </ul>
            </div>

            {/* Related Evidence */}
            <div className="bg-surface-container-low dark:bg-[#161F30] p-4 rounded-xl space-y-2">
              <span className="font-bold text-on-surface block text-[11px] uppercase tracking-wider flex items-center gap-1 text-emerald-700 dark:text-emerald-400">
                <span className="material-symbols-outlined text-sm">verified</span>
                Required Proof Records
              </span>
              <ul className="space-y-1.5 pl-4 list-disc text-on-surface-variant text-[11px]">
                {source.relatedEvidence && source.relatedEvidence.length > 0 ? (
                  source.relatedEvidence.map((e, i) => <li key={i}>{e}</li>)
                ) : (
                  <li>Documentary proof establishing payment and notice.</li>
                )}
              </ul>
            </div>

            {/* Related Actions */}
            <div className="bg-surface-container-low dark:bg-[#161F30] p-4 rounded-xl space-y-2">
              <span className="font-bold text-on-surface block text-[11px] uppercase tracking-wider flex items-center gap-1 text-primary dark:text-primary-fixed">
                <span className="material-symbols-outlined text-sm">play_circle</span>
                Recommended Pathways
              </span>
              <ul className="space-y-1.5 pl-4 list-disc text-on-surface-variant text-[11px]">
                {source.relatedActions && source.relatedActions.length > 0 ? (
                  source.relatedActions.map((a, i) => <li key={i}>{a}</li>)
                ) : (
                  <li>Formal Demand Notice & Dispute Resolution.</li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Full Text / Statutory Excerpt Accordion */}
        <div className="bg-surface-container-lowest dark:bg-[#0F131C] rounded-2xl p-6 shadow-sm border border-outline-variant/30 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-base font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">menu_book</span>
              Official Statutory Text
            </h3>
            <button
              onClick={() => setShowFullText(!showFullText)}
              className="px-3 py-1.5 rounded-lg bg-surface-container-low dark:bg-[#161F30] hover:bg-surface-container-high text-xs font-semibold text-secondary dark:text-secondary-fixed transition-colors flex items-center gap-1"
              type="button"
            >
              <span>{showFullText ? 'Collapse Statutory Text' : 'Expand Full Text'}</span>
              <span className="material-symbols-outlined text-sm">
                {showFullText ? 'expand_less' : 'expand_more'}
              </span>
            </button>
          </div>

          <div className="p-4 rounded-xl bg-surface-container-lowest dark:bg-[#090D16] border border-outline-variant/30 text-xs sm:text-sm font-mono text-on-surface leading-relaxed whitespace-pre-line">
            {showFullText ? (source.fullTextPreview || source.excerpt) : source.excerpt}
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="flex items-center justify-between pt-2">
          <Link
            href="/sources"
            className="px-4 py-2 rounded-xl bg-surface-container-low dark:bg-[#161F30] hover:bg-surface-container-high text-on-surface text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            <span>Back to Legal Sources</span>
          </Link>

          <Link
            href="/actions"
            className="px-5 py-2.5 rounded-xl bg-primary hover:bg-secondary text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <span>Proceed to Action Center</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
