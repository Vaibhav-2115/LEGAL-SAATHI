'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLegalSaathi } from '../../context/LegalSaathiContext';
import { SimilarCaseCard } from '../../components/SimilarCaseCard';
import { SimilarCaseCluster } from '../../lib/types';
import { legalSaathiApi } from '../../lib/api';

export default function SimilarCasesPage() {
  const { activeCaseId } = useLegalSaathi();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [clusters, setClusters] = useState<SimilarCaseCluster[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    legalSaathiApi.getClusters()
      .then((res) => {
        if (isMounted) {
          setClusters(res);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.warn('Could not load clusters from backend:', err);
        if (isMounted) setLoading(false);
      });
    return () => { isMounted = false; };
  }, []);

  const filteredClusters = clusters.filter((item) => {
    const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.commonIssue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.jurisdictionRegion.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full min-h-screen bg-background text-on-surface pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
        {/* Navigation Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-on-surface-variant">
          <Link
            href="/complaints"
            className="inline-flex items-center gap-1.5 font-semibold text-primary dark:text-primary-fixed hover:text-secondary transition-colors"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            <span>Back to My Complaints</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>
              <strong className="text-on-surface">Legal Saathi Similar Cases Engine</strong>
            </span>
          </div>
        </div>

        {/* Hero Header */}
        <div className="bg-surface-container-lowest dark:bg-[#0F131C] border border-outline-variant/30 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-secondary dark:text-secondary-fixed uppercase tracking-wider">
                <span className="material-symbols-outlined text-base">hub</span>
                <span>Civic Intelligence & Pattern Recognition</span>
              </div>
              <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
                Similar Cases & Civic Patterns
              </h1>
              <p className="text-xs sm:text-sm text-on-surface-variant max-w-3xl leading-relaxed">
                Legal Saathi automatically scans anonymized civic dispute trends across jurisdictions to detect potentially recurring patterns. Discover how comparable grievances were grounded and explore voluntary collective advocacy.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 shrink-0">
              <Link
                href={`/cases/${activeCaseId}/collective-action`}
                className="px-4 py-2.5 rounded-xl bg-primary hover:bg-secondary text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <span className="material-symbols-outlined text-sm">how_to_reg</span>
                <span>My Collective Action</span>
              </Link>
              <Link
                href="/privacy/consent"
                className="px-4 py-2.5 rounded-xl bg-surface-container-low dark:bg-[#161F30] hover:bg-surface-container border border-outline-variant/40 text-xs font-bold text-on-surface transition-colors flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">security</span>
                <span>Privacy & Consent</span>
              </Link>
            </div>
          </div>
        </div>

        {/* PRIVACY FIRST BANNER */}
        <section
          aria-label="Privacy Guarantees"
          className="bg-emerald-50/70 dark:bg-emerald-950/25 border border-emerald-300 dark:border-emerald-900/60 rounded-2xl p-5 shadow-sm space-y-3"
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-600 text-xl">verified_user</span>
            <h2 className="font-heading text-sm sm:text-base font-bold text-emerald-950 dark:text-emerald-100">
              Privacy-First Pattern Matching Architecture
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-emerald-900 dark:text-emerald-300">
            <div className="p-3 bg-white/70 dark:bg-[#0F131C]/60 rounded-xl border border-emerald-200 dark:border-emerald-900/40">
              <strong className="block text-emerald-950 dark:text-emerald-100 font-bold mb-0.5">
                Zero Personal Identifiers
              </strong>
              <span>Names, phone numbers, exact flat/house addresses, and private chats are strictly redacted and never displayed.</span>
            </div>
            <div className="p-3 bg-white/70 dark:bg-[#0F131C]/60 rounded-xl border border-emerald-200 dark:border-emerald-900/40">
              <strong className="block text-emerald-950 dark:text-emerald-100 font-bold mb-0.5">
                Aggregated Clusters Only
              </strong>
              <span>Only high-level civic patterns (dispute category, duration, broad locality) are grouped to analyze systemic issues.</span>
            </div>
            <div className="p-3 bg-white/70 dark:bg-[#0F131C]/60 rounded-xl border border-emerald-200 dark:border-emerald-900/40">
              <strong className="block text-emerald-950 dark:text-emerald-100 font-bold mb-0.5">
                Voluntary Participation
              </strong>
              <span>You are never automatically enrolled in collective advocacy. Participation requires explicit informed consent.</span>
            </div>
          </div>
        </section>

        {/* Search & Filter Toolbar */}
        <section
          aria-label="Filter Patterns"
          className="bg-surface-container-lowest dark:bg-[#0F131C] border border-outline-variant/40 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          {/* Category Chips */}
          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1">
            {[
              { id: 'ALL', label: 'All Patterns' },
              { id: 'Tenancy & Housing Law', label: 'Tenancy & Deposit' },
              { id: 'Real Estate & Property', label: 'RERA & Property' },
              { id: 'Consumer Protection', label: 'Consumer Disputes' }
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-primary text-white shadow-sm font-bold'
                    : 'bg-surface-container-low dark:bg-[#161F30] text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-base text-on-surface-variant">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search issue or jurisdiction..."
              className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-outline-variant/40 bg-surface dark:bg-[#161F30] text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </section>

        {/* Clusters Grid */}
        <section aria-label="Detected Similar Patterns">
          {filteredClusters.length === 0 ? (
            <div className="bg-surface-container-lowest dark:bg-[#0F131C] border border-outline-variant/40 rounded-2xl p-8 text-center space-y-3">
              <span className="material-symbols-outlined text-4xl text-on-surface-variant">search_off</span>
              <h2 className="font-heading text-base font-bold text-on-surface">No Similar Patterns Found</h2>
              <p className="text-xs text-on-surface-variant">Try resetting your search query or choosing another dispute category.</p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('ALL');
                  setSearchQuery('');
                }}
                className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClusters.map((cluster) => (
                <SimilarCaseCard
                  key={cluster.id}
                  cluster={cluster}
                  activeCaseId={activeCaseId}
                />
              ))}
            </div>
          )}
        </section>

        {/* Legal Disclaimer Footer */}
        <div className="p-4 rounded-xl bg-surface-container-low dark:bg-[#161F30]/60 border border-outline-variant/30 text-xs text-on-surface-variant leading-relaxed text-center sm:text-left">
          <strong className="text-on-surface">Informational Disclaimer:</strong> Similarity indicates comparable factual premises identified through algorithmic clustering. It does not establish that cases share the same legal outcome, counterparty, or judicial determination. Review all specific legal actions with certified advocates or DLSA legal aid.
        </div>
      </div>
    </div>
  );
}
