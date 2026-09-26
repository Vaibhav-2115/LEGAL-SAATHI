import {
  LegalCase,
  ChatMessage,
  StatutorySource,
  SimilarCaseCluster,
  LegalExplanationTrace,
  MissingInfoQuestion,
  UserConsentRecord
} from './types';

export const INITIAL_CASES: LegalCase[] = [
  {
    id: 'LS-2026-0042',
    title: 'Security Deposit Dispute',
    category: 'Tenancy & Housing Law',
    jurisdiction: 'Saket, South Delhi Jurisdiction',
    status: 'VERIFICATION',
    currentStage: 'VERIFY',
    summary: 'Landlord withholding ₹65,000 security deposit for over 45 days after peaceful handover without itemized damage deduction list or justification.',
    citizenStatement: 'I vacated my rented flat in Saket on 10 January 2026 after completing the 11-month registered lease and giving 30 days notice. The landlord inspected the premises, accepted the keys, but has not returned my security deposit of ₹65,000 despite multiple WhatsApp reminders and emails.',
    createdAt: '2026-01-15',
    updatedAt: 'Today',
    claimAmount: '₹65,000',
    totalEvidenceCount: 5,
    collectedEvidenceCount: 2,
    keyFacts: [
      {
        id: 'f1',
        statement: 'Registered 11-month lease agreement executed on 1st February 2025.',
        category: 'Contractual',
        confidence: 'HIGH',
        source: 'DOCUMENT_VERIFIED',
        verificationStatus: 'CONFIRMED',
        supportingEvidenceId: 'e1',
        supportingEvidenceName: 'Registered Lease Deed',
        relatedLegalIssue: 'Lease Validity & Clause 8 Covenants'
      },
      {
        id: 'f2',
        statement: 'Deposit of ₹65,000 paid via NEFT bank transfer on 28th January 2025.',
        category: 'Financial',
        confidence: 'HIGH',
        source: 'DOCUMENT_VERIFIED',
        verificationStatus: 'CONFIRMED',
        supportingEvidenceId: 'e2',
        supportingEvidenceName: 'Bank Transfer Proof (NEFT)',
        relatedLegalIssue: 'Security Deposit Payment & Consideration'
      },
      {
        id: 'f3',
        statement: '30-day written notice to vacate served via email on 10th December 2025.',
        category: 'Procedural',
        confidence: 'HIGH',
        source: 'CITIZEN_ACCOUNT',
        verificationStatus: 'SUPPORTED',
        supportingEvidenceId: 'e3',
        supportingEvidenceName: 'Email Written Vacation Notice',
        relatedLegalIssue: '30-Day Mandatory Notice Compliance'
      },
      {
        id: 'f4',
        statement: 'Handover completed on 10 January 2026 with dispute regarding alleged wall repaint deductions.',
        category: 'Possession & Handover',
        confidence: 'MEDIUM',
        source: 'CITIZEN_ACCOUNT',
        verificationStatus: 'CONFLICTING',
        supportingEvidenceId: 'e4',
        supportingEvidenceName: 'Move-Out Video & WhatsApp Chats',
        relatedLegalIssue: 'Premises Condition & Deductions Justification',
        conflictDetails: {
          whatDiffers: 'Citizen states flat was handed over in clean condition without damage on 10 Jan 2026. Landlord sent WhatsApp text on 28 Jan claiming ₹25,000 for repainting and deep cleaning without repair receipts.',
          sourceA: 'Citizen statement & move-out video timestamped 10 Jan 2026',
          sourceB: 'Landlord WhatsApp text dated 28 Jan 2026 without contractor invoice',
          howToResolve: 'Demand itemized contractor invoice with GST receipts under Section 11(3) Model Tenancy Act, 2021.'
        }
      },
      {
        id: 'f5',
        statement: 'No itemized deduction list or repair estimates provided within 30 days of vacation.',
        category: 'Statutory Default',
        confidence: 'HIGH',
        source: 'EXTRACTED',
        verificationStatus: 'SUPPORTED',
        supportingEvidenceId: 'e5',
        supportingEvidenceName: 'Landlord Non-Response Record',
        relatedLegalIssue: 'Statutory 30-Day Deposit Refund Default'
      },
      {
        id: 'f6',
        statement: 'Landlord orally assured during handover that full deposit would be credited within 7 business days.',
        category: 'Oral Covenant',
        confidence: 'LOW',
        source: 'CITIZEN_ACCOUNT',
        verificationStatus: 'NEEDS_VERIFICATION',
        relatedLegalIssue: 'Enforceability of Oral Assurances'
      },
      {
        id: 'f7',
        statement: 'Formal written handover receipt signed by landlord at the time of key return.',
        category: 'Possession Proof',
        confidence: 'LOW',
        source: 'CITIZEN_ACCOUNT',
        verificationStatus: 'MISSING',
        relatedLegalIssue: 'Written Acknowledgment of Possession Return'
      }
    ],
    evidenceList: [
      {
        id: 'e1',
        name: 'Registered Lease Deed',
        category: 'Contract',
        status: 'VERIFIED',
        statusLabel: 'Verified • Registered',
        collectedAt: '15 Jan 2026',
        notes: 'Clause 8 specifies deposit refund within 15 days of keys handover.'
      },
      {
        id: 'e2',
        name: 'Bank Transfer Proof (NEFT)',
        category: 'Financial Record',
        status: 'VERIFIED',
        statusLabel: 'Verified • UTR #8291048',
        collectedAt: '16 Jan 2026',
        notes: 'Shows ₹65,000 transferred to landlord account.'
      },
      {
        id: 'e3',
        name: 'Key Handover Acknowledgement',
        category: 'Handover Proof',
        status: 'REVIEW_NEEDED',
        statusLabel: 'Pending Citizen Upload',
        notes: 'WhatsApp confirmation text needs PDF export.'
      },
      {
        id: 'e4',
        name: 'Move-Out Flat Condition Photos / Video',
        category: 'Premises Condition',
        status: 'REVIEW_NEEDED',
        statusLabel: 'Review Needed',
        notes: 'Timestamped photos of walls and fixtures needed.'
      },
      {
        id: 'e5',
        name: 'Landlord Written Demand / Non-Response',
        category: 'Notice',
        status: 'MISSING',
        statusLabel: 'Missing',
        notes: 'Formal demand notice draft ready to be triggered.'
      }
    ],
    legalSources: [
      {
        id: 'ls1',
        title: 'Model Tenancy Act, 2021',
        section: 'Section 11(2)',
        category: 'ACTS',
        authority: 'Ministry of Housing & Urban Affairs, Govt of India',
        date: '02 Jun 2021',
        relevance: 'Statutory cap on residential deposit and mandatory refund timeframe',
        whyItMatters: 'Mandates that the landlord cannot withhold security deposits beyond 30 days after tenant vacates.',
        caseConnection: 'Directly applicable to your claim of ₹65,000 withheld for 45+ days without damage assessment.',
        excerpt: 'The security deposit to be paid by the tenant in advance shall not exceed two months rent for residential premises, and shall be refunded to the tenant within thirty days of vacating the premises after making agreed deductions, if any.',
        fullTextPreview: 'Section 11. Security Deposit.— (1) The security deposit to be paid by the tenant in advance shall be mutually agreed between the landlord and tenant, but shall not exceed two months rent in case of residential premises...\n(2) The security deposit shall be refunded to the tenant on the date of handing over vacant possession of the premises to the landlord, after making agreed deductions under sub-section (3).\n(3) The landlord shall furnish an itemized list of deductions with receipts or estimates within fifteen days of handing over possession.',
        officialLink: 'https://mohua.gov.in/upload/uploadfiles/files/Model_Tenancy_Act_English.pdf',
        relatedFacts: [
          'Lease ended on 10 January 2026',
          'Physical keys handed over to landlord',
          'No itemized deduction statement issued within 30 days'
        ],
        relatedEvidence: [
          'Registered Lease Deed (Clause 8)',
          'NEFT Security Deposit Proof'
        ],
        relatedActions: [
          'Prepare Legal Notice under Section 11',
          'Approach Rent Authority'
        ],
        verified: true
      },
      {
        id: 'ls2',
        title: 'Indian Contract Act, 1872',
        section: 'Section 73',
        category: 'SECTIONS',
        authority: 'Parliament of India / Law Commission',
        date: '25 Apr 1872',
        relevance: 'Compensation for breach of contractual lease covenant',
        whyItMatters: 'Entitles an aggrieved citizen to seek compensation and interest for breach of lease covenant.',
        caseConnection: 'The landlord’s refusal to honor Clause 8 constitutes an actionable breach of contract.',
        excerpt: 'When a contract has been broken, the party who suffers by such breach is entitled to receive, from the party who has broken the contract, compensation for any loss or damage caused to him thereby, which naturally arose in the usual course of things from such breach.',
        fullTextPreview: 'Section 73. Compensation for loss or damage caused by breach of contract.— When a contract has been broken, the party who suffers by such breach is entitled to receive, from the party who has broken the contract, compensation for any loss or damage caused to him thereby, which naturally arose in the usual course of things from such breach, or which the parties knew, when they made the contract, to be likely to result from the breach of it.',
        officialLink: 'https://www.indiacode.nic.in/handle/123456789/2187',
        relatedFacts: [
          'Clause 8 provided 15-day refund requirement upon key return',
          'Breach occurred on 25 January 2026'
        ],
        relatedEvidence: [
          'Registered Lease Deed',
          'Demand Notice via Email'
        ],
        relatedActions: [
          'Claim Statutory Interest in Notice',
          'Civil Court / Summary Suit'
        ],
        verified: true
      },
      {
        id: 'ls3',
        title: 'Delhi Rent Control / Rent Authority Rules',
        section: 'Rule 14',
        category: 'RULES',
        authority: 'Delhi Rent Control Authority / Revenue Dept',
        date: '14 Dec 2021',
        relevance: 'Jurisdiction of Rent Authority for summary dispute redressal',
        whyItMatters: 'Provides a swift quasi-judicial forum for tenants without protracted civil court litigation.',
        caseConnection: 'Gives Saket Rent Authority summary jurisdiction to order attachment of landlord assets for deposit refund.',
        excerpt: 'Disputes concerning repayment of deposits, return of advance rent, and peaceful handover are cognizable by the designated Rent Authority in summary proceedings.',
        fullTextPreview: 'Rule 14. Procedure for Recovery of Deposit.— (1) Any tenant aggrieved by non-refund of security deposit may make an application to the Rent Authority in Form-D.\n(2) The Rent Authority shall issue notice to the landlord requiring appearance within 14 days and dispose of the matter within 60 days.',
        officialLink: 'https://revenue.delhi.gov.in',
        relatedFacts: [
          'Flat located in Saket, South Delhi jurisdiction'
        ],
        relatedEvidence: [
          'Key Handover Receipt',
          'Notice of Intent to Move'
        ],
        relatedActions: [
          'File Summary Petition before Rent Authority',
          'Seek DLSA Legal Aid'
        ],
        verified: true
      }
    ],
    timeline: [
      {
        id: 't1',
        date: '10 Jan 2026',
        title: 'Premises Vacated & Keys Handed Over',
        description: 'Citizen completed 11-month lease term and handed keys to landlord.',
        stage: 'ASK',
        completed: true,
        eventType: 'INCIDENT',
        source: 'Citizen Handover Statement',
        evidenceId: 'e3',
        statusLabel: 'Handover Completed'
      },
      {
        id: 't2',
        date: '15 Jan 2026',
        title: 'Consultation with Legal Saathi',
        description: 'Case dossier #LS-2026-0042 created with automated rights analysis.',
        stage: 'UNDERSTAND',
        completed: true,
        eventType: 'CONVERSATION',
        source: 'Legal Saathi Intake Session',
        statusLabel: 'Rights Mapped'
      },
      {
        id: 't3',
        date: '18 Jan 2026',
        title: 'Registered Lease Deed & NEFT Deposit Uploaded',
        description: 'Primary documentary evidence attached and verified against Section 11 requirements.',
        stage: 'VERIFY',
        completed: true,
        eventType: 'EVIDENCE_ADDED',
        source: 'Bank Slip & Land Registry Verification',
        evidenceId: 'e1',
        statusLabel: 'Document Verified'
      },
      {
        id: 't4',
        date: '22 Jan 2026',
        title: 'Statutory Ground Identified under Model Tenancy Act',
        description: 'Model Tenancy Act 2021 Section 11 identified as statutory anchor for 30-day deposit refund mandate.',
        stage: 'VERIFY',
        completed: true,
        eventType: 'LEGAL_SOURCE_IDENTIFIED',
        source: 'Legal Intelligence Engine',
        statusLabel: 'Statute Linked'
      },
      {
        id: 't5',
        date: '28 Jan 2026',
        title: 'Conflicting Deduction Claim Noted',
        description: 'Landlord informal WhatsApp message asserting ₹25,000 deduction without invoice or quote.',
        stage: 'VERIFY',
        completed: true,
        eventType: 'FACT_VERIFIED',
        source: 'Landlord WhatsApp Chat Export',
        statusLabel: 'Conflict Detected'
      },
      {
        id: 't6',
        date: 'Today',
        title: 'Statutory Demand Notice Prepared',
        description: 'Draft legal notice citing Section 11 with 15-day cure window awaiting user review.',
        stage: 'ACT',
        completed: false,
        eventType: 'NOTICE_DRAFTED',
        source: 'Legal Notice Assistant',
        statusLabel: 'Ready for Dispatch'
      }
    ],
    nextStep: {
      id: 'ns1',
      title: 'Upload Key Handover & Move-out Photos',
      description: 'Complete the evidence checklist (2 of 5 collected: Lease Deed & Bank Transfer) to strengthen your statutory demand.',
      dueDate: 'Within 3 days',
      actionText: 'Complete Evidence Checklist',
      actionUrl: '/cases/LS-2026-0042',
      urgency: 'HIGH'
    }
  },
  {
    id: 'LS-2026-0038',
    title: 'Builder Delay & RERA Compensation',
    category: 'Real Estate & Property',
    jurisdiction: 'HRERA Gurugram Bench',
    status: 'ACTION REQUIRED',
    currentStage: 'ACT',
    summary: 'Promoter delayed possession of residential apartment by 18 months beyond promised date in Builder-Buyer Agreement (BBA).',
    citizenStatement: 'Booked a 3BHK in Sector 82 Gurugram in 2022 with promised possession by July 2024. Builder has only reached 70% structural completion and is demanding escalation charges.',
    createdAt: '2026-01-08',
    updatedAt: '2 days ago',
    claimAmount: '₹75,000/mo interest',
    totalEvidenceCount: 6,
    collectedEvidenceCount: 5,
    keyFacts: [
      {
        id: 'f21',
        statement: 'Builder-Buyer Agreement signed with guaranteed handover date of 31 July 2024.',
        category: 'Contractual',
        confidence: 'HIGH',
        source: 'DOCUMENT_VERIFIED'
      },
      {
        id: 'f22',
        statement: 'Citizen paid 95% of total consideration on construction-linked plan.',
        category: 'Financial',
        confidence: 'HIGH',
        source: 'DOCUMENT_VERIFIED'
      }
    ],
    evidenceList: [
      {
        id: 'e21',
        name: 'Builder Buyer Agreement (BBA)',
        category: 'Contract',
        status: 'VERIFIED',
        statusLabel: 'Verified',
        collectedAt: '08 Jan 2026'
      },
      {
        id: 'e22',
        name: 'Payment Receipts & Bank NOC',
        category: 'Financial Record',
        status: 'VERIFIED',
        statusLabel: 'Verified',
        collectedAt: '09 Jan 2026'
      }
    ],
    legalSources: [
      {
        id: 'ls21',
        title: 'Real Estate (Regulation and Development) Act, 2016',
        section: 'Section 18(1)',
        relevance: 'Mandatory monthly interest compensation at SBI MCLR + 2% for every month of delay',
        excerpt: 'If the promoter fails to complete or give possession of an apartment, he shall be liable on demand to pay interest for every month of delay until the handing over of possession.',
        verified: true
      }
    ],
    timeline: [
      {
        id: 't21',
        date: '08 Jan 2026',
        title: 'Matter Registered with Legal Saathi',
        description: 'Document extraction and RERA delay interest calculation.',
        stage: 'UNDERSTAND',
        completed: true
      }
    ],
    nextStep: {
      id: 'ns21',
      title: 'Submit Formal RERA Form-M Grievance',
      description: 'Dossier ready with certified interest calculations. File Form-M online.',
      dueDate: 'Due 25 Jan 2026',
      actionText: 'Review Form-M Filing',
      actionUrl: '/cases/LS-2026-0038',
      urgency: 'HIGH'
    }
  },
  {
    id: 'LS-2026-0029',
    title: 'Consumer Defective Product Refund',
    category: 'Consumer Protection',
    jurisdiction: 'National Consumer Helpline / District Commission',
    status: 'READY FOR ACTION',
    currentStage: 'EXPLAIN',
    summary: 'E-commerce platform delivered counterfeit/defective laptop and refused return window citing technical dispute.',
    citizenStatement: 'Purchased a laptop for ₹48,000 on major e-commerce portal. The machine arrived with mismatched serial numbers and failed boot within 48 hours. Return rejected.',
    createdAt: '2025-12-28',
    updatedAt: '5 days ago',
    claimAmount: '₹48,000',
    totalEvidenceCount: 4,
    collectedEvidenceCount: 4,
    keyFacts: [
      {
        id: 'f31',
        statement: 'GST Invoice and delivery unboxing video showing unsealed carton.',
        category: 'Product Proof',
        confidence: 'HIGH',
        source: 'DOCUMENT_VERIFIED'
      }
    ],
    evidenceList: [
      {
        id: 'e31',
        name: 'E-Commerce Tax Invoice',
        category: 'Invoice',
        status: 'VERIFIED',
        statusLabel: 'Verified',
        collectedAt: '28 Dec 2025'
      }
    ],
    legalSources: [
      {
        id: 'ls31',
        title: 'Consumer Protection Act, 2019',
        section: 'Section 2(47) & Section 35',
        relevance: 'Unfair trade practice and defect liability',
        excerpt: 'Unfair trade practice includes refusal to refund or replace within reasonable period.',
        verified: true
      }
    ],
    timeline: [
      {
        id: 't31',
        date: '28 Dec 2025',
        title: 'NCH Complaint Logged',
        description: 'Docket number issued by National Consumer Helpline.',
        stage: 'UNDERSTAND',
        completed: true
      }
    ],
    nextStep: {
      id: 'ns31',
      title: 'Escalate to e-Daakhil District Commission',
      description: 'Merchant failed 15-day NCH mediation window.',
      dueDate: 'Open',
      actionText: 'Prepare e-Daakhil Petition',
      actionUrl: '/cases/LS-2026-0029',
      urgency: 'MEDIUM'
    }
  },
  {
    id: 'LS-2026-0015',
    title: 'Unlawful Deduction in Gratuity & Settlement',
    category: 'Employment & Labor',
    jurisdiction: 'Labour Commissionerate, Delhi',
    status: 'COMPLETED',
    currentStage: 'UNITE',
    summary: 'Previous employer deducted ₹1,20,000 from final settlement alleging breach of non-compete clause.',
    citizenStatement: 'Resigned after 5 years of service. Employer withheld statutory gratuity citing 6-month non-compete clause.',
    createdAt: '2025-11-10',
    updatedAt: '12 Jan 2026',
    claimAmount: '₹1,20,000',
    totalEvidenceCount: 4,
    collectedEvidenceCount: 4,
    keyFacts: [],
    evidenceList: [],
    legalSources: [],
    timeline: [],
    nextStep: {
      id: 'ns41',
      title: 'Matter Successfully Resolved',
      description: 'Full settlement disbursed following statutory conciliation notice.',
      actionText: 'View Resolution Dossier',
      actionUrl: '/cases/LS-2026-0015',
      urgency: 'NORMAL'
    }
  }
];

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'welcome-init',
    sender: 'assistant',
    timestamp: 'Just now',
    structured: {
      whatIUnderstand: 'Welcome to Legal Saathi. I am your evidence-grounded legal copilot under Indian law. Describe your civil, consumer, tenancy, property, banking, or statutory dispute in plain English, Hindi, or your regional language to begin.',
      informationINeed: [
        'A brief factual description of what occurred and key dates',
        'Details of any agreements, receipts, or notices exchanged',
        'The city, state, or forum where the dispute arose'
      ],
      evidenceStrength: {
        score: 0,
        level: 'LOW',
        summary: 'Awaiting your dispute statement to initiate hybrid retrieval over 9,500+ Indian statutory acts.'
      },
      whyThisMayApply: 'Legal Saathi retrieves authoritative provisions from canonical Indian acts, rules, and landmark judgments to ground every response with verified citations.',
      legalSource: {
        act: 'Constitution of India',
        section: 'Article 39A',
        summary: 'Equal justice and free legal assistance for all citizens.'
      },
      whatYouCanDoNext: {
        suggestion: 'Type your grievance below or use voice input to initiate a structured legal consultation.',
        actionLabel: 'Describe Grievance Below'
      }
    }
  }
];

