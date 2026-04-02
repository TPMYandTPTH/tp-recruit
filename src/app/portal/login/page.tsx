"use client";

import { useState, useEffect } from "react";
import { Mail, KeyRound, ArrowRight, Loader2, Shield, CheckCircle, AlertCircle, MapPin } from "lucide-react";

export default function CandidateLogin() {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [candidateInfo, setCandidateInfo] = useState<{ name: string; role: string } | null>(null);
  const [devOtp, setDevOtp] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email) {
      setError("Please enter your email");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        setLoading(false);
        return;
      }

      setCandidateInfo({ name: data.candidateName, role: data.roleName });
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
    if (!otp || otp.length !== 6) {
      setError("Please enter the 6-digit code");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        setLoading(false);
        return;
      }

      // Redirect to candidate portal
      window.location.href = `/portal/${data.portalToken}`;
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#f5f4f2]">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#3e2666] to-[#4B4C6A] text-white">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/tp-logo-white.png" alt="TP" className="h-10 w-auto" />
            <div>
              <h1 className="text-xl font-bold">TP CAREERS</h1>
              <div className="flex items-center gap-1 text-sm text-gray-200">
                <MapPin size={14} />
                Candidate Portal
              </div>
            </div>
          </div>
          <span className="px-4 py-1.5 bg-[#FF0082] text-white text-sm font-semibold rounded-lg">
            NOW HIRING
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full">
          {/* Security badge */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <Shield size={20} className="text-[#4B4C6A]" />
            <span className="text-sm font-medium text-[#8a8da1]">Secure candidate portal</span>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            {step === 1 ? (
              <>
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-[#eeedf2] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-[#4B4C6A]" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
                  <p className="text-[#8a8da1] mt-2">
                    Enter the email you used to apply and we'll send you a login code.
                  </p>
                </div>

                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Email address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      className="w-full px-4 py-3 border border-[#c2c7cd] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4B4C6A] bg-[#f5f4f2]"
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
                      <>
                        Send Login Code <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>
              </>
            ) : (
              <>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-[#eeedf2] rounded-full flex items-center justify-center mx-auto mb-4">
                    <KeyRound className="w-8 h-8 text-[#4B4C6A]" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Enter your code</h2>
                  {candidateInfo && (
                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-800">
                        <CheckCircle className="w-4 h-4 inline mr-1" />
                        Hi <strong>{candidateInfo.name}</strong>!
                      </p>
                      <p className="text-xs text-green-600 mt-1">
                        Applying for: {candidateInfo.role}
                      </p>
                    </div>
                  )}
                  <p className="text-[#8a8da1] mt-3 text-sm">
                    We sent a 6-digit code to <strong className="text-gray-900">{email}</strong>
                  </p>
                </div>

                {/* DEV ONLY: Show OTP */}
                {devOtp && (
                  <div className="mb-4 p-3 bg-amber-50 border border-amber-300 rounded-lg text-center">
                    <p className="text-xs font-medium text-amber-700 mb-1">DEV MODE — Your OTP code:</p>
                    <p className="text-3xl font-mono font-bold text-amber-900 tracking-widest">{devOtp}</p>
                  </div>
                )}

                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">6-digit code</label>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                        setOtp(val);
                      }}
                      placeholder="000000"
                      className="w-full px-4 py-4 text-center text-2xl font-mono tracking-[0.5em] border border-[#c2c7cd] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4B4C6A] bg-[#f5f4f2]"
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
                      <>
                        Verify & Continue <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-between text-sm">
                    <button
                      type="button"
                      onClick={() => {
                        setStep(1);
                        setOtp("");
                        setError("");
                        setDevOtp("");
                      }}
                      className="text-[#4B4C6A] hover:underline"
                    >
                      ← Change email
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setOtp("");
                        setError("");
                        handleSendOtp();
                      }}
                      disabled={resendCooldown > 0}
                      className="text-[#4B4C6A] hover:underline disabled:text-gray-400 disabled:no-underline"
                    >
                      {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend code"}
                    </button>
                  </div>
                </form>
              </>
            )}

            {/* Divider */}
            <div className="mt-8 pt-6 border-t border-[#e6e6e5] text-center">
              <p className="text-sm text-[#8a8da1]">
                Don't have an account?{" "}
                <a href="/" className="text-[#4B4C6A] font-semibold hover:underline">
                  Apply now
                </a>
              </p>
            </div>
          </div>

          {/* Demo accounts */}
          <div className="mt-6 bg-white rounded-xl p-4 shadow-sm">
            <p className="text-xs font-semibold text-[#8a8da1] uppercase tracking-wider mb-3">Demo accounts for testing</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center p-2 bg-[#f5f4f2] rounded-lg">
                <div>
                  <span className="font-medium text-gray-900">Sarah Ahmad</span>
                  <span className="text-[#8a8da1] ml-2">Screening</span>
                </div>
                <button
                  onClick={() => {
                    setEmail("sarah.ahmad@email.com");
                    setStep(1);
                    setError("");
                  }}
                  className="text-xs px-2 py-1 bg-[#4B4C6A] text-white rounded font-medium"
                >
                  Use
                </button>
              </div>
              <div className="flex justify-between items-center p-2 bg-[#f5f4f2] rounded-lg">
                <div>
                  <span className="font-medium text-gray-900">James Chen</span>
                  <span className="text-[#8a8da1] ml-2">Selected</span>
                </div>
                <button
                  onClick={() => {
                    setEmail("james.chen@email.com");
                    setStep(1);
                    setError("");
                  }}
                  className="text-xs px-2 py-1 bg-[#4B4C6A] text-white rounded font-medium"
                >
                  Use
                </button>
              </div>
              <div className="flex justify-between items-center p-2 bg-[#f5f4f2] rounded-lg">
                <div>
                  <span className="font-medium text-gray-900">Maria Santos</span>
                  <span className="text-[#8a8da1] ml-2">Offer Accepted</span>
                </div>
                <button
                  onClick={() => {
                    setEmail("maria.santos@email.com");
                    setStep(1);
                    setError("");
                  }}
                  className="text-xs px-2 py-1 bg-[#4B4C6A] text-white rounded font-medium"
                >
                  Use
                </button>
              </div>
              <div className="flex justify-between items-center p-2 bg-[#f5f4f2] rounded-lg">
                <div>
                  <span className="font-medium text-gray-900">Aisha Rahman</span>
                  <span className="text-[#8a8da1] ml-2">Interview</span>
                </div>
                <button
                  onClick={() => {
                    setEmail("aisha.rahman@email.com");
                    setStep(1);
                    setError("");
                  }}
                  className="text-xs px-2 py-1 bg-[#4B4C6A] text-white rounded font-medium"
                >
                  Use
                </button>
              </div>
              <div className="flex justify-between items-center p-2 bg-[#f5f4f2] rounded-lg">
                <div>
                  <span className="font-medium text-gray-900">Wei Lin</span>
                  <span className="text-[#8a8da1] ml-2">Offer Sent</span>
                </div>
                <button
                  onClick={() => {
                    setEmail("wei.lin@email.com");
                    setStep(1);
                    setError("");
                  }}
                  className="text-xs px-2 py-1 bg-[#4B4C6A] text-white rounded font-medium"
                >
                  Use
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
