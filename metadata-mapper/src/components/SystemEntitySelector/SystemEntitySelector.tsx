import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Entity } from '../../types/mapping';
import { emmService } from '../../services/emmService';

interface SystemEntitySelectorProps {
  onEntitySelect: (entity: Entity) => void;
}

export const SystemEntitySelector: React.FC<SystemEntitySelectorProps> = ({
  onEntitySelect,
}) => {
  const { t } = useTranslation();
  const [entities, setEntities] = useState<Entity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEntities = async () => {
      try {
        setIsLoading(true);
        const emmEntities = await emmService.getEMMFields();
        setEntities(emmEntities);
      } catch (err) {
        setError('Failed to load EMM entities');
        console.error('Error loading EMM entities:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadEntities();
  }, []);

  if (isLoading) {
    return (
      <div className="p-4 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">{t('loading')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">{t('systemEntities.title')}</h2>
      <p className="text-gray-600 mb-4">{t('systemEntities.description')}</p>
      
      <div className="grid gap-4">
        {entities.map((entity) => (
          <button
            key={entity.id}
            onClick={() => onEntitySelect(entity)}
            className="p-4 border rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
          >
            <h3 className="text-lg font-medium text-gray-800">{entity.name}</h3>
            <p className="text-sm text-gray-500">
              {t('entities.fieldCount', { count: entity.fields.length })}
            </p>
            <div className="mt-2">
              <h4 className="text-sm font-medium text-gray-600 mb-1">{t('systemEntities.fields')}:</h4>
              <ul className="text-sm text-gray-500 list-disc list-inside">
                {entity.fields.slice(0, 3).map((field) => (
                  <li key={field.id} className="truncate">
                    <span className="font-medium">{field.name}</span>
                    <span className="text-gray-400 ml-2">({field.type})</span>
                  </li>
                ))}
                {entity.fields.length > 3 && (
                  <li className="text-gray-400">
                    {t('mapping.andMore', { count: entity.fields.length - 3 })}
                  </li>
                )}
              </ul>
            </div>
            {entity.fields.some(f => f.isRequired) && (
              <div className="mt-2 text-sm text-blue-600">
                {t('systemEntities.hasRequiredFields')}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}; 