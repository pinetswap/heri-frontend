import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Globe, Eye, EyeOff, ChevronLeft } from 'lucide-react';
import logo from '../assets/logo.jpeg';

import { API_URL } from '../config/api';

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    country: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      // Save token to localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#121212] text-white">
      {/* Header Area */}
      <div className="flex items-center px-4 py-5 z-10">
        <button onClick={() => navigate(-1)} className="p-1 active:scale-90 transition-transform">
          <ChevronLeft size={24} strokeWidth={3} />
        </button>
      </div>

      {/* Brand Area */}
      <div className="flex flex-col items-center pt-2 pb-8 gap-3 px-6">
        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-2xl border border-white/10 overflow-hidden transform -rotate-3">
          <img src={logo} alt="Logo" className="w-full h-full object-contain" />
        </div>
        <div className="flex flex-col items-center text-center">
          <h1 className="text-xl font-black tracking-tighter uppercase">Global Transfer</h1>
        </div>
      </div>

      {/* Main Form Card */}
      <div className="main-content-card !rounded-t-[3rem] shadow-[0_-20px_50px_rgba(0,0,0,0.3)]">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 pt-2 pb-10">
          <div className="flex flex-col gap-1">
            <h2 className="text-3xl font-black text-gray-900 tracking-tighter">Register</h2>
            <p className="text-gray-400 text-xs font-bold">Join Global Transfer Investment today</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-xl text-xs font-bold border border-red-100">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-4">
            {/* Full Name Field */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest ml-1">Full Name</span>
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex items-center gap-4 shadow-inner">
                <User size={18} className="text-gray-400" />
                <input 
                  type="text" 
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name" 
                  className="w-full bg-transparent outline-none text-sm font-black text-gray-800 placeholder:text-gray-300" 
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest ml-1">Email Address</span>
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex items-center gap-4 shadow-inner">
                <Mail size={18} className="text-gray-400" />
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com" 
                  className="w-full bg-transparent outline-none text-sm font-black text-gray-800 placeholder:text-gray-300" 
                  required
                />
              </div>
            </div>

            {/* Country Field */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest ml-1">Country</span>
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex items-center gap-4 shadow-inner">
                <Globe size={18} className="text-gray-400" />
                <input 
                  type="text" 
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="Enter your country" 
                  className="w-full bg-transparent outline-none text-sm font-black text-gray-800 placeholder:text-gray-300" 
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest ml-1">Create Password</span>
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex items-center gap-4 shadow-inner">
                <Lock size={18} className="text-gray-400" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a secure password" 
                  className="w-full bg-transparent outline-none text-sm font-black text-gray-800 placeholder:text-gray-300" 
                  required
                  minLength={6}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-300">
                  {showPassword ? <EyeOff size={18} strokeWidth={2.5} /> : <Eye size={18} strokeWidth={2.5} />}
                </button>
              </div>
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-[#ffcc80] text-black font-black py-5 rounded-[1.5rem] text-lg shadow-xl shadow-[#ffcc80]/20 active:scale-95 transition-transform uppercase tracking-widest mt-2 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Account'}
          </button>

          <div className="flex flex-col items-center gap-4">
            <p className="text-xs text-gray-400 font-bold text-center leading-relaxed">
              Already have an account? 
              <Link to="/login" className="text-gray-900 font-black ml-1 uppercase tracking-wider underline">Log In here</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
