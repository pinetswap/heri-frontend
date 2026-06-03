import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Globe, Eye, EyeOff, ChevronLeft, UserPlus } from 'lucide-react';
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
    <div className="flex flex-col min-h-screen bg-[#0e1117] text-white">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-full h-64 bg-gradient-to-b from-[#2196f3]/5 to-transparent pointer-events-none"></div>

      {/* Header Area */}
      <div className="flex items-center px-4 py-5 z-20">
        <button onClick={() => navigate(-1)} className="p-2 bg-[#1a1e26] rounded-xl border border-gray-800 active:scale-90 transition-transform">
          <ChevronLeft size={20} className="text-gray-400" />
        </button>
      </div>

      {/* Brand & Heading Area */}
      <div className="flex flex-col items-center pt-2 pb-8 gap-4 px-6 relative z-10">
        <div className="w-16 h-16 bg-[#1a1e26] rounded-2xl flex items-center justify-center shadow-2xl border border-gray-800 overflow-hidden transform -rotate-3 transition-transform hover:rotate-0">
          <img src={logo} alt="Logo" className="w-full h-full object-contain" />
        </div>
        <div className="flex flex-col items-center text-center">
          <h1 className="text-3xl font-black tracking-tight uppercase text-white">DERIV</h1>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Start your journey</p>
        </div>
      </div>

      {/* Main Form Area */}
      <div className="px-6 pb-12 relative z-10 overflow-y-auto">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1 mb-2">
            <h2 className="text-2xl font-bold text-white">Create Account</h2>
            <p className="text-gray-500 text-sm">Join thousands of traders worldwide</p>
          </div>

          {error && (
            <div className="bg-red-500/10 text-red-500 p-4 rounded-xl text-xs font-bold border border-red-500/20">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-4">
            {/* Full Name Field */}
            <div className="flex flex-col gap-2">
              <span className="text-[11px] text-gray-500 font-bold uppercase tracking-wider ml-1">Full Name</span>
              <div className="bg-[#1a1e26] rounded-2xl p-4 border border-gray-800 flex items-center gap-4 focus-within:border-[#2196f3] transition-colors shadow-lg">
                <User size={18} className="text-gray-500" />
                <input 
                  type="text" 
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="John Doe" 
                  className="w-full bg-transparent outline-none text-sm font-semibold text-white placeholder:text-gray-600" 
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="flex flex-col gap-2">
              <span className="text-[11px] text-gray-500 font-bold uppercase tracking-wider ml-1">Email Address</span>
              <div className="bg-[#1a1e26] rounded-2xl p-4 border border-gray-800 flex items-center gap-4 focus-within:border-[#2196f3] transition-colors shadow-lg">
                <Mail size={18} className="text-gray-500" />
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com" 
                  className="w-full bg-transparent outline-none text-sm font-semibold text-white placeholder:text-gray-600" 
                  required
                />
              </div>
            </div>

            {/* Country Field */}
            <div className="flex flex-col gap-2">
              <span className="text-[11px] text-gray-500 font-bold uppercase tracking-wider ml-1">Country</span>
              <div className="bg-[#1a1e26] rounded-2xl p-4 border border-gray-800 flex items-center gap-4 focus-within:border-[#2196f3] transition-colors shadow-lg">
                <Globe size={18} className="text-gray-500" />
                <input 
                  type="text" 
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="Select your country" 
                  className="w-full bg-transparent outline-none text-sm font-semibold text-white placeholder:text-gray-600" 
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-2">
              <span className="text-[11px] text-gray-500 font-bold uppercase tracking-wider ml-1">Password</span>
              <div className="bg-[#1a1e26] rounded-2xl p-4 border border-gray-800 flex items-center gap-4 focus-within:border-[#2196f3] transition-colors shadow-lg">
                <Lock size={18} className="text-gray-500" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a strong password" 
                  className="w-full bg-transparent outline-none text-sm font-semibold text-white placeholder:text-gray-600" 
                  required
                  minLength={6}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-500 hover:text-white transition-colors">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-[#2196f3] text-white font-bold py-4.5 rounded-2xl text-lg shadow-xl shadow-[#2196f3]/20 active:scale-[0.98] transition-all disabled:opacity-50 mt-4 flex items-center justify-center gap-2"
          >
            {loading ? 'Creating Account...' : (
              <>
                <UserPlus size={20} />
                <span>Register Now</span>
              </>
            )}
          </button>

          <div className="flex flex-col items-center gap-4 mt-4">
            <p className="text-sm text-gray-500 text-center leading-relaxed">
              Already have an account? 
              <Link to="/login" className="text-[#2196f3] font-bold ml-1 hover:underline">Log In here</Link>
            </p>
          </div>
          
          <div className="mt-4 flex flex-col gap-3">
             <div className="flex items-start gap-3 p-3 bg-blue-500/5 rounded-xl border border-blue-500/10">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0"></div>
                <p className="text-[10px] text-gray-400 leading-normal italic">By registering, you agree to our Terms of Service and Privacy Policy regarding professional trading activities.</p>
             </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
