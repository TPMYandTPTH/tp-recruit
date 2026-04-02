"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Briefcase, Globe, Clock, CheckCircle2, AlertCircle, Send,
  Plus, Search, Filter, ExternalLink, Copy, Eye, Trash2,
  MapPin, DollarSign, Users, TrendingUp, Loader2, ChevronDown
} from "lucide-react";
import Navbar from "@/components/ui/Navbar";
import InfoTooltip from "@/components/ui/InfoTooltip";

const JOB_BOARDS = [
  { id: "jobstreet", name: "JobStreet", region: "MY/SG", logo: "🟠", color: "#FF6B00", features: ["Featured", "Urgent", "Spotlight"] },
  { id: "linkedin", name: "LinkedIn Jobs", region: "Global", logo: "🔵", color: "#0A66C2", features: ["Promoted", "Easy Apply"] },
  { id: "indeed", name: "Indeed", region: "Global", logo: "🟣", color: "#2164F3", features: ["Sponsored", "Urgently Hiring"] },
  { id: "glassdoor", name: "Glassdoor", region: "Global", logo: "🟢", color: "#0CAA41", features: ["Featured"] },
  { id: "ricebowl", name: "Ricebowl", region: "MY", logo: "🍚", color: "#E74C3C", features: ["Premium", "Highlight"] },
  { id: "maukerja", name: "Maukerja", region: "MY", logo: "🇲🇾", color: "#1ABC9C", features: ["Boosted"] },
  { id: "wobb", name: "WOBB", region: "MY", logo: "🟡", color: "#FFD700", features: ["Featured Video"] },
  { id: "hiredly", name: "Hiredly", region: "MY", logo: "🔴", color: "#FF4757", features: ["Premium"] },
  { id: "foundit", name: "Foundit (Monster)", region: "MY/SEA", logo: "🟤", color: "#6C3483", features: ["Power CV"] },
  { id: "careerjet", name: "CareerJet", region: "Global", logo: "✈️", color: "#2C3E50", features: ["Aggregator"] },
  { id: "jora", name: "Jora", region: "MY/SEA", logo: "🌐", color: "#3498DB", features: ["Free Listing"] },
  { id: "mudah", name: "Mudah.my", region: "MY", logo: "📢", color: "#F39C12", features: ["Classifieds"] },
];

type PostStatus = "DRAFT" | "ACTIVE" | "PAUSED" | "EXPIRED" | "CLOSED";

interface JobPost {
  id: string;
  roleTitle: string;
  client: string;
  location: string;
  salaryRange: string;
  language: string;
  description: string;
  requirements: string[];
  benefits: string[];
  boards: string[];
  status: PostStatus;
  postedAt: string;
  expiresAt: string;
  views: number;
  applications: number;
  shortlisted: number;
}

const DEMO_POSTS: JobPost[] = [
  {
    id: "jp-1", roleTitle: "Customer Service Representative (Mandarin)", client: "Tech Giant",
    location: "KL Sentral, Kuala Lumpur", salaryRange: "RM 4,000 – RM 5,500",
    language: "Mandarin + English", description: "Join Teleperformance Malaysia as a Customer Service Representative...",
    requirements: ["Fluent in Mandarin & English", "Min SPM/Diploma", "Customer service orientation", "Basic computer skills"],
    benefits: ["Medical & dental coverage", "Annual performance bonus", "Career development", "Modern office", "Transport allowance"],
    boards: ["jobstreet", "linkedin", "indeed", "ricebowl"],
    status: "ACTIVE", postedAt: "2026-03-18", expiresAt: "2026-04-18",
    views: 2340, applications: 187, shortlisted: 42
  },
  {
    id: "jp-2", roleTitle: "Technical Support Agent (Japanese)", client: "Gaming Co",
    location: "Cyberjaya, Selangor", salaryRange: "RM 5,500 – RM 8,000",
    language: "Japanese + English", description: "Provide technical support for a leading gaming company...",
    requirements: ["JLPT N2 or above", "Gaming knowledge", "Technical aptitude", "Shift flexibility"],
    benefits: ["Premium salary package", "Gaming perks", "Night shift allowance", "Free meals"],
    boards: ["linkedin", "indeed", "glassdoor", "foundit"],
    status: "ACTIVE", postedAt: "2026-03-20", expiresAt: "2026-04-20",
    views: 1560, applications: 89, shortlisted: 18
  },
  {
    id: "jp-3", roleTitle: "Sales Agent (Bahasa Malaysia)", client: "Telco Provider",
    location: "Bangsar South, KL", salaryRange: "RM 3,000 – RM 4,500 + Commission",
    language: "Bahasa Malaysia + English", description: "Drive sales for a major telco provider...",
    requirements: ["Fluent BM & English", "Sales experience preferred", "Target-oriented", "SPM minimum"],
    benefits: ["Uncapped commission", "Monthly incentives", "Career progression", "Team activities"],
    boards: ["jobstreet", "maukerja", "mudah", "jora"],
    status: "DRAFT", postedAt: "", expiresAt: "",
    views: 0, applications: 0, shortlisted: 0
  },
];

