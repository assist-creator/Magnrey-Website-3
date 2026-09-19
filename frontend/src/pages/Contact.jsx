import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { PageHero, Eyebrow } from "@/components/Primitives";
import { ArrowUpRight, Mail, Clock, ShieldCheck, CheckCircle2 } from "lucide-react";

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
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post(`${API}/leads`, form);
      toast.success("Received. A senior practitioner will be in touch within 48 hours.");
      setDone(true);
    } catch (err) {
      const msg = err?.response?.data?.detail?.[0]?.msg || "Something went wrong. Please try again or email us directly.";
      toast.error(typeof msg === "string" ? msg : "Please review the form and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div data-testid="page-contact">
      <PageHero
        kicker="008 — Begin the Conversation"
        eyebrow="How to Engage"
        title="Begin with a 45-minute"
        italicTail="diagnostic conversation."
        description="Every partnership begins here. This precision-focused session allows us to understand your current digital maturity and identify the high-impact AI opportunities that will move the needle for your People organisation. No obligation. No junior handoffs."
      />

      <section className="py-16 md:py-24">
        <div className="container-mag grid grid-cols-1 lg:grid-cols-12 gap-12">
          <aside className="lg:col-span-4 order-2 lg:order-1">
            <div className="rule-label mb-6"><span>Direct</span></div>
            <a href="mailto:enquiry@magnrey.com" data-testid="contact-email" className="flex items-center gap-3 text-[color:var(--ink)] hover:text-[color:var(--gold)] transition-colors">
              <Mail size={18} strokeWidth={1.5} />
              <span className="font-serif-display text-2xl">enquiry@magnrey.com</span>
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
                <p className="text-white/70 mt-6 max-w-lg">
                  A senior practitioner will review your context and respond within 48 hours to schedule your diagnostic session. In the interim, feel free to explore our framework or recent field notes.
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
                      rows={5}
                      placeholder="Where is your People organisation today? What outcome would define success?"
                      className="input-field resize-none"
                    />
                  </div>
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
