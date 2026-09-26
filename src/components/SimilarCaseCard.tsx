'use client';

import React from 'react';
import Link from 'next/link';
import { SimilarCaseCluster } from '../lib/types';

interface SimilarCaseCardProps {
  cluster: SimilarCaseCluster;
  activeCaseId?: string;
}

export const SimilarCaseCard: React.FC<SimilarCaseCardProps> = ({
  cluster,
  activeCaseId = 'LS-2026-0042'
}) => {
  return (
    <article
      aria-label={`Similar Case Pattern: ${cluster.title}`}
      className="bg-surface-container-lowest dark:bg-[#0F131C] border border-outline-variant/40 rounded-2xl p-5 sm:p-6 shadow-sm hover:border-primary/50 transition-all flex flex-col justify-between space-y-5 group"
    >
      {/* Top Banner: Category & Case Count */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-secondary dark:text-secondary-fixed bg-secondary/10 dark:bg-secondary/20 px-2.5 py-1 rounded-md">
            {cluster.category}
          </span>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
            <span className="material-symbols-outlined text-sm">groups</span>
            <span>{cluster.caseCount} Potentially Similar Cases</span>
          </div>
        </div>

        <h3 className="font-heading text-lg sm:text-xl font-bold text-on-surface group-hover:text-primary transition-colors leading-tight">
          {cluster.title}
        </h3>

        <div className="flex items-center gap-1.5 text-xs text-on-surface-variant font-medium">
          <span className="material-symbols-outlined text-sm text-secondary">location_on</span>
          <span>Region: {cluster.jurisdictionRegion}</span>
        </div>
      </div>

      {/* Common Issue Statement */}
      <div className="p-3.5 rounded-xl bg-surface-container-low dark:bg-[#161F30]/80 border border-outline-variant/30 space-y-1">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-on-surface-variant block">
          Common Civic Grievance
        </span>
        <p className="text-xs sm:text-sm text-on-surface leading-relaxed">
          {cluster.commonIssue}
        </p>
      </div>

      {/* Shared Evidence & Legal Grounding Tags */}
      <div className="space-y-3 text-xs">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant block mb-1.5">
            Common Corroborating Evidence
          </span>
          <div className="flex flex-wrap gap-1.5">
            {cluster.commonEvidence.map((ev, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-md bg-surface-container dark:bg-[#161F30] text-on-surface text-[11px] font-medium border border-outline-variant/20 flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-xs text-primary">check_small</span>
                <span>{ev}</span>
              </span>
            ))}
          </div>
        </div>

        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant block mb-1.5">
            Statutory Topics
          </span>
          <div className="flex flex-wrap gap-1.5">
            {cluster.commonLegalTopics.map((topic, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-md bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-fixed text-[11px] font-semibold"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Why Similar Explanation */}
      <div className="p-3 rounded-xl bg-primary/5 dark:bg-primary/10 border border-primary/20 space-y-1 text-xs">
        <div className="flex items-center gap-1 text-[11px] font-bold text-primary dark:text-primary-fixed uppercase tracking-wider">
          <span className="material-symbols-outlined text-sm">hub</span>
          <span>Why This Pattern Appears Similar</span>
        </div>
        <p className="text-on-surface leading-relaxed text-[11px]">
          {cluster.similarityReason}
        </p>
      </div>

      {/* Privacy Guarantee Tag */}
      <div className="text-[10px] text-on-surface-variant flex items-center gap-1.5 border-t border-outline-variant/20 pt-2.5">
        <span className="material-symbols-outlined text-emerald-600 text-sm">lock</span>
        <span>Privacy-Safe Aggregated Pattern • Zero personal identifiers exposed</span>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
        <Link
          href={`/similar-cases/${cluster.id}`}
          className="text-center py-2 px-3 rounded-xl bg-surface-container-low dark:bg-[#161F30] hover:bg-surface-container border border-outline-variant/40 text-xs font-bold text-on-surface transition-colors flex items-center justify-center gap-1.5"
        >
          <span className="material-symbols-outlined text-sm">visibility</span>
          <span>View Pattern Details</span>
        </Link>

        <Link
          href={`/cases/${activeCaseId}/collective-action`}
          className="text-center py-2 px-3 rounded-xl bg-primary hover:bg-secondary text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
        >
          <span className="material-symbols-outlined text-sm">groups</span>
          <span>Explore Collective Action</span>
        </Link>
      </div>
    </article>
  );
};
