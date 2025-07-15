import React from 'react';
import { ThemeProvider } from './theme/ThemeProvider';
import { DataMapperLayout } from './components/DataMapperLayout';

function App() {
  return (
    <ThemeProvider>
      <DataMapperLayout />
    </ThemeProvider>
  );
}

export default App;
