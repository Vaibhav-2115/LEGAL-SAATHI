'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLegalSaathi } from '../context/LegalSaathiContext';

interface MissingInfoAssistantProps {
  caseId: string;
}

export const MissingInfoAssistant: React.FC<MissingInfoAssistantProps> = ({ caseId }) => {
  const { missingInfoQuestions, answerMissingInfoQuestion, skipMissingInfoQuestion } = useLegalSaathi();
  const [activePriority, setActivePriority] = useState<'ALL' | 'IMPORTANT' | 'HELPFUL' | 'OPTIONAL'>('ALL');
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  const [submittingId, setSubmittingId] = useState<string | null>(null);

  const questions = missingInfoQuestions[caseId] || [
    {
      id: 'mq-default-1',
      question: 'Do you have written proof of the initial transaction or notice served to the counterparty?',
      priority: 'IMPORTANT',
      whyItMatters: 'Written notice establishes the commencement of the statutory dispute period under Indian civil law.',
      howToProvideIt: 'Specify the date the communication occurred and attach screenshot or document.',
      possibleEvidence: 'Email header, registered post receipt, or WhatsApp chat export.',
      answered: false
    },
    {
      id: 'mq-default-2',
      question: 'Did the counterparty provide any written refusal or deduction justification?',
      priority: 'HELPFUL',
      whyItMatters: 'Demonstrates whether the withholding or refusal was arbitrary or backed by receipts.',
      howToProvideIt: 'Describe what the counterparty claimed.',
      possibleEvidence: 'Written reply, email, or invoice denial.',
      answered: false
    }
  ];

  const totalQuestions = questions.length;
  const answeredCount = questions.filter((q) => q.answered).length;
  const progressPercent = totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;

  const filteredQuestions = questions.filter((q) => {
    if (activePriority === 'ALL') return true;
    return q.priority === activePriority;
  });

  const handleInputChange = (id: string, value: string) => {
    setInputValues((prev) => ({ ...prev, [id]: value }));
  };

  const handleAnswerSubmit = (qId: string) => {
    const val = inputValues[qId];
    if (val && val.trim()) {
      setSubmittingId(qId);
      answerMissingInfoQuestion(caseId, qId, val.trim());
      setSubmittingId(null);
    }
  };

  const handleSkip = (qId: string) => {
    skipMissingInfoQuestion(caseId, qId);
  };

  const getPriorityBadge = (priority: 'IMPORTANT' | 'HELPFUL' | 'OPTIONAL') => {
    switch (priority) {
      case 'IMPORTANT':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-300/40">
            <span className="material-symbols-outlined text-xs">priority_high</span>
            High Priority
          </span>
        );
      case 'HELPFUL':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-300/40">
            <span className="material-symbols-outlined text-xs">star</span>
            Helpful
          </span>
        );
      case 'OPTIONAL':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-slate-100 text-slate-700 dark:bg-[#161F30] dark:text-slate-300 border border-slate-300/40">
            <span className="material-symbols-outlined text-xs">help_outline</span>
            Optional
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress & Priority Tabs */}
      <section
        aria-labelledby="assistant-progress-heading"
        className="bg-surface-container-lowest dark:bg-[#0F131C] border border-outline-variant/40 rounded-2xl p-5 shadow-sm space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-outline-variant/30 pb-3">
          <div>
            <h2 id="assistant-progress-heading" className="font-heading text-base sm:text-lg font-bold text-on-surface">
              Factual Completeness Tracker
            </h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Targeted questions prioritized by evidentiary impact. Fulfilling high-priority gaps significantly strengthens statutory claims.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto bg-surface-container-low dark:bg-[#161F30] px-3 py-1.5 rounded-xl border border-outline-variant/30 text-xs">
            <span className="material-symbols-outlined text-primary text-base">task_alt</span>
            <span className="font-bold text-on-surface">
              {answeredCount} of {totalQuestions} Answered ({progressPercent}%)
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-surface-container-low dark:bg-[#161F30] h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-primary to-secondary h-full transition-all duration-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Priority Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {(['ALL', 'IMPORTANT', 'HELPFUL', 'OPTIONAL'] as const).map((p) => {
            const count =
              p === 'ALL'
                ? questions.length
                : questions.filter((q) => q.priority === p).length;
            return (
              <button
                key={p}
                type="button"
                onClick={() => setActivePriority(p)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activePriority === p
                    ? 'bg-primary text-white shadow-sm font-bold'
                    : 'bg-surface-container-low dark:bg-[#161F30] text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                <span>{p.replace('_', ' ')}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    activePriority === p ? 'bg-white/20 text-white' : 'bg-surface-container text-on-surface-variant'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Questions List */}
      <section aria-label="Prioritized Questions" className="space-y-4">
        {filteredQuestions.map((q, idx) => {
          const isAnswered = q.answered;
          const isSkipped = q.skipped;

          return (
            <article
              key={q.id}
              className={`rounded-2xl border p-5 sm:p-6 transition-all shadow-sm ${
                isAnswered
                  ? 'bg-emerald-50/30 dark:bg-emerald-950/15 border-emerald-300/40 dark:border-emerald-900/40'
                  : isSkipped
                  ? 'bg-surface-container-low dark:bg-[#161F30]/40 border-outline-variant/20 opacity-75'
                  : 'bg-surface-container-lowest dark:bg-[#0F131C] border-outline-variant/40'
              }`}
            >
              {/* Question Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  {getPriorityBadge(q.priority)}
                </div>

                {isAnswered ? (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full">
                    <span className="material-symbols-outlined text-sm">check_circle</span>
                    Answer Recorded
                  </span>
                ) : isSkipped ? (
                  <span className="inline-flex items-center gap-1 text-xs text-on-surface-variant italic">
                    <span className="material-symbols-outlined text-sm">redo</span>
                    Skipped for now
                  </span>
                ) : null}
              </div>

              {/* Question Text */}
              <h3 className="font-heading text-base sm:text-lg font-bold text-on-surface mb-3 leading-snug">
                {q.question}
              </h3>

              {/* Explanatory Context Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4 text-xs">
                {/* Why this matters */}
                <div className="p-3 rounded-xl bg-primary/5 dark:bg-primary/10 border border-primary/20 space-y-1">
                  <span className="font-bold text-primary dark:text-primary-fixed uppercase tracking-wider text-[10px] block">
                    Why This Matters
                  </span>
                  <p className="text-on-surface leading-relaxed">{q.whyItMatters}</p>
                </div>

                {/* How to provide */}
                <div className="p-3 rounded-xl bg-surface-container-low dark:bg-[#161F30]/80 border border-outline-variant/30 space-y-1">
                  <span className="font-bold text-on-surface-variant uppercase tracking-wider text-[10px] block">
                    How to Provide It
                  </span>
                  <p className="text-on-surface leading-relaxed">{q.howToProvideIt}</p>
                </div>

                {/* Possible evidence */}
                <div className="p-3 rounded-xl bg-secondary/5 dark:bg-secondary/10 border border-secondary/20 space-y-1">
                  <span className="font-bold text-secondary dark:text-secondary-fixed uppercase tracking-wider text-[10px] block">
                    Corroborating Evidence
                  </span>
                  <p className="text-on-surface leading-relaxed">{q.possibleEvidence}</p>
                </div>
              </div>

              {/* User Answer or Input Section */}
              {isAnswered ? (
                <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 text-xs space-y-1">
                  <span className="font-bold text-emerald-900 dark:text-emerald-200 block uppercase tracking-wider text-[10px]">
                    Your Recorded Statement:
                  </span>
                  <p className="text-emerald-950 dark:text-emerald-100 font-medium">
                    &ldquo;{q.answerValue}&rdquo;
                  </p>
                </div>
              ) : (
                <div className="space-y-3 pt-2 border-t border-outline-variant/20">
                  <div>
                    <label htmlFor={`input-${q.id}`} className="block text-xs font-bold text-on-surface mb-1">
                      Enter Your Response or Explanation:
                    </label>
                    <textarea
                      id={`input-${q.id}`}
                      rows={2}
                      value={inputValues[q.id] || ''}
                      onChange={(e) => handleInputChange(q.id, e.target.value)}
                      placeholder="e.g. Yes, written notice was sent via email on 10 Dec 2025 and acknowledged by landlord..."
                      className="w-full text-xs p-3 rounded-xl border border-outline-variant/50 bg-surface dark:bg-[#161F30] text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/cases/${caseId}/evidence`}
                        className="px-3 py-1.5 rounded-lg border border-outline-variant/40 hover:bg-surface-container text-xs font-semibold text-primary dark:text-primary-fixed flex items-center gap-1 transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm">attachment</span>
                        <span>Upload File to Evidence</span>
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleSkip(q.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium text-on-surface-variant hover:text-on-surface transition-colors"
                      >
                        Skip for Now
                      </button>
                    </div>

                    <button
                      type="button"
                      disabled={!inputValues[q.id]?.trim() || submittingId === q.id}
                      onClick={() => handleAnswerSubmit(q.id)}
                      className="px-4 py-2 rounded-xl bg-primary hover:bg-secondary text-white text-xs font-bold disabled:opacity-40 transition-colors shadow-sm flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-sm">send</span>
                      <span>Save Answer</span>
                    </button>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </section>
    </div>
  );
};
