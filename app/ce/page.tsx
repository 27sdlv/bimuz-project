import type { Metadata } from "next";
import Link from "next/link";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export const metadata: Metadata = {
  title: "BIMUz CE — Smeta (qurilish smetasi) dasturi",
  description:
    "BIMUz CE — qurilish smetalarini tez va aniq tuzish uchun Windows dasturi. Interfeys o'zbek va rus tilida, normativ baza va hisob-kitoblar bilan.",
};

const features = [
  {
    title: "Smeta tuzish",
    desc: "Qurilish ishlari bo'yicha smetalarni tez, tartibli va xatosiz tuzing.",
  },
  {
    title: "O'zbek va rus tili",
    desc: "Dastur interfeysi ikki tilda — o'zbek va rus. Qulay til bilan ishlang.",
  },
  {
    title: "Normativ baza",
    desc: "Ish va resurs normalari asosida hisob-kitob — qo'lda izlashga vaqt ketmaydi.",
  },
  {
    title: "Avtomatik hisob-kitob",
    desc: "Hajm, narx va koeffitsiyentlar avtomatik hisoblanadi — arifmetik xatolar yo'q.",
  },
  {
    title: "Excel va chop etish",
    desc: "Tayyor smetani Excel'ga eksport qiling yoki chop eting — hisobot va topshirish uchun.",
  },
  {
    title: "Windows dasturi",
    desc: "Kompyuterda o'rnatiladigan mustaqil dastur — internetga doimiy ulanish shart emas.",
  },
];

export default function CePage() {
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
              href="https://t.me/BIMUz_uz"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{ padding: "10px 22px" }}
            >
              Bog&apos;lanish
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
            <span className="section-label light">BIMUz CE</span>
            <div style={{ marginBottom: 16 }}>
              <span
                style={{
                  display: "inline-block",
                  border: "1px solid rgba(248,248,246,0.35)",
                  color: "rgba(248,248,246,0.85)",
                  padding: "6px 16px",
                  fontSize: "0.75rem",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                }}
              >
                Tez orada
              </span>
            </div>
            <h1
              className="section-title light"
              style={{ fontSize: "clamp(2.4rem, 6vw, 4rem)", maxWidth: 900, margin: "0 auto 20px" }}
            >
              SMETA DASTURI
            </h1>
            <p
              className="section-desc light"
              style={{ maxWidth: 640, margin: "0 auto 32px", fontSize: "1.1rem" }}
            >
              Qurilish smetalarini tez va aniq tuzish uchun Windows dasturi. Interfeys o&apos;zbek va rus
              tilida, normativ baza va avtomatik hisob-kitoblar bilan. Dastur hozir ishlab chiqilmoqda.
            </p>
            <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
              <a href="https://t.me/BIMUz_uz" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                Chiqishidan xabardor bo&apos;ling
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
              <h2 className="section-title light">DASTUR NIMA QILADI</h2>
              <p className="section-desc light" style={{ margin: "0 auto" }}>
                Smeta ishini soddalashtiradigan asosiy imkoniyatlar
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

        {/* ---- CTA ---- */}
        <section className="section" style={{ background: "var(--white)" }}>
          <div className="container" style={{ textAlign: "center", maxWidth: 720 }}>
            <div className="section-header" style={{ textAlign: "center", marginBottom: 20 }}>
              <span className="section-label">Tez orada</span>
              <h2 className="section-title">CHIQISHIDAN XABARDOR BO&apos;LING</h2>
            </div>
            <p style={{ color: "var(--ink-light)", fontSize: "1.05rem", lineHeight: 1.8, marginBottom: 28 }}>
              Dastur hozir ishlab chiqilmoqda. Chiqishi va narxi haqida birinchilardan bo&apos;lib
              xabar olish uchun biz bilan bog&apos;laning.
            </p>
            <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
              <a href="https://t.me/BIMUz_uz" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                Telegram orqali
              </a>
              <a href="mailto:info@bimuz.uz" className="btn btn-outline" style={{ color: "var(--ink)", borderColor: "rgba(18,32,47,0.3)" }}>
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
            <Link href="/cde" style={{ color: "rgba(248,248,246,0.7)" }}>
              BIMUz CDE
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
