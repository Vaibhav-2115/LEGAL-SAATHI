'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  LegalCase,
  ChatMessage,
  EvidenceItem,
  EvidenceStatus,
  StatutorySource,
  LegalNoticeDraft,
  RTIDraft,
  EFIRDraft,
  FactVerificationStatus,
  MissingInfoQuestion,
  CollectiveActionStatus,
  UserConsentRecord,
  TimelineEvent
} from '../lib/types';
import {
  INITIAL_CASES,
  INITIAL_CHAT_MESSAGES,
  MISSING_INFO_QUESTIONS,
  DEFAULT_USER_CONSENTS
} from '../lib/mock-data';
import { legalSaathiApi, transformBackendChatResponse } from '../lib/api';

interface LegalSaathiContextType {
  cases: LegalCase[];
  activeCaseId: string;
  activeCase: LegalCase | undefined;
  setActiveCaseId: (id: string) => void;
  chatMessages: ChatMessage[];
  addChatMessage: (text: string) => void;
  isAnalyzing: boolean;
  pendingProblem: string;
  setPendingProblem: (text: string) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  createCaseFromProblem: (problem: string, customDetails?: Partial<LegalCase>) => string;
  updateEvidenceStatus: (caseId: string, evidenceId: string, status: EvidenceStatus) => void;
  addEvidenceItem: (caseId: string, item: Omit<EvidenceItem, 'id'>) => void;
  addLegalSourceToCase: (caseId: string, source: StatutorySource) => void;
  legalNoticeDrafts: Record<string, LegalNoticeDraft>;
  saveLegalNoticeDraft: (caseId: string, draft: LegalNoticeDraft) => void;
  rtiDrafts: Record<string, RTIDraft>;
  saveRTIDraft: (caseId: string, draft: RTIDraft) => void;
  efirDrafts: Record<string, EFIRDraft>;
  saveEFIRDraft: (caseId: string, draft: EFIRDraft) => void;
  // Phase 3 Extensions
  updateFactVerificationStatus: (caseId: string, factId: string, status: FactVerificationStatus) => void;
  resolveFactConflict: (caseId: string, factId: string, resolutionNote: string) => void;
  missingInfoQuestions: Record<string, MissingInfoQuestion[]>;
  answerMissingInfoQuestion: (caseId: string, questionId: string, answer: string) => void;
  skipMissingInfoQuestion: (caseId: string, questionId: string) => void;
  userConsents: Record<string, UserConsentRecord>;
  updateCollectiveActionConsent: (caseId: string, status: CollectiveActionStatus) => void;
  updateDataUsageConsent: (caseId: string, category: string, status: 'PRIVATE' | 'SHARED_WITH_CONSENT' | 'NOT_SHARED') => void;
  addTimelineEvent: (caseId: string, event: Omit<TimelineEvent, 'id'>) => void;
  updateTimelineEvent: (caseId: string, eventId: string, updates: Partial<TimelineEvent>) => void;
  userNotes: Record<string, string[]>;
  addUserNote: (caseId: string, note: string) => void;
}

const LegalSaathiContext = createContext<LegalSaathiContextType | undefined>(undefined);

