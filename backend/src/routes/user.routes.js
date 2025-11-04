import express from 'express';
import {
  getCredits,
  addCredits,
  getCreditHistory
} from '../controllers/user.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/credits', getCredits);
router.post('/credits/add', addCredits);
router.get('/credits/history', getCreditHistory);

export default router;
