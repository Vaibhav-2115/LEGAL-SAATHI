'use client';

import React from 'react';
import { LegalNoticeDraft } from '../lib/types';

interface LegalNoticePreviewProps {
  draft: LegalNoticeDraft;
  caseId: string;
  onEditClick: () => void;
  onExportPdf: () => void;
  onCopyText: () => void;
}

export const LegalNoticePreview: React.FC<LegalNoticePreviewProps> = ({
  draft,
  caseId,
  onEditClick,
  onExportPdf,
  onCopyText
}) => {
  return (
    <div className="bg-surface-container-lowest dark:bg-[#0F131C] rounded-2xl p-6 shadow-sm border border-outline-variant/30 flex flex-col gap-5">
      {/* Top Action Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-outline-variant/30">
        <div>
          <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider font-mono">
            LEGAL DRAFT DOCUMENT #{caseId}
          </span>
          <h3 className="font-heading text-lg font-bold text-on-surface">
            Statutory Demand Notice Preview
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onEditClick}
            className="px-3 py-1.5 rounded-lg bg-surface-container-low dark:bg-[#161F30] hover:bg-surface-container-high text-xs font-semibold text-on-surface border border-outline-variant/40 transition-colors flex items-center gap-1"
            type="button"
          >
            <span className="material-symbols-outlined text-sm">edit</span>
            <span>Edit Fields</span>
          </button>

          <button
            onClick={onCopyText}
            className="px-3 py-1.5 rounded-lg bg-surface-container-low dark:bg-[#161F30] hover:bg-surface-container-high text-xs font-semibold text-on-surface border border-outline-variant/40 transition-colors flex items-center gap-1"
            type="button"
          >
            <span className="material-symbols-outlined text-sm">content_copy</span>
            <span>Copy Text</span>
          </button>

          <button
            onClick={onExportPdf}
            className="px-3.5 py-1.5 rounded-lg bg-primary hover:bg-secondary text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
            type="button"
          >
            <span className="material-symbols-outlined text-sm">print</span>
            <span>Print / Export</span>
          </button>
        </div>
      </div>

      {/* Prominent Legal Safety UX Banner */}
      <div className="bg-amber-50 dark:bg-amber-950/40 border-l-4 border-amber-500 rounded-xl p-3.5 text-xs text-amber-900 dark:text-amber-300 leading-relaxed">
        <strong>IMPORTANT LEGAL NOTICE DISCLAIMER:</strong> This is a structured draft prepared from the information
        and documents provided in your case file. It is generated for civic guidance and reference purposes. Legal Saathi
        is an automated AI civic assistant, not a legal practitioner or law firm. You should review and verify the particulars
        with an advocate or Legal Aid Authority before formal dispatch via registered post.
      </div>

      {/* Styled Printable Legal Notice Sheet */}
      <div className="bg-white dark:bg-[#090D16] rounded-xl border border-outline-variant/40 p-6 sm:p-8 font-serif text-slate-900 dark:text-slate-100 text-xs sm:text-sm leading-relaxed shadow-sm space-y-4">
        {/* Header Notice Banner */}
        <div className="text-center border-b pb-4 border-slate-300 dark:border-[#1E293B]">
          <h2 className="font-bold text-base sm:text-lg tracking-wider uppercase font-sans text-slate-800 dark:text-slate-100">
            FORMAL STATUTORY DEMAND NOTICE
          </h2>
          <p className="text-[11px] font-mono text-slate-600 dark:text-slate-400 mt-0.5">
            SENT UNDER STATUTORY PROVISIONS OF INDIAN LAW
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Date of Notice: <strong>{draft.incidentDate || new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</strong>
          </p>
        </div>

        {/* Recipient & Sender Blocks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 font-sans text-xs">
          <div>
            <span className="font-bold uppercase tracking-wider text-[10px] text-slate-500 block mb-1">
              TO (RECIPIENT / OPPOSITE PARTY):
            </span>
            <p className="font-bold text-sm text-slate-900 dark:text-slate-100">{draft.recipientName}</p>
            {draft.recipientDesignation && <p className="text-slate-600 dark:text-slate-400">{draft.recipientDesignation}</p>}
            <p className="whitespace-pre-line text-slate-700 dark:text-slate-300 mt-1">{draft.recipientAddress}</p>
            {draft.recipientEmail && <p className="text-slate-500 mt-0.5">Email: {draft.recipientEmail}</p>}
          </div>

          <div>
            <span className="font-bold uppercase tracking-wider text-[10px] text-slate-500 block mb-1">
              FROM (ISSUED BY / AGGRIEVED PARTY):
            </span>
            <p className="font-bold text-sm text-slate-900 dark:text-slate-100">{draft.senderName}</p>
            <p className="whitespace-pre-line text-slate-700 dark:text-slate-300 mt-1">{draft.senderAddress}</p>
            <p className="text-slate-500 mt-0.5">Matter Docket: <strong>#{caseId}</strong></p>
          </div>
        </div>

        {/* Subject */}
        <div className="pt-3 font-sans">
          <p className="font-bold text-xs sm:text-sm bg-slate-100 dark:bg-[#0F131C] p-2.5 rounded border-l-4 border-slate-700 dark:border-slate-300">
            SUBJECT: Formal Demand Notice for Immediate Repayment of {draft.demandedAmount || 'Statutory Claim'} together with Interest and Compensation under {draft.statutoryBasis}.
          </p>
        </div>

        {/* Body Paragraphs */}
        <div className="space-y-3 pt-2">
          <p className="font-bold font-sans text-xs">Sir / Madam,</p>
          
          <p>
            Under instructions from my own account as the aggrieved citizen, I hereby serve upon you this formal demand notice
            concerning your continued and unjustified failure to satisfy legitimate contractual and statutory covenants.
          </p>

          <p className="font-sans font-semibold text-xs text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            1. STATEMENT OF MATERIAL FACTS:
          </p>
          <div className="bg-slate-50 dark:bg-[#0F131C]/60 p-3 rounded border border-slate-200 dark:border-[#1E293B] text-xs font-sans whitespace-pre-line">
            {draft.factsSummary}
          </div>

          <p className="font-sans font-semibold text-xs text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            2. STATUTORY BASIS & LIABILITY:
          </p>
          <p>
            Your act of withholding funds and failing to honor written commitments directly violates{' '}
            <strong>{draft.statutoryBasis}</strong>. Under Indian law, where a party causes wrongful loss without reasonable cause,
            the aggrieved citizen is legally entitled to compensation, statutory interest, and litigation costs.
          </p>

          <p className="font-sans font-semibold text-xs text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            3. FORMAL REQUISITIONS & DEMANDS:
          </p>
          <ul className="list-decimal pl-5 space-y-1.5 font-sans text-xs">
            {draft.demands.map((demand, i) => (
              <li key={i} className="leading-snug">
                <strong>{demand}</strong>
              </li>
            ))}
          </ul>

          <p className="pt-2">
            TAKE FURTHER NOTICE that you are hereby provided a period of{' '}
            <strong>{draft.curePeriodDays || 15} (fifteen) days</strong> from the receipt of this legal notice to comply with
            the demands set out hereinabove, failing which I shall be constrained to initiate appropriate civil, regulatory,
            and tribunal proceedings before the competent forum at your sole risk, cost, and consequence.
          </p>
        </div>

        {/* Signoff */}
        <div className="pt-6 flex flex-col items-end font-sans text-xs">
          <p className="font-bold text-sm text-slate-900 dark:text-slate-100">{draft.senderName}</p>
          <p className="text-slate-500">Aggrieved Party / Complainant</p>
          <p className="text-[11px] text-slate-400 mt-1">Copy retained for record and tribunal production</p>
        </div>
      </div>
    </div>
  );
};
