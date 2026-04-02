"use client";

import { useState, useEffect } from "react";
import {
  Megaphone, Play, Pause, DollarSign, Eye, MousePointer, Users,
  Plus, Pencil, Trash2, BarChart3, TrendingUp, Target, RefreshCw,
  Globe, Smartphone, Monitor, ArrowRight,
} from "lucide-react";
import Navbar from "@/components/ui/Navbar";
import InfoTooltip from "@/components/ui/InfoTooltip";

type AdCampaign = {
  id: string; name: string; platform: string; status: string;
  roleTitle: string; budget: number; spent: number;
  impressions: number; clicks: number; applications: number;
  targetAudience: string; adCopy: string; language: string;
  startDate: string; endDate: string;
};

const PLATFORMS = [
  { id: "tiktok", name: "TikTok Ads", icon: "🎵", color: "bg-black text-white", desc: "Short-form video ads for Gen Z talent" },
  { id: "meta", name: "Meta (FB/IG)", icon: "📘", color: "bg-blue-600 text-white", desc: "Facebook & Instagram job ads" },
  { id: "google", name: "Google Ads", icon: "🔍", color: "bg-white text-gray-800 border border-gray-200", desc: "Search & display recruitment ads" },
  { id: "linkedin", name: "LinkedIn Ads", icon: "💼", color: "bg-blue-800 text-white", desc: "Professional talent targeting" },
];

const AUDIENCES = [
  "Fresh Graduates (18-24)", "BPO Experienced (25-35)", "Career Switchers (25-40)",
  "Multilingual Speakers", "IT/Tech Support Background", "Sales Professionals",
  "Student Part-timers", "Remote Workers",
];

