'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLegalSaathi } from '../context/LegalSaathiContext';
import { VoiceState } from '../lib/types';

export const VoiceAssistantPanel: React.FC = () => {
  const router = useRouter();
  const { createCaseFromProblem, addChatMessage } = useLegalSaathi();

  const [voiceState, setVoiceState] = useState<VoiceState>('IDLE');
  const [language, setLanguage] = useState('Hindi');
  const [transcript, setTranscript] = useState('');
  const [timerSeconds, setTimerSeconds] = useState(0);
  const recognitionRef = React.useRef<any>(null);

  // Timer simulation during listening
  useEffect(() => {
    if (voiceState !== 'LISTENING') return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => prev + 1);
    }, 1000);
    return () => {
      clearInterval(interval);
      setTimerSeconds(0);
    };
  }, [voiceState]);

  const startListening = () => {
    setVoiceState('LISTENING');
    setTranscript('');

    const SpeechRecognition = typeof window !== 'undefined'
      ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      : null;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = language === 'Hindi' ? 'hi-IN'
          : language === 'Tamil' ? 'ta-IN'
          : language === 'Marathi' ? 'mr-IN'
          : 'en-IN';

        recognition.onresult = (event: any) => {
          let current = '';
          for (let i = 0; i < event.results.length; i++) {
            current += event.results[i][0].transcript;
          }
          if (current.trim()) {
            setTranscript(current.trim());
          }
        };

        recognition.onend = () => {
          setVoiceState('TRANSCRIPT');
        };

        recognition.onerror = () => {
          setVoiceState('TRANSCRIPT');
        };

        recognition.start();
        recognitionRef.current = recognition;
        return;
      } catch (err) {
        console.warn('SpeechRecognition failed to start:', err);
      }
    }

    // Graceful fallback if SpeechRecognition is not permitted or unavailable
    setTimeout(() => {
      setVoiceState('TRANSCRIPT');
    }, 2000);
  };

  const handleRecordAgain = () => {
    setTranscript('');
    startListening();
  };

  const handleCancel = () => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
    }
    setVoiceState('IDLE');
    setTranscript('');
  };

  const handleConfirmAndContinue = () => {
    setVoiceState('CONFIRM');
    if (transcript.trim()) {
      createCaseFromProblem(transcript.trim());
      addChatMessage(transcript.trim());
      setTimeout(() => {
        router.push('/chat');
      }, 600);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-surface-container-lowest dark:bg-[#0F131C] rounded-3xl p-6 sm:p-10 shadow-lg border border-outline-variant/30 flex flex-col items-center text-center gap-8">
      {/* Top Language & Accessibility Bar */}
      <div className="w-full flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-outline-variant/30 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-bold text-on-surface uppercase tracking-wider text-[11px]">
            Multilingual Voice Interface
          </span>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="voice-lang-select" className="text-on-surface-variant font-medium">
            Spoken Language:
          </label>
          <select
            id="voice-lang-select"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-surface-container-low dark:bg-[#161F30] border border-outline-variant/40 text-on-surface font-semibold focus:outline-none focus:ring-1 focus:ring-secondary text-xs"
          >
            <option value="Hindi">हिन्दी (Hindi)</option>
            <option value="English">English</option>
            <option value="Tamil">தமிழ் (Tamil)</option>
            <option value="Marathi">मराठी (Marathi)</option>
            <option value="Bengali">বাংলা (Bengali)</option>
            <option value="Telugu">తెలుగు (Telugu)</option>
          </select>
        </div>
      </div>

      {/* Main Microphone Interaction Circle */}
      <div className="flex flex-col items-center gap-5">
        <div className="relative">
          {voiceState === 'LISTENING' && (
            <>
              <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping"></div>
              <div className="absolute -inset-4 rounded-full bg-secondary/15 animate-pulse"></div>
            </>
          )}

          <button
            onClick={voiceState === 'IDLE' ? startListening : voiceState === 'LISTENING' ? () => setVoiceState('PROCESSING') : undefined}
            disabled={voiceState === 'PROCESSING'}
            aria-label={
              voiceState === 'IDLE'
                ? 'Start speaking to Legal Saathi'
                : voiceState === 'LISTENING'
                ? 'Stop recording'
                : 'Processing audio'
            }
            className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl relative z-10 focus:outline-none focus:ring-4 focus:ring-secondary/40 ${
              voiceState === 'LISTENING'
                ? 'bg-red-600 text-white scale-105'
                : voiceState === 'PROCESSING'
                ? 'bg-amber-500 text-white animate-spin'
                : voiceState === 'TRANSCRIPT'
                ? 'bg-emerald-600 text-white'
                : 'bg-primary hover:bg-secondary text-white hover:scale-105'
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-4xl sm:text-5xl">
              {voiceState === 'LISTENING'
                ? 'graphic_eq'
                : voiceState === 'PROCESSING'
                ? 'sync'
                : voiceState === 'TRANSCRIPT'
                ? 'check'
                : 'mic'}
            </span>
          </button>
        </div>

        {/* Status Indicator & Live Wave Simulation */}
        <div className="flex flex-col items-center gap-2">
          {voiceState === 'IDLE' && (
            <>
              <h3 className="font-heading text-xl sm:text-2xl font-extrabold text-on-surface">
                Tap the microphone to speak
              </h3>
              <p className="text-xs text-on-surface-variant max-w-md leading-relaxed">
                Describe your legal issue in your natural mother tongue. Legal Saathi will transcribe,
                ground your facts in Indian law, and guide your next steps.
              </p>
            </>
          )}

          {voiceState === 'LISTENING' && (
            <>
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold text-sm uppercase tracking-wider">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping"></span>
                <span>Listening in {language}... ({timerSeconds}s)</span>
              </div>
              {/* Simulated Sound Wave */}
              <div className="flex items-center gap-1 h-8 mt-1">
                {[4, 12, 24, 18, 32, 20, 14, 28, 16, 8, 22, 10].map((h, i) => (
                  <div
                    key={i}
                    style={{ height: `${h}px` }}
                    className="w-1.5 bg-secondary rounded-full animate-pulse"
                  ></div>
                ))}
              </div>
              <span className="text-[11px] text-on-surface-variant">Tap mic again when finished</span>
            </>
          )}

          {voiceState === 'PROCESSING' && (
            <>
              <span className="text-amber-600 dark:text-amber-400 font-bold text-sm flex items-center gap-2">
                <span>Transcribing & Normalizing Indian Dialect...</span>
              </span>
              <p className="text-xs text-on-surface-variant">
                Converting regional speech to structured legal facts.
              </p>
            </>
          )}

          {(voiceState === 'TRANSCRIPT' || voiceState === 'CONFIRM') && (
            <span className="text-emerald-700 dark:text-emerald-400 font-bold text-sm flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base">check_circle</span>
              <span>Transcript Ready for Review</span>
            </span>
          )}
        </div>
      </div>

      {/* Editable Transcript Box (Never Hidden) */}
      {(voiceState === 'TRANSCRIPT' || voiceState === 'CONFIRM') && (
        <div className="w-full bg-surface-container-low dark:bg-[#161F30] rounded-2xl p-5 border border-outline-variant/40 text-left flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-on-surface uppercase tracking-wider text-[11px] flex items-center gap-1">
              <span className="material-symbols-outlined text-secondary text-sm">record_voice_over</span>
              Citizen Statement Transcript:
            </span>
            <span className="text-[11px] text-on-surface-variant">You may edit before submitting</span>
          </div>

          <textarea
            rows={4}
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            className="w-full p-3 rounded-xl bg-surface-container-lowest dark:bg-[#0F131C] border border-outline-variant/40 text-xs text-on-surface leading-relaxed focus:outline-none focus:ring-1 focus:ring-secondary font-medium"
            placeholder="Edit or add details to the transcribed statement..."
          />

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2">
              <button
                onClick={handleRecordAgain}
                className="px-3 py-1.5 rounded-lg bg-surface-container-lowest dark:bg-[#0F131C] hover:bg-surface-container-high text-xs font-semibold text-on-surface border border-outline-variant/40 transition-colors flex items-center gap-1"
                type="button"
              >
                <span className="material-symbols-outlined text-sm">refresh</span>
                <span>Record Again</span>
              </button>

              <button
                onClick={handleCancel}
                className="px-3 py-1.5 rounded-lg hover:bg-surface-container-high text-xs text-on-surface-variant transition-colors"
                type="button"
              >
                Cancel
              </button>
            </div>

            <button
              onClick={handleConfirmAndContinue}
              className="px-5 py-2.5 rounded-xl bg-primary hover:bg-secondary text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
              type="button"
            >
              <span>Use This & Consult Legal Assistant</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
