import React, { useState } from 'react';
import { Card, Input, Button, message, Space, Tabs, Select } from 'antd';
import { useAppDispatch } from '../store';
import { parseMetadata } from '../store/metadata/metadataSlice';
import { metadataUrls } from '../data/metadataUrls';

const { TextArea } = Input;
const { TabPane } = Tabs;
const { Option } = Select;

const MetadataInput: React.FC = () => {
  const dispatch = useAppDispatch();
  const [url, setUrl] = useState('');
  const [jsonInput, setJsonInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUrlSubmit = async () => {
    if (!url) {
      message.error('Please enter a URL');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      await dispatch(parseMetadata(JSON.stringify(data)));
      message.success('Metadata loaded successfully');
    } catch (error) {
      message.error('Failed to fetch metadata from URL');
      console.error('Error fetching metadata:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJsonSubmit = async () => {
    if (!jsonInput) {
      message.error('Please enter JSON data');
      return;
    }

    try {
      setLoading(true);
      // Validate JSON
      JSON.parse(jsonInput);
      await dispatch(parseMetadata(jsonInput));
      message.success('Metadata parsed successfully');
    } catch (error) {
      message.error('Invalid JSON data');
      console.error('Error parsing metadata:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUrlSelect = (value: string) => {
    setUrl(value);
  };

  return (
    <Card title="Input Metadata" style={{ marginBottom: '20px' }}>
      <Tabs defaultActiveKey="1">
        <TabPane tab="URL" key="1">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Select
              style={{ width: '100%' }}
              placeholder="Select a sample metadata URL or enter your own"
              onChange={handleUrlSelect}
              value={url}
            >
              {metadataUrls.map((metadataUrl) => (
                <Option key={metadataUrl.url} value={metadataUrl.url}>
                  {metadataUrl.name} - {metadataUrl.description}
                </Option>
              ))}
            </Select>
            <Input
              placeholder="Or enter your own metadata URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onPressEnter={handleUrlSubmit}
            />
            <Button type="primary" onClick={handleUrlSubmit} loading={loading}>
              Load from URL
            </Button>
          </Space>
        </TabPane>
        <TabPane tab="JSON" key="2">
          <Space direction="vertical" style={{ width: '100%' }}>
            <TextArea
              rows={10}
              placeholder="Enter JSON metadata"
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
            />
            <Button type="primary" onClick={handleJsonSubmit} loading={loading}>
              Parse JSON
            </Button>
          </Space>
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default MetadataInput; 