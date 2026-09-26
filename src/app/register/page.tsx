'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getSafeCallbackUrl } from '@/lib/auth/redirect';

function RegisterFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawCallbackUrl = searchParams.get('callbackUrl');
  const callbackUrl = getSafeCallbackUrl(rawCallbackUrl, '/dashboard');

  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [consentDpdp, setConsentDpdp] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Compute password strength
  const getPasswordStrength = () => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    return score;
  };

  const strength = getPasswordStrength();
  const strengthLabels = ['Too short', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = [
    'bg-slate-200 dark:bg-slate-700',
    'bg-rose-500',
    'bg-amber-500',
    'bg-blue-500',
    'bg-emerald-500',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage('Please enter your full citizen name.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid citizen email address.');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter your password.');
      return;
    }

    if (!consentDpdp) {
      setErrorMessage(
        'You must acknowledge and consent to statutory data handling under the DPDP Act, 2023.'
      );
      return;
    }

    setIsSubmitting(true);

    const result = await register({
      name,
      email,
      password,
      consentDpdp,
    });

    if (!result.success) {
      setErrorMessage(result.error || 'Registration failed. Please try again.');
      setIsSubmitting(false);
    } else {
      router.push(callbackUrl);
      router.refresh();
    }
  };

  return (
    <div className="w-full flex-grow flex items-center justify-center px-4 py-8 md:py-12">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* BEGIN: Left Brand Statement Card */}
        <section
          className="lg:col-span-6 bg-white/95 dark:bg-[#0F1422] backdrop-blur-md rounded-2xl border border-slate-200/90 dark:border-[#1E293B] p-6 sm:p-8 shadow-xl shadow-slate-900/5 flex flex-col justify-between min-h-[580px]"
          data-purpose="brand-statement-card"
        >
          <div>
            {/* Header Badge */}
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
                      REGISTRY
                    </span>
                  </div>
                  <span className="text-[10px] font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase mt-0.5 block">
                    CIVIC ENROLLMENT PORTAL
                  </span>
                </div>
              </div>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
                Secure Registry
              </span>
            </div>

            {/* Constitutional Pill */}
            <div className="inline-block text-[11px] font-extrabold tracking-wider text-blue-600 dark:text-blue-400 uppercase mb-3">
              CONSTITUTIONAL RIGHT • ART. 39A
            </div>

            {/* Bold Display Heading */}
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight mb-4 font-heading">
              Join the Sovereign Civic Justice Network.
            </h1>

            {/* Descriptive Body Text */}
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed mb-6 font-normal">
              Register your citizen profile to unlock personalized legal intake, tamper-proof
              evidence checklists, and direct statutory legal aid guidance under Indian law.
            </p>

            {/* 3 Citizen Guarantees */}
            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-[#161F30] border border-slate-200/80 dark:border-slate-800">
                <span className="material-symbols-outlined text-blue-600 text-lg shrink-0 mt-0.5">
                  shield
                </span>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    DPDP Act 2023 End-to-End Privacy
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                    Your grievances, evidence uploads, and identity records are cryptographically protected.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-[#161F30] border border-slate-200/80 dark:border-slate-800">
                <span className="material-symbols-outlined text-emerald-600 text-lg shrink-0 mt-0.5">
                  balance
                </span>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    Article 39A Constitutional Aid Linkage
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                    Direct integration with District Legal Services Authorities (DLSA) for free representation.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-[#161F30] border border-slate-200/80 dark:border-slate-800">
                <span className="material-symbols-outlined text-amber-600 text-lg shrink-0 mt-0.5">
                  verified
                </span>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    Verifiable Evidence Cryptographic Hashes
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                    Every uploaded agreement and receipt receives a SHA-256 fingerprint for court readiness.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Left Column Footer */}
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
                Verified Citizen Enrollment
              </span>
            </div>
            <span className="font-mono text-[11px] text-slate-400 dark:text-slate-500">
              GATEWAY 04-NATIONAL
            </span>
          </div>
        </section>
        {/* END: Left Brand Statement */}

        {/* BEGIN: Right Citizen Registration Card */}
        <section
          className="lg:col-span-6 bg-white dark:bg-[#0F1422] rounded-2xl border border-slate-200 dark:border-[#1E293B] p-6 sm:p-8 shadow-xl shadow-slate-900/5"
          data-purpose="citizen-registration-form"
        >
          {/* Card Heading */}
          <div className="mb-5">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight font-heading">
              Create citizen profile
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-normal">
              Register to organize complaints, audit evidence, and exercise your statutory rights.
            </p>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-xs text-rose-800 dark:text-rose-300 flex items-center gap-2">
              <span className="material-symbols-outlined text-base text-rose-600 shrink-0">
                error
              </span>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Google Sign-Up Button */}
          <a
            href={`/api/auth/google?callbackUrl=${encodeURIComponent(callbackUrl)}`}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-white dark:bg-[#161F30] border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 active:bg-slate-100 transition-all text-sm mb-4 shadow-xs"
          >
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
            <span>Sign up with Google</span>
          </a>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-4">
            <div className="border-t border-slate-200 dark:border-slate-800 w-full"></div>
            <span className="bg-white dark:bg-[#0F1422] px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 absolute">
              OR REGISTER WITH EMAIL
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Full Name */}
            <div>
              <label
                htmlFor="register-name"
                className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1"
              >
                Full Name
              </label>
              <input
                id="register-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ramesh Chandra"
                className="block w-full px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 dark:text-white bg-slate-50/60 dark:bg-[#161F30] border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white dark:focus:bg-[#1A253A] transition-all"
              />
            </div>

            {/* Email Address */}
            <div>
              <label
                htmlFor="register-email"
                className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1"
              >
                Email Address
              </label>
              <input
                id="register-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="citizen@domain.in"
                className="block w-full px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 dark:text-white bg-slate-50/60 dark:bg-[#161F30] border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white dark:focus:bg-[#1A253A] transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label
                  htmlFor="register-password"
                  className="text-xs font-bold text-slate-800 dark:text-slate-200"
                >
                  Password (min 8 characters)
                </label>
                {password && (
                  <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                    Strength: {strengthLabels[strength]}
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  id="register-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full px-3.5 pr-10 py-2.5 text-xs sm:text-sm text-slate-800 dark:text-white bg-slate-50/60 dark:bg-[#161F30] border border-slate-200 dark:border-slate-700 rounded-xl font-mono tracking-wider focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white dark:focus:bg-[#1A253A] transition-all"
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

              {/* Password Strength Indicator */}
              {password && (
                <div className="flex gap-1 mt-1.5 h-1">
                  {[1, 2, 3, 4].map((step) => (
                    <div
                      key={step}
                      className={`flex-1 rounded-full transition-all ${
                        strength >= step
                          ? strengthColors[strength]
                          : 'bg-slate-200 dark:bg-slate-700'
                      }`}
                    ></div>
                  ))}
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="register-confirm-password"
                className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1"
              >
                Confirm Password
              </label>
              <input
                id="register-confirm-password"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="block w-full px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 dark:text-white bg-slate-50/60 dark:bg-[#161F30] border border-slate-200 dark:border-slate-700 rounded-xl font-mono tracking-wider focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white dark:focus:bg-[#1A253A] transition-all"
              />
            </div>

            {/* DPDP Act 2023 Statutory Consent Checkbox */}
            <div className="pt-1">
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  required
                  checked={consentDpdp}
                  onChange={(e) => setConsentDpdp(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500 h-4 w-4 bg-white dark:bg-[#161F30]"
                />
                <span className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                  I consent to confidential citizen data processing under the{' '}
                  <strong className="text-slate-900 dark:text-white">
                    Digital Personal Data Protection (DPDP) Act, 2023
                  </strong>{' '}
                  and agree to the Terms of Justice.
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-3 py-3 px-4 bg-[#0C1B33] dark:bg-blue-600 hover:bg-slate-900 dark:hover:bg-blue-700 active:bg-black text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-slate-950/15 group disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Creating Citizen Profile...</span>
                </div>
              ) : (
                <>
                  <span>Create Citizen Account</span>
                  <span className="transition-transform group-hover:translate-x-1 font-bold">→</span>
                </>
              )}
            </button>
          </form>

          {/* Already have an account row */}
          <div className="text-center mt-4">
            <p className="text-xs text-slate-600 dark:text-slate-400 font-normal">
              Already have a verified citizen profile?{' '}
              <Link
                href={`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`}
                className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
              >
                Sign in here
              </Link>
            </p>
          </div>

          {/* Footer Charter Disclaimer */}
          <div className="mt-5 p-3 rounded-xl bg-slate-50 dark:bg-[#161F30] border border-slate-200/70 dark:border-slate-800 text-center">
            <p className="text-[10px] leading-relaxed text-slate-500 dark:text-slate-400 font-normal">
              Protected by sovereign cryptographic air-gap. Your citizen profile is held in strict
              confidence in accordance with Article 39A and the DPDP Act.
            </p>
          </div>
        </section>
        {/* END: Right Citizen Registration Card */}
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[500px] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <RegisterFormContent />
    </Suspense>
  );
}
