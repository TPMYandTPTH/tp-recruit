"use client";

import { useState } from "react";
import {
  TrendingUp,
  Linkedin,
  Eye,
  MousePointerClick,
  Zap,
  Calendar,
  Pause,
  Play,
  Play as PlayIcon,
  Grid3X3,
  BarChart3,
  Star,
  Users,
  AlertCircle,
  Facebook,
  Instagram,
  Heart,
  MessageCircle,
  Share2,
  ExternalLink,
  RefreshCw,
  Globe,
  ThumbsUp,
} from "lucide-react";
import Navbar from "@/components/ui/Navbar";
import InfoTooltip from "@/components/ui/InfoTooltip";

export default function MarketingDashboardPage() {
  const [campaigns, setCampaigns] = useState([
    {
      id: 1,
      name: "Join TP Malaysia",
      platforms: "Instagram + TikTok",
      status: "live",
      budget: 5000,
      spent: 3200,
      impressions: 45000,
      clicks: 1200,
      applications: 89,
    },
    {
      id: 2,
      name: "Mandarin Speakers Wanted",
      platforms: "Facebook + LinkedIn",
      status: "live",
      budget: 3000,
      spent: 1800,
      impressions: 28000,
      clicks: 890,
      applications: 45,
    },
    {
      id: 3,
      name: "Career Fair KL 2026",
      platforms: "All platforms",
      status: "scheduled",
      budget: 8000,
      spent: 0,
      startDate: "April 5, 2026",
      target: "500 walk-in registrations",
    },
    {
      id: 4,
      name: "Japanese Speakers",
      platforms: "LinkedIn only",
      status: "paused",
      budget: 2000,
      spent: 2000,
      impressions: 12000,
      clicks: 180,
      applications: 8,
      note: "Paused — reviewing targeting",
    },
  ]);

  const [toast, setToast] = useState<{ message: string } | null>(null);

  const showToast = (message: string) => {
    setToast({ message });
    setTimeout(() => setToast(null), 3000);
  };

  const metrics = [
    {
      label: "Glassdoor Rating",
      value: "4.2/5",
      change: "+0.1 this quarter",
      icon: Star,
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      label: "LinkedIn Followers",
      value: "12,400",
      change: "+340 this month",
      icon: Linkedin,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Career Page Views",
      value: "8,250",
      change: "+15% this month",
      icon: Eye,
      color: "bg-purple-100 text-purple-600",
    },
    {
      label: "Application Conversion",
      value: "23%",
      change: "from page view to apply",
      icon: MousePointerClick,
      color: "bg-green-100 text-green-600",
    },
  ];

  const contentCalendar = [
    { day: "Mon", title: "Employee spotlight video — Wei Jun's story", platform: "Instagram", status: "published" },
    { day: "Tue", title: "Behind the scenes: Training day", platform: "TikTok", status: "scheduled" },
    { day: "Wed", title: "Job alert: Korean speakers needed", platform: "LinkedIn", status: "draft" },
    { day: "Thu", title: "Culture post: Team lunch at TP KL", platform: "Facebook + Instagram", status: "scheduled" },
    { day: "Fri", title: "Career tips: Acing your BPO interview", platform: "Blog + LinkedIn", status: "published" },
  ];

  const contentLibrary = [
    { name: "Life at TP", description: "video series", count: "12 videos", total: "45K views" },
    { name: "Employee testimonials", description: "posts", count: "8 posts", total: "2.3K engagements" },
    { name: "Job alert templates", description: "templates", count: "15 templates" },
    { name: "Social media kit", description: "assets", count: "Logos, banners, stories" },
    { name: "Career fair materials", description: "printed", count: "Standees, flyers, QR codes" },
    { name: "Email templates", description: "campaigns", count: "Welcome, nurture, re-engage" },
  ];

  // ─── Social Media Data ────────────────────────────────────────
  const socialPlatforms = [
    {
      name: "LinkedIn",
      icon: Linkedin,
      color: "bg-[#0A66C2]",
      lightColor: "bg-blue-50",
      textColor: "text-[#0A66C2]",
      handle: "@teleperformance-malaysia",
      url: "https://www.linkedin.com/company/teleperformance-malaysia/",
      followers: "14,872",
      followersChange: "+412 this month",
      posts: 24,
      engagement: "3.8%",
      latestPosts: [
        {
          title: "We're hiring Mandarin-speaking CSRs! Join our growing team in KL.",
          date: "Mar 24, 2026",
          likes: 142,
          comments: 28,
          shares: 45,
          type: "Job Post",
        },
        {
          title: "Proud to be certified as a Great Place to Work® in Malaysia for 2026!",
          date: "Mar 20, 2026",
          likes: 389,
          comments: 52,
          shares: 118,
          type: "Company News",
        },
        {
          title: "Meet Wei Jun — from fresh grad to Team Lead in 18 months. #LifeAtTP",
          date: "Mar 17, 2026",
          likes: 256,
          comments: 41,
          shares: 67,
          type: "Employee Story",
        },
      ],
    },
    {
      name: "Facebook",
      icon: Facebook,
      color: "bg-[#1877F2]",
      lightColor: "bg-blue-50",
      textColor: "text-[#1877F2]",
      handle: "Teleperformance Malaysia",
      url: "https://www.facebook.com/TeleperformanceMalaysia/",
      followers: "8,340",
      followersChange: "+186 this month",
      posts: 31,
      engagement: "4.2%",
      latestPosts: [
        {
          title: "🎉 Walk-in interview this Saturday! Bring your resume to TP KL office. Multiple positions available.",
          date: "Mar 25, 2026",
          likes: 87,
          comments: 34,
          shares: 62,
          type: "Event",
        },
        {
          title: "Working at TP means working with amazing people from 15+ nationalities 🌏",
          date: "Mar 22, 2026",
          likes: 214,
          comments: 19,
          shares: 31,
          type: "Culture",
        },
        {
          title: "New training center opening in Cyberjaya! 200 new positions available.",
          date: "Mar 18, 2026",
          likes: 156,
          comments: 67,
          shares: 89,
          type: "Announcement",
        },
      ],
    },
    {
      name: "Instagram",
      icon: Instagram,
      color: "bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF]",
      lightColor: "bg-pink-50",
      textColor: "text-[#DD2A7B]",
      handle: "@tp_malaysia",
      url: "https://www.instagram.com/tp_malaysia/",
      followers: "5,210",
      followersChange: "+294 this month",
      posts: 18,
      engagement: "5.1%",
      latestPosts: [
        {
          title: "Day in the life of a CSR at TP Malaysia 📱✨ #BPOLife #TPMalaysia",
          date: "Mar 24, 2026",
          likes: 342,
          comments: 28,
          shares: 15,
          type: "Reel",
        },
        {
          title: "Team building day! 🎯 Nothing beats working with great people #LifeAtTP",
          date: "Mar 21, 2026",
          likes: 278,
          comments: 19,
          shares: 8,
          type: "Carousel",
        },
        {
          title: "From our Hari Raya celebration at the office 🌙 #TPFamily",
          date: "Mar 15, 2026",
          likes: 412,
          comments: 35,
          shares: 22,
          type: "Photo",
        },
      ],
    },
  ];

  const [socialRefreshing, setSocialRefreshing] = useState(false);
  const [expandedPlatform, setExpandedPlatform] = useState<string | null>(null);

  const refreshSocial = () => {
    setSocialRefreshing(true);
    setTimeout(() => {
      setSocialRefreshing(false);
      showToast("Social media data refreshed");
    }, 1500);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "live":
        return "bg-green-100 text-green-700";
      case "scheduled":
        return "bg-blue-100 text-blue-700";
      case "paused":
        return "bg-amber-100 text-amber-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getContentStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-700";
      case "scheduled":
        return "bg-blue-100 text-blue-700";
      case "draft":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const calculateCPA = (spent: number, applications: number) => {
    return (spent / applications).toFixed(0);
  };

  const calculateCTR = (clicks: number, impressions: number) => {
    return ((clicks / impressions) * 100).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-[#f8f7f5] lg:pl-[240px]">
      <Navbar />

      {/* Header */}
      <header className="bg-gradient-to-r from-[#4B4C6A] to-[#5A5B7B] text-white border-b border-gray-200 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold">Recruitment Marketing</h1>
            <InfoTooltip text="Employer branding, campaigns, and content performance tracking" />
          </div>
          <p className="text-white/80 mt-2">Employer branding, campaigns, and content performance</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Brand Health Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <div
                key={metric.label}
                className="bg-white rounded-xl border border-[#E6E6E5] p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${metric.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-xs text-[#848DAD] uppercase font-semibold">{metric.label}</p>
                <p className="text-2xl font-bold text-[#414141] mt-1">{metric.value}</p>
                <p className="text-xs text-[#676767] mt-2">{metric.change}</p>
              </div>
            );
          })}
        </div>

        {/* Active Campaigns */}
        <div className="bg-white rounded-xl border border-[#E6E6E5] overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-[#E6E6E5] bg-[#ECE9E7]">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#4B4C6A]" />
              <h2 className="text-lg font-semibold text-[#414141]">Active Campaigns</h2>
              <InfoTooltip text="Current and upcoming recruitment marketing campaigns with performance metrics" />
            </div>
          </div>

          <div className="divide-y divide-[#E6E6E5]">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="p-6 hover:bg-[#f8f7f5] transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-[#414141] text-lg">{campaign.name}</h3>
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium uppercase ${getStatusBadge(
                          campaign.status
                        )}`}
                      >
                        {campaign.status}
                      </span>
                    </div>
                    <p className="text-sm text-[#676767]">{campaign.platforms}</p>
                  </div>
                  <button onClick={() => {
                    setCampaigns(prev => prev.map(c => c.id === campaign.id ? { ...c, status: c.status === "live" ? "paused" : "live" } : c));
                    showToast(campaign.status === "live" ? `Campaign "${campaign.name}" paused` : `Campaign "${campaign.name}" resumed`);
                  }} className="p-2 hover:bg-[#ECE9E7] rounded-lg text-[#4B4C6A]">
                    {campaign.status === "live" ? (
                      <Pause className="w-5 h-5" />
                    ) : (
                      <PlayIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {campaign.status === "scheduled" ? (
                  <div className="grid grid-cols-2 gap-4 p-4 bg-[#ECE9E7] rounded-lg">
                    <div>
                      <p className="text-xs text-[#848DAD] uppercase font-semibold">Start Date</p>
                      <p className="text-sm font-medium text-[#414141] mt-1">{campaign.startDate}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#848DAD] uppercase font-semibold">Target</p>
                      <p className="text-sm font-medium text-[#414141] mt-1">{campaign.target}</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-[#676767]">Budget Spent</span>
                        <span className="text-sm font-medium text-[#4B4C6A]">
                          RM {campaign.spent.toLocaleString()} / RM {campaign.budget.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-[#ECE9E7] rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-[#4B4C6A] to-[#5A5B7B] h-2 rounded-full"
                          style={{ width: `${(campaign.spent / campaign.budget) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="p-3 bg-[#ECE9E7] rounded-lg">
                        <p className="text-xs text-[#848DAD] uppercase font-semibold">Impressions</p>
                        <p className="text-lg font-bold text-[#414141] mt-1">{campaign.impressions.toLocaleString()}</p>
                      </div>
                      <div className="p-3 bg-[#ECE9E7] rounded-lg">
                        <p className="text-xs text-[#848DAD] uppercase font-semibold">Clicks</p>
                        <p className="text-lg font-bold text-[#414141] mt-1">{campaign.clicks.toLocaleString()}</p>
                      </div>
                      <div className="p-3 bg-[#ECE9E7] rounded-lg">
                        <p className="text-xs text-[#848DAD] uppercase font-semibold">CTR</p>
                        <p className="text-lg font-bold text-[#4B4C6A] mt-1">
                          {calculateCTR(campaign.clicks, campaign.impressions)}%
                        </p>
                      </div>
                      <div className="p-3 bg-[#ECE9E7] rounded-lg">
                        <p className="text-xs text-[#848DAD] uppercase font-semibold">Applications</p>
                        <p className="text-lg font-bold text-[#414141] mt-1">{campaign.applications}</p>
                      </div>
                    </div>

                    <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-xs text-blue-700 font-semibold">
                        Cost per application: RM {calculateCPA(campaign.spent, campaign.applications)}
                      </p>
                    </div>

                    {campaign.note && (
                      <div className="mt-3 p-3 bg-amber-50 rounded-lg border border-amber-200 flex gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-amber-700">{campaign.note}</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ─── Social Media Dashboard ─── */}
        <div className="bg-white rounded-xl border border-[#E6E6E5] overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-[#E6E6E5] bg-[#ECE9E7] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-[#4B4C6A]" />
              <h2 className="text-lg font-semibold text-[#414141]">Social Media Dashboard</h2>
              <InfoTooltip text="Live overview of TP Malaysia social media presence across LinkedIn, Facebook, and Instagram" />
            </div>
            <button
              onClick={refreshSocial}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#4B4C6A] hover:bg-white rounded-lg transition-colors ${socialRefreshing ? "opacity-50" : ""}`}
            >
              <RefreshCw size={13} className={socialRefreshing ? "animate-spin" : ""} />
              {socialRefreshing ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          {/* Platform Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-[#E6E6E5]">
            {socialPlatforms.map((platform) => {
              const Icon = platform.icon;
              const isExpanded = expandedPlatform === platform.name;
              return (
                <div key={platform.name} className="p-5">
                  {/* Platform Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl ${platform.color} flex items-center justify-center`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-[#414141] text-sm">{platform.name}</p>
                        <p className="text-[11px] text-[#848DAD]">{platform.handle}</p>
                      </div>
                    </div>
                    <a
                      href={platform.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => { e.preventDefault(); window.open(platform.url, "_blank"); }}
                      className="p-1.5 hover:bg-[#ECE9E7] rounded-lg text-[#848DAD] hover:text-[#4B4C6A]"
                      title={`Open ${platform.name}`}
                    >
                      <ExternalLink size={14} />
                    </a>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div>
                      <p className="text-[10px] text-[#848DAD] uppercase font-semibold">Followers</p>
                      <p className="text-xl font-bold text-[#414141]">{platform.followers}</p>
                      <p className="text-[10px] text-green-600 font-medium">{platform.followersChange}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-[#848DAD] uppercase font-semibold">Posts</p>
                      <p className="text-xl font-bold text-[#414141]">{platform.posts}</p>
                      <p className="text-[10px] text-[#676767]">this month</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-[#848DAD] uppercase font-semibold">Engagement</p>
                      <p className="text-xl font-bold text-[#FF0082]">{platform.engagement}</p>
                      <p className="text-[10px] text-[#676767]">avg rate</p>
                    </div>
                  </div>

                  {/* Toggle latest posts */}
                  <button
                    onClick={() => setExpandedPlatform(isExpanded ? null : platform.name)}
                    className="w-full py-2 text-xs font-medium text-[#4B4C6A] hover:bg-[#ECE9E7] rounded-lg transition-colors flex items-center justify-center gap-1"
                  >
                    {isExpanded ? "Hide" : "Show"} Latest Posts
                  </button>

                  {/* Latest Posts (Expanded) */}
                  {isExpanded && (
                    <div className="mt-3 space-y-3">
                      {platform.latestPosts.map((post, idx) => (
                        <div key={idx} className="bg-[#f8f7f5] rounded-lg p-3">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <p className="text-xs text-[#414141] leading-relaxed flex-1">{post.title}</p>
                            <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${platform.lightColor} ${platform.textColor}`}>
                              {post.type}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-[10px] text-[#848DAD]">{post.date}</p>
                            <div className="flex items-center gap-3 text-[10px] text-[#676767]">
                              <span className="flex items-center gap-1"><Heart size={10} className="text-red-400" /> {post.likes}</span>
                              <span className="flex items-center gap-1"><MessageCircle size={10} /> {post.comments}</span>
                              <span className="flex items-center gap-1"><Share2 size={10} /> {post.shares}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Total Social Stats Bar */}
          <div className="px-6 py-3 bg-[#f8f7f5] border-t border-[#E6E6E5] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-6 text-xs">
              <span className="text-[#676767]">Total Followers: <strong className="text-[#4B4C6A]">28,422</strong></span>
              <span className="text-[#676767]">Monthly Growth: <strong className="text-green-600">+892</strong></span>
              <span className="text-[#676767]">Total Posts This Month: <strong className="text-[#4B4C6A]">73</strong></span>
              <span className="text-[#676767]">Avg Engagement: <strong className="text-[#FF0082]">4.4%</strong></span>
            </div>
            <p className="text-[10px] text-[#848DAD]">Last updated: {new Date().toLocaleString("en-MY", { dateStyle: "medium", timeStyle: "short" })}</p>
          </div>
        </div>

        {/* Two-column layout: Content Calendar & Library */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Content Calendar */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-[#E6E6E5] overflow-hidden">
              <div className="px-6 py-4 border-b border-[#E6E6E5] bg-[#ECE9E7]">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#4B4C6A]" />
                  <h2 className="text-lg font-semibold text-[#414141]">Content Calendar</h2>
                  <InfoTooltip text="Scheduled content across all recruitment marketing channels" />
                </div>
              </div>

              <div className="divide-y divide-[#E6E6E5]">
                {contentCalendar.map((item, idx) => (
                  <div key={idx} className="p-5 flex items-start gap-4 hover:bg-[#f8f7f5] transition-colors">
                    <div className="flex-shrink-0">
                      <p className="text-sm font-bold text-[#4B4C6A] bg-[#ECE9E7] px-3 py-1.5 rounded-lg w-12 text-center">
                        {item.day}
                      </p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[#414141]">{item.title}</p>
                      <p className="text-sm text-[#676767] mt-1">{item.platform}</p>
                    </div>
                    <span
                      className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 ${getContentStatusBadge(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Content Library */}
          <div className="bg-white rounded-xl border border-[#E6E6E5] overflow-hidden">
            <div className="px-6 py-4 border-b border-[#E6E6E5] bg-[#ECE9E7]">
              <div className="flex items-center gap-2">
                <Grid3X3 className="w-5 h-5 text-[#4B4C6A]" />
                <h2 className="text-lg font-semibold text-[#414141]">Content Library</h2>
              </div>
            </div>

            <div className="divide-y divide-[#E6E6E5]">
              {contentLibrary.map((item, idx) => (
                <div key={idx} className="p-4 hover:bg-[#f8f7f5] transition-colors">
                  <div className="mb-2">
                    <p className="font-medium text-[#414141]">{item.name}</p>
                    <p className="text-xs text-[#848DAD] mt-0.5">{item.description}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-[#4B4C6A]">{item.count}</p>
                    {item.total && <p className="text-xs text-[#676767]">{item.total}</p>}
                  </div>
                  <button onClick={() => showToast(`Opening ${item.name} library...`)} className="mt-2 w-full py-1.5 px-3 text-xs font-medium text-[#FF0082] hover:bg-[#ECE9E7] rounded-lg transition-colors">
                    View
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg bg-[#4B4C6A] text-white text-sm font-medium">
          {toast.message}
        </div>
      )}
    </div>
  );
}
