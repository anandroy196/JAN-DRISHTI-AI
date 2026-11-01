import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, translations, Translations } from './i18n';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof Translations, fallback?: string) => string;
  tStatus: (status: string) => string;
  tCategory: (cat: string) => string;
}

const I18nContext = createContext<I18nContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key) => key as string,
  tStatus: (status) => status,
  tCategory: (cat) => cat
});

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('jandrishti_lang') as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('jandrishti_lang', lang);
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
    }
  };

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }
  }, [language]);

  const t = (key: keyof Translations, fallback?: string): string => {
    const langDict = translations[language] || translations.en;
    if (langDict[key]) {
      return langDict[key];
    }
    const enDict = translations.en;
    if (enDict[key]) {
      return enDict[key];
    }
    return fallback || (key as string);
  };

  const tStatus = (status: string): string => {
    const normalized = (status || '').toLowerCase().trim().replace(/[\s_-]+/g, '');
    const dict = translations[language] || translations.en;

    if (normalized.includes('submit')) return dict.statusSubmitted;
    if (normalized.includes('receiv')) return dict.statusReceived;
    if (normalized.includes('underreview') || normalized.includes('review')) return dict.statusUnderReview;
    if (normalized.includes('assign')) return dict.statusAssigned;
    if (normalized.includes('inprogress') || normalized.includes('ongoing') || normalized.includes('work')) return dict.statusInProgress;
    if (normalized.includes('resolv') || normalized.includes('complete')) return dict.statusResolved;
    if (normalized.includes('reject')) return dict.statusRejected;
    if (normalized.includes('reopen')) return dict.statusReopened;
    if (normalized.includes('escalat')) return dict.statusEscalated;

    return status;
  };

  const tCategory = (cat: string): string => {
    if (language === 'hi') {
      if (cat.includes('road') || cat.includes('Road')) return 'सड़क एवं बुनियादी ढांचा';
      if (cat.includes('water') || cat.includes('Water')) return 'पेयजल एवं जल आपूर्ति';
      if (cat.includes('electric') || cat.includes('Power')) return 'बिजली एवं प्रकाश व्यवस्था';
      if (cat.includes('drain') || cat.includes('Drain')) return 'नालियां एवं सीवरेज निकासी';
      if (cat.includes('waste') || cat.includes('Waste')) return 'कचरा एवं ठोस अपशिष्ट';
      if (cat.includes('pollut') || cat.includes('Pollut')) return 'प्रदूषण एवं पर्यावरण';
      if (cat.includes('school') || cat.includes('School')) return 'विद्यालय रखरखाव';
      if (cat.includes('hosp') || cat.includes('Hosp') || cat.includes('Health')) return 'अस्पताल एवं स्वास्थ्य सुविधा';
      if (cat.includes('fund') || cat.includes('Fund') || cat.includes('misuse')) return 'सरकारी निधि दुरुपयोग की आशंका';
      if (cat.includes('bribe') || cat.includes('Bribery') || cat.includes('police')) return 'रिश्वतखोरी एवं कदाचार';
    } else if (language === 'pa') {
      if (cat.includes('road') || cat.includes('Road')) return 'ਸੜਕਾਂ ਅਤੇ ਪੁਲ';
      if (cat.includes('water') || cat.includes('Water')) return 'ਪੀਣ ਵਾਲਾ ਪਾਣੀ';
      if (cat.includes('electric') || cat.includes('Power')) return 'ਬਿਜਲੀ ਅਤੇ ਰੌਸ਼ਨੀ';
      if (cat.includes('drain') || cat.includes('Drain')) return 'ਨਿਕਾਸੀ ਅਤੇ ਨਾਲੀਆਂ';
      if (cat.includes('waste') || cat.includes('Waste')) return 'ਕੂੜਾ ਪ੍ਰਬੰਧਨ';
      if (cat.includes('pollut') || cat.includes('Pollut')) return 'ਪ੍ਰਦੂਸ਼ਣ ਨਿਯੰਤਰਣ';
      if (cat.includes('school') || cat.includes('School')) return 'ਸਕੂਲ ਰੱਖ-ਰਖਾਵ';
      if (cat.includes('hosp') || cat.includes('Hosp') || cat.includes('Health')) return 'ਹਸਪਤਾਲ ਸੰਭਾਲ';
      if (cat.includes('fund') || cat.includes('Fund')) return 'ਸਰਕਾਰੀ ਫੰਡਾਂ ਦੀ ਦੁਰਵਰਤੋਂ';
      if (cat.includes('bribe') || cat.includes('Bribery') || cat.includes('police')) return 'ਰਿਸ਼ਵਤਖੋਰੀ ਅਤੇ ਪੁਲਿਸ ਜਵਾਬਦੇਹੀ';
    }
    return cat;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t, tStatus, tCategory }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => useContext(I18nContext);
