"use client";

import { useState } from "react";
import Navbar from "@/components/ui/Navbar";
import InfoTooltip from "@/components/ui/InfoTooltip";
import {
  Users, Clock, CheckCircle2, XCircle, TrendingUp, AlertTriangle,
  Search, Filter, Phone, Mail, Calendar, MessageCircle, Star,
  ChevronDown, ChevronRight, Eye, RefreshCw, ArrowUpDown,
  UserCheck, Timer, Zap, BarChart3, Bell
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────
type Stage = "APPLIED" | "SCREENING" | "INTERVIEW" | "OFFER" | "HIRED" | "REJECTED";
type Priority = "HIGH" | "MEDIUM" | "LOW";

interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  client: string;
  stage: Stage;
  source: string;
  appliedDate: string;
  lastAction: string;
  lastActionType: string;
  cvScore: number;
  daysInStage: number;
  followUpDue: boolean;
  followUpDate?: string;
  interviewDate?: string;
  assignedTo: string;
  priority: Priority;
  flags: string[];
  notes: string[];
  salary?: { expected: number; offered?: number; currency: string };
}

// ─── Demo Data ───────────────────────────────────────────────────
const CANDIDATES: Candidate[] = [
  {
    id: "r1", name: "Sarah Lim Wei Ling", email: "sarah.lim@email.com", phone: "+60 12-345 6789",
    role: "CSR (Mandarin)", client: "Tech Giant", stage: "INTERVIEW", source: "JobStreet",
    appliedDate: "2026-03-18", lastAction: "Interview scheduled — Mar 25", lastActionType: "interview",
    cvScore: 82, daysInStage: 2, followUpDue: false, followUpDate: "2026-03-26",
    interviewDate: "2026-03-25", assignedTo: "Aisha", priority: "HIGH",
    flags: ["BPO Experience", "High CV Score"], notes: ["Strong Mandarin skills", "2yr TDCX exp"],
    salary: { expected: 3200, currency: "MYR" }
  },
  {
    id: "r2", name: "Ahmad Razak bin Mohd", email: "ahmad.razak@email.com", phone: "+60 17-789 0123",
    role: "Sales Agent (BM)", client: "Telco Provider", stage: "SCREENING", source: "Walk-in QR",
    appliedDate: "2026-03-20", lastAction: "Walk-in registered via QR", lastActionType: "registered",
    cvScore: 55, daysInStage: 4, followUpDue: true, followUpDate: "2026-03-23",
    assignedTo: "Aisha", priority: "MEDIUM",
    flags: ["Walk-in"], notes: ["Follow up needed — no response to screening call"],
    salary: { expected: 2800, currency: "MYR" }
  },
  {
    id: "r3", name: "Tan Mei Xuan", email: "meixuan.tan@email.com", phone: "+60 11-222 3344",
    role: "CSR (Cantonese)", client: "E-Commerce", stage: "OFFER", source: "LinkedIn",
    appliedDate: "2026-03-10", lastAction: "Offer sent — RM3,400", lastActionType: "offer",
    cvScore: 91, daysInStage: 1, followUpDue: false,
    assignedTo: "Daniel", priority: "HIGH",
    flags: ["Top Talent", "Trilingual"], notes: ["Cantonese + Mandarin + English", "Counter-offer likely"],
    salary: { expected: 3500, offered: 3400, currency: "MYR" }
  },
  {
    id: "r4", name: "Priya Devi a/p Rajan", email: "priya.devi@email.com", phone: "+60 16-555 7788",
    role: "Tech Support (English)", client: "SaaS Company", stage: "APPLIED", source: "JobStreet",
    appliedDate: "2026-03-24", lastAction: "Application received", lastActionType: "applied",
    cvScore: 68, daysInStage: 0, followUpDue: false,
    assignedTo: "Unassigned", priority: "MEDIUM",
    flags: ["Fresh Grad"], notes: ["BSc IT — University of Malaya"],
    salary: { expected: 2600, currency: "MYR" }
  },
  {
    id: "r5", name: "Yamada Kenji", email: "kenji.y@email.com", phone: "+60 18-999 1122",
    role: "CSR (Japanese)", client: "Automotive", stage: "INTERVIEW", source: "TP Careers Page",
    appliedDate: "2026-03-14", lastAction: "Interview completed — score 8/10", lastActionType: "interview",
    cvScore: 88, daysInStage: 5, followUpDue: true, followUpDate: "2026-03-24",
    interviewDate: "2026-03-21", assignedTo: "Daniel", priority: "HIGH",
    flags: ["Native Speaker", "High Interview Score"], notes: ["Japanese native", "Relocating from Osaka", "Needs follow up on offer"],
    salary: { expected: 4200, currency: "MYR" }
  },
  {
    id: "r6", name: "Lee Min Ho", email: "minho.lee@email.com", phone: "+60 19-333 4455",
    role: "CSR (Korean)", client: "Gaming Studio", stage: "SCREENING", source: "Facebook Ad",
    appliedDate: "2026-03-22", lastAction: "CV under review", lastActionType: "screening",
    cvScore: 72, daysInStage: 2, followUpDue: false,
    assignedTo: "Aisha", priority: "LOW",
    flags: [], notes: ["Korean speaker — part time exp only"],
    salary: { expected: 3000, currency: "MYR" }
  },
  {
    id: "r7", name: "Nurul Aina binti Hassan", email: "nurul.aina@email.com", phone: "+60 13-111 2233",
    role: "Sales Agent (English)", client: "Insurance Co", stage: "REJECTED", source: "Indeed",
    appliedDate: "2026-03-08", lastAction: "Rejected — failed assessment", lastActionType: "rejected",
    cvScore: 42, daysInStage: 10, followUpDue: false,
    assignedTo: "Daniel", priority: "LOW",
    flags: ["Below Threshold"], notes: ["Assessment score 32% — minimum is 50%"],
    salary: { expected: 2500, currency: "MYR" }
  },
  {
    id: "r8", name: "Chin Wei Jun", email: "weijun.chin@email.com", phone: "+60 12-667 8899",
    role: "CSR (Mandarin)", client: "Tech Giant", stage: "HIRED", source: "Referral",
    appliedDate: "2026-03-01", lastAction: "Onboarding started — Mar 24", lastActionType: "hired",
    cvScore: 85, daysInStage: 0, followUpDue: false,
    assignedTo: "Aisha", priority: "LOW",
    flags: ["Referral Bonus"], notes: ["Referred by James Tan", "Start date: April 1"],
    salary: { expected: 3000, offered: 3100, currency: "MYR" }
  },
];

