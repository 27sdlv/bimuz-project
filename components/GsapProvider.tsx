"use client";

import { useEffect } from "react";
import { registerGsap, ScrollTrigger } from "@/lib/gsap";

export default function GsapProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    registerGsap();

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <>{children}</>;
}
