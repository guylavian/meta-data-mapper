import React from 'react';
import { useTranslation } from 'react-i18next';
import { useRTL } from '../contexts/RTLContext';

export const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const { setIsRTL } = useRTL();
  
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsRTL(lng === 'he');
  };

  const isEnglish = i18n.language === 'en';
  const isHebrew = i18n.language === 'he';

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => changeLanguage('en')}
        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
          isEnglish 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
        aria-current={isEnglish ? 'page' : undefined}
      >
        English
      </button>
      <button
        onClick={() => changeLanguage('he')}
        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
          isHebrew 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
        aria-current={isHebrew ? 'page' : undefined}
      >
        עברית
      </button>
    </div>
  );
}; 