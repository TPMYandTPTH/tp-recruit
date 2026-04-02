import {
  OfferCalculationInput,
  OfferCalculationResult,
  CounterOfferInput,
  CounterOfferResult,
  OfferTier,
  ApproverConfig,
} from "./types";

// ============================================================
// APPROVER CONFIGURATION
// Update these with your actual approvers
// ============================================================

const APPROVERS: Record<string, ApproverConfig> = {
  TA_LEAD: {
    role: "TA_LEAD",
    name: "Tarek",
    email: "tarek@tp.com",
    parallel: true,
  },
  DIRECTOR: {
    role: "DIRECTOR",
    name: "DD",
    email: "dd@tp.com",
    parallel: true, // Can approve in parallel with TA_LEAD for AMBER
  },
  COO: {
    role: "COO",
    name: "Jem",
    email: "jem@tp.com",
    parallel: false, // Sequential for RED path
  },
};

// ============================================================
// TIER CLASSIFICATION
// ============================================================

export function classifyTier(
  expectedSalary: number,
  mid: number,
  max: number
): OfferTier {
  if (expectedSalary <= mid) return "GREEN";
  if (expectedSalary <= max) return "AMBER";
  return "RED";
}

// ============================================================
// OFFER CALCULATION ENGINE
// ============================================================

export function calculateOffer(
  input: OfferCalculationInput
): OfferCalculationResult {
  const { expectedSalary, salaryBand, roleCriticality, fillRate, marketMedian } =
    input;
  const { min, mid, max } = salaryBand;
  const bandWidth = max - min;

  // Step 1: Classify the tier
  const tier = classifyTier(expectedSalary, mid, max);

  // Step 2: Calculate base offer
  let baseSalary: number;
  let baseExplanation: string;

  if (expectedSalary <= min) {
    // Expecting below minimum — offer the minimum (they'll be happy)
    baseSalary = min;
    baseExplanation = `Candidate expects ${expectedSalary} which is below the minimum (${min}). Base offer set to minimum.`;
  } else if (expectedSalary <= mid) {
    // GREEN: Match their expectation — no need to overshoot
    baseSalary = expectedSalary;
    baseExplanation = `Candidate expects ${expectedSalary} which is at or below mid (${mid}). Base offer matches expectation.`;
  } else if (expectedSalary <= max) {
    // AMBER: Start between mid and their ask (60% of the gap)
    baseSalary = Math.round(mid + 0.6 * (expectedSalary - mid));
    baseExplanation = `Candidate expects ${expectedSalary} (above mid ${mid}, below max ${max}). Base offer = mid + 60% of gap = ${baseSalary}.`;
  } else {
    // RED: Cap at max, pending approval for anything above
    baseSalary = max;
    baseExplanation = `Candidate expects ${expectedSalary} which exceeds max (${max}). Base offer capped at max.`;
  }

  // Step 3: Calculate adjustment multipliers
  const adjustments = { criticality: 0, fillRate: 0, market: 0 };

  // Criticality adjustment
  if (roleCriticality === "CRITICAL") {
    adjustments.criticality = Math.round(bandWidth * 0.05);
  } else if (roleCriticality === "PRIORITY") {
    adjustments.criticality = Math.round(bandWidth * 0.03);
  }

  // Fill rate adjustment
  if (fillRate < 0.6) {
    // Under 60% filled — push offer up to attract faster
    adjustments.fillRate = Math.round(bandWidth * 0.03);
  } else if (fillRate > 0.85) {
    // Over 85% filled — room to offer lower
    adjustments.fillRate = Math.round(bandWidth * -0.03);
  }

  // Market adjustment
  if (marketMedian && marketMedian > mid) {
    adjustments.market = Math.round(bandWidth * 0.02);
  }

  // Step 4: Calculate final offer
  const totalAdjustment =
    adjustments.criticality + adjustments.fillRate + adjustments.market;
  let finalOffer = baseSalary + totalAdjustment;

  // Cap the final offer
  if (tier === "GREEN") {
    // GREEN: never exceed mid (that's the whole point of auto-approve)
    finalOffer = Math.min(finalOffer, mid);
    // But never below min
    finalOffer = Math.max(finalOffer, min);
  } else if (tier === "AMBER") {
    // AMBER: cap at max
    finalOffer = Math.min(finalOffer, max);
    // But never below mid
    finalOffer = Math.max(finalOffer, mid);
  } else {
    // RED: cap at max + 10% (anything above needs exceptional approval)
    const absoluteCap = Math.round(max * 1.1);
    finalOffer = Math.min(finalOffer, absoluteCap);
    finalOffer = Math.max(finalOffer, max);
  }

  // Step 5: Determine approval chain
  const approvalChain = getApprovalChain(tier);

  // Step 6: Build explanation
  const adjustmentParts: string[] = [];
  if (adjustments.criticality !== 0)
    adjustmentParts.push(
      `Criticality (${roleCriticality}): ${adjustments.criticality > 0 ? "+" : ""}${adjustments.criticality}`
    );
  if (adjustments.fillRate !== 0)
    adjustmentParts.push(
      `Fill rate (${Math.round(fillRate * 100)}%): ${adjustments.fillRate > 0 ? "+" : ""}${adjustments.fillRate}`
    );
  if (adjustments.market !== 0)
    adjustmentParts.push(
      `Market adjustment: +${adjustments.market}`
    );

  const explanation = [
    `Tier: ${tier}`,
    baseExplanation,
    adjustmentParts.length > 0
      ? `Adjustments applied: ${adjustmentParts.join(", ")}`
      : "No adjustments applied.",
    `Final offer: ${finalOffer} ${salaryBand.currency}`,
    tier === "GREEN"
      ? "Auto-approved — no human approval needed."
      : `Requires approval from: ${approvalChain.map((a) => a.name).join(", ")}`,
  ].join("\n");

  return {
    tier,
    baseSalary,
    adjustments,
    finalOffer,
    requiresApproval: tier !== "GREEN",
    approvalChain,
    explanation,
  };
}

