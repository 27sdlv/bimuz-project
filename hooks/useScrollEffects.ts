"use client";

import { useEffect, useState } from "react";
import { gsap, registerGsap } from "@/lib/gsap";

export function useScrollHeader(threshold = 50) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return scrolled;
}

export function scrollToSection(href: string) {
  if (href === "#") return;

  const target = document.querySelector(href);
  if (!target) return;

  registerGsap();

  const headerHeight = document.getElementById("header")?.offsetHeight ?? 72;
  const top = target.getBoundingClientRect().top + window.scrollY - headerHeight;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduced) {
    window.scrollTo({ top, behavior: "auto" });
    return;
  }

  gsap.to(window, {
    duration: 1.15,
    scrollTo: { y: top, autoKill: true },
    ease: "power3.inOut",
  });
}
