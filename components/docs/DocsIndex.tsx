"use client";

import Link from "next/link";
import type { DocCard, DocSection } from "@/lib/docs";
import { UI, pick, useDocLang } from "./DocsLang";

export default function DocsIndex({ sections }: { sections: { section: DocSection; cards: DocCard[] }[] }) {
  const lang = useDocLang();

  return (
    <div className="doc-index" data-no-translate>
      <header className="doc-head">
        <h1>{pick(UI.docs, lang)}</h1>
        <p className="doc-lead">{pick(UI.f1, lang)}</p>
      </header>

      {sections.map(({ section, cards }) => (
        <section key={section.id}>
          <h2>
            {pick(section.title, lang)} <small>· {cards.length} {pick(UI.commands, lang)}</small>
          </h2>
          <p className="doc-section-desc">{pick(section.desc, lang)}</p>
          <div className="doc-cards">
            {cards.map((c) => (
              <Link key={c.slug} href={`/revit/docs/${c.slug}`} className="doc-card">
                <span className="doc-card-btn">{pick(c.ribbon, lang)}</span>
                <b>{pick(c.title, lang)}</b>
                <span className="doc-card-sum">{pick(c.summary, lang)}</span>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
