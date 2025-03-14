import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { MetadataController } from './controllers/MetadataController';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const metadataController = new MetadataController();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Routes
app.post('/api/metadata/parse', metadataController.parseMetadata);
app.post('/api/metadata/validate', metadataController.validateMapping);
app.post('/api/metadata/apply', metadataController.applyMapping);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal server error'
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 