import { PageHero, Eyebrow } from "@/components/Primitives";
import { Link } from "react-router-dom";
import { ArrowUpRight, Compass, Workflow, ShieldCheck } from "lucide-react";

const SERVICES = [
  {
    id: "advisory",
    icon: Compass,
    tag: "Advisory · 01",
    title: "AI & Digital Advisory",
    lede: "We formulate AI-native strategies, select high-performance technology stacks, and orchestrate partner ecosystems to drive scalable enterprise growth.",
    outcomes: [
      "AI ROI supported by long-term Digital architecture",
      "Technology positioned as competitive differentiator, not cost centre",
      "Structured roadmap for digital maturity acceleration",
      "Executive-ready investment cases and value-driver trees",
    ],
    deliverables: [
      "Enterprise AI strategy & North Star",
      "Digital operating-model diagnostic",
      "Vendor & platform selection frameworks",
      "Partner ecosystem orchestration model",
    ],
  },
  {
    id: "project",
    icon: Workflow,
    tag: "Delivery · 02",
    title: "Project Advisory",
    lede: "We engineer future-state operating models, optimise functional processes, and direct large-scale digital transformations — acting as the strategic anchor for all internal and external stakeholders throughout delivery.",
    outcomes: [
      "Unified delivery ecosystem across internal & external stakeholders",
      "Internal expertise fused with senior transformation experience",
      "Programme governance de-risking multi-vendor engagements",
      "Executive-grade risk, dependency and outcome tracking",
    ],
    deliverables: [
      "Target Operating Model design",
      "Global programme governance & PMO uplift",
      "Change & readiness architecture",
      "Value realisation instrumentation",
    ],
  },
  {
    id: "systems",
    icon: ShieldCheck,
    tag: "Systems · 03",
    title: "Systems Implementation",
    lede: "We execute end-to-end HR platform deployments — including Dayforce and Workday — establishing a high-integrity data core across the employee lifecycle with global operational stability and seamless transitions.",
    outcomes: [
      "Robust, scalable Digital foundation across regulatory environments",
      "AI-scalable data core across the employee lifecycle",
      "Global operational stability during and after transition",
      "Compliance & audit posture strengthened post go-live",
    ],
    deliverables: [
      "Workday & Dayforce global deployment leadership",
      "Data migration, integration & governance architecture",
      "Cross-jurisdictional payroll & compliance uplift",
      "Post go-live hyper-care & value realisation loops",
    ],
  },
];

export default function Services() {
  return (
    <div data-testid="page-services">
      <PageHero
        kicker="003 — Services"
        eyebrow="What We Do"
        title="Three integrated capabilities."
        italicTail="One senior-led operating model."
        description="A boutique practice built to deliver AI-native transformation from strategy through to operational reality — with the discipline of tier-one delivery and the intimacy of a boutique."
      />

      {SERVICES.map((s, i) => (
        <section
          key={s.id}
          id={s.id}
          data-testid={`service-detail-${s.id}`}
          className={`py-20 md:py-28 border-b border-[color:var(--hairline)] ${i % 2 === 1 ? "bg-[color:var(--paper-2)]" : ""}`}
        >
          <div className="container-mag grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-5">
              <div className="w-14 h-14 border border-[color:var(--ink)] flex items-center justify-center text-[color:var(--ink)]">
                <s.icon size={22} strokeWidth={1.5} />
              </div>
              <Eyebrow className="mt-6">{s.tag}</Eyebrow>
              <h2 className="font-serif-display text-4xl md:text-5xl mt-4 leading-[1.05] text-[color:var(--ink)]">{s.title}</h2>
              <p className="text-[16px] leading-relaxed text-[color:var(--muted)] mt-6 max-w-md">{s.lede}</p>
              <Link to="/contact" className="btn-ink mt-8">
                Discuss this practice <ArrowUpRight size={16} className="arrow" />
              </Link>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-10">
              <div>
                <span className="rule-label mb-5"><span>Outcomes</span></span>
                <ul className="space-y-4">
                  {s.outcomes.map((o) => (
                    <li key={o} className="flex gap-3 text-[14.5px] leading-relaxed text-[color:var(--ink)]">
                      <span className="font-serif-display text-[color:var(--gold)] leading-none">✦</span>
                      <span>{o}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <span className="rule-label mb-5"><span>Deliverables</span></span>
                <ul className="space-y-4">
                  {s.deliverables.map((o) => (
                    <li key={o} className="flex gap-3 text-[14.5px] leading-relaxed text-[color:var(--muted)]">
                      <span className="font-mono-brand text-[color:var(--gold)] text-xs">■</span>
                      <span>{o}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      ))}

      <section className="py-24 md:py-32 bg-[color:var(--paper)]">
        <div className="container-mag text-center max-w-3xl mx-auto">
          <Eyebrow>Engagement</Eyebrow>
          <h2 className="font-serif-display text-4xl md:text-6xl mt-6 text-[color:var(--ink)] leading-tight">
            Every mandate begins with a
            <br />
            <em className="italic text-[color:var(--gold)]">45-minute diagnostic.</em>
          </h2>
          <p className="text-[color:var(--muted)] mt-6 leading-relaxed">
            No obligation. No junior handoffs. You speak directly with a senior practitioner from day one.
          </p>
          <Link to="/contact" className="btn-ink mt-10">
            Book Diagnostic <ArrowUpRight size={16} className="arrow" />
          </Link>
        </div>
      </section>
    </div>
  );
}
