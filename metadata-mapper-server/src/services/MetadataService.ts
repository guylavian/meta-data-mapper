import {
  Entity,
  Field,
  MappingRule,
  ValidationResult,
  TransformationConfig
} from '../models/types';

export class MetadataService {
  private getType(value: any): string {
    if (Array.isArray(value)) {
      return `array<${value.length > 0 ? this.getType(value[0]) : 'any'}>`;
    }
    if (value === null) return 'null';
    if (typeof value === 'object') return 'object';
    return typeof value;
  }

  private extractNestedFields(
    obj: any,
    parentPath: string = '',
    maxDepth: number = 5,
    currentDepth: number = 0
  ): Field[] {
    if (currentDepth >= maxDepth) return [];
    
    return Object.entries(obj).flatMap(([key, value]) => {
      const currentPath = parentPath ? `${parentPath}.${key}` : key;
      const fields: Field[] = [];
      
      if (Array.isArray(value)) {
        fields.push({
          path: currentPath,
          type: this.getType(value),
          isArray: true,
          name: key,
        });
        
        if (value.length > 0 && typeof value[0] === 'object') {
          fields.push(...this.extractNestedFields(value[0], `${currentPath}[0]`, maxDepth, currentDepth + 1));
        }
      } else if (value && typeof value === 'object') {
        fields.push({
          path: currentPath,
          type: 'object',
          name: key,
          isObject: true,
        });
        fields.push(...this.extractNestedFields(value, currentPath, maxDepth, currentDepth + 1));
      } else {
        fields.push({
          path: currentPath,
          type: this.getType(value),
          name: key,
        });
      }
      
      return fields;
    });
  }

  public parseMetadata(jsonString: string): Entity[] {
    try {
      const data = JSON.parse(jsonString);
      const entities: Entity[] = [];
      
      // Handle root level as an entity
      const rootFields = this.extractNestedFields(data);
      if (rootFields.length > 0) {
        entities.push({
          name: 'Root',
          path: '',
          fields: rootFields,
        });
      }
      
      // Extract array-type fields as potential entities
      const arrayFields = rootFields.filter(field => field.isArray);
      arrayFields.forEach(field => {
        if (field.type.startsWith('array<object>')) {
          const sample = data[field.name][0];
          if (sample && typeof sample === 'object') {
            entities.push({
              name: field.name,
              path: field.path,
              fields: this.extractNestedFields(sample),
            });
          }
        }
      });
      
      return entities;
    } catch (error) {
      console.error('Error parsing metadata:', error);
      throw new Error('Failed to parse metadata');
    }
  }

  public validateFieldCompatibility(
    sourceField: Field,
    targetField: Field
  ): ValidationResult {
    if (sourceField.type === targetField.type) {
      return { valid: true };
    }
    
    // Handle common type conversions
    const compatiblePairs = new Set([
      'string:number',
      'number:string',
      'string:boolean',
      'boolean:string',
      'object:string',
      'string:object',
    ]);
    
    const pair = `${sourceField.type}:${targetField.type}`;
    if (compatiblePairs.has(pair)) {
      return { 
        valid: true,
        error: `Will convert ${sourceField.type} to ${targetField.type}`
      };
    }
    
    return {
      valid: false,
      error: `Cannot convert ${sourceField.type} to ${targetField.type}`
    };
  }

  private applyTransformation(value: any, config: TransformationConfig): any {
    switch (config.type) {
      case 'direct':
        return value;
      
      case 'format':
        if (config.formatString && config.sourceType === 'date') {
          // TODO: Implement date formatting
          return value;
        }
        return value;
      
      case 'convert':
        if (config.customFunction) {
          try {
            // WARNING: This is unsafe and should be replaced with a proper sandbox
            const fn = new Function('value', config.customFunction);
            return fn(value);
          } catch (error) {
            console.error('Error in custom transformation:', error);
            throw new Error('Failed to apply custom transformation');
          }
        }
        return value;
    }
  }

  public applyMapping(metadata: string, rules: MappingRule[]): any {
    try {
      const data = JSON.parse(metadata);
      const result: Record<string, any> = {};
      
      rules.forEach(rule => {
        const sourceValue = this.getValueByPath(data, rule.sourceField);
        const transformedValue = rule.transformation
          ? this.applyTransformation(sourceValue, rule.transformation)
          : sourceValue;
        
        this.setValueByPath(result, rule.targetField, transformedValue);
      });
      
      return result;
    } catch (error) {
      console.error('Error applying mapping:', error);
      throw new Error('Failed to apply mapping');
    }
  }

  private getValueByPath(obj: any, path: string): any {
    return path.split('.').reduce((acc, part) => {
      if (acc === undefined) return undefined;
      return acc[part];
    }, obj);
  }

  private setValueByPath(obj: any, path: string, value: any): void {
    const parts = path.split('.');
    const lastPart = parts.pop()!;
    const target = parts.reduce((acc, part) => {
      if (!acc[part]) acc[part] = {};
      return acc[part];
    }, obj);
    target[lastPart] = value;
  }
} 