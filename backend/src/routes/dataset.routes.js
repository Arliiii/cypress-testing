import express from 'express';
import {
  uploadDataset,
  getDatasets,
  getDataset,
  deleteDataset,
  getVariables,
  getDatasetPreview,
  getDatasetData
} from '../controllers/dataset.controller.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.use(protect);

router.post('/upload', upload.single('file'), uploadDataset);
router.get('/', getDatasets);
router.get('/:id', getDataset);
router.get('/:id/variables', getVariables);
router.get('/:id/preview', getDatasetPreview);
router.get('/:id/data', getDatasetData);
router.delete('/:id', deleteDataset);

export default router;
