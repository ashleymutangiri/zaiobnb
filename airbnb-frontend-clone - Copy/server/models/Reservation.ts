import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema({
  listingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Accommodation', required: true },
  hostId: { type: String, required: true },
  userId: { type: String, required: true },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  guests: { type: Number, required: true },
  totalCost: { type: Number, required: true },
  status: { type: String, default: 'Upcoming' },
}, { timestamps: true });

export const Reservation = mongoose.model('Reservation', reservationSchema);
