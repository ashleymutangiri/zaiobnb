import express from 'express';
import { createReservation, getReservationsByHost, getReservationsByUser, deleteReservation } from '../controllers/reservationController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticateToken, createReservation);
router.get('/host', authenticateToken, getReservationsByHost);
router.get('/user', authenticateToken, getReservationsByUser);
router.delete('/:id', authenticateToken, deleteReservation);

export default router;
