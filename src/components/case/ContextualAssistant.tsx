'use client';

import React, { useState, useEffect, useRef } from 'react';
import { LegalCase } from '@/lib/types';

interface ContextualAssistantProps {
  currentCase: LegalCase;
  onSelectTab?: (tab: string) => void;
  onClose?: () => void;
  isMinimized?: boolean;
  onToggleMinimize?: () => void;
}

interface Message {
  id: string;
  sender: 'assistant' | 'user';
  text: string;
  timestamp: string;
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

  const handleToggleMin = () => {
    if (onToggleMinimize) {
      onToggleMinimize();
    } else {
      setInternalMinimized(!internalMinimized);
    }
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: `m-init-${currentCase.id}`,
      sender: 'assistant',
      text: `Hello! I'm your Legal Saathi Assistant for matter ${currentCase.id} ("${currentCase.title}"). I can help you understand this complaint, its current status, what's pending, and the next steps. How can I help you?`,
      timestamp: 'Just now',
    },
  ]);

  // Isolate conversation history per case; avoid wiping if only title updates
  const prevCaseIdRef = useRef(currentCase.id);
  useEffect(() => {
    if (prevCaseIdRef.current !== currentCase.id) {
      prevCaseIdRef.current = currentCase.id;
      setMessages([
        {
          id: `m-init-${currentCase.id}`,
          sender: 'assistant',
          text: `Hello! I'm your Legal Saathi Assistant for matter ${currentCase.id} ("${currentCase.title}"). I can help you understand this complaint, its current status, what's pending, and the next steps. How can I help you?`,
          timestamp: 'Just now',
        },
      ]);
    }
  }, [currentCase.id, currentCase.title]);

  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    if (!isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isMinimized]);

  // Curated, compact suggested prompts
  const quickQuestions = [
    { label: 'Summarize case', query: 'Summarize my complaint' },
    { label: 'Current status', query: 'Explain current status' },
    { label: 'Missing items', query: 'What information is missing?' },
    { label: 'Latest update', query: 'Show my latest update' },
    { label: 'Next legal steps', query: 'What should I do next?' },
    { label: 'Applicable laws', query: 'Explain applicable laws' },
  ];

  const generateAnswer = (query: string): string => {
    const q = query.toLowerCase();

    if (q.includes('summarize') || q.includes('summary')) {
      return `This dispute (${currentCase.id}) concerns "${currentCase.title}". ${currentCase.summary} Claim value is ${currentCase.claimAmount || '₹65,000'} under ${currentCase.category} in ${currentCase.jurisdiction}.`;
    }

    if (q.includes('status') || q.includes('explain current')) {
      return `Your matter is currently in ${currentCase.status} (Stage: ${currentCase.currentStage || 'VERIFY'}). Your core lease documentation and financial transfer proofs are confirmed, but contemporaneous move-out proofs are required before initiating formal pre-litigation requisitions.`;
    }

    if (q.includes('missing') || q.includes('information') || q.includes('gap')) {
      return `You have 1 critical pending item: Move-out premises condition photos/video, and 2 pending reviews (Key handover acknowledgement and bank transfer proof). Addressing these shifts the evidentiary burden under Section 108 of the Transfer of Property Act.`;
    }

    if (q.includes('latest update') || q.includes('update') || q.includes('happened')) {
      return `Latest record update was recorded ${currentCase.updatedAt || '2 days ago'}: Evidence Locker confirmed 2 of 5 items (Registered Lease Deed & NEFT Transfer Proof).`;
    }

    if (q.includes('next') || q.includes('step') || q.includes('do next')) {
      return `Recommended next step: Review your Missing Information checklist, then draft your Section 106 Statutory Demand Notice in the Legal Actions tab to establish a formal 15-day compliance window.`;
    }

    if (q.includes('applicable laws') || q.includes('law') || q.includes('statute')) {
      return `Your matter is governed by Section 106 & Section 108 of the Transfer of Property Act, 1882, the Model Tenancy Act, 2021 (Section 11(3)), and Section 27 of the Delhi Rent Act, 1958. Under these statutes, landlords must return security deposits within 30 days unless documented, verified damage bills are produced.`;
    }

    if (q.includes('legal notice') || q.includes('draft')) {
      return `You can prepare a Section 106 Statutory Demand Notice directly under the 'Legal Actions' tab. It automatically references your lease agreement, bank transfer ID, and specifies a 15-day payment demand before pre-litigation mediation or tribunal filing.`;
    }

    if (q.includes('online') || q.includes('file')) {
      return `Yes. For consumer and tenancy disputes, grievances can be escalated to the e-Daakhil consumer portal, or to the District Legal Services Authority (DLSA) online portal. In Saket, you may also file before the local Rent Controller.`;
    }

    return `Under ${currentCase.category} for matter ${currentCase.id}, we have recorded: "${currentCase.summary}". Let me know if you would like me to explain your procedural rights, review the evidence locker, or inspect statutory notice options.`;
  };

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    setTimeout(() => {
      const answer = generateAnswer(text.trim());
      const botMsg: Message = {
        id: `a-${Date.now()}`,
        sender: 'assistant',
        text: answer,
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 350);
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
              Legal Saathi Assistant
            </h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
              AI Docket Advisory
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
            {/* Initial Welcome Message */}
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                <span className="material-symbols-outlined text-xs">smart_toy</span>
              </div>
              <div className="flex flex-col gap-0.5 max-w-[90%]">
                <div className="p-2.5 rounded-2xl rounded-tl-xs bg-slate-100 dark:bg-[#161F30] text-xs text-slate-800 dark:text-slate-200 leading-relaxed shadow-2xs">
                  {messages[0].text}
                </div>
                <span className="text-[9px] text-slate-400 pl-1">Just now</span>
              </div>
            </div>

            {/* Conversation Messages */}
            {messages.slice(1).map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col gap-0.5 ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`p-2.5 rounded-2xl text-xs leading-relaxed max-w-[90%] shadow-2xs ${
                      isUser
                        ? 'bg-blue-600 text-white rounded-tr-xs font-medium'
                        : 'bg-slate-100 dark:bg-[#161F30] text-slate-800 dark:text-slate-200 rounded-tl-xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-slate-400 px-1">{msg.timestamp}</span>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-1.5 p-1.5 text-slate-400 text-xs pl-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce [animation-delay:0.4s]" />
                <span className="text-[10px] ml-1">Reviewing case law...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Compact Suggested Questions Grid (Takes ~80px instead of 320px) */}
          <div className="p-2.5 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-[#0D121F] shrink-0">
            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
              Quick Inquiries:
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {quickQuestions.map((q) => (
                <button
                  key={q.label}
                  type="button"
                  onClick={() => handleSend(q.query)}
                  className="px-2 py-1.5 rounded-lg text-[11px] font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 border border-slate-200/80 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 bg-white dark:bg-[#111827] hover:bg-blue-50/50 dark:hover:bg-blue-950/30 transition-all text-left truncate flex items-center justify-between gap-1 shadow-2xs"
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
                placeholder="Ask about this matter..."
                className="w-full pl-3 pr-9 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
              />
              <button
                type="submit"
                disabled={!inputVal.trim()}
                className="absolute right-1 p-1 rounded-lg bg-blue-600 text-white disabled:opacity-30 disabled:pointer-events-none hover:bg-blue-700 transition-colors shadow-2xs"
                aria-label="Send message"
              >
                <span className="material-symbols-outlined text-sm">send</span>
              </button>
            </form>
          </div>

          {/* Legal Advisory Micro-Footer */}
          <div className="px-3 py-1.5 border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/60 dark:bg-[#080C14] text-center shrink-0">
            <p className="text-[9px] text-slate-400 leading-tight">
              Guidance grounded in Indian law. Not formal advocate advice.
            </p>
          </div>
        </>
      )}
    </div>
  );
};

