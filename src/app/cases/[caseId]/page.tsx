'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useLegalSaathi } from '@/context/LegalSaathiContext';
import { CaseWorkspaceHeader } from '@/components/case/CaseWorkspaceHeader';
import { CaseLeftNav } from '@/components/case/CaseLeftNav';
import { CaseOverviewSection } from '@/components/case/CaseOverviewSection';
import { ContextualAssistant } from '@/components/case/ContextualAssistant';

// Detailed Workspace Section Components
import { CaseTimelineView } from '@/components/CaseTimelineView';
import { EvidenceOverview } from '@/components/EvidenceOverview';
import { EvidenceItemCard } from '@/components/EvidenceItemCard';
import { LegalSourceCard } from '@/components/LegalSourceCard';
import { MissingInfoAssistant } from '@/components/MissingInfoAssistant';
import { FactVerificationCard } from '@/components/FactVerificationCard';
import { FactToLawTrace } from '@/components/FactToLawTrace';
import { SourceComparisonView } from '@/components/SourceComparisonView';
import { LegalNoticeEditor } from '@/components/LegalNoticeEditor';
import { LegalNoticePreview } from '@/components/LegalNoticePreview';
import { SimilarCaseCard } from '@/components/SimilarCaseCard';
import { CasePackagePreview } from '@/components/CasePackagePreview';

// Types & Helpers
import { LegalNoticeDraft, EvidenceStatus, LegalExplanationTrace, SimilarCaseCluster } from '@/lib/types';
import { legalSaathiApi } from '@/lib/api';
import { buildCaseExplanationTrace, detectCaseDomain } from '@/lib/rules-engine';
import { buildCaseSpecificDraft } from '@/lib/draft-templates';

