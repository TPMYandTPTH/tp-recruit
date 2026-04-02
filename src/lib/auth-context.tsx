"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";

export interface StaffUser {
  id: string;
  name: string;
  email: string;
  role: string; // HOD, RECRUITER, SOURCING, MARKETING, HR, OPS, ADMIN
  department: string;
}

// Role to allowed pages mapping
const ROLE_ACCESS: Record<string, string[]> = {
  ADMIN: ["*"], // Access to everything
  HOD: ["/hod", "/dashboard", "/recruiter", "/ta-monitor", "/interview", "/interview/ops", "/interview/candidate"],
  RECRUITER: ["/recruiter", "/dashboard", "/sourcing", "/sourcing/apify", "/sourcing/cv-outreach", "/sourcing/job-posts", "/sourcing/content", "/sourcing/walkin-qr", "/sourcing/trap", "/interview", "/interview/ops", "/interview/candidate", "/ta-monitor"],
  SOURCING: ["/sourcing", "/sourcing/apify", "/sourcing/cv-outreach", "/sourcing/job-posts", "/sourcing/content", "/sourcing/walkin-qr", "/sourcing/trap", "/dashboard"],
  MARKETING: ["/marketing", "/sourcing/content", "/sourcing/trap", "/dashboard"],
  HR: ["/hr/onboarding", "/dashboard", "/recruiter"],
  OPS: ["/interview", "/interview/ops", "/interview/candidate", "/dashboard", "/ta-monitor"],
};

// Public pages (no auth required)
const PUBLIC_PAGES = ["/", "/auth", "/auth/login", "/auth/select-role", "/portal/login", "/apply", "/walkin"];

interface AuthContextType {
  user: StaffUser | null;
  login: (user: StaffUser) => void;
  logout: () => void;
  isLoading: boolean;
  hasAccess: (path: string) => boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  isLoading: true,
  hasAccess: () => false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<StaffUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check for stored session
    const stored = typeof window !== "undefined" ? window.sessionStorage.getItem("tp_staff_user") : null;
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {}
    }
    setIsLoading(false);
  }, []);

  const login = (userData: StaffUser) => {
    setUser(userData);
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem("tp_staff_user", JSON.stringify(userData));
    }
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem("tp_staff_user");
    }
    router.push("/auth/login");
  };

  const hasAccess = (path: string): boolean => {
    if (PUBLIC_PAGES.some(p => path === p || path.startsWith("/portal/"))) return true;
    if (!user) return false;
    const allowed = ROLE_ACCESS[user.role];
    if (!allowed) return false;
    if (allowed.includes("*")) return true;
    return allowed.some(p => path === p || path.startsWith(p + "/"));
  };

  // Route protection: redirect unauthenticated users to login for protected pages
  const isPublic = PUBLIC_PAGES.some(p => pathname === p || pathname.startsWith(p + "/")) || pathname.startsWith("/portal/");
  const isAuthorized = isPublic || hasAccess(pathname);

  // Show nothing while loading auth state (prevents flash of content)
  if (isLoading && !isPublic) {
    return (
      <AuthContext.Provider value={{ user, login, logout, isLoading, hasAccess }}>
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8f9fa" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 40, height: 40, border: "3px solid #e0e0e0", borderTopColor: "#FF0082", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
            <p style={{ color: "#666", fontSize: 14 }}>Loading...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        </div>
      </AuthContext.Provider>
    );
  }

  // Not logged in + trying to access protected page → redirect to login
  if (!isLoading && !user && !isPublic) {
    return (
      <AuthContext.Provider value={{ user, login, logout, isLoading, hasAccess }}>
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #4B4C6A 0%, #2d2d42 100%)" }}>
          <div style={{ background: "white", borderRadius: 16, padding: "48px 40px", maxWidth: 420, width: "90%", textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
            <div style={{ width: 64, height: 64, background: "#FFF0F6", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 28 }}>🔒</div>
            <h2 style={{ margin: "0 0 8px", color: "#1a1a2e", fontSize: 22, fontWeight: 700 }}>Authentication Required</h2>
            <p style={{ margin: "0 0 28px", color: "#666", fontSize: 14, lineHeight: 1.5 }}>Please sign in with your staff credentials to access this page.</p>
            <a href="/auth/login" style={{ display: "inline-block", background: "#FF0082", color: "white", padding: "12px 32px", borderRadius: 8, textDecoration: "none", fontWeight: 600, fontSize: 15, transition: "background 0.2s" }}>
              Sign In
            </a>
            <p style={{ marginTop: 16, fontSize: 12, color: "#999" }}>TP Recruitment Platform v1.0</p>
          </div>
        </div>
      </AuthContext.Provider>
    );
  }

  // Logged in but no access to this specific page → access denied
  if (!isLoading && user && !isAuthorized) {
    return (
      <AuthContext.Provider value={{ user, login, logout, isLoading, hasAccess }}>
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #4B4C6A 0%, #2d2d42 100%)" }}>
          <div style={{ background: "white", borderRadius: 16, padding: "48px 40px", maxWidth: 420, width: "90%", textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
            <div style={{ width: 64, height: 64, background: "#FFF3E0", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 28 }}>⛔</div>
            <h2 style={{ margin: "0 0 8px", color: "#1a1a2e", fontSize: 22, fontWeight: 700 }}>Access Denied</h2>
            <p style={{ margin: "0 0 8px", color: "#666", fontSize: 14, lineHeight: 1.5 }}>
              Your role <strong style={{ color: "#FF0082" }}>{user.role}</strong> does not have permission to access this page.
            </p>
            <p style={{ margin: "0 0 28px", color: "#999", fontSize: 13 }}>Contact your admin if you need access.</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <a href="/auth/select-role" style={{ display: "inline-block", background: "#4B4C6A", color: "white", padding: "12px 24px", borderRadius: 8, textDecoration: "none", fontWeight: 600, fontSize: 14 }}>
                Go Home
              </a>
              <button onClick={logout} style={{ background: "transparent", border: "2px solid #FF0082", color: "#FF0082", padding: "12px 24px", borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
                Sign Out
              </button>
            </div>
            <p style={{ marginTop: 16, fontSize: 12, color: "#999" }}>Signed in as {user.name}</p>
          </div>
        </div>
      </AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, hasAccess }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
