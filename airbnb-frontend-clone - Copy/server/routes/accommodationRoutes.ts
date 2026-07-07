import express from 'express';
import { createAccommodation, getAccommodations, updateAccommodation, deleteAccommodation } from '../controllers/accommodationController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAccommodations);
router.post('/', authenticateToken, createAccommodation);
router.put('/:id', authenticateToken, updateAccommodation);
router.delete('/:id', authenticateToken, deleteAccommodation);

export default router;
