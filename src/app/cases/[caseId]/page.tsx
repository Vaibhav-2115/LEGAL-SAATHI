'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useLegalSaathi } from '../../../context/LegalSaathiContext';
import { CaseStatusBadge } from '../../../components/CaseStatusBadge';
import { CaseJourney } from '../../../components/CaseJourney';
import { EvidenceStatus } from '../../../lib/types';

export default function CaseWorkspacePage() {
  const params = useParams();
  const caseId = (params?.caseId as string) || 'LS-2026-0042';
  const { cases } = useLegalSaathi();

  // Find matching case or default to primary mock case
  const currentCase = cases.find((c) => c.id === caseId) || cases[0];
  const [activeTab, setActiveTab] = useState<'facts' | 'evidence' | 'statute' | 'timeline'>('facts');

  const getEvidenceBadge = (status: EvidenceStatus) => {
    switch (status) {
      case 'VERIFIED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
            <span className="material-symbols-outlined text-xs">verified</span>
            Verified
          </span>
        );
      case 'REVIEW_NEEDED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-xs font-semibold">
            <span className="material-symbols-outlined text-xs">pending</span>
            Review Needed
          </span>
        );
      case 'MISSING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300 text-xs font-semibold">
            <span className="material-symbols-outlined text-xs">priority_high</span>
            Missing
          </span>
        );
    }
  };

  return (
    <div className="w-full min-h-screen bg-background text-on-surface pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
        {/* Navigation Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-on-surface-variant">
          <Link
            href="/complaints"
            className="inline-flex items-center gap-1.5 font-semibold text-primary dark:text-primary-fixed hover:text-secondary transition-colors"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            <span>Back to My Complaints</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-secondary" />
            <span>
              Active Case Workspace: <strong className="text-on-surface font-mono">{currentCase.id}</strong>
            </span>
          </div>
        </div>

        {/* Main Workspace Control Bar */}
        <div className="bg-surface-container-lowest dark:bg-[#0F131C] rounded-2xl p-5 sm:p-6 shadow-sm border border-outline-variant/30 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex flex-col gap-2 min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-primary dark:text-primary-fixed tracking-tight">
                {currentCase.title}
              </h1>
              <CaseStatusBadge status={currentCase.status} size="md" />
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-on-surface-variant">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm text-secondary">category</span>
                {currentCase.category}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm text-secondary">location_on</span>
                {currentCase.jurisdiction}
              </span>
              <span>•</span>
              <span className="font-mono bg-surface-container-low dark:bg-[#161F30] px-2 py-0.5 rounded">
                Claim: {currentCase.claimAmount || 'N/A'}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/chat"
              className="px-4 py-2.5 rounded-lg bg-primary hover:bg-secondary text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base">chat</span>
              <span>Consult Assistant</span>
            </Link>
            <Link
              href={`/cases/${currentCase.id}/export`}
              className="px-4 py-2.5 rounded-lg bg-surface-container-low dark:bg-[#161F30] hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-colors flex items-center gap-1.5 border border-outline-variant/30"
            >
              <span className="material-symbols-outlined text-base">inventory_2</span>
              <span>Export Dossier</span>
            </Link>
          </div>
        </div>

        {/* Phase 3 Case Intelligence Quick Nav */}
        <div className="flex flex-wrap items-center gap-2 p-2 rounded-xl bg-surface-container-low dark:bg-[#161F30]/60 border border-outline-variant/30 text-xs">
          <span className="font-bold uppercase tracking-wider text-[10px] text-on-surface-variant px-2">
            Intelligence:
          </span>
          <Link
            href={`/cases/${currentCase.id}/verification`}
            className="px-3 py-1.5 rounded-lg bg-surface-container-lowest dark:bg-[#0F131C] hover:border-primary text-xs font-semibold text-on-surface border border-outline-variant/30 flex items-center gap-1 transition-colors"
          >
            <span className="material-symbols-outlined text-sm text-primary">fact_check</span>
            <span>Verification Matrix</span>
          </Link>
          <Link
            href={`/cases/${currentCase.id}/explanation`}
            className="px-3 py-1.5 rounded-lg bg-surface-container-lowest dark:bg-[#0F131C] hover:border-secondary text-xs font-semibold text-on-surface border border-outline-variant/30 flex items-center gap-1 transition-colors"
          >
            <span className="material-symbols-outlined text-sm text-secondary">gavel</span>
            <span>Why Law Applies</span>
          </Link>
          <Link
            href={`/cases/${currentCase.id}/timeline`}
            className="px-3 py-1.5 rounded-lg bg-surface-container-lowest dark:bg-[#0F131C] hover:border-primary text-xs font-semibold text-on-surface border border-outline-variant/30 flex items-center gap-1 transition-colors"
          >
            <span className="material-symbols-outlined text-sm text-emerald-600">history</span>
            <span>Timeline</span>
          </Link>
          <Link
            href={`/cases/${currentCase.id}/missing-information`}
            className="px-3 py-1.5 rounded-lg bg-surface-container-lowest dark:bg-[#0F131C] hover:border-primary text-xs font-semibold text-on-surface border border-outline-variant/30 flex items-center gap-1 transition-colors"
          >
            <span className="material-symbols-outlined text-sm text-amber-600">help_outline</span>
            <span>Missing Info</span>
          </Link>
          <Link
            href={`/cases/${currentCase.id}/collective-action`}
            className="px-3 py-1.5 rounded-lg bg-surface-container-lowest dark:bg-[#0F131C] hover:border-primary text-xs font-semibold text-on-surface border border-outline-variant/30 dark:border-[#1E293B] flex items-center gap-1 transition-colors"
          >
            <span className="material-symbols-outlined text-sm text-indigo-600 dark:text-indigo-400">groups</span>
            <span>Collective Action</span>
          </Link>
        </div>

        {/* 6-Stage Case Journey */}
        <CaseJourney currentStage={currentCase.currentStage} />

        {/* NEXT STEP HIGHLIGHT CARD */}
        {currentCase.nextStep && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/30 border-l-4 border-amber-500 rounded-xl p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-xl">flag</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400">
                    Mandatory Next Action ({currentCase.nextStep.urgency} Priority)
                  </span>
                  {currentCase.nextStep.dueDate && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200 font-semibold">
                      {currentCase.nextStep.dueDate}
                    </span>
                  )}
                </div>
                <h3 className="font-heading text-sm font-bold text-on-surface mt-0.5">
                  {currentCase.nextStep.title}
                </h3>
                <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">
                  {currentCase.nextStep.description}
                </p>
              </div>
            </div>

            <Link
              href={currentCase.nextStep.actionUrl || '/chat'}
              className="px-5 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shrink-0 transition-colors shadow-sm flex items-center gap-1.5 self-end md:self-center"
            >
              <span>{currentCase.nextStep.actionText}</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
        )}

        {/* Workspace Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-outline-variant/30 pb-2 overflow-x-auto">
          {[
            { id: 'facts', label: 'Case Summary & Key Facts', icon: 'fact_check', count: currentCase.keyFacts.length },
            { id: 'evidence', label: 'Evidence Checklist', icon: 'verified', count: currentCase.evidenceList.length },
            { id: 'statute', label: 'Legal Sources Grounding', icon: 'gavel', count: currentCase.legalSources.length },
            { id: 'timeline', label: 'Procedural Timeline', icon: 'history', count: currentCase.timeline.length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'facts' | 'evidence' | 'statute' | 'timeline')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-primary-container text-white shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low dark:hover:bg-slate-800'
              }`}
            >
              <span className="material-symbols-outlined text-base">{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    activeTab === tab.id
                      ? 'bg-white/20 text-white'
                      : 'bg-surface-container-high text-on-surface-variant'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* TAB 1: SUMMARY & KEY FACTS */}
        {activeTab === 'facts' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Citizen's Narrative */}
            <div className="lg:col-span-6 bg-surface-container-lowest dark:bg-[#0F131C] rounded-2xl p-6 shadow-sm border border-outline-variant/30 flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-primary dark:text-primary-fixed flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base">person</span>
                  The Citizen&apos;s Account
                </span>
                <span className="text-[10px] text-on-surface-variant">Primary Narrative</span>
              </div>
              <p className="text-sm text-on-surface leading-relaxed italic bg-surface-container-low dark:bg-[#161F30]/60 p-4 rounded-xl border-l-4 border-secondary">
                &quot;{currentCase.citizenStatement}&quot;
              </p>
              <div className="text-xs text-on-surface-variant space-y-1">
                <div>
                  <strong className="text-on-surface">Complaint Summary:</strong> {currentCase.summary}
                </div>
                <div>
                  <strong className="text-on-surface">Registered On:</strong> {currentCase.createdAt}
                </div>
              </div>
            </div>

            {/* Structured Facts */}
            <div className="lg:col-span-6 bg-surface-container-lowest dark:bg-[#0F131C] rounded-2xl p-6 shadow-sm border border-outline-variant/30 flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-primary dark:text-primary-fixed flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base">rule</span>
                  Verified Fact Matrix ({currentCase.keyFacts.length})
                </span>
                <span className="text-[10px] text-emerald-600 font-semibold">High Evidentiary Reliability</span>
              </div>

              <div className="space-y-3">
                {currentCase.keyFacts.map((fact) => (
                  <div
                    key={fact.id}
                    className="p-3.5 rounded-xl bg-surface-container-low dark:bg-[#161F30]/80 border border-outline-variant/20 flex flex-col gap-1.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-secondary">{fact.category}</span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                        <span className="material-symbols-outlined text-xs">verified</span>
                        {fact.confidence} Confidence
                      </span>
                    </div>
                    <p className="text-xs text-on-surface leading-relaxed">{fact.statement}</p>
                    <span className="text-[10px] text-on-surface-variant">
                      Source: {fact.source.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: EVIDENCE CHECKLIST */}
        {activeTab === 'evidence' && (
          <div className="bg-surface-container-lowest dark:bg-[#0F131C] rounded-2xl p-6 shadow-sm border border-outline-variant/30 flex flex-col gap-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-outline-variant/30 pb-4">
              <div>
                <h2 className="font-heading text-lg font-bold text-on-surface">
                  Evidence Verification Checklist
                </h2>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Each piece of evidence confirms statutory eligibility and reinforces your legal claim against counter-assertions.
                </p>
              </div>
              <div className="text-right flex flex-col items-end">
                <span className="text-xs text-on-surface-variant">Evidence Collected:</span>
                <div className="text-base font-bold text-secondary">
                  {currentCase.collectedEvidenceCount} of {currentCase.totalEvidenceCount} Items
                </div>
                <Link
                  href={`/cases/${currentCase.id}/evidence`}
                  className="text-xs text-primary dark:text-primary-fixed font-bold hover:underline mt-1 inline-flex items-center gap-0.5"
                >
                  <span>Open Full Evidence Dossier</span>
                  <span className="material-symbols-outlined text-xs">arrow_forward</span>
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentCase.evidenceList.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-surface-container-low dark:bg-[#161F30]/80 border border-outline-variant/20 flex flex-col justify-between gap-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-secondary">
                        {item.category}
                      </span>
                      <h3 className="font-heading text-sm font-bold text-on-surface mt-0.5">
                        {item.name}
                      </h3>
                    </div>
                    {getEvidenceBadge(item.status)}
                  </div>

                  {item.notes && (
                    <p className="text-xs text-on-surface-variant bg-surface-container-lowest dark:bg-[#0F131C]/60 p-2.5 rounded-lg border border-outline-variant/20 leading-relaxed">
                      {item.notes}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-outline-variant/20 text-xs">
                    <span className="text-[10px] text-on-surface-variant">
                      {item.collectedAt ? `Uploaded on ${item.collectedAt}` : 'Pending citizen upload'}
                    </span>
                    <button
                      type="button"
                      onClick={() => alert(`Document review trigger for: ${item.name}`)}
                      className="text-xs text-primary dark:text-primary-fixed font-bold hover:underline"
                    >
                      {item.status === 'VERIFIED' ? 'View Document ↗' : 'Upload Evidence +'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: LEGAL SOURCES */}
        {activeTab === 'statute' && (
          <div className="bg-surface-container-lowest dark:bg-[#0F131C] rounded-2xl p-6 shadow-sm border border-outline-variant/30 flex flex-col gap-5">
            <div className="border-b border-outline-variant/30 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="font-heading text-lg font-bold text-on-surface">
                  Statutory Grounding & Precedents
                </h2>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Exact statutory sections, rules, and government notifications supporting your relief.
                </p>
              </div>
              <Link
                href="/sources"
                className="text-xs text-primary dark:text-primary-fixed font-bold hover:underline shrink-0 inline-flex items-center gap-1"
              >
                <span>Explore All Legal Sources</span>
                <span className="material-symbols-outlined text-xs">arrow_forward</span>
              </Link>
            </div>

            <div className="space-y-4">
              {currentCase.legalSources.map((source) => (
                <div
                  key={source.id}
                  className="p-5 rounded-xl bg-surface-container-low dark:bg-[#161F30]/80 border-l-4 border-primary dark:border-primary-fixed shadow-sm flex flex-col gap-2"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-heading text-sm font-bold text-primary dark:text-primary-fixed">
                      {source.title}
                    </span>
                    <span className="font-mono text-xs bg-primary-container text-white px-2.5 py-0.5 rounded-md font-semibold">
                      {source.section}
                    </span>
                  </div>

                  <div className="text-xs text-on-surface-variant font-medium">
                    <strong className="text-on-surface">Legal Relevance:</strong> {source.relevance}
                  </div>

                  <blockquote className="text-xs text-on-surface bg-surface-container-lowest dark:bg-[#0F131C]/80 p-3.5 rounded-lg border border-outline-variant/20 italic leading-relaxed">
                    &quot;{source.excerpt}&quot;
                  </blockquote>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: PROCEDURAL TIMELINE */}
        {activeTab === 'timeline' && (
          <div className="bg-surface-container-lowest dark:bg-[#0F131C] rounded-2xl p-6 shadow-sm border border-outline-variant/30 flex flex-col gap-5">
            <div className="border-b border-outline-variant/30 pb-3">
              <h2 className="font-heading text-lg font-bold text-on-surface">
                Dispute Chronology & Action Roadmap
              </h2>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Detailed timeline from incident origin to final tribunal or conciliation settlement.
              </p>
            </div>

            <div className="relative pl-6 space-y-6 border-l-2 border-outline-variant/40 ml-3">
              {currentCase.timeline.map((event) => (
                <div key={event.id} className="relative group">
                  <div
                    className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 ${
                      event.completed ? 'bg-emerald-600' : 'bg-primary-container'
                    }`}
                  />
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-secondary font-bold">
                        {event.date}
                      </span>
                      <span className="text-[10px] px-2 py-0.2 rounded bg-surface-container-low text-on-surface-variant uppercase font-semibold">
                        {event.stage}
                      </span>
                    </div>
                    <h3 className="font-heading text-sm font-bold text-on-surface">
                      {event.title}
                    </h3>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      {event.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
