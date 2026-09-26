'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { StatutorySource } from '../lib/types';
import { legalSaathiApi } from '../lib/api';

interface SourceComparisonViewProps {
  caseId?: string;
  initialSourceIds?: string[];
  caseTitle?: string;
  sources?: StatutorySource[];
}

export const SourceComparisonView: React.FC<SourceComparisonViewProps> = ({
  initialSourceIds = [],
  caseTitle = 'Active Dispute',
  sources: propSources
}) => {
  const [sources, setSources] = useState<StatutorySource[]>(propSources || []);
  const [selectedIds, setSelectedIds] = useState<string[]>(initialSourceIds);
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  useEffect(() => {
    if (!propSources || propSources.length === 0) {
      legalSaathiApi.getSources(undefined, undefined, 20, 0).then((res) => {
        if (res.sources && res.sources.length > 0) {
          setSources(res.sources);
          if (selectedIds.length === 0) {
            setSelectedIds(res.sources.slice(0, 3).map((s) => s.id));
          }
        }
      }).catch(() => {});
    }
  }, [propSources]);

  const allSources = propSources && propSources.length > 0 ? propSources : sources;
  const selectedSources = allSources.filter((s) => selectedIds.includes(s.id));

  const toggleSourceSelection = (id: string) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length <= 1) return; // Keep at least one
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      if (selectedIds.length >= 4) {
        // Limit to 4 for desktop readability
        alert('You can compare up to 4 legal sources simultaneously.');
        return;
      }
      setSelectedIds([...selectedIds, id]);
    }
  };

  const getCategoryBadge = (cat?: string) => {
    switch (cat) {
      case 'ACTS':
        return 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-300/40';
      case 'SECTIONS':
        return 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 border-indigo-300/40';
      case 'RULES':
        return 'bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border-teal-300/40';
      case 'JUDGMENTS':
        return 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 border-indigo-300/40';
      case 'OFFICIAL_GUIDANCE':
        return 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300/40';
      case 'OTHER_VERIFIED_SOURCES':
      default:
        return 'bg-slate-100 dark:bg-[#161F30] text-slate-800 dark:text-slate-300 border-slate-300/40';
    }
  };

  return (
    <div className="space-y-6">
      {/* Source Selection Toolbar */}
      <section
        aria-labelledby="select-sources-heading"
        className="bg-surface-container-lowest dark:bg-[#0F131C] border border-outline-variant/40 rounded-2xl p-5 shadow-sm space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-outline-variant/30 pb-3">
          <div>
            <h2 id="select-sources-heading" className="font-heading text-base sm:text-lg font-bold text-on-surface">
              Select Legal Authorities to Compare
            </h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Choose 2 to 4 statutory acts, precedents, or administrative rules to inspect side-by-side.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary dark:text-primary-fixed self-start sm:self-auto">
            {selectedSources.length} of {allSources.length} Selected
          </span>
        </div>

        {/* Categories / Quick Filter Chips */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1">
          {['ALL', 'ACTS', 'SECTIONS', 'RULES', 'JUDGMENTS', 'OFFICIAL_GUIDANCE'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                filterCategory === cat
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-surface-container-low dark:bg-[#161F30] text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              {cat.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Source Pills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {allSources
            .filter((s) => filterCategory === 'ALL' || s.category === filterCategory)
            .map((source) => {
              const isSelected = selectedIds.includes(source.id);
              return (
                <button
                  key={source.id}
                  type="button"
                  onClick={() => toggleSourceSelection(source.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all flex items-start justify-between gap-2 ${
                    isSelected
                      ? 'border-primary bg-primary/10 dark:bg-primary/20 ring-2 ring-primary/30'
                      : 'border-outline-variant/30 bg-surface-container-low dark:bg-[#161F30]/60 hover:bg-surface-container'
                  }`}
                >
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-on-surface block truncate">
                      {source.title}
                    </span>
                    <span className="text-[11px] text-on-surface-variant font-mono block">
                      {source.section}
                    </span>
                  </div>
                  <span
                    className={`material-symbols-outlined text-base shrink-0 ${
                      isSelected ? 'text-primary font-bold' : 'text-on-surface-variant/40'
                    }`}
                  >
                    {isSelected ? 'check_box' : 'check_box_outline_blank'}
                  </span>
                </button>
              );
            })}
        </div>
      </section>

      {/* Safety Notice: Neutral Presentation Without False Hierarchies */}
      <div className="p-4 rounded-xl bg-surface-container-low dark:bg-[#161F30]/80 border border-outline-variant/30 text-xs text-on-surface-variant flex items-start gap-2.5">
        <span className="material-symbols-outlined text-secondary text-base shrink-0 mt-0.5">info</span>
        <div>
          <strong className="text-on-surface block font-semibold">Comparative Statutory Grounding Notice:</strong>
          Legal Saathi presents relevant legal authorities in parallel to illustrate alternative rights and procedural avenues. We do not assert conclusive statutory supremacy, judicial preemption, or guaranteed tribunal outcomes.
        </div>
      </div>

      {/* DESKTOP VIEW: Side-by-side comparison grid (hidden on mobile, visible lg+) */}
      <section aria-label="Desktop Source Comparison" className="hidden lg:block bg-surface-container-lowest dark:bg-[#0F131C] border border-outline-variant/40 rounded-2xl shadow-sm overflow-hidden">
        <div
          className="grid divide-x divide-outline-variant/30"
          style={{ gridTemplateColumns: `repeat(${selectedSources.length}, minmax(0, 1fr))` }}
        >
          {selectedSources.map((source) => (
            <div key={source.id} className="p-5 flex flex-col justify-between space-y-4">
              {/* Header: Title & Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-1">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border ${getCategoryBadge(
                      source.category
                    )}`}
                  >
                    {source.category?.replace('_', ' ') || 'STATUTE'}
                  </span>
                  <span className="text-[11px] text-on-surface-variant font-mono">
                    {source.date}
                  </span>
                </div>
                <h3 className="font-heading text-base font-bold text-on-surface leading-tight">
                  {source.title}
                </h3>
                <span className="font-mono text-xs font-bold text-primary dark:text-primary-fixed bg-primary/10 px-2 py-0.5 rounded inline-block">
                  {source.section}
                </span>
                <p className="text-[11px] text-on-surface-variant italic">
                  Enacted / Issued by: {source.authority}
                </p>
              </div>

              {/* Excerpt / Statutory Text */}
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                  Relevant Provision Excerpt
                </span>
                <p className="text-xs text-on-surface bg-surface-container-low dark:bg-[#161F30]/80 p-3 rounded-xl border border-outline-variant/20 font-serif leading-relaxed line-clamp-6">
                  &ldquo;{source.excerpt}&rdquo;
                </p>
              </div>

              {/* Plain-Language Explanation */}
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                  Plain-Language Meaning
                </span>
                <p className="text-xs text-on-surface leading-relaxed">
                  {source.relevance}
                </p>
              </div>

              {/* Why It May Matter */}
              <div className="space-y-1 p-3 rounded-xl bg-primary/5 dark:bg-primary/10 border border-primary/20">
                <span className="text-[11px] font-bold uppercase tracking-wider text-primary dark:text-primary-fixed">
                  Why It May Matter
                </span>
                <p className="text-xs text-on-surface leading-relaxed">
                  {source.whyItMatters || 'Provides legal grounding and remedy framework for this dispute.'}
                </p>
              </div>

              {/* Case Connection */}
              <div className="space-y-1 p-3 rounded-xl bg-secondary/5 dark:bg-secondary/10 border border-secondary/20">
                <span className="text-[11px] font-bold uppercase tracking-wider text-secondary dark:text-secondary-fixed">
                  Connection to {caseTitle}
                </span>
                <p className="text-xs text-on-surface leading-relaxed">
                  {source.caseConnection || 'Applicable to the factual premises documented in your case.'}
                </p>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <Link
                  href={`/sources/${source.id}`}
                  className="w-full text-center py-2 px-3 rounded-xl bg-surface-container-low dark:bg-[#161F30] hover:bg-surface-container border border-outline-variant/40 text-xs font-bold text-primary dark:text-primary-fixed flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">visibility</span>
                  <span>View Full Source Dossier</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MOBILE / TABLET VIEW: Stacked Cards (visible below lg) */}
      <section aria-label="Mobile Stacked Source Comparison" className="lg:hidden space-y-4">
        {selectedSources.map((source, index) => (
          <article
            key={source.id}
            className="bg-surface-container-lowest dark:bg-[#0F131C] border border-outline-variant/40 rounded-2xl p-5 shadow-sm space-y-4"
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-2 border-b border-outline-variant/30 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary/15 text-primary text-xs font-bold flex items-center justify-center">
                  {index + 1}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border ${getCategoryBadge(
                    source.category
                  )}`}
                >
                  {source.category?.replace('_', ' ') || 'STATUTE'}
                </span>
              </div>
              <span className="text-xs text-on-surface-variant font-mono">
                {source.date}
              </span>
            </div>

            <div>
              <h3 className="font-heading text-lg font-bold text-on-surface">
                {source.title}
              </h3>
              <span className="font-mono text-xs font-bold text-primary dark:text-primary-fixed bg-primary/10 px-2 py-0.5 rounded mt-1 inline-block">
                {source.section}
              </span>
              <p className="text-xs text-on-surface-variant mt-1">
                Authority: {source.authority}
              </p>
            </div>

            {/* Excerpt */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant block mb-1">
                Statutory Excerpt
              </span>
              <p className="text-xs text-on-surface bg-surface-container-low dark:bg-[#161F30]/80 p-3 rounded-xl border border-outline-variant/20 font-serif leading-relaxed">
                &ldquo;{source.excerpt}&rdquo;
              </p>
            </div>

            {/* Plain-Language */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant block mb-1">
                Plain-Language Explanation
              </span>
              <p className="text-xs text-on-surface leading-relaxed">
                {source.relevance}
              </p>
            </div>

            {/* Why It Matters */}
            <div className="p-3 rounded-xl bg-primary/5 dark:bg-primary/10 border border-primary/20 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary dark:text-primary-fixed block">
                Why It May Matter
              </span>
              <p className="text-xs text-on-surface leading-relaxed">
                {source.whyItMatters || 'Provides statutory remedy.'}
              </p>
            </div>

            {/* Case Connection */}
            <div className="p-3 rounded-xl bg-secondary/5 dark:bg-secondary/10 border border-secondary/20 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-secondary dark:text-secondary-fixed block">
                Case Connection
              </span>
              <p className="text-xs text-on-surface leading-relaxed">
                {source.caseConnection || 'Directly relevant to your grievance.'}
              </p>
            </div>

            {/* View Source Button */}
            <Link
              href={`/sources/${source.id}`}
              className="w-full text-center py-2.5 px-3 rounded-xl bg-surface-container-low dark:bg-[#161F30] hover:bg-surface-container border border-outline-variant/40 text-xs font-bold text-primary dark:text-primary-fixed flex items-center justify-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">visibility</span>
              <span>View Source Detail</span>
            </Link>
          </article>
        ))}
      </section>
    </div>
  );
};
