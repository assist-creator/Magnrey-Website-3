import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Search, Filter } from "lucide-react";

export default function AdminLeads() {
  const { authAxios } = useAuth();
  const [leads, setLeads] = useState([]);
  const [query, setQuery] = useState("");
  const [only, setOnly] = useState("all"); // all | booked | unbooked
  const [active, setActive] = useState(null);

  useEffect(() => {
    (async () => {
      const res = await authAxios({ method: "get", url: "/admin/leads" });
      setLeads(res.data?.leads || []);
    })();
  }, [authAxios]);

  const filtered = useMemo(() => {
    return leads.filter((l) => {
      if (only === "booked" && !l.slot) return false;
      if (only === "unbooked" && l.slot) return false;
      if (!query) return true;
      const q = query.toLowerCase();
      return [l.full_name, l.email, l.company, l.role, l.interest, l.message]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q));
    });
  }, [leads, query, only]);

  return (
    <div data-testid="admin-leads">
      <span className="eyebrow">Inbox</span>
      <h1 className="font-serif-display text-4xl md:text-5xl mt-3 text-[color:var(--ink)]">Leads.</h1>
      <p className="text-[color:var(--muted)] mt-3">Every diagnostic enquiry submitted from the site.</p>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-3 items-center">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--muted)]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, email, company…"
            className="input-field pl-10"
            data-testid="leads-search"
          />
        </div>
        <div className="flex gap-2">
          {["all", "booked", "unbooked"].map((k) => (
            <button
              key={k}
              onClick={() => setOnly(k)}
              data-testid={`leads-filter-${k}`}
              className={`px-4 py-2 text-[12px] font-mono-brand tracking-[0.18em] uppercase border ${
                only === k ? "bg-[color:var(--ink)] text-[color:var(--gold)] border-[color:var(--ink)]" : "border-[color:var(--hairline-strong)] text-[color:var(--muted)]"
              }`}
            >
              {k}
            </button>
          ))}
        </div>
        <span className="font-mono-brand text-[11px] tracking-[0.2em] uppercase text-[color:var(--muted)] justify-self-end">
          {filtered.length} of {leads.length}
        </span>
      </div>

      <div className="mt-6 border border-[color:var(--hairline)] bg-white overflow-hidden">
        {filtered.length === 0 && (
          <div className="p-10 text-center text-[color:var(--muted)] text-[14px]">No leads match your criteria.</div>
        )}
        {filtered.map((l) => (
          <button
            key={l.id}
            onClick={() => setActive(l)}
            data-testid={`lead-row-${l.id}`}
            className="w-full grid grid-cols-1 md:grid-cols-[1.3fr_1fr_1fr_auto_auto] gap-3 items-center text-left px-5 py-4 border-b border-[color:var(--hairline)] last:border-b-0 hover:bg-[color:var(--paper-2)] transition-colors"
          >
            <div>
              <div className="font-semibold text-[color:var(--ink)] text-[14.5px]">{l.full_name}</div>
              <div className="text-[12px] text-[color:var(--muted)]">{l.email}</div>
            </div>
            <div className="text-[13px] text-[color:var(--ink)]">
              {l.company}
              {l.role && <span className="block text-[11px] text-[color:var(--muted)]">{l.role}</span>}
            </div>
            <div className="text-[12px] font-mono-brand tracking-wide text-[color:var(--muted)] uppercase">{l.interest}</div>
            <div className="text-[11px] font-mono-brand tracking-wider uppercase">
              {l.slot ? (
                <span className="text-[color:var(--gold)]">
                  {new Date(l.slot).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                </span>
              ) : (
                <span className="text-[color:var(--muted)]">No slot</span>
              )}
            </div>
            <div className="text-[11px] text-[color:var(--muted)]">
              {new Date(l.created_at).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
            </div>
          </button>
        ))}
      </div>

      {active && (
        <div className="fixed inset-0 z-[60] bg-[color:var(--ink)]/50 backdrop-blur-sm flex justify-end" onClick={() => setActive(null)}>
          <div className="w-full max-w-lg bg-white h-full overflow-y-auto" onClick={(e) => e.stopPropagation()} data-testid="lead-drawer">
            <div className="sticky top-0 bg-white border-b border-[color:var(--hairline)] px-8 py-5 flex items-center justify-between">
              <span className="eyebrow">{active.interest}</span>
              <button onClick={() => setActive(null)} className="text-[color:var(--muted)] hover:text-[color:var(--ink)]">Close</button>
            </div>
            <div className="px-8 py-8 space-y-5">
              <div>
                <div className="font-serif-display text-3xl text-[color:var(--ink)]">{active.full_name}</div>
                <a href={`mailto:${active.email}`} className="text-[color:var(--gold)] hover:underline text-[13px]">{active.email}</a>
              </div>
              <div className="grid grid-cols-2 gap-4 border-y border-[color:var(--hairline)] py-5">
                <div><div className="field-label">Company</div><div className="text-[14px] text-[color:var(--ink)] mt-1">{active.company}</div></div>
                <div><div className="field-label">Role</div><div className="text-[14px] text-[color:var(--ink)] mt-1">{active.role || "—"}</div></div>
                <div><div className="field-label">Size</div><div className="text-[14px] text-[color:var(--ink)] mt-1">{active.employees || "—"}</div></div>
                <div><div className="field-label">Booked Slot</div><div className="text-[14px] text-[color:var(--ink)] mt-1">
                  {active.slot ? new Date(active.slot).toLocaleString("en-GB", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "—"}
                </div></div>
              </div>
              <div>
                <div className="field-label">Message</div>
                <p className="text-[14.5px] text-[color:var(--ink)] mt-2 whitespace-pre-wrap leading-relaxed">
                  {active.message || <span className="text-[color:var(--muted)] italic">No message left.</span>}
                </p>
              </div>
              <a href={`mailto:${active.email}?subject=Magnrey 45-Min Diagnostic — Confirmation`} className="btn-ink w-full justify-center">
                Reply by email
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
