import express from 'express';
import {
  createReport,
  getReports,
  getReport,
  deleteReport,
  toggleStar,
  exportReport
} from '../controllers/report.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.post('/', createReport);
router.get('/', getReports);
router.get('/:id', getReport);
router.delete('/:id', deleteReport);
router.patch('/:id/star', toggleStar);
router.get('/:id/export', exportReport);

export default router;