export const EXAMPLE_QUESTIONS = [
  {
    icon: 'house',
    title: 'Landlord withholding security deposit',
    tag: 'Tenancy Rights',
    prompt: 'My landlord is refusing to return my security deposit of ₹50,000 after I vacated the apartment on time.'
  },
  {
    icon: 'domain',
    title: 'Builder delaying flat possession',
    tag: 'RERA & Real Estate',
    prompt: 'The developer is 18 months late on handing over possession of my apartment and is asking for extra charges.'
  },
  {
    icon: 'shopping_cart',
    title: 'E-commerce defective goods refund',
    tag: 'Consumer Protection',
    prompt: 'I received a defective appliance from an online store and the seller is refusing to process a replacement or refund.'
  },
  {
    icon: 'work',
    title: 'Employer withholding unpaid salary / F&F',
    tag: 'Labor & Employment',
    prompt: 'My former company has not paid my final settlement and gratuity for over 60 days after my last working day.'
  }
];

export const VERIFIED_LEGAL_SOURCES: StatutorySource[] = [
  {
    id: 'ls1',
    title: 'Model Tenancy Act, 2021',
    section: 'Section 11(2)',
    category: 'ACTS',
    authority: 'Ministry of Housing & Urban Affairs, Govt of India',
    date: '02 Jun 2021',
    relevance: 'Statutory cap on residential deposit and mandatory refund timeframe',
    whyItMatters: 'Mandates that residential security deposits cannot exceed two months rent and must be refunded within 30 days of peaceful premises vacation.',
    caseConnection: 'Directly supports deposit recovery for tenancy dispute #LS-2026-0042.',
    excerpt: 'The security deposit to be paid by the tenant in advance shall not exceed two months rent for residential premises, and shall be refunded to the tenant within thirty days of vacating the premises after making agreed deductions, if any.',
    fullTextPreview: 'Section 11. Security Deposit.—\n(1) The security deposit to be paid by the tenant in advance shall be mutually agreed between the landlord and tenant, but shall not exceed—\n  (a) two months rent in case of residential premises; and\n  (b) six months rent in case of non-residential premises.\n(2) The security deposit shall be refunded to the tenant on the date of handing over vacant possession of the premises to the landlord, after making agreed deductions under sub-section (3).\n(3) The landlord shall furnish an itemized list of deductions with receipts or estimates within fifteen days of handing over possession.',
    officialLink: 'https://mohua.gov.in/upload/uploadfiles/files/Model_Tenancy_Act_English.pdf',
    relatedFacts: [
      'Lease ended on 10 January 2026',
      'Physical keys handed over to landlord',
      'No itemized deduction statement issued within 30 days'
    ],
    relatedEvidence: [
      'Registered Lease Deed (Clause 8)',
      'NEFT Security Deposit Proof'
    ],
    relatedActions: [
      'Prepare Legal Notice under Section 11',
      'Approach Rent Authority'
    ],
    verified: true
  },
  {
    id: 'ls2',
    title: 'Indian Contract Act, 1872',
    section: 'Section 73',
    category: 'SECTIONS',
    authority: 'Parliament of India / Law Commission',
    date: '25 Apr 1872',
    relevance: 'Compensation for breach of contractual lease covenant',
    whyItMatters: 'Entitles an aggrieved citizen to seek compensation and interest for breach of lease covenant or contractual promise.',
    caseConnection: 'The landlord’s refusal to honor Clause 8 constitutes an actionable breach of contract.',
    excerpt: 'When a contract has been broken, the party who suffers by such breach is entitled to receive, from the party who has broken the contract, compensation for any loss or damage caused to him thereby, which naturally arose in the usual course of things from such breach.',
    fullTextPreview: 'Section 73. Compensation for loss or damage caused by breach of contract.— When a contract has been broken, the party who suffers by such breach is entitled to receive, from the party who has broken the contract, compensation for any loss or damage caused to him thereby, which naturally arose in the usual course of things from such breach, or which the parties knew, when they made the contract, to be likely to result from the breach of it.\n\nSuch compensation is not to be given for any remote and indirect loss or damage sustained by reason of the breach.',
    officialLink: 'https://www.indiacode.nic.in/handle/123456789/2187',
    relatedFacts: [
      'Clause 8 provided 15-day refund requirement upon key return',
      'Breach occurred on 25 January 2026'
    ],
    relatedEvidence: [
      'Registered Lease Deed',
      'Demand Notice via Email'
    ],
    relatedActions: [
      'Claim Statutory Interest in Notice',
      'Civil Court / Summary Suit'
    ],
    verified: true
  },
  {
    id: 'ls3',
    title: 'Delhi Rent Control / Rent Authority Rules',
    section: 'Rule 14',
    category: 'RULES',
    authority: 'Delhi Rent Control Authority / Revenue Dept',
    date: '14 Dec 2021',
    relevance: 'Jurisdiction of Rent Authority for summary dispute redressal',
    whyItMatters: 'Provides a swift quasi-judicial forum for tenants without protracted civil court litigation.',
    caseConnection: 'Gives Saket Rent Authority summary jurisdiction to order attachment of landlord assets for deposit refund.',
    excerpt: 'Disputes concerning repayment of deposits, return of advance rent, and peaceful handover are cognizable by the designated Rent Authority in summary proceedings.',
    fullTextPreview: 'Rule 14. Procedure for Recovery of Deposit.—\n(1) Any tenant aggrieved by non-refund of security deposit may make an application to the Rent Authority in Form-D.\n(2) The Rent Authority shall issue notice to the landlord requiring appearance within 14 days and dispose of the matter within 60 days.\n(3) On failure of the landlord to refund within the stipulated period, the Rent Authority may issue a recovery certificate to the Collector as arrears of land revenue.',
    officialLink: 'https://revenue.delhi.gov.in',
    relatedFacts: [
      'Flat located in Saket, South Delhi jurisdiction'
    ],
    relatedEvidence: [
      'Key Handover Receipt',
      'Notice of Intent to Move'
    ],
    relatedActions: [
      'File Summary Petition before Rent Authority',
      'Seek DLSA Legal Aid'
    ],
    verified: true
  },
  {
    id: 'ls4',
    title: 'Real Estate (Regulation and Development) Act, 2016',
    section: 'Section 18(1)',
    category: 'ACTS',
    authority: 'Parliament of India / Central Government',
    date: '26 Mar 2016',
    relevance: 'Mandatory interest compensation for promoter delay in flat possession',
    whyItMatters: 'Requires developers to pay monthly interest at SBI Marginal Cost of Funds Based Lending Rate (MCLR) + 2% for every month of delayed possession.',
    caseConnection: 'Direct statutory foundation for Builder Delay dispute #LS-2026-0038.',
    excerpt: 'If the promoter fails to complete or is unable to give possession of an apartment in accordance with the terms of the agreement for sale, he shall be liable on demand to the allottees to pay interest for every month of delay.',
    fullTextPreview: 'Section 18. Return of amount and compensation.—\n(1) If the promoter fails to complete or is unable to give possession of an apartment, plot or building—\n  (a) in accordance with the terms of the agreement for sale or, as the case may be, duly completed by the date specified therein; or\n  (b) due to discontinuance of his business as a developer...\nhe shall be liable on demand to the allottees, in case the allottee wishes to withdraw from the project, without prejudice to any other remedy available, to return the amount received by him in respect of that apartment, plot, building, as the case may be, with interest at such rate as may be prescribed in this behalf including compensation...',
    officialLink: 'https://www.rera.delhi.gov.in',
    relatedFacts: [
      'Builder-Buyer Agreement signed with promised possession July 2024',
      '18-month delay ongoing with only 70% physical completion'
    ],
    relatedEvidence: [
      'Builder-Buyer Agreement (BBA)',
      'Payment receipts of ₹58 Lakhs'
    ],
    relatedActions: [
      'File Form-M before RERA Adjudicating Officer',
      'Issue Statutory Demand Notice'
    ],
    verified: true
  },
  {
    id: 'ls5',
    title: 'Consumer Protection Act, 2019',
    section: 'Section 2(47) & Section 35',
    category: 'SECTIONS',
    authority: 'Central Consumer Protection Authority (CCPA)',
    date: '09 Aug 2019',
    relevance: 'Unfair trade practice, defective product replacement and complaint filing',
    whyItMatters: 'Provides 2-year limitation window for consumers to seek full refund, damages, and replacement for defective merchandise delivered by online platforms.',
    caseConnection: 'Foundational statutory relief for e-commerce defective electronics dispute #LS-2026-0029.',
    excerpt: 'Unfair trade practice includes adoption of any unfair method or deceptive practice for promoting the sale, including falsely representing that goods are of a particular standard, quality or grade, or refusing to take back defective goods within refund window.',
    fullTextPreview: 'Section 35. Manner in which complaint shall be made.—\n(1) A complaint, in relation to any goods sold or delivered or agreed to be sold or delivered or any service provided or agreed to be provided, may be filed with a District Commission by—\n  (a) the consumer to whom such goods are sold or delivered...\n(2) Every complaint filed under sub-section (1) shall be accompanied with such fee and in such manner as may be prescribed, and may be filed electronically through e-Daakhil portal.',
    officialLink: 'https://edaakhil.nic.in',
    relatedFacts: [
      'Defective laptop delivered with mismatched serial numbers',
      'Return request refused within 48-hour statutory window'
    ],
    relatedEvidence: [
      'Invoice #OD-2026-8819',
      'Courier unboxing video and service center denial slip'
    ],
    relatedActions: [
      'File e-Daakhil Consumer Grievance',
      'Call National Consumer Helpline 1915'
    ],
    verified: true
  },
  {
    id: 'ls6',
    title: 'Pioneer Urban Land & Infrastructure Ltd. vs. Govindan Raghavan',
    section: '(2019) 5 SCC 725',
    category: 'JUDGMENTS',
    authority: 'Supreme Court of India (Division Bench)',
    date: '02 Apr 2019',
    relevance: 'One-sided clauses in developer agreements constitute unfair trade practices',
    whyItMatters: 'Landmark precedent ruling that flat purchasers cannot be compelled to accept delayed possession or one-sided penalty clauses under boilerplate contracts.',
    caseConnection: 'Overrules builder claims that unilateral force majeure clauses exempt interest liabilities in #LS-2026-0038.',
    excerpt: 'A term of a contract will not be final and binding if it is shown that the flat purchasers had no option but to sign on the dotted line, on a contract framed by the builder. Incorporating one-sided clauses constitutes an unfair trade practice.',
    fullTextPreview: 'Held by the Supreme Court of India:\n"A developer cannot compel a flat purchaser to be bound by one-sided contractual stipulations that favor the promoter while penalizing the home buyer. Where the builder fails to deliver possession within the stipulated timeframe plus grace period, the allottee is entitled to refund of entire deposited amount along with interest, or delayed compensation interest."',
    officialLink: 'https://main.sci.gov.in/supremecourt/2019/1677/1677_2019_Judgement_02-Apr-2019.pdf',
    relatedFacts: [
      'Builder invoked unilateral extension clause in Section 14 of BBA'
    ],
    relatedEvidence: [
      'Clause 14 of Builder-Buyer Agreement'
    ],
    relatedActions: [
      'Cite Precedent in Legal Notice',
      'Incorporate into RERA Petition'
    ],
    verified: true
  },
  {
    id: 'ls7',
    title: 'NALSA (Free & Competent Legal Services) Regulations, 2010',
    section: 'Regulation 3 & Section 12 LSA Act',
    category: 'OFFICIAL_GUIDANCE',
    authority: 'National Legal Services Authority (NALSA)',
    date: '09 Sep 2010',
    relevance: 'Citizen eligibility and entitlement to free legal representation',
    whyItMatters: 'Guarantees free legal aid panel advocates, court fees payment, and drafting services for eligible citizens under statutory guidelines.',
    caseConnection: 'Informs citizens of their rights to assign a DLSA panel lawyer for summary tribunal petitions.',
    excerpt: 'Any citizen falling under the criteria in Section 12 of the Legal Services Authorities Act, 1987—including women, children, members of SC/ST, and individuals whose annual income is below statutory threshold—is entitled to free legal aid.',
    fullTextPreview: 'National Legal Services Authority Regulations, 2010:\nRegulation 3. Mode of providing legal services.—\nLegal services shall be provided by—\n(a) payment of court fee, process fees and all other charges payable or incurred in connection with any legal proceedings;\n(b) through providing service of lawyers in legal proceedings;\n(c) obtaining and supply of certified copies of orders and other documents in legal proceedings;\n(d) preparation of appeal, paper book including printing and translation of documents in legal proceedings.',
    officialLink: 'https://nalsa.gov.in',
    relatedFacts: [
      'Dispute involves civil recovery and tenancy adjudication'
    ],
    relatedEvidence: [
      'Income declaration / Aadhaar identification',
      'Case docket summary'
    ],
    relatedActions: [
      'Apply at District Legal Services Authority (DLSA)',
      'Call NALSA National Helpline 15100'
    ],
    verified: true
  },
  {
    id: 'ls8',
    title: 'Right to Information Act, 2005',
    section: 'Section 6(1) & Section 7(1)',
    category: 'ACTS',
    authority: 'Central Information Commission & Parliament of India',
    date: '15 Jun 2005',
    relevance: 'Statutory right to obtain government records, inspection, and files within 30 days',
    whyItMatters: 'Allows citizens to demand certified copies of government sanction letters, inspection reports, municipal records, and police inquiry status.',
    caseConnection: 'Enables citizens to obtain certified builder approval plans, sanction dates, and municipal occupancy certificates.',
    excerpt: 'A person who desires to obtain any information under this Act shall make a request in writing or through electronic means accompanying such fee as may be prescribed... The Central Public Information Officer or State Public Information Officer shall, as expeditiously as possible, and in any case within thirty days of the receipt of the request, either provide the information on payment of such fee or reject the request.',
    fullTextPreview: 'Section 6. Request for obtaining information.—\n(1) A person, who desires to obtain any information under this Act, shall make a request in writing or through electronic means in English or Hindi or in the official language of the area in which the application is being made...\n(2) An applicant making request for information shall not be required to give any reason for requesting the information or any other personal details except those that may be necessary for contacting him.\n\nSection 7. Disposal of request.—\n(1) Within thirty days of receipt of request... provided that where the information sought for concerns the life or liberty of a person, the same shall be provided within forty-eight hours.',
    officialLink: 'https://rtionline.gov.in',
    relatedFacts: [
      'Builder claims delay is due to pending municipal fire NOC'
    ],
    relatedEvidence: [
      'RTI Application Form',
      '₹10 Postal Order or Online Payment'
    ],
    relatedActions: [
      'Submit Online RTI via rtionline.gov.in',
      'Inspect Municipal Sanction Files'
    ],
    verified: true
  },
  {
    id: 'ls9',
    title: 'Digital Personal Data Protection Act, 2023',
    section: 'Section 6 & Section 11',
    category: 'OTHER_VERIFIED_SOURCES',
    authority: 'Ministry of Electronics and Information Technology (MeitY)',
    date: '11 Aug 2023',
    relevance: 'Citizen consent requirements and right to grievance redressal for personal data misuse',
    whyItMatters: 'Prohibits online platforms and financial entities from sharing citizen financial data, contact details, or KYC without unambiguous verifiable consent.',
    caseConnection: 'Applies to unauthorized data sharing, recovery harassment calls, and cyber financial data leaks.',
    excerpt: 'The Data Principal shall have the right to readily available means of grievance redressal provided by a Data Fiduciary or Consent Manager in respect of any act or omission of such Data Fiduciary regarding the performance of its obligations.',
    fullTextPreview: 'Section 6. Consent.—\n(1) Consent given by the Data Principal shall be free, specific, informed, unconditional and unambiguous with a clear affirmative action, and shall signify an agreement to the processing of her personal data for the specified purpose...\n\nSection 11. Right to grievance redressal.—\n(1) A Data Principal shall have the right to readily available means of grievance redressal in respect of any act or omission regarding personal data processing.',
    officialLink: 'https://www.meity.gov.in',
    relatedFacts: [
      'Citizen reported unauthorized telemarketing following e-commerce data compromise'
    ],
    relatedEvidence: [
      'Call logs',
      'SMS notifications of data access'
    ],
    relatedActions: [
      'Serve Data Grievance Notice to Platform',
      'Escalate to Data Protection Board of India'
    ],
    verified: true
  },
  {
    id: 'ls10',
    title: 'Bharatiya Nyaya Sanhita, 2023',
    section: 'Section 318 (Cheating & Dishonest Inducement)',
    category: 'SECTIONS',
    authority: 'Ministry of Home Affairs & Parliament of India',
    date: '01 Jul 2024',
    relevance: 'Criminal liability for deceptive fraudulent misrepresentation and dishonest misappropriation',
    whyItMatters: 'Governs offences where an entity fraudulently induces a citizen to deliver property or money based on false promises (supersedes IPC Section 420).',
    caseConnection: 'Relevant when evaluating potential e-FIR guidance for deliberate financial fraud or deceptive advance fees.',
    excerpt: 'Whoever, by deceiving any person, fraudulently or dishonestly induces the person so deceived to deliver any property to any person, or to consent that any person shall retain any property... commits cheating.',
    fullTextPreview: 'Section 318. Cheating.—\n(1) Whoever, by deceiving any person, fraudulently or dishonestly induces the person so deceived to deliver any property to any person, or to consent that any person shall retain any property, or intentionally induces the person so deceived to do or omit to do anything which he would not do or omit if he were not so deceived, and which act or omission causes or is likely to cause damage or harm to that person in body, mind, reputation or property, is said to cheat.\n(2) Whoever cheats shall be punished with imprisonment of either description for a term which may extend to three years, or with fine, or with both.',
    officialLink: 'https://mha.gov.in',
    relatedFacts: [
      'Aggrieved party induced to pay advance charges under false pretenses'
    ],
    relatedEvidence: [
      'WhatsApp transaction trail',
      'Bank statement showing beneficiary accounts'
    ],
    relatedActions: [
      'Prepare Incident Summary for e-FIR Guidance',
      'Report on Cybercrime Portal (1930)'
    ],
    verified: true
  },
  {
    id: 'ls11',
    title: 'Lalita Kumari vs. Govt. of U.P.',
    section: '(2014) 2 SCC 1',
    category: 'JUDGMENTS',
    authority: 'Supreme Court of India (Constitution Bench)',
    date: '12 Nov 2013',
    relevance: 'Mandatory registration of First Information Report (FIR) upon disclosure of cognizable offence',
    whyItMatters: 'Constitutional precedent holding that police officers are legally obligated to register an FIR without conducting preliminary inquiry if information discloses a cognizable offence.',
    caseConnection: 'Protects citizens against refusal by local police stations to accept e-FIRs or written complaints regarding cognizable financial fraud.',
    excerpt: 'Registration of FIR is mandatory under Section 154 of the Code, if the information discloses commission of a cognizable offence and no preliminary inquiry is permissible in such a situation.',
    fullTextPreview: 'Constitution Bench of the Supreme Court held:\n1. Registration of FIR is mandatory under Section 154 of the Code, if the information discloses commission of a cognizable offence.\n2. If the information received does not disclose a cognizable offence but indicates the necessity for an inquiry, a preliminary inquiry may be conducted only to ascertain whether cognizable offence is disclosed or not.\n3. The police officer cannot avoid his duty of registering offence if cognizable offence is disclosed. Action must be taken against erring officers who do not register the FIR.',
    officialLink: 'https://main.sci.gov.in',
    relatedFacts: [
      'Cyber reporting submitted through official police channel'
    ],
    relatedEvidence: [
      'Copy of formal written complaint with receiving stamp or online acknowledgment number'
    ],
    relatedActions: [
      'Attach Lalita Kumari citation in police representation',
      'Approach Superintendent of Police under CrPC 154(3) / BNSS 173(3)'
    ],
    verified: true
  },
  {
    id: 'ls12',
    title: 'Guidelines for Prevention and Regulation of Dark Patterns, 2023',
    section: 'Guidelines 4 & 5 (CCPA)',
    category: 'OFFICIAL_GUIDANCE',
    authority: 'Central Consumer Protection Authority / Dept of Consumer Affairs',
    date: '30 Nov 2023',
    relevance: 'Prohibition of deceptive design patterns in e-commerce interfaces',
    whyItMatters: 'Explicitly bans manipulative user interfaces including "False Urgency", "Basket Sneaking", "Forced Action", and "Disguised Advertisements" in consumer apps.',
    caseConnection: 'Grounds consumer claims regarding deceptive auto-renewal fees and hidden return restriction clauses.',
    excerpt: 'No person, including any platform, shall engage in any dark pattern practice. Any person engaging in dark pattern practice shall be considered as engaging in unfair trade practice under Section 2(47) of the Consumer Protection Act, 2019.',
    fullTextPreview: 'Central Consumer Protection Authority Notification:\nGuideline 4. Prohibition of dark patterns.— No person, including any platform, shall engage in any dark pattern practice.\n\nGuideline 5. Specified dark patterns.— The dark patterns specified in Annexure 1 include:\n(a) False Urgency: falsely stating or implying the sense of urgency or scarcity to mislead a user into making an immediate purchase;\n(b) Basket Sneaking: inclusion of additional items such as products, services, payments to charity without the consent of the user;\n(c) Confirm Shaming: using a phrase, video, audio or any other means to create a sense of fear or shame or guilt in the user...\n(d) Forced Action: forcing a user into taking an action that would require the user to buy additional goods or share personal information.',
    officialLink: 'https://consumeraffairs.nic.in',
    relatedFacts: [
      'Online platform secretly added non-refundable service fee during checkout'
    ],
    relatedEvidence: [
      'Screenshots of checkout screen and final billing amount'
    ],
    relatedActions: [
      'Report Platform to CCPA Portal',
      'Cite CCPA Dark Pattern Guidelines in Demand Letter'
    ],
    verified: true
  }
];

