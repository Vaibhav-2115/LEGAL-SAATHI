'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export const Footer: React.FC = () => {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/register';

  if (isAuthPage) {
    return (
      <footer className="w-full bg-white dark:bg-[#0B1120] border-t border-slate-200/80 dark:border-[#1E293B] py-4 px-4 text-slate-500 dark:text-slate-400 text-xs mt-auto">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
          {/* Statutory notice */}
          <div className="flex items-center gap-2">
            <span>Constitution of India • Article 39A Statutory Free Legal Services Notice</span>
          </div>
          {/* DPDP Act Compliance */}
          <div>
            <span>Digital Personal Data Protection Act (DPDP) 2023 Sovereign Compliant</span>
          </div>
          {/* Copyright & SSL Info */}
          <div className="flex items-center gap-4">
            <span>© 2025 National Legal Services Network • Bharat</span>
            <div className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
              <svg className="w-3.5 h-3.5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                <path clipRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" fillRule="evenodd" />
              </svg>
              <span>256-Bit Sovereign SSL</span>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="w-full bg-surface-container-low dark:bg-[#090D16] border-t border-outline-variant/30 dark:border-[#1E293B] py-10 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        {/* Top Disclaimer Banner */}
        <div className="p-4 rounded-xl bg-surface-container-lowest dark:bg-[#0F131C] border border-outline-variant/30 dark:border-[#1E293B] text-xs text-on-surface-variant flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-lg">info</span>
          </div>
          <div className="flex-1">
            <strong className="text-on-surface font-semibold">Civic Legal Guidance Notice:</strong>{' '}
            Legal Saathi provides automated statutory information, evidence checklists, and procedural guidance based on Indian acts and regulations. It is designed to demystify law for citizens and does not substitute for a qualified advocate. If you qualify for free legal representation under Article 39A, contact your State or District Legal Services Authority (DLSA) or dial toll-free <strong>15100</strong>.
          </div>
        </div>

        {/* Footer Navigation & Credits */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-t border-outline-variant/20 dark:border-[#1E293B] text-xs text-on-surface-variant">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white dark:bg-[#161F30] shadow-sm overflow-hidden p-0.5 shrink-0 flex items-center justify-center border border-outline-variant/30 dark:border-[#1E293B]">
              <Image src="/legal-saathi-logo.png" alt="Legal Saathi Logo" width={32} height={32} className="w-full h-full object-contain" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-bold text-primary dark:text-white">Legal Saathi</span>
              <span>• Built for Indian Civil Justice Accessibility</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Link href="/" className="hover:text-primary dark:hover:text-blue-400 transition-colors">Home</Link>
            <Link href="/complaints" className="hover:text-primary dark:hover:text-blue-400 transition-colors">My Complaints</Link>
            <Link href="/chat" className="hover:text-primary dark:hover:text-blue-400 transition-colors">Legal Assistant</Link>
            <Link href="/sources" className="hover:text-primary dark:hover:text-blue-400 transition-colors">Legal Sources</Link>
            <Link href="/dlsa" className="hover:text-primary dark:hover:text-blue-400 transition-colors">DLSA Legal Aid</Link>
            <a href="https://nalsa.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-primary dark:hover:text-blue-400 transition-colors">
              NALSA Portal ↗
            </a>
          </div>

          <div className="text-[11px]">
            © {new Date().getFullYear()} Legal Saathi • Civic Trust & Clarity
          </div>
        </div>
      </div>
    </footer>
  );
};
