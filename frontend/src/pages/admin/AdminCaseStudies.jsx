import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X, ArrowUpRight } from "lucide-react";

const EMPTY = {
  sector: "",
  engagement: "",
  employees: "",
  geography: "",
  duration: "",
  headline: "",
  challenge: "",
  approach: "",
  outcomes: [""],
};

export default function AdminCaseStudies() {
  const { authAxios } = useAuth();
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const res = await authAxios({ method: "get", url: "/case-studies" });
    setItems(res.data.case_studies || []);
  };

  useEffect(() => { load(); }, []); // eslint-disable-line

  const startNew = () => { setForm({ ...EMPTY, outcomes: [""] }); setEditing("new"); };
  const startEdit = (it) => { setForm({ ...it, outcomes: it.outcomes?.length ? it.outcomes : [""] }); setEditing(it); };
  const close = () => { setEditing(null); setForm(EMPTY); };

  const updateOutcome = (i, v) => {
    const next = [...form.outcomes];
    next[i] = v;
    setForm({ ...form, outcomes: next });
  };
  const addOutcome = () => setForm({ ...form, outcomes: [...form.outcomes, ""] });
  const removeOutcome = (i) => setForm({ ...form, outcomes: form.outcomes.filter((_, idx) => idx !== i) });

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const payload = { ...form, outcomes: form.outcomes.filter(Boolean) };
      if (editing === "new") {
        await authAxios({ method: "post", url: "/admin/case-studies", data: payload });
        toast.success("Case study published.");
      } else {
        await authAxios({ method: "put", url: `/admin/case-studies/${editing.id}`, data: payload });
        toast.success("Case study updated.");
      }
      await load();
      close();
    } catch (err) {
      const detail = err?.response?.data?.detail;
      toast.error(typeof detail === "string" ? detail : "Save failed.");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (it) => {
    if (!window.confirm(`Delete "${it.headline}"?`)) return;
    try {
      await authAxios({ method: "delete", url: `/admin/case-studies/${it.id}` });
      toast.success("Case study deleted.");
      await load();
    } catch { toast.error("Delete failed."); }
  };

  return (
    <div data-testid="admin-case-studies">
      <div className="flex items-end justify-between">
        <div>
          <span className="eyebrow">CMS</span>
          <h1 className="font-serif-display text-4xl md:text-5xl mt-3 text-[color:var(--ink)]">Case Studies.</h1>
          <p className="text-[color:var(--muted)] mt-3">Publish and manage engagement dossiers.</p>
        </div>
        <button onClick={startNew} data-testid="new-case-study" className="btn-ink"><Plus size={16} /> New Dossier</button>
      </div>

      <div className="mt-8 border border-[color:var(--hairline)] bg-white">
        {items.length === 0 && <div className="p-10 text-center text-[color:var(--muted)] text-[14px]">No case studies yet.</div>}
        {items.map((it) => (
          <div key={it.id} className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr_auto_auto] gap-3 items-center px-5 py-4 border-b border-[color:var(--hairline)] last:border-b-0">
            <div>
              <div className="font-semibold text-[color:var(--ink)] text-[14.5px]">{it.headline}</div>
              <div className="text-[12px] text-[color:var(--muted)] mt-1">{it.employees} · {it.geography}</div>
            </div>
            <div className="text-[12px] font-mono-brand tracking-wide text-[color:var(--muted)] uppercase">{it.sector}</div>
            <div className="text-[12px] text-[color:var(--ink)]">{it.engagement}</div>
            <button data-testid={`case-edit-${it.id}`} onClick={() => startEdit(it)} className="p-2 border border-[color:var(--hairline-strong)] hover:border-[color:var(--ink)]">
              <Pencil size={14} />
            </button>
            <button data-testid={`case-delete-${it.id}`} onClick={() => remove(it)} className="p-2 border border-[color:var(--hairline-strong)] hover:bg-red-50 hover:border-red-300 text-red-600">
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-[60] bg-[color:var(--ink)]/50 backdrop-blur-sm flex justify-end" onClick={close}>
          <div className="w-full max-w-2xl bg-white h-full overflow-y-auto" onClick={(e) => e.stopPropagation()} data-testid="case-editor">
            <div className="sticky top-0 bg-white border-b border-[color:var(--hairline)] px-8 py-5 flex items-center justify-between">
              <span className="eyebrow">{editing === "new" ? "New dossier" : "Edit dossier"}</span>
              <button onClick={close} className="p-2 border border-[color:var(--hairline-strong)]"><X size={16} /></button>
            </div>
            <form onSubmit={save} className="px-8 py-8 space-y-5">
              <div>
                <label className="field-label">Headline</label>
                <input required data-testid="case-input-headline" value={form.headline} onChange={(e) => setForm({ ...form, headline: e.target.value })} className="input-field" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="field-label">Sector</label>
                  <input required data-testid="case-input-sector" value={form.sector} onChange={(e) => setForm({ ...form, sector: e.target.value })} className="input-field" placeholder="Global FinTech" />
                </div>
                <div>
                  <label className="field-label">Engagement</label>
                  <input required data-testid="case-input-engagement" value={form.engagement} onChange={(e) => setForm({ ...form, engagement: e.target.value })} className="input-field" placeholder="Workday Deployment" />
                </div>
                <div>
                  <label className="field-label">Employees</label>
                  <input required data-testid="case-input-employees" value={form.employees} onChange={(e) => setForm({ ...form, employees: e.target.value })} className="input-field" placeholder="42,000" />
                </div>
                <div>
                  <label className="field-label">Geography</label>
                  <input required data-testid="case-input-geography" value={form.geography} onChange={(e) => setForm({ ...form, geography: e.target.value })} className="input-field" placeholder="27 countries" />
                </div>
                <div>
                  <label className="field-label">Duration</label>
                  <input required data-testid="case-input-duration" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} className="input-field" placeholder="14 months" />
                </div>
              </div>
              <div>
                <label className="field-label">Challenge</label>
                <textarea required rows={4} data-testid="case-input-challenge" value={form.challenge} onChange={(e) => setForm({ ...form, challenge: e.target.value })} className="input-field resize-none" />
              </div>
              <div>
                <label className="field-label">Approach</label>
                <textarea required rows={4} data-testid="case-input-approach" value={form.approach} onChange={(e) => setForm({ ...form, approach: e.target.value })} className="input-field resize-none" />
              </div>
              <div>
                <label className="field-label">Verified Outcomes</label>
                <div className="space-y-2 mt-2">
                  {form.outcomes.map((o, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        value={o}
                        data-testid={`case-outcome-${i}`}
                        onChange={(e) => updateOutcome(i, e.target.value)}
                        placeholder={`Outcome ${i + 1}`}
                        className="input-field flex-1"
                      />
                      <button type="button" onClick={() => removeOutcome(i)} className="p-2 border border-[color:var(--hairline-strong)] text-red-600 hover:bg-red-50">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                  <button type="button" onClick={addOutcome} className="text-[12px] font-mono-brand tracking-wider uppercase text-[color:var(--ink)] hover:text-[color:var(--gold)] mt-2">
                    + Add outcome
                  </button>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-[color:var(--hairline)]">
                <button type="button" onClick={close} className="btn-outline">Cancel</button>
                <button type="submit" disabled={busy} data-testid="case-save" className="btn-ink disabled:opacity-60">
                  {busy ? "Saving…" : (<>{editing === "new" ? "Publish" : "Update"} <ArrowUpRight size={14} /></>)}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
