'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useLegalSaathi } from '../../../../context/LegalSaathiContext';
import { CaseContextBanner } from '../../../../components/CaseContextBanner';
import { EvidenceOverview } from '../../../../components/EvidenceOverview';
import { EvidenceItemCard } from '../../../../components/EvidenceItemCard';
import { EvidenceStatus } from '../../../../lib/types';

export default function CaseEvidencePage() {
  const params = useParams();
  const caseId = (params?.caseId as string) || 'LS-2026-0042';
  const { cases, updateEvidenceStatus, addEvidenceItem } = useLegalSaathi();

  const currentCase = cases.find((c) => c.id === caseId) || cases[0];
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Proof of Payment / Bank Record');
  const [newDescription, setNewDescription] = useState('');

  const filteredItems = currentCase.evidenceList.filter((item) => {
    if (filterStatus === 'ALL') return true;
    if (filterStatus === 'COLLECTED') return item.status === 'COLLECTED' || item.status === 'VERIFIED';
    if (filterStatus === 'NEEDS_REVIEW') return item.status === 'NEEDS_REVIEW' || item.status === 'REVIEW_NEEDED';
    if (filterStatus === 'MISSING') return item.status === 'MISSING';
    if (filterStatus === 'NOT_APPLICABLE') return item.status === 'NOT_APPLICABLE';
    return true;
  });

  const handleAddNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTitle.trim()) {
      addEvidenceItem(currentCase.id, {
        name: newTitle.trim(),
        category: newCategory,
        status: 'COLLECTED',
        statusLabel: 'Citizen Uploaded',
        description: newDescription.trim(),
        collectedAt: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
      });
      setNewTitle('');
      setNewDescription('');
      setShowAddModal(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-background text-on-surface pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
        {/* Navigation Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-on-surface-variant">
          <div className="flex items-center gap-2">
            <Link
              href="/complaints"
              className="text-primary dark:text-primary-fixed hover:text-secondary font-semibold transition-colors"
            >
              My Complaints
            </Link>
            <span>/</span>
            <Link
              href={`/cases/${currentCase.id}`}
              className="text-primary dark:text-primary-fixed hover:text-secondary font-semibold transition-colors"
            >
              Case #{currentCase.id}
            </Link>
            <span>/</span>
            <span className="text-on-surface font-bold">Evidence Dossier</span>
          </div>

          <Link
            href={`/cases/${currentCase.id}`}
            className="inline-flex items-center gap-1 text-primary dark:text-primary-fixed font-bold hover:underline"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            <span>Return to Workspace</span>
          </Link>
        </div>

        {/* Case Context Banner */}
        <CaseContextBanner currentActionTitle="Reviewing Evidence Dossier" caseId={currentCase.id} />

        {/* Evidence Overview Counter & Filters */}
        <EvidenceOverview
          currentCase={currentCase}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          onAddNewClick={() => setShowAddModal(true)}
        />

        {/* Evidence Cards List */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredItems.map((item) => (
              <EvidenceItemCard
                key={item.id}
                item={item}
                onStatusChange={(newStatus: EvidenceStatus) =>
                  updateEvidenceStatus(currentCase.id, item.id, newStatus)
                }
                onAddNote={() => {
                  updateEvidenceStatus(currentCase.id, item.id, item.status);
                }}
              />
            ))}
          </div>
        ) : (
          <div className="bg-surface-container-lowest dark:bg-[#0F131C] rounded-2xl p-12 text-center border border-outline-variant/30 flex flex-col items-center gap-3">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant">
              folder_off
            </span>
            <h3 className="font-heading text-lg font-bold text-on-surface">
              No evidence records found under &quot;{filterStatus}&quot;
            </h3>
            <p className="text-xs text-on-surface-variant max-w-md">
              Switch filter to All Items or upload a new documentary proof to attach to this case.
            </p>
            <button
              onClick={() => setFilterStatus('ALL')}
              className="mt-2 px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-secondary transition-colors"
            >
              Show All Evidence Records
            </button>
          </div>
        )}

        {/* Next Step Action Gateway */}
        <div className="bg-surface-container-lowest dark:bg-[#0F131C] rounded-2xl p-6 shadow-sm border border-outline-variant/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-heading text-sm font-bold text-on-surface">
              Evidence Ready for Action?
            </h4>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Once critical evidence is collected, proceed to draft a formal legal notice or approach DLSA legal aid.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/draft/legal-notice"
              className="px-4 py-2 rounded-xl bg-primary hover:bg-secondary text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
            >
              <span>Draft Legal Notice</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>

            <Link
              href="/actions"
              className="px-4 py-2 rounded-xl bg-surface-container-low dark:bg-[#161F30] hover:bg-surface-container-high border border-outline-variant/30 text-on-surface text-xs font-semibold transition-colors"
            >
              Action Center
            </Link>
          </div>
        </div>

        {/* Modal: Add New Evidence Document */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-surface-container-lowest dark:bg-[#0F131C] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-outline-variant/40 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h4 className="font-heading text-lg font-bold text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">post_add</span>
                  Add Document to Evidence Dossier
                </h4>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-on-surface-variant hover:text-on-surface"
                  type="button"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <form onSubmit={handleAddNewItem} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-on-surface block mb-1">
                    Document Title / Description *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Electricity Bill or Handover Receipt"
                    className="w-full text-xs p-2.5 rounded-lg bg-surface-container-low dark:bg-[#161F30] border border-outline-variant/40 text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary"
                  />
                </div>

                <div>
                  <label className="font-bold text-on-surface block mb-1">
                    Evidence Category *
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg bg-surface-container-low dark:bg-[#161F30] border border-outline-variant/40 text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary"
                  >
                    <option value="Proof of Payment / Bank Record">Proof of Payment / Bank Record</option>
                    <option value="Contract / Agreement Deed">Contract / Agreement Deed</option>
                    <option value="Written Communication / Notice">Written Communication / Notice</option>
                    <option value="Photographic / Media Proof">Photographic / Media Proof</option>
                    <option value="Official Regulatory Order">Official Regulatory Order</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-on-surface block mb-1">
                    Context or Purpose of this Evidence:
                  </label>
                  <textarea
                    rows={2}
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Why this document matters to the case..."
                    className="w-full text-xs p-2.5 rounded-lg bg-surface-container-low dark:bg-[#161F30] border border-outline-variant/40 text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-on-surface-variant hover:text-on-surface"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-primary hover:bg-secondary text-white text-xs font-bold shadow-sm"
                  >
                    Save & Mark Collected
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
