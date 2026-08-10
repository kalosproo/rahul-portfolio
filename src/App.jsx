import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  Mail,
  Phone,
  Instagram,
  Linkedin,
  Menu,
  X,
} from "lucide-react";

// ---- Design tokens -------------------------------------------------------
const ink = "#0B0B0A";
const panel = "#131311";
const bone = "#F3EFE7";
const boneDim = "rgba(243,239,231,0.62)";
const boneFaint = "rgba(243,239,231,0.38)";
const line = "rgba(243,239,231,0.12)";
const brass = "#B0904A";

const fonts = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,900;1,9..144,500&family=DM+Sans:wght@400;500;700&family=JetBrains+Mono:wght@400;500&display=swap');

  .rm-root, .rm-root * { box-sizing: border-box; }
  .rm-root { font-family: 'DM Sans', sans-serif; background: ${ink}; color: ${bone}; }
  .rm-display { font-family: 'Fraunces', serif; }
  .rm-mono { font-family: 'JetBrains Mono', monospace; }

  .rm-root ::selection { background: ${brass}; color: ${ink}; }

  .rm-fade {
    opacity: 0; transform: translateY(18px) scale(0.985);
    transition: opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1);
    will-change: opacity, transform;
  }
  .rm-fade.rm-in { opacity: 1; transform: translateY(0) scale(1); }

  @media (prefers-reduced-motion: reduce) {
    .rm-fade { opacity: 1 !important; transform: none !important; transition: none !important; }
    .rm-root { cursor: auto !important; }
    .rm-cursor-dot, .rm-cursor-ring { display: none !important; }
  }

  .rm-link { position: relative; text-decoration: none; color: inherit; }
  .rm-link::after {
    content: ""; position: absolute; left: 0; right: 0; bottom: -2px; height: 1px;
    background: ${brass}; transform: scaleX(0); transform-origin: left;
    transition: transform 0.4s cubic-bezier(0.16,1,0.3,1);
  }
  .rm-link:hover::after, .rm-link:focus-visible::after { transform: scaleX(1); }

  .rm-root a:focus-visible, .rm-root button:focus-visible {
    outline: 1.5px solid ${brass}; outline-offset: 3px;
  }

  .rm-card {
    transition: border-color 0.4s cubic-bezier(0.16,1,0.3,1), transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s cubic-bezier(0.16,1,0.3,1);
  }
  .rm-card:hover {
    border-color: rgba(176,144,74,0.55); transform: translateY(-5px) scale(1.012);
    box-shadow: 0 18px 40px rgba(0,0,0,0.35);
  }
  .rm-card svg { transition: transform 0.4s cubic-bezier(0.16,1,0.3,1); }
  .rm-card:hover svg { transform: translate(2px,-2px) rotate(6deg); }

  .rm-nav-link { position: relative; transition: color 0.3s ease; }
  .rm-nav-link::after {
    content: ""; position: absolute; left: 0; bottom: -4px; width: 100%; height: 1px;
    background: ${brass}; transform: scaleX(0); transform-origin: left; transition: transform 0.35s cubic-bezier(0.16,1,0.3,1);
  }
  .rm-nav-link:hover::after { transform: scaleX(1); }
  .rm-nav-link:hover { color: ${bone}; }

  .rm-btn-primary { transition: transform 0.25s cubic-bezier(0.16,1,0.3,1), box-shadow 0.25s ease; }
  .rm-btn-primary:hover { box-shadow: 0 10px 28px rgba(243,239,231,0.16); }

  .rm-magnetic { transition: transform 0.4s cubic-bezier(0.16,1,0.3,1); will-change: transform; }

  .rm-header { transition: background 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease; }
  .rm-header-inner { transition: padding 0.4s cubic-bezier(0.16,1,0.3,1); }

  .rm-cursor-dot, .rm-cursor-ring {
    position: fixed; top: 0; left: 0; pointer-events: none; z-index: 100; border-radius: 50%;
  }
  .rm-cursor-dot { width: 6px; height: 6px; background: ${brass}; transition: transform 0.08s linear, opacity 0.3s ease; }
  .rm-cursor-ring {
    width: 30px; height: 30px; border: 1px solid rgba(176,144,74,0.5);
    transition: width 0.3s ease, height 0.3s ease, border-color 0.3s ease, opacity 0.3s ease;
  }
  .rm-cursor-ring.rm-cursor-active { width: 50px; height: 50px; border-color: ${bone}; }

  @media (pointer: fine) {
    .rm-root { cursor: none; }
  }
  @media (pointer: coarse) {
    .rm-cursor-dot, .rm-cursor-ring { display: none; }
  }
