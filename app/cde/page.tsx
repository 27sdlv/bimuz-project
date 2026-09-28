import type { Metadata } from "next";
import Link from "next/link";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export const metadata: Metadata = {
  title: "BIMUz CDE — Umumiy ma'lumotlar muhiti (ISO 19650)",
  description:
    "BIMUz CDE — loyiha ma'lumotlari va hujjatlarini markazlashtirilgan boshqarish uchun veb-platforma (ISO 19650). Tashkilotlar bo'yicha ajratilgan kirish, rollar va versiyalar nazorati.",
};

const CDE_URL = "https://cde.bimuz.uz";

const features = [
  {
    title: "Markazlashtirilgan hujjatlar",
    desc: "Barcha loyiha fayllari, chizmalar va modellar bitta joyda — har doim eng so'nggi versiya qo'l ostida.",
  },
  {
    title: "Versiyalar nazorati",
    desc: "Har bir hujjatning tarixi saqlanadi; kim, qachon va nimani o'zgartirganini kuzatib borish mumkin.",
  },
  {
    title: "Loyiha asosida kirish",
    desc: "Foydalanuvchilar faqat o'zlari biriktirilgan loyihalarni ko'radi — keraksiz ma'lumot ko'rinmaydi.",
  },
  {
    title: "Tashkilotlar izolyatsiyasi",
    desc: "Har bir tashkilot faqat o'z ma'lumotlarini ko'radi; boshqa kompaniyalarning loyihalari mutlaqo ko'rinmaydi.",
  },
  {
    title: "Rollar va ruxsatlar",
    desc: "Tashkilot o'z adminlarini qo'shadi va ishtirokchilarga rol beradi — nazorat to'liq sizda.",
  },
  {
    title: "ISO 19650 jarayoni",
    desc: "Ma'lumot almashinuvi xalqaro ISO 19650 standarti asosida tashkil etilgan — tartibli va shaffof.",
  },
  {
    title: "Brauzerdan ishlash",
    desc: "Hech qanday dastur o'rnatish shart emas — istalgan qurilmadan brauzer orqali kiriladi.",
  },
  {
    title: "Jamoaviy hamkorlik",
    desc: "Arxitektor, konstruktor va muhandislar bitta muhitda birga ishlaydi — chalkashliksiz.",
  },
];

