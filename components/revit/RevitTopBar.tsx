import Link from "next/link";
import LanguageSwitcher from "@/components/LanguageSwitcher";

type NavLink = { href: string; label: string };

/** Revit plagini sahifalari uchun yuqori panel (korporativ va kabinet sahifalari). */
export default function RevitTopBar({ links }: { links: NavLink[] }) {
  return (
    <header
      style={{
        background: "var(--ink)",
        borderBottom: "1px solid rgba(248,248,246,0.08)",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "var(--header-height)",
          gap: 16,
        }}
      >
        <Link
          href="/revit"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.5rem",
            letterSpacing: "0.06em",
            color: "var(--white)",
          }}
        >
          BIMUz
        </Link>
        <nav className="corp-nav">
          {links.map((l) => (
            <Link key={l.href} href={l.href}>
              {l.label}
            </Link>
          ))}
          <LanguageSwitcher />
        </nav>
      </div>
    </header>
  );
}

export function RevitFootNote() {
  return (
    <footer
      style={{
        background: "var(--ink)",
        color: "rgba(248,248,246,0.5)",
        borderTop: "1px solid rgba(248,248,246,0.08)",
        padding: "28px 0",
        fontSize: "0.85rem",
      }}
    >
      <div className="container" style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "space-between" }}>
        <span>© 2026 «BIM SARVAR SADULLAYEV» MChJ</span>
        <span style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          <Link href="/revit" style={{ color: "rgba(248,248,246,0.7)" }}>
            Revit plagini
          </Link>
          <Link href="/oferta" style={{ color: "rgba(248,248,246,0.7)" }}>
            Ommaviy oferta
          </Link>
          <a href="mailto:info@bimuz.uz" style={{ color: "rgba(248,248,246,0.7)" }}>
            info@bimuz.uz
          </a>
        </span>
      </div>
    </footer>
  );
}
