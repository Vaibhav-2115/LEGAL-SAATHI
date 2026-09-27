# Master Project Specifications — Legal Saathi

**Document Version:** 1.0.0  
**Project:** Legal Saathi (AI-Powered Indian Legal Assistance Platform)  
**Target Audience:** Indian Citizens, Legal Aid Advocates, DLSA Officers, and Developers  
**Last Updated:** September 2026  
**Status:** Canonical Project Specification  

---

## 1. Problem Statement & Mission

India's judicial system faces an unprecedented backlog of over 4.5 crore pending disputes. Over 70% of disputes involving common citizens—such as landlord security deposit deductions, arbitrary builder possession delays, defective consumer electronics, withheld salaries, and unresolved municipal grievances—could be resolved or settled prior to formal litigation if citizens had:
1. Immediate knowledge of their specific statutory rights under Indian law.
2. Timely guidance on documentary evidence required to prove their claim.
3. Accessible, court-ready statutory demand notices with clear compliance windows.
4. Transparent connections to pro-bono District Legal Services Authorities (DLSA).

**Legal Saathi** bridges this critical access-to-justice gap by providing a free, multilingual, AI-grounded legal assistant that translates citizen grievances into verifiable statutory dockets.

---

## 2. Comprehensive 15 Legal Domains Taxonomy

Legal Saathi classifies, assesses, and drafts documentation across 15 recognized Indian legal categories:

### 2.1. Property & Housing — Builder Delay & Real Estate (`property_rera`)
* **Primary Statutes:** Real Estate (Regulation and Development) Act, 2016 (Sections 18, 19, 31); Consumer Protection Act, 2019.
* **Core Rights:** Statutory monthly delayed possession interest until actual handover; full refund with interest upon withdrawal; compensation for structural defects within 5 years.
* **Key Evidence:** Builder-Buyer Agreement (BBA), payment receipts, bank disbursement statements, possession delay letters.
* **Remedies:** Formal Section 18 RERA Demand Notice, State RERA Authority complaint, Consumer Commission filing.

### 2.2. Property & Housing — Landlord & Tenant (`tenancy`)
* **Primary Statutes:** Model Tenancy Act, 2021 (Sections 10, 11, 13, 20); Transfer of Property Act, 1882 (Sections 106, 108); State Rent Control Acts.
* **Core Rights:** Maximum 2 months rent security deposit for residential premises; mandatory refund within 30 days of premises vacation; prohibition on cutting essential utilities (water, power) without Rent Authority orders.
* **Key Evidence:** Lease deed, bank transfer receipts, notice of vacation, handover correspondence.
* **Remedies:** 15-Day Section 106 Statutory Demand Notice, Rent Authority grievance.

### 2.3. Consumer Protection & E-Commerce (`consumer`)
* **Primary Statutes:** Consumer Protection Act, 2019 (Sections 2(11), 2(47), 35, 38); Consumer Protection (E-Commerce) Rules, 2020.
* **Core Rights:** Compensation for deficiency in goods or services; relief from unfair trade practices (false advertising, refusal to refund); e-commerce seller liability.
* **Key Evidence:** Tax invoices, warranty cards, delivery receipts, customer support chat/email records.
* **Remedies:** 15-Day Consumer Dispute Notice, National Consumer Helpline (1915), e-Daakhil filing.

### 2.4. Employment & Labour Law (`labor`)
* **Primary Statutes:** Code on Wages, 2019; Payment of Wages Act, 1936; Industrial Disputes Act, 1947 (Section 33C(2)); Maternity Benefit Act, 1961.
* **Core Rights:** Wages must be paid by the 7th or 10th of following month; protection against arbitrary salary withholding; statutory gratuity and notice pay upon termination.
* **Key Evidence:** Appointment letter, salary slips, bank statements, resignation/termination correspondence.
* **Remedies:** 15-Day Wage Demand Notice, recovery petition before Labour Commissioner under Section 33C.

### 2.5. Cybercrime & Digital Fraud (`cyber_fraud`)
* **Primary Statutes:** Information Technology Act, 2000 (Sections 43, 66C, 66D); Bharatiya Nyaya Sanhita, 2023 (Section 318 - Cheating); RBI Customer Liability Guidelines (2017).
* **Core Rights:** Zero liability for unauthorized third-party transactions reported within 3 days without customer fault; prompt freezing of fraudulent beneficiary accounts.
* **Key Evidence:** Bank statements, UPI transaction IDs, SMS alerts, scammer phone numbers/chat logs.
* **Remedies:** Immediate Golden Hour call to National Cyber Crime Helpline **1930**, cybercrime.gov.in reporting, bank dispute filing.

### 2.6. Financial & Banking Disputes (`banking_finance`)
* **Primary Statutes:** Negotiable Instruments Act, 1881 (Section 138); RBI Integrated Ombudsman Scheme, 2021.
* **Core Rights:** Right to demand payment for dishonoured cheque within 30 days; protection against unlawful harassment by debt recovery agents.
* **Key Evidence:** Cheque return memo, original cheque, bank statement, written loan agreement.
* **Remedies:** 30-Day Section 138 NI Act Statutory Notice, RBI Banking Ombudsman complaint.

### 2.7. Government Services & Public Grievances (`government_public`)
* **Primary Statutes:** Right to Information Act, 2005 (Sections 6(1), 7(1), 19); State Public Service Delivery Acts.
* **Core Rights:** Any citizen may request public information with Rs. 10 fee; mandatory 30-day decision deadline; right to First Appeal.
* **Key Evidence:** Tracking number, application copy, previous letters.
* **Remedies:** Section 6(1) RTI Application, Section 19(1) First Appeal.

