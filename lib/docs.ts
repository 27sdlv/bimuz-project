import fs from "fs";
import path from "path";

// Revit plagini bo'yicha foydalanish yo'riqnomalari (build vaqtida o'qiladi — static export).
// Matnlar plagin interfeysidagi kabi o'zbekcha (kirill) va ruscha.

export type L = { uz: string; ru: string };

export type DocFigure = { id: string; caption: L; brief?: string; src?: string };

export type Doc = {
  slug: string;
  section: string;
  commandClass: string;
  ribbon: L;
  title: L;
  summary: L;
  before: L[];
  steps: (L & { figure?: string | null })[];
  settings: { group: L; name: L; desc: L }[];
  result: L[];
  tips: L[];
  figures: DocFigure[];
};

export type DocSection = { id: string; title: L; desc: L; slugs: string[] };

export const SECTIONS: DocSection[] = [
  {
    id: "armatura",
    title: { uz: "Арматуралаш", ru: "Армирование" },
    desc: {
      uz: "Фундамент, плита, девор, колонна ва балкани автоматик арматуралаш, выпусклар, проёмлар ва арматура утилиталари.",
      ru: "Автоматическое армирование фундаментов, плит, стен, колонн и балок, выпуски, проёмы и утилиты для арматуры.",
    },
    slugs: [
      "fundament-lenta",
      "fundament-ustunli",
      "fundament-plita",
      "plita",
      "vipusk-devor",
      "vipusk-kolonna",
      "devor",
      "kolonna",
      "balka",
      "proem-devor",
      "proem-perekritie",
      "armatura-korsatish",
      "armatura-bolish",
      "kolonna-guruhi",
      "host-almashtirish",
      "asosdan-asosga",
      "asosga-nusxalash",
      "asosdagi-ochirish",
      "nabor-portlatish",
      "set-birlashtirish",
      "parametrlar-ommaviy",
      "armatura-audit",
    ],
  },
  {
    id: "hujjatlar",
    title: { uz: "Лойиҳавий ҳужжатлар", ru: "Проектная документация" },
    desc: {
      uz: "Листлар ва жадваллар: варақ рақамлаш, PDF/DWG/Excel экспорт, штамп, ведомостлар, спецификациялар, жадвал ва листларни нусхалаш.",
      ru: "Листы и спецификации: нумерация листов, экспорт в PDF/DWG/Excel, штамп, ведомости, спецификации, копирование спецификаций и листов.",
    },
    slugs: [
      "varaq-raqamlash",
      "excel-varaqlar",
      "varaq-nusxa",
      "shtamp",
      "korinish-tekislash",
      "topish-almashtirish",
      "pdf-eksport",
      "dwg-eksport",
      "excel-eksport",
      "vedomost-chertezh",
      "vedomost-otdelka",
      "vedomost-peremychka",
      "spetsifikatsiya",
      "jadval-nusxa",
      "xona-otdelka",
      "pozitsiyalash",
      "vrs-kalibrovka",
      "beton-armatura",
      "markalash",
    ],
  },
];

const CONTENT = path.join(process.cwd(), "content", "docs");
const PUBLIC = path.join(process.cwd(), "public");
const IMG_EXT = [".webp", ".png", ".jpg", ".svg"];

function findImage(rel: string): string | undefined {
  for (const ext of IMG_EXT) {
    if (fs.existsSync(path.join(PUBLIC, rel + ext))) return "/" + rel + ext;
  }
  return undefined;
}

/** Rasm manzili: public/docs/<slug>/<id>.png (skrinshot) yoki public/docs/schemes/<id>.svg (sxema). */
function figureSrc(slug: string, id: string): string | undefined {
  if (id.startsWith("scheme:")) {
    const name = id.slice("scheme:".length);
    return (
      findImage(`docs/${slug}/${name}`) ??
      findImage(`docs/schemes/${slug}-${name}`) ??
      findImage(`docs/schemes/${name}`)
    );
  }
  return findImage(`docs/${slug}/${id}`);
}

export function getDoc(slug: string): Doc | null {
  for (const s of SECTIONS) {
    const file = path.join(CONTENT, s.id, slug + ".json");
    if (fs.existsSync(file)) {
      const doc = JSON.parse(fs.readFileSync(file, "utf8")) as Doc;
      doc.figures = (doc.figures ?? []).map((f) => ({ ...f, src: figureSrc(slug, f.id) }));
      return doc;
    }
  }
  return null;
}

export function allSlugs(): string[] {
  return SECTIONS.flatMap((s) => s.slugs).filter((slug) => getDoc(slug) !== null);
}

export type DocCard = { slug: string; ribbon: L; title: L; summary: L; hasImage: boolean };

export function sectionCards(section: DocSection): DocCard[] {
  return section.slugs
    .map((slug) => getDoc(slug))
    .filter((d): d is Doc => d !== null)
    .map((d) => ({
      slug: d.slug,
      ribbon: d.ribbon,
      title: d.title,
      summary: d.summary,
      hasImage: d.figures.some((f) => !!f.src),
    }));
}

/** Plagin tugmasi (F1) buyruq klassi bo'yicha sahifani topishi uchun. */
export function classToSlug(): Record<string, string> {
  const map: Record<string, string> = {};
  for (const slug of allSlugs()) {
    const d = getDoc(slug);
    if (d) map[d.commandClass] = slug;
  }
  return map;
}
