import { Link } from "react-router-dom";
import { useState } from "react";
import { ArrowUpRight, Mail } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function Footer() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setBusy(true);
    try {
      await axios.post(`${API}/newsletter`, { email });
      toast.success("Subscribed. Executive insights are on the way.");
      setEmail("");
    } catch (err) {
      toast.error("Could not subscribe. Please check the email and try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <footer className="ink-block relative" data-testid="site-footer">
      <div className="container-mag pt-20 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-[color:var(--bone)] px-3 py-2 inline-flex items-center justify-center">
                <img src="/brand/logo.png" alt="Magnrey Consulting" className="h-8 w-auto object-contain" />
              </div>
            </div>
            <p className="font-serif-display italic text-2xl leading-snug max-w-md text-[color:var(--bone)]">
              Transformation, led by <span className="text-[color:var(--gold)]">experience.</span>
            </p>
            <p className="text-white/60 mt-6 max-w-md text-[15px] leading-relaxed">
              A boutique advisory reimagining the People Function around AI-native architecture — engaged peer-to-peer with the C-suite.
            </p>

            <form onSubmit={submit} className="mt-8 max-w-md" data-testid="footer-newsletter">
              <span className="field-label">Executive Newsletter</span>
              <div className="flex items-stretch gap-2">
                <input
                  data-testid="footer-newsletter-input"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@enterprise.com"
                  className="input-field flex-1"
                />
                <button
                  data-testid="footer-newsletter-submit"
                  type="submit"
                  disabled={busy}
                  className="btn-gold disabled:opacity-60"
                >
                  {busy ? "…" : <ArrowUpRight size={16} />}
                </button>
              </div>
              <p className="text-[11px] text-white/40 mt-2 font-mono-brand tracking-wider uppercase">Quarterly briefings · No noise</p>
            </form>
          </div>

          <div className="lg:col-span-2">
            <span className="field-label">Practice</span>
            <ul className="space-y-2 mt-3 text-[14px]">
              <li><Link to="/services" className="text-white/70 hover:text-[color:var(--gold)] editorial-link">Services</Link></li>
              <li><Link to="/framework" className="text-white/70 hover:text-[color:var(--gold)] editorial-link">Framework</Link></li>
              <li><Link to="/why-us" className="text-white/70 hover:text-[color:var(--gold)] editorial-link">Why Us</Link></li>
              <li><Link to="/about" className="text-white/70 hover:text-[color:var(--gold)] editorial-link">About</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <span className="field-label">Intelligence</span>
            <ul className="space-y-2 mt-3 text-[14px]">
              <li><Link to="/case-studies" className="text-white/70 hover:text-[color:var(--gold)] editorial-link">Case Studies</Link></li>
              <li><Link to="/insights" className="text-white/70 hover:text-[color:var(--gold)] editorial-link">Insights</Link></li>
              <li><Link to="/contact" className="text-white/70 hover:text-[color:var(--gold)] editorial-link">Contact</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <span className="field-label">Direct</span>
            <a
              href="mailto:assist@magnrey.com"
              data-testid="footer-email-link"
              className="mt-3 flex items-center gap-2 text-[color:var(--bone)] hover:text-[color:var(--gold)] text-[15px]"
            >
              <Mail size={14} /> assist@magnrey.com
            </a>
            <p className="text-white/50 text-[13px] mt-4 leading-relaxed">
              Every partnership begins with a 45-minute diagnostic conversation. No obligation. Senior-led from day one.
            </p>
            <Link to="/contact" data-testid="footer-cta-book" className="btn-outline mt-6 !border-white/25 !text-[color:var(--bone)] hover:!bg-[color:var(--gold)] hover:!text-[color:var(--ink)] hover:!border-[color:var(--gold)]">
              Book 45-Min Diagnostic <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>

        <div className="rule-label mt-16"><span>MMXXVI — Magnrey Consulting</span></div>

        <div className="mt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-[12px] text-white/45">
          <p>© {new Date().getFullYear()} Magnrey Consulting. Boutique by design. Global by discipline.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white/80">Privacy</a>
            <a href="#" className="hover:text-white/80">Terms</a>
            <a href="mailto:assist@magnrey.com" className="hover:text-[color:var(--gold)]">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
