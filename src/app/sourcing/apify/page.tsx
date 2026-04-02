"use client";

import { useState } from "react";
import {
  Zap, Play, Pause, AlertCircle, CheckCircle2, Loader2, Bookmark,
  Plus, X, Settings, BarChart3, TrendingUp, Award, Brain, Clock,
  MapPin, Tag, Briefcase, Rss
} from "lucide-react";
import Navbar from "@/components/ui/Navbar";
import InfoTooltip from "@/components/ui/InfoTooltip";

interface ScraperJob {
  id: string;
  name: string;
  actor: string;
  status: "completed" | "running" | "queued" | "rate-limited";
  profilesFound: number;
  matchedCriteria?: number;
  matchPercentage?: number;
  cost: number;
  progress?: number;
  startedAt?: string;
  estimatedProfiles?: number;
  lastRun?: string;
  retryIn?: string;
}

interface Candidate {
  id: string;
  source: string;
  name: string;
  currentRole: string;
  experience: string;
  skills: string[];
  matchScore: number;
  saved?: boolean;
}

const DEMO_SCRAPERS: ScraperJob[] = [
  {
    id: "linkedin-1",
    name: "LinkedIn Profile Scraper",
    actor: "apify/linkedin-profile-scraper",
    status: "completed",
    profilesFound: 234,
    matchedCriteria: 67,
    matchPercentage: 29,
    cost: 2.40,
    progress: 100,
    lastRun: "2 hours ago",
  },
  {
    id: "jobstreet-1",
    name: "JobStreet Resume Search",
    actor: "custom/jobstreet-scraper",
    status: "running",
    profilesFound: 89,
    cost: 0.80,
    progress: 68,
    startedAt: "15 min ago",
    estimatedProfiles: 230,
  },
  {
    id: "indeed-1",
    name: "Indeed Candidate Finder",
    actor: "custom/indeed-my-scraper",
    status: "queued",
    profilesFound: 0,
    estimatedProfiles: 150,
    cost: 0.00,
  },
  {
    id: "facebook-1",
    name: "Facebook Groups Scanner",
    actor: "custom/facebook-groups",
    status: "rate-limited",
    profilesFound: 45,
    cost: 0.60,
    lastRun: "Yesterday",
    retryIn: "4 hours",
  },
];

const DEMO_CANDIDATES: Candidate[] = [
  {
    id: "c1",
    source: "LinkedIn",
    name: "Chen Wei Ming",
    currentRole: "CSR at TDCX",
    experience: "3 years",
    skills: ["Mandarin", "English", "CRM"],
    matchScore: 94,
  },
  {
    id: "c2",
    source: "JobStreet",
    name: "Lim Sook Yee",
    currentRole: "Call Center Agent at Concentrix",
    experience: "2 years",
    skills: ["Mandarin", "Cantonese"],
    matchScore: 88,
  },
  {
    id: "c3",
    source: "LinkedIn",
    name: "Watanabe Yuki",
    currentRole: "Support Agent (freelance)",
    experience: "1 year",
    skills: ["Japanese", "English"],
    matchScore: 85,
  },
  {
    id: "c4",
    source: "Indeed",
    name: "Raj Kumar",
    currentRole: "Customer Support at Grab",
    experience: "4 years",
    skills: ["English", "BM", "Hindi"],
    matchScore: 82,
  },
  {
    id: "c5",
    source: "LinkedIn",
    name: "Park Soo Jin",
    currentRole: "Student (graduating May)",
    experience: "Intern",
    skills: ["Korean", "English"],
    matchScore: 78,
  },
  {
    id: "c6",
    source: "JobStreet",
    name: "Nurul Fatihah",
    currentRole: "Retail Sales at Uniqlo",
    experience: "1 year",
    skills: ["BM", "English"],
    matchScore: 75,
  },
  {
    id: "c7",
    source: "Facebook",
    name: "Ahmad Faisal",
    currentRole: "BPO Agent at Webhelp",
    experience: "2 years",
    skills: ["BM", "English"],
    matchScore: 72,
  },
  {
    id: "c8",
    source: "Indeed",
    name: "Tanaka Emi",
    currentRole: "Freelance translator",
    experience: "3 years",
    skills: ["Japanese", "English", "Malay"],
    matchScore: 91,
  },
];

