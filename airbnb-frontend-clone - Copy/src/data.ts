import { ReactNode } from 'react';

export interface Location {
  id: string;
  name: string;
  imageUrl: string;
  distance: string;
  color: string;
}

export interface Listing {
  id: string;
  images: string[];
  type: string;
  location: string;
  guests: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  rating: number;
  reviews: number;
  price: number;
  title: string;
  host: string;
  host_id: string;
  weeklyDiscount: number;
  cleaningFee: number;
  serviceFee: number;
  occupancyTaxes: number;
  enhancedCleaning: boolean;
  selfCheckIn: boolean;
  description: string;
  specificRatings: {
    cleanliness: number;
    communication: number;
    checkIn: number;
    accuracy: number;
    location: number;
    value: number;
  };
}

export const MOCK_LOCATIONS: Location[] = [
  { id: '1', name: 'Camps Bay, Cape Town', distance: '12 miles away', imageUrl: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', color: 'bg-black' },
  { id: '2', name: 'Clifton Beach, Cape Town', distance: '15 miles away', imageUrl: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', color: 'bg-black' },
  { id: '3', name: 'Knysna, Garden Route', distance: '310 miles away', imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', color: 'bg-black' },
  { id: '4', name: 'Umhlanga Rocks, KZN', distance: '350 miles away', imageUrl: 'https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', color: 'bg-black' },
  { id: '5', name: 'Franschhoek, Winelands', distance: '45 miles away', imageUrl: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', color: 'bg-black' },
  { id: '6', name: 'Hermanus, Overberg', distance: '75 miles away', imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1c2c409c2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', color: 'bg-black' },
];

export const MOCK_LISTINGS: Listing[] = [
  {
    id: 'l1',
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600607687931-cebf10cb4cb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
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
    host_id: 'host_1',
    weeklyDiscount: 0,
    cleaningFee: 1200,
    serviceFee: 650,
    occupancyTaxes: 450,
    enhancedCleaning: true,
    selfCheckIn: true,
    description: 'Experience spectacular luxury living right under the Twelve Apostles on Camps Bay beach. This stunning villa features panoramic Atlantic Ocean sunset views, a private heated pool, and premium entertainment spaces.',
    specificRatings: {
      cleanliness: 4.9,
      communication: 4.8,
      checkIn: 5.0,
      accuracy: 4.9,
      location: 5.0,
      value: 4.7
    }
  },
  {
    id: 'l2',
    images: [
      'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1c2c409c2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    ],
    type: 'Entire cottage',
    location: '1',
    guests: 4,
    bedrooms: 2,
    bathrooms: 1,
    amenities: ['Beach access', 'Wifi', 'Free parking', 'Kitchen'],
    rating: 4.85,
    reviews: 89,
    price: 2200,
    title: 'Cozy Camps Bay Beachfront Cottage',
    host: 'Thabo Ndlovu',
    host_id: 'host_2',
    weeklyDiscount: 10,
    cleaningFee: 800,
    serviceFee: 350,
    occupancyTaxes: 250,
    enhancedCleaning: true,
    selfCheckIn: false,
    description: 'A charming, historic cottage just steps from the pristine sands of Camps Bay. Wake up to the sound of waves and enjoy your morning coffee with mountain backdrops.',
    specificRatings: {
      cleanliness: 4.7,
      communication: 4.9,
      checkIn: 4.8,
      accuracy: 4.8,
      location: 4.9,
      value: 4.6
    }
  },
  {
    id: 'l3',
    images: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1560184897-ae75f418493e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    ],
    type: 'Entire home',
    location: '2',
    guests: 6,
    bedrooms: 3,
    bathrooms: 2,
    amenities: ['Wifi', 'Free parking', 'Kitchen', 'Washer', 'Dryer'],
    rating: 4.92,
    reviews: 210,
    price: 3100,
    title: 'Historic Victorian Home in Clifton',
    host: 'Sibusiso Gumede',
    host_id: 'host_3',
    weeklyDiscount: 15,
    cleaningFee: 900,
    serviceFee: 450,
    occupancyTaxes: 300,
    enhancedCleaning: false,
    selfCheckIn: true,
    description: 'Beautifully restored Victorian beach home in the prestigious Clifton Steps. Walk straight down to Clifton 4th beach.',
    specificRatings: {
      cleanliness: 4.9,
      communication: 4.8,
      checkIn: 4.9,
      accuracy: 4.9,
      location: 4.8,
      value: 4.8
    }
  },
  {
    id: 'l4',
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    ],
    type: 'Luxury Suite',
    location: '5',
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    amenities: ['Vineyard view', 'Wifi', 'Free parking', 'Wine cellar access'],
    rating: 4.98,
    reviews: 45,
    price: 2900,
    title: 'Franschhoek Vineyard Premium Suite',
    host: 'Naledi Molefe',
    host_id: 'host_1',
    weeklyDiscount: 5,
    cleaningFee: 500,
    serviceFee: 300,
    occupancyTaxes: 200,
    enhancedCleaning: true,
    selfCheckIn: true,
    description: 'An elegant suite overlooking rolling grapevines in Franschhoek. Includes complimentary wine tasting on arrival and access to pristine gardens.',
    specificRatings: {
      cleanliness: 5.0,
      communication: 4.9,
      checkIn: 5.0,
      accuracy: 5.0,
      location: 4.9,
      value: 4.8
    }
  },
  {
    id: 'l5',
    images: [
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    ],
    type: 'Entire Cabin',
    location: '6',
    guests: 4,
    bedrooms: 2,
    bathrooms: 2,
    amenities: ['Sea view', 'Wifi', 'Hot tub', 'BBQ Grill'],
    rating: 4.91,
    reviews: 72,
    price: 2400,
    title: 'Hermanus Whale Watch Cabin',
    host: 'Pieter Marais',
    host_id: 'host_2',
    weeklyDiscount: 10,
    cleaningFee: 600,
    serviceFee: 300,
    occupancyTaxes: 150,
    enhancedCleaning: true,
    selfCheckIn: true,
    description: 'A cozy cliffside cabin in Hermanus. Watch southern right whales directly from your master bedroom balcony or while relaxing in the private hot tub.',
    specificRatings: {
      cleanliness: 4.8,
      communication: 4.9,
      checkIn: 4.9,
      accuracy: 4.9,
      location: 5.0,
      value: 4.7
    }
  }
];
