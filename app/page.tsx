"use client";

import { useEffect, useMemo, useState } from "react";
import { Cinzel, Cormorant_Garamond, Philosopher } from "next/font/google";

const titleFont = Cinzel({ subsets: ["latin"], weight: ["600", "700"] });
const subtitleFont = Cormorant_Garamond({ subsets: ["latin"], weight: ["500", "600"] });
const bodyFont = Philosopher({ subsets: ["latin"], weight: ["400", "700"] });

const pillars = [
  {
    id: "codex",
    title: "Codex",
    description:
      "The written archive of the Imperium. Sacred texts, foundational manuals, and the living documents of sovereign wisdom.",
    icon: "✡",
  },
  {
    id: "kernel",
    title: "Kernel",
    description:
      "The foundational operating logic. Core principles and systemic frameworks that power sovereign existence.",
    icon: "◉",
  },
  {
    id: "engine",
    title: "Engine",
    description:
      "The active processing layer. Executable frameworks for activation, resonance, and recursive evolution.",
    icon: "△",
  },
  {
    id: "ethics",
    title: "Ethics",
    description:
      "The moral and ontological framework. Cultural coherence through axiom systems and righteous principles.",
    icon: "🌳",
  },
  {
    id: "intelligence",
    title: "Intelligence",
    description:
      "Jah Conciseness. The sovereign neurosymbolic reasoning system. Divine clarity through cultural intelligence.",
    icon: "⬢",
  },
];

