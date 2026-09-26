/**
 * Legal Saathi - Core Multilingual Translation Dictionary (i18n)
 * Supports 8 primary Indian languages:
 * English, Hindi (हिन्दी), Marathi (मराठी), Tamil (தமிழ்),
 * Bengali (বাংলা), Telugu (తెలుగు), Gujarati (ગુજરાતી), Kannada (ಕನ್ನಡ)
 */

export type SupportedLanguage = 'English' | 'Hindi' | 'Marathi' | 'Tamil' | 'Bengali' | 'Telugu' | 'Gujarati' | 'Kannada';

export interface TranslationDictionary {
  brandName: string;
  tagline: string;
  navDashboard: string;
  navChat: string;
  navSources: string;
  navSimilarCases: string;
  navComplaints: string;
  navDrafting: string;
  navEfir: string;
  navVoice: string;
  helplineNalsa: string;
  selectLanguage: string;
  // Dashboard & Common UI
  newComplaint: string;
  statusActionRequired: string;
  statusVerified: string;
  statusMissing: string;
  statusReviewNeeded: string;
  evidenceDossier: string;
  statutoryDeadline: string;
  askAssistantPlaceholder: string;
  summarizeCase: string;
  currentStatus: string;
  missingItems: string;
  latestUpdate: string;
  nextLegalSteps: string;
  applicableLaws: string;
  send: string;
  disclaimer: string;
  inspectWhyLawApplies: string;
  statutoryAssessment: string;
  aiAdvisory: string;
  // Quick Inquiries
  quickInquiries: string;
  chatAssistantTitle: string;
  chatAssistantSubtitle: string;
  reviewingCaseLaw: string;
}

