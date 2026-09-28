// BIMUz Revit plagini haqidagi ma'lumot — sayt qurilayotganda (build) litsenziya serveridan olinadi.
// Server javob bermasa, data/plugin.json (oxirgi ma'lum holat) ishlatiladi va sayt buzilmaydi.
// .github/workflows/plugin-sync.yml har 30 daqiqada serverni tekshiradi: yangi reliz yoki narx
// o'zgarsa data/plugin.json ni yangilab main'ga yozadi va Vercel saytni o'zi qayta quradi.

import snapshot from "@/data/plugin.json";

const SERVER = process.env.BIMUZ_LICENSE_SERVER || "https://license.bimuz.uz";

export type PluginPlan = { code: string; name: string; price: number; months: number };

export type PluginInfo = {
  version: string | null;
  published: string | null; // "28.09.2026"
  notes: string[]; // lotin yozuvida
  sizeMb: number | null;
  plans: PluginPlan[];
  maxDevices: number;
  live: boolean; // ma'lumot serverdan olindimi
};

const FALLBACK_PLANS: PluginPlan[] = [
  { code: "monthly", name: "Oylik", price: 105000, months: 1 },
  { code: "yearly", name: "Yillik", price: 815000, months: 12 },
];

async function getJson<T>(url: string): Promise<T | null> {
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 8000);
    const res = await fetch(url, { signal: ctrl.signal });
    clearTimeout(timer);
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

type PlansResponse = {
  ok: boolean;
  maxDevices?: number;
  plans?: { code: string; name: string; price: number; months: number }[];
};

type LatestResponse = {
  ok: boolean;
  version?: string;
  notes?: string;
  published?: string;
  size?: number;
};

export async function getPluginInfo(): Promise<PluginInfo> {
  const [livePlansRes, liveLatestRes] = await Promise.all([
    getJson<PlansResponse>(`${SERVER}/api/plans`),
    // Hamma yillar bir xil versiyada chiqariladi — 2025 ni namuna sifatida olamiz.
    getJson<LatestResponse>(`${SERVER}/api/updates/latest?revit=2025&current=0.0.0.0`),
  ]);
  const plans = livePlansRes?.ok ? livePlansRes : (snapshot.plans as PlansResponse);
  const latest = liveLatestRes?.ok ? liveLatestRes : (snapshot.latest as LatestResponse);

  const livePlans =
    plans?.ok && plans.plans && plans.plans.length > 0
      ? plans.plans.map((p) => ({
          code: p.code,
          name: toLatin(p.name),
          price: p.price,
          months: p.months,
        }))
      : null;

  const hasLatest = !!(latest?.ok && latest.version);

  return {
    version: hasLatest ? latest!.version! : null,
    published: hasLatest ? formatDate(latest!.published) : null,
    notes: hasLatest ? splitNotes(latest!.notes) : [],
    sizeMb: hasLatest && latest!.size ? Math.round((latest!.size / 1024 / 1024) * 10) / 10 : null,
    plans: livePlans ?? FALLBACK_PLANS,
    maxDevices: plans?.ok && plans.maxDevices ? plans.maxDevices : 2,
    live: !!livePlansRes?.ok || !!liveLatestRes?.ok,
  };
}

/** 105000 → "105 000" */
export function formatPrice(n: number): string {
  return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function formatDate(s?: string): string | null {
  if (!s) return null;
  const d = new Date(s);
  if (isNaN(d.getTime())) return null;
  const dd = String(d.getUTCDate()).padStart(2, "0");
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  return `${dd}.${mm}.${d.getUTCFullYear()}`;
}

function splitNotes(notes?: string): string[] {
  if (!notes) return [];
  return notes
    .replace(/\r/g, "")
    .split("\n")
    .map((l) => l.replace(/^\s*[•\-–—*]\s*/, "").trim())
    .filter((l) => l.length > 0 && l.toLowerCase() !== "bimuz")
    .map(toLatin);
}

// ---------------------------------------------------------------- kirill → lotin (o'zbek)

const MAP: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", ғ: "g'", д: "d", ж: "j", з: "z", и: "i", й: "y",
  к: "k", қ: "q", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r", с: "s", т: "t",
  у: "u", ў: "o'", ф: "f", х: "x", ҳ: "h", ч: "ch", ш: "sh", щ: "sh", ъ: "'", ы: "i",
  ь: "", э: "e", ю: "yu", я: "ya", ё: "yo", ц: "s",
};

const VOWELS = "аеёиоуўэюяaeiou";

/** O'zbek kirill matnini lotinga o'giradi (lotin matn o'zgarmaydi). */
export function toLatin(text: string): string {
  if (!text || !/[Ѐ-ӿ]/.test(text)) return text;
  let out = "";
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const lower = ch.toLowerCase();
    const isUpper = ch !== lower;
    let lat: string;

    if (lower === "е") {
      // So'z boshida yoki unli/ъ/ь dan keyin "ye", aks holda "e".
      const prev = i > 0 ? text[i - 1].toLowerCase() : "";
      lat = !prev || !/[Ѐ-ӿa-z]/i.test(prev) || VOWELS.includes(prev) || prev === "ъ" || prev === "ь" ? "ye" : "e";
    } else if (lower in MAP) {
      lat = MAP[lower];
    } else {
      out += ch;
      continue;
    }

    if (isUpper && lat.length > 0) {
      const next = text[i + 1];
      const nextUpper = !!next && next !== next.toLowerCase();
      lat = nextUpper ? lat.toUpperCase() : lat[0].toUpperCase() + lat.slice(1);
    }
    out += lat;
  }
  return out;
}
