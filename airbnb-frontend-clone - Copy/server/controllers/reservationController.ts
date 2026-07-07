import mongoose from 'mongoose';
import { Reservation } from '../models/Reservation.js';
import { inMemoryReservations, inMemoryAccommodations } from '../dbFallback.js';

export const createReservation = async (req: any, res: any) => {
  try {
    const payload = {
      ...req.body,
      userId: req.user.id || req.user.username,
    };

    if (mongoose.connection.readyState === 1) {
      const reservation = new Reservation(payload);
      const saved = await reservation.save();
      res.status(201).json(saved);
    } else {
      console.log('MongoDB not connected, creating reservation in-memory');
      const id = `res_mem_${Date.now()}`;
      const newRes = {
        ...payload,
        _id: id,
        id: id,
        status: 'Upcoming'
      };
      inMemoryReservations.push(newRes);
      res.status(201).json(newRes);
    }
  } catch (error) {
    console.error('Create reservation error:', error);
    res.status(400).json({ error: 'Failed to create reservation' });
  }
};

export const getReservationsByHost = async (req: any, res: any) => {
  try {
    const hostId = req.user.id || req.user.username;

    if (mongoose.connection.readyState === 1) {
      const reservations = await Reservation.find({ hostId }).populate('listingId');
      res.json(reservations);
    } else {
      console.log('MongoDB not connected, getting reservations by host in-memory');
      // Populate listingId with accommodation from inMemoryAccommodations
      const filtered = inMemoryReservations.filter(r => r.hostId === hostId).map(r => {
        const listing = inMemoryAccommodations.find(a => a.id === r.listingId || a._id === r.listingId);
        return { ...r, listingId: listing || r.listingId };
      });
      res.json(filtered);
    }
  } catch (error) {
    console.error('Get reservations by host error:', error);
    res.status(500).json({ error: 'Failed to fetch reservations' });
  }
};

export const getReservationsByUser = async (req: any, res: any) => {
  try {
    const userId = req.user.id || req.user.username;

    if (mongoose.connection.readyState === 1) {
      const reservations = await Reservation.find({ userId }).populate('listingId');
      res.json(reservations);
    } else {
      console.log('MongoDB not connected, getting reservations by user in-memory');
      // Populate listingId with accommodation from inMemoryAccommodations
      const filtered = inMemoryReservations.filter(r => r.userId === userId).map(r => {
        const listing = inMemoryAccommodations.find(a => a.id === r.listingId || a._id === r.listingId);
        return { ...r, listingId: listing || r.listingId };
      });
      res.json(filtered);
    }
  } catch (error) {
    console.error('Get reservations by user error:', error);
    res.status(500).json({ error: 'Failed to fetch reservations' });
  }
};

export const deleteReservation = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1) {
      const deleted = await Reservation.findByIdAndDelete(id);
      if (!deleted) return res.status(404).json({ error: 'Reservation not found' });
      res.json({ message: 'Reservation deleted' });
    } else {
      console.log('MongoDB not connected, deleting reservation in-memory');
      const index = inMemoryReservations.findIndex(r => r.id === id || r._id === id);
      if (index === -1) return res.status(404).json({ error: 'Reservation not found' });
      inMemoryReservations.splice(index, 1);
      res.json({ message: 'Reservation deleted' });
    }
  } catch (error) {
    console.error('Delete reservation error:', error);
    res.status(400).json({ error: 'Failed to delete reservation' });
  }
};