export default function CdePage() {
  return (
    <>
      {/* ---- Top bar ---- */}
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
          }}
        >
          <Link
            href="/"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.5rem",
              letterSpacing: "0.06em",
              color: "var(--white)",
            }}
          >
            BIMUz
          </Link>
          <nav className="sub-nav" style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            <Link href="/" style={{ color: "rgba(248,248,246,0.7)", fontSize: "0.9rem" }}>
              ← Bosh sahifa
            </Link>
            <a
              href={CDE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{ padding: "10px 22px" }}
            >
              Platformaga kirish
            </a>
            <LanguageSwitcher />
          </nav>
        </div>
      </header>

      <main>
        {/* ---- Hero ---- */}
        <section
          className="section"
          style={{ background: "var(--ink)", color: "var(--white)", position: "relative" }}
        >
          <div className="section-grid-bg dark" />
          <div className="container" style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
            <span className="section-label light">BIMUz CDE</span>
            <h1
              className="section-title light"
              style={{ fontSize: "clamp(2.4rem, 6vw, 4rem)", maxWidth: 900, margin: "0 auto 20px" }}
            >
              UMUMIY MA&apos;LUMOTLAR MUHITI
            </h1>
            <p
              className="section-desc light"
              style={{ maxWidth: 660, margin: "0 auto 32px", fontSize: "1.1rem" }}
            >
              Loyiha ma&apos;lumotlari va hujjatlarini bitta xavfsiz muhitda boshqaring. ISO 19650 standarti
              asosida qurilgan veb-platforma — jamoangiz va mijozlaringiz uchun tartibli hamkorlik.
            </p>
            <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
              <a href={CDE_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                Platformaga o&apos;tish
              </a>
              <a
                href="https://t.me/BIMUz_uz"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
              >
                Demo so&apos;rash
              </a>
            </div>
          </div>
        </section>

        {/* ---- Features ---- */}
        <section className="section services" id="imkoniyatlar">
          <div className="section-grid-bg" />
          <div className="container">
            <div className="section-header" style={{ textAlign: "center" }}>
              <span className="section-label light">Imkoniyatlar</span>
              <h2 className="section-title light">PLATFORMA NIMA BERADI</h2>
              <p className="section-desc light" style={{ margin: "0 auto" }}>
                Loyiha ma&apos;lumotlarini boshqarishning zamonaviy va xavfsiz usuli
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "24px",
                position: "relative",
                zIndex: 1,
              }}
            >
              {features.map((f) => (
                <div key={f.title} className="service-card">
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---- For whom ---- */}
        <section className="section" style={{ background: "var(--white)" }}>
          <div className="container" style={{ maxWidth: 820, textAlign: "center" }}>
            <div className="section-header" style={{ textAlign: "center", marginBottom: 32 }}>
              <span className="section-label">Kim uchun</span>
              <h2 className="section-title">TASHKILOTLAR UCHUN</h2>
            </div>
            <p style={{ color: "var(--ink-light)", fontSize: "1.05rem", lineHeight: 1.8 }}>
              Qurilish va loyihalash tashkilotlari, bosh pudratchilar va buyurtmachilar uchun. Har bir
              tashkilot o&apos;z ish maydoniga ega bo&apos;ladi, o&apos;z adminlari va ishtirokchilarini
              boshqaradi. Ma&apos;lumotlar boshqa kompaniyalarga ko&apos;rinmaydi.
            </p>
            <div style={{ marginTop: 32 }}>
              <a href={CDE_URL} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ color: "var(--ink)", borderColor: "rgba(18,32,47,0.3)" }}>
                Platformaga o&apos;tish →
              </a>
            </div>
          </div>
        </section>

        {/* ---- CTA ---- */}
        <section className="section services">
          <div className="section-grid-bg" />
          <div className="container" style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
            <h2 className="section-title light" style={{ marginBottom: 16 }}>
              TASHKILOTINGIZNI ULANG
            </h2>
            <p className="section-desc light" style={{ margin: "0 auto 28px" }}>
              Tashkilotingiz uchun ish maydoni ochish yoki demo ko&apos;rish uchun bog&apos;laning.
            </p>
            <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
              <a href={CDE_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                Platformaga kirish
              </a>
              <a href="mailto:info@bimuz.uz" className="btn btn-outline">
                info@bimuz.uz
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* ---- Footer ---- */}
      <footer style={{ background: "var(--ink)", color: "var(--white)", padding: "48px 0 24px" }}>
        <div
          className="container"
          style={{ display: "flex", flexWrap: "wrap", gap: 24, justifyContent: "space-between" }}
        >
          <div style={{ maxWidth: 360 }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", letterSpacing: "0.06em" }}>
              BIMUz
            </div>
            <p style={{ color: "rgba(248,248,246,0.6)", fontSize: "0.9rem", marginTop: 12 }}>
              «BIM SARVAR SADULLAYEV» MChJ. Revit texnologiyasi asosida professional BIM vositalari.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: "0.9rem" }}>
            <Link href="/" style={{ color: "rgba(248,248,246,0.7)" }}>
              Bosh sahifa
            </Link>
            <Link href="/revit" style={{ color: "rgba(248,248,246,0.7)" }}>
              Revit plagin
            </Link>
            <Link href="/ce" style={{ color: "rgba(248,248,246,0.7)" }}>
              BIMUz CE
            </Link>
            <a href="mailto:info@bimuz.uz" style={{ color: "rgba(248,248,246,0.7)" }}>
              info@bimuz.uz
            </a>
          </div>
        </div>
        <div
          className="container"
          style={{
            marginTop: 32,
            paddingTop: 20,
            borderTop: "1px solid rgba(248,248,246,0.08)",
            fontSize: "0.85rem",
            color: "rgba(248,248,246,0.5)",
          }}
        >
          © 2026 BIMUz. Barcha huquqlar himoyalangan.
        </div>
      </footer>
    </>
  );
}