export default function ApifySourcePage() {
  const [scrapers, setScrapers] = useState<ScraperJob[]>(DEMO_SCRAPERS);
  const [candidates, setCandidates] = useState<Candidate[]>(DEMO_CANDIDATES);
  const [showConfig, setShowConfig] = useState(false);

  const [config, setConfig] = useState({
    targetRole: "CSR (Mandarin)",
    location: "Kuala Lumpur, Malaysia",
    platforms: {
      linkedin: true,
      jobstreet: true,
      indeed: true,
      glassdoor: false,
      github: false,
      facebook: false,
    },
    keywords: ["customer service", "BPO", "call center", "mandarin speaker"],
    minExperience: "1 year",
  });

  const [newKeyword, setNewKeyword] = useState("");

  const handleAddKeyword = () => {
    if (newKeyword.trim() && !config.keywords.includes(newKeyword.trim())) {
      setConfig({
        ...config,
        keywords: [...config.keywords, newKeyword.trim()],
      });
      setNewKeyword("");
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setConfig({
      ...config,
      keywords: config.keywords.filter(k => k !== keyword),
    });
  };

  const togglePlatform = (platform: keyof typeof config.platforms) => {
    setConfig({
      ...config,
      platforms: {
        ...config.platforms,
        [platform]: !config.platforms[platform],
      },
    });
  };

  const toggleSaveCandidate = (candidateId: string) => {
    setCandidates(
      candidates.map(c =>
        c.id === candidateId ? { ...c, saved: !c.saved } : c
      )
    );
  };

  const addToPipeline = (candidateId: string) => {
    alert(`Candidate "${candidates.find(c => c.id === candidateId)?.name}" added to pipeline!`);
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 bg-green-50";
    if (score >= 70) return "text-amber-600 bg-amber-50";
    return "text-red-600 bg-red-50";
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return {
          icon: CheckCircle2,
          text: "✅ Completed",
          bgColor: "bg-green-50",
          textColor: "text-green-700",
        };
      case "running":
        return {
          icon: Loader2,
          text: "🔄 Running",
          bgColor: "bg-blue-50",
          textColor: "text-blue-700",
        };
      case "queued":
        return {
          icon: Clock,
          text: "⏳ Queued",
          bgColor: "bg-gray-50",
          textColor: "text-gray-700",
        };
      case "rate-limited":
        return {
          icon: AlertCircle,
          text: "⚠️ Rate Limited",
          bgColor: "bg-amber-50",
          textColor: "text-amber-700",
        };
      default:
        return {
          icon: Clock,
          text: "Unknown",
          bgColor: "bg-gray-50",
          textColor: "text-gray-700",
        };
    }
  };

  const activePlatforms = Object.values(config.platforms).filter(Boolean).length;
  const totalCreditsUsed = scrapers.reduce((sum, s) => sum + s.cost, 0);
  const totalProfilesFound = scrapers.reduce((sum, s) => sum + s.profilesFound, 0);
  const totalMatched = scrapers.reduce(
    (sum, s) => sum + (s.matchedCriteria || 0),
    0
  );

  return (
    <div className="min-h-screen bg-[#f8f7f5] lg:pl-[240px]">
      <Navbar />

      {/* Header */}
      <div className="bg-[#4B4C6A] text-white px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Brain className="w-6 h-6" />
                <h1 className="text-2xl font-bold">AI Sourcing Engine</h1>
              </div>
              <p className="text-sm text-white/80">
                Powered by Apify — automated candidate discovery from across the web
              </p>
            </div>
            <button
              onClick={() => setShowConfig(!showConfig)}
              className="flex items-center gap-2 bg-[#FF0082] hover:bg-[#E60075] text-white px-4 py-2 rounded-lg font-medium transition"
            >
              <Settings className="w-4 h-4" />
              Configure Scraper
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Configuration Panel */}
        {showConfig && (
          <div className="bg-white rounded-xl border-2 border-[#4B4C6A]/20 p-6 space-y-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-gray-900">
                  Scraper Configuration
                </h2>
                <InfoTooltip text="Configure target role, platforms, location, keywords, and minimum experience level for candidate sourcing" />
              </div>
              <button
                onClick={() => setShowConfig(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Target Role */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">
                  Target Role
                </label>
                <select
                  value={config.targetRole}
                  onChange={(e) =>
                    setConfig({ ...config, targetRole: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm border border-[#E6E6E5] rounded-lg focus:ring-2 focus:ring-[#4B4C6A] focus:border-transparent"
                >
                  <option>CSR (Mandarin)</option>
                  <option>CSR (Japanese)</option>
                  <option>Sales Agent (BM)</option>
                  <option>Tech Support (EN)</option>
                  <option>CSR (Korean)</option>
                </select>
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={config.location}
                  onChange={(e) =>
                    setConfig({ ...config, location: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm border border-[#E6E6E5] rounded-lg focus:ring-2 focus:ring-[#4B4C6A] focus:border-transparent"
                  placeholder="City, Country"
                />
              </div>

              {/* Min Experience */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">
                  Min Experience
                </label>
                <select
                  value={config.minExperience}
                  onChange={(e) =>
                    setConfig({ ...config, minExperience: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm border border-[#E6E6E5] rounded-lg focus:ring-2 focus:ring-[#4B4C6A] focus:border-transparent"
                >
                  <option>Any</option>
                  <option>1 year</option>
                  <option>2 years</option>
                  <option>3+ years</option>
                </select>
              </div>
            </div>

            {/* Platforms */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-3">
                Source Platforms ({activePlatforms} selected)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                  { key: "linkedin", label: "LinkedIn", icon: "🔵" },
                  { key: "jobstreet", label: "JobStreet", icon: "🟠" },
                  { key: "indeed", label: "Indeed", icon: "🟣" },
                  { key: "glassdoor", label: "Glassdoor", icon: "🟢" },
                  { key: "github", label: "GitHub", icon: "⚫" },
                  { key: "facebook", label: "Facebook Groups", icon: "📘" },
                ].map(({ key, label, icon }) => (
                  <button
                    key={key}
                    onClick={() =>
                      togglePlatform(key as keyof typeof config.platforms)
                    }
                    className={`p-3 rounded-lg border-2 text-center transition ${
                      config.platforms[key as keyof typeof config.platforms]
                        ? "border-[#4B4C6A] bg-[#4B4C6A]/5"
                        : "border-[#E6E6E5] hover:border-[#C2C7CD]"
                    }`}
                  >
                    <div className="text-xl mb-1">{icon}</div>
                    <p className="text-xs font-medium text-gray-700">{label}</p>
                    {config.platforms[
                      key as keyof typeof config.platforms
                    ] && (
                      <CheckCircle2 className="w-3 h-3 text-[#4B4C6A] mx-auto mt-1" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Keywords */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">
                Keywords
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddKeyword()}
                  className="flex-1 px-3 py-2 text-sm border border-[#E6E6E5] rounded-lg focus:ring-2 focus:ring-[#4B4C6A] focus:border-transparent"
                  placeholder="Add keyword and press Enter..."
                />
                <button
                  onClick={handleAddKeyword}
                  className="px-3 py-2 bg-[#4B4C6A] text-white rounded-lg hover:bg-[#3a3b54] transition"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {config.keywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="inline-flex items-center gap-2 bg-[#4B4C6A] text-white px-3 py-1 rounded-full text-xs"
                  >
                    {keyword}
                    <button
                      onClick={() => handleRemoveKeyword(keyword)}
                      className="hover:opacity-70"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-4 border-t border-[#E6E6E5] flex gap-3">
              <button className="flex items-center gap-2 bg-[#FF0082] hover:bg-[#E60075] text-white px-6 py-2.5 rounded-lg font-medium transition">
                <Zap className="w-4 h-4" />
                Run Scraper
              </button>
              <button
                onClick={() => setShowConfig(false)}
                className="px-6 py-2.5 bg-white text-gray-700 border border-[#E6E6E5] rounded-lg hover:bg-gray-50 transition font-medium text-sm"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "Credits Balance",
              value: "4,500 / 10,000",
              icon: Award,
              color: "text-purple-600",
              detail: "Monthly usage: 5,500",
            },
            {
              label: "Profiles Found",
              value: totalProfilesFound.toString(),
              icon: Users,
              color: "text-blue-600",
              detail: `Matched: ${totalMatched}`,
            },
            {
              label: "Added to Pipeline",
              value: "89",
              icon: TrendingUp,
              color: "text-green-600",
              detail: "Cost per lead: $0.12",
            },
            {
              label: "Active Scrapers",
              value: scrapers.filter((s) => s.status === "running").length.toString(),
              icon: Rss,
              color: "text-orange-600",
              detail: `Total cost: $${totalCreditsUsed.toFixed(2)}`,
            },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={i}
                className="bg-white rounded-xl border border-[#E6E6E5] p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-xs text-[#848DAD] font-medium mb-1">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <p className="text-xs text-gray-500">{stat.detail}</p>
              </div>
            );
          })}
        </div>

        {/* Active Scrapers Status */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-base font-bold text-gray-900">
              Active Scrapers
            </h2>
            <InfoTooltip text="Real-time status of all configured Apify actors. Shows progress, profiles found, and estimated cost for each scraper job" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {scrapers.map((scraper) => {
              const badge = getStatusBadge(scraper.status);
              const BadgeIcon = badge.icon;

              return (
                <div
                  key={scraper.id}
                  className="bg-white rounded-xl border border-[#E6E6E5] p-5"
                >
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900">
                          {scraper.name}
                        </h3>
                        <p className="text-[10px] text-gray-500 mt-0.5">
                          {scraper.actor}
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${badge.bgColor} ${badge.textColor}`}
                      >
                        {scraper.status === "running" && (
                          <BadgeIcon className="w-3 h-3 animate-spin" />
                        )}
                        {scraper.status !== "running" && (
                          <BadgeIcon className="w-3 h-3" />
                        )}
                        {badge.text}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    {(scraper.status === "completed" ||
                      scraper.status === "running") && (
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-600">
                            Progress
                          </span>
                          <span className="text-xs font-semibold text-gray-900">
                            {scraper.progress}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-[#4B4C6A] h-2 rounded-full transition-all"
                            style={{ width: `${scraper.progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#E6E6E5]">
                      <div>
                        <p className="text-xs text-gray-500">
                          {scraper.status === "running"
                            ? "Found"
                            : scraper.status === "completed"
                              ? "Profiles Found"
                              : "Est. Profiles"}
                        </p>
                        <p className="text-sm font-bold text-gray-900">
                          {scraper.profilesFound || scraper.estimatedProfiles}
                          {scraper.status === "running" && (
                            <span className="text-gray-500 font-normal">
                              /{scraper.estimatedProfiles}
                            </span>
                          )}
                        </p>
                      </div>
                      {scraper.matchedCriteria !== undefined && (
                        <div>
                          <p className="text-xs text-gray-500">
                            Matched Criteria
                          </p>
                          <p className="text-sm font-bold text-green-600">
                            {scraper.matchedCriteria} (
                            {scraper.matchPercentage}%)
                          </p>
                        </div>
                      )}
                      <div>
                        <p className="text-xs text-gray-500">Cost</p>
                        <p className="text-sm font-bold text-gray-900">
                          ${scraper.cost.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">
                          {scraper.status === "running"
                            ? "Started"
                            : scraper.status === "completed"
                              ? "Last Run"
                              : scraper.status === "rate-limited"
                                ? "Retry In"
                                : "Status"}
                        </p>
                        <p className="text-sm font-bold text-gray-900">
                          {scraper.startedAt ||
                            scraper.lastRun ||
                            scraper.retryIn ||
                            "—"}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    {scraper.status === "running" && (
                      <div className="flex gap-2 pt-2">
                        <button className="flex-1 flex items-center justify-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-medium transition">
                          <Pause className="w-3 h-3" />
                          Pause
                        </button>
                      </div>
                    )}
                    {scraper.status === "rate-limited" && (
                      <div className="flex gap-2 pt-2">
                        <button className="flex-1 flex items-center justify-center gap-1 bg-amber-100 hover:bg-amber-200 text-amber-700 px-3 py-1.5 rounded-lg text-xs font-medium transition">
                          <Play className="w-3 h-3" />
                          Retry Now
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Discovered Candidates Table */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-base font-bold text-gray-900">
              Discovered Candidates
            </h2>
            <InfoTooltip text="Candidates discovered and matched by Apify scrapers. Match score shows how well they fit the target role criteria" />
          </div>
          <div className="bg-white rounded-xl border border-[#E6E6E5] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#ECE9E7] border-b border-[#E6E6E5]">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 w-24">
                      Source
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 w-40">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                      Current Role
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 w-24">
                      Experience
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 w-56">
                      Skills
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 w-24">
                      Match Score
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 w-40">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E6E6E5]">
                  {candidates.map((candidate) => (
                    <tr
                      key={candidate.id}
                      className="hover:bg-[#f8f7f5] transition"
                    >
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                          {candidate.source}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {candidate.name}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {candidate.currentRole}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {candidate.experience}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1 flex-wrap">
                          {candidate.skills.map((skill) => (
                            <span
                              key={skill}
                              className="inline-flex items-center px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] border border-blue-200"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className={`inline-flex items-center justify-center px-3 py-1 rounded-lg font-semibold text-sm ${getMatchScoreColor(candidate.matchScore)}`}>
                          {candidate.matchScore}%
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => addToPipeline(candidate.id)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 border border-green-200 rounded-lg hover:bg-green-100 transition text-xs font-medium"
                          >
                            <Plus className="w-3 h-3" />
                            Add
                          </button>
                          <button
                            onClick={() => toggleSaveCandidate(candidate.id)}
                            className={`p-1.5 rounded-lg transition ${
                              candidate.saved
                                ? "bg-amber-100 text-amber-600"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                          >
                            <Bookmark
                              className="w-4 h-4"
                              fill={candidate.saved ? "currentColor" : "none"}
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
