import { createContext, useContext, useState, type ReactNode } from 'react';
import { type Lang, type T, translations } from '../lib/i18n';

interface Ctx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: T;
}

const LanguageContext = createContext<Ctx>({
  lang: 'de',
  setLang: () => {},
  t: translations.de,
});

const LANG_KEY = 'paperless_lang';

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Lang>(() => {
    const saved = localStorage.getItem(LANG_KEY);
    return saved === 'en' ? 'en' : 'de';
  });

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem(LANG_KEY, l);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLang = () => useContext(LanguageContext);
