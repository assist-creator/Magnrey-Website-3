import { useEffect, useMemo, useState } from "react";
import { Navigate, NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { LogOut, Inbox, Mail, FileText, Layers, Home as HomeIcon, BarChart3 } from "lucide-react";

export function AdminGuard({ children }) {
  const { user, checking } = useAuth();
  const location = useLocation();
  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[color:var(--ink)] text-white/60">
        Checking session…
      </div>
    );
  }
  if (!user) return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
  return children;
}

const NAV = [
  { to: "/admin", end: true, label: "Overview", icon: BarChart3 },
  { to: "/admin/leads", label: "Leads", icon: Inbox },
  { to: "/admin/newsletter", label: "Newsletter", icon: Mail },
  { to: "/admin/insights", label: "Insights", icon: FileText },
  { to: "/admin/case-studies", label: "Case Studies", icon: Layers },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-[color:var(--paper)]" data-testid="admin-layout">
      <aside className="fixed top-0 left-0 bottom-0 w-64 bg-[color:var(--ink)] text-[color:var(--bone)] p-6 flex flex-col z-40">
        <div className="flex items-center gap-3 mb-10">
          <div className="bg-[color:var(--bone)] px-2.5 py-1.5 inline-flex items-center justify-center">
            <img src="/brand/logo.png" alt="Magnrey" className="h-7 w-auto object-contain" />
          </div>
        </div>
        <span className="eyebrow mb-4">Partner Console</span>
        <nav className="flex flex-col gap-1">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              data-testid={`admin-nav-${n.label.toLowerCase().replace(/\s+/g, "-")}`}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 text-[13.5px] border-l-2 transition-colors ${
                  isActive
                    ? "border-[color:var(--gold)] bg-white/5 text-[color:var(--gold)]"
                    : "border-transparent text-white/60 hover:text-[color:var(--bone)] hover:bg-white/5"
                }`
              }
            >
              <n.icon size={16} strokeWidth={1.5} />
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto pt-6 border-t border-white/10">
          <div className="text-[12px] text-white/50">Signed in as</div>
          <div className="text-[13px] text-[color:var(--bone)] font-semibold truncate">{user?.email}</div>
          <div className="mt-4 flex flex-col gap-2">
            <a href="/" className="text-[12px] text-white/60 hover:text-[color:var(--gold)] flex items-center gap-2">
              <HomeIcon size={13} /> View site
            </a>
            <button
              onClick={logout}
              data-testid="admin-logout"
              className="text-[12px] text-white/60 hover:text-[color:var(--gold)] flex items-center gap-2 text-left"
            >
              <LogOut size={13} /> Sign out
            </button>
          </div>
        </div>
      </aside>

      <main className="ml-64 min-h-screen p-10">
        <Outlet />
      </main>
    </div>
  );
}
