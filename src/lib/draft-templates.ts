import { LegalCase, LegalNoticeDraft, DraftVersion } from './types';
import { detectCaseDomain } from './rules-engine';

/**
 * Generates formatted full text for a formal legal document based on draft particulars.
 */
export function generateFullNoticeText(draft: LegalNoticeDraft, caseId: string): string {
  const demandsList = draft.demands
    .map((d, i) => `  ${i + 1}. ${d}`)
    .join('\n');

  let domainSpecificSection = '';

  if (draft.projectDetails?.projectName) {
    domainSpecificSection = `
PROJECT & ALLOTMENT PARTICULARS:
• Project Name: ${draft.projectDetails.projectName}
• Unit / Apartment No.: ${draft.projectDetails.unitNumber || 'Allotted Unit'}
• Agreement for Sale / BBA Date: ${draft.projectDetails.agreementDate || 'Executed Agreement'}
• Committed Possession Date: ${draft.projectDetails.promisedPossessionDate || 'Statutory Timeline'}
• RERA Registration No.: ${draft.projectDetails.reraRegistrationNumber || 'Registered on State RERA Portal'}
`;
  } else if (draft.employmentDetails?.employeeDesignation) {
    domainSpecificSection = `
EMPLOYMENT & SALARY PARTICULARS:
• Employee Designation: ${draft.employmentDetails.employeeDesignation}
• Unpaid Salary Period: ${draft.employmentDetails.unpaidPeriod || 'Claimed Period'}
• Monthly Emoluments: ${draft.employmentDetails.monthlySalary || 'As per Contract'}
• Total Amount Unlawfully Withheld: ${draft.employmentDetails.totalSalaryClaimed || draft.demandedAmount}
`;
  } else if (draft.cyberDetails?.transactionReference) {
    domainSpecificSection = `
UNAUTHORIZED ELECTRONIC TRANSACTION PARTICULARS:
• Transaction Reference / UTR: ${draft.cyberDetails.transactionReference}
• Platform / Channel: ${draft.cyberDetails.platformName || 'Electronic Banking / UPI'}
• Incident Date & Time: ${draft.cyberDetails.incidentTime || draft.incidentDate}
• National Cyber Crime Portal Docket: ${draft.cyberDetails.reportingAuthority || 'Registered via Helpline 1930'}
`;
  } else if (draft.consumerDetails?.orderReference) {
    domainSpecificSection = `
CONSUMER TRANSACTION & INVOICE PARTICULARS:
• Merchant / Service Provider: ${draft.consumerDetails.sellerName || draft.recipientName}
• Order / Invoice Reference: ${draft.consumerDetails.orderReference}
• Date of Purchase: ${draft.consumerDetails.purchaseDate || draft.incidentDate}
• Nature of Defect / Non-Conformity: ${draft.consumerDetails.defectSummary || 'Deficiency in Service'}
`;
  }

  return `FORMAL STATUTORY LEGAL NOTICE
SENT UNDER THE PROVISIONS OF INDIAN STATUTORY LAW
Matter Docket: #${caseId}
Date: ${draft.incidentDate || new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}

TO (RECIPIENT / OPPOSITE PARTY):
${draft.recipientName}${draft.recipientDesignation ? `\n${draft.recipientDesignation}` : ''}
${draft.recipientAddress}${draft.recipientEmail ? `\nEmail: ${draft.recipientEmail}` : ''}

FROM (AGGRIEVED PARTY / SENDER):
${draft.senderName}
${draft.senderAddress}

SUBJECT: Formal Demand Notice under ${draft.statutoryBasis} regarding ${draft.demandedAmount ? `Disputed Claim of ${draft.demandedAmount}` : 'Statutory Redressal'}.

Sir / Madam,

Under instructions from my own account as the aggrieved citizen, I hereby serve upon you this formal statutory legal notice setting forth the following material facts, legal violations, and mandatory requisitions:

1. STATEMENT OF MATERIAL FACTS:
${draft.factsSummary}
${domainSpecificSection}
2. STATUTORY BASIS, VIOLATIONS & LEGAL LIABILITY:
Your actions and continued omission directly contravene the mandatory provisions of ${draft.statutoryBasis}. Under established Indian jurisprudence, where a counterparty causes wrongful financial loss or acts in breach of statutory covenants, the aggrieved party is lawfully entitled to full restitution, interest at commercial lending rates, and all consequential damages.

3. FORMAL REQUISITIONS & DEMANDS:
You are hereby called upon to satisfy and execute the following demands within a peremptory period of ${draft.curePeriodDays || 15} (fifteen) days from the receipt of this notice:

${demandsList}

TAKE FURTHER NOTICE that if you fail to comply with the requisitions set forth hereinabove within the stipulated period of ${draft.curePeriodDays || 15} days, I shall be constrained to initiate appropriate civil, consumer, regulatory, or criminal proceedings before the competent court, authority, or tribunal having territorial and subject-matter jurisdiction over this matter, at your sole risk, cost, and legal consequence.

Yours faithfully,

___________________________
${draft.senderName}
(Aggrieved Party / Complainant)
Address: ${draft.senderAddress}
Copy retained for official filing and tribunal production.`;
}

