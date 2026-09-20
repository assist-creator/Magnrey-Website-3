import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X, ArrowUpRight } from "lucide-react";

const EMPTY = { category: "", title: "", excerpt: "", body: "", author: "Rinnieta Chrestien", date: new Date().toISOString().slice(0, 10), read_minutes: 5 };

export default function AdminInsights() {
  const { authAxios } = useAuth();
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null); // null | 'new' | existing item
  const [form, setForm] = useState(EMPTY);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const res = await authAxios({ method: "get", url: "/insights" });
    setItems(res.data.insights || []);
  };

  useEffect(() => { load(); }, []); // eslint-disable-line

  const startNew = () => { setForm(EMPTY); setEditing("new"); };
  const startEdit = (it) => { setForm({ ...it }); setEditing(it); };
  const close = () => { setEditing(null); setForm(EMPTY); };

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const payload = { ...form, read_minutes: Number(form.read_minutes) };
      if (editing === "new") {
        await authAxios({ method: "post", url: "/admin/insights", data: payload });
        toast.success("Essay published.");
      } else {
        await authAxios({ method: "put", url: `/admin/insights/${editing.id}`, data: payload });
        toast.success("Essay updated.");
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
    if (!window.confirm(`Delete "${it.title}"?`)) return;
    try {
      await authAxios({ method: "delete", url: `/admin/insights/${it.id}` });
      toast.success("Essay deleted.");
      await load();
    } catch { toast.error("Delete failed."); }
  };

  return (
    <div data-testid="admin-insights">
      <div className="flex items-end justify-between">
        <div>
          <span className="eyebrow">CMS</span>
          <h1 className="font-serif-display text-4xl md:text-5xl mt-3 text-[color:var(--ink)]">Insights.</h1>
          <p className="text-[color:var(--muted)] mt-3">Publish and manage thought-leadership essays.</p>
        </div>
        <button onClick={startNew} data-testid="new-insight" className="btn-ink"><Plus size={16} /> New Essay</button>
      </div>

      <div className="mt-8 border border-[color:var(--hairline)] bg-white">
        {items.length === 0 && <div className="p-10 text-center text-[color:var(--muted)] text-[14px]">No essays yet.</div>}
        {items.map((it) => (
          <div key={it.id} className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_auto_auto] gap-3 items-center px-5 py-4 border-b border-[color:var(--hairline)] last:border-b-0">
            <div>
              <div className="font-semibold text-[color:var(--ink)] text-[14.5px]">{it.title}</div>
              <div className="text-[12px] text-[color:var(--muted)] mt-1 line-clamp-1">{it.excerpt}</div>
            </div>
            <div className="text-[12px] font-mono-brand tracking-wide text-[color:var(--muted)] uppercase">{it.category} · {it.read_minutes}m</div>
            <button data-testid={`insight-edit-${it.id}`} onClick={() => startEdit(it)} className="p-2 border border-[color:var(--hairline-strong)] hover:border-[color:var(--ink)]">
              <Pencil size={14} />
            </button>
            <button data-testid={`insight-delete-${it.id}`} onClick={() => remove(it)} className="p-2 border border-[color:var(--hairline-strong)] hover:bg-red-50 hover:border-red-300 text-red-600">
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-[60] bg-[color:var(--ink)]/50 backdrop-blur-sm flex justify-end" onClick={close}>
          <div className="w-full max-w-2xl bg-white h-full overflow-y-auto" onClick={(e) => e.stopPropagation()} data-testid="insight-editor">
            <div className="sticky top-0 bg-white border-b border-[color:var(--hairline)] px-8 py-5 flex items-center justify-between">
              <span className="eyebrow">{editing === "new" ? "New essay" : "Edit essay"}</span>
              <button onClick={close} className="p-2 border border-[color:var(--hairline-strong)]"><X size={16} /></button>
            </div>
            <form onSubmit={save} className="px-8 py-8 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="field-label">Category</label>
                  <input required data-testid="insight-input-category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field" placeholder="AI Strategy" />
                </div>
                <div>
                  <label className="field-label">Read Minutes</label>
                  <input required type="number" min={1} max={60} data-testid="insight-input-minutes" value={form.read_minutes} onChange={(e) => setForm({ ...form, read_minutes: e.target.value })} className="input-field" />
                </div>
              </div>
              <div>
                <label className="field-label">Title</label>
                <input required data-testid="insight-input-title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field" placeholder="A crisp editorial title" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="field-label">Author</label>
                  <input required data-testid="insight-input-author" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="field-label">Date</label>
                  <input required type="date" data-testid="insight-input-date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="input-field" />
                </div>
              </div>
              <div>
                <label className="field-label">Excerpt</label>
                <textarea required rows={3} data-testid="insight-input-excerpt" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} className="input-field resize-none" />
              </div>
              <div>
                <label className="field-label">Body</label>
                <textarea required rows={12} data-testid="insight-input-body" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} className="input-field resize-none" />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-[color:var(--hairline)]">
                <button type="button" onClick={close} className="btn-outline">Cancel</button>
                <button type="submit" disabled={busy} data-testid="insight-save" className="btn-ink disabled:opacity-60">
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
