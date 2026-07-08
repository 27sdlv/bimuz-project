"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import uz from "../locales/uz";
import ru from "../locales/ru";
import en from "../locales/en";

type Language = "uz" | "ru" | "en";
type Dictionary = typeof uz;

const translations: Record<Language, Dictionary> = { uz, ru, en };

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
  const [lang, setLang] = useState<Language>("uz");

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => useContext(LanguageContext);
