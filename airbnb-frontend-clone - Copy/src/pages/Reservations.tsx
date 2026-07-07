import { format } from 'date-fns';
import { useState, useEffect } from 'react';
import { Calendar, Users, DollarSign, Compass, ArrowRight, Home as HomeIcon, CheckCircle2 } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';

export default function Reservations() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, token, user } = useAuth();
  const { formatPrice } = useCurrency();
  
  const [myTrips, setMyTrips] = useState<any[]>([]);
  const [hostedStays, setHostedStays] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccessMessage, setShowSuccessMessage] = useState(searchParams.get('success') === 'true');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchReservations = async () => {
      try {
        const userRes = await fetch('/api/reservations/user', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (userRes.ok) {
          const userData = await userRes.json();
          setMyTrips(userData);
        }

        if (user?.role === 'host' || user?.role === 'admin') {
          const hostRes = await fetch('/api/reservations/host', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (hostRes.ok) {
            const hostData = await hostRes.json();
            setHostedStays(hostData);
          }
        }
      } catch (err) {
        console.error("Error fetching reservations:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReservations();
    
    if (showSuccessMessage) {
      const timer = setTimeout(() => setShowSuccessMessage(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, token, user, navigate, showSuccessMessage]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-[#FF385C] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-semibold animate-pulse">Loading your reservations...</p>
      </div>
    );
  }

  const renderReservationCard = (res: any, isHostView: boolean = false) => {
    const primaryImg = res.listingId?.images?.[0] || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80";
    
    return (
      <div 
        key={res.id || res._id}
        className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row"
      >
        <div className="w-full sm:w-44 md:w-52 h-44 sm:h-auto relative shrink-0 bg-gray-100">
          <img 
            src={primaryImg} 
            alt={res.listingId?.title || 'Listing Image'} 
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-lg text-[9px] font-bold text-gray-950 shadow-sm uppercase tracking-wider">
            {res.listingId?.type || 'Stay'}
          </div>
        </div>
        <div className="p-6 flex-grow flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start gap-4 mb-2">
              <h3 className="font-bold text-gray-950 text-base leading-snug line-clamp-1">
                {res.listingId?.title || 'Unknown Property'}
              </h3>
              <span className="text-emerald-700 text-[10px] font-bold uppercase tracking-wider shrink-0">
                {res.status || 'Upcoming'}
              </span>
            </div>
            
            <p className="text-xs text-gray-500 mb-4 font-semibold flex items-center gap-1">
              <Compass size={12} />
              <span>{isHostView ? `Guest: ${res.userId}` : `Hosted by ${res.listingId?.host || 'Superhost'}`}</span>
            </p>
            <div className="space-y-2.5 text-xs text-gray-600 font-medium border-t border-gray-50 pt-3">
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-gray-400" />
                <span>{format(new Date(res.checkIn), 'EEE, MMM d')} - {format(new Date(res.checkOut), 'EEE, MMM d, yyyy')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users size={14} className="text-gray-400" />
                <span>{res.guests} guest{res.guests > 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-baseline mt-6 pt-3 border-t border-gray-50">
            <span className="text-xs text-gray-400">{isHostView ? 'Earned:' : 'Total Paid:'}</span>
            <span className="font-bold text-lg text-gray-950">
              {formatPrice(res.totalCost)}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        
        {showSuccessMessage && (
          <div className="mb-8 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
            <CheckCircle2 size={24} className="text-emerald-500 shrink-0" />
            <div>
              <p className="font-bold text-sm">Reservation confirmed!</p>
              <p className="text-xs font-medium text-emerald-600">Your stay has been booked successfully. You can manage it here.</p>
            </div>
          </div>
        )}

        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-montserrat font-extrabold text-gray-950 tracking-tight mb-2">
            My Trips
          </h1>
          <p className="text-sm text-gray-500 font-medium">
            Manage your booked stays, check-in instructions, and upcoming host details.
          </p>
        </div>

        {myTrips.length === 0 ? (
          <div className="border border-gray-100 rounded-3xl bg-gray-50 p-16 text-center max-w-xl mx-auto shadow-sm mb-16">
            <div className="w-14 h-14 bg-rose-50 text-[#FF385C] rounded-full flex items-center justify-center mx-auto mb-5">
              <Compass size={28} />
            </div>
            <h2 className="text-xl font-bold text-gray-950 mb-2">No trips booked... yet!</h2>
            <p className="text-gray-500 text-sm max-w-sm mx-auto mb-6">
              Time to dust off your bags and start planning your next spectacular vacation stay.
            </p>
            <button 
              onClick={() => navigate('/')}
              className="bg-[#FF385C] hover:bg-[#E61E4F] text-white px-6 py-3.5 rounded-xl font-bold text-sm shadow-md flex items-center gap-2 mx-auto transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>Explore stays</span>
              <ArrowRight size={14} />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {myTrips.map(res => renderReservationCard(res, false))}
          </div>
        )}

        {(user?.role === 'host' || user?.role === 'admin') && (
          <div className="mt-16 pt-16 border-t border-gray-100">
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-montserrat font-extrabold text-gray-950 tracking-tight mb-2">
                Hosted Stays
              </h2>
              <p className="text-sm text-gray-500 font-medium">
                Upcoming guests checking into your properties.
              </p>
            </div>
            
            {hostedStays.length === 0 ? (
               <div className="bg-gray-50 border border-gray-100 rounded-2xl p-8 text-center max-w-md">
                 <p className="text-gray-500 text-sm font-medium">You don't have any upcoming reservations for your properties.</p>
               </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {hostedStays.map(res => renderReservationCard(res, true))}
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}
