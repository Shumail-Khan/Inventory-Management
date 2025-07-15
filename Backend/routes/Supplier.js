import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { addsupplier, deletesupplier, getsuppliers, updatesupplier } from '../controllers/SupplierController.js';

const router = express.Router();

router.post('/add', authMiddleware, addsupplier);
router.put('/:id', authMiddleware, updatesupplier);
router.get('/', authMiddleware, getsuppliers);
router.delete('/:id', authMiddleware, deletesupplier);

export default router;