/**
 * Legal Saathi - Core Multilingual Translation Dictionary (i18n)
 * Supports 8 primary Indian languages:
 * English, Hindi (हिन्दी), Marathi (मराठी), Tamil (தமிழ்),
 * Bengali (বাংলা), Telugu (తెలుగు), Gujarati (ગુજરાતી), Kannada (ಕನ್ನಡ)
 */

export type SupportedLanguage =
  | 'English'
  | 'Hindi'
  | 'Marathi'
  | 'Tamil'
  | 'Bengali'
  | 'Telugu'
  | 'Gujarati'
  | 'Kannada';

export interface TranslationDictionary {
  brandName: string;
  tagline: string;
  civicLegalAssistant: string;
  civilJusticeGuidance: string;
  selectLanguage: string;
  freeLegalAid: string;
  helplineNalsa: string;

  // Global Navigation
  navHome: string;
  navMyMatters: string;
  navLegalAssistant: string;
  navCaseWorkspace: string;
  navDashboard: string;
  navComplaints: string;
  navSources: string;
  navSimilarCases: string;
  navDrafting: string;
  navEfir: string;
  navVoice: string;
  myAccount: string;
  profile: string;
  settings: string;
  logout: string;
  login: string;
  register: string;

  // Case Workspace Groups & Tabs
  groupDossier: string;
  groupLegal: string;
  groupActions: string;
  tabOverview: string;
  tabEvidence: string;
  tabTimeline: string;
  tabMissingInfo: string;
  tabWhyLawApplies: string;
  tabVerification: string;
  tabSources: string;
  tabCompare: string;
  tabActions: string;
  tabCollective: string;
  tabExport: string;
  openAssistant: string;
  moreTabs: string;

  // Buttons & Controls
  btnCreateCase: string;
  btnCreateDraft: string;
  btnEdit: string;
  btnEditFields: string;
  btnEditManually: string;
  btnEditWithAi: string;
  btnSaveDraft: string;
  btnDraftSaved: string;
  btnSaveNewVersion: string;
  btnRegenerate: string;
  btnPreview: string;
  btnPrintExport: string;
  btnCopy: string;
  btnDownload: string;
  btnCancel: string;
  btnConfirm: string;
  btnDelete: string;
  btnRetry: string;
  btnSend: string;
  btnRestore: string;
  btnAccept: string;
  btnReject: string;
  btnRefine: string;
  btnUploadEvidence: string;
  btnAddDemand: string;
  btnBack: string;
  btnContinue: string;
  btnClear: string;
  close: string;

  // Status & Badges
  statusActionRequired: string;
  statusVerified: string;
  statusMissing: string;
  statusReviewNeeded: string;
  statusCollected: string;
  statusConfirmed: string;
  statusSupported: string;
  statusDisputed: string;
  statusDraft: string;
  statusCompleted: string;
  statusReady: string;
  statusUnderReview: string;
  statusApplicable: string;
  statusPotentiallyApplicable: string;
  statusRequiresInfo: string;

  // Draft Parameters UI
  draftParametersTitle: string;
  stepPrepareNotice: string;
  tabParties: string;
  tabMatter: string;
  tabFacts: string;
  tabDemands: string;
  recipientInfo: string;
  recipientName: string;
  designation: string;
  postalAddress: string;
  email: string;
  senderInfo: string;
  senderName: string;
  claimedAmount: string;
  senderAddress: string;
  factsSummary: string;
  statutoryBasis: string;
  curePeriod: string;
  daysNotice: string;
  demandsTitle: string;

  // Document Preview & AI Editing
  previewHeader: string;
  legalNoticeDisclaimer: string;
  aiEditorTitle: string;
  aiEditorSubtitle: string;
  aiInstructionLabel: string;
  aiInstructionPlaceholder: string;
  quickSuggestions: string;
  generateRevision: string;
  applyingRevisions: string;
  proposedChangesSummary: string;
  currentDocument: string;
  proposedAiRevision: string;
  acceptSaveVersion: string;
  versionHistoryTitle: string;
  versionHistorySubtitle: string;
  versionCurrent: string;

  // Why Law Applies & Traceability
  traceabilityPipeline: string;
  traceabilitySubtitle: string;
  traceableLinkage: string;
  stepFacts: string;
  stepIssue: string;
  stepStatute: string;
  stepSource: string;
  stepAction: string;
  whatIUnderstand: string;
  identifiedLegalIssue: string;
  applicableProvision: string;
  statutoryTimeLimit: string;
  limitationNotice: string;
  whyItApplies: string;
  supportingFacts: string;
  corroboratingEvidence: string;
  infoStillNeeded: string;
  openMissingInfo: string;
  verifiedSource: string;
  whatYouCanDoNext: string;
  verifiedAction: string;
  actionPendingProof: string;

  // Assistant & Chat
  askAssistantPlaceholder: string;
  summarizeCase: string;
  currentStatus: string;
  missingItems: string;
  latestUpdate: string;
  nextLegalSteps: string;
  applicableLaws: string;
  send: string;
  disclaimer: string;
  quickInquiries: string;
  chatAssistantTitle: string;
  chatAssistantSubtitle: string;
  reviewingCaseLaw: string;
  clearChat: string;

  // Workspace Sections Titles & Subtitles
  factVerificationTitle: string;
  factVerificationSubtitle: string;
  timelineTitle: string;
  timelineSubtitle: string;
  evidenceTitle: string;
  evidenceSubtitle: string;
  missingInfoTitle: string;
  missingInfoSubtitle: string;
  compareSourcesTitle: string;
  compareSourcesSubtitle: string;
  collectiveTitle: string;
  collectiveSubtitle: string;
  exportDossierTitle: string;
  exportDossierSubtitle: string;
  newComplaint: string;
  evidenceDossier: string;
  statutoryDeadline: string;
  inspectWhyLawApplies: string;
  statutoryAssessment: string;
  aiAdvisory: string;

  // Convenience Aliases & Extended UI Properties
  notifications?: string;
  signOut?: string;
  statusAll?: string;
  statusActive?: string;
  statusArchived?: string;
  statusSaved?: string;
  statusNeedsReview?: string;
  needGuidance?: string;
  needGuidanceDesc?: string;
  caseStatus?: string;
  statutoryLimitation?: string;
  statutoryLinkage?: string;
  filterMore?: string;
  uploadEvidence?: string;
  totalIdentified?: string;
  collectedVerified?: string;
  filterDossier?: string;
  draftNoticeParameters?: string;
  btnPreviewDocument?: string;
  paramParties?: string;
  paramFactsStatutes?: string;
  paramRequisitions?: string;
  draftPreview?: string;
  btnGenerateRevision?: string;
  btnRejectRevision?: string;
  btnAcceptRevision?: string;
  versionHistory?: string;
  btnExportDossier?: string;
}

