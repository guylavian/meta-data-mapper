import { EMMMappingGroup } from '../types/mapping';

export const EMM_TARGET_FIELDS: EMMMappingGroup[] = [
  {
    name: 'Basic Information',
    fields: [
      { path: 'id', type: 'string', description: 'Unique identifier' },
      { path: 'name', type: 'string', description: 'Entity name' },
      { path: 'description', type: 'string', description: 'Entity description' },
      { path: 'created_at', type: 'datetime', description: 'Creation timestamp' },
      { path: 'updated_at', type: 'datetime', description: 'Last update timestamp' }
    ]
  },
  {
    name: 'Classification',
    fields: [
      { path: 'type', type: 'string', description: 'Entity type' },
      { path: 'category', type: 'string', description: 'Entity category' },
      { path: 'tags', type: 'array', description: 'Entity tags' }
    ]
  },
  {
    name: 'Relationships',
    fields: [
      { path: 'parent_id', type: 'string', description: 'Parent entity ID' },
      { path: 'related_entities', type: 'array', description: 'Related entity IDs' }
    ]
  }
]; 