import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getLanguageDirection } from '../i18n';

interface RTLContextType {
  isRTL: boolean;
}

const RTLContext = createContext<RTLContextType>({ isRTL: true }); // Default to RTL for Hebrew

export const useRTL = () => useContext(RTLContext);

export const RTLProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { i18n } = useTranslation();
  const [isRTL, setIsRTL] = useState(getLanguageDirection(i18n.language) === 'rtl');

  useEffect(() => {
    const handleLanguageChange = () => {
      const direction = getLanguageDirection(i18n.language);
      setIsRTL(direction === 'rtl');
      document.documentElement.dir = direction;
      document.documentElement.lang = i18n.language;
    };

    i18n.on('languageChanged', handleLanguageChange);
    handleLanguageChange(); // Set initial direction

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  return (
    <RTLContext.Provider value={{ isRTL }}>
      {children}
    </RTLContext.Provider>
  );
}; 