export const SIMILAR_CASE_CLUSTERS: SimilarCaseCluster[] = [
  {
    id: 'cluster-deposit-delhi',
    title: 'Residential Security Deposit Withholding (South Delhi)',
    caseCount: 23,
    category: 'Tenancy & Housing Law',
    jurisdictionRegion: 'South Delhi (Saket, Hauz Khas, Malviya Nagar)',
    commonIssue: 'Landlords withholding security deposits (₹45,000–₹90,000) for >30 days following peaceful surrender of keys without providing an itemized damage deduction list.',
    commonFacts: [
      '11-month registered or notarized lease deed executed',
      'Tenant served 30 days written notice before vacating',
      'Physical handover of keys completed with video or chat record',
      'Over 30 days elapsed without deposit refund or written explanation',
      'Arbitrary deductions asserted verbally without contractor receipts'
    ],
    commonEvidence: [
      'Registered/Notarized Lease Agreement',
      'NEFT/UPI Security Deposit Payment Acknowledgment',
      'Move-out Notice Dispatch (Email / WhatsApp)',
      'Key Handover Receipt / Written Confirmation',
      'Premises Vacating Photos / Video Walkthrough'
    ],
    commonLegalTopics: [
      'Model Tenancy Act, 2021 (Section 11)',
      'Indian Contract Act, 1872 (Section 73)',
      'Delhi Rent Control Rules (Summary Grievance Procedure)',
      'Consumer Protection Act (Unfair Trade Practice by Broker/Landlord)'
    ],
    commonLegalSources: [
      'Model Tenancy Act 2021 Sec 11',
      'Indian Contract Act 1872 Sec 73',
      'Delhi Rent Control / Rent Authority Rules Rule 14'
    ],
    commonActions: [
      'Issue 15-Day Statutory Legal Demand Notice',
      'Lodge Form-D Summary Petition before Rent Authority',
      'Apply for DLSA Free Mediation & Pre-Litigation Counseling'
    ],
    similarityReason: 'Matches your dispute in 4 core dimensions: residential lease, post-handover withholding, lack of itemized damage report, and South Delhi Rent Authority territorial jurisdiction.',
    lastUpdated: 'Updated today from 23 anonymized case patterns',
    privacyNotice: 'Privacy Protected: Zero personal names, phone numbers, exact addresses, or private communications are included or displayed. All statistics represent privacy-safe aggregated patterns.'
  },
  {
    id: 'cluster-rera-gurugram',
    title: 'Builder Delay & Unauthorized Escalation (New Gurugram)',
    caseCount: 41,
    category: 'Real Estate & Property',
    jurisdictionRegion: 'HRERA Gurugram (Sectors 81–95)',
    commonIssue: 'Promoter delayed possession by 12–24 months beyond committed Builder-Buyer Agreement (BBA) date while issuing escalation and holding charges.',
    commonFacts: [
      'Builder-Buyer Agreement signed with committed handover date',
      'Over 80% total consideration paid as per construction-linked plan',
      'Occupancy Certificate (OC) delayed by competent authorities',
      'Promoter demanding additional escalation charges prior to possession'
    ],
    commonEvidence: [
      'Registered Builder-Buyer Agreement (BBA)',
      'Bank Payment Receipts & Statement of Account',
      'Demand Letters for Escalation Charges',
      'HRERA Project Registration Certificate'
    ],
    commonLegalTopics: [
      'Real Estate (Regulation and Development) Act, 2016 (Section 18)',
      'Consumer Protection Act, 2019 (Deficiency of Service)',
      'Pioneer Urban Land & Infrastructure Precedent'
    ],
    commonLegalSources: [
      'RERA 2016 Section 18',
      'Consumer Protection Act 2019 Section 2(11)',
      'Fortune Infrastructure vs Trevor D’Lima (2018)'
    ],
    commonActions: [
      'File Form CRA before HRERA Adjudicating Officer',
      'Issue Pre-Litigation Notice demanding delay compensation at SBI MCLR + 2%',
      'Approach DLSA Gurugram for group mediation'
    ],
    similarityReason: 'Matches multi-buyer delay disputes where promoters exceed contractual grace periods without statutory delay interest.',
    lastUpdated: 'Updated 2 days ago from 41 aggregated complaints',
    privacyNotice: 'Privacy Protected: Aggregated pattern data only. No personal buyer identities or flat numbers are exposed.'
  },
  {
    id: 'cluster-ecommerce-counterfeit',
    title: 'E-Commerce Refusal of Defective Product Return (National)',
    caseCount: 18,
    category: 'Consumer Protection',
    jurisdictionRegion: 'National Consumer Helpline / District Consumer Commission',
    commonIssue: 'Major marketplace platforms refusing return/refund for defective electronics or mismatched deliveries under unilateral "brand warranty only" clauses.',
    commonFacts: [
      'Product delivered in defective or non-functional condition',
      'Return request initiated within standard replacement window (7 days)',
      'Customer care rejected return citing seller or brand policy',
      'Unilateral cancellation of return pickup without technician visit'
    ],
    commonEvidence: [
      'Tax Invoice & Order Summary Receipt',
      'Unboxing Video / Defect Photos',
      'Customer Support Chat Transcript / Email Ticket',
      'Brand Service Center Inspection Job Sheet'
    ],
    commonLegalTopics: [
      'Consumer Protection Act, 2019 (Section 2(47) & Section 35)',
      'Consumer Protection (E-Commerce) Rules, 2020 (Rule 5 & 6)',
      'CCPA Guidelines on Dark Patterns, 2023'
    ],
    commonLegalSources: [
      'Consumer Protection Act 2019 Sec 35',
      'E-Commerce Rules 2020 Rule 6',
      'Dark Pattern Guidelines 2023'
    ],
    commonActions: [
      'Lodge Docket on National Consumer Helpline (NCH / INGRAM)',
      'Issue Statutory Consumer Notice under Section 35',
      'File Online Grievance on e-Daakhil Portal'
    ],
    similarityReason: 'Identical refusal pattern where e-commerce platforms shift statutory return obligations to third-party manufacturers.',
    lastUpdated: 'Updated 3 days ago from 18 verified consumer dockets',
    privacyNotice: 'Privacy Protected: Aggregated consumer patterns only. No personal contact details or order IDs are revealed.'
  }
];

