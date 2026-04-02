"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type LoginMethod = "email" | "token";

export default function AuthPage() {
  const router = useRouter();
  const [method, setMethod] = useState<LoginMethod>("email");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [candidateName, setCandidateName] = useState("");

  const handleEmailLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.toLowerCase().trim() }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Unable to find application");
        setLoading(false);
        return;
      }

      const data = await response.json();
      setCandidateName(data.firstName);
      setSuccess(true);

      setTimeout(() => {
        router.push(`/portal/${data.portalToken}`);
      }, 1500);
    } catch (err) {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  const handleTokenLookup = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!token.trim()) {
      setError("Please enter your portal link or token");
      return;
    }

    // Extract token from full URL if needed
    let cleanToken = token.trim();
    if (token.includes("/portal/")) {
      cleanToken = token.split("/portal/")[1];
    }

    setCandidateName("Candidate");
    setSuccess(true);

    setTimeout(() => {
      router.push(`/portal/${cleanToken}`);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#f5f4f2] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header with TP Gradient */}
        <div className="bg-gradient-to-r from-[#3e2666] to-[#4B4C6A] rounded-t-2xl p-8 text-center text-white">
          <h1 className="text-3xl font-bold mb-2">TP Recruitment</h1>
          <p className="text-sm opacity-90">Check Your Application Status</p>
        </div>

        {/* Main Card */}
        <div className="bg-white border border-[#e6e6e5] rounded-b-2xl p-8 shadow-sm">
          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 font-medium">
                Welcome, {candidateName}! Redirecting you to your portal...
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Method Tabs */}
          <div className="flex gap-4 mb-8 border-b border-[#e6e6e5]">
            <button
              onClick={() => {
                setMethod("email");
                setError("");
                setToken("");
              }}
              className={`pb-3 px-1 font-medium text-sm transition-colors ${
                method === "email"
                  ? "text-[#4B4C6A] border-b-2 border-[#4B4C6A]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Email Lookup
            </button>
            <button
              onClick={() => {
                setMethod("token");
                setError("");
                setEmail("");
              }}
              className={`pb-3 px-1 font-medium text-sm transition-colors ${
                method === "token"
                  ? "text-[#4B4C6A] border-b-2 border-[#4B4C6A]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Portal Link
            </button>
          </div>

          {/* Email Method */}
          {method === "email" && (
            <form onSubmit={handleEmailLookup}>
              <div className="mb-6">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading || success}
                  className="w-full px-4 py-2 bg-[#f5f4f2] border border-[#c2c7cd] rounded-lg focus:outline-none focus:border-[#4B4C6A] focus:ring-1 focus:ring-[#4B4C6A] transition-colors disabled:opacity-50"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading || success}
                className="w-full bg-[#4B4C6A] hover:bg-[#3e2666] text-white font-medium py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Searching..." : "Find My Application"}
              </button>
            </form>
          )}

          {/* Token Method */}
          {method === "token" && (
            <form onSubmit={handleTokenLookup}>
              <div className="mb-6">
                <label
                  htmlFor="token"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Portal Link or Token
                </label>
                <input
                  id="token"
                  type="text"
                  placeholder="Paste your portal link or token"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  disabled={loading || success}
                  className="w-full px-4 py-2 bg-[#f5f4f2] border border-[#c2c7cd] rounded-lg focus:outline-none focus:border-[#4B4C6A] focus:ring-1 focus:ring-[#4B4C6A] transition-colors disabled:opacity-50"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading || success}
                className="w-full bg-[#4B4C6A] hover:bg-[#3e2666] text-white font-medium py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Verifying..." : "Access Portal"}
              </button>
            </form>
          )}

          {/* Footer Link */}
          <div className="mt-8 pt-6 border-t border-[#e6e6e5] text-center">
            <p className="text-sm text-gray-600">
              Ready to apply?{" "}
              <Link
                href="/"
                className="text-[#4B4C6A] hover:text-[#3e2666] font-medium transition-colors"
              >
                Start Your Application
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
