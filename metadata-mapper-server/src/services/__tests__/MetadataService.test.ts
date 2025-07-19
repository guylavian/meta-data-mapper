import assert from 'assert';
import { MetadataService } from '../MetadataService';

const service = new MetadataService();

const formatted = (service as any).applyTransformation('2024-05-20T12:34:56Z', {
  type: 'format',
  sourceType: 'date',
  targetType: 'string',
  formatString: 'en-CA'
});

assert.strictEqual(formatted, '2024-05-20');
console.log('Date formatting test passed');
