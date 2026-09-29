"use client";

import Link from "next/link";
import type { Doc, DocFigure } from "@/lib/docs";
import { UI, pick, useDocLang } from "./DocsLang";

function Figure({ fig, lang }: { fig: DocFigure; lang: "uz" | "ru" }) {
  if (!fig.src) return null;
  return (
    <figure className="doc-figure">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={fig.src} alt={pick(fig.caption, lang)} loading="lazy" />
      <figcaption>{pick(fig.caption, lang)}</figcaption>
    </figure>
  );
}

export default function DocView({ doc, sectionTitle }: { doc: Doc; sectionTitle: { uz: string; ru: string } }) {
  const lang = useDocLang();
  const figs = new Map(doc.figures.map((f) => [f.id, f]));
  const used = new Set<string>();

  const figFor = (id?: string | null) => {
    if (!id || used.has(id)) return null;
    const f = figs.get(id);
    if (!f?.src) return null;
    used.add(id);
    return <Figure fig={f} lang={lang} />;
  };

  // Settings grouped in UI order.
  const groups: { title: string; rows: Doc["settings"] }[] = [];
  for (const s of doc.settings ?? []) {
    const g = pick(s.group, lang);
    const last = groups[groups.length - 1];
    if (last && last.title === g) last.rows.push(s);
    else groups.push({ title: g, rows: [s] });
  }

  return (
    <article className="doc" data-no-translate>
      <nav className="doc-crumbs">
        <Link href="/revit/docs">{pick(UI.back, lang)}</Link>
        <span>{pick(sectionTitle, lang)}</span>
      </nav>

      <header className="doc-head">
        <span className="doc-button">
          {pick(UI.button, lang)}: <b>{pick(doc.ribbon, lang)}</b>
        </span>
        <h1>{pick(doc.title, lang)}</h1>
        <p className="doc-lead">{pick(doc.summary, lang)}</p>
      </header>

      {figFor("window")}

      {doc.before?.length > 0 && (
        <section>
          <h2>{pick(UI.before, lang)}</h2>
          <ul className="doc-list">
            {doc.before.map((b, i) => (
              <li key={i}>{pick(b, lang)}</li>
            ))}
          </ul>
        </section>
      )}

      {doc.steps?.length > 0 && (
        <section>
          <h2>{pick(UI.steps, lang)}</h2>
          <ol className="doc-steps">
            {doc.steps.map((s, i) => (
              <li key={i}>
                <p>{pick(s, lang)}</p>
                {figFor(s.figure)}
              </li>
            ))}
          </ol>
        </section>
      )}

      {groups.length > 0 && (
        <section>
          <h2>{pick(UI.settings, lang)}</h2>
          {groups.map((g, gi) => (
            <div key={gi} className="doc-group">
              {g.title && <h3>{g.title}</h3>}
              <table className="doc-table">
                <thead>
                  <tr>
                    <th>{pick(UI.field, lang)}</th>
                    <th>{pick(UI.meaning, lang)}</th>
                  </tr>
                </thead>
                <tbody>
                  {g.rows.map((r, ri) => (
                    <tr key={ri}>
                      <td>{pick(r.name, lang)}</td>
                      <td>{pick(r.desc, lang)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </section>
      )}

      {doc.result?.length > 0 && (
        <section>
          <h2>{pick(UI.result, lang)}</h2>
          <ul className="doc-list">
            {doc.result.map((r, i) => (
              <li key={i}>{pick(r, lang)}</li>
            ))}
          </ul>
          {figFor("result")}
        </section>
      )}

      {/* Qolgan sxemalar (qadamlarda ishlatilmaganlari) */}
      {doc.figures.filter((f) => f.src && !used.has(f.id)).map((f) => (
        <Figure key={f.id} fig={f} lang={lang} />
      ))}

      {doc.tips?.length > 0 && (
        <section>
          <h2>{pick(UI.tips, lang)}</h2>
          <ul className="doc-list doc-tips">
            {doc.tips.map((t, i) => (
              <li key={i}>{pick(t, lang)}</li>
            ))}
          </ul>
        </section>
      )}

      <p className="doc-f1">{pick(UI.f1, lang)}</p>
    </article>
  );
}
