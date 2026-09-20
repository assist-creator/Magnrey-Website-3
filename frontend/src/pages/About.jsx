import { PageHero, Eyebrow } from "@/components/Primitives";
import { Link } from "react-router-dom";
import { ArrowUpRight, Target, Eye, Sparkles, Handshake, Linkedin } from "lucide-react";

const VALUES = [
  {
    icon: Target,
    title: "Strategic Precision & Actionable Insight",
    body: "Strategy without execution is just theory. Every solution is grounded in data-backed analysis and designed for real-world implementation — delivering measurable, quantifiable ROI rather than abstract advice.",
  },
  {
    icon: Eye,
    title: "Integrity & Transparent Advisory",
    body: "Unbiased, honest guidance built on total clarity. Magnrey operates as an objective advisor focused entirely on the client's best interest, fostering deep trust, long-term alignment, and direct, candid communication.",
  },
  {
    icon: Sparkles,
    title: "Pragmatic & Future-Proof Innovation",
    body: "Adaptability tailored to each business environment — embracing modern tools and methodologies without losing sight of fundamental business mechanics — to equip organisations with sustainable, scalable solutions built to endure market shifts.",
  },
  {
    icon: Handshake,
    title: "Collaborative Ownership & Partnership",
    body: "Working alongside client teams as an embedded partner rather than an external observer, ensuring seamless knowledge transfer, team alignment, and internal capability building beyond project completion.",
  },
];

const EXPERTISE_GROUPS = [
  {
    title: "AI & HR Digital Transformation",
    items: [
      ["Agentic & Generative AI Integration", "Implementing AI agents, automated agentic workflows, and workforce augmentation strategies to redesign modern work."],
      ["HCM Technology Platforms", "Strategy, execution, and optimisation across enterprise HR platforms, including Workday, Salesforce Service Cloud, and agentic platforms."],
      ["HR Products & Experience", "Enhancing employee experience through human-centred, AI-empowered digital solutions."],
    ],
  },
  {
    title: "Operating Model Strategy & Global Service Delivery",
    items: [
      ["HR Operating Model Design", "Transforming HR functions, establishing scalable HR operating models, and optimising global capability centers (GCCs)."],
      ["Global Operations at Scale", "Operationalising and localising enterprise HR policies across diverse international jurisdictions (27+ countries)."],
      ["Workforce & Location Strategy", "Strategic workforce planning, skill-mapping, and global location strategies for high-growth tech enterprises."],
    ],
  },
  {
    title: "Data Strategy, Governance & Compliance",
    items: [
      ["HR Analytics & Governance", "Establishing data strategies, advanced HR analytics, and robust governance models."],
      ["Global Regulatory Compliance", "Managing cross-border compliance, risk, and audit frameworks across SOX, GDPR, security, and statutory requirements."],
    ],
  },
  {
    title: "Executive Leadership & Change Management",
    items: [
      ["C-Suite Advisory & Stakeholder Engagement", "Trusted advisor to executive teams on organisational design, M&A integration, and leadership capability."],
      ["Large-Scale Change Management", "Guiding organisations through cultural transformation, shift-to-agentic mindsets, and complex change."],
      ["Global Team Leadership", "Championing high-performing, cross-cultural teams and fostering diverse, inclusive workforces."],
    ],
  },
];