export default function JobPostsPage() {
  const [posts, setPosts] = useState<JobPost[]>(DEMO_POSTS);
  const [roles, setRoles] = useState<any[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const [form, setForm] = useState({
    roleId: "", location: "Kuala Lumpur", salaryMin: "", salaryMax: "",
    language: "English", description: "", requirements: "",
    benefits: "Medical & dental coverage\nAnnual performance bonus\nCareer development programs\nModern office environment\nTransport/parking allowance",
    boards: ["jobstreet", "linkedin", "indeed"] as string[],
    autoRenew: true, duration: "30",
  });

  useEffect(() => {
    fetch("/api/roles").then(r => r.json()).then(d => setRoles(d.roles || []));
  }, []);

  const filteredPosts = posts.filter(p => {
    if (statusFilter !== "ALL" && p.status !== statusFilter) return false;
    if (search && !p.roleTitle.toLowerCase().includes(search.toLowerCase()) && !p.client.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalViews = posts.reduce((s, p) => s + p.views, 0);
  const totalApps = posts.reduce((s, p) => s + p.applications, 0);
  const activePosts = posts.filter(p => p.status === "ACTIVE").length;
  const totalBoards = new Set(posts.flatMap(p => p.boards)).size;

  const toggleBoard = (boardId: string) => {
    setForm(f => ({
      ...f,
      boards: f.boards.includes(boardId)
        ? f.boards.filter(b => b !== boardId)
        : [...f.boards, boardId],
    }));
  };

  const generateDescription = () => {
    const role = roles.find(r => r.id === form.roleId);
    if (!role) return;
    const desc = `Join Teleperformance Malaysia as a ${role.title}! We're looking for talented individuals to support our ${role.client} campaign.\n\nAs a global leader in digital business services, Teleperformance offers an exciting work environment with competitive compensation and excellent career growth opportunities.\n\nLocation: ${form.location}\nSalary: RM ${form.salaryMin} – RM ${form.salaryMax}\nLanguage: ${form.language}`;
    setForm(f => ({ ...f, description: desc }));
  };

  const handleCreate = () => {
    const role = roles.find(r => r.id === form.roleId);
    if (!role) return;
    setCreating(true);
    setTimeout(() => {
      const newPost: JobPost = {
        id: `jp-${Date.now()}`,
        roleTitle: role.title,
        client: role.client,
        location: form.location,
        salaryRange: `RM ${form.salaryMin} – RM ${form.salaryMax}`,
        language: form.language,
        description: form.description,
        requirements: form.requirements.split("\n").filter(Boolean),
        benefits: form.benefits.split("\n").filter(Boolean),
        boards: form.boards,
        status: "ACTIVE",
        postedAt: new Date().toISOString().slice(0, 10),
        expiresAt: new Date(Date.now() + parseInt(form.duration) * 86400000).toISOString().slice(0, 10),
        views: 0, applications: 0, shortlisted: 0,
      };
      setPosts(prev => [newPost, ...prev]);
      setShowCreate(false);
      setCreating(false);
    }, 1500);
  };

  const statusBadge = (s: PostStatus) => {
    const map: Record<PostStatus, { bg: string; text: string; icon: any }> = {
      ACTIVE: { bg: "bg-green-100 text-green-700", text: "Active", icon: CheckCircle2 },
      DRAFT: { bg: "bg-gray-100 text-gray-600", text: "Draft", icon: Clock },
      PAUSED: { bg: "bg-yellow-100 text-yellow-700", text: "Paused", icon: AlertCircle },
      EXPIRED: { bg: "bg-red-100 text-red-700", text: "Expired", icon: AlertCircle },
      CLOSED: { bg: "bg-gray-200 text-gray-500", text: "Closed", icon: CheckCircle2 },
    };
    const m = map[s];
    const Icon = m.icon;
    return <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${m.bg}`}><Icon className="w-3 h-3" />{m.text}</span>;
  };

  return (
    <div className="min-h-screen bg-[#f8f7f5] lg:pl-[240px]">
      <Navbar />
      {/* Header */}
      <div className="bg-[#4B4C6A] text-white px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Briefcase className="w-5 h-5" />
              <h1 className="text-lg font-bold">Job Board Posting</h1>
            </div>
            <p className="text-xs text-white/60">Post to 12+ job boards across Malaysia & globally</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/sourcing" className="text-xs text-white/70 hover:text-white">← Sourcing Hub</Link>
            <Link href="/sourcing/trap" className="text-xs text-white/70 hover:text-white">TRAP Ads</Link>
            <Link href="/sourcing/content" className="text-xs text-white/70 hover:text-white">Content Creator</Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Active Posts", value: activePosts, icon: CheckCircle2, color: "text-green-600" },
            { label: "Total Views", value: totalViews.toLocaleString(), icon: Eye, color: "text-blue-600" },
            { label: "Applications", value: totalApps, icon: Users, color: "text-purple-600" },
            { label: "Boards Used", value: `${totalBoards}/12`, icon: Globe, color: "text-orange-600" },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-xl border border-[#e6e6e5] p-4">
              <div className="flex items-center gap-2 mb-2">
                <s.icon className={`w-4 h-4 ${s.color}`} />
                <span className="text-xs text-gray-500">{s.label}</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Job Boards Overview */}
        <div className="bg-white rounded-xl border border-[#e6e6e5] p-5">
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-sm font-semibold text-gray-800">Connected Job Boards</h2>
            <InfoTooltip text="12+ major job boards supported. Each board shows number of active posts, reach thousands of candidates daily" />
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {JOB_BOARDS.map(b => {
              const postCount = posts.filter(p => p.boards.includes(b.id) && p.status === "ACTIVE").length;
              return (
                <div key={b.id} className="text-center p-3 rounded-lg border border-gray-100 hover:border-[#4B4C6A]/30 transition cursor-pointer">
                  <div className="text-2xl mb-1">{b.logo}</div>
                  <p className="text-xs font-medium text-gray-800 truncate">{b.name}</p>
                  <p className="text-[10px] text-gray-400">{b.region}</p>
                  <p className="text-[10px] font-medium mt-1" style={{ color: b.color }}>
                    {postCount} active
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg" placeholder="Search posts..." />
            </div>
            <div className="flex items-center gap-1">
              {["ALL", "ACTIVE", "DRAFT", "PAUSED", "EXPIRED"].map(s => (
                <button key={s} onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1.5 text-xs rounded-lg transition ${statusFilter === s ? "bg-[#4B4C6A] text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"}`}>
                  {s === "ALL" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>
          <button onClick={() => setShowCreate(!showCreate)}
            className="flex items-center gap-2 bg-[#4B4C6A] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#3a3b54] transition">
            <Plus className="w-4 h-4" />{showCreate ? "Cancel" : "Create Job Post"}
          </button>
        </div>

        {/* Create Form */}
        {showCreate && (
          <div className="bg-white rounded-xl border-2 border-[#4B4C6A]/20 p-6 space-y-5">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-gray-800">New Job Post</h3>
              <InfoTooltip text="Create a new job posting with role details, requirements, benefits, and select which boards to publish to" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">Role / Position *</label>
                <select value={form.roleId} onChange={e => setForm({ ...form, roleId: e.target.value })}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2">
                  <option value="">Select role...</option>
                  {roles.map((r: any) => <option key={r.id} value={r.id}>{r.title} — {r.client}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Location</label>
                <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Language</label>
                <select value={form.language} onChange={e => setForm({ ...form, language: e.target.value })}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2">
                  {["English", "Bahasa Malaysia", "Mandarin", "Cantonese", "Japanese", "Korean", "Thai", "Arabic", "Hindi"].map(l =>
                    <option key={l}>{l}</option>
                  )}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Salary Min (RM)</label>
                <input type="number" value={form.salaryMin} onChange={e => setForm({ ...form, salaryMin: e.target.value })}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2" placeholder="3000" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Salary Max (RM)</label>
                <input type="number" value={form.salaryMax} onChange={e => setForm({ ...form, salaryMax: e.target.value })}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2" placeholder="5500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Duration (days)</label>
                <select value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2">
                  <option value="7">7 days</option>
                  <option value="14">14 days</option>
                  <option value="30">30 days (Standard)</option>
                  <option value="60">60 days</option>
                  <option value="90">90 days</option>
                </select>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-gray-600">Job Description</label>
                <button onClick={generateDescription} type="button"
                  className="text-[10px] text-[#4B4C6A] font-medium hover:underline">✨ Auto-generate</button>
              </div>
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 h-28 resize-none" placeholder="Describe the role..." />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Requirements (one per line)</label>
                <textarea value={form.requirements} onChange={e => setForm({ ...form, requirements: e.target.value })}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 h-24 resize-none"
                  placeholder="Fluent in English&#10;Min SPM/Diploma&#10;Customer service orientation" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Benefits (one per line)</label>
                <textarea value={form.benefits} onChange={e => setForm({ ...form, benefits: e.target.value })}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 h-24 resize-none" />
              </div>
            </div>

            {/* Board Selection */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">Post to Job Boards ({form.boards.length} selected)</label>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                {JOB_BOARDS.map(b => (
                  <button key={b.id} type="button" onClick={() => toggleBoard(b.id)}
                    className={`p-2 rounded-lg border text-center transition ${form.boards.includes(b.id)
                      ? "border-[#4B4C6A] bg-[#4B4C6A]/5"
                      : "border-gray-200 hover:border-gray-300"}`}>
                    <div className="text-lg">{b.logo}</div>
                    <p className="text-[10px] font-medium text-gray-700 truncate">{b.name}</p>
                    {form.boards.includes(b.id) && <CheckCircle2 className="w-3 h-3 text-[#4B4C6A] mx-auto mt-0.5" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <label className="flex items-center gap-2 text-xs text-gray-600">
                <input type="checkbox" checked={form.autoRenew}
                  onChange={e => setForm({ ...form, autoRenew: e.target.checked })}
                  className="rounded border-gray-300" />
                Auto-renew when expired
              </label>
              <button onClick={handleCreate} disabled={!form.roleId || creating}
                className="flex items-center gap-2 bg-[#4B4C6A] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[#3a3b54] transition disabled:opacity-50">
                {creating ? <><Loader2 className="w-4 h-4 animate-spin" /> Publishing...</> : <><Send className="w-4 h-4" /> Publish to {form.boards.length} Boards</>}
              </button>
            </div>
          </div>
        )}

        {/* Job Posts List */}
        <div className="space-y-3">
          {filteredPosts.map(post => (
            <div key={post.id} className="bg-white rounded-xl border border-[#e6e6e5] overflow-hidden">
              <div className="p-5 cursor-pointer" onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-bold text-gray-900">{post.roleTitle}</h3>
                      {statusBadge(post.status)}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" />{post.client}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{post.location}</span>
                      <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />{post.salaryRange}</span>
                      <span className="flex items-center gap-1"><Globe className="w-3 h-3" />{post.language}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-right">
                    <div><p className="text-gray-400">Views</p><p className="font-bold text-gray-800">{post.views.toLocaleString()}</p></div>
                    <div><p className="text-gray-400">Apps</p><p className="font-bold text-gray-800">{post.applications}</p></div>
                    <div><p className="text-gray-400">Shortlisted</p><p className="font-bold text-green-600">{post.shortlisted}</p></div>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition ${expandedPost === post.id ? "rotate-180" : ""}`} />
                  </div>
                </div>

                {/* Board Chips */}
                <div className="flex items-center gap-1.5 mt-3">
                  {post.boards.map(bId => {
                    const board = JOB_BOARDS.find(b => b.id === bId);
                    return board ? (
                      <span key={bId} className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-50 rounded text-[10px] text-gray-600 border border-gray-100">
                        {board.logo} {board.name}
                      </span>
                    ) : null;
                  })}
                  {post.postedAt && <span className="text-[10px] text-gray-400 ml-2">Posted {post.postedAt} · Expires {post.expiresAt}</span>}
                </div>
              </div>

              {/* Expanded Details */}
              {expandedPost === post.id && (
                <div className="border-t border-gray-100 p-5 bg-gray-50/50 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-xs font-semibold text-gray-700 mb-2">Requirements</h4>
                      <ul className="space-y-1">
                        {post.requirements.map((r, i) => (
                          <li key={i} className="text-xs text-gray-600 flex items-start gap-1.5">
                            <CheckCircle2 className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />{r}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-gray-700 mb-2">Benefits</h4>
                      <ul className="space-y-1">
                        {post.benefits.map((b, i) => (
                          <li key={i} className="text-xs text-gray-600 flex items-start gap-1.5">
                            <span className="text-[#4B4C6A]">•</span>{b}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Conversion Funnel */}
                  {post.status === "ACTIVE" && (
                    <div>
                      <h4 className="text-xs font-semibold text-gray-700 mb-2">Conversion Funnel</h4>
                      <div className="flex items-center gap-2">
                        {[
                          { label: "Views", val: post.views },
                          { label: "Applications", val: post.applications },
                          { label: "Shortlisted", val: post.shortlisted },
                        ].map((step, i, arr) => (
                          <div key={i} className="flex items-center gap-2">
                            <div className="text-center">
                              <p className="text-lg font-bold text-gray-800">{step.val.toLocaleString()}</p>
                              <p className="text-[10px] text-gray-500">{step.label}</p>
                            </div>
                            {i < arr.length - 1 && (
                              <div className="text-center px-2">
                                <TrendingUp className="w-3 h-3 text-gray-400 mx-auto" />
                                <p className="text-[10px] text-gray-400">{arr[i + 1].val > 0 ? ((arr[i + 1].val / step.val) * 100).toFixed(1) : 0}%</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
                    <button className="flex items-center gap-1 text-xs px-3 py-1.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
                      <Copy className="w-3 h-3" /> Duplicate
                    </button>
                    <button className="flex items-center gap-1 text-xs px-3 py-1.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
                      <ExternalLink className="w-3 h-3" /> Preview
                    </button>
                    {post.status === "ACTIVE" ? (
                      <button onClick={() => setPosts(ps => ps.map(p => p.id === post.id ? { ...p, status: "PAUSED" as PostStatus } : p))}
                        className="flex items-center gap-1 text-xs px-3 py-1.5 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-lg hover:bg-yellow-100">
                        <AlertCircle className="w-3 h-3" /> Pause
                      </button>
                    ) : post.status === "DRAFT" || post.status === "PAUSED" ? (
                      <button onClick={() => setPosts(ps => ps.map(p => p.id === post.id ? { ...p, status: "ACTIVE" as PostStatus, postedAt: new Date().toISOString().slice(0, 10), expiresAt: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10) } : p))}
                        className="flex items-center gap-1 text-xs px-3 py-1.5 bg-green-50 text-green-700 border border-green-200 rounded-lg hover:bg-green-100">
                        <Send className="w-3 h-3" /> {post.status === "DRAFT" ? "Publish" : "Resume"}
                      </button>
                    ) : null}
                    <button onClick={() => setPosts(ps => ps.filter(p => p.id !== post.id))}
                      className="flex items-center gap-1 text-xs px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 ml-auto">
                      <Trash2 className="w-3 h-3" /> Remove
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
