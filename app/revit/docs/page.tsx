import type { Metadata } from "next";
import RevitTopBar, { RevitFootNote } from "@/components/revit/RevitTopBar";
import DocsIndex from "@/components/docs/DocsIndex";
import { SECTIONS, sectionCards } from "@/lib/docs";

export const metadata: Metadata = {
  title: "BIMUz — Foydalanish yo'riqnomasi | Revit plagini",
  description: "BIMUz Revit plagini buyruqlari bo'yicha qadam-baqadam yo'riqnomalar: armaturalash, konstruktiv, MEP va boshqalar.",
};

export default function DocsIndexPage() {
  const sections = SECTIONS.map((section) => ({ section, cards: sectionCards(section) }));
  return (
    <>
      <RevitTopBar links={[{ href: "/revit", label: "← Revit plagini" }]} />
      <main className="doc-page">
        <div className="container">
          <DocsIndex sections={sections} />
        </div>
      </main>
      <RevitFootNote />
    </>
  );
}
