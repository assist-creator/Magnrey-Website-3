import { Link } from "react-router-dom";
import { ArrowUpRight, Sparkles, Compass, Layers, Target, ShieldCheck, Cpu, Workflow } from "lucide-react";
import { Eyebrow, SectionHead, StatMonolith } from "@/components/Primitives";

const PILLARS = [
  { icon: Sparkles, no: "01", title: "Boutique by Design", body: "Senior-led engagements with high-touch, customised delivery. No junior consultants. No off-the-shelf models." },
  { icon: Cpu, no: "02", title: "AI-Native Thinking", body: "We redesign work and workforce around AI-native architecture to elevate the People Function to a primary driver of enterprise value." },
  { icon: Target, no: "03", title: "Outcome-Oriented", body: "Measurable ROI and long-term organisational stability. We prioritise value realisation over project volume." },
  { icon: Layers, no: "04", title: "End-to-End Expertise", body: "Capabilities across operating, process, system, data and compliance — from strategy to implementation." },
];

const STAGES = [
  { no: "01", key: "immersion", title: "The Immersion", sub: "Strategic Alignment & Risk Scan", body: "A precision intelligence scan to anchor technical potential in organisational reality. We set a North Star with strict ethical, privacy and compliance guardrails." },
  { no: "02", key: "blueprint", title: "The Blueprint", sub: "Operating Model Engineering", body: "A future-state operating model designed for seamless human–AI collaboration. Legacy processes are deconstructed; high-impact transitions to agentic workflows are identified." },
  { no: "03", key: "sequence", title: "The Sequence", sub: "Roadmap & Capability Strategy", body: "We prioritise AI ‘Value Drops’ against technical dependencies. The technical build is synchronised with a workforce upskilling strategy." },
  { no: "04", key: "build", title: "The Build & Deploy", sub: "Disciplined Execution & Readiness", body: "Agile integration of AI capabilities and configuration of digital ecosystems, governed by rigorous focus on risks, dependencies and business outcomes." },
  { no: "05", key: "evolve", title: "The Evolve & Pulse", sub: "Value Realisation & Performance", body: "A cycle of continuous performance optimisation and cultural alignment. Feedback loops for AI refinement track ROI and long-term elevation of the People Function." },
];

const SERVICES = [
  { icon: Compass, tag: "Advisory", title: "AI & Digital Advisory", body: "AI-native strategies, high-performance technology-stack selection, and partner-ecosystem orchestration — accelerating digital maturity via structured roadmaps." },
  { icon: Workflow, tag: "Delivery", title: "Project Advisory", body: "Future-state operating-model engineering, functional-process optimisation, and direction of large-scale digital transformations — anchoring stakeholder alignment." },
  { icon: ShieldCheck, tag: "Systems", title: "Systems Implementation", body: "End-to-end HR platform deployments — including Dayforce and Workday — establishing a high-integrity data core across the employee lifecycle." },
];

