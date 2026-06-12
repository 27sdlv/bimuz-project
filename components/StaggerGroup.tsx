"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion, registerGsap } from "@/lib/gsap";

type StaggerGroupProps = {
  children: ReactNode;
  className?: string;
  selector?: string;
  stagger?: number;
  y?: number;
  x?: number;
  duration?: number;
  start?: string;
};

export default function StaggerGroup({
  children,
  className = "",
  selector = ":scope > *",
  stagger = 0.1,
  y = 56,
  x = 0,
  duration = 0.85,
  start = "top 85%",
}: StaggerGroupProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      registerGsap();
      const container = ref.current;
      if (!container) return;

      const items = gsap.utils.toArray<HTMLElement>(selector, container);
      if (!items.length) return;

      if (prefersReducedMotion()) {
        gsap.set(items, { opacity: 1, x: 0, y: 0, clearProps: "transform" });
        return;
      }

      gsap.fromTo(
        items,
        { opacity: 0, y, x },
        {
          opacity: 1,
          y: 0,
          x: 0,
          duration,
          stagger,
          ease: "power3.out",
          clearProps: "transform",
          scrollTrigger: {
            trigger: container,
            start,
            toggleActions: "play none none none",
          },
        }
      );
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
