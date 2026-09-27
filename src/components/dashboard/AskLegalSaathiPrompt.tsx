'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useLegalSaathi } from '@/context/LegalSaathiContext';
import { legalSaathiApi, BackendChatResponse } from '@/lib/api';
import { LANGUAGE_CODES } from '@/lib/i18n/translations';

interface ConsultationTurn {
  id: string;
  question: string;
  response: BackendChatResponse;
  timestamp: string;
}

export const AskLegalSaathiPrompt: React.FC = () => {
  const { language, t, activeCase } = useLegalSaathi();
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [consultations, setConsultations] = useState<ConsultationTurn[]>([]);
  const [lastFailedQuestion, setLastFailedQuestion] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const resultsEndRef = useRef<HTMLDivElement>(null);

  const SUGGESTED_QUERIES = [
    'Can my landlord deduct ₹30,000 painting charges without an itemized repair estimate?',
    'What are the mandatory clauses under Section 106 of the Transfer of Property Act for notice?',
    'How do I file an RTI application for delayed municipal corporation public works?',
    'What compensation is payable by a builder under RERA Section 18 for 18-month possession delay?',
  ];

  // Auto-resize textarea as content changes
  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(Math.max(scrollHeight, 72), 220)}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [question]);

  const executeSubmission = async (queryText: string) => {
    const trimmed = queryText.trim();
    if (!trimmed) {
      setErrorMessage(
        language === 'Hindi'
          ? 'कृपया कोई कानूनी प्रश्न दर्ज करें या अपनी विवाद स्थिति का वर्णन करें।'
          : 'Please enter a legal query or describe your dispute situation.'
      );
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setLastFailedQuestion(null);

    try {
      const langCode = LANGUAGE_CODES[language] || 'en';
      // Use activeCase id if available, or last consultation case_id if continuing consultation
      const contextCaseId = consultations.length > 0
        ? consultations[consultations.length - 1].response.case_id
        : activeCase?.id;

      const res = await legalSaathiApi.sendChat(trimmed, contextCaseId, langCode);

      const newTurn: ConsultationTurn = {
        id: `turn_${Date.now()}`,
        question: trimmed,
        response: res,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setConsultations((prev) => [...prev, newTurn]);
      setQuestion('');
      if (textareaRef.current) {
        textareaRef.current.style.height = '72px';
      }

      // Smooth scroll to latest result
      setTimeout(() => {
        resultsEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    } catch (err: any) {
      console.error('Failed to submit legal question:', err);
      setLastFailedQuestion(trimmed);
      setErrorMessage(
        err?.message ||
          'Unable to reach Legal Saathi intelligence server. Please verify connectivity or check if the backend service is running on port 8000.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isLoading) return;
    executeSubmission(question);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSelectSuggested = (text: string) => {
    setQuestion(text);
    setErrorMessage(null);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleRetry = () => {
    if (lastFailedQuestion) {
      executeSubmission(lastFailedQuestion);
    } else if (question.trim()) {
      executeSubmission(question.trim());
    }
  };

  const handleClearConversation = () => {
    setConsultations([]);
    setErrorMessage(null);
    setLastFailedQuestion(null);
    setQuestion('');
  };

  return (
    <section className="bg-gradient-to-br from-blue-50/80 via-white to-slate-50 dark:from-[#0F1422] dark:via-[#0B1120] dark:to-[#0F131C] border border-blue-200/60 dark:border-blue-900/40 rounded-2xl p-6 sm:p-8 shadow-sm transition-all">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* ========================================================================= */}
        {/* HEADER SECTION                                                           */}
        {/* ========================================================================= */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 text-[11px] font-bold uppercase tracking-wider">
              <span className="material-symbols-outlined text-sm">auto_awesome</span>
              <span>AI Grounded In Indian Bare Acts</span>
            </div>
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Ask Legal Saathi a Question
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Type your problem in everyday language. Legal Saathi identifies applicable statutes, procedural timelines, and next actions.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {consultations.length > 0 && (
              <button
                type="button"
                onClick={handleClearConversation}
                className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
                title="Start a new consultation"
              >
                <span className="material-symbols-outlined text-sm">refresh</span>
                <span>New Question</span>
              </button>
            )}
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 bg-white/80 dark:bg-[#161F30] px-3 py-1.5 rounded-xl border border-slate-200/60 dark:border-slate-800">
              <span className="material-symbols-outlined text-sm text-emerald-600 dark:text-emerald-400">verified_user</span>
              <span>Non-Courtroom Advisory</span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* QUESTION INPUT FORM                                                      */}
        {/* ========================================================================= */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative rounded-xl border border-slate-300 dark:border-[#1E293B] bg-white dark:bg-[#0B1120] focus-within:ring-2 focus-within:ring-blue-500 shadow-inner transition-all">
            <textarea
              ref={textareaRef}
              rows={2}
              value={question}
              onChange={(e) => {
                setQuestion(e.target.value);
                if (errorMessage) setErrorMessage(null);
              }}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              placeholder={
                consultations.length > 0
                  ? "Ask a follow-up question regarding this legal matter..."
                  : "e.g. My landlord is withholding my security deposit of ₹65,000 even though 30 days notice was served and apartment handed over cleanly..."
              }
              className="w-full px-4 pt-3.5 pb-14 rounded-xl bg-transparent text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-xs sm:text-sm focus:outline-none resize-none transition-all disabled:opacity-60"
              aria-label="Ask Legal Saathi a question"
            />

            <div className="absolute right-3 bottom-3 flex items-center gap-2">
              <span className="hidden sm:inline text-[10px] text-slate-400 dark:text-slate-500">
                Press Enter to submit, Shift + Enter for new line
              </span>

              <button
                type="submit"
                disabled={isLoading || !question.trim()}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:pointer-events-none text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <span className="material-symbols-outlined text-sm animate-spin">sync</span>
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <span>Ask Assistant</span>
                    <span className="material-symbols-outlined text-sm">send</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Validation & Error Alert */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-800 dark:text-rose-300 flex items-start justify-between gap-3">
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-base text-rose-600 dark:text-rose-400 shrink-0">error</span>
                <span className="leading-relaxed">{errorMessage}</span>
              </div>
              <button
                type="button"
                onClick={handleRetry}
                className="shrink-0 px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-700 text-white font-semibold text-[11px] transition-colors flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-xs">replay</span>
                <span>Retry</span>
              </button>
            </div>
          )}

          {/* Suggested Legal Inquiries */}
          {consultations.length === 0 && (
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                Suggested Legal Inquiries:
              </span>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_QUERIES.map((queryText, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSelectSuggested(queryText)}
                    className="text-left text-[11px] px-3 py-1.5 rounded-lg bg-white/70 dark:bg-[#161F30]/80 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                  >
                    &ldquo;{queryText}&rdquo;
                  </button>
                ))}
              </div>
            </div>
          )}
        </form>

        {/* ========================================================================= */}
        {/* LOADING INDICATOR STATE                                                  */}
        {/* ========================================================================= */}
        {isLoading && (
          <div className="p-5 rounded-2xl bg-white/80 dark:bg-[#161F30]/80 border border-blue-200 dark:border-blue-900/60 shadow-xs flex items-center gap-3.5 animate-pulse">
            <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-xl animate-spin">sync</span>
            </div>
            <div className="space-y-1">
              <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                Analyzing your legal inquiry...
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Cross-referencing 9,549 Indian Bare Acts, judgment excerpts, and procedural limitation periods.
              </p>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STRUCTURED ANSWER DISPLAY INTERFACE                                      */}
        {/* ========================================================================= */}
        {consultations.length > 0 && (
          <div className="space-y-6 pt-2">
            {consultations.map((turn, turnIdx) => {
              const res = turn.response;
              const confidenceColor =
                res.confidence === 'strong'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800'
                  : res.confidence === 'partial'
                  ? 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800'
                  : 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';

              const confidenceLabel =
                res.confidence === 'strong'
                  ? 'High Grounding (Bare Acts Verified)'
                  : res.confidence === 'partial'
                  ? 'Moderate Grounding (Partial Statutory Match)'
                  : 'Preliminary Guidance (Needs More Evidence)';

              return (
                <div
                  key={turn.id}
                  className="rounded-2xl border border-slate-200/90 dark:border-[#1E293B] bg-white dark:bg-[#0F1422] p-5 sm:p-7 shadow-xs space-y-6 transition-all"
                >
                  {/* Query Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-200/70 dark:border-[#1E293B]">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                        Q{turnIdx + 1}
                      </span>
                      <h3 className="font-heading text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                        &ldquo;{turn.question}&rdquo;
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 text-[11px]">
                      <span className={`px-2.5 py-0.5 rounded-full font-semibold border ${confidenceColor} flex items-center gap-1`}>
                        <span className="material-symbols-outlined text-xs">verified</span>
                        <span>{confidenceLabel}</span>
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-[#161F30] text-blue-700 dark:text-blue-300 font-mono font-bold uppercase">
                        {res.issue_type.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Section A: Direct Answer */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                      <span className="material-symbols-outlined text-base">gavel</span>
                      <span>Direct Legal Answer & Explanation</span>
                    </div>
                    <div className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap pl-3 border-l-2 border-blue-500/50">
                      {res.answer}
                    </div>
                  </div>

                  {/* Section B & C: Applicable Law & Legal Analysis */}
                  {res.citations && res.citations.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        <span className="material-symbols-outlined text-base text-blue-600 dark:text-blue-400">balance</span>
                        <span>Applicable Law & Statutory Provisions</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {res.citations.slice(0, 4).map((cit, citIdx) => (
                          <div
                            key={citIdx}
                            className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#161F30] border border-slate-200/80 dark:border-[#1E293B] space-y-1.5"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <span className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                                {cit.title}
                              </span>
                              <span className="text-[10px] font-mono bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 px-1.5 py-0.5 rounded font-semibold shrink-0">
                                {cit.section_ref}
                              </span>
                            </div>

                            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3 italic">
                              &ldquo;{cit.excerpt}&rdquo;
                            </p>

                            <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 pt-1">
                              <span>{cit.jurisdiction || 'India (Central)'}</span>
                              {cit.official_link && (
                                <a
                                  href={cit.official_link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5"
                                >
                                  <span>Official Law</span>
                                  <span className="material-symbols-outlined text-[11px]">open_in_new</span>
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Section D: Possible Next Steps & Suggested Action */}
                  {res.suggested_action && res.suggested_action.type !== 'none' && (
                    <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-[#161F30] border border-blue-200/60 dark:border-blue-900/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block">
                          Recommended Procedural Step:
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                          {res.suggested_action.title}
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-300">
                          {res.suggested_action.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {res.suggested_action.type === 'notice' ? (
                          <Link
                            href="/draft/legal-notice"
                            className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                          >
                            <span>Draft Legal Notice</span>
                            <span className="material-symbols-outlined text-sm">edit_document</span>
                          </Link>
                        ) : res.suggested_action.type === 'rti' ? (
                          <Link
                            href="/draft/rti"
                            className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                          >
                            <span>Draft RTI Application</span>
                            <span className="material-symbols-outlined text-sm">edit_document</span>
                          </Link>
                        ) : res.suggested_action.type === 'dlsa' ? (
                          <Link
                            href="/dlsa"
                            className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                          >
                            <span>NALSA / DLSA Aid</span>
                            <span className="material-symbols-outlined text-sm">support_agent</span>
                          </Link>
                        ) : res.suggested_action.type === 'efir' ? (
                          <Link
                            href="/actions/efir"
                            className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                          >
                            <span>Prepare e-FIR</span>
                            <span className="material-symbols-outlined text-sm">policy</span>
                          </Link>
                        ) : (
                          <Link
                            href={`/cases/${res.case_id || activeCase?.id || 'LS-2026-0042'}`}
                            className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                          >
                            <span>Open Case Dossier</span>
                            <span className="material-symbols-outlined text-sm">folder_open</span>
                          </Link>
                        )}

                        <Link
                          href={`/chat?q=${encodeURIComponent(turn.question)}`}
                          className="px-3 py-2 rounded-lg bg-white dark:bg-[#0B1120] hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors"
                          title="Open in Full AI Consultation Room"
                        >
                          <span className="material-symbols-outlined text-sm">open_in_full</span>
                        </Link>
                      </div>
                    </div>
                  )}

                  {/* Section F: Important Legal Disclaimer */}
                  <div className="pt-2 border-t border-slate-200/60 dark:border-[#1E293B] flex items-start gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="material-symbols-outlined text-sm text-amber-500 shrink-0 mt-0.5">info</span>
                    <p className="leading-relaxed">
                      {res.disclaimer || (
                        <>
                          <strong>Non-Court Advisory:</strong> Legal Saathi provides legal information and research assistance under Indian law, not formal legal advice. Please consult an advocate or your local District Legal Services Authority (DLSA) for court representation.
                        </>
                      )}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={resultsEndRef} />
          </div>
        )}

      </div>
    </section>
  );
};