const STAGES: { key: Stage; label: string; color: string; bg: string }[] = [
  { key: "APPLIED", label: "Applied", color: "text-[#3047B0]", bg: "bg-blue-50" },
  { key: "SCREENING", label: "Screening", color: "text-[#706398]", bg: "bg-[#E2DFE8]" },
  { key: "INTERVIEW", label: "Interview", color: "text-[#FF5C00]", bg: "bg-orange-50" },
  { key: "OFFER", label: "Offer", color: "text-[#00AF9B]", bg: "bg-emerald-50" },
  { key: "HIRED", label: "Hired", color: "text-[#00D769]", bg: "bg-green-50" },
  { key: "REJECTED", label: "Rejected", color: "text-[#AB2C37]", bg: "bg-red-50" },
];

const PRIORITY_STYLES: Record<Priority, string> = {
  HIGH: "bg-red-50 text-red-700 border-red-200",
  MEDIUM: "bg-amber-50 text-amber-700 border-amber-200",
  LOW: "bg-gray-50 text-[#676767] border-[#CCCCCC]",
};

// ─── Component ───────────────────────────────────────────────────
export default function RecruiterPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [stageFilter, setStageFilter] = useState<Stage | "ALL">("ALL");
  const [assigneeFilter, setAssigneeFilter] = useState<string>("ALL");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"daysInStage" | "cvScore" | "appliedDate">("daysInStage");
  const [sortDesc, setSortDesc] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: "success" | "info" | "warning" } | null>(null);
  const [candidates, setCandidates] = useState(CANDIDATES);
  const [noteModal, setNoteModal] = useState<{ id: string; note: string } | null>(null);

  const showToast = (message: string, type: "success" | "info" | "warning" = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Filters
  const filtered = candidates
    .filter((c) => {
      if (stageFilter !== "ALL" && c.stage !== stageFilter) return false;
      if (assigneeFilter !== "ALL" && c.assignedTo !== assigneeFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return c.name.toLowerCase().includes(q) || c.role.toLowerCase().includes(q) || c.client.toLowerCase().includes(q);
      }
      return true;
    })
    .sort((a, b) => {
      const mul = sortDesc ? -1 : 1;
      if (sortBy === "daysInStage") return (a.daysInStage - b.daysInStage) * mul;
      if (sortBy === "cvScore") return (a.cvScore - b.cvScore) * mul;
      return (new Date(a.appliedDate).getTime() - new Date(b.appliedDate).getTime()) * mul;
    });

  const assignees = [...new Set(candidates.map((c) => c.assignedTo))];

  // Pipeline counts
  const stageCounts = STAGES.map((s) => ({
    ...s,
    count: candidates.filter((c) => c.stage === s.key).length,
  }));

  const followUpsDue = candidates.filter((c) => c.followUpDue).length;
  const avgDaysInStage = Math.round(candidates.reduce((a, c) => a + c.daysInStage, 0) / candidates.length);

  return (
    <div className="min-h-screen bg-[#f8f7f5] lg:pl-[240px]">
      <Navbar />

      {/* Header */}
      <header className="bg-white border-b border-[#E6E6E5] px-6 py-5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-[#4B4C6A]">Recruiter Monitor</h1>
              <InfoTooltip text="Track all candidates in your pipeline. Filter by stage, recruiter, or search by name. Click any row to expand details and take action." position="right" />
            </div>
            <p className="text-sm text-[#676767] mt-1">Candidate pipeline from the recruiter&apos;s perspective</p>
          </div>
          <div className="flex items-center gap-3">
            {followUpsDue > 0 && (
              <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 px-3 py-1.5 rounded-lg text-sm font-medium">
                <Bell size={14} />
                {followUpsDue} follow-up{followUpsDue > 1 ? "s" : ""} due
              </div>
            )}
            <button
              onClick={() => {
                // Export pipeline data to CSV
                const headers = ["Name","Email","Phone","Role","Client","Stage","Source","Applied Date","CV Score","Days in Stage","Priority","Assigned To","Salary Expected"];
                const rows = candidates.map(c => [
                  c.name, c.email, c.phone, c.role, c.client, c.stage, c.source,
                  c.appliedDate, c.cvScore, c.daysInStage, c.priority, c.assignedTo,
                  c.salary ? `${c.salary.currency} ${c.salary.expected}` : ""
                ]);
                const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(",")).join("\n");
                const blob = new Blob([csv], { type: "text/csv" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `TP_Pipeline_Export_${new Date().toISOString().split("T")[0]}.csv`;
                a.click();
                URL.revokeObjectURL(url);
                showToast("Pipeline exported to CSV", "success");
              }}
              className="flex items-center gap-2 border border-[#4B4C6A] text-[#4B4C6A] px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#ECE9E7] transition-colors"
            >
              <TrendingUp size={14} />
              Export CSV
            </button>
            <button onClick={() => { setCandidates([...CANDIDATES]); showToast("Pipeline refreshed", "success"); }} className="flex items-center gap-2 bg-[#4B4C6A] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#3a3b55] transition-colors">
              <RefreshCw size={14} />
              Refresh
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6">

        {/* Pipeline Overview Cards */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-6">
          {stageCounts.map((s) => (
            <button
              key={s.key}
              onClick={() => setStageFilter(stageFilter === s.key ? "ALL" : s.key)}
              className={`p-3 rounded-xl border text-center transition-all duration-200 ${
                stageFilter === s.key ? "border-[#4B4C6A] ring-2 ring-[#4B4C6A]/20 bg-white" : "border-[#E6E6E5] bg-white hover:border-[#C2C7CD]"
              }`}
            >
              <p className={`text-2xl font-bold ${s.color}`}>{s.count}</p>
              <p className="text-[11px] text-[#676767] font-medium mt-0.5">{s.label}</p>
            </button>
          ))}
        </div>

        {/* Quick Stats Bar */}
        <div className="flex flex-wrap gap-4 mb-6 text-sm">
          <div className="flex items-center gap-2 text-[#414141]">
            <Timer size={14} className="text-[#848DAD]" />
            Avg. days in stage: <span className="font-semibold text-[#4B4C6A]">{avgDaysInStage}</span>
            <InfoTooltip text="Average number of days candidates stay in their current pipeline stage. Lower is better." size={12} />
          </div>
          <div className="flex items-center gap-2 text-[#414141]">
            <BarChart3 size={14} className="text-[#848DAD]" />
            Total pipeline: <span className="font-semibold text-[#4B4C6A]">{candidates.length}</span>
          </div>
          <div className="flex items-center gap-2 text-[#414141]">
            <Zap size={14} className="text-[#FF0082]" />
            High priority: <span className="font-semibold text-[#4B4C6A]">{candidates.filter(c => c.priority === "HIGH").length}</span>
          </div>
        </div>

        {/* Filters Row */}
        <div className="bg-white rounded-xl border border-[#E6E6E5] p-4 mb-4 flex flex-wrap gap-3 items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#848DAD]" />
            <input
              type="text"
              placeholder="Search by name, role, or client..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-[#E6E6E5] bg-[#f8f7f5] text-sm text-[#414141] placeholder:text-[#C2C7CD] focus:outline-none focus:ring-2 focus:ring-[#4B4C6A]/20 focus:border-[#4B4C6A]"
            />
          </div>

          {/* Stage Filter */}
          <div className="flex items-center gap-1.5">
            <Filter size={14} className="text-[#848DAD]" />
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value as Stage | "ALL")}
              className="text-sm border border-[#E6E6E5] rounded-lg px-3 py-2 bg-white text-[#414141] focus:outline-none focus:ring-2 focus:ring-[#4B4C6A]/20"
            >
              <option value="ALL">All Stages</option>
              {STAGES.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
            </select>
          </div>

          {/* Assignee Filter */}
          <select
            value={assigneeFilter}
            onChange={(e) => setAssigneeFilter(e.target.value)}
            className="text-sm border border-[#E6E6E5] rounded-lg px-3 py-2 bg-white text-[#414141] focus:outline-none focus:ring-2 focus:ring-[#4B4C6A]/20"
          >
            <option value="ALL">All Recruiters</option>
            {assignees.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>

          {/* Sort */}
          <button
            onClick={() => {
              if (sortBy === "daysInStage") { setSortBy("cvScore"); setSortDesc(true); }
              else if (sortBy === "cvScore") { setSortBy("appliedDate"); setSortDesc(true); }
              else { setSortBy("daysInStage"); setSortDesc(true); }
            }}
            className="flex items-center gap-1.5 text-sm text-[#4B4C6A] border border-[#E6E6E5] rounded-lg px-3 py-2 hover:bg-[#ECE9E7] transition-colors"
          >
            <ArrowUpDown size={14} />
            {sortBy === "daysInStage" ? "Days in Stage" : sortBy === "cvScore" ? "CV Score" : "Applied Date"}
          </button>
        </div>

        {/* Candidate Table */}
        <div className="bg-white rounded-xl border border-[#E6E6E5] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#f5f4f2] text-left">
                  <th className="px-4 py-3 text-[11px] font-semibold text-[#676767] uppercase tracking-wider">Candidate</th>
                  <th className="px-4 py-3 text-[11px] font-semibold text-[#676767] uppercase tracking-wider">
                    Role / Client
                    <InfoTooltip text="The position the candidate applied for and the client account" size={11} />
                  </th>
                  <th className="px-4 py-3 text-[11px] font-semibold text-[#676767] uppercase tracking-wider">Stage</th>
                  <th className="px-4 py-3 text-[11px] font-semibold text-[#676767] uppercase tracking-wider">
                    CV Score
                    <InfoTooltip text="AI-generated CV match score (0-100). Based on skills, experience, and role requirements." size={11} />
                  </th>
                  <th className="px-4 py-3 text-[11px] font-semibold text-[#676767] uppercase tracking-wider">
                    Days
                    <InfoTooltip text="Number of days the candidate has been in their current stage. High numbers may need attention." size={11} />
                  </th>
                  <th className="px-4 py-3 text-[11px] font-semibold text-[#676767] uppercase tracking-wider">Priority</th>
                  <th className="px-4 py-3 text-[11px] font-semibold text-[#676767] uppercase tracking-wider">Last Action</th>
                  <th className="px-4 py-3 text-[11px] font-semibold text-[#676767] uppercase tracking-wider">Assigned</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6E6E5]">
                {filtered.map((c) => {
                  const stageInfo = STAGES.find((s) => s.key === c.stage);
                  const isExpanded = expandedId === c.id;
                  return (
                    <>
                      <tr
                        key={c.id}
                        onClick={() => setExpandedId(isExpanded ? null : c.id)}
                        className={`cursor-pointer transition-colors ${
                          c.followUpDue ? "bg-amber-50/50" : "hover:bg-[#f8f7f5]"
                        } ${isExpanded ? "bg-[#ECE9E7]" : ""}`}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {isExpanded ? <ChevronDown size={14} className="text-[#848DAD]" /> : <ChevronRight size={14} className="text-[#C2C7CD]" />}
                            <div>
                              <p className="font-medium text-[#414141] text-sm">{c.name}</p>
                              <p className="text-[11px] text-[#848DAD]">{c.source}</p>
                            </div>
                            {c.followUpDue && <Bell size={12} className="text-amber-500 ml-1" />}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm text-[#414141]">{c.role}</p>
                          <p className="text-[11px] text-[#848DAD]">{c.client}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold ${stageInfo?.bg} ${stageInfo?.color}`}>
                            {stageInfo?.label}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-1.5 bg-[#E6E6E5] rounded-full overflow-hidden">
                              <div className="h-full rounded-full" style={{
                                width: `${c.cvScore}%`,
                                backgroundColor: c.cvScore >= 80 ? "#00D769" : c.cvScore >= 60 ? "#FF5C00" : "#AB2C37"
                              }} />
                            </div>
                            <span className="text-sm font-medium text-[#414141]">{c.cvScore}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-sm font-medium ${c.daysInStage >= 5 ? "text-[#AB2C37]" : c.daysInStage >= 3 ? "text-[#FF5C00]" : "text-[#414141]"}`}>
                            {c.daysInStage}d
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-semibold border ${PRIORITY_STYLES[c.priority]}`}>
                            {c.priority}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[12px] text-[#676767] max-w-[180px] truncate">{c.lastAction}</td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-[#4B4C6A] font-medium">{c.assignedTo}</span>
                        </td>
                      </tr>

                      {/* Expanded Detail Row */}
                      {isExpanded && (
                        <tr key={`${c.id}-detail`} className="bg-[#f8f7f5]">
                          <td colSpan={8} className="px-6 py-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              {/* Contact & Info */}
                              <div>
                                <h4 className="text-xs font-semibold text-[#4B4C6A] uppercase tracking-wider mb-2 flex items-center gap-1">
                                  Contact Info
                                  <InfoTooltip text="Candidate's contact details. Click to initiate communication." size={11} />
                                </h4>
                                <div className="space-y-2 text-sm">
                                  <a href={`mailto:${c.email}`} className="flex items-center gap-2 text-[#414141] hover:text-[#FF0082] transition-colors">
                                    <Mail size={13} className="text-[#848DAD]" /> {c.email}
                                  </a>
                                  <a href={`tel:${c.phone}`} className="flex items-center gap-2 text-[#414141] hover:text-[#FF0082] transition-colors">
                                    <Phone size={13} className="text-[#848DAD]" /> {c.phone}
                                  </a>
                                  {c.interviewDate && (
                                    <div className="flex items-center gap-2 text-[#414141]">
                                      <Calendar size={13} className="text-[#848DAD]" /> Interview: {c.interviewDate}
                                    </div>
                                  )}
                                  {c.salary && (
                                    <div className="flex items-center gap-2 text-[#414141]">
                                      <TrendingUp size={13} className="text-[#848DAD]" />
                                      Expected: {c.salary.expected.toLocaleString()} {c.salary.currency}
                                      {c.salary.offered && <> · Offered: <span className="font-semibold text-[#00AF9B]">{c.salary.offered.toLocaleString()}</span></>}
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Notes */}
                              <div>
                                <h4 className="text-xs font-semibold text-[#4B4C6A] uppercase tracking-wider mb-2">Notes</h4>
                                <ul className="space-y-1">
                                  {c.notes.map((note, i) => (
                                    <li key={i} className="text-sm text-[#414141] flex items-start gap-1.5">
                                      <span className="text-[#C2C7CD] mt-1">•</span> {note}
                                    </li>
                                  ))}
                                </ul>
                                {c.flags.length > 0 && (
                                  <div className="flex flex-wrap gap-1.5 mt-3">
                                    {c.flags.map((flag) => (
                                      <span key={flag} className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#E2DFE8] text-[#4B4C6A] rounded text-[10px] font-medium">
                                        <Star size={9} /> {flag}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>

                              {/* Quick Actions */}
                              <div>
                                <h4 className="text-xs font-semibold text-[#4B4C6A] uppercase tracking-wider mb-2 flex items-center gap-1">
                                  Quick Actions
                                  <InfoTooltip text="Take quick actions on this candidate — call, email, schedule, or advance their stage." size={11} />
                                </h4>
                                <div className="grid grid-cols-2 gap-2">
                                  <button onClick={(e) => { e.stopPropagation(); window.open(`tel:${c.phone}`); showToast(`Calling ${c.name}...`, "info"); }} className="flex items-center justify-center gap-1.5 px-3 py-2 bg-[#4B4C6A] text-white rounded-lg text-xs font-medium hover:bg-[#3a3b55] transition-colors">
                                    <Phone size={12} /> Call
                                  </button>
                                  <button onClick={(e) => { e.stopPropagation(); window.open(`mailto:${c.email}?subject=TP Malaysia — Your Application for ${c.role}&body=Dear ${c.name.split(' ')[0]},%0A%0AThank you for your interest in the ${c.role} position at Teleperformance Malaysia.%0A%0ABest regards,%0ATP Recruitment Team`); showToast(`Opening email to ${c.name}`, "info"); }} className="flex items-center justify-center gap-1.5 px-3 py-2 bg-[#4B4C6A] text-white rounded-lg text-xs font-medium hover:bg-[#3a3b55] transition-colors">
                                    <Mail size={12} /> Email
                                  </button>
                                  <button onClick={(e) => { e.stopPropagation(); const stageOrder: Stage[] = ["APPLIED","SCREENING","INTERVIEW","OFFER","HIRED"]; const currentIdx = stageOrder.indexOf(c.stage); if (c.stage === "REJECTED" || c.stage === "HIRED") { showToast(`Cannot advance — candidate is ${c.stage.toLowerCase()}`, "warning"); return; } if (currentIdx < stageOrder.length - 1) { const nextStage = stageOrder[currentIdx + 1]; setCandidates(prev => prev.map(x => x.id === c.id ? { ...x, stage: nextStage, daysInStage: 0, lastAction: `Advanced to ${nextStage}`, lastActionType: "advanced" } : x)); showToast(`${c.name} advanced to ${nextStage}`, "success"); } }} className="flex items-center justify-center gap-1.5 px-3 py-2 bg-[#FF0082] text-white rounded-lg text-xs font-medium hover:bg-[#cc0068] transition-colors">
                                    <CheckCircle2 size={12} /> Advance
                                  </button>
                                  <button onClick={(e) => { e.stopPropagation(); setNoteModal({ id: c.id, note: "" }); }} className="flex items-center justify-center gap-1.5 px-3 py-2 border border-[#E6E6E5] text-[#676767] rounded-lg text-xs font-medium hover:bg-[#ECE9E7] transition-colors">
                                    <MessageCircle size={12} /> Note
                                  </button>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-[#848DAD]">
                      No candidates match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-medium flex items-center gap-2 animate-slide-up ${
          toast.type === "success" ? "bg-green-600" : toast.type === "warning" ? "bg-amber-500" : "bg-[#4B4C6A]"
        }`}>
          {toast.type === "success" ? <CheckCircle2 size={16} /> : toast.type === "warning" ? <AlertTriangle size={16} /> : <Bell size={16} />}
          {toast.message}
        </div>
      )}

      {/* Note Modal */}
      {noteModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center" onClick={() => setNoteModal(null)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-[#4B4C6A] mb-3">Add Note</h3>
            <p className="text-sm text-[#676767] mb-4">{candidates.find(x => x.id === noteModal.id)?.name}</p>
            <textarea
              value={noteModal.note}
              onChange={e => setNoteModal({ ...noteModal, note: e.target.value })}
              placeholder="Type your note here..."
              className="w-full border border-[#E6E6E5] rounded-xl p-3 text-sm min-h-[100px] focus:outline-none focus:ring-2 focus:ring-[#4B4C6A]/20 focus:border-[#4B4C6A]"
              autoFocus
            />
            <div className="flex gap-3 mt-4">
              <button onClick={() => setNoteModal(null)} className="flex-1 py-2.5 border border-[#E6E6E5] rounded-xl text-sm text-[#676767] hover:bg-[#ECE9E7]">Cancel</button>
              <button onClick={() => {
                if (noteModal.note.trim()) {
                  setCandidates(prev => prev.map(x => x.id === noteModal.id ? { ...x, notes: [...x.notes, noteModal.note.trim()] } : x));
                  showToast("Note added", "success");
                }
                setNoteModal(null);
              }} className="flex-1 py-2.5 bg-[#FF0082] text-white rounded-xl text-sm font-medium hover:bg-[#cc0068]">Save Note</button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes slide-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up { animation: slide-up 0.3s ease-out; }
      `}</style>
    </div>
  );
}
