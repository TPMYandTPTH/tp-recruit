"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Users, Briefcase, FileText, Shield, ChevronDown, ChevronUp,
  Plus, Pencil, Trash2, Eye, Send, CheckCircle2, XCircle,
  DollarSign, AlertTriangle, RefreshCw, Search, X,
} from "lucide-react";
import Navbar from "@/components/ui/Navbar";
import InfoTooltip from "@/components/ui/InfoTooltip";

// ─── Types ───────────────────────────────────────────────────────────
type Role = {
  id: string; title: string; client: string; campaign?: string;
  department: string; salaryMin: number; salaryMid: number; salaryMax: number;
  currency: string; marketMedian?: number; criticality: string;
  interviewMode: string; totalPositions: number; filledPositions: number;
  createdAt: string;
};

type Offer = {
  id: string; round: number; offeredSalary: number; tier: string;
  baseSalary: number; criticalityAdj: number; fillRateAdj: number;
  marketAdj: number; calculationNotes?: string; approvalStatus: string;
  status: string; aiSummary?: string; sentAt?: string; respondedAt?: string;
  declineReason?: string; counterAmount?: number;
  approvals: Approval[];
};

type Candidate = {
  id: string; firstName: string; lastName: string; email: string;
  phone?: string; portalToken: string; stage: string; source: string;
  expectedSalary?: number; roleId: string; interviewNotes?: string;
  interviewScore?: number; assessmentScore?: number;
  stageUpdatedAt: string; createdAt: string; updatedAt: string;
  role: Role; offers: Offer[];
};

type Approval = {
  id: string; offerId: string; approverEmail: string; approverName: string;
  approverRole: string; status: string; decidedAt?: string; notes?: string;
  slaDeadline: string; reminded: boolean; escalated: boolean;
};

// ─── Constants ───────────────────────────────────────────────────────
const STAGES = [
  "SCREENING", "ASSESSMENT_PENDING", "ASSESSMENT_IN_PROGRESS",
  "INTERVIEW_PENDING", "INTERVIEW_SCHEDULED", "SELECTED",
  "OFFER_CALCULATING", "OFFER_PENDING_APPROVAL", "OFFER_SENT",
  "OFFER_ACCEPTED", "OFFER_DECLINED", "OFFER_COUNTERED",
  "RENEGOTIATING", "ONBOARDING", "CLOSED", "REJECTED",
];

const STAGE_COLORS: Record<string, string> = {
  SCREENING: "bg-gray-100 text-gray-700",
  ASSESSMENT_PENDING: "bg-amber-100 text-amber-700",
  ASSESSMENT_IN_PROGRESS: "bg-amber-100 text-amber-700",
  INTERVIEW_PENDING: "bg-purple-100 text-purple-700",
  INTERVIEW_SCHEDULED: "bg-purple-100 text-purple-700",
  SELECTED: "bg-[#eeedf2] text-[#4B4C6A]",
  OFFER_CALCULATING: "bg-[#eeedf2] text-[#4B4C6A]",
  OFFER_PENDING_APPROVAL: "bg-amber-100 text-amber-700",
  OFFER_SENT: "bg-blue-100 text-blue-700",
  OFFER_ACCEPTED: "bg-green-100 text-green-700",
  OFFER_DECLINED: "bg-red-100 text-red-700",
  OFFER_COUNTERED: "bg-amber-100 text-amber-700",
  RENEGOTIATING: "bg-amber-100 text-amber-700",
  ONBOARDING: "bg-green-100 text-green-700",
  CLOSED: "bg-gray-100 text-gray-700",
  REJECTED: "bg-red-100 text-red-700",
};

const TIER_COLORS: Record<string, string> = {
  GREEN: "bg-green-100 text-green-700 border-green-200",
  AMBER: "bg-amber-100 text-amber-700 border-amber-200",
  RED: "bg-red-100 text-red-700 border-red-200",
};

