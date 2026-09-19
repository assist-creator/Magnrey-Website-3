import { PageHero, Eyebrow } from "@/components/Primitives";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

const EXPERTISE = [
  "HR Operating Model Design",
  "Workday",
  "Salesforce Service Cloud",
  "AI at Scale",
  "Large-scale Change Management",
  "M&A Integration",
  "Workforce Planning",
  "HR Data Strategy & Governance",
  "GDPR / SOX Compliance",
  "Advanced Analytics",
  "C-Suite Engagement",
  "Global People Leadership",
];

export default function About() {
  return (
    <div data-testid="page-about">
      <PageHero
        kicker="007 — About"
        eyebrow="The Practitioners"
        title="We are former executives."
        italicTail="Not career consultants."
        description="We have stood in your shoes. We bring the battle-tested insight required to move beyond theoretical strategy into sustainable, operational reality."
      />

      <section className="py-20 md:py-28">
        <div className="container-mag grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <div className="aspect-[4/5] w-full overflow-hidden border border-[color:var(--hairline-strong)]">
              <img
                data-testid="about-founder-portrait"
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?crop=entropy&cs=srgb&fm=jpg&w=1000&q=85"
                alt="Rinnieta Chrestien, Founding Partner"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="mt-6 flex items-center justify-between">
              <div>
                <div className="font-serif-display text-2xl text-[color:var(--ink)]">Rinnieta Chrestien</div>
                <div className="font-mono-brand text-[11px] tracking-[0.24em] uppercase text-[color:var(--gold)] mt-2">Founding Partner</div>
              </div>
              <a href="mailto:enquiry@magnrey.com" className="editorial-link text-[13px] font-semibold text-[color:var(--ink)]">
                Direct enquiry <ArrowUpRight size={14} />
              </a>
            </div>
          </div>

          <div className="lg:col-span-7">
            <Eyebrow>Founding Partner</Eyebrow>
            <h2 className="font-serif-display text-3xl md:text-5xl mt-4 leading-[1.1] text-[color:var(--ink)]">
              A results-oriented HR executive with 18+ years leading large-scale HR transformation, digital strategy and operating-model redesign across complex global organisations of 75,000+ employees.
            </h2>
            <p className="text-[16px] leading-relaxed text-[color:var(--muted)] mt-8">
              Formerly VP Human Resources at Salesforce, where she led a diverse global team across JAPAC, Americas and Europe spanning 27 countries. Her practice combines deep operational fluency with the executive credibility required to engage boards and C-suites as peers.
            </p>
            <blockquote className="mt-10 border-l-2 border-[color:var(--gold)] pl-6 font-serif-display italic text-[color:var(--ink)] text-2xl md:text-3xl leading-snug">
              “We engage at senior leadership level — providing the strategic challenge and execution certainty that only those who have done the work can offer.”
            </blockquote>

            <div className="mt-12">
              <div className="rule-label mb-5"><span>Areas of Expertise</span></div>
              <div className="flex flex-wrap gap-2">
                {EXPERTISE.map((e) => (
                  <span key={e} className="px-3 py-2 text-[12.5px] border border-[color:var(--hairline-strong)] bg-[color:var(--bone)] text-[color:var(--ink)]">
                    {e}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="ink-block py-24">
        <div className="container-mag grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <Eyebrow>Firm Mandate</Eyebrow>
            <h3 className="font-serif-display text-3xl md:text-5xl text-[color:var(--bone)] mt-4 leading-tight">
              We founded Magnrey to bridge <em className="italic text-[color:var(--gold)] not-italic">the practitioner gap.</em>
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