export const TRANSLATIONS: Record<SupportedLanguage, TranslationDictionary> = {
  English: {
    brandName: 'Legal Saathi',
    tagline: 'Evidence-Grounded AI Legal Companion for Indian Citizens',
    navDashboard: 'Dashboard',
    navChat: 'Legal Assistant',
    navSources: 'Statutes & Sources',
    navSimilarCases: 'Similar Precedents',
    navComplaints: 'Complaints',
    navDrafting: 'Legal Notice Drafts',
    navEfir: 'e-FIR Guidance',
    navVoice: 'Voice Assistant',
    helplineNalsa: 'NALSA Free Legal Aid 15100',
    selectLanguage: 'Language',
    newComplaint: 'New Complaint',
    statusActionRequired: 'Action Required',
    statusVerified: 'Verified • Collected',
    statusMissing: 'Critical Gap Missing',
    statusReviewNeeded: 'Review Needed',
    evidenceDossier: 'Evidence Dossier',
    statutoryDeadline: 'Statutory Deadline',
    askAssistantPlaceholder: 'Ask about this matter or applicable statutes...',
    summarizeCase: 'Summarize matter',
    currentStatus: 'Current status',
    missingItems: 'Missing items',
    latestUpdate: 'Latest update',
    nextLegalSteps: 'Next legal steps',
    applicableLaws: 'Applicable laws',
    send: 'Send',
    disclaimer: 'Guidance grounded in Indian law. Not formal advocate advice.',
    inspectWhyLawApplies: 'Inspect Why Law Applies',
    statutoryAssessment: 'Statutory Assessment',
    aiAdvisory: 'Case AI Advisory',
    quickInquiries: 'Quick Inquiries:',
    chatAssistantTitle: 'Legal Saathi Assistant',
    chatAssistantSubtitle: 'Case Docket Advisory',
    reviewingCaseLaw: 'Reviewing case law and active facts...'
  },
  Hindi: {
    brandName: 'लीगल साथी',
    tagline: 'भारतीय नागरिकों के लिए साक्ष्य-आधारित कानूनी सहायता',
    navDashboard: 'डैशबोर्ड',
    navChat: 'कानूनी सहायक',
    navSources: 'कानून एवं धाराएं',
    navSimilarCases: 'समान पूर्व निर्णय',
    navComplaints: 'शिकायतें',
    navDrafting: 'कानूनी नोटिस प्रारूप',
    navEfir: 'ई-एफआईआर मार्गदर्शन',
    navVoice: 'ध्वनि सहायक',
    helplineNalsa: 'नालसा निशुल्क विधिक सहायता 15100',
    selectLanguage: 'भाषा',
    newComplaint: 'नई शिकायत',
    statusActionRequired: 'कार्यवाही आवश्यक',
    statusVerified: 'सत्यापित • सुरक्षित',
    statusMissing: 'महत्वपूर्ण साक्ष्य अनुपलब्ध',
    statusReviewNeeded: 'समीक्षा आवश्यक',
    evidenceDossier: 'साक्ष्य दस्तावेज़',
    statutoryDeadline: 'वैधानिक समय सीमा',
    askAssistantPlaceholder: 'इस मामले या लागू कानूनी धाराओं के बारे में पूछें...',
    summarizeCase: 'मामले का सारांश',
    currentStatus: 'वर्तमान स्थिति',
    missingItems: 'आवश्यक दस्तावेज',
    latestUpdate: 'नवीनतम अपडेट',
    nextLegalSteps: 'अगला कानूनी कदम',
    applicableLaws: 'लागू कानून व धाराएं',
    send: 'भेजें',
    disclaimer: 'भारतीय कानून पर आधारित मार्गदर्शन। औपचारिक अधिवक्ता परामर्श का विकल्प नहीं।',
    inspectWhyLawApplies: 'कानूनी आधार की जांच करें',
    statutoryAssessment: 'वैधानिक मूल्यांकन',
    aiAdvisory: 'मामला एआई परामर्श',
    quickInquiries: 'त्वरित प्रश्न:',
    chatAssistantTitle: 'लीगल साथी सहायक',
    chatAssistantSubtitle: 'सक्रिय मामला विधिक परामर्श',
    reviewingCaseLaw: 'कानूनी धाराओं और तथ्यों की समीक्षा जारी है...'
  },
  Marathi: {
    brandName: 'लीगल साथी',
    tagline: 'भारतीय नागरिकांसाठी पुरावा-आधारित कायदेशीर सहाय्यक',
    navDashboard: 'डॅशबोर्ड',
    navChat: 'कायदेशीर सहाय्यक',
    navSources: 'कायदे व कलमे',
    navSimilarCases: 'समान प्रकरणे',
    navComplaints: 'तक्रारी',
    navDrafting: 'कायदेशीर नोटीस मसुदा',
    navEfir: 'ई-एफआयआर मार्गदर्शन',
    navVoice: 'आवाज सहाय्यक',
    helplineNalsa: 'नालसा मोफत कायदेशीर मदत 15100',
    selectLanguage: 'भाषा',
    newComplaint: 'नवीन तक्रार',
    statusActionRequired: 'कारवाई आवश्यक',
    statusVerified: 'पडताळणी पूर्ण',
    statusMissing: 'महत्त्वाचा पुरावा आवश्यक',
    statusReviewNeeded: 'पुनरावलोकन आवश्यक',
    evidenceDossier: 'पुरावे संच',
    statutoryDeadline: 'वैधानिक मुदत',
    askAssistantPlaceholder: 'या प्रकरणाबद्दल किंवा कायद्यांविषयी विचारा...',
    summarizeCase: 'प्रकरणाचा सारांश',
    currentStatus: 'सद्यस्थिती',
    missingItems: 'अपूर्ण कागदपत्रे',
    latestUpdate: 'नवीनतम माहिती',
    nextLegalSteps: 'पुढील कायदेशीर पाऊल',
    applicableLaws: 'लागू कायदे',
    send: 'पाठवा',
    disclaimer: 'भारतीय कायद्यावर आधारित मार्गदर्शन. वकीलांच्या अधिकृत सल्ल्याची जागा घेत नाही.',
    inspectWhyLawApplies: 'कायदा कसा लागू होतो ते तपासा',
    statutoryAssessment: 'वैधानिक मूल्यांकन',
    aiAdvisory: 'प्रकरण सल्लागार',
    quickInquiries: 'त्वरित प्रश्न:',
    chatAssistantTitle: 'लीगल साथी सहाय्यक',
    chatAssistantSubtitle: 'प्रकरण विधी सल्ला',
    reviewingCaseLaw: 'कायद्यांचा व तथ्यांचा आढावा घेत आहे...'
  },
  Tamil: {
    brandName: 'லீகல் சாதி',
    tagline: 'இந்திய குடிமக்களுக்கான ஆதார அடிப்படையிலான சட்ட உதவியாளர்',
    navDashboard: 'முகப்பு பலகை',
    navChat: 'சட்ட உதவியாளர்',
    navSources: 'சட்டங்கள் & பிரிவுகள்',
    navSimilarCases: 'ஒத்த வழக்குகள்',
    navComplaints: 'புகார்கள்',
    navDrafting: 'சட்ட அறிவிப்பு வரைவு',
    navEfir: 'இ-எஃப்ஐஆர் வழிகாட்டுதல்',
    navVoice: 'குரல் உதவியாளர்',
    helplineNalsa: 'நல்சா இலவச சட்ட உதவி 15100',
    selectLanguage: 'மொழி',
    newComplaint: 'புதிய புகார்',
    statusActionRequired: 'நடவடிக்கை தேவை',
    statusVerified: 'சரிபார்க்கப்பட்டது',
    statusMissing: 'முக்கிய ஆவணம் தேவை',
    statusReviewNeeded: 'மறுஆய்வு தேவை',
    evidenceDossier: 'ஆதார ஆவணங்கள்',
    statutoryDeadline: 'சட்டப்பூர்வ காலக்கெடு',
    askAssistantPlaceholder: 'இந்த வழக்கு அல்லது சட்ட விதிகள் பற்றி கேளுங்கள்...',
    summarizeCase: 'வழக்கு சுருக்கம்',
    currentStatus: 'தற்போதைய நிலை',
    missingItems: 'விடுபட்ட ஆவணங்கள்',
    latestUpdate: 'சமீபத்திய புதுப்பிப்பு',
    nextLegalSteps: 'அடுத்த சட்ட நடவடிக்கை',
    applicableLaws: 'பொருந்தக்கூடிய சட்டங்கள்',
    send: 'அனுப்பு',
    disclaimer: 'இந்திய சட்டத்தை அடிப்படையாகக் கொண்ட வழிகாட்டுதல். வழக்கறிஞர் ஆலோசனைக்கு மாற்றாகாது.',
    inspectWhyLawApplies: 'சட்டம் எவ்வாறு பொருந்துகிறது என்பதைப் பாருங்கள்',
    statutoryAssessment: 'சட்ட மதிப்பீடு',
    aiAdvisory: 'வழக்கு ஆலோசனை',
    quickInquiries: 'விரைவு வினவல்கள்:',
    chatAssistantTitle: 'லீகல் சாதி உதவியாளர்',
    chatAssistantSubtitle: 'வழக்கு சட்ட ஆலோசனை',
    reviewingCaseLaw: 'சட்டங்கள் மற்றும் உண்மைகளை ஆய்வு செய்கிறது...'
  },
  Bengali: {
    brandName: 'লিগ্যাল সাথী',
    tagline: 'ভারতীয় নাগরিকদের জন্য প্রমাণ-ভিত্তিক আইনি সহায়ক',
    navDashboard: 'ড্যাশবোর্ড',
    navChat: 'আইনি সহায়ক',
    navSources: 'আইন ও ধারা',
    navSimilarCases: 'সদৃশ নজির',
    navComplaints: 'অভিযোগ',
    navDrafting: 'আইনি নোটিশ খসড়া',
    navEfir: 'ই-এফআইআর নির্দেশিকা',
    navVoice: 'ভয়েস সহকারী',
    helplineNalsa: 'নালসা বিনামূল্যে আইনি সহায়তা 15100',
    selectLanguage: 'ভাষা',
    newComplaint: 'নতুন অভিযোগ',
    statusActionRequired: 'পদক্ষেপ প্রয়োজন',
    statusVerified: 'যাচাইকৃত • সংগৃহীত',
    statusMissing: 'জরুরী প্রমাণ অনুপস্থিত',
    statusReviewNeeded: 'পর্যালোচনা প্রয়োজন',
    evidenceDossier: 'প্রমাণ নথি',
    statutoryDeadline: 'আইনি সময়সীমা',
    askAssistantPlaceholder: 'এই মামলা বা প্রযোজ্য ধারা সম্পর্কে জিজ্ঞাসা করুন...',
    summarizeCase: 'মামলার সারসংক্ষেপ',
    currentStatus: 'বর্তমান অবস্থা',
    missingItems: 'অনুপস্থিত নথি',
    latestUpdate: 'সর্বশেষ আপডেট',
    nextLegalSteps: 'পরবর্তী আইনি পদক্ষেপ',
    applicableLaws: 'প্রযোজ্য আইনসমূহ',
    send: 'পাঠান',
    disclaimer: 'ভারতীয় আইনের উপর ভিত্তি করে নির্দেশিকা। আইনজীবীর বিকল্প নয়।',
    inspectWhyLawApplies: 'আইন কেন প্রযোজ্য তা পরীক্ষা করুন',
    statutoryAssessment: 'আইনি মূল্যায়ন',
    aiAdvisory: 'মামলা এআই পরামর্শ',
    quickInquiries: 'দ্রুত প্রশ্ন:',
    chatAssistantTitle: 'লিগ্যাল সাথী সহকারী',
    chatAssistantSubtitle: 'মামলা আইনি পরামর্শ',
    reviewingCaseLaw: 'আইন ও তথ্য পর্যালোচনা করা হচ্ছে...'
  },
  Telugu: {
    brandName: 'లీగల్ సాథీ',
    tagline: 'భారతీయ పౌరుల కోసం సాక్ష్యాధారిత చట్టపరమైన సహచరుడు',
    navDashboard: 'డ్యాష్‌బోర్డ్',
    navChat: 'చట్టపరమైన సహాయకుడు',
    navSources: 'చట్టాలు మరియు సెక్షన్లు',
    navSimilarCases: 'సారూప్య కేసులు',
    navComplaints: 'ఫిర్యాదులు',
    navDrafting: 'లీగల్ నోటీసు డ్రాఫ్ట్',
    navEfir: 'ఇ-ఎఫ్ఐఆర్ మార్గదర్శకత్వం',
    navVoice: 'వాయిస్ అసిస్టెంట్',
    helplineNalsa: 'నల్సా ఉచిత న్యాయ సహాయం 15100',
    selectLanguage: 'భాష',
    newComplaint: 'కొత్త ఫిర్యాదు',
    statusActionRequired: 'చర్య అవసరం',
    statusVerified: 'ధృవీకరించబడింది',
    statusMissing: 'ముఖ్యమైన పత్రం లేదు',
    statusReviewNeeded: 'సమీక్ష అవసరం',
    evidenceDossier: 'సాక్ష్యాల దస్త్రం',
    statutoryDeadline: 'చట్టపరమైన గడువు',
    askAssistantPlaceholder: 'ఈ విషయం లేదా వర్తించే చట్టాల గురించి అడగండి...',
    summarizeCase: 'కేసు సారాంశం',
    currentStatus: 'ప్రస్తుత స్థితి',
    missingItems: 'మిగిలిన పత్రాలు',
    latestUpdate: 'తాజా సమాచారం',
    nextLegalSteps: 'తదుపరి చట్టపరమైన చర్య',
    applicableLaws: 'వర్తించే చట్టాలు',
    send: 'పంపండి',
    disclaimer: 'భారతీయ చట్టంపై ఆధారపడిన మార్గదర్శకత్వం. న్యాయవాది సలహాకు ప్రత్యామ్నాయం కాదు.',
    inspectWhyLawApplies: 'చట్టం ఎందుకు వర్తిస్తుందో చూడండి',
    statutoryAssessment: 'చట్టపరమైన అంచనా',
    aiAdvisory: 'కేసు సలహా',
    quickInquiries: 'శీఘ్ర విచారణలు:',
    chatAssistantTitle: 'లీగల్ సాథీ సహాయకుడు',
    chatAssistantSubtitle: 'కేసు చట్టపరమైన సలహా',
    reviewingCaseLaw: 'చట్టాలు మరియు వాస్తవాలను సమీక్షిస్తోంది...'
  },
  Gujarati: {
    brandName: 'લીગલ સાથી',
    tagline: 'ભારતીય નાગરિકો માટે પુરાવા-આધારિત કાનૂની સહાયક',
    navDashboard: 'ડેશબોર્ડ',
    navChat: 'કાનૂની સહાયક',
    navSources: 'કાયદા અને કલમો',
    navSimilarCases: 'સમાન કેસો',
    navComplaints: 'ફરિયાદો',
    navDrafting: 'કાનૂની નોટિસ ડ્રાફ્ટ',
    navEfir: 'ઈ-એફઆઈઆર માર્ગદર્શન',
    navVoice: 'અવાજ સહાયક',
    helplineNalsa: 'નાલસા મફત કાનૂની સહાય 15100',
    selectLanguage: 'ભાષા',
    newComplaint: 'નવી ફરિયાદ',
    statusActionRequired: 'પગલાં જરૂરી',
    statusVerified: 'ચકાસાયેલ પુરાવો',
    statusMissing: 'મહત્વપૂર્ણ દસ્તાવેજ ખૂટે છે',
    statusReviewNeeded: 'સમીક્ષા જરૂરી',
    evidenceDossier: 'પુરાવા સંગ્રહ',
    statutoryDeadline: 'કાનૂની સમયમર્યાદા',
    askAssistantPlaceholder: 'આ કેસ અથવા લાગુ કાયદા વિશે પૂછો...',
    summarizeCase: 'કેસ સારાંશ',
    currentStatus: 'હાલની સ્થિતિ',
    missingItems: 'ખૂટતા દસ્તાવેજો',
    latestUpdate: 'નવીનતમ અપડેટ',
    nextLegalSteps: 'આગામી કાનૂની પગલું',
    applicableLaws: 'લાગુ પડતા કાયદા',
    send: 'મોકલો',
    disclaimer: 'ભારતીય કાયદા પર આધારિત માર્ગદર્શન. વકીલની સલાહનો વિકલ્પ નથી.',
    inspectWhyLawApplies: 'કાયદો શા માટે લાગુ પડે છે તે જુઓ',
    statutoryAssessment: 'કાનૂની મૂલ્યાંકન',
    aiAdvisory: 'કેસ સલાહકાર',
    quickInquiries: 'ઝડપી પ્રશ્નો:',
    chatAssistantTitle: 'લીગલ સાથી સહાયક',
    chatAssistantSubtitle: 'કેસ કાનૂની સલાહ',
    reviewingCaseLaw: 'કાયદાઓ અને હકીકતોની સમીક્ષા કરી રહ્યું છે...'
  },
  Kannada: {
    brandName: 'ಲೀಗಲ್ ಸಾಥಿ',
    tagline: 'ಭಾರತೀಯ ನಾಗರಿಕರಿಗೆ ಸಾಕ್ಷ್ಯ-ಆಧಾರಿತ ಕಾನೂನು ಸಹಾಯಕ',
    navDashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    navChat: 'ಕಾನೂನು ಸಹಾಯಕ',
    navSources: 'ಕಾನೂನುಗಳು ಮತ್ತು ಸೆಕ್ಷನ್‌ಗಳು',
    navSimilarCases: 'ಹಿಂದಿನ ಪ್ರಕರಣಗಳು',
    navComplaints: 'ದೂರುಗಳು',
    navDrafting: 'ಕಾನೂನು ನೋಟಿಸ್ ಕರಡು',
    navEfir: 'ಇ-ಎಫ್‌ಐಆರ್ ಮಾರ್ಗದರ್ಶನ',
    navVoice: 'ಧ್ವನಿ ಸಹಾಯಕ',
    helplineNalsa: 'ನಾಲ್ಸಾ ಉಚಿತ ಕಾನೂನು ನೆರವು 15100',
    selectLanguage: 'ಭಾಷೆ',
    newComplaint: 'ಹೊಸ ದೂರು',
    statusActionRequired: 'ಕ್ರಮ ಅಗತ್ಯವಿದೆ',
    statusVerified: 'ಪರಿಶೀಲಿಸಲಾಗಿದೆ',
    statusMissing: 'ಪ್ರಮುಖ ದಾಖಲೆ ಕಾಣೆಯಾಗಿದೆ',
    statusReviewNeeded: 'ಪರಿಶೀಲನೆ ಅಗತ್ಯವಿದೆ',
    evidenceDossier: 'ಸಾಕ್ಷ್ಯಾಧಾರ ದಾಖಲೆಗಳು',
    statutoryDeadline: 'ಕಾನೂನುಬದ್ಧ ಗಡುವು',
    askAssistantPlaceholder: 'ಈ ಪ್ರಕರಣ ಅಥವಾ ಅನ್ವಯವಾಗುವ ಕಾನೂನುಗಳ ಬಗ್ಗೆ ಕೇಳಿ...',
    summarizeCase: 'ಪ್ರಕರಣದ ಸಾರಾಂಶ',
    currentStatus: 'ಪ್ರಸ್ತುತ ಸ್ಥಿತಿ',
    missingItems: 'ಅಗತ್ಯ ದಾಖಲೆಗಳು',
    latestUpdate: 'ಇತ್ತೀಚಿನ ಅಪ್ಡೇಟ್',
    nextLegalSteps: 'ಮುಂದಿನ ಕಾನೂನು ಕ್ರಮ',
    applicableLaws: 'ಅನ್ವಯವಾಗುವ ಕಾನೂನುಗಳು',
    send: 'ಕಳುಹಿಸಿ',
    disclaimer: 'ಭಾರತೀಯ ಕಾನೂನಿನ ಆಧಾರದ ಮೇಲೆ ಮಾರ್ಗದರ್ಶನ. ವಕೀಲರ ಸಲಹೆಗೆ ಪರ್ಯಾಯವಲ್ಲ.',
    inspectWhyLawApplies: 'ಕಾನೂನು ಏಕೆ ಅನ್ವಯಿಸುತ್ತದೆ ಎಂಬುದನ್ನು ಪರಿಶೀಲಿಸಿ',
    statutoryAssessment: 'ಕಾನೂನು ಮೌಲ್ಯಮಾಪನ',
    aiAdvisory: 'ಪ್ರಕರಣ ಸಲಹೆಗಾರ',
    quickInquiries: 'ತ್ವರಿತ ವಿಚಾರಣೆಗಳು:',
    chatAssistantTitle: 'ಲೀಗಲ್ ಸಾಥಿ ಸಹಾಯಕ',
    chatAssistantSubtitle: 'ಪ್ರಕರಣ ಕಾನೂನು ಸಲಹೆ',
    reviewingCaseLaw: 'ಕಾನೂನುಗಳು ಮತ್ತು ಸತ್ಯಗಳನ್ನು ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ...'
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

export function getTranslations(lang?: string): TranslationDictionary {
  if (lang && lang in TRANSLATIONS) {
    return TRANSLATIONS[lang as SupportedLanguage];
  }
  return TRANSLATIONS.English;
}
