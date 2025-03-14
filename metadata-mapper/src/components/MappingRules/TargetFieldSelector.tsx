import React from 'react';
import { Card, List, Button } from 'antd';
import { Field } from '../../types/mapping';

interface TargetFieldSelectorProps {
  sourceFields: Field[];
  selectedFields: Field[];
  onSelect: (fields: Field[]) => void;
}

export const TargetFieldSelector: React.FC<TargetFieldSelectorProps> = ({
  sourceFields,
  selectedFields,
  onSelect
}) => {
  const handleFieldSelect = (field: Field) => {
    const isSelected = selectedFields.some(f => f.path === field.path);
    if (!isSelected) {
      onSelect([...selectedFields, field]);
    }
  };

  const handleFieldRemove = (field: Field) => {
    onSelect(selectedFields.filter(f => f.path !== field.path));
  };

  return (
    <Card title="Map to Target Fields">
      <div style={{ marginBottom: 16 }}>
        <h4>Selected Source Fields</h4>
        <List
          dataSource={sourceFields}
          renderItem={field => (
            <List.Item>
              {field.name} ({field.type})
            </List.Item>
          )}
        />
      </div>

      <div>
        <h4>Selected Target Fields</h4>
        <List
          dataSource={selectedFields}
          renderItem={field => (
            <List.Item
              actions={[
                <Button
                  type="link"
                  danger
                  onClick={() => handleFieldRemove(field)}
                >
                  Remove
                </Button>
              ]}
            >
              {field.name} ({field.type})
            </List.Item>
          )}
        />
      </div>
    </Card>
  );
}; 