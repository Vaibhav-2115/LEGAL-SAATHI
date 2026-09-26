'use client';

import React from 'react';

export const AppFooter: React.FC = () => {
  return (
    <footer className="w-full bg-white/80 dark:bg-[#0B1120]/80 border-t border-slate-200/80 dark:border-[#1E293B] py-3 px-4 sm:px-6 text-slate-500 dark:text-slate-400 text-xs mt-auto">
      <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5 text-center sm:text-left text-[11px]">
        {/* Statutory Mandate */}
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
          <span>Article 39A Sovereign Free Legal Aid Support</span>
          <span className="text-slate-300 dark:text-slate-700 hidden md:inline">•</span>
          <span className="hidden md:inline">DPDP Act (2023) Protected</span>
        </div>

        {/* NALSA Helpline & Secure Indicator */}
        <div className="flex items-center gap-3">
          <a
            href="tel:15100"
            className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
          >
            NALSA Helpline: 15100
          </a>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <div className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
            <svg className="w-3.5 h-3.5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
              <path
                clipRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                fillRule="evenodd"
              />
            </svg>
            <span>256-Bit Cryptographic Vault</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
