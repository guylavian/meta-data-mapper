import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRTL } from '../../contexts/RTLContext';
import { api } from '../../services/api';

interface TestAPI {
  name: string;
  url: string;
  description: string;
}

const TEST_APIS: TestAPI[] = [
  {
    name: 'Pokemon API',
    url: 'https://pokeapi.co/api/v2/pokemon/1',
    description: 'Get Pokemon data',
  },
  {
    name: 'Star Wars API',
    url: 'https://swapi.dev/api/people/1',
    description: 'Get Star Wars character data',
  },
  {
    name: 'Countries API',
    url: 'https://restcountries.com/v3.1/name/israel',
    description: 'Get country data',
  },
];

const EXAMPLE_METADATA = {
  book: {
    id: "123",
    title: "The Great Gatsby",
    author: {
      name: "F. Scott Fitzgerald",
      birthYear: 1896
    },
    published: 1925,
    genres: ["Fiction", "Classic"],
    metadata: {
      isbn: "978-0743273565",
      pages: 180,
      publisher: "Scribner"
    }
  }
};

interface MetadataInputProps {
  onSubmit: (metadata: string) => void;
  isLoading?: boolean;
}

export const MetadataInput: React.FC<MetadataInputProps> = ({
  onSubmit,
  isLoading = false,
}) => {
  const { t } = useTranslation();
  const { isRTL } = useRTL();
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);

  const validateJSON = (text: string): boolean => {
    try {
      JSON.parse(text);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!input.trim()) {
      setError(t('errors.emptyInput'));
      return;
    }

    if (!validateJSON(input)) {
      setError(t('errors.invalidJSON'));
      return;
    }

    onSubmit(input);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData('text');
    setInput(text);
  };

  const fetchMetadata = async (url: string) => {
    try {
      setIsFetching(true);
      setError(null);
      const response = await api.fetchMetadata(url);
      setInput(JSON.stringify(response, null, 2));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch metadata');
    } finally {
      setIsFetching(false);
    }
  };

  const loadExample = () => {
    setInput(JSON.stringify(EXAMPLE_METADATA, null, 2));
    setError(null);
  };

  return (
    <div className="card fade-in">
      <div className="card-body">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="metadata"
              className={`form-label ${isRTL ? 'text-right block' : ''} text-base font-medium`}
            >
              {t('labels.sourceMetadataPlaceholder')}
            </label>
            <p className={`text-sm text-gray-500 mb-2 ${isRTL ? 'text-right' : ''}`}>
              {t('messages.metadataInputHelp')}
            </p>
            <div className="mt-1 relative">
              <textarea
                id="metadata"
                name="metadata"
                rows={12}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onPaste={handlePaste}
                className={`form-input font-mono ${error ? 'border-red-500' : ''}`}
                placeholder={t('messages.metadataInputHelp')}
                dir="ltr"
              />
              {error && (
                <p className="form-error">
                  {error}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className={`text-base font-medium text-gray-700 ${isRTL ? 'text-right' : ''}`}>
                {t('labels.testAPIs')}
              </h4>
              <button
                type="button"
                onClick={loadExample}
                disabled={isFetching || isLoading}
                className="btn-secondary flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'}`} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
                {t('buttons.loadExample')}
              </button>
            </div>
            <p className={`text-sm text-gray-500 ${isRTL ? 'text-right' : ''}`}>
              {t('messages.sampleApiHelp')}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {TEST_APIS.map((api) => (
                <button
                  key={api.url}
                  type="button"
                  onClick={() => fetchMetadata(api.url)}
                  disabled={isFetching || isLoading}
                  className="card hover:bg-gray-50 transition-colors duration-200 h-full border border-gray-200 hover:border-blue-300 hover:shadow-md"
                >
                  <div className="p-4">
                    <h5 className="font-medium text-gray-900 mb-1">{api.name}</h5>
                    <p className="text-sm text-gray-500">{api.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className={`flex ${isRTL ? 'justify-start' : 'justify-end'} gap-4 pt-4`}>
            <button
              type="submit"
              disabled={isFetching || isLoading}
              className="btn-primary"
            >
              {isLoading || isFetching ? (
                <span className="flex items-center">
                  <svg
                    className={`animate-spin h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'}`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {t('buttons.submit')}
                </span>
              ) : (
                t('buttons.submit')
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 