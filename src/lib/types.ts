export type CaseStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDERSTANDING'
  | 'VERIFICATION'
  | 'ACTION REQUIRED'
  | 'READY FOR ACTION'
  | 'COMPLETED'
  | 'ARCHIVED';

export type CaseStage =
  | 'ASK'
  | 'UNDERSTAND'
  | 'VERIFY'
  | 'EXPLAIN'
  | 'ACT'
  | 'UNITE';

export type EvidenceStatus =
  | 'VERIFIED'
  | 'REVIEW_NEEDED'
  | 'MISSING'
  | 'COLLECTED'
  | 'NEEDS_REVIEW'
  | 'NOT_APPLICABLE';

export interface EvidenceItem {
  id: string;
  name: string;
  category: string;
  status: EvidenceStatus;
  statusLabel: string;
  collectedAt?: string;
  notes?: string;
  description?: string;
  relatedFact?: string;
  relatedLegalIssue?: string;
  fileUrl?: string;
}

export type SourceCategory =
  | 'ACTS'
  | 'SECTIONS'
  | 'RULES'
  | 'JUDGMENTS'
  | 'OFFICIAL_GUIDANCE'
  | 'OTHER_VERIFIED_SOURCES';

export interface StatutorySource {
  id: string;
  title: string;
  section: string;
  relevance: string;
  excerpt: string;
  verified: boolean;
  category?: SourceCategory;
  authority?: string;
  date?: string;
  whyItMatters?: string;
  caseConnection?: string;
  fullTextPreview?: string;
  officialLink?: string;
  relatedFacts?: string[];
  relatedEvidence?: string[];
  relatedActions?: string[];
}

export type FactVerificationStatus =
  | 'CONFIRMED'
  | 'SUPPORTED'
  | 'NEEDS_VERIFICATION'
  | 'MISSING'
  | 'CONFLICTING';

export interface KeyFact {
  id: string;
  statement: string;
  category: string;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  source: 'CITIZEN_ACCOUNT' | 'DOCUMENT_VERIFIED' | 'EXTRACTED';
  verificationStatus?: FactVerificationStatus;
  supportingEvidenceId?: string;
  supportingEvidenceName?: string;
  relatedLegalIssue?: string;
  conflictDetails?: {
    whatDiffers: string;
    sourceA: string;
    sourceB: string;
    howToResolve: string;
  };
}

export type TimelineEventType =
  | 'INCIDENT'
  | 'CONVERSATION'
  | 'EVIDENCE_ADDED'
  | 'FACT_VERIFIED'
  | 'LEGAL_SOURCE_IDENTIFIED'
  | 'ACTION_PREPARED'
  | 'NOTICE_DRAFTED'
  | 'RTI_PREPARED'
  | 'DLSA_ASSISTANCE'
  | 'USER_UPDATE'
  | 'STATUS_CHANGE';

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  stage: CaseStage;
  completed: boolean;
  eventType?: TimelineEventType;
  source?: string;
  evidenceId?: string;
  statusLabel?: string;
}

export interface NextStep {
  id: string;
  title: string;
  description: string;
  dueDate?: string;
  actionText: string;
  actionUrl?: string;
  urgency: 'HIGH' | 'MEDIUM' | 'NORMAL';
}

export interface LegalCase {
  id: string; // e.g. "LS-2026-0042"
  title: string;
  category: string;
  jurisdiction: string;
  status: CaseStatus;
  currentStage: CaseStage;
  summary: string;
  citizenStatement: string;
  createdAt: string;
  updatedAt: string;
  claimAmount?: string;
  totalEvidenceCount: number;
  collectedEvidenceCount: number;
  keyFacts: KeyFact[];
  evidenceList: EvidenceItem[];
  legalSources: StatutorySource[];
  timeline: TimelineEvent[];
  nextStep: NextStep;
}

export type VoiceState = 'IDLE' | 'LISTENING' | 'PROCESSING' | 'TRANSCRIPT' | 'CONFIRM';

export interface AssistantResponseStructure {
  whatIUnderstand: string;
  informationINeed: string[];
  evidenceStrength: {
    score: number; // 0 - 100
    level: 'LOW' | 'MODERATE' | 'STRONG';
    summary: string;
  };
  whyThisMayApply: string;
  legalSource: {
    act: string;
    section: string;
    summary: string;
  };
  whatYouCanDoNext: {
    suggestion: string;
    actionLabel: string;
    caseId?: string;
  };
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  text?: string;
  structured?: AssistantResponseStructure;
}

export interface LegalNoticeDraft {
  recipientName: string;
  recipientDesignation?: string;
  recipientAddress: string;
  recipientEmail?: string;
  senderName: string;
  senderAddress: string;
  incidentDate: string;
  demandedAmount: string;
  curePeriodDays: number;
  factsSummary: string;
  statutoryBasis: string;
  demands: string[];
  lastSaved?: string;
}

export interface RTIDraft {
  authorityName: string;
  department: string;
  pioDesignation: string;
  pioAddress: string;
  subject: string;
  informationRequested: string[];
  timePeriod: string;
  isBPL: boolean;
  bplCardNumber?: string;
  applicationFeePaid: boolean;
  lastSaved?: string;
}

export interface EFIRDraft {
  complainantName: string;
  contactNumber: string;
  incidentType: string;
  incidentDateTime: string;
  locationDetails: string;
  suspectDetails?: string;
  incidentNarrative: string;
  evidenceItems: string[];
  policeStationJurisdiction?: string;
  lastSaved?: string;
}

export interface LegalExplanationTrace {
  caseId: string;
  whatIUnderstand: string;
  legalIssue: {
    title: string;
    category: string;
    description: string;
  };
  relevantProvision: {
    title: string;
    section: string;
    authority: string;
    statutoryText: string;
  };
  whyItMayApply: string;
  supportingFacts: string[];
  supportingEvidence: string[];
  informationStillNeeded: string[];
  sourceId: string;
  nextAction: {
    title: string;
    description: string;
    url: string;
    ctaText: string;
  };
}

export interface MissingInfoQuestion {
  id: string;
  question: string;
  priority: 'IMPORTANT' | 'HELPFUL' | 'OPTIONAL';
  whyItMatters: string;
  howToProvideIt: string;
  possibleEvidence: string;
  answered?: boolean;
  answerValue?: string;
  skipped?: boolean;
}

export interface SimilarCaseCluster {
  id: string;
  title: string;
  caseCount: number;
  category: string;
  jurisdictionRegion: string;
  commonIssue: string;
  commonFacts: string[];
  commonEvidence: string[];
  commonLegalTopics: string[];
  commonLegalSources: string[];
  commonActions: string[];
  similarityReason: string;
  lastUpdated: string;
  privacyNotice: string;
}

export type CollectiveActionStatus =
  | 'NOT_PARTICIPATING'
  | 'INTERESTED'
  | 'PARTICIPATING'
  | 'WITHDRAWN';

export interface UserConsentRecord {
  caseId: string;
  dataCategoriesStored: string[];
  howDataUsed: {
    category: string;
    description: string;
    status: 'PRIVATE' | 'SHARED_WITH_CONSENT' | 'NOT_SHARED';
  }[];
  collectiveActionStatus: CollectiveActionStatus;
  consentedAt?: string;
  sharedDataPoints?: string[];
  privateDataPoints?: string[];
}

export interface CasePackage {
  caseSummary: string;
  keyFacts: KeyFact[];
  evidenceList: EvidenceItem[];
  timeline: TimelineEvent[];
  legalSources: StatutorySource[];
  actionsTaken: string[];
  pendingActions: string[];
  userNotes: string[];
  generatedAt: string;
}
