"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { StaggerTestimonialItem } from "@/lib/data";

const SQRT_5000 = Math.sqrt(5000);

type TestimonialWithId = StaggerTestimonialItem & { tempId: number };

interface TestimonialCardProps {
  position: number;
  testimonial: TestimonialWithId;
  handleMove: (steps: number) => void;
  cardSize: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  position,
  testimonial,
  handleMove,
  cardSize,
}) => {
  const isCenter = position === 0;

  return (
    <div
      onClick={() => handleMove(position)}
      className={cn(
        "absolute left-1/2 top-1/2 cursor-pointer border-2 p-8 transition-all duration-500 ease-in-out",
        isCenter
          ? "z-10 border-primary bg-primary text-primary-foreground"
          : "z-0 border-border bg-card text-card-foreground hover:border-primary/50"
      )}
      style={{
        width: cardSize,
        height: cardSize,
        clipPath: `polygon(50px 0%, calc(100% - 50px) 0%, 100% 50px, 100% 100%, calc(100% - 50px) 100%, 50px 100%, 0 100%, 0 0)`,
        transform: `
          translate(-50%, -50%)
          translateX(${(cardSize / 1.5) * position}px)
          translateY(${isCenter ? -65 : position % 2 ? 15 : -15}px)
          rotate(${isCenter ? 0 : position % 2 ? 2.5 : -2.5}deg)
        `,
        boxShadow: isCenter ? "0px 8px 0px 4px hsl(var(--border))" : "0px 0px 0px 0px transparent",
      }}
    >
      <span
        className="absolute block origin-top-right rotate-45 bg-border"
        style={{
          right: -2,
          top: 48,
          width: SQRT_5000,
          height: 2,
        }}
      />
      <img
        src={testimonial.imgSrc}
        alt={testimonial.by.split(",")[0]}
        className="mb-4 h-14 w-12 bg-muted object-cover object-top"
        style={{
          boxShadow: "3px 3px 0px hsl(var(--background))",
        }}
      />
      <h3
        className={cn(
          "text-base font-medium sm:text-xl",
          isCenter ? "text-primary-foreground" : "text-foreground"
        )}
      >
        &ldquo;{testimonial.testimonial}&rdquo;
      </h3>
      <p
        className={cn(
          "absolute bottom-8 left-8 right-8 mt-2 text-sm italic",
          isCenter ? "text-primary-foreground/80" : "text-muted-foreground"
        )}
      >
        — {testimonial.by}
      </p>
    </div>
  );
};

export interface StaggerTestimonialsProps {
  items: StaggerTestimonialItem[];
  className?: string;
  height?: number;
}

export const StaggerTestimonials: React.FC<StaggerTestimonialsProps> = ({
  items,
  className,
  height = 600,
}) => {
  if (!items?.length) {
    return null;
  }
  const [cardSize, setCardSize] = useState(365);
  const [testimonialsList, setTestimonialsList] = useState<TestimonialWithId[]>(() =>
    items.map((item, index) => ({ ...item, tempId: index }))
  );
  const [isPaused, setIsPaused] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    setTestimonialsList(items.map((item, index) => ({ ...item, tempId: index })));
  }, [items]);

  const handleMove = (steps: number) => {
    setTestimonialsList((prevList) => {
      const newList = [...prevList];
      if (steps > 0) {
        for (let i = steps; i > 0; i--) {
          const item = newList.shift();
          if (!item) return prevList;
          newList.push({ ...item, tempId: Math.random() });
        }
      } else {
        for (let i = steps; i < 0; i++) {
          const item = newList.pop();
          if (!item) return prevList;
          newList.unshift({ ...item, tempId: Math.random() });
        }
      }
      return newList;
    });
  };

  const handleManualMove = (steps: number) => {
    handleMove(steps);
    setResetKey((prev) => prev + 1);
  };

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      handleMove(1);
    }, 3500); // Auto-scroll every 3.5 seconds
    return () => clearInterval(interval);
  }, [isPaused, resetKey]);

  useEffect(() => {
    const updateSize = () => {
      const { matches } = window.matchMedia("(min-width: 640px)");
      setCardSize(matches ? 365 : 290);
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <div
      className={cn("relative w-full overflow-hidden bg-muted/30", className)}
      style={{ height }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {testimonialsList.map((testimonial, index) => {
        const position = testimonialsList.length % 2
          ? index - (testimonialsList.length + 1) / 2
          : index - testimonialsList.length / 2;
        return (
          <TestimonialCard
            key={testimonial.tempId}
            testimonial={testimonial}
            handleMove={handleManualMove}
            position={position}
            cardSize={cardSize}
          />
        );
      })}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        <button
          type="button"
          onClick={() => handleManualMove(-1)}
          className={cn(
            "flex h-10 w-10 items-center justify-center transition-colors",
            "border-2 border-border bg-background hover:bg-primary hover:text-primary-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          )}
          aria-label="Oldingi fikr"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => handleManualMove(1)}
          className={cn(
            "flex h-10 w-10 items-center justify-center transition-colors",
            "border-2 border-border bg-background hover:bg-primary hover:text-primary-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          )}
          aria-label="Keyingi fikr"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};
