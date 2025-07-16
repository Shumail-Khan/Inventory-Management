import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { addproduct, deleteproduct, getproducts, updateproduct } from '../controllers/ProductController.js';

const router = express.Router();


router.get('/', authMiddleware, getproducts);
router.post('/add', authMiddleware, addproduct);
router.put('/:id', authMiddleware, updateproduct);
router.delete('/:id', authMiddleware, deleteproduct);

export default router;