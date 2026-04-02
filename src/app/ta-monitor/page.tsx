"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Eye, Users, Clock, AlertTriangle, CheckCircle2, XCircle,
  ChevronDown, Phone, Mail, MessageCircle, Calendar, ArrowRight,
  Filter, Search, Bell, BarChart3, TrendingUp, Zap, Star,
  UserCheck, Timer, RefreshCw, Loader2, AlertCircle
} from "lucide-react";
import Navbar from "@/components/ui/Navbar";
import InfoTooltip from "@/components/ui/InfoTooltip";

type CandidateStage = "APPLIED" | "SCREENING" | "INTERVIEW" | "OFFER" | "HIRED" | "REJECTED";

interface TACandidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  client: string;
  stage: CandidateStage;
  source: string;
  appliedAt: string;
  lastActivity: string;
  lastActivityType: string;
  cvScore: number;
  daysInStage: number;
  followUpDue: boolean;
  followUpDate?: string;
  notes: string[];
  interviewDate?: string;
  assignedTA: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  flags: string[];
}

const STAGES: { key: CandidateStage; label: string; color: string; bgColor: string }[] = [
  { key: "APPLIED", label: "Applied", color: "text-blue-600", bgColor: "bg-blue-100" },
  { key: "SCREENING", label: "Screening", color: "text-purple-600", bgColor: "bg-purple-100" },
  { key: "INTERVIEW", label: "Interview", color: "text-orange-600", bgColor: "bg-orange-100" },
  { key: "OFFER", label: "Offer", color: "text-green-600", bgColor: "bg-green-100" },
  { key: "HIRED", label: "Hired", color: "text-emerald-600", bgColor: "bg-emerald-100" },
  { key: "REJECTED", label: "Rejected", color: "text-red-600", bgColor: "bg-red-100" },
];

const DEMO_CANDIDATES: TACandidate[] = [
  {
    id: "c1", name: "Sarah Lim Wei Ling", email: "sarah.lim@email.com", phone: "+60 12-345 6789",
    role: "CSR (Mandarin)", client: "Tech Giant", stage: "INTERVIEW", source: "JobStreet",
    appliedAt: "2026-03-18", lastActivity: "2026-03-22", lastActivityType: "Interview scheduled",
    cvScore: 82, daysInStage: 2, followUpDue: false, followUpDate: "2026-03-25",
    notes: ["Strong Mandarin skills", "2yr BPO experience at TDCX", "Interview on Mar 25"],
    interviewDate: "2026-03-25", assignedTA: "Aisha", priority: "HIGH",
    flags: ["BPO Experience", "High CV Score"],
  },
  {
    id: "c2", name: "Ahmad Razak bin Mohd", email: "ahmad.razak@email.com", phone: "+60 17-789 0123",
    role: "Sales Agent (BM)", client: "Telco Provider", stage: "SCREENING", source: "Walk-in",
    appliedAt: "2026-03-20", lastActivity: "2026-03-20", lastActivityType: "Walk-in registered",
    cvScore: 55, daysInStage: 4, followUpDue: true, followUpDate: "2026-03-23",
    notes: ["Walk-in candidate", "Sales background", "Needs language test"],
    assignedTA: "Aisha", priority: "MEDIUM", flags: ["Follow-up Overdue"],
  },
  {
    id: "c3", name: "Tanaka Yuki", email: "tanaka.y@email.com", phone: "+60 11-456 7890",
    role: "Tech Support (Japanese)", client: "Gaming Co", stage: "OFFER", source: "LinkedIn",
    appliedAt: "2026-03-10", lastActivity: "2026-03-22", lastActivityType: "Offer sent",
    cvScore: 91, daysInStage: 2, followUpDue: true, followUpDate: "2026-03-24",
    notes: ["JLPT N1", "Gaming enthusiast", "Offer: RM 7,200", "Awaiting response"],
    assignedTA: "David", priority: "HIGH", flags: ["Offer Pending", "Premium Candidate"],
  },
  {
    id: "c4", name: "Priya Devi", email: "priya.d@email.com", phone: "+60 16-234 5678",
    role: "CSR (English)", client: "E-commerce", stage: "APPLIED", source: "Indeed",
    appliedAt: "2026-03-23", lastActivity: "2026-03-23", lastActivityType: "Application received",
    cvScore: 45, daysInStage: 1, followUpDue: false, followUpDate: "2026-03-26",
    notes: ["Fresh graduate", "Good English", "No BPO experience"],
    assignedTA: "Aisha", priority: "LOW", flags: ["Fresh Grad"],
  },
  {
    id: "c5", name: "Lee Jun Wei", email: "junwei.lee@email.com", phone: "+60 18-567 8901",
    role: "CSR (Mandarin)", client: "Tech Giant", stage: "SCREENING", source: "Referral",
    appliedAt: "2026-03-19", lastActivity: "2026-03-21", lastActivityType: "CV reviewed",
    cvScore: 72, daysInStage: 3, followUpDue: true, followUpDate: "2026-03-22",
    notes: ["Referred by current employee", "1yr Concentrix experience", "Pending phone screen"],
    assignedTA: "David", priority: "HIGH", flags: ["Referral", "Follow-up Overdue"],
  },
  {
    id: "c6", name: "Maria Santos", email: "maria.s@email.com", phone: "+60 13-678 9012",
    role: "Sales Agent (BM)", client: "Telco Provider", stage: "INTERVIEW", source: "Facebook",
    appliedAt: "2026-03-15", lastActivity: "2026-03-22", lastActivityType: "Interview completed",
    cvScore: 65, daysInStage: 1, followUpDue: false, followUpDate: "2026-03-26",
    notes: ["Interview done", "Good communication", "Waiting for interviewer feedback"],
    interviewDate: "2026-03-22", assignedTA: "Aisha", priority: "MEDIUM", flags: ["Awaiting Feedback"],
  },
  {
    id: "c7", name: "Park Min-jun", email: "minjun.park@email.com", phone: "+60 19-890 1234",
    role: "CSR (Korean)", client: "Cosmetics Brand", stage: "SCREENING", source: "LinkedIn",
    appliedAt: "2026-03-21", lastActivity: "2026-03-21", lastActivityType: "Application received",
    cvScore: 78, daysInStage: 3, followUpDue: true, followUpDate: "2026-03-24",
    notes: ["Korean native", "TOPIK Level 6", "2yr call center in Seoul"],
    assignedTA: "David", priority: "HIGH", flags: ["Bilingual", "BPO Experience"],
  },
  {
    id: "c8", name: "Nurul Izzah", email: "nurul.i@email.com", phone: "+60 14-901 2345",
    role: "CSR (English)", client: "E-commerce", stage: "REJECTED", source: "Maukerja",
    appliedAt: "2026-03-12", lastActivity: "2026-03-19", lastActivityType: "Rejected - language test",
    cvScore: 28, daysInStage: 5, followUpDue: false,
    notes: ["Failed English language test", "Sent rejection email"],
    assignedTA: "Aisha", priority: "LOW", flags: [],
  },
];

