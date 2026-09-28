import type { Metadata } from "next";
import Link from "next/link";
import { formatPrice, getPluginInfo, type PluginPlan } from "@/lib/plugin";

export async function generateMetadata(): Promise<Metadata> {
  const info = await getPluginInfo();
  const m = info.plans.find((p) => p.months === 1);
  const y = info.plans.find((p) => p.months === 12);
  const prices = [
    m ? `Oylik ${formatPrice(m.price)} so'm` : null,
    y ? `yillik ${formatPrice(y.price)} so'm` : null,
  ]
    .filter(Boolean)
    .join(", ");
  return {
    title: "BIMUz — Revit plagini | Narxlar va imkoniyatlar",
    description:
      "BIMUz Revit plagini — armaturalash, konstruktiv elementlar, arxitektura, MEP, loyiha hujjatlari, Excel/IFC eksport, CDE. Revit 2024–2027." +
      (prices ? ` ${prices}.` : "") +
      " 14 kunlik bepul sinov.",
  };
}

const features = [
  {
    title: "Armaturalash",
    desc: "Poydevor plitasi, kolonna, balka va devor armaturasini avtomatik joylashtirish — qo'lda chizishga sarflanadigan soatlarni tejaydi.",
  },
  {
    title: "Konstruktiv elementlar",
    desc: "Kolonna, balka va poydevorlarni tez yaratish, parametrlar bo'yicha boshqarish va standartlashtirish.",
  },
  {
    title: "Arxitektura",
    desc: "Elementlarni parametr bo'yicha ranglash, istalgan parametrni universal raqamlash va o'qlarni avtomatik o'lchash.",
  },
  {
    title: "MEP bo'limi",
    desc: "Teshik vazifasi, kolliziyalar, MEP spetsifikatsiya va markalash; VK, OV va EOM uchun qiyalik, stoyaklar, izolyatsiya, havo balansi, tezlik, yoritgich va kabel hisoblari.",
  },
  {
    title: "Loyiha hujjatlari",
    desc: "Spetsifikatsiyalar, PDF eksport, shtamp, Exceldan listlar, ko'rinishlarni tekislash, chizmalar, pardoz va peremichka vedomostlari, qidirish va almashtirish.",
  },
  {
    title: "Excel, IFC va CDE",
    desc: "Excel bilan ikki tomonlama almashish, IFC host-mapping va umumiy ma'lumotlar muhiti (ISO 19650) bilan bog'lanish.",
  },
  {
    title: "Fikr bildirish va yordam",
    desc: "Plagin ichidan xato yoki taklifni skrinshot bilan yuboring — jamoamiz javobi to'g'ridan-to'g'ri Revitda keladi.",
  },
  {
    title: "Avtomatik yangilanish",
    desc: "Yangi versiyalar plagin ichidan avtomatik yuklab olinadi — har safar qayta o'rnatish shart emas.",
  },
];

const versions = ["Revit 2024", "Revit 2025", "Revit 2026", "Revit 2027"];

type PlanCard = {
  name: string;
  price: string;
  period: string;
  note: string;
  features: string[];
  highlight: boolean;
};

function buildPlans(plans: PluginPlan[], maxDevices: number): PlanCard[] {
  const monthly = plans.find((p) => p.months === 1);
  return [...plans]
    .sort((a, b) => a.months - b.months)
    .map((p) => {
      const yearly = p.months >= 12;
      let note = p.months === 1 ? "Har oy uzaytiriladi" : `${p.months} oylik obuna`;
      if (yearly && monthly && monthly.price > 0) {
        const saving = Math.round((1 - p.price / (monthly.price * p.months)) * 100);
        if (saving > 0) note = `Oylikka nisbatan ~${saving}% tejaladi`;
      }
      return {
        name: p.name,
        price: formatPrice(p.price),
        period: p.months === 1 ? "so'm / oy" : p.months === 12 ? "so'm / yil" : `so'm / ${p.months} oy`,
        note,
        features: [
          "Barcha modullar to'liq",
          "Revit 2024–2027",
          "Avtomatik yangilanishlar",
          `1 kalit — ${maxDevices} ta kompyuter`,
          yearly ? "Ustuvor qo'llab-quvvatlash" : "Telegram orqali qo'llab-quvvatlash",
        ],
        highlight: yearly,
      };
    });
}

