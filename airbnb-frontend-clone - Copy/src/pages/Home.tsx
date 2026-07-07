import React, { useState, useEffect } from 'react';
import { Search, Heart, Star, Compass, Waves, Flame, Home as CabinIcon, Key, Wifi, Snowflake, Coffee, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router';
import { MOCK_LOCATIONS } from '../data';
import { FUTURE_GETAWAYS_DATA, FUTURE_GETAWAYS_TABS } from '../constants';

const CATEGORIES = [
  { id: 'all', name: 'Trending', icon: Flame },
  { id: 'beach', name: 'Beachfront', icon: Waves },
  { id: 'cabins', name: 'Cabins', icon: CabinIcon },
  { id: 'pools', name: 'Amazing pools', icon: Sparkles },
  { id: 'wifi', name: 'Wifi included', icon: Wifi },
  { id: 'kitchen', name: 'Chef\'s kitchen', icon: Coffee },
];

export default function Home() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [activeCategory, setActiveCategory] = useState('all');
  const [listings, setListings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  // Fetch listings for the home page dynamic feed
  useEffect(() => {
    fetch('/api/listings')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Server returned status ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setListings(data);
        } else {
          console.error('Fetched listings is not an array:', data);
          setListings([]);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch listings:', err);
        setListings([]);
        setIsLoading(false);
      });
  }, []);

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Dynamic filter logic on category select
  const filteredListings = listings.filter((listing) => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'beach') {
      return (
        listing.title.toLowerCase().includes('ocean') ||
        listing.title.toLowerCase().includes('beach') ||
        listing.description.toLowerCase().includes('beach') ||
        listing.location === '1' // Sandbridge
      );
    }
    if (activeCategory === 'cabins') {
      return (
        listing.type.toLowerCase().includes('villa') ||
        listing.type.toLowerCase().includes('cabin') ||
        listing.title.toLowerCase().includes('villa')
      );
    }
    if (activeCategory === 'pools') {
      return listing.amenities.some((a: string) => a.toLowerCase().includes('pool'));
    }
    if (activeCategory === 'wifi') {
      return listing.amenities.some((a: string) => a.toLowerCase().includes('wifi'));
    }
    if (activeCategory === 'kitchen') {
      return listing.amenities.some((a: string) => a.toLowerCase().includes('kitchen'));
    }
    return true;
  });

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-grow pb-16">
        
        {/* Hero Banner with Search */}
        <div className="relative bg-gray-950 pt-16 pb-40 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="absolute inset-0">
            <img 
              src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
              alt="Hero landscape" 
              className="w-full h-full object-cover opacity-50 filter saturate-100 brightness-75 scale-105"
            />
          </div>
          
          <div className="relative max-w-4xl mx-auto z-10 text-center flex flex-col items-center">
            <span className="text-sm font-semibold text-[#FF385C] uppercase tracking-wider mb-3 bg-white/10 backdrop-blur-md py-1 px-4 rounded-full">
              Discover your next getaway
            </span>
            <h1 className="text-4xl md:text-6xl font-montserrat font-extrabold text-white mb-8 tracking-tight max-w-2xl leading-none">
              Not sure where to go? Perfect.
            </h1>
            <button 
              onClick={() => navigate('/locations/1')}
              className="bg-white hover:bg-gray-50 text-[#FF385C] font-extrabold px-8 py-4 rounded-full text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105 active:scale-95 duration-200 cursor-pointer"
            >
              I'm flexible
            </button>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="border-b border-gray-100 bg-white sticky top-20 z-30 shadow-sm py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-6 overflow-x-auto hide-scrollbar">
            <div className="flex items-center gap-8 md:gap-12 py-1">
              {CATEGORIES.map((cat) => {
                const IconComponent = cat.icon;
                const isSelected = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex flex-col items-center gap-2 cursor-pointer border-b-2 pb-2.5 text-xs transition-all duration-200 outline-none whitespace-nowrap group ${
                      isSelected 
                        ? 'border-gray-950 text-gray-950 font-semibold' 
                        : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-200'
                    }`}
                  >
                    <IconComponent 
                      size={24} 
                      className={`transition-transform duration-200 group-hover:scale-110 ${
                        isSelected ? 'text-[#FF385C]' : 'text-gray-400 group-hover:text-gray-700'
                      }`} 
                    />
                    <span>{cat.name}</span>
                  </button>
                );
              })}
            </div>
            
            <button 
              onClick={() => navigate('/locations/1')}
              className="border border-gray-200 rounded-xl px-4 py-2 text-xs font-semibold hover:border-gray-950 hover:bg-gray-50 transition-all flex items-center gap-2"
            >
              <Compass size={14} className="text-gray-600" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          
          {/* Dynamic Listings Feed */}
          <section className="mb-16">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-montserrat font-bold text-gray-950 tracking-tight">
                  Stays in featured destinations
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Explore properties selected for their unique quality and outstanding reviews
                </p>
              </div>
              <button 
                onClick={() => navigate('/locations/1')}
                className="text-sm font-semibold text-gray-950 underline hover:text-[#FF385C] transition-colors"
              >
                Show all
              </button>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="space-y-3">
                    <div className="bg-gray-200 h-64 rounded-2xl w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : filteredListings.length === 0 ? (
              <div className="bg-gray-50 rounded-2xl p-12 text-center border border-gray-100">
                <p className="text-gray-500 font-medium">No matching stays found in this category.</p>
                <button 
                  onClick={() => setActiveCategory('all')} 
                  className="mt-4 text-sm font-semibold text-[#FF385C] underline hover:text-[#D70466]"
                >
                  Clear filter
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredListings.map((listing) => {
                  const isFav = !!favorites[listing.id];
                  const primaryImg = listing.images && listing.images.length > 0 
                    ? listing.images[0] 
                    : "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80";
                  
                  return (
                    <div 
                      key={listing.id}
                      onClick={() => navigate(`/locations/${listing.location || '1'}/listing/${listing.id}`)}
                      className="group cursor-pointer flex flex-col"
                    >
                      <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100 mb-3.5 shadow-sm">
                        <img 
                          src={primaryImg} 
                          alt={listing.title} 
                          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                        />
                        {/* Floating Saved/Favorite Icon */}
                        <button 
                          onClick={(e) => toggleFavorite(e, listing.id)}
                          className="absolute top-3.5 right-3.5 p-2 rounded-full hover:scale-110 active:scale-95 transition-all bg-transparent focus:outline-none"
                        >
                          <Heart 
                            size={24} 
                            className={`transition-colors drop-shadow ${
                              isFav ? 'fill-[#FF385C] stroke-[#FF385C]' : 'fill-black/30 stroke-white stroke-2'
                            }`} 
                          />
                        </button>
                        
                        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-lg text-[10px] font-bold text-gray-900 shadow-sm uppercase">
                          {listing.type}
                        </div>
                      </div>

                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-gray-950 text-base line-clamp-1 pr-4">{listing.title}</h3>
                        <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-900 flex-shrink-0">
                          <Star size={14} className="fill-[#FF385C] text-[#FF385C]" />
                          <span>{listing.rating.toFixed(2)}</span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-500 line-clamp-1 mt-0.5">Hosted by {listing.host}</p>
                      <p className="text-sm text-gray-400">{listing.guests} guests · {listing.bedrooms} bed{listing.bedrooms > 1 ? 's' : ''}</p>
                      
                      <p className="text-sm text-gray-950 font-semibold mt-1.5">
                        R{listing.price} <span className="font-normal text-gray-500">night</span>
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Inspiration for your next trip (Locations Grid) */}
          <section className="mb-20">
            <h2 className="text-2xl md:text-3xl font-montserrat font-bold text-gray-950 tracking-tight mb-8">
              Inspiration for your next trip
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {MOCK_LOCATIONS.map((loc) => (
                <div 
                  key={loc.id} 
                  onClick={() => navigate(`/locations/${loc.id}`)}
                  className="bg-white border border-gray-100 rounded-2xl overflow-hidden cursor-pointer group shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="h-44 overflow-hidden relative">
                    <img 
                      src={loc.imageUrl} 
                      alt={loc.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{loc.name}</h3>
                    <p className="text-gray-500 text-sm font-medium">{loc.distance}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Discover Zaiobnb Experiences */}
          <section className="mb-20">
            <h2 className="text-2xl md:text-3xl font-montserrat font-bold text-gray-950 tracking-tight mb-8">
              Discover Zaiobnb Experiences
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Things to do on your trip */}
              <div 
                onClick={() => navigate('/locations/1')}
                className="relative rounded-2xl overflow-hidden h-[400px] group transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer"
              >
                <img 
                  src="https://images.unsplash.com/photo-1533105079780-92b9be482077?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                  alt="Things to do on your trip" 
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-12 flex flex-col justify-between">
                  <span className="bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold text-white uppercase w-max">
                    In the wild
                  </span>
                  <div>
                    <h3 className="text-3xl md:text-4xl font-extrabold text-white max-w-xs leading-tight mb-5">
                      Things to do on your trip
                    </h3>
                    <button className="bg-white hover:bg-gray-50 text-gray-950 font-bold px-6 py-3.5 rounded-xl text-sm transition-all shadow-md hover:scale-105 active:scale-95">
                      Experiences
                    </button>
                  </div>
                </div>
              </div>

              {/* Things to do at home */}
              <div 
                onClick={() => navigate('/locations/1')}
                className="relative rounded-2xl overflow-hidden h-[400px] group transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer"
              >
                <img 
                  src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                  alt="Things to do at home" 
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-12 flex flex-col justify-between">
                  <span className="bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold text-white uppercase w-max">
                    At home
                  </span>
                  <div>
                    <h3 className="text-3xl md:text-4xl font-extrabold text-white max-w-xs leading-tight mb-5">
                      Things to do from home
                    </h3>
                    <button className="bg-white hover:bg-gray-50 text-gray-950 font-bold px-6 py-3.5 rounded-xl text-sm transition-all shadow-md hover:scale-105 active:scale-95">
                      Online Experiences
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ShopZaiobnb Section */}
          <section className="mb-20 bg-gray-50 rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
            <div className="flex flex-col md:flex-row">
              <div className="p-12 md:p-20 flex-1 flex flex-col justify-center bg-gray-50/50">
                <span className="text-[#FF385C] font-semibold text-xs uppercase tracking-wider mb-2">Gift vouchers</span>
                <h2 className="text-3xl md:text-4xl font-montserrat font-extrabold text-gray-950 mb-4 leading-tight">
                  Shop Zaiobnb gift cards
                </h2>
                <p className="text-gray-500 text-sm mb-6 max-w-sm">
                  Give the gift of incredible travels, unforgettable stays, and unique host experiences to the ones you cherish.
                </p>
                <button className="bg-gray-950 hover:bg-gray-900 text-white px-6 py-3.5 rounded-xl font-bold text-sm w-max transition-all shadow-md active:scale-95">
                  Learn more
                </button>
              </div>
              <div className="flex-1 min-h-[300px] relative">
                <img 
                  src="https://images.unsplash.com/photo-1513151233558-d860c5398176?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                  alt="Zaiobnb gift cards" 
                  className="w-full h-full object-cover saturate-150 brightness-105"
                />
              </div>
            </div>
          </section>

          {/* Inspiration for future getaways */}
          <section className="mb-10">
            <h2 className="text-2xl font-montserrat font-bold text-gray-950 tracking-tight mb-6">
              Inspiration for future getaways
            </h2>
            
            <div className="flex overflow-x-auto gap-8 border-b border-gray-100 pb-3 mb-8 hide-scrollbar">
              {FUTURE_GETAWAYS_TABS.map((tab, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTab(idx)}
                  className={`whitespace-nowrap pb-2 font-medium text-sm transition-all cursor-pointer outline-none ${
                    activeTab === idx 
                      ? 'border-b-2 border-gray-900 text-gray-900 font-semibold' 
                      : 'border-b-2 border-transparent text-gray-500 hover:text-gray-800'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-6 gap-x-4">
              {FUTURE_GETAWAYS_DATA.map((item, idx) => (
                <div key={idx} className="cursor-pointer group">
                  <h4 className="font-semibold text-gray-900 group-hover:underline text-sm">{item.city}</h4>
                  <p className="text-gray-400 text-xs mt-0.5">{item.state}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
