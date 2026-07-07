import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import mongoose from "mongoose";
import dotenv from "dotenv";

import userRoutes from "./server/routes/userRoutes.js";
import accommodationRoutes from "./server/routes/accommodationRoutes.js";
import reservationRoutes from "./server/routes/reservationRoutes.js";
import { User } from "./server/models/User.js";
import { Accommodation } from "./server/models/Accommodation.js";

dotenv.config();

async function seedDatabase() {
  const usersCount = await User.countDocuments();
  if (usersCount === 0) {
    console.log("Seeding users...");
    await User.create([
      { username: 'Sipho Khumalo', password: 'password123', role: 'user' },
      { username: 'Thabo Ndlovu', password: 'password321', role: 'host' },
      { username: 'Zola Dlamini', password: 'password123', role: 'host' },
      { username: 'Naledi Molefe', password: 'adminpassword', role: 'admin' },
    ]);
  }

  const accommodationsCount = await Accommodation.countDocuments();
  if (accommodationsCount === 0) {
    console.log("Seeding accommodations...");
    await Accommodation.create([
      {
        images: [
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1600607687931-cebf10cb4cb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        ],
        type: 'Entire villa',
        location: '1',
        guests: 8,
        bedrooms: 4,
        bathrooms: 3,
        amenities: ['Ocean view', 'Private pool', 'Wifi', 'Air conditioning', 'Kitchen'],
        rating: 4.96,
        reviews: 124,
        price: 4500,
        title: 'Camps Bay Sunset Luxury Villa with Private Pool',
        host: 'Zola Dlamini',
        host_id: 'host_2',
        weeklyDiscount: 0,
        cleaningFee: 1200,
        serviceFee: 650,
        occupancyTaxes: 450,
        description: 'Experience spectacular luxury living right under the Twelve Apostles on Camps Bay beach. This stunning villa features panoramic Atlantic Ocean sunset views, a private heated pool, and premium entertainment spaces.',
        specificRatings: { cleanliness: 4.9, communication: 4.8, checkIn: 5.0, accuracy: 4.9, location: 5.0, value: 4.7 }
      }
    ]);
  }
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  // Connect to MongoDB
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/zaiobnb';
  try {
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 3000 });
    console.log('Connected to MongoDB');
    await seedDatabase();
  } catch (error) {
    console.error('Failed to connect to MongoDB. Ensure it is running or MONGODB_URI is set. Falling back to in-memory data store.', error);
  }

  // API Routes
  app.use('/api/users', userRoutes);
  app.use('/api/accommodations', accommodationRoutes);
  app.use('/api/reservations', reservationRoutes);
  
  // Legacy route for compatibility with frontend code
  app.post('/api/login', (req, res) => {
    // Forward to the new user route
    res.redirect(307, '/api/users/login');
  });
  
  app.use('/api/listings', accommodationRoutes); // Alias for backwards compatibility with frontend

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
