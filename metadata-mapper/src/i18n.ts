import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enTranslation from './locales/en/translation.json';
import heTranslation from './locales/he/translation.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslation
      },
      he: {
        translation: heTranslation
      }
    },
    lng: 'he', // Set Hebrew as default language
    fallbackLng: 'he',
    interpolation: {
      escapeValue: false
    },
    // Add language specific configurations
    react: {
      useSuspense: false
    }
  });

// Export language direction information
export const getLanguageDirection = (language: string = i18n.language): 'rtl' | 'ltr' => {
  const rtlLanguages = ['he', 'ar', 'fa'];
  return rtlLanguages.includes(language) ? 'rtl' : 'ltr';
};

export default i18n;