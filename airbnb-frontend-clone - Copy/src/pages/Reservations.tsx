import { format } from 'date-fns';
import { useState, useEffect } from 'react';
import { Calendar, Users, DollarSign, Compass, ArrowRight, Home as HomeIcon } from 'lucide-react';
import { useNavigate } from 'react-router';

export default function Reservations() {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/listings')
      .then(res => {
        if (!res.ok) {
          throw new Error(`Server returned status ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setReservations([
            {
              id: 'res_1',
              listing: data[0],
              checkIn: new Date(2026, 7, 12),
              checkOut: new Date(2026, 7, 18),
              guests: 4,
              totalCost: 2850,
              status: 'Upcoming'
            },
            {
              id: 'res_2',
              listing: data[1] || data[0],
              checkIn: new Date(2026, 8, 5),
              checkOut: new Date(2026, 8, 8),
              guests: 2,
              totalCost: 780,
              status: 'Upcoming'
            }
          ]);
        } else {
          setReservations([]);
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setReservations([]);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-[#FF385C] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-semibold animate-pulse">Loading your reservations...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-montserrat font-extrabold text-gray-950 tracking-tight mb-2">
            Trips
          </h1>
          <p className="text-sm text-gray-500 font-medium">
            Manage your booked stays, check-in instructions, and upcoming host details.
          </p>
        </div>

        {reservations.length === 0 ? (
          /* Empty State */
          <div className="border border-gray-100 rounded-3xl bg-gray-50 p-16 text-center max-w-xl mx-auto shadow-sm">
            <div className="w-14 h-14 bg-rose-50 text-[#FF385C] rounded-full flex items-center justify-center mx-auto mb-5">
              <Compass size={28} />
            </div>
            <h2 className="text-xl font-bold text-gray-950 mb-2">No trips booked... yet!</h2>
            <p className="text-gray-500 text-sm max-w-sm mx-auto mb-6">
              Time to dust off your bags and start planning your next spectacular vacation stay.
            </p>
            <button 
              onClick={() => navigate('/')}
              className="bg-[#FF385C] hover:bg-[#D70466] text-white px-6 py-3.5 rounded-xl font-bold text-sm shadow-md flex items-center gap-2 mx-auto transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>Explore stays</span>
              <ArrowRight size={14} />
            </button>
          </div>
        ) : (
          /* Rich Trip Card Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {reservations.map((res) => {
              const primaryImg = res.listing?.images?.[0] || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80";
              
              return (
                <div 
                  key={res.id}
                  className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row"
                >
                  {/* Photo Section */}
                  <div className="w-full sm:w-44 md:w-52 h-44 sm:h-auto relative shrink-0 bg-gray-100">
                    <img 
                      src={primaryImg} 
                      alt={res.listing?.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-lg text-[9px] font-bold text-gray-950 shadow-sm uppercase tracking-wider">
                      {res.listing?.type || 'Stay'}
                    </div>
                  </div>

                  {/* Booking Info Details */}
                  <div className="p-6 flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-4 mb-2">
                        <h3 className="font-bold text-gray-950 text-base leading-snug line-clamp-1">
                          {res.listing?.title}
                        </h3>
                        <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0">
                          {res.status}
                        </span>
                      </div>
                      
                      <p className="text-xs text-gray-500 mb-4 font-semibold flex items-center gap-1">
                        <Compass size={12} />
                        <span>Hosted by {res.listing?.host || 'Superhost'}</span>
                      </p>

                      <div className="space-y-2.5 text-xs text-gray-600 font-medium border-t border-gray-50 pt-3">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-gray-400" />
                          <span>{format(res.checkIn, 'EEE, MMM d')} - {format(res.checkOut, 'EEE, MMM d, yyyy')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users size={14} className="text-gray-400" />
                          <span>{res.guests} guest{res.guests > 1 ? 's' : ''}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-baseline mt-6 pt-3 border-t border-gray-50">
                      <span className="text-xs text-gray-400">Total Paid:</span>
                      <span className="font-bold text-lg text-gray-950">
                        R{res.totalCost}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