function CaseWorkspaceInner() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const caseId = (params?.caseId as string) || '';
  const {
    cases,
    activeCaseId,
    setActiveCaseId,
    updateEvidenceStatus,
    addEvidenceItem,
    addTimelineEvent,
    updateTimelineEvent,
    updateFactVerificationStatus,
    resolveFactConflict,
    userNotes,
    addUserNote,
    legalNoticeDrafts,
    saveLegalNoticeDraft,
  } = useLegalSaathi();

  // Find matching case
  const currentCase = cases.find((c) => c.id === caseId);

  // Synchronize activeCaseId across global context when case is found
  useEffect(() => {
    if (caseId && currentCase && currentCase.id !== activeCaseId) {
      setActiveCaseId(currentCase.id);
    }
  }, [caseId, currentCase, activeCaseId, setActiveCaseId]);

  // Active tab state, synchronized with query params if available
  const tabFromQuery = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState<string>(tabFromQuery || 'overview');
  const [assistantOpen, setAssistantOpen] = useState<boolean>(true);
  const [assistantMinimized, setAssistantMinimized] = useState<boolean>(false);

  // Evidence filter & modal state
  const [evidenceFilter, setEvidenceFilter] = useState<string>('ALL');
  const [showAddEvidenceModal, setShowAddEvidenceModal] = useState<boolean>(false);
  const [newEvidenceTitle, setNewEvidenceTitle] = useState('');
  const [newEvidenceCategory, setNewEvidenceCategory] = useState('Proof of Payment / Bank Record');
  const [newEvidenceDesc, setNewEvidenceDesc] = useState('');

  const [actionStep, setActionStep] = useState<'parameters' | 'preview'>('parameters');

  // Legal Notice Draft State initialized dynamically from case facts
  const [draft, setDraft] = useState<LegalNoticeDraft>(() => {
    const cId = currentCase?.id || caseId;
    if (legalNoticeDrafts[cId]) return legalNoticeDrafts[cId];
    if (currentCase) return buildCaseSpecificDraft(currentCase);
    return {
      id: `draft-${cId}`,
      caseId: cId,
      recipientName: 'Opposing Party / Authorized Signatory',
      recipientAddress: 'Jurisdiction of Dispute',
      senderName: 'Aggrieved Citizen',
      senderAddress: 'Correspondence Address',
      incidentDate: new Date().toLocaleDateString('en-IN'),
      demandedAmount: 'Statutory Claim',
      curePeriodDays: 15,
      factsSummary: 'Statement of facts recorded in docket.',
      statutoryBasis: 'Indian Statutory Framework',
      demands: [
        'Immediate compliance within 15 statutory business days.',
        'Reimbursement of outstanding claim amount and formal communication to the aggrieved party.'
      ],
      version: 1
    };
  });

  // Synchronize draft when currentCase changes
  useEffect(() => {
    if (currentCase) {
      const existing = legalNoticeDrafts[currentCase.id];
      if (existing) {
        setDraft(existing);
      } else {
        setDraft(buildCaseSpecificDraft(currentCase));
      }
    }
  }, [currentCase?.id]);

  useEffect(() => {
    if (tabFromQuery && tabFromQuery !== activeTab) {
      setActiveTab(tabFromQuery);
    }
  }, [tabFromQuery]);

  const handleSelectTab = (tabId: string) => {
    setActiveTab(tabId);
    // Soft update URL query param without full page reload
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', tabId);
      window.history.pushState({}, '', url.toString());
    }
  };

  // Add Evidence Item Handler
  const handleAddEvidence = (e: React.FormEvent) => {
    e.preventDefault();
    if (newEvidenceTitle.trim() && currentCase) {
      addEvidenceItem(currentCase.id, {
        name: newEvidenceTitle.trim(),
        category: newEvidenceCategory,
        status: 'COLLECTED',
        statusLabel: 'Citizen Uploaded',
        description: newEvidenceDesc.trim(),
        collectedAt: new Date().toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
      });
      setNewEvidenceTitle('');
      setNewEvidenceDesc('');
      setShowAddEvidenceModal(false);
    }
  };

  // Guard against missing or invalid case IDs
  if (!currentCase) {
    return (
      <div className="w-full min-h-[calc(100vh-4rem)] flex items-center justify-center p-6 bg-slate-50/50 dark:bg-[#090D16] text-slate-900 dark:text-slate-100">
        <div className="max-w-md w-full bg-white dark:bg-[#111827] rounded-3xl p-8 border border-slate-200 dark:border-slate-800 text-center space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-3xl">folder_off</span>
          </div>
          <h2 className="font-heading text-xl font-bold">Matter Docket Not Found</h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            No matter with docket ID <strong className="font-mono text-blue-600 dark:text-blue-400">{caseId}</strong> was found in your vault. It may have been archived or entered incorrectly.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/complaints"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs"
            >
              Return to My Matters
            </Link>
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-[#1E293B] hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all"
            >
              Portal Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Filter evidence items
  const filteredEvidenceItems = currentCase.evidenceList.filter((item) => {
    if (evidenceFilter === 'ALL') return true;
    if (evidenceFilter === 'COLLECTED') return item.status === 'COLLECTED' || item.status === 'VERIFIED';
    if (evidenceFilter === 'NEEDS_REVIEW')
      return item.status === 'NEEDS_REVIEW' || item.status === 'REVIEW_NEEDED';
    if (evidenceFilter === 'MISSING') return item.status === 'MISSING';
    if (evidenceFilter === 'NOT_APPLICABLE') return item.status === 'NOT_APPLICABLE';
    return true;
  });

  // Explanation Trace for Why Law Applies synthesized dynamically from case domain and facts
  const trace: LegalExplanationTrace = buildCaseExplanationTrace(currentCase);

  // Similar cases for Collective Assistance
  const [relevantClusters, setRelevantClusters] = useState<SimilarCaseCluster[]>([]);
  useEffect(() => {
    legalSaathiApi.getClusters().then((res) => {
      setRelevantClusters(res);
    }).catch(() => {});
  }, []);

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] bg-slate-50/60 dark:bg-[#090D16] text-slate-900 dark:text-slate-100 transition-colors pb-16">
      {/* ========================================================================= */}
      {/* REGION A: PERSISTENT CASE HEADER WITH HORIZONTAL SUB-TABS                 */}
      {/* ========================================================================= */}
      <CaseWorkspaceHeader
        currentCase={currentCase}
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        onExportDossier={() => handleSelectTab('export')}
        assistantOpen={assistantOpen}
        onToggleAssistant={() => {
          setAssistantOpen(!assistantOpen);
          if (!assistantOpen) setAssistantMinimized(false);
        }}
      />

      {/* ========================================================================= */}
      {/* REGIONS B, C, D: THREE-COLUMN WORKSPACE CONTAINER                         */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* REGION B: LEFT WORKSPACE NAVIGATION (Col 1-3) */}
          <div className="lg:col-span-3 shrink-0">
            <CaseLeftNav
              activeTab={activeTab}
              onSelectTab={handleSelectTab}
              onOpenAssistant={() => {
                setAssistantOpen(true);
                setAssistantMinimized(false);
                // On mobile, scroll down smoothly to assistant
                if (window.innerWidth < 1024) {
                  document.getElementById('case-assistant-panel')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            />
          </div>

          {/* REGION C: CENTRAL CASE WORKSPACE (Col 4-8 or 4-9) */}
          <div
            className={`${
              assistantOpen ? 'lg:col-span-6 xl:col-span-6' : 'lg:col-span-9'
            } flex flex-col gap-6 min-w-0 transition-all`}
          >
            {/* 1. OVERVIEW SECTION (Matches Reference Screenshot) */}
            {activeTab === 'overview' && (
              <CaseOverviewSection currentCase={currentCase} onSelectTab={handleSelectTab} />
            )}

            {/* 2. CASE TIMELINE SECTION */}
            {activeTab === 'timeline' && (
              <div className="flex flex-col gap-4">
                <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-2xs flex items-center justify-between">
                  <div>
                    <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white">
                      Procedural Case Timeline
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Chronological log of verified events, citizen notices, and counterparty communications.
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1 rounded-lg">
                    {currentCase.timeline.length} Milestones
                  </span>
                </div>

                <CaseTimelineView
                  timeline={currentCase.timeline}
                  caseId={currentCase.id}
                  currentStage={currentCase.currentStage || 'VERIFY'}
                  onAddEvent={(evt) => addTimelineEvent(currentCase.id, evt)}
                  onUpdateEvent={(id, upd) => updateTimelineEvent(currentCase.id, id, upd)}
                />
              </div>
            )}

            {/* 3. EVIDENCE & DOCUMENTS (The beloved user interface preserved!) */}
            {activeTab === 'evidence' && (
              <div className="flex flex-col gap-6">
                <EvidenceOverview
                  currentCase={currentCase}
                  filterStatus={evidenceFilter}
                  setFilterStatus={setEvidenceFilter}
                  onAddNewClick={() => setShowAddEvidenceModal(true)}
                />

                {filteredEvidenceItems.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredEvidenceItems.map((item) => (
                      <EvidenceItemCard
                        key={item.id}
                        item={item}
                        onStatusChange={(newStatus: EvidenceStatus) =>
                          updateEvidenceStatus(currentCase.id, item.id, newStatus)
                        }
                        onAddNote={(note: string) => addUserNote(currentCase.id, note)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="p-8 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
                    No evidence items match the selected filter.
                  </div>
                )}
              </div>
            )}

            {/* 4. LEGAL SOURCES LIBRARY */}
            {activeTab === 'sources' && (
              <div className="flex flex-col gap-5">
                <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white">
                      Verified Legal Sources &amp; Jurisprudence
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Statutory bare acts, relevant sections, and precedents grounded in Indian law.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSelectTab('compare')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-bold self-start sm:self-auto hover:bg-blue-100 transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">compare_arrows</span>
                    <span>Compare Sources</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {currentCase.legalSources.map((src) => (
                    <LegalSourceCard key={src.id} source={src} isLinkedToActiveCase={true} />
                  ))}
                </div>
              </div>
            )}

            {/* 5. MISSING INFORMATION ASSISTANT */}
            {activeTab === 'missing-info' && (
              <div className="flex flex-col gap-5">
                <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                  <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white">
                    Missing Information &amp; Evidentiary Gaps
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Answering these targeted inquiries will strengthen your legal standing under Indian tenancy jurisprudence.
                  </p>
                </div>
                <MissingInfoAssistant caseId={currentCase.id} />
              </div>
            )}

            {/* 6. CASE VERIFICATION */}
            {activeTab === 'verification' && (
              <div className="flex flex-col gap-5">
                <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-2xs flex items-center justify-between">
                  <div>
                    <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white">
                      Fact Verification &amp; Corroboration
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Review key factual statements to confirm they are backed by documentary proof.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-lg">
                    {currentCase.keyFacts.filter((f) => f.verificationStatus === 'CONFIRMED').length} Confirmed
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {currentCase.keyFacts.map((fact) => (
                    <FactVerificationCard
                      key={fact.id}
                      fact={fact}
                      caseId={currentCase.id}
                      onUpdateStatus={(fid, st) => updateFactVerificationStatus(currentCase.id, fid, st)}
                      onResolveConflict={(fid, note) => resolveFactConflict(currentCase.id, fid, note)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* 7. WHY LAW APPLIES (LEGAL EXPLANATION TRACE) */}
            {activeTab === 'explanation' && (
              <div className="flex flex-col gap-5">
                <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                  <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white">
                    Why This Law Applies (Statutory Linkage)
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Follow how verified facts connect directly to statutory provisions, tribunals, and remedies.
                  </p>
                </div>
                <FactToLawTrace trace={trace} caseId={currentCase.id} />
              </div>
            )}

            {/* 8. COMPARE SOURCES */}
            {activeTab === 'compare' && (
              <div className="flex flex-col gap-5">
                <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                  <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white">
                    Side-by-Side Legal Source Comparison
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Compare obligations, definitions, and penalties across central acts, state amendments, and precedents.
                  </p>
                </div>
                <SourceComparisonView caseId={currentCase.id} caseTitle={currentCase.title} />
              </div>
            )}

            {/* 9. LEGAL ACTIONS & NOTICES */}
            {activeTab === 'actions' && (
              <div className="flex flex-col gap-5">
                <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white">
                      Legal Action &amp; Notice Workflow
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {detectCaseDomain(currentCase) === 'property_rera'
                        ? 'Prepare a formal Section 18 RERA Delayed Possession Demand Notice grounded in your verified facts.'
                        : detectCaseDomain(currentCase) === 'employment'
                        ? 'Prepare a formal Statutory Salary Demand Notice under the Code on Wages, 2019.'
                        : detectCaseDomain(currentCase) === 'cybercrime'
                        ? 'Prepare a formal IT Act & Banking Redressal Notice under RBI Master Directions.'
                        : detectCaseDomain(currentCase) === 'consumer'
                        ? 'Prepare a formal Section 35 Consumer Dispute Redressal Notice.'
                        : 'Prepare a formal Statutory Demand Notice pre-populated with your verified facts.'}
                    </p>
                  </div>

                  {/* Workflow Stepper Navigation */}
                  <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setActionStep('parameters')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                        actionStep === 'parameters'
                          ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                      }`}
                    >
                      <span className="material-symbols-outlined text-sm">tune</span>
                      <span>1. Parameters</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActionStep('preview')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                        actionStep === 'preview'
                          ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                      }`}
                    >
                      <span className="material-symbols-outlined text-sm">visibility</span>
                      <span>2. Preview &amp; AI Edit</span>
                    </button>
                  </div>
                </div>

                {actionStep === 'parameters' ? (
                  <LegalNoticeEditor
                    currentCase={currentCase}
                    draft={draft}
                    onDraftChange={(updated) => {
                      setDraft(updated);
                      saveLegalNoticeDraft(currentCase.id, updated);
                    }}
                    onSave={() => saveLegalNoticeDraft(currentCase.id, draft)}
                    onRegenerate={() => {
                      if (confirm('Regenerate draft from case facts and statutory citations?')) {
                        const regenerated = buildCaseSpecificDraft(currentCase);
                        setDraft(regenerated);
                        saveLegalNoticeDraft(currentCase.id, regenerated);
                      }
                    }}
                    onPreviewClick={() => setActionStep('preview')}
                  />
                ) : (
                  <LegalNoticePreview
                    draft={draft}
                    caseId={currentCase.id}
                    onEditFieldsClick={() => setActionStep('parameters')}
                    onUpdateDraft={(updated) => {
                      setDraft(updated);
                      saveLegalNoticeDraft(currentCase.id, updated);
                    }}
                    onSaveDraft={() => saveLegalNoticeDraft(currentCase.id, draft)}
                  />
                )}
              </div>
            )}

            {/* 10. COLLECTIVE ASSISTANCE (EKJUT) */}
            {activeTab === 'collective' && (
              <div className="flex flex-col gap-5">
                <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                  <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white">
                    Ekjut Collective Action &amp; Similar Patterns
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Connect with or pool evidence with other citizens facing identical landlords or builders under strict privacy consent.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {relevantClusters.map((cluster) => (
                    <SimilarCaseCard key={cluster.id} cluster={cluster} activeCaseId={currentCase.id} />
                  ))}
                </div>
              </div>
            )}

            {/* 11. EXPORT DOSSIER */}
            {activeTab === 'export' && (
              <div className="flex flex-col gap-5">
                <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                  <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white">
                    Export Case Package &amp; Print Dossier
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Export verified records and structured summaries for tribunal presentation or consultation with a DLSA panel advocate.
                  </p>
                </div>

                <CasePackagePreview
                  currentCase={currentCase}
                  userNotes={userNotes[currentCase.id] || []}
                />
              </div>
            )}
          </div>

          {/* REGION D: RIGHT-SIDE CONTEXTUAL ASSISTANT (Col 9-12 or 10-12) */}
          <div
            id="case-assistant-panel"
            className={`${
              assistantOpen ? 'lg:col-span-3 xl:col-span-3' : 'hidden'
            } sticky top-20 flex flex-col`}
          >
            <ContextualAssistant
              currentCase={currentCase}
              onSelectTab={handleSelectTab}
              onClose={() => setAssistantOpen(false)}
              isMinimized={assistantMinimized}
              onToggleMinimize={() => setAssistantMinimized(!assistantMinimized)}
            />
          </div>
        </div>
      </div>

      {/* Floating Re-Open Assistant Button when closed on desktop */}
      {!assistantOpen && (
        <button
          type="button"
          onClick={() => {
            setAssistantOpen(true);
            setAssistantMinimized(false);
          }}
          className="fixed bottom-6 right-6 p-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white shadow-xl flex items-center gap-2 z-40 transition-transform hover:scale-105"
          title="Open Legal Saathi Assistant"
        >
          <span className="material-symbols-outlined text-xl">smart_toy</span>
          <span className="text-xs font-bold hidden sm:inline">Ask Assistant</span>
        </button>
      )}

      {/* Upload Evidence Modal */}
      {showAddEvidenceModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="w-full max-w-lg bg-white dark:bg-[#111827] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white">
                Upload New Evidence
              </h3>
              <button
                type="button"
                onClick={() => setShowAddEvidenceModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <form onSubmit={handleAddEvidence} className="flex flex-col gap-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Document / Proof Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Move-Out Inspection Video / Photos"
                  value={newEvidenceTitle}
                  onChange={(e) => setNewEvidenceTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Category
                </label>
                <select
                  value={newEvidenceCategory}
                  onChange={(e) => setNewEvidenceCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value="Proof of Payment / Bank Record">Proof of Payment / Bank Record</option>
                  <option value="Possession & Handover">Possession &amp; Handover</option>
                  <option value="Lease Agreement">Lease Agreement</option>
                  <option value="Communications & Notice">Communications &amp; Notice</option>
                  <option value="Damage Dispute Rebuttal">Damage Dispute Rebuttal</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Description / Context
                </label>
                <textarea
                  rows={2}
                  placeholder="Detail why this document corroborates your claim under Indian law..."
                  value={newEvidenceDesc}
                  onChange={(e) => setNewEvidenceDesc(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddEvidenceModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors"
                >
                  Save to Evidence Dossier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CaseWorkspacePage() {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#090D16] text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
            <span>Loading Legal Saathi Case Workspace...</span>
          </div>
        </div>
      }
    >
      <CaseWorkspaceInner />
    </Suspense>
  );
}
