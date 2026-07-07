import { Link, useNavigate } from 'react-router';
import { Search, Globe, Menu, User, LogOut, LayoutDashboard, ClipboardList } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-50 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <span className="font-montserrat font-extrabold text-2xl tracking-tighter text-[#FF385C]">
            zaiobnb
          </span>
        </Link>

        {/* Central Search Pill */}
        <div 
          onClick={() => navigate('/locations/1')}
          className="flex items-center border border-gray-200 rounded-full py-1.5 pl-5 pr-1.5 shadow-sm hover:shadow-md transition-all cursor-pointer bg-white"
        >
          <span className="text-sm font-semibold text-gray-900 px-3 border-r border-gray-200">Anywhere</span>
          <span className="text-sm font-semibold text-gray-900 px-3 border-r border-gray-200 hidden sm:inline">Any week</span>
          <span className="text-sm font-medium text-gray-500 px-3 hidden md:inline">Add guests</span>
          <div className="bg-[#FF385C] text-white p-2 rounded-full hover:bg-[#E61E4F] transition-colors ml-1">
            <Search size={14} className="stroke-[3]" />
          </div>
        </div>

        {/* User Menu / Controls */}
        <div className="flex items-center gap-3 relative" ref={dropdownRef}>
          <button 
            onClick={() => navigate('/locations/1')}
            className="hidden lg:block text-sm font-semibold hover:bg-gray-50 px-4 py-2.5 rounded-full transition-colors text-gray-800"
          >
            Airbnb your home
          </button>
          
          <button className="hover:bg-gray-50 p-2.5 rounded-full text-gray-700 hidden sm:block transition-colors">
            <Globe size={18} />
          </button>
          
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-3 border border-gray-200 rounded-full p-2 pl-3 hover:shadow-md transition-all bg-white"
          >
            <Menu size={16} className="text-gray-600" />
            <div className="w-8 h-8 rounded-full bg-gray-500 text-white flex items-center justify-center font-bold text-xs overflow-hidden relative shadow-inner">
              {user ? (
                <div className="w-full h-full bg-[#FF385C] flex items-center justify-center text-white uppercase font-bold text-sm">
                  {user.username.charAt(0)}
                </div>
              ) : (
                <div className="w-full h-full bg-gray-500 flex items-center justify-center text-white">
                  <User size={16} />
                </div>
              )}
            </div>
          </button>
          
          {menuOpen && (
            <div className="absolute top-12 right-0 w-64 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 flex flex-col z-50 text-left overflow-hidden">
              {user ? (
                <>
                  <div className="px-4 py-2.5 border-b border-gray-100 bg-gray-50/50">
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Signed in as</p>
                    <p className="font-semibold text-sm text-gray-800 truncate">{user.username}</p>
                  </div>
                  
                  <Link 
                    to="/reservations" 
                    onClick={() => setMenuOpen(false)} 
                    className="px-4 py-3 hover:bg-gray-50 font-medium text-sm text-gray-700 flex items-center gap-3 transition-colors"
                  >
                    <ClipboardList size={18} className="text-gray-400" />
                    Trips / Reservations
                  </Link>

                  {(user.role === 'admin' || user.role === 'host') && (
                    <Link 
                      to="/admin" 
                      onClick={() => setMenuOpen(false)} 
                      className="px-4 py-3 hover:bg-gray-50 font-medium text-sm text-gray-700 flex items-center gap-3 border-b border-gray-100 transition-colors"
                    >
                      <LayoutDashboard size={18} className="text-gray-400" />
                      Admin Dashboard
                    </Link>
                  )}
                  
                  <button 
                    onClick={() => { logout(); setMenuOpen(false); }} 
                    className="px-4 py-3 hover:bg-gray-50 font-medium text-sm text-red-600 flex items-center gap-3 text-left w-full transition-colors"
                  >
                    <LogOut size={18} className="text-red-400" />
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    onClick={() => setMenuOpen(false)} 
                    className="px-4 py-3 hover:bg-gray-50 font-semibold text-sm text-gray-800 transition-colors"
                  >
                    Log in
                  </Link>
                  <Link 
                    to="/login" 
                    onClick={() => setMenuOpen(false)} 
                    className="px-4 py-3 hover:bg-gray-50 font-medium text-sm text-gray-600 border-b border-gray-100 transition-colors"
                  >
                    Sign up
                  </Link>
                  <button 
                    onClick={() => { navigate('/locations/1'); setMenuOpen(false); }}
                    className="px-4 py-3 hover:bg-gray-50 font-medium text-sm text-gray-600 text-left transition-colors"
                  >
                    Airbnb your home
                  </button>
                  <button 
                    onClick={() => setMenuOpen(false)} 
                    className="px-4 py-3 hover:bg-gray-50 font-medium text-sm text-gray-600 text-left transition-colors"
                  >
                    Help Center
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