export const LEGAL_EXPLANATION_TRACES: Record<string, LegalExplanationTrace> = {
  'LS-2026-0042': {
    caseId: 'LS-2026-0042',
    whatIUnderstand: 'You leased a residential premises in Saket, South Delhi for 11 months, completed the contractual term, and handed over keys to the landlord on 10 January 2026. Despite fulfilling notice obligations and returning vacant possession, the landlord has retained your ₹65,000 security deposit for over 45 days without furnishing an itemized damage deduction statement or repair invoices.',
    legalIssue: {
      title: 'Unlawful Withholding of Residential Security Deposit & Breach of Lease Covenant',
      category: 'Tenancy Rights & Contractual Obligations',
      description: 'The dispute centers on whether a landlord has statutory authority to retain residential tenant funds after peaceful surrender of premises without complying with statutory timelines and deduction substantiation rules.'
    },
    relevantProvision: {
      title: 'Model Tenancy Act, 2021',
      section: 'Section 11, Sub-sections (2) and (3)',
      authority: 'Ministry of Housing and Urban Affairs, Government of India',
      statutoryText: 'Section 11(2): The security deposit shall be refunded to the tenant on the date of handing over vacant possession of the premises to the landlord, after making agreed deductions under sub-section (3).\n\nSection 11(3): The landlord shall furnish an itemized list of deductions with receipts or estimates within fifteen days of handing over possession, failing which the entire deposit becomes refundable with interest.'
    },
    whyItMayApply: 'Based on the facts on record, this statutory provision may be directly relevant because:\n• The premises were residential, covered by an 11-month lease covenant.\n• Vacant possession and physical keys were handed over on 10 January 2026.\n• The 30-day maximum statutory window under the Model Tenancy framework has expired.\n• The landlord failed to deliver an itemized list of deductions with contractor receipts within 15 days.\n• Consequently, withholding the entire ₹65,000 deposit may constitute an actionable statutory breach entitling you to full recovery plus interest.',
    supportingFacts: [
      'Fact #f1: Registered 11-month lease agreement executed on 1st February 2025 (Confirmed via Document)',
      'Fact #f2: Deposit of ₹65,000 paid via NEFT bank transfer on 28th January 2025 (Supported by Bank Slip)',
      'Fact #f3: Keys and vacant possession surrendered on 10th January 2026 (Supported by Handover WhatsApp confirmation)',
      'Fact #f4: Over 45 days elapsed with no itemized deduction invoice or contractor bill (Supported by Citizen Statement)'
    ],
    supportingEvidence: [
      'Registered Lease Deed (Clause 8 covenants full refund within 15 days of handover)',
      'NEFT Bank Transfer Receipt (Confirms ₹65,000 credit to landlord account)',
      'WhatsApp Chat Transcript (Confirms receipt of keys by landlord on 10 Jan 2026)'
    ],
    informationStillNeeded: [
      'Move-out premises inspection photos or video recording to rebut the conflicting ₹25,000 wall repainting claim',
      'Formal 30-day advance notice letter copy if dispatched via email or registered post'
    ],
    sourceId: 'ls1',
    nextAction: {
      title: 'Serve 15-Day Statutory Demand Notice',
      description: 'Issue a formal legal notice under Section 11 of the Model Tenancy Act demanding release of the withheld ₹65,000 within 15 days, prior to initiating summary Rent Authority proceedings.',
      url: '/draft/legal-notice',
      ctaText: 'Open Legal Notice Assistant'
    }
  },
  'LS-2026-0038': {
    caseId: 'LS-2026-0038',
    whatIUnderstand: 'You entered into a Builder-Buyer Agreement for a residential flat in Sector 82, Gurugram with committed possession by July 2024. The promoter has delayed completion by over 18 months, has not obtained an Occupancy Certificate, and is demanding escalation charges while denying statutory delay compensation.',
    legalIssue: {
      title: 'Failure of Promoter to Hand Over Possession & Denial of Delay Interest',
      category: 'Real Estate & Statutory Consumer Protection',
      description: 'Whether an allottee who has fulfilled payment obligations is entitled to monthly delay interest at SBI highest marginal cost of funds plus 2% under Section 18 of RERA.'
    },
    relevantProvision: {
      title: 'Real Estate (Regulation and Development) Act, 2016',
      section: 'Section 18(1)',
      authority: 'Parliament of India / HRERA Gurugram Bench',
      statutoryText: 'Section 18(1): If the promoter fails to complete or is unable to give possession of an apartment, plot or building in accordance with the terms of the agreement for sale... he shall be liable to pay interest to the allottees for every month of delay, till the handing over of possession, at such rate as may be prescribed.'
    },
    whyItMayApply: 'This provision may be applicable because:\n• The Builder-Buyer Agreement specified 31 July 2024 as the firm date of possession.\n• The promoter has exceeded the committed timeline by over 18 months without force majeure certification.\n• Section 18 mandates monthly interest without requiring the allottee to withdraw from the project unless they choose to do so.',
    supportingFacts: [
      'BBA executed with possession date fixed at 31 July 2024 (Confirmed)',
      'Payment of 85% total consideration completed as per payment schedule (Confirmed)',
      'Structural completion currently at only 70% with no OC application (Supported by RERA portal filing)'
    ],
    supportingEvidence: [
      'Registered Builder-Buyer Agreement (BBA)',
      'Bank Disbursement & Payment Receipts',
      'RERA Project Quarterly Progress Report (QPR)'
    ],
    informationStillNeeded: [
      'Latest written communication or demand letter from builder specifying escalation claims'
    ],
    sourceId: 'ls5',
    nextAction: {
      title: 'File Form CRA before HRERA Gurugram',
      description: 'Lodge a formal statutory petition claiming delay interest at 10.85% p.a. from August 2024 until physical delivery of possession.',
      url: '/actions',
      ctaText: 'Prepare RERA Action'
    }
  }
};

