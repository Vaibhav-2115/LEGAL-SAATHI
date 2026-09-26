'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getSafeCallbackUrl } from '@/lib/auth/redirect';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawCallbackUrl = searchParams.get('callbackUrl');
  const callbackUrl = getSafeCallbackUrl(rawCallbackUrl, '/dashboard');
  const urlError = searchParams.get('error');

  const { login } = useAuth();

  // Form inputs
  const [email, setEmail] = useState('rajesh.kumar@example.com');
  const [password, setPassword] = useState('secretPassword123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [interactiveMode, setInteractiveMode] = useState<
    'default' | 'focused' | 'validation' | 'loading'
  >('default');

  // Handle interactive mode switcher
  const handleModeChange = (mode: 'default' | 'focused' | 'validation' | 'loading') => {
    setInteractiveMode(mode);
    if (mode === 'validation') {
      setErrorMessage('Please enter a valid citizen email address ending in .gov.in or registered domain.');
    } else if (mode === 'loading') {
      setErrorMessage(null);
    } else {
      setErrorMessage(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    if (!email || !password) {
      setErrorMessage('Please fill in both email and password.');
      setIsSubmitting(false);
      return;
    }

    const result = await login(email, password, rememberMe);

    if (!result.success) {
      setErrorMessage(result.error || 'Authentication failed. Please verify credentials.');
      setIsSubmitting(false);
    } else {
      // Successful login -> route to destination
      router.push(callbackUrl);
      router.refresh();
    }
  };

  const getUrlErrorNotice = () => {
    if (!urlError) return null;
    switch (urlError) {
      case 'OAuthConfigurationRequired':
        return {
          title: 'Google OAuth Setup Required',
          description:
            'Google OAuth requires GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env.local. You can test authentication immediately using the pre-configured demo email/password below or register a new citizen profile.',
        };
      case 'OAuthCancelled':
        return {
          title: 'Sign-in Cancelled',
          description: 'Google sign-in was cancelled. Please try again or sign in with your email.',
        };
      case 'InvalidOAuthState':
        return {
          title: 'Session Security Mismatch',
          description: 'OAuth state verification failed. Please try signing in again.',
        };
      default:
        return {
          title: 'Authentication Notice',
          description: 'Unable to authenticate via external provider. Please use citizen credentials.',
        };
    }
  };

  const errorNotice = getUrlErrorNotice();

  return (
    <div className="w-full flex-grow flex items-center justify-center px-4 py-8 md:py-12">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* BEGIN: Left Brand Statement & Sovereignty Card */}
        <section
          className="lg:col-span-6 bg-white/95 dark:bg-[#0F1422] backdrop-blur-md rounded-2xl border border-slate-200/90 dark:border-[#1E293B] p-6 sm:p-8 shadow-xl shadow-slate-900/5 flex flex-col justify-between min-h-[580px]"
          data-purpose="brand-statement-card"
        >
          <div>
            {/* Header Badge with Logo & Registry Status */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                    />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-base font-extrabold text-slate-900 dark:text-white leading-none">
                      Legal Saathi
                    </span>
                    <span className="text-[10px] font-bold bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded leading-none">
                      PRO
                    </span>
                  </div>
                  <span className="text-[10px] font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase mt-0.5 block">
                    SOVEREIGN CIVIC REGISTRY
                  </span>
                </div>
              </div>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
                Live Node
              </span>
            </div>

            {/* Constitutional Section Pill */}
            <div className="inline-block text-[11px] font-extrabold tracking-wider text-blue-600 dark:text-blue-400 uppercase mb-3">
              CONSTITUTIONAL RIGHT • ART. 39A
            </div>

            {/* Bold Display Heading */}
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight mb-4 font-heading">
              Empowering Citizens with Verifiable Legal Truth.
            </h1>

            {/* Descriptive Body Text */}
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed mb-6 font-normal">
              Instantaneous statutory navigation, verified dispute resolutions, and constitutional
              legal aid dockets delivered with uncompromised encryption.
            </p>

            {/* Interactive Docket Card Box */}
            <div
              className="rounded-xl p-4 sm:p-5 border border-blue-100 dark:border-blue-950/80 bg-gradient-to-b from-[#F8FAFD] to-[#EEF4FC] dark:from-[#131B2E] dark:to-[#0F1626] shadow-inner mb-6"
              data-purpose="statutory-docket-summary"
            >
              {/* Docket Header Row */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800 mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></span>
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    ACTIVE TAMPER-PROOF DOCKET
                  </span>
                </div>
                <span className="text-[11px] font-mono font-semibold text-slate-500 dark:text-slate-400">
                  DOK-#2025-IND-884
                </span>
              </div>

              {/* Title & Confidence Metric */}
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Statutory Aid Verification
                </h3>
                <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80 px-2 py-0.5 rounded-md border border-blue-100 dark:border-blue-900/60">
                  99.8% Confirmed
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 mb-4 overflow-hidden">
                <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '99.8%' }}></div>
              </div>

              {/* SHA-256 Fingerprint Capsule */}
              <div className="flex items-center justify-between bg-white dark:bg-[#161F30] px-3 py-2 rounded-lg border border-slate-200/90 dark:border-slate-700/80 text-xs font-mono text-slate-600 dark:text-slate-300 mb-3.5">
                <div className="flex items-center gap-2 truncate">
                  <svg
                    className="w-3.5 h-3.5 text-slate-400 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      clipRule="evenodd"
                      d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z"
                      fillRule="evenodd"
                    />
                  </svg>
                  <span className="truncate">
                    SHA-256: <strong className="text-slate-800 dark:text-slate-200 font-semibold">8a73b9e5f392...d914</strong>
                  </span>
                </div>
                <svg
                  className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 ml-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    clipRule="evenodd"
                    d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    fillRule="evenodd"
                  />
                </svg>
              </div>

              {/* Court & Queue Sub-details */}
              <div className="grid grid-cols-2 gap-3 text-xs pt-1 border-t border-slate-200/60 dark:border-slate-800">
                <div>
                  <span className="text-slate-400 dark:text-slate-500 block text-[10px] uppercase font-semibold">
                    District Court
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    New Delhi Central
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-slate-500 block text-[10px] uppercase font-semibold">
                    Lok Adalat Queue
                  </span>
                  <span className="font-bold text-blue-700 dark:text-blue-400">
                    Priority #04
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Left Column Footer Status */}
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  clipRule="evenodd"
                  d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  fillRule="evenodd"
                />
              </svg>
              <span className="font-medium text-slate-600 dark:text-slate-300">
                DPDP Act (2023) Protected
              </span>
            </div>
            <span className="font-mono text-[11px] text-slate-400 dark:text-slate-500">
              NODE 11-DELHI-SEC
            </span>
          </div>
        </section>
        {/* END: Left Brand Statement */}

        {/* BEGIN: Right Citizen Login Card */}
        <section
          className="lg:col-span-6 bg-white dark:bg-[#0F1422] rounded-2xl border border-slate-200 dark:border-[#1E293B] p-6 sm:p-8 shadow-xl shadow-slate-900/5"
          data-purpose="citizen-login-form"
        >
          {/* Interactive Mode Switcher Pill */}
          <div className="flex items-center justify-between mb-5 bg-slate-50/80 dark:bg-[#161F30] p-1.5 rounded-xl border border-slate-200/80 dark:border-slate-800">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 pl-2">
              INTERACTIVE MODE
            </span>
            <div className="flex items-center gap-1 text-xs font-semibold">
              {(['default', 'focused', 'validation', 'loading'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => handleModeChange(mode)}
                  className={`px-2.5 py-1 rounded-lg capitalize transition-all ${
                    interactiveMode === mode
                      ? 'bg-white dark:bg-[#0B1120] text-slate-900 dark:text-white shadow-xs border border-slate-200 dark:border-slate-700'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Login Card Heading */}
          <div className="mb-5">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight font-heading">
              Welcome back
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-normal">
              Sign in to manage your legal demands and court filings.
            </p>
          </div>

          {/* Error Notice Callout */}
          {errorNotice && (
            <div className="mb-4 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs">
              <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold mb-1">
                <span className="material-symbols-outlined text-base">info</span>
                <span>{errorNotice.title}</span>
              </div>
              <p className="text-amber-700 dark:text-amber-400 leading-relaxed font-normal">
                {errorNotice.description}
              </p>
            </div>
          )}

          {errorMessage && (
            <div className="mb-4 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-xs text-rose-800 dark:text-rose-300 flex items-center gap-2">
              <span className="material-symbols-outlined text-base text-rose-600 shrink-0">
                error
              </span>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Google Single Sign-On Button */}
          <a
            href={`/api/auth/google?callbackUrl=${encodeURIComponent(callbackUrl)}`}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-white dark:bg-[#161F30] border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 active:bg-slate-100 transition-all text-sm mb-4 shadow-xs"
          >
            {/* Google Colorful G SVG */}
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                fill="#EA4335"
              />
            </svg>
            <span>Continue with Google</span>
          </a>

          {/* Divider with Label */}
          <div className="relative flex items-center justify-center my-4">
            <div className="border-t border-slate-200 dark:border-slate-800 w-full"></div>
            <span className="bg-white dark:bg-[#0F1422] px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 absolute">
              OR CONTINUE WITH EMAIL
            </span>
          </div>

          {/* Form Elements */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Address Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="email"
                  className="text-xs font-bold text-slate-800 dark:text-slate-200"
                >
                  Email Address
                </label>
                <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50/70 dark:bg-blue-950/60 px-2 py-0.5 rounded border border-blue-100 dark:border-blue-900/50">
                  Registered ID
                </span>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 text-sm font-semibold">
                  @
                </span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.gov.in"
                  className={`block w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm text-slate-800 dark:text-white bg-slate-50/60 dark:bg-[#161F30] border rounded-xl font-medium transition-all focus:bg-white dark:focus:bg-[#1A253A] ${
                    interactiveMode === 'focused'
                      ? 'ring-2 ring-blue-500 border-blue-500 bg-white dark:bg-[#1A253A]'
                      : interactiveMode === 'validation'
                      ? 'border-rose-400 dark:border-rose-600 ring-1 ring-rose-400'
                      : 'border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="text-xs font-bold text-slate-800 dark:text-slate-200"
                >
                  Password
                </label>
                <Link
                  href="/login?error=PasswordResetDemo"
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`block w-full pl-9 pr-10 py-2.5 text-xs sm:text-sm text-slate-800 dark:text-white bg-slate-50/60 dark:bg-[#161F30] border rounded-xl font-mono tracking-widest transition-all focus:bg-white dark:focus:bg-[#1A253A] ${
                    interactiveMode === 'focused'
                      ? 'ring-2 ring-blue-500 border-blue-500 bg-white dark:bg-[#1A253A]'
                      : 'border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                />
                <button
                  type="button"
                  aria-label="Toggle password visibility"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <span className="material-symbols-outlined text-lg leading-none">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Remember Me & Security Indicator */}
            <div className="flex items-center justify-between text-xs pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500 h-4 w-4 bg-white dark:bg-[#161F30]"
                />
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  Remember this device for 30 days
                </span>
              </label>
              <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
                <span>SSL 256</span>
              </div>
            </div>

            {/* Primary Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || interactiveMode === 'loading'}
              className="w-full mt-2 py-3 px-4 bg-[#0C1B33] dark:bg-blue-600 hover:bg-slate-900 dark:hover:bg-blue-700 active:bg-black text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-slate-950/15 group disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting || interactiveMode === 'loading' ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Verifying Credentials...</span>
                </div>
              ) : (
                <>
                  <span>Sign In to Legal Saathi</span>
                  <span className="transition-transform group-hover:translate-x-1 font-bold">→</span>
                </>
              )}
            </button>
          </form>

          {/* Alternate Auth Button / Banner (Instant Mobile OTP) */}
          <button
            type="button"
            onClick={() =>
              alert(
                'Instant Mobile OTP via Sandes / Aadhaar Gateway: In production, this routes via the National Informatics Centre (NIC) SMS gateway. For this prototype, sign in with demo email "rajesh.kumar@example.com" or your registered account.'
              )
            }
            className="w-full mt-4 flex items-center justify-between p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100/90 dark:border-blue-900/50 hover:bg-blue-100/60 dark:hover:bg-blue-950/70 transition-colors group text-left"
          >
            <div className="flex items-center gap-3">
              {/* Wheel Emblem / Aadhaar verification badge */}
              <div className="w-8 h-8 rounded-lg bg-blue-600/10 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                </svg>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block leading-tight">
                  Sign in via Instant Mobile OTP
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  Aadhaar verified / Sandes Gateway
                </span>
              </div>
            </div>
            <span className="text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors font-bold text-sm">
              ›
            </span>
          </button>

          {/* Sign Up Link Row */}
          <div className="text-center mt-4">
            <p className="text-xs text-slate-600 dark:text-slate-400 font-normal">
              Don&apos;t have a verified citizen profile?{' '}
              <Link
                href={`/register?callbackUrl=${encodeURIComponent(callbackUrl)}`}
                className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
              >
                Create one here
              </Link>
            </p>
          </div>

          {/* Legal Sovereign Protection Disclaimer Banner */}
          <div className="mt-5 p-3 rounded-xl bg-slate-50 dark:bg-[#161F30] border border-slate-200/70 dark:border-slate-800 text-center">
            <p className="text-[10px] leading-relaxed text-slate-500 dark:text-slate-400 font-normal">
              Protected by sovereign cryptographic air-gap. By signing in, you agree to our{' '}
              <Link href="/privacy/consent" className="font-medium text-slate-700 dark:text-slate-300 underline">
                Terms of Justice
              </Link>{' '}
              and{' '}
              <Link href="/privacy/consent" className="font-medium text-slate-700 dark:text-slate-300 underline">
                Data Protection Charter
              </Link>
              .
            </p>
          </div>
        </section>
        {/* END: Right Citizen Login Card */}
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[500px] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}
