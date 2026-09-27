'use client';

import React, { useState } from 'react';
import { LegalCase, LegalNoticeDraft } from '../lib/types';
import { useLegalSaathi } from '../context/LegalSaathiContext';
import { detectCaseDomain } from '../lib/rules-engine';
import { generateFullNoticeText } from '../lib/draft-templates';

interface LegalNoticeEditorProps {
  currentCase: LegalCase;
  draft: LegalNoticeDraft;
  onDraftChange: (updated: LegalNoticeDraft) => void;
  onSave: () => void;
  onRegenerate: () => void;
  onPreviewClick?: () => void;
}

export const LegalNoticeEditor: React.FC<LegalNoticeEditorProps> = ({
  currentCase,
  draft,
  onDraftChange,
  onSave,
  onRegenerate,
  onPreviewClick
}) => {
  const { legalNoticeDrafts, t } = useLegalSaathi();
  const domain = detectCaseDomain(currentCase);
  const [activeTab, setActiveTab] = useState<'details' | 'matter' | 'facts' | 'demands'>('details');

  const handleChange = <K extends keyof LegalNoticeDraft>(field: K, value: LegalNoticeDraft[K]) => {
    const updated = {
      ...draft,
      [field]: value
    };
    // Keep full text in sync
    updated.fullDocumentText = generateFullNoticeText(updated, currentCase.id);
    onDraftChange(updated);
  };

  const handleProjectDetailsChange = (key: string, value: string) => {
    const updated = {
      ...draft,
      projectDetails: {
        ...(draft.projectDetails || {}),
        [key]: value
      }
    };
    updated.fullDocumentText = generateFullNoticeText(updated, currentCase.id);
    onDraftChange(updated);
  };

  const handleEmploymentDetailsChange = (key: string, value: string) => {
    const updated = {
      ...draft,
      employmentDetails: {
        ...(draft.employmentDetails || {}),
        [key]: value
      }
    };
    updated.fullDocumentText = generateFullNoticeText(updated, currentCase.id);
    onDraftChange(updated);
  };

  const handleCyberDetailsChange = (key: string, value: string) => {
    const updated = {
      ...draft,
      cyberDetails: {
        ...(draft.cyberDetails || {}),
        [key]: value
      }
    };
    updated.fullDocumentText = generateFullNoticeText(updated, currentCase.id);
    onDraftChange(updated);
  };

  const handleConsumerDetailsChange = (key: string, value: string) => {
    const updated = {
      ...draft,
      consumerDetails: {
        ...(draft.consumerDetails || {}),
        [key]: value
      }
    };
    updated.fullDocumentText = generateFullNoticeText(updated, currentCase.id);
    onDraftChange(updated);
  };

  const handleDemandChange = (index: number, val: string) => {
    const updatedDemands = [...draft.demands];
    updatedDemands[index] = val;
    const updated = {
      ...draft,
      demands: updatedDemands
    };
    updated.fullDocumentText = generateFullNoticeText(updated, currentCase.id);
    onDraftChange(updated);
  };

  const handleAddDemand = () => {
    const updatedDemands = [...draft.demands, ''];
    const updated = {
      ...draft,
      demands: updatedDemands
    };
    updated.fullDocumentText = generateFullNoticeText(updated, currentCase.id);
    onDraftChange(updated);
  };

  const handleRemoveDemand = (index: number) => {
    const updatedDemands = draft.demands.filter((_, i) => i !== index);
    const updated = {
      ...draft,
      demands: updatedDemands
    };
    updated.fullDocumentText = generateFullNoticeText(updated, currentCase.id);
    onDraftChange(updated);
  };

  const isSaved = Boolean(legalNoticeDrafts[currentCase.id]);

  const domainLabel =
    domain === 'property_rera' ? 'RERA Allotment' :
    domain === 'employment' ? 'Employment & Salary' :
    domain === 'cybercrime' ? 'Cyber & Bank Record' :
    domain === 'consumer' ? 'Consumer & Order' :
    'Tenancy Details';

  return (
    <div className="bg-surface-container-lowest dark:bg-[#0F131C] rounded-2xl p-5 sm:p-6 shadow-sm border border-outline-variant/30 flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-outline-variant/30">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-secondary uppercase tracking-wider font-mono">
              STEP 1 OF 3: PREPARE NOTICE
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
              {domain.replace('_', ' ').toUpperCase()}
            </span>
          </div>
          <h3 className="font-heading text-lg font-bold text-on-surface mt-0.5">
            {t.draftNoticeParameters}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {onPreviewClick && (
            <button
              onClick={onPreviewClick}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1"
              type="button"
            >
              <span className="material-symbols-outlined text-sm">visibility</span>
              <span>{t.btnPreviewDocument}</span>
            </button>
          )}

          <button
            onClick={onRegenerate}
            className="px-3 py-1.5 rounded-lg bg-surface-container-low dark:bg-[#161F30] hover:bg-surface-container-high text-xs font-semibold text-on-surface border border-outline-variant/40 transition-colors flex items-center gap-1 shadow-2xs"
            title="Reset to Case Baseline"
            type="button"
          >
            <span className="material-symbols-outlined text-sm">restart_alt</span>
            <span>{t.btnRegenerate}</span>
          </button>

          <button
            onClick={onSave}
            className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1"
            type="button"
          >
            <span className="material-symbols-outlined text-sm">save</span>
            <span>{isSaved ? t.statusSaved : t.btnSaveDraft}</span>
          </button>
        </div>
      </div>

      {/* Editor Subtabs */}
      <div className="flex items-center gap-1 border-b border-outline-variant/20 pb-2 overflow-x-auto">
        {[
          { id: 'details', label: t.paramParties, icon: 'badge' },
          { id: 'matter', label: domainLabel, icon: 'domain' },
          { id: 'facts', label: t.paramFactsStatutes, icon: 'fact_check' },
          { id: 'demands', label: t.paramRequisitions, icon: 'format_list_numbered' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-sm'
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
                  placeholder="e.g. Opposite Party Name"
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
                  placeholder="e.g. Managing Director / Nodal Officer"
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
                placeholder="e.g. notices@oppositeparty.com"
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
                  placeholder="e.g. Aggrieved Party Name"
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
                placeholder="Your address for return postal acknowledgment"
                className="w-full text-xs p-2.5 rounded-lg bg-surface-container-low dark:bg-[#161F30] border border-outline-variant/40 text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary"
              />
            </div>
          </div>
        </div>
      )}

      {/* DYNAMIC MATTER SPECIFICS TAB */}
      {activeTab === 'matter' && (
        <div className="space-y-4 text-xs">
          {domain === 'property_rera' && (
            <div className="space-y-3">
              <h4 className="font-bold text-primary dark:text-primary-fixed uppercase tracking-wider text-[11px]">
                Builder &amp; Project Particulars (RERA Grounds)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-on-surface block mb-1">
                    Project Name
                  </label>
                  <input
                    type="text"
                    value={draft.projectDetails?.projectName || ''}
                    onChange={(e) => handleProjectDetailsChange('projectName', e.target.value)}
                    placeholder="e.g. Apex Regal Enclave"
                    className="w-full text-xs p-2.5 rounded-lg bg-surface-container-low dark:bg-[#161F30] border border-outline-variant/40 text-on-surface focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-on-surface block mb-1">
                    Unit / Apartment Flat Number
                  </label>
                  <input
                    type="text"
                    value={draft.projectDetails?.unitNumber || ''}
                    onChange={(e) => handleProjectDetailsChange('unitNumber', e.target.value)}
                    placeholder="e.g. Tower B, Flat 804"
                    className="w-full text-xs p-2.5 rounded-lg bg-surface-container-low dark:bg-[#161F30] border border-outline-variant/40 text-on-surface focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-on-surface block mb-1">
                    Agreement for Sale / BBA Date
                  </label>
                  <input
                    type="text"
                    value={draft.projectDetails?.agreementDate || ''}
                    onChange={(e) => handleProjectDetailsChange('agreementDate', e.target.value)}
                    placeholder="e.g. 15 March 2022"
                    className="w-full text-xs p-2.5 rounded-lg bg-surface-container-low dark:bg-[#161F30] border border-outline-variant/40 text-on-surface focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-on-surface block mb-1">
                    Promised Possession Date
                  </label>
                  <input
                    type="text"
                    value={draft.projectDetails?.promisedPossessionDate || ''}
                    onChange={(e) => handleProjectDetailsChange('promisedPossessionDate', e.target.value)}
                    placeholder="e.g. 31 July 2024"
                    className="w-full text-xs p-2.5 rounded-lg bg-surface-container-low dark:bg-[#161F30] border border-outline-variant/40 text-on-surface focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-[11px] font-bold text-on-surface block mb-1">
                  RERA Registration Number
                </label>
                <input
                  type="text"
                  value={draft.projectDetails?.reraRegistrationNumber || ''}
                  onChange={(e) => handleProjectDetailsChange('reraRegistrationNumber', e.target.value)}
                  placeholder="e.g. HRERA-PKL-GGM-882-2021"
                  className="w-full text-xs p-2.5 rounded-lg bg-surface-container-low dark:bg-[#161F30] border border-outline-variant/40 text-on-surface focus:outline-none"
                />
              </div>
            </div>
          )}

          {domain === 'employment' && (
            <div className="space-y-3">
              <h4 className="font-bold text-primary dark:text-primary-fixed uppercase tracking-wider text-[11px]">
                Employment &amp; Salary Particulars (Labour Grounds)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-on-surface block mb-1">
                    Employee Designation / Role
                  </label>
                  <input
                    type="text"
                    value={draft.employmentDetails?.employeeDesignation || ''}
                    onChange={(e) => handleEmploymentDetailsChange('employeeDesignation', e.target.value)}
                    placeholder="e.g. Senior Software Engineer"
                    className="w-full text-xs p-2.5 rounded-lg bg-surface-container-low dark:bg-[#161F30] border border-outline-variant/40 text-on-surface focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-on-surface block mb-1">
                    Unpaid Wage Period
                  </label>
                  <input
                    type="text"
                    value={draft.employmentDetails?.unpaidPeriod || ''}
                    onChange={(e) => handleEmploymentDetailsChange('unpaidPeriod', e.target.value)}
                    placeholder="e.g. November 2025 to January 2026"
                    className="w-full text-xs p-2.5 rounded-lg bg-surface-container-low dark:bg-[#161F30] border border-outline-variant/40 text-on-surface focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-on-surface block mb-1">
                    Monthly Salary Rate
                  </label>
                  <input
                    type="text"
                    value={draft.employmentDetails?.monthlySalary || ''}
                    onChange={(e) => handleEmploymentDetailsChange('monthlySalary', e.target.value)}
                    placeholder="e.g. ₹80,000 per month"
                    className="w-full text-xs p-2.5 rounded-lg bg-surface-container-low dark:bg-[#161F30] border border-outline-variant/40 text-on-surface focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-on-surface block mb-1">
                    Total Salary Claimed
                  </label>
                  <input
                    type="text"
                    value={draft.employmentDetails?.totalSalaryClaimed || draft.demandedAmount}
                    onChange={(e) => handleEmploymentDetailsChange('totalSalaryClaimed', e.target.value)}
                    placeholder="e.g. ₹2,40,000"
                    className="w-full text-xs p-2.5 rounded-lg bg-surface-container-low dark:bg-[#161F30] border border-outline-variant/40 text-on-surface focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {domain === 'cybercrime' && (
            <div className="space-y-3">
              <h4 className="font-bold text-primary dark:text-primary-fixed uppercase tracking-wider text-[11px]">
                Cyber &amp; Banking Transaction Details (IT Act / RBI)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-on-surface block mb-1">
                    Platform / Channel
                  </label>
                  <input
                    type="text"
                    value={draft.cyberDetails?.platformName || ''}
                    onChange={(e) => handleCyberDetailsChange('platformName', e.target.value)}
                    placeholder="e.g. UPI Mobile App / Internet Banking"
                    className="w-full text-xs p-2.5 rounded-lg bg-surface-container-low dark:bg-[#161F30] border border-outline-variant/40 text-on-surface focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-on-surface block mb-1">
                    Transaction Reference / UTR
                  </label>
                  <input
                    type="text"
                    value={draft.cyberDetails?.transactionReference || ''}
                    onChange={(e) => handleCyberDetailsChange('transactionReference', e.target.value)}
                    placeholder="e.g. UPI/AXB/20260210/88129304"
                    className="w-full text-xs p-2.5 rounded-lg bg-surface-container-low dark:bg-[#161F30] border border-outline-variant/40 text-on-surface focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-on-surface block mb-1">
                    Incident Date &amp; Time
                  </label>
                  <input
                    type="text"
                    value={draft.cyberDetails?.incidentTime || ''}
                    onChange={(e) => handleCyberDetailsChange('incidentTime', e.target.value)}
                    placeholder="e.g. 10 Feb 2026, 14:15 IST"
                    className="w-full text-xs p-2.5 rounded-lg bg-surface-container-low dark:bg-[#161F30] border border-outline-variant/40 text-on-surface focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-on-surface block mb-1">
                    Cyber Portal Docket / Acknowledgement
                  </label>
                  <input
                    type="text"
                    value={draft.cyberDetails?.reportingAuthority || ''}
                    onChange={(e) => handleCyberDetailsChange('reportingAuthority', e.target.value)}
                    placeholder="e.g. 1930 / cybercrime.gov.in Acknowledgement #1930-2026-44812"
                    className="w-full text-xs p-2.5 rounded-lg bg-surface-container-low dark:bg-[#161F30] border border-outline-variant/40 text-on-surface focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {domain === 'consumer' && (
            <div className="space-y-3">
              <h4 className="font-bold text-primary dark:text-primary-fixed uppercase tracking-wider text-[11px]">
                Consumer Transaction &amp; Product Details (CPA 2019)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-on-surface block mb-1">
                    Seller / Merchant Name
                  </label>
                  <input
                    type="text"
                    value={draft.consumerDetails?.sellerName || ''}
                    onChange={(e) => handleConsumerDetailsChange('sellerName', e.target.value)}
                    placeholder="e.g. CloudMart Retail Private Limited"
                    className="w-full text-xs p-2.5 rounded-lg bg-surface-container-low dark:bg-[#161F30] border border-outline-variant/40 text-on-surface focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-on-surface block mb-1">
                    Order / Invoice Reference
                  </label>
                  <input
                    type="text"
                    value={draft.consumerDetails?.orderReference || ''}
                    onChange={(e) => handleConsumerDetailsChange('orderReference', e.target.value)}
                    placeholder="e.g. ORD-IN-2026-884129"
                    className="w-full text-xs p-2.5 rounded-lg bg-surface-container-low dark:bg-[#161F30] border border-outline-variant/40 text-on-surface focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-on-surface block mb-1">
                    Purchase Date
                  </label>
                  <input
                    type="text"
                    value={draft.consumerDetails?.purchaseDate || ''}
                    onChange={(e) => handleConsumerDetailsChange('purchaseDate', e.target.value)}
                    placeholder="e.g. 15th January 2026"
                    className="w-full text-xs p-2.5 rounded-lg bg-surface-container-low dark:bg-[#161F30] border border-outline-variant/40 text-on-surface focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-[11px] font-bold text-on-surface block mb-1">
                  Nature of Defect / Non-Conformity
                </label>
                <textarea
                  rows={2}
                  value={draft.consumerDetails?.defectSummary || ''}
                  onChange={(e) => handleConsumerDetailsChange('defectSummary', e.target.value)}
                  placeholder="Detail the defect or deficiency in service..."
                  className="w-full text-xs p-2.5 rounded-lg bg-surface-container-low dark:bg-[#161F30] border border-outline-variant/40 text-on-surface focus:outline-none"
                />
              </div>
            </div>
          )}

          {domain === 'tenancy' && (
            <div className="space-y-3">
              <h4 className="font-bold text-primary dark:text-primary-fixed uppercase tracking-wider text-[11px]">
                Tenancy &amp; Deposit Specifics (Model Tenancy Act)
              </h4>
              <p className="text-xs text-slate-500">
                Covers lease covenants, key surrender dates, deposit refund deadlines, and itemized deduction disputes under Section 11 of the Model Tenancy Act.
              </p>
            </div>
          )}
        </div>
      )}

      {/* FACTS TAB */}
      {activeTab === 'facts' && (
        <div className="space-y-4 text-xs">
          <div>
            <label className="text-[11px] font-bold text-on-surface block mb-1">
              Summary of Material Facts (Chronological Statement) *
            </label>
            <textarea
              rows={4}
              value={draft.factsSummary}
              onChange={(e) => handleChange('factsSummary', e.target.value)}
              placeholder="State the core chronology and facts of dispute..."
              className="w-full text-xs p-3 rounded-lg bg-surface-container-low dark:bg-[#161F30] border border-outline-variant/40 text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary leading-relaxed"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-on-surface block mb-1">
              Statutory Basis &amp; Violations Cited *
            </label>
            <input
              type="text"
              value={draft.statutoryBasis}
              onChange={(e) => handleChange('statutoryBasis', e.target.value)}
              placeholder="e.g. Section 18 Real Estate (Regulation and Development) Act, 2016"
              className="w-full text-xs p-2.5 rounded-lg bg-surface-container-low dark:bg-[#161F30] border border-outline-variant/40 text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary"
            />
          </div>
        </div>
      )}

      {/* DEMANDS TAB */}
      {activeTab === 'demands' && (
        <div className="space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-primary dark:text-primary-fixed uppercase tracking-wider text-[11px]">
              Specific Formal Demands / Requisitions ({draft.demands.length})
            </h4>
            <button
              onClick={handleAddDemand}
              className="px-2.5 py-1 rounded bg-secondary/15 hover:bg-secondary/25 text-secondary dark:text-secondary-fixed text-xs font-bold transition-colors flex items-center gap-1"
              type="button"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              <span>Add Demand</span>
            </button>
          </div>

          <div className="space-y-2">
            {draft.demands.map((demand, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="font-bold text-on-surface-variant w-5 text-right shrink-0">
                  {idx + 1}.
                </span>
                <input
                  type="text"
                  value={demand}
                  onChange={(e) => handleDemandChange(idx, e.target.value)}
                  placeholder={`Demand item ${idx + 1}...`}
                  className="flex-1 text-xs p-2.5 rounded-lg bg-surface-container-low dark:bg-[#161F30] border border-outline-variant/40 text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary"
                />
                <button
                  onClick={() => handleRemoveDemand(idx)}
                  className="p-1.5 text-on-surface-variant hover:text-error transition-colors rounded hover:bg-surface-container"
                  title="Remove demand"
                  type="button"
                >
                  <span className="material-symbols-outlined text-base">delete</span>
                </button>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-outline-variant/20">
            <label className="text-[11px] font-bold text-on-surface block mb-1">
              Statutory Cure / Compliance Notice Period (Days) *
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={7}
                max={90}
                value={draft.curePeriodDays}
                onChange={(e) => handleChange('curePeriodDays', parseInt(e.target.value) || 15)}
                className="w-24 text-xs p-2.5 rounded-lg bg-surface-container-low dark:bg-[#161F30] border border-outline-variant/40 text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary font-mono"
              />
              <span className="text-on-surface-variant">days from receipt of legal notice</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
