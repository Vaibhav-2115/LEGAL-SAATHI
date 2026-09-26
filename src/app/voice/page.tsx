'use client';

import React from 'react';
import Link from 'next/link';
import { CaseContextBanner } from '../../components/CaseContextBanner';
import { VoiceAssistantPanel } from '../../components/VoiceAssistantPanel';

export default function VoicePage() {
  return (
    <div className="w-full min-h-screen bg-background text-on-surface pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
        {/* Navigation Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-on-surface-variant">
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="text-primary dark:text-primary-fixed hover:text-secondary font-semibold transition-colors"
            >
              Dashboard
            </Link>
            <span>/</span>
            <Link
              href="/chat"
              className="text-primary dark:text-primary-fixed hover:text-secondary font-semibold transition-colors"
            >
              Legal Assistant
            </Link>
            <span>/</span>
            <span className="text-on-surface font-bold">Voice Assistant</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
            <span className="font-mono text-xs">Indic Speech Recognition Engine</span>
          </div>
        </div>

        {/* Case Context Banner */}
        <CaseContextBanner currentActionTitle="Voice-First Problem Intake & Consultation" />

        {/* Hero Banner */}
        <div className="text-center max-w-2xl mx-auto mb-2">
          <span className="text-[10px] font-bold text-secondary uppercase tracking-wider font-mono bg-secondary-fixed text-on-secondary-fixed-variant px-2.5 py-0.5 rounded-full">
            ACCESSIBLE CIVIC SPEECH INTERFACE
          </span>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-primary dark:text-primary-fixed tracking-tight mt-1.5">
            Speak Directly to Legal Saathi
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-1.5 leading-relaxed">
            Explain your situation naturally without legal jargon. We transcribe your words, extract key facts,
            and ground your issue in verifiable Indian law.
          </p>
        </div>

        {/* Main Voice Assistant Panel */}
        <VoiceAssistantPanel />
      </div>
    </div>
  );
}
