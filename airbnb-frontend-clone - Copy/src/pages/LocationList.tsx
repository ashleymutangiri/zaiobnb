import React, { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router';
import { Star, Heart, MapPin, Search, SlidersHorizontal, Map, X } from 'lucide-react';
import { MOCK_LOCATIONS } from '../data';
import { useCurrency } from '../context/CurrencyContext';

export default function LocationList() {
  const { locationId } = useParams();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q');
  const { formatPrice } = useCurrency();
  
  const location = MOCK_LOCATIONS.find(l => l.id === locationId) || MOCK_LOCATIONS[0];
  const [listings, setListings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  
  // Interactive Map State
  const [selectedMapListing, setSelectedMapListing] = useState<any | null>(null);
  const [hoveredListingId, setHoveredListingId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/listings')
      .then(res => {
        if (!res.ok) {
          throw new Error(`Server returned status ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          let filtered = data;
          if (locationId === 'search' && searchQuery) {
            filtered = data.filter((l: any) => 
              l.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
              l.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              MOCK_LOCATIONS.find(loc => loc.id === l.location)?.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
          } else {
            filtered = data.filter((l: any) => l.location === location.id);
          }
          setListings(filtered.length > 0 ? filtered : (locationId === 'search' ? [] : data));
        } else {
          console.error('Fetched listings is not an array:', data);
          setListings([]);
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setListings([]);
        setIsLoading(false);
      });
  }, [location.id, locationId, searchQuery]);

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    e.preventDefault();
    setFavorites(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-[#FF385C] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-semibold animate-pulse">Finding incredible stays...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-grow">
        
        {/* Simplified Search/Filter Header */}
        <div className="border-b border-gray-200 py-3.5 px-4 sticky top-20 bg-white z-40 shadow-sm">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3 text-sm overflow-x-auto pb-1 sm:pb-0 hide-scrollbar">
              <button 
                onClick={() => setActiveFilter(activeFilter === 'price' ? null : 'price')}
                className={`border rounded-full px-4 py-2 hover:border-gray-950 transition-all text-xs font-semibold cursor-pointer whitespace-nowrap ${
                  activeFilter === 'price' ? 'border-gray-950 bg-gray-50 shadow-sm' : 'border-gray-200 text-gray-700'
                }`}
              >
                Price
              </button>
              <button 
                onClick={() => setActiveFilter(activeFilter === 'type' ? null : 'type')}
                className={`border rounded-full px-4 py-2 hover:border-gray-950 transition-all text-xs font-semibold cursor-pointer whitespace-nowrap ${
                  activeFilter === 'type' ? 'border-gray-950 bg-gray-50 shadow-sm' : 'border-gray-200 text-gray-700'
                }`}
              >
                Type of place
              </button>
              <button 
                onClick={() => setActiveFilter(activeFilter === 'rooms' ? null : 'rooms')}
                className={`border rounded-full px-4 py-2 hover:border-gray-950 transition-all text-xs font-semibold cursor-pointer whitespace-nowrap ${
                  activeFilter === 'rooms' ? 'border-gray-950 bg-gray-50 shadow-sm' : 'border-gray-200 text-gray-700'
                }`}
              >
                Rooms and beds
              </button>
              <button 
                onClick={() => setActiveFilter(activeFilter === 'superhost' ? null : 'superhost')}
                className={`border rounded-full px-4 py-2 hover:border-gray-950 transition-all text-xs font-semibold cursor-pointer whitespace-nowrap ${
                  activeFilter === 'superhost' ? 'border-gray-950 bg-gray-50 shadow-sm' : 'border-gray-200 text-gray-700'
                }`}
              >
                Superhost
              </button>
              <div className="w-px h-6 bg-gray-200 hidden sm:block"></div>
              <button className="border border-gray-200 rounded-full px-4 py-2 hover:border-gray-950 transition-all text-xs font-semibold flex items-center gap-2 cursor-pointer whitespace-nowrap">
                <SlidersHorizontal size={12} />
                <span>Filters</span>
              </button>
            </div>
            
            <div className="hidden md:block text-xs text-gray-500 font-medium">
              {listings.length === 0 ? 'No stays found' : `Over ${listings.length * 20} stays ${locationId === 'search' ? 'found' : `in ${location.name}`}`}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* List View - Left Column */}
            <div className="lg:col-span-7 xl:col-span-8">
              <div className="mb-6">
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1.5">
                  {locationId === 'search' ? 'Search Results' : `Stays in ${location.name}`}
                </p>
                <h1 className="text-2xl md:text-3xl font-montserrat font-extrabold text-gray-950 tracking-tight">
                  {locationId === 'search' ? (searchQuery ? `Results for "${searchQuery}"` : 'All Stays') : `Stays in ${location.name}`}
                </h1>
              </div>

              <div className="divide-y divide-gray-100">
                {listings.map((listing) => {
                  const isFav = !!favorites[listing.id];
                  const isHovered = hoveredListingId === listing.id;
                  
                  return (
                    <div 
                      key={listing.id} 
                      onMouseEnter={() => setHoveredListingId(listing.id)}
                      onMouseLeave={() => setHoveredListingId(null)}
                      className={`flex flex-col sm:flex-row gap-6 py-6 transition-all rounded-2xl ${
                        isHovered ? 'bg-gray-50/70 px-4 -mx-4' : ''
                      }`}
                    >
                      {/* Image Left */}
                      <div className="relative w-full sm:w-64 md:w-72 h-48 md:h-52 flex-shrink-0 overflow-hidden rounded-2xl bg-gray-100 shadow-sm">
                        <Link to={`/locations/${location.id}/listing/${listing.id}`}>
                          <img 
                            src={listing.images[0]} 
                            alt={listing.title} 
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                          />
                        </Link>
                        
                        {/* Superhost Tag */}
                        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-lg text-[9px] font-bold text-gray-900 shadow-sm uppercase tracking-wide">
                          Superhost
                        </div>

                        {/* Saved Heart Button */}
                        <button 
                          onClick={(e) => toggleFavorite(e, listing.id)}
                          className="absolute top-3 right-3 p-1.5 rounded-full hover:scale-110 active:scale-95 transition-all"
                        >
                          <Heart 
                            size={22} 
                            className={`drop-shadow ${
                              isFav ? 'fill-[#FF385C] stroke-[#FF385C]' : 'fill-black/25 stroke-white stroke-2'
                            }`} 
                          />
                        </button>
                      </div>
                      
                      {/* Details Right */}
                      <div className="flex flex-col flex-grow justify-between py-1">
                        <div>
                          <div className="flex justify-between items-start mb-1.5">
                            <p className="text-xs text-gray-400 font-medium">
                              {listing.type} · {location.name}
                            </p>
                            <div className="flex items-center gap-1.5 font-semibold text-sm text-gray-950">
                              <Star size={14} className="fill-[#FF385C] text-[#FF385C]" />
                              <span>{listing.rating.toFixed(2)}</span>
                              <span className="text-gray-400 font-normal">({listing.reviews})</span>
                            </div>
                          </div>

                          <Link to={`/locations/${location.id}/listing/${listing.id}`}>
                            <h3 className="text-lg font-bold text-gray-950 group-hover:text-[#FF385C] transition-colors leading-snug line-clamp-1">
                              {listing.title}
                            </h3>
                          </Link>
                          
                          <p className="text-xs text-gray-500 mt-2.5">
                            {listing.guests} guests · {listing.bedrooms} bedrooms · {listing.bedrooms} beds · {listing.bathrooms} bathrooms
                          </p>
                          
                          <p className="text-xs text-gray-400 mt-1.5 line-clamp-1">
                            {listing.amenities.slice(0, 4).join(' · ')}
                          </p>
                        </div>
                        
                        <div className="flex justify-between items-end mt-4 pt-4 border-t border-gray-50">
                          <div className="text-xs text-gray-400 font-medium flex items-center gap-1.5">
                            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                            Free cancellation
                          </div>
                          
                          <div className="text-right">
                            <div className="font-bold text-lg text-gray-950">
                              {formatPrice(listing.price)} <span className="font-normal text-xs text-gray-500">/ night</span>
                            </div>
                            <div className="text-xs text-gray-400 underline mt-0.5">
                              {formatPrice(listing.price * 6)} total before taxes
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Interactive Vector Map - Right Column */}
            <div className="hidden lg:block lg:col-span-5 xl:col-span-4 h-[calc(100vh-180px)] sticky top-36 rounded-2xl overflow-hidden border border-gray-200 bg-blue-50/30 relative">
              
              {/* Custom Vector Styled Map SVG Backdrop */}
              <div className="absolute inset-0 z-0">
                <svg className="w-full h-full opacity-90" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Parks / Green Spaces */}
                  <rect x="0" y="0" width="500" height="500" fill="#E8F5E9" />
                  {/* Water Body */}
                  <path d="M-50,200 C150,150 250,350 550,250 L550,550 L-50,550 Z" fill="#BBDEFB" />
                  
                  {/* Secondary forest */}
                  <path d="M50,50 Q120,40 100,150 T20,250 Z" fill="#C8E6C9" />
                  <path d="M350,20 Q420,10 400,100 T320,180 Z" fill="#C8E6C9" />

                  {/* Sand/Beach line */}
                  <path d="M-50,200 C150,150 250,350 550,250" stroke="#FFE082" strokeWidth="12" fill="none" />

                  {/* Roads network */}
                  <path d="M100,-50 L100,550" stroke="#FFFFFF" strokeWidth="8" />
                  <path d="M100,-50 L100,550" stroke="#F5F5F5" strokeWidth="4" />

                  <path d="M300,-50 L300,550" stroke="#FFFFFF" strokeWidth="8" />
                  <path d="M300,-50 L300,550" stroke="#F5F5F5" strokeWidth="4" />

                  <path d="M-50,120 L550,120" stroke="#FFFFFF" strokeWidth="8" />
                  <path d="M-50,120 L550,120" stroke="#F5F5F5" strokeWidth="4" />

                  <path d="M-50,380 L550,380" stroke="#FFFFFF" strokeWidth="8" />
                  <path d="M-50,380 L550,380" stroke="#F5F5F5" strokeWidth="4" />

                  <path d="M100,120 C200,180 250,80 300,120" stroke="#FFFFFF" strokeWidth="6" fill="none" />
                  <path d="M100,120 C200,180 250,80 300,120" stroke="#F5F5F5" strokeWidth="2" fill="none" />

                  <path d="M100,380 C180,320 220,440 300,380" stroke="#FFFFFF" strokeWidth="6" fill="none" />
                  <path d="M100,380 C180,320 220,440 300,380" stroke="#F5F5F5" strokeWidth="2" fill="none" />
                </svg>
              </div>

              {/* Interactive Price Markers floating on the map */}
              <div className="absolute inset-0 z-10 p-4">
                {listings.map((listing, index) => {
                  // Generate spread-out mock coordinates
                  const coordinates = [
                    { x: '25%', y: '25%' },
                    { x: '65%', y: '15%' },
                    { x: '45%', y: '50%' },
                    { x: '75%', y: '60%' },
                    { x: '20%', y: '75%' },
                    { x: '55%', y: '82%' },
                  ];
                  const pos = coordinates[index % coordinates.length];
                  const isHovered = hoveredListingId === listing.id;
                  const isSelected = selectedMapListing?.id === listing.id;

                  return (
                    <button
                      key={listing.id}
                      onMouseEnter={() => setHoveredListingId(listing.id)}
                      onMouseLeave={() => setHoveredListingId(null)}
                      onClick={() => setSelectedMapListing(listing)}
                      style={{ left: pos.x, top: pos.y }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 px-2.5 py-1.5 rounded-full font-bold text-xs shadow-md transition-all scale-100 cursor-pointer border ${
                        isSelected || isHovered
                          ? 'bg-gray-950 text-white border-gray-950 scale-110 z-30'
                          : 'bg-white text-gray-950 border-gray-200 hover:scale-105 z-20'
                      }`}
                    >
                      {formatPrice(listing.price)}
                    </button>
                  );
                })}
              </div>

              {/* Map Instruction Help label */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm p-3 rounded-xl border border-gray-100 shadow-lg text-center z-10 text-xs font-semibold text-gray-600 flex items-center justify-center gap-2">
                <MapPin size={14} className="text-[#FF385C]" />
                <span>Click a price tag to inspect properties interactively</span>
              </div>

              {/* Selected Map Listing Details Float Card overlay */}
              {selectedMapListing && (
                <div className="absolute bottom-16 left-4 right-4 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 z-20 animate-in slide-in-from-bottom duration-300">
                  <button 
                    onClick={() => setSelectedMapListing(null)}
                    className="absolute top-2.5 right-2.5 p-1 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors"
                  >
                    <X size={14} />
                  </button>
                  
                  <div className="flex gap-4">
                    <img 
                      src={selectedMapListing.images[0]} 
                      alt={selectedMapListing.title} 
                      className="w-24 h-24 object-cover rounded-xl bg-gray-100"
                    />
                    <div className="flex-grow min-w-0 pr-4">
                      <span className="text-[10px] font-bold text-[#FF385C] uppercase tracking-wider">{selectedMapListing.type}</span>
                      <h4 className="font-bold text-sm text-gray-950 truncate mt-0.5">{selectedMapListing.title}</h4>
                      
                      <div className="flex items-center gap-1 text-xs text-gray-950 mt-1 font-semibold">
                        <Star size={12} className="fill-[#FF385C] text-[#FF385C]" />
                        <span>{selectedMapListing.rating.toFixed(2)}</span>
                        <span className="text-gray-400 font-normal">({selectedMapListing.reviews} reviews)</span>
                      </div>
                      
                      <div className="flex justify-between items-baseline mt-2 pt-2 border-t border-gray-50">
                        <p className="text-sm font-bold text-gray-950">{formatPrice(selectedMapListing.price)} <span className="text-xs text-gray-500 font-normal">night</span></p>
                        <Link 
                          to={`/locations/${location.id}/listing/${selectedMapListing.id}`}
                          className="text-xs text-[#FF385C] font-semibold underline hover:text-[#D70466]"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
