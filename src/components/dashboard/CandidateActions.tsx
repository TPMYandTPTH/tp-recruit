"use client";

import { useState } from "react";
import { ExternalLink, Zap, Loader2 } from "lucide-react";

interface Props {
  candidateId: string;
  portalToken: string;
  stage: string;
  hasOffer: boolean;
}

export default function CandidateActions({
  candidateId,
  portalToken,
  stage,
  hasOffer,
}: Props) {
  const [triggering, setTriggering] = useState(false);
  const [triggered, setTriggered] = useState(false);

  const triggerOffer = async () => {
    setTriggering(true);
    await fetch("/api/offers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ candidateId }),
    });
    setTriggering(false);
    setTriggered(true);
    setTimeout(() => window.location.reload(), 1000);
  };

  // Advance candidate to SELECTED (skip assessment/interview for demo)
  const advanceToSelected = async () => {
    setTriggering(true);
    await fetch("/api/candidates/advance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ candidateId, targetStage: "SELECTED" }),
    });
    setTriggering(false);
    setTriggered(true);
    setTimeout(() => window.location.reload(), 1000);
  };

  return (
    <div className="flex items-center gap-2">
      <a
        href={`/portal/${portalToken}`}
        target="_blank"
        className="text-[#4B4C6A] hover:text-[#3e2666] text-xs flex items-center gap-1"
      >
        <ExternalLink className="w-3 h-3" />
        Portal
      </a>

      {/* Show "Advance" button for candidates not yet at SELECTED */}
      {["SCREENING", "ASSESSMENT_PENDING", "ASSESSMENT_IN_PROGRESS", "INTERVIEW_PENDING", "INTERVIEW_SCHEDULED"].includes(stage) && (
        <button
          onClick={advanceToSelected}
          disabled={triggering}
          className="text-xs px-2 py-1 bg-[#eeedf2] text-[#706398] rounded font-medium hover:bg-[#e6e6e5] disabled:opacity-50 flex items-center gap-1"
        >
          {triggering ? <Loader2 className="w-3 h-3 animate-spin" /> : "Advance"}
        </button>
      )}

      {/* Show "Generate Offer" button for SELECTED candidates without an offer */}
      {stage === "SELECTED" && !hasOffer && !triggered && (
        <button
          onClick={triggerOffer}
          disabled={triggering}
          className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded font-medium hover:bg-green-200 disabled:opacity-50 flex items-center gap-1"
        >
          {triggering ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <>
              <Zap className="w-3 h-3" />
              Generate Offer
            </>
          )}
        </button>
      )}

      {triggered && (
        <span className="text-xs text-green-600 font-medium">Done!</span>
      )}
    </div>
  );
}
