import React from 'react';
import { EMMMappingField } from '../../types/mapping';

interface FieldSelectorProps {
  field: EMMMappingField;
  isSelected: boolean;
  isMatched: boolean;
  matchedField?: string;
  onSelect: () => void;
  onRemoveMatch?: () => void;
}

export const FieldSelector: React.FC<FieldSelectorProps> = ({
  field,
  isSelected,
  isMatched,
  matchedField,
  onSelect,
  onRemoveMatch
}) => {
  return (
    <div
      className={`flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-50 mb-2 ${
        isSelected ? 'bg-blue-50 border-blue-500' : ''
      }`}
      onClick={onSelect}
    >
      <input
        type="checkbox"
        checked={isSelected}
        onChange={onSelect}
        className="h-5 w-5"
      />
      <div className="flex-1">
        <span className="font-medium">{field.path}</span>
        <p className="text-gray-500 text-sm">{field.description}</p>
      </div>
      {isSelected && (
        <div className="text-blue-500">
          {isMatched ? (
            <div className="flex items-center gap-2">
              <span>→ {matchedField}</span>
              {onRemoveMatch && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveMatch();
                  }}
                  className="text-red-500 hover:text-red-600 text-sm"
                >
                  ×
                </button>
              )}
            </div>
          ) : (
            <span className="text-gray-400">Select a data field →</span>
          )}
        </div>
      )}
    </div>
  );
}; 