export default function TRAPPage() {
  const [campaigns, setCampaigns] = useState<AdCampaign[]>([
    // Demo campaigns
    {
      id: "demo-1", name: "Q1 2026 Agent Hiring Blitz", platform: "meta",
      status: "ACTIVE", roleTitle: "Customer Service Agent - EN",
      budget: 5000, spent: 2340, impressions: 145000, clicks: 3200, applications: 89,
      targetAudience: "BPO Experienced (25-35)", language: "EN",
      adCopy: "🎯 Join Teleperformance Malaysia! We're hiring Customer Service Agents. Competitive salary, great benefits, career growth. Apply now!",
      startDate: "2026-03-01", endDate: "2026-03-31",
    },
    {
      id: "demo-2", name: "TikTok Fresh Grad Campaign", platform: "tiktok",
      status: "ACTIVE", roleTitle: "Customer Service Agent - BM",
      budget: 3000, spent: 1200, impressions: 320000, clicks: 8500, applications: 156,
      targetAudience: "Fresh Graduates (18-24)", language: "BM",
      adCopy: "🔥 Nak gaji best? Join TP Malaysia sekarang! Jawatan Customer Service Agent — tak perlu pengalaman! 🚀",
      startDate: "2026-03-10", endDate: "2026-04-10",
    },
    {
      id: "demo-3", name: "Google Search - Tech Support", platform: "google",
      status: "PAUSED", roleTitle: "Technical Support Agent - EN",
      budget: 4000, spent: 3800, impressions: 52000, clicks: 1800, applications: 42,
      targetAudience: "IT/Tech Support Background", language: "EN",
      adCopy: "Technical Support Agent wanted at Teleperformance Malaysia. IT experience preferred. Apply now for competitive salary + benefits.",
      startDate: "2026-02-15", endDate: "2026-03-15",
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [roles, setRoles] = useState<any[]>([]);
  const [form, setForm] = useState({
    name: "", platform: "meta", roleTitle: "", budget: "3000",
    targetAudience: AUDIENCES[0], language: "EN",
    adCopy: "", startDate: "", endDate: "",
  });

  useEffect(() => {
    fetch("/api/roles").then(r => r.json()).then(d => setRoles(d.roles || []));
  }, []);

  const totalBudget = campaigns.reduce((s, c) => s + c.budget, 0);
  const totalSpent = campaigns.reduce((s, c) => s + c.spent, 0);
  const totalImpressions = campaigns.reduce((s, c) => s + c.impressions, 0);
  const totalClicks = campaigns.reduce((s, c) => s + c.clicks, 0);
  const totalApps = campaigns.reduce((s, c) => s + c.applications, 0);
  const avgCTR = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : "0";
  const costPerApp = totalApps > 0 ? (totalSpent / totalApps).toFixed(0) : "0";

  const generateAdCopy = () => {
    const role = form.roleTitle || "Customer Service Agent";
    const copies: Record<string, Record<string, string>> = {
      tiktok: {
        EN: `🔥 Join the TP fam! ${role} wanted in KL! 🇲🇾\n💰 Great salary, no degree needed!\n🚀 Apply link in bio!\n#TPMalaysia #NowHiring #BPOJobs`,
        BM: `🔥 Jom join TP Malaysia! ${role} wanted! 🇲🇾\n💰 Gaji best, tak perlu degree!\n🚀 Apply sekarang!\n#KerjaKL #TPMalaysia #Hiring`,
        ZH: `🔥 加入TP马来西亚！招聘${role}！🇲🇾\n💰 薪资优厚！\n🚀 立即申请！\n#TPMalaysia #招聘`,
      },
      meta: {
        EN: `🎯 Teleperformance Malaysia is hiring!\n\n👉 Position: ${role}\n💰 Competitive salary + allowances\n🏢 KL & Cyberjaya locations\n✅ Medical + dental benefits\n🚀 Career growth opportunities\n\nApply now! Link below 👇`,
        BM: `🎯 Teleperformance Malaysia sedang merekrut!\n\n👉 Jawatan: ${role}\n💰 Gaji kompetitif + elaun\n🏢 Lokasi KL & Cyberjaya\n✅ Manfaat perubatan & pergigian\n🚀 Peluang kerjaya\n\nMohon sekarang! 👇`,
        ZH: `🎯 Teleperformance马来西亚招聘中！\n\n👉 职位：${role}\n💰 有竞争力的薪资\n🏢 吉隆坡/赛城\n✅ 医疗福利\n🚀 职业发展\n\n立即申请！👇`,
      },
      google: {
        EN: `${role} | Teleperformance Malaysia | Apply Now\nCompetitive salary, great benefits, career growth. Join 420,000+ employees worldwide. No experience needed. Apply today!`,
        BM: `${role} | TP Malaysia | Mohon Sekarang\nGaji kompetitif, manfaat hebat. Tiada pengalaman diperlukan. Mohon hari ini!`,
        ZH: `${role} | TP马来西亚 | 立即申请\n薪资优厚，福利完善。无需经验。今天就申请！`,
      },
      linkedin: {
        EN: `We're growing our team at Teleperformance Malaysia! 🚀\n\nLooking for talented individuals for the role of ${role}.\n\nWhat we offer:\n• Competitive compensation\n• International career opportunities\n• Training & development\n• Diverse & inclusive workplace\n\n#Hiring #BPO #CustomerService #Malaysia`,
        BM: `Teleperformance Malaysia sedang berkembang! 🚀\n\nMencari individu berbakat untuk ${role}.\n\n#Hiring #BPO #Malaysia`,
        ZH: `TP马来西亚团队扩招中！🚀\n\n招聘${role}。\n\n#招聘 #BPO #马来西亚`,
      },
    };

    const platformCopies = copies[form.platform] || copies.meta;
    setForm({ ...form, adCopy: platformCopies[form.language] || platformCopies.EN });
  };

  const createCampaign = () => {
    const newCampaign: AdCampaign = {
      id: `camp-${Date.now()}`, name: form.name, platform: form.platform,
      status: "DRAFT", roleTitle: form.roleTitle, budget: parseFloat(form.budget),
      spent: 0, impressions: 0, clicks: 0, applications: 0,
      targetAudience: form.targetAudience, adCopy: form.adCopy,
      language: form.language, startDate: form.startDate, endDate: form.endDate,
    };
    setCampaigns([newCampaign, ...campaigns]);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-[#f8f7f5] lg:pl-[240px]">
      <Navbar />
      <header className="tp-gradient text-white px-6 py-4">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold">TRAP — Talent Recruitment Ad Platform</h1>
              <p className="text-sm text-white/70">TikTok · Meta · Google · LinkedIn Ad Campaigns</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a href="/sourcing" className="text-sm text-white/80 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/10 transition">← Sourcing Hub</a>
            <a href="/sourcing/job-posts" className="text-sm text-white/80 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/10 transition">Job Posting</a>
            <a href="/sourcing/content" className="text-sm text-white/80 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/10 transition">Content Creator</a>
          </div>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto px-6 py-6">
        {/* Stats */}
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-sm font-semibold text-gray-700">Campaign Performance Metrics</h2>
          <InfoTooltip text="Track budget spent, impressions, clicks, applications, and cost-per-application across all ad campaigns" />
        </div>
        <div className="grid grid-cols-6 gap-3 mb-6">
          {[
            { label: "Total Budget", value: `${totalBudget.toLocaleString()} MYR`, icon: DollarSign, color: "bg-amber-100 text-amber-700" },
            { label: "Total Spent", value: `${totalSpent.toLocaleString()} MYR`, icon: DollarSign, color: "bg-red-100 text-red-700" },
            { label: "Impressions", value: totalImpressions.toLocaleString(), icon: Eye, color: "bg-blue-100 text-blue-700" },
            { label: "Clicks", value: totalClicks.toLocaleString(), icon: MousePointer, color: "bg-purple-100 text-purple-700" },
            { label: "Applications", value: totalApps.toString(), icon: Users, color: "bg-green-100 text-green-700" },
            { label: "Cost/App", value: `${costPerApp} MYR`, icon: TrendingUp, color: "bg-[#eeedf2] text-[#4B4C6A]" },
          ].map(s => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="bg-white rounded-xl border border-[#e6e6e5] p-3">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${s.color}`}><Icon className="w-4 h-4" /></div>
                  <div>
                    <p className="text-lg font-bold text-gray-900">{s.value}</p>
                    <p className="text-[10px] text-gray-500">{s.label}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Platform Overview */}
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-sm font-semibold text-gray-700">Platform Overview</h2>
          <InfoTooltip text="View campaign status and total applications by platform: TikTok (Gen Z), Meta (all ages), Google (search), LinkedIn (professionals)" />
        </div>
        <div className="grid grid-cols-4 gap-3 mb-6">
          {PLATFORMS.map(p => {
            const platformCampaigns = campaigns.filter(c => c.platform === p.id);
            const active = platformCampaigns.filter(c => c.status === "ACTIVE").length;
            const apps = platformCampaigns.reduce((s, c) => s + c.applications, 0);
            return (
              <div key={p.id} className={`rounded-xl p-4 ${p.color}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{p.icon}</span>
                  <span className="text-xs opacity-75">{active} active</span>
                </div>
                <h3 className="font-bold">{p.name}</h3>
                <p className="text-xs opacity-75 mt-0.5">{p.desc}</p>
                <p className="text-lg font-bold mt-2">{apps} apps</p>
              </div>
            );
          })}
        </div>

        {/* Create Campaign */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Ad Campaigns ({campaigns.length})</h2>
          <button onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-1.5 bg-[#4B4C6A] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#3a3b54]">
            <Plus className="w-4 h-4" /> Create Campaign
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-xl border-2 border-[#4B4C6A]/20 p-6 mb-6">
            <h3 className="text-sm font-semibold mb-4">New Ad Campaign</h3>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Campaign Name *</label>
                <input value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#4B4C6A]"
                  placeholder="Q1 Agent Hiring Blitz" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Platform *</label>
                <select value={form.platform} onChange={e => setForm({...form, platform: e.target.value})}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2">
                  {PLATFORMS.map(p => <option key={p.id} value={p.id}>{p.icon} {p.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Role</label>
                <select value={form.roleTitle} onChange={e => setForm({...form, roleTitle: e.target.value})}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2">
                  <option value="">Select role...</option>
                  {roles.map(r => <option key={r.id} value={r.title}>{r.title}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Budget (MYR)</label>
                <input type="number" value={form.budget} onChange={e => setForm({...form, budget: e.target.value})}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Target Audience</label>
                <select value={form.targetAudience} onChange={e => setForm({...form, targetAudience: e.target.value})}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2">
                  {AUDIENCES.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Language</label>
                <select value={form.language} onChange={e => setForm({...form, language: e.target.value})}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2">
                  <option value="EN">English</option>
                  <option value="BM">Bahasa Malaysia</option>
                  <option value="ZH">中文 (Chinese)</option>
                </select>
              </div>
            </div>
            <div className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-medium text-gray-600">Ad Copy</label>
                <button onClick={generateAdCopy} className="text-xs text-[#4B4C6A] hover:underline font-medium">⚡ Auto-generate</button>
              </div>
              <textarea value={form.adCopy} onChange={e => setForm({...form, adCopy: e.target.value})}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 h-24 focus:outline-none focus:ring-1 focus:ring-[#4B4C6A]"
                placeholder="Click 'Auto-generate' or write your own ad copy..." />
            </div>
            <div className="flex gap-2">
              <button onClick={createCampaign} disabled={!form.name}
                className="bg-[#4B4C6A] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#3a3b54] disabled:opacity-50">Create Campaign</button>
              <button onClick={() => setShowForm(false)} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm">Cancel</button>
            </div>
          </div>
        )}

        {/* Campaigns List */}
        <div className="space-y-3">
          {campaigns.map(c => {
            const platform = PLATFORMS.find(p => p.id === c.platform);
            const ctr = c.impressions > 0 ? ((c.clicks / c.impressions) * 100).toFixed(2) : "0";
            const convRate = c.clicks > 0 ? ((c.applications / c.clicks) * 100).toFixed(1) : "0";
            const budgetPct = c.budget > 0 ? ((c.spent / c.budget) * 100).toFixed(0) : "0";

            return (
              <div key={c.id} className="bg-white rounded-xl border border-[#e6e6e5] p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{platform?.icon}</span>
                    <div>
                      <h3 className="font-medium text-gray-900">{c.name}</h3>
                      <p className="text-xs text-gray-400">{c.roleTitle} · {c.targetAudience} · {c.language}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      c.status === "ACTIVE" ? "bg-green-100 text-green-700" :
                      c.status === "PAUSED" ? "bg-amber-100 text-amber-700" :
                      "bg-gray-100 text-gray-600"
                    }`}>
                      {c.status === "ACTIVE" ? "● " : c.status === "PAUSED" ? "❚❚ " : ""}{c.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-6 gap-4 mb-3">
                  <div className="text-center">
                    <p className="text-lg font-bold">{c.impressions.toLocaleString()}</p>
                    <p className="text-[10px] text-gray-400">IMPRESSIONS</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold">{c.clicks.toLocaleString()}</p>
                    <p className="text-[10px] text-gray-400">CLICKS</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-green-600">{c.applications}</p>
                    <p className="text-[10px] text-gray-400">APPLICATIONS</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-blue-600">{ctr}%</p>
                    <p className="text-[10px] text-gray-400">CTR</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-purple-600">{convRate}%</p>
                    <p className="text-[10px] text-gray-400">CONV. RATE</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-amber-600">{c.spent.toLocaleString()}</p>
                    <p className="text-[10px] text-gray-400">SPENT / {c.budget.toLocaleString()}</p>
                    <div className="w-full h-1.5 bg-gray-200 rounded-full mt-1">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: `${budgetPct}%` }} />
                    </div>
                  </div>
                </div>

                {c.adCopy && (
                  <div className="bg-[#faf9f7] rounded-lg p-3 text-xs text-gray-600 whitespace-pre-wrap">{c.adCopy}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
