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
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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
    const element = document.getElementById('intake-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: 'What is Legal Saathi and how does it help citizens?',
      a: 'Legal Saathi is an AI-powered civic legal companion designed for everyday citizens across India. It breaks down complex statutory acts (like the Model Tenancy Act, Consumer Protection Act, RERA, and BNS) into plain-language rights, audits corroborating evidence, and formats court-ready notices.'
    },
    {
      q: 'Does Legal Saathi replace a licensed advocate in court?',
      a: 'No. Legal Saathi provides structured legal information, statutory citations, and document preparation tools to empower self-representation and early dispute resolution. For contested courtroom litigation, users should consult an advocate enrolled with the Bar Council or visit their local DLSA.'
    },
    {
      q: 'Which regional Indian languages are supported?',
      a: 'Legal Saathi supports voice and text input in English, हिन्दी (Hindi), தமிழ் (Tamil), मराठी (Marathi), తెలుగు (Telugu), and বাংলা (Bengali), allowing citizens to describe their legal grievances naturally in their mother tongue.'
    },
    {
      q: 'How does the evidence checklist work?',
      a: 'When you describe your dispute, Legal Saathi identifies the exact corroborating documents needed by magistrates or consumer forums (e.g. lease deeds, payment transaction receipts, WhatsApp notice screenshots) and generates an admissibility checklist.'
    },
    {
      q: 'Can I get free legal aid through this platform?',
      a: 'Yes. If you qualify under Article 39A of the Constitution of India (women, senior citizens, marginalized communities, or low-income earners), Legal Saathi provides comprehensive guidance on visiting your District Legal Services Authority (DLSA) or connecting via national helpline 15100.'
    },
    {
      q: 'Is my complaint data confidential and secure?',
      a: 'Yes. All citizen problem statements and attached evidence files are handled with strict cryptographic privacy, ensuring your dispute details remain completely confidential and secure.'
    }
  ];

  return (
    <div className="w-full min-h-screen bg-slate-50/60 dark:bg-[#090D16] text-slate-900 dark:text-slate-100 transition-colors">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/80 via-slate-50/40 to-transparent dark:from-[#0B101D] dark:via-[#090D16] dark:to-transparent pt-10 pb-16 sm:pt-16 sm:pb-20 border-b border-slate-200/80 dark:border-[#1E293B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            {/* Top Civic Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/60 text-xs font-bold tracking-wider uppercase mb-6 shadow-2xs">
              <span className="material-symbols-outlined text-sm text-primary dark:text-blue-400">gavel</span>
              <span>Civic Legal Portal • Bilingual Indic Assistance</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.12]">
              Understand Your Rights.{' '}
              <span className="text-primary dark:text-blue-400">Take the Next Step.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 mt-5 max-w-2xl leading-relaxed">
              Legal Saathi helps you understand legal information, organize your complaint, and find relevant guidance for your situation under Indian law without confusing jargon or high initial costs.
            </p>

            {/* Action CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-8">
              <a
                href="#intake-section"
                className="px-6 py-3.5 rounded-xl bg-primary hover:bg-[#001A54] dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-bold text-sm shadow-sm hover:shadow-md transition-all flex items-center gap-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <span className="material-symbols-outlined text-lg">edit_note</span>
                <span>Get Started Free</span>
              </a>
              <Link
                href="/cases/LS-2026-0042"
                className="px-6 py-3.5 rounded-xl bg-white dark:bg-[#161F30] hover:bg-slate-50 dark:hover:bg-[#1E293B] border border-slate-200/80 dark:border-[#1E293B] text-slate-800 dark:text-slate-200 font-bold text-sm transition-all flex items-center gap-2 shadow-xs"
              >
                <span className="material-symbols-outlined text-lg text-primary dark:text-blue-400">folder_open</span>
                <span>Explore Sample Case Dossier</span>
              </Link>
              <Link
                href="/chat"
                className="px-5 py-3.5 rounded-xl bg-slate-100 dark:bg-[#161F30]/70 hover:bg-slate-200 dark:hover:bg-[#1E293B] text-slate-700 dark:text-slate-300 font-semibold text-sm transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-lg text-slate-600 dark:text-slate-400">chat</span>
                <span>Consult Assistant</span>
              </Link>
            </div>

            {/* Vernacular Voice Snippet Preview */}
            <div className="mt-8 p-4 rounded-xl bg-white dark:bg-[#0F131C] border border-slate-200/80 dark:border-[#1E293B] shadow-xs max-w-2xl text-left flex items-start gap-3 w-full">
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-[#161F30] text-primary dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-lg">record_voice_over</span>
              </div>
              <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                <span className="font-bold text-slate-900 dark:text-white block sm:inline">Citizen Voice Example: </span>
                <span className="italic text-slate-600 dark:text-slate-400">
                  &ldquo;मकान मालिक 11 महीने बाद ₹55,000 का सिक्योरिटी डिपॉजिट वापस नहीं कर रहा है। बिना 30 दिन का नोटिस खाली करवा रहा है।&rdquo;
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTAINER */}
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-12 sm:gap-16">
        {/* 2. ACTIVE CASE QUICK-RESUME BAR */}
        {activeCase && (
          <section className="w-full">
            <div className="bg-white dark:bg-[#0F131C] rounded-2xl p-5 sm:p-6 shadow-xs hover:shadow-sm transition-all border border-slate-200/80 dark:border-[#1E293B] flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-start sm:items-center gap-4 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-[#161F30] border border-blue-200/60 dark:border-[#1E293B] flex items-center justify-center shrink-0 text-primary dark:text-blue-400">
                  <span className="material-symbols-outlined text-2xl animate-pulse">pending_actions</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-xs uppercase tracking-wider text-primary dark:text-blue-400 font-bold">
                      Active Dispute In Progress
                    </span>
                    <CaseStatusBadge status={activeCase.status} size="sm" />
                    <span className="text-xs text-slate-500 dark:text-slate-400">• Updated {activeCase.updatedAt}</span>
                  </div>
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className="font-heading text-lg sm:text-xl font-bold text-slate-900 dark:text-white truncate">
                      {activeCase.title}
                    </span>
                    <span className="text-xs text-slate-600 dark:text-slate-400 font-mono bg-slate-100 dark:bg-[#161F30] border border-slate-200/60 dark:border-[#1E293B] px-2 py-0.5 rounded">
                      Dossier: {activeCase.id}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base text-primary dark:text-blue-400">arrow_forward</span>
                    <span>
                      Next Step: {activeCase.nextStep?.title} (
                      <strong className="text-slate-900 dark:text-white">
                        {activeCase.collectedEvidenceCount} of {activeCase.totalEvidenceCount} items verified
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
                  <span>All Dockets ({cases.length})</span>
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </Link>
                <Link
                  href={`/cases/${activeCase.id}`}
                  className="px-5 py-2.5 rounded-lg bg-primary hover:bg-[#001A54] dark:bg-blue-600 dark:hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-2"
                >
                  <span>Open Workspace</span>
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* 3. MAIN INTERACTIVE INTAKE CARD */}
        <section id="intake-section" className="flex flex-col items-center text-center max-w-4xl mx-auto w-full">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 border border-blue-200/80 dark:border-blue-800/40 text-xs font-semibold tracking-wider uppercase mb-3">
            <span className="material-symbols-outlined text-sm text-primary dark:text-blue-400">verified_user</span>
            Step 1 • Plain Language Intake
          </div>

          <h2 className="font-heading text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight max-w-3xl leading-tight">
            What legal problem are you facing?
          </h2>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2 max-w-2xl leading-relaxed">
            Explain in plain words, record a voice note, or choose your language. Legal Saathi breaks down complex statutes into plain facts, verified rights, and concrete next actions.
          </p>

          {/* Large Problem Card */}
          <form
            onSubmit={handleAnalyze}
            className="w-full mt-6 bg-white dark:bg-[#0F131C] rounded-2xl shadow-sm hover:shadow-md border border-slate-200/80 dark:border-[#1E293B] p-5 sm:p-7 text-left transition-all"
          >
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-[#1E293B]">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base text-primary dark:text-blue-400">edit_note</span>
                Describe Your Situation
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Confidential • Guided by Indian Statute
              </span>
            </div>

            <textarea
              value={problemText}
              onChange={(e) => setProblemText(e.target.value)}
              rows={4}
              placeholder="Describe what happened in your own words (e.g. 'My landlord refuses to return my security deposit of ₹45,000 even after I vacated the flat with 30 days notice...')"
              className="w-full bg-transparent text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 resize-none text-base focus:outline-none leading-relaxed"
            />

            {/* Attached file chip */}
            {attachedFileName && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-[#161F30] text-blue-800 dark:text-blue-300 text-xs font-medium my-2 border border-blue-200/60 dark:border-[#1E293B]">
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
                    {voiceState === 'LISTENING' && 'Listening to your speech... Speak clearly in your mother tongue.'}
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
            <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100 dark:border-[#1E293B] mt-2">
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
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary hover:bg-[#001A54] dark:bg-blue-600 dark:hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none text-white text-xs sm:text-sm font-bold shadow-sm transition-all focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <span>Analyze Problem</span>
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </button>
            </div>
          </form>
        </section>

        {/* 4. COMMON CITIZEN MATTERS QUICK-TEMPLATES */}
        <section className="w-full">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Common Citizen Legal Situations (Click to load template)
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {EXAMPLE_QUESTIONS.map((ex) => (
              <button
                key={ex.title}
                type="button"
                onClick={() => handleSelectExample(ex.prompt)}
                className="p-5 rounded-2xl bg-white dark:bg-[#0F131C] border border-slate-200/80 dark:border-[#1E293B] hover:border-blue-500/60 dark:hover:border-blue-500/60 text-left transition-all hover:shadow-xs flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-[#161F30] flex items-center justify-center text-primary dark:text-blue-400 group-hover:scale-105 transition-transform">
                      <span className="material-symbols-outlined text-xl">{ex.icon}</span>
                    </span>
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-[#161F30] border border-slate-200/60 dark:border-[#1E293B] text-slate-600 dark:text-slate-400 font-semibold">
                      {ex.tag}
                    </span>
                  </div>
                  <h3 className="font-heading text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary dark:group-hover:text-blue-400 transition-colors">
                    {ex.title}
                  </h3>
                </div>
                <span className="text-xs text-primary dark:text-blue-400 font-bold mt-4 flex items-center gap-1">
                  <span>Use Template</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* 5. TRUST & VALUE PROPOSITIONS (5 Core Civic Pillars) */}
        <section className="w-full pt-4">
          <div className="text-center mb-8 sm:mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-800">
              Civic Trust &amp; Evidence Grounding
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
              Why Legal Saathi Works For Everyday Citizens
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl mx-auto">
              Built specifically to overcome language barriers, document disorganization, and excessive initial legal consultation hurdles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Pillar 1 */}
            <div className="bg-white dark:bg-[#0F131C] p-6 rounded-2xl border border-slate-200/80 dark:border-[#1E293B] shadow-xs flex flex-col gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-[#161F30] text-primary dark:text-blue-400 flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">translate</span>
              </div>
              <h3 className="font-heading text-base font-bold text-slate-900 dark:text-white">
                Plain-Language Rights Translation
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Converts dense statutes into simple, actionable explanations. Understand your exact legal rights under Indian Acts without Latin jargon.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="bg-white dark:bg-[#0F131C] p-6 rounded-2xl border border-slate-200/80 dark:border-[#1E293B] shadow-xs flex flex-col gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-[#161F30] text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">fact_check</span>
              </div>
              <h3 className="font-heading text-base font-bold text-slate-900 dark:text-white">
                Fact &amp; Timeline Structuring
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Separates legally verifiable facts from emotional distress. Automatically builds a chronological event sequence with key transaction dates.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="bg-white dark:bg-[#0F131C] p-6 rounded-2xl border border-slate-200/80 dark:border-[#1E293B] shadow-xs flex flex-col gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-[#161F30] text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">rule</span>
              </div>
              <h3 className="font-heading text-base font-bold text-slate-900 dark:text-white">
                Evidentiary Completeness Audit
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Audits your receipts, agreements, and notices. Identifies missing documents before filing so your claim is not rejected on technical grounds.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="bg-white dark:bg-[#0F131C] p-6 rounded-2xl border border-slate-200/80 dark:border-[#1E293B] shadow-xs flex flex-col gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-[#161F30] text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">drafts</span>
              </div>
              <h3 className="font-heading text-base font-bold text-slate-900 dark:text-white">
                Statutory Notice Drafting
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Drafts formal demand notices (e.g. 15-day Model Tenancy Act demand or RTI request) adhering strictly to standard legal conventions.
              </p>
            </div>

            {/* Pillar 5 */}
            <div className="bg-white dark:bg-[#0F131C] p-6 rounded-2xl border border-slate-200/80 dark:border-[#1E293B] shadow-xs flex flex-col gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-[#161F30] text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">security</span>
              </div>
              <h3 className="font-heading text-base font-bold text-slate-900 dark:text-white">
                Confidential Citizen Privacy
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Your personal details, evidence records, and complaint histories are protected with strict client privacy safe harbors and encryption.
              </p>
            </div>

            {/* Pillar 6 */}
            <div className="bg-white dark:bg-[#0F131C] p-6 rounded-2xl border border-slate-200/80 dark:border-[#1E293B] shadow-xs flex flex-col gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-[#161F30] text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">balance</span>
              </div>
              <h3 className="font-heading text-base font-bold text-slate-900 dark:text-white">
                Free Legal Aid Integration
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Connects eligible citizens directly with government District Legal Services Authorities (DLSA) under Article 39A of the Indian Constitution.
              </p>
            </div>
          </div>
        </section>

        {/* 6. HOW IT WORKS (The 5-Step Process Journey) */}
        <section className="w-full pt-4">
          <div className="text-center mb-8 sm:mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-primary dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-800">
              Structured Due Process
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
              From Grievance to Resolution in 5 Clear Steps
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl mx-auto">
              How Legal Saathi structures your dispute into actionable civil legal progress.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            {[
              {
                num: '01',
                title: 'Describe Your Issue',
                desc: 'State your problem in your own words, speak via voice note, or choose regional Indic text.',
                icon: 'edit'
              },
              {
                num: '02',
                title: 'Understand Rights',
                desc: 'Engine maps applicable Indian Bare Acts and clarifies statutory grounds for relief.',
                icon: 'psychology'
              },
              {
                num: '03',
                title: 'Audit Evidence',
                desc: 'Upload agreements and receipts; get a checklist of required proofs and missing facts.',
                icon: 'fact_check'
              },
              {
                num: '04',
                title: 'Review Action Steps',
                desc: 'Evaluate remedies: send formal notice, file in e-Daakhil, or visit DLSA legal clinic.',
                icon: 'send'
              },
              {
                num: '05',
                title: 'Manage Resolution',
                desc: 'Track complaint progress, export structured dossiers, and discover collective action.',
                icon: 'task_alt'
              }
            ].map((step) => (
              <div
                key={step.num}
                className="p-5 rounded-2xl bg-white dark:bg-[#0F131C] border border-slate-200/80 dark:border-[#1E293B] shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-heading text-xl font-extrabold text-primary dark:text-blue-400">
                      {step.num}
                    </span>
                    <span className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-[#161F30] text-primary dark:text-blue-400 flex items-center justify-center">
                      <span className="material-symbols-outlined text-base">{step.icon}</span>
                    </span>
                  </div>
                  <h3 className="font-heading text-sm font-bold text-slate-900 dark:text-white">
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 7. FEATURE OVERVIEW (Verified Core Workspaces) */}
        <section className="w-full pt-4">
          <div className="text-center mb-8 sm:mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
              Live Workspaces &amp; Capabilities
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
              Explore Legal Saathi Workspaces
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl mx-auto">
              All tools are fully functional and available to assist you at each stage of your civil legal journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Feature 1 */}
            <div className="bg-white dark:bg-[#0F131C] p-6 rounded-2xl border border-slate-200/80 dark:border-[#1E293B] shadow-xs flex flex-col justify-between hover:shadow-sm transition-all">
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <span className="p-2.5 rounded-xl bg-blue-50 dark:bg-[#161F30] text-primary dark:text-blue-400">
                    <span className="material-symbols-outlined text-2xl">chat</span>
                  </span>
                  <span className="text-[11px] font-bold text-primary dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-full border border-blue-200/60 dark:border-blue-800/50">
                    Interactive
                  </span>
                </div>
                <h3 className="font-heading text-base font-bold text-slate-900 dark:text-white">
                  Legal Assistant Workspace
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Have an interactive conversation about your legal dispute. Ask clarifying questions and receive grounded statutory citations.
                </p>
              </div>
              <Link
                href="/chat"
                className="mt-4 pt-3 border-t border-slate-100 dark:border-[#1E293B] text-xs font-bold text-primary dark:text-blue-400 hover:underline flex items-center justify-between"
              >
                <span>Open Assistant</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>

            {/* Feature 2 */}
            <div className="bg-white dark:bg-[#0F131C] p-6 rounded-2xl border border-slate-200/80 dark:border-[#1E293B] shadow-xs flex flex-col justify-between hover:shadow-sm transition-all">
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <span className="p-2.5 rounded-xl bg-blue-50 dark:bg-[#161F30] text-primary dark:text-blue-400">
                    <span className="material-symbols-outlined text-2xl">folder_shared</span>
                  </span>
                  <span className="text-[11px] font-bold text-primary dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-full border border-blue-200/60 dark:border-blue-800/50">
                    Case Docket
                  </span>
                </div>
                <h3 className="font-heading text-base font-bold text-slate-900 dark:text-white">
                  My Complaints Dashboard
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Track all your registered grievances, review active claim amounts, verify next action deadlines, and manage case progression.
                </p>
              </div>
              <Link
                href="/complaints"
                className="mt-4 pt-3 border-t border-slate-100 dark:border-[#1E293B] text-xs font-bold text-primary dark:text-blue-400 hover:underline flex items-center justify-between"
              >
                <span>View My Complaints</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>

            {/* Feature 3 */}
            <div className="bg-white dark:bg-[#0F131C] p-6 rounded-2xl border border-slate-200/80 dark:border-[#1E293B] shadow-xs flex flex-col justify-between hover:shadow-sm transition-all">
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <span className="p-2.5 rounded-xl bg-blue-50 dark:bg-[#161F30] text-primary dark:text-blue-400">
                    <span className="material-symbols-outlined text-2xl">workspaces</span>
                  </span>
                  <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200/60 dark:border-emerald-800/50">
                    Verified Sample
                  </span>
                </div>
                <h3 className="font-heading text-base font-bold text-slate-900 dark:text-white">
                  Case Workspace &amp; Fact Matrix
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Deep-dive into a structured legal case: review the citizen statement, evidentiary checklist, bare-act citations, and chronology.
                </p>
              </div>
              <Link
                href="/cases/LS-2026-0042"
                className="mt-4 pt-3 border-t border-slate-100 dark:border-[#1E293B] text-xs font-bold text-primary dark:text-blue-400 hover:underline flex items-center justify-between"
              >
                <span>Explore Security Deposit Case</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>

            {/* Feature 4 */}
            <div className="bg-white dark:bg-[#0F131C] p-6 rounded-2xl border border-slate-200/80 dark:border-[#1E293B] shadow-xs flex flex-col justify-between hover:shadow-sm transition-all">
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <span className="p-2.5 rounded-xl bg-amber-50 dark:bg-[#161F30] text-amber-600 dark:text-amber-400">
                    <span className="material-symbols-outlined text-2xl">verified</span>
                  </span>
                  <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-200/60 dark:border-amber-800/50">
                    Integrity Audit
                  </span>
                </div>
                <h3 className="font-heading text-base font-bold text-slate-900 dark:text-white">
                  Evidence Dossier &amp; Hashes
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Inspect uploaded legal contracts, rent agreements, and receipts with SHA-256 cryptographic hashes for court tamper-proofing.
                </p>
              </div>
              <Link
                href="/cases/LS-2026-0042/evidence"
                className="mt-4 pt-3 border-t border-slate-100 dark:border-[#1E293B] text-xs font-bold text-primary dark:text-blue-400 hover:underline flex items-center justify-between"
              >
                <span>View Evidence Gallery</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>

            {/* Feature 5 */}
            <div className="bg-white dark:bg-[#0F131C] p-6 rounded-2xl border border-slate-200/80 dark:border-[#1E293B] shadow-xs flex flex-col justify-between hover:shadow-sm transition-all">
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <span className="p-2.5 rounded-xl bg-purple-50 dark:bg-[#161F30] text-purple-600 dark:text-purple-400">
                    <span className="material-symbols-outlined text-2xl">menu_book</span>
                  </span>
                  <span className="text-[11px] font-bold text-purple-800 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 px-2.5 py-0.5 rounded-full border border-purple-200/60 dark:border-purple-800/50">
                    Statutory Library
                  </span>
                </div>
                <h3 className="font-heading text-base font-bold text-slate-900 dark:text-white">
                  Legal Sources &amp; Bare Acts
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Search full text of Indian Bare Acts, central gazettes, and state rules governing tenancy, employment, consumer disputes, and RTI.
                </p>
              </div>
              <Link
                href="/sources"
                className="mt-4 pt-3 border-t border-slate-100 dark:border-[#1E293B] text-xs font-bold text-primary dark:text-blue-400 hover:underline flex items-center justify-between"
              >
                <span>Explore Legal Sources</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>

            {/* Feature 6 */}
            <div className="bg-white dark:bg-[#0F131C] p-6 rounded-2xl border border-slate-200/80 dark:border-[#1E293B] shadow-xs flex flex-col justify-between hover:shadow-sm transition-all">
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <span className="p-2.5 rounded-xl bg-rose-50 dark:bg-[#161F30] text-rose-600 dark:text-rose-400">
                    <span className="material-symbols-outlined text-2xl">balance</span>
                  </span>
                  <span className="text-[11px] font-bold text-rose-800 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 px-2.5 py-0.5 rounded-full border border-rose-200/60 dark:border-rose-800/50">
                    Govt Legal Aid
                  </span>
                </div>
                <h3 className="font-heading text-base font-bold text-slate-900 dark:text-white">
                  DLSA Legal Aid Guidance
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Step-by-step guidance on accessing free panel advocates, Lok Adalat conciliation, and court fee exemptions under Article 39A.
                </p>
              </div>
              <Link
                href="/dlsa"
                className="mt-4 pt-3 border-t border-slate-100 dark:border-[#1E293B] text-xs font-bold text-primary dark:text-blue-400 hover:underline flex items-center justify-between"
              >
                <span>Access DLSA Aid Info</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
          </div>
        </section>

        {/* 8. LEGAL AWARENESS & RESPONSIBLE AI SAFE HARBOR */}
        <section className="w-full bg-slate-100 dark:bg-[#0F131C] rounded-2xl p-6 sm:p-8 border border-slate-200/80 dark:border-[#1E293B] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-[#161F30] text-primary dark:text-blue-400 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-2xl">policy</span>
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary dark:text-blue-400">
                Ethical Legal AI Safe Harbor
              </span>
              <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                Statutory Information, Not Licensed Advocacy
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-3xl leading-relaxed">
                Legal Saathi provides grounded statutory legal information and workflow documentation. It does not replace professional courtroom representation. For contested trial advocacy, consult an enrolled advocate or reach out to government legal services via the national helpline.
              </p>
            </div>
          </div>

          <a
            href="tel:15100"
            className="px-5 py-3 rounded-xl bg-white dark:bg-[#161F30] hover:bg-slate-50 dark:hover:bg-[#1E293B] text-slate-900 dark:text-white border border-slate-200/80 dark:border-[#1E293B] text-xs font-bold shrink-0 transition-colors flex items-center gap-2 shadow-xs"
          >
            <span className="material-symbols-outlined text-emerald-600 text-base">phone_in_talk</span>
            <span>NALSA Helpline: 15100</span>
          </a>
        </section>

        {/* 9. FREQUENTLY ASKED QUESTIONS (Interactive Accordion) */}
        <section className="w-full pt-4">
          <div className="text-center mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-primary dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-800">
              Common Questions
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl mx-auto">
              Clear, transparent answers about how Legal Saathi assists everyday litigants.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={faq.q}
                  className="rounded-xl bg-white dark:bg-[#0F131C] border border-slate-200/80 dark:border-[#1E293B] overflow-hidden transition-all shadow-xs"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    className="w-full p-4 sm:p-5 text-left font-heading text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-[#161F30]/50 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <span className="material-symbols-outlined text-slate-500 transition-transform duration-200 text-lg shrink-0">
                      {isOpen ? 'expand_less' : 'expand_more'}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-[#1E293B]">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* 10. FINAL CALL TO ACTION BANNER */}
        <section className="w-full bg-gradient-to-r from-blue-900 via-primary to-indigo-950 rounded-3xl p-8 sm:p-12 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-bold uppercase tracking-wider mb-3">
              <span className="material-symbols-outlined text-sm">shield</span>
              <span>Article 39A Constitutional Mandate • Legal Access For All</span>
            </div>
            <h2 className="font-heading text-2xl sm:text-4xl font-extrabold text-white leading-tight">
              Democratizing Civil Justice For Every Citizen.
            </h2>
            <p className="text-blue-100 text-xs sm:text-base mt-2.5 leading-relaxed">
              No citizen in India should surrender their rightful money, tenancy dignity, or employment dues because legal guidance was inaccessible. Ask Legal Saathi right now.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full sm:w-auto">
            <a
              href="#intake-section"
              className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-primary font-bold text-xs sm:text-sm shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">edit_note</span>
              <span>Start Your Intake Free</span>
            </a>
            <a
              href="tel:15100"
              className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm border border-white/25 transition-colors flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-lg text-emerald-400">phone_in_talk</span>
              <span>NALSA Helpline (15100)</span>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
