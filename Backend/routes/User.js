import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { adduser, deleteuser, getusers } from '../controllers/UserController.js';

const router = express.Router();

router.get('/', authMiddleware, getusers);
router.post('/add', authMiddleware, adduser);
router.delete('/:id', authMiddleware, deleteuser);

export default router;