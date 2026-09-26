'use client';

import React from 'react';
import Link from 'next/link';

export interface ActionCardData {
  id: string;
  title: string;
  badge: string;
  icon: string;
  colorScheme: 'primary' | 'secondary' | 'amber' | 'emerald' | 'indigo' | 'purple';
  whatItDoes: string;
  whenItIsUseful: string;
  informationNeeded: string[];
  whatToExpect: string;
  ctaText: string;
  ctaUrl: string;
  isUrgent?: boolean;
}

interface ActionCenterCardProps {
  action: ActionCardData;
}

export const ActionCenterCard: React.FC<ActionCenterCardProps> = ({ action }) => {
  const getColorStyles = (color: string) => {
    switch (color) {
      case 'emerald':
        return {
          iconBg: 'bg-emerald-500 text-white',
          badge: 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
          cta: 'bg-emerald-600 hover:bg-emerald-700 text-white'
        };
      case 'amber':
        return {
          iconBg: 'bg-amber-500 text-white',
          badge: 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800',
          cta: 'bg-amber-600 hover:bg-amber-700 text-white'
        };
      case 'indigo':
      case 'purple':
        return {
          iconBg: 'bg-indigo-600 text-white',
          badge: 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
          cta: 'bg-indigo-600 hover:bg-indigo-700 text-white'
        };
      case 'secondary':
        return {
          iconBg: 'bg-secondary text-white',
          badge: 'bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800',
          cta: 'bg-secondary hover:bg-primary text-white'
        };
      case 'primary':
      default:
        return {
          iconBg: 'bg-primary text-white',
          badge: 'bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-fixed border-primary/20',
          cta: 'bg-primary hover:bg-secondary text-white'
        };
    }
  };

  const styles = getColorStyles(action.colorScheme);

  return (
    <div className="bg-surface-container-lowest dark:bg-[#0F131C] rounded-2xl p-5 sm:p-6 shadow-sm border border-outline-variant/30 hover:border-secondary/40 transition-all flex flex-col justify-between gap-5">
      {/* Top Header */}
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${styles.iconBg}`}>
              <span className="material-symbols-outlined text-2xl">{action.icon}</span>
            </div>
            <div>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border mb-1 ${styles.badge}`}>
                {action.badge}
              </span>
              <h3 className="font-heading text-lg font-bold text-on-surface leading-snug">
                {action.title}
              </h3>
            </div>
          </div>

          {action.isUrgent && (
            <span className="px-2 py-0.5 rounded bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 text-[10px] font-bold uppercase tracking-wider">
              Priority
            </span>
          )}
        </div>

        {/* What It Does */}
        <p className="text-xs text-on-surface-variant leading-relaxed">
          {action.whatItDoes}
        </p>

        {/* When It Is Useful */}
        <div className="bg-surface-container-low dark:bg-[#161F30]/60 rounded-xl p-3 text-xs flex flex-col gap-1">
          <span className="font-bold text-on-surface text-[11px] flex items-center gap-1">
            <span className="material-symbols-outlined text-sm text-secondary">help_outline</span>
            When this may be useful:
          </span>
          <span className="text-on-surface-variant leading-relaxed">
            {action.whenItIsUseful}
          </span>
        </div>

        {/* What Information Is Needed */}
        <div className="text-xs flex flex-col gap-1.5">
          <span className="font-bold text-on-surface text-[11px] flex items-center gap-1">
            <span className="material-symbols-outlined text-sm text-amber-600">checklist</span>
            Information you will need:
          </span>
          <ul className="space-y-1 pl-4 list-disc text-on-surface-variant text-[11px]">
            {action.informationNeeded.map((info, idx) => (
              <li key={idx} className="leading-tight">{info}</li>
            ))}
          </ul>
        </div>

        {/* What User Can Expect */}
        <div className="bg-surface-container-lowest dark:bg-[#090D16] rounded-xl p-3 border border-outline-variant/30 text-xs">
          <span className="font-bold text-on-surface-variant text-[11px] block mb-0.5 uppercase tracking-wider">
            What you can expect:
          </span>
          <span className="text-on-surface-variant leading-relaxed text-[11px]">
            {action.whatToExpect}
          </span>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="pt-3 border-t border-outline-variant/20 flex flex-col gap-2">
        <Link
          href={action.ctaUrl}
          className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 ${styles.cta}`}
        >
          <span>{action.ctaText}</span>
          <span className="material-symbols-outlined text-base">arrow_forward</span>
        </Link>
        <span className="text-[10px] text-center text-on-surface-variant italic">
          Guidance & preparation tool • Does not guarantee a specific legal outcome
        </span>
      </div>
    </div>
  );
};
