"use client";

import { useTranslation, type Language } from "@/hooks/useTranslation";

const LANGS: { code: Language; label: string }[] = [
  { code: "uz", label: "UZ" },
  { code: "ru", label: "RU" },
  { code: "en", label: "EN" },
];

/** Ichki sahifalar uchun ixcham til tanlagich (UZ / RU / EN). */
export default function LanguageSwitcher() {
  const { lang, setLang } = useTranslation();

  return (
    <div className="lang-mini" data-no-translate role="group" aria-label="Til / Язык / Language">
      {LANGS.map((l) => (
        <button
          key={l.code}
          type="button"
          className={lang === l.code ? "active" : ""}
          onClick={() => setLang(l.code)}
          aria-pressed={lang === l.code}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
