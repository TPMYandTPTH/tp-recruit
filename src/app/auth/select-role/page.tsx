"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Crown, UserCheck, Search, Megaphone, Heart, ClipboardCheck, ShieldCheck,
  LayoutDashboard, Briefcase, FileText, Monitor, QrCode, CalendarCheck,
  Bot, TrendingUp, PenTool, LogOut, Shield
} from "lucide-react";

interface StaffUser {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
}

interface QuickLink {
  href: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  accentColor: string;
}

const ROLE_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode; quickLinks: QuickLink[] }> = {
  HOD: {
    label: "Head of Department",
    color: "#FF0082",
    icon: <Crown size={28} />,
    quickLinks: [
      { href: "/hod", label: "Approvals Dashboard", description: "Approve offers, headcount & budgets", icon: <Crown size={22} />, accentColor: "#FF0082" },
      { href: "/dashboard", label: "Recruitment Dashboard", description: "Pipeline overview & KPIs", icon: <LayoutDashboard size={22} />, accentColor: "#4B4C6A" },
      { href: "/recruiter", label: "Recruiter View", description: "Track candidates & pipeline", icon: <UserCheck size={22} />, accentColor: "#4B4C6A" },
      { href: "/ta-monitor", label: "TA Monitor", description: "Talent acquisition metrics", icon: <Monitor size={22} />, accentColor: "#3047B0" },
      { href: "/interview/ops", label: "Interview Scorecard", description: "Live interview scoring", icon: <CalendarCheck size={22} />, accentColor: "#780096" },
    ],
  },
  RECRUITER: {
    label: "Recruiter",
    color: "#4B4C6A",
    icon: <UserCheck size={28} />,
    quickLinks: [
      { href: "/recruiter", label: "My Pipeline", description: "Track candidates & follow-ups", icon: <UserCheck size={22} />, accentColor: "#4B4C6A" },
      { href: "/dashboard", label: "Dashboard", description: "Pipeline overview & KPIs", icon: <LayoutDashboard size={22} />, accentColor: "#4B4C6A" },
      { href: "/sourcing", label: "Sourcing Hub", description: "All sourcing channels", icon: <Search size={22} />, accentColor: "#3047B0" },
      { href: "/interview/ops", label: "Interview Scorecard", description: "Score & evaluate candidates", icon: <CalendarCheck size={22} />, accentColor: "#780096" },
      { href: "/sourcing/job-posts", label: "Job Posts", description: "Create & manage listings", icon: <Briefcase size={22} />, accentColor: "#3047B0" },
      { href: "/ta-monitor", label: "TA Monitor", description: "Recruitment analytics", icon: <Monitor size={22} />, accentColor: "#3047B0" },
    ],
  },
  SOURCING: {
    label: "Sourcing Specialist",
    color: "#3047B0",
    icon: <Search size={28} />,
    quickLinks: [
      { href: "/sourcing", label: "Sourcing Hub", description: "Central sourcing dashboard", icon: <Search size={22} />, accentColor: "#3047B0" },
      { href: "/sourcing/apify", label: "AI Sourcing", description: "Apify-powered candidate discovery", icon: <Bot size={22} />, accentColor: "#3047B0" },
      { href: "/sourcing/cv-outreach", label: "CV & Outreach", description: "AI screening & campaigns", icon: <FileText size={22} />, accentColor: "#3047B0" },
      { href: "/sourcing/job-posts", label: "Job Posts", description: "Create & manage listings", icon: <Briefcase size={22} />, accentColor: "#3047B0" },
      { href: "/sourcing/walkin-qr", label: "QR Walk-in", description: "QR codes for events", icon: <QrCode size={22} />, accentColor: "#3047B0" },
      { href: "/dashboard", label: "Dashboard", description: "Pipeline overview", icon: <LayoutDashboard size={22} />, accentColor: "#4B4C6A" },
    ],
  },
  MARKETING: {
    label: "Marketing",
    color: "#FF5C00",
    icon: <Megaphone size={28} />,
    quickLinks: [
      { href: "/marketing", label: "Marketing Dashboard", description: "Brand health & campaigns", icon: <TrendingUp size={22} />, accentColor: "#FF5C00" },
      { href: "/sourcing/content", label: "Content Hub", description: "Recruitment marketing content", icon: <PenTool size={22} />, accentColor: "#FF5C00" },
      { href: "/sourcing/trap", label: "TRAP Ads", description: "Targeted ad platform", icon: <Megaphone size={22} />, accentColor: "#FF5C00" },
      { href: "/dashboard", label: "Dashboard", description: "Pipeline overview", icon: <LayoutDashboard size={22} />, accentColor: "#4B4C6A" },
    ],
  },
  HR: {
    label: "HR / Onboarding",
    color: "#00AF9B",
    icon: <Heart size={28} />,
    quickLinks: [
      { href: "/hr/onboarding", label: "Onboarding", description: "Post-hire onboarding management", icon: <Heart size={22} />, accentColor: "#00AF9B" },
      { href: "/dashboard", label: "Dashboard", description: "Pipeline overview & KPIs", icon: <LayoutDashboard size={22} />, accentColor: "#4B4C6A" },
      { href: "/recruiter", label: "Recruiter View", description: "Track candidate pipeline", icon: <UserCheck size={22} />, accentColor: "#4B4C6A" },
    ],
  },
  OPS: {
    label: "Ops Interviewer",
    color: "#780096",
    icon: <ClipboardCheck size={28} />,
    quickLinks: [
      { href: "/interview/ops", label: "Interview Scorecard", description: "Live scoring & evaluation", icon: <ClipboardCheck size={22} />, accentColor: "#780096" },
      { href: "/interview", label: "Interview Hub", description: "Question bank & scheduling", icon: <CalendarCheck size={22} />, accentColor: "#780096" },
      { href: "/interview/candidate", label: "Candidate Prep View", description: "What candidates see", icon: <CalendarCheck size={22} />, accentColor: "#780096" },
      { href: "/dashboard", label: "Dashboard", description: "Pipeline overview", icon: <LayoutDashboard size={22} />, accentColor: "#4B4C6A" },
      { href: "/ta-monitor", label: "TA Monitor", description: "Recruitment analytics", icon: <Monitor size={22} />, accentColor: "#3047B0" },
    ],
  },
  ADMIN: {
    label: "System Admin",
    color: "#4B4C6A",
    icon: <ShieldCheck size={28} />,
    quickLinks: [
      { href: "/dashboard", label: "Dashboard", description: "Pipeline overview & KPIs", icon: <LayoutDashboard size={22} />, accentColor: "#4B4C6A" },
      { href: "/admin", label: "Admin Panel", description: "Users, roles & settings", icon: <Shield size={22} />, accentColor: "#4B4C6A" },
      { href: "/recruiter", label: "Recruiter View", description: "Track candidates", icon: <UserCheck size={22} />, accentColor: "#4B4C6A" },
      { href: "/hod", label: "HOD Approvals", description: "Approve offers & budgets", icon: <Crown size={22} />, accentColor: "#FF0082" },
      { href: "/sourcing", label: "Sourcing Hub", description: "All sourcing channels", icon: <Search size={22} />, accentColor: "#3047B0" },
      { href: "/marketing", label: "Marketing", description: "Brand & campaigns", icon: <Megaphone size={22} />, accentColor: "#FF5C00" },
      { href: "/hr/onboarding", label: "HR Onboarding", description: "Post-hire management", icon: <Heart size={22} />, accentColor: "#00AF9B" },
      { href: "/interview/ops", label: "Interview Scorecard", description: "Live scoring", icon: <ClipboardCheck size={22} />, accentColor: "#780096" },
      { href: "/ta-monitor", label: "TA Monitor", description: "Recruitment analytics", icon: <Monitor size={22} />, accentColor: "#3047B0" },
    ],
  },
};