export function LegalSaathiProvider({ children }: { children: React.ReactNode }) {
  const [cases, setCases] = useState<LegalCase[]>(INITIAL_CASES);
  const [activeCaseId, setActiveCaseId] = useState<string>('LS-2026-0042');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [pendingProblem, setPendingProblem] = useState<string>('');
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  const [legalNoticeDrafts, setLegalNoticeDrafts] = useState<Record<string, LegalNoticeDraft>>({});
  const [rtiDrafts, setRtiDrafts] = useState<Record<string, RTIDraft>>({});
  const [efirDrafts, setEfirDrafts] = useState<Record<string, EFIRDraft>>({});

  // Phase 3 State
  const [missingInfoQuestions, setMissingInfoQuestions] = useState<Record<string, MissingInfoQuestion[]>>(MISSING_INFO_QUESTIONS);
  const [userConsents, setUserConsents] = useState<Record<string, UserConsentRecord>>(DEFAULT_USER_CONSENTS);
  const [userNotes, setUserNotes] = useState<Record<string, string[]>>({
    'LS-2026-0042': [
      'Landlord did not reply to WhatsApp message sent on 12 January 2026.',
      'Spoke with residential building security supervisor on 15 Jan who confirmed apartment was vacated in clean condition.'
    ],
    'LS-2026-0038': [
      'Met with 5 fellow tower allottees; all received identical escalation demand letters without architectural justification.'
    ]
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  const updateEvidenceStatus = (caseId: string, evidenceId: string, status: EvidenceStatus) => {
    setCases((prevCases) =>
      prevCases.map((c) => {
        if (c.id !== caseId) return c;
        const updatedList = c.evidenceList.map((e) => {
          if (e.id !== evidenceId) return e;
          return {
            ...e,
            status,
            statusLabel:
              status === 'VERIFIED' || status === 'COLLECTED'
                ? 'Verified • Collected'
                : status === 'MISSING'
                ? 'Missing'
                : status === 'NOT_APPLICABLE'
                ? 'Not Applicable'
                : 'Review Needed'
          };
        });
        const collectedCount = updatedList.filter(
          (e) => e.status === 'VERIFIED' || e.status === 'COLLECTED'
        ).length;
        return {
          ...c,
          evidenceList: updatedList,
          collectedEvidenceCount: collectedCount,
          updatedAt: 'Just now'
        };
      })
    );
  };

  const addEvidenceItem = (caseId: string, item: Omit<EvidenceItem, 'id'>) => {
    setCases((prevCases) =>
      prevCases.map((c) => {
        if (c.id !== caseId) return c;
        const newItem: EvidenceItem = {
          ...item,
          id: `e-${Date.now()}`
        };
        const updatedList = [...c.evidenceList, newItem];
        const collectedCount = updatedList.filter(
          (e) => e.status === 'VERIFIED' || e.status === 'COLLECTED'
        ).length;
        return {
          ...c,
          evidenceList: updatedList,
          totalEvidenceCount: updatedList.length,
          collectedEvidenceCount: collectedCount,
          updatedAt: 'Just now'
        };
      })
    );
  };

  const addLegalSourceToCase = (caseId: string, source: StatutorySource) => {
    setCases((prevCases) =>
      prevCases.map((c) => {
        if (c.id !== caseId) return c;
        if (c.legalSources.some((s) => s.id === source.id)) return c;
        return {
          ...c,
          legalSources: [...c.legalSources, source],
          updatedAt: 'Just now'
        };
      })
    );
  };

  const saveLegalNoticeDraft = (caseId: string, draft: LegalNoticeDraft) => {
    setLegalNoticeDrafts((prev) => ({
      ...prev,
      [caseId]: { ...draft, lastSaved: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    }));
  };

  const saveRTIDraft = (caseId: string, draft: RTIDraft) => {
    setRtiDrafts((prev) => ({
      ...prev,
      [caseId]: { ...draft, lastSaved: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    }));
  };

  const saveEFIRDraft = (caseId: string, draft: EFIRDraft) => {
    setEfirDrafts((prev) => ({
      ...prev,
      [caseId]: { ...draft, lastSaved: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    }));
  };

  // Fetch real persisted cases from Supabase PostgreSQL on mount
  useEffect(() => {
    let isMounted = true;
    legalSaathiApi.getCases().then((persistedCases) => {
      if (isMounted && persistedCases && persistedCases.length > 0) {
        setCases(persistedCases);
        setActiveCaseId(persistedCases[0].id);
      }
    }).catch(() => {});
    return () => { isMounted = false; };
  }, []);

  const activeCase = cases.find((c) => c.id === activeCaseId) || cases[0];

  const createCaseFromProblem = (problem: string, customDetails?: Partial<LegalCase>): string => {
    const tempId = `LS-${Date.now().toString().slice(-6)}`;
    const newCase: LegalCase = {
      id: tempId,
      title: customDetails?.title || (problem.slice(0, 42) + (problem.length > 42 ? '...' : '')),
      category: customDetails?.category || 'Civil & Statutory Rights',
      jurisdiction: customDetails?.jurisdiction || 'General Indian Civil Jurisdiction',
      claimAmount: customDetails?.claimAmount,
      status: customDetails?.status || 'UNDERSTANDING',
      currentStage: customDetails?.currentStage || 'UNDERSTAND',
      summary: customDetails?.summary || problem,
      citizenStatement: customDetails?.citizenStatement || problem,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: 'Just now',
      totalEvidenceCount: 3,
      collectedEvidenceCount: 1,
      keyFacts: [
        {
          id: `f-${Date.now()}`,
          statement: customDetails?.summary || problem,
          category: 'Citizen Initial Account',
          confidence: 'MEDIUM',
          source: 'CITIZEN_ACCOUNT'
        }
      ],
      evidenceList: [
        {
          id: `e-${Date.now()}`,
          name: 'Primary Statement & Correspondence Record',
          category: 'Communication',
          status: 'REVIEW_NEEDED',
          statusLabel: 'Review Needed'
        }
      ],
      legalSources: [],
      timeline: [
        {
          id: `t-${Date.now()}`,
          date: 'Today',
          title: 'Citizen Inquiry Logged',
          description: 'Consultation initiated with Legal Saathi AI.',
          stage: 'ASK',
          completed: true
        }
      ],
      nextStep: {
        id: `ns-${Date.now()}`,
        title: 'Review Legal Clarifications with Legal Saathi',
        description: 'Provide supporting documents or clarify incident dates to establish your statutory footing.',
        dueDate: 'Within 7 days',
        actionText: 'Continue in Assistant',
        actionUrl: `/chat`,
        urgency: 'HIGH'
      }
    };

    setCases((prev) => [newCase, ...prev.filter((c) => c.id !== tempId)]);
    setActiveCaseId(tempId);

    // Asynchronously persist to Supabase PostgreSQL via backend API
    legalSaathiApi.createCase(problem, customDetails).then((persistedCase) => {
      setCases((prev) => [persistedCase, ...prev.filter((c) => c.id !== tempId && c.id !== persistedCase.id)]);
      setActiveCaseId(persistedCase.id);
    }).catch((err) => {
      console.warn('Backend case creation offline/failed, using local draft:', err);
    });

    return tempId;
  };

  const addChatMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setIsAnalyzing(true);

    try {
      // Call real backend RAG pipeline (POST /chat)
      const res = await legalSaathiApi.sendChat(text, activeCaseId);
      const structuredReply = transformBackendChatResponse(res, text);

      const assistantMsg: ChatMessage = {
        id: `asst-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: res.answer,
        structured: structuredReply
      };

      setChatMessages((prev) => [...prev, assistantMsg]);

      // If backend created/returned a case ID, link it
      if (res.case_id && res.case_id !== activeCaseId) {
        setActiveCaseId(res.case_id);
      }
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `asst-err-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: 'I could not retrieve legal sources at this moment. The backend service may be temporarily unavailable or processing another request.',
        structured: {
          whatIUnderstand: `Statement: "${text.slice(0, 120)}${text.length > 120 ? '...' : ''}"`,
          informationINeed: [
            'Please verify backend connection to http://localhost:8000',
            'Try submitting your legal query again'
          ],
          evidenceStrength: {
            score: 0,
            level: 'LOW',
            summary: 'Service temporarily unable to ground claims in statutory database.'
          },
          whyThisMayApply: 'Legal Saathi refuses to fabricate legal provisions when the retrieval engine is unreachable.',
          legalSource: {
            act: 'Retrieval Service Unavailable',
            section: 'Offline',
            summary: 'Ensure FastAPI backend is running and connected to Supabase.'
          },
          whatYouCanDoNext: {
            suggestion: 'Retry the query once backend connectivity is restored.',
            actionLabel: 'Retry Query'
          }
        }
      };
      setChatMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const updateFactVerificationStatus = (
    caseId: string,
    factId: string,
    status: FactVerificationStatus
  ) => {
    setCases((prevCases) =>
      prevCases.map((c) => {
        if (c.id !== caseId) return c;
        const updatedFacts = c.keyFacts.map((f) => {
          if (f.id !== factId) return f;
          return {
            ...f,
            verificationStatus: status
          };
        });
        return {
          ...c,
          keyFacts: updatedFacts,
          updatedAt: 'Just now'
        };
      })
    );
  };

  const resolveFactConflict = (
    caseId: string,
    factId: string,
    resolutionNote: string
  ) => {
    setCases((prevCases) =>
      prevCases.map((c) => {
        if (c.id !== caseId) return c;
        const updatedFacts = c.keyFacts.map((f) => {
          if (f.id !== factId) return f;
          return {
            ...f,
            verificationStatus: 'SUPPORTED' as FactVerificationStatus,
            statement: `${f.statement} (Resolved: ${resolutionNote})`,
            conflictDetails: undefined
          };
        });
        return {
          ...c,
          keyFacts: updatedFacts,
          updatedAt: 'Just now'
        };
      })
    );
  };

  const answerMissingInfoQuestion = (
    caseId: string,
    questionId: string,
    answer: string
  ) => {
    setMissingInfoQuestions((prev) => {
      const caseQuestions = prev[caseId] || [];
      const updated = caseQuestions.map((q) => {
        if (q.id !== questionId) return q;
        return {
          ...q,
          answered: true,
          answerValue: answer,
          skipped: false
        };
      });
      return {
        ...prev,
        [caseId]: updated
      };
    });
  };

  const skipMissingInfoQuestion = (caseId: string, questionId: string) => {
    setMissingInfoQuestions((prev) => {
      const caseQuestions = prev[caseId] || [];
      const updated = caseQuestions.map((q) => {
        if (q.id !== questionId) return q;
        return {
          ...q,
          skipped: true
        };
      });
      return {
        ...prev,
        [caseId]: updated
      };
    });
  };

  const updateCollectiveActionConsent = (
    caseId: string,
    status: CollectiveActionStatus
  ) => {
    setUserConsents((prev) => {
      const current = prev[caseId] || {
        caseId,
        dataCategoriesStored: ['Case Facts', 'Evidence Records'],
        howDataUsed: [],
        collectiveActionStatus: 'NOT_PARTICIPATING'
      };
      return {
        ...prev,
        [caseId]: {
          ...current,
          collectiveActionStatus: status,
          consentedAt: new Date().toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          })
        }
      };
    });
  };

  const updateDataUsageConsent = (
    caseId: string,
    category: string,
    status: 'PRIVATE' | 'SHARED_WITH_CONSENT' | 'NOT_SHARED'
  ) => {
    setUserConsents((prev) => {
      const current = prev[caseId];
      if (!current) return prev;
      const updatedHowDataUsed = current.howDataUsed.map((item) => {
        if (item.category === category) {
          return { ...item, status };
        }
        return item;
      });
      return {
        ...prev,
        [caseId]: {
          ...current,
          howDataUsed: updatedHowDataUsed
        }
      };
    });
  };

  const addTimelineEvent = (caseId: string, event: Omit<TimelineEvent, 'id'>) => {
    const newId = `t-${Date.now()}`;
    const newEvent: TimelineEvent = {
      ...event,
      id: newId
    };
    setCases((prevCases) =>
      prevCases.map((c) => {
        if (c.id !== caseId) return c;
        return {
          ...c,
          timeline: [newEvent, ...c.timeline],
          updatedAt: 'Just now'
        };
      })
    );
  };

  const updateTimelineEvent = (
    caseId: string,
    eventId: string,
    updates: Partial<TimelineEvent>
  ) => {
    setCases((prevCases) =>
      prevCases.map((c) => {
        if (c.id !== caseId) return c;
        const updatedTimeline = c.timeline.map((evt) => {
          if (evt.id !== eventId) return evt;
          return { ...evt, ...updates };
        });
        return {
          ...c,
          timeline: updatedTimeline,
          updatedAt: 'Just now'
        };
      })
    );
  };

  const addUserNote = (caseId: string, note: string) => {
    setUserNotes((prev) => ({
      ...prev,
      [caseId]: [note, ...(prev[caseId] || [])]
    }));
  };

  return (
    <LegalSaathiContext.Provider
      value={{
        cases,
        activeCaseId,
        activeCase,
        setActiveCaseId,
        chatMessages,
        addChatMessage,
        isAnalyzing,
        pendingProblem,
        setPendingProblem,
        darkMode,
        toggleDarkMode,
        createCaseFromProblem,
        updateEvidenceStatus,
        addEvidenceItem,
        addLegalSourceToCase,
        legalNoticeDrafts,
        saveLegalNoticeDraft,
        rtiDrafts,
        saveRTIDraft,
        efirDrafts,
        saveEFIRDraft,
        // Phase 3
        updateFactVerificationStatus,
        resolveFactConflict,
        missingInfoQuestions,
        answerMissingInfoQuestion,
        skipMissingInfoQuestion,
        userConsents,
        updateCollectiveActionConsent,
        updateDataUsageConsent,
        addTimelineEvent,
        updateTimelineEvent,
        userNotes,
        addUserNote
      }}
    >
      {children}
    </LegalSaathiContext.Provider>
  );
}

export function useLegalSaathi() {
  const context = useContext(LegalSaathiContext);
  if (!context) {
    throw new Error('useLegalSaathi must be used within a LegalSaathiProvider');
  }
  return context;
}
