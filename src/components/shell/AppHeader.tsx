'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLegalSaathi } from '@/context/LegalSaathiContext';
import { useAuth } from '@/context/AuthContext';

interface AppHeaderProps {
  onToggleMobileMenu?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ onToggleMobileMenu }) => {
  const pathname = usePathname();
  const { darkMode, toggleDarkMode, activeCase } = useLegalSaathi();
  const { user, logout } = useAuth();

  const [currentLang, setCurrentLang] = useState<'English' | 'Hindi'>('English');
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const userInitials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'RK';

  const isHomeActive = pathname === '/dashboard';
  const isMattersActive = pathname === '/complaints' || pathname === '/matters';
  const isAssistantActive = pathname === '/chat';
  const isWorkspaceActive = pathname.startsWith('/cases');

  const activeCaseId = activeCase?.id || 'LS-2026-0042';

  return (
    <header className="sticky top-0 z-40 w-full h-16 bg-white/95 dark:bg-[#0B1120]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-[#1E293B] shadow-xs transition-colors">
      <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
        {/* Left: Brand mark & Badge */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Mobile Menu Trigger (Tablet / Mobile) */}
          <button
            type="button"
            onClick={() => {
              if (onToggleMobileMenu) onToggleMobileMenu();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#161F30] transition-colors"
            aria-label="Open Navigation Menu"
          >
            <span className="material-symbols-outlined text-xl">menu</span>
          </button>

          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg group"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#0C1B33] dark:bg-[#1E293B] text-white flex items-center justify-center shadow-xs">
              <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm sm:text-base tracking-tight text-slate-900 dark:text-white leading-none font-heading">
                  Legal Saathi
                </span>
                <span className="hidden xl:inline-block px-1.5 py-0.5 rounded text-[9px] font-extrabold tracking-wider bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 uppercase leading-none">
                  CIVIC LEGAL ASSISTANT
                </span>
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-none mt-0.5 hidden sm:block">
                Civil Justice Guidance
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Clean Horizontal Navigation Bar (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 dark:bg-[#111827] p-1 rounded-full border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          {/* 1. Home */}
          <Link
            href="/dashboard"
            className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all ${
              isHomeActive
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-[#1E293B]/60'
            }`}
          >
            Home
          </Link>

          {/* 2. My Matters */}
          <Link
            href="/complaints"
            className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all ${
              isMattersActive
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-[#1E293B]/60'
            }`}
          >
            My Matters
          </Link>

          {/* 3. Legal Assistant */}
          <Link
            href="/chat"
            className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all ${
              isAssistantActive
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-[#1E293B]/60'
            }`}
          >
            Legal Assistant
          </Link>

          {/* 4. Case Workspace */}
          <Link
            href={`/cases/${activeCaseId}`}
            className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all ${
              isWorkspaceActive
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-[#1E293B]/60'
            }`}
          >
            Case Workspace
          </Link>
        </nav>

        {/* Right: Helpline, Language, Theme, Notifications & User Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* NALSA 15100 Free Legal Aid Callout */}
          <a
            href="tel:15100"
            className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 hover:border-emerald-400 transition-colors shadow-2xs"
            title="Call 24/7 NALSA Free Legal Aid Helpline"
          >
            <span className="material-symbols-outlined text-sm text-emerald-600 dark:text-emerald-400">
              support_agent
            </span>
            <div className="flex flex-col text-left leading-none">
              <span className="text-[9px] font-medium text-emerald-700 dark:text-emerald-400">
                Free Legal Aid
              </span>
              <span className="text-[11px] font-bold font-mono tracking-tight text-emerald-900 dark:text-emerald-200">
                NALSA 15100
              </span>
            </div>
          </a>

          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors"
              aria-label="Select Language"
            >
              <span className="material-symbols-outlined text-sm text-slate-500">translate</span>
              <span>{currentLang}</span>
              <span className="material-symbols-outlined text-xs text-slate-400">arrow_drop_down</span>
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-[#0F1422] rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentLang('English');
                    setLangDropdownOpen(false);
                  }}
                  className={`w-full px-3 py-1.5 text-xs text-left font-medium transition-colors ${
                    currentLang === 'English'
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 font-bold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#161F30]'
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCurrentLang('Hindi');
                    setLangDropdownOpen(false);
                  }}
                  className={`w-full px-3 py-1.5 text-xs text-left font-medium transition-colors ${
                    currentLang === 'Hindi'
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 font-bold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#161F30]'
                  }`}
                >
                  हिन्दी (Hindi)
                </button>
              </div>
            )}
          </div>

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleDarkMode}
            aria-label="Toggle Theme"
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <span className="material-symbols-outlined text-lg leading-none">
              {darkMode ? 'light_mode' : 'dark_mode'}
            </span>
          </button>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors relative"
              aria-label="View notifications"
            >
              <span className="material-symbols-outlined text-lg leading-none">notifications</span>
              {/* Red unread dot */}
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-[#0B1120]" />
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-[#0F1422] rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-3 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white">
                  <span>Notifications</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300">
                    1 Pending
                  </span>
                </div>
                <div className="py-2.5">
                  <div className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                    <span className="material-symbols-outlined text-amber-500 text-base shrink-0 mt-0.5">
                      warning
                    </span>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">
                        DOK: LS-2026-0042
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Key handover photos required under Section 108 TPA within 3 days.
                      </p>
                    </div>
                  </div>
                </div>
                <Link
                  href="/cases/LS-2026-0042/evidence"
                  onClick={() => setNotificationsOpen(false)}
                  className="block text-center text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline pt-2 border-t border-slate-100 dark:border-slate-800"
                >
                  View Evidence Checklist →
                </Link>
              </div>
            )}
          </div>

          {/* User Profile Avatar with Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2 pl-1 sm:pl-2 border-l border-slate-200 dark:border-slate-800 focus:outline-none"
              aria-expanded={profileDropdownOpen}
              aria-haspopup="true"
            >
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                {userInitials}
              </div>
              <div className="hidden xl:flex flex-col text-left">
                <span className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                  {user?.name || 'Rajesh Kumar'}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-none capitalize">
                  {user?.role?.toLowerCase().replace('_', ' ') || 'Citizen'}
                </span>
              </div>
              <span className="material-symbols-outlined text-sm text-slate-400 hidden xl:inline-block">
                expand_more
              </span>
            </button>

            {/* Profile Dropdown Menu */}
            {profileDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-60 bg-white dark:bg-[#0F1422] rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                role="menu"
              >
                <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    {user?.name || 'Rajesh Kumar'}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {user?.email || 'rajesh.kumar@example.com'}
                  </p>
                  <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-[10px] font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                    <span>Role: {user?.role || 'CITIZEN'}</span>
                  </div>
                </div>

                <div className="py-1">
                  <Link
                    href="/complaints"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#161F30]"
                    role="menuitem"
                  >
                    <span className="material-symbols-outlined text-base text-slate-400">
                      folder_open
                    </span>
                    <span>My Matters</span>
                  </Link>

                  <Link
                    href={`/cases/${activeCaseId}`}
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#161F30]"
                    role="menuitem"
                  >
                    <span className="material-symbols-outlined text-base text-slate-400">
                      gavel
                    </span>
                    <span>Case Workspace</span>
                  </Link>

                  <Link
                    href="/privacy/consent"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#161F30]"
                    role="menuitem"
                  >
                    <span className="material-symbols-outlined text-base text-slate-400">
                      security
                    </span>
                    <span>Privacy &amp; DPDP Enclave</span>
                  </Link>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800 my-1"></div>

                <button
                  type="button"
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-left"
                  role="menuitem"
                >
                  <span className="material-symbols-outlined text-base">logout</span>
                  <span>Sign Out of Portal</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Slide-Out Drawer Navigation (When hamburger clicked on small screens) */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-16 z-50 bg-black/40 backdrop-blur-xs flex flex-col justify-start">
          <div className="w-full bg-white dark:bg-[#0B1120] border-b border-slate-200 dark:border-slate-800 p-4 shadow-xl flex flex-col gap-2 animate-in slide-in-from-top duration-150">
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                isHomeActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#161F30]'
              }`}
            >
              <span className="material-symbols-outlined text-lg">dashboard</span>
              <span>Home</span>
            </Link>

            <Link
              href="/complaints"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                isMattersActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#161F30]'
              }`}
            >
              <span className="material-symbols-outlined text-lg">folder_open</span>
              <span>My Matters</span>
            </Link>

            <Link
              href="/chat"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                isAssistantActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#161F30]'
              }`}
            >
              <span className="material-symbols-outlined text-lg">forum</span>
              <span>Legal Assistant</span>
            </Link>

            <Link
              href={`/cases/${activeCaseId}`}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                isWorkspaceActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#161F30]'
              }`}
            >
              <span className="material-symbols-outlined text-lg">gavel</span>
              <span>Case Workspace</span>
            </Link>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
              <a href="tel:15100" className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                <span className="material-symbols-outlined text-base">support_agent</span>
                <span>NALSA 15100</span>
              </a>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="text-rose-600 font-semibold"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