export const TRANSLATIONS: Record<SupportedLanguage, TranslationDictionary> = {
  English: {
    brandName: 'Legal Saathi',
    tagline: 'Evidence-Grounded AI Legal Companion for Indian Citizens',
    civicLegalAssistant: 'CIVIC LEGAL ASSISTANT',
    civilJusticeGuidance: 'Civil Justice Guidance',
    selectLanguage: 'Language',
    freeLegalAid: 'Free Legal Aid',
    helplineNalsa: 'NALSA Free Legal Aid 15100',

    navHome: 'Home',
    navMyMatters: 'My Matters',
    navLegalAssistant: 'Legal Assistant',
    navCaseWorkspace: 'Case Workspace',
    navDashboard: 'Dashboard',
    navComplaints: 'My Complaints',
    navSources: 'Statutes & Sources',
    navSimilarCases: 'Similar Precedents',
    navDrafting: 'Legal Notice Drafts',
    navEfir: 'e-FIR Guidance',
    navVoice: 'Voice Assistant',
    myAccount: 'My Account',
    profile: 'Profile',
    settings: 'Settings',
    logout: 'Sign Out',
    login: 'Sign In',
    register: 'Register',

    groupDossier: 'Case Dossier',
    groupLegal: 'Legal Grounding',
    groupActions: 'Remedies & Actions',
    tabOverview: 'Overview',
    tabEvidence: 'Evidence & Documents',
    tabTimeline: 'Case Timeline',
    tabMissingInfo: 'Missing Information',
    tabWhyLawApplies: 'Why Law Applies',
    tabVerification: 'Case Verification',
    tabSources: 'Legal Sources',
    tabCompare: 'Compare Sources',
    tabActions: 'Legal Actions',
    tabCollective: 'Collective Assistance',
    tabExport: 'Export Dossier',
    openAssistant: 'Ask Assistant',
    moreTabs: 'More Sections',

    btnCreateCase: 'New Complaint',
    btnCreateDraft: 'Create Draft',
    btnEdit: 'Edit',
    btnEditFields: 'Edit Fields',
    btnEditManually: 'Edit Manually',
    btnEditWithAi: 'Edit with AI',
    btnSaveDraft: 'Save Draft',
    btnDraftSaved: 'Draft Saved',
    btnSaveNewVersion: 'Save New Version',
    btnRegenerate: 'Regenerate',
    btnPreview: 'Preview Document',
    btnPrintExport: 'Print / PDF',
    btnCopy: 'Copy Text',
    btnDownload: 'Download',
    btnCancel: 'Cancel',
    btnConfirm: 'Confirm',
    btnDelete: 'Delete',
    btnRetry: 'Retry',
    btnSend: 'Send',
    btnRestore: 'Restore',
    btnAccept: 'Accept Revision',
    btnReject: 'Reject Revision',
    btnRefine: 'Refine Instruction',
    btnUploadEvidence: 'Upload New Evidence',
    btnAddDemand: 'Add Demand',
    btnBack: 'Back',
    btnContinue: 'Continue',
    btnClear: 'Clear',
    close: 'Close',

    statusActionRequired: 'Action Required',
    statusVerified: 'Verified • Collected',
    statusMissing: 'Critical Gap Missing',
    statusReviewNeeded: 'Review Needed',
    statusCollected: 'Collected',
    statusConfirmed: 'Confirmed',
    statusSupported: 'Supported',
    statusDisputed: 'Disputed',
    statusDraft: 'Draft',
    statusCompleted: 'Completed',
    statusReady: 'Ready for Action',
    statusUnderReview: 'Under Review',
    statusApplicable: 'Applicable based on verified facts',
    statusPotentiallyApplicable: 'Potentially applicable',
    statusRequiresInfo: 'Requires additional information',

    draftParametersTitle: 'Draft Notice Parameters',
    stepPrepareNotice: 'STEP 1 OF 3: PREPARE NOTICE',
    tabParties: 'Parties & Claims',
    tabMatter: 'Matter Specifics',
    tabFacts: 'Facts & Statute',
    tabDemands: 'Requisitions & Period',
    recipientInfo: 'Recipient (Opposite Party) Information',
    recipientName: 'Recipient Full Name / Entity *',
    designation: 'Designation / Role',
    postalAddress: 'Recipient Postal Address *',
    email: 'Recipient Email / Phone (Optional)',
    senderInfo: 'Sender (Aggrieved Citizen) Information',
    senderName: 'Your Full Legal Name *',
    claimedAmount: 'Claim / Demanded Amount *',
    senderAddress: 'Your Current Correspondence Address *',
    factsSummary: 'Summary of Material Facts (Chronological Statement) *',
    statutoryBasis: 'Statutory Basis & Violations Cited *',
    curePeriod: 'Statutory Cure / Compliance Notice Period (Days) *',
    daysNotice: 'days from receipt of legal notice',
    demandsTitle: 'Specific Formal Demands / Requisitions',

    previewHeader: 'Statutory Demand Notice Preview',
    legalNoticeDisclaimer: 'IMPORTANT LEGAL NOTICE DISCLAIMER: This is a structured draft prepared from the information recorded in your case file for civic guidance. Legal Saathi is an automated AI civic assistant, not a legal practitioner or law firm. Review with an advocate or Legal Aid Authority before formal dispatch via registered post.',
    aiEditorTitle: 'Edit Legal Draft with AI Assistant',
    aiEditorSubtitle: 'Instruct AI in natural language to refine, translate, or adapt your legal notice.',
    aiInstructionLabel: 'What modifications would you like AI to make?',
    aiInstructionPlaceholder: 'e.g. Make this demand notice more formal, add Section 18 RERA interest calculation, or translate to Hindi...',
    quickSuggestions: 'Quick Suggestions:',
    generateRevision: 'Generate Revised Draft',
    applyingRevisions: 'Applying AI Revisions...',
    proposedChangesSummary: 'Summary of Proposed AI Changes:',
    currentDocument: 'Current Document',
    proposedAiRevision: 'Proposed AI Revision',
    acceptSaveVersion: 'Accept & Save as Version',
    versionHistoryTitle: 'Draft Version History',
    versionHistorySubtitle: 'Review and restore previous saved revisions for this matter.',
    versionCurrent: 'CURRENT',

    traceabilityPipeline: 'Traceability Pipeline',
    traceabilitySubtitle: 'Follow how verified facts connect directly to statutory provisions and actionable steps.',
    traceableLinkage: 'Traceable Linkage',
    stepFacts: '1. Facts on Record',
    stepIssue: '2. Legal Issue',
    stepStatute: '3. Relevant Statute',
    stepSource: '4. Verified Source',
    stepAction: '5. Action Recommended',
    whatIUnderstand: 'What I Understand From Available Information',
    identifiedLegalIssue: 'Identified Legal Issue',
    applicableProvision: 'Applicable Statutory Provision',
    statutoryTimeLimit: 'Verified Statutory Time Limit / Limitation:',
    limitationNotice: 'Limitation Notice:',
    whyItApplies: 'Why This Provision Applies',
    supportingFacts: 'Supporting Facts on Record',
    corroboratingEvidence: 'Corroborating Evidence',
    infoStillNeeded: 'Information Still Needed',
    openMissingInfo: 'Open Missing Info Assistant →',
    verifiedSource: 'Verified Source',
    whatYouCanDoNext: 'What You Can Do Next',
    verifiedAction: 'Verified Action',
    actionPendingProof: 'Action Pending Proof',

    askAssistantPlaceholder: 'Ask about this matter or applicable statutes...',
    summarizeCase: 'Summarize matter',
    currentStatus: 'Current status',
    missingItems: 'Missing items',
    latestUpdate: 'Latest update',
    nextLegalSteps: 'Next legal steps',
    applicableLaws: 'Applicable laws',
    send: 'Send',
    disclaimer: 'Guidance grounded in Indian law. Not formal advocate advice.',
    quickInquiries: 'Quick Inquiries:',
    chatAssistantTitle: 'Legal Saathi Assistant',
    chatAssistantSubtitle: 'Case Docket Advisory',
    reviewingCaseLaw: 'Reviewing case law and active facts...',
    clearChat: 'Clear conversation',

    factVerificationTitle: 'Fact Verification & Corroboration',
    factVerificationSubtitle: 'Review key factual statements to confirm they are backed by documentary proof.',
    timelineTitle: 'Case Timeline & Milestone Tracker',
    timelineSubtitle: 'Chronological events and statutory milestones recorded for this matter.',
    evidenceTitle: 'Evidence Dossier & Proof Vault',
    evidenceSubtitle: 'Upload and verify corroborating agreements, transaction slips, and correspondence.',
    missingInfoTitle: 'Missing Information & Evidentiary Gaps',
    missingInfoSubtitle: 'Answering these targeted inquiries will strengthen your legal standing under Indian jurisprudence.',
    compareSourcesTitle: 'Side-by-Side Legal Source Comparison',
    compareSourcesSubtitle: 'Compare obligations, definitions, and penalties across central acts and precedents.',
    collectiveTitle: 'Ekjut Collective Action & Similar Patterns',
    collectiveSubtitle: 'Connect or pool evidence with other citizens facing identical landlords or builders under strict privacy consent.',
    exportDossierTitle: 'Export Case Package & Print Dossier',
    exportDossierSubtitle: 'Export verified records and structured summaries for tribunal presentation or consultation with a DLSA panel advocate.',
    newComplaint: 'New Complaint',
    evidenceDossier: 'Evidence Dossier',
    statutoryDeadline: 'Statutory Deadline',
    inspectWhyLawApplies: 'Inspect Why Law Applies',
    statutoryAssessment: 'Statutory Assessment',
    aiAdvisory: 'Case AI Advisory'
  },

  Hindi: {
    brandName: 'लीगल साथी',
    tagline: 'भारतीय नागरिकों के लिए साक्ष्य-आधारित कानूनी सहायता',
    civicLegalAssistant: 'नागरिक कानूनी सहायक',
    civilJusticeGuidance: 'नागरिक न्याय मार्गदर्शन',
    selectLanguage: 'भाषा चुनें',
    freeLegalAid: 'मुफ्त कानूनी सहायता',
    helplineNalsa: 'नालसा निशुल्क विधिक सहायता 15100',

    navHome: 'मुख्य पृष्ठ',
    navMyMatters: 'मेरे मामले',
    navLegalAssistant: 'कानूनी सहायक',
    navCaseWorkspace: 'केस कार्यक्षेत्र',
    navDashboard: 'डैशबोर्ड',
    navComplaints: 'मेरी शिकायतें',
    navSources: 'कानून एवं धाराएं',
    navSimilarCases: 'समान पूर्व निर्णय',
    navDrafting: 'कानूनी नोटिस प्रारूप',
    navEfir: 'ई-एफआईआर मार्गदर्शन',
    navVoice: 'ध्वनि सहायक',
    myAccount: 'मेरा खाता',
    profile: 'प्रोफ़ाइल',
    settings: 'सेटिंग्स',
    logout: 'लॉग आउट',
    login: 'साइन इन',
    register: 'पंजीकरण करें',

    groupDossier: 'केस दस्तावेज़',
    groupLegal: 'कानूनी आधार',
    groupActions: 'उपचार और कदम',
    tabOverview: 'अवलोकन',
    tabEvidence: 'साक्ष्य एवं दस्तावेज़',
    tabTimeline: 'केस घटनाक्रम',
    tabMissingInfo: 'अधूरी जानकारी',
    tabWhyLawApplies: 'कानून क्यों लागू होता है',
    tabVerification: 'केस सत्यापन',
    tabSources: 'कानूनी स्रोत',
    tabCompare: 'स्रोतों की तुलना',
    tabActions: 'कानूनी कदम',
    tabCollective: 'सामूहिक सहायता',
    tabExport: 'दस्तावेज़ निर्यात',
    openAssistant: 'सहायक से पूछें',
    moreTabs: 'अन्य अनुभाग',

    btnCreateCase: 'नई शिकायत दर्ज करें',
    btnCreateDraft: 'ड्राफ्ट तैयार करें',
    btnEdit: 'संपादित करें',
    btnEditFields: 'विवरण बदलें',
    btnEditManually: 'स्वयं संपादित करें',
    btnEditWithAi: 'एआई द्वारा सुधारें',
    btnSaveDraft: 'ड्राफ्ट सुरक्षित करें',
    btnDraftSaved: 'ड्राफ्ट सुरक्षित हुआ',
    btnSaveNewVersion: 'नया संस्करण सुरक्षित करें',
    btnRegenerate: 'पुनः बनाएं',
    btnPreview: 'दस्तावेज़ पूर्वावलोकन',
    btnPrintExport: 'प्रिंट / पीडीएफ',
    btnCopy: 'प्रतिलिपि बनाएं',
    btnDownload: 'डाउनलोड करें',
    btnCancel: 'रद्द करें',
    btnConfirm: 'पुष्टि करें',
    btnDelete: 'हटाएं',
    btnRetry: 'पुनः प्रयास करें',
    btnSend: 'भेजें',
    btnRestore: 'पुनर्स्थापित करें',
    btnAccept: 'सुधार स्वीकार करें',
    btnReject: 'सुधार अस्वीकार करें',
    btnRefine: 'निर्देश बदलें',
    btnUploadEvidence: 'नया साक्ष्य अपलोड करें',
    btnAddDemand: 'मांग जोड़ें',
    btnBack: 'वापस',
    btnContinue: 'आगे बढ़ें',
    btnClear: 'साफ़ करें',
    close: 'बंद करें',

    statusActionRequired: 'कार्रवाई आवश्यक',
    statusVerified: 'सत्यापित • संकलित',
    statusMissing: 'महत्वपूर्ण जानकारी अनुपलब्ध',
    statusReviewNeeded: 'समीक्षा आवश्यक',
    statusCollected: 'संकलित',
    statusConfirmed: 'पुष्टीकृत',
    statusSupported: 'समर्थित',
    statusDisputed: 'विवादित',
    statusDraft: 'प्रारूप (ड्राफ्ट)',
    statusCompleted: 'पूर्ण',
    statusReady: 'कार्रवाई हेतु तैयार',
    statusUnderReview: 'समीक्षाधीन',
    statusApplicable: 'सत्यापित तथ्यों के आधार पर लागू',
    statusPotentiallyApplicable: 'संभावित रूप से लागू',
    statusRequiresInfo: 'अतिरिक्त जानकारी आवश्यक',

    draftParametersTitle: 'नोटिस प्रारूप विवरण',
    stepPrepareNotice: 'चरण 1: नोटिस तैयार करें',
    tabParties: 'पक्षकार एवं दावे',
    tabMatter: 'विवाद विवरण',
    tabFacts: 'तथ्य एवं धाराएं',
    tabDemands: 'मांगें एवं समय सीमा',
    recipientInfo: 'प्राप्तकर्ता (विपक्षी पक्ष) की जानकारी',
    recipientName: 'प्राप्तकर्ता का नाम / संस्था *',
    designation: 'पद / भूमिका',
    postalAddress: 'डाक का पता *',
    email: 'ईमेल / दूरभाष (वैकल्पिक)',
    senderInfo: 'प्रेषक (पीड़ित नागरिक) की जानकारी',
    senderName: 'आपका पूरा कानूनी नाम *',
    claimedAmount: 'दावा / मांगी गई धनराशि *',
    senderAddress: 'पत्राचार का वर्तमान पता *',
    factsSummary: 'मुख्य तथ्यों का संक्षिप्त विवरण *',
    statutoryBasis: 'कानूनी आधार एवं उल्लंघन की गई धाराएं *',
    curePeriod: 'वैधानिक समाधान अवधि (दिन) *',
    daysNotice: 'नोटिस प्राप्ति के दिन',
    demandsTitle: 'विशिष्ट औपचारिक मांगें',

    previewHeader: 'वैधानिक मांग नोटिस पूर्वावलोकन',
    legalNoticeDisclaimer: 'महत्वपूर्ण कानूनी अस्वीकरण: यह आपके केस फ़ाइल के तथ्यों से तैयार किया गया एक मार्गदर्शन प्रारूप है। लीगल साथी एक स्वचालित सहायक है, वकील या लॉ फ़र्म नहीं। पंजीकृत डाक से भेजने से पहले किसी अधिवक्ता या विधिक सेवा प्राधिकरण से परामर्श अवश्य लें।',
    aiEditorTitle: 'एआई द्वारा कानूनी ड्राफ्ट संपादित करें',
    aiEditorSubtitle: 'अपनी भाषा में निर्देश देकर नोटिस में सुधार, अनुवाद या बदलाव करें।',
    aiInstructionLabel: 'आप एआई से क्या सुधार कराना चाहते हैं?',
    aiInstructionPlaceholder: 'उदा. इस नोटिस को अधिक औपचारिक बनाएं, रेरा धारा 18 के ब्याज का उल्लेख करें, या हिंदी में अनुवाद करें...',
    quickSuggestions: 'त्वरित सुझाव:',
    generateRevision: 'संशोधित ड्राफ्ट तैयार करें',
    applyingRevisions: 'एआई द्वारा संशोधन जारी...',
    proposedChangesSummary: 'प्रस्तावित परिवर्तनों का सारांश:',
    currentDocument: 'वर्तमान दस्तावेज़',
    proposedAiRevision: 'प्रस्तावित एआई संशोधन',
    acceptSaveVersion: 'स्वीकार करें और संस्करण सुरक्षित करें',
    versionHistoryTitle: 'ड्राफ्ट संस्करण इतिहास',
    versionHistorySubtitle: 'इस मामले के पिछले सभी ड्राफ्ट संस्करण देखें और पुनर्स्थापित करें।',
    versionCurrent: 'वर्तमान',

    traceabilityPipeline: 'तथ्य-से-कानून जुड़ाव पाइपलाइन',
    traceabilitySubtitle: 'देखें कि आपके तथ्य सीधे कानूनी धाराओं और कार्रवाई से कैसे जुड़ते हैं।',
    traceableLinkage: 'सत्यापित जुड़ाव',
    stepFacts: '1. दर्ज तथ्य',
    stepIssue: '2. कानूनी मुद्दा',
    stepStatute: '3. संबंधित कानून',
    stepSource: '4. सत्यापित स्रोत',
    stepAction: '5. अनुशंसित कदम',
    whatIUnderstand: 'उपलब्ध जानकारी से मेरी समझ',
    identifiedLegalIssue: 'पहचाना गया कानूनी मुद्दा',
    applicableProvision: 'लागू होने वाली वैधानिक धारा',
    statutoryTimeLimit: 'वैधानिक समय सीमा / परिसीमा:',
    limitationNotice: 'समय सीमा सूचना:',
    whyItApplies: 'यह प्रावधान क्यों लागू होता है',
    supportingFacts: 'अभिलेख में दर्ज सहायक तथ्य',
    corroboratingEvidence: 'पुष्टिकारक साक्ष्य',
    infoStillNeeded: 'अभी आवश्यक अतिरिक्त जानकारी',
    openMissingInfo: 'अधूरी जानकारी सहायक खोलें →',
    verifiedSource: 'सत्यापित कानूनी स्रोत',
    whatYouCanDoNext: 'आगे आप क्या कर सकते हैं',
    verifiedAction: 'सत्यापित कार्रवाई',
    actionPendingProof: 'साक्ष्य हेतु लंबित',

    askAssistantPlaceholder: 'इस मामले या लागू कानूनों के बारे में पूछें...',
    summarizeCase: 'मामले का सारांश दें',
    currentStatus: 'वर्तमान स्थिति',
    missingItems: 'अधूरी वस्तुएं',
    latestUpdate: 'नवीनतम अपडेट',
    nextLegalSteps: 'अगले कानूनी कदम',
    applicableLaws: 'लागू होने वाले कानून',
    send: 'भेजें',
    disclaimer: 'भारतीय कानून पर आधारित मार्गदर्शन। यह कोई औपचारिक न्यायिक सलाह नहीं है।',
    quickInquiries: 'त्वरित प्रश्न:',
    chatAssistantTitle: 'लीगल साथी सहायक',
    chatAssistantSubtitle: 'केस डॉकेट परामर्शदाता',
    reviewingCaseLaw: 'केस कानून और तथ्यों की समीक्षा जारी...',
    clearChat: 'बातचीत साफ़ करें',

    factVerificationTitle: 'तथ्य सत्यापन एवं संपुष्टि',
    factVerificationSubtitle: 'यह जांचें कि आपके मुख्य तथ्य दस्तावेजी साक्ष्यों से प्रमाणित हैं या नहीं।',
    timelineTitle: 'केस घटनाक्रम एवं चरण',
    timelineSubtitle: 'इस मामले के लिए दर्ज की गई तिथियां एवं वैधानिक चरण।',
    evidenceTitle: 'साक्ष्य संग्रह एवं दस्तावेज़',
    evidenceSubtitle: 'करार, बैंक रसीदें और लिखित पत्राचार अपलोड एवं सत्यापित करें।',
    missingInfoTitle: 'अधूरी जानकारी एवं कमियां',
    missingInfoSubtitle: 'इन सवालों के जवाब देकर अपने कानूनी दावे को मजबूत करें।',
    compareSourcesTitle: 'कानूनी स्रोतों की आमने-सामने तुलना',
    compareSourcesSubtitle: 'केंद्रीय अधिनियमों और निर्णयों के बीच दायित्वों और दंडों की तुलना करें।',
    collectiveTitle: 'एकजुट सामूहिक कार्रवाई',
    collectiveSubtitle: 'समान समस्या का सामना कर रहे अन्य नागरिकों के साथ साक्ष्य साझा करें।',
    exportDossierTitle: 'केस फ़ाइल निर्यात एवं प्रिंट',
    exportDossierSubtitle: 'प्राधिकरण या वकील को प्रस्तुत करने हेतु संरचित सारांश तैयार करें।',
    newComplaint: 'नई शिकायत',
    evidenceDossier: 'साक्ष्य संचिका',
    statutoryDeadline: 'वैधानिक समय-सीमा',
    inspectWhyLawApplies: 'कानून की प्रासंगिकता देखें',
    statutoryAssessment: 'वैधानिक मूल्यांकन',
    aiAdvisory: 'एआई परामर्श'
  },

  Marathi: {
    brandName: 'लीगल साथी',
    tagline: 'भारतीय नागरिकांसाठी पुराव्यांवर आधारित कायदेशीर सहाय्यक',
    civicLegalAssistant: 'नागरी कायदेशीर सहाय्यक',
    civilJusticeGuidance: 'नागरी न्याय मार्गदर्शन',
    selectLanguage: 'भाषा निवडा',
    freeLegalAid: 'मोफत कायदेशीर सहाय्य',
    helplineNalsa: 'नालसा विधी सहाय्य 15100',

    navHome: 'मुख्यपृष्ठ',
    navMyMatters: 'माझे खटले',
    navLegalAssistant: 'कायदेशीर सहाय्यक',
    navCaseWorkspace: 'खटला कार्यक्षेत्र',
    navDashboard: 'डॅशबोर्ड',
    navComplaints: 'माझ्या तक्रारी',
    navSources: 'कायदे आणि कलमे',
    navSimilarCases: 'समान निवाडे',
    navDrafting: 'कायदेशीर नोटीस मसुदा',
    navEfir: 'ई-एफआयआर मार्गदर्शन',
    navVoice: 'ध्वनी सहाय्यक',
    myAccount: 'माझे खाते',
    profile: 'प्रोफाइल',
    settings: 'सेटिंग्ज',
    logout: 'साइन आउट',
    login: 'साइन इन',
    register: 'नोंदणी करा',

    groupDossier: 'खटला संचिका',
    groupLegal: 'कायदेशीर आधार',
    groupActions: 'उपाय आणि कृती',
    tabOverview: 'आढावा',
    tabEvidence: 'पुरावे आणि कागदपत्रे',
    tabTimeline: 'घटनाक्रम',
    tabMissingInfo: 'अपूर्ण माहिती',
    tabWhyLawApplies: 'कायदा का लागू होतो',
    tabVerification: 'खटला पडताळणी',
    tabSources: 'कायदेशीर स्रोत',
    tabCompare: 'स्रोतांची तुलना',
    tabActions: 'कायदेशीर कृती',
    tabCollective: 'सामूहिक सहाय्य',
    tabExport: 'दस्तऐवज निर्यात',
    openAssistant: 'सहाय्यकाला विचारा',
    moreTabs: 'अधिक विभाग',

    btnCreateCase: 'नवीन तक्रार नोंदवा',
    btnCreateDraft: 'मसुदा तयार करा',
    btnEdit: 'संपादित करा',
    btnEditFields: 'तपशील बदला',
    btnEditManually: 'स्वतः संपादित करा',
    btnEditWithAi: 'एआय द्वारे सुधारा',
    btnSaveDraft: 'मसुदा जतन करा',
    btnDraftSaved: 'मसुदा जतन झाला',
    btnSaveNewVersion: 'नवीन आवृत्ती जतन करा',
    btnRegenerate: 'पुन्हा तयार करा',
    btnPreview: 'दस्तऐवज पूर्वावलोकन',
    btnPrintExport: 'प्रिंट / पीडीएफ',
    btnCopy: 'मजकूर कॉपी करा',
    btnDownload: 'डाउनलोड करा',
    btnCancel: 'रद्द करा',
    btnConfirm: 'निश्चित करा',
    btnDelete: 'हटवा',
    btnRetry: 'पुन्हा प्रयत्न करा',
    btnSend: 'पाठवा',
    btnRestore: 'पुनर्संचयित करा',
    btnAccept: 'बदल स्वीकारा',
    btnReject: 'बदल नाकारा',
    btnRefine: 'सूचना सुधारा',
    btnUploadEvidence: 'नवीन पुरावा जोडा',
    btnAddDemand: 'मागणी जोडा',
    btnBack: 'मागे',
    btnContinue: 'पुढे चला',
    btnClear: 'साफ करा',
    close: 'बंद करा',

    statusActionRequired: 'कृती आवश्यक',
    statusVerified: 'पडताळणी पूर्ण',
    statusMissing: 'महत्त्वाची माहिती बाकी',
    statusReviewNeeded: 'पुनरावलोकन आवश्यक',
    statusCollected: 'संकलित',
    statusConfirmed: 'पुष्टी झाली',
    statusSupported: 'समर्थित',
    statusDisputed: 'वादग्रस्त',
    statusDraft: 'मसुदा',
    statusCompleted: 'पूर्ण झाले',
    statusReady: 'कृतीसाठी सज्ज',
    statusUnderReview: 'पुनरावलोकनाधीन',
    statusApplicable: 'तथ्यांवर आधारित लागू',
    statusPotentiallyApplicable: 'संभाव्य लागू',
    statusRequiresInfo: 'अधिक माहिती हवी',

    draftParametersTitle: 'नोटीस मसुदा तपशील',
    stepPrepareNotice: 'पायरी १: नोटीस तयार करा',
    tabParties: 'पक्षकार आणि दावे',
    tabMatter: 'वाद तपशील',
    tabFacts: 'तथ्ये आणि कलमे',
    tabDemands: 'मागण्या आणि मुदत',
    recipientInfo: 'प्रतिवादी माहिती',
    recipientName: 'प्रतिवादीचे पूर्ण नाव *',
    designation: 'पद / भूमिका',
    postalAddress: 'टपाल पत्ता *',
    email: 'ईमेल / फोन (पर्यायी)',
    senderInfo: 'अर्जदार माहिती',
    senderName: 'आपले पूर्ण कायदेशीर नाव *',
    claimedAmount: 'दावा / मागितलेली रक्कम *',
    senderAddress: 'सध्याचा पत्रव्यवहार पत्ता *',
    factsSummary: 'तथ्यांचा थोडक्यात सारांश *',
    statutoryBasis: 'कायदेशीर तरतुदी आणि उल्लंघन *',
    curePeriod: 'कायदेशीर मुदत (दिवस) *',
    daysNotice: 'नोटीस मिळाल्यापासून दिवस',
    demandsTitle: 'औपचारिक मागण्या',

    previewHeader: 'मागणी नोटीस पूर्वावलोकन',
    legalNoticeDisclaimer: 'महत्त्वाची सूचना: हा मसुदा नागरी मार्गदर्शनासाठी तयार केला आहे. लीगल साथी ही वकील किंवा लॉ फर्म नाही. औपचारिक पाठवण्यापूर्वी वकिलाचा सल्ला घ्या.',
    aiEditorTitle: 'एआय द्वारे मसुदा सुधारा',
    aiEditorSubtitle: 'आपल्या शब्दांत सांगून नोटीस अधिक अचूक बनवा.',
    aiInstructionLabel: 'आपल्याला काय बदल करायचे आहेत?',
    aiInstructionPlaceholder: 'उदा. अधिक औपचारिक बनवा किंवा मराठीत भाषांतर करा...',
    quickSuggestions: 'सुचवलेले पर्याय:',
    generateRevision: 'सुधारित मसुदा बनवा',
    applyingRevisions: 'बदल होत आहेत...',
    proposedChangesSummary: 'बदलांचा सारांश:',
    currentDocument: 'सध्याचा दस्तऐवज',
    proposedAiRevision: 'प्रस्तावित एआय मसुदा',
    acceptSaveVersion: 'स्वीकारा आणि आवृत्ती जतन करा',
    versionHistoryTitle: 'मसुदा इतिहास',
    versionHistorySubtitle: 'मागील सर्व जतन केलेल्या आवृत्त्या तपासा.',
    versionCurrent: 'सध्याची आवृत्ती',

    traceabilityPipeline: 'तथ्य ते कायदा संबंध',
    traceabilitySubtitle: 'पुरावे कायद्याच्या कलमांशी कसे जोडलेले आहेत ते पहा.',
    traceableLinkage: 'कायदेशीर दुवा',
    stepFacts: '१. नोंदवलेली तथ्ये',
    stepIssue: '२. कायदेशीर मुद्दा',
    stepStatute: '३. संबंधित कायदा',
    stepSource: '४. पडताळलेला स्रोत',
    stepAction: '५. शिफारस केलेली कृती',
    whatIUnderstand: 'माहितीवरून समजलेला सारांश',
    identifiedLegalIssue: 'कायदेशीर अडचण',
    applicableProvision: 'लागू होणारे कलम',
    statutoryTimeLimit: 'कायदेशीर मुदत:',
    limitationNotice: 'मुदत सूचना:',
    whyItApplies: 'हा नियम का लागू होतो',
    supportingFacts: 'पुष्टी देणारी तथ्ये',
    corroboratingEvidence: 'जोडलेले पुरावे',
    infoStillNeeded: 'अजून आवश्यक माहिती',
    openMissingInfo: 'माहिती सहाय्यक उघडा →',
    verifiedSource: 'पडताळलेला स्रोत',
    whatYouCanDoNext: 'पुढील पावले',
    verifiedAction: 'निश्चित कृती',
    actionPendingProof: 'पुराव्यांची प्रतीक्षा',

    askAssistantPlaceholder: 'कायद्याबद्दल काहीही विचारा...',
    summarizeCase: 'खटल्याचा सारांश सांगा',
    currentStatus: 'सद्यस्थिती',
    missingItems: 'अपूर्ण गोष्टी',
    latestUpdate: 'नवीनतम माहिती',
    nextLegalSteps: 'पुढील कायदेशीर पावले',
    applicableLaws: 'लागू असलेले कायदे',
    send: 'पाठवा',
    disclaimer: 'भारतीय कायद्यावर आधारित मार्गदर्शन. कायदेशीर सल्ला नाही.',
    quickInquiries: 'त्वरित प्रश्न:',
    chatAssistantTitle: 'लीगल साथी सहाय्यक',
    chatAssistantSubtitle: 'कायदेशीर सल्लागार',
    reviewingCaseLaw: 'तथ्ये तपासली जात आहेत...',
    clearChat: 'संभाषण साफ करा',

    factVerificationTitle: 'तथ्य पडताळणी',
    factVerificationSubtitle: 'आपल्या विधानांना कागदपत्रांचा आधार आहे का ते तपासा.',
    timelineTitle: 'खटल्याचा घटनाक्रम',
    timelineSubtitle: 'तारीखवार घडलेल्या घटना.',
    evidenceTitle: 'पुरावे दालन',
    evidenceSubtitle: 'पावत्या आणि करार अपलोड करा.',
    missingInfoTitle: 'अपूर्ण माहिती',
    missingInfoSubtitle: 'ही उत्तरे दिल्यास आपली बाजू बळकट होईल.',
    compareSourcesTitle: 'कायद्यांची तुलना',
    compareSourcesSubtitle: 'विविध कलमांची तुलना करा.',
    collectiveTitle: 'एकजूट सामूहिक मंच',
    collectiveSubtitle: 'इतर नागरिकांसोबत पुरावे एकत्र करा.',
    exportDossierTitle: 'दस्तऐवज निर्यात करा',
    exportDossierSubtitle: 'न्यायालयात सादर करण्यासाठी फाइल तयार करा.',
    newComplaint: 'नवीन तक्रार',
    evidenceDossier: 'पुरावा संचिका',
    statutoryDeadline: 'कायदेशीर अंतिम मुदत',
    inspectWhyLawApplies: 'कायदा कसा लागू होतो ते पहा',
    statutoryAssessment: 'वैधानिक मूल्यांकन',
    aiAdvisory: 'एआय सल्ला'
  },

  Tamil: {
    brandName: 'லீகல் சாத்தி',
    tagline: 'இந்திய குடிமக்களுக்கான ஆதார அடிப்படையிலான சட்ட உதவியாளர்',
    civicLegalAssistant: 'குடிமக்கள் சட்ட உதவியாளர்',
    civilJusticeGuidance: 'குடிமையியல் நீதி வழிகாட்டுதல்',
    selectLanguage: 'மொழி தேர்வு',
    freeLegalAid: 'இலவச சட்ட உதவி',
    helplineNalsa: 'நல்சா இலவச சட்ட உதவி 15100',

    navHome: 'முகப்பு',
    navMyMatters: 'என் வழக்குகள்',
    navLegalAssistant: 'சட்ட உதவியாளர்',
    navCaseWorkspace: 'வழக்கு பணிமனை',
    navDashboard: 'டாஷ்போர்டு',
    navComplaints: 'என் புகார்கள்',
    navSources: 'சட்டங்கள் மற்றும் பிரிவுகள்',
    navSimilarCases: 'ஒத்த முந்தைய தீர்ப்புகள்',
    navDrafting: 'சட்ட நோட்டீஸ் வரைவு',
    navEfir: 'இ-எப்ஐஆர் வழிகாட்டல்',
    navVoice: 'குரல் உதவியாளர்',
    myAccount: 'என் கணக்கு',
    profile: 'சுயவிவரம்',
    settings: 'அமைப்புகள்',
    logout: 'வெளியேறு',
    login: 'உள்நுழைய',
    register: 'பதிவு செய்க',

    groupDossier: 'வழக்கு ஆவணங்கள்',
    groupLegal: 'சட்ட அடிப்படை',
    groupActions: 'சட்ட நடவடிக்கைகள்',
    tabOverview: 'கண்ணோட்டம்',
    tabEvidence: 'சான்றுகள் & ஆவணங்கள்',
    tabTimeline: 'காலவரிசை',
    tabMissingInfo: 'விடுபட்ட தகவல்கள்',
    tabWhyLawApplies: 'சட்டம் ஏன் பொருந்தும்',
    tabVerification: 'வழக்கு சரிபார்ப்பு',
    tabSources: 'சட்ட ஆதாரங்கள்',
    tabCompare: 'ஆதாரங்கள் ஒப்பீடு',
    tabActions: 'சட்ட நடவடிக்கைகள்',
    tabCollective: 'கூட்டு உதவி',
    tabExport: 'கோப்பு ஏற்றுமதி',
    openAssistant: 'உதவியாளரிடம் கேட்க',
    moreTabs: 'கூடுதல் பிரிவுகள்',

    btnCreateCase: 'புதிய புகார்',
    btnCreateDraft: 'வரைவு உருவாக்கு',
    btnEdit: 'திருத்து',
    btnEditFields: 'விவரங்களை திருத்து',
    btnEditManually: 'நேரடியாக திருத்து',
    btnEditWithAi: 'ஏஐ மூலம் திருத்து',
    btnSaveDraft: 'சேமிக்க',
    btnDraftSaved: 'சேமிக்கப்பட்டது',
    btnSaveNewVersion: 'புதிய பதிப்பாக சேமி',
    btnRegenerate: 'மீண்டும் உருவாக்கு',
    btnPreview: 'முன்னோட்டம்',
    btnPrintExport: 'அச்சிடு / பிடிஎஃப்',
    btnCopy: 'நகலெடு',
    btnDownload: 'பதிவிறக்கு',
    btnCancel: 'ரத்து',
    btnConfirm: 'உறுதி செய்',
    btnDelete: 'நீக்கு',
    btnRetry: 'மீண்டும் முயற்சி',
    btnSend: 'அனுப்பு',
    btnRestore: 'மீட்டெடு',
    btnAccept: 'ஏற்றுக்கொள்',
    btnReject: 'நிராகரி',
    btnRefine: 'வழிமுறையை மாற்று',
    btnUploadEvidence: 'சான்றை பதிவேற்று',
    btnAddDemand: 'கோரிக்கையை சேர்',
    btnBack: 'பின்செல்',
    btnContinue: 'தொடர்க',
    btnClear: 'அழி',
    close: 'மூடு',

    statusActionRequired: 'நடவடிக்கை தேவை',
    statusVerified: 'சரிபார்க்கப்பட்டது',
    statusMissing: 'முக்கிய தகவல் விடுபட்டுள்ளது',
    statusReviewNeeded: 'மறுபரிசீலனை தேவை',
    statusCollected: 'சேகரிக்கப்பட்டது',
    statusConfirmed: 'உறுதியானது',
    statusSupported: 'ஆதரிக்கப்பட்டது',
    statusDisputed: 'சர்ச்சைக்குரியது',
    statusDraft: 'வரைவு',
    statusCompleted: 'முடிந்தது',
    statusReady: 'தயாராக உள்ளது',
    statusUnderReview: 'பரிசீலனையில் உள்ளது',
    statusApplicable: 'உண்மைகளின் அடிப்படையில் பொருந்தும்',
    statusPotentiallyApplicable: 'பொருந்த வாய்ப்புள்ளது',
    statusRequiresInfo: 'கூடுதல் தகவல் தேவை',

    draftParametersTitle: 'நோட்டீஸ் வரைவு விவரங்கள்',
    stepPrepareNotice: 'படி 1: நோட்டீஸ் தயார் செய்க',
    tabParties: 'தரப்பினர் & கோரிக்கைகள்',
    tabMatter: 'வழக்கு விவரங்கள்',
    tabFacts: 'உண்மைகள் & சட்டங்கள்',
    tabDemands: 'கோரிக்கைகள் & காலக்கெடு',
    recipientInfo: 'பெறுநர் விவரங்கள்',
    recipientName: 'பெறுநர் பெயர் / நிறுவனம் *',
    designation: 'பதவி / பொறுப்பு',
    postalAddress: 'அஞ்சல் முகவரி *',
    email: 'மின்னஞ்சல் / தொலைபேசி',
    senderInfo: 'அனுப்புநர் விவரங்கள்',
    senderName: 'உங்கள் முழு சட்டப்பூர்வ பெயர் *',
    claimedAmount: 'கோரப்படும் தொகை *',
    senderAddress: 'தற்போதைய முகவரி *',
    factsSummary: 'முக்கிய உண்மைகள் சுருக்கம் *',
    statutoryBasis: 'சட்டப்பிரிவுகள் & மீறல்கள் *',
    curePeriod: 'பதிலளிக்க கால அவகாசம் (நாட்கள்) *',
    daysNotice: 'நோட்டீஸ் கிடைத்ததிலிருந்து நாட்கள்',
    demandsTitle: 'முறையான கோரிக்கைகள்',

    previewHeader: 'சட்ட நோட்டீஸ் முன்னோட்டம்',
    legalNoticeDisclaimer: 'முக்கிய சட்ட மறுப்பு: இது குடிமக்கள் வழிகாட்டலுக்கான ஒரு மாதிரி வரைவு மட்டுமே. லீகல் சாத்தி ஒரு வழக்கறிஞர் அல்ல. தபால் மூலம் அனுப்புவதற்கு முன் வழக்கறிஞரை அணுகவும்.',
    aiEditorTitle: 'ஏஐ சட்ட வரைவு திருத்துதல்',
    aiEditorSubtitle: 'உங்கள் சொந்த மொழியில் கட்டளையிட்டு நோட்டீஸை மேம்படுத்துங்கள்.',
    aiInstructionLabel: 'என்ன திருத்தங்கள் செய்ய வேண்டும்?',
    aiInstructionPlaceholder: 'எ.கா: நோட்டீஸை இன்னும் அதிகாரப்பூர்வமாக மாற்றவும், அல்லது தமிழில் மொழிபெயர்க்கவும்...',
    quickSuggestions: 'பரிந்துரைகள்:',
    generateRevision: 'திருத்தப்பட்ட வரைவை உருவாக்கு',
    applyingRevisions: 'திருத்தங்கள் செய்யப்படுகின்றன...',
    proposedChangesSummary: 'மாற்றங்களின் சுருக்கம்:',
    currentDocument: 'தற்போதைய ஆவணம்',
    proposedAiRevision: 'பரிந்துரைக்கப்பட்ட வரைவு',
    acceptSaveVersion: 'ஏற்று புதிய பதிப்பாக சேமிக்க',
    versionHistoryTitle: 'வரைவு பதிப்பு வரலாறு',
    versionHistorySubtitle: 'முந்தைய பதிப்புகளை சரிபார்த்து மீட்டெடுக்கவும்.',
    versionCurrent: 'தற்போதையது',

    traceabilityPipeline: 'உண்மை-சட்ட இணைப்பு',
    traceabilitySubtitle: 'உங்கள் வழக்கு உண்மைகள் எவ்வாறு சட்டத்துடன் இணைகின்றன என்பதைப் பாருங்கள்.',
    traceableLinkage: 'சட்டப்பூர்வ இணைப்பு',
    stepFacts: '1. பதிவான உண்மைகள்',
    stepIssue: '2. சட்ட சிக்கல்',
    stepStatute: '3. பொருந்தும் சட்டம்',
    stepSource: '4. சரிபார்க்கப்பட்ட ஆதாரம்',
    stepAction: '5. பரிந்துரைக்கப்பட்ட செயல்',
    whatIUnderstand: 'வழக்கைப் பற்றிய சுருக்கம்',
    identifiedLegalIssue: 'கண்டறியப்பட்ட சட்ட சிக்கல்',
    applicableProvision: 'பொருந்தும் சட்டப்பிரிவு',
    statutoryTimeLimit: 'சட்ட காலக்கெடு:',
    limitationNotice: 'காலக்கெடு அறிவிப்பு:',
    whyItApplies: 'இந்த சட்டம் ஏன் பொருந்தும்',
    supportingFacts: 'ஆதார உண்மைகள்',
    corroboratingEvidence: 'உறுதிப்படுத்தும் சான்றுகள்',
    infoStillNeeded: 'இன்னும் தேவையான தகவல்கள்',
    openMissingInfo: 'விடுபட்ட தகவல் உதவியாளரை திறக்க →',
    verifiedSource: 'சரிபார்க்கப்பட்ட ஆதாரம்',
    whatYouCanDoNext: 'அடுத்த கட்ட நடவடிக்கைகள்',
    verifiedAction: 'உறுதிசெய்யப்பட்ட நடவடிக்கை',
    actionPendingProof: 'சான்று நிலுவையில் உள்ளது',

    askAssistantPlaceholder: 'சட்டம் குறித்து எதையும் கேளுங்கள்...',
    summarizeCase: 'வழக்கை சுருக்கமாக கூறு',
    currentStatus: 'தற்போதைய நிலை',
    missingItems: 'விடுபட்டவை',
    latestUpdate: 'சமீபத்திய தகவல்',
    nextLegalSteps: 'அடுத்த சட்ட நடவடிக்கைகள்',
    applicableLaws: 'பொருந்தும் சட்டங்கள்',
    send: 'அனுப்பு',
    disclaimer: 'இந்திய சட்ட வழிகாட்டுதல். இது வழக்கறிஞர் ஆலோசனை அல்ல.',
    quickInquiries: 'விரைவு வினாக்கள்:',
    chatAssistantTitle: 'லீகல் சாத்தி உதவியாளர்',
    chatAssistantSubtitle: 'வழக்கு ஆலோசகர்',
    reviewingCaseLaw: 'சட்டங்கள் சரிபார்க்கப்படுகின்றன...',
    clearChat: 'உரையாடலை அழி',

    factVerificationTitle: 'உண்மை சரிபார்ப்பு',
    factVerificationSubtitle: 'உங்கள் தகவல்களுக்கு ஆவண சான்றுகள் உள்ளனவா என்பதை உறுதிப்படுத்துங்கள்.',
    timelineTitle: 'வழக்கு காலவரிசை',
    timelineSubtitle: 'வழக்கில் நிகழ்ந்த முக்கிய சம்பவங்கள்.',
    evidenceTitle: 'சான்றுகள் பெட்டகம்',
    evidenceSubtitle: 'ஒப்பந்தங்கள் மற்றும் ரசீதுகளை பதிவேற்றவும்.',
    missingInfoTitle: 'விடுபட்ட தகவல்கள்',
    missingInfoSubtitle: 'இதற்கு பதிலளிப்பது உங்கள் வழக்கை வலுப்படுத்தும்.',
    compareSourcesTitle: 'சட்ட ஒப்பீடு',
    compareSourcesSubtitle: 'பல்வேறு சட்டங்களை ஒப்பிட்டுப் பாருங்கள்.',
    collectiveTitle: 'கூட்டு நடவடிக்கை',
    collectiveSubtitle: 'பாதிக்கப்பட்ட பிற குடிமக்களுடன் இணையுங்கள்.',
    exportDossierTitle: 'கோப்பை ஏற்றுமதி செய்',
    exportDossierSubtitle: 'நீதிமன்றத்தில் தாக்கல் செய்ய கோப்பை தயார் செய்க.',
    newComplaint: 'புதிய புகார்',
    evidenceDossier: 'சான்று கோப்பு',
    statutoryDeadline: 'சட்டப்பூர்வ காலக்கெடு',
    inspectWhyLawApplies: 'சட்டம் ஏன் பொருந்தும் என பார்க்க',
    statutoryAssessment: 'சட்டப்பூர்வ மதிப்பீடு',
    aiAdvisory: 'ஏஐ சட்ட ஆலோசனை'
  },

  Bengali: {
    brandName: 'লিগ্যাল সাথী',
    tagline: 'ভারতীয় নাগরিকদের জন্য তথ্য-ভিত্তিক আইনি সহায়ক',
    civicLegalAssistant: 'নাগরিক আইনি সহায়ক',
    civilJusticeGuidance: 'দেওয়ানি বিচার নির্দেশিকা',
    selectLanguage: 'ভাষা নির্বাচন করুন',
    freeLegalAid: 'বিনামূল্যে আইনি সহায়তা',
    helplineNalsa: 'নালসা আইনি সহায়তা ১৫১০০',

    navHome: 'হোম',
    navMyMatters: 'আমার মামলাসমূহ',
    navLegalAssistant: 'আইনি সহায়ক',
    navCaseWorkspace: 'মামলা কর্মক্ষেত্র',
    navDashboard: 'ড্যাশবোর্ড',
    navComplaints: 'আমার অভিযোগ',
    navSources: 'আইন ও ধারাসমূহ',
    navSimilarCases: 'অনুরূপ নজির',
    navDrafting: 'নোটিশের খসড়া',
    navEfir: 'ই-এফআইআর গাইড',
    navVoice: 'ভয়েস সহকারী',
    myAccount: 'আমার অ্যাকাউন্ট',
    profile: 'প্রোফাইল',
    settings: 'সেটিংস',
    logout: 'সাইন আউট',
    login: 'সাইন ইন',
    register: 'নিবন্ধন করুন',

    groupDossier: 'মামলার নথি',
    groupLegal: 'আইনি ভিত্তি',
    groupActions: 'প্রতিকার ও পদক্ষেপ',
    tabOverview: 'সংক্ষিপ্ত বিবরণ',
    tabEvidence: 'প্রমাণ ও নথিপত্র',
    tabTimeline: 'ঘটনাক্রম',
    tabMissingInfo: 'অনুপস্থিত তথ্য',
    tabWhyLawApplies: 'আইন কেন প্রযোজ্য',
    tabVerification: 'মামলা যাচাইকরণ',
    tabSources: 'আইনি উৎস',
    tabCompare: 'উৎস তুলনা',
    tabActions: 'আইনি পদক্ষেপ',
    tabCollective: 'যৌথ সহায়তা',
    tabExport: 'নথি রপ্তানি',
    openAssistant: 'সহায়কের কাছে জিজ্ঞাসা করুন',
    moreTabs: 'আরও বিভাগ',

    btnCreateCase: 'নতুন অভিযোগ',
    btnCreateDraft: 'খসড়া তৈরি করুন',
    btnEdit: 'সম্পাদনা',
    btnEditFields: 'বিবরণ পরিবর্তন করুন',
    btnEditManually: 'হাতে সম্পাদনা করুন',
    btnEditWithAi: 'এআই দিয়ে সংশোধন করুন',
    btnSaveDraft: 'সংরক্ষণ করুন',
    btnDraftSaved: 'সংরক্ষিত হয়েছে',
    btnSaveNewVersion: 'নতুন সংস্করণ সংরক্ষণ করুন',
    btnRegenerate: 'পুনরায় তৈরি করুন',
    btnPreview: 'পূর্বরূপ দেখুন',
    btnPrintExport: 'প্রিন্ট / পিডিএফ',
    btnCopy: 'কপি করুন',
    btnDownload: 'ডাউনলোড',
    btnCancel: 'বাতিল',
    btnConfirm: 'নিশ্চিত করুন',
    btnDelete: 'মুছে ফেলুন',
    btnRetry: 'পুনরায় চেষ্টা করুন',
    btnSend: 'পাঠান',
    btnRestore: 'পুনরুদ্ধার করুন',
    btnAccept: 'সংশোধন গ্রহণ করুন',
    btnReject: 'প্রত্যাখ্যান করুন',
    btnRefine: 'নির্দেশনা সংশোধন করুন',
    btnUploadEvidence: 'নতুন প্রমাণ আপলোড করুন',
    btnAddDemand: 'দাবি যোগ করুন',
    btnBack: 'ফিরে যান',
    btnContinue: 'চালিয়ে যান',
    btnClear: 'পরিষ্কার করুন',
    close: 'বন্ধ করুন',

    statusActionRequired: 'পদক্ষেপ প্রয়োজন',
    statusVerified: 'যাচাইকৃত',
    statusMissing: 'গুরুত্বপূর্ণ তথ্যের অভাব',
    statusReviewNeeded: 'পর্যালোচনা প্রয়োজন',
    statusCollected: 'সংগৃহীত',
    statusConfirmed: 'নিশ্চিতকৃত',
    statusSupported: 'সমর্থিত',
    statusDisputed: 'বিতর্কিত',
    statusDraft: 'খসড়া',
    statusCompleted: 'সম্পূর্ণ',
    statusReady: 'পদক্ষেপের জন্য প্রস্তুত',
    statusUnderReview: 'বিবেচনাধীন',
    statusApplicable: 'সত্যতার ভিত্তিতে প্রযোজ্য',
    statusPotentiallyApplicable: 'সম্ভাব্য প্রযোজ্য',
    statusRequiresInfo: 'অতিরিক্ত তথ্য প্রয়োজন',

    draftParametersTitle: 'নোটিশের খসড়া বিবরণ',
    stepPrepareNotice: 'ধাপ ১: নোটিশ প্রস্তুত করুন',
    tabParties: 'পক্ষ ও দাবিসমূহ',
    tabMatter: 'বিরোধের বিবরণ',
    tabFacts: 'ঘটনা ও আইন',
    tabDemands: 'দাবি ও সময়সীমা',
    recipientInfo: 'প্রাপকের বিবরণ',
    recipientName: 'প্রাপকের নাম / সংস্থা *',
    designation: 'পদবী / ভূমিকা',
    postalAddress: 'ডাক ঠিকানা *',
    email: 'ইমেইল / ফোন (ঐচ্ছিক)',
    senderInfo: 'প্রেরকের বিবরণ',
    senderName: 'আপনার পূর্ণ নাম *',
    claimedAmount: 'দাবিকৃত অর্থ *',
    senderAddress: 'বর্তমান ঠিকানা *',
    factsSummary: 'মূল ঘটনার সারাংশ *',
    statutoryBasis: 'আইনি ভিত্তি ও লঙ্ঘিত ধারা *',
    curePeriod: 'আইনি সময়সীমা (দিন) *',
    daysNotice: 'নোটিশ প্রাপ্তির পর দিন',
    demandsTitle: 'নির্দিষ্ট দাবিসমূহ',

    previewHeader: 'দাবি নোটিশের পূর্বরূপ',
    legalNoticeDisclaimer: 'আইনি অস্বীকৃতি: এটি নাগরিক নির্দেশিকার জন্য প্রস্তুতকৃত একটি খসড়া। লিগ্যাল সাথী কোনো আইনজীবী বা ল ফার্ম নয়। নিবন্ধিত ডাকযোগে পাঠানোর আগে আইনজীবীর পরামর্শ নিন।',
    aiEditorTitle: 'এআই দিয়ে খসড়া সম্পাদনা',
    aiEditorSubtitle: 'সহজ ভাষায় নির্দেশ দিয়ে নোটিশটি সংশোধন করুন।',
    aiInstructionLabel: 'আপনি কী পরিবর্তন করতে চান?',
    aiInstructionPlaceholder: 'উদা: নোটিশটি আরও আনুষ্ঠানিক করুন বা বাংলায় অনুবাদ করুন...',
    quickSuggestions: 'পরামর্শ:',
    generateRevision: 'সংশোধিত খসড়া তৈরি করুন',
    applyingRevisions: 'সংশোধন করা হচ্ছে...',
    proposedChangesSummary: 'প্রস্তাবিত পরিবর্তনের সারাংশ:',
    currentDocument: 'বর্তমান নথি',
    proposedAiRevision: 'প্রস্তাবিত এআই খসড়া',
    acceptSaveVersion: 'গ্রহণ করে সংরক্ষণ করুন',
    versionHistoryTitle: 'খসড়া সংস্করণের ইতিহাস',
    versionHistorySubtitle: 'পূর্ববর্তী সংস্করণগুলি দেখুন এবং পুনরুদ্ধার করুন।',
    versionCurrent: 'বর্তমান সংস্করণ',

    traceabilityPipeline: 'ঘটনা থেকে আইন সংযোগ',
    traceabilitySubtitle: 'আপনার ঘটনা আইনের সাথে কীভাবে সম্পর্কিত তা দেখুন।',
    traceableLinkage: 'আইনি যোগসূত্র',
    stepFacts: '১. নথিবদ্ধ ঘটনা',
    stepIssue: '২. আইনি বিষয়',
    stepStatute: '৩. সংশ্লিষ্ট আইন',
    stepSource: '৪. যাচাইকৃত উৎস',
    stepAction: '৫. প্রস্তাবিত পদক্ষেপ',
    whatIUnderstand: 'ঘটনার প্রাথমিক সারাংশ',
    identifiedLegalIssue: 'চিহ্নিত আইনি সমস্যা',
    applicableProvision: 'প্রযোজ্য ধারা',
    statutoryTimeLimit: 'আইনি সময়সীমা:',
    limitationNotice: 'সময়সীমার বিজ্ঞপ্তি:',
    whyItApplies: 'এই আইন কেন প্রযোজ্য',
    supportingFacts: 'সমর্থক ঘটনাবলী',
    corroboratingEvidence: 'প্রমাণিত নথিপত্র',
    infoStillNeeded: 'আরও প্রয়োজনীয় তথ্য',
    openMissingInfo: 'তথ্য সহায়ক খুলুন →',
    verifiedSource: 'যাচাইকৃত উৎস',
    whatYouCanDoNext: 'পরবর্তী পদক্ষেপ',
    verifiedAction: 'যাচাইকৃত পদক্ষেপ',
    actionPendingProof: 'প্রমাণের অপেক্ষায়',

    askAssistantPlaceholder: 'আইন সম্পর্কে যেকোনো প্রশ্ন করুন...',
    summarizeCase: 'মামলার সারসংক্ষেপ দিন',
    currentStatus: 'বর্তমান অবস্থা',
    missingItems: 'অনুপস্থিত নথিপত্র',
    latestUpdate: 'সর্বশেষ তথ্য',
    nextLegalSteps: 'পরবর্তী আইনি পদক্ষেপ',
    applicableLaws: 'প্রযোজ্য আইনসমূহ',
    send: 'পাঠান',
    disclaimer: 'ভারতীয় আইনের উপর ভিত্তি করে দিকনির্দেশনা। আনুষ্ঠানিক আইনি পরামর্শ নয়।',
    quickInquiries: 'দ্রুত প্রশ্ন:',
    chatAssistantTitle: 'লিগ্যাল সাথী সহায়ক',
    chatAssistantSubtitle: 'মামলার উপদেষ্টা',
    reviewingCaseLaw: 'আইন পর্যালোচনা করা হচ্ছে...',
    clearChat: 'কথোপকথন মুছুন',

    factVerificationTitle: 'তথ্য যাচাইকরণ',
    factVerificationSubtitle: 'আপনার বক্তব্য প্রমাণের দ্বারা সমর্থিত কিনা যাচাই করুন।',
    timelineTitle: 'মামলার ঘটনাক্রম',
    timelineSubtitle: 'মামলার গুরুত্বপূর্ণ তারিখসমূহ।',
    evidenceTitle: 'প্রমাণাগার',
    evidenceSubtitle: 'রসিদ ও চুক্তি আপলোড করুন।',
    missingInfoTitle: 'ঘাটতি তথ্য',
    missingInfoSubtitle: 'এই উত্তরগুলি আপনার দাবিকে শক্তিশালী করবে।',
    compareSourcesTitle: 'আইন তুলনা',
    compareSourcesSubtitle: 'ধারা এবং শাস্তির তুলনা করুন।',
    collectiveTitle: 'একজোট যৌথ পদক্ষেপ',
    collectiveSubtitle: 'একই সমস্যায় ক্ষতিগ্রস্তদের সাথে যুক্ত হন।',
    exportDossierTitle: 'নথি রপ্তানি করুন',
    exportDossierSubtitle: 'আইনজীবী বা আদালতে জমা দেওয়ার ফাইল প্রস্তুত করুন।',
    newComplaint: 'নতুন অভিযোগ',
    evidenceDossier: 'প্রমাণ ডসিয়ার',
    statutoryDeadline: 'আইনি সময়সীমা',
    inspectWhyLawApplies: 'আইন কেন প্রযোজ্য দেখুন',
    statutoryAssessment: 'আইনি মূল্যায়ন',
    aiAdvisory: 'এআই আইনি পরামর্শ'
  },

  Telugu: {
    brandName: 'లీగల్ సాథీ',
    tagline: 'భారతీయ పౌరుల కోసం సాక్ష్యాధారిత చట్టపరమైన సహాయకుడు',
    civicLegalAssistant: 'పౌర చట్టపరమైన సహాయకుడు',
    civilJusticeGuidance: 'పౌర న్యాయ మార్గదర్శకత్వం',
    selectLanguage: 'భాషను ఎంచుకోండి',
    freeLegalAid: 'ఉచిత న్యాయ సహాయం',
    helplineNalsa: 'నాల్సా ఉచిత న్యాయ సహాయం 15100',

    navHome: 'హోమ్',
    navMyMatters: 'నా కేసులు',
    navLegalAssistant: 'చట్టపరమైన సహాయకుడు',
    navCaseWorkspace: 'కేసు వర్క్‌స్పేస్',
    navDashboard: 'డ్యాష్‌బోర్డ్',
    navComplaints: 'నా ఫిర్యాదులు',
    navSources: 'చట్టాలు & సెక్షన్లు',
    navSimilarCases: 'సారూప్య తీర్పులు',
    navDrafting: 'లీగల్ నోటీసు డ్రాఫ్ట్',
    navEfir: 'ఇ-ఎఫ్ఐఆర్ మార్గదర్శకత్వం',
    navVoice: 'వాయిస్ అసిస్టెంట్',
    myAccount: 'నా ఖాతా',
    profile: 'ప్రొఫైల్',
    settings: 'సెట్టింగ్‌లు',
    logout: 'లాగ్ అవుట్',
    login: 'సైన్ ఇన్',
    register: 'నమోదు చేసుకోండి',

    groupDossier: 'కేసు ఫైల్',
    groupLegal: 'చట్టపరమైన ఆధారం',
    groupActions: 'చర్యలు & పరిష్కారాలు',
    tabOverview: 'సమీక్ష',
    tabEvidence: 'సాక్ష్యాలు & పత్రాలు',
    tabTimeline: 'కాలక్రమం',
    tabMissingInfo: 'మిస్ అయిన సమాచారం',
    tabWhyLawApplies: 'చట్టం ఎందుకు వర్తిస్తుంది',
    tabVerification: 'కేసు ధృవీకరణ',
    tabSources: 'చట్ట మూలాలు',
    tabCompare: 'మూలాల పోలిక',
    tabActions: 'చట్టపరమైన చర్యలు',
    tabCollective: 'సామూహిక సహాయం',
    tabExport: 'ఫైల్ ఎగుమతి',
    openAssistant: 'సహాయకుడిని అడగండి',
    moreTabs: 'మరిన్ని విభాగాలు',

    btnCreateCase: 'కొత్త ఫిర్యాదు',
    btnCreateDraft: 'డ్రాఫ్ట్ రూపొందించండి',
    btnEdit: 'సవరించండి',
    btnEditFields: 'వివరాలు మార్చండి',
    btnEditManually: 'మాన్యువల్‌గా సవరించండి',
    btnEditWithAi: 'ఏఐతో సవరించండి',
    btnSaveDraft: 'సేవ్ చేయండి',
    btnDraftSaved: 'సేవ్ చేయబడింది',
    btnSaveNewVersion: 'కొత్త వెర్షన్‌గా సేవ్ చేయండి',
    btnRegenerate: 'మళ్లీ రూపొందించండి',
    btnPreview: 'ప్రివ్యూ చూడండి',
    btnPrintExport: 'ప్రింట్ / పిడిఎఫ్',
    btnCopy: 'కాపీ చేయండి',
    btnDownload: 'డౌన్‌లోడ్',
    btnCancel: 'రద్దు చేయండి',
    btnConfirm: 'నిర్ధారించండి',
    btnDelete: 'తొలగించండి',
    btnRetry: 'మళ్లీ ప్రయత్నించండి',
    btnSend: 'పంపండి',
    btnRestore: 'పునరుద్ధరించండి',
    btnAccept: 'సవరణను ఆమోదించండి',
    btnReject: 'తిరస్కరించండి',
    btnRefine: 'సూచనను మార్చండి',
    btnUploadEvidence: 'కొత్త సాక్ష్యం అప్‌లోడ్ చేయండి',
    btnAddDemand: 'డిమాండ్ జోడించండి',
    btnBack: 'వెనుకకు',
    btnContinue: 'కొనసాగించండి',
    btnClear: 'క్లియర్ చేయండి',
    close: 'మూసివేయండి',

    statusActionRequired: 'చర్య అవసరం',
    statusVerified: 'ధృవీకరించబడింది',
    statusMissing: 'ముఖ్యమైన సమాచారం లేదు',
    statusReviewNeeded: 'సమీక్ష అవసరం',
    statusCollected: 'సేకరించబడింది',
    statusConfirmed: 'నిర్ధారించబడింది',
    statusSupported: 'మద్దతు ఉంది',
    statusDisputed: 'వివాదాస్పదం',
    statusDraft: 'డ్రాఫ్ట్',
    statusCompleted: 'పూర్తయింది',
    statusReady: 'చర్యకు సిద్ధంగా ఉంది',
    statusUnderReview: 'పరిశీలనలో ఉంది',
    statusApplicable: 'వాస్తవాల ఆధారంగా వర్తిస్తుంది',
    statusPotentiallyApplicable: 'వర్తించే అవకాశం ఉంది',
    statusRequiresInfo: 'మరింత సమాచారం అవసరం',

    draftParametersTitle: 'నోటీసు డ్రాఫ్ట్ వివరాలు',
    stepPrepareNotice: 'దశ 1: నోటీసును సిద్ధం చేయండి',
    tabParties: 'పార్టీలు & క్లెయిమ్‌లు',
    tabMatter: 'వివాదం వివరాలు',
    tabFacts: 'వాస్తవాలు & చట్టాలు',
    tabDemands: 'డిమాండ్లు & గడువు',
    recipientInfo: 'స్వీకర్త సమాచారం',
    recipientName: 'స్వీకర్త పేరు / సంస్థ *',
    designation: 'హోదా / పాత్ర',
    postalAddress: 'చిరునామా *',
    email: 'ఇమెయిల్ / ఫోన్ (ఐచ్ఛికం)',
    senderInfo: 'పంపినవారి సమాచారం',
    senderName: 'మీ పూర్తి చట్టపరమైన పేరు *',
    claimedAmount: 'క్లెయిమ్ మొత్తం *',
    senderAddress: 'ప్రస్తుత చిరునామా *',
    factsSummary: 'ముఖ్య వాస్తవాల సారాంశం *',
    statutoryBasis: 'చట్టపరమైన ఆధారం & ఉల్లంఘనలు *',
    curePeriod: 'సమస్య పరిష్కారానికి గడువు (రోజులు) *',
    daysNotice: 'నోటీసు అందినప్పటి నుండి రోజులు',
    demandsTitle: 'నిర్దిష్ట డిమాండ్లు',

    previewHeader: 'చట్టపరమైన నోటీసు ప్రివ్యూ',
    legalNoticeDisclaimer: 'ముఖ్య గమనిక: ఇది పౌరుల మార్గదర్శకత్వం కోసం రూపొందించిన డ్రాఫ్ట్ మాత్రమే. లీగల్ సాథీ న్యాయవాది కాదు. రిజిస్టర్ పోస్ట్ ద్వారా పంపే ముందు న్యాయవాదిని సంప్రదించండి.',
    aiEditorTitle: 'ఏఐతో డ్రాఫ్ట్‌ను సవరించండి',
    aiEditorSubtitle: 'మీ భాషలో సూచనలిచ్చి నోటీసును మెరుగుపరచండి.',
    aiInstructionLabel: 'మీరు ఎలాంటి మార్పులు చేయాలనుకుంటున్నారు?',
    aiInstructionPlaceholder: 'ఉదా: నోటీసును మరింత అధికారికంగా మార్చండి లేదా తెలుగులోకి అనువదించండి...',
    quickSuggestions: 'త్వరిత సూచనలు:',
    generateRevision: 'సవరించిన డ్రాఫ్ట్‌ను రూపొందించండి',
    applyingRevisions: 'మార్పులు జరుగుతున్నాయి...',
    proposedChangesSummary: 'ప్రతిపాదిత మార్పుల సారాంశం:',
    currentDocument: 'ప్రస్తుత పత్రం',
    proposedAiRevision: 'ప్రతిపాదిత ఏఐ డ్రాఫ్ట్',
    acceptSaveVersion: 'ఆమోదించి వెర్షన్‌గా సేవ్ చేయండి',
    versionHistoryTitle: 'డ్రాఫ్ట్ వెర్షన్ చరిత్ర',
    versionHistorySubtitle: 'మునుపటి వెర్షన్లను చూసి పునరుద్ధరించండి.',
    versionCurrent: 'ప్రస్తుత వెర్షన్',

    traceabilityPipeline: 'వాస్తవం-చట్టం అనుసంధానం',
    traceabilitySubtitle: 'మీ ఆధారాలు చట్టంతో ఎలా అనుసంధానించబడి ఉన్నాయో చూడండి.',
    traceableLinkage: 'ధృవీకరించిన అనుసంధానం',
    stepFacts: '1. నమోదైన వాస్తవాలు',
    stepIssue: '2. చట్టపరమైన సమస్య',
    stepStatute: '3. సంబంధిత చట్టం',
    stepSource: '4. ధృవీకరించిన మూలం',
    stepAction: '5. సిఫార్సు చేసిన చర్య',
    whatIUnderstand: 'కేసు సారాంశం',
    identifiedLegalIssue: 'గుర్తించిన చట్టపరమైన సమస్య',
    applicableProvision: 'వర్తించే చట్ట నిబంధన',
    statutoryTimeLimit: 'చట్టపరమైన కాలపరిమితి:',
    limitationNotice: 'కాలపరిమితి నోటీసు:',
    whyItApplies: 'ఈ చట్టం ఎందుకు వర్తిస్తుంది',
    supportingFacts: 'సహాయక వాస్తవాలు',
    corroboratingEvidence: 'నిరూపించే ఆధారాలు',
    infoStillNeeded: 'ఇంకా అవసరమైన సమాచారం',
    openMissingInfo: 'సమాచార సహాయకుడిని తెరవండి →',
    verifiedSource: 'ధృవీకరించిన మూలం',
    whatYouCanDoNext: 'తదుపరి చర్యలు',
    verifiedAction: 'నిర్ధారిత చర్య',
    actionPendingProof: 'ఆధారాలు పెండింగ్‌లో ఉన్నాయి',

    askAssistantPlaceholder: 'చట్టం గురించి ఏదైనా అడగండి...',
    summarizeCase: 'కేసును క్లుప్తంగా చెప్పండి',
    currentStatus: 'ప్రస్తుత స్థితి',
    missingItems: 'మిస్ అయిన అంశాలు',
    latestUpdate: 'తాజా సమాచారం',
    nextLegalSteps: 'తదుపరి చట్టపరమైన చర్యలు',
    applicableLaws: 'వర్తించే చట్టాలు',
    send: 'పంపండి',
    disclaimer: 'భారతీయ చట్ట ఆధారిత సమాచారం. ఇది అధికారిక న్యాయ సలహా కాదు.',
    quickInquiries: 'త్వరిత ప్రశ్నలు:',
    chatAssistantTitle: 'లీగల్ సాథీ సహాయకుడు',
    chatAssistantSubtitle: 'కేసు సలహాదారు',
    reviewingCaseLaw: 'చట్టాలను పరిశీలిస్తున్నాం...',
    clearChat: 'చాట్ క్లియర్ చేయండి',

    factVerificationTitle: 'వాస్తవాల ధృవీకరణ',
    factVerificationSubtitle: 'మీ వివరాలు ఆధారాలతో నిరూపించబడ్డాయా లేదా సరిచూసుకోండి.',
    timelineTitle: 'కేసు కాలక్రమం',
    timelineSubtitle: 'కేసులో జరిగిన ముఖ్య సంఘటనలు.',
    evidenceTitle: 'సాక్ష్యాల నిల్వ',
    evidenceSubtitle: 'రశీదులు మరియు ఒప్పందాలను అప్‌లోడ్ చేయండి.',
    missingInfoTitle: 'మిస్సయిన సమాచారం',
    missingInfoSubtitle: 'ఈ ప్రశ్నలకు సమాధానమివ్వడం మీ వాదనను బలోపేతం చేస్తుంది.',
    compareSourcesTitle: 'చట్టాల పోలిక',
    compareSourcesSubtitle: 'వివిధ చట్టాలను సరిపోల్చండి.',
    collectiveTitle: 'సామూహిక చర్య',
    collectiveSubtitle: 'ఇలాంటి సమస్యలు ఎదుర్కొంటున్న ఇతర పౌరులతో చేతులు కలపండి.',
    exportDossierTitle: 'ఫైల్‌ను ఎగుమతి చేయండి',
    exportDossierSubtitle: 'న్యాయస్థానంలో సమర్పించడానికి ఫైల్ సిద్ధం చేయండి.',
    newComplaint: 'కొత్త ఫిర్యాదు',
    evidenceDossier: 'సాక్ష్యాల ఫైల్',
    statutoryDeadline: 'చట్టపరమైన గడువు',
    inspectWhyLawApplies: 'చట్టం ఎందుకు వర్తిస్తుందో చూడండి',
    statutoryAssessment: 'చట్టపరమైన అంచనా',
    aiAdvisory: 'ఏఐ సలహా'
  },

  Gujarati: {
    brandName: 'લીગલ સાથી',
    tagline: 'ભારતીય નાગરિકો માટે પુરાવા-આધારિત કાનૂની સાથીદાર',
    civicLegalAssistant: 'નાગરિક કાનૂની સહાયક',
    civilJusticeGuidance: 'નાગરિક ન્યાય માર્ગદર્શન',
    selectLanguage: 'ભાષા પસંદ કરો',
    freeLegalAid: 'મફત કાનૂની સહાય',
    helplineNalsa: 'નાલસા મફત સહાય ૧૫૧૦૦',

    navHome: 'મુખ્ય પૃષ્ઠ',
    navMyMatters: 'મારા કેસો',
    navLegalAssistant: 'કાનૂની સહાયક',
    navCaseWorkspace: 'કેસ વર્કસ્પેસ',
    navDashboard: 'ડેશબોર્ડ',
    navComplaints: 'મારી ફરિયાદો',
    navSources: 'કાયદા અને કલમો',
    navSimilarCases: 'સમાન ચુકાદાઓ',
    navDrafting: 'નોટિસ ડ્રાફ્ટિંગ',
    navEfir: 'ઈ-એફઆઈઆર માર્ગદર્શન',
    navVoice: 'વોઇસ સહાયક',
    myAccount: 'મારું એકાઉન્ટ',
    profile: 'પ્રોફાઇલ',
    settings: 'સેટિંગ્સ',
    logout: 'સાઇન આઉટ',
    login: 'સાઇન ઇન',
    register: 'નોંધણી કરો',

    groupDossier: 'કેસ ફાઇલ',
    groupLegal: 'કાનૂની આધાર',
    groupActions: 'પગલાં અને ઉકેલો',
    tabOverview: 'વિહંગાવલોકન',
    tabEvidence: 'પુરાવા અને દસ્તાવેજો',
    tabTimeline: 'સમયરેખા',
    tabMissingInfo: 'ખૂટતી માહિતી',
    tabWhyLawApplies: 'કાયદો કેમ લાગુ પડે છે',
    tabVerification: 'કેસ ચકાસણી',
    tabSources: 'કાનૂની સ્ત્રોતો',
    tabCompare: 'સ્ત્રોતોની સરખામણી',
    tabActions: 'કાનૂની પગલાં',
    tabCollective: 'સામૂહિક સહાય',
    tabExport: 'દસ્તાવેજ નિકાસ',
    openAssistant: 'સહાયકને પૂછો',
    moreTabs: 'વધુ વિભાગો',

    btnCreateCase: 'નવી ફરિયાદ',
    btnCreateDraft: 'ડ્રાફ્ટ બનાવો',
    btnEdit: 'ફેરફાર કરો',
    btnEditFields: 'વિગતો બદલો',
    btnEditManually: 'જાતે સંપાદન કરો',
    btnEditWithAi: 'એઆઈ દ્વારા સુધારો',
    btnSaveDraft: 'સાચવો',
    btnDraftSaved: 'સાચવવામાં આવ્યું',
    btnSaveNewVersion: 'નવી આવૃત્તિ સાચવો',
    btnRegenerate: 'ફરીથી બનાવો',
    btnPreview: 'પૂર્વાવલોકન',
    btnPrintExport: 'પ્રિન્ટ / પીડીએફ',
    btnCopy: 'કોપી કરો',
    btnDownload: 'ડાઉનલોડ',
    btnCancel: 'રદ કરો',
    btnConfirm: 'પુષ્ટિ કરો',
    btnDelete: 'કાઢી નાખો',
    btnRetry: 'ફરી પ્રયાસ કરો',
    btnSend: 'મોકલો',
    btnRestore: 'પુનઃસ્થાપિત કરો',
    btnAccept: 'સુધારો સ્વીકારો',
    btnReject: 'અસ્વીકાર કરો',
    btnRefine: 'સૂચના બદલો',
    btnUploadEvidence: 'નવો પુરાવો ઉમેરો',
    btnAddDemand: 'માંગ ઉમેરો',
    btnBack: 'પાછળ',
    btnContinue: 'આગળ વધો',
    btnClear: 'સાફ કરો',
    close: 'બંધ કરો',

    statusActionRequired: 'પગલાં જરૂરી',
    statusVerified: 'ચકાસાયેલ',
    statusMissing: 'મહત્વપૂર્ણ માહિતી ખૂટે છે',
    statusReviewNeeded: 'સમીક્ષા જરૂરી',
    statusCollected: 'એકત્રિત',
    statusConfirmed: 'પુષ્ટિ થયેલ',
    statusSupported: 'સમર્થિત',
    statusDisputed: 'વિવાદાસ્પદ',
    statusDraft: 'ડ્રાફ્ટ',
    statusCompleted: 'પૂર્ણ',
    statusReady: 'પગલાં માટે તૈયાર',
    statusUnderReview: 'વિચારણા હેઠળ',
    statusApplicable: 'હકીકતો આધારે લાગુ',
    statusPotentiallyApplicable: 'સંભવિત લાગુ',
    statusRequiresInfo: 'વધુ માહિતી જરૂરી',

    draftParametersTitle: 'નોટિસ ડ્રાફ્ટ વિગતો',
    stepPrepareNotice: 'પગલું ૧: નોટિસ તૈયાર કરો',
    tabParties: 'પક્ષકારો અને દાવા',
    tabMatter: 'વિવાદની વિગતો',
    tabFacts: 'હકીકતો અને કાયદા',
    tabDemands: 'માંગો અને મુદત',
    recipientInfo: 'સામાવાળાની વિગતો',
    recipientName: 'સામાવાળાનું પૂરું નામ *',
    designation: 'હોદ્દો / ભૂમિકા',
    postalAddress: 'સરનામું *',
    email: 'ઈમેલ / ફોન (વૈકલ્પિક)',
    senderInfo: 'અરજદારની વિગતો',
    senderName: 'તમારું પૂરું કાનૂની નામ *',
    claimedAmount: 'દાવો કરેલી રકમ *',
    senderAddress: 'હાલનું સરનામું *',
    factsSummary: 'મુખ્ય હકીકતોનો સારાંશ *',
    statutoryBasis: 'કાનૂની જોગવાઈઓ અને ઉલ્લંઘન *',
    curePeriod: 'નિરાકરણ માટે મુદત (દિવસ) *',
    daysNotice: 'નોટિસ મળ્યાથી દિવસો',
    demandsTitle: 'મુખ્ય માંગણીઓ',

    previewHeader: 'કાનૂની નોટિસ પૂર્વાવલોકન',
    legalNoticeDisclaimer: 'મહત્વપૂર્ણ કાનૂની સૂચના: આ ડ્રાફ્ટ નાગરિક માર્ગદર્શન માટે છે. લીગલ સાથી વકીલ નથી. રજિસ્ટર્ડ પોસ્ટથી મોકલતા પહેલા વકીલની સલાહ લો.',
    aiEditorTitle: 'એઆઈ દ્વારા નોટિસમાં સુધારો',
    aiEditorSubtitle: 'સરળ ભાષામાં સૂચના આપીને નોટિસને વધુ સ્પષ્ટ બનાવો.',
    aiInstructionLabel: 'તમારે શું ફેરફાર કરવો છે?',
    aiInstructionPlaceholder: 'દા.ત. વધુ ઔપચારિક બનાવો અથવા ગુજરાતીમાં અનુવાદ કરો...',
    quickSuggestions: 'સૂચનો:',
    generateRevision: 'સુધારેલ ડ્રાફ્ટ બનાવો',
    applyingRevisions: 'ફેરફાર થઈ રહ્યો છે...',
    proposedChangesSummary: 'સૂચવેલા ફેરફારોનો સારાંશ:',
    currentDocument: 'હાલનો દસ્તાવેજ',
    proposedAiRevision: 'સૂચવેલ એઆઈ ડ્રાફ્ટ',
    acceptSaveVersion: 'સ્વીકારો અને નવી આવૃત્તિ સાચવો',
    versionHistoryTitle: 'ડ્રાફ્ટ આવૃત્તિ ઇતિહાસ',
    versionHistorySubtitle: 'અગાઉની આવૃત્તિઓ જુઓ અને પુનઃસ્થાપિત કરો.',
    versionCurrent: 'હાલની આવૃત્તિ',

    traceabilityPipeline: 'હકીકત અને કાયદાનું જોડાણ',
    traceabilitySubtitle: 'તમારા પુરાવા કાયદાની કલમો સાથે કેવી રીતે જોડાય છે તે જુઓ.',
    traceableLinkage: 'ચકાસાયેલ જોડાણ',
    stepFacts: '૧. નોંધાયેલ હકીકતો',
    stepIssue: '૨. કાનૂની મુદ્દો',
    stepStatute: '૩. સંબંધિત કાયદો',
    stepSource: '૪. ચકાસાયેલ સ્ત્રોત',
    stepAction: '૫. સૂચવેલ પગલાં',
    whatIUnderstand: 'હકીકતોનો સારાંશ',
    identifiedLegalIssue: 'ઓળખાયેલ કાનૂની પ્રશ્ન',
    applicableProvision: 'લાગુ પડતી કલમ',
    statutoryTimeLimit: 'કાનૂની સમયમર્યાદા:',
    limitationNotice: 'સમયમર્યાદા નોટિસ:',
    whyItApplies: 'આ કાયદો કેમ લાગુ પડે છે',
    supportingFacts: 'સમર્થન આપતી હકીકતો',
    corroboratingEvidence: 'સાબિત કરતા પુરાવા',
    infoStillNeeded: 'હજુ જરૂરી માહિતી',
    openMissingInfo: 'ખૂટતી માહિતી સહાયક ખોલો →',
    verifiedSource: 'ચકાસાયેલ સ્ત્રોત',
    whatYouCanDoNext: 'આગળ શું કરી શકાય',
    verifiedAction: 'નિશ્ચિત પગલું',
    actionPendingProof: 'પુરાવા બાકી છે',

    askAssistantPlaceholder: 'કાયદા વિશે કંઈપણ પૂછો...',
    summarizeCase: 'કેસનો સારાંશ આપો',
    currentStatus: 'હાલની સ્થિતિ',
    missingItems: 'ખૂટતી વસ્તુઓ',
    latestUpdate: 'તાજેતરની માહિતી',
    nextLegalSteps: 'આગામી કાનૂની પગલાં',
    applicableLaws: 'લાગુ પડતા કાયદા',
    send: 'મોકલો',
    disclaimer: 'ભારતીય કાયદા પર આધારિત માર્ગદર્શન. ઔપચારિક સલાહ નથી.',
    quickInquiries: 'ઝડપી પ્રશ્નો:',
    chatAssistantTitle: 'લીગલ સાથી સહાયક',
    chatAssistantSubtitle: 'કેસ સલાહકાર',
    reviewingCaseLaw: 'કાયદાની ચકાસણી ચાલુ છે...',
    clearChat: 'વાતચીત સાફ કરો',

    factVerificationTitle: 'હકીકત ચકાસણી',
    factVerificationSubtitle: 'તમારી રજૂઆત પુરાવાઓથી સમર્થિત છે કે નહીં તે તપાસો.',
    timelineTitle: 'કેસ સમયરેખા',
    timelineSubtitle: 'કેસની મહત્વપૂર્ણ તારીખો.',
    evidenceTitle: 'પુરાવા ભંડાર',
    evidenceSubtitle: 'કરાર અને રસીદો અપલોડ કરો.',
    missingInfoTitle: 'ખૂટતી માહિતી',
    missingInfoSubtitle: 'આ જવાબો આપવાથી તમારી બાજુ મજબૂત થશે.',
    compareSourcesTitle: 'કાયદાની સરખામણી',
    compareSourcesSubtitle: 'વિવિધ કાયદાઓની તુલના કરો.',
    collectiveTitle: 'એકજૂટ સામૂહિક મંચ',
    collectiveSubtitle: 'સમાન સમસ્યાવાળા અન્ય નાગરિકો સાથે જોડાઓ.',
    exportDossierTitle: 'દસ્તાવેજ નિકાસ કરો',
    exportDossierSubtitle: 'કોર્ટ કે વકીલ સમક્ષ રજૂ કરવા ફાઇલ તૈયાર કરો.',
    newComplaint: 'નવી ફરિયાદ',
    evidenceDossier: 'પુરાવા ફાઇલ',
    statutoryDeadline: 'કાનૂની સમયમર્યાદા',
    inspectWhyLawApplies: 'કાયદો કેમ લાગુ પડે છે તે જુઓ',
    statutoryAssessment: 'કાનૂની મૂલ્યાંકન',
    aiAdvisory: 'એઆઈ સલાહ'
  },

  Kannada: {
    brandName: 'ಲೀಗಲ್ ಸಾಥಿ',
    tagline: 'ಭಾರತೀಯ ನಾಗರಿಕರಿಗೆ ಸಾಕ್ಷ್ಯ-ಆಧಾರಿತ ಕಾನೂನು ಸಹಾಯಕ',
    civicLegalAssistant: 'ನಾಗರಿಕ ಕಾನೂನು ಸಹಾಯಕ',
    civilJusticeGuidance: 'ನಾಗರಿಕ ನ್ಯಾಯ ಮಾರ್ಗದರ್ಶನ',
    selectLanguage: 'ಭಾಷೆ ಆಯ್ಕೆಮಾಡಿ',
    freeLegalAid: 'ಉಚಿತ ಕಾನೂನು ನೆರವು',
    helplineNalsa: 'ನಾಲ್ಸಾ ಉಚಿತ ಕಾನೂನು ನೆರವು 15100',

    navHome: 'ಮುಖಪುಟ',
    navMyMatters: 'ನನ್ನ ಪ್ರಕರಣಗಳು',
    navLegalAssistant: 'ಕಾನೂನು ಸಹಾಯಕ',
    navCaseWorkspace: 'ಪ್ರಕರಣ ಕಾರ್ಯಕ್ಷೇತ್ರ',
    navDashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    navComplaints: 'ನನ್ನ ದೂರುಗಳು',
    navSources: 'ಕಾನೂನುಗಳು & ಸೆಕ್ಷನ್‌ಗಳು',
    navSimilarCases: 'ಹಿಂದಿನ ತೀರ್ಪುಗಳು',
    navDrafting: 'ಕಾನೂನು ನೋಟಿಸ್ ಕರಡು',
    navEfir: 'ಇ-ಎಫ್‌ಐಆರ್ ಮಾರ್ಗದರ್ಶನ',
    navVoice: 'ಧ್ವನಿ ಸಹಾಯಕ',
    myAccount: 'ನನ್ನ ಖಾತೆ',
    profile: 'ಪ್ರೊಫೈಲ್',
    settings: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
    logout: 'ಸೈನ್ ಔಟ್',
    login: 'ಸೈನ್ ಇನ್',
    register: 'ನೋಂದಾಯಿಸಿ',

    groupDossier: 'ಪ್ರಕರಣದ ಕಡತ',
    groupLegal: 'ಕಾನೂನು ಆಧಾರ',
    groupActions: 'ಕ್ರಮಗಳು & ಪರಿಹಾರಗಳು',
    tabOverview: 'ಅವಲೋಕನ',
    tabEvidence: 'ಸಾಕ್ಷ್ಯಗಳು & ದಾಖಲೆಗಳು',
    tabTimeline: 'ಘಟನಾವಳಿ',
    tabMissingInfo: 'ಕೊರತೆಯಿರುವ ಮಾಹಿತಿ',
    tabWhyLawApplies: 'ಕಾನೂನು ಏಕೆ ಅನ್ವಯಿಸುತ್ತದೆ',
    tabVerification: 'ಪ್ರಕರಣ ಪರಿಶೀಲನೆ',
    tabSources: 'ಕಾನೂನು ಮೂಲಗಳು',
    tabCompare: 'ಮೂಲಗಳ ಹೋಲಿಕೆ',
    tabActions: 'ಕಾನೂನು ಕ್ರಮಗಳು',
    tabCollective: 'ಸಾಮೂಹಿಕ ನೆರವು',
    tabExport: 'ದಾಖಲೆ ರಫ್ತು',
    openAssistant: 'ಸಹಾಯಕರನ್ನು ಕೇಳಿ',
    moreTabs: 'ಹೆಚ್ಚಿನ ವಿಭಾಗಗಳು',

    btnCreateCase: 'ಹೊಸ ದೂರು',
    btnCreateDraft: 'ಕರಡು ರಚಿಸಿ',
    btnEdit: 'ತಿದ್ದು',
    btnEditFields: 'ವಿವರಗಳನ್ನು ಬದಲಾಯಿಸಿ',
    btnEditManually: 'ಸ್ವತಃ ತಿದ್ದಿ',
    btnEditWithAi: 'ಎಐ ಮೂಲಕ ತಿದ್ದಿ',
    btnSaveDraft: 'ಉಳಿಸಿ',
    btnDraftSaved: 'ಉಳಿಸಲಾಗಿದೆ',
    btnSaveNewVersion: 'ಹೊಸ ಆವೃತ್ತಿಯಾಗಿ ಉಳಿಸಿ',
    btnRegenerate: 'ಮತ್ತೆ ರಚಿಸಿ',
    btnPreview: 'ಮುನ್ನೋಟ',
    btnPrintExport: 'ಮುದ್ರಣ / ಪಿಡಿಎಫ್',
    btnCopy: 'ನಕಲಿಸಿ',
    btnDownload: 'ಡೌನ್‌ಲೋಡ್',
    btnCancel: 'ರದ್ದುಮಾಡಿ',
    btnConfirm: 'ದೃಢೀಕರಿಸಿ',
    btnDelete: 'ಅಳಿಸಿ',
    btnRetry: 'ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ',
    btnSend: 'ಕಳುಹಿಸಿ',
    btnRestore: 'ಮರುಸ್ಥಾಪಿಸಿ',
    btnAccept: 'ಬದಲಾವಣೆ ಒಪ್ಪಿಕೊಳ್ಳಿ',
    btnReject: 'ತಿರಸ್ಕರಿಸಿ',
    btnRefine: 'ಸೂಚನೆ ಬದಲಿಸಿ',
    btnUploadEvidence: 'ಹೊಸ ಸಾಕ್ಷ್ಯ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ',
    btnAddDemand: 'ಬೇಡಿಕೆ ಸೇರಿಸಿ',
    btnBack: 'ಹಿಂದೆ',
    btnContinue: 'ಮುಂದುವರಿಯಿರಿ',
    btnClear: 'ತೆರವುಗೊಳಿಸಿ',
    close: 'ಮುಚ್ಚಿ',

    statusActionRequired: 'ಕ್ರಮ ಅಗತ್ಯವಿದೆ',
    statusVerified: 'ಪರಿಶೀಲಿಸಲಾಗಿದೆ',
    statusMissing: 'ಮುಖ್ಯ ಮಾಹಿತಿ ಕಾಣೆಯಾಗಿದೆ',
    statusReviewNeeded: 'ಪರಿಶೀಲನೆ ಅಗತ್ಯವಿದೆ',
    statusCollected: 'ಸಂಗ್ರಹಿಸಲಾಗಿದೆ',
    statusConfirmed: 'ದೃಢಪಟ್ಟಿದೆ',
    statusSupported: 'ಬೆಂಬಲಿತವಾಗಿದೆ',
    statusDisputed: 'ವಿವಾದಿತ',
    statusDraft: 'ಕರಡು',
    statusCompleted: 'ಪೂರ್ಣಗೊಂಡಿದೆ',
    statusReady: 'ಕ್ರಮಕ್ಕೆ ಸಿದ್ಧವಾಗಿದೆ',
    statusUnderReview: 'ಪರಿಶೀಲನೆಯಲ್ಲಿದೆ',
    statusApplicable: 'ಸತ್ಯಾಂಶಗಳ ಆಧಾರದ ಮೇಲೆ ಅನ್ವಯಿಸುತ್ತದೆ',
    statusPotentiallyApplicable: 'ಅನ್ವಯಿಸುವ ಸಾಧ್ಯತೆಯಿದೆ',
    statusRequiresInfo: 'ಹೆಚ್ಚಿನ ಮಾಹಿತಿ ಅಗತ್ಯವಿದೆ',

    draftParametersTitle: 'ನೋಟಿಸ್ ಕರಡು ವಿವರಗಳು',
    stepPrepareNotice: 'ಹಂತ 1: ನೋಟಿಸ್ ಸಿದ್ಧಪಡಿಸಿ',
    tabParties: 'ಪಕ್ಷಗಳು & ಕ್ಲೈಮ್‌ಗಳು',
    tabMatter: 'ವಿವಾದದ ವಿವರ',
    tabFacts: 'ಸಂಗತಿಗಳು & ನಿಯಮಗಳು',
    tabDemands: 'ಬೇಡಿಕೆಗಳು & ಕಾಲಮಿತಿ',
    recipientInfo: 'ಸ್ವೀಕರಿಸುವವರ ವಿವರಗಳು',
    recipientName: 'ಸ್ವೀಕರಿಸುವವರ ಪೂರ್ಣ ಹೆಸರು *',
    designation: 'ಹುದ್ದೆ / ಪಾತ್ರ',
    postalAddress: 'ಅಂಚೆ ವಿಳಾಸ *',
    email: 'ಇಮೇಲ್ / ಫೋನ್ (ಐಚ್ಛಿಕ)',
    senderInfo: 'ಕಳುಹಿಸುವವರ ವಿವರಗಳು',
    senderName: 'ನಿಮ್ಮ ಪೂರ್ಣ ಕಾನೂನುಬದ್ಧ ಹೆಸರು *',
    claimedAmount: 'ಬೇಡಿಕೆಯ ಮೊತ್ತ *',
    senderAddress: 'ಪ್ರಸ್ತುತ ವಿಳಾಸ *',
    factsSummary: 'ಮುಖ್ಯ ಸಂಗತಿಗಳ ಸಾರಾಂಶ *',
    statutoryBasis: 'ಕಾನೂನು ಆಧಾರ & ಉಲ್ಲಂಘನೆಗಳು *',
    curePeriod: 'ಪರಿಹಾರಕ್ಕೆ ಕಾಲಾವಕಾಶ (ದಿನಗಳು) *',
    daysNotice: 'ನೋಟಿಸ್ ತಲುಪಿದ ನಂತರದ ದಿನಗಳು',
    demandsTitle: 'ನಿರ್ದಿಷ್ಟ ಬೇಡಿಕೆಗಳು',

    previewHeader: 'ಕಾನೂನು ನೋಟಿಸ್ ಮುನ್ನೋಟ',
    legalNoticeDisclaimer: 'ಮುಖ್ಯ ಕಾನೂನು ಎಚ್ಚರಿಕೆ: ಇದು ನಾಗರಿಕರ ಮಾರ್ಗದರ್ಶನಕ್ಕಾಗಿ ತಯಾರಿಸಲಾದ ಮಾದರಿ ಕರಡು ಮಾತ್ರ. ಲೀಗಲ್ ಸಾಥಿ ವಕೀಲರಲ್ಲ. ರಿಜಿಸ್ಟರ್ಡ್ ಪೋಸ್ಟ್ ಮೂಲಕ ಕಳುಹಿಸುವ ಮುನ್ನ ವಕೀಲರನ್ನು ಸಂಪರ್ಕಿಸಿ.',
    aiEditorTitle: 'ಎಐ ಮೂಲಕ ನೋಟಿಸ್ ತಿದ್ದುಪಡಿ',
    aiEditorSubtitle: 'ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲಿ ಸೂಚನೆ ನೀಡಿ ನೋಟಿಸ್ ಅನ್ನು ಉತ್ತಮಗೊಳಿಸಿ.',
    aiInstructionLabel: 'ನೀವು ಯಾವ ಬದಲಾವಣೆಗಳನ್ನು ಬಯಸುತ್ತೀರಿ?',
    aiInstructionPlaceholder: 'ಉದಾ: ನೋಟಿಸ್ ಅನ್ನು ಇನ್ನಷ್ಟು ಅಧಿಕೃತವಾಗಿಸಿ ಅಥವಾ ಕನ್ನಡಕ್ಕೆ ಅನುವಾದಿಸಿ...',
    quickSuggestions: 'ಸಲಹೆಗಳು:',
    generateRevision: 'ತಿದ್ದುಪಡಿ ಮಾಡಿದ ಕರಡು ರಚಿಸಿ',
    applyingRevisions: 'ಬದಲಾವಣೆಗಳು ಆಗುತ್ತಿವೆ...',
    proposedChangesSummary: 'ಬದಲಾವಣೆಗಳ ಸಾರಾಂಶ:',
    currentDocument: 'ಪ್ರಸ್ತುತ ದಾಖಲೆ',
    proposedAiRevision: 'ಪ್ರಸ್ತಾಪಿತ ಎಐ ಕರಡು',
    acceptSaveVersion: 'ಒಪ್ಪಿ ಹೊಸ ಆವೃತ್ತಿಯಾಗಿ ಉಳಿಸಿ',
    versionHistoryTitle: 'ಕರಡು ಆವೃತ್ತಿ ಇತಿಹಾಸ',
    versionHistorySubtitle: 'ಹಿಂದಿನ ಆವೃತ್ತಿಗಳನ್ನು ಪರಿಶೀಲಿಸಿ ಮತ್ತು ಮರುಸ್ಥಾಪಿಸಿ.',
    versionCurrent: 'ಪ್ರಸ್ತುತ ಆವೃತ್ತಿ',

    traceabilityPipeline: 'ಸಂಗತಿ-ಕಾನೂನು ಸಂಬಂಧ',
    traceabilitySubtitle: 'ನಿಮ್ಮ ಸಾಕ್ಷ್ಯಗಳು ಕಾನೂನಿನೊಂದಿಗೆ ಹೇಗೆ ಸಂಬಂಧ ಹೊಂದಿವೆ ಎಂಬುದನ್ನು ನೋಡಿ.',
    traceableLinkage: 'ಪರಿಶೀಲಿತ ಸಂಪರ್ಕ',
    stepFacts: '1. ದಾಖಲಾದ ಸಂಗತಿಗಳು',
    stepIssue: '2. ಕಾನೂನು ಸಮಸ್ಯೆ',
    stepStatute: '3. ಸಂಬಂಧಿತ ಕಾನೂನು',
    stepSource: '4. ಪರಿಶೀಲಿತ ಮೂಲ',
    stepAction: '5. ಶಿಫಾರಸು ಮಾಡಿದ ಕ್ರಮ',
    whatIUnderstand: 'ಮಾಹಿತಿಯ ಸಾರಾಂಶ',
    identifiedLegalIssue: 'ಗುರುತಿಸಲಾದ ಕಾನೂನು ಸಮಸ್ಯೆ',
    applicableProvision: 'ಅನ್ವಯವಾಗುವ ಕಾನೂನು ಸೆಕ್ಷನ್',
    statutoryTimeLimit: 'ಕಾನೂನುಬದ್ಧ ಕಾಲಮಿತಿ:',
    limitationNotice: 'ಕಾಲಮಿತಿ ಸೂಚನೆ:',
    whyItApplies: 'ಈ ಕಾನೂನು ಏಕೆ ಅನ್ವಯಿಸುತ್ತದೆ',
    supportingFacts: 'ಪೂರಕ ಸಂಗತಿಗಳು',
    corroboratingEvidence: 'ದೃಢೀಕರಿಸುವ ಸಾಕ್ಷ್ಯಗಳು',
    infoStillNeeded: 'ಇನ್ನೂ ಅಗತ್ಯವಿರುವ ಮಾಹಿತಿ',
    openMissingInfo: 'ಮಾಹಿತಿ ಸಹಾಯಕ ತೆರೆಯಿರಿ →',
    verifiedSource: 'ಪರಿಶೀಲಿತ ಮೂಲ',
    whatYouCanDoNext: 'ಮುಂದಿನ ಕ್ರಮಗಳು',
    verifiedAction: 'ದೃಢೀಕರಿಸಿದ ಕ್ರಮ',
    actionPendingProof: 'ಸಾಕ್ಷ್ಯದ ನಿರೀಕ್ಷೆಯಲ್ಲಿದೆ',

    askAssistantPlaceholder: 'ಕಾನೂನಿನ ಬಗ್ಗೆ ಏನಾದರೂ ಕೇಳಿ...',
    summarizeCase: 'ಪ್ರಕರಣವನ್ನು ಸಂಕ್ಷಿಪ್ತಗೊಳಿಸಿ',
    currentStatus: 'ಪ್ರಸ್ತುತ ಸ್ಥಿತಿ',
    missingItems: 'ಕಾಣೆಯಾದ ಅಂಶಗಳು',
    latestUpdate: 'ಇತ್ತೀಚಿನ ಮಾಹಿತಿ',
    nextLegalSteps: 'ಮುಂದಿನ ಕಾನೂನು ಕ್ರಮಗಳು',
    applicableLaws: 'ಅನ್ವಯವಾಗುವ ಕಾನೂನುಗಳು',
    send: 'ಕಳುಹಿಸಿ',
    disclaimer: 'ಭಾರತೀಯ ಕಾನೂನು ಆಧಾರಿತ ಮಾಹಿತಿ. ಇದು ವಕೀಲರ ಸಲಹೆಯಲ್ಲ.',
    quickInquiries: 'ತ್ವರಿತ ಪ್ರಶ್ನೆಗಳು:',
    chatAssistantTitle: 'ಲೀಗಲ್ ಸಾಥಿ ಸಹಾಯಕ',
    chatAssistantSubtitle: 'ಪ್ರಕರಣದ ಸಲಹೆಗಾರ',
    reviewingCaseLaw: 'ಕಾನೂನುಗಳನ್ನು ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ...',
    clearChat: 'ಚಾಟ್ ತೆರವುಗೊಳಿಸಿ',

    factVerificationTitle: 'ಸಂಗತಿಗಳ ಪರಿಶೀಲನೆ',
    factVerificationSubtitle: 'ನಿಮ್ಮ ಹೇಳಿಕೆಗಳು ದಾಖಲೆಗಳಿಂದ ಸಾಬೀತಾಗಿವೆಯೇ ಎಂದು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ.',
    timelineTitle: 'ಪ್ರಕರಣದ ಘಟನಾವಳಿ',
    timelineSubtitle: 'ಪ್ರಕರಣದಲ್ಲಿ ನಡೆದ ಮುಖ್ಯ ಘಟನೆಗಳು.',
    evidenceTitle: 'ಸಾಕ್ಷ್ಯಗಳ ಭಂಡಾರ',
    evidenceSubtitle: 'ಕರಾರು ಮತ್ತು ರಶೀದಿಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ.',
    missingInfoTitle: 'ಕೊರತೆಯಿರುವ ಮಾಹಿತಿ',
    missingInfoSubtitle: 'ಈ ಪ್ರಶ್ನೆಗಳಿಗೆ ಉತ್ತರಿಸುವುದು ನಿಮ್ಮ ವಾದವನ್ನು ಬಲಪಡಿಸುತ್ತದೆ.',
    compareSourcesTitle: 'ಕಾನೂನುಗಳ ಹೋಲಿಕೆ',
    compareSourcesSubtitle: 'ವಿವಿಧ ಸೆಕ್ಷನ್‌ಗಳನ್ನು ಹೋಲಿಸಿ ನೋಡಿ.',
    collectiveTitle: 'ಸಾಮೂಹಿಕ ವೇದಿಕೆ',
    collectiveSubtitle: 'ಇದೇ ರೀತಿಯ ಸಮಸ್ಯೆ ಎದುರಿಸುತ್ತಿರುವ ಇತರ ನಾಗರಿಕರೊಂದಿಗೆ ಸಂಪರ್ಕ ಸಾಧಿಸಿ.',
    exportDossierTitle: 'ಕಡತವನ್ನು ರಫ್ತು ಮಾಡಿ',
    exportDossierSubtitle: 'ನ್ಯಾಯಾಲಯಕ್ಕೆ ಸಲ್ಲಿಸಲು ಕಡತವನ್ನು ಸಿದ್ಧಪಡಿಸಿ.',
    newComplaint: 'ಹೊಸ ದೂರು',
    evidenceDossier: 'ಸಾಕ್ಷ್ಯ ಕಡತ',
    statutoryDeadline: 'ಕಾನೂನು ಕಾಲಮಿತಿ',
    inspectWhyLawApplies: 'ಕಾನೂನು ಏಕೆ ಅನ್ವಯಿಸುತ್ತದೆ ಎಂದು ನೋಡಿ',
    statutoryAssessment: 'ಕಾನೂನು ಮೌಲ್ಯಮಾಪನ',
    aiAdvisory: 'ಎಐ ಸಲಹೆ'
  }
};

