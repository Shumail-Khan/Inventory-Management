import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { adduser, deleteuser, getuser, getusers, updateuser } from '../controllers/UserController.js';

const router = express.Router();

router.get('/', authMiddleware, getusers);
router.get('/profile', authMiddleware, getuser);
router.put('/profile', authMiddleware, updateuser);
router.post('/add', authMiddleware, adduser);
router.delete('/:id', authMiddleware, deleteuser);
 
export default router;