// ─── Main Admin Page ─────────────────────────────────────────────────
export default function AdminPage() {
  // Note: When Navbar is added below in the JSX, it will automatically render properly
  // Next.js handles mixing server and client components seamlessly
  const [tab, setTab] = useState<"candidates" | "offers" | "roles" | "approvals">("candidates");
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [cRes, rRes] = await Promise.all([
      fetch("/api/candidates"),
      fetch("/api/roles"),
    ]);
    const cData = await cRes.json();
    const rData = await rRes.json();
    setCandidates(cData.candidates || []);
    setRoles(rData.roles || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const tabs = [
    { key: "candidates" as const, label: "Candidates", icon: Users, count: candidates.length },
    { key: "offers" as const, label: "Offers & Salary", icon: DollarSign, count: candidates.filter(c => c.offers.length > 0).length },
    { key: "roles" as const, label: "Jobs / Roles", icon: Briefcase, count: roles.length },
    { key: "approvals" as const, label: "Approvals", icon: Shield, count: candidates.reduce((acc, c) => acc + c.offers.filter(o => o.approvalStatus === "PENDING").length, 0) },
  ];

  return (
    <div className="min-h-screen bg-[#f8f7f5] lg:pl-[240px]">
      <Navbar />
      {/* Header */}
      <header className="tp-gradient text-white px-6 py-4">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/tp-logo-white.png" alt="TP" className="h-10 w-auto" />
            <div>
              <h1 className="text-xl font-bold">Admin Panel</h1>
              <p className="text-sm text-white/70">Recruitment Management System</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a href="/sourcing" className="text-sm text-white/80 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/10 transition">Sourcing</a>
            <a href="/dashboard" className="text-sm text-white/80 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/10 transition">Dashboard</a>
            <a href="/portal/login" className="text-sm text-white/80 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/10 transition">Candidate Portal</a>
            <button onClick={fetchData} className="flex items-center gap-1.5 text-sm bg-white/15 hover:bg-white/25 px-3 py-1.5 rounded-lg transition">
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto px-6 py-6">
        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-xl border border-[#e6e6e5] p-1 mb-6">
          {tabs.map(t => {
            const Icon = t.icon;
            const active = tab === t.key;
            return (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition flex-1 justify-center
                  ${active ? "bg-[#4B4C6A] text-white shadow-sm" : "text-gray-600 hover:bg-gray-50"}`}>
                <Icon className="w-4 h-4" />
                {t.label}
                {t.count > 0 && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${active ? "bg-white/20" : "bg-gray-100"}`}>{t.count}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Search with Tooltip */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <div className="flex items-center gap-2">
            <input type="text" placeholder="Search candidates, roles, emails..."
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 bg-white border border-[#e6e6e5] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4B4C6A]/20 focus:border-[#4B4C6A]" />
            <InfoTooltip text="Search across candidate names, emails, role titles, and approver names" />
          </div>
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <RefreshCw className="w-6 h-6 text-[#4B4C6A] animate-spin" />
            <span className="ml-2 text-gray-500">Loading...</span>
          </div>
        ) : (
          <>
            {tab === "candidates" && <CandidatesTab candidates={candidates} roles={roles} search={searchQuery} onRefresh={fetchData} />}
            {tab === "offers" && <OffersTab candidates={candidates} search={searchQuery} onRefresh={fetchData} />}
            {tab === "roles" && <RolesTab roles={roles} candidates={candidates} search={searchQuery} onRefresh={fetchData} />}
            {tab === "approvals" && <ApprovalsTab candidates={candidates} search={searchQuery} onRefresh={fetchData} />}
          </>
        )}
      </div>
    </div>
  );
}

// ─── Candidates Tab ──────────────────────────────────────────────────
function CandidatesTab({ candidates, roles, search, onRefresh }: {
  candidates: Candidate[]; roles: Role[]; search: string; onRefresh: () => void;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Record<string, any>>({});
  const [stageFilter, setStageFilter] = useState<string>("");

  const filtered = candidates.filter(c => {
    const q = search.toLowerCase();
    const matchesSearch = !q || `${c.firstName} ${c.lastName} ${c.email} ${c.role.title}`.toLowerCase().includes(q);
    const matchesStage = !stageFilter || c.stage === stageFilter;
    return matchesSearch && matchesStage;
  });

  const startEdit = (c: Candidate) => {
    setEditingId(c.id);
    setEditForm({
      firstName: c.firstName, lastName: c.lastName, email: c.email,
      phone: c.phone || "", expectedSalary: c.expectedSalary || "",
      stage: c.stage, source: c.source, roleId: c.roleId,
    });
  };

  const saveEdit = async (id: string) => {
    const payload = { ...editForm };
    if (payload.expectedSalary) payload.expectedSalary = parseFloat(payload.expectedSalary);
    else delete payload.expectedSalary;

    await fetch(`/api/candidates/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setEditingId(null);
    onRefresh();
  };

  const deleteCandidate = async (id: string, name: string) => {
    if (!confirm(`Delete ${name}? This will also delete their offers and approvals.`)) return;
    await fetch(`/api/candidates/${id}`, { method: "DELETE" });
    onRefresh();
  };

  const generateOffer = async (id: string) => {
    const res = await fetch("/api/offers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ candidateId: id }),
    });
    const data = await res.json();
    if (!res.ok) { alert(data.error || "Failed to generate offer"); return; }
    alert(`Offer generated! Tier: ${data.tier} — ${data.autoApproved ? "Auto-approved" : `Pending approval from ${data.approvalChain?.join(", ")}`}`);
    onRefresh();
  };

  const advanceCandidate = async (id: string, targetStage: string) => {
    await fetch("/api/candidates/advance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ candidateId: id, targetStage }),
    });
    onRefresh();
  };

  return (
    <div className="bg-white rounded-xl border border-[#e6e6e5] overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">All Candidates ({filtered.length})</h2>
        <select value={stageFilter} onChange={e => setStageFilter(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#4B4C6A]">
          <option value="">All Stages</option>
          {STAGES.map(s => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-[#f5f4f2] text-left">
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Candidate</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Role</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Stage</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Salary</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Offer</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Source</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase w-48">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map(c => {
              const offer = c.offers[0];
              const isExpanded = expandedId === c.id;
              const isEditing = editingId === c.id;

              return (
                <tr key={c.id} className="group">
                  <td colSpan={7} className="p-0">
                    <div className="flex items-center hover:bg-gray-50/50">
                      {/* Candidate */}
                      <div className="px-4 py-3 min-w-[200px]">
                        {isEditing ? (
                          <div className="flex gap-1">
                            <input value={editForm.firstName} onChange={e => setEditForm({...editForm, firstName: e.target.value})}
                              className="w-20 text-sm border rounded px-1 py-0.5" />
                            <input value={editForm.lastName} onChange={e => setEditForm({...editForm, lastName: e.target.value})}
                              className="w-20 text-sm border rounded px-1 py-0.5" />
                          </div>
                        ) : (
                          <>
                            <p className="font-medium text-gray-900 text-sm">{c.firstName} {c.lastName}</p>
                            <p className="text-xs text-gray-500">{c.email}</p>
                          </>
                        )}
                      </div>

                      {/* Role */}
                      <div className="px-4 py-3 min-w-[160px]">
                        {isEditing ? (
                          <select value={editForm.roleId} onChange={e => setEditForm({...editForm, roleId: e.target.value})}
                            className="text-xs border rounded px-1 py-0.5 w-full">
                            {roles.map(r => <option key={r.id} value={r.id}>{r.title}</option>)}
                          </select>
                        ) : (
                          <>
                            <p className="text-sm text-gray-700">{c.role.title}</p>
                            <p className="text-xs text-gray-400">{c.role.client}</p>
                          </>
                        )}
                      </div>

                      {/* Stage */}
                      <div className="px-4 py-3 min-w-[140px]">
                        {isEditing ? (
                          <select value={editForm.stage} onChange={e => setEditForm({...editForm, stage: e.target.value})}
                            className="text-xs border rounded px-1 py-0.5">
                            {STAGES.map(s => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
                          </select>
                        ) : (
                          <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${STAGE_COLORS[c.stage] || "bg-gray-100"}`}>
                            {c.stage.replace(/_/g, " ")}
                          </span>
                        )}
                      </div>

                      {/* Expected Salary */}
                      <div className="px-4 py-3 min-w-[100px]">
                        {isEditing ? (
                          <input type="number" value={editForm.expectedSalary}
                            onChange={e => setEditForm({...editForm, expectedSalary: e.target.value})}
                            className="w-20 text-sm border rounded px-1 py-0.5" placeholder="MYR" />
                        ) : (
                          <span className="text-sm text-gray-700">
                            {c.expectedSalary ? `${c.expectedSalary.toLocaleString()}` : "—"}
                          </span>
                        )}
                      </div>

                      {/* Offer */}
                      <div className="px-4 py-3 min-w-[120px]">
                        {offer ? (
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-medium">{offer.offeredSalary.toLocaleString()}</span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold border ${TIER_COLORS[offer.tier]}`}>{offer.tier}</span>
                          </div>
                        ) : <span className="text-sm text-gray-400">—</span>}
                      </div>

                      {/* Source */}
                      <div className="px-4 py-3 min-w-[80px]">
                        <span className="text-xs text-gray-500">{c.source}</span>
                      </div>

                      {/* Actions */}
                      <div className="px-4 py-3 min-w-[200px] flex items-center gap-1">
                        {isEditing ? (
                          <>
                            <button onClick={() => saveEdit(c.id)} className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700">Save</button>
                            <button onClick={() => setEditingId(null)} className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300">Cancel</button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => setExpandedId(isExpanded ? null : c.id)}
                              className="p-1.5 rounded hover:bg-gray-100 text-gray-500" title="Details">
                              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                            </button>
                            <button onClick={() => startEdit(c)} className="p-1.5 rounded hover:bg-gray-100 text-gray-500" title="Edit">
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <a href={`/portal/${c.portalToken}`} target="_blank"
                              className="p-1.5 rounded hover:bg-gray-100 text-gray-500" title="View Portal">
                              <Eye className="w-3.5 h-3.5" />
                            </a>
                            {c.stage === "SELECTED" && !offer && (
                              <button onClick={() => generateOffer(c.id)}
                                className="text-xs bg-[#4B4C6A] text-white px-2 py-1 rounded hover:bg-[#3a3b54]">
                                <DollarSign className="w-3 h-3 inline mr-0.5" />Offer
                              </button>
                            )}
                            {["SCREENING", "ASSESSMENT_PENDING", "ASSESSMENT_IN_PROGRESS", "INTERVIEW_PENDING", "INTERVIEW_SCHEDULED"].includes(c.stage) && (
                              <button onClick={() => advanceCandidate(c.id, "SELECTED")}
                                className="text-xs bg-[#4B4C6A]/10 text-[#4B4C6A] px-2 py-1 rounded hover:bg-[#4B4C6A]/20">
                                Advance
                              </button>
                            )}
                            <button onClick={() => deleteCandidate(c.id, `${c.firstName} ${c.lastName}`)}
                              className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-500" title="Delete">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="px-6 pb-4 bg-[#faf9f7] border-t border-gray-100">
                        <div className="grid grid-cols-3 gap-6 py-4">
                          <div>
                            <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Candidate Info</h4>
                            <dl className="space-y-1 text-sm">
                              <div className="flex justify-between"><dt className="text-gray-500">Phone</dt><dd>{c.phone || "—"}</dd></div>
                              <div className="flex justify-between"><dt className="text-gray-500">Source</dt><dd>{c.source}</dd></div>
                              <div className="flex justify-between"><dt className="text-gray-500">Portal Token</dt><dd className="font-mono text-xs">{c.portalToken}</dd></div>
                              <div className="flex justify-between"><dt className="text-gray-500">Applied</dt><dd>{new Date(c.createdAt).toLocaleDateString()}</dd></div>
                              <div className="flex justify-between"><dt className="text-gray-500">Last Updated</dt><dd>{new Date(c.updatedAt).toLocaleDateString()}</dd></div>
                            </dl>
                          </div>
                          <div>
                            <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Role & Salary Band</h4>
                            <dl className="space-y-1 text-sm">
                              <div className="flex justify-between"><dt className="text-gray-500">Role</dt><dd>{c.role.title}</dd></div>
                              <div className="flex justify-between"><dt className="text-gray-500">Client</dt><dd>{c.role.client}</dd></div>
                              <div className="flex justify-between"><dt className="text-gray-500">Band</dt><dd>{c.role.salaryMin.toLocaleString()} – {c.role.salaryMax.toLocaleString()} {c.role.currency}</dd></div>
                              <div className="flex justify-between"><dt className="text-gray-500">Midpoint</dt><dd>{c.role.salaryMid.toLocaleString()} {c.role.currency}</dd></div>
                              <div className="flex justify-between"><dt className="text-gray-500">Criticality</dt><dd>{c.role.criticality}</dd></div>
                            </dl>
                          </div>
                          <div>
                            <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Scores & Notes</h4>
                            <dl className="space-y-1 text-sm">
                              <div className="flex justify-between"><dt className="text-gray-500">Assessment</dt><dd>{c.assessmentScore ?? "—"}</dd></div>
                              <div className="flex justify-between"><dt className="text-gray-500">Interview</dt><dd>{c.interviewScore ?? "—"}</dd></div>
                            </dl>
                            {c.interviewNotes && (
                              <div className="mt-2">
                                <p className="text-xs text-gray-500">Notes:</p>
                                <p className="text-xs text-gray-700 bg-white rounded p-2 mt-1 border">{c.interviewNotes}</p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Offer history */}
                        {c.offers.length > 0 && (
                          <div className="mt-2">
                            <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Offer History</h4>
                            <div className="space-y-2">
                              {c.offers.map(o => (
                                <div key={o.id} className={`p-3 rounded-lg border ${TIER_COLORS[o.tier]} bg-opacity-50`}>
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                      <span className="font-bold text-sm">Round {o.round}</span>
                                      <span className={`text-xs px-2 py-0.5 rounded font-bold ${TIER_COLORS[o.tier]}`}>{o.tier}</span>
                                      <span className="text-sm font-medium">{o.offeredSalary.toLocaleString()} MYR</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs">
                                      <span className={`px-2 py-0.5 rounded ${o.status === "ACCEPTED" ? "bg-green-200 text-green-800" : o.status === "DECLINED" ? "bg-red-200 text-red-800" : "bg-gray-200 text-gray-700"}`}>
                                        {o.status}
                                      </span>
                                      <span className={`px-2 py-0.5 rounded ${o.approvalStatus === "AUTO_APPROVED" || o.approvalStatus === "APPROVED" ? "bg-green-200 text-green-800" : o.approvalStatus === "PENDING" ? "bg-amber-200 text-amber-800" : "bg-gray-200 text-gray-700"}`}>
                                        {o.approvalStatus}
                                      </span>
                                    </div>
                                  </div>
                                  {o.calculationNotes && (
                                    <p className="text-xs text-gray-600 mt-2 bg-white/60 rounded p-2">{o.calculationNotes}</p>
                                  )}
                                  <div className="flex gap-4 mt-2 text-xs text-gray-500">
                                    <span>Base: {o.baseSalary.toLocaleString()}</span>
                                    {o.criticalityAdj !== 0 && <span>Criticality: +{o.criticalityAdj.toLocaleString()}</span>}
                                    {o.fillRateAdj !== 0 && <span>Fill Rate: {o.fillRateAdj > 0 ? "+" : ""}{o.fillRateAdj.toLocaleString()}</span>}
                                    {o.marketAdj !== 0 && <span>Market: +{o.marketAdj.toLocaleString()}</span>}
                                  </div>
                                  {o.approvals.length > 0 && (
                                    <div className="mt-2 flex gap-2">
                                      {o.approvals.map(a => (
                                        <span key={a.id} className={`text-xs px-2 py-1 rounded border ${
                                          a.status === "APPROVED" ? "bg-green-50 border-green-200 text-green-700" :
                                          a.status === "DECLINED" ? "bg-red-50 border-red-200 text-red-700" :
                                          "bg-amber-50 border-amber-200 text-amber-700"
                                        }`}>
                                          {a.approverName} ({a.approverRole}): {a.status}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Offers Tab ──────────────────────────────────────────────────────
function OffersTab({ candidates, search, onRefresh }: {
  candidates: Candidate[]; search: string; onRefresh: () => void;
}) {
  const withOffers = candidates.filter(c => c.offers.length > 0).filter(c => {
    const q = search.toLowerCase();
    return !q || `${c.firstName} ${c.lastName} ${c.email} ${c.role.title}`.toLowerCase().includes(q);
  });

  const greenCount = withOffers.filter(c => c.offers[0]?.tier === "GREEN").length;
  const amberCount = withOffers.filter(c => c.offers[0]?.tier === "AMBER").length;
  const redCount = withOffers.filter(c => c.offers[0]?.tier === "RED").length;

  return (
    <div className="space-y-6">
      {/* Tier Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { tier: "GREEN", count: greenCount, desc: "Auto-approved (≤ midpoint)", color: "border-green-200 bg-green-50" },
          { tier: "AMBER", count: amberCount, desc: "Parallel approval (mid < x ≤ max)", color: "border-amber-200 bg-amber-50" },
          { tier: "RED", count: redCount, desc: "Sequential approval (> max)", color: "border-red-200 bg-red-50" },
        ].map(t => (
          <div key={t.tier} className={`p-4 rounded-xl border-2 ${t.color}`}>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">{t.count}</span>
              <span className={`text-xs px-2 py-1 rounded font-bold ${TIER_COLORS[t.tier]}`}>{t.tier}</span>
            </div>
            <p className="text-xs text-gray-600 mt-1">{t.desc}</p>
          </div>
        ))}
      </div>

      {/* Salary Logic Explainer */}
      <div className="bg-white rounded-xl border border-[#e6e6e5] p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-500" /> Salary Tier Logic
        </h3>
        <div className="grid grid-cols-3 gap-4 text-xs">
          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <p className="font-bold text-green-700 mb-1">GREEN — Auto Approve</p>
            <p className="text-green-600">Expected salary ≤ band midpoint. Offer = expected salary. No approval needed.</p>
          </div>
          <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
            <p className="font-bold text-amber-700 mb-1">AMBER — Parallel Approval</p>
            <p className="text-amber-600">Mid &lt; expected ≤ max. Offer = mid + 60% of gap. TA Lead + Director approve in parallel (24h SLA).</p>
          </div>
          <div className="p-3 bg-red-50 rounded-lg border border-red-200">
            <p className="font-bold text-red-700 mb-1">RED — Sequential Approval</p>
            <p className="text-red-600">Expected &gt; max. Offer capped at max. TA Lead + Director → then COO sequential (48h SLA).</p>
          </div>
        </div>
      </div>

      {/* Offers Table */}
      <div className="bg-white rounded-xl border border-[#e6e6e5] overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">All Offers ({withOffers.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#f5f4f2] text-left">
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Candidate</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Role</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Expected</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Offered</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Tier</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Base + Adj</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Approval</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {withOffers.map(c => {
                const o = c.offers[0];
                return (
                  <tr key={c.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-sm">{c.firstName} {c.lastName}</p>
                      <p className="text-xs text-gray-400">{c.email}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{c.role.title}</td>
                    <td className="px-4 py-3 text-sm">{c.expectedSalary?.toLocaleString() || "—"}</td>
                    <td className="px-4 py-3 text-sm font-semibold">{o.offeredSalary.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded font-bold border ${TIER_COLORS[o.tier]}`}>{o.tier}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {o.baseSalary.toLocaleString()}
                      {(o.criticalityAdj + o.fillRateAdj + o.marketAdj) !== 0 && (
                        <span className="text-green-600"> +{(o.criticalityAdj + o.fillRateAdj + o.marketAdj).toLocaleString()}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        o.approvalStatus === "AUTO_APPROVED" || o.approvalStatus === "APPROVED" ? "bg-green-100 text-green-700" :
                        o.approvalStatus === "PENDING" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
                      }`}>{o.approvalStatus.replace(/_/g, " ")}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        o.status === "ACCEPTED" ? "bg-green-100 text-green-700" :
                        o.status === "DECLINED" ? "bg-red-100 text-red-700" :
                        o.status === "SENT" ? "bg-blue-100 text-blue-700" :
                        "bg-gray-100 text-gray-700"
                      }`}>{o.status.replace(/_/g, " ")}</span>
                    </td>
                  </tr>
                );
              })}
              {withOffers.length === 0 && (
                <tr><td colSpan={8} className="px-6 py-12 text-center text-gray-400">No offers generated yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Roles Tab ───────────────────────────────────────────────────────
function RolesTab({ roles, candidates, search, onRefresh }: {
  roles: Role[]; candidates: Candidate[]; search: string; onRefresh: () => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "", client: "", campaign: "", department: "Operations",
    salaryMin: "", salaryMid: "", salaryMax: "", currency: "MYR",
    marketMedian: "", criticality: "STANDARD", interviewMode: "HUMAN_INTERVIEW",
    totalPositions: "10", filledPositions: "0",
  });

  const filtered = roles.filter(r => {
    const q = search.toLowerCase();
    return !q || `${r.title} ${r.client} ${r.department}`.toLowerCase().includes(q);
  });

  const resetForm = () => {
    setForm({
      title: "", client: "", campaign: "", department: "Operations",
      salaryMin: "", salaryMid: "", salaryMax: "", currency: "MYR",
      marketMedian: "", criticality: "STANDARD", interviewMode: "HUMAN_INTERVIEW",
      totalPositions: "10", filledPositions: "0",
    });
    setEditingId(null);
    setShowForm(false);
  };

  const startEdit = (r: Role) => {
    setEditingId(r.id);
    setForm({
      title: r.title, client: r.client, campaign: r.campaign || "",
      department: r.department, salaryMin: String(r.salaryMin), salaryMid: String(r.salaryMid),
      salaryMax: String(r.salaryMax), currency: r.currency,
      marketMedian: r.marketMedian ? String(r.marketMedian) : "",
      criticality: r.criticality, interviewMode: r.interviewMode,
      totalPositions: String(r.totalPositions), filledPositions: String(r.filledPositions),
    });
    setShowForm(true);
  };

  const saveRole = async () => {
    const payload = {
      ...form,
      salaryMin: parseFloat(form.salaryMin),
      salaryMid: parseFloat(form.salaryMid),
      salaryMax: parseFloat(form.salaryMax),
      marketMedian: form.marketMedian ? parseFloat(form.marketMedian) : null,
      totalPositions: parseInt(form.totalPositions),
      filledPositions: parseInt(form.filledPositions),
    };

    if (editingId) {
      await fetch(`/api/roles/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch("/api/roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }
    resetForm();
    onRefresh();
  };

  const deleteRole = async (id: string, title: string) => {
    if (!confirm(`Delete role "${title}"? Only works if no candidates are assigned.`)) return;
    const res = await fetch(`/api/roles/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json();
      alert(data.error);
      return;
    }
    onRefresh();
  };

  return (
    <div className="space-y-6">
      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-[#e6e6e5] p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">{editingId ? "Edit Role" : "Create New Role"}</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Title *</label>
              <input value={form.title} onChange={e => setForm({...form, title: e.target.value})}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#4B4C6A]"
                placeholder="Customer Service Agent - EN" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Client *</label>
              <input value={form.client} onChange={e => setForm({...form, client: e.target.value})}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#4B4C6A]"
                placeholder="TechCorp Global" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Campaign</label>
              <input value={form.campaign} onChange={e => setForm({...form, campaign: e.target.value})}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#4B4C6A]"
                placeholder="Q1 2026 Hiring" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Min Salary *</label>
              <input type="number" value={form.salaryMin} onChange={e => setForm({...form, salaryMin: e.target.value})}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#4B4C6A]" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Mid Salary *</label>
              <input type="number" value={form.salaryMid} onChange={e => setForm({...form, salaryMid: e.target.value})}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#4B4C6A]" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Max Salary *</label>
              <input type="number" value={form.salaryMax} onChange={e => setForm({...form, salaryMax: e.target.value})}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#4B4C6A]" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Criticality</label>
              <select value={form.criticality} onChange={e => setForm({...form, criticality: e.target.value})}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2">
                <option value="STANDARD">Standard</option>
                <option value="PRIORITY">Priority (+3% adj)</option>
                <option value="CRITICAL">Critical (+5% adj)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Interview Mode</label>
              <select value={form.interviewMode} onChange={e => setForm({...form, interviewMode: e.target.value})}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2">
                <option value="NO_INTERVIEW">No Interview</option>
                <option value="AI_INTERVIEW">AI Interview</option>
                <option value="HUMAN_INTERVIEW">Human Interview</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Total Positions</label>
              <input type="number" value={form.totalPositions} onChange={e => setForm({...form, totalPositions: e.target.value})}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#4B4C6A]" />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={saveRole} className="bg-[#4B4C6A] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#3a3b54]">
              {editingId ? "Update Role" : "Create Role"}
            </button>
            <button onClick={resetForm} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-200">Cancel</button>
          </div>
        </div>
      )}

      {/* Roles List */}
      <div className="bg-white rounded-xl border border-[#e6e6e5] overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">All Roles ({filtered.length})</h2>
          {!showForm && (
            <button onClick={() => { resetForm(); setShowForm(true); }}
              className="flex items-center gap-1.5 text-sm bg-[#4B4C6A] text-white px-3 py-1.5 rounded-lg hover:bg-[#3a3b54]">
              <Plus className="w-3.5 h-3.5" /> Add Role
            </button>
          )}
        </div>

        <div className="divide-y divide-gray-50">
          {filtered.map(r => {
            const roleCandidates = candidates.filter(c => c.roleId === r.id);
            const fillRate = r.totalPositions > 0 ? (r.filledPositions / r.totalPositions * 100).toFixed(0) : "0";
            return (
              <div key={r.id} className="px-6 py-4 hover:bg-gray-50/50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium text-gray-900">{r.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                        r.criticality === "CRITICAL" ? "bg-red-100 text-red-700" :
                        r.criticality === "PRIORITY" ? "bg-amber-100 text-amber-700" :
                        "bg-gray-100 text-gray-600"
                      }`}>{r.criticality}</span>
                      <span className="text-xs text-gray-400">{r.interviewMode.replace(/_/g, " ")}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5">{r.client} · {r.department} {r.campaign ? `· ${r.campaign}` : ""}</p>
                  </div>

                  <div className="flex items-center gap-6">
                    {/* Salary Band */}
                    <div className="text-right">
                      <p className="text-sm font-medium">{r.salaryMin.toLocaleString()} — {r.salaryMax.toLocaleString()} {r.currency}</p>
                      <p className="text-xs text-gray-400">Mid: {r.salaryMid.toLocaleString()}</p>
                    </div>

                    {/* Fill Rate */}
                    <div className="text-right min-w-[80px]">
                      <p className="text-sm font-medium">{r.filledPositions}/{r.totalPositions}</p>
                      <div className="w-16 h-1.5 bg-gray-200 rounded-full mt-1">
                        <div className="h-full bg-[#4B4C6A] rounded-full" style={{ width: `${fillRate}%` }} />
                      </div>
                    </div>

                    {/* Candidates count */}
                    <div className="text-center min-w-[60px]">
                      <p className="text-lg font-bold text-[#4B4C6A]">{roleCandidates.length}</p>
                      <p className="text-xs text-gray-400">candidates</p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-1">
                      <button onClick={() => startEdit(r)} className="p-1.5 rounded hover:bg-gray-100 text-gray-500">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => deleteRole(r.id, r.title)} className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="px-6 py-12 text-center text-gray-400">No roles found.</div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Approvals Tab ───────────────────────────────────────────────────
function ApprovalsTab({ candidates, search, onRefresh }: {
  candidates: Candidate[]; search: string; onRefresh: () => void;
}) {
  const allApprovals: { approval: Approval; candidate: Candidate; offer: Offer }[] = [];

  candidates.forEach(c => {
    c.offers.forEach(o => {
      o.approvals.forEach(a => {
        allApprovals.push({ approval: a, candidate: c, offer: o });
      });
    });
  });

  const filtered = allApprovals.filter(item => {
    const q = search.toLowerCase();
    return !q || `${item.candidate.firstName} ${item.candidate.lastName} ${item.approval.approverName}`.toLowerCase().includes(q);
  });

  const pending = filtered.filter(i => i.approval.status === "PENDING");
  const decided = filtered.filter(i => i.approval.status !== "PENDING");

  const handleDecision = async (approvalId: string, offerId: string, decision: "APPROVED" | "DECLINED", approverEmail: string) => {
    await fetch("/api/approvals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ approvalId, offerId, decision, approverEmail }),
    });
    onRefresh();
  };

  return (
    <div className="space-y-6">
      {/* Pending Approvals */}
      <div className="bg-white rounded-xl border border-[#e6e6e5] overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          <h2 className="text-lg font-semibold text-gray-900">Pending Approvals ({pending.length})</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {pending.map(({ approval: a, candidate: c, offer: o }) => {
            const isOverdue = new Date(a.slaDeadline) < new Date();
            return (
              <div key={a.id} className={`px-6 py-4 ${isOverdue ? "bg-red-50/50" : ""}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{c.firstName} {c.lastName}</p>
                      <span className={`text-xs px-2 py-0.5 rounded font-bold border ${TIER_COLORS[o.tier]}`}>{o.tier}</span>
                      <span className="text-sm text-gray-500">Round {o.round}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {c.role.title} · Offered: {o.offeredSalary.toLocaleString()} MYR
                      {c.expectedSalary && ` · Expected: ${c.expectedSalary.toLocaleString()} MYR`}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Approver: <span className="font-medium">{a.approverName}</span> ({a.approverRole})
                      · SLA: {new Date(a.slaDeadline).toLocaleString()}
                      {isOverdue && <span className="text-red-600 font-bold ml-2">⚠ OVERDUE</span>}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleDecision(a.id, o.id, "APPROVED", a.approverEmail)}
                      className="flex items-center gap-1 text-sm bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                    </button>
                    <button onClick={() => handleDecision(a.id, o.id, "DECLINED", a.approverEmail)}
                      className="flex items-center gap-1 text-sm bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700">
                      <XCircle className="w-3.5 h-3.5" /> Decline
                    </button>
                  </div>
                </div>
                {o.aiSummary && (
                  <div className="mt-3 p-3 bg-[#f5f4f2] rounded-lg text-xs text-gray-600">
                    <p className="font-semibold text-gray-700 mb-1">AI Summary:</p>
                    {o.aiSummary}
                  </div>
                )}
              </div>
            );
          })}
          {pending.length === 0 && (
            <div className="px-6 py-12 text-center text-gray-400">
              <CheckCircle2 className="w-8 h-8 mx-auto text-green-300 mb-2" />
              No pending approvals. All clear!
            </div>
          )}
        </div>
      </div>

      {/* Decided History */}
      {decided.length > 0 && (
        <div className="bg-white rounded-xl border border-[#e6e6e5] overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Decision History ({decided.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#f5f4f2] text-left">
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Candidate</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Approver</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Decision</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Tier</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {decided.map(({ approval: a, candidate: c, offer: o }) => (
                  <tr key={a.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3 text-sm">{c.firstName} {c.lastName}</td>
                    <td className="px-4 py-3 text-sm">{a.approverName} <span className="text-xs text-gray-400">({a.approverRole})</span></td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                        a.status === "APPROVED" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}>{a.status}</span>
                    </td>
                    <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded font-bold border ${TIER_COLORS[o.tier]}`}>{o.tier}</span></td>
                    <td className="px-4 py-3 text-sm">{o.offeredSalary.toLocaleString()} MYR</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{a.decidedAt ? new Date(a.decidedAt).toLocaleString() : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
