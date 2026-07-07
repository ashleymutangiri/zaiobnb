import mongoose from 'mongoose';
import { Accommodation } from '../models/Accommodation.js';
import { inMemoryAccommodations } from '../dbFallback.js';

export const createAccommodation = async (req: any, res: any) => {
  try {
    const payload = {
      ...req.body,
      host: req.user.username,
      host_id: req.user.id || `host_${Date.now()}`
    };

    if (mongoose.connection.readyState === 1) {
      const newAccommodation = new Accommodation(payload);
      const saved = await newAccommodation.save();
      const obj = saved.toObject();
      res.status(201).json({ ...obj, id: obj._id });
    } else {
      console.log('MongoDB not connected, creating accommodation in-memory');
      const id = `l_mem_${Date.now()}`;
      const newAcc = {
        ...payload,
        _id: id,
        id: id,
        rating: 4.8,
        reviews: 0,
        amenities: typeof payload.amenities === 'string' ? payload.amenities.split(',').map((s: string) => s.trim()) : payload.amenities,
        images: typeof payload.images === 'string' ? payload.images.split(',').map((s: string) => s.trim()) : payload.images,
        specificRatings: { cleanliness: 4.8, communication: 4.8, checkIn: 4.8, accuracy: 4.8, location: 4.8, value: 4.8 }
      };
      inMemoryAccommodations.push(newAcc);
      res.status(201).json(newAcc);
    }
  } catch (error) {
    console.error('Create accommodation error:', error);
    res.status(400).json({ error: 'Failed to create accommodation' });
  }
};

export const getAccommodations = async (req: any, res: any) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const accommodations = await Accommodation.find();
      // Map _id to id for frontend compatibility
      const mapped = accommodations.map(a => {
        const obj = a.toObject();
        return { ...obj, id: obj._id };
      });
      res.json(mapped);
    } else {
      res.json(inMemoryAccommodations);
    }
  } catch (error) {
    console.error('Get accommodations error:', error);
    res.status(500).json({ error: 'Failed to fetch accommodations' });
  }
};

export const updateAccommodation = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1) {
      const updated = await Accommodation.findByIdAndUpdate(id, req.body, { new: true });
      if (!updated) return res.status(404).json({ error: 'Accommodation not found' });
      
      const obj = updated.toObject();
      res.json({ ...obj, id: obj._id });
    } else {
      console.log('MongoDB not connected, updating accommodation in-memory');
      const index = inMemoryAccommodations.findIndex(a => a.id === id || a._id === id);
      if (index === -1) return res.status(404).json({ error: 'Accommodation not found' });
      
      const updatedAcc = {
        ...inMemoryAccommodations[index],
        ...req.body,
        amenities: typeof req.body.amenities === 'string' ? req.body.amenities.split(',').map((s: string) => s.trim()) : req.body.amenities,
        images: typeof req.body.images === 'string' ? req.body.images.split(',').map((s: string) => s.trim()) : req.body.images,
      };
      inMemoryAccommodations[index] = updatedAcc;
      res.json(updatedAcc);
    }
  } catch (error) {
    console.error('Update accommodation error:', error);
    res.status(400).json({ error: 'Failed to update accommodation' });
  }
};

export const deleteAccommodation = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1) {
      const deleted = await Accommodation.findByIdAndDelete(id);
      if (!deleted) return res.status(404).json({ error: 'Accommodation not found' });
      res.json({ message: 'Deleted successfully' });
    } else {
      console.log('MongoDB not connected, deleting accommodation in-memory');
      const index = inMemoryAccommodations.findIndex(a => a.id === id || a._id === id);
      if (index === -1) return res.status(404).json({ error: 'Accommodation not found' });
      inMemoryAccommodations.splice(index, 1);
      res.json({ message: 'Deleted successfully' });
    }
  } catch (error) {
    console.error('Delete accommodation error:', error);
    res.status(400).json({ error: 'Failed to delete accommodation' });
  }
};

