'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { TimelineEvent, TimelineEventType, CaseStage } from '../lib/types';

interface CaseTimelineViewProps {
  timeline: TimelineEvent[];
  caseId: string;
  currentStage: CaseStage;
  nextStepTitle?: string;
  nextStepActionUrl?: string;
  onAddEvent: (event: Omit<TimelineEvent, 'id'>) => void;
  onUpdateEvent: (eventId: string, updates: Partial<TimelineEvent>) => void;
}

export const CaseTimelineView: React.FC<CaseTimelineViewProps> = ({
  timeline,
  caseId,
  currentStage,
  nextStepTitle = 'Statutory Demand Notice Dispatch',
  nextStepActionUrl = `/cases/${caseId}`,
  onAddEvent,
  onUpdateEvent
}) => {
  const [filterType, setFilterType] = useState<string>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [editingNote, setEditingNote] = useState<string>('');

  // Form State for Add Event
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('Today');
  const [newDesc, setNewDesc] = useState('');
  const [newType, setNewType] = useState<TimelineEventType>('USER_UPDATE');
  const [newSource, setNewSource] = useState('Citizen Statement');
  const [newStatus, setNewStatus] = useState('Recorded');

  const filteredEvents = timeline.filter((evt) => {
    if (filterType === 'ALL') return true;
    return evt.eventType === filterType || evt.stage === filterType;
  });

  const lastCompletedEvent = timeline.find((e) => e.completed) || timeline[0];

  const getEventIcon = (type?: TimelineEventType) => {
    switch (type) {
      case 'INCIDENT':
        return { icon: 'warning', color: 'text-rose-600 bg-rose-100 dark:bg-rose-950/60' };
      case 'CONVERSATION':
        return { icon: 'chat', color: 'text-primary bg-primary/15 dark:bg-primary/20' };
      case 'EVIDENCE_ADDED':
        return { icon: 'attachment', color: 'text-blue-600 bg-blue-100 dark:bg-blue-950/60' };
      case 'FACT_VERIFIED':
        return { icon: 'fact_check', color: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-950/60' };
      case 'LEGAL_SOURCE_IDENTIFIED':
        return { icon: 'menu_book', color: 'text-indigo-600 bg-indigo-100 dark:bg-indigo-950/60' };
      case 'ACTION_PREPARED':
        return { icon: 'bolt', color: 'text-amber-600 bg-amber-100 dark:bg-amber-950/60' };
      case 'NOTICE_DRAFTED':
        return { icon: 'edit_document', color: 'text-indigo-600 bg-indigo-100 dark:bg-indigo-950/60' };
      case 'RTI_PREPARED':
        return { icon: 'account_balance', color: 'text-cyan-600 bg-cyan-100 dark:bg-cyan-950/60' };
      case 'DLSA_ASSISTANCE':
        return { icon: 'diversity_3', color: 'text-teal-600 bg-teal-100 dark:bg-teal-950/60' };
      case 'STATUS_CHANGE':
        return { icon: 'flag', color: 'text-orange-600 bg-orange-100 dark:bg-orange-950/60' };
      case 'USER_UPDATE':
      default:
        return { icon: 'schedule', color: 'text-slate-600 bg-slate-100 dark:bg-[#161F30]' };
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddEvent({
      title: newTitle,
      date: newDate,
      description: newDesc || 'User recorded event in case history.',
      stage: currentStage,
      completed: true,
      eventType: newType,
      source: newSource,
      statusLabel: newStatus
    });

    setNewTitle('');
    setNewDesc('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Current Position Banner */}
      <section aria-label="Current Case Position" className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-surface-container-lowest dark:bg-[#0F131C] border border-outline-variant/40 rounded-2xl p-5 shadow-sm">
        {/* Stage */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-low dark:bg-[#161F30]/60 border border-outline-variant/20">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <span className="material-symbols-outlined">timeline</span>
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block">
              Current Case Stage
            </span>
            <span className="text-sm font-extrabold text-primary dark:text-primary-fixed truncate block">
              {currentStage} (In Progress)
            </span>
          </div>
        </div>

        {/* Last Completed */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-low dark:bg-[#161F30]/60 border border-outline-variant/20">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 shrink-0">
            <span className="material-symbols-outlined">check_circle</span>
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block">
              Last Completed Activity
            </span>
            <span className="text-xs font-bold text-on-surface truncate block">
              {lastCompletedEvent.title}
            </span>
            <span className="text-[10px] text-on-surface-variant block">
              {lastCompletedEvent.date}
            </span>
          </div>
        </div>

        {/* Next Expected */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/10 dark:bg-secondary/20 border border-secondary/30">
          <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center text-secondary dark:text-secondary-fixed shrink-0">
            <span className="material-symbols-outlined">arrow_forward</span>
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-bold text-secondary dark:text-secondary-fixed uppercase tracking-wider block">
              Next Expected Action
            </span>
            <span className="text-xs font-bold text-on-surface truncate block">
              {nextStepTitle}
            </span>
            <Link
              href={nextStepActionUrl}
              className="text-[11px] text-primary hover:underline font-semibold inline-block"
            >
              Proceed to Action →
            </Link>
          </div>
        </div>
      </section>

      {/* Timeline Controls & Filters */}
      <section aria-label="Timeline Controls" className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface-container-lowest dark:bg-[#0F131C] border border-outline-variant/40 rounded-2xl p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-on-surface-variant mr-1">Filter:</span>
          {[
            { id: 'ALL', label: 'All Events' },
            { id: 'EVIDENCE_ADDED', label: 'Evidence' },
            { id: 'FACT_VERIFIED', label: 'Facts' },
            { id: 'LEGAL_SOURCE_IDENTIFIED', label: 'Sources' },
            { id: 'NOTICE_DRAFTED', label: 'Actions' }
          ].map((flt) => (
            <button
              key={flt.id}
              type="button"
              onClick={() => setFilterType(flt.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                filterType === flt.id
                  ? 'bg-primary text-on-primary border-primary'
                  : 'bg-surface-container-low dark:bg-[#161F30] text-on-surface border-outline-variant/30 hover:bg-surface-container'
              }`}
            >
              {flt.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="px-3 py-1.5 rounded-xl bg-primary text-on-primary font-bold text-xs hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">add_circle</span>
            <span>Add Event</span>
          </button>
        </div>
      </section>

      {/* Chronological Timeline Stream */}
      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-outline-variant/40">
        {filteredEvents.map((event) => {
          const badge = getEventIcon(event.eventType);
          return (
            <article
              key={event.id}
              className="relative bg-surface-container-lowest dark:bg-[#0F131C] border border-outline-variant/40 rounded-2xl p-5 shadow-sm transition-all hover:border-outline-variant"
            >
              {/* Timeline Pin Indicator */}
              <div
                className={`absolute -left-6 sm:-left-8 top-5 w-6 h-6 rounded-full flex items-center justify-center border-2 border-surface dark:border-slate-900 ${badge.color}`}
              >
                <span className="material-symbols-outlined text-xs">{badge.icon}</span>
              </div>

              {/* Event Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-on-surface-variant bg-surface-container-low dark:bg-[#161F30] px-2 py-0.5 rounded">
                    {event.date}
                  </span>
                  {event.eventType && (
                    <span className="text-[11px] font-bold text-primary dark:text-primary-fixed bg-primary/10 px-2 py-0.5 rounded">
                      {event.eventType.replace('_', ' ')}
                    </span>
                  )}
                  {event.statusLabel && (
                    <span className="text-[11px] font-semibold text-on-surface-variant bg-surface-container px-2 py-0.5 rounded">
                      {event.statusLabel}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 text-xs">
                  <span className="text-on-surface-variant">Stage:</span>
                  <strong className="text-on-surface">{event.stage}</strong>
                </div>
              </div>

              {/* Title & Description */}
              <h3 className="text-base font-bold text-on-surface mb-1">
                {event.title}
              </h3>
              <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed mb-4">
                {event.description}
              </p>

              {/* Source & Evidence Metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs py-2.5 border-t border-outline-variant/20 bg-surface-container-low/50 dark:bg-[#161F30]/30 px-3 rounded-xl mb-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-on-surface-variant font-medium">Source:</span>
                  <span className="text-on-surface font-semibold truncate">
                    {event.source || 'Citizen Statement'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-on-surface-variant font-medium">Evidence:</span>
                  {event.evidenceId ? (
                    <Link
                      href={`/cases/${caseId}/evidence`}
                      className="text-primary hover:underline font-bold flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-xs">attachment</span>
                      <span>View Attachment</span>
                    </Link>
                  ) : (
                    <span className="text-on-surface-variant italic">None attached</span>
                  )}
                </div>
              </div>

              {/* Event Actions */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-outline-variant/20">
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={`/cases/${caseId}/evidence`}
                    className="px-2.5 py-1 rounded-lg bg-surface-container-low dark:bg-[#161F30] hover:bg-surface-container text-xs font-semibold text-on-surface border border-outline-variant/40 transition-colors flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-xs text-blue-600">attachment</span>
                    <span>Attach Evidence</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedEvent(event);
                      setEditingNote(event.description);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-surface-container-low dark:bg-[#161F30] hover:bg-surface-container text-xs font-semibold text-on-surface border border-outline-variant/40 transition-colors flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-xs text-primary">edit</span>
                    <span>Edit Note</span>
                  </button>
                </div>

                <span className="text-[11px] text-on-surface-variant font-mono">
                  #{event.id}
                </span>
              </div>
            </article>
          );
        })}
      </div>

      {/* Add Event Modal */}
      {showAddModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
        >
          <div className="bg-surface-container-lowest dark:bg-[#0F131C] border border-outline-variant rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
              <h3 className="font-heading font-bold text-base text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">add_circle</span>
                <span>Add Timeline Event</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-on-surface mb-1">Event Title:</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Sent Follow-up WhatsApp message"
                  className="w-full p-2.5 rounded-xl border border-outline-variant/50 bg-surface dark:bg-[#161F30] text-on-surface"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-on-surface mb-1">Date:</label>
                  <input
                    type="text"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    placeholder="e.g. Today / 20 Jan 2026"
                    className="w-full p-2.5 rounded-xl border border-outline-variant/50 bg-surface dark:bg-[#161F30] text-on-surface"
                  />
                </div>
                <div>
                  <label className="block font-bold text-on-surface mb-1">Event Type:</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as TimelineEventType)}
                    className="w-full p-2.5 rounded-xl border border-outline-variant/50 bg-surface dark:bg-[#161F30] text-on-surface"
                  >
                    <option value="USER_UPDATE">User Update</option>
                    <option value="INCIDENT">Incident</option>
                    <option value="CONVERSATION">Conversation</option>
                    <option value="EVIDENCE_ADDED">Evidence Added</option>
                    <option value="FACT_VERIFIED">Fact Verified</option>
                    <option value="NOTICE_DRAFTED">Notice Drafted</option>
                    <option value="DLSA_ASSISTANCE">DLSA Assistance</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-on-surface mb-1">Description:</label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Provide concise details regarding what took place..."
                  className="w-full p-2.5 rounded-xl border border-outline-variant/50 bg-surface dark:bg-[#161F30] text-on-surface"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-on-surface mb-1">Source:</label>
                  <input
                    type="text"
                    value={newSource}
                    onChange={(e) => setNewSource(e.target.value)}
                    placeholder="e.g. Landlord Call Record"
                    className="w-full p-2.5 rounded-xl border border-outline-variant/50 bg-surface dark:bg-[#161F30] text-on-surface"
                  />
                </div>
                <div>
                  <label className="block font-bold text-on-surface mb-1">Status Label:</label>
                  <input
                    type="text"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    placeholder="e.g. Unanswered"
                    className="w-full p-2.5 rounded-xl border border-outline-variant/50 bg-surface dark:bg-[#161F30] text-on-surface"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-outline-variant/30">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl font-medium text-on-surface-variant hover:bg-surface-container"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl font-bold bg-primary text-on-primary hover:bg-primary/90 transition-colors"
                >
                  Append Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Note Modal */}
      {selectedEvent && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
        >
          <div className="bg-surface-container-lowest dark:bg-[#0F131C] border border-outline-variant rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
              <h3 className="font-heading font-bold text-base text-on-surface">
                Edit Event Note: #{selectedEvent.id}
              </h3>
              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div>
              <label className="block font-bold text-on-surface mb-1">Description / Notes:</label>
              <textarea
                rows={4}
                value={editingNote}
                onChange={(e) => setEditingNote(e.target.value)}
                className="w-full p-3 rounded-xl border border-outline-variant/50 bg-surface dark:bg-[#161F30] text-on-surface"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
                className="px-4 py-2 rounded-xl font-medium text-on-surface-variant hover:bg-surface-container"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onUpdateEvent(selectedEvent.id, { description: editingNote });
                  setSelectedEvent(null);
                }}
                className="px-4 py-2 rounded-xl font-bold bg-primary text-on-primary hover:bg-primary/90"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
