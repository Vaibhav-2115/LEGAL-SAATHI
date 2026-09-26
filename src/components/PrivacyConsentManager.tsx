'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLegalSaathi } from '../context/LegalSaathiContext';
import { CollectiveActionStatus } from '../lib/types';

interface PrivacyConsentManagerProps {
  caseId: string;
}

export const PrivacyConsentManager: React.FC<PrivacyConsentManagerProps> = ({ caseId }) => {
  const { userConsents, updateCollectiveActionConsent, updateDataUsageConsent } = useLegalSaathi();
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const consentRecord = userConsents[caseId] || {
    caseId,
    dataCategoriesStored: [
      'Case Statement & Summary',
      'Documentary Evidence Files',
      'Statutory References',
      'Grievance Timeline'
    ],
    howDataUsed: [
      {
        category: 'Case Assistance & Legal Analysis',
        description: 'Processing facts to identify relevant Indian legal provisions.',
        status: 'PRIVATE'
      },
      {
        category: 'Privacy-Preserving Pattern Detection',
        description: 'Anonymized civic pattern clustering without personal identifiers.',
        status: 'SHARED_WITH_CONSENT'
      },
      {
        category: 'Collective Action & Advocacy Participation',
        description: 'Joining group representation before Rent Authority or DLSA.',
        status: 'NOT_SHARED'
      }
    ],
    collectiveActionStatus: 'NOT_PARTICIPATING' as CollectiveActionStatus
  };

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  const handleToggleSharing = (
    category: string,
    currentStatus: 'PRIVATE' | 'SHARED_WITH_CONSENT' | 'NOT_SHARED'
  ) => {
    const nextStatus =
      currentStatus === 'SHARED_WITH_CONSENT' ? 'PRIVATE' : 'SHARED_WITH_CONSENT';
    updateDataUsageConsent(caseId, category, nextStatus);
    showToast(`Data usage preference updated for "${category}".`);
  };

  const handleWithdrawCollective = () => {
    if (confirm('Are you sure you wish to withdraw from all collective advocacy participation? No further aggregated updates will be shared.')) {
      updateCollectiveActionConsent(caseId, 'WITHDRAWN');
      showToast('Successfully withdrawn from collective action.');
    }
  };

  const getStatusBadge = (status: CollectiveActionStatus) => {
    switch (status) {
      case 'PARTICIPATING':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300/40">
            <span className="material-symbols-outlined text-sm">groups</span>
            Active Participant
          </span>
        );
      case 'INTERESTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-300/40">
            <span className="material-symbols-outlined text-sm">pending</span>
            Interested • Consent Pending
          </span>
        );
      case 'WITHDRAWN':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 dark:bg-[#161F30] dark:text-slate-300 border border-slate-300/40">
            <span className="material-symbols-outlined text-sm">cancel</span>
            Withdrawn
          </span>
        );
      case 'NOT_PARTICIPATING':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-surface-container text-on-surface-variant border border-outline-variant/30">
            <span className="material-symbols-outlined text-sm">person</span>
            Independent / Not Enrolled
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {successToast && (
        <div className="p-3.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-lg flex items-center justify-between gap-2 animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-base">check_circle</span>
            <span>{successToast}</span>
          </div>
          <button type="button" onClick={() => setSuccessToast(null)} className="text-white/80 hover:text-white">
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      )}

      {/* DPDP Act 2023 Civic Guarantee */}
      <section
        aria-label="Statutory Data Protection"
        className="bg-surface-container-lowest dark:bg-[#0F131C] border border-outline-variant/40 rounded-2xl p-6 shadow-sm space-y-3"
      >
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-xl">gavel</span>
          <h2 className="font-heading text-base sm:text-lg font-bold text-on-surface">
            Digital Personal Data Protection Act, 2023 Compliance
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
          Under Section 6 & 11 of the DPDP Act 2023, you hold absolute ownership over your legal dispute data. Your information is processed exclusively for personal legal guidance, with clear rights to inspect, modify, and withdraw consent at any time.
        </p>
      </section>

      {/* Stored Case Data Categories */}
      <section
        aria-labelledby="stored-data-heading"
        className="bg-surface-container-lowest dark:bg-[#0F131C] border border-outline-variant/40 rounded-2xl p-6 shadow-sm space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-outline-variant/30 pb-3">
          <div>
            <h2 id="stored-data-heading" className="font-heading text-base sm:text-lg font-bold text-on-surface">
              Your Case Data on Record
            </h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Current records stored securely in your client-side session for Case #{caseId}.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-primary dark:text-primary-fixed bg-primary/10 px-2.5 py-1 rounded-md self-start sm:self-auto">
            {consentRecord.dataCategoriesStored.length} Categories Stored
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {consentRecord.dataCategoriesStored.map((category, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-surface-container-low dark:bg-[#161F30]/60 border border-outline-variant/30 text-xs flex items-center gap-2.5"
            >
              <span className="material-symbols-outlined text-secondary text-base">folder</span>
              <span className="font-semibold text-on-surface">{category}</span>
            </div>
          ))}
        </div>
      </section>

      {/* How Your Data Is Used & Sharing Controls */}
      <section
        aria-labelledby="usage-controls-heading"
        className="bg-surface-container-lowest dark:bg-[#0F131C] border border-outline-variant/40 rounded-2xl p-6 shadow-sm space-y-4"
      >
        <div className="border-b border-outline-variant/30 pb-3">
          <h2 id="usage-controls-heading" className="font-heading text-base sm:text-lg font-bold text-on-surface">
            How Your Data Is Used & Sharing Preferences
          </h2>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Maintain granular control over which processing categories remain private or contribute to anonymized civic patterns.
          </p>
        </div>

        <div className="space-y-3">
          {consentRecord.howDataUsed.map((item, idx) => {
            const isShared = item.status === 'SHARED_WITH_CONSENT';
            const isPrivate = item.status === 'PRIVATE';

            return (
              <div
                key={idx}
                className="p-4 rounded-xl border border-outline-variant/30 bg-surface-container-low dark:bg-[#161F30]/50 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-on-surface text-sm">{item.category}</span>
                    <span
                      className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                        isShared
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-300'
                          : isPrivate
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300'
                          : 'bg-slate-100 text-slate-700 dark:bg-[#161F30] dark:text-slate-300 border-slate-300'
                      }`}
                    >
                      {item.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  {item.category.includes('Pattern Detection') && (
                    <button
                      type="button"
                      onClick={() => handleToggleSharing(item.category, item.status)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                        isShared
                          ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
                          : 'bg-surface-container-lowest dark:bg-[#161F30] text-on-surface border-outline-variant/40 hover:bg-surface-container'
                      }`}
                    >
                      {isShared ? 'Anonymized Sharing Active' : 'Keep Fully Private'}
                    </button>
                  )}
                  {item.category.includes('Collective Action') && (
                    <Link
                      href={`/cases/${caseId}/collective-action`}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-primary text-white hover:bg-secondary transition-colors"
                    >
                      Manage Consent
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Collective Action Status & Withdrawal */}
      <section
        aria-labelledby="collective-status-heading"
        className="bg-surface-container-lowest dark:bg-[#0F131C] border border-outline-variant/40 rounded-2xl p-6 shadow-sm space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-outline-variant/30 pb-3">
          <div>
            <h2 id="collective-status-heading" className="font-heading text-base sm:text-lg font-bold text-on-surface">
              Collective Action Participation Status
            </h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Review your current enrollment in collective advocacy before Rent Authorities or tribunals.
            </p>
          </div>
          <div>{getStatusBadge(consentRecord.collectiveActionStatus)}</div>
        </div>

        {consentRecord.collectiveActionStatus === 'PARTICIPATING' ? (
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-300 dark:border-emerald-800 space-y-3 text-xs">
            <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-200 font-bold">
              <span className="material-symbols-outlined text-base">check_circle</span>
              <span>You are currently participating in anonymized group representation.</span>
            </div>
            {consentRecord.consentedAt && (
              <p className="text-emerald-800 dark:text-emerald-300">
                Affirmative consent confirmed on: <strong>{consentRecord.consentedAt}</strong>
              </p>
            )}
            <div className="pt-2 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleWithdrawCollective}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors shadow-sm"
              >
                Withdraw Participation & Revoke Consent
              </button>
              <Link
                href={`/cases/${caseId}/collective-action`}
                className="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold text-xs border border-outline-variant/30"
              >
                View Collective Action Details
              </Link>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-surface-container-low dark:bg-[#161F30]/60 border border-outline-variant/30 space-y-2 text-xs">
            <p className="text-on-surface">
              You are currently handling this grievance independently. No case information is shared for collective advocacy.
            </p>
            <Link
              href={`/cases/${caseId}/collective-action`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-primary dark:text-primary-fixed hover:underline"
            >
              <span>Explore Potential Collective Groups</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
        )}
      </section>
    </div>
  );
};
