'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useLegalSaathi } from '../../context/LegalSaathiContext';
import { CaseStatusBadge } from '../../components/CaseStatusBadge';
import { VoiceState } from '../../lib/types';

function ChatContent() {
  const { activeCase, chatMessages, addChatMessage, isAnalyzing } = useLegalSaathi();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q');

  const [inputText, setInputText] = useState('');
  const [voiceState, setVoiceState] = useState<VoiceState>('IDLE');
  const [attachedFile, setAttachedFile] = useState<string | null>(null);

  useEffect(() => {
    if (initialQuery && !inputText) {
      setInputText(initialQuery);
    }
  }, [initialQuery]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;
    addChatMessage(inputText.trim());
    setInputText('');
    setAttachedFile(null);
  };

  const handleVoiceToggle = () => {
    if (voiceState === 'IDLE') {
      setVoiceState('LISTENING');
      setTimeout(() => {
        setVoiceState('PROCESSING');
        setTimeout(() => {
          setVoiceState('TRANSCRIPT');
          setInputText('The landlord stated that painting charges of ₹30,000 would be deducted, but the lease states that normal wear and tear is exempt.');
        }, 1500);
      }, 2000);
    } else if (voiceState === 'TRANSCRIPT') {
      setVoiceState('CONFIRM');
    } else {
      setVoiceState('IDLE');
    }
  };

  const handleConfirmVoice = () => {
    handleSend();
    setVoiceState('IDLE');
  };

  return (
    <div className="w-full min-h-[calc(100vh-5rem)] bg-background text-on-surface flex flex-col">
      {/* Top Workspace Context Breadcrumb Bar */}
      <div className="w-full bg-surface-container-low dark:bg-[#0F131C] border-b border-outline-variant/30 px-4 sm:px-6 py-3">
        <div className="max-w-[1440px] mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-container text-white">
              <span className="material-symbols-outlined text-lg">gavel</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">
                  Active Consultation
                </span>
                <span className="text-outline-variant">/</span>
                <span className="text-xs text-primary dark:text-primary-fixed font-bold font-mono">
                  {activeCase?.id || 'LS-2026-0042'}
                </span>
                {activeCase && <CaseStatusBadge status={activeCase.status} size="sm" />}
              </div>
              <span className="text-sm font-bold text-on-surface truncate max-w-lg">
                {activeCase?.title} • {activeCase?.jurisdiction}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href={`/cases/${activeCase?.id || 'LS-2026-0042'}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-high dark:bg-[#161F30] hover:bg-surface-container-highest text-primary dark:text-primary-fixed text-xs font-semibold transition-colors"
            >
              <span className="material-symbols-outlined text-base">folder_open</span>
              <span>Case Dossier</span>
            </Link>
            <Link
              href="/complaints"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-high dark:bg-[#161F30] hover:bg-surface-container-highest text-on-surface text-xs font-semibold transition-colors"
            >
              <span className="material-symbols-outlined text-base">arrow_back</span>
              <span className="hidden sm:inline">My Complaints</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 3-ZONE CONSULTATION WORKSPACE */}
      <div className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 py-4 sm:py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT RAIL: Case Context (3 columns on Desktop) */}
        <aside className="hidden lg:flex flex-col gap-4 lg:col-span-3">
          <div className="bg-surface-container-lowest dark:bg-[#0F131C] rounded-xl p-5 shadow-sm border border-outline-variant/30 dark:border-[#1E293B] flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-outline-variant/30 dark:border-[#1E293B] pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base text-blue-600 dark:text-blue-400">inventory_2</span>
                Case Summary
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface-container-low dark:bg-[#161F30] text-on-surface-variant font-mono border border-transparent dark:border-[#1E293B]">
                {activeCase?.id}
              </span>
            </div>

            <div>
              <h3 className="font-heading text-sm font-bold text-slate-900 dark:text-white">
                {activeCase?.title}
              </h3>
              <p className="text-xs text-on-surface-variant mt-1 leading-relaxed line-clamp-3">
                {activeCase?.summary}
              </p>
            </div>

            {/* Evidence Quick Tracker */}
            <div className="p-3 rounded-lg bg-surface-container-low dark:bg-[#161F30] border border-transparent dark:border-[#1E293B] flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-900 dark:text-white">Evidence Collected</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">
                  {activeCase?.collectedEvidenceCount} of {activeCase?.totalEvidenceCount}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-[#0F131C] overflow-hidden border border-transparent dark:border-[#1E293B]">
                <div
                  className="h-full bg-blue-600 transition-all duration-500 rounded-full"
                  style={{
                    width: `${
                      ((activeCase?.collectedEvidenceCount || 1) / (activeCase?.totalEvidenceCount || 5)) * 100
                    }%`
                  }}
                />
              </div>
              <span className="text-[11px] text-on-surface-variant">
                Lease deed and bank transfer verified.
              </span>
            </div>

            {/* Key Facts list */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant mb-2 block">
                Recorded Facts ({activeCase?.keyFacts?.length || 0})
              </span>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {activeCase?.keyFacts?.map((fact) => (
                  <div
                    key={fact.id}
                    className="p-2.5 rounded-lg bg-surface-container-low dark:bg-[#161F30] text-xs border border-outline-variant/20 dark:border-[#1E293B] flex flex-col gap-1"
                  >
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-semibold text-blue-600 dark:text-blue-400">{fact.category}</span>
                      <span className="text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 px-1.5 py-0.5 rounded font-medium flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-[11px]">verified</span>
                        Verified Fact
                      </span>
                    </div>
                    <p className="text-slate-800 dark:text-slate-200 leading-tight">{fact.statement}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Action CTA */}
            <Link
              href={`/cases/${activeCase?.id}`}
              className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold text-center transition-colors shadow-sm flex items-center justify-center gap-1.5"
            >
              <span>Full Case Workspace</span>
              <span className="material-symbols-outlined text-sm">open_in_new</span>
            </Link>
          </div>
        </aside>

        {/* CENTER CANVAS: Conversation (6 columns on Desktop) */}
        <main className="col-span-1 lg:col-span-6 flex flex-col bg-white dark:bg-[#0F131C] rounded-2xl shadow-sm border border-outline-variant/30 dark:border-[#1E293B] overflow-hidden min-h-[600px]">
          {/* Chat Stream Header */}
          <div className="p-4 border-b border-outline-variant/30 dark:border-[#1E293B] bg-slate-50 dark:bg-[#161F30] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-heading text-sm font-bold text-slate-900 dark:text-white">
                Legal Saathi Indic Advisory Stream
              </span>
            </div>
            <span className="text-xs text-on-surface-variant font-medium">
              Statutory Grounding Active
            </span>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 sm:p-5 space-y-6 overflow-y-auto max-h-[620px]">
            {chatMessages.map((msg) => {
              if (msg.sender === 'user') {
                return (
                  <div key={msg.id} className="flex justify-end">
                    <div className="max-w-[85%] rounded-2xl rounded-tr-none bg-blue-600 text-white p-4 shadow-sm">
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                      <span className="text-[10px] text-blue-100 block text-right mt-1.5">
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                );
              }

              // Assistant structured response matching Stitch specifications
              const structured = msg.structured;
              if (!structured) return null;

              return (
                <div key={msg.id} className="flex flex-col gap-3 w-full">
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400">
                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">
                      LS
                    </div>
                    <span>Legal Saathi Structured Assessment</span>
                    <span className="text-[10px] text-on-surface-variant font-normal">
                      • {msg.timestamp}
                    </span>
                  </div>

                  <div className="bg-slate-50/70 dark:bg-[#161F30] rounded-2xl border border-slate-200/80 dark:border-[#1E293B] shadow-sm p-5 space-y-5">
                    {/* 1. WHAT I UNDERSTAND */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                        <span className="material-symbols-outlined text-base">psychology</span>
                        WHAT I UNDERSTAND
                      </div>
                      <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed pl-5 border-l-2 border-blue-500/40">
                        {structured.whatIUnderstand}
                      </p>
                    </div>

                    {/* 2. INFORMATION I NEED */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                        <span className="material-symbols-outlined text-base">help_outline</span>
                        INFORMATION I NEED
                      </div>
                      <ul className="space-y-1.5 pl-5 text-xs text-slate-700 dark:text-slate-300">
                        {structured.informationINeed.map((info, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-blue-500 font-bold">•</span>
                            <span>{info}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* 3. FACT VERIFICATION STATUS */}
                    <div className="p-3.5 rounded-xl bg-white dark:bg-[#0F131C] border border-slate-200 dark:border-[#1E293B] space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-base text-emerald-500">verified</span>
                          FACT VERIFICATION STATUS
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40 font-semibold text-[11px]">
                          Supported by Evidence
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                        {structured.evidenceStrength.summary}
                      </p>
                    </div>

                    {/* 4. WHY THIS MAY APPLY */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                        <span className="material-symbols-outlined text-base">lightbulb</span>
                        WHY THIS MAY APPLY
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pl-5 border-l-2 border-blue-500/40">
                        {structured.whyThisMayApply}
                      </p>
                    </div>

                    {/* 5. LEGAL SOURCE */}
                    <div className="p-3.5 rounded-xl bg-blue-50/60 dark:bg-[#0F131C] border-l-4 border-blue-600 border border-slate-200/40 dark:border-[#1E293B] text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-white">
                          {structured.legalSource.act}
                        </span>
                        <span className="font-mono text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded font-semibold">
                          {structured.legalSource.section}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 italic">
                        &quot;{structured.legalSource.summary}&quot;
                      </p>
                    </div>

                    {/* 6. WHAT YOU CAN DO NEXT */}
                    <div className="pt-2 border-t border-slate-200 dark:border-[#1E293B] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="text-xs text-slate-600 dark:text-slate-300">
                        <strong className="text-slate-900 dark:text-white">Recommended Action:</strong>{' '}
                        {structured.whatYouCanDoNext.suggestion}
                      </div>
                      <Link
                        href={`/cases/${structured.whatYouCanDoNext.caseId || activeCase?.id || 'LS-2026-0042'}`}
                        className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shrink-0 transition-colors shadow-sm flex items-center gap-1.5"
                      >
                        <span>{structured.whatYouCanDoNext.actionLabel}</span>
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Analyzing typing loader */}
            {isAnalyzing && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-surface-container-low dark:bg-[#161F30] border border-transparent dark:border-[#1E293B] text-xs text-on-surface-variant">
                <span className="material-symbols-outlined text-base text-blue-500 animate-spin">
                  sync
                </span>
                <span>Legal Saathi is cross-referencing statutory provisions & evidence...</span>
              </div>
            )}
          </div>

          {/* Voice State Interactive Bar */}
          {voiceState !== 'IDLE' && (
            <div className="px-4 py-3 bg-red-50 dark:bg-red-950/40 border-t border-red-200 dark:border-red-900 flex items-center justify-between text-xs text-red-900 dark:text-red-200">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
                <span className="font-bold uppercase tracking-wider">Voice Recording:</span>
                <span>
                  {voiceState === 'LISTENING' && 'Listening in Indic Hindi / English... Speak your facts.'}
                  {voiceState === 'PROCESSING' && 'Analyzing phonemes and extracting claims...'}
                  {voiceState === 'TRANSCRIPT' && 'Speech recognized! Review text in the prompt box.'}
                  {voiceState === 'CONFIRM' && 'Ready to submit this audio statement.'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {voiceState === 'TRANSCRIPT' && (
                  <button
                    type="button"
                    onClick={handleConfirmVoice}
                    className="px-3 py-1 rounded bg-red-600 text-white font-bold hover:bg-red-700"
                  >
                    Submit Voice Note
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setVoiceState('IDLE')}
                  className="font-medium underline ml-2"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Attached file indicator */}
          {attachedFile && (
            <div className="px-4 py-1.5 bg-blue-50 dark:bg-[#161F30] text-blue-800 dark:text-blue-300 text-xs flex items-center justify-between border-t border-slate-200 dark:border-[#1E293B]">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm">attachment</span>
                Attached: {attachedFile}
              </span>
              <button
                type="button"
                onClick={() => setAttachedFile(null)}
                className="hover:text-error"
              >
                ✕
              </button>
            </div>
          )}

          {/* Chat Input Bar */}
          <form
            onSubmit={handleSend}
            className="p-3 sm:p-4 border-t border-slate-200 dark:border-[#1E293B] bg-white dark:bg-[#0F131C] flex items-center gap-2"
          >
            {/* Voice Input trigger */}
            <button
              type="button"
              onClick={handleVoiceToggle}
              className={`p-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high dark:hover:bg-[#161F30] transition-colors ${
                voiceState === 'LISTENING' ? 'bg-red-100 text-red-600 animate-pulse' : ''
              }`}
              title="Voice Input"
            >
              <span className="material-symbols-outlined text-xl">
                {voiceState === 'LISTENING' ? 'mic' : 'mic_none'}
              </span>
            </button>

            {/* Document attachment */}
            <label
              className="p-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high dark:hover:bg-[#161F30] transition-colors cursor-pointer"
              title="Attach evidence"
            >
              <span className="material-symbols-outlined text-xl">attach_file</span>
              <input
                type="file"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setAttachedFile(e.target.files[0].name);
                  }
                }}
              />
            </label>

            {/* Message input */}
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your response or clarify facts (e.g. 'Yes, I have the lease deed')..."
              className="flex-1 bg-slate-50 dark:bg-[#161F30] border border-slate-200 dark:border-[#1E293B] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />

            {/* Send button */}
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2 sm:px-4 sm:py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:pointer-events-none text-white text-xs font-semibold transition-colors flex items-center gap-1 shadow-sm"
            >
              <span className="hidden sm:inline">Send</span>
              <span className="material-symbols-outlined text-lg">send</span>
            </button>
          </form>
        </main>

        {/* RIGHT RAIL: Legal Context & Grounding (3 columns on Desktop) */}
        <aside className="hidden lg:flex flex-col gap-4 lg:col-span-3">
          <div className="bg-white dark:bg-[#0F131C] rounded-xl p-5 shadow-sm border border-outline-variant/30 dark:border-[#1E293B] flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-outline-variant/30 dark:border-[#1E293B] pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base text-blue-600 dark:text-blue-400">balance</span>
                Legal Context
              </span>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">verified</span>
                Statute Grounded
              </span>
            </div>

            {/* Applicable Acts */}
            <div className="space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant block">
                Primary Governing Acts
              </span>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#161F30] space-y-1 border border-slate-200/60 dark:border-[#1E293B]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">Model Tenancy Act, 2021</span>
                  <span className="text-[10px] font-mono bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 px-1.5 py-0.5 rounded font-semibold">
                    Sec. 11(2)
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  Residential security deposit maximum 2 months rent. Mandatory refund within 30 days of premises vacation.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#161F30] space-y-1 border border-slate-200/60 dark:border-[#1E293B]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">Indian Contract Act, 1872</span>
                  <span className="text-[10px] font-mono bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 px-1.5 py-0.5 rounded font-semibold">
                    Sec. 73
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  Right to compensatory damages for willful contractual default without statutory cause.
                </p>
              </div>
            </div>

            {/* Procedural Timelines */}
            <div className="pt-2 border-t border-slate-200 dark:border-[#1E293B] space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant block">
                Statutory Timelines
              </span>
              <div className="text-xs space-y-2">
                <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                  <span>Refund Window:</span>
                  <strong className="text-blue-600 dark:text-blue-400">30 Days</strong>
                </div>
                <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                  <span>Demand Notice:</span>
                  <strong className="text-blue-600 dark:text-blue-400">15 Days Cure</strong>
                </div>
                <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                  <span>Rent Authority Filing:</span>
                  <strong className="text-amber-600 dark:text-amber-400">Post Notice Expiry</strong>
                </div>
              </div>
            </div>

            {/* Free Legal Aid Card */}
            <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-[#161F30] border border-blue-200 dark:border-[#1E293B] space-y-2 mt-2">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-900 dark:text-white">
                <span className="material-symbols-outlined text-sm text-blue-600 dark:text-blue-400">support_agent</span>
                NALSA Legal Aid
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-tight">
                Need pro-bono representation? Citizens can connect with designated legal aid panels.
              </p>
              <a
                href="tel:15100"
                className="inline-flex items-center gap-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded transition-colors shadow-sm"
              >
                <span>Call 15100</span>
                <span className="material-symbols-outlined text-xs">arrow_forward</span>
              </a>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-slate-500">Loading Legal Assistant...</div>}>
      <ChatContent />
    </Suspense>
  );
}
