'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLegalSaathi } from '@/context/LegalSaathiContext';
import { Dialog } from '@/components/ui/Dialog';

interface NewComplaintModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewComplaintModal: React.FC<NewComplaintModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const { createCaseFromProblem, setActiveCaseId } = useLegalSaathi();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Tenancy & Housing Law');
  const [jurisdiction, setJurisdiction] = useState('');
  const [description, setDescription] = useState('');
  const [claimAmount, setClaimAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !title.trim()) {
      setError('Please provide a matter title and factual description.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const fullStatement = `${title}. ${description}. Claim Amount: ${claimAmount || 'Unspecified'}. Jurisdiction: ${jurisdiction || 'General Civil'}.`;
    const newCaseId = createCaseFromProblem(description.trim(), {
      title: title.trim(),
      category,
      jurisdiction: jurisdiction.trim() || 'General Civil Jurisdiction',
      claimAmount: claimAmount.trim() || undefined,
      summary: description.trim(),
      citizenStatement: description.trim(),
    });
    setActiveCaseId(newCaseId);

    setIsSubmitting(false);
    onClose();
    router.push(`/cases/${newCaseId}`);
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <span className="material-symbols-outlined text-lg">add_box</span>
          </span>
          <span>Create New Complaint Docket</span>
        </div>
      }
      description="Initialize a structured, continuous legal case file under Indian statutory law."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-base">error</span>
            <span>{error}</span>
          </div>
        )}

        {/* Title */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
            Complaint / Matter Title *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Unlawful Security Deposit Deduction by Landlord"
            className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low dark:bg-[#161F30] border border-outline-variant/40 dark:border-[#334155] text-xs sm:text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Category & Claim Amount */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              Legal Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low dark:bg-[#161F30] border border-outline-variant/40 dark:border-[#334155] text-xs sm:text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Tenancy & Housing Law">Tenancy &amp; Housing Law</option>
              <option value="Real Estate & Property (RERA)">Real Estate &amp; Property (RERA)</option>
              <option value="Consumer Protection">Consumer Protection</option>
              <option value="Labour & Employment">Labour &amp; Employment</option>
              <option value="Civil & Statutory Rights">Civil &amp; Statutory Rights</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              Disputed Amount / Claim (₹)
            </label>
            <input
              type="text"
              value={claimAmount}
              onChange={(e) => setClaimAmount(e.target.value)}
              placeholder="e.g. ₹65,000"
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low dark:bg-[#161F30] border border-outline-variant/40 dark:border-[#334155] text-xs sm:text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Jurisdiction */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
            Jurisdiction / City / District
          </label>
          <input
            type="text"
            value={jurisdiction}
            onChange={(e) => setJurisdiction(e.target.value)}
            placeholder="e.g. Saket District Court, South Delhi"
            className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low dark:bg-[#161F30] border border-outline-variant/40 dark:border-[#334155] text-xs sm:text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Factual Description */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
            Factual Summary &amp; Sequence of Events *
          </label>
          <textarea
            rows={4}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="State key dates, agreement terms, communications sent, and relief sought..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low dark:bg-[#161F30] border border-outline-variant/40 dark:border-[#334155] text-xs sm:text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        {/* Security & Action Buttons */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
            <span className="material-symbols-outlined text-sm text-emerald-600 dark:text-emerald-400">lock</span>
            <span>DPDP Act 2023 Encrypted</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
            >
              <span>{isSubmitting ? 'Creating Docket...' : 'Create Case Docket'}</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </div>
      </form>
    </Dialog>
  );
};
