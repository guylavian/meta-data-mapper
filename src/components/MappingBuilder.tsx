import React, { useState } from 'react';
import { ApiMetadata, Entity, Mapping } from '../types';

interface MappingBuilderProps {
  apiMetadata: ApiMetadata | null;
  entities: Entity[];
  onMappingsChange: (mappings: Mapping[]) => void;
}

const MappingBuilder: React.FC<MappingBuilderProps> = ({
  apiMetadata,
  entities,
  onMappingsChange,
}) => {
  const [mappings, setMappings] = useState<Mapping[]>([]);
  const [currentMapping, setCurrentMapping] = useState<Mapping>({
    entityName: '',
    apiEndpoint: '',
    fieldMappings: {},
  });

  const addMapping = () => {
    if (currentMapping.entityName && currentMapping.apiEndpoint && Object.keys(currentMapping.fieldMappings).length > 0) {
      const newMappings = [...mappings, currentMapping];
      setMappings(newMappings);
      onMappingsChange(newMappings);
      setCurrentMapping({
        entityName: '',
        apiEndpoint: '',
        fieldMappings: {},
      });
    }
  };

  const updateFieldMapping = (entityField: string, apiField: string) => {
    setCurrentMapping({
      ...currentMapping,
      fieldMappings: {
        ...currentMapping.fieldMappings,
        [entityField]: apiField,
      },
    });
  };

  if (!apiMetadata || entities.length === 0) {
    return (
      <div className="text-sm text-gray-500">
        Please define both API metadata and entities before creating mappings.
      </div>
    );
  }

  const selectedEntity = entities.find(e => e.name === currentMapping.entityName);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="entitySelect" className="block text-sm font-medium text-gray-700">
            Select Entity
          </label>
          <select
            id="entitySelect"
            value={currentMapping.entityName}
            onChange={(e) => setCurrentMapping({
              ...currentMapping,
              entityName: e.target.value,
              fieldMappings: {},
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Select an entity</option>
            {entities.map((entity) => (
              <option key={entity.name} value={entity.name}>
                {entity.name}
              </option>
            ))}
          </select>
        </div>

        {selectedEntity && (
          <div className="space-y-4">
            <h4 className="text-md font-medium text-gray-900">Field Mappings</h4>
            <div className="space-y-4">
              {selectedEntity.fields.map((field) => (
                <div key={field.name} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {field.name} ({field.type})
                    </label>
                  </div>
                  <div>
                    <select
                      value={currentMapping.fieldMappings[field.name] || ''}
                      onChange={(e) => updateFieldMapping(field.name, e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value="">Select API field</option>
                      {apiMetadata.fields.map((apiField) => (
                        <option key={apiField.name} value={apiField.name}>
                          {apiField.name} ({apiField.type})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={addMapping}
              disabled={Object.keys(currentMapping.fieldMappings).length === 0}
              className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
            >
              Add Mapping
            </button>
          </div>
        )}
      </div>

      {mappings.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900">Defined Mappings</h3>
          <div className="mt-4 space-y-4">
            {mappings.map((mapping, index) => (
              <div key={index} className="rounded-md bg-gray-50 p-4">
                <h4 className="text-md font-medium text-gray-900">
                  {mapping.entityName} → {mapping.apiEndpoint}
                </h4>
                <ul className="mt-2 space-y-1">
                  {Object.entries(mapping.fieldMappings).map(([entityField, apiField]) => (
                    <li key={entityField} className="text-sm text-gray-600">
                      {entityField} → {apiField}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MappingBuilder; 