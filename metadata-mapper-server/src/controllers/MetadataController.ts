import { Request, Response } from 'express';

export class MetadataController {
  parseMetadata = async (req: Request, res: Response) => {
    try {
      const { metadata } = req.body;
      
      if (!metadata) {
        return res.status(400).json({ error: 'No metadata provided' });
      }

      // Parse the metadata and extract structure
      const structure = this.extractStructure(metadata);
      
      res.json({ structure });
    } catch (error) {
      console.error('Error parsing metadata:', error);
      res.status(500).json({ error: 'Failed to parse metadata' });
    }
  };

  validateMapping = async (req: Request, res: Response) => {
    try {
      const { metadata, mappingRules } = req.body;
      
      if (!metadata || !mappingRules) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Validate the mapping rules against the metadata
      const validationResult = this.validateMappingRules(metadata, mappingRules);
      
      res.json(validationResult);
    } catch (error) {
      console.error('Error validating mapping:', error);
      res.status(500).json({ error: 'Failed to validate mapping' });
    }
  };

  applyMapping = async (req: Request, res: Response) => {
    try {
      const { metadata, mappingRules } = req.body;
      
      if (!metadata || !mappingRules) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Apply the mapping rules to the metadata
      const result = this.applyMappingRules(metadata, mappingRules);
      
      res.json(result);
    } catch (error) {
      console.error('Error applying mapping:', error);
      res.status(500).json({ error: 'Failed to apply mapping' });
    }
  };

  private extractStructure(metadata: any): any {
    try {
      const parsed = typeof metadata === 'string' ? JSON.parse(metadata) : metadata;
      return this.analyzeStructure(parsed);
    } catch (error) {
      throw new Error('Invalid metadata format');
    }
  }

  private analyzeStructure(obj: any, path: string = ''): any {
    const structure: any = {};

    for (const [key, value] of Object.entries(obj)) {
      const currentPath = path ? `${path}.${key}` : key;

      if (Array.isArray(value)) {
        structure[key] = {
          type: 'array',
          items: value.length > 0 ? this.analyzeStructure(value[0]) : {},
          path: currentPath
        };
      } else if (value !== null && typeof value === 'object') {
        structure[key] = {
          type: 'object',
          properties: this.analyzeStructure(value),
          path: currentPath
        };
      } else {
        structure[key] = {
          type: typeof value,
          path: currentPath
        };
      }
    }

    return structure;
  }

  private validateMappingRules(metadata: any, mappingRules: any[]): any {
    const parsed = typeof metadata === 'string' ? JSON.parse(metadata) : metadata;
    const validationResults = mappingRules.map(rule => {
      const sourceValue = this.getNestedValue(parsed, rule.sourceField);
      return {
        rule,
        valid: sourceValue !== undefined,
        value: sourceValue
      };
    });

    return {
      valid: validationResults.every(result => result.valid),
      results: validationResults
    };
  }

  private applyMappingRules(metadata: any, mappingRules: any[]): any {
    const parsed = typeof metadata === 'string' ? JSON.parse(metadata) : metadata;
    const result: any = {};

    mappingRules.forEach(rule => {
      const sourceValue = this.getNestedValue(parsed, rule.sourceField);
      if (sourceValue !== undefined) {
        this.setNestedValue(result, rule.targetField, sourceValue);
      }
    });

    return result;
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : undefined;
    }, obj);
  }

  private setNestedValue(obj: any, path: string, value: any): void {
    const keys = path.split('.');
    const lastKey = keys.pop()!;
    const target = keys.reduce((current, key) => {
      if (!(key in current)) {
        current[key] = {};
      }
      return current[key];
    }, obj);
    target[lastKey] = value;
  }
} 