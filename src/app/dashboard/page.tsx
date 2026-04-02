import { prisma } from "@/lib/db";
import {
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import CreateCandidateForm from "@/components/dashboard/CreateCandidateForm";
import CandidateActions from "@/components/dashboard/CandidateActions";
import Navbar from "@/components/ui/Navbar";
import InfoTooltip from "@/components/ui/InfoTooltip";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const [
    totalCandidates,
    screening,
    assessment,
    interview,
    offerSent,
    accepted,
    declined,
    pendingApprovals,
    recentCandidates,
  ] = await Promise.all([
    prisma.candidate.count(),
    prisma.candidate.count({ where: { stage: "SCREENING" } }),
    prisma.candidate.count({
      where: { stage: { in: ["ASSESSMENT_PENDING", "ASSESSMENT_IN_PROGRESS"] } },
    }),
    prisma.candidate.count({
      where: { stage: { in: ["INTERVIEW_PENDING", "INTERVIEW_SCHEDULED"] } },
    }),
    prisma.candidate.count({ where: { stage: "OFFER_SENT" } }),
    prisma.candidate.count({ where: { stage: "OFFER_ACCEPTED" } }),
    prisma.candidate.count({
      where: { stage: { in: ["OFFER_DECLINED", "CLOSED"] } },
    }),
    prisma.approval.count({ where: { status: "PENDING" } }),
    prisma.candidate.findMany({
      orderBy: { updatedAt: "desc" },
      take: 20,
      include: {
        role: true,
        offers: { orderBy: { createdAt: "desc" }, take: 1 },
      },
    }),
  ]);

  const stats = [
    { label: "Total Pipeline", value: totalCandidates, icon: Users, color: "bg-[#eeedf2] text-[#4B4C6A]" },
    { label: "Screening", value: screening, icon: Clock, color: "bg-gray-100 text-gray-600" },
    { label: "Assessment", value: assessment, icon: Clock, color: "bg-amber-100 text-amber-600" },
    { label: "Interview", value: interview, icon: Users, color: "bg-purple-100 text-purple-600" },
    { label: "Offers Sent", value: offerSent, icon: TrendingUp, color: "bg-[#eeedf2] text-[#4B4C6A]" },
    { label: "Accepted", value: accepted, icon: CheckCircle2, color: "bg-green-100 text-green-600" },
    { label: "Declined/Closed", value: declined, icon: XCircle, color: "bg-red-100 text-red-600" },
    { label: "Pending Approvals", value: pendingApprovals, icon: AlertTriangle, color: "bg-amber-100 text-amber-600" },
  ];

  const stageColors: Record<string, string> = {
    SCREENING: "bg-gray-100 text-gray-700",
    ASSESSMENT_PENDING: "bg-amber-100 text-amber-700",
    ASSESSMENT_IN_PROGRESS: "bg-amber-100 text-amber-700",
    INTERVIEW_PENDING: "bg-purple-100 text-purple-700",
    INTERVIEW_SCHEDULED: "bg-purple-100 text-purple-700",
    SELECTED: "bg-[#eeedf2] text-[#4B4C6A]",
    OFFER_CALCULATING: "bg-[#eeedf2] text-[#4B4C6A]",
    OFFER_PENDING_APPROVAL: "bg-amber-100 text-amber-700",
    OFFER_SENT: "bg-[#eeedf2] text-[#4B4C6A]",
    OFFER_ACCEPTED: "bg-green-100 text-green-700",
    OFFER_DECLINED: "bg-red-100 text-red-700",
    OFFER_COUNTERED: "bg-amber-100 text-amber-700",
    RENEGOTIATING: "bg-amber-100 text-amber-700",
    ONBOARDING: "bg-green-100 text-green-700",
    CLOSED: "bg-gray-100 text-gray-700",
    REJECTED: "bg-red-100 text-red-700",
  };

  return (
    <div className="min-h-screen bg-[#f8f7f5] lg:pl-[240px]">
      <Navbar />
      <header className="tp-gradient text-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Recruitment Dashboard</h1>
            <p className="text-sm text-white/80">Post-assessment pipeline management — TP</p>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <CreateCandidateForm />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-white rounded-xl border border-[#e6e6e5] p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-xs text-gray-500">{stat.label}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-xl border border-[#e6e6e5] overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-gray-900">Recent Candidates</h2>
              <InfoTooltip text="Latest candidates moving through the pipeline with their current stage and offer status" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#f5f4f2] text-left">
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Candidate</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Role</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Stage</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Expected</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Offer</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Tier</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentCandidates.map((c) => {
                  const offer = c.offers[0];
                  return (
                    <tr key={c.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">{c.firstName} {c.lastName}</p>
                        <p className="text-xs text-gray-500">{c.email}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {c.role.title}<br />
                        <span className="text-xs text-gray-400">{c.role.client}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${stageColors[c.stage] || "bg-gray-100 text-gray-700"}`}>
                          {c.stage.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {c.expectedSalary ? `${c.expectedSalary.toLocaleString()} ${c.role.currency}` : "—"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {offer ? `${offer.offeredSalary.toLocaleString()} ${c.role.currency}` : "—"}
                      </td>
                      <td className="px-6 py-4">
                        {offer && (
                          <span className={`inline-flex px-2 py-1 rounded text-xs font-bold ${
                            offer.tier === "GREEN" ? "bg-green-100 text-green-700" :
                            offer.tier === "AMBER" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
                          }`}>{offer.tier}</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <CandidateActions
                          candidateId={c.id}
                          portalToken={c.portalToken}
                          stage={c.stage}
                          hasOffer={!!offer}
                        />
                      </td>
                    </tr>
                  );
                })}
                {recentCandidates.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      No candidates yet. Create your first candidate above.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