export default function Home() {
  return (
    <div data-testid="page-home">
      {/* HERO */}
      <section className="relative pt-32 md:pt-40 pb-20 md:pb-28 overflow-hidden">
        <div className="container-mag">
          <div className="rule-label mb-10 rise"><span>001 — AI · Digital · People Consulting</span></div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-end">
            <div className="lg:col-span-8">
              <Eyebrow testId="hero-eyebrow">Boutique Advisory · Est. MMXXVI</Eyebrow>
              <h1 className="font-serif-display font-normal tracking-[-0.02em] leading-[0.96] mt-8 text-[52px] sm:text-[68px] md:text-[92px] lg:text-[112px] text-[color:var(--ink)] rise rise-1">
                Transformation,
                <br />
                <span className="italic text-[color:var(--gold)]">led by experience.</span>
              </h1>
              <p className="mt-8 text-[17px] md:text-[19px] leading-[1.7] text-[color:var(--muted)] max-w-2xl rise rise-2">
                We redesign People organisations around AI-native architecture — with Digital infrastructure as the operational backbone, positioning the People Function as a primary driver of enterprise value.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-4 rise rise-3">
                <Link to="/contact" data-testid="hero-cta-book" className="btn-ink">
                  <span>Book 45-Min Diagnostic</span>
                  <ArrowUpRight size={16} className="arrow" />
                </Link>
                <Link to="/framework" data-testid="hero-cta-framework" className="btn-outline">
                  Explore Framework <ArrowUpRight size={14} />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-4 rise rise-4">
              <div className="ink-block relative p-8 md:p-10 border border-[color:var(--gold)]/30">
                <div className="flex items-center justify-between hairline-b pb-4 mb-6">
                  <span className="eyebrow">Performance Telemetry</span>
                  <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-[color:var(--gold)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--gold)] pulse-dot" /> Active
                  </span>
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="font-serif-display text-6xl md:text-7xl text-[color:var(--bone)] leading-none">25</span>
                  <span className="font-serif-display text-4xl text-[color:var(--gold)]">+</span>
                  <span className="font-mono-brand text-[11px] tracking-[0.24em] uppercase text-white/60 ml-2">Years</span>
                </div>
                <p className="text-white/60 text-[14px] mt-3">Global Strategic HR & AI Leadership Experience</p>
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div>
                    <div className="font-serif-display text-3xl text-[color:var(--bone)] leading-none">27</div>
                    <div className="font-mono-brand text-[10px] tracking-[0.24em] uppercase text-white/50 mt-2">Countries</div>
                  </div>
                  <div>
                    <div className="font-serif-display text-3xl text-[color:var(--bone)] leading-none">75<span className="text-[color:var(--gold)]">k</span>+</div>
                    <div className="font-mono-brand text-[10px] tracking-[0.24em] uppercase text-white/50 mt-2">Employees Reached</div>
                  </div>
                </div>
                <div className="mt-8 pt-6 border-t border-white/10">
                  <p className="font-serif-display italic text-[color:var(--bone)] text-[17px] leading-snug">
                    &ldquo;No junior handoffs. You speak directly with a senior practitioner from day one.&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stat strip */}
          <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-6">
            <StatMonolith value="18+" label="Years HR Transformation" sub="Founding Partner" />
            <StatMonolith value="27" label="Countries · JAPAC · EMEA · Americas" />
            <StatMonolith value="0" label="Junior Handoffs" sub="Senior-led every engagement" />
            <StatMonolith value="100%" label="Executive Delivery" />
          </div>
        </div>
      </section>

      {/* PILLARS */}
      <section className="bg-[color:var(--paper-2)] py-24 md:py-32 border-y border-[color:var(--hairline)]">
        <div className="container-mag">
          <SectionHead
            eyebrow="Core Advisory Architecture"
            title="Four Pillars of People-Centric AI"
            description="A boutique operating model engineered to translate AI ambition into verifiable enterprise value — engaged at senior leadership level from day one."
            actionHref="/why-us"
            actionLabel="Why Magnrey"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" data-testid="pillars-grid">
            {PILLARS.map((p, i) => (
              <div key={p.no} data-testid={`pillar-${p.no}`} className="card-editorial group">
                <div className="flex items-start justify-between">
                  <div className="w-11 h-11 border border-[color:var(--ink)] flex items-center justify-center text-[color:var(--ink)] group-hover:bg-[color:var(--ink)] group-hover:text-[color:var(--gold)] transition-colors">
                    <p.icon size={18} strokeWidth={1.5} />
                  </div>
                  <span className="font-mono-brand text-[11px] tracking-[0.24em] text-[color:var(--muted)]">PILLAR {p.no}</span>
                </div>
                <h3 className="font-serif-display text-[26px] leading-tight mt-8 text-[color:var(--ink)]">{p.title}</h3>
                <p className="text-[14.5px] leading-relaxed text-[color:var(--muted)] mt-4">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FRAMEWORK */}
      <section className="ink-block py-24 md:py-32">
        <div className="container-mag">
          <SectionHead
            dark
            eyebrow="The Delivery Engine"
            title="The Immersion-to-Evolve Framework"
            description="A rigorous six-stage protocol that converts AI deployment and Digital infrastructure into verifiable business outcomes. We don't deliver to you; we build with you."
            actionHref="/framework"
            actionLabel="Enter Framework"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-0 border-t border-white/10">
            {STAGES.map((s) => (
              <div
                key={s.key}
                data-testid={`framework-stage-${s.key}`}
                className="p-6 md:p-8 border-b lg:border-b-0 lg:border-r last:border-r-0 border-white/10 hover:bg-white/5 transition-colors group"
              >
                <span className="eyebrow block">{s.no}</span>
                <h3 className="font-serif-display text-2xl mt-4 text-[color:var(--bone)]">{s.title}</h3>
                <p className="font-mono-brand text-[10.5px] tracking-[0.2em] uppercase text-white/50 mt-2">{s.sub}</p>
                <p className="text-[13.5px] leading-relaxed text-white/70 mt-4">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-24 md:py-32">
        <div className="container-mag">
          <SectionHead
            eyebrow="Core Service Pillars"
            title="Three integrated capabilities."
            description="From strategy through to operational reality — a full-spectrum practice, unusually deep in AI-native HCM architecture."
            actionHref="/services"
            actionLabel="Full service brief"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SERVICES.map((s, i) => (
              <div key={s.title} data-testid={`service-${i}`} className="card-editorial flex flex-col justify-between min-h-[300px]">
                <div>
                  <span className="eyebrow">{s.tag}</span>
                  <h3 className="font-serif-display text-3xl mt-4 leading-tight">{s.title}</h3>
                  <p className="text-[14.5px] leading-relaxed text-[color:var(--muted)] mt-4">{s.body}</p>
                </div>
                <Link to="/services" className="editorial-link mt-8 text-[13px] font-semibold text-[color:var(--ink)]">
                  Read practice brief <ArrowUpRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOUNDER QUOTE */}
      <section className="bg-[color:var(--paper-2)] py-24 md:py-32 border-y border-[color:var(--hairline)]">
        <div className="container-mag">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
            <div className="md:col-span-4">
              <div className="aspect-[4/5] w-full overflow-hidden border border-[color:var(--hairline-strong)]">
                <img
                  data-testid="founder-portrait"
                  src="/brand/founder.webp"
                  alt="Rinnieta Chrestien, Founding Partner"
                  className="w-full h-full object-cover object-top grayscale hover:grayscale-0 transition-all duration-700"
                />
              </div>
            </div>
            <div className="md:col-span-8">
              <Eyebrow>Perspective from Leadership</Eyebrow>
              <blockquote className="font-serif-display italic text-[color:var(--ink)] text-3xl md:text-5xl leading-[1.15] mt-6">
                “We engage at senior leadership level — providing the strategic challenge and execution certainty that only those who have <span className="text-[color:var(--gold)] not-italic">done the work</span> can offer.”
              </blockquote>
              <div className="mt-10 flex items-center gap-4">
                <div className="w-10 h-px bg-[color:var(--ink)]" />
                <div>
                  <div className="font-semibold text-[color:var(--ink)]">Rinnieta Chrestien</div>
                  <div className="font-mono-brand text-[11px] tracking-[0.2em] uppercase text-[color:var(--muted)] mt-1">
                    Founding Partner · Former VP Human Resources, Salesforce
                  </div>
                </div>
              </div>
              <Link to="/about" data-testid="founder-more" className="editorial-link mt-8 text-[color:var(--ink)] text-[14px] font-semibold">
                Full profile <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA BAND */}
      <section className="py-24 md:py-32 bg-[color:var(--paper)]">
        <div className="container-mag">
          <div className="ink-block px-8 md:px-14 py-16 md:py-20 border border-[color:var(--gold)]/25">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
              <div className="lg:col-span-8">
                <Eyebrow>How to Engage</Eyebrow>
                <h2 className="font-serif-display text-4xl md:text-5xl lg:text-6xl leading-[1.05] mt-6 text-[color:var(--bone)]">
                  Begin the <em className="text-[color:var(--gold)] not-italic italic">conversation.</em>
                </h2>
                <p className="text-white/70 mt-6 max-w-xl text-[16px] leading-relaxed">
                  Every partnership begins with a 45-minute diagnostic. A precision-focused session to understand your digital maturity and identify the AI opportunities that will move the needle for your People organisation.
                </p>
              </div>
              <div className="lg:col-span-4 flex flex-col gap-3">
                <Link to="/contact" data-testid="cta-band-book" className="btn-gold justify-center">
                  Book 45-Min Diagnostic <ArrowUpRight size={16} />
                </Link>
                <a href="mailto:assist@magnrey.com" className="btn-outline !border-white/20 !text-[color:var(--bone)] justify-center hover:!bg-white/10">
                  assist@magnrey.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
