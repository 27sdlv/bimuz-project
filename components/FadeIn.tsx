"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion, registerGsap } from "@/lib/gsap";

type FadeInProps = {
  children: ReactNode;
  className?: string;
  /** Delay in seconds */
  delay?: number;
  stagger?: boolean;
  index?: number;
  y?: number;
  x?: number;
  duration?: number;
  scale?: number;
  /** Animate on mount (no scroll trigger) */
  immediate?: boolean;
};

export default function FadeIn({
  children,
  className = "",
  delay = 0,
  stagger = false,
  index = 0,
  y = 48,
  x = 0,
  duration = 0.9,
  scale,
  immediate = false,
}: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      registerGsap();
      const el = ref.current;
      if (!el) return;

      if (prefersReducedMotion()) {
        gsap.set(el, { opacity: 1, x: 0, y: 0, scale: 1, clearProps: "transform" });
        return;
      }

      const staggerDelay = stagger ? index * 0.09 : delay;
      const from: gsap.TweenVars = { opacity: 0, y, x };
      if (scale !== undefined) from.scale = scale;

      const to: gsap.TweenVars = {
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1,
        duration,
        delay: staggerDelay,
        ease: "power3.out",
        clearProps: "transform",
      };

      if (immediate) {
        gsap.fromTo(el, from, to);
        return;
      }

      gsap.fromTo(el, from, {
        ...to,
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          toggleActions: "play none none none",
        },
      });
    },
    { scope: ref, dependencies: [delay, stagger, index, y, x, duration, scale, immediate] }
  );

  return (
    <div ref={ref} className={`gsap-reveal ${className}`.trim()}>
      {children}
    </div>
  );
}
