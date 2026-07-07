import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useNavigate, useParams } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Trash2, Edit, Plus, Image as ImageIcon, MapPin, Building, DollarSign, Layout, ChevronRight, Sliders, Settings } from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'host')) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/50">
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-10">
          <div>
            <span className="text-xs font-bold text-[#FF385C] uppercase tracking-wider">Host Console</span>
            <h1 className="text-3xl font-montserrat font-extrabold text-gray-950 tracking-tight mt-1">
              Hosting Dashboard
            </h1>
            <p className="text-sm text-gray-500 mt-1">Manage stays, update listing pricing, and review properties.</p>
          </div>
          
          <Link 
            to="/admin/create" 
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#FF385C] via-[#E61E4F] to-[#D70466] text-white px-5 py-3 rounded-xl font-bold text-sm shadow-md hover:scale-105 active:scale-95 transition-all w-full sm:w-auto"
          >
            <Plus size={16} />
            <span>Create Listing</span>
          </Link>
        </div>

        <Routes>
          <Route path="/" element={<ListingsList />} />
          <Route path="/create" element={<ListingForm />} />
          <Route path="/edit/:id" element={<ListingForm />} />
        </Routes>
      </main>
    </div>
  );
}

function ListingsList() {
  const [listings, setListings] = useState<any[]>([]);
  const { token } = useAuth();

  const fetchListings = async () => {
    try {
      const res = await fetch('/api/listings');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setListings(data);
        } else {
          console.error('Fetched listings is not an array:', data);
          setListings([]);
        }
      } else {
        setListings([]);
      }
    } catch (err) {
      console.error('Error fetching listings:', err);
      setListings([]);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;
    
    await fetch(`/api/listings/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    fetchListings();
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase text-[10px] font-bold tracking-wider">
              <th className="p-4 sm:p-5 font-bold">Property</th>
              <th className="p-4 sm:p-5 font-bold">Location ID</th>
              <th className="p-4 sm:p-5 font-bold">Price / Night</th>
              <th className="p-4 sm:p-5 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {listings.map(listing => (
              <tr key={listing.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="p-4 sm:p-5">
                  <div className="flex items-center gap-4">
                    {listing.images && listing.images[0] ? (
                      <img src={listing.images[0]} alt={listing.title} className="w-14 h-14 object-cover rounded-xl bg-gray-50 border border-gray-100" />
                    ) : (
                      <div className="w-14 h-14 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                        <ImageIcon size={20} />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-bold text-gray-950 text-sm truncate max-w-xs sm:max-w-md">{listing.title}</p>
                      <p className="text-xs text-gray-400 mt-1 flex items-center gap-1.5 capitalize">
                        <Building size={12} />
                        <span>{listing.type} · {listing.bedrooms} bed{listing.bedrooms > 1 ? 's' : ''}</span>
                      </p>
                    </div>
                  </div>
                </td>
                <td className="p-4 sm:p-5">
                  <span className="inline-block bg-gray-100 text-gray-600 font-bold text-xs px-2.5 py-1 rounded-lg">
                    {listing.location === '1' ? 'Location 1' : `Location ${listing.location}`}
                  </span>
                </td>
                <td className="p-4 sm:p-5 font-bold text-gray-950 text-sm">
                  R{listing.price} <span className="text-xs text-gray-400 font-normal">night</span>
                </td>
                <td className="p-4 sm:p-5">
                  <div className="flex justify-end gap-3.5">
                    <Link 
                      to={`/admin/edit/${listing.id}`} 
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                      title="Edit listing details"
                    >
                      <Edit size={18} />
                    </Link>
                    <button 
                      onClick={() => handleDelete(listing.id)} 
                      className="p-2 text-gray-500 hover:text-[#FF385C] hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                      title="Delete listing"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {listings.length === 0 && (
              <tr>
                <td colSpan={4} className="p-12 text-center">
                  <p className="font-semibold text-gray-400">No properties managed yet.</p>
                  <Link to="/admin/create" className="text-xs font-bold text-[#FF385C] underline hover:text-[#D70466] mt-2 inline-block">
                    Add your first listing
                  </Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ListingForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    title: '', location: '1', description: '', type: 'Entire home',
    bedrooms: 1, bathrooms: 1, guests: 1, price: 100,
    weeklyDiscount: 0, cleaningFee: 50, serviceFee: 50, occupancyTaxes: 10,
    amenities: 'Wifi, Kitchen', images: 'https://images.unsplash.com/photo-1502672260266-1c1c2c409c2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  });

  useEffect(() => {
    if (isEdit) {
      fetch(`/api/listings`)
        .then(res => {
          if (!res.ok) {
            throw new Error(`Server returned status ${res.status}`);
          }
          return res.json();
        })
        .then(data => {
          if (Array.isArray(data)) {
            const listing = data.find((l: any) => l.id === id || l._id === id);
            if (listing) {
              setFormData({
                title: listing.title, location: listing.location || '1', description: listing.description, type: listing.type,
                bedrooms: listing.bedrooms, bathrooms: listing.bathrooms, guests: listing.guests, price: listing.price,
                weeklyDiscount: listing.weeklyDiscount, cleaningFee: listing.cleaningFee, serviceFee: listing.serviceFee, occupancyTaxes: listing.occupancyTaxes,
                amenities: listing.amenities ? listing.amenities.join(', ') : '',
                images: listing.images ? listing.images.join(', ') : ''
              });
            }
          }
        })
        .catch(err => console.error('Error loading listing details for edit:', err));
    }
  }, [id, isEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      amenities: formData.amenities.split(',').map(s => s.trim()),
      images: formData.images.split(',').map(s => s.trim())
    };

    const url = isEdit ? `/api/listings/${id}` : '/api/listings';
    const method = isEdit ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      navigate('/admin');
    } else {
      alert('Failed to save listing');
    }
  };

  const handleChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.type === 'number' ? Number(e.target.value) : e.target.value });

  return (
    <div className="bg-white border border-gray-100 p-8 rounded-2xl shadow-sm">
      <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-5">
        <Layout size={20} className="text-[#FF385C]" />
        <h2 className="text-xl font-bold text-gray-950">{isEdit ? 'Edit Property Stays' : 'Create New Stay Listing'}</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Title</label>
            <input required name="title" value={formData.title} onChange={handleChange} className="w-full border border-gray-200 focus:border-gray-950 px-4 py-3 text-sm font-semibold rounded-xl outline-none transition-colors" placeholder="Oceanfront Villa" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Location ID</label>
            <select name="location" value={formData.location} onChange={handleChange} className="w-full border border-gray-200 focus:border-gray-950 px-4 py-3 text-sm font-semibold rounded-xl outline-none transition-colors bg-white">
              <option value="1">Location 1</option>
              <option value="2">Location 2</option>
              <option value="3">Location 3</option>
              <option value="4">Location 4</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Type of place</label>
            <input required name="type" value={formData.type} onChange={handleChange} className="w-full border border-gray-200 focus:border-gray-950 px-4 py-3 text-sm font-semibold rounded-xl outline-none transition-colors" placeholder="Entire villa, private room, etc." />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Price per Night ($)</label>
            <input required type="number" name="price" value={formData.price} onChange={handleChange} className="w-full border border-gray-200 focus:border-gray-950 px-4 py-3 text-sm font-semibold rounded-xl outline-none transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Max Guests</label>
            <input required type="number" name="guests" value={formData.guests} onChange={handleChange} className="w-full border border-gray-200 focus:border-gray-950 px-4 py-3 text-sm font-semibold rounded-xl outline-none transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Bedrooms</label>
            <input required type="number" name="bedrooms" value={formData.bedrooms} onChange={handleChange} className="w-full border border-gray-200 focus:border-gray-950 px-4 py-3 text-sm font-semibold rounded-xl outline-none transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Bathrooms</label>
            <input required type="number" name="bathrooms" value={formData.bathrooms} onChange={handleChange} className="w-full border border-gray-200 focus:border-gray-950 px-4 py-3 text-sm font-semibold rounded-xl outline-none transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Weekly Discount ($)</label>
            <input required type="number" name="weeklyDiscount" value={formData.weeklyDiscount} onChange={handleChange} className="w-full border border-gray-200 focus:border-gray-950 px-4 py-3 text-sm font-semibold rounded-xl outline-none transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Cleaning Fee ($)</label>
            <input required type="number" name="cleaningFee" value={formData.cleaningFee} onChange={handleChange} className="w-full border border-gray-200 focus:border-gray-950 px-4 py-3 text-sm font-semibold rounded-xl outline-none transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Zaiobnb Service Fee ($)</label>
            <input required type="number" name="serviceFee" value={formData.serviceFee} onChange={handleChange} className="w-full border border-gray-200 focus:border-gray-950 px-4 py-3 text-sm font-semibold rounded-xl outline-none transition-colors" />
          </div>
          <div className="col-span-1 md:col-span-2">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Occupancy Taxes ($)</label>
            <input required type="number" name="occupancyTaxes" value={formData.occupancyTaxes} onChange={handleChange} className="w-full border border-gray-200 focus:border-gray-950 px-4 py-3 text-sm font-semibold rounded-xl outline-none transition-colors" />
          </div>
          <div className="col-span-1 md:col-span-2">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Amenities (comma separated list)</label>
            <input required name="amenities" value={formData.amenities} onChange={handleChange} className="w-full border border-gray-200 focus:border-gray-950 px-4 py-3 text-sm font-semibold rounded-xl outline-none transition-colors" placeholder="Wifi, Pool, Kitchen, Hot tub, Air conditioning" />
          </div>
          <div className="col-span-1 md:col-span-2">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Image URLs (comma separated list)</label>
            <input required name="images" value={formData.images} onChange={handleChange} className="w-full border border-gray-200 focus:border-gray-950 px-4 py-3 text-sm font-semibold rounded-xl outline-none transition-colors" placeholder="https://image1.jpg, https://image2.jpg" />
          </div>
          <div className="col-span-1 md:col-span-2">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Description</label>
            <textarea required name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full border border-gray-200 focus:border-gray-950 px-4 py-3 text-sm font-semibold rounded-xl outline-none transition-colors resize-none" placeholder="Write an engaging and detailed listing description about your space..." />
          </div>
        </div>
        
        <div className="flex justify-end gap-3.5 border-t border-gray-100 pt-5">
          <button 
            type="button" 
            onClick={() => navigate('/admin')} 
            className="px-5 py-3 border border-gray-200 hover:bg-gray-50 rounded-xl font-bold text-xs text-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="bg-gradient-to-r from-[#FF385C] via-[#E61E4F] to-[#D70466] hover:brightness-110 text-white px-6 py-3 rounded-xl font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
          >
            Save Listing
          </button>
        </div>
      </form>
    </div>
  );
}