export default function About() {
  return (
    <div data-testid="page-about">
      <PageHero
        kicker="007 — About"
        eyebrow="About Us"
        title="Practitioners."
        italicTail="Not career consultants."
        description="We have stood in your shoes. We bring the battle-tested insight required to move beyond theoretical strategy into sustainable, operational reality. At Magnrey Consulting, we bridge high-level strategy and operational execution and empower organisations to navigate complex business landscapes."
      />

      <section className="py-20 md:py-28">
        <div className="container-mag">
          <Eyebrow>Core Value Pillars</Eyebrow>
          <h2 className="font-serif-display text-3xl md:text-5xl mt-4 text-[color:var(--ink)] leading-tight max-w-2xl">
            What we hold ourselves to.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-14" data-testid="about-values">
            {VALUES.map((v, i) => (
              <div key={v.title} data-testid={`about-value-${i}`} className="card-editorial group">
                <div className="w-11 h-11 border border-[color:var(--ink)] flex items-center justify-center text-[color:var(--ink)] group-hover:bg-[color:var(--ink)] group-hover:text-[color:var(--gold)] transition-colors">
                  <v.icon size={18} strokeWidth={1.5} />
                </div>
                <h3 className="font-serif-display text-[22px] mt-6 leading-tight text-[color:var(--ink)]">{v.title}</h3>
                <p className="text-[14px] leading-relaxed text-[color:var(--muted)] mt-3">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[color:var(--paper-2)] border-y border-[color:var(--hairline)] py-20 md:py-28">
        <div className="container-mag">
          <Eyebrow>Leadership</Eyebrow>
          <h2 className="font-serif-display text-3xl md:text-5xl mt-4 text-[color:var(--ink)] leading-tight">
            The people behind Magnrey.
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-16">
            <div className="lg:col-span-4">
              <div className="aspect-[4/5] w-full overflow-hidden border border-[color:var(--hairline-strong)]">
                <img
                  data-testid="about-founder-portrait"
                  src="/brand/founder.webp"
                  alt="Rinnieta Chrestien, Partner & Co-Founder"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="mt-6">
                <div className="font-serif-display text-2xl text-[color:var(--ink)]">Rinnieta Chrestien</div>
                <div className="font-mono-brand text-[11px] tracking-[0.24em] uppercase text-[color:var(--gold)] mt-2">Partner &amp; Co-Founder</div>
                <a
                  href="https://www.linkedin.com/in/rinnieta-chrestien/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 text-[13px] font-semibold text-[color:var(--ink)] editorial-link"
                  data-testid="founder-linkedin"
                >
                  <Linkedin size={14} /> View LinkedIn Profile <ArrowUpRight size={12} />
                </a>
              </div>
            </div>

            <div className="lg:col-span-8">
              <div className="space-y-5 text-[16px] leading-[1.8] text-[color:var(--muted)]">
                <p>
                  Rinnieta Chrestien is an experienced executive HR leader and strategic advisor specialising in AI-driven HR transformation, operating model design, and global service delivery for enterprise-scale organisations (75K+ users).
                </p>
                <p>
                  With nearly two decades of leadership scaling HR functions at top global tech companies, Rinnieta brings a deep track record of aligning people strategy with cutting-edge technology. Most recently, she served as Vice President of Human Resources at Salesforce, where she spent 9 years leading global teams across 10 countries and driving end-to-end operational execution across JAPAC, the Americas, and Europe. Prior to Salesforce, she was General Manager of Recruitment &amp; HR Operations at Fujitsu Australia &amp; New Zealand.
                </p>
                <p>
                  At Magnrey Consulting, Rinnieta partners with C-suite and HR executive leaders to design future-ready workforce strategies, implement agentic AI and HCM technologies, and lead complex organisational transformations from strategy through execution.
                </p>
              </div>

              <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-10 pt-10 border-t border-[color:var(--hairline)]" data-testid="expertise-grid">
                {EXPERTISE_GROUPS.map((g) => (
                  <div key={g.title}>
                    <div className="rule-label mb-4"><span>{g.title}</span></div>
                    <ul className="space-y-3">
                      {g.items.map(([label, desc]) => (
                        <li key={label} className="flex gap-3 text-[14px] leading-relaxed">
                          <span className="text-[color:var(--gold)] mt-0.5">■</span>
                          <span className="text-[color:var(--muted)]">
                            <strong className="text-[color:var(--ink)]">{label}:</strong> {desc}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <p className="mt-12 pt-6 border-t border-[color:var(--hairline)] text-[13.5px] font-mono-brand tracking-[0.18em] uppercase text-[color:var(--muted)]">
                M.Sc. in Human Resources — The London School of Economics and Political Science (LSE)
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="ink-block py-24">
        <div className="container-mag grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <Eyebrow>Firm Mandate</Eyebrow>
            <h3 className="font-serif-display text-3xl md:text-5xl text-[color:var(--bone)] mt-4 leading-tight">
              We founded Magnrey to bridge <em className="italic text-[color:var(--gold)]">the practitioner gap.</em>
            </h3>
          </div>
          <div className="space-y-5 text-white/70 text-[15px] leading-[1.8]">
            <p>
              After decades leading global HR transformations, we saw the same pattern: organisations investing heavily in AI and Digital without the practitioner depth to make it stick. Frameworks that read well in a deck but collapse against operational reality.
            </p>
            <p>
              Magnrey is engineered against that pattern. Senior-led, outcome-anchored, AI-native by design — and small enough to guarantee that the practitioner in the diagnostic conversation is the same practitioner delivering the mandate.
            </p>
            <Link to="/contact" className="btn-gold mt-2">
              Begin the conversation <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
