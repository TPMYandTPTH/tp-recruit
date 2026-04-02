"use client";

import { useState } from "react";
import {
  FileText,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Loader2,
  Clock,
  DollarSign,
  MessageSquare,
} from "lucide-react";

interface Offer {
  id: string;
  round: number;
  offeredSalary: number;
  tier: string;
  status: string;
  sentAt: string | null;
  offerLetterUrl: string | null;
}

interface Props {
  candidateId: string;
  offer: Offer | null;
  stage: string;
  roleName: string;
  currency: string;
}

export default function OfferStage({
  candidateId,
  offer,
  stage,
  roleName,
  currency,
}: Props) {
  const [view, setView] = useState<"offer" | "decline" | "counter">("offer");
  const [declineReason, setDeclineReason] = useState("");
  const [counterAmount, setCounterAmount] = useState<number | "">("");
  const [counterNote, setCounterNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Offer is being prepared / waiting for approval
  if (stage === "OFFER_CALCULATING" || stage === "OFFER_PENDING_APPROVAL") {
    return (
      <div className="text-center py-8">
        <Clock className="w-16 h-16 text-amber-500 mx-auto mb-4 animate-pulse" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Your Offer is Being Prepared
        </h2>
        <p className="text-gray-500 max-w-md mx-auto">
          Great news — you&apos;ve been selected! We&apos;re finalizing your
          offer details. You&apos;ll receive a notification as soon as
          it&apos;s ready.
        </p>
        <div className="mt-6 bg-[#eeedf2] border border-[#c2c7cd] rounded-xl p-4 max-w-sm mx-auto">
          <p className="text-[#4B4C6A] text-sm">
            This usually takes less than 24 hours. We&apos;ll notify you via
            WhatsApp and email.
          </p>
        </div>
      </div>
    );
  }

  // No offer yet
  if (!offer) {
    return (
      <div className="text-center py-8">
        <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Offer Not Yet Available
        </h2>
        <p className="text-gray-500">
          Your offer is being processed. Check back soon.
        </p>
      </div>
    );
  }

  // Already responded
  if (submitted || stage === "OFFER_ACCEPTED") {
    return (
      <div className="text-center py-8">
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome Aboard!
        </h2>
        <p className="text-gray-500 max-w-md mx-auto">
          You&apos;ve accepted the offer. Your onboarding process will begin
          shortly. Check your email and WhatsApp for next steps.
        </p>
      </div>
    );
  }

  if (stage === "OFFER_COUNTERED" || stage === "RENEGOTIATING") {
    return (
      <div className="text-center py-8">
        <MessageSquare className="w-16 h-16 text-amber-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          We&apos;re Reviewing Your Response
        </h2>
        <p className="text-gray-500 max-w-md mx-auto">
          Thank you for your feedback. Our team is reviewing your counter-offer
          and will get back to you shortly with a revised offer.
        </p>
      </div>
    );
  }

  const formatSalary = (amount: number) =>
    new Intl.NumberFormat("en-MY", {
      style: "currency",
      currency: currency || "MYR",
      minimumFractionDigits: 0,
    }).format(amount);

  const handleAccept = async () => {
    setSubmitting(true);
    await fetch("/api/offers/respond", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ offerId: offer.id, action: "ACCEPT" }),
    });
    setSubmitting(false);
    setSubmitted(true);
    setTimeout(() => window.location.reload(), 2000);
  };

  const handleDecline = async () => {
    setSubmitting(true);
    await fetch("/api/offers/respond", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        offerId: offer.id,
        action: "DECLINE",
        reason: declineReason,
      }),
    });
    setSubmitting(false);
    setSubmitted(true);
    setTimeout(() => window.location.reload(), 2000);
  };

  const handleCounter = async () => {
    if (!counterAmount) return;
    setSubmitting(true);
    await fetch("/api/offers/respond", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        offerId: offer.id,
        action: "COUNTER",
        counterAmount: Number(counterAmount),
        reason: counterNote,
      }),
    });
    setSubmitting(false);
    setSubmitted(true);
    setTimeout(() => window.location.reload(), 2000);
  };

  // ===== MAIN OFFER VIEW =====
  if (view === "offer") {
    return (
      <div>
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            Your Offer
          </h2>
          <p className="text-gray-500">
            {offer.round > 1
              ? `Revised offer (Round ${offer.round})`
              : "We're excited to extend this offer to you"}
          </p>
        </div>

        {/* Offer Card */}
        <div className="bg-gradient-to-br from-[#4B4C6A] to-[#3e2666] rounded-2xl p-6 text-white mb-6">
          <p className="text-[#c2c7cd] text-sm font-medium mb-1">
            {roleName}
          </p>
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-4xl font-bold">
              {formatSalary(offer.offeredSalary)}
            </span>
            <span className="text-[#c2c7cd]">/month</span>
          </div>
          <div className="border-t border-white/20 pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[#c2c7cd]">Annual equivalent</span>
              <span className="font-medium">
                {formatSalary(offer.offeredSalary * 12)}
              </span>
            </div>
            {/* TODO: Add benefits breakdown from role config */}
          </div>
        </div>

        {/* Offer letter download */}
        {offer.offerLetterUrl && (
          <a
            href={offer.offerLetterUrl}
            className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl mb-6 hover:bg-gray-100 transition-colors"
          >
            <FileText className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-700">
                Offer Letter (PDF)
              </p>
              <p className="text-xs text-gray-500">
                Download for your records
              </p>
            </div>
          </a>
        )}

        {/* Action buttons */}
        <div className="space-y-3">
          <button
            onClick={handleAccept}
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            {submitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                Accept Offer
              </>
            )}
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setView("counter")}
              className="flex items-center justify-center gap-2 py-3 px-4 border-2 border-amber-300 text-amber-700 rounded-xl font-medium hover:bg-amber-50 transition-colors"
            >
              <DollarSign className="w-4 h-4" />
              Counter
            </button>
            <button
              onClick={() => setView("decline")}
              className="flex items-center justify-center gap-2 py-3 px-4 border-2 border-gray-200 text-gray-500 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              <XCircle className="w-4 h-4" />
              Decline
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ===== DECLINE VIEW =====
  if (view === "decline") {
    const declineReasons = [
      "Salary is too low",
      "Found another opportunity",
      "Location is not suitable",
      "Start date doesn't work",
      "Role is not what I expected",
      "Personal reasons",
      "Other",
    ];

    return (
      <div>
        <button
          onClick={() => setView("offer")}
          className="text-sm text-[#4B4C6A] mb-4 hover:underline"
        >
          &larr; Back to offer
        </button>
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Decline Offer
        </h2>
        <p className="text-gray-500 mb-6">
          We&apos;re sorry to hear that. Please let us know why so we can
          improve.
        </p>

        <div className="space-y-2 mb-6">
          {declineReasons.map((reason) => (
            <button
              key={reason}
              onClick={() => setDeclineReason(reason)}
              className={`w-full text-left py-3 px-4 rounded-xl border-2 transition-all ${
                declineReason === reason
                  ? "border-red-400 bg-red-50 text-red-700"
                  : "border-gray-200 hover:border-gray-300 text-gray-700"
              }`}
            >
              {reason}
            </button>
          ))}
        </div>

        <button
          onClick={handleDecline}
          disabled={!declineReason || submitting}
          className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
        >
          {submitting ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            "Confirm Decline"
          )}
        </button>
      </div>
    );
  }

  // ===== COUNTER VIEW =====
  return (
    <div>
      <button
        onClick={() => setView("offer")}
        className="text-sm text-[#4B4C6A] mb-4 hover:underline"
      >
        &larr; Back to offer
      </button>
      <h2 className="text-xl font-bold text-gray-900 mb-2">
        Counter Offer
      </h2>
      <p className="text-gray-500 mb-6">
        Let us know your expected salary and we&apos;ll do our best to
        accommodate.
      </p>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Your current offer
        </label>
        <p className="text-2xl font-bold text-gray-900">
          {formatSalary(offer.offeredSalary)}
          <span className="text-sm font-normal text-gray-500"> /month</span>
        </p>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Your desired salary (monthly)
        </label>
        <input
          type="number"
          value={counterAmount}
          onChange={(e) => setCounterAmount(Number(e.target.value) || "")}
          placeholder="e.g. 6500"
          className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-[#4B4C6A] focus:outline-none text-lg"
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Any additional notes (optional)
        </label>
        <textarea
          value={counterNote}
          onChange={(e) => setCounterNote(e.target.value)}
          placeholder="Tell us why you feel this amount is appropriate..."
          className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-[#4B4C6A] focus:outline-none resize-none"
          rows={3}
        />
      </div>

      <button
        onClick={handleCounter}
        disabled={!counterAmount || submitting}
        className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-amber-600 text-white rounded-xl font-semibold hover:bg-amber-700 disabled:opacity-50 transition-colors"
      >
        {submitting ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <>
            Submit Counter Offer <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </div>
  );
}
