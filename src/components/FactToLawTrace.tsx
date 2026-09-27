'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { LegalExplanationTrace } from '../lib/types';

interface FactToLawTraceProps {
  trace: LegalExplanationTrace;
  caseId: string;
}

export const FactToLawTrace: React.FC<FactToLawTraceProps> = ({ trace, caseId }) => {
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [
    { id: 'facts', label: '1. Facts on Record', icon: 'notes' },
    { id: 'issue', label: '2. Legal Issue', icon: 'balance' },
    { id: 'provision', label: '3. Relevant Statute', icon: 'gavel' },
    { id: 'source', label: '4. Verified Source', icon: 'menu_book' },
    { id: 'action', label: '5. Action Recommended', icon: 'task_alt' }
  ];

  return (
    <div className="space-y-6">
      {/* Interactive Visual Trace Stepper / Flow Diagram */}
      <nav aria-label="Traceability Flow" className="bg-surface-container-lowest dark:bg-[#0F131C] border border-outline-variant/40 rounded-2xl p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 border-b border-outline-variant/30 pb-3">
          <div>
            <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-primary dark:text-primary-fixed">
              Traceability Pipeline
            </h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Follow how verified facts connect directly to statutory provisions and actionable steps.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span
              className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                (trace.traceabilityScore ?? 85) >= 80
                  ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60'
                  : (trace.traceabilityScore ?? 85) >= 50
                  ? 'text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-950/60'
                  : 'text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60'
              }`}
            >
              {trace.traceabilityScore ?? 85}% Traceable Linkage
            </span>
          </div>
        </div>

        {/* Step Nodes */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {steps.map((step, idx) => {
            const isCurrent = activeStep === idx;
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => setActiveStep(idx)}
                className={`flex items-center gap-2 p-2.5 sm:p-3 rounded-xl border text-left transition-all ${
                  isCurrent
                    ? 'border-primary bg-primary/10 text-primary dark:text-primary-fixed ring-2 ring-primary/30 font-bold'
                    : 'border-outline-variant/30 bg-surface-container-low dark:bg-[#161F30] text-on-surface hover:bg-surface-container'
                }`}
              >
                <span className="material-symbols-outlined text-lg shrink-0">
                  {step.icon}
                </span>
                <span className="text-xs leading-tight truncate">{step.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Main Traceability Content Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Core Legal Trace */}
        <div className="lg:col-span-2 space-y-6">
          {/* WHAT I UNDERSTAND */}
          <section
            aria-labelledby="understand-heading"
            className="bg-surface-container-lowest dark:bg-[#0F131C] border border-outline-variant/40 rounded-2xl p-5 sm:p-6 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-primary text-xl">psychology</span>
              <h3 id="understand-heading" className="font-heading text-base sm:text-lg font-bold text-on-surface">
                What I Understand From Available Information
              </h3>
            </div>
            <p className="text-sm text-on-surface leading-relaxed bg-surface-container-low dark:bg-[#161F30]/60 p-4 rounded-xl border border-outline-variant/30">
              {trace.whatIUnderstand}
            </p>
          </section>

          {/* LEGAL ISSUE */}
          <section
            aria-labelledby="issue-heading"
            className="bg-surface-container-lowest dark:bg-[#0F131C] border border-outline-variant/40 rounded-2xl p-5 sm:p-6 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-secondary text-xl">balance</span>
              <div className="flex flex-wrap items-center gap-2">
                <h3 id="issue-heading" className="font-heading text-base sm:text-lg font-bold text-on-surface">
                  Identified Legal Issue
                </h3>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-secondary/15 text-secondary dark:text-secondary-fixed">
                  {trace.legalIssue.category}
                </span>
              </div>
            </div>
            <h4 className="text-sm font-extrabold text-on-surface mb-2">
              {trace.legalIssue.title}
            </h4>
            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              {trace.legalIssue.description}
            </p>
          </section>

          {/* RELEVANT PROVISION & WHY IT MAY APPLY */}
          <section
            aria-labelledby="provision-heading"
            className="bg-surface-container-lowest dark:bg-[#0F131C] border border-outline-variant/40 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-outline-variant/30 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">gavel</span>
                <h3 id="provision-heading" className="font-heading text-base sm:text-lg font-bold text-on-surface">
                  Applicable Statutory Provision
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    trace.relevantProvision.applicabilityStatus === 'Applicable based on verified facts'
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                      : trace.relevantProvision.applicabilityStatus === 'Requires additional information'
                      ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                      : trace.relevantProvision.applicabilityStatus === 'Not applicable to current facts'
                      ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                      : 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                  }`}
                >
                  {trace.relevantProvision.applicabilityStatus || 'Applicable based on verified facts'}
                </span>
                <span className="text-xs font-mono font-bold text-primary dark:text-primary-fixed bg-primary/10 px-2.5 py-1 rounded-md">
                  {trace.relevantProvision.section}
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 text-xs text-on-surface-variant mb-1">
                <span className="font-bold text-on-surface">{trace.relevantProvision.title}</span>
                <span>•</span>
                <span>{trace.relevantProvision.authority}</span>
              </div>
              <div className="p-3.5 bg-surface-container-low dark:bg-[#161F30]/80 rounded-xl font-serif text-xs sm:text-sm text-on-surface leading-relaxed border-l-4 border-primary">
                {trace.relevantProvision.statutoryText}
              </div>
            </div>

            {/* STATUTORY DEADLINE & TIMELINE */}
            {trace.relevantProvision.statutoryDeadline && (
              <div className="p-3 bg-blue-50/80 dark:bg-blue-950/40 rounded-xl border border-blue-200/60 dark:border-blue-800/60 flex items-start gap-2.5 text-xs text-blue-950 dark:text-blue-200">
                <span className="material-symbols-outlined text-base text-blue-600 shrink-0 mt-0.5">schedule</span>
                <div>
                  <span className="font-bold block mb-0.5">Verified Statutory Time Limit / Limitation:</span>
                  <span>{trace.relevantProvision.statutoryDeadline}</span>
                </div>
              </div>
            )}

            {trace.relevantProvision.deadlineWarning && (
              <div className="p-3 bg-amber-50/80 dark:bg-amber-950/40 rounded-xl border border-amber-300/60 dark:border-amber-800/60 flex items-start gap-2.5 text-xs text-amber-950 dark:text-amber-200">
                <span className="material-symbols-outlined text-base text-amber-600 shrink-0 mt-0.5">warning</span>
                <div>
                  <span className="font-bold block mb-0.5">Limitation Notice:</span>
                  <span>{trace.relevantProvision.deadlineWarning}</span>
                </div>
              </div>
            )}

            {/* WHY IT APPLIES */}
            <div className="p-4 bg-primary/5 dark:bg-primary/10 rounded-xl border border-primary/20 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-primary dark:text-primary-fixed uppercase tracking-wider">
                <span className="material-symbols-outlined text-base">help</span>
                <span>Why This Provision Applies</span>
              </div>
              <p className="text-xs sm:text-sm text-on-surface leading-relaxed whitespace-pre-line">
                {trace.whyItMayApply}
              </p>
              <p className="text-[11px] text-on-surface-variant italic pt-1">
                Note: This assessment indicates verified statutory grounds based on current factual records and does not constitute a judicial ruling.
              </p>
            </div>
          </section>

          {/* SUPPORTING FACTS & EVIDENCE */}
          <section
            aria-labelledby="supporting-heading"
            className="bg-surface-container-lowest dark:bg-[#0F131C] border border-outline-variant/40 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4"
          >
            <h3 id="supporting-heading" className="font-heading text-base sm:text-lg font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-600">fact_check</span>
              <span>Supporting Facts on Record</span>
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-on-surface">
              {trace.supportingFacts.map((fact, i) => (
                <li key={i} className="flex items-start gap-2 bg-surface-container-low dark:bg-[#161F30]/50 p-2.5 rounded-lg">
                  <span className="material-symbols-outlined text-emerald-600 text-base shrink-0 mt-0.5">check_circle</span>
                  <span>{fact}</span>
                </li>
              ))}
            </ul>

            <div className="pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">
                Corroborating Evidence
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {trace.supportingEvidence.map((ev, idx) => (
                  <Link
                    key={idx}
                    href={`/cases/${caseId}/evidence`}
                    className="p-2.5 rounded-lg border border-outline-variant/30 bg-surface-container-low dark:bg-[#161F30] hover:border-primary text-xs flex items-center justify-between gap-2 group transition-colors"
                  >
                    <span className="font-semibold text-on-surface truncate">{ev}</span>
                    <span className="material-symbols-outlined text-xs text-primary group-hover:translate-x-0.5 transition-transform">
                      arrow_forward
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Right 1 Column: Information Needed, Source Link, and Next Action */}
        <aside aria-label="Next Steps and Gaps" className="space-y-6">
          {/* INFORMATION STILL NEEDED */}
          <div className="bg-surface-container-lowest dark:bg-[#0F131C] border border-outline-variant/40 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-600 text-lg">pending_actions</span>
              <h3 className="font-heading text-sm font-bold text-on-surface">
                Information Still Needed
              </h3>
            </div>
            <p className="text-xs text-on-surface-variant">
              Fulfilling these gaps would further substantiate this statutory basis:
            </p>
            <ul className="space-y-2">
              {trace.informationStillNeeded.map((need, idx) => (
                <li
                  key={idx}
                  className="p-2.5 rounded-lg bg-amber-50/60 dark:bg-amber-950/30 border border-amber-300/40 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2"
                >
                  <span className="material-symbols-outlined text-amber-600 text-sm shrink-0 mt-0.5">add_circle</span>
                  <span>{need}</span>
                </li>
              ))}
            </ul>
            <Link
              href={`/cases/${caseId}/missing-information`}
              className="block text-center py-2 px-3 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-bold text-primary transition-colors mt-2"
            >
              Open Missing Info Assistant →
            </Link>
          </div>

          {/* VERIFIED LEGAL SOURCE REFERENCE */}
          <div className="bg-surface-container-lowest dark:bg-[#0F131C] border border-outline-variant/40 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-sm font-bold text-on-surface flex items-center gap-1.5">
                <span className="material-symbols-outlined text-secondary text-base">menu_book</span>
                <span>Verified Source</span>
              </h3>
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                Verified
              </span>
            </div>
            <p className="text-xs text-on-surface font-semibold">
              {trace.relevantProvision.title} ({trace.relevantProvision.section})
            </p>
            <p className="text-[11px] text-on-surface-variant">
              Published by {trace.relevantProvision.authority}.
            </p>
            <div className="flex flex-col gap-2 pt-2">
              <Link
                href={`/sources/${trace.sourceId}`}
                className="w-full text-center py-2 px-3 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-on-surface transition-colors"
              >
                Inspect Source Record
              </Link>
              <Link
                href={`/cases/${caseId}/sources/compare`}
                className="w-full text-center py-2 px-3 rounded-xl border border-outline-variant/40 hover:bg-surface-container-low text-xs font-semibold text-secondary transition-colors"
              >
                Compare with Alternative Laws
              </Link>
            </div>
          </div>

          {/* WHAT YOU CAN DO NEXT */}
          <div className="bg-gradient-to-br from-primary/10 via-surface-container-low to-secondary/10 dark:from-primary/20 dark:to-slate-900 border border-primary/30 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">play_circle</span>
              <h3 className="font-heading text-sm font-bold text-on-surface">
                What You Can Do Next
              </h3>
            </div>
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-xs font-bold text-on-surface">
                {trace.nextAction.title}
              </h4>
              <span
                className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                  trace.nextAction.isVerifiedAction !== false
                    ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                    : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                }`}
              >
                {trace.nextAction.isVerifiedAction !== false ? 'Verified Action' : 'Action Pending Proof'}
              </span>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              {trace.nextAction.description}
            </p>
            {trace.nextAction.isVerifiedAction === false && (
              <p className="text-[11px] text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 p-2 rounded-lg border border-amber-200 dark:border-amber-800">
                No verified statutory legal action is available based on the current information. Please provide additional details or consult a qualified legal professional.
              </p>
            )}
            <Link
              href={trace.nextAction.url}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-primary text-on-primary font-bold text-xs hover:bg-primary/90 transition-colors shadow-sm"
            >
              <span>{trace.nextAction.ctaText}</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>

          {/* Legal Safety UX Notice */}
          <div className="p-3.5 rounded-xl bg-surface-container-low dark:bg-[#161F30]/40 border border-outline-variant/30 text-[11px] text-on-surface-variant leading-normal">
            <span className="font-bold text-on-surface block mb-1">Legal Saathi Informational Disclaimer:</span>
            Legal Saathi provides civic legal guidance and factual organization. It does not issue guarantees, judicial verdicts, or formal legal advice.
          </div>
        </aside>
      </div>
    </div>
  );
};
