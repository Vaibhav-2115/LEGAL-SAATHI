'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { LegalCase } from '@/lib/types';

interface CaseWorkspaceHeaderProps {
  currentCase: LegalCase;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onExportDossier?: () => void;
  assistantOpen?: boolean;
  onToggleAssistant?: () => void;
}

export const CaseWorkspaceHeader: React.FC<CaseWorkspaceHeaderProps> = ({
  currentCase,
  activeTab,
  onSelectTab,
  onExportDossier,
  assistantOpen,
  onToggleAssistant,
}) => {
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [optionsMenuOpen, setOptionsMenuOpen] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  // 6 Primary uncluttered horizontal tabs (no text clipping)
  const primaryTabs = [
    { id: 'overview', label: 'Overview', icon: 'dashboard' },
    { id: 'evidence', label: 'Evidence & Documents', icon: 'inventory_2' },
    { id: 'timeline', label: 'Case Timeline', icon: 'schedule' },
    { id: 'explanation', label: 'Why Law Applies', icon: 'balance' },
    { id: 'missing-info', label: 'Missing Info', icon: 'help_outline', badge: '1 Gap' },
    { id: 'actions', label: 'Legal Actions', icon: 'bolt' },
  ];

  // Secondary tabs accessed via streamlined More menu
  const secondaryTabs = [
    { id: 'verification', label: 'Case Verification', icon: 'fact_check' },
    { id: 'sources', label: 'Legal Sources', icon: 'menu_book' },
    { id: 'compare', label: 'Compare Sources', icon: 'compare_arrows' },
    { id: 'collective', label: 'Collective Assistance', icon: 'groups' },
    { id: 'export', label: 'Export Dossier', icon: 'file_download' },
  ];

  const activeSecondaryTab = secondaryTabs.find((t) => t.id === activeTab);

  const handleShare = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 2500);
    }
  };

  return (
    <header className="w-full bg-white dark:bg-[#111827] border-b border-slate-200/80 dark:border-slate-800 transition-colors shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3.5 pb-0 flex flex-col gap-3">
        {/* ========================================================================= */}
        {/* 1. TOP BREADCRUMB & UTILITY BAR                                           */}
        {/* ========================================================================= */}
        <div className="flex items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 sm:gap-2 flex-wrap min-w-0">
            <Link
              href="/complaints"
              className="inline-flex items-center gap-1 font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors shrink-0"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              <span>My Matters</span>
            </Link>
            <span className="text-slate-300 dark:text-slate-600">/</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white truncate">
              {currentCase.id}
            </span>
            <span className="text-slate-300 dark:text-slate-600 hidden sm:inline">•</span>
            <span className="hidden sm:inline font-medium text-slate-600 dark:text-slate-400 truncate">
              {currentCase.category}
            </span>
            <span className="text-slate-300 dark:text-slate-600 hidden md:inline">•</span>
            <span className="hidden md:inline font-medium text-slate-500 dark:text-slate-400 truncate">
              {currentCase.jurisdiction}
            </span>
          </nav>

          {/* Quick Actions in Utility Row */}
          <div className="flex items-center gap-2 shrink-0">
            {shareSuccess && (
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 animate-fadeIn">
                Link copied!
              </span>
            )}

            {/* Assistant Dock/Toggle Button in Top Bar */}
            {onToggleAssistant && (
              <button
                type="button"
                onClick={onToggleAssistant}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border ${
                  assistantOpen
                    ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800'
                    : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                }`}
                title={assistantOpen ? 'Hide Assistant Panel' : 'Open Assistant Panel'}
              >
                <span className="material-symbols-outlined text-sm">smart_toy</span>
                <span className="hidden sm:inline">Legal Assistant</span>
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    assistantOpen ? 'bg-emerald-500' : 'bg-slate-400'
                  }`}
                />
              </button>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. CASE IDENTITY & EVIDENTIARY STATUS ROW                                 */}
        {/* ========================================================================= */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2">
          {/* Left: Case Icon, Title & Concise Metadata */}
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <span className="material-symbols-outlined text-2xl">description</span>
            </div>

            <div className="flex flex-col gap-1 min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="font-heading text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight truncate">
                  {currentCase.title}
                </h1>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/90 dark:border-amber-800 text-[10px] font-bold tracking-wider uppercase shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  {currentCase.status === 'ACTION REQUIRED' ? 'Action Required' : currentCase.status}
                </span>
              </div>

              {/* Clean Single-Line Metadata Row */}
              <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
                <span className="inline-flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                  <span className="material-symbols-outlined text-xs text-blue-600 dark:text-blue-400">category</span>
                  <span>{currentCase.category}</span>
                </span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className="inline-flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">location_on</span>
                  <span>{currentCase.jurisdiction.split(',')[0]}</span>
                </span>
                <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
                <span className="hidden sm:inline-flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">schedule</span>
                  <span>Updated 2 days ago</span>
                </span>
              </div>
            </div>
          </div>

          {/* Right: Compact Evidentiary Widget & Primary Actions */}
          <div className="flex items-center gap-3 shrink-0 self-start lg:self-auto flex-wrap sm:flex-nowrap">
            {/* Streamlined Evidentiary Completeness Widget */}
            <div className="p-2.5 sm:p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/70 dark:border-blue-800/50 flex flex-col gap-1.5 w-full sm:w-64">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-blue-600 dark:text-blue-400">verified</span>
                  <span>Completeness: 85%</span>
                </span>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-white dark:bg-[#111827] text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  Sec 65B Ready
                </span>
              </div>

              {/* Compact Progress Bar */}
              <div className="w-full bg-blue-200/70 dark:bg-blue-900/50 h-1.5 rounded-full overflow-hidden">
                <div className="bg-blue-600 dark:bg-blue-500 h-full rounded-full w-[85%]" />
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-none">
                1 critical document gap detected
              </p>
            </div>

            {/* Header Action Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleShare}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-2xs"
                title="Share Matter Link"
              >
                <span className="material-symbols-outlined text-base">share</span>
              </button>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setOptionsMenuOpen(!optionsMenuOpen)}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  aria-label="Options"
                >
                  <span className="material-symbols-outlined text-base">more_vert</span>
                </button>

                {optionsMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-lg py-1.5 z-30 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        onSelectTab('actions');
                        setOptionsMenuOpen(false);
                      }}
                      className="w-full text-left px-3.5 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-sm">edit_note</span>
                      <span>Prepare Notice</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onSelectTab('export');
                        setOptionsMenuOpen(false);
                      }}
                      className="w-full text-left px-3.5 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-sm">print</span>
                      <span>Print Summary</span>
                    </button>
                    <Link
                      href="/complaints"
                      className="w-full text-left px-3.5 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-sm">arrow_back</span>
                      <span>My Complaints List</span>
                    </Link>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={onExportDossier || (() => onSelectTab('export'))}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0F172A] hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs shrink-0"
              >
                <span className="material-symbols-outlined text-sm">file_download</span>
                <span>Export Dossier</span>
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. STREAMLINED HORIZONTAL SUB-TABS (No Clipping, Clear Active State)      */}
        {/* ========================================================================= */}
        <div className="flex items-center justify-between border-t border-slate-200/80 dark:border-slate-800 pt-0.5 -mb-px overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex items-center gap-1 sm:gap-1.5">
            {primaryTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onSelectTab(tab.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
                    isActive
                      ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-bold'
                      : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <span className="material-symbols-outlined text-base leading-none">{tab.icon}</span>
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className="ml-1 px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {/* More v dropdown with synchronized active state */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                className={`inline-flex items-center gap-1 px-2.5 py-2.5 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
                  activeSecondaryTab
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-bold'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>{activeSecondaryTab ? activeSecondaryTab.label : 'More'}</span>
                <span className="material-symbols-outlined text-sm">expand_more</span>
              </button>

              {moreDropdownOpen && (
                <div className="absolute left-0 mt-1 w-52 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xl py-1.5 z-40 text-xs">
                  {secondaryTabs.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        onSelectTab(item.id);
                        setMoreDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 flex items-center gap-2.5 transition-colors ${
                        activeTab === item.id
                          ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-bold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span className="material-symbols-outlined text-base">{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