export const LANGUAGE_CODES: Record<SupportedLanguage, string> = {
  English: 'en',
  Hindi: 'hi',
  Marathi: 'mr',
  Tamil: 'ta',
  Bengali: 'bn',
  Telugu: 'te',
  Gujarati: 'gu',
  Kannada: 'kn'
};

export const LOCALE_MAP: Record<SupportedLanguage, string> = {
  English: 'en-IN',
  Hindi: 'hi-IN',
  Marathi: 'mr-IN',
  Tamil: 'ta-IN',
  Bengali: 'bn-IN',
  Telugu: 'te-IN',
  Gujarati: 'gu-IN',
  Kannada: 'kn-IN'
};

export function getTranslations(lang: SupportedLanguage | string): TranslationDictionary {
  const base = (lang in TRANSLATIONS)
    ? TRANSLATIONS[lang as SupportedLanguage]
    : TRANSLATIONS.English;

  return {
    ...base,
    notifications: base.notifications || (lang === 'Hindi' ? 'सूचनाएं' : lang === 'Marathi' ? 'सूचना' : lang === 'Tamil' ? 'அறிவிப்புகள்' : 'Notifications'),
    signOut: base.signOut || base.logout,
    statusAll: base.statusAll || (lang === 'Hindi' ? 'सभी' : lang === 'Marathi' ? 'सर्व' : lang === 'Tamil' ? 'அனைத்தும்' : 'All'),
    statusActive: base.statusActive || (lang === 'Hindi' ? 'सक्रिय' : lang === 'Marathi' ? 'सक्रिय' : lang === 'Tamil' ? 'செயலில்' : 'Active'),
    statusArchived: base.statusArchived || (lang === 'Hindi' ? 'संग्रहीत' : lang === 'Marathi' ? 'आर्काइव्ह केलेले' : lang === 'Tamil' ? 'காப்பகப்படுத்தப்பட்டது' : 'Archived'),
    statusSaved: base.statusSaved || base.btnDraftSaved,
    statusNeedsReview: base.statusNeedsReview || base.statusReviewNeeded,
    needGuidance: base.needGuidance || (lang === 'Hindi' ? 'सहायता चाहिए?' : lang === 'Marathi' ? 'मार्गदर्शन हवे?' : lang === 'Tamil' ? 'வழிகாட்டல் தேவையா?' : 'Need Guidance?'),
    needGuidanceDesc: base.needGuidanceDesc || (lang === 'Hindi' ? 'लागू कानूनों या अगले चरणों के बारे में पूछें।' : lang === 'Marathi' ? 'लागू कायदे किंवा पुढील पायऱ्यांबद्दल विचारा.' : lang === 'Tamil' ? 'பொருந்தக்கூடிய சட்டங்கள் அல்லது அடுத்த படிகளைப் பற்றி கேளுங்கள்.' : 'Ask about applicable laws or next steps.'),
    caseStatus: base.caseStatus || (lang === 'Hindi' ? 'स्थिति' : lang === 'Marathi' ? 'स्थिती' : lang === 'Tamil' ? 'நிலை' : 'Status'),
    statutoryLimitation: base.statutoryLimitation || base.statutoryTimeLimit,
    statutoryLinkage: base.statutoryLinkage || base.traceableLinkage,
    filterMore: base.filterMore || base.moreTabs,
    uploadEvidence: base.uploadEvidence || base.btnUploadEvidence,
    totalIdentified: base.totalIdentified || (lang === 'Hindi' ? 'कुल पहचान किए गए' : lang === 'Marathi' ? 'एकूण ओळखलेले' : lang === 'Tamil' ? 'மொத்தம் கண்டறியப்பட்டது' : 'Total Identified'),
    collectedVerified: base.collectedVerified || base.statusCollected,
    filterDossier: base.filterDossier || (lang === 'Hindi' ? 'डोज़ियर फ़िल्टर करें' : lang === 'Marathi' ? 'डोसियर फिल्टर करा' : lang === 'Tamil' ? 'கோப்புகளை வடிகட்டவும்' : 'Filter Dossier'),
    draftNoticeParameters: base.draftNoticeParameters || base.draftParametersTitle,
    btnPreviewDocument: base.btnPreviewDocument || base.btnPreview,
    paramParties: base.paramParties || base.tabParties,
    paramFactsStatutes: base.paramFactsStatutes || base.tabFacts,
    paramRequisitions: base.paramRequisitions || base.tabDemands,
    draftPreview: base.draftPreview || base.previewHeader,
    btnGenerateRevision: base.btnGenerateRevision || base.generateRevision,
    btnRejectRevision: base.btnRejectRevision || base.btnReject,
    btnAcceptRevision: base.btnAcceptRevision || base.btnAccept,
    versionHistory: base.versionHistory || base.versionHistoryTitle,
    btnExportDossier: base.btnExportDossier || base.tabExport
  };
}

export function formatLocalizedDate(date: string | Date, lang: SupportedLanguage): string {
  try {
    const d = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(d.getTime())) return String(date);
    const locale = LOCALE_MAP[lang] || 'en-IN';
    return d.toLocaleDateString(locale, { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return String(date);
  }
}

export function formatLocalizedCurrency(amount: number | string, lang: SupportedLanguage): string {
  try {
    const num = typeof amount === 'string' ? parseFloat(amount.replace(/[^0-9.-]/g, '')) : amount;
    if (isNaN(num)) return String(amount);
    const locale = LOCALE_MAP[lang] || 'en-IN';
    return new Intl.NumberFormat(locale, { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(num);
  } catch {
    return String(amount);
  }
}
