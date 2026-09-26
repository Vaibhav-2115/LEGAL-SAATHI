'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLegalSaathi } from '../../context/LegalSaathiContext';
import { CaseStatusBadge } from '../../components/CaseStatusBadge';

export default function MyComplaintsPage() {
  const { cases, setActiveCaseId } = useLegalSaathi();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState<'ALL' | 'ACTIVE' | 'ACTION REQUIRED' | 'COMPLETED' | 'ARCHIVED'>('ALL');

  // Filter cases based on tab & query
  const filteredCases = cases.filter((c) => {
    const matchesQuery =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.jurisdiction.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesQuery) return false;

    if (selectedTab === 'ALL') return true;
    if (selectedTab === 'ACTIVE') return c.status === 'UNDERSTANDING' || c.status === 'VERIFICATION' || c.status === 'READY FOR ACTION';
    if (selectedTab === 'ACTION REQUIRED') return c.status === 'ACTION REQUIRED';
    if (selectedTab === 'COMPLETED') return c.status === 'COMPLETED';
    if (selectedTab === 'ARCHIVED') return c.status === 'ARCHIVED';
    return true;
  });

  const getTabCount = (tab: typeof selectedTab) => {
    if (tab === 'ALL') return cases.length;
    if (tab === 'ACTIVE') return cases.filter((c) => c.status === 'UNDERSTANDING' || c.status === 'VERIFICATION' || c.status === 'READY FOR ACTION').length;
    if (tab === 'ACTION REQUIRED') return cases.filter((c) => c.status === 'ACTION REQUIRED').length;
    if (tab === 'COMPLETED') return cases.filter((c) => c.status === 'COMPLETED').length;
    if (tab === 'ARCHIVED') return cases.filter((c) => c.status === 'ARCHIVED').length;
    return 0;
  };

  return (
    <div className="w-full min-h-screen bg-background text-on-surface pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
        {/* Section 1: Dashboard Header & Direct Action */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-outline-variant/30">
          <div className="flex flex-col gap-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 self-start px-3 py-1 rounded-full bg-surface-container-high dark:bg-[#161F30] text-primary dark:text-primary-fixed text-xs font-semibold tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              Citizen Case Vault • {cases.length} Matters Recorded
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-primary dark:text-primary-fixed tracking-tight">
              My Complaints
            </h1>
            <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed">
              Track your legal problems, continue previous consultations, and see what needs your immediate attention across civil, tenancy, and statutory rights.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-primary hover:bg-secondary text-white text-xs font-bold shadow-md hover:shadow-lg transition-all"
            >
              <span className="material-symbols-outlined text-lg">add_box</span>
              <span>+ New Complaint</span>
            </Link>
          </div>
        </section>

        {/* Section 2: Metric Strip */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 rounded-xl bg-surface-container-lowest dark:bg-[#0F131C] border border-outline-variant/30 shadow-sm flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold">
                Active Claims
              </span>
              <span className="font-heading text-lg sm:text-xl font-bold text-primary dark:text-primary-fixed mt-0.5">
                ₹1,88,000
              </span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-950 text-secondary flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">payments</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-surface-container-lowest dark:bg-[#0F131C] border border-outline-variant/30 shadow-sm flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold">
                Action Due
              </span>
              <span className="font-heading text-lg sm:text-xl font-bold text-error mt-0.5">
                1 Pending
              </span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-950 text-error flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">warning</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-surface-container-lowest dark:bg-[#0F131C] border border-outline-variant/30 shadow-sm flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold">
                Verified Facts
              </span>
              <span className="font-heading text-lg sm:text-xl font-bold text-emerald-700 dark:text-emerald-400 mt-0.5">
                11 Items
              </span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">task_alt</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-surface-container-lowest dark:bg-[#0F131C] border border-outline-variant/30 shadow-sm flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold">
                Success Score
              </span>
              <span className="font-heading text-lg sm:text-xl font-bold text-secondary mt-0.5">
                84%
              </span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-950 text-secondary flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">insights</span>
            </div>
          </div>
        </section>

        {/* Section 3: Search & Status Filter Tabs */}
        <section className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-surface-container-low dark:bg-[#161F30]/80 overflow-x-auto">
              {(['ALL', 'ACTIVE', 'ACTION REQUIRED', 'COMPLETED', 'ARCHIVED'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setSelectedTab(tab)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    selectedTab === tab
                      ? 'bg-primary-container text-white shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span>{tab}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      selectedTab === tab
                        ? 'bg-white/20 text-white'
                        : 'bg-surface-container-high text-on-surface-variant'
                    }`}
                  >
                    {getTabCount(tab)}
                  </span>
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-base">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by ID, keyword, or act..."
                className="w-full bg-surface-container-lowest dark:bg-[#0F131C] rounded-lg pl-9 pr-3 py-2 text-xs border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>
          </div>
        </section>

        {/* Section 4: Complaints Cards Grid */}
        <section className="w-full">
          {filteredCases.length === 0 ? (
            /* Empty State */
            <div className="w-full bg-surface-container-lowest dark:bg-[#0F131C] rounded-2xl p-12 border border-outline-variant/30 text-center flex flex-col items-center justify-center gap-3">
              <div className="w-14 h-14 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant">
                <span className="material-symbols-outlined text-3xl">inbox</span>
              </div>
              <h3 className="font-heading text-lg font-bold text-on-surface">No Complaints Found</h3>
              <p className="text-xs text-on-surface-variant max-w-sm">
                No active matters correspond to your search or selected filter. You can initiate a new consultation at any time.
              </p>
              <Link
                href="/"
                className="mt-2 px-5 py-2.5 rounded-lg bg-primary hover:bg-secondary text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-base">add</span>
                <span>Start Your First Complaint</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {filteredCases.map((c) => (
                <div
                  key={c.id}
                  className="p-5 sm:p-6 rounded-2xl bg-surface-container-lowest dark:bg-[#0F131C] border border-outline-variant/30 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-4"
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex flex-col">
                        <span className="font-mono text-xs text-on-surface-variant">
                          ID: {c.id}
                        </span>
                        <h3 className="font-heading text-base sm:text-lg font-bold text-primary dark:text-primary-fixed hover:underline cursor-pointer">
                          <Link href={`/cases/${c.id}`}>{c.title}</Link>
                        </h3>
                      </div>
                      <CaseStatusBadge status={c.status} size="sm" />
                    </div>

                    <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
                      {c.summary}
                    </p>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-on-surface-variant pt-1">
                      <span className="text-secondary font-medium">{c.category}</span>
                      <span>•</span>
                      <span>{c.jurisdiction}</span>
                      <span>•</span>
                      <span>Updated {c.updatedAt}</span>
                    </div>
                  </div>

                  {/* Evidence & Stage Footer */}
                  <div className="pt-3 border-t border-outline-variant/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-on-surface-variant">Evidence:</span>
                        <span className="font-bold text-on-surface">
                          {c.collectedEvidenceCount} of {c.totalEvidenceCount} items
                        </span>
                      </div>
                      <div className="w-36 h-1.5 rounded-full bg-outline-variant/30 overflow-hidden">
                        <div
                          className="h-full bg-secondary transition-all"
                          style={{
                            width: `${(c.collectedEvidenceCount / (c.totalEvidenceCount || 1)) * 100}%`
                          }}
                        />
                      </div>
                    </div>

                    <Link
                      href={`/cases/${c.id}`}
                      onClick={() => setActiveCaseId(c.id)}
                      className="px-4 py-2 rounded-lg bg-surface-container-low dark:bg-[#161F30] hover:bg-primary hover:text-white text-primary dark:text-primary-fixed text-xs font-bold transition-all flex items-center justify-center gap-1 self-stretch sm:self-auto border border-outline-variant/20"
                    >
                      <span>Continue Complaint</span>
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