/**
 * Builds a dynamic, domain-tailored LegalNoticeDraft for a given LegalCase.
 */
export function buildCaseSpecificDraft(c: LegalCase, existingDraft?: LegalNoticeDraft): LegalNoticeDraft {
  if (existingDraft && existingDraft.fullDocumentText) {
    return existingDraft;
  }

  const domain = detectCaseDomain(c);
  const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });

  let draft: LegalNoticeDraft;

  switch (domain) {
    case 'property_rera':
      draft = {
        id: `draft-${c.id}`,
        caseId: c.id,
        documentType: 'RERA_COMPLAINT',
        recipientName: 'Apex Infrastructure & Housing Pvt. Ltd.',
        recipientDesignation: 'Managing Director / Authorized Representative',
        recipientAddress: c.jurisdiction ? `Project Site & Corporate Office, ${c.jurisdiction}` : 'Sector 82, Gurugram, Haryana - 122002',
        recipientEmail: 'regulatory.notices@apexdevelopments.in',
        senderName: 'Aggrieved Allottee',
        senderAddress: 'Apartment Allottee, Residing in ' + (c.jurisdiction || 'Gurugram, Haryana'),
        incidentDate: today,
        demandedAmount: c.claimAmount || '₹18,50,000 (Delay Interest & Principal)',
        curePeriodDays: 15,
        factsSummary: c.citizenStatement || 'The allottee executed a Builder-Buyer Agreement and completed scheduled milestone payments. However, the promoter has failed to deliver physical possession within the committed timeline and has not secured an Occupancy Certificate.',
        statutoryBasis: 'Section 18 of the Real Estate (Regulation and Development) Act, 2016 (RERA)',
        demands: [
          'Pay statutory delayed possession interest at SBI highest marginal cost of funds plus 2% per annum for every month of delay from the committed date till actual handover.',
          'Furnish certified copies of the fire safety NOC and application for Occupancy Certificate filed with the competent town planning authority.',
          'Cease and withdraw all unilateral escalation invoices and maintenance charges billed prior to lawful handover.',
          'Execute a registered conveyance deed and deliver vacant possession within the statutory notice period.'
        ],
        projectDetails: {
          projectName: c.title.includes('Sector') || c.title.includes('Tower') ? c.title : 'Apex Regal Enclave',
          unitNumber: 'Apartment Flat No. B-804',
          agreementDate: '15th March 2022',
          promisedPossessionDate: '31st July 2024',
          reraRegistrationNumber: 'HRERA-PKL-GGM-882-2021'
        },
        version: 1
      };
      break;

    case 'employment':
      draft = {
        id: `draft-${c.id}`,
        caseId: c.id,
        documentType: 'LABOUR_NOTICE',
        recipientName: 'TechnoCore Global Systems India Pvt. Ltd.',
        recipientDesignation: 'Director & Head of Human Resources',
        recipientAddress: c.jurisdiction ? `Corporate Facility, ${c.jurisdiction}` : 'Plot 24, Udyog Vihar Phase IV, Gurugram, Haryana - 122016',
        recipientEmail: 'hr.grievance@technocoreglobal.in',
        senderName: 'Aggrieved Employee',
        senderAddress: 'House 42, Sector 15, ' + (c.jurisdiction || 'Gurugram'),
        incidentDate: today,
        demandedAmount: c.claimAmount || '₹2,40,000',
        curePeriodDays: 15,
        factsSummary: c.citizenStatement || 'The employee rendered professional services under a valid employment contract. The employer has arbitrarily withheld earned wages for multiple consecutive months without statutory cause or written notice.',
        statutoryBasis: 'Section 15 & Section 18 of the Code on Wages, 2019 and Payment of Wages Act, 1936',
        demands: [
          'Immediately remit the outstanding earned wages of ' + (c.claimAmount || '₹2,40,000') + ' directly to the employee salary bank account.',
          'Furnish authenticated pay slips, Form 16 Part A/B, and PF contribution transfer confirmation.',
          'Issue an unconditional experience cum relieving certificate confirming tenure and designation.',
          'Pay statutory interest at 18% per annum for the period of illegal withholding.'
        ],
        employmentDetails: {
          employeeDesignation: 'Senior Systems Engineer',
          unpaidPeriod: 'November 2025 – January 2026 (3 months)',
          monthlySalary: '₹80,000',
          totalSalaryClaimed: c.claimAmount || '₹2,40,000'
        },
        version: 1
      };
      break;

    case 'cybercrime':
      draft = {
        id: `draft-${c.id}`,
        caseId: c.id,
        documentType: 'CYBER_COMPLAINT',
        recipientName: 'Nodal Grievance Officer, Apex Commercial Bank Ltd.',
        recipientDesignation: 'Principal Nodal Officer / Fraud Risk Management Wing',
        recipientAddress: 'Corporate Office, Bandra Kurla Complex, Mumbai - 400051',
        recipientEmail: 'nodal.grievance@apexbank.co.in',
        senderName: 'Aggrieved Account Holder',
        senderAddress: 'Citizen Address, ' + (c.jurisdiction || 'Delhi NCR'),
        incidentDate: today,
        demandedAmount: c.claimAmount || '₹85,000',
        curePeriodDays: 15,
        factsSummary: c.citizenStatement || 'An unauthorized electronic banking debit was executed from the citizen account without user consent or two-factor authentication compliance. The matter was reported to bank customer support and helpline 1930 within the zero-liability notification period.',
        statutoryBasis: 'Section 43A & 66D Information Technology Act, 2000 and RBI Master Directions on Customer Liability in Unauthorised Electronic Banking Transactions',
        demands: [
          'Immediately grant shadow credit and restore the disputed sum of ' + (c.claimAmount || '₹85,000') + ' to the account under RBI guidelines.',
          'Furnish full technical transaction logs, IP address tracing, and payment aggregator merchant details.',
          'Liaise with the receiving entity to freeze the beneficiary account in coordination with the National Cyber Crime Portal.'
        ],
        cyberDetails: {
          platformName: 'UPI Instant Payment Channel',
          transactionReference: 'UPI/AXB/20260210/88129304',
          incidentTime: '10 Feb 2026, 14:15 IST',
          reportingAuthority: 'National Cyber Crime Portal Acknowledgement #1930-2026-44812'
        },
        version: 1
      };
      break;

    case 'consumer':
      draft = {
        id: `draft-${c.id}`,
        caseId: c.id,
        documentType: 'CONSUMER_NOTICE',
        recipientName: 'CloudMart Retail India Private Limited',
        recipientDesignation: 'Customer Grievance Redressal Officer & Managing Director',
        recipientAddress: c.jurisdiction ? `Regional Fulfillment Center, ${c.jurisdiction}` : 'Cyber Hub, DLF Phase 2, Gurugram, Haryana - 122002',
        recipientEmail: 'grievance.desk@cloudmartretail.in',
        senderName: 'Aggrieved Consumer',
        senderAddress: 'House 55, ' + (c.jurisdiction || 'South Delhi - 110017'),
        incidentDate: today,
        demandedAmount: c.claimAmount || '₹45,000',
        curePeriodDays: 15,
        factsSummary: c.citizenStatement || 'The consumer purchased product/services against full advance consideration. The goods delivered were inherently defective/inoperative, and the vendor refused to provide warranty replacement or refund.',
        statutoryBasis: 'Section 35 and Section 2(11) of the Consumer Protection Act, 2019',
        demands: [
          'Refund the complete purchase amount of ' + (c.claimAmount || '₹45,000') + ' through original payment mode.',
          'Arrange collection and return shipping of the defective merchandise at company cost.',
          'Pay ₹15,000 towards mental agony, customer distress, and administrative costs.'
        ],
        consumerDetails: {
          sellerName: 'CloudMart Electronics Division',
          orderReference: 'ORD-IN-2026-884129',
          purchaseDate: '15th January 2026',
          defectSummary: 'Complete hardware power failure within 72 hours; service center claimed lack of spare parts.'
        },
        version: 1
      };
      break;

    case 'tenancy':
    default:
      draft = {
        id: `draft-${c.id}`,
        caseId: c.id,
        documentType: 'LEGAL_NOTICE',
        recipientName: 'Ramesh Chandra (Landlord / Lessor)',
        recipientDesignation: 'Property Owner / Lessor',
        recipientAddress: c.jurisdiction ? `Rental Premises, ${c.jurisdiction}` : 'Flat 402, Block C, Heritage Enclave, Saket, South Delhi - 110017',
        recipientEmail: 'notices@oppositeparty.com',
        senderName: 'Rahul Sharma (Tenant / Lessee)',
        senderAddress: 'House 88, Green Park Extension, New Delhi - 110016',
        incidentDate: today,
        demandedAmount: c.claimAmount || '₹65,000',
        curePeriodDays: 15,
        factsSummary: c.citizenStatement || 'The tenant completed the agreed lease covenants, surrendered physical possession, and handed over keys. The landlord has withheld the security deposit without furnishing an itemized statement of deductions or contractor invoices within statutory timelines.',
        statutoryBasis: 'Section 11(2) & 11(3) Model Tenancy Act, 2021 and Section 73 Indian Contract Act, 1872',
        demands: [
          'Immediately refund the full security deposit sum of ' + (c.claimAmount || '₹65,000') + ' via bank transfer.',
          'Furnish an itemized, verified statement of lawful deductions (if any) supported by original receipts.',
          'Pay statutory interest at 9% per annum from the date of key handover till actual realization.',
          'Pay ₹10,000 towards harassment, mental agony, and cost of this legal notice.'
        ],
        version: 1
      };
      break;
  }

  // Generate full text
  const fullText = generateFullNoticeText(draft, c.id);
  draft.fullDocumentText = fullText;

  const initialVersion: DraftVersion = {
    version: 1,
    content: fullText,
    source: 'initial',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    notes: 'Initial draft generated from case facts and statutory citations'
  };

  draft.versions = [initialVersion];
  return draft;
}
