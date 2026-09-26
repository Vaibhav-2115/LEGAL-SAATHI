'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useLegalSaathi } from '../context/LegalSaathiContext';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const { darkMode, toggleDarkMode } = useLegalSaathi();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('English');

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'My Complaints', href: '/complaints' },
    { name: 'Legal Assistant', href: '/chat' },
    { name: 'Case Workspace', href: '/cases/LS-2026-0042' }
  ];

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
              <span>{currentLang}</span>
              <span className="material-symbols-outlined text-sm text-on-surface-variant">expand_more</span>
            </button>
            {langOpen && (
              <div className="absolute right-0 mt-1 w-36 bg-surface-container-lowest dark:bg-[#0F131C] rounded-lg shadow-lg border border-outline-variant/30 dark:border-[#1E293B] py-1 z-50 text-xs">
                {['English', 'हिन्दी (Hindi)', 'தமிழ் (Tamil)', 'বাংলা (Bengali)'].map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => {
                      setCurrentLang(l.split(' ')[0]);
                      setLangOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-surface-container-high dark:hover:bg-[#161F30] text-on-surface"
                  >
                    {l}
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

          {/* Notification Bell */}
          <button
            aria-label="View Notifications"
            className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-surface-container-low dark:bg-[#161F30] border border-transparent dark:border-[#1E293B] hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-lg">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-error ring-2 ring-surface dark:ring-[#0F131C]"></span>
          </button>

          {/* Citizen Profile Avatar */}
          <div className="flex items-center gap-2 pl-1 border-l border-outline-variant/30 dark:border-[#1E293B]">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
              KR
            </div>
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs text-on-surface font-semibold leading-tight">Citizen Portal</span>
              <span className="text-[10px] text-on-surface-variant leading-none">Kavitha R.</span>
            </div>
          </div>

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
