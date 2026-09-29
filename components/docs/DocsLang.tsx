"use client";

import { useEffect } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import type { L } from "@/lib/docs";

/** Yo'riqnoma tili: rus (en tanlanganda ham rus), aks holda o'zbekcha (kirill). */
export function useDocLang(): "uz" | "ru" {
  const { lang, setLang } = useTranslation();

  // Plagindan ochilganda: ?lang=ru yoki ?lang=uz
  useEffect(() => {
    try {
      const q = new URLSearchParams(window.location.search).get("lang");
      if (q === "ru" || q === "uz") setLang(q);
    } catch {
      /* e'tiborsiz */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return lang === "uz" ? "uz" : "ru";
}

export function pick(l: L | undefined, lang: "uz" | "ru"): string {
  if (!l) return "";
  return (lang === "ru" ? l.ru : l.uz) || l.uz || l.ru || "";
}

export const UI = {
  docs: { uz: "Фойдаланиш йўриқномаси", ru: "Руководство пользователя" },
  back: { uz: "← Барча йўриқномалар", ru: "← Все руководства" },
  plugin: { uz: "← Revit плагини", ru: "← Плагин Revit" },
  button: { uz: "Лентадаги тугма", ru: "Кнопка на ленте" },
  before: { uz: "Олдиндан тайёрлаш", ru: "Что подготовить" },
  steps: { uz: "Ишлаш тартиби", ru: "Порядок работы" },
  settings: { uz: "Созламалар", ru: "Настройки" },
  result: { uz: "Натижа", ru: "Результат" },
  tips: { uz: "Қоидалар ва маслаҳатлар", ru: "Правила и советы" },
  field: { uz: "Майдон", ru: "Поле" },
  meaning: { uz: "Тавсиф", ru: "Описание" },
  soon: { uz: "Расм тайёрланмоқда", ru: "Иллюстрация готовится" },
  f1: {
    uz: "Revit'да BIMUz тугмаси устида F1 босилса, шу саҳифа очилади.",
    ru: "В Revit нажмите F1 над кнопкой BIMUz — откроется эта страница.",
  },
  commands: { uz: "буйруқ", ru: "команд" },
} satisfies Record<string, L>;
