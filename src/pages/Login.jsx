import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import logo from '../assets/logo.jpeg';

import { API_URL } from '../config/api';

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
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
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Invalid email or password');
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
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-[#2196f3]/10 to-transparent pointer-events-none"></div>

      {/* Header / Brand Area */}
      <div className="flex flex-col items-center pt-16 pb-12 gap-6 px-6 relative z-10">
        <div className="w-20 h-20 bg-[#1a1e26] rounded-3xl flex items-center justify-center shadow-2xl border border-gray-800 overflow-hidden transform transition-transform hover:scale-105">
          <img src={logo} alt="Logo" className="w-full h-full object-contain" />
        </div>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-3xl font-black tracking-tight text-white">DERIV PORTAL</h1>
          <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 rounded-full border border-green-500/20">
            <ShieldCheck size={14} className="text-green-500" />
            <span className="text-green-500 text-[10px] font-bold uppercase tracking-widest">Secure Connection</span>
          </div>
        </div>
      </div>

      {/* Main Form Area */}
      <div className="px-6 pb-12 relative z-10">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-1 mb-2">
            <h2 className="text-2xl font-bold text-white">Welcome back</h2>
            <p className="text-gray-500 text-sm">Sign in to your trading account</p>
          </div>

          {error && (
            <div className="bg-red-500/10 text-red-500 p-4 rounded-xl text-xs font-bold border border-red-500/20 animate-shake">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-4">
            {/* Email Field */}
            <div className="flex flex-col gap-2">
              <span className="text-[11px] text-gray-500 font-bold uppercase tracking-wider ml-1">Email Address</span>
              <div className="bg-[#1a1e26] rounded-2xl p-4 border border-gray-800 flex items-center gap-4 focus-within:border-[#2196f3] transition-colors shadow-lg">
                <Mail size={20} className="text-gray-500" />
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email" 
                  className="w-full bg-transparent outline-none text-sm font-semibold text-white placeholder:text-gray-600" 
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-2">
              <span className="text-[11px] text-gray-500 font-bold uppercase tracking-wider ml-1">Password</span>
              <div className="bg-[#1a1e26] rounded-2xl p-4 border border-gray-800 flex items-center gap-4 focus-within:border-[#2196f3] transition-colors shadow-lg">
                <Lock size={20} className="text-gray-500" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password" 
                  className="w-full bg-transparent outline-none text-sm font-semibold text-white placeholder:text-gray-600" 
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-500 hover:text-white transition-colors p-1">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end px-1">
            <button type="button" className="text-xs font-bold text-[#2196f3] hover:underline">Forgot password?</button>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-[#2196f3] text-white font-bold py-4.5 rounded-2xl text-lg shadow-xl shadow-[#2196f3]/20 active:scale-[0.98] transition-all disabled:opacity-50 mt-4"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>

          <div className="flex flex-col items-center gap-4 mt-6">
            <p className="text-sm text-gray-500">
              Don't have an account? 
              <Link to="/signup" className="text-[#2196f3] font-bold ml-1 hover:underline">Create one now</Link>
            </p>
          </div>
        </form>
      </div>
      
      {/* Footer Branding */}
      <div className="mt-auto pb-10 flex justify-center opacity-30">
        <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-gray-500">Global Transfer Investment</span>
      </div>
    </div>
  );
};

export default Login;
