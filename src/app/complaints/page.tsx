'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLegalSaathi } from '@/context/LegalSaathiContext';
import { NewComplaintModal } from '@/components/dashboard/NewComplaintModal';

export default function MyMattersPage() {
  const { cases, setActiveCaseId, t } = useLegalSaathi();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState<'ALL' | 'ACTIVE' | 'ACTION REQUIRED' | 'COMPLETED' | 'ARCHIVED'>('ALL');
  const [sortBy, setSortBy] = useState<'latest' | 'oldest'>('latest');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Tab counts
  const allCount = cases.length;
  const activeCount = cases.filter(
    (c) => c.status === 'UNDERSTANDING' || c.status === 'VERIFICATION' || c.status === 'READY FOR ACTION'
  ).length;
  const actionRequiredCount = cases.filter((c) => c.status === 'ACTION REQUIRED' || c.status === 'VERIFICATION').length;
  const completedCount = cases.filter((c) => c.status === 'COMPLETED').length;
  const archivedCount = cases.filter((c) => c.status === 'ARCHIVED').length;

  // Filter cases
  const filteredCases = cases.filter((c) => {
    const query = searchQuery.toLowerCase();
    const matchesQuery =
      c.title.toLowerCase().includes(query) ||
      c.id.toLowerCase().includes(query) ||
      c.summary.toLowerCase().includes(query) ||
      c.category.toLowerCase().includes(query) ||
      c.jurisdiction.toLowerCase().includes(query);

    if (!matchesQuery) return false;

    if (selectedTab === 'ALL') return true;
    if (selectedTab === 'ACTIVE') return c.status === 'UNDERSTANDING' || c.status === 'VERIFICATION' || c.status === 'READY FOR ACTION';
    if (selectedTab === 'ACTION REQUIRED') return c.status === 'ACTION REQUIRED' || c.status === 'VERIFICATION';
    if (selectedTab === 'COMPLETED') return c.status === 'COMPLETED';
    if (selectedTab === 'ARCHIVED') return c.status === 'ARCHIVED';
    return true;
  });

  const getStatusBadge = (status: string) => {
    if (status === 'ACTION REQUIRED' || status === 'VERIFICATION') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-[11px] font-bold tracking-wider uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          ACTION REQUIRED
        </span>
      );
    }
    if (status === 'UNDERSTANDING') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-[11px] font-bold tracking-wider uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          IN PROGRESS
        </span>
      );
    }
    if (status === 'COMPLETED' || status === 'READY FOR ACTION') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold tracking-wider uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          COMPLETED
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-[11px] font-bold tracking-wider uppercase">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
        {status}
      </span>
    );
  };

  const getEvidenceFraction = (_id: string, totalCount?: number, collectedCount?: number) => {
    const total = totalCount ?? 3;
    const current = collectedCount ?? 0;
    const pct = total > 0 ? Math.min(100, Math.round((current / total) * 100)) : 0;
    return { current, total, pct };
  };

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] bg-slate-50/50 dark:bg-[#090D16] text-slate-900 dark:text-slate-100 transition-colors pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">

        {/* ========================================================================= */}
        {/* 1. BREADCRUMB & HEADER SECTION                                           */}
        {/* ========================================================================= */}
        <div className="flex flex-col gap-4">
          {/* Breadcrumb: Home > My Matters */}
          <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
            <Link href="/dashboard" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              {t.navHome}
            </Link>
            <span className="text-slate-300 dark:text-slate-600">/</span>
            <span className="text-slate-900 dark:text-white font-semibold">{t.navMyMatters}</span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {t.navMyMatters}
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                View, track and manage all your complaints and cases in one place.
              </p>
            </div>

            {/* Primary Action Button */}
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition-all shrink-0"
            >
              <span className="material-symbols-outlined text-lg">add</span>
              <span>{t.btnCreateCase}</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. FILTER TABS & SEARCH CONTROLS                                         */}
        {/* ========================================================================= */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-2 border-t border-slate-200/80 dark:border-slate-800/80">
          {/* Left: Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedTab('ALL')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                selectedTab === 'ALL'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white dark:bg-[#111827] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-[#1E293B]'
              }`}
            >
              {t.statusAll} {allCount}
            </button>

            <button
              type="button"
              onClick={() => setSelectedTab('ACTIVE')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                selectedTab === 'ACTIVE'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white dark:bg-[#111827] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-[#1E293B]'
              }`}
            >
              {t.statusActive} {activeCount}
            </button>

            <button
              type="button"
              onClick={() => setSelectedTab('ACTION REQUIRED')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                selectedTab === 'ACTION REQUIRED'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white dark:bg-[#111827] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-[#1E293B]'
              }`}
            >
              {t.statusActionRequired} {actionRequiredCount}
            </button>

            <button
              type="button"
              onClick={() => setSelectedTab('COMPLETED')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                selectedTab === 'COMPLETED'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white dark:bg-[#111827] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-[#1E293B]'
              }`}
            >
              {t.statusCompleted} {completedCount}
            </button>

            <button
              type="button"
              onClick={() => setSelectedTab('ARCHIVED')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                selectedTab === 'ARCHIVED'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white dark:bg-[#111827] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-[#1E293B]'
              }`}
            >
              {t.statusArchived} {archivedCount}
            </button>
          </div>

          {/* Right: Search Input & Sort Dropdown */}
          <div className="flex items-center gap-3">
            <div className="relative w-full sm:w-64">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-base text-slate-400">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by ID, title, or keyword..."
                className="w-full pl-9 pr-3 py-1.5 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value="latest">Latest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. MATTER LIST CARDS                                                     */}
        {/* ========================================================================= */}
        <div className="flex flex-col gap-4">
          {filteredCases.map((matter) => {
            const ev = getEvidenceFraction(matter.id, matter.totalEvidenceCount, matter.collectedEvidenceCount);
            const isCompleted = matter.status === 'COMPLETED' || matter.id === 'LS-2026-0029';

            return (
              <div
                key={matter.id}
                className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col gap-4"
              >
                {/* Top Row: Case ID & Status Badge */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-lg">
                      description
                    </span>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 font-mono tracking-tight">
                      {matter.id}
                    </span>
                  </div>

                  <div>{getStatusBadge(matter.status)}</div>
                </div>

                {/* Middle: Title & Description */}
                <div>
                  <h3 className="font-heading text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                    {matter.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                    {matter.summary}
                  </p>
                </div>

                {/* Bottom Row: Metadata Tags, Evidence Progress & Action Button */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-3 border-t border-slate-100 dark:border-slate-800/60">
                  {/* Left Tags */}
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/40 font-semibold">
                      {matter.category}
                    </span>
                    <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400 font-medium">
                      <span className="material-symbols-outlined text-sm">location_on</span>
                      {matter.jurisdiction.split(',')[0]}
                    </span>
                    <span className="text-slate-300 dark:text-slate-600">•</span>
                    <span className="text-slate-500 dark:text-slate-400 font-medium">
                      Updated {matter.updatedAt || '2 days ago'}
                    </span>
                  </div>

                  {/* Right: Progress bar & Action CTA */}
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="flex flex-col gap-1 w-36">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                        <span>Evidence:</span>
                        <span>{ev.current} of {ev.total} Items</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all"
                          style={{ width: `${ev.pct}%` }}
                        />
                      </div>
                    </div>

                    <Link
                      href={`/cases/${matter.id}`}
                      onClick={() => setActiveCaseId(matter.id)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 dark:bg-[#1E293B] hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 text-xs font-bold text-slate-800 dark:text-slate-200 transition-all shadow-2xs"
                    >
                      <span>{isCompleted ? 'View Details' : 'Continue'}</span>
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredCases.length === 0 && (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center gap-3">
              <span className="material-symbols-outlined text-4xl text-slate-400">folder_off</span>
              <p className="text-base font-bold text-slate-900 dark:text-white">No matters found</p>
              <p className="text-xs text-slate-500 max-w-sm">
                No active complaints match your search query or selected filter criteria.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedTab('ALL');
                }}
                className="mt-2 text-xs font-bold text-blue-600 hover:underline"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

      </div>

      {/* New Complaint Modal */}
      <NewComplaintModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
