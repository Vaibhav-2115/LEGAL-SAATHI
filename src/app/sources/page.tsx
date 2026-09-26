'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useLegalSaathi } from '../../context/LegalSaathiContext';
import { CaseContextBanner } from '../../components/CaseContextBanner';
import { LegalSourceCard } from '../../components/LegalSourceCard';
import { StatutorySource } from '../../lib/types';
import { legalSaathiApi } from '../../lib/api';

export default function LegalSourcesPage() {
  const { activeCase } = useLegalSaathi();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sources, setSources] = useState<StatutorySource[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const currentCase = activeCase;

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    legalSaathiApi.getSources(searchQuery, selectedCategory, 60, 0)
      .then((data) => {
        if (isMounted) {
          setSources(data.sources);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.warn('Could not load sources from backend:', err);
        if (isMounted) setLoading(false);
      });
    return () => { isMounted = false; };
  }, [searchQuery, selectedCategory]);

  // Active case's verified sources + global repository
  const allSources = useMemo(() => {
    const caseSources = currentCase ? currentCase.legalSources : [];
    const caseSourceIds = new Set(caseSources.map((s) => s.id));
    const otherSources = sources.filter((s) => !caseSourceIds.has(s.id));
    return [...caseSources, ...otherSources];
  }, [currentCase, sources]);

  const filteredSources = allSources;

  const categories: { id: string; label: string; count: number }[] = [
    { id: 'ALL', label: 'All Sources', count: allSources.length },
    { id: 'ACTS', label: 'Acts', count: allSources.filter((s) => s.category === 'ACTS').length },
    { id: 'SECTIONS', label: 'Sections', count: allSources.filter((s) => s.category === 'SECTIONS').length },
    { id: 'RULES', label: 'Rules', count: allSources.filter((s) => s.category === 'RULES').length },
    { id: 'JUDGMENTS', label: 'Judgments', count: allSources.filter((s) => s.category === 'JUDGMENTS').length },
    { id: 'OFFICIAL_GUIDANCE', label: 'Official Guidance', count: allSources.filter((s) => s.category === 'OFFICIAL_GUIDANCE').length },
    { id: 'OTHER_VERIFIED_SOURCES', label: 'Other Authorities', count: allSources.filter((s) => s.category === 'OTHER_VERIFIED_SOURCES').length }
  ];

  return (
    <div className="w-full min-h-screen bg-background text-on-surface pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
        {/* Breadcrumb Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-on-surface-variant">
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className="text-primary dark:text-primary-fixed hover:text-secondary font-semibold transition-colors"
            >
              Dashboard
            </Link>
            <span>/</span>
            <Link
              href={currentCase ? `/cases/${currentCase.id}` : '/complaints'}
              className="text-primary dark:text-primary-fixed hover:text-secondary font-semibold transition-colors"
            >
              {currentCase ? `Case #${currentCase.id}` : 'Cases'}
            </Link>
            <span>/</span>
            <span className="text-on-surface font-bold">Legal Sources</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="font-mono text-xs">Statutory Grounding Engine</span>
          </div>
        </div>

        {/* Case Context Banner */}
        <CaseContextBanner currentActionTitle="Exploring Verified Legal Sources" />

        {/* Page Hero & Search Header */}
        <div className="bg-surface-container-lowest dark:bg-[#0F131C] rounded-2xl p-6 shadow-sm border border-outline-variant/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-primary dark:text-primary-fixed tracking-tight">
              Legal Sources — Case Sources & Grounding
            </h1>
            <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">
              Explore primary legislation, gazette rules, judicial precedents, and official regulatory guidelines
              governing your civil dispute. Legal Saathi cites verifiable sources under Indian law without making
              unsupported conclusions.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80 shrink-0">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-lg">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by act, section, or keyword..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-surface-container-low dark:bg-[#161F30] border border-outline-variant/40 text-xs text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-secondary transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-outline-variant/30">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedCategory === cat.id
                  ? 'bg-primary-container text-white shadow-sm font-bold'
                  : 'bg-surface-container-lowest dark:bg-[#161F30] text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low border border-outline-variant/30'
              }`}
              type="button"
            >
              <span>{cat.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  selectedCategory === cat.id
                    ? 'bg-white/20 text-white'
                    : 'bg-surface-container-high dark:bg-slate-700 text-on-surface-variant'
                }`}
              >
                {cat.count}
              </span>
            </button>
          ))}
        </div>

        {/* Source Cards Grid */}
        {filteredSources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredSources.map((source) => {
              const isLinked = currentCase?.legalSources.some((s) => s.id === source.id);
              return (
                <LegalSourceCard
                  key={source.id}
                  source={source}
                  isLinkedToActiveCase={isLinked}
                />
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-surface-container-lowest dark:bg-[#0F131C] rounded-2xl p-12 text-center border border-outline-variant/30 flex flex-col items-center gap-3">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant">
              manage_search
            </span>
            <h3 className="font-heading text-lg font-bold text-on-surface">
              No matching legal sources found
            </h3>
            <p className="text-xs text-on-surface-variant max-w-md">
              No verified authority found matching &quot;{searchQuery}&quot; under the selected category.
              Try clearing your search or switching to All Sources.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('ALL');
              }}
              className="mt-2 px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-secondary transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Civic Legal Guidance Footer Banner */}
        <div className="bg-surface-container-low dark:bg-[#0F131C]/60 rounded-xl p-4 border border-outline-variant/30 text-xs text-on-surface-variant flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-base text-secondary">verified</span>
            <span>
              All citations sourced from the Gazette of India, Supreme Court of India judgments, and State regulatory rules.
            </span>
          </div>
          <Link
            href="/actions"
            className="text-primary dark:text-primary-fixed font-bold hover:underline shrink-0 text-xs"
          >
            Ready to Take Action? View Action Center →
          </Link>
        </div>
      </div>
    </div>
  );
}
