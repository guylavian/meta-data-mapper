import React from 'react';
import { useTranslation } from 'react-i18next';
import { useRTL } from '../../contexts/RTLContext';

interface MappedResultProps {
  result: any;
  errors: string[];
  isLoading: boolean;
}

export const MappedResult: React.FC<MappedResultProps> = ({
  result,
  errors,
  isLoading
}) => {
  const { t } = useTranslation();
  const { isRTL } = useRTL();

  const formatJson = (json: any): string => {
    try {
      return JSON.stringify(json, null, 2);
    } catch (error) {
      console.error('Error formatting JSON:', error);
      return String(json);
    }
  };

  return (
    <div className="space-y-6">
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <svg
            className="animate-spin h-8 w-8 text-blue-500"
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
          <span className="ml-3 text-lg">{t('messages.loading')}</span>
        </div>
      ) : (
        <>
          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    {t('errors.mappingFailed')}
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <ul className="list-disc pl-5 space-y-1">
                      {errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium">{t('labels.mappedResult')}</h3>
            </div>
            <div className="card-body">
              {result ? (
                <pre
                  className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto"
                  style={{ maxHeight: '400px' }}
                >
                  <code>{formatJson(result)}</code>
                </pre>
              ) : (
                <p className="text-gray-500">{t('messages.noMappingResult')}</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}; 