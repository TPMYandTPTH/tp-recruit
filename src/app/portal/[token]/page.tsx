import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { getStageGroup } from "@/lib/types";
import ProgressTracker from "@/components/portal/ProgressTracker";
import ScreeningForm from "@/components/portal/ScreeningForm";
import AssessmentStage from "@/components/portal/AssessmentStage";
import InterviewStage from "@/components/portal/InterviewStage";
import OfferStage from "@/components/portal/OfferStage";
import OnboardingStage from "@/components/portal/OnboardingStage";
import RejectedStage from "@/components/portal/RejectedStage";

interface Props {
  params: { token: string };
}

export default async function CandidatePortal({ params }: Props) {
  const { token } = params;

  // Special "demo" token for testing
  if (token === "demo") {
    return <DemoPortal />;
  }

  const candidate = await prisma.candidate.findUnique({
    where: { portalToken: token },
    include: {
      role: true,
      offers: {
        orderBy: { createdAt: "desc" },
        take: 1,
        include: { approvals: true },
      },
    },
  });

  if (!candidate) {
    notFound();
  }

  const stageGroup = getStageGroup(candidate.stage);
  const latestOffer = candidate.offers[0] || null;
  const interviewMode = candidate.role.interviewMode;

  // Determine which stages to show in the progress tracker
  const stages = [
    { id: "screening", label: "Screening", show: true },
    { id: "assessment", label: "Assessment", show: true },
    {
      id: "interview",
      label: "Interview",
      show: interviewMode !== "NO_INTERVIEW",
    },
    { id: "offer", label: "Offer", show: true },
    { id: "onboarding", label: "Onboarding", show: true },
  ].filter((s) => s.show);

  return (
    <div className="min-h-screen bg-[#f5f4f2]">
      {/* Header */}
      <header className="tp-gradient text-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">
              Welcome, {candidate.firstName}
            </h1>
            <p className="text-sm text-white/80">
              {candidate.role.title} — {candidate.role.client}
            </p>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#ece9e7] text-[#4B4C6A]">
              {stageGroup.charAt(0).toUpperCase() + stageGroup.slice(1)}
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Left sidebar — Progress Tracker */}
          <div className="md:col-span-1">
            <ProgressTracker
              stages={stages}
              currentStage={stageGroup}
            />
          </div>

          {/* Main content — Current Stage */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              {stageGroup === "screening" && (
                <ScreeningForm
                  candidateId={candidate.id}
                  roleId={candidate.roleId}
                />
              )}

              {stageGroup === "assessment" && (
                <AssessmentStage
                  candidateId={candidate.id}
                  assessmentLink={candidate.assessmentLink}
                  assessmentScore={candidate.assessmentScore}
                  stage={candidate.stage}
                />
              )}

              {stageGroup === "interview" && (
                <InterviewStage
                  candidateId={candidate.id}
                  interviewMode={interviewMode}
                  scheduledAt={candidate.interviewScheduledAt}
                  stage={candidate.stage}
                />
              )}

              {stageGroup === "offer" && (
                <OfferStage
                  candidateId={candidate.id}
                  offer={latestOffer}
                  stage={candidate.stage}
                  roleName={candidate.role.title}
                  currency={candidate.role.currency}
                />
              )}

              {stageGroup === "onboarding" && (
                <OnboardingStage
                  candidateId={candidate.id}
                  stage={candidate.stage}
                />
              )}

              {stageGroup === "rejected" && (
                <RejectedStage stage={candidate.stage} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Demo version with mock data for testing
function DemoPortal() {
  return (
    <div className="min-h-screen bg-[#f5f4f2]">
      <header className="tp-gradient text-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl font-bold text-white">
            Welcome, Demo Candidate
          </h1>
          <p className="text-sm text-white/80">
            Customer Service Agent - EN — Demo Client
          </p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="text-center py-12">
            <div className="text-5xl mb-4">🚀</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Demo Mode
            </h2>
            <p className="text-gray-500 max-w-md mx-auto">
              This is a demo view of the candidate portal. To see it in action,
              create a candidate through the dashboard and use their unique
              portal link.
            </p>
            <a
              href="/dashboard"
              className="inline-block mt-6 px-6 py-3 bg-[#4B4C6A] text-white rounded-xl font-medium hover:bg-[#3e2666] transition-colors"
            >
              Go to Dashboard
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
