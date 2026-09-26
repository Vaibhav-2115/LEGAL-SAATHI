'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useLegalSaathi } from '../../../context/LegalSaathiContext';
import { SIMILAR_CASE_CLUSTERS } from '../../../lib/mock-data';

export default function SimilarCaseGroupPage() {
  const params = useParams();
  const clusterId = params?.clusterId as string;
  const { activeCaseId } = useLegalSaathi();

  const cluster = SIMILAR_CASE_CLUSTERS.find((c) => c.id === clusterId) || SIMILAR_CASE_CLUSTERS[0];

  if (!cluster) {
    return (
      <div className="w-full min-h-screen bg-background text-on-surface py-12 px-4 max-w-5xl mx-auto">
        <div className="bg-surface-container-lowest dark:bg-[#0F131C] border border-outline-variant/40 rounded-2xl p-8 text-center space-y-4">
          <span className="material-symbols-outlined text-4xl text-error">error</span>
          <h1 className="font-heading text-xl font-bold">Cluster Pattern Not Found</h1>
          <p className="text-xs text-on-surface-variant">The requested pattern group could not be located.</p>
          <Link href="/similar-cases" className="inline-block px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold">
            Back to Similar Cases
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
            href="/similar-cases"
            className="inline-flex items-center gap-1.5 font-semibold text-primary dark:text-primary-fixed hover:text-secondary transition-colors"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            <span>Back to All Similar Cases</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-secondary" />
            <span>
              Pattern Group: <strong className="text-on-surface">{cluster.id}</strong>
            </span>
          </div>
        </div>

        {/* Cluster Header Overview */}
        <div className="bg-surface-container-lowest dark:bg-[#0F131C] border border-outline-variant/30 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-secondary dark:text-secondary-fixed bg-secondary/10 px-2.5 py-1 rounded-md">
                {cluster.category}
              </span>
              <span className="text-xs text-on-surface-variant font-medium">
                • {cluster.jurisdictionRegion}
              </span>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
              <span className="material-symbols-outlined text-base">groups</span>
              <span>{cluster.caseCount} Potentially Similar Cases Analyzed</span>
            </div>
          </div>

          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
            {cluster.title}
          </h1>

          <div className="p-4 rounded-xl bg-surface-container-low dark:bg-[#161F30]/80 border border-outline-variant/30 space-y-1">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-on-surface-variant block">
              Core Civic Grievance
            </span>
            <p className="text-sm text-on-surface leading-relaxed font-medium">
              {cluster.commonIssue}
            </p>
          </div>

          {/* Privacy Notice Banner */}
          <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-300/40 text-xs text-emerald-900 dark:text-emerald-300">
            <span className="material-symbols-outlined text-emerald-600 text-lg shrink-0">verified_user</span>
            <span>{cluster.privacyNotice}</span>
          </div>
        </div>

        {/* Why These Cases Appear Similar Breakdown */}
        <section
          aria-labelledby="why-similar-heading"
          className="bg-surface-container-lowest dark:bg-[#0F131C] border border-outline-variant/40 rounded-2xl p-6 shadow-sm space-y-4"
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl">hub</span>
            <h2 id="why-similar-heading" className="font-heading text-lg font-bold text-on-surface">
              Why These Cases Appear Similar
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
            Pattern detected from available information. The Legal Saathi Engine groups disputes according to 4 fundamental dimensions without sharing identifiable citizen data:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            {/* Dimension 1: Similar Issue */}
            <div className="p-4 rounded-xl bg-primary/5 dark:bg-primary/10 border border-primary/20 space-y-1.5">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-primary dark:text-primary-fixed block">
                1. Similar Issue
              </span>
              <p className="text-xs text-on-surface leading-relaxed font-medium">
                {cluster.commonIssue.slice(0, 100)}...
              </p>
            </div>

            {/* Dimension 2: Shared Factors */}
            <div className="p-4 rounded-xl bg-secondary/5 dark:bg-secondary/10 border border-secondary/20 space-y-1.5">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-secondary dark:text-secondary-fixed block">
                2. Shared Factors
              </span>
              <p className="text-xs text-on-surface leading-relaxed font-medium">
                Deposit paid + tenancy completed + peaceful key handover + &gt;30 days delay.
              </p>
            </div>

            {/* Dimension 3: Common Evidence */}
            <div className="p-4 rounded-xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 space-y-1.5">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 block">
                3. Common Evidence
              </span>
              <p className="text-xs text-on-surface leading-relaxed font-medium">
                Registered lease agreement + bank NEFT receipts + timestamped move-out messages.
              </p>
            </div>

            {/* Dimension 4: Jurisdiction */}
            <div className="p-4 rounded-xl bg-indigo-500/5 dark:bg-indigo-500/10 border border-indigo-500/20 space-y-1.5">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 block">
                4. Shared Jurisdiction
              </span>
              <p className="text-xs text-on-surface leading-relaxed font-medium">
                Quasi-judicial authority: {cluster.jurisdictionRegion}.
              </p>
            </div>
          </div>
        </section>

        {/* Detailed Factor Breakdowns (2 Column Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Common Facts on Record */}
          <div className="bg-surface-container-lowest dark:bg-[#0F131C] border border-outline-variant/40 dark:border-[#1E293B] rounded-2xl p-6 shadow-sm space-y-3">
            <h3 className="font-heading text-base font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">fact_check</span>
              <span>Common Facts Identified in Group ({cluster.commonFacts.length})</span>
            </h3>
            <ul className="space-y-2 text-xs text-on-surface">
              {cluster.commonFacts.map((fact, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-surface-container-low dark:bg-[#161F30] p-2.5 rounded-xl">
                  <span className="material-symbols-outlined text-primary text-sm shrink-0 mt-0.5">check</span>
                  <span>{fact}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Common Evidence Checklist */}
          <div className="bg-surface-container-lowest dark:bg-[#0F131C] border border-outline-variant/40 dark:border-[#1E293B] rounded-2xl p-6 shadow-sm space-y-3">
            <h3 className="font-heading text-base font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">attachment</span>
              <span>Common Evidence Records ({cluster.commonEvidence.length})</span>
            </h3>
            <ul className="space-y-2 text-xs text-on-surface">
              {cluster.commonEvidence.map((ev, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-surface-container-low dark:bg-[#161F30] p-2.5 rounded-xl">
                  <span className="material-symbols-outlined text-secondary text-sm shrink-0 mt-0.5">description</span>
                  <span>{ev}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Common Legal Sources */}
          <div className="bg-surface-container-lowest dark:bg-[#0F131C] border border-outline-variant/40 dark:border-[#1E293B] rounded-2xl p-6 shadow-sm space-y-3">
            <h3 className="font-heading text-base font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-indigo-600 dark:text-indigo-400">gavel</span>
              <span>Common Statutory Anchors Cited</span>
            </h3>
            <ul className="space-y-2 text-xs text-on-surface">
              {cluster.commonLegalSources.map((source, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-indigo-50/50 dark:bg-indigo-950/20 p-2.5 rounded-xl border border-indigo-200 dark:border-indigo-900/30">
                  <span className="material-symbols-outlined text-indigo-600 dark:text-indigo-400 text-sm shrink-0 mt-0.5">menu_book</span>
                  <span className="font-semibold">{source}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Common Actions Undertaken */}
          <div className="bg-surface-container-lowest dark:bg-[#0F131C] border border-outline-variant/40 rounded-2xl p-6 shadow-sm space-y-3">
            <h3 className="font-heading text-base font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-600">bolt</span>
              <span>Frequent Procedural Steps</span>
            </h3>
            <ul className="space-y-2 text-xs text-on-surface">
              {cluster.commonActions.map((action, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-emerald-50/50 dark:bg-emerald-950/20 p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-900/30">
                  <span className="material-symbols-outlined text-emerald-600 text-sm shrink-0 mt-0.5">arrow_forward</span>
                  <span className="font-semibold">{action}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Legal UX Caveats & Disclaimers */}
        <div className="p-4 rounded-xl bg-surface-container-low dark:bg-[#161F30]/80 border border-outline-variant/30 text-xs text-on-surface-variant space-y-1">
          <strong className="text-on-surface block font-bold">Important Statutory Disclaimers:</strong>
          <p>
            &bull; Similarity does not establish that the cases have the same legal outcome or identical facts.
          </p>
          <p>
            &bull; Collective advocacy or mediation is completely voluntary and requires your explicit affirmative consent.
          </p>
          <p>
            &bull; No personal information, names, or contact data are shared with other citizens without separate written confirmation.
          </p>
        </div>

        {/* Action Footer: Connect My Case */}
        <div className="bg-gradient-to-r from-primary/10 via-surface-container to-secondary/10 dark:from-primary/20 dark:to-slate-900 border border-primary/30 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="font-heading text-base font-bold text-on-surface">
              Does your dispute match this pattern?
            </h2>
            <p className="text-xs text-on-surface-variant">
              Review what participation entails in our consent-gated collective action workspace.
            </p>
          </div>

          <Link
            href={`/cases/${activeCaseId}/collective-action`}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-primary hover:bg-secondary text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm shrink-0"
          >
            <span>Review Collective Action & Consent</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
