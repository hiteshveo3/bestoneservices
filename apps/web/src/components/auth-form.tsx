"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth, formatAuthError } from "@/components/providers/auth-provider";
import { Eye, EyeOff, Sparkles, ArrowRight, ShieldCheck, Mail, Lock, CheckCircle2 } from "lucide-react";

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" aria-hidden="true">
      <path fill="#4285F4" d="M21.8 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.5a4.7 4.7 0 0 1-2 3.1v2.5h3.3c1.9-1.8 3-4.3 3-7.4Z" />
      <path fill="#34A853" d="M12 22c2.7 0 5-.9 6.7-2.4l-3.3-2.5c-.9.6-2 .9-3.4.9-2.6 0-4.9-1.8-5.7-4.2H3v2.6A10 10 0 0 0 12 22Z" />
      <path fill="#FBBC05" d="M6.3 13.8a6 6 0 0 1 0-3.6V7.6H3a10 10 0 0 0 0 8.8l3.3-2.6Z" />
      <path fill="#EA4335" d="M12 6c1.5 0 2.9.5 3.9 1.5l2.9-2.9A10 10 0 0 0 3 7.6l3.3 2.6C7.1 7.8 9.4 6 12 6Z" />
    </svg>
  );
}

function AuthFrame({ children, title, subtitle }: { children: React.ReactNode; title: string; subtitle: string }) {
  return (
    <main id="main-content" className="py-12 min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl grid lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Column: Best One Value & Identity (Desktop) */}
        <div className="hidden lg:flex lg:col-span-5 p-8 rounded-[16px] bg-white space-y-6 flex-col justify-between text-start border border-[#E5FBC9]">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DCFAB7] text-[#1F3A00] shadow-2xs text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-white shrink-0" />
              <span>Best One Account</span>
            </div>
            <h2 className="font-heading font-medium text-2xl text-ink-900 leading-tight">
              {title}
            </h2>
            <p className="text-sm text-ink-500 leading-relaxed">
              {subtitle}
            </p>
          </div>

          <div className="space-y-3 pt-6 border-t border-[#E5FBC9]">
            <div className="flex items-center gap-2 text-xs font-medium text-ink-600">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Verified Customer & Admin Security</span>
            </div>
            <p className="text-xs text-ink-500">
              Account access is optional for browsing. You can request estimates anytime.
            </p>
          </div>
        </div>

        {/* Right Column: Interactive Auth Form */}
        <div className="lg:col-span-7 bg-white rounded-[16px] p-6 sm:p-10 space-y-6 text-start border border-[#E5FBC9]">
          {children}
        </div>

      </div>
    </main>
  );
}

