import { useEffect, useState } from "react";
import axios from "axios";
import { PageHero, Eyebrow } from "@/components/Primitives";
import { X, ArrowUpRight } from "lucide-react";
import { toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function Insights() {
  const [items, setItems] = useState([]);
  const [active, setActive] = useState(null);
  const [category, setCategory] = useState("All");
  const [email, setEmail] = useState("");
  const [subbing, setSubbing] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await axios.get(`${API}/insights`);
      setItems(res.data.insights || []);
    })();
  }, []);

  const categories = ["All", ...Array.from(new Set(items.map((i) => i.category)))];
  const filtered = category === "All" ? items : items.filter((i) => i.category === category);

  const subscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setSubbing(true);
    try {
      await axios.post(`${API}/newsletter`, { email });
      toast.success("Subscribed. Executive insights are on the way.");
      setEmail("");
    } catch {
      toast.error("Could not subscribe. Try again.");
    } finally {
      setSubbing(false);
    }
  };

  return (
    <div data-testid="page-insights">
      <PageHero
        kicker="006 — Insights"
        eyebrow="Thought Leadership"
        title="Field notes from"
        italicTail="the transformation front line."
        description="Perspective built from decades of enterprise mandates — written for CHROs, Chief People Officers, and executive committee members navigating AI-native change."
      />

      <section className="py-14 md:py-16 border-b border-[color:var(--hairline)]">
        <div className="container-mag">
          <div className="flex flex-wrap gap-2" data-testid="insights-filters">
            {categories.map((c) => (
              <button
                key={c}
                data-testid={`filter-${c.toLowerCase().replace(/\s+/g, "-")}`}
                onClick={() => setCategory(c)}
                className={`px-4 py-2 text-[12px] font-mono-brand tracking-[0.18em] uppercase border transition-colors ${
                  category === c
                    ? "bg-[color:var(--ink)] text-[color:var(--gold)] border-[color:var(--ink)]"
                    : "border-[color:var(--hairline-strong)] text-[color:var(--muted)] hover:text-[color:var(--ink)]"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container-mag grid grid-cols-1 md:grid-cols-2 gap-8">
          {filtered.map((it, i) => (
            <article key={it.id} data-testid={`insight-card-${it.id}`} className="border-t border-[color:var(--ink)] pt-8 group">
              <div className="flex items-center justify-between">
                <span className="eyebrow">{it.category}</span>
                <span className="font-mono-brand text-[11px] text-[color:var(--muted)]">
                  {it.read_minutes} min · {new Date(it.date).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}
                </span>
              </div>
              <h3 className="font-serif-display text-3xl md:text-4xl mt-6 leading-[1.1] text-[color:var(--ink)]">{it.title}</h3>
              <p className="text-[15px] text-[color:var(--muted)] mt-4 leading-relaxed">{it.excerpt}</p>
              <div className="mt-6 flex items-center justify-between">
                <span className="text-[13px] text-[color:var(--muted)]">{it.author}</span>
                <button
                  data-testid={`insight-read-${it.id}`}
                  onClick={() => setActive(it)}
                  className="editorial-link text-[13px] font-semibold text-[color:var(--ink)]"
                >
                  Read essay <ArrowUpRight size={14} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="ink-block py-20 md:py-24">
        <div className="container-mag grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7">
            <Eyebrow>Executive Newsletter</Eyebrow>
            <h2 className="font-serif-display text-3xl md:text-5xl mt-4 leading-tight text-[color:var(--bone)]">
              Quarterly briefings for the People executive.
            </h2>
            <p className="text-white/70 mt-4 max-w-lg">One considered piece per quarter. No promotional noise. Sent from the founding partner directly.</p>
          </div>
          <div className="lg:col-span-5">
            <form onSubmit={subscribe} className="flex gap-2" data-testid="insights-newsletter">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@enterprise.com"
                data-testid="insights-newsletter-input"
                className="input-field flex-1"
              />
              <button data-testid="insights-newsletter-submit" type="submit" disabled={subbing} className="btn-gold disabled:opacity-60">
                {subbing ? "…" : <>Subscribe <ArrowUpRight size={14} /></>}
              </button>
            </form>
          </div>
        </div>
      </section>

      {active && (
        <div className="fixed inset-0 z-[60] bg-[color:var(--ink)]/50 backdrop-blur-sm flex justify-end" onClick={() => setActive(null)}>
          <div className="w-full max-w-2xl bg-[color:var(--paper)] h-full overflow-y-auto" onClick={(e) => e.stopPropagation()} data-testid="insight-drawer">
            <div className="sticky top-0 bg-[color:var(--paper)] border-b border-[color:var(--hairline)] px-8 py-5 flex items-center justify-between">
              <span className="eyebrow">{active.category} · {active.read_minutes} min</span>
              <button data-testid="insight-drawer-close" onClick={() => setActive(null)} className="p-2 border border-[color:var(--hairline-strong)]"><X size={16} /></button>
            </div>
            <div className="px-8 py-10">
              <h2 className="font-serif-display text-3xl md:text-4xl leading-tight text-[color:var(--ink)]">{active.title}</h2>
              <p className="text-[13px] text-[color:var(--muted)] mt-4 font-mono-brand tracking-wider uppercase">
                By {active.author} · {new Date(active.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
              </p>
              <p className="text-[17px] leading-[1.8] text-[color:var(--ink)] mt-8 font-serif-display italic">{active.excerpt}</p>
              <p className="text-[15px] leading-[1.85] text-[color:var(--muted)] mt-6">{active.body}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
