'use client';

import React, { useState } from 'react';
import { LegalCase } from '@/lib/types';
import { useLegalSaathi } from '@/context/LegalSaathiContext';

interface CaseOverviewSectionProps {
  currentCase: LegalCase;
  onSelectTab: (tab: string) => void;
}

export const CaseOverviewSection: React.FC<CaseOverviewSectionProps> = ({
  currentCase,
  onSelectTab,
}) => {
  const { t } = useLegalSaathi();
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [descriptionText, setDescriptionText] = useState(currentCase.summary);
  const [checkedSteps, setCheckedSteps] = useState<Record<string, boolean>>({
    step1: false,
    step2: true,
    step3: true,
  });

  const toggleCheck = (id: string) => {
    setCheckedSteps((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Dynamic calculations from currentCase data model
  const totalEvidence = currentCase.evidenceList.length;
  const verifiedCount = currentCase.evidenceList.filter(
    (e) => e.status === 'VERIFIED' || e.status === 'COLLECTED'
  ).length;
  const reviewCount = currentCase.evidenceList.filter(
    (e) => e.status === 'NEEDS_REVIEW' || e.status === 'REVIEW_NEEDED'
  ).length;
  const missingCount = currentCase.evidenceList.filter((e) => e.status === 'MISSING').length;

  return (
    <div className="w-full flex flex-col gap-5">
      {/* ========================================================================= */}
      {/* 1. BALANCED CASE HEALTH & MILESTONES STRIP (3 Clean Columns)              */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {/* Metric 1: Case Status */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-2xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/60 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-lg">warning</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 leading-none">
              {t.caseStatus || 'Status'}
            </span>
            <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-1 leading-snug">
              {currentCase.status === 'ACTION REQUIRED' ? t.statusActionRequired : currentCase.status}
            </span>
            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium mt-0.5 leading-none">
              {missingCount} critical gap
            </span>
          </div>
        </div>

        {/* Metric 2: Evidence Dossier Status */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-2xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-lg">inventory_2</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 leading-none">
              {t.tabEvidence}
            </span>
            <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-1 leading-snug">
              {totalEvidence} Documents
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-none">
              {verifiedCount} verified • {reviewCount} review
            </span>
          </div>
        </div>

        {/* Metric 3: Next Statutory Deadline */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-2xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-lg">event</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 leading-none">
              {t.statutoryLimitation}
            </span>
            <span className="text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 mt-1 leading-snug">
              In 14 Days
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-none">
              Notice response target
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. CASE NARRATIVE & AI STATUTORY ASSESSMENT (Side-by-Side)                */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Card 1: Case Summary & Citizen Account (Col 1-7) */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-slate-500 text-lg">edit_note</span>
                <h3 className="font-heading text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  {t.whatIUnderstand}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEditingDescription(!isEditingDescription)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <span className="material-symbols-outlined text-xs">edit</span>
                <span>{isEditingDescription ? t.btnSaveDraft : t.btnEditManually}</span>
              </button>
            </div>

            {/* Editable Statement */}
            <div className="pt-3">
              {isEditingDescription ? (
                <textarea
                  value={descriptionText}
                  onChange={(e) => setDescriptionText(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-blue-500 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none"
                  rows={3}
                />
              ) : (
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {descriptionText}
                </p>
              )}
            </div>

            {/* Concise Docket Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-3">
              <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-mono font-semibold text-slate-700 dark:text-slate-300">
                Docket: {currentCase.id}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/50 text-[11px] font-semibold text-blue-700 dark:text-blue-300">
                Claim: {currentCase.claimAmount || '₹65,000'}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
                Stage: {currentCase.currentStage || 'VERIFY'}
              </span>
            </div>
          </div>

          {/* Actionable Next Steps Checklist */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              {t.nextLegalSteps}:
            </span>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-800 dark:text-slate-200">
                <input
                  type="checkbox"
                  checked={checkedSteps.step1}
                  onChange={() => toggleCheck('step1')}
                  className="rounded text-blue-600 focus:ring-blue-500 dark:bg-slate-700 shrink-0"
                />
                <span className="flex-1">
                  Upload move-out inspection photos (1 missing critical document)
                </span>
                <button
                  type="button"
                  onClick={() => onSelectTab('missing-info')}
                  className="text-[11px] text-blue-600 dark:text-blue-400 font-bold hover:underline shrink-0"
                >
                  Upload
                </button>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-800 dark:text-slate-200">
                <input
                  type="checkbox"
                  checked={checkedSteps.step2}
                  onChange={() => toggleCheck('step2')}
                  className="rounded text-blue-600 focus:ring-blue-500 dark:bg-slate-700 shrink-0"
                />
                <span className={checkedSteps.step2 ? 'line-through text-slate-400 flex-1' : 'flex-1'}>
                  Registered lease agreement copy
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold shrink-0">
                  Secured
                </span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-800 dark:text-slate-200">
                <input
                  type="checkbox"
                  checked={checkedSteps.step3}
                  onChange={() => toggleCheck('step3')}
                  className="rounded text-blue-600 focus:ring-blue-500 dark:bg-slate-700 shrink-0"
                />
                <span className={checkedSteps.step3 ? 'line-through text-slate-400 flex-1' : 'flex-1'}>
                  NEFT bank transfer proof
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold shrink-0">
                  Secured
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Card 2: AI Statutory Assessment (Col 8-12) */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col justify-between gap-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-500 text-lg">lightbulb</span>
                <h3 className="font-heading text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  {t.statutoryLinkage}
                </h3>
              </div>
              <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
                AI Advisory
              </span>
            </div>

            {(() => {
              const caseContextStr = `${currentCase.category} ${currentCase.title} ${currentCase.summary}`.toLowerCase();
              const isBuilderCase = caseContextStr.includes('builder') || caseContextStr.includes('possession') || caseContextStr.includes('rera') || caseContextStr.includes('bba') || caseContextStr.includes('apartment');
              const isLaborCase = caseContextStr.includes('salary') || caseContextStr.includes('wage') || caseContextStr.includes('employer');
              const isCyberCase = caseContextStr.includes('cyber') || caseContextStr.includes('otp') || caseContextStr.includes('upi') || caseContextStr.includes('fraud');
              const isTenancyCase = !isBuilderCase && (caseContextStr.includes('tenant') || caseContextStr.includes('landlord') || caseContextStr.includes('rent') || caseContextStr.includes('lease'));

              const governingLaw = isBuilderCase
                ? 'Governed by Real Estate (Regulation & Development) Act, 2016 (RERA) & Consumer Protection Act, 2019.'
                : isLaborCase
                ? 'Governed by Code on Wages, 2019 & Industrial Disputes Act, 1947 (Section 33C).'
                : isCyberCase
                ? 'Governed by Information Technology Act, 2000 (Section 66D) & BNS Section 318.'
                : isTenancyCase
                ? 'Governed by Model Tenancy Act, 2021 & Section 108 of Transfer of Property Act, 1882.'
                : `Governed by applicable Indian statutes under ${currentCase.category}.`;

              const statutoryRight = isBuilderCase
                ? 'Promoter is statutorily liable under Section 18 of RERA for monthly delayed-possession compensation or full refund.'
                : isLaborCase
                ? 'Employer cannot arbitrarily withhold earned wages; withholding constitutes an unlawful deduction.'
                : isCyberCase
                ? 'Customer has zero liability for unauthorized electronic transactions under RBI rules if reported promptly.'
                : isTenancyCase
                ? 'Landlord is statutorily required to refund deposit within 30 days unless itemized damage invoices are produced.'
                : 'Citizen is entitled to enforceable statutory protections and contractual consideration.';

              const criticalEvidence = isBuilderCase
                ? 'Builder-Buyer Agreement (BBA) and payment receipts required to prove promised handover date.'
                : isLaborCase
                ? 'Employment letter, monthly payslips, and bank statement showing non-credit of salary.'
                : isCyberCase
                ? 'Transaction UTR, bank debit notification, and cyber portal acknowledgment.'
                : isTenancyCase
                ? 'Exit checklist and photos needed to shift evidentiary burden and rebut claimed deductions.'
                : 'Documentary proof and written notices are needed to establish legal standing.';

              const nextStepAction = isBuilderCase
                ? 'Section 18 RERA Statutory Demand Notice is the recommended pre-litigation step.'
                : isLaborCase
                ? '15-Day Statutory Demand Notice for Wage Arrears is the recommended pre-litigation step.'
                : isCyberCase
                ? 'Immediate reporting to 1930 Cyber Helpline & bank transaction freeze requisition.'
                : isTenancyCase
                ? 'Section 106 Statutory Demand Notice is the recommended pre-litigation step.'
                : 'Formal Statutory Requisition Notice is the recommended pre-litigation step.';

              return (
                <div className="flex flex-col gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                  <div className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="material-symbols-outlined text-xs">gavel</span>
                    </div>
                    <p className="leading-snug">{governingLaw}</p>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="material-symbols-outlined text-xs">shield</span>
                    </div>
                    <p className="leading-snug">{statutoryRight}</p>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="material-symbols-outlined text-xs">error_outline</span>
                    </div>
                    <p className="leading-snug">{criticalEvidence}</p>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-md bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="material-symbols-outlined text-xs">balance</span>
                    </div>
                    <p className="leading-snug">{nextStepAction}</p>
                  </div>
                </div>
              );
            })()}
          </div>

          <button
            type="button"
            onClick={() => onSelectTab('explanation')}
            className="w-full py-2 px-3.5 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
          >
            <span>{t.tabWhyLawApplies}</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. RECENT ACTIVITY & PRIMARY WORKFLOW ACTIONS                             */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Recent Activity (Col 1-6) */}
        <div className="lg:col-span-6 p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col justify-between gap-3">
          <div>
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-heading text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                {t.tabTimeline}
              </h3>
              <button
                type="button"
                onClick={() => onSelectTab('timeline')}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <span>{t.tabTimeline}</span>
                <span className="material-symbols-outlined text-xs">arrow_forward</span>
              </button>
            </div>

            <div className="flex flex-col gap-3 pt-2 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-[11px] text-slate-400 w-16 shrink-0">2 days ago</span>
                  <div className="w-6 h-6 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-xs">description</span>
                  </div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                    Rental Agreement.pdf
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onSelectTab('evidence')}
                  className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline shrink-0"
                >
                  {t.statusVerified || 'Verified'}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-[11px] text-slate-400 w-16 shrink-0">3 days ago</span>
                  <div className="w-6 h-6 rounded-md bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-xs">error</span>
                  </div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                    Move-out photos missing
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onSelectTab('missing-info')}
                  className="text-xs text-rose-600 dark:text-rose-400 font-semibold hover:underline shrink-0"
                >
                  {t.statusActionRequired || 'Needs Attention'}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-[11px] text-slate-400 w-16 shrink-0">12 Jan 2026</span>
                  <div className="w-6 h-6 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-xs">folder</span>
                  </div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                    Docket Registered
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono shrink-0">
                  LS-2026-0042
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Primary Workflow Actions (Col 7-12) */}
        <div className="lg:col-span-6 p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col justify-between gap-3">
          <div className="pb-2.5 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-heading text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              {t.groupActions}
            </h3>
          </div>

          <div className="flex flex-col gap-2.5 pt-1">
            {/* Action 1: Notice Assistant */}
            <button
              type="button"
              onClick={() => onSelectTab('actions')}
              className="p-3 rounded-xl border border-slate-200/90 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 bg-slate-50/50 dark:bg-[#0F131C] hover:bg-white dark:hover:bg-[#161F30] transition-all text-left flex items-center justify-between group shadow-2xs"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-base">bolt</span>
                </div>
                <div className="truncate">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {t.tabActions}
                  </h4>
                  <p className="text-[11px] text-slate-500 truncate">
                    Pre-populate formal statutory notice for 15-day remedy
                  </p>
                </div>
              </div>
              <span className="material-symbols-outlined text-slate-400 group-hover:text-blue-600 transition-colors text-base shrink-0">
                arrow_forward
              </span>
            </button>

            {/* Action 2: Resolve Gaps */}
            <button
              type="button"
              onClick={() => onSelectTab('missing-info')}
              className="p-3 rounded-xl border border-rose-200/60 dark:border-rose-900/40 hover:border-rose-400 bg-rose-50/30 dark:bg-rose-950/10 hover:bg-white dark:hover:bg-[#161F30] transition-all text-left flex items-center justify-between group shadow-2xs"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-base">help_outline</span>
                </div>
                <div className="truncate">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {t.tabMissingInfo}
                  </h4>
                  <p className="text-[11px] text-slate-500 truncate">
                    Add move-out photos to corroborate peaceful handover
                  </p>
                </div>
              </div>
              <span className="material-symbols-outlined text-slate-400 group-hover:text-rose-600 transition-colors text-base shrink-0">
                arrow_forward
              </span>
            </button>

            {/* Action 3: Collective Action */}
            <button
              type="button"
              onClick={() => onSelectTab('collective')}
              className="p-3 rounded-xl border border-slate-200/90 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 bg-slate-50/50 dark:bg-[#0F131C] hover:bg-white dark:hover:bg-[#161F30] transition-all text-left flex items-center justify-between group shadow-2xs"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-base">groups</span>
                </div>
                <div className="truncate">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {t.tabCollective}
                  </h4>
                  <p className="text-[11px] text-slate-500 truncate">
                    12 similar security deposit withholding claims found in Saket
                  </p>
                </div>
              </div>
              <span className="material-symbols-outlined text-slate-400 group-hover:text-emerald-600 transition-colors text-base shrink-0">
                arrow_forward
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
