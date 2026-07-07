import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, LogIn, Lock, User } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoginView, setIsLoginView] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const endpoint = isLoginView ? '/api/login' : '/api/signup';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role: 'host' })
      });

      const data = await response.json();

      if (response.ok) {
        login(data.token, data.user, data.isMongo);
        navigate('/admin');
      } else {
        setError(data.error || `Failed to ${isLoginView ? 'login' : 'sign up'}`);
      }
    } catch (err) {
      setError('Network error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/50 items-center justify-center p-4">
      <div className="bg-white border border-gray-200 w-full max-w-md p-8 sm:p-10 rounded-2xl shadow-xl transition-all">
        <div className="mb-8 text-center">
          <div className="w-12 h-12 bg-rose-50 text-[#FF385C] rounded-full flex items-center justify-center mx-auto mb-4">
            <LogIn size={24} />
          </div>
          <h1 className="text-2xl font-montserrat font-bold text-gray-950 tracking-tight mb-2">
            {isLoginView ? 'Welcome Back' : 'Create an Account'}
          </h1>
          <p className="text-gray-500 text-sm font-medium">
            {isLoginView ? 'Log in to manage your Zaiobnb host listings' : 'Sign up to become a host'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl flex items-center gap-2.5">
            <ShieldAlert size={16} className="text-red-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Username</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                <User size={16} />
              </span>
              <input 
                type="text" 
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border border-gray-200 focus:border-gray-950 p-3.5 pl-10 text-sm font-semibold rounded-xl outline-none transition-colors"
                placeholder="Enter host username"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Password</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock size={16} />
              </span>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-200 focus:border-gray-950 p-3.5 pl-10 text-sm font-semibold rounded-xl outline-none transition-colors"
                placeholder="Enter password"
              />
            </div>
          </div>
          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-[#FF385C] via-[#E61E4F] to-[#D70466] hover:brightness-110 text-white font-bold py-4 mt-6 rounded-xl text-sm transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {isLoading 
              ? (isLoginView ? 'Verifying account...' : 'Creating account...') 
              : (isLoginView ? 'Log In' : 'Sign Up')}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-xs font-medium text-gray-500">
            {isLoginView ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => setIsLoginView(!isLoginView)} 
              className="font-bold text-[#FF385C] underline hover:text-[#D70466] transition-colors bg-transparent border-none cursor-pointer"
            >
              {isLoginView ? "Sign up as a host" : "Log in instead"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
