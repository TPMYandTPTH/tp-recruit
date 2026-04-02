"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard, Briefcase, FileText, Monitor,
  QrCode, Megaphone, CalendarCheck, Shield,
  ChevronLeft, ChevronRight, Search, PenTool, UserCheck,
  Menu, X, Crown, Heart, ClipboardCheck,
  Bot, TrendingUp, LogOut, Home, ArrowLeft
} from "lucide-react";

interface StaffUser {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
}

const NAV_ITEMS = [
  { href: "/auth/select-role", label: "Home", icon: Home, group: "Navigation", info: "Navigation hub — choose where to go" },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, group: "Core", info: "Recruitment pipeline overview, KPIs, and activity" },
  { href: "/recruiter", label: "Recruiter View", icon: UserCheck, group: "Core", info: "Track candidates, follow-ups, and pipeline" },
  { href: "/hod", label: "HOD Approvals", icon: Crown, group: "Core", info: "Approve headcount, offers, and budgets" },
  { href: "/admin", label: "Admin Panel", icon: Shield, group: "Core", info: "User management, roles, salary bands, settings" },
  { href: "/sourcing", label: "Sourcing Hub", icon: Search, group: "Sourcing", info: "Central hub for all sourcing channels" },
  { href: "/sourcing/apify", label: "AI Sourcing", icon: Bot, group: "Sourcing", info: "Apify-powered web scraping for candidate discovery" },
  { href: "/sourcing/cv-outreach", label: "CV & Outreach", icon: FileText, group: "Sourcing", info: "AI CV screening and outreach campaigns" },
  { href: "/sourcing/job-posts", label: "Job Posts", icon: Briefcase, group: "Sourcing", info: "Create and manage job listings" },
  { href: "/sourcing/content", label: "Content", icon: PenTool, group: "Sourcing", info: "Recruitment marketing content" },
  { href: "/sourcing/walkin-qr", label: "QR Walk-in", icon: QrCode, group: "Sourcing", info: "QR codes for job fairs and walk-in events" },
  { href: "/sourcing/trap", label: "TRAP Ads", icon: Megaphone, group: "Sourcing", info: "Targeted Recruitment Ad Platform" },
  { href: "/interview", label: "Interviews", icon: CalendarCheck, group: "Interviews", info: "Smart interview assistant with question bank" },
  { href: "/interview/ops", label: "Ops Scorecard", icon: ClipboardCheck, group: "Interviews", info: "Live interview scoring and evaluation" },
  { href: "/interview/candidate", label: "Candidate Prep", icon: CalendarCheck, group: "Interviews", info: "Candidate interview preparation view" },
  { href: "/ta-monitor", label: "TA Monitor", icon: Monitor, group: "Analytics", info: "Talent Acquisition monitoring dashboard" },
  { href: "/marketing", label: "Marketing", icon: TrendingUp, group: "Analytics", info: "Employer branding and campaign performance" },
  { href: "/hr/onboarding", label: "HR Onboarding", icon: Heart, group: "Analytics", info: "Post-hire onboarding management" },
];

