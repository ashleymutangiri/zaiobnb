import mongoose from 'mongoose';

const accommodationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  bedrooms: { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  guests: { type: Number, required: true },
  type: { type: String, required: true },
  price: { type: Number, required: true },
  amenities: [{ type: String }],
  images: [{ type: String }],
  weeklyDiscount: { type: Number, default: 0 },
  cleaningFee: { type: Number, default: 0 },
  serviceFee: { type: Number, default: 0 },
  occupancyTaxes: { type: Number, default: 0 },
  host: { type: String, required: true },
  host_id: { type: String, required: true },
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  specificRatings: {
    cleanliness: { type: Number, default: 0 },
    communication: { type: Number, default: 0 },
    checkIn: { type: Number, default: 0 },
    accuracy: { type: Number, default: 0 },
    location: { type: Number, default: 0 },
    value: { type: Number, default: 0 },
  }
}, { timestamps: true });

export const Accommodation = mongoose.model('Accommodation', accommodationSchema);
