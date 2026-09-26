'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export const AskLegalSaathiPrompt: React.FC = () => {
  const router = useRouter();
  const [question, setQuestion] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const SUGGESTED_QUERIES = [
    'Can my landlord deduct ₹30,000 painting charges without an itemized repair estimate?',
    'What are the mandatory clauses under Section 106 of the Transfer of Property Act for notice?',
    'How do I file an RTI application for delayed municipal corporation public works?',
    'What compensation is payable by a builder under RERA Section 18 for 18-month possession delay?',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = question.trim();
    if (!trimmed) {
      setErrorMessage('Please enter a legal query or describe your dispute situation.');
      return;
    }
    setErrorMessage(null);
    router.push(`/chat?q=${encodeURIComponent(trimmed)}`);
  };

  const handleSelectSuggested = (text: string) => {
    setQuestion(text);
    setErrorMessage(null);
  };

  return (
    <section className="bg-gradient-to-br from-blue-50/80 via-white to-slate-50 dark:from-[#0F1422] dark:via-[#0B1120] dark:to-[#0F131C] border border-blue-200/60 dark:border-blue-900/40 rounded-2xl p-6 sm:p-8 shadow-sm">
      <div className="max-w-4xl mx-auto space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 text-[11px] font-bold uppercase tracking-wider">
              <span className="material-symbols-outlined text-sm">auto_awesome</span>
              <span>AI Grounded In Indian Bare Acts</span>
            </div>
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-on-surface tracking-tight">
              Ask Legal Saathi a Question
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant">
              Type your problem in everyday language. Legal Saathi identifies applicable statutes, procedural timelines, and next actions.
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 bg-white/80 dark:bg-[#161F30] px-3 py-1.5 rounded-xl border border-slate-200/60 dark:border-slate-800 shrink-0">
            <span className="material-symbols-outlined text-sm text-emerald-600 dark:text-emerald-400">verified_user</span>
            <span>Non-Courtroom Advisory</span>
          </div>
        </div>

        {/* Question Submission Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <textarea
              rows={3}
              value={question}
              onChange={(e) => {
                setQuestion(e.target.value);
                if (errorMessage) setErrorMessage(null);
              }}
              placeholder="e.g. My landlord is withholding my security deposit of ₹65,000 even though 30 days notice was served and apartment handed over cleanly..."
              className="w-full px-4 py-3.5 rounded-xl bg-white dark:bg-[#0B1120] border border-slate-300 dark:border-[#1E293B] text-on-surface placeholder:text-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner resize-none transition-all"
              aria-label="Ask Legal Saathi a question"
            />
            <div className="absolute right-3 bottom-3 flex items-center gap-2">
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <span>Ask Assistant</span>
                <span className="material-symbols-outlined text-sm">send</span>
              </button>
            </div>
          </div>

          {errorMessage && (
            <p className="text-xs font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">error</span>
              <span>{errorMessage}</span>
            </p>
          )}

          {/* Quick Suggestion Pills */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
              Suggested Legal Inquiries:
            </span>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_QUERIES.map((query, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSelectSuggested(query)}
                  className="text-left text-[11px] px-3 py-1.5 rounded-lg bg-white/70 dark:bg-[#161F30]/80 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                >
                  &ldquo;{query}&rdquo;
                </button>
              ))}
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};
