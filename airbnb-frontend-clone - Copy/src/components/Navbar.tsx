import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { Search, Globe, Menu, User, LogOut, LayoutDashboard, ClipboardList } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [showHostForm, setShowHostForm] = useState(false);
  const [hostFormSubmitted, setHostFormSubmitted] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/locations/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchExpanded(false);
    }
  };

  const handleHostFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHostFormSubmitted(true);
    setTimeout(() => {
      setShowHostForm(false);
      setHostFormSubmitted(false);
    }, 2000);
  };

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
        {isSearchExpanded ? (
          <form 
            onSubmit={handleSearchSubmit}
            className="flex items-center border-2 border-[#FF385C] rounded-full py-1.5 pl-5 pr-1.5 shadow-md bg-white w-full max-w-md mx-4 transition-all"
          >
            <input 
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onBlur={() => {
                if (!searchQuery) setIsSearchExpanded(false);
              }}
              placeholder="Search destinations, property types..."
              className="flex-grow outline-none text-sm font-medium text-gray-900 bg-transparent px-2"
            />
            <button type="submit" className="bg-[#FF385C] text-white p-2 rounded-full hover:bg-[#E61E4F] transition-colors ml-1 cursor-pointer">
              <Search size={14} className="stroke-[3]" />
            </button>
          </form>
        ) : (
          <div 
            onClick={() => setIsSearchExpanded(true)}
            className="flex items-center border border-gray-200 rounded-full py-1.5 pl-5 pr-1.5 shadow-sm hover:shadow-md transition-all cursor-pointer bg-white"
          >
            <span className="text-sm font-semibold text-gray-900 px-3 border-r border-gray-200">Anywhere</span>
            <span className="text-sm font-semibold text-gray-900 px-3 border-r border-gray-200 hidden sm:inline">Any week</span>
            <span className="text-sm font-medium text-gray-500 px-3 hidden md:inline">Add guests</span>
            <div className="bg-[#FF385C] text-white p-2 rounded-full hover:bg-[#E61E4F] transition-colors ml-1">
              <Search size={14} className="stroke-[3]" />
            </div>
          </div>
        )}

        {/* User Menu / Controls */}
        <div className="flex items-center gap-3 relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowHostForm(true)}
            className="hidden lg:block text-sm font-semibold hover:bg-gray-50 px-4 py-2.5 rounded-full transition-colors text-gray-800 cursor-pointer"
          >
            Zaiobnb your home
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
                    onClick={() => { setShowHostForm(true); setMenuOpen(false); }}
                    className="px-4 py-3 hover:bg-gray-50 font-medium text-sm text-gray-600 text-left transition-colors cursor-pointer"
                  >
                    Zaiobnb your home
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

      {/* Host Form Modal */}
      {showHostForm && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative">
            <button 
              onClick={() => setShowHostForm(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
            <div className="p-6">
              <h2 className="text-2xl font-bold font-montserrat text-gray-900 mb-2">Zaiobnb your home</h2>
              <p className="text-gray-500 text-sm mb-6">Become a host and earn extra income.</p>
              
              {hostFormSubmitted ? (
                <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl p-4 text-center font-medium">
                  Application submitted successfully! We'll be in touch soon.
                </div>
              ) : (
                <form onSubmit={handleHostFormSubmit} className="flex flex-col gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                    <select required className="w-full border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900">
                      <option value="">Select a type</option>
                      <option value="apartment">Apartment</option>
                      <option value="house">House</option>
                      <option value="villa">Villa</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input required type="text" placeholder="City or region" className="w-full border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900" />
                  </div>
                  <button type="submit" className="w-full bg-[#FF385C] hover:bg-[#E61E4F] text-white font-bold py-3 mt-2 rounded-xl text-sm transition-all shadow-md active:scale-95 cursor-pointer">
                    Submit Application
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
