import React, { useEffect, useState } from 'react';
import styles from './Layout.module.css';

interface LayoutProps {
  children: React.ReactNode;
}

const getSystemDark = () => window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem('theme');
    if (stored) return stored === 'dark';
    return getSystemDark();
  });

  useEffect(() => {
    const handler = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('theme')) setDarkMode(e.matches);
    };
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode((prev) => {
      localStorage.setItem('theme', !prev ? 'dark' : 'light');
      return !prev;
    });
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <header className="header">
        <span className="logo">Meta Data Mapper</span>
        <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle dark mode">
          {darkMode ? '🌙' : '☀️'}
        </button>
      </header>
      <main className="main-content">{children}</main>
      <footer className="footer">&copy; {new Date().getFullYear()} Meta Data Mapper</footer>
    </div>
  );
};

export default Layout; 