import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Ommaviy oferta | BIMUz",
  description:
    "BIMUz Revit plagini obunasi bo'yicha ommaviy oferta — «BIM SARVAR SADULLAYEV» MChJ. Xizmat sharti, narx, to'lov va litsenziya shartlari.",
};

const sections: { h: string; items: string[] }[] = [
  {
    h: "1. Umumiy qoidalar",
    items: [
      "1.1. Ushbu hujjat «BIM SARVAR SADULLAYEV» mas'uliyati cheklangan jamiyati (keyingi o'rinlarda — «Sotuvchi») tomonidan e'lon qilingan ommaviy oferta hisoblanadi.",
      "1.2. Oferta O'zbekiston Respublikasi Fuqarolik kodeksining 367 va 369-moddalariga muvofiq tuzilgan.",
      "1.3. Xizmatga to'lovni amalga oshirish oferta shartlarini to'liq va so'zsiz qabul qilish (akцept) hisoblanadi. Shundan so'ng jismoniy yoki yuridik shaxs «Foydalanuvchi» maqomiga ega bo'ladi.",
    ],
  },
  {
    h: "2. Shartnoma predmeti",
    items: [
      "2.1. Sotuvchi Foydalanuvchiga «BIMUz» dasturiy mahsulotidan (Autodesk Revit uchun plagin) belgilangan muddatga foydalanish uchun oddiy (istisnosiz) litsenziya taqdim etadi.",
      "2.2. Dasturiy mahsulot armaturalash, konstruktiv elementlarni yaratish, ma'lumotlarni Excel/IFC formatlarida almashish va boshqa BIM vositalarini o'z ichiga oladi.",
      "2.3. Dastur Revit 2024, 2025, 2026 va 2027 versiyalarini qo'llab-quvvatlaydi.",
    ],
  },
  {
    h: "3. Litsenziya va foydalanish shartlari",
    items: [
      "3.1. Litsenziya obuna asosida (oylik yoki yillik) taqdim etiladi va to'lov amalga oshirilgan paytdan boshlab amal qiladi.",
      "3.2. Bitta litsenziya kaliti bir vaqtning o'zida ikkitagacha kompyuterda ishlatilishi mumkin.",
      "3.3. Foydalanuvchi dasturni ko'chirish, dekompilyatsiya qilish, o'zgartirish yoki uchinchi shaxslarga qayta sotish huquqiga ega emas.",
      "3.4. Yangi versiyalar obuna amal qilish muddati davomida qo'shimcha to'lovsiz taqdim etiladi.",
    ],
  },
  {
    h: "4. Narx va to'lov tartibi",
    items: [
      "4.1. Xizmat narxi: oylik obuna — 105 000 so'm; yillik obuna — 815 000 so'm. Narxlar QQS bilan ko'rsatilgan.",
      "4.2. To'lov Payme yoki Click to'lov tizimlari orqali onlayn amalga oshiriladi.",
      "4.3. To'lov muvaffaqiyatli amalga oshirilgach, litsenziya kaliti Foydalanuvchining e-mail manziliga yuboriladi va dasturda avtomatik faollashadi.",
      "4.4. Sotuvchi narxlarni bir tomonlama o'zgartirishga haqli; o'zgarish allaqachon to'langan obuna muddatiga ta'sir qilmaydi.",
    ],
  },
  {
    h: "5. Pulni qaytarish shartlari",
    items: [
      "5.1. Sotib olishdan oldin Foydalanuvchi dasturni 14 kun davomida bepul sinab ko'rish imkoniyatiga ega bo'ladi.",
      "5.2. Texnik sabablarga ko'ra dastur ishlamay qolsa va Sotuvchi muammoni 7 ish kuni ichida bartaraf eta olmasa, Foydalanuvchi foydalanilmagan muddat uchun mutanosib ravishda pulni qaytarishni talab qilishi mumkin.",
      "5.3. Qaytarish so'rovi info@bimuz.uz manziliga yuboriladi va 10 ish kuni ichida ko'rib chiqiladi.",
    ],
  },
  {
    h: "6. Tomonlarning majburiyatlari",
    items: [
      "6.1. Sotuvchi dasturning ishlashini ta'minlaydi, yangilanishlar chiqaradi va Telegram hamda e-mail orqali qo'llab-quvvatlash ko'rsatadi.",
      "6.2. Foydalanuvchi litsenziya kaliti maxfiyligini saqlaydi va dasturdan ushbu oferta shartlariga muvofiq foydalanadi.",
    ],
  },
  {
    h: "7. Javobgarlik",
    items: [
      "7.1. Dastur «boracha» (as is) taqdim etiladi. Sotuvchi dasturdan foydalanish natijasida yuzaga kelishi mumkin bo'lgan bilvosita zararlar uchun javobgar emas.",
      "7.2. Sotuvchining javobgarligi Foydalanuvchi to'lagan obuna summasidan oshmaydi.",
    ],
  },
  {
    h: "8. Maxfiylik",
    items: [
      "8.1. Sotuvchi Foydalanuvchining shaxsiy ma'lumotlarini (e-mail, telefon) faqat xizmat ko'rsatish maqsadida qayta ishlaydi va uchinchi shaxslarga bermaydi.",
    ],
  },
  {
    h: "9. Yakuniy qoidalar",
    items: [
      "9.1. Nizolar muzokara yo'li bilan, kelishuvga erishilmasa — O'zbekiston Respublikasi qonunchiligiga muvofiq hal etiladi.",
      "9.2. Ushbu oferta bimuz.uz saytida e'lon qilingan paytdan boshlab amal qiladi.",
    ],
  },
];

