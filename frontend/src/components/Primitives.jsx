// Shared editorial primitives
import { ArrowUpRight } from "lucide-react";

export function Eyebrow({ children, className = "", testId }) {
  return (
    <span data-testid={testId} className={`eyebrow inline-flex items-center gap-2 ${className}`}>
      <span className="w-1.5 h-1.5 bg-[color:var(--gold)] pulse-dot" />
      {children}
    </span>
  );
}

export function SectionHead({ eyebrow, title, description, actionHref, actionLabel, dark = false }) {
  return (
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
      <div className="max-w-2xl">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2
          className={`font-serif-display font-normal tracking-tight leading-[1.1] mt-4 text-3xl md:text-4xl lg:text-5xl ${
            dark ? "text-[color:var(--bone)]" : "text-[color:var(--ink)]"
          }`}
        >
          {title}
        </h2>
        {description && (
          <p className={`mt-4 text-[16px] leading-relaxed max-w-xl ${dark ? "text-white/70" : "text-[color:var(--muted)]"}`}>
            {description}
          </p>
        )}
      </div>
      {actionHref && (
        <a
          href={actionHref}
          className={`editorial-link text-[14px] font-semibold self-start md:self-end whitespace-nowrap ${
            dark ? "text-[color:var(--gold)]" : "text-[color:var(--ink)]"
          }`}
        >
          {actionLabel} <ArrowUpRight size={16} />
        </a>
      )}
    </div>
  );
}

export function StatMonolith({ value, label, sub }) {
  return (
    <div className="border-l border-[color:var(--hairline-strong)] pl-6 py-2">
      <div className="font-serif-display text-4xl md:text-5xl text-[color:var(--ink)] leading-none">{value}</div>
      <div className="mt-3 font-mono-brand text-[10.5px] tracking-[0.24em] uppercase text-[color:var(--gold)]">{label}</div>
      {sub && <div className="text-[13px] text-[color:var(--muted)] mt-1">{sub}</div>}
    </div>
  );
}

export function PageHero({ eyebrow, kicker, title, italicTail, description }) {
  return (
    <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 border-b border-[color:var(--hairline)]">
      <div className="container-mag">
        <div className="max-w-4xl">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="font-serif-display font-normal tracking-tight leading-[1.05] mt-6 text-4xl md:text-6xl lg:text-7xl text-[color:var(--ink)]">
            {title}
            {italicTail && <><br/><em className="text-[color:var(--gold)] font-serif-display italic">{italicTail}</em></>}
          </h1>
          {description && (
            <p className="mt-6 text-[17px] md:text-[18px] leading-[1.7] text-[color:var(--muted)] max-w-2xl">{description}</p>
          )}
        </div>
      </div>
    </section>
  );
}
