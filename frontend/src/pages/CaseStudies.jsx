import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { PageHero, Eyebrow } from "@/components/Primitives";
import { Link } from "react-router-dom";
import { ArrowUpRight, X } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function CaseStudies() {
  const [cases, setCases] = useState([]);
  const [active, setActive] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sector, setSector] = useState("All Sectors");
  const [engagement, setEngagement] = useState("All Engagements");

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${API}/case-studies`);
        setCases(res.data.case_studies || []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const sectors = useMemo(() => ["All Sectors", ...Array.from(new Set(cases.map((c) => c.sector)))], [cases]);
  const engagements = useMemo(() => ["All Engagements", ...Array.from(new Set(cases.map((c) => c.engagement)))], [cases]);

  const filtered = cases.filter((c) =>
    (sector === "All Sectors" || c.sector === sector) &&
    (engagement === "All Engagements" || c.engagement === engagement)
  );

  const resetFilters = () => { setSector("All Sectors"); setEngagement("All Engagements"); };

  return (
    <div data-testid="page-case-studies">
      <PageHero
        eyebrow="Case Studies"
        title="Success."
        italicTail="Delivered."
        description="We have partnered with our clients to deliver business outcomes — proof of what disciplined AI and Digital transformation delivers when it's led by practitioners."
      />

      <section className="py-10 border-b border-[color:var(--hairline)]">
        <div className="container-mag grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-4 items-end">
          <div>
            <label className="field-label">Sector</label>
            <select
              data-testid="case-filter-sector"
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              className="input-field"
            >
              {sectors.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="field-label">Engagement Type</label>
            <select
              data-testid="case-filter-engagement"
              value={engagement}
              onChange={(e) => setEngagement(e.target.value)}
              className="input-field"
            >
              {engagements.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-mono-brand text-[11px] tracking-[0.2em] uppercase text-[color:var(--muted)]">
              {filtered.length} of {cases.length}
            </span>
            {(sector !== "All Sectors" || engagement !== "All Engagements") && (
              <button
                data-testid="case-filter-reset"
                onClick={resetFilters}
                className="text-[12px] font-mono-brand tracking-[0.18em] uppercase text-[color:var(--ink)] hover:text-[color:var(--gold)]"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container-mag">
          {loading ? (
            <div className="text-[color:var(--muted)]">Loading dossiers…</div>
          ) : filtered.length === 0 ? (
            <div className="border border-dashed border-[color:var(--hairline-strong)] p-16 text-center" data-testid="case-empty">
              <Eyebrow>No dossiers matched</Eyebrow>
              <h3 className="font-serif-display text-2xl md:text-3xl mt-4 text-[color:var(--ink)]">Nothing in this combination.</h3>
              <p className="text-[color:var(--muted)] mt-3 text-[14px]">Try widening the filters or reset to see every mandate.</p>
              <button onClick={resetFilters} className="btn-ink mt-6">Reset filters <ArrowUpRight size={14} /></button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filtered.map((c, i) => (
                <button
                  key={c.id}
                  data-testid={`case-card-${c.id}`}
                  onClick={() => setActive(c)}
                  className="card-editorial text-left group"
                >
                  <div className="flex items-center justify-between">
                    <span className="eyebrow">Case Study · 0{i + 1}</span>
                    <ArrowUpRight size={18} className="text-[color:var(--muted)] group-hover:text-[color:var(--gold)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </div>
                  <h3 className="font-serif-display text-2xl md:text-3xl mt-6 leading-tight text-[color:var(--ink)]">{c.headline}</h3>
                  <p className="text-[14px] text-[color:var(--muted)] mt-4 leading-relaxed">{c.challenge}</p>
                  <div className="mt-8 pt-6 border-t border-[color:var(--hairline)] grid grid-cols-3 gap-4">
                    <div><div className="font-mono-brand text-[10px] tracking-[0.22em] uppercase text-[color:var(--muted)]">Sector</div><div className="text-[13px] text-[color:var(--ink)] mt-1">{c.sector}</div></div>
                    <div><div className="font-mono-brand text-[10px] tracking-[0.22em] uppercase text-[color:var(--muted)]">Scope</div><div className="text-[13px] text-[color:var(--ink)] mt-1">{c.employees} · {c.geography}</div></div>
                    <div><div className="font-mono-brand text-[10px] tracking-[0.22em] uppercase text-[color:var(--muted)]">Duration</div><div className="text-[13px] text-[color:var(--ink)] mt-1">{c.duration}</div></div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {active && (
        <div
          data-testid="case-drawer"
          className="fixed inset-0 z-[60] bg-[color:var(--ink)]/50 backdrop-blur-sm flex justify-end"
          onClick={() => setActive(null)}
        >
          <div
            className="w-full max-w-2xl bg-[color:var(--paper)] h-full overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-[color:var(--paper)] border-b border-[color:var(--hairline)] px-8 py-5 flex items-center justify-between">
              <span className="eyebrow">{active.engagement}</span>
              <button data-testid="case-drawer-close" onClick={() => setActive(null)} className="p-2 border border-[color:var(--hairline-strong)]">
                <X size={16} />
              </button>
            </div>
            <div className="px-8 py-10">
              <h2 className="font-serif-display text-3xl md:text-4xl leading-tight text-[color:var(--ink)]">{active.headline}</h2>
              <div className="grid grid-cols-3 gap-4 mt-8 border-y border-[color:var(--hairline)] py-6">
                <div><div className="font-mono-brand text-[10px] tracking-[0.22em] uppercase text-[color:var(--muted)]">Sector</div><div className="text-[13px] text-[color:var(--ink)] mt-1">{active.sector}</div></div>
                <div><div className="font-mono-brand text-[10px] tracking-[0.22em] uppercase text-[color:var(--muted)]">Scope</div><div className="text-[13px] text-[color:var(--ink)] mt-1">{active.employees} · {active.geography}</div></div>
                <div><div className="font-mono-brand text-[10px] tracking-[0.22em] uppercase text-[color:var(--muted)]">Duration</div><div className="text-[13px] text-[color:var(--ink)] mt-1">{active.duration}</div></div>
              </div>

              <div className="mt-8">
                <div className="rule-label mb-3"><span>The Challenge</span></div>
                <p className="text-[15px] leading-relaxed text-[color:var(--muted)]">{active.challenge}</p>
              </div>
              <div className="mt-8">
                <div className="rule-label mb-3"><span>Our Approach</span></div>
                <p className="text-[15px] leading-relaxed text-[color:var(--muted)]">{active.approach}</p>
              </div>
              <div className="mt-8">
                <div className="rule-label mb-3"><span>Verified Outcomes</span></div>
                <ul className="space-y-3">
                  {active.outcomes.map((o) => (
                    <li key={o} className="flex gap-3 text-[15px] text-[color:var(--ink)]">
                      <span className="text-[color:var(--gold)]">✦</span> {o}
                    </li>
                  ))}
                </ul>
              </div>
              <Link to="/contact" className="btn-ink mt-10">
                Discuss a similar mandate <ArrowUpRight size={16} className="arrow" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
