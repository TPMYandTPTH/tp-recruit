"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Globe, Users, Megaphone, UserPlus, Building, Bot, Search as SearchIcon,
  Briefcase, CalendarCheck, Plus, Pencil, Trash2, ToggleLeft, ToggleRight,
  RefreshCw, ExternalLink, X, ChevronDown, ChevronUp, Zap, DollarSign,
  TrendingUp, BarChart3, ArrowRight, Clock, CheckCircle2, AlertTriangle,
} from "lucide-react";
import Navbar from "@/components/ui/Navbar";
import InfoTooltip from "@/components/ui/InfoTooltip";

// ─── Types ───────────────────────────────────────────────────────────
type SourcingChannel = {
  id: string; name: string; type: string; platform?: string;
  isActive: boolean; autoImport: boolean; importUrl?: string;
  apiKey?: string; config?: string; costPerHire?: number;
  monthlyBudget?: number; totalCandidates: number; totalHired: number;
  lastImportAt?: string; lastImportCount: number;
  notes?: string; contactPerson?: string; contactEmail?: string;
  createdAt: string; updatedAt: string;
};

type Analytics = {
  candidatesBySource: Record<string, number>;
  hiredBySource: Record<string, number>;
  recentBySource: Record<string, number>;
};

// ─── Constants ───────────────────────────────────────────────────────
const CHANNEL_TYPES = [
  { value: "JOB_BOARD", label: "Job Board", icon: Globe, color: "bg-blue-100 text-blue-700", desc: "JobStreet, Indeed, Glassdoor, etc." },
  { value: "SOCIAL_MEDIA", label: "Social Media", icon: Megaphone, color: "bg-purple-100 text-purple-700", desc: "LinkedIn, Facebook, TikTok, Instagram" },
  { value: "REFERRAL", label: "Employee Referral", icon: UserPlus, color: "bg-green-100 text-green-700", desc: "Internal referral programs" },
  { value: "CAREER_SITE", label: "Career Site", icon: Building, color: "bg-[#eeedf2] text-[#4B4C6A]", desc: "TP career website, landing pages" },
  { value: "WALK_IN", label: "Walk-in", icon: Users, color: "bg-amber-100 text-amber-700", desc: "On-site walk-in applicants" },
  { value: "ATS_IMPORT", label: "ATS Import", icon: RefreshCw, color: "bg-cyan-100 text-cyan-700", desc: "iCIMS, Workday, other ATS sync" },
  { value: "WEB_SCRAPER", label: "Web Scraper", icon: Bot, color: "bg-rose-100 text-rose-700", desc: "Apify, custom scrapers" },
  { value: "AGENCY", label: "Recruitment Agency", icon: Briefcase, color: "bg-orange-100 text-orange-700", desc: "External recruitment partners" },
  { value: "EVENT", label: "Career Event", icon: CalendarCheck, color: "bg-teal-100 text-teal-700", desc: "Job fairs, university events" },
];

const PLATFORMS: Record<string, string[]> = {
  JOB_BOARD: ["jobstreet", "indeed", "glassdoor", "monster", "jobsdb", "mudah", "maukerja", "ricebowl", "wobb"],
  SOCIAL_MEDIA: ["linkedin", "facebook", "tiktok", "instagram", "twitter", "whatsapp"],
  ATS_IMPORT: ["icims", "workday", "greenhouse", "lever", "taleo", "successfactors"],
  WEB_SCRAPER: ["apify", "brightdata", "custom"],
  CAREER_SITE: ["tp-careers", "landing-page"],
  REFERRAL: ["internal-portal", "referral-bonus"],
  WALK_IN: ["kl-office", "penang-office", "johor-office"],
  AGENCY: [],
  EVENT: [],
};

function getTypeConfig(type: string) {
  return CHANNEL_TYPES.find(t => t.value === type) || CHANNEL_TYPES[0];
}