export default function SelectRolePage() {
  const router = useRouter();
  const [user, setUser] = useState<StaffUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = window.sessionStorage.getItem("tp_staff_user");
      if (stored) setUser(JSON.parse(stored));
    } catch {}
    setIsLoading(false);
  }, []);

  const handleLogout = () => {
    window.sessionStorage.removeItem("tp_staff_user");
    router.push("/auth/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8f7f5] to-[#ECE9E7] flex items-center justify-center">
        <div className="animate-pulse text-[#848DAD]">Loading...</div>
      </div>
    );
  }

  // If not logged in, show the login prompt
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8f7f5] to-[#ECE9E7]">
        <div className="flex flex-col items-center justify-center pt-20 pb-10 px-4">
          <img src="/tp-logo-black.png" alt="TP Logo" className="h-12 w-auto mb-8" />
          <h1 className="text-4xl font-bold text-[#4B4C6A] mb-3">Welcome to TP Recruit</h1>
          <p className="text-lg text-[#676767] mb-8">Please sign in to access the platform</p>
          <div className="flex gap-4">
            <button
              onClick={() => router.push("/auth/login")}
              className="px-8 py-3 bg-gradient-to-r from-[#4B4C6A] to-[#3e2666] text-white font-semibold rounded-lg hover:shadow-lg transition-all"
            >
              Staff Sign In
            </button>
            <button
              onClick={() => router.push("/portal/login")}
              className="px-8 py-3 bg-white border-2 border-[#4B4C6A] text-[#4B4C6A] font-semibold rounded-lg hover:bg-[#f8f7f5] transition-all"
            >
              Candidate Portal
            </button>
          </div>
        </div>
      </div>
    );
  }

  const config = ROLE_CONFIG[user.role] || ROLE_CONFIG.ADMIN;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f7f5] to-[#ECE9E7]">
      {/* Header */}
      <div className="bg-white border-b border-[#E6E6E5]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/tp-logo-black.png" alt="TP Logo" className="h-9 w-auto" />
            <div>
              <h1 className="text-lg font-bold text-[#4B4C6A]">TP Recruit</h1>
              <p className="text-xs text-[#848DAD]">Navigation Hub</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-semibold text-[#414141]">{user.name}</p>
              <div className="flex items-center gap-1.5 justify-end">
                <span style={{ color: config.color }}>{config.icon && <span className="scale-50">{/* role dot */}</span>}</span>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: `${config.color}15`, color: config.color }}>
                  {config.label}
                </span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-[#676767] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Welcome Section */}
      <div className="max-w-6xl mx-auto px-6 pt-10 pb-6">
        <h2 className="text-3xl font-bold text-[#4B4C6A]">
          Welcome back, {user.name.split(" ")[0]}
        </h2>
        <p className="text-[#676767] mt-1">
          {user.department} · Choose where you'd like to go
        </p>
      </div>

      {/* Quick Links Grid */}
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {config.quickLinks.map((link, idx) => (
            <button
              key={link.href}
              onClick={() => router.push(link.href)}
              className="group relative bg-white rounded-xl p-5 border-2 border-transparent hover:shadow-lg transition-all duration-300 text-left overflow-hidden"
              style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = link.accentColor;
                e.currentTarget.style.boxShadow = `0 8px 25px -5px ${link.accentColor}20`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "transparent";
                e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.06)";
              }}
            >
              {/* Background accent */}
              <div
                className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-5 -mr-6 -mt-6 group-hover:opacity-10 transition-opacity"
                style={{ backgroundColor: link.accentColor }}
              />

              <div className="flex items-start gap-4">
                <div
                  className="flex items-center justify-center w-12 h-12 rounded-lg flex-shrink-0 group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: `${link.accentColor}12` }}
                >
                  <div style={{ color: link.accentColor }}>{link.icon}</div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-[#4B4C6A] group-hover:text-[#FF0082] transition-colors">
                    {link.label}
                  </h3>
                  <p className="text-sm text-[#676767] mt-0.5">{link.description}</p>
                </div>
              </div>

              {/* Arrow */}
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: link.accentColor }}>
                <span className="text-lg">→</span>
              </div>

              {/* Primary badge for first item */}
              {idx === 0 && (
                <span
                  className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                  style={{ backgroundColor: link.accentColor }}
                >
                  PRIMARY
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-[#E6E6E5] bg-white/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <p className="text-xs text-[#848DAD]">TP Recruitment Platform v1.0</p>
          <p className="text-xs text-[#848DAD]">
            Signed in as <strong className="text-[#414141]">{user.email}</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
