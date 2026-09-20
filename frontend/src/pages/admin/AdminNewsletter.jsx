import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function AdminNewsletter() {
  const { authAxios } = useAuth();
  const [subs, setSubs] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await authAxios({ method: "get", url: "/admin/newsletter" });
      setSubs(res.data?.subscribers || []);
    })();
  }, [authAxios]);

  const exportCsv = () => {
    const rows = [["email", "subscribed_at"], ...subs.map((s) => [s.email, s.created_at])];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `magnrey-newsletter-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  return (
    <div data-testid="admin-newsletter">
      <div className="flex items-end justify-between">
        <div>
          <span className="eyebrow">Newsletter</span>
          <h1 className="font-serif-display text-4xl md:text-5xl mt-3 text-[color:var(--ink)]">Subscribers.</h1>
          <p className="text-[color:var(--muted)] mt-3">{subs.length} executive{subs.length === 1 ? "" : "s"} on the quarterly briefing list.</p>
        </div>
        <button onClick={exportCsv} data-testid="newsletter-export" className="btn-outline">Export CSV</button>
      </div>
      <div className="mt-8 border border-[color:var(--hairline)] bg-white">
        {subs.length === 0 && <div className="p-10 text-center text-[color:var(--muted)] text-[14px]">No subscribers yet.</div>}
        {subs.map((s) => (
          <div key={s.id} className="grid grid-cols-[1fr_auto] items-center px-5 py-3.5 border-b border-[color:var(--hairline)] last:border-b-0">
            <span className="text-[color:var(--ink)] text-[14px]">{s.email}</span>
            <span className="text-[11px] font-mono-brand tracking-wider uppercase text-[color:var(--muted)]">
              {new Date(s.created_at).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
