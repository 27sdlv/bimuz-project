import type { Metadata } from "next";
import CompanyCabinet from "@/components/revit/CompanyCabinet";
import RevitTopBar, { RevitFootNote } from "@/components/revit/RevitTopBar";

export const metadata: Metadata = {
  title: "BIMUz — Kompaniya kabineti",
  description: "Korporativ obuna: xodimlar, litsenziya kalitlari va kompyuterlarni boshqarish.",
  robots: { index: false, follow: false },
};

export default function CabinetPage() {
  return (
    <>
      <RevitTopBar
        links={[
          { href: "/revit", label: "← Revit plagini" },
          { href: "/revit/korporativ", label: "Korporativ obuna" },
        ]}
      />
      <main>
        <section
          className="section"
          style={{ background: "var(--ink)", color: "var(--white)", position: "relative", minHeight: "70vh" }}
        >
          <div className="section-grid-bg dark" />
          <div className="container" style={{ position: "relative", zIndex: 1 }}>
            <CompanyCabinet />
          </div>
        </section>
      </main>
      <RevitFootNote />
    </>
  );
}
