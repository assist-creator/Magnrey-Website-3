import { useState } from "react";
import { PageHero, Eyebrow } from "@/components/Primitives";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

const STAGES = [
  {
    no: "01",
    key: "immersion",
    title: "The Immersion",
    sub: "Strategic Alignment & Risk Scan",
    body: "A precision intelligence scan to anchor technical potential in organisational reality. We establish a 'North Star' supported by strict ethical, privacy, and compliance guardrails, audit data readiness for agentic deployment, and isolate high-velocity opportunities to deliver rapid, measurable ROI.",
    outputs: ["North Star strategy brief", "Data & ethical readiness audit", "AI value-driver map", "High-velocity opportunity portfolio"],
  },
  {
    no: "02",
    key: "blueprint",
    title: "The Blueprint",
    sub: "Operating Model Engineering",
    body: "We architect a future-state operating model designed for seamless human–AI collaboration. By deconstructing legacy processes, we identify high-impact transitions to agentic workflows and deliver a Target Operating Model (TOM) that elevates the People Function to a driver of enterprise-wide strategic intelligence.",
    outputs: ["Target Operating Model (TOM)", "Human–AI workflow topology", "Capability & role architecture", "Governance & decision-rights framework"],
  },
  {
    no: "03",
    key: "sequence",
    title: "The Sequence",
    sub: "Roadmap & Capability Strategy",
    body: "We prioritise AI 'Value Drops' against technical dependencies to ensure a balanced delivery of immediate gains and long-term infrastructure hardening. We synchronise the technical build with a workforce upskilling strategy, bridging capability gaps to ensure human evolution matches technical velocity.",
    outputs: ["Value-drop sequencing plan", "Technical dependency map", "Workforce capability roadmap", "Financial envelope & benefits schedule"],
  },
  {
    no: "04",
    key: "build",
    title: "The Build & Deploy",
    sub: "Disciplined Execution & Readiness",
    body: "We lead the agile integration of AI capabilities and the configuration of digital ecosystems, governed by a rigorous focus on risks, dependencies, and business outcomes. Parallel to the technical build, we execute a comprehensive deployment strategy including organisational readiness, transition support, and hands-on capability building.",
    outputs: ["Configured platform (Workday / Dayforce)", "AI capability integration", "Cutover & hyper-care plan", "Readiness & capability build programme"],
  },
  {
    no: "05",
    key: "evolve",
    title: "The Evolve & Pulse",
    sub: "Value Realisation & Performance",
    body: "We transition the engagement into a cycle of continuous performance optimisation and cultural alignment. We implement feedback loops for AI refinement and system health, measuring outcomes against diagnostic benchmarks to track ongoing ROI and secure the long-term elevation of the People Function.",
    outputs: ["Value realisation dashboard", "AI model refinement loops", "Cultural adoption index", "Executive value council rhythm"],
  },
];

export default function Framework() {
  const [active, setActive] = useState(0);
  const s = STAGES[active];
  return (
    <div data-testid="page-framework">
      <PageHero
        eyebrow="How We Deliver Success"
        title="Tailored Approach."
        italicTail="Proven Method."
        description="Our delivery model is built on co-design and co-delivery. We don&rsquo;t deliver to you; we build with you. Five disciplined stages, engineered to translate AI ambition into verifiable enterprise value."
      />

      <section className="py-16 md:py-24">
        <div className="container-mag grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Stage rail */}
          <div className="lg:col-span-4">
            <div className="rule-label mb-6"><span>Stages</span></div>
            <div className="flex flex-col">
              {STAGES.map((st, i) => (
                <button
                  key={st.key}
                  data-testid={`framework-stage-${st.key}`}
                  onClick={() => setActive(i)}
                  className={`text-left py-5 border-t border-[color:var(--hairline)] transition-colors group ${
                    i === active ? "bg-[color:var(--ink)] text-[color:var(--bone)] px-4" : "hover:pl-2 pl-0"
                  }`}
                >
                  <div className="flex items-center gap-6">
                    <span className={`font-mono-brand text-[11px] tracking-[0.24em] ${i === active ? "text-[color:var(--gold)]" : "text-[color:var(--muted)]"}`}>
                      {st.no}
                    </span>
                    <div className="flex-1">
                      <div className={`font-serif-display text-xl md:text-2xl ${i === active ? "text-[color:var(--bone)]" : "text-[color:var(--ink)]"}`}>
                        {st.title}
                      </div>
                      <div className={`text-[12px] mt-1 ${i === active ? "text-[color:var(--gold)]" : "text-[color:var(--muted)]"}`}>{st.sub}</div>
                    </div>
                    <ArrowUpRight size={16} className={i === active ? "text-[color:var(--gold)]" : "text-[color:var(--muted)]"} />
                  </div>
                </button>
              ))}
              <div className="border-t border-[color:var(--hairline)]" />
            </div>
          </div>

          {/* Detail panel */}
          <div className="lg:col-span-8" data-testid="framework-detail">
            <Eyebrow>Stage {s.no}</Eyebrow>
            <h2 className="font-serif-display text-4xl md:text-6xl mt-4 leading-[1.05] text-[color:var(--ink)]">{s.title}</h2>
            <p className="font-mono-brand text-[11px] tracking-[0.24em] uppercase text-[color:var(--gold)] mt-3">{s.sub}</p>
            <p className="text-[16px] md:text-[17px] leading-[1.75] text-[color:var(--muted)] mt-8">{s.body}</p>

            <div className="mt-12">
              <div className="rule-label mb-5"><span>Executive outputs</span></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {s.outputs.map((o) => (
                  <div key={o} className="border border-[color:var(--hairline)] p-4 flex items-start gap-3 bg-[color:var(--bone)]">
                    <span className="font-mono-brand text-[color:var(--gold)] text-xs mt-1">■</span>
                    <span className="text-[14px] text-[color:var(--ink)]">{o}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-14 flex items-center justify-between border-t border-[color:var(--hairline)] pt-6">
              <button
                data-testid="framework-prev"
                onClick={() => setActive((v) => Math.max(0, v - 1))}
                disabled={active === 0}
                className="text-[13px] font-mono-brand tracking-[0.2em] uppercase text-[color:var(--muted)] hover:text-[color:var(--ink)] disabled:opacity-30"
              >
                ← Previous stage
              </button>
              <button
                data-testid="framework-next"
                onClick={() => setActive((v) => Math.min(STAGES.length - 1, v + 1))}
                disabled={active === STAGES.length - 1}
                className="text-[13px] font-mono-brand tracking-[0.2em] uppercase text-[color:var(--ink)] hover:text-[color:var(--gold)] disabled:opacity-30"
              >
                Next stage →
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="ink-block py-20">
        <div className="container-mag flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <Eyebrow>Ready to begin</Eyebrow>
            <h3 className="font-serif-display text-3xl md:text-4xl text-[color:var(--bone)] mt-4">Start with a 45-minute diagnostic.</h3>
          </div>
          <Link to="/contact" data-testid="framework-cta" className="btn-gold">
            Book Diagnostic <ArrowUpRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
