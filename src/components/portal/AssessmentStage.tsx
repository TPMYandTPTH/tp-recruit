"use client";

import { ExternalLink, Clock, CheckCircle2 } from "lucide-react";

interface Props {
  candidateId: string;
  assessmentLink: string | null;
  assessmentScore: number | null;
  stage: string;
}

export default function AssessmentStage({
  candidateId,
  assessmentLink,
  assessmentScore,
  stage,
}: Props) {
  if (stage === "ASSESSMENT_IN_PROGRESS") {
    return (
      <div className="text-center py-8">
        <Clock className="w-16 h-16 text-amber-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Assessment In Progress
        </h2>
        <p className="text-gray-500 max-w-md mx-auto mb-6">
          We&apos;re waiting for your assessment results. If you haven&apos;t
          completed it yet, please use the link below.
        </p>
        {assessmentLink && (
          <a
            href={assessmentLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            Continue Assessment <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>
    );
  }

  // ASSESSMENT_PENDING — hasn't started yet
  return (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-3xl">📝</span>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Time for Your Assessment
      </h2>
      <p className="text-gray-500 max-w-md mx-auto mb-6">
        Great job passing the screening! The next step is a short assessment to
        evaluate your skills. Click below to begin.
      </p>
      {assessmentLink ? (
        <a
          href={assessmentLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
        >
          Start Assessment <ExternalLink className="w-4 h-4" />
        </a>
      ) : (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 max-w-sm mx-auto">
          <p className="text-amber-700 text-sm">
            Your assessment link is being prepared. You&apos;ll receive it
            shortly via WhatsApp and email.
          </p>
        </div>
      )}
      <p className="text-xs text-gray-400 mt-4">
        You&apos;ll receive daily reminders until the assessment is completed.
      </p>
    </div>
  );
}