const steps = [
  {
    n: "01",
    title: "O'rnatish",
    desc: "O'rnatuvchini yuklab olib ishga tushiring — plagin kompyuteringizdagi Revit versiyalarini o'zi topadi.",
  },
  {
    n: "02",
    title: "Bepul sinov",
    desc: "Revitda «BIMUz → Litsenziya» oynasidan 14 kunlik bepul sinovni boshlang.",
  },
  {
    n: "03",
    title: "Sotib olish",
    desc: "O'sha oynadan Oylik yoki Yillik tarifni tanlab, Payme yoki Click orqali to'lang — kalit e-mailingizga keladi.",
  },
];

export default async function RevitPlaginPage() {
  const info = await getPluginInfo();
  const plans = buildPlans(info.plans, info.maxDevices);

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
          <nav style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            <Link href="/" style={{ color: "rgba(248,248,246,0.7)", fontSize: "0.9rem" }}>
              ← Bosh sahifa
            </Link>
            <a
              href="https://license.bimuz.uz/download"
              className="btn btn-primary"
              style={{ padding: "10px 22px" }}
            >
              Yuklab olish
            </a>
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
            <span className="section-label light">Revit plagini</span>
            <h1
              className="section-title light"
              style={{ fontSize: "clamp(2.4rem, 6vw, 4rem)", maxWidth: 900, margin: "0 auto 20px" }}
            >
              BIMUz — REVIT UCHUN PROFESSIONAL VOSITALAR
            </h1>
            <p
              className="section-desc light"
              style={{ maxWidth: 640, margin: "0 auto 32px", fontSize: "1.1rem" }}
            >
              Armaturalash, konstruktiv elementlar, arxitektura, MEP va loyiha hujjatlari, Excel va IFC eksporti,
              CDE integratsiyasi — loyihachining kundalik ishini tezlashtiradigan bitta plagin. Revit 2024, 2025, 2026
              va 2027 uchun.
            </p>
            {info.version && (
              <p style={{ margin: "-12px auto 28px", fontSize: "0.85rem", letterSpacing: "0.06em", opacity: 0.75 }}>
                So&apos;nggi versiya: <strong>{info.version}</strong>
                {info.published ? ` · ${info.published}` : ""}
                {info.notes.length > 0 && (
                  <>
                    {" · "}
                    <a href="#yangiliklar" style={{ textDecoration: "underline" }}>
                      nima yangi?
                    </a>
                  </>
                )}
              </p>
            )}
            <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
              <a href="https://license.bimuz.uz/download" className="btn btn-primary">
                Yuklab olish
              </a>
              <a href="#narxlar" className="btn btn-outline">
                Narxlarni ko&apos;rish
              </a>
            </div>
            <p className="section-desc light" style={{ margin: "16px auto 0", fontSize: "0.9rem", opacity: 0.75 }}>
              14 kunlik bepul sinov — o&apos;rnatgach Revitda avtomatik boshlanadi.
            </p>
            <div
              style={{
                display: "flex",
                gap: "12px",
                justifyContent: "center",
                flexWrap: "wrap",
                marginTop: "40px",
              }}
            >
              {versions.map((v) => (
                <span
                  key={v}
                  style={{
                    border: "1px solid rgba(107,127,142,0.4)",
                    color: "rgba(248,248,246,0.8)",
                    padding: "8px 18px",
                    fontSize: "0.85rem",
                    letterSpacing: "0.05em",
                  }}
                >
                  {v}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ---- Features ---- */}
        <section className="section services" id="imkoniyatlar">
          <div className="section-grid-bg" />
          <div className="container">
            <div className="section-header" style={{ textAlign: "center" }}>
              <span className="section-label light">Imkoniyatlar</span>
              <h2 className="section-title light">PLAGIN NIMA QILADI</h2>
              <p className="section-desc light" style={{ margin: "0 auto" }}>
                Konstruktiv loyihalashning eng ko'p vaqt oladigan qismlarini avtomatlashtiradi
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

        {/* ---- What's new (litsenziya serveridagi so'nggi reliz izohi) ---- */}
        {info.version && info.notes.length > 0 && (
          <section className="section" id="yangiliklar" style={{ background: "var(--white)", paddingBottom: 0 }}>
            <div className="container" style={{ maxWidth: 760 }}>
              <div className="section-header" style={{ textAlign: "center" }}>
                <span className="section-label">Yangiliklar</span>
                <h2 className="section-title">VERSIYA {info.version}</h2>
                {info.published && (
                  <p className="section-desc" style={{ margin: "0 auto" }}>
                    {info.published} da chiqarildi — o&apos;rnatilgan plaginlar avtomatik yangilanadi.
                  </p>
                )}
              </div>
              <ul
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                  border: "1px solid rgba(107,127,142,0.25)",
                  padding: "28px 32px",
                }}
              >
                {info.notes.map((n) => (
                  <li key={n} style={{ display: "flex", gap: 12, fontSize: "1rem", color: "var(--ink)" }}>
                    <span style={{ color: "var(--steel)" }}>—</span>
                    <span>{n}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* ---- Pricing ---- */}
        <section className="section" id="narxlar" style={{ background: "var(--white)" }}>
          <div className="container">
            <div className="section-header" style={{ textAlign: "center" }}>
              <span className="section-label">Narxlar</span>
              <h2 className="section-title">TARIFLAR</h2>
              <p className="section-desc" style={{ margin: "0 auto" }}>
                Barcha modullar ikkala tarifda ham to'liq ishlaydi. Istalgan vaqtda bekor qilishingiz mumkin.
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "24px",
                maxWidth: 760,
                margin: "0 auto",
              }}
            >
              {plans.map((p) => (
                <div
                  key={p.name}
                  style={{
                    padding: "40px 32px",
                    background: p.highlight ? "var(--ink)" : "var(--white)",
                    color: p.highlight ? "var(--white)" : "var(--ink)",
                    border: p.highlight
                      ? "1px solid var(--ink)"
                      : "1px solid rgba(107,127,142,0.25)",
                    position: "relative",
                  }}
                >
                  {p.highlight && (
                    <span
                      style={{
                        position: "absolute",
                        top: 16,
                        right: 16,
                        fontSize: "0.7rem",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "var(--ink)",
                        background: "var(--white)",
                        padding: "4px 10px",
                      }}
                    >
                      Tejamli
                    </span>
                  )}
                  <div
                    style={{
                      fontSize: "0.8rem",
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: p.highlight ? "rgba(248,248,246,0.7)" : "var(--steel)",
                      marginBottom: 16,
                    }}
                  >
                    {p.name}
                  </div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontFamily: "var(--font-display)", fontSize: "3rem", lineHeight: 1 }}>
                      {p.price}
                    </span>
                    <span style={{ fontSize: "0.95rem", opacity: 0.7 }}>{p.period}</span>
                  </div>
                  <div
                    style={{
                      fontSize: "0.85rem",
                      opacity: 0.7,
                      marginBottom: 24,
                    }}
                  >
                    {p.note}
                  </div>
                  <ul style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
                    {p.features.map((item) => (
                      <li key={item} style={{ display: "flex", gap: 10, fontSize: "0.92rem" }}>
                        <span style={{ opacity: 0.7 }}>—</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href="#qanday"
                    className={p.highlight ? "btn btn-primary" : "btn btn-outline"}
                    style={
                      p.highlight
                        ? { width: "100%" }
                        : { width: "100%", color: "var(--ink)", borderColor: "rgba(18,32,47,0.3)" }
                    }
                  >
                    Sotib olish
                  </a>
                </div>
              ))}
            </div>
            <p
              style={{
                textAlign: "center",
                marginTop: 24,
                fontSize: "0.9rem",
                color: "var(--steel)",
              }}
            >
              To'lov Payme yoki Click orqali amalga oshiriladi. Narxlar QQS bilan.
            </p>
          </div>
        </section>

        {/* ---- How to buy ---- */}
        <section className="section services" id="qanday">
          <div className="section-grid-bg" />
          <div className="container">
            <div className="section-header" style={{ textAlign: "center" }}>
              <span className="section-label light">Qanday sotib olinadi</span>
              <h2 className="section-title light">UCH QADAM</h2>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: "24px",
                position: "relative",
                zIndex: 1,
              }}
            >
              {steps.map((s) => (
                <div key={s.n} className="service-card">
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "2.5rem",
                      color: "var(--accent-muted)",
                      marginBottom: 12,
                    }}
                  >
                    {s.n}
                  </div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              ))}
            </div>
            <p
              style={{
                textAlign: "center",
                marginTop: 40,
                color: "rgba(248,248,246,0.7)",
                fontSize: "0.95rem",
              }}
            >
              To'lovdan so'ng litsenziya kaliti e-mailingizga yuboriladi va Revitda avtomatik faollashadi.
            </p>
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
            <a href="#narxlar" style={{ color: "rgba(248,248,246,0.7)" }}>
              Narxlar
            </a>
            <Link href="/oferta" style={{ color: "rgba(248,248,246,0.7)" }}>
              Ommaviy oferta
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
