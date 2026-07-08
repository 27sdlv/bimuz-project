"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { stats } from "@/lib/data";
import { scrollToSection } from "@/hooks/useScrollEffects";
import { gsap, prefersReducedMotion, registerGsap } from "@/lib/gsap";
import { useTranslation } from "@/hooks/useTranslation";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const statNumberRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const { t } = useTranslation();

  useGSAP(
    () => {
      registerGsap();
      const section = sectionRef.current;
      if (!section) return;

      if (prefersReducedMotion()) {
        gsap.set(
          [taglineRef.current, titleRef.current, subtitleRef.current, buttonsRef.current, statsRef.current],
          { opacity: 1, y: 0, clearProps: "all" }
        );
        statNumberRefs.current.forEach((el, i) => {
          if (el) el.textContent = String(stats[i].target);
        });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(taglineRef.current, { opacity: 0, y: 24, duration: 0.7 })
        .from(titleRef.current, { opacity: 0, y: 56, duration: 1 }, "-=0.45")
        .from(subtitleRef.current, { opacity: 0, y: 32, duration: 0.8 }, "-=0.55")
        .from(
          buttonsRef.current?.children ? Array.from(buttonsRef.current.children) : [],
          { opacity: 0, y: 24, duration: 0.65, stagger: 0.12 },
          "-=0.45"
        )
        .from(statsRef.current, { opacity: 0, y: 40, duration: 0.8 }, "-=0.3");

      statNumberRefs.current.forEach((el, i) => {
        if (!el) return;
        const target = stats[i].target;
        const counter = { value: 0 };

        gsap.to(counter, {
          value: target,
          duration: 2.2,
          ease: "power2.out",
          delay: 1.1 + i * 0.08,
          onUpdate: () => {
            el.textContent = String(Math.round(counter.value));
          },
        });
      });

      gsap.to(".hero-bg", {
        yPercent: 18,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: 1.2,
        },
      });

      gsap.to(".hero-diagonal", {
        xPercent: -6,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: 1.5,
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section className="hero" id="hero" ref={sectionRef}>
      <div className="hero-bg" aria-hidden="true" />
      <div className="hero-overlay" aria-hidden="true" />
      <div className="hero-grid-bg" />
      <div className="hero-diagonal" />

      <div className="hero-content container">
        <div className="hero-text">
          <p className="hero-tagline" ref={taglineRef}>
            {t.hero.tagline}
          </p>
          <h1 className="hero-title" ref={titleRef}>
            {t.hero.title}
          </h1>
          <p className="hero-subtitle" ref={subtitleRef}>
            {t.hero.subtitle}
          </p>
          <div className="hero-buttons" ref={buttonsRef}>
            <a
              href="#projects"
              className="btn btn-primary"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("#projects");
              }}
            >
              {t.hero.viewProjects}
            </a>
            <a
              href="#contact"
              className="btn btn-outline"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("#contact");
              }}
            >
              {t.hero.contactUs}
            </a>
          </div>
        </div>
      </div>

      <div className="hero-stats" ref={statsRef}>
        <div className="container stats-inner">
          {stats.flatMap((stat, index) => [
            ...(index > 0 ? [<div key={`divider-${stat.label}`} className="stat-divider" />] : []),
            <div key={stat.label} className="stat-item">
              <span
                className="stat-number"
                ref={(el) => {
                  statNumberRefs.current[index] = el;
                }}
              >
                0
              </span>
              {stat.suffix && <span className="stat-suffix">{stat.suffix}</span>}
              <span className="stat-label">{stat.label}</span>
            </div>,
          ])}
        </div>
      </div>
    </section>
  );
}