export const MISSING_INFO_QUESTIONS: Record<string, MissingInfoQuestion[]> = {
  'LS-2026-0042': [
    {
      id: 'mq1',
      question: 'Did the landlord conduct a walk-through inspection and sign or text an exit confirmation on move-out day?',
      priority: 'IMPORTANT',
      whyItMatters: 'An inspection acknowledgment on move-out day prevents the landlord from retroactively asserting damages or claiming that premises were left in disrepair.',
      howToProvideIt: 'Upload a signed checklist or copy the WhatsApp message where the landlord acknowledged receiving the flat in good condition.',
      possibleEvidence: 'Exit inspection form, WhatsApp message screenshot, or handover video recording.',
      answered: false
    },
    {
      id: 'mq2',
      question: 'Was the 30-day move-out notice communicated in writing (Email, WhatsApp, or physical letter)?',
      priority: 'IMPORTANT',
      whyItMatters: 'Clause 4 of standard rental agreements mandates 30 days written notice. Having timestamped proof prevents the landlord from claiming 1 month rent deduction in lieu of notice.',
      howToProvideIt: 'Provide the date notice was sent and attach the email header or WhatsApp screenshot.',
      possibleEvidence: 'Email sent receipt or WhatsApp message with date stamp (e.g., 10 Dec 2025).',
      answered: false
    },
    {
      id: 'mq3',
      question: 'Have you incurred any out-of-pocket expenses (temporary stay, legal counseling, or courier fees) due to the withheld deposit?',
      priority: 'HELPFUL',
      whyItMatters: 'Under Section 73 of the Indian Contract Act, consequential damages that naturally arose from breach of contract may be claimed alongside the principal deposit.',
      howToProvideIt: 'Enter approximate monetary expenses incurred and brief descriptions.',
      possibleEvidence: 'Invoices, bank statements showing extra accommodation charges, or legal consultation bills.',
      answered: false
    },
    {
      id: 'mq4',
      question: 'Do you know if the premises have already been rented out to a new tenant?',
      priority: 'OPTIONAL',
      whyItMatters: 'If new tenants have occupied the flat without the landlord carrying out the claimed repainting or repairs, it strongly discredits the landlord’s deduction excuse.',
      howToProvideIt: 'Mention if you observed new occupants or saw broker listings marked "rented".',
      possibleEvidence: 'Listing screenshot or security guard statement.',
      answered: false
    }
  ],
  'LS-2026-0038': [
    {
      id: 'mq21',
      question: 'Did the promoter send any force majeure notice citing COVID or regulatory delays in writing?',
      priority: 'IMPORTANT',
      whyItMatters: 'HRERA only excuses delays where formal statutory force majeure was invoked within 30 days of the triggering event with competent authority notification.',
      howToProvideIt: 'Upload any formal delay notification letter received from the builder.',
      possibleEvidence: 'Builder letter or email communication.',
      answered: false
    },
    {
      id: 'mq22',
      question: 'What is the exact amount and head under which the promoter is demanding escalation charges?',
      priority: 'HELPFUL',
      whyItMatters: 'RERA prohibits unilateral cost escalation after BBA execution unless specifically provided in approved clauses and substantiated by audited accounts.',
      howToProvideIt: 'Enter the demanded amount and attach the demand note.',
      possibleEvidence: 'Escalation demand letter or customer portal invoice.',
      answered: false
    }
  ]
};

