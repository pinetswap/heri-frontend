import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
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
    <div className="flex flex-col min-h-screen bg-[#121212] text-white">
      {/* Header / Brand Area */}
      <div className="flex flex-col items-center pt-12 pb-8 gap-4 px-6">
        <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-2xl border border-white/10 overflow-hidden transform rotate-3">
          <img src={logo} alt="Logo" className="w-full h-full object-contain" />
        </div>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-black tracking-tighter uppercase">Global Transfer</h1>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em]">Investment Portal</p>
        </div>
      </div>

      {/* Main Form Card */}
      <div className="main-content-card !rounded-t-[3rem] shadow-[0_-20px_50px_rgba(0,0,0,0.3)]">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8 pt-4 pb-10">
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-black text-gray-900 tracking-tighter">Welcome Back</h2>
            <p className="text-gray-400 text-xs font-bold">Please log in to your account to continue</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-xl text-xs font-bold border border-red-100">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-4">
            {/* Email Field */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest ml-1">Email Address</span>
              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 flex items-center gap-4 shadow-inner">
                <Mail size={20} className="text-gray-400" />
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

            {/* Password Field */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest ml-1">Password</span>
              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 flex items-center gap-4 shadow-inner">
                <Lock size={20} className="text-gray-400" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password" 
                  className="w-full bg-transparent outline-none text-sm font-black text-gray-800 placeholder:text-gray-300" 
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-300 active:text-gray-900 transition-colors">
                  {showPassword ? <EyeOff size={20} strokeWidth={2.5} /> : <Eye size={20} strokeWidth={2.5} />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end px-1">
            <button type="button" className="text-[10px] font-black text-primary uppercase tracking-widest">Forgot Password?</button>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-[#ffcc80] text-black font-black py-5 rounded-[1.5rem] text-lg shadow-xl shadow-[#ffcc80]/20 active:scale-95 transition-transform uppercase tracking-widest disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>

          <div className="flex flex-col items-center gap-4 mt-4">
            <p className="text-xs text-gray-400 font-bold text-center">
              Don't have an account? 
              <Link to="/signup" className="text-gray-900 font-black ml-1 uppercase tracking-wider underline">Create Account</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
