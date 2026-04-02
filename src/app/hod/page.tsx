"use client";

import { useState } from "react";
import Navbar from "@/components/ui/Navbar";
import InfoTooltip from "@/components/ui/InfoTooltip";
import {
  Clock, CheckCircle2, XCircle, TrendingUp, AlertTriangle,
  ThumbsUp, ThumbsDown, BarChart3, Bell, Calendar
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────
type TabType = "offers" | "headcount" | "budget";
type ApprovalStatus = "pending" | "approved" | "rejected";
type Tier = "GREEN" | "AMBER" | "RED";

interface OfferApproval {
  id: string;
  candidateName: string;
  role: string;
  client: string;
  offeredSalary: number;
  tier: Tier;
  requestedBy: string;
  daysLeft: number;
  isOverdue: boolean;
  needsCEOApproval?: boolean;
  status: ApprovalStatus;
}

interface HeadcountRequest {
  id: string;
  teamName: string;
  requestedCount: number;
  newCount: number;
  justification: string;
  status: ApprovalStatus;
}

interface BudgetItem {
  id: string;
  name: string;
  amount: number;
  requestedBy: string;
  status: ApprovalStatus;
}

// ─── Demo Data ───────────────────────────────────────────────────
const OFFER_APPROVALS: OfferApproval[] = [
  {
    id: "o1",
    candidateName: "Sarah Lim",
    role: "CSR Mandarin",
    client: "Tech Giant",
    offeredSalary: 3400,
    tier: "GREEN",
    requestedBy: "Aisha",
    daysLeft: 2,
    isOverdue: false,
    status: "pending"
  },
  {
    id: "o2",
    candidateName: "Yamada Kenji",
    role: "CSR Japanese",
    client: "Automotive",
    offeredSalary: 4500,
    tier: "AMBER",
    requestedBy: "Daniel",
    daysLeft: 1,
    isOverdue: false,
    status: "pending"
  },
  {
    id: "o3",
    candidateName: "Ahmad Razak",
    role: "Sales BM",
    client: "Telco",
    offeredSalary: 3100,
    tier: "GREEN",
    requestedBy: "Aisha",
    daysLeft: 3,
    isOverdue: false,
    status: "pending"
  },
  {
    id: "o4",
    candidateName: "Tan Mei Xuan",
    role: "CSR Cantonese",
    client: "E-Commerce",
    offeredSalary: 3800,
    tier: "AMBER",
    requestedBy: "Daniel",
    daysLeft: -1,
    isOverdue: true,
    status: "pending"
  },
  {
    id: "o5",
    candidateName: "Lee Min Ho",
    role: "CSR Korean",
    client: "Gaming",
    offeredSalary: 5200,
    tier: "RED",
    requestedBy: "Aisha",
    daysLeft: 4,
    isOverdue: false,
    needsCEOApproval: true,
    status: "pending"
  }
];

const HEADCOUNT_REQUESTS: HeadcountRequest[] = [
  {
    id: "h1",
    teamName: "CSR Mandarin Team",
    requestedCount: 15,
    newCount: 20,
    justification: "New client onboarding Q2",
    status: "pending"
  },
  {
    id: "h2",
    teamName: "Korean Support",
    requestedCount: 3,
    newCount: 8,
    justification: "Gaming client expansion",
    status: "pending"
  },
  {
    id: "h3",
    teamName: "Sales BM",
    requestedCount: 10,
    newCount: 12,
    justification: "Telco campaign ramp-up",
    status: "approved"
  }
];

const BUDGET_ITEMS: BudgetItem[] = [
  {
    id: "b1",
    name: "LinkedIn Premium Recruiter Seats",
    amount: 45000,
    requestedBy: "Marketing",
    status: "pending"
  },
  {
    id: "b2",
    name: "JobStreet Featured Listings Q2",
    amount: 12000,
    requestedBy: "Sourcing",
    status: "pending"
  },
  {
    id: "b3",
    name: "Career Fair Booth (April)",
    amount: 8500,
    requestedBy: "HR",
    status: "approved"
  }
];

// ─── Component ───────────────────────────────────────────────────
export default function HODPage() {
  const [activeTab, setActiveTab] = useState<TabType>("offers");
  const [offers, setOffers] = useState<OfferApproval[]>(OFFER_APPROVALS);
  const [headcount, setHeadcount] = useState<HeadcountRequest[]>(HEADCOUNT_REQUESTS);
  const [budgets, setBudgets] = useState<BudgetItem[]>(BUDGET_ITEMS);

  // Handlers
  const handleOfferAction = (id: string, action: "approve" | "reject") => {
    setOffers(offers.map(o =>
      o.id === id ? { ...o, status: action === "approve" ? "approved" : "rejected" } : o
    ));
  };

  const handleHeadcountAction = (id: string, action: "approve" | "reject") => {
    setHeadcount(headcount.map(h =>
      h.id === id ? { ...h, status: action === "approve" ? "approved" : "rejected" } : h
    ));
  };

  const handleBudgetAction = (id: string, action: "approve" | "reject") => {
    setBudgets(budgets.map(b =>
      b.id === id ? { ...b, status: action === "approve" ? "approved" : "rejected" } : b
    ));
  };

  // Stats calculations
  const pendingOffersCount = offers.filter(o => o.status === "pending").length;
  const approvedThisMonth = offers.filter(o => o.status === "approved").length;
  const rejectedCount = offers.filter(o => o.status === "rejected").length;
  const avgApprovalTime = 1.2;

  // Tier colors and badges
  const getTierStyles = (tier: Tier) => {
    switch (tier) {
      case "GREEN":
        return { bg: "bg-green-50", text: "text-green-700", border: "border-green-200" };
      case "AMBER":
        return { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" };
      case "RED":
        return { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" };
    }
  };

  const getStatusStyles = (status: ApprovalStatus) => {
    switch (status) {
      case "approved":
        return "bg-green-50 text-green-700 border-green-200";
      case "rejected":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-amber-50 text-amber-700 border-amber-200";
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f7f5] lg:pl-[240px]">
      <Navbar />

      {/* Header */}
      <header className="bg-white border-b border-[#E6E6E5] px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-3xl font-bold text-[#4B4C6A]">HOD Approval Center</h1>
            <InfoTooltip text="Review and approve headcount requests, offer packages, and budget allocations across all departments." position="right" />
          </div>
          <p className="text-[#676767] text-sm">Review and approve headcount, offers, and budgets</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Pending Approvals */}
          <div className="bg-white rounded-xl border border-[#E6E6E5] p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[#848DAD] text-xs font-semibold uppercase tracking-wide mb-1">Pending Approvals</p>
                <p className="text-3xl font-bold text-[#FF5C00]">{pendingOffersCount}</p>
                <p className="text-[11px] text-[#676767] mt-2">Awaiting your decision</p>
              </div>
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-orange-50">
                <AlertTriangle size={16} className="text-[#FF5C00]" />
              </div>
            </div>
          </div>

          {/* Approved This Month */}
          <div className="bg-white rounded-xl border border-[#E6E6E5] p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[#848DAD] text-xs font-semibold uppercase tracking-wide mb-1">Approved This Month</p>
                <p className="text-3xl font-bold text-[#00AF9B]">{approvedThisMonth}</p>
                <p className="text-[11px] text-[#676767] mt-2">Moving forward</p>
              </div>
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-50">
                <CheckCircle2 size={16} className="text-[#00AF9B]" />
              </div>
            </div>
          </div>

          {/* Rejected */}
          <div className="bg-white rounded-xl border border-[#E6E6E5] p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[#848DAD] text-xs font-semibold uppercase tracking-wide mb-1">Rejected</p>
                <p className="text-3xl font-bold text-[#AB2C37]">{rejectedCount}</p>
                <p className="text-[11px] text-[#676767] mt-2">Not proceeded</p>
              </div>
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-red-50">
                <XCircle size={16} className="text-[#AB2C37]" />
              </div>
            </div>
          </div>

          {/* Avg Approval Time */}
          <div className="bg-white rounded-xl border border-[#E6E6E5] p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[#848DAD] text-xs font-semibold uppercase tracking-wide mb-1">Avg. Approval Time</p>
                <p className="text-3xl font-bold text-[#3047B0]">{avgApprovalTime}d</p>
                <p className="text-[11px] text-[#676767] mt-2">Days to approve</p>
              </div>
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-50">
                <Clock size={16} className="text-[#3047B0]" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl border border-[#E6E6E5] mb-6 overflow-hidden">
          <div className="flex border-b border-[#E6E6E5]">
            {[
              { id: "offers", label: "Offer Approvals" },
              { id: "headcount", label: "Headcount Requests" },
              { id: "budget", label: "Budget Approvals" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex-1 px-4 py-4 text-sm font-semibold transition-all ${
                  activeTab === tab.id
                    ? "text-[#FF0082] border-b-2 border-[#FF0082]"
                    : "text-[#676767] hover:text-[#414141]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* Tab 1: Offer Approvals */}
            {activeTab === "offers" && (
              <div className="space-y-4">
                {offers.length === 0 ? (
                  <div className="text-center py-8 text-[#848DAD]">
                    No offer approvals to review.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-[#E6E6E5]">
                          <th className="text-left px-3 py-3 text-[11px] font-semibold text-[#676767] uppercase tracking-wider">Candidate</th>
                          <th className="text-left px-3 py-3 text-[11px] font-semibold text-[#676767] uppercase tracking-wider">Role</th>
                          <th className="text-left px-3 py-3 text-[11px] font-semibold text-[#676767] uppercase tracking-wider">Client</th>
                          <th className="text-left px-3 py-3 text-[11px] font-semibold text-[#676767] uppercase tracking-wider">Salary</th>
                          <th className="text-left px-3 py-3 text-[11px] font-semibold text-[#676767] uppercase tracking-wider">Tier</th>
                          <th className="text-left px-3 py-3 text-[11px] font-semibold text-[#676767] uppercase tracking-wider">Requested By</th>
                          <th className="text-left px-3 py-3 text-[11px] font-semibold text-[#676767] uppercase tracking-wider">SLA</th>
                          <th className="text-right px-3 py-3 text-[11px] font-semibold text-[#676767] uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E6E6E5]">
                        {offers.map((offer) => {
                          const tierStyles = getTierStyles(offer.tier);
                          return (
                            <tr key={offer.id} className={offer.status !== "pending" ? "opacity-60" : ""}>
                              <td className="px-3 py-3">
                                <p className="font-medium text-[#414141]">{offer.candidateName}</p>
                              </td>
                              <td className="px-3 py-3 text-[#676767]">{offer.role}</td>
                              <td className="px-3 py-3 text-[#676767]">{offer.client}</td>
                              <td className="px-3 py-3">
                                <span className="font-semibold text-[#4B4C6A]">RM {offer.offeredSalary.toLocaleString()}</span>
                              </td>
                              <td className="px-3 py-3">
                                <span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold border ${tierStyles.bg} ${tierStyles.text} ${tierStyles.border}`}>
                                  {offer.tier}
                                </span>
                              </td>
                              <td className="px-3 py-3 text-[#676767]">{offer.requestedBy}</td>
                              <td className="px-3 py-3">
                                {offer.status === "pending" ? (
                                  <div className="flex flex-col">
                                    <span className={`text-[11px] font-semibold ${offer.isOverdue ? "text-[#AB2C37]" : "text-[#00AF9B]"}`}>
                                      {offer.isOverdue ? "OVERDUE!" : `${offer.daysLeft} days left`}
                                    </span>
                                  </div>
                                ) : (
                                  <span className={`text-[11px] font-semibold ${offer.status === "approved" ? "text-[#00AF9B]" : "text-[#AB2C37]"}`}>
                                    {offer.status === "approved" ? "Approved" : "Rejected"}
                                  </span>
                                )}
                              </td>
                              <td className="px-3 py-3 text-right">
                                {offer.status === "pending" ? (
                                  <div className="flex justify-end gap-1">
                                    <button
                                      onClick={() => handleOfferAction(offer.id, "approve")}
                                      className="flex items-center gap-1 px-2.5 py-1.5 bg-[#00AF9B] text-white rounded-lg text-[11px] font-semibold hover:bg-[#00957f] transition-colors"
                                    >
                                      <ThumbsUp size={12} /> Approve
                                    </button>
                                    <button
                                      onClick={() => handleOfferAction(offer.id, "reject")}
                                      className="flex items-center gap-1 px-2.5 py-1.5 border border-[#E6E6E5] text-[#676767] rounded-lg text-[11px] font-semibold hover:bg-[#ECE9E7] transition-colors"
                                    >
                                      <ThumbsDown size={12} /> Reject
                                    </button>
                                  </div>
                                ) : (
                                  <span className={`text-[11px] font-semibold ${offer.status === "approved" ? "text-[#00AF9B]" : "text-[#AB2C37]"}`}>
                                    {offer.status === "approved" ? "✓ Approved" : "✗ Rejected"}
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* CEO Approval Warning */}
                {offers.some(o => o.needsCEOApproval && o.status === "pending") && (
                  <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                    <AlertTriangle size={16} className="text-red-700 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-red-700">CEO Approval Required</p>
                      <p className="text-xs text-red-600 mt-1">Some offers (RED tier) require CEO approval before proceeding. Please escalate accordingly.</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Headcount Requests */}
            {activeTab === "headcount" && (
              <div className="space-y-4">
                {headcount.length === 0 ? (
                  <div className="text-center py-8 text-[#848DAD]">
                    No headcount requests to review.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {headcount.map((item) => (
                      <div
                        key={item.id}
                        className={`border rounded-lg p-5 transition-all ${
                          item.status === "pending"
                            ? "border-[#E6E6E5] bg-white"
                            : "border-green-200 bg-green-50"
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-[#414141] mb-1">{item.teamName}</h3>
                            <p className="text-[11px] text-[#848DAD]">{item.justification}</p>
                          </div>
                          <span className={`text-[11px] font-semibold px-2 py-1 rounded border ${getStatusStyles(item.status)}`}>
                            {item.status === "approved" ? "✓ Approved" : "Pending"}
                          </span>
                        </div>

                        <div className="bg-[#f8f7f5] rounded p-3 mb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm text-[#676767]">Current Count:</span>
                            <span className="font-bold text-[#4B4C6A]">{item.requestedCount}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-[#676767]">Requested:</span>
                            <span className="font-bold text-[#4B4C6A]">{item.newCount}</span>
                            <span className="text-green-700 font-semibold text-sm">+{item.newCount - item.requestedCount}</span>
                          </div>
                        </div>

                        {item.status === "pending" && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleHeadcountAction(item.id, "approve")}
                              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-[#00AF9B] text-white rounded-lg text-sm font-semibold hover:bg-[#00957f] transition-colors"
                            >
                              <CheckCircle2 size={14} /> Approve
                            </button>
                            <button
                              onClick={() => handleHeadcountAction(item.id, "reject")}
                              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 border border-[#E6E6E5] text-[#676767] rounded-lg text-sm font-semibold hover:bg-[#ECE9E7] transition-colors"
                            >
                              <XCircle size={14} /> Reject
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: Budget Approvals */}
            {activeTab === "budget" && (
              <div className="space-y-3">
                {budgets.length === 0 ? (
                  <div className="text-center py-8 text-[#848DAD]">
                    No budget items to review.
                  </div>
                ) : (
                  budgets.map((item) => (
                    <div
                      key={item.id}
                      className={`flex items-center justify-between p-4 border rounded-lg transition-all ${
                        item.status === "pending"
                          ? "border-[#E6E6E5] bg-white hover:border-[#C2C7CD]"
                          : "border-green-200 bg-green-50"
                      }`}
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-[#414141] mb-1">{item.name}</h3>
                        <div className="flex items-center gap-3 text-sm">
                          <span className="text-[#676767]">Requested by <span className="font-medium text-[#4B4C6A]">{item.requestedBy}</span></span>
                          <span className="text-[#848DAD]">•</span>
                          <span className="font-bold text-[#FF0082]">RM {item.amount.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded border ${getStatusStyles(item.status)}`}>
                          {item.status === "approved" ? "✓ Approved" : "Pending"}
                        </span>

                        {item.status === "pending" && (
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => handleBudgetAction(item.id, "approve")}
                              className="flex items-center gap-1 px-2.5 py-1.5 bg-[#4B4C6A] text-white rounded-lg text-[11px] font-semibold hover:bg-[#3a3b55] transition-colors"
                            >
                              <CheckCircle2 size={12} /> Approve
                            </button>
                            <button
                              onClick={() => handleBudgetAction(item.id, "reject")}
                              className="flex items-center gap-1 px-2.5 py-1.5 border border-[#E6E6E5] text-[#676767] rounded-lg text-[11px] font-semibold hover:bg-[#ECE9E7] transition-colors"
                            >
                              <XCircle size={12} /> Reject
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