// ─── Main Sourcing Page ──────────────────────────────────────────────
export default function SourcingPage() {
  const [channels, setChannels] = useState<SourcingChannel[]>([]);
  const [analytics, setAnalytics] = useState<Analytics>({ candidatesBySource: {}, hiredBySource: {}, recentBySource: {} });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  const [form, setForm] = useState({
    name: "", type: "JOB_BOARD", platform: "", isActive: true,
    autoImport: false, importUrl: "", apiKey: "", costPerHire: "",
    monthlyBudget: "", notes: "", contactPerson: "", contactEmail: "",
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/sourcing");
    const data = await res.json();
    setChannels(data.channels || []);
    setAnalytics(data.analytics || { candidatesBySource: {}, hiredBySource: {}, recentBySource: {} });
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const resetForm = () => {
    setForm({
      name: "", type: "JOB_BOARD", platform: "", isActive: true,
      autoImport: false, importUrl: "", apiKey: "", costPerHire: "",
      monthlyBudget: "", notes: "", contactPerson: "", contactEmail: "",
    });
    setEditingId(null);
    setShowForm(false);
  };

  const startEdit = (ch: SourcingChannel) => {
    setEditingId(ch.id);
    setForm({
      name: ch.name, type: ch.type, platform: ch.platform || "",
      isActive: ch.isActive, autoImport: ch.autoImport,
      importUrl: ch.importUrl || "", apiKey: ch.apiKey || "",
      costPerHire: ch.costPerHire?.toString() || "",
      monthlyBudget: ch.monthlyBudget?.toString() || "",
      notes: ch.notes || "", contactPerson: ch.contactPerson || "",
      contactEmail: ch.contactEmail || "",
    });
    setShowForm(true);
  };

  const saveChannel = async () => {
    const payload = {
      ...form,
      costPerHire: form.costPerHire ? parseFloat(form.costPerHire) : null,
      monthlyBudget: form.monthlyBudget ? parseFloat(form.monthlyBudget) : null,
    };

    if (editingId) {
      await fetch(`/api/sourcing/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch("/api/sourcing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }
    resetForm();
    fetchData();
  };

  const toggleActive = async (id: string, currentState: boolean) => {
    await fetch(`/api/sourcing/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !currentState }),
    });
    fetchData();
  };

  const deleteChannel = async (id: string, name: string) => {
    if (!confirm(`Delete sourcing channel "${name}"?`)) return;
    await fetch(`/api/sourcing/${id}`, { method: "DELETE" });
    fetchData();
  };

  const filtered = channels.filter(ch => {
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || `${ch.name} ${ch.platform} ${ch.type} ${ch.contactPerson}`.toLowerCase().includes(q);
    const matchType = !filterType || ch.type === filterType;
    return matchSearch && matchType;
  });

  const activeChannels = channels.filter(ch => ch.isActive).length;
  const totalCandidatesFromChannels = channels.reduce((sum, ch) => sum + ch.totalCandidates, 0);
  const totalBudget = channels.reduce((sum, ch) => sum + (ch.monthlyBudget || 0), 0);

  // Compute analytics from actual candidate data
  const totalFromDB = Object.values(analytics.candidatesBySource).reduce((a, b) => a + b, 0);
  const totalHiredFromDB = Object.values(analytics.hiredBySource).reduce((a, b) => a + b, 0);
  const totalRecentFromDB = Object.values(analytics.recentBySource).reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen bg-[#f8f7f5] lg:pl-[240px]">
      <Navbar />
      {/* Header */}
      <header className="tp-gradient text-white px-6 py-4">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Sourcing Hub</h1>
              <p className="text-sm text-white/70">Manage all recruitment sourcing channels</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <a href="/sourcing/cv-outreach" className="text-xs text-white/80 hover:text-white px-2 py-1 rounded-lg hover:bg-white/10 transition">CV & Outreach</a>
            <a href="/sourcing/job-posts" className="text-xs text-white/80 hover:text-white px-2 py-1 rounded-lg hover:bg-white/10 transition">Job Posts</a>
            <a href="/sourcing/trap" className="text-xs text-white/80 hover:text-white px-2 py-1 rounded-lg hover:bg-white/10 transition">TRAP Ads</a>
            <a href="/sourcing/content" className="text-xs text-white/80 hover:text-white px-2 py-1 rounded-lg hover:bg-white/10 transition">Content</a>
            <a href="/sourcing/walkin-qr" className="text-xs text-white/80 hover:text-white px-2 py-1 rounded-lg hover:bg-white/10 transition">QR Walk-in</a>
            <span className="w-px h-4 bg-white/20" />
            <a href="/admin" className="text-xs text-white/80 hover:text-white px-2 py-1 rounded-lg hover:bg-white/10 transition">Admin</a>
            <a href="/dashboard" className="text-xs text-white/80 hover:text-white px-2 py-1 rounded-lg hover:bg-white/10 transition">Dashboard</a>
            <button onClick={fetchData} className="flex items-center gap-1.5 text-xs bg-white/15 hover:bg-white/25 px-2 py-1 rounded-lg transition">
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto px-6 py-6">
        {/* Overview Stats */}
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-sm font-semibold text-gray-700">Overview</h2>
          <InfoTooltip text="Key metrics across all sourcing channels including active channels, total candidates sourced, and hiring outcomes" />
        </div>
        <div className="grid grid-cols-5 gap-4 mb-6">
          {[
            { label: "Active Channels", value: activeChannels, total: channels.length, icon: Zap, color: "bg-green-100 text-green-700" },
            { label: "Total Candidates", value: totalFromDB, total: null, icon: Users, color: "bg-[#eeedf2] text-[#4B4C6A]" },
            { label: "Hired", value: totalHiredFromDB, total: null, icon: CheckCircle2, color: "bg-green-100 text-green-700" },
            { label: "Last 30 Days", value: totalRecentFromDB, total: null, icon: TrendingUp, color: "bg-blue-100 text-blue-700" },
            { label: "Monthly Budget", value: `${totalBudget > 0 ? totalBudget.toLocaleString() : "—"}`, total: null, icon: DollarSign, color: "bg-amber-100 text-amber-700" },
          ].map(stat => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-white rounded-xl border border-[#e6e6e5] p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}{stat.total !== null && <span className="text-sm font-normal text-gray-400">/{stat.total}</span>}
                    </p>
                    <p className="text-xs text-gray-500">{stat.label}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Source Breakdown */}
        {totalFromDB > 0 && (
          <div className="bg-white rounded-xl border border-[#e6e6e5] p-5 mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#4B4C6A]" /> Candidate Source Breakdown
            </h3>
            <div className="flex gap-3 flex-wrap">
              {Object.entries(analytics.candidatesBySource).sort((a, b) => b[1] - a[1]).map(([source, count]) => {
                const pct = ((count / totalFromDB) * 100).toFixed(0);
                const hired = analytics.hiredBySource[source] || 0;
                const convRate = count > 0 ? ((hired / count) * 100).toFixed(0) : "0";
                return (
                  <div key={source} className="flex-1 min-w-[140px] p-3 bg-[#faf9f7] rounded-lg border border-[#e6e6e5]">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-gray-700">{source.replace(/_/g, " ")}</span>
                      <span className="text-xs text-gray-400">{pct}%</span>
                    </div>
                    <p className="text-lg font-bold text-gray-900">{count}</p>
                    <div className="w-full h-1.5 bg-gray-200 rounded-full mt-1 mb-1">
                      <div className="h-full bg-[#4B4C6A] rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>{hired} hired</span>
                      <span>{convRate}% conv.</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Channel Type Quick Filters */}
        <div className="flex gap-2 mb-4 flex-wrap">
          <button onClick={() => setFilterType("")}
            className={`text-xs px-3 py-1.5 rounded-lg transition font-medium ${!filterType ? "bg-[#4B4C6A] text-white" : "bg-white text-gray-600 border border-[#e6e6e5] hover:bg-gray-50"}`}>
            All Types
          </button>
          {CHANNEL_TYPES.map(t => {
            const count = channels.filter(ch => ch.type === t.value).length;
            return (
              <button key={t.value} onClick={() => setFilterType(filterType === t.value ? "" : t.value)}
                className={`text-xs px-3 py-1.5 rounded-lg transition font-medium flex items-center gap-1.5 ${
                  filterType === t.value ? "bg-[#4B4C6A] text-white" : "bg-white text-gray-600 border border-[#e6e6e5] hover:bg-gray-50"
                }`}>
                <t.icon className="w-3 h-3" />
                {t.label}
                {count > 0 && <span className={`text-[10px] px-1 rounded-full ${filterType === t.value ? "bg-white/20" : "bg-gray-100"}`}>{count}</span>}
              </button>
            );
          })}
        </div>

        {/* Search + Add Button */}
        <div className="flex gap-3 mb-4">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search channels..."
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 bg-white border border-[#e6e6e5] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4B4C6A]/20 focus:border-[#4B4C6A]" />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </div>
          <button onClick={() => { resetForm(); setShowForm(true); }}
            className="flex items-center gap-1.5 bg-[#4B4C6A] text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-[#3a3b54] transition">
            <Plus className="w-4 h-4" /> Add Channel
          </button>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="bg-white rounded-xl border-2 border-[#4B4C6A]/20 p-6 mb-6 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              {editingId ? "Edit Sourcing Channel" : "Add New Sourcing Channel"}
            </h3>

            {/* Channel Type Selection */}
            {!editingId && (
              <div className="mb-5">
                <label className="block text-xs font-medium text-gray-600 mb-2">Channel Type *</label>
                <div className="grid grid-cols-3 gap-2">
                  {CHANNEL_TYPES.map(t => (
                    <button key={t.value} onClick={() => setForm({...form, type: t.value, platform: ""})}
                      className={`p-3 rounded-lg border-2 text-left transition ${
                        form.type === t.value ? "border-[#4B4C6A] bg-[#eeedf2]" : "border-[#e6e6e5] hover:border-gray-300"
                      }`}>
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`w-7 h-7 rounded flex items-center justify-center ${t.color}`}>
                          <t.icon className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-sm font-medium">{t.label}</span>
                      </div>
                      <p className="text-xs text-gray-400">{t.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Channel Name *</label>
                <input value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#4B4C6A]"
                  placeholder="e.g., JobStreet Malaysia Premium" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Platform</label>
                {PLATFORMS[form.type]?.length > 0 ? (
                  <select value={form.platform} onChange={e => setForm({...form, platform: e.target.value})}
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2">
                    <option value="">Select platform...</option>
                    {PLATFORMS[form.type].map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                ) : (
                  <input value={form.platform} onChange={e => setForm({...form, platform: e.target.value})}
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#4B4C6A]"
                    placeholder="Platform name" />
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Import/API URL</label>
                <input value={form.importUrl} onChange={e => setForm({...form, importUrl: e.target.value})}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#4B4C6A]"
                  placeholder="https://api.example.com/candidates" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Cost per Hire (MYR)</label>
                <input type="number" value={form.costPerHire} onChange={e => setForm({...form, costPerHire: e.target.value})}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#4B4C6A]"
                  placeholder="0" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Monthly Budget (MYR)</label>
                <input type="number" value={form.monthlyBudget} onChange={e => setForm({...form, monthlyBudget: e.target.value})}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#4B4C6A]"
                  placeholder="0" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Contact Person</label>
                <input value={form.contactPerson} onChange={e => setForm({...form, contactPerson: e.target.value})}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#4B4C6A]"
                  placeholder="Agency rep, platform manager" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">Notes</label>
                <input value={form.notes} onChange={e => setForm({...form, notes: e.target.value})}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#4B4C6A]"
                  placeholder="Any additional notes about this channel..." />
              </div>
              <div className="flex items-end gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.autoImport} onChange={e => setForm({...form, autoImport: e.target.checked})}
                    className="w-4 h-4 rounded border-gray-300 text-[#4B4C6A] focus:ring-[#4B4C6A]" />
                  <span className="text-sm text-gray-600">Auto-import</span>
                </label>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <button onClick={saveChannel} disabled={!form.name}
                className="bg-[#4B4C6A] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#3a3b54] disabled:opacity-50 disabled:cursor-not-allowed">
                {editingId ? "Update Channel" : "Create Channel"}
              </button>
              <button onClick={resetForm} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-200">Cancel</button>
            </div>
          </div>
        )}

        {/* Channels List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <RefreshCw className="w-6 h-6 text-[#4B4C6A] animate-spin" />
            <span className="ml-2 text-gray-500">Loading channels...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#e6e6e5] p-12 text-center">
            <Megaphone className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <h3 className="text-lg font-medium text-gray-700 mb-1">No sourcing channels yet</h3>
            <p className="text-sm text-gray-400 mb-4">Add your first sourcing channel to start tracking where candidates come from.</p>
            <button onClick={() => { resetForm(); setShowForm(true); }}
              className="inline-flex items-center gap-1.5 bg-[#4B4C6A] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#3a3b54]">
              <Plus className="w-4 h-4" /> Add Your First Channel
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(ch => {
              const typeConfig = getTypeConfig(ch.type);
              const Icon = typeConfig.icon;
              const isExpanded = expandedId === ch.id;
              const convRate = ch.totalCandidates > 0 ? ((ch.totalHired / ch.totalCandidates) * 100).toFixed(1) : "0";

              return (
                <div key={ch.id} className={`bg-white rounded-xl border transition ${ch.isActive ? "border-[#e6e6e5]" : "border-gray-200 opacity-60"}`}>
                  {/* Main Row */}
                  <div className="px-5 py-4 flex items-center gap-4">
                    {/* Icon */}
                    <div className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 ${typeConfig.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>

                    {/* Name & Meta */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-gray-900 truncate">{ch.name}</h3>
                        {!ch.isActive && <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">Inactive</span>}
                        {ch.autoImport && <span className="text-xs px-1.5 py-0.5 rounded bg-cyan-100 text-cyan-700 flex items-center gap-0.5"><Zap className="w-2.5 h-2.5" /> Auto</span>}
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {typeConfig.label}
                        {ch.platform && ` · ${ch.platform}`}
                        {ch.contactPerson && ` · ${ch.contactPerson}`}
                      </p>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-6 shrink-0">
                      <div className="text-center min-w-[60px]">
                        <p className="text-lg font-bold text-gray-900">{ch.totalCandidates}</p>
                        <p className="text-[10px] text-gray-400 uppercase">Candidates</p>
                      </div>
                      <div className="text-center min-w-[50px]">
                        <p className="text-lg font-bold text-green-600">{ch.totalHired}</p>
                        <p className="text-[10px] text-gray-400 uppercase">Hired</p>
                      </div>
                      <div className="text-center min-w-[50px]">
                        <p className="text-sm font-semibold text-[#4B4C6A]">{convRate}%</p>
                        <p className="text-[10px] text-gray-400 uppercase">Conv.</p>
                      </div>
                      {ch.costPerHire && (
                        <div className="text-center min-w-[70px]">
                          <p className="text-sm font-semibold text-amber-600">{ch.costPerHire.toLocaleString()}</p>
                          <p className="text-[10px] text-gray-400 uppercase">Cost/Hire</p>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={() => setExpandedId(isExpanded ? null : ch.id)}
                        className="p-1.5 rounded hover:bg-gray-100 text-gray-500" title="Details">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                      <button onClick={() => toggleActive(ch.id, ch.isActive)}
                        className={`p-1.5 rounded hover:bg-gray-100 ${ch.isActive ? "text-green-600" : "text-gray-400"}`}
                        title={ch.isActive ? "Deactivate" : "Activate"}>
                        {ch.isActive ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                      </button>
                      <button onClick={() => startEdit(ch)} className="p-1.5 rounded hover:bg-gray-100 text-gray-500" title="Edit">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => deleteChannel(ch.id, ch.name)}
                        className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-500" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="px-5 pb-4 border-t border-gray-100 bg-[#faf9f7]">
                      <div className="grid grid-cols-4 gap-4 py-4">
                        <div>
                          <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Configuration</h4>
                          <dl className="space-y-1.5 text-sm">
                            <div className="flex justify-between"><dt className="text-gray-500">Type</dt><dd>{typeConfig.label}</dd></div>
                            <div className="flex justify-between"><dt className="text-gray-500">Platform</dt><dd>{ch.platform || "—"}</dd></div>
                            <div className="flex justify-between"><dt className="text-gray-500">Auto Import</dt>
                              <dd className={ch.autoImport ? "text-green-600 font-medium" : "text-gray-400"}>
                                {ch.autoImport ? "Enabled" : "Disabled"}
                              </dd>
                            </div>
                            {ch.importUrl && (
                              <div>
                                <dt className="text-gray-500 text-xs">Import URL</dt>
                                <dd className="text-xs font-mono bg-white rounded p-1.5 mt-0.5 border truncate">{ch.importUrl}</dd>
                              </div>
                            )}
                          </dl>
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Budget & Cost</h4>
                          <dl className="space-y-1.5 text-sm">
                            <div className="flex justify-between"><dt className="text-gray-500">Cost/Hire</dt><dd>{ch.costPerHire ? `${ch.costPerHire.toLocaleString()} MYR` : "—"}</dd></div>
                            <div className="flex justify-between"><dt className="text-gray-500">Monthly Budget</dt><dd>{ch.monthlyBudget ? `${ch.monthlyBudget.toLocaleString()} MYR` : "—"}</dd></div>
                          </dl>
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Import History</h4>
                          <dl className="space-y-1.5 text-sm">
                            <div className="flex justify-between"><dt className="text-gray-500">Total Imported</dt><dd className="font-medium">{ch.totalCandidates}</dd></div>
                            <div className="flex justify-between"><dt className="text-gray-500">Total Hired</dt><dd className="font-medium text-green-600">{ch.totalHired}</dd></div>
                            <div className="flex justify-between"><dt className="text-gray-500">Last Import</dt>
                              <dd>{ch.lastImportAt ? new Date(ch.lastImportAt).toLocaleDateString() : "Never"}</dd>
                            </div>
                            <div className="flex justify-between"><dt className="text-gray-500">Last Batch</dt><dd>{ch.lastImportCount} candidates</dd></div>
                          </dl>
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Contact</h4>
                          <dl className="space-y-1.5 text-sm">
                            <div className="flex justify-between"><dt className="text-gray-500">Person</dt><dd>{ch.contactPerson || "—"}</dd></div>
                            <div className="flex justify-between"><dt className="text-gray-500">Email</dt><dd>{ch.contactEmail || "—"}</dd></div>
                          </dl>
                          {ch.notes && (
                            <div className="mt-2">
                              <p className="text-xs text-gray-500">Notes:</p>
                              <p className="text-xs text-gray-700 bg-white rounded p-2 mt-0.5 border">{ch.notes}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Quick Setup Guide */}
        {channels.length === 0 && !showForm && (
          <div className="mt-8 bg-white rounded-xl border border-[#e6e6e5] p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" /> Recommended Sourcing Setup for TP Malaysia
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {[
                { name: "JobStreet Malaysia", type: "JOB_BOARD", platform: "jobstreet", desc: "Primary job board for MY market" },
                { name: "LinkedIn Recruiter", type: "SOCIAL_MEDIA", platform: "linkedin", desc: "Professional talent sourcing" },
                { name: "TP Career Website", type: "CAREER_SITE", platform: "tp-careers", desc: "Organic applications from career-tpmy.vercel.app" },
                { name: "Facebook Jobs", type: "SOCIAL_MEDIA", platform: "facebook", desc: "High volume, good for agent roles" },
                { name: "Employee Referral Program", type: "REFERRAL", platform: "internal-portal", desc: "Bonus-incentivized referrals" },
                { name: "Walk-in KL Office", type: "WALK_IN", platform: "kl-office", desc: "Physical walk-in applicants" },
                { name: "iCIMS ATS Sync", type: "ATS_IMPORT", platform: "icims", desc: "Sync from existing ATS" },
                { name: "Apify Job Scraper", type: "WEB_SCRAPER", platform: "apify", desc: "Automated candidate discovery" },
                { name: "University Career Fairs", type: "EVENT", platform: "", desc: "Campus recruitment events" },
              ].map((ch, i) => {
                const typeConfig = getTypeConfig(ch.type);
                const Icon = typeConfig.icon;
                return (
                  <button key={i} onClick={() => {
                    setForm({ ...form, name: ch.name, type: ch.type, platform: ch.platform, notes: ch.desc });
                    setShowForm(true);
                  }}
                    className="p-3 rounded-lg border border-dashed border-gray-300 hover:border-[#4B4C6A] hover:bg-[#eeedf2]/30 text-left transition group">
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`w-7 h-7 rounded flex items-center justify-center ${typeConfig.color}`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-sm font-medium text-gray-700 group-hover:text-[#4B4C6A]">{ch.name}</span>
                    </div>
                    <p className="text-xs text-gray-400">{ch.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
