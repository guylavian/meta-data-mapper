import React from 'react';
import { useTranslation } from 'react-i18next';
import { useRTL } from '../../contexts/RTLContext';
import { Field } from '../../types/mapping';

interface FieldSelectorProps {
  fields: Field[];
  selectedFields: Set<string>;
  onSelect: (fieldId: string) => void;
  title?: string;
  description?: string;
}

export const FieldSelector: React.FC<FieldSelectorProps> = ({
  fields,
  selectedFields,
  onSelect,
  title,
  description,
}) => {
  const { t } = useTranslation();
  const { isRTL } = useRTL();

  return (
    <div className={`p-4 ${isRTL ? 'text-right' : 'text-left'}`}>
      {title && (
        <h3 className="text-lg font-medium text-gray-900 mb-2">{t(title)}</h3>
      )}
      {description && (
        <p className="text-sm text-gray-500 mb-4">{t(description)}</p>
      )}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {fields.map((field) => (
          <div
            key={field.id}
            className={`flex items-center p-3 rounded-lg cursor-pointer hover:bg-gray-50 ${
              selectedFields.has(field.id) ? 'bg-primary-50' : ''
            } ${isRTL ? 'flex-row-reverse' : ''}`}
            onClick={() => onSelect(field.id)}
          >
            <input
              type="checkbox"
              checked={selectedFields.has(field.id)}
              onChange={() => onSelect(field.id)}
              className={`h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded ${
                isRTL ? 'ml-3' : 'mr-3'
              }`}
            />
            <div className={`flex-1 ${isRTL ? 'mr-3' : 'ml-3'}`}>
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-900">
                  {field.name}
                </span>
                <span
                  className={`text-xs text-gray-500 ${
                    isRTL ? 'mr-2' : 'ml-2'
                  }`}
                >
                  ({field.type})
                </span>
              </div>
              {field.description && (
                <p className="text-xs text-gray-500 mt-1">
                  {t(field.description)}
                </p>
              )}
              <p className="text-xs text-gray-400 mt-1">{field.path}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 