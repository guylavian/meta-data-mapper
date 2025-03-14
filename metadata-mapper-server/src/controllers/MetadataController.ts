import { Request, Response } from 'express';
import { MetadataService } from '../services/MetadataService';
import {
  ParseMetadataRequest,
  ValidateMappingRequest,
  ApplyMappingRequest
} from '../models/types';

export class MetadataController {
  private metadataService: MetadataService;

  constructor() {
    this.metadataService = new MetadataService();
  }

  public parseMetadata = async (req: Request<{}, {}, ParseMetadataRequest>, res: Response) => {
    try {
      const { metadata } = req.body;
      const entities = this.metadataService.parseMetadata(metadata);
      res.json({ entities });
    } catch (error) {
      res.status(400).json({
        error: error instanceof Error ? error.message : 'Failed to parse metadata'
      });
    }
  };

  public validateMapping = async (req: Request<{}, {}, ValidateMappingRequest>, res: Response) => {
    try {
      const { sourceField, targetField } = req.body;
      const result = this.metadataService.validateFieldCompatibility(sourceField, targetField);
      res.json(result);
    } catch (error) {
      res.status(400).json({
        error: error instanceof Error ? error.message : 'Failed to validate mapping'
      });
    }
  };

  public applyMapping = async (req: Request<{}, {}, ApplyMappingRequest>, res: Response) => {
    try {
      const { metadata, rules } = req.body;
      const result = this.metadataService.applyMapping(metadata, rules);
      res.json({ result });
    } catch (error) {
      res.status(400).json({
        error: error instanceof Error ? error.message : 'Failed to apply mapping'
      });
    }
  };
} 