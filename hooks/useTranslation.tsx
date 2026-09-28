"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import uz from "../locales/uz";
import ru from "../locales/ru";
import en from "../locales/en";

export type Language = "uz" | "ru" | "en";
type Dictionary = typeof uz;

const translations: Record<Language, Dictionary> = { uz, ru, en };
const STORAGE_KEY = "bimuz-lang";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: Dictionary;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "uz",
  setLang: () => {},
  t: uz,
});

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Language>("uz");

  // Tanlangan til barcha sahifalarda saqlanadi.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "ru" || saved === "en") setLangState(saved);
    } catch {
      /* brauzer xotirasi yopiq */
    }
  }, []);

  const setLang = (l: Language) => {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* e'tiborsiz */
    }
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => useContext(LanguageContext);
