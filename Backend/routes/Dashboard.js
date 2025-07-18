import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { getData } from '../controllers/DashboardController.js';

const router = express.Router();


router.get('/', authMiddleware, getData);

export default router;