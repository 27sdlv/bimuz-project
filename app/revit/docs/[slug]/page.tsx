import type { Metadata } from "next";
import { notFound } from "next/navigation";
import RevitTopBar, { RevitFootNote } from "@/components/revit/RevitTopBar";
import DocView from "@/components/docs/DocView";
import { SECTIONS, allSlugs, getDoc } from "@/lib/docs";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return allSlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const doc = getDoc(slug);
  if (!doc) return {};
  return {
    title: `BIMUz — ${doc.title.uz} | ${doc.title.ru}`,
    description: doc.summary.ru,
  };
}

export default async function DocPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const doc = getDoc(slug);
  if (!doc) notFound();
  const section = SECTIONS.find((s) => s.id === doc.section) ?? SECTIONS[0];

  return (
    <>
      <RevitTopBar
        links={[
          { href: "/revit", label: "← Revit plagini" },
          { href: "/revit/docs", label: "Yo'riqnomalar" },
        ]}
      />
      <main className="doc-page">
        <div className="container doc-container">
          <DocView doc={doc} sectionTitle={section.title} />
        </div>
      </main>
      <RevitFootNote />
    </>
  );
}
