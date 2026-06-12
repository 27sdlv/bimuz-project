"use client";

import dynamic from "next/dynamic";
import FadeIn from "./FadeIn";
import { staggerTestimonials } from "@/lib/data";

const StaggerTestimonials = dynamic(
  () =>
    import("@/components/ui/stagger-testimonials").then((mod) => ({
      default: mod.StaggerTestimonials,
    })),
  {
    ssr: false,
    loading: () => (
      <div
        className="flex w-full items-center justify-center rounded-sm border border-border/40 bg-muted/20"
        style={{ height: 600 }}
        aria-hidden
      />
    ),
  }
);

export default function Testimonials() {
  return (
    <section className="section testimonials" id="testimonials">
      <div className="section-grid-bg" />
      <div className="container">
        <FadeIn className="section-header">
          <span className="section-label light">Mijozlar fikrlari</span>
          <h2 className="section-title light">MIJOZLAR FIKRLARI</h2>
        </FadeIn>

        <FadeIn>
          <div className="testimonials-carousel">
            <StaggerTestimonials
              items={staggerTestimonials}
              className="rounded-sm border border-border/40 bg-muted/20"
            />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
