import express from 'express';
import { addcategory, deletecategory, getcategories, updatecategory } from '../controllers/CategoryController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/add', authMiddleware, addcategory);
router.put('/:id', authMiddleware, updatecategory);
router.get('/', authMiddleware, getcategories);
router.delete('/:id', authMiddleware, deletecategory);

export default router;