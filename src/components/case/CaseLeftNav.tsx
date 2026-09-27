'use client';

import React from 'react';
import { useLegalSaathi } from '@/context/LegalSaathiContext';

interface CaseLeftNavProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenAssistant?: () => void;
}

export const CaseLeftNav: React.FC<CaseLeftNavProps> = ({
  activeTab,
  onSelectTab,
  onOpenAssistant,
}) => {
  const { t } = useLegalSaathi();

  const dossierItems = [
    { id: 'overview', label: t.tabOverview, icon: 'dashboard' },
    { id: 'evidence', label: t.tabEvidence, icon: 'inventory_2' },
    { id: 'timeline', label: t.tabTimeline, icon: 'schedule' },
    { id: 'missing-info', label: t.tabMissingInfo, icon: 'help_outline', badge: 1 },
  ];

  const legalItems = [
    { id: 'explanation', label: t.tabWhyLawApplies, icon: 'balance' },
    { id: 'verification', label: t.tabVerification, icon: 'fact_check' },
    { id: 'sources', label: t.tabSources, icon: 'menu_book' },
    { id: 'compare', label: t.tabCompare, icon: 'compare_arrows' },
  ];

  const actionItems = [
    { id: 'actions', label: t.tabActions, icon: 'bolt' },
    { id: 'collective', label: t.tabCollective, icon: 'groups' },
    { id: 'export', label: t.tabExport, icon: 'file_download' },
  ];

  return (
    <nav aria-label="Case Sections" className="w-full flex flex-col gap-4">
      {/* Navigation Card */}
      <div className="p-3 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col gap-3">
        {/* Group 1: Case Dossier */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-0.5">
            {t.groupDossier}
          </span>
          {dossierItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="material-symbols-outlined text-base leading-none shrink-0">
                    {item.icon}
                  </span>
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold shrink-0 ${
                      isActive ? 'bg-white text-blue-600' : 'bg-rose-500 text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Group 2: Legal Grounding */}
        <div className="flex flex-col gap-1 pt-2 border-t border-slate-100 dark:border-slate-800/80">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-0.5">
            {t.groupLegal}
          </span>
          {legalItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="material-symbols-outlined text-base leading-none shrink-0">
                    {item.icon}
                  </span>
                  <span className="truncate">{item.label}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Group 3: Remedies & Actions */}
        <div className="flex flex-col gap-1 pt-2 border-t border-slate-100 dark:border-slate-800/80">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-0.5">
            {t.groupActions}
          </span>
          {actionItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="material-symbols-outlined text-base leading-none shrink-0">
                    {item.icon}
                  </span>
                  <span className="truncate">{item.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Compact Assistant Callout Card */}
      <div className="p-3.5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-800/50 shadow-2xs flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">{t.needGuidance}</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">
              {t.needGuidanceDesc}
            </p>
          </div>
          <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
            <span className="material-symbols-outlined text-lg">smart_toy</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenAssistant}
          className="w-full py-1.5 px-3 rounded-xl bg-white dark:bg-[#111827] hover:bg-blue-50 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-xs font-bold transition-all border border-blue-200/80 dark:border-blue-800/60 flex items-center justify-center gap-1.5 shadow-2xs"
        >
          <span>{t.openAssistant}</span>
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </button>
      </div>
    </nav>
  );
};

