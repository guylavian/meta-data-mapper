import React from 'react';
import { Mapping } from '../types';

interface QueryPreviewProps {
  mappings: Mapping[];
}

const QueryPreview: React.FC<QueryPreviewProps> = ({ mappings }) => {
  const generateQuery = (mapping: Mapping) => {
    // This is a simplified example. In a real application, you would generate
    // actual queries based on your query language and requirements.
    const fields = Object.entries(mapping.fieldMappings)
      .map(([entityField, apiField]) => `${entityField}: ${apiField}`)
      .join(', ');

    return `SELECT ${fields} FROM ${mapping.entityName} WHERE endpoint = '${mapping.apiEndpoint}'`;
  };

  if (mappings.length === 0) {
    return (
      <div className="text-sm text-gray-500">
        No mappings defined yet. Create mappings to see query previews.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {mappings.map((mapping, index) => (
        <div key={index} className="rounded-md bg-gray-50 p-4">
          <h4 className="text-md font-medium text-gray-900">
            Query for {mapping.entityName}
          </h4>
          <pre className="mt-2 rounded-md bg-gray-100 p-3 text-sm text-gray-800 overflow-x-auto">
            {generateQuery(mapping)}
          </pre>
        </div>
      ))}
    </div>
  );
};

export default QueryPreview; 