`;

// ---- Content --------------------------------------------------------------
const NAV = [
  { id: "log", label: "LOG" },
  { id: "work", label: "WORK" },
  { id: "ops", label: "FIELD OPS" },
  { id: "contact", label: "CONTACT" },
];

const TIMELINE = [
  { year: "2024", tag: "ENROLLED", detail: "B.Tech ECE, Sri Venkateswara College of Engineering, Tirupati" },
  { year: "2025", tag: "SHIPPED", detail: "First product live — solo-built, solo-shipped" },
  { year: "2026", tag: "ELECTED", detail: "President, IETE Student Chapter, SVCE" },
  { year: "2026", tag: "FINALIST", detail: "5G Innovation Hackathon — National Round, \u201c 5G-Enabled Real-Time Pest & Disease Detection System\u201d for Farmers" },
];

const FACTS = [
  { n: "04", label: "products shipped" },
  { n: "06", label: "languages spoken" },
  { n: "02", label: "gig platforms operated" },
  { n: "01", label: "national hackathon final" },
];

const VENTURES = [
  {
    name: "U.Do",
    desc: "Full-stack productivity system — finance tracking, planner, habits and an AI assistant in one place.",
    tags: ["React", "Firebase", "Cloud Functions"],
    href: "https://u-do-sigma.vercel.app",
  },
  {
    name: "Finvace",
    desc: "Investment portfolio tracker pulling live prices across crypto, mutual funds and equities, with a built-in trade journal.",
    tags: ["React", "Live Market APIs"],
    href: "https://finvace.vercel.app",
  },
  {
    name: "Loggy Gig",
    desc: "Earnings tracker built for gig workers — born out of running Rapido and Blinkit shifts myself.",
    tags: ["React", "Firebase Auth", "Android"],
    href: "https://loggy-gig.vercel.app",
  },
  {
    name: "LifeOS Graphy",
    desc: "A monthly emotion tracker — quiet, Swiss-modernist interface for logging one honest rating a day.",
    tags: ["Firebase", "Firestore"],
    href: "https://lifeos-grpahy.vercel.app",
  },
];

const OPS = [
  {
    role: "President",
    org: "IETE Student Chapter, SVCE",
    period: "2026 —",
    desc: "Run a 16-event annual calendar end to end — planning, speaker outreach, budgeting and on-ground execution for a technical student body.",
  },
  {
    role: "Gig Partner",
    org: "Rapido",
    period: "2026-",
    desc: "Ride-hailing shifts alongside coursework — the direct trigger for building Loggy Gig.",
  },
  {
    role: "Gig Partner",
    org: "Blinkit",
    period: "2026-",
    desc: "Quick-commerce delivery work — ground-level exposure to logistics, incentives and real operating pressure.",
  },
  {
    role: "Gig Partner",
    org: "Dominos PIzza",
    period: "2026-",
    desc: "Another delivery rotation added — same hustle, less time between classes.",
  },
];

const CAPS = [
  "React / Next.js", "Firebase", "Product Strategy", "Market Analysis — Crypto & Equity",
  "Event Ops & Leadership", "UI Systems Design", "Telugu, Tamil, Hindi, Kannada, English",
  "Spanish — learning",
];

const CONTACT = [
  { icon: Mail, label: "Muttukururahul@gmail.com", href: "mailto:Muttukururahul@gmail.com" },
  { icon: Phone, label: "+91 87121 30308", href: "tel:+918712130308" },
  { icon: Instagram, label: "@Kalospro", href: "https://instagram.com/Kalospro" },
  { icon: Linkedin, label: "linkedin.com/in/muttukururahul", href: "https://www.linkedin.com/in/muttukururahul" },
];

// ---- Motion primitives -----------------------------------------------------
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e) => setReduced(e.matches);
    mq.addEventListener ? mq.addEventListener("change", handler) : mq.addListener(handler);
    return () => {
      mq.removeEventListener ? mq.removeEventListener("change", handler) : mq.removeListener(handler);
    };
  }, []);
  return reduced;
}

// ---- Reveal-on-scroll hook --------------------------------------------------
function useReveal() {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); io.disconnect(); } },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, inView];
}

// delay (ms) staggers the reveal without touching layout, content or color
function Reveal({ as: Tag = "div", className = "", style = {}, delay = 0, children, ...rest }) {
  const [ref, inView] = useReveal();
  return (
    <Tag
      ref={ref}
      className={`rm-fade ${inView ? "rm-in" : ""} ${className}`}
      style={{ ...style, transitionDelay: inView ? `${delay}ms` : "0ms" }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

// subtle magnetic pull toward the cursor — used sparingly, on primary actions only
function Magnetic({ as: Tag = "div", strength = 14, className = "", style = {}, children, ...rest }) {
  const ref = useRef(null);
  const reduced = usePrefersReducedMotion();

  const handleMove = (e) => {
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left - rect.width / 2) / rect.width) * strength;
    const y = ((e.clientY - rect.top - rect.height / 2) / rect.height) * strength;
    ref.current.style.transform = `translate(${x}px, ${y}px)`;
  };
  const handleLeave = () => {
    if (ref.current) ref.current.style.transform = "translate(0px, 0px)";
  };

  return (
    <Tag
      ref={ref}
      className={`rm-magnetic ${className}`}
      style={style}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      {...rest}
    >
      {children}
    </Tag>
  );
}

// gentle scroll parallax — transform-only, skipped entirely under reduced motion
function useParallax(factor = 0.06) {
  const ref = useRef(null);
  const reduced = usePrefersReducedMotion();
  useEffect(() => {
    if (reduced) return;
    const onScroll = () => {
      if (ref.current) ref.current.style.transform = `translateY(${window.scrollY * factor}px)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [reduced, factor]);
  return ref;
}

