'use client';

import React from 'react';
import Link from 'next/link';
import { useLegalSaathi } from '../../context/LegalSaathiContext';
import { CaseContextBanner } from '../../components/CaseContextBanner';
import { ActionCenterCard, ActionCardData } from '../../components/ActionCenterCard';

export default function ActionCenterPage() {
  const { activeCase } = useLegalSaathi();
  const currentCase = activeCase;
  const currentCaseId = currentCase?.id || 'LS-2026-0042';

  const ACTIONS: ActionCardData[] = [
    {
      id: 'action-legal-notice',
      title: 'Prepare Statutory Legal Notice',
      badge: 'Immediate Recourse',
      icon: 'mail',
      colorScheme: 'primary',
      isUrgent: true,
      whatItDoes:
        'Generates a formal demand notice citing statutory provisions under Indian law (Model Tenancy Act / RERA / Consumer Protection Act) giving the opposite party a mandatory 15-day cure window.',
      whenItIsUseful:
        'When you have made informal requests (messages/calls) that were ignored or refused, and you need a legally recognized pre-litigation demand before approaching courts or tribunals.',
      informationNeeded: [
        'Recipient complete name, postal address, and contact details',
        'Amount demanded or specific performance sought',
        'Summary of transaction dates and breach chronology',
        'Copy of contract or payment receipts'
      ],
      whatToExpect:
        'A formal printable PDF / text document ready for dispatch via Registered Post with Acknowledgment Due (AD). Demonstrates good faith before tribunals.',
      ctaText: 'Prepare Legal Notice',
      ctaUrl: '/draft/legal-notice'
    },
    {
      id: 'action-evidence',
      title: 'Review Case Evidence Dossier',
      badge: 'Fact Grounding',
      icon: 'inventory_2',
      colorScheme: 'secondary',
      whatItDoes:
        'A dedicated evidence locker to audit collected proofs, upload missing documents, and verify proof strength before serving legal notices or filing complaints.',
      whenItIsUseful:
        'Whenever you are unsure if your records (payment receipts, key handover acknowledgments, emails, photos) are sufficient to substantiate your claims.',
      informationNeeded: [
        'Bank account statements / NEFT / UPI transaction references',
        'Registered lease deed or Builder-Buyer Agreement',
        'Written notices and correspondence logs'
      ],
      whatToExpect:
        'A categorized proof inventory with clear statuses (Collected, Missing, Needs Review) so you enter legal processes with complete documentation.',
      ctaText: 'Review Evidence Locker',
      ctaUrl: `/cases/${currentCaseId}/evidence`
    },
    {
      id: 'action-rti',
      title: 'RTI Application Assistant',
      badge: 'Government Records',
      icon: 'find_in_page',
      colorScheme: 'amber',
      whatItDoes:
        'Helps draft a targeted application under Section 6(1) of the Right to Information Act, 2005 to obtain certified government files, inspection reports, and municipal approvals within 30 days.',
      whenItIsUseful:
        'When an opposing party claims government delay (e.g. builder blaming fire department, seller claiming pending municipal approval, or delayed police inquiry).',
      informationNeeded: [
        'Name of Public Authority (Ministry, Municipal Corporation, Bank)',
        'Specific documents or file notings sought',
        'Relevant time period of records'
      ],
      whatToExpect:
        'A compliant formatted RTI application ready to be filed online via rtionline.gov.in with a ₹10 fee or sent via Registered Post.',
      ctaText: 'Start RTI Assistant',
      ctaUrl: '/draft/rti'
    },
    {
      id: 'action-dlsa',
      title: 'DLSA Free Legal Aid & Counsel',
      badge: 'Statutory Right',
      icon: 'balance',
      colorScheme: 'emerald',
      whatItDoes:
        'Guides citizens on accessing free legal representation, panel advocates, and court fee waivers under the Legal Services Authorities Act, 1987.',
      whenItIsUseful:
        'When you cannot afford a private lawyer or qualify under statutory criteria (women, children, SC/ST, persons with disability, or income below State limit).',
      informationNeeded: [
        'Identity proof (Aadhaar or Voter ID)',
        'Income declaration or category documentation',
        'Case summary docket prepared by Legal Saathi'
      ],
      whatToExpect:
        'Clear roadmap to your local District Court DLSA Front Office, NALSA 15100 helpline guidance, and formatted case brief export.',
      ctaText: 'Explore Legal Aid & DLSA',
      ctaUrl: '/dlsa'
    },
    {
      id: 'action-efir',
      title: 'e-FIR Assistance & Crime Reporting',
      badge: 'Police Guidance',
      icon: 'local_police',
      colorScheme: 'indigo',
      whatItDoes:
        'Structures incident facts, dates, suspect particulars, and financial transaction trails into a formal written representation compliant with Lalita Kumari Supreme Court precedent.',
      whenItIsUseful:
        'When dealing with cognizable financial fraud, online identity theft, unauthorized account debits, or criminal breach of trust.',
      informationNeeded: [
        'Occurrence date, time, and exact territorial jurisdiction',
        'Suspect identifiers (phone numbers, account details, URLs)',
        'Chronological sequence of events and loss amount'
      ],
      whatToExpect:
        'Pre-formatted complaint draft with direct links to the National Cyber Crime Reporting Portal (1930 / cybercrime.gov.in) and State Police e-FIR portals.',
      ctaText: 'Get e-FIR Guidance',
      ctaUrl: '/actions/efir'
    },
    {
      id: 'action-voice',
      title: 'Voice-First Legal Intake',
      badge: 'Multilingual Voice',
      icon: 'mic',
      colorScheme: 'secondary',
      whatItDoes:
        'Allows citizens to explain new legal grievances or additional case developments naturally in Hindi, English, Tamil, Marathi, Bengali, or Telugu using speech.',
      whenItIsUseful:
        'When typing is inconvenient or you prefer speaking in your regional mother tongue to capture complex nuances.',
      informationNeeded: [
        'Your voice description of what occurred and who was involved'
      ],
      whatToExpect:
        'Real-time transcription with citizen verification before facts are structured into the active legal docket.',
      ctaText: 'Speak to Legal Saathi',
      ctaUrl: '/voice'
    }
  ];

  return (
    <div className="w-full min-h-screen bg-background text-on-surface pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
        {/* Navigation Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-on-surface-variant">
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className="text-primary dark:text-primary-fixed hover:text-secondary font-semibold transition-colors"
            >
              Dashboard
            </Link>
            <span>/</span>
            <Link
              href={currentCase ? `/cases/${currentCase.id}` : '/complaints'}
              className="text-primary dark:text-primary-fixed hover:text-secondary font-semibold transition-colors"
            >
              {currentCase ? `Case #${currentCase.id}` : 'Cases'}
            </Link>
            <span>/</span>
            <span className="text-on-surface font-bold">Action Center</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-secondary"></span>
            <span className="font-mono text-xs">Citizen Next Steps Matrix</span>
          </div>
        </div>

        {/* Case Context Banner */}
        <CaseContextBanner currentActionTitle="Action Center — Choosing Practical Remedies" />

        {/* Header Hero */}
        <div className="bg-surface-container-lowest dark:bg-[#0F131C] rounded-2xl p-6 sm:p-8 shadow-sm border border-outline-variant/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-3xl">
            <span className="text-[10px] font-bold text-secondary uppercase tracking-wider font-mono bg-secondary-fixed text-on-secondary-fixed-variant px-2.5 py-0.5 rounded-full">
              PRACTICAL CIVIL ACTION
            </span>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-primary dark:text-primary-fixed tracking-tight mt-1.5">
              Action Center — What Can You Do Next?
            </h1>
            <p className="text-xs sm:text-sm text-on-surface-variant mt-2 leading-relaxed">
              Transition from legal understanding into confident, concrete next steps. Select the legal remedy that fits
              your dispute stage—from serving formal demand notices and securing public records to accessing free legal aid
              or filing cyber reporting.
            </p>
          </div>

          <Link
            href="/sources"
            className="px-4 py-2.5 rounded-xl bg-surface-container-low dark:bg-[#161F30] hover:bg-surface-container-high border border-outline-variant/40 text-on-surface text-xs font-semibold flex items-center gap-1.5 shrink-0 self-start md:self-auto transition-colors"
          >
            <span className="material-symbols-outlined text-sm text-secondary">gavel</span>
            <span>Explore Legal Sources</span>
          </Link>
        </div>

        {/* Action Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ACTIONS.map((action) => (
            <ActionCenterCard key={action.id} action={action} />
          ))}
        </div>

        {/* Civic Safety Advice */}
        <div className="bg-amber-50 dark:bg-amber-950/40 rounded-2xl p-5 border border-amber-500/30 text-xs text-amber-900 dark:text-amber-300 leading-relaxed flex items-start gap-3">
          <span className="material-symbols-outlined text-amber-600 text-xl shrink-0 mt-0.5">verified_user</span>
          <div>
            <strong className="font-bold uppercase tracking-wider block mb-0.5">
              Legal Saathi Action Principle:
            </strong>
            Legal Saathi structures documents and outlines statutory rights based on citizen inputs. No action is represented
            as a guaranteed victory or automated tribunal verdict. Always verify formal submissions with an advocate or
            authorized Legal Aid clinic.
          </div>
        </div>
      </div>
    </div>
  );
}
