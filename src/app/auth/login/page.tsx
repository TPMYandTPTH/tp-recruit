"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Mail, KeyRound, ArrowRight, Loader2, Shield, CheckCircle, AlertCircle,
  Crown, UserCheck, Search, Megaphone, Heart, ClipboardCheck, ShieldCheck
} from "lucide-react";

const ROLE_LABELS: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  HOD: { label: "Head of Department", color: "#FF0082", icon: <Crown size={16} /> },
  RECRUITER: { label: "Recruiter", color: "#4B4C6A", icon: <UserCheck size={16} /> },
  SOURCING: { label: "Sourcing Specialist", color: "#3047B0", icon: <Search size={16} /> },
  MARKETING: { label: "Marketing", color: "#FF5C00", icon: <Megaphone size={16} /> },
  HR: { label: "HR / Onboarding", color: "#00AF9B", icon: <Heart size={16} /> },
  OPS: { label: "Ops Interviewer", color: "#780096", icon: <ClipboardCheck size={16} /> },
  ADMIN: { label: "System Admin", color: "#4B4C6A", icon: <ShieldCheck size={16} /> },
};

const DEMO_USERS = [
  { email: "ahmed.director@tp.com", name: "Ahmed Hassan", role: "HOD" },
  { email: "sarah.recruiter@tp.com", name: "Sarah Lim", role: "RECRUITER" },
  { email: "mike.sourcing@tp.com", name: "Mike Tan", role: "SOURCING" },
  { email: "lisa.marketing@tp.com", name: "Lisa Wong", role: "MARKETING" },
  { email: "priya.hr@tp.com", name: "Priya Sharma", role: "HR" },
  { email: "david.ops@tp.com", name: "David Kumar", role: "OPS" },
  { email: "tarek@tp.com", name: "Tarek Ezzeldean", role: "ADMIN" },
];

