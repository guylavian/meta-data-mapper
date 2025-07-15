import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

interface ThemeColors {
  bg: string;
  card: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  borderStrong: string;
  primary: string;
  primaryText: string;
  surface: string;
  placeholder: string;
  accent: string;
  error: string;
  btnBg: string;
  btnBorder: string;
  btnText: string;
  btnBgHover: string;
  btnBorderHover: string;
  btnTextHover: string;
  nextBtnBgHover: string;
  nextBtnBorderHover: string;
  stepCircleActiveBg: string;
  stepCircleInactiveBg: string;
  stepCircleActiveColor: string;
  stepCircleInactiveColor: string;
  stepLabelActive: string;
  stepLabelInactive: string;
}

interface ThemeRadii {
  sm: string;
  md: string;
  lg: string;
}

interface ThemeFont {
  family: string;
  size: string;
  sizeLg: string;
  weight: number;
}

interface AppTheme {
  mode: 'light' | 'dark';
  colors: ThemeColors;
  radii: ThemeRadii;
  font: ThemeFont;
  cardShadow: string; // Moved here
}

const lightTheme: AppTheme = {
  mode: 'light',
  colors: {
    bg: '#f7f8fa',
    card: '#fff',
    text: '#222',
    textSecondary: '#666',
    textMuted: '#999',
    border: '#e5e7eb',
    borderStrong: '#ddd',
    primary: '#333',
    primaryText: '#fff',
    surface: '#fafbfc',
    placeholder: '#999',
    accent: '#1677ff', // for highlights if needed
    error: '#e57373',
    btnBg: 'transparent',
    btnBorder: '#333',
    btnText: '#333',
    btnBgHover: '#f3f3f3',
    btnBorderHover: '#222',
    btnTextHover: '#222',
    nextBtnBgHover: '#444',
    nextBtnBorderHover: '#222',
    stepCircleActiveBg: '#333',
    stepCircleInactiveBg: '#ddd',
    stepCircleActiveColor: '#fff',
    stepCircleInactiveColor: '#999',
    stepLabelActive: '#333',
    stepLabelInactive: '#999',
  },
  radii: {
    sm: '6px',
    md: '8px',
    lg: '12px',
  },
  font: {
    family: 'Inter, sans-serif',
    size: '15px',
    sizeLg: '1.25rem',
    weight: 500,
  },
  cardShadow: '0 4px 32px rgba(30,30,30,0.10)', // Moved here
};

const darkTheme: AppTheme = {
  mode: 'dark',
  colors: {
    bg: '#181a1b',
    card: '#1E1E1E',
    text: '#FFFFFF',
    textSecondary: '#AAAAAA',
    textMuted: '#777777',
    border: '#232526',
    borderStrong: '#555555', // Stronger dashed border
    primary: '#FFFFFF',
    primaryText: '#222222',
    surface: '#222222',
    placeholder: '#AAAAAA',
    accent: '#7abaff',
    error: '#e57373',
    btnBg: 'transparent',
    btnBorder: '#fff',
    btnText: '#fff',
    btnBgHover: '#333',
    btnBorderHover: '#fff',
    btnTextHover: '#fff',
    nextBtnBgHover: '#eee',
    nextBtnBorderHover: '#fff',
    stepCircleActiveBg: '#222222',
    stepCircleInactiveBg: '#555555',
    stepCircleActiveColor: '#FFFFFF',
    stepCircleInactiveColor: '#AAAAAA',
    stepLabelActive: '#FFFFFF',
    stepLabelInactive: '#777777',
  },
  radii: {
    sm: '6px',
    md: '8px',
    lg: '12px',
  },
  font: {
    family: 'Inter, sans-serif',
    size: '15px',
    sizeLg: '1.25rem',
    weight: 500,
  },
  cardShadow: '0 4px 32px rgba(0,0,0,0.25)', // Moved here
};

const ThemeContext = createContext<{
  theme: AppTheme;
  toggle: () => void;
  setMode: (mode: 'light' | 'dark') => void;
}>({
  theme: lightTheme,
  toggle: () => {},
  setMode: () => {},
});

export const useTheme = () => useContext(ThemeContext);

function setCSSVars(theme: AppTheme) {
  const root = document.documentElement;
  Object.entries(theme.colors).forEach(([k, v]) => {
    root.style.setProperty(`--color-${k}`, String(v));
  });
  Object.entries(theme.radii).forEach(([k, v]) => {
    root.style.setProperty(`--radius-${k}`, String(v));
  });
  Object.entries(theme.font).forEach(([k, v]) => {
    root.style.setProperty(`--font-${k}`, String(v));
  });
  root.style.setProperty(`--card-shadow`, theme.cardShadow); // Set cardShadow CSS variable
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<'light' | 'dark'>(() => {
    const stored = localStorage.getItem('theme');
    if (stored === 'light' || stored === 'dark') return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });
  const theme = useMemo(() => (mode === 'dark' ? darkTheme : lightTheme), [mode]);

  useEffect(() => {
    setCSSVars(theme);
    localStorage.setItem('theme', mode);
  }, [theme, mode]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('theme')) setMode(e.matches ? 'dark' : 'light');
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const toggle = () => setMode((m) => (m === 'light' ? 'dark' : 'light'));

  return (
    <ThemeContext.Provider value={{ theme, toggle, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}; 