import express from 'express';
import {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  toggleStar
} from '../controllers/project.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .post(createProject)
  .get(getProjects);

router.route('/:id')
  .get(getProject)
  .put(updateProject)
  .delete(deleteProject);

router.patch('/:id/star', toggleStar);

export default router;
