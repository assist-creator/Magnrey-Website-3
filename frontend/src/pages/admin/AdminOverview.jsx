import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import { ArrowUpRight, Inbox, Mail, FileText, Layers, CalendarCheck } from "lucide-react";

const STATS = [
  { key: "leads", label: "Leads", icon: Inbox, to: "/admin/leads" },
  { key: "booked_diagnostics", label: "Booked Diagnostics", icon: CalendarCheck, to: "/admin/leads" },
  { key: "newsletter", label: "Newsletter", icon: Mail, to: "/admin/newsletter" },
  { key: "insights", label: "Insights", icon: FileText, to: "/admin/insights" },
  { key: "case_studies", label: "Case Studies", icon: Layers, to: "/admin/case-studies" },
];

export default function AdminOverview() {
  const { authAxios, user } = useAuth();
  const [stats, setStats] = useState({});
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    (async () => {
      const [s, l] = await Promise.all([
        authAxios({ method: "get", url: "/admin/stats" }),
        authAxios({ method: "get", url: "/admin/leads?limit=5" }),
      ]);
      setStats(s.data || {});
      setRecent(l.data?.leads || []);
    })();
  }, [authAxios]);

  return (
    <div data-testid="admin-overview">
      <span className="eyebrow">Overview</span>
      <h1 className="font-serif-display text-4xl md:text-5xl mt-3 text-[color:var(--ink)]">
        Good {greeting()}, {(user?.name || "Partner").split(" ")[0]}.
      </h1>
      <p className="text-[color:var(--muted)] mt-3">A quick pulse of the practice pipeline.</p>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-10">
        {STATS.map((s) => (
          <Link
            key={s.key}
            to={s.to}
            data-testid={`stat-${s.key}`}
            className="card-editorial group !p-6"
          >
            <div className="flex items-center justify-between">
              <s.icon size={16} className="text-[color:var(--muted)] group-hover:text-[color:var(--gold)]" strokeWidth={1.5} />
              <ArrowUpRight size={14} className="text-[color:var(--muted)] group-hover:text-[color:var(--gold)]" />
            </div>
            <div className="font-serif-display text-4xl mt-6 text-[color:var(--ink)] leading-none">{stats[s.key] ?? "—"}</div>
            <div className="font-mono-brand text-[10px] tracking-[0.22em] uppercase text-[color:var(--muted)] mt-3">{s.label}</div>
          </Link>
        ))}
      </div>

      <div className="mt-14">
        <div className="flex items-end justify-between mb-6">
          <div>
            <span className="eyebrow">Latest Enquiries</span>
            <h2 className="font-serif-display text-2xl md:text-3xl text-[color:var(--ink)] mt-2">Five most recent leads.</h2>
          </div>
          <Link to="/admin/leads" className="editorial-link text-[13px] font-semibold text-[color:var(--ink)]">
            All leads <ArrowUpRight size={14} />
          </Link>
        </div>
        <div className="border border-[color:var(--hairline)] bg-white">
          {recent.length === 0 && (
            <div className="p-8 text-center text-[color:var(--muted)] text-[14px]">No leads yet.</div>
          )}
          {recent.map((l) => (
            <div key={l.id} className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr_1fr_auto] gap-3 items-center px-5 py-4 border-b border-[color:var(--hairline)] last:border-b-0">
              <div>
                <div className="font-semibold text-[color:var(--ink)] text-[14.5px]">{l.full_name}</div>
                <div className="text-[12px] text-[color:var(--muted)]">{l.email}</div>
              </div>
              <div className="text-[13px] text-[color:var(--ink)]">{l.company}</div>
              <div className="text-[12px] font-mono-brand tracking-wide text-[color:var(--muted)] uppercase">{l.interest}</div>
              <div className="text-[11px] text-[color:var(--muted)]">
                {new Date(l.created_at).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 18) return "afternoon";
  return "evening";
}
