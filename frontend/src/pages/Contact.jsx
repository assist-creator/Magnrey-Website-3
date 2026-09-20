import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { PageHero, Eyebrow } from "@/components/Primitives";
import { ArrowUpRight, Mail, Clock, ShieldCheck, CheckCircle2, Calendar } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const INTERESTS = [
  "Executive Diagnostic",
  "AI & Digital Advisory",
  "Project Advisory",
  "Systems Implementation",
  "General Enquiry",
];

const EMPLOYEE_BANDS = ["Under 1,000", "1,000 – 10,000", "10,000 – 50,000", "50,000+"];

export default function Contact() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    company: "",
    role: "",
    employees: EMPLOYEE_BANDS[1],
    interest: INTERESTS[0],
    message: "",
  });
  const [slots, setSlots] = useState([]);
  const [slotIso, setSlotIso] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${API}/booking/slots`);
        setSlots(res.data.slots || []);
      } catch { /* soft-fail */ }
    })();
  }, []);

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await axios.post(`${API}/leads`, { ...form, slot: slotIso });
      toast.success("Received. A senior practitioner will be in touch within 48 hours.");
      setDone({ lead: res.data, slot: slotIso });
    } catch (err) {
      const detail = err?.response?.data?.detail;
      const msg = typeof detail === "string" ? detail : "Please review the form and try again.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // Group slots by date_label
  const grouped = slots.reduce((acc, s) => {
    (acc[s.date_label] = acc[s.date_label] || []).push(s);
    return acc;
  }, {});

  return (
    <div data-testid="page-contact">
      <PageHero
        kicker="008 — Get in Touch"
        eyebrow="Real Conversations"
        title="Real conversations."
        italicTail="Not sales pitches."
        description="Speak with experienced practitioners who understand your challenges. Bounce some ideas or have an open conversation on how we can help. No obligation. No junior handoffs — you speak directly with a senior practitioner from day one."
      />

      <section className="py-16 md:py-24">
        <div className="container-mag grid grid-cols-1 lg:grid-cols-12 gap-12">
          <aside className="lg:col-span-4 order-2 lg:order-1">
            <div className="rule-label mb-6"><span>Direct</span></div>
            <a href="mailto:assist@magnrey.com" data-testid="contact-email" className="flex items-center gap-3 text-[color:var(--ink)] hover:text-[color:var(--gold)] transition-colors">
              <Mail size={18} strokeWidth={1.5} />
              <span className="font-serif-display text-2xl">assist@magnrey.com</span>
            </a>
            <p className="text-[14px] text-[color:var(--muted)] mt-2 max-w-xs">Direct line to the founding partner. Every enquiry read personally.</p>

            <div className="mt-12 space-y-5">
              {[
                { icon: ShieldCheck, k: "Senior practitioner from day one", v: "You speak with the partner who will lead your mandate — not an intake associate." },
                { icon: Clock, k: "48-hour response", v: "Every serious enquiry receives a considered reply within two business days." },
                { icon: CheckCircle2, k: "Confidentiality by default", v: "Discussion covered by NDA on request. Executive discretion assumed." },
              ].map((c) => (
                <div key={c.k} className="flex gap-4">
                  <c.icon size={20} className="text-[color:var(--gold)] mt-1 shrink-0" strokeWidth={1.5} />
                  <div>
                    <div className="font-semibold text-[color:var(--ink)]">{c.k}</div>
                    <div className="text-[13.5px] text-[color:var(--muted)] mt-1">{c.v}</div>
                  </div>
                </div>
              ))}
            </div>
          </aside>

          <div className="lg:col-span-8 order-1 lg:order-2">
            {done ? (
              <div className="ink-block p-12 border border-[color:var(--gold)]/40" data-testid="contact-success">
                <Eyebrow>Received</Eyebrow>
                <h2 className="font-serif-display text-4xl md:text-5xl mt-6 text-[color:var(--bone)] leading-tight">
                  Thank you. Your enquiry has been logged.
                </h2>
                {done.slot && (
                  <div className="mt-6 border border-[color:var(--gold)]/40 p-5 bg-white/5">
                    <div className="eyebrow">Provisional slot held</div>
                    <div className="font-serif-display text-2xl md:text-3xl text-[color:var(--bone)] mt-2">
                      {new Date(done.slot).toLocaleString("en-GB", { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })}
                    </div>
                    <p className="text-white/60 text-[13px] mt-2 font-mono-brand tracking-wider uppercase">Calendar invite arriving within 24 hours</p>
                  </div>
                )}
                <p className="text-white/70 mt-6 max-w-lg">
                  A senior practitioner will review your context and respond within 48 hours to confirm your diagnostic session. In the interim, feel free to explore our framework or recent field notes.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <a href="/framework" className="btn-gold">Enter Framework <ArrowUpRight size={14} /></a>
                  <a href="/insights" className="btn-outline !border-white/25 !text-[color:var(--bone)] hover:!bg-white/10">Read Insights</a>
                </div>
              </div>
            ) : (
              <form onSubmit={submit} className="bg-[color:var(--bone)] border border-[color:var(--hairline)] p-8 md:p-12" data-testid="contact-form">
                <Eyebrow>45-Min Executive Diagnostic</Eyebrow>
                <h2 className="font-serif-display text-3xl md:text-4xl mt-4 text-[color:var(--ink)] leading-tight">Request your session.</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-10">
                  <div>
                    <label className="field-label">Full Name</label>
                    <input required data-testid="input-full-name" value={form.full_name} onChange={(e) => update("full_name", e.target.value)} placeholder="Jane Doe" className="input-field" />
                  </div>
                  <div>
                    <label className="field-label">Business Email</label>
                    <input required type="email" data-testid="input-email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="jane.doe@enterprise.com" className="input-field" />
                  </div>
                  <div>
                    <label className="field-label">Company</label>
                    <input required data-testid="input-company" value={form.company} onChange={(e) => update("company", e.target.value)} placeholder="Enterprise Ltd." className="input-field" />
                  </div>
                  <div>
                    <label className="field-label">Executive Role</label>
                    <input data-testid="input-role" value={form.role} onChange={(e) => update("role", e.target.value)} placeholder="CHRO, CPO, VP People…" className="input-field" />
                  </div>

                  <div>
                    <label className="field-label">Organisation Size</label>
                    <select data-testid="select-employees" value={form.employees} onChange={(e) => update("employees", e.target.value)} className="input-field">
                      {EMPLOYEE_BANDS.map((b) => <option key={b}>{b}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="field-label">Primary Interest</label>
                    <select data-testid="select-interest" value={form.interest} onChange={(e) => update("interest", e.target.value)} className="input-field">
                      {INTERESTS.map((i) => <option key={i}>{i}</option>)}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="field-label">Context (Optional)</label>
                    <textarea
                      data-testid="input-message"
                      value={form.message}
                      onChange={(e) => update("message", e.target.value)}
                      rows={4}
                      placeholder="Where is your People organisation today? What outcome would define success?"
                      className="input-field resize-none"
                    />
                  </div>
                </div>

                {/* Calendar slot picker */}
                <div className="mt-10 pt-8 border-t border-[color:var(--hairline)]" data-testid="slot-picker">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="rule-label"><span>Pick a slot</span></span>
                      <p className="text-[13px] text-[color:var(--muted)] mt-2 max-w-md">Choose a preferred time. Slots are held provisionally — we will confirm within 24 hours.</p>
                    </div>
                    <Calendar size={20} className="text-[color:var(--gold)]" strokeWidth={1.5} />
                  </div>

                  {slots.length === 0 ? (
                    <p className="text-[13px] text-[color:var(--muted)]">Loading available slots…</p>
                  ) : (
                    <div className="space-y-4">
                      {Object.entries(grouped).map(([day, list]) => (
                        <div key={day} className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-4 items-center">
                          <div className="font-mono-brand text-[11px] tracking-[0.2em] uppercase text-[color:var(--muted)]">{day}</div>
                          <div className="flex flex-wrap gap-2">
                            {list.map((s) => {
                              const selected = slotIso === s.iso;
                              return (
                                <button
                                  key={s.iso}
                                  type="button"
                                  data-testid={`slot-${s.iso}`}
                                  onClick={() => setSlotIso(selected ? null : s.iso)}
                                  className={`px-4 py-2 border text-[13px] transition-all ${
                                    selected
                                      ? "bg-[color:var(--ink)] text-[color:var(--gold)] border-[color:var(--ink)]"
                                      : "bg-white border-[color:var(--hairline-strong)] text-[color:var(--ink)] hover:border-[color:var(--ink)]"
                                  }`}
                                >
                                  {s.time_label}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <p className="text-[11px] text-[color:var(--muted)] mt-4 font-mono-brand tracking-wider uppercase">Slot optional — we&rsquo;ll propose alternatives if left blank</p>
                </div>

                <div className="mt-8 flex flex-col md:flex-row md:items-center gap-4 justify-between">
                  <p className="text-[12px] text-[color:var(--muted)] max-w-sm">
                    We use your details only to prepare your diagnostic session. Nothing sold, ever.
                  </p>
                  <button
                    type="submit"
                    disabled={submitting}
                    data-testid="contact-submit"
                    className="btn-ink disabled:opacity-60"
                  >
                    {submitting ? "Submitting…" : (<>Request Diagnostic <ArrowUpRight size={16} className="arrow" /></>)}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