### 2.8. Family & Personal Law (`family_domestic`)
* **Primary Statutes:** Protection of Women from Domestic Violence Act, 2005; Bharatiya Nagarik Suraksha Sanhita, 2023 (Section 144 - Maintenance); Personal Marriage Laws.
* **Core Rights:** Immediate protection orders, residence orders, interim monetary relief.

### 2.9. Criminal Law & Personal Safety (`criminal`)
* **Primary Statutes:** Bharatiya Nyaya Sanhita, 2023 (BNS); Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS); BSA 2023.
* **Core Rights:** Mandatory registration of FIR under BNSS Section 173 for cognizable offenses; zero FIR provisions.

### 2.10. Women & Child Protection (`women_child`)
* **Primary Statutes:** Sexual Harassment of Women at Workplace Act, 2013 (POSH); POCSO Act, 2012.

### 2.11. Civil & Contractual Disputes (`civil_contract`)
* **Primary Statutes:** Indian Contract Act, 1872 (Sections 73, 74); Specific Relief Act, 1963.

### 2.12. Education & Student Rights (`education`)
* **Primary Statutes:** UGC (Grievance Redressal) Regulations; Consumer Protection Act, 2019.

### 2.13. Identity, Benefits & Social Welfare (`welfare_identity`)
* **Primary Statutes:** Aadhaar Act, 2016; National Food Security Act, 2013; Employees' Pension Scheme, 1995.

### 2.14. Healthcare & Medical Services (`healthcare`)
* **Primary Statutes:** Consumer Protection Act, 2019; Clinical Establishments Act, 2010.

### 2.15. Free Legal Aid (`legal_aid`)
* **Primary Statutes:** Legal Services Authorities Act, 1987 (Section 12); Constitution of India (Article 39A).

---

## 3. Core Functional Modules Specifications

### 3.1. Ask Legal Saathi Inline Interface
* **Auto-Resizing Textarea:** Starts at 72px and auto-expands up to 220px cleanly.
* **Keyboard Shortcuts:** `Enter` submits; `Shift + Enter` inserts a newline.
* **Clickable Suggested Inquiries:** Clicking any suggestion populates the input, auto-grows the box, and focuses the cursor.
* **Structured Response Renderer:** Displays Direct Answer, Governing Statutory Provisions, Recommended Procedural Steps, Clickable Citations, and Non-Courtroom Advisory Disclaimer directly beneath the query.
* **Error Recovery:** Preserves the user's input with a 1-click **Retry** button if a network or server failure occurs.
* **Conversational Follow-Up:** Supports continuous turns with context preservation and a "New Question" reset option.

### 3.2. Case Dossier & Workspace
* **Case Creation:** Automatically extracts incident facts, opposing parties, claimed amounts, and jurisdiction.
* **Evidence Management:** Upload, categorize (Agreement, Receipt, Communication, Photo), and track verification status (`NEEDED`, `REVIEW_NEEDED`, `VERIFIED`).
* **Timeline Engine:** Visual chronological sequence of incident occurrences, demand notices served, and statutory deadlines.
* **Fact-to-Law Traceability:** Interactive visual mapping demonstrating which facts satisfy the legal elements of cited statutory sections.

### 3.3. Legal Notice Parameter Engine & Preview
* **Dynamic Parameters Form:**
  * Sender details (Name, Address, Contact)
  * Recipient details (Name, Designation, Company, Address)
  * Dispute Details (Incident date, Claimed amount in INR, Cure period in days)
  * Factual summary and statutory grounds
  * Specific demands list (Refund, compensation, interest, legal costs)
* **Court-Ready Document Preview:** Formatted with speed post/registered AD headers, legal salutations, numbered paragraphs, and advocate/citizen signature lines.
* **AI-Assisted Revision:** Natural language prompt editor allowing users to instruct changes (e.g., *"Make the tone more firm and demand 18% statutory interest"*), with side-by-side diff comparisons.
* **Manual Editor:** Direct text editor with word/character counts, undo/redo, and version history saving.

---

## 4. Data Models & Schemas

### 4.1. Chat Request & Response
```typescript
interface ChatRequest {
  text: string;
  session_id?: string;
  case_id?: string;
  lang?: string; // 'en' | 'hi' | 'mr' | 'ta' | 'bn' | 'te' | 'gu' | 'kn'
}

interface ChatResponse {
  answer: string;
  citations: Citation[];
  confidence: 'strong' | 'partial' | 'insufficient';
  suggested_action: SuggestedAction;
  session_id: string;
  case_id?: string;
  issue_type: string;
  urgency: 'low' | 'medium' | 'high' | 'emergency';
  disclaimer: string;
}

interface Citation {
  source_id: string;
  title: string;
  section_ref: string;
  excerpt: string;
  relevance_score?: number;
  jurisdiction?: string;
  official_link?: string;
}
```

### 4.2. Legal Notice Draft Model
```typescript
interface LegalNoticeDraft {
  id?: string;
  caseId: string;
  documentType: 'LEGAL_NOTICE' | 'RERA_COMPLAINT' | 'LABOUR_NOTICE' | 'CONSUMER_NOTICE' | 'CYBER_COMPLAINT';
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
  projectDetails?: {
    projectName?: string;
    unitNumber?: string;
    agreementDate?: string;
  };
}
```
