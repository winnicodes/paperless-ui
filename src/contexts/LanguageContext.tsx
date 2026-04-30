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

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Lang>('de');
  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLang = () => useContext(LanguageContext);
