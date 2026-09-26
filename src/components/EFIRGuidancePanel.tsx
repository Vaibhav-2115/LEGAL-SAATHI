'use client';

import React, { useState } from 'react';
import { LegalCase, EFIRDraft } from '../lib/types';
import { useLegalSaathi } from '../context/LegalSaathiContext';

interface EFIRGuidancePanelProps {
  currentCase: LegalCase;
}

export const EFIRGuidancePanel: React.FC<EFIRGuidancePanelProps> = ({ currentCase }) => {
  const { efirDrafts, saveEFIRDraft } = useLegalSaathi();
  const [currentStep, setCurrentStep] = useState<number>(1);

  const [draft, setDraft] = useState<EFIRDraft>(() => {
    if (efirDrafts[currentCase.id]) {
      return efirDrafts[currentCase.id];
    }
    return {
      complainantName: 'Aggrieved Citizen',
      contactNumber: '+91 98765 43210',
      incidentType:
        currentCase.category.includes('Cyber')
          ? 'Cyber Financial Fraud / Unauthorized Transaction'
          : currentCase.category.includes('Real Estate')
          ? 'Cheating & Criminal Breach of Trust (Section 318 BNS 2023)'
          : 'Dishonest Misappropriation of Movable Property & Refusal to Restitute',
      incidentDateTime: `${currentCase.createdAt} approximately 11:30 AM`,
      locationDetails: currentCase.jurisdiction || 'Saket, South Delhi District',
      suspectDetails: 'Opposite Party / Entity named in case file',
      incidentNarrative: currentCase.citizenStatement,
      evidenceItems: currentCase.evidenceList.map((e) => e.name),
      policeStationJurisdiction: 'Local Police Station having territorial jurisdiction'
    };
  });

  const [copied, setCopied] = useState(false);

  const handleUpdate = <K extends keyof EFIRDraft>(field: K, val: EFIRDraft[K]) => {
    setDraft((prev) => ({ ...prev, [field]: val }));
  };

  const handleSave = () => {
    saveEFIRDraft(currentCase.id, draft);
    alert('e-FIR Reporting dossier saved to case records!');
  };

  const handleCopyFormattedComplaint = () => {
    const text = `
FORMAL WRITTEN INFORMATION / COMPLAINT DISCLOSING COGNIZABLE OFFENCE
(PREPARED UNDER SECTION 173 BNS 2023 / SECTION 154 CrPC)
======================================================================
To,
The Station House Officer (SHO) / Cyber Crime Cell,
${draft.policeStationJurisdiction},
${draft.locationDetails}

1. Complainant Name: ${draft.complainantName}
   Contact Number: ${draft.contactNumber}

2. Nature of Offence: ${draft.incidentType}
   Applicable Provisions: Bharatiya Nyaya Sanhita, 2023 (Section 318) / Information Technology Act, 2000

3. Date, Time & Place of Occurrence:
   Date & Time: ${draft.incidentDateTime}
   Location: ${draft.locationDetails}

4. Accused / Suspect Particulars:
   ${draft.suspectDetails}

5. Chronological Narrative of Incident:
${draft.incidentNarrative}

6. List of Documentary Evidence Attached:
${draft.evidenceItems.map((e, i) => `   [${i + 1}] ${e}`).join('\n')}

7. Statutory Reference for Mandatory Registration:
   As held by the Constitution Bench of the Supreme Court of India in Lalita Kumari vs. Govt. of U.P. (2014) 2 SCC 1,
   registration of an FIR is mandatory if information discloses commission of a cognizable offence.

Respectfully submitted,
Complainant Signature: __________________
Date: ${new Date().toLocaleDateString('en-IN')}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const STEPS = [
    { num: 1, title: 'Understand Incident', desc: 'Offence categorization' },
    { num: 2, title: 'Collect Details', desc: 'Date, time & location' },
    { num: 3, title: 'Narrative & Evidence', desc: 'Fact grounding' },
    { num: 4, title: 'Review Dossier', desc: 'Pre-filing check' },
    { num: 5, title: 'Official Filing', desc: 'Portal & station steps' }
  ];

  return (
    <div className="w-full bg-surface-container-lowest dark:bg-[#0F131C] rounded-2xl p-5 sm:p-6 shadow-sm border border-outline-variant/30 flex flex-col gap-6">
      {/* Top Header */}
      <div className="border-b border-outline-variant/30 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider font-mono bg-red-100 dark:bg-red-950/60 px-2 py-0.5 rounded">
              POLICE REPORTING & e-FIR GUIDANCE
            </span>
            <h3 className="font-heading text-xl font-extrabold text-on-surface mt-0.5">
              e-FIR Assistance & Incident Preparation
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              className="px-3 py-1.5 rounded-lg bg-surface-container-low dark:bg-[#161F30] hover:bg-surface-container-high text-xs font-semibold text-on-surface border border-outline-variant/40 transition-colors flex items-center gap-1"
              type="button"
            >
              <span className="material-symbols-outlined text-sm">save</span>
              <span>Save Progress</span>
            </button>

            <span className="text-xs font-mono font-bold bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-fixed px-2.5 py-1 rounded-lg">
              Step {currentStep} of 5
            </span>
          </div>
        </div>

        {/* Stepper Indicator */}
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
                    ? 'border-red-500 bg-red-50/60 dark:bg-red-950/20 shadow-sm'
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
                        ? 'bg-red-600 text-white'
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

      {/* Critical Legal Safety Notice: Guidance vs Official Filing */}
      <div className="bg-red-50 dark:bg-red-950/40 border-l-4 border-red-600 rounded-xl p-4 text-xs text-red-900 dark:text-red-200 leading-relaxed flex items-start gap-3">
        <span className="material-symbols-outlined text-red-600 text-xl shrink-0 mt-0.5">warning</span>
        <div>
          <strong className="font-bold uppercase tracking-wider block mb-0.5">
            CRITICAL CIVIC NOTICE: GUIDANCE ONLY • NOT AN OFFICIAL POLICE FILING PORTAL
          </strong>
          Legal Saathi is an automated civic preparation tool designed to help citizens organize their statements,
          chronology, and evidence for police interaction. <strong>Legal Saathi does NOT file FIRs with police databases.</strong>{' '}
          An FIR or e-FIR must be lodged by you directly via your State Police portal (e.g. Delhi Police e-FIR, Tamil Nadu Police e-Services)
          or the National Cyber Crime Reporting Portal (<strong>cybercrime.gov.in / Helpline 1930</strong>).
        </div>
      </div>

      {/* Step Views */}
      <div className="min-h-[300px]">
        {/* STEP 1: Understand Incident */}
        {currentStep === 1 && (
          <div className="space-y-4 text-xs">
            <h4 className="font-heading text-sm font-bold text-on-surface">
              Step 1: Understand the Legal Nature of the Incident
            </h4>
            <p className="text-on-surface-variant leading-relaxed">
              In Indian criminal law, offences are categorized into <strong>Cognizable</strong> (where police can investigate and register FIR directly)
              and <strong>Non-Cognizable</strong> (where complaint is recorded in Non-Cognizable Report/NCR and requires Magistrate permission).
              Most e-FIR systems cater to vehicle theft, lost property, online financial fraud, and cyber harassment.
            </p>

            <div className="bg-surface-container-low dark:bg-[#161F30] p-4 rounded-xl space-y-3">
              <label className="font-bold text-on-surface block">
                Primary Category of Offence / Incident:
              </label>
              <input
                type="text"
                value={draft.incidentType}
                onChange={(e) => handleUpdate('incidentType', e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg bg-surface-container-lowest dark:bg-[#0F131C] border border-outline-variant/40 text-on-surface"
              />

              <div className="p-3 bg-surface-container-lowest dark:bg-[#090D16] rounded-lg border border-outline-variant/30 text-[11px] space-y-1">
                <span className="font-bold text-secondary block">Constitutional Protection:</span>
                <p className="text-on-surface-variant">
                  Under <em>Lalita Kumari vs. Govt of U.P. (2014) 2 SCC 1</em>, registration of an FIR is mandatory for the police
                  if the complaint discloses commission of a cognizable offence.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Collect Details */}
        {currentStep === 2 && (
          <div className="space-y-4 text-xs">
            <h4 className="font-heading text-sm font-bold text-on-surface">
              Step 2: Time, Location, and Parties Involved
            </h4>
            <p className="text-on-surface-variant leading-relaxed">
              Police officers require exact timeframes, geographical location, and known details of the opposite party or suspects.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-on-surface block mb-1">
                  Complainant Legal Name *
                </label>
                <input
                  type="text"
                  value={draft.complainantName}
                  onChange={(e) => handleUpdate('complainantName', e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg bg-surface-container-low dark:bg-[#161F30] border border-outline-variant/40 text-on-surface"
                />
              </div>

              <div>
                <label className="font-bold text-on-surface block mb-1">
                  Contact Mobile Number (Linked to Aadhaar) *
                </label>
                <input
                  type="text"
                  value={draft.contactNumber}
                  onChange={(e) => handleUpdate('contactNumber', e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg bg-surface-container-low dark:bg-[#161F30] border border-outline-variant/40 text-on-surface"
                />
              </div>

              <div>
                <label className="font-bold text-on-surface block mb-1">
                  Date & Approximate Time of Occurrence *
                </label>
                <input
                  type="text"
                  value={draft.incidentDateTime}
                  onChange={(e) => handleUpdate('incidentDateTime', e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg bg-surface-container-low dark:bg-[#161F30] border border-outline-variant/40 text-on-surface"
                />
              </div>

              <div>
                <label className="font-bold text-on-surface block mb-1">
                  Exact Location / Jurisdiction *
                </label>
                <input
                  type="text"
                  value={draft.locationDetails}
                  onChange={(e) => handleUpdate('locationDetails', e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg bg-surface-container-low dark:bg-[#161F30] border border-outline-variant/40 text-on-surface"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-on-surface block mb-1">
                  Suspect / Opposite Party Known Particulars (Name, Phone, Firm) *
                </label>
                <input
                  type="text"
                  value={draft.suspectDetails || ''}
                  onChange={(e) => handleUpdate('suspectDetails', e.target.value)}
                  placeholder="e.g. Ramesh Chandra, Owner of Flat 402, Saket"
                  className="w-full text-xs p-2.5 rounded-lg bg-surface-container-low dark:bg-[#161F30] border border-outline-variant/40 text-on-surface"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Narrative & Evidence */}
        {currentStep === 3 && (
          <div className="space-y-4 text-xs">
            <h4 className="font-heading text-sm font-bold text-on-surface">
              Step 3: Narrative Description & Supporting Documentary Evidence
            </h4>
            <p className="text-on-surface-variant leading-relaxed">
              A precise chronological narrative detailing how the offence occurred without emotional speculation.
            </p>

            <div className="space-y-3">
              <div>
                <label className="font-bold text-on-surface block mb-1">
                  Detailed Chronological Incident Narrative *
                </label>
                <textarea
                  rows={5}
                  value={draft.incidentNarrative}
                  onChange={(e) => handleUpdate('incidentNarrative', e.target.value)}
                  className="w-full text-xs p-3 rounded-lg bg-surface-container-low dark:bg-[#161F30] border border-outline-variant/40 text-on-surface font-mono"
                />
              </div>

              <div className="bg-surface-container-low dark:bg-[#161F30] p-4 rounded-xl space-y-2">
                <span className="font-bold text-on-surface block text-[11px] uppercase tracking-wider">
                  Documentary Evidence Accompanying Representation:
                </span>
                <ul className="space-y-1 pl-4 list-disc text-on-surface-variant text-[11px]">
                  {draft.evidenceItems.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Review */}
        {currentStep === 4 && (
          <div className="space-y-4 text-xs">
            <h4 className="font-heading text-sm font-bold text-on-surface">
              Step 4: Review Incident Information Brief
            </h4>

            <div className="bg-white dark:bg-[#090D16] p-6 rounded-xl border border-outline-variant/40 font-mono text-xs leading-relaxed space-y-3 shadow-inner">
              <div className="text-center font-bold border-b pb-2 text-red-700 dark:text-red-400">
                INFORMATION DISCLOSING OFFENCE — DRAFT REPRESENTATION
              </div>
              <p>
                <strong>Complainant:</strong> {draft.complainantName} (Tel: {draft.contactNumber})<br />
                <strong>Jurisdiction:</strong> {draft.locationDetails} ({draft.policeStationJurisdiction})<br />
                <strong>Occurrence Date & Time:</strong> {draft.incidentDateTime}
              </p>
              <p>
                <strong>Offence Characterization:</strong> {draft.incidentType}
              </p>
              <p>
                <strong>Suspect Entity:</strong> {draft.suspectDetails}
              </p>
              <div>
                <strong>Narrative Summary:</strong>
                <p className="p-2 bg-slate-50 dark:bg-[#0F131C] rounded mt-1 whitespace-pre-line">
                  {draft.incidentNarrative}
                </p>
              </div>
              <div>
                <strong>Evidence Records:</strong>
                <ul className="list-disc pl-5 mt-1">
                  {draft.evidenceItems.map((e, i) => (
                    <li key={i}>{e}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Official Process */}
        {currentStep === 5 && (
          <div className="space-y-4 text-xs">
            <h4 className="font-heading text-sm font-bold text-on-surface">
              Step 5: Continue to Official Government Police Channels
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Portal 1: Cybercrime */}
              <div className="bg-surface-container-low dark:bg-[#161F30] p-5 rounded-xl border border-outline-variant/30 flex flex-col justify-between gap-3">
                <div>
                  <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-[10px] font-bold uppercase">
                    National Cyber Portal • 1930
                  </span>
                  <h5 className="font-heading text-sm font-bold text-on-surface mt-2">
                    National Cyber Crime Reporting Portal
                  </h5>
                  <p className="text-on-surface-variant text-[11px] mt-1 leading-relaxed">
                    If your dispute involves unauthorized online bank debits, fraudulent UPI links, phishing, or identity theft, report immediately.
                  </p>
                </div>

                <div className="space-y-2">
                  <a
                    href="https://cybercrime.gov.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 rounded-lg bg-primary hover:bg-secondary text-white font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>Open cybercrime.gov.in</span>
                    <span className="material-symbols-outlined text-sm">open_in_new</span>
                  </a>
                  <a
                    href="tel:1930"
                    className="w-full py-2 rounded-lg bg-surface-container-lowest dark:bg-[#0F131C] hover:bg-surface-container-high border border-outline-variant/40 text-on-surface font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm text-emerald-600">call</span>
                    <span>Dial Cyber Helpline: 1930</span>
                  </a>
                </div>
              </div>

              {/* Portal 2: State Police e-FIR */}
              <div className="bg-surface-container-low dark:bg-[#161F30] p-5 rounded-xl border border-outline-variant/30 flex flex-col justify-between gap-3">
                <div>
                  <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 text-[10px] font-bold uppercase">
                    State Police • Physical / Online
                  </span>
                  <h5 className="font-heading text-sm font-bold text-on-surface mt-2">
                    State Police e-FIR / Police Station Lodgement
                  </h5>
                  <p className="text-on-surface-variant text-[11px] mt-1 leading-relaxed">
                    For property disputes, vehicle theft, and physical offences, download this formatted representation and submit at your local police station or state portal.
                  </p>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={handleCopyFormattedComplaint}
                    className="w-full py-2 rounded-lg bg-secondary hover:bg-primary text-white font-bold flex items-center justify-center gap-1.5 transition-colors"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-sm">content_copy</span>
                    <span>{copied ? 'Dossier Copied!' : 'Copy Formatted Representation'}</span>
                  </button>

                  <button
                    onClick={() => window.print()}
                    className="w-full py-2 rounded-lg bg-surface-container-lowest dark:bg-[#0F131C] hover:bg-surface-container-high border border-outline-variant/40 text-on-surface font-semibold flex items-center justify-center gap-1.5 transition-colors"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-sm">print</span>
                    <span>Print Representation for Police</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
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
            <span>Dossier Complete</span>
          </button>
        )}
      </div>
    </div>
  );
};