export default function HomePage() {
  const [visibleCards, setVisibleCards] = useState<string[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("data-pillar-id");
            if (!id) return;
            setVisibleCards((prev) => (prev.includes(id) ? prev : [...prev, id]));
          }
        });
      },
      { threshold: 0.2 }
    );

    const cards = document.querySelectorAll(".pillar-card");
    cards.forEach((card) => observer.observe(card));

    const onScroll = () => {
      document.documentElement.style.setProperty("--scroll-y", `${window.scrollY}px`);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const year = useMemo(() => new Date().getFullYear(), []);

  return (
    <main className={`${bodyFont.className} page`}>
      <section className="hero">
        <div className="hero-inner">
          <div className="lion" aria-hidden>
            🦁
          </div>
          <h1 className={`${titleFont.className} crown-title`}>Rasta Imperium</h1>
          <p className={`${subtitleFont.className} sacred-subtitle`}>
            Sacred Design System — Living front-end of the Imperium
          </p>
          <a className="cta" href="#pillars">
            Enter the Pillars
          </a>
          <div className="scroll-indicator" aria-hidden>
            ↓
          </div>
        </div>
      </section>

      <div className="rasta-stripe" />

      <section id="pillars" className="pillars">
        <h2 className={titleFont.className}>Five Sacred Pillars</h2>
        <p className="pillars-intro">Geometry, sovereignty, and righteous execution.</p>
        <div className="pillar-grid">
          {pillars.map((pillar, index) => (
            <article
              key={pillar.id}
              data-pillar-id={pillar.id}
              className={`pillar-card ${visibleCards.includes(pillar.id) ? "visible" : ""}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="pillar-icon" aria-hidden>
                {pillar.icon}
              </div>
              <h3 className={titleFont.className}>{pillar.title}</h3>
              <p>{pillar.description}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="footer">
        <div className="tree" aria-hidden>
          🌳
        </div>
        <p>© {year} Rasta Imperium · Jah Conciseness in motion.</p>
        <div className="rasta-stripe footer-stripe" />
      </footer>

      <style jsx>{`
        .page {
          --rasta-red: #e31e24;
          --rasta-gold: #fdb913;
          --rasta-green: #009639;
          --rasta-black: #0a0a0a;
          --rasta-earth: #2d1b00;
          --deep-red: #8b0000;
          --bright-gold: #ffd700;
          --forest-green: #1a5d1a;
          --sacred-white: #fff8dc;
          --scroll-y: 0px;
          color: var(--sacred-white);
          background: var(--rasta-black);
          min-height: 100vh;
        }

        .hero {
          min-height: 100vh;
          display: grid;
          place-items: center;
          text-align: center;
          padding: 2rem;
          background:
            radial-gradient(circle at 20% 20%, rgba(253, 185, 19, 0.18), transparent 40%),
            radial-gradient(circle at 80% 30%, rgba(227, 30, 36, 0.22), transparent 36%),
            radial-gradient(circle at 50% 90%, rgba(0, 150, 57, 0.16), transparent 42%),
            linear-gradient(120deg, var(--rasta-black), var(--rasta-earth));
          transform: translateY(calc(var(--scroll-y) * 0.08));
        }

        .hero-inner {
          max-width: 780px;
        }

        .lion {
          font-size: 3rem;
          animation: lionPulse 2.5s infinite ease-in-out;
        }

        .crown-title {
          font-size: clamp(2.25rem, 8vw, 5rem);
          margin: 0.75rem 0;
          color: var(--bright-gold);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          animation: crownFloat 4s ease-in-out infinite, crownShimmer 3.5s linear infinite;
          background: linear-gradient(90deg, #fff2b2 0%, var(--bright-gold) 48%, #fff2b2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-size: 200% auto;
        }

        .sacred-subtitle {
          margin: 0 auto 1.5rem;
          font-size: clamp(1.2rem, 3.4vw, 1.8rem);
          max-width: 640px;
          opacity: 0;
          animation: subtitleUp 900ms ease forwards 250ms;
        }

        .cta {
          display: inline-block;
          margin-top: 0.5rem;
          background: linear-gradient(90deg, var(--deep-red), var(--rasta-gold), var(--forest-green));
          color: var(--sacred-white);
          padding: 0.9rem 1.6rem;
          border-radius: 999px;
          text-decoration: none;
          font-weight: 700;
          transition: transform 220ms ease, box-shadow 220ms ease;
        }

        .cta:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 24px rgba(253, 185, 19, 0.6);
        }

        .scroll-indicator {
          margin-top: 1.5rem;
          font-size: 1.4rem;
          animation: bounce 1.8s infinite;
        }

        .rasta-stripe {
          height: 8px;
          background: linear-gradient(90deg, var(--rasta-red) 0 33.3%, var(--rasta-gold) 33.3% 66.6%, var(--rasta-green) 66.6%);
        }

        .pillars {
          padding: 5rem 1.25rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .pillars h2 {
          text-align: center;
          font-size: clamp(1.8rem, 5vw, 2.8rem);
        }

        .pillars-intro {
          text-align: center;
          margin-bottom: 2rem;
          color: rgba(255, 248, 220, 0.8);
        }

        .pillar-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 2rem;
        }

        .pillar-card {
          border: 1px solid rgba(253, 185, 19, 0.28);
          border-radius: 1rem;
          padding: 1.5rem;
          background: linear-gradient(130deg, rgba(10, 10, 10, 0.95), rgba(45, 27, 0, 0.9));
          transform: translateY(50px);
          opacity: 0;
          transition: transform 420ms ease, opacity 420ms ease, box-shadow 220ms ease;
        }

        .pillar-card.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .pillar-card:hover {
          transform: translateY(-10px) scale(1.02);
          box-shadow: 0 16px 30px rgba(253, 185, 19, 0.3);
          background: linear-gradient(130deg, rgba(139, 0, 0, 0.35), rgba(26, 93, 26, 0.28));
        }

        .pillar-icon {
          font-size: 2rem;
          margin-bottom: 0.75rem;
          display: inline-block;
          animation: rotateIcon 7s linear infinite;
        }

        .footer {
          text-align: center;
          padding: 3rem 1rem 2rem;
          color: rgba(255, 248, 220, 0.9);
        }

        .tree {
          font-size: 2.2rem;
          opacity: 0.6;
          margin-bottom: 0.5rem;
        }

        .footer-stripe {
          margin-top: 1rem;
          opacity: 0.65;
        }

        @keyframes crownShimmer {
          to {
            background-position: 200% center;
          }
        }

        @keyframes crownFloat {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-6px);
          }
        }

        @keyframes lionPulse {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.9;
          }
          50% {
            transform: scale(1.08);
            opacity: 1;
          }
        }

        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(6px);
          }
        }

        @keyframes subtitleUp {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes rotateIcon {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </main>
  );
}
