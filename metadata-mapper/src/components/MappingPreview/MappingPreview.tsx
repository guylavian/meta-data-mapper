import React from 'react';
import { Card, List, Button, Space, Select } from 'antd';
import { Field } from '../../types/mapping';
import { ArrowRightOutlined, DeleteOutlined } from '@ant-design/icons';

interface MappingPreviewProps {
  sourceFields: Field[];
  targetFields: Field[];
  mappingPairs: { source: Field; target: Field }[];
  onMapField: (sourceField: Field, targetField: Field) => void;
  onRemovePair: (index: number) => void;
}

const MappingPreview: React.FC<MappingPreviewProps> = ({
  sourceFields,
  targetFields,
  mappingPairs,
  onMapField,
  onRemovePair,
}) => {
  const unmappedSourceFields = sourceFields.filter(
    (source) => !mappingPairs.some((pair) => pair.source.name === source.name)
  );

  const unmappedTargetFields = targetFields.filter(
    (target) => !mappingPairs.some((pair) => pair.target.name === target.name)
  );

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Card title="Current Mappings">
        <List
          dataSource={mappingPairs}
          renderItem={(pair, index) => (
            <List.Item
              actions={[
                <Button
                  key="delete"
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => onRemovePair(index)}
                />,
              ]}
            >
              <Space>
                <span>{pair.source.name}</span>
                <ArrowRightOutlined />
                <span>{pair.target.name}</span>
              </Space>
            </List.Item>
          )}
        />
      </Card>

      {unmappedSourceFields.length > 0 && (
        <Card title="Create New Mapping">
          <List
            dataSource={unmappedSourceFields}
            renderItem={(sourceField) => (
              <List.Item>
                <Space>
                  <span>{sourceField.name}</span>
                  <ArrowRightOutlined />
                  <Select
                    style={{ width: 200 }}
                    placeholder="Select target field"
                    onChange={(_, option: any) => {
                      const targetField = targetFields.find(
                        (f) => f.name === option.value
                      );
                      if (targetField) {
                        onMapField(sourceField, targetField);
                      }
                    }}
                  >
                    {unmappedTargetFields.map((targetField) => (
                      <Select.Option
                        key={targetField.name}
                        value={targetField.name}
                      >
                        {targetField.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Space>
              </List.Item>
            )}
          />
        </Card>
      )}
    </Space>
  );
};

export default MappingPreview; 