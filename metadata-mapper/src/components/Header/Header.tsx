import React from 'react';

interface HeaderProps {
  onNavigate: (page: 'home' | 'about') => void;
  currentPage: 'home' | 'about';
}

const Header: React.FC<HeaderProps> = ({ onNavigate, currentPage }) => {
  return (
    <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Metadata Mapper</h1>
      <nav className="space-x-4">
        <button
          className={`hover:underline ${currentPage === 'home' ? 'font-semibold' : ''}`}
          onClick={() => onNavigate('home')}
        >
          Home
        </button>
        <button
          className={`hover:underline ${currentPage === 'about' ? 'font-semibold' : ''}`}
          onClick={() => onNavigate('about')}
        >
          About
        </button>
      </nav>
    </header>
  );
};

export default Header;
