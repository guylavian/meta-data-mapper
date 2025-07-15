import React, { useState } from 'react';
import styles from './MetadataInput.module.css';
import { useTheme } from '../theme/ThemeProvider';

interface MetadataInputProps {
  onMetadataChange: (metadata: string) => void;
}

// Placeholder for sample URLs, as I cannot read the file due to timeouts.
// In a real app, you would load these dynamically or from your constants.
const sampleMetadataUrls = [
  { name: 'Sample 1', url: 'https://jsonplaceholder.typicode.com/todos/1', description: 'Basic Todo' },
  { name: 'Sample 2', url: 'https://jsonplaceholder.typicode.com/users/1', description: 'Sample User' },
];

export const MetadataInput: React.FC<MetadataInputProps> = ({ onMetadataChange }) => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<'url' | 'json'>('url');
  const [url, setUrl] = useState('');
  const [jsonInput, setJsonInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUrlSubmit = async () => {
    setError(null);
    if (!url) {
      setError('Please enter a URL.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const metadataString = JSON.stringify(data, null, 2);
      onMetadataChange(metadataString);
      // message.success('Metadata loaded successfully'); // Removed Ant Design message
    } catch (err: any) {
      setError(`Failed to fetch metadata: ${err.message}`);
      onMetadataChange(''); // Clear metadata on error
    } finally {
      setLoading(false);
    }
  };

  const handleJsonSubmit = () => {
    setError(null);
    if (!jsonInput) {
      setError('Please enter JSON data.');
      return;
    }

    setLoading(true);
    try {
      // Validate and parse JSON
      JSON.parse(jsonInput);
      onMetadataChange(jsonInput);
      // message.success('Metadata parsed successfully'); // Removed Ant Design message
    } catch (err: any) {
      setError(`Invalid JSON data: ${err.message}`);
      onMetadataChange(''); // Clear metadata on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.inputCard} style={{ background: theme.colors.card, boxShadow: theme.cardShadow }}>
      <div className={styles.tabHeader}>
        <button
          className={`${styles.tabButton} ${activeTab === 'url' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('url')}
          style={{ color: theme.colors.text, borderBottomColor: activeTab === 'url' ? theme.colors.primary : 'transparent' }}
        >
          URL
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'json' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('json')}
          style={{ color: theme.colors.text, borderBottomColor: activeTab === 'json' ? theme.colors.primary : 'transparent' }}
        >
          JSON
        </button>
      </div>

      <div className={styles.tabContent}>
        {activeTab === 'url' && (
          <div className={styles.urlInputGroup}>
            <select
              className={styles.selectInput}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              style={{ background: theme.colors.surface, color: theme.colors.text, border: `1.5px solid ${theme.colors.border}` }}
            >
              <option value="">Select a sample API or enter your own</option>
              {sampleMetadataUrls.map((sample) => (
                <option key={sample.url} value={sample.url}>
                  {sample.name} - {sample.description}
                </option>
              ))}
            </select>
            <input
              type="text"
              className={styles.textInput}
              placeholder="Or enter your own metadata URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleUrlSubmit(); }}
              style={{ background: theme.colors.surface, color: theme.colors.text, border: `1.5px solid ${theme.colors.border}` }}
            />
            <button
              className={styles.primaryButton}
              onClick={handleUrlSubmit}
              disabled={loading}
              style={{
                background: theme.colors.primary,
                color: theme.colors.primaryText,
                border: `1.5px solid ${theme.colors.primary}`,
              }}
              onMouseOver={e => {
                e.currentTarget.style.background = theme.colors.nextBtnBgHover;
                e.currentTarget.style.borderColor = theme.colors.nextBtnBorderHover;
              }}
              onMouseOut={e => {
                e.currentTarget.style.background = theme.colors.primary;
                e.currentTarget.style.borderColor = theme.colors.primary;
              }}
            >
              {loading ? 'Loading...' : 'Load from URL'}
            </button>
          </div>
        )}

        {activeTab === 'json' && (
          <div className={styles.jsonInputGroup}>
            <textarea
              className={styles.textareaInput}
              rows={10}
              placeholder="Paste JSON data here…"
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              style={{ background: theme.colors.surface, color: theme.colors.text, border: `1.5px solid ${theme.colors.border}` }}
            />
            <button
              className={styles.primaryButton}
              onClick={handleJsonSubmit}
              disabled={loading}
              style={{
                background: theme.colors.primary,
                color: theme.colors.primaryText,
                border: `1.5px solid ${theme.colors.primary}`,
              }}
              onMouseOver={e => {
                e.currentTarget.style.background = theme.colors.nextBtnBgHover;
                e.currentTarget.style.borderColor = theme.colors.nextBtnBorderHover;
              }}
              onMouseOut={e => {
                e.currentTarget.style.background = theme.colors.primary;
                e.currentTarget.style.borderColor = theme.colors.primary;
              }}
            >
              {loading ? 'Parsing...' : 'Parse JSON'}
            </button>
          </div>
        )}

        {error && <div className={styles.errorText} style={{ color: theme.colors.error }}>{error}</div>}
      </div>
    </div>
  );
}; 