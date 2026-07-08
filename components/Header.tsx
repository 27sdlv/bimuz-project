"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { navLinks } from "@/lib/data";
import { scrollToSection, useScrollHeader } from "@/hooks/useScrollEffects";
import { gsap, prefersReducedMotion, registerGsap } from "@/lib/gsap";
import { useTranslation } from "@/hooks/useTranslation";
import Logo from "./Logo";

export default function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const scrolled = useScrollHeader();
  const [menuOpen, setMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const { t, lang, setLang } = useTranslation();

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
          {navLinks.map((link) => {
            const navKeyMap: Record<string, keyof typeof t.nav> = {
              '#about': 'about',
              '#services': 'services',
              '#projects': 'projects',
              '#team': 'team',
              'https://talim.bimuz.uz': 'education',
              '#contact': 'contact'
            };
            return (
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
                  {t.nav[navKeyMap[link.href]] || link.label}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div className="lang-switcher" style={{ position: 'relative' }}>
            <button 
              type="button"
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              style={{
                background: 'rgba(248, 248, 246, 0.05)',
                color: 'var(--white)',
                border: '1px solid rgba(248, 248, 246, 0.1)',
                padding: '8px 12px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 600,
                letterSpacing: '0.08em',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(248, 248, 246, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(248, 248, 246, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(248, 248, 246, 0.05)';
                e.currentTarget.style.borderColor = 'rgba(248, 248, 246, 0.1)';
              }}
            >
              {lang.toUpperCase()}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'transform 0.3s', transform: langMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
            
            {langMenuOpen && (
              <div 
                className="lang-dropdown"
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '8px',
                  background: 'var(--ink)',
                  border: '1px solid rgba(248, 248, 246, 0.08)',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  minWidth: '100px',
                  boxShadow: '0 12px 32px rgba(0,0,0,0.4)'
                }}
              >
                {[
                  { code: 'uz', label: 'O\'zbek (UZ)' },
                  { code: 'ru', label: 'Русский (RU)' },
                  { code: 'en', label: 'English (EN)' }
                ].map(l => (
                  <button
                    key={l.code}
                    type="button"
                    style={{
                      background: lang === l.code ? 'rgba(248, 248, 246, 0.1)' : 'transparent',
                      color: 'var(--white)',
                      border: 'none',
                      padding: '12px 16px',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(248, 248, 246, 0.15)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = lang === l.code ? 'rgba(248, 248, 246, 0.1)' : 'transparent'}
                    onClick={() => {
                      setLang(l.code as any);
                      setLangMenuOpen(false);
                    }}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <a
            href="#contact"
            className="btn btn-primary nav-cta"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick("#contact");
            }}
          >
            {t.header.startProject}
          </a>
        </div>
      </nav>
    </header>
  );
}