export default function OfertaPage() {
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
            <Link href="/revit" style={{ color: "rgba(248,248,246,0.7)", fontSize: "0.9rem" }}>
              Revit plagin
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="section" style={{ background: "var(--white)" }}>
          <div className="container" style={{ maxWidth: 860 }}>
            <div className="section-header">
              <span className="section-label">Hujjat</span>
              <h1 className="section-title">OMMAVIY OFERTA</h1>
              <p className="section-desc" style={{ maxWidth: "100%" }}>
                BIMUz Revit plagini obunasi bo'yicha xizmat ko'rsatish shartlari.
              </p>
            </div>

            {sections.map((s) => (
              <div key={s.h} style={{ marginBottom: 32 }}>
                <h2
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.4rem",
                    letterSpacing: "0.03em",
                    marginBottom: 14,
                    color: "var(--ink)",
                  }}
                >
                  {s.h}
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {s.items.map((it, i) => (
                    <p key={i} style={{ color: "var(--ink-light)", fontSize: "0.98rem", lineHeight: 1.7 }}>
                      {it}
                    </p>
                  ))}
                </div>
              </div>
            ))}

            {/* ---- Requisites ---- */}
            <div
              style={{
                marginTop: 40,
                padding: "28px 28px",
                border: "1px solid rgba(107,127,142,0.25)",
                background: "hsl(40 6% 95%)",
              }}
            >
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.4rem",
                  letterSpacing: "0.03em",
                  marginBottom: 16,
                  color: "var(--ink)",
                }}
              >
                10. Sotuvchi rekvizitlari
              </h2>
              <dl style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "10px 20px", fontSize: "0.95rem" }}>
                <dt style={{ color: "var(--steel)" }}>Tashkilot nomi</dt>
                <dd style={{ color: "var(--ink)" }}>«BIM SARVAR SADULLAYEV» MChJ</dd>

                <dt style={{ color: "var(--steel)" }}>STIR (INN)</dt>
                <dd style={{ color: "var(--ink)" }}>312636823</dd>

                <dt style={{ color: "var(--steel)" }}>OKED</dt>
                <dd style={{ color: "var(--ink)" }}>62020</dd>

                <dt style={{ color: "var(--steel)" }}>Yuridik manzil</dt>
                <dd style={{ color: "var(--ink)" }}>Xorazm v., Shovot tumani, Zamondosh MFY, ibn-Sino ko&apos;chasi, 1-uy</dd>

                <dt style={{ color: "var(--steel)" }}>H/r (hisob raqami)</dt>
                <dd style={{ color: "var(--ink)" }}>20208000407361588001</dd>

                <dt style={{ color: "var(--steel)" }}>Bank</dt>
                <dd style={{ color: "var(--ink)" }}>&quot;Milliy bank&quot; AJ, Mirzo Ulug&apos;bek filiali</dd>

                <dt style={{ color: "var(--steel)" }}>MFO</dt>
                <dd style={{ color: "var(--ink)" }}>00450</dd>

                <dt style={{ color: "var(--steel)" }}>Direktor</dt>
                <dd style={{ color: "var(--ink)" }}>Sadullayev Sarvar</dd>

                <dt style={{ color: "var(--steel)" }}>Telefon</dt>
                <dd style={{ color: "var(--ink)" }}>+998 99 948 33 44</dd>

                <dt style={{ color: "var(--steel)" }}>E-mail</dt>
                <dd style={{ color: "var(--ink)" }}>info@bimuz.uz</dd>
              </dl>
            </div>

            <p style={{ marginTop: 24, fontSize: "0.85rem", color: "var(--steel)" }}>
              Tahrir sanasi: 2026-yil.
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
            <Link href="/revit" style={{ color: "rgba(248,248,246,0.7)" }}>
              Revit plagin
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
