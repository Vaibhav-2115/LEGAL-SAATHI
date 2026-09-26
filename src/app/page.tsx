'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLegalSaathi } from '../context/LegalSaathiContext';
import { CaseStatusBadge } from '../components/CaseStatusBadge';
import { EXAMPLE_QUESTIONS } from '../lib/mock-data';
import { VoiceState } from '../lib/types';

export default function HomePage() {
  const router = useRouter();
  const {
    activeCase,
    cases,
    addChatMessage,
    createCaseFromProblem,
    setPendingProblem
  } = useLegalSaathi();

  const [problemText, setProblemText] = useState('');
  const [voiceState, setVoiceState] = useState<VoiceState>('IDLE');
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [attachedFileName, setAttachedFileName] = useState<string | null>(null);

  const handleVoiceToggle = () => {
    if (voiceState === 'IDLE') {
      setVoiceState('LISTENING');
      setTimeout(() => {
        setVoiceState('PROCESSING');
        setTimeout(() => {
          setVoiceState('TRANSCRIPT');
          setProblemText(
            'मकान मालिक 11 महीने बाद 65,000 रुपये का सिक्योरिटी डिपॉजिट वापस नहीं कर रहा है। 30 दिन का नोटिस दिया था और चाबी भी सौंप दी थी।'
          );
        }, 1200);
      }, 2000);
    } else {
      setVoiceState('IDLE');
    }
  };

  const handleFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachedFileName(e.target.files[0].name);
    }
  };

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!problemText.trim()) return;

    const query = problemText.trim();
    createCaseFromProblem(query);
    addChatMessage(query);
    setPendingProblem(query);
    router.push('/chat');
  };

  const handleSelectExample = (prompt: string) => {
    setProblemText(prompt);
  };

  return (
    <div className="w-full min-h-screen bg-background text-on-surface">
      {/* 1. HERO SECTION (Stitch Screen 01 - Landing Page Hero) */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/50 via-background to-background dark:from-[#090D16] dark:via-[#090D16] dark:to-[#0F131C] pt-8 pb-12 sm:pt-12 sm:pb-16 border-b border-slate-200/80 dark:border-[#1E293B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            {/* Top Civic Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60 text-xs font-bold tracking-wider uppercase mb-5 shadow-xs">
              <span className="material-symbols-outlined text-sm text-blue-600 dark:text-blue-400">gavel</span>
              <span>Civic Legal Portal • Bilingual Indic NLP</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15]">
              India&apos;s First Evidence-Grounded Legal Justice Companion for Every Citizen
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 mt-5 max-w-3xl leading-relaxed">
              Democratizing justice across Bharat. Speak or type in Hindi, Tamil, Bengali, or English. Turn complex disputes into cited statutory rights, verified court-ready legal notices, and collective civic empowerment.
            </p>

            {/* Authentic Vernacular Prompt Snippet Card */}
            <div className="mt-6 p-4 rounded-xl bg-white/90 dark:bg-[#0F131C]/90 backdrop-blur-sm border border-slate-200 dark:border-[#1E293B] shadow-sm max-w-2xl text-left flex items-start gap-3">
              <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-xl shrink-0 mt-0.5">record_voice_over</span>
              <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                <span className="font-semibold text-slate-900 dark:text-white">Example Citizen Query: </span>
                <span className="italic font-hindi text-slate-600 dark:text-slate-400">
                  &ldquo;मकान मालिक 11 महीने बाद ₹55,000 का सिक्योरिटी डिपॉजिट वापस नहीं कर रहा है। बिना नोटिस खाली करवा रहा है।&rdquo;
                </span>
              </div>
            </div>

            {/* Action CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-8">
              <a
                href="#intake-section"
                className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">mic</span>
                <span>Ask Legal Saathi (Start Free)</span>
              </a>
              <Link
                href="/cases/LS-2026-0042"
                className="px-6 py-3.5 rounded-xl bg-slate-100 dark:bg-[#161F30] hover:bg-slate-200 dark:hover:bg-[#1E293B] border border-slate-200 dark:border-[#1E293B] text-slate-800 dark:text-slate-200 font-bold text-sm transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-lg text-blue-600 dark:text-blue-400">folder_open</span>
                <span>Explore Sample Case (Security Deposit)</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. LIVE CIVIC IMPACT METRICS TICKER */}
      <section className="w-full bg-slate-100/80 dark:bg-[#0F131C] border-b border-slate-200 dark:border-[#1E293B] py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
            <div className="p-3">
              <div className="font-heading text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400">
                ₹4.8 Cr+
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-0.5">
                Disputed Amount Documented
              </div>
            </div>
            <div className="p-3">
              <div className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                1,420+
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-0.5">
                Statutory Notices Drafted
              </div>
            </div>
            <div className="p-3">
              <div className="font-heading text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                94.2%
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-0.5">
                Evidentiary Admissibility Rate
              </div>
            </div>
            <div className="p-3">
              <div className="font-heading text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
                28 States &amp; UTs
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-0.5">
                Indian Bare Acts Covered
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTAINER */}
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-10 md:gap-14">
        {/* 3. ACTIVE CASE QUICK-RESUME NOTIFICATION BAR (Stitch Screen 02) */}
        {activeCase && (
          <section className="w-full">
            <div className="bg-white dark:bg-[#0F131C] rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all border border-slate-200 dark:border-[#1E293B] flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-start sm:items-center gap-4 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-[#161F30] border border-blue-200/60 dark:border-[#1E293B] flex items-center justify-center shrink-0 text-blue-600 dark:text-blue-400">
                  <span className="material-symbols-outlined text-2xl animate-pulse">pending_actions</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-xs uppercase tracking-wider text-blue-600 dark:text-blue-400 font-bold">
                      Continue Your Complaint
                    </span>
                    <CaseStatusBadge status={activeCase.status} size="sm" />
                    <span className="text-xs text-slate-500 dark:text-slate-400">• Updated {activeCase.updatedAt}</span>
                  </div>
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className="font-heading text-lg sm:text-xl font-bold text-slate-900 dark:text-white truncate">
                      {activeCase.title}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-mono bg-slate-100 dark:bg-[#161F30] border border-slate-200/60 dark:border-[#1E293B] px-2 py-0.5 rounded">
                      ID: {activeCase.id}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base text-blue-600 dark:text-blue-400">arrow_forward</span>
                    <span>
                      Next Step: {activeCase.nextStep?.title} (
                      <strong className="text-slate-900 dark:text-white">
                        {activeCase.collectedEvidenceCount} of {activeCase.totalEvidenceCount} collected
                      </strong>
                      )
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0 self-end lg:self-center">
                <Link
                  href="/complaints"
                  className="px-4 py-2.5 rounded-lg bg-slate-100 dark:bg-[#161F30] hover:bg-slate-200 dark:hover:bg-[#1E293B] border border-slate-200/60 dark:border-[#1E293B] text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors flex items-center gap-1.5"
                >
                  <span>View All ({cases.length})</span>
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </Link>
                <Link
                  href={`/cases/${activeCase.id}`}
                  className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-2"
                >
                  <span>Continue Complaint</span>
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* 4. MAIN INTAKE CARD: WHAT LEGAL PROBLEM ARE YOU FACING? (Stitch Screen 02) */}
        <section id="intake-section" className="flex flex-col items-center text-center max-w-4xl mx-auto w-full">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 border border-blue-200/80 dark:border-blue-800/40 text-xs font-semibold tracking-wider uppercase mb-3">
            <span className="material-symbols-outlined text-sm text-blue-600 dark:text-blue-400">verified_user</span>
            Step 1 of 6 Active • Plain Language Intake
          </div>

          <h2 className="font-heading text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight max-w-3xl leading-tight">
            What legal problem are you facing?
          </h2>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2 max-w-2xl leading-relaxed">
            Explain in plain words, record a voice note, or select your regional language. Legal Saathi breaks down complex statutes into plain facts, verified rights, and concrete next actions.
          </p>

          {/* Large Problem Card */}
          <form
            onSubmit={handleAnalyze}
            className="w-full mt-6 bg-white dark:bg-[#0F131C] rounded-2xl shadow-xl border border-slate-200 dark:border-[#1E293B] p-4 sm:p-6 text-left transition-all"
          >
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 dark:border-[#1E293B]">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base text-blue-600 dark:text-blue-400">edit_note</span>
                Describe Your Situation
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Confidential • Encrypted • Guided by Indian Statute
              </span>
            </div>

            <textarea
              value={problemText}
              onChange={(e) => setProblemText(e.target.value)}
              rows={4}
              placeholder="Describe what happened in your own words (e.g. 'My landlord in Saket refuses to return my security deposit of ₹65,000 even after I vacated the flat on 10th January and handed over the keys...')"
              className="w-full bg-transparent text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 resize-none text-base focus:outline-none leading-relaxed"
            />

            {/* Attached file chip */}
            {attachedFileName && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-[#161F30] text-blue-800 dark:text-blue-300 text-xs font-medium my-2">
                <span className="material-symbols-outlined text-sm">attachment</span>
                <span className="truncate max-w-xs">{attachedFileName}</span>
                <button
                  type="button"
                  onClick={() => setAttachedFileName(null)}
                  className="hover:text-red-500 ml-1"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </div>
            )}

            {/* Voice State Banner if active */}
            {voiceState !== 'IDLE' && (
              <div className="my-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 flex items-center justify-between text-xs text-blue-900 dark:text-blue-200">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                  <span className="font-semibold uppercase tracking-wider">Voice Input:</span>
                  <span>
                    {voiceState === 'LISTENING' && 'Listening to your speech... Speak clearly.'}
                    {voiceState === 'PROCESSING' && 'Transcribing audio via Indic Speech engine...'}
                    {voiceState === 'TRANSCRIPT' && 'Transcript ready! You may review or edit below.'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setVoiceState('IDLE')}
                  className="font-bold underline ml-2"
                >
                  Cancel
                </button>
              </div>
            )}

            {/* Bottom Toolbar Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-200 dark:border-[#1E293B] mt-2">
              <div className="flex items-center gap-2">
                {/* Voice Input Button */}
                <button
                  type="button"
                  onClick={handleVoiceToggle}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all border border-slate-200/80 dark:border-[#1E293B] ${
                    voiceState === 'LISTENING'
                      ? 'bg-red-600 text-white animate-pulse'
                      : 'bg-slate-50 dark:bg-[#161F30] text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1E293B]'
                  }`}
                  title="Speak your legal issue"
                >
                  <span className="material-symbols-outlined text-base">
                    {voiceState === 'LISTENING' ? 'mic' : 'mic_none'}
                  </span>
                  <span className="hidden sm:inline">
                    {voiceState === 'LISTENING' ? 'Listening...' : 'Voice Input'}
                  </span>
                </button>

                {/* Attachment Button */}
                <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#161F30] border border-slate-200/80 dark:border-[#1E293B] text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1E293B] text-xs font-semibold transition-colors cursor-pointer">
                  <span className="material-symbols-outlined text-base">attach_file</span>
                  <span className="hidden sm:inline">Attach Document</span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileAttach}
                    accept=".pdf,.doc,.docx,.jpg,.png"
                  />
                </label>

                {/* Regional Language Picker */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#161F30] border border-slate-200/80 dark:border-[#1E293B] text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1E293B] text-xs font-semibold transition-colors"
                  >
                    <span className="material-symbols-outlined text-base">translate</span>
                    <span>{selectedLanguage}</span>
                  </button>
                  {showLanguageMenu && (
                    <div className="absolute left-0 bottom-full mb-1 w-36 bg-white dark:bg-[#0F131C] rounded-lg shadow-lg border border-slate-200 dark:border-[#1E293B] py-1 z-50 text-xs">
                      {['English', 'हिन्दी', 'தமிழ்', 'मराठी', 'తెలుగు', 'বাংলা'].map((lang) => (
                        <button
                          key={lang}
                          type="button"
                          onClick={() => {
                            setSelectedLanguage(lang);
                            setShowLanguageMenu(false);
                          }}
                          className="w-full text-left px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-[#161F30] text-slate-800 dark:text-slate-200"
                        >
                          {lang}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={!problemText.trim()}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none text-white text-sm font-semibold shadow-md transition-all"
              >
                <span>Analyze Problem</span>
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </button>
            </div>
          </form>
        </section>

        {/* 5. COMMON CITIZEN MATTERS QUICK-TAGS */}
        <section className="w-full">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Common Citizen Legal Matters (Click to explore)
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {EXAMPLE_QUESTIONS.map((ex) => (
              <button
                key={ex.title}
                type="button"
                onClick={() => handleSelectExample(ex.prompt)}
                className="p-4 rounded-xl bg-white dark:bg-[#0F131C] border border-slate-200 dark:border-[#1E293B] hover:border-blue-500/50 text-left transition-all hover:shadow-md flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-xl group-hover:scale-110 transition-transform">
                      {ex.icon}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-[#161F30] border border-slate-200/60 dark:border-[#1E293B] text-slate-600 dark:text-slate-400 font-medium">
                      {ex.tag}
                    </span>
                  </div>
                  <h3 className="font-heading text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {ex.title}
                  </h3>
                </div>
                <span className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-3 flex items-center gap-1">
                  <span>Use Template</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* 6. EVERYDAY INJUSTICE, DECODED IN SECONDS (Stitch Screen 01) */}
        <section className="w-full pt-4">
          <div className="text-center mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-800">
              Statutory Protection Areas
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
              Everyday Injustice, Decoded in Seconds
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl mx-auto">
              Select your legal hurdle. Our engine maps immediate statutory rights, filing forums, and draft remedies without lawyer fees.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Category 1: Rental Deposit */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#0F131C] border border-slate-200 dark:border-[#1E293B] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="p-2.5 rounded-xl bg-blue-50 dark:bg-[#161F30] text-blue-600 dark:text-blue-400">
                    <span className="material-symbols-outlined text-2xl">home_work</span>
                  </span>
                  <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
                    Model Tenancy Act, 2021
                  </span>
                </div>
                <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white">
                  Rental Deposit Withholding
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Landlord arbitrary deductions, refusal to return deposit, or illegal eviction threats. Statutorily claimable under Section 13(2) with interest.
                </p>
              </div>
              <Link
                href="/cases/LS-2026-0042"
                className="mt-4 pt-3 border-t border-slate-100 dark:border-[#1E293B] text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center justify-between"
              >
                <span>View Security Deposit Case Dossier</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>

            {/* Category 2: Delayed / Unpaid Wages */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#0F131C] border border-slate-200 dark:border-[#1E293B] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="p-2.5 rounded-xl bg-emerald-50 dark:bg-[#161F30] text-emerald-600 dark:text-emerald-400">
                    <span className="material-symbols-outlined text-2xl">payments</span>
                  </span>
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                    Payment of Wages Act, 1936
                  </span>
                </div>
                <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white">
                  Delayed / Unpaid Wages
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Startup shutdown or employer withholding final settlement, salary, or gratuity without written cause. Enforceable before Labour Commissioner.
                </p>
              </div>
              <Link
                href="/cases/LS-2026-0041"
                className="mt-4 pt-3 border-t border-slate-100 dark:border-[#1E293B] text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center justify-between"
              >
                <span>View Unpaid Salary Case Dossier</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>

            {/* Category 3: Faulty Goods & Refused Refunds */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#0F131C] border border-slate-200 dark:border-[#1E293B] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="p-2.5 rounded-xl bg-amber-50 dark:bg-[#161F30] text-amber-600 dark:text-amber-400">
                    <span className="material-symbols-outlined text-2xl">shopping_cart</span>
                  </span>
                  <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                    Consumer Protection Act, 2019
                  </span>
                </div>
                <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white">
                  Faulty Goods &amp; Refused Refunds
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Defective electronic device, rejected warranty service, or online portal refund denials. Actionable under NCDRC e-Daakhil consumer forum.
                </p>
              </div>
              <Link
                href="/cases/LS-2026-0038"
                className="mt-4 pt-3 border-t border-slate-100 dark:border-[#1E293B] text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline flex items-center justify-between"
              >
                <span>View Consumer Dispute Case</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>

            {/* Category 4: Delayed Flat Possession */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#0F131C] border border-slate-200 dark:border-[#1E293B] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="p-2.5 rounded-xl bg-indigo-50 dark:bg-[#161F30] text-indigo-600 dark:text-indigo-400">
                    <span className="material-symbols-outlined text-2xl">apartment</span>
                  </span>
                  <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800">
                    RERA Act, 2016
                  </span>
                </div>
                <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white">
                  Delayed Flat Possession
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Promoter failing to deliver apartment on committed handover date, changing layout plans, or imposing unfair escalation charges.
                </p>
              </div>
              <Link
                href="/actions"
                className="mt-4 pt-3 border-t border-slate-100 dark:border-[#1E293B] text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center justify-between"
              >
                <span>Check RERA Escalation Route</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>

            {/* Category 5: Stalled Pension / EPFO Records */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#0F131C] border border-slate-200 dark:border-[#1E293B] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="p-2.5 rounded-xl bg-rose-50 dark:bg-[#161F30] text-rose-600 dark:text-rose-400">
                    <span className="material-symbols-outlined text-2xl">find_in_page</span>
                  </span>
                  <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-2.5 py-0.5 rounded-full border border-rose-200 dark:border-rose-800">
                    RTI Act, 2005 • Section 6(1)
                  </span>
                </div>
                <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white">
                  Stalled Pension / EPFO Records
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Provident fund transfers delayed for months without explanation. Requisition certified government files within mandatory 30-day timeline.
                </p>
              </div>
              <Link
                href="/draft/rti"
                className="mt-4 pt-3 border-t border-slate-100 dark:border-[#1E293B] text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline flex items-center justify-between"
              >
                <span>Draft Online RTI Application</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>

            {/* Category 6: Free Legal Aid (Article 39A) */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-sm flex flex-col justify-between">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="p-2.5 rounded-xl bg-white/20 text-white">
                    <span className="material-symbols-outlined text-2xl">balance</span>
                  </span>
                  <span className="text-[11px] font-bold text-white bg-white/20 px-2.5 py-0.5 rounded-full">
                    Constitution of India • Art. 39A
                  </span>
                </div>
                <h3 className="font-heading text-lg font-bold text-white">
                  Free Legal Representation
                </h3>
                <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
                  Qualifying citizens (women, senior citizens, low-income earners) are entitled to free panel advocates, court fee exemptions, and Lok Adalat conciliation.
                </p>
              </div>
              <Link
                href="/dlsa"
                className="mt-4 pt-3 border-t border-white/20 text-xs font-semibold text-white hover:underline flex items-center justify-between"
              >
                <span>Access DLSA Front Office Guidance</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
          </div>
        </section>

        {/* 7. FROM DISTRESS TO DUE PROCESS IN SIX CLEAR MILESTONES (Stitch Screen 01) */}
        <section className="w-full pt-4">
          <div className="text-center mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-800">
              The Civic Justice Framework
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
              From Distress to Due Process in Six Clear Milestones
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl mx-auto">
              No legalese jargon. Legal Saathi translates your lived experience into judicial language recognized by Indian magistrates, registrars, and tribunals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Milestone 01 */}
            <div className="bg-white dark:bg-[#0F131C] p-6 rounded-2xl border border-slate-200 dark:border-[#1E293B] shadow-sm flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-heading text-2xl font-extrabold text-blue-600 dark:text-blue-400">01</span>
                <span className="w-9 h-9 rounded-full bg-blue-50 dark:bg-[#161F30] flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <span className="material-symbols-outlined text-lg">mic</span>
                </span>
              </div>
              <h3 className="font-heading text-base font-bold text-slate-900 dark:text-white">
                ASK in Mother Tongue
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Speak via mobile voice note or type in plain vernacular. No formal formatting required at first step.
              </p>
              <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 mt-2">
                Hindi, Tamil, Telugu, Bangla + 8 more
              </span>
            </div>

            {/* Milestone 02 */}
            <div className="bg-white dark:bg-[#0F131C] p-6 rounded-2xl border border-slate-200 dark:border-[#1E293B] shadow-sm flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-heading text-2xl font-extrabold text-blue-600 dark:text-blue-400">02</span>
                <span className="w-9 h-9 rounded-full bg-blue-50 dark:bg-[#161F30] flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <span className="material-symbols-outlined text-lg">psychology</span>
                </span>
              </div>
              <h3 className="font-heading text-base font-bold text-slate-900 dark:text-white">
                UNDERSTAND Fact Extraction
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                AI separates legally relevant facts from emotional noise. Identifies dates, amounts, counterparty details.
              </p>
              <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 mt-2">
                Automated Evidence Checklist
              </span>
            </div>

            {/* Milestone 03 */}
            <div className="bg-white dark:bg-[#0F131C] p-6 rounded-2xl border border-slate-200 dark:border-[#1E293B] shadow-sm flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-heading text-2xl font-extrabold text-blue-600 dark:text-blue-400">03</span>
                <span className="w-9 h-9 rounded-full bg-blue-50 dark:bg-[#161F30] flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <span className="material-symbols-outlined text-lg">verified</span>
                </span>
              </div>
              <h3 className="font-heading text-base font-bold text-slate-900 dark:text-white">
                VERIFY with Central &amp; State Acts
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Maps your dispute to authoritative sections of Indian Bare Acts with 0% speculation or foreign hallucination.
              </p>
              <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 mt-2">
                India Code &amp; State Gazettes
              </span>
            </div>

            {/* Milestone 04 */}
            <div className="bg-white dark:bg-[#0F131C] p-6 rounded-2xl border border-slate-200 dark:border-[#1E293B] shadow-sm flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-heading text-2xl font-extrabold text-blue-600 dark:text-blue-400">04</span>
                <span className="w-9 h-9 rounded-full bg-blue-50 dark:bg-[#161F30] flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <span className="material-symbols-outlined text-lg">account_tree</span>
                </span>
              </div>
              <h3 className="font-heading text-base font-bold text-slate-900 dark:text-white">
                EXPLAIN in Plain Human Terms
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Clear causation chain: why the law applies, what documents you need, and what remedies you are legally entitled to claim.
              </p>
              <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 mt-2">
                Plain Hindi &amp; English Summary
              </span>
            </div>

            {/* Milestone 05 */}
            <div className="bg-white dark:bg-[#0F131C] p-6 rounded-2xl border border-slate-200 dark:border-[#1E293B] shadow-sm flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-heading text-2xl font-extrabold text-blue-600 dark:text-blue-400">05</span>
                <span className="w-9 h-9 rounded-full bg-blue-50 dark:bg-[#161F30] flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <span className="material-symbols-outlined text-lg">drafts</span>
                </span>
              </div>
              <h3 className="font-heading text-base font-bold text-slate-900 dark:text-white">
                ACT via Verified Legal Notice
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Generate a formal 15-day statutory demand notice ready for registered post or tribunal filing with full citation grounding.
              </p>
              <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 mt-2">
                Court-Ready PDF Generation
              </span>
            </div>

            {/* Milestone 06 */}
            <div className="bg-white dark:bg-[#0F131C] p-6 rounded-2xl border border-slate-200 dark:border-[#1E293B] shadow-sm flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-heading text-2xl font-extrabold text-blue-600 dark:text-blue-400">06</span>
                <span className="w-9 h-9 rounded-full bg-blue-50 dark:bg-[#161F30] flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <span className="material-symbols-outlined text-lg">groups</span>
                </span>
              </div>
              <h3 className="font-heading text-base font-bold text-slate-900 dark:text-white">
                UNITE with Pattern Engine
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Detect repeat bad actors—landlords, employers, builders—and mobilize collective civic action for shared recovery.
              </p>
              <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 mt-2">
                Class Action &amp; DLSA Pooling
              </span>
            </div>
          </div>
        </section>

        {/* 8. WHY GENERIC AI FAILS INDIAN LITIGANTS (Stitch Screen 01 Comparative Table) */}
        <section className="w-full pt-4">
          <div className="text-center mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-3 py-1 rounded-full border border-rose-200 dark:border-rose-800">
              Rigorous Anti-Hallucination Safe Harbor
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
              Why Generic AI Fails Indian Litigants
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl mx-auto">
              Navigating Indian courts demands absolute statutory precision. Hallucinated US/UK case law or repealed sections can lead to contempt or case dismissal.
            </p>
          </div>

          <div className="w-full overflow-x-auto rounded-2xl border border-slate-200 dark:border-[#1E293B] shadow-sm">
            <div className="bg-white dark:bg-[#0F131C] min-w-[720px]">
              {/* Header */}
              <div className="grid grid-cols-12 bg-slate-100 dark:bg-[#161F30] text-slate-900 dark:text-white p-4 font-heading text-xs sm:text-sm font-bold border-b border-slate-200 dark:border-[#1E293B]">
                <div className="col-span-4">Evaluation Criteria</div>
                <div className="col-span-4 text-slate-500 dark:text-slate-400">Generic Chatbots / AI Models</div>
                <div className="col-span-4 text-blue-600 dark:text-blue-400 font-extrabold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base">shield</span>
                  <span>Legal Saathi Civic Engine</span>
                </div>
              </div>

              {/* Row 1: Bare Act Verification */}
              <div className="grid grid-cols-12 p-4 border-b border-slate-100 dark:border-[#1E293B] items-center text-xs">
                <div className="col-span-4 font-bold text-slate-900 dark:text-white">
                  Bare Act Verification
                </div>
                <div className="col-span-4 text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-rose-500 text-base">cancel</span>
                  <span>Hallucinates repealed IPC/CrPC or foreign law</span>
                </div>
                <div className="col-span-4 font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-emerald-500 text-base">check_circle</span>
                  <span>100% matched to current Indian Bare Acts &amp; Gazettes</span>
                </div>
              </div>

              {/* Row 2: Evidentiary Rigor */}
              <div className="grid grid-cols-12 p-4 border-b border-slate-100 dark:border-[#1E293B] items-center text-xs bg-slate-50/50 dark:bg-[#161F30]/30">
                <div className="col-span-4 font-bold text-slate-900 dark:text-white">
                  Evidentiary Rigor
                </div>
                <div className="col-span-4 text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-rose-500 text-base">cancel</span>
                  <span>Assumes facts without demanding receipts or proof</span>
                </div>
                <div className="col-span-4 font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-emerald-500 text-base">check_circle</span>
                  <span>Audits missing documents &amp; rates claim proof strength</span>
                </div>
              </div>

              {/* Row 3: Court Admissibility */}
              <div className="grid grid-cols-12 p-4 border-b border-slate-100 dark:border-[#1E293B] items-center text-xs">
                <div className="col-span-4 font-bold text-slate-900 dark:text-white">
                  Notice Enforceability
                </div>
                <div className="col-span-4 text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-rose-500 text-base">cancel</span>
                  <span>Casual email text easily dismissed by opposite counsel</span>
                </div>
                <div className="col-span-4 font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-emerald-500 text-base">check_circle</span>
                  <span>15-day statutory demand format ready for Registered Post</span>
                </div>
              </div>

              {/* Row 4: Vernacular Grounding */}
              <div className="grid grid-cols-12 p-4 items-center text-xs bg-slate-50/50 dark:bg-[#161F30]/30">
                <div className="col-span-4 font-bold text-slate-900 dark:text-white">
                  Vernacular Speech &amp; Languages
                </div>
                <div className="col-span-4 text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-rose-500 text-base">cancel</span>
                  <span>Mechanical translations missing regional tenancy nuances</span>
                </div>
                <div className="col-span-4 font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-emerald-500 text-base">check_circle</span>
                  <span>Native Indic speech recognition across 12 regional languages</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 9. RECOVERIES SECURED BY EVERYDAY LITIGANTS (Stitch Screen 01 Testimonials) */}
        <section className="w-full pt-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                Citizen Impact &amp; Proven Outcomes
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
                Recoveries Secured by Everyday Litigants
              </h2>
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
              <span className="material-symbols-outlined text-emerald-500 text-base">verified</span>
              <span>Independent Case Docket Audits</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Story 1: Bengaluru */}
            <div className="bg-white dark:bg-[#0F131C] p-6 rounded-2xl border border-slate-200 dark:border-[#1E293B] shadow-sm flex flex-col justify-between">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-[#161F30] px-2.5 py-0.5 rounded-full">
                    Bengaluru, KA
                  </span>
                  <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">savings</span>
                    <span>₹40,000 Recovered</span>
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed">
                  &ldquo;My broker in Whitefield claimed &apos;painting charges&apos; took my full deposit. Legal Saathi generated an MTA Sec 21 demand notice citing Bangalore Urban Rent Authority. He refunded within 72 hours.&rdquo;
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-[#1E293B] flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-[#161F30] text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center text-xs">
                  KS
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Kavita S.</div>
                  <div className="text-[11px] text-slate-500">Software Engineer, Whitefield</div>
                </div>
              </div>
            </div>

            {/* Story 2: Gurugram */}
            <div className="bg-white dark:bg-[#0F131C] p-6 rounded-2xl border border-slate-200 dark:border-[#1E293B] shadow-sm flex flex-col justify-between">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-[#161F30] px-2.5 py-0.5 rounded-full">
                    Gurugram, HR
                  </span>
                  <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">savings</span>
                    <span>₹1,80,000 Recovered</span>
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed">
                  &ldquo;Startup closed without paying 3 months salary for 6 junior writers. We pooled our complaint on Legal Saathi. A collective notice under Payment of Wages was filed, forcing directors to clear dues.&rdquo;
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-[#1E293B] flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-[#161F30] text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center text-xs">
                  RM
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Rajesh M. &amp; Team</div>
                  <div className="text-[11px] text-slate-500">Content Team (6 Employees)</div>
                </div>
              </div>
            </div>

            {/* Story 3: Saket, Delhi */}
            <div className="bg-white dark:bg-[#0F131C] p-6 rounded-2xl border border-slate-200 dark:border-[#1E293B] shadow-sm flex flex-col justify-between">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-[#161F30] px-2.5 py-0.5 rounded-full">
                    Saket, South Delhi
                  </span>
                  <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">savings</span>
                    <span>₹65,000 Recovered</span>
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed">
                  &ldquo;Landlord refused deposit return citing arbitrary repainting. Legal Saathi generated a Section 13(2) Model Tenancy Act demand notice with evidence checklist. Full deposit refunded within 14 days.&rdquo;
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-[#1E293B] flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-[#161F30] text-amber-600 dark:text-amber-400 font-bold flex items-center justify-center text-xs">
                  AS
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Anita Sharma</div>
                  <div className="text-[11px] text-slate-500">Tenant, Case LS-2026-0042</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 10. DO NOT LET INJUSTICE BECOME YOUR HABIT (Stitch Screen 01 Final CTA Banner) */}
        <section className="w-full bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider mb-3">
              <span className="material-symbols-outlined text-sm">shield</span>
              <span>Article 39A Constitutional Mandate • Legal Aid For All</span>
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight">
              Do Not Let Injustice Become Your Habit.
            </h2>
            <p className="text-blue-100 text-sm sm:text-base mt-2 leading-relaxed">
              No citizen in India should surrender their rightful money, job dignity, or home because legal help was too expensive. Ask Legal Saathi right now.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <a
              href="tel:15100"
              className="px-6 py-3.5 rounded-xl bg-white text-blue-900 font-bold text-xs sm:text-sm shadow-lg hover:bg-slate-100 transition-colors flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-lg text-emerald-600">phone_in_talk</span>
              <span>Direct NALSA Call (15100)</span>
            </a>
            <a
              href="#intake-section"
              className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm border border-white/30 transition-colors flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">edit_note</span>
              <span>Draft Notice For Free</span>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
