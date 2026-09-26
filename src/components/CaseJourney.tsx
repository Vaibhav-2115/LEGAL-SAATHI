import React from 'react';
import { CaseStage } from '../lib/types';

interface CaseJourneyProps {
  currentStage: CaseStage;
  className?: string;
}

const STAGES: { stage: CaseStage; label: string; icon: string; description: string }[] = [
  { stage: 'ASK', label: 'Ask', icon: 'help_outline', description: 'Problem Stated' },
  { stage: 'UNDERSTAND', label: 'Understand', icon: 'psychology', description: 'Rights Mapped' },
  { stage: 'VERIFY', label: 'Verify', icon: 'fact_check', description: 'Evidence Checked' },
  { stage: 'EXPLAIN', label: 'Explain', icon: 'gavel', description: 'Law Applied' },
  { stage: 'ACT', label: 'Act', icon: 'send_and_archive', description: 'Notice & Filing' },
  { stage: 'UNITE', label: 'Unite', icon: 'groups', description: 'Collective Action' }
];

export const CaseJourney: React.FC<CaseJourneyProps> = ({ currentStage, className = '' }) => {
  const currentIndex = STAGES.findIndex((s) => s.stage === currentStage);

  return (
    <div className={`w-full bg-surface-container-lowest dark:bg-[#0F131C] rounded-xl p-4 sm:p-5 shadow-sm border border-outline-variant/30 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="font-heading text-sm font-bold text-primary dark:text-primary-fixed uppercase tracking-wider">
            Case Progression Journey
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-secondary-fixed/40 text-on-secondary-fixed-variant font-medium">
            Stage {currentIndex + 1} of 6
          </span>
        </div>
        <span className="text-xs text-on-surface-variant font-medium hidden sm:inline">
          Active: <strong className="text-primary dark:text-primary-fixed">{currentStage}</strong>
        </span>
      </div>

      <div className="grid grid-cols-6 gap-1 sm:gap-2 items-center relative">
        {STAGES.map((s, idx) => {
          const isPast = idx < currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <div key={s.stage} className="flex flex-col items-center text-center group">
              <div
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 relative z-10 ${
                  isCurrent
                    ? 'bg-primary text-on-primary ring-4 ring-primary-fixed/50 shadow-md font-bold'
                    : isPast
                    ? 'bg-emerald-600 text-white font-semibold'
                    : 'bg-surface-container-low dark:bg-[#161F30] text-on-surface-variant'
                }`}
              >
                {isPast ? (
                  <span className="material-symbols-outlined text-base sm:text-lg">check</span>
                ) : (
                  <span className="material-symbols-outlined text-sm sm:text-base">{s.icon}</span>
                )}
              </div>
              <span
                className={`text-[11px] sm:text-xs font-semibold mt-1.5 truncate max-w-full ${
                  isCurrent
                    ? 'text-primary dark:text-primary-fixed font-bold'
                    : isPast
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-on-surface-variant'
                }`}
              >
                {s.label}
              </span>
              <span className="text-[10px] text-on-surface-variant/70 hidden md:block">
                {s.description}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
