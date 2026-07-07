import { BrowserRouter, Routes, Route } from 'react-router';
import { AuthProvider } from './context/AuthContext';
import { CurrencyProvider } from './context/CurrencyContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import LocationList from './pages/LocationList';
import LocationDetails from './pages/LocationDetails';
import Login from './pages/Login';
import Reservations from './pages/Reservations';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <AuthProvider>
      <CurrencyProvider>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col font-sans text-gray-900 bg-white">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/reservations" element={<Reservations />} />
              <Route path="/admin/*" element={<AdminDashboard />} />
              <Route path="/locations/:locationId" element={<LocationList />} />
              <Route path="/locations/:locationId/listing/:listingId" element={<LocationDetails />} />
            </Routes>
            <Footer />
          </div>
        </BrowserRouter>
      </CurrencyProvider>
    </AuthProvider>
  );
}
