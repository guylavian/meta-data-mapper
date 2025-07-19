import React from 'react';
import { ThemeProvider } from './theme/ThemeProvider';
import { DataMapperLayout } from './components/DataMapper/DataMapperLayout';
import './styles/global.css';

function App() {
  return (
    <ThemeProvider>
      <DataMapperLayout />
    </ThemeProvider>
  );
}

export default App;
