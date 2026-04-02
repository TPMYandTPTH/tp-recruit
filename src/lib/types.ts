// ============================================================
// Core Types for the Recruitment Platform
// ============================================================

export type OfferTier = "GREEN" | "AMBER" | "RED";

export type InterviewMode = "NO_INTERVIEW" | "AI_INTERVIEW" | "HUMAN_INTERVIEW";

export type RoleCriticality = "STANDARD" | "PRIORITY" | "CRITICAL";

// ============================================================
// Offer Engine Types
// ============================================================

export interface SalaryBand {
  min: number;
  mid: number;
  max: number;
  currency: string;
}

export interface OfferCalculationInput {
  expectedSalary: number;
  salaryBand: SalaryBand;
  roleCriticality: RoleCriticality;
  fillRate: number;         // 0 to 1 (e.g., 0.72 = 72% filled)
  marketMedian?: number;    // Market median salary for this role
}

export interface OfferCalculationResult {
  tier: OfferTier;
  baseSalary: number;
  adjustments: {
    criticality: number;
    fillRate: number;
    market: number;
  };
  finalOffer: number;
  requiresApproval: boolean;
  approvalChain: ApproverConfig[];
  explanation: string;       // Human-readable explanation of the calculation
}

export interface ApproverConfig {
  role: "TA_LEAD" | "DIRECTOR" | "COO";
  name: string;
  email: string;
  parallel: boolean;        // Can this approval happen in parallel with others?
}

// ============================================================
// Counter-Offer Types
// ============================================================

export interface CounterOfferInput {
  counterAmount: number;
  currentOffer: number;
  round: number;            // Which round of negotiation (1, 2, or 3)
  salaryBand: SalaryBand;
}

export interface CounterOfferResult {
  action: "AUTO_ACCEPT" | "REVISED_OFFER" | "ESCALATE" | "CLOSE";
  revisedAmount?: number;
  tier?: OfferTier;
  explanation: string;
}

// ============================================================
// Screening Types
// ============================================================

export interface ScreeningAnswer {
  questionId: string;
  answer: string | number | boolean;
}

export interface ScreeningResult {
  passed: boolean;
  failReasons: string[];
  expectedSalary?: number;   // Extracted from salary question
  answers: ScreeningAnswer[];
}

// ============================================================
// Portal Stage Config
// ============================================================

export interface PortalStageConfig {
  screening: boolean;
  assessment: boolean;
  interview: boolean;
  interviewMode: InterviewMode;
  offer: boolean;
  onboarding: boolean;
}

export type CandidateStageGroup =
  | "screening"
  | "assessment"
  | "interview"
  | "offer"
  | "onboarding"
  | "completed"
  | "rejected";

// Maps detailed stages to portal display groups
export function getStageGroup(stage: string): CandidateStageGroup {
  const mapping: Record<string, CandidateStageGroup> = {
    SCREENING: "screening",
    SCREENING_FAILED: "rejected",
    ASSESSMENT_PENDING: "assessment",
    ASSESSMENT_IN_PROGRESS: "assessment",
    ASSESSMENT_FAILED: "rejected",
    INTERVIEW_PENDING: "interview",
    INTERVIEW_SCHEDULED: "interview",
    INTERVIEW_FAILED: "rejected",
    SELECTED: "offer",
    OFFER_CALCULATING: "offer",
    OFFER_PENDING_APPROVAL: "offer",
    OFFER_SENT: "offer",
    OFFER_ACCEPTED: "onboarding",
    OFFER_DECLINED: "offer",
    OFFER_COUNTERED: "offer",
    RENEGOTIATING: "offer",
    ONBOARDING: "onboarding",
    REJECTED: "rejected",
    WITHDRAWN: "rejected",
    CLOSED: "rejected",
  };
  return mapping[stage] || "screening";
}