export const DEFAULT_USER_CONSENTS: Record<string, UserConsentRecord> = {
  'LS-2026-0042': {
    caseId: 'LS-2026-0042',
    dataCategoriesStored: [
      'Case Title & Factual Narrative (Lease period, handover date, withheld sum)',
      'Uploaded Documents (Registered Lease Deed, NEFT payment slip, WhatsApp chat excerpt)',
      'Identified Legal Issues & Applicable Statutory Provisions',
      'Timeline of Grievance Events'
    ],
    howDataUsed: [
      {
        category: 'Case Assistance & Legal Analysis',
        description: 'Processing facts to cross-reference Indian statutes and assist in drafting legal notices.',
        status: 'PRIVATE'
      },
      {
        category: 'Evidence Organization & Validation',
        description: 'Verifying consistency between user statements and documentary proofs.',
        status: 'PRIVATE'
      },
      {
        category: 'Legal Source Matching',
        description: 'Correlating factual details with Model Tenancy Act and Contract Act sections.',
        status: 'PRIVATE'
      },
      {
        category: 'Privacy-Preserving Pattern Detection',
        description: 'Comparing anonymized issue category (tenancy deposit withholding in South Delhi) against similar civic patterns without sharing personal identifiers.',
        status: 'SHARED_WITH_CONSENT'
      },
      {
        category: 'Collective Action & Advocacy Participation',
        description: 'Joining collective representation before Delhi Rent Authority or DLSA mediation. Requires separate explicit consent.',
        status: 'NOT_SHARED'
      }
    ],
    collectiveActionStatus: 'NOT_PARTICIPATING',
    sharedDataPoints: [
      'Dispute category (Residential Tenancy Deposit)',
      'Withholding duration (>30 days)',
      'Broad jurisdiction (South Delhi / Saket Rent Authority)'
    ],
    privateDataPoints: [
      'Citizen Full Name & Contact Number',
      'Landlord Full Name & Contact Number',
      'Exact Rental Property Address & Flat Number',
      'Bank Account & IFSC Numbers on NEFT Slip',
      'Private WhatsApp Messages & Conversation Content'
    ]
  },
  'LS-2026-0038': {
    caseId: 'LS-2026-0038',
    dataCategoriesStored: [
      'BBA Details & Possession Handover Commitments',
      'Payment Milestone Receipts',
      'HRERA Registration Metadata'
    ],
    howDataUsed: [
      {
        category: 'Case Assistance & Legal Analysis',
        description: 'Determining RERA Section 18 compensation eligibility.',
        status: 'PRIVATE'
      },
      {
        category: 'Privacy-Preserving Pattern Detection',
        description: 'Identifying shared delay patterns among allottees of the same builder project.',
        status: 'SHARED_WITH_CONSENT'
      },
      {
        category: 'Collective Action Participation',
        description: 'Filing group petition before HRERA Gurugram.',
        status: 'NOT_SHARED'
      }
    ],
    collectiveActionStatus: 'NOT_PARTICIPATING',
    sharedDataPoints: [
      'Project sector and promoter name',
      'Average delay duration (18 months)'
    ],
    privateDataPoints: [
      'Buyer personal identity and contact info',
      'Exact tower and unit number',
      'Personal financial statements'
    ]
  }
};

