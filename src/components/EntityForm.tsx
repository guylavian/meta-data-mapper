import React, { useState } from 'react';
import { Entity, EntityField } from '../types';

interface EntityFormProps {
  onEntitiesChange: (entities: Entity[]) => void;
}

const EntityForm: React.FC<EntityFormProps> = ({ onEntitiesChange }) => {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [currentEntity, setCurrentEntity] = useState<Entity>({
    name: '',
    fields: [],
  });
  const [currentField, setCurrentField] = useState<EntityField>({
    name: '',
    type: 'string',
    required: false,
  });

  const addField = () => {
    if (currentField.name) {
      setCurrentEntity({
        ...currentEntity,
        fields: [...currentEntity.fields, currentField],
      });
      setCurrentField({
        name: '',
        type: 'string',
        required: false,
      });
    }
  };

  const addEntity = () => {
    if (currentEntity.name && currentEntity.fields.length > 0) {
      const newEntities = [...entities, currentEntity];
      setEntities(newEntities);
      onEntitiesChange(newEntities);
      setCurrentEntity({
        name: '',
        fields: [],
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Current Entity</h3>
        <div>
          <label htmlFor="entityName" className="block text-sm font-medium text-gray-700">
            Entity Name
          </label>
          <input
            type="text"
            id="entityName"
            value={currentEntity.name}
            onChange={(e) => setCurrentEntity({ ...currentEntity, name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="e.g., User, Product"
          />
        </div>

        <div className="space-y-4">
          <h4 className="text-md font-medium text-gray-900">Fields</h4>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="fieldName" className="block text-sm font-medium text-gray-700">
                Field Name
              </label>
              <input
                type="text"
                id="fieldName"
                value={currentField.name}
                onChange={(e) => setCurrentField({ ...currentField, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="e.g., id, name"
              />
            </div>

            <div>
              <label htmlFor="fieldType" className="block text-sm font-medium text-gray-700">
                Field Type
              </label>
              <select
                id="fieldType"
                value={currentField.type}
                onChange={(e) => setCurrentField({ ...currentField, type: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="string">String</option>
                <option value="number">Number</option>
                <option value="boolean">Boolean</option>
                <option value="date">Date</option>
              </select>
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="required"
              checked={currentField.required}
              onChange={(e) => setCurrentField({ ...currentField, required: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="required" className="ml-2 block text-sm text-gray-900">
              Required
            </label>
          </div>

          <button
            onClick={addField}
            disabled={!currentField.name}
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
          >
            Add Field
          </button>
        </div>

        <button
          onClick={addEntity}
          disabled={!currentEntity.name || currentEntity.fields.length === 0}
          className="inline-flex justify-center rounded-md border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
        >
          Add Entity
        </button>
      </div>

      {entities.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900">Defined Entities</h3>
          <div className="mt-4 space-y-4">
            {entities.map((entity, index) => (
              <div key={index} className="rounded-md bg-gray-50 p-4">
                <h4 className="text-md font-medium text-gray-900">{entity.name}</h4>
                <ul className="mt-2 space-y-1">
                  {entity.fields.map((field, fieldIndex) => (
                    <li key={fieldIndex} className="text-sm text-gray-600">
                      {field.name} ({field.type}) {field.required && '*'}
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

export default EntityForm; 