const ROLE_COLORS: Record<string, string> = {
  HOD: "#FF0082",
  RECRUITER: "#4B4C6A",
  SOURCING: "#3047B0",
  MARKETING: "#FF5C00",
  HR: "#00AF9B",
  OPS: "#780096",
  ADMIN: "#4B4C6A",
};

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [user, setUser] = useState<StaffUser | null>(null);

  useEffect(() => {
    try {
      const stored = window.sessionStorage.getItem("tp_staff_user");
      if (stored) setUser(JSON.parse(stored));
    } catch {}
  }, []);

  const handleLogout = () => {
    window.sessionStorage.removeItem("tp_staff_user");
    router.push("/auth/login");
  };

  const groups = ["Navigation", "Core", "Sourcing", "Interviews", "Analytics"];

  // Breadcrumb logic: determine logical parent page
  const getParentPage = (): { href: string; label: string } | null => {
    if (pathname === "/auth/select-role" || pathname === "/" || pathname === "/auth/login") return null;
    // Sub-pages go to their parent
    if (pathname.startsWith("/sourcing/")) return { href: "/sourcing", label: "Sourcing Hub" };
    if (pathname.startsWith("/interview/")) return { href: "/interview", label: "Interviews" };
    if (pathname.startsWith("/hr/")) return { href: "/auth/select-role", label: "Home" };
    // Top-level pages go to home
    return { href: "/auth/select-role", label: "Home" };
  };

  const currentPage = NAV_ITEMS.find(i => i.href === pathname);
  const parentPage = getParentPage();

  return (
    <>
      {/* Breadcrumb Back Bar */}
      {parentPage && (
        <div className={`fixed top-0 z-30 bg-white/90 backdrop-blur-sm border-b border-[#E6E6E5] h-10 flex items-center gap-2 px-4 transition-all duration-300 ${collapsed ? "left-[68px]" : "left-[240px]"} right-0 max-lg:left-0`}>
          <Link href={parentPage.href} className="flex items-center gap-1.5 text-xs text-[#676767] hover:text-[#FF0082] transition-colors font-medium">
            <ArrowLeft size={13} />
            {parentPage.label}
          </Link>
          {currentPage && (
            <>
              <span className="text-[#C2C7CD] text-xs">/</span>
              <span className="text-xs text-[#4B4C6A] font-semibold">{currentPage.label}</span>
            </>
          )}
        </div>
      )}

      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-[#4B4C6A] text-white p-2 rounded-lg shadow-lg"
      >
        <Menu size={20} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white border-r border-[#E6E6E5] z-50 transition-all duration-300 flex flex-col
          ${collapsed ? "w-[68px]" : "w-[240px]"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo + collapse */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-[#E6E6E5]">
          {!collapsed && (
            <Link href="/auth/select-role" className="flex items-center gap-2">
              <img src="/tp-logo-black.png" alt="TP" className="h-8 w-auto" />
              <span className="font-bold text-[#4B4C6A] text-sm">TP Recruit</span>
            </Link>
          )}
          {collapsed && (
            <Link href="/auth/select-role">
              <img src="/tp-logo-black.png" alt="TP" className="h-7 w-auto mx-auto" />
            </Link>
          )}
          <button
            onClick={() => { setCollapsed(!collapsed); setMobileOpen(false); }}
            className="text-[#676767] hover:text-[#4B4C6A] hidden lg:block"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
          <button onClick={() => setMobileOpen(false)} className="text-[#676767] lg:hidden">
            <X size={18} />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto py-2 px-2">
          {groups.map((group) => {
            const items = NAV_ITEMS.filter((i) => i.group === group);
            return (
              <div key={group} className="mb-2">
                {!collapsed && (
                  <p className="px-3 py-1 text-[10px] font-semibold text-[#848DAD] uppercase tracking-wider">{group}</p>
                )}
                {items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || (item.href !== "/auth/select-role" && item.href.length > 1 && pathname.startsWith(item.href) && !NAV_ITEMS.some(other => other.href !== item.href && other.href.startsWith(item.href) && pathname.startsWith(other.href)));
                  return (
                    <div key={item.href} className="relative"
                      onMouseEnter={() => setHoveredItem(item.href)}
                      onMouseLeave={() => setHoveredItem(null)}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-3 px-3 py-1.5 rounded-lg text-[13px] transition-all duration-150 group
                          ${isActive
                            ? "bg-[#4B4C6A] text-white font-medium shadow-sm"
                            : "text-[#414141] hover:bg-[#ECE9E7]"
                          }
                          ${collapsed ? "justify-center" : ""}
                        `}
                      >
                        <Icon size={16} className={isActive ? "text-white" : "text-[#848DAD] group-hover:text-[#4B4C6A]"} />
                        {!collapsed && <span>{item.label}</span>}
                      </Link>

                      {hoveredItem === item.href && collapsed && (
                        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 bg-[#4B4C6A] text-white text-xs py-2 px-3 rounded-lg whitespace-nowrap z-50 shadow-lg">
                          <p className="font-medium">{item.label}</p>
                          <p className="text-white/70 text-[10px] mt-0.5 max-w-[200px]">{item.info}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </nav>

        {/* User info + logout */}
        <div className="border-t border-[#E6E6E5]">
          {user && !collapsed && (
            <div className="px-3 py-3">
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ backgroundColor: ROLE_COLORS[user.role] || "#4B4C6A" }}
                >
                  {user.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-[#414141] truncate">{user.name}</p>
                  <p className="text-[10px] text-[#848DAD] truncate">{user.role}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-[#676767] hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
              >
                <LogOut size={14} />
                Sign Out
              </button>
            </div>
          )}
          {user && collapsed && (
            <div className="py-3 flex flex-col items-center gap-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                style={{ backgroundColor: ROLE_COLORS[user.role] || "#4B4C6A" }}
              >
                {user.name.split(" ").map(n => n[0]).join("")}
              </div>
              <button onClick={handleLogout} className="text-[#676767] hover:text-red-600">
                <LogOut size={14} />
              </button>
            </div>
          )}
          {!user && !collapsed && (
            <div className="px-4 py-3 text-[10px] text-[#848DAD]">
              TP Recruitment Platform v1.0
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
