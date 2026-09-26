'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { KeyFact, FactVerificationStatus } from '../lib/types';

interface FactVerificationCardProps {
  fact: KeyFact;
  caseId: string;
  onUpdateStatus: (factId: string, status: FactVerificationStatus) => void;
  onResolveConflict: (factId: string, resolutionNote: string) => void;
}

export const FactVerificationCard: React.FC<FactVerificationCardProps> = ({
  fact,
  caseId,
  onUpdateStatus,
  onResolveConflict
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedStatus, setEditedStatus] = useState<FactVerificationStatus>(
    fact.verificationStatus || 'NEEDS_VERIFICATION'
  );
  const [showConflictModal, setShowConflictModal] = useState(false);
  const [resolutionText, setResolutionText] = useState('');

  const status = fact.verificationStatus || 'NEEDS_VERIFICATION';

  const getStatusBadge = (s: FactVerificationStatus) => {
    switch (s) {
      case 'CONFIRMED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300/40">
            <span className="material-symbols-outlined text-sm">verified</span>
            Confirmed
          </span>
        );
      case 'SUPPORTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-300/40">
            <span className="material-symbols-outlined text-sm">check_circle</span>
            Supported
          </span>
        );
      case 'NEEDS_VERIFICATION':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300/40">
            <span className="material-symbols-outlined text-sm">pending_actions</span>
            Needs Verification
          </span>
        );
      case 'MISSING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 dark:bg-[#161F30] dark:text-slate-300 border border-slate-300/40">
            <span className="material-symbols-outlined text-sm">help_outline</span>
            Missing
          </span>
        );
      case 'CONFLICTING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-300/40 animate-pulse">
            <span className="material-symbols-outlined text-sm">warning</span>
            Conflicting
          </span>
        );
    }
  };

  const handleStatusSave = () => {
    onUpdateStatus(fact.id, editedStatus);
    setIsEditing(false);
  };

  const handleConflictResolve = () => {
    if (resolutionText.trim()) {
      onResolveConflict(fact.id, resolutionText.trim());
      setShowConflictModal(false);
      setResolutionText('');
    }
  };

  return (
    <article
      aria-label={`Fact: ${fact.statement}`}
      className={`rounded-2xl border p-5 transition-all shadow-sm ${
        status === 'CONFLICTING'
          ? 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-300/60 dark:border-rose-900/60'
          : 'bg-surface-container-lowest dark:bg-[#0F131C] border-outline-variant/40 hover:border-outline-variant'
      }`}
    >
      {/* Top Meta Line */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-mono text-on-surface-variant bg-surface-container-low dark:bg-[#161F30] px-2 py-0.5 rounded font-semibold">
            #{fact.id}
          </span>
          <span className="font-medium text-on-surface-variant">
            Category: <strong className="text-on-surface">{fact.category}</strong>
          </span>
          <span className="text-on-surface-variant">•</span>
          <span className="text-on-surface-variant">
            Source: <strong className="text-on-surface">{fact.source.replace('_', ' ')}</strong>
          </span>
        </div>
        <div>{getStatusBadge(status)}</div>
      </div>

      {/* Fact Statement */}
      <p className="text-base sm:text-lg font-medium text-on-surface leading-snug mb-3">
        &ldquo;{fact.statement}&rdquo;
      </p>

      {/* Supporting Evidence Link & Legal Issue */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-3 border-y border-outline-variant/25 text-xs">
        <div>
          <span className="text-on-surface-variant block font-medium mb-1">
            Associated Evidence
          </span>
          {fact.supportingEvidenceName ? (
            <Link
              href={`/cases/${caseId}/evidence`}
              className="inline-flex items-center gap-1.5 font-bold text-primary hover:underline"
            >
              <span className="material-symbols-outlined text-sm">attachment</span>
              <span>{fact.supportingEvidenceName}</span>
              <span className="material-symbols-outlined text-xs">arrow_forward</span>
            </Link>
          ) : (
            <span className="text-on-surface-variant/80 italic flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">info</span>
              No direct documentary attachment yet
            </span>
          )}
        </div>

        <div>
          <span className="text-on-surface-variant block font-medium mb-1">
            Related Legal Issue
          </span>
          {fact.relatedLegalIssue ? (
            <Link
              href={`/cases/${caseId}/explanation`}
              className="inline-flex items-center gap-1.5 font-bold text-secondary dark:text-secondary-fixed hover:underline"
            >
              <span className="material-symbols-outlined text-sm">gavel</span>
              <span>{fact.relatedLegalIssue}</span>
            </Link>
          ) : (
            <span className="text-on-surface-variant/80">Pending legal categorization</span>
          )}
        </div>
      </div>

      {/* Conflicting Information Warning Callout */}
      {status === 'CONFLICTING' && fact.conflictDetails && (
        <div className="mt-4 p-4 rounded-xl bg-rose-100/70 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-900/60 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-rose-900 dark:text-rose-200 text-sm mb-2">
            <span className="material-symbols-outlined text-base text-rose-600">report_problem</span>
            <span>CONFLICT DETECTED — Clarification Required</span>
          </div>

          <div className="space-y-2 text-rose-800 dark:text-rose-300">
            <div>
              <strong className="block text-rose-950 dark:text-rose-100">What differs:</strong>
              <p className="mt-0.5">{fact.conflictDetails.whatDiffers}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-rose-200/50 dark:bg-rose-900/30 p-2.5 rounded-lg">
              <div>
                <strong className="block text-[11px] uppercase tracking-wider text-rose-900 dark:text-rose-200">
                  Origin 1:
                </strong>
                <span>{fact.conflictDetails.sourceA}</span>
              </div>
              <div>
                <strong className="block text-[11px] uppercase tracking-wider text-rose-900 dark:text-rose-200">
                  Origin 2:
                </strong>
                <span>{fact.conflictDetails.sourceB}</span>
              </div>
            </div>

            <div>
              <strong className="block text-rose-950 dark:text-rose-100">
                What information may resolve this:
              </strong>
              <p className="mt-0.5">{fact.conflictDetails.howToResolve}</p>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between pt-2 border-t border-rose-200 dark:border-rose-900/40">
            <p className="text-[11px] text-rose-700 dark:text-rose-400 italic">
              Legal Saathi does not decide which statement is correct.
            </p>
            <button
              type="button"
              onClick={() => setShowConflictModal(true)}
              className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors shadow-sm flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">how_to_reg</span>
              <span>Provide Clarification</span>
            </button>
          </div>
        </div>
      )}

      {/* Interactive Status Editing */}
      {isEditing ? (
        <div className="mt-4 p-3 bg-surface-container-low dark:bg-[#161F30] rounded-xl border border-outline-variant/40 space-y-3">
          <label className="block text-xs font-bold text-on-surface">
            Change Fact Verification Status:
          </label>
          <div className="flex flex-wrap gap-2">
            {(['CONFIRMED', 'SUPPORTED', 'NEEDS_VERIFICATION', 'MISSING', 'CONFLICTING'] as FactVerificationStatus[]).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setEditedStatus(s)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                  editedStatus === s
                    ? 'bg-primary text-on-primary border-primary'
                    : 'bg-surface-container-lowest dark:bg-[#0F131C] text-on-surface border-outline-variant/40'
                }`}
              >
                {s.replace('_', ' ')}
              </button>
            ))}
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-3 py-1 rounded-lg text-xs font-medium text-on-surface-variant hover:bg-surface-container"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleStatusSave}
              className="px-3 py-1 rounded-lg text-xs font-bold bg-primary text-on-primary hover:bg-primary/90"
            >
              Update Status
            </button>
          </div>
        </div>
      ) : (
        /* Action Buttons */
        <div className="flex flex-wrap items-center justify-between gap-2 mt-4 pt-3 border-t border-outline-variant/20">
          <div className="flex flex-wrap items-center gap-2">
            {fact.supportingEvidenceId && (
              <Link
                href={`/cases/${caseId}/evidence`}
                className="px-2.5 py-1 rounded-lg bg-surface-container-low dark:bg-[#161F30] hover:bg-surface-container text-xs font-semibold text-on-surface border border-outline-variant/40 transition-colors flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm text-primary">visibility</span>
                <span>View Evidence</span>
              </Link>
            )}

            <Link
              href={`/cases/${caseId}/sources/compare`}
              className="px-2.5 py-1 rounded-lg bg-surface-container-low dark:bg-[#161F30] hover:bg-surface-container text-xs font-semibold text-on-surface border border-outline-variant/40 transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm text-secondary">menu_book</span>
              <span>Compare Law</span>
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="text-xs font-semibold text-primary dark:text-primary-fixed hover:underline flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">edit_note</span>
            <span>Update Status</span>
          </button>
        </div>
      )}

      {/* Modal / Clarification Dialog */}
      {showConflictModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
        >
          <div className="bg-surface-container-lowest dark:bg-[#0F131C] border border-outline-variant rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
              <h3 className="font-heading font-bold text-base text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-rose-600">help_outline</span>
                <span>Resolve Fact Discrepancy</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowConflictModal(false)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <p className="text-xs text-on-surface-variant">
              Provide clarification or add a note explaining which invoice, agreement, or timestamp establishes the accurate position.
            </p>

            <div className="bg-surface-container-low dark:bg-[#161F30]/80 p-3 rounded-xl text-xs space-y-1">
              <span className="text-on-surface-variant font-bold">Conflicting Topic:</span>
              <p className="font-medium text-on-surface">{fact.conflictDetails?.whatDiffers}</p>
            </div>

            <div>
              <label htmlFor="clarification-note" className="block text-xs font-bold text-on-surface mb-1">
                Your Clarification or Rebuttal Note:
              </label>
              <textarea
                id="clarification-note"
                rows={3}
                value={resolutionText}
                onChange={(e) => setResolutionText(e.target.value)}
                placeholder="e.g. Handover inspection video recorded on 10 Jan proves walls were in standard condition without unauthorized painting."
                className="w-full text-xs p-3 rounded-xl border border-outline-variant/50 bg-surface dark:bg-[#161F30] text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowConflictModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-on-surface-variant hover:bg-surface-container"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConflictResolve}
                disabled={!resolutionText.trim()}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-primary text-on-primary hover:bg-primary/90 disabled:opacity-50 transition-colors"
              >
                Save Resolution
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
};
