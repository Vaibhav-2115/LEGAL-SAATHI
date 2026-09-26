'use client';

import React, { useState } from 'react';
import { LegalCase, RTIDraft } from '../lib/types';
import { useLegalSaathi } from '../context/LegalSaathiContext';

interface RTIStepperProps {
  currentCase: LegalCase;
}

export const RTIStepper: React.FC<RTIStepperProps> = ({ currentCase }) => {
  const { rtiDrafts, saveRTIDraft } = useLegalSaathi();
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Initialize draft from existing saved or defaults grounded in active case
  const [draft, setDraft] = useState<RTIDraft>(() => {
    if (rtiDrafts[currentCase.id]) {
      return rtiDrafts[currentCase.id];
    }
    return {
      authorityName:
        currentCase.category.includes('Real Estate')
          ? 'Town & Country Planning Department / Municipal Corporation'
          : currentCase.category.includes('Tenancy')
          ? 'Rent Authority / Sub-Divisional Magistrate (South Delhi)'
          : 'Central Consumer Protection Authority / District Consumer Disputes Commission',
      department:
        currentCase.category.includes('Real Estate')
          ? 'Building Sanctions & Fire NOC Wing'
          : 'Revenue & Tenancy Records Branch',
      pioDesignation: 'Central / State Public Information Officer (CPIO / SPIO)',
      pioAddress: 'Office of the Public Information Officer, District Administrative Complex, New Delhi - 110001',
      subject: `Seeking Certified Information under Section 6(1) of the RTI Act, 2005 concerning Docket #${currentCase.id}`,
      informationRequested: [
        'Certified copy of the building sanction plan and completion certificate status for project/premises.',
        'Inspection reports, fire safety clearance, and occupancy approvals issued till date.',
        'Action-taken report on previous public grievances submitted regarding delayed handover.'
      ],
      timePeriod: 'From 01-01-2022 to present date',
      isBPL: false,
      applicationFeePaid: true
    };
  });

  const [copied, setCopied] = useState(false);

  const handleUpdate = <K extends keyof RTIDraft>(field: K, value: RTIDraft[K]) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  const handleQueryChange = (idx: number, text: string) => {
    const updated = [...draft.informationRequested];
    updated[idx] = text;
    handleUpdate('informationRequested', updated);
  };

  const handleAddQuery = () => {
    handleUpdate('informationRequested', [...draft.informationRequested, '']);
  };

  const handleRemoveQuery = (idx: number) => {
    handleUpdate('informationRequested', draft.informationRequested.filter((_, i) => i !== idx));
  };

  const handleSave = () => {
    saveRTIDraft(currentCase.id, draft);
    alert('RTI Draft saved successfully to your case record!');
  };

  const handleCopyFormattedText = () => {
    const text = `
APPLICATION UNDER SECTION 6(1) OF THE RIGHT TO INFORMATION ACT, 2005

To,
The ${draft.pioDesignation},
${draft.authorityName},
${draft.department},
${draft.pioAddress}

1. Full Name of Applicant: [Aggrieved Citizen]
2. Subject: ${draft.subject}
3. Period to which information relates: ${draft.timePeriod}
4. Particulars of Information Required:
${draft.informationRequested.map((q, i) => `   (${i + 1}) ${q}`).join('\n')}

5. Application Fee: ₹10 paid via ${draft.isBPL ? 'BPL Exemption (Certificate attached)' : 'Online Payment / IPO #RTI-2026-8819'}
6. Applicable Act: Section 6(1) of RTI Act, 2005 (Mandatory 30-day response under Section 7(1))

Applicant Signature: __________________
Date: ${new Date().toLocaleDateString('en-IN')}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const STEPS = [
    { num: 1, title: 'Understand Request', desc: 'Scope of information' },
    { num: 2, title: 'Identify Authority', desc: 'CPIO & Department' },
    { num: 3, title: 'Draft Queries', desc: 'Specific records sought' },
    { num: 4, title: 'Review Application', desc: 'Section 6(1) compliance' },
    { num: 5, title: 'Export & File', desc: 'Official portal instructions' }
  ];

  return (
    <div className="w-full bg-surface-container-lowest dark:bg-[#0F131C] rounded-2xl p-5 sm:p-6 shadow-sm border border-outline-variant/30 flex flex-col gap-6">
      {/* Stepper Header Bar */}
      <div className="border-b border-outline-variant/30 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <span className="text-[10px] font-bold text-secondary uppercase tracking-wider font-mono">
              RIGHT TO INFORMATION ACT, 2005
            </span>
            <h3 className="font-heading text-xl font-extrabold text-on-surface">
              RTI Application Assistant
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              className="px-3 py-1.5 rounded-lg bg-surface-container-low dark:bg-[#161F30] hover:bg-surface-container-high text-xs font-semibold text-on-surface border border-outline-variant/40 transition-colors flex items-center gap-1"
              type="button"
            >
              <span className="material-symbols-outlined text-sm">save</span>
              <span>Save Draft</span>
            </button>

            <span className="text-xs font-mono font-bold bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-fixed px-2.5 py-1 rounded-lg">
              Step {currentStep} of 5
            </span>
          </div>
        </div>

        {/* Stepper Progress Indicator */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {STEPS.map((s) => {
            const isCompleted = currentStep > s.num;
            const isCurrent = currentStep === s.num;
            return (
              <button
                key={s.num}
                onClick={() => setCurrentStep(s.num)}
                className={`flex flex-col p-2.5 rounded-xl border text-left transition-all ${
                  isCurrent
                    ? 'border-secondary bg-secondary/10 dark:bg-secondary/20 shadow-sm'
                    : isCompleted
                    ? 'border-emerald-500/40 bg-emerald-50/50 dark:bg-emerald-950/20'
                    : 'border-outline-variant/30 bg-surface-container-low/50 dark:bg-[#161F30]/40 opacity-70'
                }`}
                type="button"
              >
                <div className="flex items-center gap-1.5">
                  <div
                    className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${
                      isCurrent
                        ? 'bg-secondary text-white'
                        : isCompleted
                        ? 'bg-emerald-600 text-white'
                        : 'bg-outline-variant/50 text-on-surface'
                    }`}
                  >
                    {isCompleted ? '✓' : s.num}
                  </div>
                  <span className="text-xs font-bold text-on-surface truncate">{s.title}</span>
                </div>
                <span className="text-[10px] text-on-surface-variant mt-0.5 hidden sm:block truncate">
                  {s.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Official Submission Safety Notice */}
      <div className="bg-blue-50 dark:bg-blue-950/40 border-l-4 border-blue-600 rounded-xl p-3.5 text-xs text-blue-900 dark:text-blue-200 leading-relaxed flex items-start gap-2.5">
        <span className="material-symbols-outlined text-blue-600 text-lg shrink-0 mt-0.5">info</span>
        <div>
          <strong>IMPORTANT DISCLOSURE:</strong> Legal Saathi assists you in drafting a structured,
          compliant RTI request under Section 6(1) of the RTI Act, 2005. Legal Saathi does NOT automatically
          submit the RTI to government portals. You can download or copy your draft and file it directly
          on the official portal <strong>rtionline.gov.in</strong> or dispatch it via Registered Post with a ₹10 IPO.
        </div>
      </div>

      {/* Step Content */}
      <div className="min-h-[300px]">
        {/* STEP 1: Understand Request */}
        {currentStep === 1 && (
          <div className="space-y-4 text-xs">
            <h4 className="font-heading text-sm font-bold text-on-surface">
              Step 1: Understand What Government Information Can Be Requested
            </h4>
            <p className="text-on-surface-variant leading-relaxed">
              Under the RTI Act, 2005, public authorities are legally mandated to furnish certified copies
              of public records, file notings, inspection logs, sanction orders, and correspondence within 30 days.
              You do not need to state why you need the information.
            </p>

            <div className="bg-surface-container-low dark:bg-[#161F30] p-4 rounded-xl space-y-3">
              <label className="font-bold text-on-surface block">
                Select or Refine the Primary Subject of Information:
              </label>
              <input
                type="text"
                value={draft.subject}
                onChange={(e) => handleUpdate('subject', e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg bg-surface-container-lowest dark:bg-[#0F131C] border border-outline-variant/40 text-on-surface"
              />

              <label className="font-bold text-on-surface block pt-2">
                Time Period to Which Information Relates:
              </label>
              <input
                type="text"
                value={draft.timePeriod}
                onChange={(e) => handleUpdate('timePeriod', e.target.value)}
                placeholder="e.g. 01-01-2023 to 31-12-2025"
                className="w-full text-xs p-2.5 rounded-lg bg-surface-container-lowest dark:bg-[#0F131C] border border-outline-variant/40 text-on-surface"
              />
            </div>
          </div>
        )}

        {/* STEP 2: Identify Authority */}
        {currentStep === 2 && (
          <div className="space-y-4 text-xs">
            <h4 className="font-heading text-sm font-bold text-on-surface">
              Step 2: Identify the Public Authority & PIO
            </h4>
            <p className="text-on-surface-variant leading-relaxed">
              Every ministry, municipal body, development authority, and public sector bank has a designated
              Public Information Officer (PIO). Enter the appropriate body governing your dispute.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-on-surface block mb-1">
                  Public Authority Name *
                </label>
                <input
                  type="text"
                  value={draft.authorityName}
                  onChange={(e) => handleUpdate('authorityName', e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg bg-surface-container-low dark:bg-[#161F30] border border-outline-variant/40 text-on-surface"
                />
              </div>

              <div>
                <label className="font-bold text-on-surface block mb-1">
                  Specific Wing / Department *
                </label>
                <input
                  type="text"
                  value={draft.department}
                  onChange={(e) => handleUpdate('department', e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg bg-surface-container-low dark:bg-[#161F30] border border-outline-variant/40 text-on-surface"
                />
              </div>

              <div>
                <label className="font-bold text-on-surface block mb-1">
                  PIO Designation *
                </label>
                <input
                  type="text"
                  value={draft.pioDesignation}
                  onChange={(e) => handleUpdate('pioDesignation', e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg bg-surface-container-low dark:bg-[#161F30] border border-outline-variant/40 text-on-surface"
                />
              </div>

              <div>
                <label className="font-bold text-on-surface block mb-1">
                  Postal Address of PIO Office *
                </label>
                <input
                  type="text"
                  value={draft.pioAddress}
                  onChange={(e) => handleUpdate('pioAddress', e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg bg-surface-container-low dark:bg-[#161F30] border border-outline-variant/40 text-on-surface"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Draft RTI Queries */}
        {currentStep === 3 && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-heading text-sm font-bold text-on-surface">
                  Step 3: Draft Specific, Clear Information Requisitions
                </h4>
                <p className="text-on-surface-variant text-[11px]">
                  RTI queries should ask for existing certified documents or specific factual records, not hypothetical advice.
                </p>
              </div>

              <button
                onClick={handleAddQuery}
                className="px-3 py-1.5 rounded-lg bg-primary hover:bg-secondary text-white text-xs font-bold flex items-center gap-1 shadow-sm"
                type="button"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                <span>Add Question</span>
              </button>
            </div>

            <div className="space-y-3">
              {draft.informationRequested.map((query, index) => (
                <div key={index} className="flex items-start gap-2 bg-surface-container-low dark:bg-[#161F30]/80 p-3 rounded-xl border border-outline-variant/30">
                  <span className="font-bold font-mono text-primary dark:text-primary-fixed mt-2 w-6 shrink-0 text-center">
                    Q{index + 1}.
                  </span>
                  <textarea
                    rows={2}
                    value={query}
                    onChange={(e) => handleQueryChange(index, e.target.value)}
                    placeholder="State specific certified document or record sought..."
                    className="flex-1 text-xs p-2 rounded-lg bg-surface-container-lowest dark:bg-[#0F131C] border border-outline-variant/40 text-on-surface"
                  />
                  {draft.informationRequested.length > 1 && (
                    <button
                      onClick={() => handleRemoveQuery(index)}
                      className="p-1.5 text-red-500 hover:text-red-700 mt-1"
                      title="Remove question"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-base">delete</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: Review */}
        {currentStep === 4 && (
          <div className="space-y-4 text-xs">
            <h4 className="font-heading text-sm font-bold text-on-surface">
              Step 4: Review Formatted RTI Application under Section 6(1)
            </h4>

            <div className="bg-white dark:bg-[#090D16] p-6 rounded-xl border border-outline-variant/40 font-mono text-xs leading-relaxed space-y-3 shadow-inner">
              <div className="text-center font-bold border-b pb-2">
                APPLICATION UNDER SECTION 6(1) OF THE RIGHT TO INFORMATION ACT, 2005
              </div>
              <p>
                <strong>To:</strong> The {draft.pioDesignation}<br />
                {draft.authorityName} ({draft.department})<br />
                {draft.pioAddress}
              </p>
              <p>
                <strong>Subject:</strong> {draft.subject}
              </p>
              <p>
                <strong>Relevant Period:</strong> {draft.timePeriod}
              </p>
              <div>
                <strong>Information Sought:</strong>
                <ol className="list-decimal pl-5 mt-1 space-y-1">
                  {draft.informationRequested.map((q, i) => (
                    <li key={i}>{q}</li>
                  ))}
                </ol>
              </div>
              <p className="pt-2 text-[11px] text-slate-500 border-t">
                Statutory Fee: ₹10 Indian Postal Order / Online Payment Gateway receipt attached.<br />
                Mandatory Timeline: Section 7(1) mandates response within 30 days of receipt.
              </p>
            </div>
          </div>
        )}

        {/* STEP 5: Export & File */}
        {currentStep === 5 && (
          <div className="space-y-4 text-xs">
            <h4 className="font-heading text-sm font-bold text-on-surface">
              Step 5: Export & Official Submission Guidance
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Option A: Online RTI */}
              <div className="bg-surface-container-low dark:bg-[#161F30] p-5 rounded-xl border border-secondary/30 flex flex-col justify-between gap-3">
                <div>
                  <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-[10px] font-bold uppercase">
                    Method 1 • Fastest
                  </span>
                  <h5 className="font-heading text-sm font-bold text-on-surface mt-2">
                    Submit via RTI Online Portal
                  </h5>
                  <p className="text-on-surface-variant text-[11px] mt-1 leading-relaxed">
                    Most Central Ministries, public banks, and Delhi departments accept instant online filing with a ₹10 UPI or card fee.
                  </p>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={handleCopyFormattedText}
                    className="w-full py-2 rounded-lg bg-secondary hover:bg-primary text-white font-bold flex items-center justify-center gap-1.5 transition-colors"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-sm">content_copy</span>
                    <span>{copied ? 'Copied to Clipboard!' : 'Copy Formatted Text for Portal'}</span>
                  </button>

                  <a
                    href="https://rtionline.gov.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 rounded-lg bg-surface-container-lowest dark:bg-[#0F131C] hover:bg-surface-container-high border border-outline-variant/40 text-on-surface font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>Open rtionline.gov.in</span>
                    <span className="material-symbols-outlined text-sm">open_in_new</span>
                  </a>
                </div>
              </div>

              {/* Option B: Physical Registered Post */}
              <div className="bg-surface-container-low dark:bg-[#161F30] p-5 rounded-xl border border-outline-variant/30 flex flex-col justify-between gap-3">
                <div>
                  <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 text-[10px] font-bold uppercase">
                    Method 2 • Universal
                  </span>
                  <h5 className="font-heading text-sm font-bold text-on-surface mt-2">
                    Print & Send via Registered Post AD
                  </h5>
                  <p className="text-on-surface-variant text-[11px] mt-1 leading-relaxed">
                    Print the application, purchase a ₹10 Indian Postal Order (IPO) payable to the Accounts Officer, and mail via Speed Post with Acknowledgment Due.
                  </p>
                </div>

                <button
                  onClick={() => window.print()}
                  className="w-full py-2 rounded-lg bg-primary hover:bg-secondary text-white font-bold flex items-center justify-center gap-1.5 transition-colors"
                  type="button"
                >
                  <span className="material-symbols-outlined text-sm">print</span>
                  <span>Print Application Form</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stepper Navigation Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-outline-variant/30">
        <button
          disabled={currentStep === 1}
          onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
          className="px-4 py-2 rounded-lg bg-surface-container-low dark:bg-[#161F30] text-on-surface text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
          type="button"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          <span>Previous Step</span>
        </button>

        {currentStep < 5 ? (
          <button
            onClick={() => setCurrentStep((prev) => Math.min(5, prev + 1))}
            className="px-5 py-2 rounded-lg bg-primary hover:bg-secondary text-white text-xs font-bold flex items-center gap-1 shadow-sm"
            type="button"
          >
            <span>Continue to Step {currentStep + 1}</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        ) : (
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 shadow-sm"
            type="button"
          >
            <span className="material-symbols-outlined text-sm">check_circle</span>
            <span>Complete RTI Application</span>
          </button>
        )}
      </div>
    </div>
  );
};
