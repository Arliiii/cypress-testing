import express from 'express';
import {
  createAnalysis,
  getAnalyses,
  getAnalysis,
  deleteAnalysis,
  toggleStar
} from '../controllers/analysis.controller.js';
import { protect, checkCredits } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.post('/', checkCredits(1), createAnalysis);
router.get('/', getAnalyses);
router.get('/:id', getAnalysis);
router.delete('/:id', deleteAnalysis);
router.patch('/:id/star', toggleStar);

export default router;
