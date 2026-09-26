'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useLegalSaathi } from '../../../../context/LegalSaathiContext';
import { CaseContextBanner } from '../../../../components/CaseContextBanner';
import { SIMILAR_CASE_CLUSTERS } from '../../../../lib/mock-data';

export default function CollectiveActionPage() {
  const params = useParams();
  const caseId = (params?.caseId as string) || 'LS-2026-0042';
  const { cases, userConsents, updateCollectiveActionConsent } = useLegalSaathi();

  const currentCase = cases.find((c) => c.id === caseId) || cases[0];
  const consentRecord = userConsents[caseId];

  // Matched cluster for this case
  const cluster =
    currentCase.category.includes('Tenancy')
      ? SIMILAR_CASE_CLUSTERS[0]
      : currentCase.category.includes('Real Estate')
      ? SIMILAR_CASE_CLUSTERS[1]
      : SIMILAR_CASE_CLUSTERS[2];

  // Consent flow step state: 'DISCOVERY' | 'INTEREST_REVIEW' | 'ENROLLED'
  const isCurrentlyEnrolled = consentRecord?.collectiveActionStatus === 'PARTICIPATING';

  const [flowStep, setFlowStep] = useState<'DISCOVERY' | 'INTEREST_REVIEW' | 'ENROLLED'>(
    isCurrentlyEnrolled ? 'ENROLLED' : 'DISCOVERY'
  );
  const [showLearnMoreModal, setShowLearnMoreModal] = useState(false);
  const [explicitAffirmationChecked, setExplicitAffirmationChecked] = useState(false);

  const handleJoin = () => {
    if (!explicitAffirmationChecked) {
      alert('Please check the explicit affirmation box to confirm your voluntary enrollment.');
      return;
    }
    updateCollectiveActionConsent(caseId, 'PARTICIPATING');
    setFlowStep('ENROLLED');
  };

  const handleWithdraw = () => {
    if (confirm('Are you sure you want to withdraw from this collective action? Your case will return to independent status.')) {
      updateCollectiveActionConsent(caseId, 'WITHDRAWN');
      setFlowStep('DISCOVERY');
      setExplicitAffirmationChecked(false);
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
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span>
              Phase 3 • <strong className="text-on-surface">Voluntary Collective Action (Consent-Gated)</strong>
            </span>
          </div>
        </div>

        {/* Case Context Header Banner */}
        <CaseContextBanner currentActionTitle="Collective Action Gateway" caseId={currentCase.id} />

        {/* Hero Banner */}
        <div className="bg-surface-container-lowest dark:bg-[#0F131C] border border-outline-variant/30 rounded-2xl p-6 sm:p-8 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-secondary dark:text-secondary-fixed uppercase tracking-wider">
            <span className="material-symbols-outlined text-base">groups</span>
            <span>Civic Representation & Redress Group</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
            Collective Action & Group Advocacy
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant max-w-3xl leading-relaxed">
            When multiple citizens experience recurring unfair practices under Indian tenancy, real estate, or consumer statutes, collective advocacy amplifies institutional accountability. Legal Saathi ensures 100% voluntary, consent-gated participation.
          </p>
        </div>

        {/* STEP 1: INITIAL DISCOVERY SCREEN */}
        {flowStep === 'DISCOVERY' && (
          <section
            aria-labelledby="discovery-heading"
            className="bg-surface-container-lowest dark:bg-[#0F131C] border border-outline-variant/40 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-outline-variant/30 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-symbols-outlined text-primary text-xl">hub</span>
                  <h2 id="discovery-heading" className="font-heading text-lg sm:text-xl font-bold text-on-surface">
                    A Potentially Similar Civic Pattern May Exist
                  </h2>
                </div>
                <p className="text-xs text-on-surface-variant">
                  Discovered {cluster.caseCount} comparable cases matching your dispute category in {cluster.jurisdictionRegion}.
                </p>
              </div>

              <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 self-start sm:self-auto flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm">lock</span>
                <span>Consent-Gated • No Auto-Enrollment</span>
              </span>
            </div>

            {/* Pattern Summary Card */}
            <div className="p-5 rounded-2xl bg-surface-container-low dark:bg-[#161F30]/60 border border-outline-variant/30 space-y-3">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-secondary dark:text-secondary-fixed block">
                Detected Pattern: {cluster.title}
              </span>
              <p className="text-sm font-semibold text-on-surface">
                {cluster.commonIssue}
              </p>
              <div className="text-xs text-on-surface-variant leading-relaxed">
                <strong className="text-on-surface font-semibold">Why this may be relevant:</strong> {cluster.similarityReason}
              </div>
            </div>

            {/* Transparent Data Sharing Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* What May Be Shared */}
              <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-blue-950 dark:text-blue-200">
                  <span className="material-symbols-outlined text-blue-600 text-sm">share</span>
                  <span>What Would Be Shared (With Consent)</span>
                </div>
                <ul className="space-y-1.5 text-blue-900 dark:text-blue-300">
                  <li className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-xs text-blue-600">check</span>
                    <span>General dispute category (Residential Tenancy Deposit)</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-xs text-blue-600">check</span>
                    <span>Broad territorial jurisdiction (South Delhi / Saket)</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-xs text-blue-600">check</span>
                    <span>Withholding timeframe (&gt;30 days default)</span>
                  </li>
                </ul>
              </div>

              {/* What Remains Strictly Private */}
              <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-emerald-950 dark:text-emerald-200">
                  <span className="material-symbols-outlined text-emerald-600 text-sm">lock</span>
                  <span>What Always Remains Strictly Private</span>
                </div>
                <ul className="space-y-1.5 text-emerald-900 dark:text-emerald-300">
                  <li className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-xs text-emerald-600">shield</span>
                    <span>Your full name, phone number, and email address</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-xs text-emerald-600">shield</span>
                    <span>Exact rental unit flat number &amp; landlord personal identity</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-xs text-emerald-600">shield</span>
                    <span>Bank account numbers &amp; private chat communications</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Non-Manipulative User Choices */}
            <div className="pt-2 border-t border-outline-variant/30 space-y-3">
              <span className="text-xs font-bold text-on-surface block">
                How would you like to proceed?
              </span>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setFlowStep('INTEREST_REVIEW')}
                  className="px-5 py-2.5 rounded-xl bg-primary hover:bg-secondary text-white text-xs font-bold transition-colors shadow-sm flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">how_to_reg</span>
                  <span>I&apos;m Interested — Review Consent</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowLearnMoreModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-surface-container-low dark:bg-[#161F30] hover:bg-surface-container border border-outline-variant/40 text-xs font-semibold text-on-surface transition-colors flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">help_outline</span>
                  <span>Learn More</span>
                </button>

                <Link
                  href={`/cases/${currentCase.id}`}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
                >
                  Not Now / Keep Independent
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* STEP 2: DETAILED CONSENT EXPLANATION FLOW */}
        {flowStep === 'INTEREST_REVIEW' && (
          <section
            aria-labelledby="consent-review-heading"
            className="bg-surface-container-lowest dark:bg-[#0F131C] border border-outline-variant/40 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6 animate-fade-in"
          >
            <div className="border-b border-outline-variant/30 pb-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-primary text-xl">fact_check</span>
                <h2 id="consent-review-heading" className="font-heading text-lg sm:text-xl font-bold text-on-surface">
                  Detailed Consent &amp; Advocacy Agreement
                </h2>
              </div>
              <p className="text-xs text-on-surface-variant">
                Review this breakdown before granting affirmative confirmation. No participation is assumed or pre-selected.
              </p>
            </div>

            {/* Informational Breakdown Matrix */}
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-surface-container-low dark:bg-[#161F30]/80 border border-outline-variant/30 space-y-1">
                <strong className="text-on-surface font-bold text-sm block">1. Purpose of Collective Advocacy</strong>
                <p className="text-on-surface-variant leading-relaxed">
                  To group similar tenancy deposit withholding complaints before the designated Rent Authority or District Legal Services Authority (DLSA) for expedited summary inquiry and institutional mediation.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-surface-container-low dark:bg-[#161F30]/80 border border-outline-variant/30 space-y-1">
                <strong className="text-on-surface font-bold text-sm block">2. Who May Access Aggregated Case Records</strong>
                <p className="text-on-surface-variant leading-relaxed">
                  Only assigned DLSA panel advocates, Rent Authority conciliators, and Legal Saathi verified caseworkers. No other individual citizens in the cluster will receive your personal contact details.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-surface-container-low dark:bg-[#161F30]/80 border border-outline-variant/30 space-y-1">
                <strong className="text-on-surface font-bold text-sm block">3. Voluntary &amp; Reversible Status</strong>
                <p className="text-on-surface-variant leading-relaxed">
                  Participation is completely optional. You may withdraw at any time via the Consent &amp; Privacy Center with a single click, which instantly revokes sharing permissions.
                </p>
              </div>
            </div>

            {/* Explicit User Affirmation Checkbox (Unchecked by default) */}
            <div className="p-4 rounded-xl bg-primary/5 dark:bg-primary/10 border-2 border-primary/30 space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={explicitAffirmationChecked}
                  onChange={(e) => setExplicitAffirmationChecked(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary shrink-0"
                />
                <span className="text-xs text-on-surface leading-relaxed">
                  <strong>Explicit Affirmative Consent:</strong> I voluntarily choose to associate my case facts (anonymized category, timeframe, and jurisdiction) with the South Delhi Tenancy Deposit group. I acknowledge that my private personal contact information will not be exposed and that I can revoke this consent at any time.
                </span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => setFlowStep('DISCOVERY')}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-on-surface-variant hover:text-on-surface"
              >
                ← Back to Overview
              </button>

              <button
                type="button"
                onClick={handleJoin}
                disabled={!explicitAffirmationChecked}
                className="px-6 py-2.5 rounded-xl bg-primary hover:bg-secondary text-white text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">how_to_reg</span>
                <span>Join This Collective Action</span>
              </button>
            </div>
          </section>
        )}

        {/* STEP 3: ENROLLED PARTICIPATION MANAGEMENT */}
        {flowStep === 'ENROLLED' && (
          <section
            aria-labelledby="enrolled-heading"
            className="bg-surface-container-lowest dark:bg-[#0F131C] border border-emerald-300 dark:border-emerald-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-outline-variant/30 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-symbols-outlined text-emerald-600 text-2xl">verified</span>
                  <h2 id="enrolled-heading" className="font-heading text-lg sm:text-xl font-bold text-on-surface">
                    Enrolled in Collective Action Group
                  </h2>
                </div>
                <p className="text-xs text-on-surface-variant">
                  Associated Group: <strong>{cluster.title}</strong> • Jurisdiction: {cluster.jurisdictionRegion}
                </p>
              </div>

              <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 self-start sm:self-auto">
                Affirmative Consent Active
              </span>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-300/40 text-xs text-emerald-900 dark:text-emerald-200 space-y-2">
              <strong className="block font-bold">Group Representation Status:</strong>
              <p>
                Your anonymized grievance is now registered with 23 other tenants. A joint representation under Section 11 of the Model Tenancy Act is being prepared for submission to the Saket Rent Authority.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <Link
                href="/privacy/consent"
                className="px-4 py-2.5 rounded-xl bg-surface-container-low dark:bg-[#161F30] hover:bg-surface-container text-xs font-semibold text-on-surface border border-outline-variant/40 transition-colors flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">security</span>
                <span>View Stored Privacy Records</span>
              </Link>

              <button
                type="button"
                onClick={handleWithdraw}
                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors shadow-sm"
              >
                Withdraw Participation
              </button>
            </div>
          </section>
        )}

        {/* Learn More Modal Dialog */}
        {showLearnMoreModal && (
          <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <div className="bg-surface-container-lowest dark:bg-[#0F131C] border border-outline-variant rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
                <h3 className="font-heading font-bold text-base text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">groups</span>
                  <span>How Collective Action Works</span>
                </h3>
                <button type="button" onClick={() => setShowLearnMoreModal(false)} className="text-on-surface-variant hover:text-on-surface">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="space-y-3 text-xs text-on-surface leading-relaxed">
                <p>
                  <strong>Why Group Representation?</strong> When individual citizens take on systemic tenancy violations or builder delays, counterparties frequently rely on delay tactics. Presenting combined patterns before statutory tribunals or consumer commissions establishes recurring non-compliance.
                </p>
                <p>
                  <strong>What Stays Private?</strong> At no point will your phone number, real name, or private messages be visible to other citizens. Only aggregated metrics and certified complaints are presented to the tribunal.
                </p>
                <p>
                  <strong>Can I Leave?</strong> Yes. You retain unconditional rights to withdraw at any moment from the Privacy &amp; Consent Center.
                </p>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowLearnMoreModal(false)}
                  className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold"
                >
                  Understood
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
