'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useLegalSaathi } from '../context/LegalSaathiContext';
import { useAuth } from '../context/AuthContext';
import { SupportedLanguage } from '../lib/i18n/translations';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const { darkMode, toggleDarkMode, language, setLanguage, t } = useLegalSaathi();
  const { user, isAuthenticated, logout } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const isAuthPage = pathname === '/login' || pathname === '/register';

  // S-Tier Specialized Sovereign Gateway Header for Login / Register
  if (isAuthPage) {
    return (
      <header className="w-full bg-white dark:bg-[#0B1120] border-b border-slate-200/80 dark:border-[#1E293B] sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand & Mandate Tagline */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-3 group focus:outline-none">
              {/* Emblem / Logo Icon */}
              <div className="w-10 h-10 rounded-xl bg-[#0C1B33] dark:bg-[#1E293B] text-white flex items-center justify-center shadow-sm">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white leading-none">
                    Legal Saathi
                  </span>
                </div>
                <span className="text-[10px] font-bold tracking-widest text-slate-500 dark:text-slate-400 uppercase mt-0.5 block">
                  CIVIC SOVEREIGN GATEWAY
                </span>
              </div>
            </Link>

            {/* Constitutional Mandate Badge */}
            <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50/80 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-800/50 text-blue-700 dark:text-blue-400 text-xs font-semibold">
              <svg className="w-4 h-4 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path
                  clipRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  fillRule="evenodd"
                />
              </svg>
              <span>Article 39A: Equal Justice &amp; Free Legal Aid Mandate</span>
            </div>
          </div>

          {/* Right Navigation Items & Quick Helplines */}
          <div className="flex items-center gap-3">
            {/* NALSA Helpline Pill */}
            <a
              href="tel:15100"
              className="hidden md:flex items-center gap-2 bg-blue-50/90 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-800/60 px-3 py-1 rounded-lg text-xs"
              title="Call NALSA Free Legal Aid Helpline"
            >
              <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></div>
              <div>
                <span className="text-[9px] block text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider leading-none">
                  NALSA 24/7 HELPLINE
                </span>
                <span className="text-xs font-extrabold text-blue-900 dark:text-blue-200 tracking-wide">
                  15100
                </span>
              </div>
            </a>

            {/* Language Pill Selector */}
            <div className="flex items-center bg-slate-100 dark:bg-[#1E293B] rounded-lg p-0.5 text-xs font-semibold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setLanguage('English')}
                className={`px-2 py-0.5 rounded transition-all ${
                  language === 'English'
                    ? 'bg-white dark:bg-[#0B1120] text-slate-900 dark:text-white shadow-xs'
                    : 'hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLanguage('Hindi')}
                className={`px-2 py-0.5 rounded transition-all ${
                  language === 'Hindi'
                    ? 'bg-white dark:bg-[#0B1120] text-slate-900 dark:text-white shadow-xs'
                    : 'hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                HI
              </button>
            </div>

            {/* Theme / Mode Toggle Icon */}
            <button
              onClick={toggleDarkMode}
              aria-label="Toggle Theme"
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              type="button"
            >
              <span className="material-symbols-outlined text-lg leading-none">
                {darkMode ? 'light_mode' : 'dark_mode'}
              </span>
            </button>

            {/* Segmented Portal Tabs */}
            <nav className="hidden sm:flex items-center gap-1 bg-slate-100/90 dark:bg-[#1E293B] p-1 rounded-xl text-xs font-semibold border border-slate-200/70 dark:border-slate-700">
              <Link
                href="/login"
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  pathname === '/login' || pathname === '/register'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Citizen Portal
              </Link>
              <Link
                href="/login?role=advocate"
                className="px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Advocate Sign-in
              </Link>
              <Link
                href="/dlsa"
                className="hidden lg:inline-block px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Legal Aid Enrollment
              </Link>
            </nav>

            {/* Civic Emblem Avatar */}
            <Link
              href="/"
              className="w-8 h-8 rounded-full border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#161F30] flex items-center justify-center p-1 text-slate-700 dark:text-slate-300 hover:text-blue-600 transition-colors"
              title="Return to Public Home"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z" />
              </svg>
            </Link>
          </div>
        </div>
      </header>
    );
  }

  // Standard Header for Main Application Pages
  const navLinks = [
    { name: t.navHome, href: '/' },
    { name: t.navMyMatters, href: '/complaints' },
    { name: t.navLegalAssistant, href: '/chat' },
    { name: t.navCaseWorkspace, href: '/cases/LS-2026-0042' },
  ];

  const userInitials = user?.name
    ? user.name
        .split(' ')
        .map((p) => p[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'KR';

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-surface/95 dark:bg-[#0F131C]/95 backdrop-blur-md shadow-sm border-b border-outline-variant/30 dark:border-[#1E293B]">
      <div className="h-20 w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 max-w-7xl mx-auto">
        {/* Left: Brand & Nav */}
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-secondary rounded-lg"
          >
            <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-white dark:bg-[#161F30] shadow-sm overflow-hidden p-0.5 shrink-0 border border-outline-variant/30 dark:border-[#1E293B]">
              <Image
                src="/legal-saathi-logo.png"
                alt="Legal Saathi Logo"
                width={44}
                height={44}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-heading text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                  Legal Saathi
                </span>
                <span className="hidden lg:inline-flex items-center px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50 text-[10px] tracking-wider uppercase font-semibold">
                  Civic Legal Assistant
                </span>
              </div>
              <span className="text-xs text-on-surface-variant font-medium">Civil Justice Guidance</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-1.5 p-1 rounded-xl bg-surface-container-low dark:bg-[#161F30] border border-transparent dark:border-[#1E293B]">
            {navLinks.map((link) => {
              const isActive =
                link.href === '/'
                  ? pathname === '/'
                  : pathname?.startsWith(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm font-bold'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high dark:hover:bg-[#1E293B]'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: Helpline, Language, Theme, Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* NALSA Helpline */}
          <a
            href="tel:15100"
            title="Call Free Legal Aid Helpline"
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container-lowest dark:bg-[#161F30] shadow-sm border border-outline-variant/30 dark:border-[#1E293B] hover:border-blue-500 transition-colors"
          >
            <span className="material-symbols-outlined text-emerald-600 text-lg">phone_in_talk</span>
            <div className="flex flex-col">
              <span className="text-[10px] text-on-surface-variant leading-none">Free Legal Aid</span>
              <span className="text-xs text-slate-900 dark:text-white font-bold leading-tight">NALSA 15100</span>
            </div>
          </a>

          {/* Language Selector Dropdown */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-surface-container-low dark:bg-[#161F30] border border-transparent dark:border-[#1E293B] hover:bg-surface-container-high text-on-surface text-xs font-medium transition-colors"
              type="button"
            >
              <span className="material-symbols-outlined text-sm">translate</span>
              <span>{language}</span>
              <span className="material-symbols-outlined text-sm text-on-surface-variant">expand_more</span>
            </button>
            {langOpen && (
              <div className="absolute right-0 mt-1 w-44 bg-surface-container-lowest dark:bg-[#0F131C] rounded-lg shadow-lg border border-outline-variant/30 dark:border-[#1E293B] py-1 z-50 text-xs max-h-64 overflow-y-auto">
                {(
                  [
                    { name: 'English', label: 'English' },
                    { name: 'Hindi', label: 'हिन्दी (Hindi)' },
                    { name: 'Marathi', label: 'मराठी (Marathi)' },
                    { name: 'Tamil', label: 'தமிழ் (Tamil)' },
                    { name: 'Bengali', label: 'বাংলা (Bengali)' },
                    { name: 'Telugu', label: 'తెలుగు (Telugu)' },
                    { name: 'Gujarati', label: 'ગુજરાતી (Gujarati)' },
                    { name: 'Kannada', label: 'ಕನ್ನಡ (Kannada)' },
                  ] as Array<{ name: SupportedLanguage; label: string }>
                ).map((l) => (
                  <button
                    key={l.name}
                    type="button"
                    onClick={() => {
                      setLanguage(l.name);
                      setLangOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 hover:bg-surface-container-high dark:hover:bg-[#161F30] text-on-surface ${
                      language === l.name ? 'font-bold text-blue-600 dark:text-blue-400' : ''
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            aria-label="Toggle Light and Dark Mode"
            className="flex items-center justify-center w-9 h-9 rounded-lg bg-surface-container-low dark:bg-[#161F30] border border-transparent dark:border-[#1E293B] hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-lg">
              {darkMode ? 'light_mode' : 'dark_mode'}
            </span>
          </button>

          {/* Citizen Authentication Section */}
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 pl-2 border-l border-outline-variant/30 dark:border-[#1E293B] focus:outline-none"
                type="button"
              >
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                  {userInitials}
                </div>
                <div className="hidden lg:flex flex-col text-left">
                  <span className="text-xs text-on-surface font-semibold leading-tight">
                    {user.name}
                  </span>
                  <span className="text-[10px] text-on-surface-variant leading-none capitalize">
                    {user.role.toLowerCase().replace('_', ' ')}
                  </span>
                </div>
                <span className="material-symbols-outlined text-sm text-on-surface-variant hidden lg:inline-block">
                  expand_more
                </span>
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-surface-container-lowest dark:bg-[#0F131C] rounded-xl shadow-xl border border-outline-variant/30 dark:border-[#1E293B] py-2 z-50">
                  <div className="px-4 py-2 border-b border-outline-variant/20 dark:border-[#1E293B]">
                    <p className="text-xs font-bold text-on-surface">{user.name}</p>
                    <p className="text-[11px] text-on-surface-variant truncate">{user.email}</p>
                    {user.docketId && (
                      <span className="mt-1 inline-block text-[10px] font-mono font-semibold text-blue-600 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded">
                        Docket: {user.docketId}
                      </span>
                    )}
                  </div>
                  <Link
                    href="/complaints"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs text-on-surface hover:bg-surface-container-high dark:hover:bg-[#161F30]"
                  >
                    <span className="material-symbols-outlined text-sm">folder_open</span>
                    My Complaints
                  </Link>
                  <Link
                    href={`/cases/${user.docketId || 'LS-2026-0042'}`}
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs text-on-surface hover:bg-surface-container-high dark:hover:bg-[#161F30]"
                  >
                    <span className="material-symbols-outlined text-sm">gavel</span>
                    Active Case Workspace
                  </Link>
                  <div className="border-t border-outline-variant/20 dark:border-[#1E293B] my-1"></div>
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-left font-semibold"
                  >
                    <span className="material-symbols-outlined text-sm">logout</span>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 pl-2 border-l border-outline-variant/30 dark:border-[#1E293B]">
              <Link
                href="/login"
                className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">login</span>
                <span>Sign In</span>
              </Link>
            </div>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden flex items-center justify-center w-9 h-9 rounded-lg bg-surface-container-low dark:bg-[#161F30] border border-transparent dark:border-[#1E293B] text-on-surface-variant hover:text-on-surface"
            aria-label="Open Navigation Menu"
          >
            <span className="material-symbols-outlined text-xl">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-surface dark:bg-[#0F131C] border-t border-outline-variant/30 dark:border-[#1E293B] px-4 py-3 space-y-2">
          {navLinks.map((link) => {
            const isActive =
              link.href === '/'
                ? pathname === '/'
                : pathname?.startsWith(link.href);
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm font-semibold ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low dark:hover:bg-[#161F30]'
                }`}
              >
                {link.name}
              </Link>
            );
          })}

          <div className="pt-2 border-t border-outline-variant/30 dark:border-[#1E293B] space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant px-3">
              Action & Legal Tools
            </span>
            <div className="grid grid-cols-2 gap-1 px-1 pt-1">
              <Link
                href="/actions"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-on-surface-variant hover:bg-surface-container-low flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm text-secondary">bolt</span>
                <span>Actions</span>
              </Link>
              <Link
                href="/sources"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-on-surface-variant hover:bg-surface-container-low flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm text-primary dark:text-primary-fixed">gavel</span>
                <span>Sources</span>
              </Link>
              <Link
                href="/dlsa"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-on-surface-variant hover:bg-surface-container-low flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm text-emerald-600">balance</span>
                <span>Legal Aid</span>
              </Link>
              <Link
                href="/voice"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-on-surface-variant hover:bg-surface-container-low flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm text-amber-600">mic</span>
                <span>Voice</span>
              </Link>
              <Link
                href="/similar-cases"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-on-surface-variant hover:bg-surface-container-low flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm text-primary">groups</span>
                <span>Similar Cases</span>
              </Link>
              <Link
                href="/privacy/consent"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-on-surface-variant hover:bg-surface-container-low flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm text-emerald-600">security</span>
                <span>Privacy & Consent</span>
              </Link>
            </div>
          </div>
          <div className="pt-2 border-t border-outline-variant/30 flex items-center justify-between text-xs text-on-surface-variant">
            <span>Helpline: NALSA 15100</span>
            <a href="tel:15100" className="text-secondary font-bold">Call Now</a>
          </div>
        </div>
      )}
    </header>
  );
};
