import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { addOrder, getOrders } from '../controllers/OrderController.js';

const router = express.Router();


router.get('/', authMiddleware, getOrders);
router.post('/add', authMiddleware, addOrder);
// router.put('/:id', authMiddleware, updateproduct);
// router.delete('/:id', authMiddleware, deleteproduct);

export default router;