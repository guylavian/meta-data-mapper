import React from 'react';
import { Card, List, Button, Typography } from 'antd';
import { TransformationChain } from '../../types/transformation';
import { Entity } from '../../types/mapping';

const { Title, Text } = Typography;

interface ReviewMappingProps {
  entity: string | null;
  sourceFields: string[];
  targetFields: string[];
  transformationChain: TransformationChain | null;
  onGenerate: () => void;
}

export const ReviewMapping: React.FC<ReviewMappingProps> = ({
  entity,
  sourceFields,
  targetFields,
  transformationChain,
  onGenerate
}) => {
  return (
    <Card>
      <Title level={4}>Review Mapping</Title>
      
      <div style={{ marginBottom: 24 }}>
        <Text strong>Selected Entity: </Text>
        <Text>{entity}</Text>
      </div>

      <div style={{ marginBottom: 24 }}>
        <Text strong>Source Fields:</Text>
        <List
          size="small"
          dataSource={sourceFields}
          renderItem={field => <List.Item>{field}</List.Item>}
        />
      </div>

      <div style={{ marginBottom: 24 }}>
        <Text strong>Target Fields:</Text>
        <List
          size="small"
          dataSource={targetFields}
          renderItem={field => <List.Item>{field}</List.Item>}
        />
      </div>

      {transformationChain && (
        <div style={{ marginBottom: 24 }}>
          <Text strong>Transformations:</Text>
          <List
            size="small"
            dataSource={transformationChain.transformations}
            renderItem={transformation => (
              <List.Item>
                <div>
                  <div>{transformation.name}</div>
                  <div>
                    <Text type="secondary">
                      {transformation.type} - {transformation.operation}
                    </Text>
                  </div>
                </div>
              </List.Item>
            )}
          />
        </div>
      )}

      <Button type="primary" onClick={onGenerate}>
        Generate Mapping Rules
      </Button>
    </Card>
  );
}; 