export function LoginForm({ next }: { next?: string }) {
  const { user, loading, loginWithEmail, loginWithGoogle, error, clearError } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  React.useEffect(() => {
    if (!loading && user) {
      const target = next && next.startsWith("/") ? next : "/account/dashboard";
      router.replace(target);
    }
  }, [user, loading, next, router]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    if (!email.trim() || !password) {
      setLocalError("Please enter your email and password to sign in.");
      return;
    }

    setSubmitting(true);
    const user = await loginWithEmail(email.trim(), password);
    setSubmitting(false);

    if (user) {
      const target = next && next.startsWith("/") ? next : "/account/dashboard";
      router.push(target);
    }
  };

  const handleGoogleSubmit = async () => {
    setLocalError(null);
    clearError();
    setSubmitting(true);
    const user = await loginWithGoogle();
    setSubmitting(false);

    if (user) {
      const target = next && next.startsWith("/") ? next : "/account/dashboard";
      router.push(target);
    }
  };

  const activeError = localError || error;

  return (
    <AuthFrame 
      title="Everything for your property in one place."
      subtitle="Access your bookings, track estimates, view invoices, and manage your property preferences securely."
    >
      <div className="space-y-2">
        <h1 className="font-heading text-2xl sm:text-3xl font-medium text-ink-900">Sign In</h1>
        <p className="text-sm text-ink-500">Enter your account credentials to continue</p>
      </div>

      {activeError && (
        <div className="p-3.5 rounded-[16px] bg-danger-50 text-danger-500 text-sm font-medium border-none">
          {activeError}
        </div>
      )}

      <form onSubmit={handleEmailSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-mono font-medium uppercase text-ink-500">Email Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-ink-500 absolute left-3.5 top-3.5" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full pl-10 pr-4 py-3 rounded-[16px] bg-[#F9FCF5] border-none text-base text-ink-600 font-medium focus:outline-none focus:ring-2 focus:ring-[#1F3A00]"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono font-medium uppercase text-ink-500">Password</label>
            <Link href="/account/forgot-password" className="text-xs font-medium text-ink-600 hover:underline text-decoration-none">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-ink-500 absolute left-3.5 top-3.5" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full pl-10 pr-10 py-3 rounded-[16px] bg-[#F9FCF5] border-none text-base text-ink-600 font-medium focus:outline-none focus:ring-2 focus:ring-[#1F3A00]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-3.5 text-ink-500 hover:text-ink-600 border-none bg-transparent cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3.5 px-6 rounded-full bg-[#1F3A00] text-[#B7F56A] font-semibold text-base hover:bg-[#2d5004] transition-colors duration-150 cursor-pointer border-none flex items-center justify-center gap-2 border border-[#E5FBC9]"
        >
          <span>{submitting ? "Signing in..." : "Sign In"}</span>
          <ArrowRight className="w-4 h-4 text-white" />
        </button>
      </form>

      <div className="relative py-2">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#E5FBC9]"></div></div>
        <div className="relative flex justify-center text-xs font-mono text-ink-500 uppercase">
          <span className="bg-white px-3">or continue with</span>
        </div>
      </div>

      <button
        type="button"
        disabled={submitting}
        onClick={handleGoogleSubmit}
        className="w-full py-3 px-6 rounded-full bg-[#F9FCF5] text-ink-600 font-medium text-base hover:bg-[#DCFAB7] transition-colors duration-150 cursor-pointer border-none flex items-center justify-center gap-3"
      >
        <GoogleMark />
        <span>Continue with Google</span>
      </button>

      <div className="text-center text-sm text-ink-500 pt-2">
        <span>Don&apos;t have an account? </span>
        <Link href="/account/register" className="font-medium text-ink-600 hover:underline text-decoration-none">
          Create account
        </Link>
      </div>
    </AuthFrame>
  );
}

export function RegisterForm() {
  const { registerWithEmail, loginWithGoogle, error, clearError } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    if (!email.trim() || !password) {
      setLocalError("Please fill in all required fields.");
      return;
    }
    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setLocalError("Passwords do not match. Please re-enter.");
      return;
    }
    if (!agreeTerms) {
      setLocalError("Please accept the Terms and Privacy Policy to create your account.");
      return;
    }

    setSubmitting(true);
    const user = await registerWithEmail(email.trim(), password, name);
    setSubmitting(false);

    if (user) {
      router.push("/account");
    }
  };

  const handleGoogleSubmit = async () => {
    setLocalError(null);
    clearError();
    setSubmitting(true);
    const user = await loginWithGoogle();
    setSubmitting(false);

    if (user) {
      router.push("/account");
    }
  };

  const activeError = localError || error;

  return (
    <AuthFrame
      title="Create your Best One Services account."
      subtitle="Join thousands of property owners and tenants across London managing cleaning, pest control, and removals online."
    >
      <div className="space-y-2">
        <h1 className="font-heading text-2xl sm:text-3xl font-medium text-ink-900">Create Account</h1>
        <p className="text-sm text-ink-500">Fast registration with full account control</p>
      </div>

      {activeError && (
        <div className="p-3.5 rounded-[16px] bg-danger-50 text-danger-500 text-sm font-medium border-none">
          {activeError}
        </div>
      )}

      <form onSubmit={handleRegisterSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-mono font-medium uppercase text-ink-500">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Doe"
            required
            className="w-full px-4 py-3 rounded-[16px] bg-[#F9FCF5] border-none text-base text-ink-600 font-medium focus:outline-none focus:ring-2 focus:ring-[#1F3A00]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-mono font-medium uppercase text-ink-500">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="w-full px-4 py-3 rounded-[16px] bg-[#F9FCF5] border-none text-base text-ink-600 font-medium focus:outline-none focus:ring-2 focus:ring-[#1F3A00]"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-medium uppercase text-ink-500">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 characters"
                required
                className="w-full pl-4 pr-10 py-3 rounded-[16px] bg-[#F9FCF5] border-none text-base text-ink-600 font-medium focus:outline-none focus:ring-2 focus:ring-[#1F3A00]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-ink-500 hover:text-ink-600 border-none bg-transparent cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono font-medium uppercase text-ink-500">Confirm Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
              required
              className="w-full px-4 py-3 rounded-[16px] bg-[#F9FCF5] border-none text-base text-ink-600 font-medium focus:outline-none focus:ring-2 focus:ring-[#1F3A00]"
            />
          </div>
        </div>

        <label className="flex items-start gap-2 pt-1 cursor-pointer">
          <input
            type="checkbox"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            className="mt-1 w-4 h-4 rounded accent-ink-900"
          />
          <span className="text-xs text-ink-500">
            I agree to the{" "}
            <Link href="/terms-and-conditions" className="font-medium text-ink-600 underline">
              Terms & Conditions
            </Link>{" "}
            and{" "}
            <Link href="/privacy-policy" className="font-medium text-ink-600 underline">
              Privacy Policy
            </Link>.
          </span>
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3.5 px-6 rounded-full bg-[#1F3A00] text-[#B7F56A] font-semibold text-base hover:bg-[#2d5004] transition-colors duration-150 cursor-pointer border-none flex items-center justify-center gap-2 border border-[#E5FBC9]"
        >
          <span>{submitting ? "Creating account..." : "Create Account"}</span>
          <ArrowRight className="w-4 h-4 text-white" />
        </button>
      </form>

      <div className="relative py-2">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#E5FBC9]"></div></div>
        <div className="relative flex justify-center text-xs font-mono text-ink-500 uppercase">
          <span className="bg-white px-3">or continue with</span>
        </div>
      </div>

      <button
        type="button"
        disabled={submitting}
        onClick={handleGoogleSubmit}
        className="w-full py-3 px-6 rounded-full bg-[#F9FCF5] text-ink-600 font-medium text-base hover:bg-[#DCFAB7] transition-colors duration-150 cursor-pointer border-none flex items-center justify-center gap-3"
      >
        <GoogleMark />
        <span>Continue with Google</span>
      </button>

      <div className="text-center text-sm text-ink-500 pt-2">
        <span>Already have an account? </span>
        <Link href="/account/login" className="font-medium text-ink-600 hover:underline text-decoration-none">
          Sign in
        </Link>
      </div>
    </AuthFrame>
  );
}

export function ResetForm() {
  const { sendPasswordReset, error, clearError } = useAuth();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    if (!email.trim()) {
      setLocalError("Please enter your account email address.");
      return;
    }

    setSubmitting(true);
    const success = await sendPasswordReset(email.trim());
    setSubmitting(false);

    if (success) {
      setSent(true);
    }
  };

  const activeError = localError || error;

  return (
    <AuthFrame
      title="Reset your Best One password."
      subtitle="Enter your verified email address and we'll send you an instant reset link."
    >
      <div className="space-y-2">
        <h1 className="font-heading text-2xl sm:text-3xl font-medium text-ink-900">Reset Password</h1>
        <p className="text-sm text-ink-500">Password recovery link dispatch</p>
      </div>

      {sent ? (
        <div className="p-6 rounded-[16px] bg-emerald-50 text-emerald-900 border border-emerald-300 space-y-3 border-none">
          <CheckCircle2 className="w-8 h-8 text-ink-600" />
          <h3 className="font-heading font-medium text-lg text-ink-900">Reset Link Dispatched</h3>
          <p className="text-sm leading-relaxed">
            If an account exists for <strong className="font-medium">{email}</strong>, you will receive a password reset link shortly.
          </p>
          <Link
            href="/account/login"
            className="inline-block px-6 py-2.5 rounded-full bg-[#1F3A00] text-[#B7F56A] text-sm font-semibold hover:bg-[#2d5004] text-decoration-none"
          >
            Back to Sign In
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {activeError && (
            <div className="p-3.5 rounded-[16px] bg-danger-50 text-danger-500 text-sm font-medium border-none">
              {activeError}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-mono font-medium uppercase text-ink-500">Account Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full px-4 py-3 rounded-[16px] bg-[#F9FCF5] border-none text-base text-ink-600 font-medium focus:outline-none focus:ring-2 focus:ring-[#1F3A00]"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 px-6 rounded-full bg-[#1F3A00] text-[#B7F56A] font-semibold text-base hover:bg-[#2d5004] transition-colors duration-150 cursor-pointer border-none flex items-center justify-center gap-2 border border-[#E5FBC9]"
          >
            <span>{submitting ? "Sending reset link..." : "Send Reset Link"}</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </button>

          <div className="text-center text-sm text-ink-500 pt-2">
            <Link href="/account/login" className="font-medium text-ink-600 hover:underline text-decoration-none">
              Back to Sign In
            </Link>
          </div>
        </form>
      )}
    </AuthFrame>
  );
}


