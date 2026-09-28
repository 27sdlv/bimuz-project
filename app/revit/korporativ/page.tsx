import type { Metadata } from "next";
import Link from "next/link";
import CorporateRequest from "@/components/revit/CorporateRequest";
import RevitTopBar, { RevitFootNote } from "@/components/revit/RevitTopBar";
import { getCorporatePricing, money, quote } from "@/lib/corporate";

export const metadata: Metadata = {
  title: "BIMUz — Korporativ obuna | Revit plagini kompaniyalar uchun",
  description:
    "BIMUz Revit plagini kompaniyalar uchun: xodimlar soni bo'yicha o'rinlar, shartnoma va bank o'tkazmasi, o'rin soniga qarab chegirma, xodimlarni boshqarish kabineti.",
};

const benefits = [
  {
    title: "Xodim bo'yicha o'rinlar",
    desc: "Har bir o'rin — bitta xodim. Har bir xodim o'z litsenziya kalitini oladi va uni 2 ta kompyuterda ishlatadi.",
  },
  {
    title: "Shartnoma va bank o'tkazmasi",
    desc: "Tashkilot nomiga shartnoma, to'lov uchun hisob va elektron hisob-faktura (EHF). Pul tushgach obuna darhol faollashadi.",
  },
  {
    title: "Kompaniya kabineti",
    desc: "Mas'ul xodim bimuz.uz kabinetida xodim qo'shadi yoki chiqaradi, kalitlarni tarqatadi, kompyuterlarni ko'radi va bo'shatadi.",
  },
  {
    title: "Barcha modullar",
    desc: "Armaturalash, konstruktiv, arxitektura, MEP, hujjatlar, Excel/IFC va CDE — Revit 2024–2027, avtomatik yangilanishlar bilan.",
  },
];

export default async function CorporatePage() {
  const pricing = await getCorporatePricing();
  const yearTerm = pricing.terms.includes(12) ? 12 : pricing.terms[pricing.terms.length - 1];

  return (
    <>
      <RevitTopBar
        links={[
          { href: "/revit", label: "← Revit plagini" },
          { href: "/revit/cabinet", label: "Kompaniya kabineti" },
        ]}
      />

      <main>
        <section className="section" style={{ background: "var(--ink)", color: "var(--white)", position: "relative" }}>
          <div className="section-grid-bg dark" />
          <div className="container" style={{ position: "relative", zIndex: 1 }}>
            <div className="section-header" style={{ textAlign: "center" }}>
              <span className="section-label light">Kompaniyalar uchun</span>
              <h1 className="section-title light" style={{ fontSize: "clamp(2.2rem, 5vw, 3.6rem)" }}>
                KORPORATIV OBUNA
              </h1>
              <p className="section-desc light" style={{ margin: "0 auto", maxWidth: 680 }}>
                Loyiha tashkilotingizdagi barcha loyihachilar uchun BIMUz — bitta shartnoma, bitta hisob, xodimlarni
                o&apos;zingiz boshqarasiz.
              </p>
            </div>

            <div className="corp-tiers">
              <div>
                <span>{pricing.minSeats}+ o&apos;rin</span>
                <strong>standart narx</strong>
              </div>
              {pricing.discounts
                .slice()
                .sort((a, b) => a.minSeats - b.minSeats)
                .map((d) => (
                  <div key={d.minSeats}>
                    <span>{d.minSeats}+ o&apos;rin</span>
                    <strong>−{d.percent}%</strong>
                    <em>
                      {money(Math.round(quote(pricing, d.minSeats, yearTerm).total / d.minSeats / 1000) * 1000)} so&apos;m /
                      xodim / yil
                    </em>
                  </div>
                ))}
            </div>

            <CorporateRequest pricing={pricing} />
          </div>
        </section>

        <section className="section" style={{ background: "var(--white)" }}>
          <div className="container">
            <div className="section-header" style={{ textAlign: "center" }}>
              <span className="section-label">Qanday ishlaydi</span>
              <h2 className="section-title">AFZALLIKLAR</h2>
            </div>
            <div className="corp-benefits">
              {benefits.map((b) => (
                <div key={b.title}>
                  <h3>{b.title}</h3>
                  <p>{b.desc}</p>
                </div>
              ))}
            </div>

            <ol className="corp-steps">
              <li>
                <span>
                <strong>Ariza</strong> — o&apos;rinlar soni va muddatni tanlab, yuqoridagi arizani yuboring.
                </span>
              </li>
              <li>
                <span>
                <strong>Shartnoma va to&apos;lov</strong> — shartnoma va hisobni olasiz, bank orqali to&apos;laysiz.
                </span>
              </li>
              <li>
                <span>
                <strong>Kabinet</strong> — mas&apos;ul xodim e-mailiga kirish kaliti keladi.{" "}
                <Link href="/revit/cabinet">Kabinetda</Link> xodimlarni qo&apos;shasiz — har biriga litsenziya kaliti
                beriladi.
                </span>
              </li>
              <li>
                <span>
                <strong>Ish</strong> — xodim plaginni o&apos;rnatib, kalitni Revit → BIMUz → Litsenziya oynasiga kiritadi.
                </span>
              </li>
            </ol>
            <p style={{ textAlign: "center", color: "var(--steel)", fontSize: "0.9rem", marginTop: 24 }}>
              Savollar bo&apos;lsa: <a href="mailto:info@bimuz.uz">info@bimuz.uz</a>
            </p>
          </div>
        </section>
      </main>

      <RevitFootNote />
    </>
  );
}