export default function TAMonitorPage() {
  const [candidates, setCandidates] = useState<TACandidate[]>(DEMO_CANDIDATES);
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState<string>("ALL");
  const [priorityFilter, setPriorityFilter] = useState<string>("ALL");
  const [taFilter, setTaFilter] = useState<string>("ALL");
  const [showOverdueOnly, setShowOverdueOnly] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"pipeline" | "list">("pipeline");

  const filtered = candidates.filter(c => {
    if (stageFilter !== "ALL" && c.stage !== stageFilter) return false;
    if (priorityFilter !== "ALL" && c.priority !== priorityFilter) return false;
    if (taFilter !== "ALL" && c.assignedTA !== taFilter) return false;
    if (showOverdueOnly && !c.followUpDue) return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.role.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const activeStages: CandidateStage[] = ["APPLIED", "SCREENING", "INTERVIEW", "OFFER"];
  const overdueCount = candidates.filter(c => c.followUpDue && activeStages.includes(c.stage)).length;
  const avgDaysInPipeline = Math.round(candidates.filter(c => activeStages.includes(c.stage)).reduce((s, c) => s + c.daysInStage, 0) / Math.max(candidates.filter(c => activeStages.includes(c.stage)).length, 1));
  const highPriority = candidates.filter(c => c.priority === "HIGH" && activeStages.includes(c.stage)).length;
  const offerPending = candidates.filter(c => c.stage === "OFFER").length;

  const uniqueTAs = [...new Set(candidates.map(c => c.assignedTA))];

  const advanceStage = (id: string) => {
    const order: CandidateStage[] = ["APPLIED", "SCREENING", "INTERVIEW", "OFFER", "HIRED"];
    setCandidates(cs => cs.map(c => {
      if (c.id !== id) return c;
      const idx = order.indexOf(c.stage);
      if (idx < order.length - 1) {
        return { ...c, stage: order[idx + 1], daysInStage: 0, lastActivity: new Date().toISOString().slice(0, 10), lastActivityType: `Advanced to ${order[idx + 1]}` };
      }
      return c;
    }));
  };

  const addNote = (id: string, note: string) => {
    setCandidates(cs => cs.map(c => c.id === id ? { ...c, notes: [...c.notes, `[${new Date().toISOString().slice(0, 10)}] ${note}`] } : c));
  };

  const priorityBadge = (p: string) => {
    const map: Record<string, string> = { HIGH: "bg-red-100 text-red-700", MEDIUM: "bg-yellow-100 text-yellow-700", LOW: "bg-gray-100 text-gray-500" };
    return <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${map[p]}`}>{p}</span>;
  };

  return (
    <div className="min-h-screen bg-[#f8f7f5] lg:pl-[240px]">
      <Navbar />
      {/* Header */}
      <div className="bg-[#4B4C6A] text-white px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Eye className="w-5 h-5" />
              <h1 className="text-lg font-bold">TA Monitoring Dashboard</h1>
            </div>
            <p className="text-xs text-white/60">Follow up and monitor all candidates in the pipeline</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-xs text-white/70 hover:text-white">Admin</Link>
            <Link href="/sourcing" className="text-xs text-white/70 hover:text-white">Sourcing</Link>
            <Link href="/interview" className="text-xs text-white/70 hover:text-white">Interviews</Link>
            <Link href="/dashboard" className="text-xs text-white/70 hover:text-white">Dashboard</Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Alert Bar */}
        {overdueCount > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-red-600" />
              <span className="text-sm font-medium text-red-800">{overdueCount} candidate{overdueCount > 1 ? "s" : ""} need follow-up today!</span>
            </div>
            <button onClick={() => setShowOverdueOnly(true)} className="text-xs text-red-600 font-medium hover:underline">
              Show overdue only →
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: "In Pipeline", value: candidates.filter(c => activeStages.includes(c.stage)).length, icon: Users, color: "text-blue-600" },
            { label: "Follow-ups Due", value: overdueCount, icon: AlertTriangle, color: "text-red-600" },
            { label: "High Priority", value: highPriority, icon: Star, color: "text-orange-600" },
            { label: "Offers Pending", value: offerPending, icon: CheckCircle2, color: "text-green-600" },
            { label: "Avg Days/Stage", value: avgDaysInPipeline, icon: Timer, color: "text-purple-600" },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-xl border border-[#e6e6e5] p-4">
              <div className="flex items-center gap-2 mb-1">
                <s.icon className={`w-4 h-4 ${s.color}`} />
                <span className="text-xs text-gray-500">{s.label}</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Pipeline View */}
        <div className="bg-white rounded-xl border border-[#e6e6e5] p-5">
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-sm font-semibold text-gray-800">Pipeline Overview</h2>
            <InfoTooltip text="Visual representation of candidates at each stage of the recruitment process" />
          </div>
          <div className="grid grid-cols-6 gap-2">
            {STAGES.map(stage => {
              const count = candidates.filter(c => c.stage === stage.key).length;
              return (
                <button key={stage.key} onClick={() => setStageFilter(stageFilter === stage.key ? "ALL" : stage.key)}
                  className={`p-3 rounded-lg border text-center transition ${stageFilter === stage.key
                    ? `${stage.bgColor} border-current`
                    : "border-gray-200 hover:border-gray-300"}`}>
                  <p className={`text-2xl font-bold ${stage.color}`}>{count}</p>
                  <p className="text-[10px] font-medium text-gray-600">{stage.label}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg" placeholder="Search candidates..." />
          </div>
          <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}
            className="text-xs border border-gray-200 rounded-lg px-3 py-2">
            <option value="ALL">All Priorities</option>
            <option value="HIGH">High Priority</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
          <select value={taFilter} onChange={e => setTaFilter(e.target.value)}
            className="text-xs border border-gray-200 rounded-lg px-3 py-2">
            <option value="ALL">All TAs</option>
            {uniqueTAs.map(ta => <option key={ta} value={ta}>{ta}</option>)}
          </select>
          <button onClick={() => { setShowOverdueOnly(!showOverdueOnly); }}
            className={`text-xs px-3 py-2 rounded-lg border transition ${showOverdueOnly
              ? "bg-red-50 text-red-700 border-red-200"
              : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
            <AlertTriangle className="w-3 h-3 inline mr-1" />{showOverdueOnly ? "Showing Overdue" : "Overdue Only"}
          </button>
          {(stageFilter !== "ALL" || priorityFilter !== "ALL" || taFilter !== "ALL" || showOverdueOnly) && (
            <button onClick={() => { setStageFilter("ALL"); setPriorityFilter("ALL"); setTaFilter("ALL"); setShowOverdueOnly(false); }}
              className="text-xs text-gray-500 hover:text-gray-700">Clear filters</button>
          )}
          <span className="text-xs text-gray-400 ml-auto">{filtered.length} candidates</span>
        </div>

        {/* Candidate List */}
        <div className="space-y-2">
          {filtered.map(c => {
            const stageInfo = STAGES.find(s => s.key === c.stage)!;
            const isExpanded = expandedId === c.id;
            return (
              <div key={c.id} className={`bg-white rounded-xl border overflow-hidden transition ${c.followUpDue && activeStages.includes(c.stage) ? "border-red-200" : "border-[#e6e6e5]"}`}>
                <div className="p-4 cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : c.id)}>
                  <div className="flex items-center gap-4">
                    {/* Priority indicator */}
                    <div className={`w-1 h-12 rounded-full ${c.priority === "HIGH" ? "bg-red-400" : c.priority === "MEDIUM" ? "bg-yellow-400" : "bg-gray-300"}`} />

                    {/* Candidate Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="text-sm font-bold text-gray-900 truncate">{c.name}</h3>
                        {priorityBadge(c.priority)}
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${stageInfo.bgColor} ${stageInfo.color}`}>{stageInfo.label}</span>
                        {c.followUpDue && activeStages.includes(c.stage) && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-red-100 text-red-700 flex items-center gap-0.5">
                            <AlertTriangle className="w-2.5 h-2.5" /> Follow-up Due
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span>{c.role}</span>
                        <span>·</span>
                        <span>{c.client}</span>
                        <span>·</span>
                        <span>Source: {c.source}</span>
                        <span>·</span>
                        <span>TA: {c.assignedTA}</span>
                      </div>
                    </div>

                    {/* Metrics */}
                    <div className="flex items-center gap-4 text-xs text-right">
                      <div>
                        <p className="text-gray-400">CV Score</p>
                        <p className={`font-bold ${c.cvScore >= 70 ? "text-green-600" : c.cvScore >= 40 ? "text-yellow-600" : "text-red-600"}`}>{c.cvScore}%</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Days in Stage</p>
                        <p className={`font-bold ${c.daysInStage > 3 ? "text-red-600" : "text-gray-800"}`}>{c.daysInStage}d</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Last Activity</p>
                        <p className="font-medium text-gray-700">{c.lastActivity}</p>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition ${isExpanded ? "rotate-180" : ""}`} />
                    </div>
                  </div>

                  {/* Flags */}
                  {c.flags.length > 0 && (
                    <div className="flex items-center gap-1.5 mt-2 ml-5">
                      {c.flags.map(f => (
                        <span key={f} className="px-1.5 py-0.5 bg-[#4B4C6A]/10 text-[#4B4C6A] rounded text-[10px]">{f}</span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Expanded View */}
                {isExpanded && (
                  <div className="border-t border-gray-100 p-4 bg-gray-50/50 space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      {/* Contact Info */}
                      <div>
                        <h4 className="text-xs font-semibold text-gray-700 mb-2">Contact Info</h4>
                        <div className="space-y-1.5 text-xs text-gray-600">
                          <p className="flex items-center gap-1.5"><Mail className="w-3 h-3 text-gray-400" />{c.email}</p>
                          <p className="flex items-center gap-1.5"><Phone className="w-3 h-3 text-gray-400" />{c.phone}</p>
                          {c.interviewDate && <p className="flex items-center gap-1.5"><Calendar className="w-3 h-3 text-orange-400" />Interview: {c.interviewDate}</p>}
                          {c.followUpDate && <p className="flex items-center gap-1.5"><Bell className="w-3 h-3 text-red-400" />Follow-up by: {c.followUpDate}</p>}
                        </div>
                      </div>

                      {/* Activity Timeline */}
                      <div>
                        <h4 className="text-xs font-semibold text-gray-700 mb-2">Activity Notes</h4>
                        <div className="space-y-1.5">
                          {c.notes.map((n, i) => (
                            <p key={i} className="text-[11px] text-gray-600 flex items-start gap-1.5">
                              <span className="w-1 h-1 rounded-full bg-[#4B4C6A] mt-1.5 flex-shrink-0" />
                              {n}
                            </p>
                          ))}
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div>
                        <h4 className="text-xs font-semibold text-gray-700 mb-2">Quick Actions</h4>
                        <div className="space-y-2">
                          {c.stage !== "HIRED" && c.stage !== "REJECTED" && (
                            <button onClick={() => advanceStage(c.id)}
                              className="w-full flex items-center justify-center gap-1.5 text-xs bg-[#4B4C6A] text-white px-3 py-2 rounded-lg hover:bg-[#3a3b54] transition">
                              <ArrowRight className="w-3 h-3" /> Advance to Next Stage
                            </button>
                          )}
                          <button onClick={() => {
                            const note = prompt("Add a note:");
                            if (note) addNote(c.id, note);
                          }}
                            className="w-full flex items-center justify-center gap-1.5 text-xs border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 transition">
                            <MessageCircle className="w-3 h-3" /> Add Note
                          </button>
                          <div className="grid grid-cols-3 gap-1.5">
                            <button onClick={() => { window.open(`mailto:${c.email}?subject=TP Malaysia — Application Update&body=Dear ${c.name.split(' ')[0]},%0A%0ARegarding your application at Teleperformance Malaysia.%0A%0ABest regards,%0ATP Recruitment Team`); }} className="flex items-center justify-center gap-1 text-[10px] border border-gray-200 px-2 py-1.5 rounded-lg hover:bg-gray-50">
                              <Mail className="w-3 h-3" /> Email
                            </button>
                            <button onClick={() => { window.open(`https://wa.me/${c.phone.replace(/[^0-9+]/g, '')}?text=Hi ${c.name.split(' ')[0]}, this is TP Malaysia Recruitment. We'd like to update you on your application.`); }} className="flex items-center justify-center gap-1 text-[10px] border border-gray-200 px-2 py-1.5 rounded-lg hover:bg-gray-50">
                              <MessageCircle className="w-3 h-3" /> WhatsApp
                            </button>
                            <button onClick={() => { window.open(`tel:${c.phone}`); }} className="flex items-center justify-center gap-1 text-[10px] border border-gray-200 px-2 py-1.5 rounded-lg hover:bg-gray-50">
                              <Phone className="w-3 h-3" /> Call
                            </button>
                          </div>
                          {c.stage !== "REJECTED" && c.stage !== "HIRED" && (
                            <button onClick={() => setCandidates(cs => cs.map(x => x.id === c.id ? { ...x, stage: "REJECTED" as CandidateStage, lastActivity: new Date().toISOString().slice(0, 10), lastActivityType: "Rejected" } : x))}
                              className="w-full flex items-center justify-center gap-1.5 text-xs text-red-600 border border-red-200 px-3 py-2 rounded-lg hover:bg-red-50 transition">
                              <XCircle className="w-3 h-3" /> Reject
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* TA Performance Summary */}
        <div className="bg-white rounded-xl border border-[#e6e6e5] p-5">
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-sm font-semibold text-gray-800">TA Performance Overview</h2>
            <InfoTooltip text="Individual TA metrics including active candidates, overdue follow-ups, and successful hires" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {uniqueTAs.map(ta => {
              const taCandidates = candidates.filter(c => c.assignedTA === ta);
              const taActive = taCandidates.filter(c => activeStages.includes(c.stage));
              const taOverdue = taActive.filter(c => c.followUpDue);
              const taHired = taCandidates.filter(c => c.stage === "HIRED").length;
              const taRejected = taCandidates.filter(c => c.stage === "REJECTED").length;
              return (
                <div key={ta} className="border border-gray-100 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-[#4B4C6A]" /> {ta}
                    </h3>
                    <span className="text-xs text-gray-400">{taCandidates.length} total</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div>
                      <p className="text-lg font-bold text-blue-600">{taActive.length}</p>
                      <p className="text-[10px] text-gray-500">Active</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-red-600">{taOverdue.length}</p>
                      <p className="text-[10px] text-gray-500">Overdue</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-green-600">{taHired}</p>
                      <p className="text-[10px] text-gray-500">Hired</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-gray-400">{taRejected}</p>
                      <p className="text-[10px] text-gray-500">Rejected</p>
                    </div>
                  </div>
                  {taOverdue.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-gray-100">
                      <p className="text-[10px] text-red-600 font-medium">Overdue follow-ups:</p>
                      {taOverdue.map(c => (
                        <p key={c.id} className="text-[10px] text-gray-500">• {c.name} ({c.stage})</p>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
