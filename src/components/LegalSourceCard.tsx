'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { StatutorySource, SourceCategory } from '../lib/types';
import { useLegalSaathi } from '../context/LegalSaathiContext';

interface LegalSourceCardProps {
  source: StatutorySource;
  isLinkedToActiveCase?: boolean;
}

export const LegalSourceCard: React.FC<LegalSourceCardProps> = ({
  source,
  isLinkedToActiveCase = false
}) => {
  const { activeCase, addLegalSourceToCase } = useLegalSaathi();
  const [expanded, setExpanded] = useState(false);
  const [added, setAdded] = useState(isLinkedToActiveCase);

  const getCategoryBadge = (category?: SourceCategory) => {
    switch (category) {
      case 'ACTS':
        return {
          label: 'Primary Act',
          bg: 'bg-blue-100 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-900',
          icon: 'menu_book'
        };
      case 'SECTIONS':
        return {
          label: 'Statutory Section',
          bg: 'bg-indigo-100 dark:bg-indigo-950/70 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-900',
          icon: 'article'
        };
      case 'RULES':
        return {
          label: 'Delegated Rule',
          bg: 'bg-teal-100 dark:bg-teal-950/70 text-teal-800 dark:text-teal-300 border-teal-200 dark:border-teal-900',
          icon: 'gavel'
        };
      case 'JUDGMENTS':
        return {
          label: 'Judicial Precedent',
          bg: 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-900',
          icon: 'account_balance'
        };
      case 'OFFICIAL_GUIDANCE':
        return {
          label: 'Official Guidance',
          bg: 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900',
          icon: 'verified_user'
        };
      case 'OTHER_VERIFIED_SOURCES':
      default:
        return {
          label: 'Verified Authority',
          bg: 'bg-slate-100 dark:bg-[#161F30] text-slate-800 dark:text-slate-300 border-slate-200 dark:border-[#334155]',
          icon: 'bookmark'
        };
    }
  };

  const badge = getCategoryBadge(source.category);

  const handleAddToCase = () => {
    if (activeCase) {
      addLegalSourceToCase(activeCase.id, source);
      setAdded(true);
    }
  };

  return (
    <div className="bg-surface-container-lowest dark:bg-[#0F131C] rounded-2xl p-5 sm:p-6 shadow-sm border border-outline-variant/30 hover:border-secondary/40 transition-all flex flex-col justify-between gap-4">
      {/* Top Meta Bar */}
      <div className="flex flex-col gap-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase border ${badge.bg}`}
          >
            <span className="material-symbols-outlined text-xs">{badge.icon}</span>
            {badge.label}
          </span>

          <div className="flex items-center gap-2 text-xs text-on-surface-variant">
            {source.date && (
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">calendar_today</span>
                {source.date}
              </span>
            )}
            {source.verified && (
              <span
                className="inline-flex items-center gap-0.5 text-emerald-700 dark:text-emerald-400 font-bold text-[11px]"
                title="Verified against official gazette / court records"
              >
                <span className="material-symbols-outlined text-xs">verified</span>
                Verified
              </span>
            )}
          </div>
        </div>

        {/* Source Title & Provision */}
        <div>
          <h3 className="font-heading text-lg font-bold text-primary dark:text-primary-fixed leading-tight">
            {source.title}
          </h3>
          <p className="text-xs font-mono font-semibold text-secondary dark:text-secondary-fixed mt-0.5">
            {source.section}
          </p>
        </div>

        {/* Short Explanation & Authority */}
        <p className="text-xs text-on-surface-variant leading-relaxed">
          {source.relevance}
        </p>

        {source.authority && (
          <div className="text-[11px] text-on-surface-variant flex items-center gap-1">
            <span className="material-symbols-outlined text-xs text-secondary">corporate_fare</span>
            <span>Authority: <strong>{source.authority}</strong></span>
          </div>
        )}

        {/* Why this may matter */}
        {source.whyItMatters && (
          <div className="bg-surface-container-low dark:bg-[#161F30]/80 rounded-xl p-3 border-l-3 border-primary text-xs">
            <span className="font-bold text-primary dark:text-primary-fixed block mb-0.5">
              Why this source may matter:
            </span>
            <span className="text-on-surface-variant leading-relaxed">
              {source.whyItMatters}
            </span>
          </div>
        )}

        {/* Case Connection */}
        {source.caseConnection && (
          <div className="bg-amber-500/10 dark:bg-amber-950/30 rounded-xl p-2.5 border border-amber-500/20 text-xs">
            <span className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1 mb-0.5">
              <span className="material-symbols-outlined text-xs text-amber-600">link</span>
              Active Case Connection:
            </span>
            <span className="text-amber-950 dark:text-amber-200 leading-relaxed">
              {source.caseConnection}
            </span>
          </div>
        )}

        {/* Expandable Legal Text / Excerpt Preview */}
        {source.excerpt && (
          <div className="mt-1">
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs font-semibold text-secondary dark:text-secondary-fixed hover:underline flex items-center gap-1"
              type="button"
            >
              <span>{expanded ? 'Hide Statutory Excerpt' : 'View Statutory Excerpt'}</span>
              <span className="material-symbols-outlined text-sm">
                {expanded ? 'expand_less' : 'expand_more'}
              </span>
            </button>

            {expanded && (
              <div className="mt-2 p-3.5 rounded-xl bg-surface-container-lowest dark:bg-[#090D16] border border-outline-variant/30 text-xs font-mono text-on-surface leading-relaxed whitespace-pre-line">
                <div className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider mb-1 font-sans">
                  Official Statutory Language:
                </div>
                {source.fullTextPreview || source.excerpt}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Action Row */}
      <div className="pt-3 border-t border-outline-variant/20 flex flex-wrap items-center justify-between gap-3 mt-auto">
        <Link
          href={`/sources/${source.id}`}
          className="px-4 py-2 rounded-lg bg-primary hover:bg-secondary text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
        >
          <span>View Source</span>
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </Link>

        <div className="flex items-center gap-2">
          {added ? (
            <span className="inline-flex items-center gap-1 text-xs text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-100 dark:bg-emerald-950/60 px-3 py-1.5 rounded-lg">
              <span className="material-symbols-outlined text-sm">check_circle</span>
              Linked to Case
            </span>
          ) : (
            <button
              onClick={handleAddToCase}
              className="px-3 py-1.5 rounded-lg bg-surface-container-low dark:bg-[#161F30] hover:bg-surface-container-high text-on-surface text-xs font-semibold border border-outline-variant/30 transition-colors flex items-center gap-1"
              type="button"
            >
              <span className="material-symbols-outlined text-sm">bookmark_add</span>
              <span>Add to Case</span>
            </button>
          )}

          {source.officialLink && (
            <a
              href={source.officialLink}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg hover:bg-surface-container-high text-on-surface-variant transition-colors"
              title="Open Official Law Gazette Document"
            >
              <span className="material-symbols-outlined text-base">open_in_new</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