// ============================================================
// APPROVAL CHAIN CONFIGURATION
// ============================================================

function getApprovalChain(tier: OfferTier): ApproverConfig[] {
  switch (tier) {
    case "GREEN":
      // No approvals needed
      return [];

    case "AMBER":
      // Tarek + DD in parallel
      return [
        { ...APPROVERS.TA_LEAD, parallel: true },
        { ...APPROVERS.DIRECTOR, parallel: true },
      ];

    case "RED":
      // Tarek → DD → COO (sequential, but Tarek+DD can be parallel)
      return [
        { ...APPROVERS.TA_LEAD, parallel: true },
        { ...APPROVERS.DIRECTOR, parallel: true },
        { ...APPROVERS.COO, parallel: false },
      ];
  }
}

// ============================================================
// COUNTER-OFFER ENGINE
// ============================================================

export function processCounterOffer(
  input: CounterOfferInput
): CounterOfferResult {
  const { counterAmount, currentOffer, round, salaryBand } = input;
  const { max } = salaryBand;
  const maxPlus10 = Math.round(max * 1.1);

  // Round 3 = final. No more negotiation.
  if (round >= 3) {
    return {
      action: "CLOSE",
      explanation:
        "Maximum negotiation rounds (3) reached. Candidate will be closed if they do not accept the current offer.",
    };
  }

  // Candidate lowered their ask below our current offer (rare but possible)
  if (counterAmount <= currentOffer) {
    return {
      action: "AUTO_ACCEPT",
      revisedAmount: counterAmount,
      explanation: `Candidate countered with ${counterAmount} which is at or below the current offer of ${currentOffer}. Auto-accepting at their requested amount.`,
    };
  }

  // Counter is within max — calculate midpoint between current offer and counter
  if (counterAmount <= max) {
    const revisedAmount = Math.round((currentOffer + counterAmount) / 2);
    const tier = classifyTier(revisedAmount, salaryBand.mid, max);
    return {
      action: "REVISED_OFFER",
      revisedAmount,
      tier,
      explanation: `Candidate countered with ${counterAmount}. Revised offer = midpoint of current offer (${currentOffer}) and counter = ${revisedAmount}. Tier: ${tier}.`,
    };
  }

  // Counter is above max but within max + 10%
  if (counterAmount <= maxPlus10) {
    return {
      action: "REVISED_OFFER",
      revisedAmount: max,
      tier: "RED",
      explanation: `Candidate countered with ${counterAmount} (above max ${max} but within 10% buffer). Revised offer set to max (${max}). Requires RED path approval.`,
    };
  }

  // Counter is way above max + 10% — exceptional case
  return {
    action: "ESCALATE",
    explanation: `Candidate countered with ${counterAmount} which is more than 10% above max (${max}). Flagged as exceptional. Recruiter + DD must intervene.`,
  };
}

// ============================================================
// SLA CALCULATION
// ============================================================

export function calculateSLADeadline(tier: OfferTier): Date {
  const now = new Date();
  const hours = tier === "RED" ? 48 : 24; // RED = 48h, AMBER = 24h
  return new Date(now.getTime() + hours * 60 * 60 * 1000);
}

// ============================================================
// OFFER SUMMARY GENERATOR (for approvers)
// This creates a structured summary; Claude API enhances it
// ============================================================

export function generateApprovalSummary(params: {
  candidateName: string;
  roleName: string;
  client: string;
  expectedSalary: number;
  offeredSalary: number;
  salaryBand: { min: number; mid: number; max: number };
  tier: OfferTier;
  explanation: string;
  round: number;
  marketMedian?: number;
}): string {
  const {
    candidateName,
    roleName,
    client,
    expectedSalary,
    offeredSalary,
    salaryBand,
    tier,
    explanation,
    round,
    marketMedian,
  } = params;

  const bandPosition =
    ((offeredSalary - salaryBand.min) / (salaryBand.max - salaryBand.min)) *
    100;

  return [
    `SALARY CALIBRATION REQUEST — ${tier} PATH`,
    `${"=".repeat(50)}`,
    ``,
    `Candidate: ${candidateName}`,
    `Role: ${roleName} (${client})`,
    `Negotiation Round: ${round}`,
    ``,
    `Expected Salary: ${expectedSalary.toLocaleString()}`,
    `Recommended Offer: ${offeredSalary.toLocaleString()}`,
    `Salary Band: ${salaryBand.min.toLocaleString()} — ${salaryBand.mid.toLocaleString()} — ${salaryBand.max.toLocaleString()}`,
    `Position in Band: ${bandPosition.toFixed(0)}%`,
    marketMedian
      ? `Market Median: ${marketMedian.toLocaleString()}`
      : "",
    ``,
    `Calculation:`,
    explanation,
  ]
    .filter(Boolean)
    .join("\n");
}
