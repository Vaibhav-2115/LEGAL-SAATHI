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

  const activeCase = cases.find((c) => c.id === activeCaseId) || cases[0];

  const createCaseFromProblem = (problem: string, customDetails?: Partial<LegalCase>): string => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newCaseId = `LS-2026-${randomSuffix}`;
    const newCase: LegalCase = {
      id: newCaseId,
      title: customDetails?.title || (problem.slice(0, 42) + (problem.length > 42 ? '...' : '')),
      category: customDetails?.category || 'Civil & Statutory Rights',
      jurisdiction: customDetails?.jurisdiction || 'Jurisdiction Pending Clarification',
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
      legalSources: [
        {
          id: `ls-${Date.now()}`,
          title: 'Constitution of India & Civil Statutory Protections',
          section: 'Article 39A (Free Legal Aid & Equal Justice)',
          relevance: 'Statutory mandate ensuring citizen access to lawful dispute redressal',
          excerpt: 'The State shall secure that the operation of the legal system promotes justice on a basis of equal opportunity.',
          verified: true
        }
      ],
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

    setCases((prev) => [newCase, ...prev]);
    setActiveCaseId(newCaseId);
    return newCaseId;
  };

  const addChatMessage = (text: string) => {
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setIsAnalyzing(true);

    // Generate responsive structured assistant reply adhering to Stitch guidelines
    setTimeout(() => {
      const assistantMsg: ChatMessage = {
        id: `asst-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        structured: {
          whatIUnderstand: `Based on the details provided in your statement: "${text.slice(0, 160)}${text.length > 160 ? '...' : ''}", this matter involves civil rights, statutory contractual obligations, and procedural remedies under applicable Indian law.`,
          informationINeed: [
            'Do you possess any written communication, agreement, or formal receipts related to this matter?',
            'On what date did this dispute or non-compliance initially occur?',
            'Has any written notice, police report, or statutory complaint been submitted to the counterparty?'
          ],
          evidenceStrength: {
            score: 55,
            level: 'MODERATE',
            summary: 'Initial Statement Registered. Corroborating documentation will elevate statutory enforcement strength.'
          },
          whyThisMayApply: 'Under Indian civil jurisprudence and statutory consumer/tenancy enactments, arbitrary non-performance or refusal to honor agreed contractual terms is subject to formal notice and summary dispute resolution before competent authorities.',
          legalSource: {
            act: 'Specific Relief Act, 1963 & Indian Contract Act, 1872',
            section: 'Section 10 & Section 73',
            summary: 'Parties to a binding civil covenant are entitled to specific performance or compensatory relief upon breach.'
          },
          whatYouCanDoNext: {
            suggestion: 'We have updated your case context. You can examine relevant facts, review the evidence requirements, or generate an initial formal draft in your Case Workspace.',
            actionLabel: `View Case Workspace #${activeCaseId}`,
            caseId: activeCaseId
          }
        }
      };

      setChatMessages((prev) => [...prev, assistantMsg]);
      setIsAnalyzing(false);
    }, 700);
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
