import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Star, Share, Heart, Award, Key, Calendar, Shield, Coffee, Wifi, Car, Home as HomeIcon, Tv, Waves, MapPin, Check, Info, ChevronLeft } from 'lucide-react';
import { MOCK_LOCATIONS } from '../data';
import { format, addDays, differenceInDays } from 'date-fns';

// Helper to map amenity names to Lucide icons dynamically
const getAmenityIcon = (name: string) => {
  const norm = name.toLowerCase();
  if (norm.includes('wifi')) return <Wifi size={18} className="text-gray-700" />;
  if (norm.includes('pool')) return <Waves size={18} className="text-gray-700" />;
  if (norm.includes('kitchen')) return <Coffee size={18} className="text-gray-700" />;
  if (norm.includes('parking') || norm.includes('car')) return <Car size={18} className="text-gray-700" />;
  if (norm.includes('ocean') || norm.includes('view')) return <Waves size={18} className="text-gray-700" />;
  if (norm.includes('tv')) return <Tv size={18} className="text-gray-700" />;
  return <Star size={18} className="text-gray-700" />;
};

export default function LocationDetails() {
  const { listingId, locationId } = useParams();
  const navigate = useNavigate();
  
  const [listing, setListing] = useState<any>(null);
  const location = MOCK_LOCATIONS.find(l => l.id === locationId) || MOCK_LOCATIONS[0];
  const [isSaved, setIsSaved] = useState(false);

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
          const found = data.find((l: any) => l.id === listingId || l._id === listingId);
          setListing(found || data[0] || null);
        } else {
          console.error('Fetched listings is not an array:', data);
          setListing(null);
        }
      })
      .catch(err => {
        console.error(err);
        setListing(null);
      });
  }, [listingId]);

  // Calculator State
  const [checkIn, setCheckIn] = useState<Date>(new Date());
  const [checkOut, setCheckOut] = useState<Date>(addDays(new Date(), 5));
  const [guests, setGuests] = useState(2);
  const [isReserving, setIsReserving] = useState(false);
  const [reserved, setReserved] = useState(false);

  if (!listing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-[#FF385C] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-semibold animate-pulse">Loading listing details...</p>
      </div>
    );
  }

  // Calculations
  const totalNights = Math.max(1, differenceInDays(checkOut, checkIn));
  const baseCost = listing.price * totalNights;
  const weeklyDiscount = totalNights >= 7 ? listing.weeklyDiscount : 0;
  const cleaningFee = listing.cleaningFee || 50;
  const serviceFee = listing.serviceFee || 40;
  const taxes = listing.occupancyTaxes || 25;
  const totalCost = baseCost - weeklyDiscount + cleaningFee + serviceFee + taxes;

  const handleReservation = () => {
    setIsReserving(true);
    // Mock API call
    setTimeout(() => {
      console.log('Reservation saved to MongoDB', {
        listingId: listing.id,
        checkIn,
        checkOut,
        guests,
        totalCost
      });
      setIsReserving(false);
      setReserved(true);
    }, 1200);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Breadcrumb / Back button */}
        <button 
          onClick={() => navigate(`/locations/${location.id}`)}
          className="flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-[#FF385C] mb-4 transition-colors focus:outline-none"
        >
          <ChevronLeft size={16} />
          <span>Back to stays in {location.name}</span>
        </button>

        {/* Title and top metadata */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-montserrat font-bold text-gray-950 tracking-tight mb-2">
            {listing.title}
          </h1>
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-gray-900">
              <div className="flex items-center gap-1">
                <Star size={15} className="fill-[#FF385C] text-[#FF385C]" />
                <span>{listing.rating.toFixed(2)}</span>
              </div>
              <span className="text-gray-300">·</span>
              <span className="underline cursor-pointer hover:text-gray-600">{listing.reviews} reviews</span>
              <span className="text-gray-300">·</span>
              <span className="text-gray-500 font-medium flex items-center gap-1">
                <Award size={14} className="text-amber-500 fill-amber-500" />
                <span>Superhost</span>
              </span>
              <span className="text-gray-300">·</span>
              <span className="underline cursor-pointer hover:text-gray-600 flex items-center gap-1 text-gray-500 font-normal">
                <MapPin size={14} />
                <span>{location.name}</span>
              </span>
            </div>
            
            <div className="flex items-center gap-3 text-xs font-bold text-gray-700">
              <button className="flex items-center gap-2 border border-gray-200 hover:border-gray-950 bg-white hover:bg-gray-50 px-4 py-2 rounded-xl transition-all shadow-sm">
                <Share size={14} className="text-gray-600" />
                <span>Share</span>
              </button>
              <button 
                onClick={() => setIsSaved(!isSaved)}
                className="flex items-center gap-2 border border-gray-200 hover:border-gray-950 bg-white hover:bg-gray-50 px-4 py-2 rounded-xl transition-all shadow-sm"
              >
                <Heart size={14} className={isSaved ? 'fill-[#FF385C] stroke-[#FF385C]' : 'text-gray-600'} />
                <span>{isSaved ? 'Saved' : 'Save'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Standard Airbnb 5-Image Gallery Collage */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 rounded-2xl overflow-hidden mb-10 h-[45vh] min-h-[350px] shadow-sm relative group">
          <div className="w-full h-full relative overflow-hidden bg-gray-100">
            <img 
              src={listing.images[0]} 
              alt="Main view" 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02] cursor-pointer"
            />
          </div>
          <div className="hidden md:grid grid-cols-2 grid-rows-2 gap-2 h-full bg-white">
            {listing.images.slice(1, 5).map((img, idx) => (
              <div key={idx} className="relative overflow-hidden bg-gray-100 h-full w-full">
                <img 
                  src={img} 
                  alt={`View ${idx + 2}`} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.05] cursor-pointer"
                />
              </div>
            ))}
          </div>
          <button className="absolute bottom-5 right-5 bg-white border border-gray-300 rounded-xl px-4 py-2 text-xs font-bold text-gray-950 hover:bg-gray-50 shadow-md">
            Show all photos
          </button>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative">
          
          {/* Left Column: Property Details & Host Information */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Hosted By banner */}
            <div className="flex justify-between items-center border-b border-gray-200 pb-6">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-950 tracking-tight mb-1">
                  {listing.type} hosted by {listing.host}
                </h2>
                <p className="text-gray-500 text-sm font-medium">
                  {listing.guests} guests · {listing.bedrooms} bedrooms · {listing.bedrooms} beds · {listing.bathrooms} baths
                </p>
              </div>
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#FF385C] to-[#D70466] text-white font-extrabold text-xl flex items-center justify-center shadow-md relative border-2 border-white">
                {listing.host.charAt(0)}
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-amber-500 text-white rounded-full flex items-center justify-center border border-white">
                  <Star size={10} className="fill-current" />
                </div>
              </div>
            </div>

            {/* Core Highlight Features */}
            <div className="space-y-6 border-b border-gray-200 pb-6">
              <div className="flex gap-4 items-start">
                <Award size={24} className="text-[#FF385C] mt-1" />
                <div>
                  <h3 className="font-bold text-gray-950 text-sm">{listing.host} is a Superhost</h3>
                  <p className="text-gray-400 text-xs mt-0.5">Superhosts are experienced, highly rated hosts who are committed to providing great stays.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <Key size={24} className="text-gray-800 mt-1" />
                <div>
                  <h3 className="font-bold text-gray-950 text-sm">Great check-in experience</h3>
                  <p className="text-gray-400 text-xs mt-0.5">95% of recent guests gave the check-in process a 5-star rating.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <Calendar size={24} className="text-gray-800 mt-1" />
                <div>
                  <h3 className="font-bold text-gray-950 text-sm">Free cancellation for 48 hours</h3>
                  <p className="text-gray-400 text-xs mt-0.5">Cancel within 48 hours of booking to get a full refund if your plans change.</p>
                </div>
              </div>
            </div>

            {/* Description Text */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-lg font-bold text-gray-950 mb-4">About this space</h2>
              <p className="text-gray-600 text-sm font-medium leading-relaxed whitespace-pre-line">
                {listing.description || "Experience standard premium accommodation styled for total comfort. Located near local scenic outlooks with easy access to restaurants, paths, and attractions."}
              </p>
            </div>

            {/* Where you'll sleep - Bedroom list */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-lg font-bold text-gray-950 mb-4">Where you'll sleep</h2>
              <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
                {[...Array(listing.bedrooms || 2)].map((_, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-2xl p-5 min-w-[180px] bg-white shadow-sm hover:border-gray-400 transition-colors">
                    <HomeIcon size={24} className="text-gray-800 mb-3" />
                    <h3 className="font-bold text-gray-950 text-sm">Bedroom {idx + 1}</h3>
                    <p className="text-gray-500 text-xs mt-1">1 queen bed</p>
                  </div>
                ))}
              </div>
            </div>

            {/* What this place offers - Amenities with custom icons */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-lg font-bold text-gray-950 mb-4">What this place offers</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3.5 gap-x-4">
                {listing.amenities.map((amenity, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-gray-800 font-semibold text-sm">
                    <div className="w-9 h-9 border border-gray-200 bg-gray-50 rounded-xl flex items-center justify-center">
                      {getAmenityIcon(amenity)}
                    </div>
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews Slider Section */}
            <div className="border-b border-gray-200 pb-6">
              <div className="flex items-center gap-2 mb-6 text-xl font-bold text-gray-950">
                <Star size={20} className="fill-[#FF385C] text-[#FF385C]" />
                <h2>{listing.rating.toFixed(2)} · {listing.reviews} reviews</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-3">
                {listing.specificRatings ? (
                  Object.entries(listing.specificRatings).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center text-sm">
                      <span className="capitalize text-gray-600 font-medium">{key}</span>
                      <div className="flex items-center gap-4 w-1/2">
                        <div className="h-1.5 flex-grow bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-gray-800" style={{ width: `${(Number(value) / 5) * 100}%` }}></div>
                        </div>
                        <span className="font-bold text-gray-950 text-xs w-6 text-right">{Number(value).toFixed(1)}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  ['cleanliness', 'accuracy', 'communication', 'location', 'check-in', 'value'].map((key) => (
                    <div key={key} className="flex justify-between items-center text-sm">
                      <span className="capitalize text-gray-600 font-medium">{key}</span>
                      <div className="flex items-center gap-4 w-1/2">
                        <div className="h-1.5 flex-grow bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-gray-800" style={{ width: '96%' }}></div>
                        </div>
                        <span className="font-bold text-gray-950 text-xs w-6 text-right">4.8</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Host Verification Details */}
            <div className="pb-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-gray-900 text-white font-extrabold text-xl flex items-center justify-center">
                  {listing.host.charAt(0)}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-950">Hosted by {listing.host}</h2>
                  <p className="text-gray-400 text-xs">Joined May 2021</p>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-500 leading-relaxed mb-5">
                Hello, I'm {listing.host}! I absolutely love welcoming people to {location.name}. I'm committed to helping you enjoy a beautiful stay in our villa.
              </p>
              <button className="border border-gray-950 hover:bg-gray-50 px-5 py-3 rounded-xl font-bold text-xs text-gray-950 cursor-pointer">
                Contact Host
              </button>
            </div>

          </div>

          {/* Right Column: Sticky Reservation Cost Calculator Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-white border border-gray-200 rounded-2xl p-6 shadow-xl">
              
              {reserved ? (
                /* Confirmed Success State Screen */
                <div className="text-center py-4 animate-in fade-in zoom-in duration-300">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check size={28} className="stroke-[3]" />
                  </div>
                  <h3 className="font-montserrat font-bold text-xl text-gray-950 mb-2">Booking Confirmed!</h3>
                  <p className="text-gray-500 text-xs mb-6 px-2">
                    Congratulations! Your stay at <strong>{listing.title}</strong> has been secured successfully.
                  </p>
                  
                  <div className="bg-gray-50 rounded-xl p-4 text-left border border-gray-100 space-y-2.5 mb-6 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Dates:</span>
                      <span className="font-semibold text-gray-800">{format(checkIn, 'MMM d')} - {format(checkOut, 'MMM d, yyyy')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Guests:</span>
                      <span className="font-semibold text-gray-800">{guests} guests</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Paid:</span>
                      <span className="font-bold text-[#FF385C]">R{totalCost.toFixed(0)}</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => navigate('/reservations')}
                    className="w-full bg-gray-950 hover:bg-gray-900 text-white font-bold py-3.5 rounded-xl text-sm transition-all"
                  >
                    Go to Trips List
                  </button>
                </div>
              ) : (
                /* Form Reservation Calculator */
                <>
                  <div className="flex justify-between items-baseline mb-5">
                    <div>
                      <span className="text-2xl font-bold text-gray-950">R{listing.price}</span>
                      <span className="text-gray-400 text-xs font-semibold"> night</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-gray-950">
                      <Star size={13} className="fill-[#FF385C] text-[#FF385C]" />
                      <span>{listing.rating.toFixed(2)}</span>
                      <span className="text-gray-300">·</span>
                      <span className="text-gray-500 underline cursor-pointer">{listing.reviews} reviews</span>
                    </div>
                  </div>

                  {/* Date Boxes Container */}
                  <div className="border border-gray-300 rounded-xl mb-5 overflow-hidden">
                    <div className="grid grid-cols-2 divide-x divide-gray-300 border-b border-gray-300">
                      <div className="p-3 bg-white">
                        <label className="block text-[9px] font-bold uppercase text-gray-900">Check-in</label>
                        <input 
                          type="date" 
                          value={format(checkIn, 'yyyy-MM-dd')}
                          onChange={(e) => setCheckIn(new Date(e.target.value))}
                          className="w-full text-xs font-bold outline-none bg-transparent cursor-pointer mt-1 text-gray-800"
                        />
                      </div>
                      <div className="p-3 bg-white">
                        <label className="block text-[9px] font-bold uppercase text-gray-900">Checkout</label>
                        <input 
                          type="date" 
                          value={format(checkOut, 'yyyy-MM-dd')}
                          onChange={(e) => setCheckOut(new Date(e.target.value))}
                          min={format(checkIn, 'yyyy-MM-dd')}
                          className="w-full text-xs font-bold outline-none bg-transparent cursor-pointer mt-1 text-gray-800"
                        />
                      </div>
                    </div>
                    
                    <div className="p-3 bg-white">
                      <label className="block text-[9px] font-bold uppercase text-gray-900">Guests</label>
                      <select 
                        value={guests}
                        onChange={(e) => setGuests(Number(e.target.value))}
                        className="w-full text-xs font-bold outline-none bg-transparent cursor-pointer mt-1 text-gray-800"
                      >
                        {[...Array(listing.guests || 6)].map((_, i) => (
                          <option key={i+1} value={i+1}>{i+1} guest{i > 0 ? 's' : ''}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <button 
                    onClick={handleReservation}
                    disabled={isReserving}
                    className="w-full py-4 rounded-xl font-bold text-sm text-white transition-all bg-gradient-to-r from-[#FF385C] via-[#E61E4F] to-[#D70466] hover:brightness-110 shadow-md active:scale-95 duration-150 disabled:opacity-50"
                  >
                    {isReserving ? 'Confirming details...' : 'Reserve Stay'}
                  </button>
                  
                  <p className="text-center text-[11px] text-gray-400 mt-3.5 mb-5">You won't be charged yet</p>

                  {/* Pricing Subtotals row-by-row */}
                  <div className="space-y-3 mb-5 text-sm text-gray-600 font-medium">
                    <div className="flex justify-between">
                      <span className="underline cursor-help">R{listing.price} x {totalNights} nights</span>
                      <span className="font-bold text-gray-950">R{baseCost}</span>
                    </div>
                    
                    {weeklyDiscount > 0 && (
                      <div className="flex justify-between text-emerald-600">
                        <span className="underline cursor-help">Weekly stay discount</span>
                        <span className="font-bold">-R{weeklyDiscount.toFixed(0)}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between">
                      <span className="underline cursor-help">Cleaning fee</span>
                      <span className="font-bold text-gray-950">R{cleaningFee}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="underline cursor-help">Zaiobnb service fee</span>
                      <span className="font-bold text-gray-950">R{serviceFee}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="underline cursor-help">Occupancy taxes and fees</span>
                      <span className="font-bold text-gray-950">R{taxes}</span>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-5 flex justify-between font-bold text-lg text-gray-950">
                    <span>Total before taxes</span>
                    <span>R{totalCost.toFixed(0)}</span>
                  </div>

                  {/* Informational warning */}
                  <div className="mt-5 p-3.5 bg-gray-50 rounded-xl border border-gray-100 flex gap-2 text-[11px] text-gray-500">
                    <Info size={14} className="text-[#FF385C] shrink-0 mt-0.5" />
                    <span><strong>Free Cancellation:</strong> Book with confidence. Standard full refund available up to 48 hours prior to arrival.</span>
                  </div>
                </>
              )}

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
