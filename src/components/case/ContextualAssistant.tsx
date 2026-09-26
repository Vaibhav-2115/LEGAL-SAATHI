'use client';

import React, { useState, useEffect, useRef } from 'react';
import { LegalCase } from '@/lib/types';
import { useLegalSaathi } from '@/context/LegalSaathiContext';

interface ContextualAssistantProps {
  currentCase: LegalCase;
  onSelectTab?: (tab: string) => void;
  onClose?: () => void;
  isMinimized?: boolean;
  onToggleMinimize?: () => void;
}

export const ContextualAssistant: React.FC<ContextualAssistantProps> = ({
  currentCase,
  onSelectTab,
  onClose,
  isMinimized: controlledMinimized,
  onToggleMinimize,
}) => {
  const [internalMinimized, setInternalMinimized] = useState(false);
  const isMinimized = controlledMinimized !== undefined ? controlledMinimized : internalMinimized;
  const { caseMessages, sendCaseMessage, t, isAnalyzing } = useLegalSaathi();

  const handleToggleMin = () => {
    if (onToggleMinimize) {
      onToggleMinimize();
    } else {
      setInternalMinimized(!internalMinimized);
    }
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [inputVal, setInputVal] = useState('');
  const [localTyping, setLocalTyping] = useState(false);

  // Active messages isolated to this current case
  const activeMessages = caseMessages[currentCase.id] || [
    {
      id: `m-init-${currentCase.id}`,
      sender: 'assistant',
      text: `Hello! I'm your Legal Saathi Assistant for matter ${currentCase.id} ("${currentCase.title}"). I am grounded in Indian law and the specific facts recorded in this docket. How can I assist you with this legal matter today?`,
      timestamp: 'Just now',
    },
  ];

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    if (!isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeMessages, localTyping, isAnalyzing, isMinimized]);

  // Case-tailored, dynamic suggested inquiry prompts
  const quickQuestions = [
    { label: t.summarizeCase, query: `Summarize the key facts and legal claims in matter ${currentCase.id}` },
    { label: t.currentStatus, query: `Explain the current legal status and procedural stage for ${currentCase.id}` },
    { label: t.missingItems, query: `What evidentiary documents and proof are required for ${currentCase.title}?` },
    { label: t.latestUpdate, query: `What is the latest status update recorded on this docket?` },
    { label: t.nextLegalSteps, query: `What are the recommended statutory next steps and legal notices to issue?` },
    { label: t.applicableLaws, query: `What Indian legal acts and statutory provisions govern this specific case?` },
  ];

  const handleSend = async (text: string) => {
    if (!text.trim() || localTyping || isAnalyzing) return;
    const queryText = text.trim();
    setInputVal('');
    setLocalTyping(true);

    try {
      await sendCaseMessage(currentCase.id, queryText);
    } catch (e) {
      console.error('Error sending message in ContextualAssistant:', e);
    } finally {
      setLocalTyping(false);
    }
  };

  return (
    <div
      className={`w-full flex flex-col bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-xs overflow-hidden transition-all duration-200 ${
        isMinimized ? 'h-auto' : 'h-[620px]'
      }`}
    >
      {/* Assistant Header */}
      <div className="px-3.5 py-2.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-[#0B1120]/70 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs shrink-0">
            <span className="material-symbols-outlined text-base">smart_toy</span>
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
              {t.chatAssistantTitle}
            </h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
              {currentCase.id} • {t.chatAssistantSubtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleToggleMin}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label={isMinimized ? 'Expand assistant' : 'Minimize assistant'}
            title={isMinimized ? 'Expand' : 'Minimize'}
          >
            <span className="material-symbols-outlined text-base">
              {isMinimized ? 'expand_less' : 'remove'}
            </span>
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close assistant"
              title="Close panel"
            >
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          )}
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Conversation Messages Container */}
          <div className="flex-1 p-3 flex flex-col gap-2.5 overflow-y-auto">
            {activeMessages.map((msg, idx) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id || `msg-${idx}`}
                  className={`flex flex-col gap-0.5 ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`p-2.5 rounded-2xl text-xs leading-relaxed max-w-[90%] shadow-2xs ${
                      isUser
                        ? 'bg-blue-600 text-white rounded-tr-xs font-medium'
                        : 'bg-slate-100 dark:bg-[#161F30] text-slate-800 dark:text-slate-200 rounded-tl-xs whitespace-pre-line'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-slate-400 px-1">{msg.timestamp || 'Just now'}</span>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {(localTyping || isAnalyzing) && (
              <div className="flex items-center gap-1.5 p-1.5 text-slate-400 text-xs pl-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce [animation-delay:0.4s]" />
                <span className="text-[10px] ml-1">{t.reviewingCaseLaw}</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Quick Questions Grid */}
          <div className="p-2.5 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-[#0D121F] shrink-0">
            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
              {t.quickInquiries}
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {quickQuestions.map((q) => (
                <button
                  key={q.label}
                  type="button"
                  onClick={() => handleSend(q.query)}
                  disabled={localTyping || isAnalyzing}
                  className="px-2 py-1.5 rounded-lg text-[11px] font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 border border-slate-200/80 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 bg-white dark:bg-[#111827] hover:bg-blue-50/50 dark:hover:bg-blue-950/30 transition-all text-left truncate flex items-center justify-between gap-1 shadow-2xs disabled:opacity-40"
                  title={q.query}
                >
                  <span className="truncate">{q.label}</span>
                  <span className="material-symbols-outlined text-xs text-slate-400 shrink-0">
                    chevron_right
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Composer Input Box */}
          <div className="p-2.5 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-[#111827] shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(inputVal);
              }}
              className="relative flex items-center"
            >
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder={t.askAssistantPlaceholder}
                disabled={localTyping || isAnalyzing}
                className="w-full pl-3 pr-9 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!inputVal.trim() || localTyping || isAnalyzing}
                className="absolute right-1 p-1 rounded-lg bg-blue-600 text-white disabled:opacity-30 disabled:pointer-events-none hover:bg-blue-700 transition-colors shadow-2xs"
                aria-label={t.send}
              >
                <span className="material-symbols-outlined text-sm">send</span>
              </button>
            </form>
          </div>

          {/* Legal Advisory Micro-Footer */}
          <div className="px-3 py-1.5 border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/60 dark:bg-[#080C14] text-center shrink-0">
            <p className="text-[9px] text-slate-400 leading-tight">
              {t.disclaimer}
            </p>
          </div>
        </>
      )}
    </div>
  );
};
