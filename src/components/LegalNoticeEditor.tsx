'use client';

import React, { useState } from 'react';
import { LegalCase, LegalNoticeDraft } from '../lib/types';
import { useLegalSaathi } from '../context/LegalSaathiContext';

interface LegalNoticeEditorProps {
  currentCase: LegalCase;
  draft: LegalNoticeDraft;
  onDraftChange: (updated: LegalNoticeDraft) => void;
  onSave: () => void;
  onRegenerate: () => void;
}

export const LegalNoticeEditor: React.FC<LegalNoticeEditorProps> = ({
  currentCase,
  draft,
  onDraftChange,
  onSave,
  onRegenerate
}) => {
  const { legalNoticeDrafts } = useLegalSaathi();
  const [activeTab, setActiveTab] = useState<'details' | 'facts' | 'demands'>('details');

  const handleChange = <K extends keyof LegalNoticeDraft>(field: K, value: LegalNoticeDraft[K]) => {
    onDraftChange({
      ...draft,
      [field]: value
    });
  };

  const handleDemandChange = (index: number, val: string) => {
    const updated = [...draft.demands];
    updated[index] = val;
    handleChange('demands', updated);
  };

  const handleAddDemand = () => {
    handleChange('demands', [...draft.demands, '']);
  };

  const handleRemoveDemand = (index: number) => {
    handleChange('demands', draft.demands.filter((_, i) => i !== index));
  };

  const isSaved = Boolean(legalNoticeDrafts[currentCase.id]);

  return (
    <div className="bg-surface-container-lowest dark:bg-[#0F131C] rounded-2xl p-5 sm:p-6 shadow-sm border border-outline-variant/30 flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-outline-variant/30">
        <div>
          <span className="text-[10px] font-bold text-secondary uppercase tracking-wider font-mono">
            STEP 1 OF 3: PREPARE NOTICE
          </span>
          <h3 className="font-heading text-lg font-bold text-on-surface">
            Draft Notice Parameters
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onRegenerate}
            className="px-3 py-1.5 rounded-lg bg-surface-container-low dark:bg-[#161F30] hover:bg-surface-container-high text-xs font-semibold text-on-surface border border-outline-variant/40 transition-colors flex items-center gap-1"
            title="Reset to Case Baseline"
            type="button"
          >
            <span className="material-symbols-outlined text-sm">restart_alt</span>
            <span>Regenerate</span>
          </button>

          <button
            onClick={onSave}
            className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1"
            type="button"
          >
            <span className="material-symbols-outlined text-sm">save</span>
            <span>{isSaved ? 'Draft Saved' : 'Save Draft'}</span>
          </button>
        </div>
      </div>

      {/* Editor Subtabs */}
      <div className="flex items-center gap-1 border-b border-outline-variant/20 pb-2">
        {[
          { id: 'details', label: 'Parties & Claims', icon: 'badge' },
          { id: 'facts', label: 'Facts & Statute', icon: 'fact_check' },
          { id: 'demands', label: 'Requisitions & Period', icon: 'format_list_numbered' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'details' | 'facts' | 'demands')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeTab === tab.id
                ? 'bg-primary-container text-white shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-sm">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Form Fields Based on Tab */}
      {activeTab === 'details' && (
        <div className="space-y-4 text-xs">
          {/* Recipient Details */}
          <div className="space-y-2">
            <h4 className="font-bold text-primary dark:text-primary-fixed uppercase tracking-wider text-[11px]">
              Recipient (Opposite Party) Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-on-surface block mb-1">
                  Recipient Full Name / Entity *
                </label>
                <input
                  type="text"
                  value={draft.recipientName}
                  onChange={(e) => handleChange('recipientName', e.target.value)}
                  placeholder="e.g. Ramesh Chandra (Landlord)"
                  className="w-full text-xs p-2.5 rounded-lg bg-surface-container-low dark:bg-[#161F30] border border-outline-variant/40 text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-on-surface block mb-1">
                  Designation / Role
                </label>
                <input
                  type="text"
                  value={draft.recipientDesignation || ''}
                  onChange={(e) => handleChange('recipientDesignation', e.target.value)}
                  placeholder="e.g. Property Owner / Developer"
                  className="w-full text-xs p-2.5 rounded-lg bg-surface-container-low dark:bg-[#161F30] border border-outline-variant/40 text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-on-surface block mb-1">
                Recipient Postal Address *
              </label>
              <textarea
                rows={2}
                value={draft.recipientAddress}
                onChange={(e) => handleChange('recipientAddress', e.target.value)}
                placeholder="Complete postal address for Registered Post AD"
                className="w-full text-xs p-2.5 rounded-lg bg-surface-container-low dark:bg-[#161F30] border border-outline-variant/40 text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-on-surface block mb-1">
                Recipient Email / Phone (Optional)
              </label>
              <input
                type="text"
                value={draft.recipientEmail || ''}
                onChange={(e) => handleChange('recipientEmail', e.target.value)}
                placeholder="e.g. contact@landlord.com"
                className="w-full text-xs p-2.5 rounded-lg bg-surface-container-low dark:bg-[#161F30] border border-outline-variant/40 text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary"
              />
            </div>
          </div>

          {/* Sender Details */}
          <div className="space-y-2 pt-3 border-t border-outline-variant/20">
            <h4 className="font-bold text-primary dark:text-primary-fixed uppercase tracking-wider text-[11px]">
              Sender (Aggrieved Citizen) Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-on-surface block mb-1">
                  Your Full Legal Name *
                </label>
                <input
                  type="text"
                  value={draft.senderName}
                  onChange={(e) => handleChange('senderName', e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full text-xs p-2.5 rounded-lg bg-surface-container-low dark:bg-[#161F30] border border-outline-variant/40 text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-on-surface block mb-1">
                  Claim / Demanded Amount *
                </label>
                <input
                  type="text"
                  value={draft.demandedAmount}
                  onChange={(e) => handleChange('demandedAmount', e.target.value)}
                  placeholder="e.g. ₹65,000"
                  className="w-full text-xs p-2.5 rounded-lg bg-surface-container-low dark:bg-[#161F30] border border-outline-variant/40 text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-on-surface block mb-1">
                Your Current Correspondence Address *
              </label>
              <textarea
                rows={2}
                value={draft.senderAddress}
                onChange={(e) => handleChange('senderAddress', e.target.value)}
                placeholder="Your current address for return postal acknowledgment"
                className="w-full text-xs p-2.5 rounded-lg bg-surface-container-low dark:bg-[#161F30] border border-outline-variant/40 text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary"
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'facts' && (
        <div className="space-y-4 text-xs">
          <div>
            <label className="text-[11px] font-bold text-on-surface block mb-1">
              Statement of Material Facts (Chronological Narrative) *
            </label>
            <textarea
              rows={6}
              value={draft.factsSummary}
              onChange={(e) => handleChange('factsSummary', e.target.value)}
              placeholder="Detailed chronological account of the transaction, dates, handover, non-payment, and breach..."
              className="w-full text-xs p-3 rounded-lg bg-surface-container-low dark:bg-[#161F30] border border-outline-variant/40 text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary font-mono"
            />
            <span className="text-[11px] text-on-surface-variant mt-1 block">
              Synthesized automatically from Case Facts & Evidence records in #{currentCase.id}.
            </span>
          </div>

          <div>
            <label className="text-[11px] font-bold text-on-surface block mb-1">
              Statutory Basis / Relevant Acts Cited *
            </label>
            <input
              type="text"
              value={draft.statutoryBasis}
              onChange={(e) => handleChange('statutoryBasis', e.target.value)}
              placeholder="e.g. Section 11 Model Tenancy Act, 2021 & Section 73 Indian Contract Act, 1872"
              className="w-full text-xs p-2.5 rounded-lg bg-surface-container-low dark:bg-[#161F30] border border-outline-variant/40 text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary"
            />
          </div>
        </div>
      )}

      {activeTab === 'demands' && (
        <div className="space-y-4 text-xs">
          <div>
            <label className="text-[11px] font-bold text-on-surface block mb-1">
              Statutory Cure / Compliance Window (Days) *
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={7}
                max={60}
                value={draft.curePeriodDays}
                onChange={(e) => handleChange('curePeriodDays', parseInt(e.target.value) || 15)}
                className="w-24 text-xs p-2 rounded-lg bg-surface-container-low dark:bg-[#161F30] border border-outline-variant/40 text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary text-center font-bold"
              />
              <span className="text-on-surface-variant">
                Standard under Indian commercial & tenancy notices is <strong>15 days</strong>.
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-on-surface">
                List of Specific Requisitions / Demands:
              </label>
              <button
                onClick={handleAddDemand}
                className="text-xs font-bold text-secondary flex items-center gap-1 hover:underline"
                type="button"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                <span>Add Demand</span>
              </button>
            </div>

            {draft.demands.map((demand, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="font-mono font-bold text-on-surface-variant w-5 text-center">
                  {index + 1}.
                </span>
                <input
                  type="text"
                  value={demand}
                  onChange={(e) => handleDemandChange(index, e.target.value)}
                  className="flex-1 text-xs p-2 rounded-lg bg-surface-container-low dark:bg-[#161F30] border border-outline-variant/40 text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary"
                />
                {draft.demands.length > 1 && (
                  <button
                    onClick={() => handleRemoveDemand(index)}
                    className="p-1 text-red-500 hover:text-red-700"
                    title="Remove demand"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
