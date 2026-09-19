import { PageHero, SectionHead, Eyebrow } from "@/components/Primitives";
import { Link } from "react-router-dom";
import { ArrowUpRight, CheckCircle2, XCircle } from "lucide-react";

const CONTRASTS = [
  { theme: "Delivery Team", them: "Pyramid staffing. Junior analysts execute; partners appear at milestones.", us: "Practitioners only. Every hour of your engagement is billed at senior partner level." },
  { theme: "Playbook", them: "Templated frameworks retrofitted from prior industries.", us: "Custom operating-model design, engineered from your data and business context." },
  { theme: "AI Posture", them: "AI treated as a pilot experiment, disconnected from operating model.", us: "AI treated as the architecture; digital infrastructure engineered to sustain it." },
  { theme: "Governance", them: "Compliance retrofitted after go-live, exposing regulatory surface.", us: "Compliance embedded as a first-class design primitive from stage one." },
  { theme: "Economics", them: "Priced on effort volume. Longer engagements reward the provider.", us: "Priced on outcome velocity. Value realisation is the shared objective." },
];

export default function WhyUs() {
  return (
    <div data-testid="page-why-us">
      <PageHero
        kicker="002 — Why Magnrey"
        eyebrow="The Strategic Case"
        title="After decades of leading global HR transformations,"
        italicTail="we saw the same problem — repeatedly."
        description="Organisations investing in AI and Digital without the practitioner depth to make it stick. Magnrey exists to bridge that gap. The People Function has historically operated as an administrative cost centre — AI as a disconnected experiment, Digital as a static system of record. We change that."
      />

      <section className="py-20 md:py-28">
        <div className="container-mag">
          <SectionHead
            eyebrow="Comparative Operating Model"
            title="The zero-pyramid advantage."
            description="A boutique practice can only compete with tier-one firms if the delivery model is materially different. Here is the differential — line by line."
          />

          <div className="border-t border-[color:var(--hairline-strong)]">
            <div className="grid grid-cols-12 py-4 border-b border-[color:var(--hairline)] font-mono-brand text-[10.5px] tracking-[0.24em] uppercase text-[color:var(--muted)]">
              <div className="col-span-3">Dimension</div>
              <div className="col-span-4 md:col-span-4">Tier-One Consulting</div>
              <div className="col-span-5 md:col-span-5">Magnrey</div>
            </div>
            {CONTRASTS.map((row, i) => (
              <div key={row.theme} data-testid={`contrast-${i}`} className="grid grid-cols-12 py-8 border-b border-[color:var(--hairline)] items-start gap-4">
                <div className="col-span-3 font-serif-display text-lg md:text-xl text-[color:var(--ink)]">{row.theme}</div>
                <div className="col-span-4 flex items-start gap-2 text-[14.5px] text-[color:var(--muted)]">
                  <XCircle size={16} className="mt-0.5 text-[color:var(--muted)] shrink-0" strokeWidth={1.5} />
                  <span>{row.them}</span>
                </div>
                <div className="col-span-5 flex items-start gap-2 text-[14.5px] text-[color:var(--ink)]">
                  <CheckCircle2 size={16} className="mt-0.5 text-[color:var(--gold)] shrink-0" strokeWidth={1.5} />
                  <span>{row.us}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="ink-block py-24 md:py-32">
        <div className="container-mag">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { k: "Premium People Experience", v: "Always-on, personalised experiences that retain critical talent and lift eNPS at enterprise scale." },
              { k: "Efficiency & Effectiveness", v: "Reduced operational cost, zero-touch transactions, and a People team freed for high-value strategic work." },
              { k: "Compliance by Design", v: "Regulatory standards embedded into governance — zero audit findings, verified adherence across all jurisdictions." },
            ].map((o, i) => (
              <div key={o.k} data-testid={`outcome-${i}`} className="border-t border-[color:var(--gold)]/40 pt-6">
                <span className="eyebrow">Outcome · 0{i + 1}</span>
                <h3 className="font-serif-display text-3xl mt-4 text-[color:var(--bone)] leading-tight">{o.k}</h3>
                <p className="mt-4 text-white/70 text-[15px] leading-relaxed">{o.v}</p>
              </div>
            ))}
          </div>
          <div className="mt-16">
            <Link to="/contact" className="btn-gold">
              Begin the conversation <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
