import React from 'react';
import { useTranslation } from 'react-i18next';
import { useRTL } from '../contexts/RTLContext';

interface MappedResultProps {
  result: any;
  error: string | null;
}

const MappedResult: React.FC<MappedResultProps> = ({ result, error }) => {
  const { t } = useTranslation();
  const { isRTL } = useRTL();

  if (error) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4 text-red-600">
          {t('messages.error')}
        </h2>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">{t('labels.result')}</h2>
        <p className="text-gray-500">{t('messages.noData')}</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">{t('labels.result')}</h2>
      <pre
        className={`bg-gray-100 p-4 rounded-lg overflow-auto ${
          isRTL ? 'text-right' : 'text-left'
        }`}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {JSON.stringify(result, null, 2)}
      </pre>
    </div>
  );
};

export default MappedResult; 