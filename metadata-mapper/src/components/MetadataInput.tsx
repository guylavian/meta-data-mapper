import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRTL } from '../contexts/RTLContext';

interface MetadataInputProps {
  onSubmit: (metadata: string) => void;
  isLoading?: boolean;
}

export const MetadataInput: React.FC<MetadataInputProps> = ({
  onSubmit,
  isLoading = false,
}) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();
  const { isRTL } = useRTL();

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

  const handlePaste = async (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text');
    setInput(text);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto">
      <div className="space-y-4">
        <div>
          <label
            htmlFor="metadata"
            className={`block text-sm font-medium text-gray-700 ${
              isRTL ? 'text-right' : 'text-left'
            }`}
          >
            {t('labels.metadataInput')}
          </label>
          <div className="mt-1">
            <textarea
              id="metadata"
              name="metadata"
              rows={10}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onPaste={handlePaste}
              className={`shadow-sm block w-full focus:ring-blue-500 focus:border-blue-500 sm:text-sm border border-gray-300 rounded-md ${
                error ? 'border-red-500' : ''
              } ${isRTL ? 'text-right' : 'text-left'}`}
              placeholder={t('placeholders.metadataInput')}
              dir="ltr"
            />
            {error && (
              <p
                className={`mt-2 text-sm text-red-600 ${
                  isRTL ? 'text-right' : 'text-left'
                }`}
              >
                {error}
              </p>
            )}
          </div>
          <p
            className={`mt-2 text-sm text-gray-500 ${
              isRTL ? 'text-right' : 'text-left'
            }`}
          >
            {t('hints.metadataInput')}
          </p>
        </div>

        <div
          className={`flex ${
            isRTL ? 'justify-start' : 'justify-end'
          } pt-4`}
        >
          <button
            type="submit"
            disabled={isLoading}
            className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
            ) : null}
            {t('buttons.submit')}
          </button>
        </div>
      </div>
    </form>
  );
}; 