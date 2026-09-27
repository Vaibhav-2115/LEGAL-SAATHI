'use client';

import React, { useState } from 'react';
import { LegalNoticeDraft, DraftVersion } from '../lib/types';
import { legalSaathiApi } from '../lib/api';
import { useLegalSaathi } from '../context/LegalSaathiContext';
import { generateFullNoticeText } from '../lib/draft-templates';

interface LegalNoticePreviewProps {
  draft: LegalNoticeDraft;
  caseId: string;
  onEditFieldsClick: () => void;
  onUpdateDraft: (updated: LegalNoticeDraft) => void;
  onSaveDraft: () => void;
  onExportPdf?: () => void;
  onCopyText?: () => void;
}

export const LegalNoticePreview: React.FC<LegalNoticePreviewProps> = ({
  draft,
  caseId,
  onEditFieldsClick,
  onUpdateDraft,
  onSaveDraft,
  onExportPdf,
  onCopyText
}) => {
  const { language, t } = useLegalSaathi();
  const [isManualEditing, setIsManualEditing] = useState(false);
  const [manualText, setManualText] = useState(draft.fullDocumentText || generateFullNoticeText(draft, caseId));
  const [hasUnsavedManualChanges, setHasUnsavedManualChanges] = useState(false);

  // AI Editing Modal State
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiInstruction, setAiInstruction] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiProposedText, setAiProposedText] = useState<string | null>(null);
  const [aiChangeExplanation, setAiChangeExplanation] = useState<string | null>(null);
  const [aiDiffSummary, setAiDiffSummary] = useState<string | null>(null);

  // Version History Modal State
  const [showVersionModal, setShowVersionModal] = useState(false);

  // Quick Prompt Presets for AI Editing
  const promptPresets = [
    'Make this notice more formal and authoritative',
    'Translate this entire notice into Hindi',
    'Make the language concise and direct',
    'Correct grammar and ensure active legal voice',
    'Strengthen the statutory liability section',
    'Add specific emphasis on statutory interest penalties'
  ];

  // Current displayed document text
  const currentDocText = draft.fullDocumentText || generateFullNoticeText(draft, caseId);

  // Handle Manual Edit Save
  const handleSaveManualEdit = () => {
    const nextVersion = (draft.version || 1) + 1;
    const newVersionRecord: DraftVersion = {
      version: nextVersion,
      content: manualText,
      source: 'manual',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      notes: 'Manual full-text edits by user'
    };

    const updated: LegalNoticeDraft = {
      ...draft,
      fullDocumentText: manualText,
      version: nextVersion,
      versions: [...(draft.versions || []), newVersionRecord],
      lastSaved: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    onUpdateDraft(updated);
    setHasUnsavedManualChanges(false);
    setIsManualEditing(false);
    onSaveDraft();
  };

  // Cancel Manual Edit
  const handleCancelManualEdit = () => {
    if (hasUnsavedManualChanges && !confirm('Discard unsaved manual changes?')) {
      return;
    }
    setManualText(currentDocText);
    setHasUnsavedManualChanges(false);
    setIsManualEditing(false);
  };

  // Request AI Draft Revision
  const handleRequestAiEdit = async (instructionToRun?: string) => {
    const prompt = instructionToRun || aiInstruction;
    if (!prompt.trim() || isAiLoading) return;

    setIsAiLoading(true);
    setAiError(null);
    setAiProposedText(null);
    setAiChangeExplanation(null);
    setAiDiffSummary(null);

    try {
      const langCode = language === 'Hindi' ? 'hi' : 'en';
      const res = await legalSaathiApi.editDraftWithAI(
        currentDocText,
        prompt.trim(),
        caseId,
        undefined,
        langCode
      );

      setAiProposedText(res.revisedText);
      setAiChangeExplanation(res.explanation);
      setAiDiffSummary(res.diffSummary && res.diffSummary.length > 0 ? res.diffSummary.join('\n') : null);
    } catch (err: any) {
      console.error('AI Draft Edit failed:', err);
      setAiError(err.message || 'AI revision request failed. Please check connectivity and try again.');
    } finally {
      setIsAiLoading(false);
    }
  };

  // Accept AI Revision
  const handleAcceptAiEdit = () => {
    if (!aiProposedText) return;

    const nextVersion = (draft.version || 1) + 1;
    const newVersionRecord: DraftVersion = {
      version: nextVersion,
      content: aiProposedText,
      source: 'ai_edit',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      notes: `AI Edit: ${aiInstruction || 'Natural language refinement'}`
    };

    const updated: LegalNoticeDraft = {
      ...draft,
      fullDocumentText: aiProposedText,
      version: nextVersion,
      versions: [...(draft.versions || []), newVersionRecord],
      lastSaved: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    onUpdateDraft(updated);
    setManualText(aiProposedText);
    setShowAiModal(false);
    setAiProposedText(null);
    setAiInstruction('');
    onSaveDraft();
  };

  // Reject AI Revision
  const handleRejectAiEdit = () => {
    setAiProposedText(null);
    setAiChangeExplanation(null);
    setAiDiffSummary(null);
  };

  // Restore a previous version from Version History
  const handleRestoreVersion = (ver: DraftVersion) => {
    if (!confirm(`Restore Version ${ver.version} (${ver.source})? This will replace the current draft.`)) {
      return;
    }

    const nextVersion = (draft.version || 1) + 1;
    const restoreRecord: DraftVersion = {
      version: nextVersion,
      content: ver.content,
      source: 'manual',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      notes: `Restored from Version ${ver.version}`
    };

    const updated: LegalNoticeDraft = {
      ...draft,
      fullDocumentText: ver.content,
      version: nextVersion,
      versions: [...(draft.versions || []), restoreRecord],
      lastSaved: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    onUpdateDraft(updated);
    setManualText(ver.content);
    setShowVersionModal(false);
    onSaveDraft();
  };

  const handleCopy = () => {
    if (onCopyText) {
      onCopyText();
    } else {
      navigator.clipboard.writeText(currentDocText);
      alert('Draft document copied to clipboard!');
    }
  };

  const handleExport = () => {
    if (onExportPdf) {
      onExportPdf();
    } else {
      window.print();
    }
  };

  return (
    <div className="bg-surface-container-lowest dark:bg-[#0F131C] rounded-2xl p-5 sm:p-6 shadow-sm border border-outline-variant/30 flex flex-col gap-5">
      {/* Top Action Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-outline-variant/30">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider font-mono">
              LEGAL DRAFT DOCUMENT #{caseId}
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
              v{draft.version || 1}.0 {draft.lastSaved ? `• Saved ${draft.lastSaved}` : '• Ready'}
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
              {draft.documentType || 'LEGAL NOTICE'}
            </span>
          </div>
          <h3 className="font-heading text-lg font-bold text-on-surface mt-0.5">
            {t.draftPreview}
          </h3>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {!isManualEditing ? (
            <>
              <button
                type="button"
                onClick={onEditFieldsClick}
                className="px-3 py-1.5 rounded-lg bg-surface-container-low dark:bg-[#161F30] hover:bg-surface-container-high text-xs font-semibold text-on-surface border border-outline-variant/40 transition-colors flex items-center gap-1 shadow-2xs"
                title="Edit form parameters"
              >
                <span className="material-symbols-outlined text-sm">tune</span>
                <span>{t.btnEditFields}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setManualText(currentDocText);
                  setIsManualEditing(true);
                }}
                className="px-3 py-1.5 rounded-lg bg-surface-container-low dark:bg-[#161F30] hover:bg-surface-container-high text-xs font-semibold text-on-surface border border-outline-variant/40 transition-colors flex items-center gap-1 shadow-2xs"
                title="Direct full-text manual edit"
              >
                <span className="material-symbols-outlined text-sm">edit_note</span>
                <span>{t.btnEditManually}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowAiModal(true)}
                className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold transition-all shadow-2xs flex items-center gap-1"
                title="Edit draft with AI assistant"
              >
                <span className="material-symbols-outlined text-sm">auto_fix_high</span>
                <span>{t.btnEditWithAi}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowVersionModal(true)}
                className="px-3 py-1.5 rounded-lg bg-surface-container-low dark:bg-[#161F30] hover:bg-surface-container-high text-xs font-semibold text-on-surface border border-outline-variant/40 transition-colors flex items-center gap-1 shadow-2xs"
                title="View version history and restore prior revisions"
              >
                <span className="material-symbols-outlined text-sm">history</span>
                <span>History ({draft.versions?.length || 1})</span>
              </button>

              <button
                type="button"
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-lg bg-surface-container-low dark:bg-[#161F30] hover:bg-surface-container-high text-xs font-semibold text-on-surface border border-outline-variant/40 transition-colors flex items-center gap-1 shadow-2xs"
                title="Copy entire document text"
              >
                <span className="material-symbols-outlined text-sm">content_copy</span>
                <span>Copy</span>
              </button>

              <button
                type="button"
                onClick={handleExport}
                className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                title="Print or export as PDF"
              >
                <span className="material-symbols-outlined text-sm">print</span>
                <span>{t.btnPrintExport}</span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={handleCancelManualEdit}
                className="px-3 py-1.5 rounded-lg border border-outline-variant/40 text-xs font-semibold text-on-surface hover:bg-surface-container-low transition-colors"
              >
                {t.btnCancel}
              </button>
              <button
                type="button"
                onClick={handleSaveManualEdit}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">save</span>
                <span>{t.btnSaveDraft}</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Legal Safety UX Notice Banner */}
      <div className="bg-amber-50 dark:bg-amber-950/40 border-l-4 border-amber-500 rounded-xl p-3.5 text-xs text-amber-900 dark:text-amber-300 leading-relaxed">
        <strong>IMPORTANT LEGAL NOTICE DISCLAIMER:</strong> This is a structured draft prepared from the facts
        and documents recorded in your case file. It is generated for civic guidance and reference purposes. Legal Saathi
        is an automated AI civic assistant, not a legal practitioner or law firm. You should review and verify the particulars
        with an advocate or Legal Aid Authority before formal dispatch via registered post.
      </div>

      {/* DOCUMENT VIEW / MANUAL EDITOR */}
      {isManualEditing ? (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-bold flex items-center gap-1 text-blue-600 dark:text-blue-400">
              <span className="material-symbols-outlined text-sm">edit_note</span>
              Manual Document Editor Mode (Changes will be saved as Version {(draft.version || 1) + 1})
            </span>
            <span>{manualText.length} characters</span>
          </div>

          <textarea
            rows={22}
            value={manualText}
            onChange={(e) => {
              setManualText(e.target.value);
              setHasUnsavedManualChanges(true);
            }}
            className="w-full p-4 rounded-xl border border-blue-500/50 dark:border-blue-600/50 bg-white dark:bg-[#090D16] font-mono text-xs text-slate-900 dark:text-slate-100 leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500/30 shadow-inner resize-y"
            placeholder="Edit notice full text directly..."
          />
        </div>
      ) : (
        /* Styled Printable Document Sheet */
        <div className="bg-white dark:bg-[#090D16] rounded-xl border border-outline-variant/40 p-6 sm:p-8 font-serif text-slate-900 dark:text-slate-100 text-xs sm:text-sm leading-relaxed shadow-sm space-y-4">
          <div className="whitespace-pre-line font-serif text-xs sm:text-sm leading-relaxed text-slate-800 dark:text-slate-200 selection:bg-blue-100 dark:selection:bg-blue-900">
            {currentDocText}
          </div>
        </div>
      )}

      {/* MODAL 1: EDIT WITH AI */}
      {showAiModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="w-full max-w-3xl bg-white dark:bg-[#111827] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-lg">auto_fix_high</span>
                </div>
                <div>
                  <h3 className="font-heading text-base font-bold text-slate-900 dark:text-white">
                    {t.aiEditorTitle}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Instruct AI in natural language to refine, translate, or adapt your legal notice.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowAiModal(false);
                  setAiProposedText(null);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            {/* AI Error Alert */}
            {aiError && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 text-xs text-rose-800 dark:text-rose-200 flex items-start gap-2">
                <span className="material-symbols-outlined text-base text-rose-600 shrink-0">error</span>
                <span>{aiError}</span>
              </div>
            )}

            {/* Instruction Composer */}
            {!aiProposedText ? (
              <div className="flex flex-col gap-3">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {t.aiInstructionLabel}
                </label>
                <div className="relative">
                  <textarea
                    rows={3}
                    value={aiInstruction}
                    onChange={(e) => setAiInstruction(e.target.value)}
                    placeholder={t.aiInstructionPlaceholder}
                    disabled={isAiLoading}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                  />
                </div>

                {/* Preset Prompt Pills */}
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Quick Suggestions:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {promptPresets.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setAiInstruction(preset);
                          handleRequestAiEdit(preset);
                        }}
                        disabled={isAiLoading}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-100 dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-purple-950/40 text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 border border-slate-200 dark:border-slate-700 transition-colors disabled:opacity-50 text-left"
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowAiModal(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300"
                  >
                    {t.btnCancel}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRequestAiEdit()}
                    disabled={!aiInstruction.trim() || isAiLoading}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-colors shadow-sm disabled:opacity-50 flex items-center gap-1.5"
                  >
                    {isAiLoading ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Applying AI Revisions...</span>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-sm">auto_fix_high</span>
                        <span>{t.btnGenerateRevision}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              /* Proposed Revision Comparison View */
              <div className="flex flex-col gap-4">
                <div className="p-3 bg-purple-50 dark:bg-purple-950/40 rounded-xl border border-purple-200 dark:border-purple-800/60 text-xs text-purple-950 dark:text-purple-200">
                  <span className="font-bold block mb-0.5">Summary of Proposed AI Changes:</span>
                  <span>{aiChangeExplanation || 'Draft revised in accordance with your instruction.'}</span>
                  {aiDiffSummary && (
                    <div className="mt-2 text-[11px] font-mono text-slate-600 dark:text-slate-400 bg-white/60 dark:bg-black/30 p-2 rounded border border-purple-200/50">
                      {aiDiffSummary}
                    </div>
                  )}
                </div>

                {/* Side-by-Side or Stacked Diff */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="flex flex-col gap-1.5">
                    <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                      Current Document (v{draft.version || 1}.0)
                    </span>
                    <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0D121F] h-72 overflow-y-auto whitespace-pre-line font-serif text-[11px]">
                      {currentDocText}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <span className="font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider text-[10px]">
                      Proposed AI Revision (v{(draft.version || 1) + 1}.0)
                    </span>
                    <div className="p-3 rounded-xl border border-purple-300 dark:border-purple-700 bg-purple-50/30 dark:bg-purple-950/20 h-72 overflow-y-auto whitespace-pre-line font-serif text-[11px]">
                      {aiProposedText}
                    </div>
                  </div>
                </div>

                {/* Actions: Accept or Reject */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={handleRejectAiEdit}
                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-sm">close</span>
                    <span>{t.btnRejectRevision}</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setAiProposedText(null)}
                      className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300"
                    >
                      Refine Instruction
                    </button>
                    <button
                      type="button"
                      onClick={handleAcceptAiEdit}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-sm flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-sm">check</span>
                      <span>{t.btnAcceptRevision} (v{(draft.version || 1) + 1})</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL 2: VERSION HISTORY */}
      {showVersionModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="w-full max-w-xl bg-white dark:bg-[#111827] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col gap-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-xl text-blue-600">history</span>
                <div>
                  <h3 className="font-heading text-base font-bold text-slate-900 dark:text-white">
                    {t.versionHistory}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Review and restore previous saved revisions for matter #{caseId}.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowVersionModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <div className="space-y-3">
              {(draft.versions && draft.versions.length > 0 ? draft.versions : [
                {
                  version: 1,
                  content: currentDocText,
                  source: 'initial' as const,
                  timestamp: draft.lastSaved || 'Initial Draft',
                  notes: 'Baseline draft'
                }
              ]).map((ver) => {
                const isCurrent = ver.version === (draft.version || 1);
                return (
                  <div
                    key={ver.version}
                    className={`p-3.5 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                      isCurrent
                        ? 'border-blue-500/60 bg-blue-50/30 dark:bg-blue-950/20'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0D121F]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900 dark:text-white">
                          Version {ver.version}.0
                        </span>
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                            ver.source === 'ai_edit'
                              ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300'
                              : ver.source === 'manual'
                              ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {ver.source.toUpperCase()}
                        </span>
                        {isCurrent && (
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                            CURRENT
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        {ver.notes || 'Saved revision'} • {ver.timestamp}
                      </p>
                    </div>

                    {!isCurrent && (
                      <button
                        type="button"
                        onClick={() => handleRestoreVersion(ver)}
                        className="px-3 py-1.5 rounded-lg bg-surface-container-high hover:bg-blue-600 hover:text-white text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors shadow-2xs"
                      >
                        Restore
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-right">
              <button
                type="button"
                onClick={() => setShowVersionModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
