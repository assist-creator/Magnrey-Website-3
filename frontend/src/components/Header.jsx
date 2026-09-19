import { NavLink, Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/why-us", label: "Why Us" },
  { to: "/services", label: "Services" },
  { to: "/framework", label: "Framework" },
  { to: "/case-studies", label: "Case Studies" },
  { to: "/insights", label: "Insights" },
  { to: "/about", label: "About" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <header
      data-testid="site-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-[color:var(--paper)]/85 backdrop-blur-xl border-b border-[color:var(--hairline)]" : "bg-transparent"
      }`}
    >
      <div className="container-mag flex items-center justify-between h-20">
        <Link to="/" data-testid="nav-logo" className="flex items-center gap-3 group">
          <div className="w-9 h-9 border border-[color:var(--ink)] flex items-center justify-center font-serif-display text-[color:var(--ink)] text-lg leading-none">
            M
            <span className="text-[color:var(--gold)]">.</span>
          </div>
          <div className="hidden sm:flex flex-col leading-tight">
            <span className="font-serif-display text-[19px] tracking-tight text-[color:var(--ink)]">Magnrey</span>
            <span className="font-mono-brand text-[9px] tracking-[0.28em] text-[color:var(--muted)] uppercase">AI · Digital · People</span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1" data-testid="primary-nav">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.to === "/"}
              data-testid={`nav-link-${n.label.toLowerCase().replace(/\s+/g, "-")}`}
              className={({ isActive }) =>
                `px-3 py-2 text-[13.5px] tracking-[0.02em] transition-colors ${
                  isActive ? "text-[color:var(--ink)] font-semibold" : "text-[color:var(--muted)] hover:text-[color:var(--ink)]"
                }`
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/contact"
            data-testid="header-cta-book"
            className="hidden md:inline-flex items-center gap-2 btn-ink"
          >
            <span>Book Diagnostic</span>
            <ArrowUpRight className="arrow" size={16} strokeWidth={2} />
          </Link>
          <button
            onClick={() => setOpen((v) => !v)}
            data-testid="mobile-menu-toggle"
            className="lg:hidden p-2 border border-[color:var(--hairline-strong)]"
            aria-label="Toggle menu"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden bg-[color:var(--paper)] border-t border-[color:var(--hairline)]" data-testid="mobile-nav">
          <nav className="container-mag py-4 flex flex-col">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.to === "/"}
                data-testid={`mobile-nav-link-${n.label.toLowerCase().replace(/\s+/g, "-")}`}
                className={({ isActive }) =>
                  `py-3 border-b border-[color:var(--hairline)] text-sm ${
                    isActive ? "text-[color:var(--ink)] font-semibold" : "text-[color:var(--muted)]"
                  }`
                }
              >
                {n.label}
              </NavLink>
            ))}
            <Link to="/contact" data-testid="mobile-cta-book" className="btn-ink mt-4 justify-center">
              Book Diagnostic <ArrowUpRight size={16} />
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