// refined trailing-ring cursor — desktop (fine pointer) only, disabled under reduced motion
function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
    let ringX = mouseX, ringY = mouseY;
    let raf;

    let revealed = false;
    const onMove = (e) => {
      mouseX = e.clientX; mouseY = e.clientY;
      if (!revealed) {
        revealed = true;
        ringX = mouseX; ringY = mouseY;
        if (dotRef.current) dotRef.current.style.opacity = "1";
        if (ringRef.current) ringRef.current.style.opacity = "1";
      }
      if (dotRef.current) dotRef.current.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
      const interactive = e.target.closest && e.target.closest("a, button");
      if (ringRef.current) ringRef.current.classList.toggle("rm-cursor-active", !!interactive);
    };

    const tick = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      if (ringRef.current) ringRef.current.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  return (
    <>
      <div ref={dotRef} className="rm-cursor-dot" style={{ opacity: 0 }} />
      <div ref={ringRef} className="rm-cursor-ring" style={{ opacity: 0 }} />
    </>
  );
}

// ---- Page -------------------------------------------------------------------
export default function Portfolio() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const heroParallaxRef = useParallax(0.06);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="rm-root" style={{ minHeight: "100vh", width: "100%" }}>
      <style>{fonts}</style>
      <Cursor />

      {/* NAV */}
      <header
        className="rm-header"
        style={{
          position: "sticky", top: 0, zIndex: 40,
          background: scrolled ? "rgba(11,11,10,0.95)" : "rgba(11,11,10,0.8)",
          backdropFilter: "blur(8px)",
          borderBottom: `1px solid ${scrolled ? "rgba(243,239,231,0.18)" : line}`,
          boxShadow: scrolled ? "0 10px 30px rgba(0,0,0,0.28)" : "0 0 0 rgba(0,0,0,0)",
        }}
      >
        <div className="rm-header-inner" style={{ maxWidth: 1120, margin: "0 auto", padding: scrolled ? "12px 24px" : "18px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Magnetic
            as="button"
            strength={10}
            onClick={() => scrollTo("top")}
            className="rm-mono"
            style={{ background: "none", border: "none", color: bone, fontSize: 14, letterSpacing: "0.08em", cursor: "pointer" }}
          >
            RM<span style={{ color: brass }}>.</span>
          </Magnetic>

          <nav className="rm-mono" style={{ display: "none", gap: 32, fontSize: 12, letterSpacing: "0.12em" }} id="rm-desktop-nav">
            {NAV.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="rm-nav-link"
                style={{ background: "none", border: "none", color: boneDim, cursor: "pointer", padding: "4px 0" }}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <button
            onClick={() => setMenuOpen((v) => !v)}
            style={{ background: "none", border: "none", color: bone, cursor: "pointer", display: "flex" }}
            aria-label="Toggle menu"
            id="rm-menu-btn"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {menuOpen && (
          <div className="rm-mono" style={{ borderTop: `1px solid ${line}`, padding: "16px 24px", display: "flex", flexDirection: "column", gap: 16, fontSize: 13, letterSpacing: "0.1em" }}>
            {NAV.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                style={{ background: "none", border: "none", color: boneDim, textAlign: "left", cursor: "pointer" }}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </header>

      <style>{`
        @media (min-width: 768px) {
          #rm-desktop-nav { display: flex !important; }
          #rm-menu-btn { display: none !important; }
        }
      `}</style>

      <main id="top">
        {/* HERO */}
        <section style={{ maxWidth: 1120, margin: "0 auto", padding: "72px 24px 56px" }}>
          <div ref={heroParallaxRef}>
            <Reveal className="rm-mono" delay={0} style={{ fontSize: 12, letterSpacing: "0.18em", color: brass, marginBottom: 20 }}>
              PRODUCT &amp; SYSTEMS BUILDER — TIRUPATI, INDIA
            </Reveal>

            <Reveal
              as="h1"
              className="rm-display"
              delay={90}
              style={{ fontSize: "clamp(2.4rem, 6.4vw, 5rem)", fontWeight: 900, lineHeight: 1.05, margin: 0, letterSpacing: "-0.01em" }}
            >
              Not building apps.
              <br />
              <span style={{ fontStyle: "italic", fontWeight: 500, color: boneDim }}>Building solutions.</span>
            </Reveal>

            <Reveal delay={180} style={{ maxWidth: 560, marginTop: 26, fontSize: 17, lineHeight: 1.6, color: boneDim }}>
              I'm Rahul — everyone calls me Bujji. Second-year ECE student who ships full products
              solo, runs a 16-event technical chapter, and picks up gig shifts between semesters.
              Everything here is real, live, and built end to end.
            </Reveal>
          </div>

          <Reveal delay={270} style={{ display: "flex", gap: 16, marginTop: 36, flexWrap: "wrap" }}>
            <Magnetic
              as="button"
              strength={12}
              onClick={() => scrollTo("work")}
              className="rm-mono rm-btn-primary"
              style={{
                background: bone, color: ink, border: "none", padding: "13px 24px",
                fontSize: 12, letterSpacing: "0.1em", cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
              }}
            >
              VIEW THE WORK <ArrowUpRight size={14} />
            </Magnetic>
            <a
              href="mailto:Muttukururahul@gmail.com"
              className="rm-mono rm-link"
              style={{ fontSize: 12, letterSpacing: "0.1em", color: bone, alignSelf: "center", padding: "13px 4px" }}
            >
              GET IN TOUCH
            </a>
          </Reveal>

          {/* signature: the log */}
          <Reveal delay={380} style={{ marginTop: 64, borderTop: `1px solid ${line}`, paddingTop: 24 }}>
            <div className="rm-mono" style={{ fontSize: 11, letterSpacing: "0.14em", color: boneFaint, marginBottom: 14 }}>
              RUNNING LOG
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {TIMELINE.map((t, i) => (
                <div key={i} className="rm-mono" style={{ display: "flex", gap: 16, fontSize: 13, flexWrap: "wrap", color: boneDim }}>
                  <span style={{ color: brass, minWidth: 44 }}>{t.year}</span>
                  <span style={{ color: bone, minWidth: 82 }}>{t.tag}</span>
                  <span style={{ color: boneFaint }}>{t.detail}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        {/* LOG / ABOUT */}
        <section id="log" style={{ borderTop: `1px solid ${line}`, background: panel }}>
          <div style={{ maxWidth: 1120, margin: "0 auto", padding: "72px 24px" }}>
            <Reveal className="rm-mono" style={{ fontSize: 12, letterSpacing: "0.14em", color: brass, marginBottom: 18 }}>
              THE LOG
            </Reveal>
            <Reveal as="h2" className="rm-display" style={{ fontSize: "clamp(1.8rem, 3.6vw, 2.6rem)", fontWeight: 600, maxWidth: 680, lineHeight: 1.3, margin: 0 }}>
              I build the tools I need first, then find out other people needed them too.
            </Reveal>
            <Reveal style={{ maxWidth: 640, marginTop: 22, fontSize: 16, lineHeight: 1.7, color: boneDim }}>
              Every product below started as a personal problem — tracking gig earnings, tracking
              trades, tracking my own mood. That habit of logging things honestly is the thread
              running through everything I make, including this page.
            </Reveal>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 24, marginTop: 48 }}>
              {FACTS.map((f, i) => (
                <Reveal key={i} delay={i * 80} style={{ borderLeft: `1px solid ${line}`, paddingLeft: 16 }}>
                  <div className="rm-display" style={{ fontSize: 34, fontWeight: 600, color: bone }}>{f.n}</div>
                  <div className="rm-mono" style={{ fontSize: 11, letterSpacing: "0.08em", color: boneFaint, marginTop: 4 }}>{f.label}</div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* WORK */}
        <section id="work" style={{ borderTop: `1px solid ${line}` }}>
          <div style={{ maxWidth: 1120, margin: "0 auto", padding: "72px 24px" }}>
            <Reveal className="rm-mono" style={{ fontSize: 12, letterSpacing: "0.14em", color: brass, marginBottom: 18 }}>
              VENTURES
            </Reveal>
            <Reveal as="h2" className="rm-display" style={{ fontSize: "clamp(1.8rem, 3.6vw, 2.6rem)", fontWeight: 600, margin: 0 }}>
              Shipped, not just designed.
            </Reveal>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 1, marginTop: 44, background: line }}>
              {VENTURES.map((v, i) => (
                <Reveal key={i} delay={i * 90} className="rm-card" style={{ background: ink, padding: 28, border: `1px solid transparent` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <h3 className="rm-display" style={{ fontSize: 22, fontWeight: 600, margin: 0 }}>{v.name}</h3>
                    <a href={v.href} target="_blank" rel="noreferrer" aria-label={`Open ${v.name}`} style={{ color: boneFaint }}>
                      <ArrowUpRight size={18} />
                    </a>
                  </div>
                  <p style={{ fontSize: 14.5, lineHeight: 1.6, color: boneDim, marginTop: 12, minHeight: 66 }}>{v.desc}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16 }}>
                    {v.tags.map((tag, j) => (
                      <span key={j} className="rm-mono" style={{ fontSize: 10.5, letterSpacing: "0.05em", color: brass, border: `1px solid rgba(176,144,74,0.35)`, padding: "4px 8px" }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* FIELD OPS */}
        <section id="ops" style={{ borderTop: `1px solid ${line}`, background: panel }}>
          <div style={{ maxWidth: 1120, margin: "0 auto", padding: "72px 24px" }}>
            <Reveal className="rm-mono" style={{ fontSize: 12, letterSpacing: "0.14em", color: brass, marginBottom: 18 }}>
              FIELD OPS
            </Reveal>
            <Reveal as="h2" className="rm-display" style={{ fontSize: "clamp(1.8rem, 3.6vw, 2.6rem)", fontWeight: 600, margin: 0, maxWidth: 620 }}>
              Ground-level experience, not just a résumé line.
            </Reveal>

            <div style={{ display: "flex", flexDirection: "column", marginTop: 44 }}>
              {OPS.map((o, i) => (
                <Reveal
                  key={i}
                  delay={i * 80}
                  style={{
                    display: "grid", gridTemplateColumns: "120px 1fr", gap: 20,
                    padding: "22px 0", borderTop: i === 0 ? `1px solid ${line}` : "none",
                    borderBottom: `1px solid ${line}`,
                  }}
                >
                  <div className="rm-mono" style={{ fontSize: 11, letterSpacing: "0.06em", color: boneFaint }}>{o.period}</div>
                  <div>
                    <div style={{ display: "flex", gap: 10, alignItems: "baseline", flexWrap: "wrap" }}>
                      <span className="rm-display" style={{ fontSize: 19, fontWeight: 600 }}>{o.role}</span>
                      <span className="rm-mono" style={{ fontSize: 12, color: brass }}>{o.org}</span>
                    </div>
                    <p style={{ fontSize: 14.5, lineHeight: 1.6, color: boneDim, marginTop: 8, maxWidth: 560 }}>{o.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal style={{ marginTop: 48 }}>
              <div className="rm-mono" style={{ fontSize: 11, letterSpacing: "0.14em", color: boneFaint, marginBottom: 14 }}>
                CAPABILITIES
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {CAPS.map((c, i) => (
                  <span key={i} className="rm-mono" style={{ fontSize: 12, color: boneDim, border: `1px solid ${line}`, padding: "8px 14px" }}>
                    {c}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" style={{ borderTop: `1px solid ${line}` }}>
          <div style={{ maxWidth: 1120, margin: "0 auto", padding: "80px 24px 60px" }}>
            <Reveal className="rm-mono" style={{ fontSize: 12, letterSpacing: "0.14em", color: brass, marginBottom: 18 }}>
              CONTACT
            </Reveal>
            <Reveal as="h2" className="rm-display" style={{ fontSize: "clamp(2rem, 5vw, 3.4rem)", fontWeight: 600, margin: 0, maxWidth: 640, lineHeight: 1.2 }}>
              Building something? Let's talk.
            </Reveal>

            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 44 }}>
              {CONTACT.map((c, i) => {
                const Icon = c.icon;
                return (
                  <Reveal
                    as="a"
                    key={i}
                    delay={i * 70}
                    href={c.href}
                    target={c.href.startsWith("http") ? "_blank" : undefined}
                    rel="noreferrer"
                    className="rm-link"
                    style={{
                      display: "flex", alignItems: "center", gap: 14, padding: "16px 4px",
                      borderTop: `1px solid ${line}`, fontSize: 16,
                    }}
                  >
                    <Icon size={17} style={{ color: brass, flexShrink: 0 }} />
                    <span className="rm-mono" style={{ fontSize: 14.5 }}>{c.label}</span>
                  </Reveal>
                );
              })}
              <div style={{ borderTop: `1px solid ${line}` }} />
            </div>
          </div>
        </section>
      </main>

      <footer style={{ borderTop: `1px solid ${line}` }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "24px", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <span className="rm-mono" style={{ fontSize: 11, color: boneFaint, letterSpacing: "0.04em" }}>
            © 2026 Rahul Muttukuru — built solo, shipped anyway.
          </span>
          <span className="rm-mono" style={{ fontSize: 11, color: boneFaint, letterSpacing: "0.04em" }}>
            Tirupati, Andhra Pradesh
          </span>
        </div>
      </footer>
    </div>
  );
}