export default function StaffLoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [staffInfo, setStaffInfo] = useState<{ name: string; role: string } | null>(null);
  const [devOtp, setDevOtp] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email) { setError("Please enter your email"); return; }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/staff/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) { setError(data.error); setLoading(false); return; }

      setStaffInfo({ name: data.staffName, role: data.staffRole });
      setDevOtp(data.otp || "");
      setStep(2);
      setResendCooldown(30);
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) { setError("Please enter the 6-digit code"); return; }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/staff/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();

      if (!res.ok) { setError(data.error); setLoading(false); return; }

      // Store user session
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem("tp_staff_user", JSON.stringify(data.user));
      }

      // Redirect based on role
      const roleRoutes: Record<string, string> = {
        HOD: "/hod",
        RECRUITER: "/recruiter",
        SOURCING: "/sourcing",
        MARKETING: "/marketing",
        HR: "/hr/onboarding",
        OPS: "/interview/ops",
        ADMIN: "/dashboard",
      };

      router.push(roleRoutes[data.user.role] || "/auth/select-role");
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  const roleInfo = staffInfo ? ROLE_LABELS[staffInfo.role] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f7f5] to-[#ECE9E7]">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#3e2666] to-[#4B4C6A] text-white">
        <div className="max-w-6xl mx-auto px-4 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/tp-logo-white.png" alt="TP" className="h-10 w-auto" />
            <div>
              <h1 className="text-xl font-bold tracking-tight">TP RECRUIT</h1>
              <p className="text-xs text-white/70">Staff Portal</p>
            </div>
          </div>
          <span className="px-4 py-1.5 bg-[#FF0082] text-white text-xs font-bold rounded-full tracking-wide">
            STAFF LOGIN
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex items-start justify-center px-4 py-12">
        <div className="max-w-md w-full">
          {/* Security badge */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <Shield size={18} className="text-[#4B4C6A]" />
            <span className="text-sm font-medium text-[#848DAD]">Secure staff authentication</span>
          </div>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Card top accent */}
            <div className="h-1.5 bg-gradient-to-r from-[#FF0082] via-[#4B4C6A] to-[#3047B0]" />

            <div className="p-8">
              {step === 1 ? (
                <>
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-[#E2DFE8] rounded-full flex items-center justify-center mx-auto mb-4">
                      <Mail className="w-8 h-8 text-[#4B4C6A]" />
                    </div>
                    <h2 className="text-2xl font-bold text-[#4B4C6A]">Staff Sign In</h2>
                    <p className="text-[#848DAD] mt-2 text-sm">
                      Enter your TP email and we'll send you a one-time login code.
                    </p>
                  </div>

                  <form onSubmit={handleSendOtp} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-[#414141] mb-2">Work email</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@tp.com"
                        className="w-full px-4 py-3 border border-[#C2C7CD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4B4C6A] bg-[#f8f7f5] text-[#414141]"
                        autoFocus
                      />
                    </div>

                    {error && (
                      <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-700">{error}</p>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading || !email}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#4B4C6A] to-[#3e2666] text-white font-semibold rounded-lg hover:shadow-lg disabled:opacity-50 transition-all"
                    >
                      {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>Send Login Code <ArrowRight className="w-5 h-5" /></>
                      )}
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-[#E2DFE8] rounded-full flex items-center justify-center mx-auto mb-4">
                      <KeyRound className="w-8 h-8 text-[#4B4C6A]" />
                    </div>
                    <h2 className="text-2xl font-bold text-[#4B4C6A]">Enter your code</h2>

                    {staffInfo && roleInfo && (
                      <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-800">
                          <CheckCircle className="w-4 h-4 inline mr-1" />
                          Welcome, <strong>{staffInfo.name}</strong>
                        </p>
                        <div className="flex items-center justify-center gap-1.5 mt-1">
                          <span style={{ color: roleInfo.color }}>{roleInfo.icon}</span>
                          <span className="text-xs font-medium" style={{ color: roleInfo.color }}>
                            {roleInfo.label}
                          </span>
                        </div>
                      </div>
                    )}

                    <p className="text-[#848DAD] mt-3 text-sm">
                      We sent a 6-digit code to <strong className="text-[#414141]">{email}</strong>
                    </p>
                  </div>

                  {/* DEV: Show OTP */}
                  {devOtp && (
                    <div className="mb-4 p-3 bg-amber-50 border border-amber-300 rounded-lg text-center">
                      <p className="text-xs font-medium text-amber-700 mb-1">DEMO MODE — Your OTP code:</p>
                      <p className="text-3xl font-mono font-bold text-amber-900 tracking-widest">{devOtp}</p>
                    </div>
                  )}

                  <form onSubmit={handleVerifyOtp} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-[#414141] mb-2">6-digit code</label>
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        placeholder="000000"
                        className="w-full px-4 py-4 text-center text-2xl font-mono tracking-[0.5em] border border-[#C2C7CD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4B4C6A] bg-[#f8f7f5]"
                        autoFocus
                        maxLength={6}
                      />
                    </div>

                    {error && (
                      <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-700">{error}</p>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading || otp.length !== 6}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#4B4C6A] to-[#3e2666] text-white font-semibold rounded-lg hover:shadow-lg disabled:opacity-50 transition-all"
                    >
                      {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>Verify & Sign In <ArrowRight className="w-5 h-5" /></>
                      )}
                    </button>

                    <div className="flex items-center justify-between text-sm">
                      <button
                        type="button"
                        onClick={() => { setStep(1); setOtp(""); setError(""); setDevOtp(""); }}
                        className="text-[#4B4C6A] hover:underline"
                      >
                        ← Change email
                      </button>
                      <button
                        type="button"
                        onClick={() => { setOtp(""); setError(""); handleSendOtp(); }}
                        disabled={resendCooldown > 0}
                        className="text-[#4B4C6A] hover:underline disabled:text-[#C2C7CD] disabled:no-underline"
                      >
                        {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend code"}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>

          {/* Demo accounts panel */}
          <div className="mt-6 bg-white rounded-xl p-5 shadow-sm">
            <p className="text-xs font-semibold text-[#848DAD] uppercase tracking-wider mb-3">
              Demo Staff Accounts
            </p>
            <div className="space-y-2">
              {DEMO_USERS.map((u) => {
                const ri = ROLE_LABELS[u.role];
                return (
                  <div key={u.email} className="flex items-center justify-between p-2.5 bg-[#f8f7f5] rounded-lg">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                        style={{ backgroundColor: ri?.color || "#4B4C6A" }}
                      >
                        {ri?.icon}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-[#414141]">{u.name}</p>
                        <p className="text-xs text-[#848DAD]">{ri?.label}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => { setEmail(u.email); setStep(1); setError(""); }}
                      className="text-xs px-3 py-1.5 bg-[#4B4C6A] text-white rounded-md font-medium hover:bg-[#3e2666] transition-colors"
                    >
                      Use
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Candidate link */}
          <div className="mt-4 text-center">
            <p className="text-sm text-[#848DAD]">
              Are you a candidate?{" "}
              <a href="/portal/login" className="text-[#4B4C6A] font-semibold hover:underline">
                Check your application →
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
