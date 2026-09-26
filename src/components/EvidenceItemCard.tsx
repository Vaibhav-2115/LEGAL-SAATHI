'use client';

import React, { useState } from 'react';
import { EvidenceItem, EvidenceStatus } from '../lib/types';

interface EvidenceItemCardProps {
  item: EvidenceItem;
  onStatusChange: (newStatus: EvidenceStatus) => void;
  onAddNote: (note: string) => void;
}

export const EvidenceItemCard: React.FC<EvidenceItemCardProps> = ({
  item,
  onStatusChange,
  onAddNote
}) => {
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFileName, setUploadFileName] = useState('');
  const [viewModalOpen, setViewModalOpen] = useState(false);

  const getStatusConfig = (status: EvidenceStatus) => {
    switch (status) {
      case 'VERIFIED':
      case 'COLLECTED':
        return {
          label: 'COLLECTED',
          bg: 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
          icon: 'verified'
        };
      case 'REVIEW_NEEDED':
      case 'NEEDS_REVIEW':
        return {
          label: 'NEEDS REVIEW',
          bg: 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800',
          icon: 'pending'
        };
      case 'MISSING':
        return {
          label: 'MISSING',
          bg: 'bg-red-100 dark:bg-red-950/80 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800',
          icon: 'priority_high'
        };
      case 'NOT_APPLICABLE':
      default:
        return {
          label: 'NOT APPLICABLE',
          bg: 'bg-slate-100 dark:bg-[#161F30] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-[#334155]',
          icon: 'block'
        };
    }
  };

  const statusConfig = getStatusConfig(item.status);

  const handleSaveNote = () => {
    if (noteText.trim()) {
      onAddNote(noteText.trim());
      setNoteText('');
      setShowNoteInput(false);
    }
  };

  const handleSimulatedUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (uploadFileName.trim()) {
      onStatusChange('COLLECTED');
      onAddNote(`Uploaded file: ${uploadFileName.trim()}`);
      setUploadFileName('');
      setShowUploadModal(false);
    }
  };

  return (
    <div className="bg-surface-container-lowest dark:bg-[#0F131C] rounded-2xl p-5 shadow-sm border border-outline-variant/30 hover:border-secondary/40 transition-all flex flex-col justify-between gap-4">
      {/* Top Header */}
      <div className="flex flex-col gap-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase border ${statusConfig.bg}`}
          >
            <span className="material-symbols-outlined text-xs">{statusConfig.icon}</span>
            {statusConfig.label}
          </span>

          <span className="text-[11px] font-mono text-on-surface-variant bg-surface-container-low dark:bg-[#161F30] px-2 py-0.5 rounded">
            {item.category}
          </span>
        </div>

        {/* Title & Notes */}
        <div>
          <h3 className="font-heading text-base sm:text-lg font-bold text-on-surface leading-tight">
            {item.name}
          </h3>
          {item.description && (
            <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
              {item.description}
            </p>
          )}
        </div>

        {/* Related Fact Link */}
        {item.relatedFact && (
          <div className="bg-surface-container-low dark:bg-[#161F30]/60 rounded-xl p-2.5 text-xs flex items-start gap-2 border-l-2 border-secondary">
            <span className="material-symbols-outlined text-sm text-secondary shrink-0 mt-0.5">fact_check</span>
            <div>
              <span className="font-bold text-on-surface block text-[11px]">Supporting Case Fact:</span>
              <span className="text-on-surface-variant">{item.relatedFact}</span>
            </div>
          </div>
        )}

        {/* Related Legal Issue */}
        {item.relatedLegalIssue && (
          <div className="bg-surface-container-low dark:bg-[#161F30]/60 rounded-xl p-2.5 text-xs flex items-start gap-2 border-l-2 border-primary">
            <span className="material-symbols-outlined text-sm text-primary dark:text-primary-fixed shrink-0 mt-0.5">gavel</span>
            <div>
              <span className="font-bold text-on-surface block text-[11px]">Addresses Legal Issue:</span>
              <span className="text-on-surface-variant">{item.relatedLegalIssue}</span>
            </div>
          </div>
        )}

        {/* Active Note or Collection Timestamp */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-on-surface-variant pt-1">
          {item.collectedAt ? (
            <span className="flex items-center gap-1 font-mono text-[11px]">
              <span className="material-symbols-outlined text-xs text-emerald-600">event_available</span>
              Secured on: {item.collectedAt}
            </span>
          ) : (
            <span className="italic text-[11px]">No verification timestamp yet</span>
          )}

          {item.notes && (
            <span className="text-[11px] text-secondary dark:text-secondary-fixed font-medium truncate max-w-[200px]" title={item.notes}>
              Note: {item.notes}
            </span>
          )}
        </div>

        {/* Interactive Note Input Drawer */}
        {showNoteInput && (
          <div className="mt-2 p-3 rounded-xl bg-surface-container-low dark:bg-[#161F30] border border-outline-variant/30 flex flex-col gap-2">
            <label className="text-[11px] font-bold text-on-surface">Add Annotation or Custody Note:</label>
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="e.g. Received email confirmation from landlord on 12 Jan..."
              rows={2}
              className="w-full text-xs p-2 rounded-lg bg-surface-container-lowest dark:bg-[#0F131C] border border-outline-variant/40 text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setShowNoteInput(false)}
                className="px-2.5 py-1 text-xs text-on-surface-variant hover:text-on-surface"
                type="button"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNote}
                className="px-3 py-1 bg-primary text-white text-xs font-bold rounded-md hover:bg-secondary"
                type="button"
              >
                Save Note
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Action Bar */}
      <div className="pt-3 border-t border-outline-variant/20 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          {/* View Details Button */}
          <button
            onClick={() => setViewModalOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-surface-container-low dark:bg-[#161F30] hover:bg-surface-container-high text-on-surface text-xs font-semibold border border-outline-variant/30 transition-colors flex items-center gap-1"
            type="button"
          >
            <span className="material-symbols-outlined text-sm">visibility</span>
            <span>View</span>
          </button>

          {/* Upload Button */}
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-3 py-1.5 rounded-lg bg-primary hover:bg-secondary text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1"
            type="button"
          >
            <span className="material-symbols-outlined text-sm">upload_file</span>
            <span>Upload</span>
          </button>

          {/* Add Note Button */}
          <button
            onClick={() => setShowNoteInput(!showNoteInput)}
            className="p-1.5 rounded-lg hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors"
            title="Add Note"
            type="button"
          >
            <span className="material-symbols-outlined text-base">edit_note</span>
          </button>
        </div>

        {/* Quick Status Toggle Dropdown / Buttons */}
        <div className="flex items-center gap-1">
          {item.status !== 'COLLECTED' && item.status !== 'VERIFIED' && (
            <button
              onClick={() => onStatusChange('COLLECTED')}
              className="px-2.5 py-1 text-[11px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 hover:bg-emerald-200 rounded-md transition-colors"
              title="Mark Collected"
              type="button"
            >
              Mark Collected
            </button>
          )}

          {item.status !== 'MISSING' && (
            <button
              onClick={() => onStatusChange('MISSING')}
              className="px-2.5 py-1 text-[11px] font-bold text-red-800 dark:text-red-300 bg-red-100 dark:bg-red-950/60 hover:bg-red-200 rounded-md transition-colors"
              title="Mark Missing"
              type="button"
            >
              Mark Missing
            </button>
          )}

          {item.status !== 'NOT_APPLICABLE' && (
            <button
              onClick={() => onStatusChange('NOT_APPLICABLE')}
              className="p-1 rounded text-on-surface-variant hover:text-on-surface text-xs"
              title="Mark Not Applicable"
              type="button"
            >
              <span className="material-symbols-outlined text-sm">do_not_disturb_on</span>
            </button>
          )}
        </div>
      </div>

      {/* Upload Modal Simulation */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest dark:bg-[#0F131C] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-outline-variant/40 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h4 className="font-heading text-lg font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">upload_file</span>
                Upload Evidence Document
              </h4>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-on-surface-variant hover:text-on-surface"
                type="button"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <p className="text-xs text-on-surface-variant leading-relaxed">
              Attaching proof for: <strong>{item.name}</strong> ({item.category}).
              Supported formats: PDF, JPEG, PNG (max 25MB). Documents remain local to this browser session.
            </p>

            <form onSubmit={handleSimulatedUpload} className="flex flex-col gap-3">
              <div>
                <label className="text-xs font-bold text-on-surface block mb-1">Document File Name or Identifier:</label>
                <input
                  type="text"
                  required
                  value={uploadFileName}
                  onChange={(e) => setUploadFileName(e.target.value)}
                  placeholder="e.g. Registered_Lease_Agreement_2025.pdf"
                  className="w-full text-xs p-2.5 rounded-lg bg-surface-container-low dark:bg-[#161F30] border border-outline-variant/40 text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary"
                />
              </div>

              <div className="border-2 border-dashed border-outline-variant/60 rounded-xl p-6 text-center flex flex-col items-center justify-center gap-2 bg-surface-container-low/40">
                <span className="material-symbols-outlined text-3xl text-secondary">cloud_upload</span>
                <span className="text-xs font-semibold text-on-surface">Click to select file or drag and drop</span>
                <span className="text-[10px] text-on-surface-variant">Encrypted & grounded to case file</span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-on-surface-variant hover:text-on-surface"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-primary hover:bg-secondary text-white text-xs font-bold shadow-sm"
                >
                  Confirm & Mark Collected
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {viewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest dark:bg-[#0F131C] rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-outline-variant/40 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h4 className="font-heading text-lg font-bold text-on-surface">
                {item.name}
              </h4>
              <button
                onClick={() => setViewModalOpen(false)}
                className="text-on-surface-variant hover:text-on-surface"
                type="button"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-outline-variant/20">
                <span className="text-on-surface-variant">Category:</span>
                <span className="font-semibold text-on-surface">{item.category}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-outline-variant/20">
                <span className="text-on-surface-variant">Status:</span>
                <span className="font-semibold text-on-surface">{statusConfig.label}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-outline-variant/20">
                <span className="text-on-surface-variant">Verification Note:</span>
                <span className="font-semibold text-on-surface">{item.statusLabel}</span>
              </div>
              {item.notes && (
                <div className="py-1">
                  <span className="text-on-surface-variant block mb-0.5">Citizen Notes:</span>
                  <p className="bg-surface-container-low dark:bg-[#161F30] p-2 rounded-lg text-on-surface">
                    {item.notes}
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setViewModalOpen(false)}
                className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-secondary"
                type="button"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
