"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { navLinks } from "@/lib/data";
import { scrollToSection, useScrollHeader } from "@/hooks/useScrollEffects";
import { gsap, prefersReducedMotion, registerGsap } from "@/lib/gsap";
import Logo from "./Logo";

export default function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const scrolled = useScrollHeader();
  const [menuOpen, setMenuOpen] = useState(false);

  useGSAP(
    () => {
      registerGsap();
      const header = headerRef.current;
      if (!header) return;

      if (prefersReducedMotion()) {
        gsap.set(header, { opacity: 1, y: 0 });
        return;
      }

      gsap.from(header, {
        opacity: 0,
        y: -20,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.15,
      });
    },
    { scope: headerRef }
  );

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    document.body.style.overflow = "";
    scrollToSection(href);
  };

  const toggleMenu = () => {
    setMenuOpen((open) => {
      document.body.style.overflow = open ? "" : "hidden";
      return !open;
    });
  };

  return (
    <header
      ref={headerRef}
      className={`header${scrolled ? " scrolled" : ""}`}
      id="header"
    >
      <nav className="nav container">
        <Logo />

        <button
          type="button"
          className={`nav-toggle${menuOpen ? " active" : ""}`}
          onClick={toggleMenu}
          aria-label="Menyuni ochish"
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>

        <ul className={`nav-links${menuOpen ? " open" : ""}`} id="navLinks">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                onClick={(e) => {
                  if (link.href.startsWith("#")) {
                    e.preventDefault();
                    handleNavClick(link.href);
                  } else {
                    setMenuOpen(false);
                    document.body.style.overflow = "";
                  }
                }}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#contact"
          className="btn btn-primary nav-cta"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick("#contact");
          }}
        >
          Loyiha boshlash
        </a>
      </nav>
    </header>
  );
}
