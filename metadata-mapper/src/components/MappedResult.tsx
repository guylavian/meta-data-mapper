import React from 'react';

interface MappedResultProps {
  result: any;
  error: string | null;
}

const MappedResult: React.FC<MappedResultProps> = ({ result, error }) => {
  if (error) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-2">Error</h2>
        <div className="p-4 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-2">Mapped Result</h2>
        <div className="p-4 bg-gray-50 text-gray-500 rounded-md">
          No result yet. Enter metadata and define mapping rules to see the result.
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Mapped Result</h2>
      <pre className="p-4 bg-gray-50 rounded-md overflow-auto">
        {JSON.stringify(result, null, 2)}
      </pre>
    </div>
  );
};

export default MappedResult; 