import { useState, useEffect } from 'react';
import { ChevronLeft, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { currencies } from '../config/currencies';

import { useUser } from '../context/UserContext';

const Withdraw = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(currencies[0].name);
  const { user, loading } = useUser();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    address: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const amount = parseFloat(formData.amount);

    // Validation
    if (!formData.amount || isNaN(amount)) {
      setError('Please enter a valid amount');
      return;
    }

    if (amount < 9) {
      setError('Minimum withdrawal amount is 9.000 USDT');
      return;
    }

    if (amount > 10000000) {
      setError('Maximum withdrawal amount is 10,000,000.000 USDT');
      return;
    }

    if (amount > user?.balance) {
      setError('Insufficient balance');
      return;
    }

    if (!formData.address) {
      setError('Please enter a withdrawal address');
      return;
    }

    if (!formData.password) {
      setError('Please enter your withdrawal password');
      return;
    }

    setSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setShowSuccessModal(true);
      setFormData({ amount: '', address: '', password: '' });
    } catch (err) {
      setError('Failed to submit withdrawal request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#121212] text-white">
        <div className="font-black text-xl animate-pulse">LOADING...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#121212] text-white relative">
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowSuccessModal(false)}></div>
          <div className="bg-white rounded-[3rem] p-10 flex flex-col items-center text-center gap-6 relative z-10 w-full max-w-sm shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center text-green-500 shadow-inner">
               <CheckCircle2 size={60} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-2xl font-black text-gray-900 tracking-tighter uppercase">Success!</h3>
              <p className="text-gray-500 text-xs font-bold leading-relaxed">Your withdrawal request has been submitted successfully and is being processed.</p>
            </div>
            <button 
              onClick={() => {
                setShowSuccessModal(false);
                navigate('/me');
              }}
              className="w-full bg-[#ffcc80] text-black font-black py-5 rounded-[1.5rem] text-lg shadow-xl shadow-[#ffcc80]/20 active:scale-95 transition-transform uppercase tracking-widest mt-2"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center px-4 py-5 border-b border-gray-800 sticky top-0 bg-[#121212] z-50">
        <button onClick={() => navigate(-1)} className="p-1 active:scale-90 transition-transform">
          <ChevronLeft size={24} strokeWidth={3} />
        </button>
        <h1 className="flex-grow text-center font-black text-lg mr-6 uppercase tracking-wider">Withdraw</h1>
      </div>

      <div className="main-content-card">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 pb-10">
          {/* Header Info */}
          <div className="flex flex-col gap-1">
             <span className="text-2xl font-black text-gray-900 tracking-tight">Withdrawal account</span>
             <span className="text-red-500 text-[10px] font-black uppercase tracking-widest">24 hours withdrawal</span>
          </div>

          {/* Status Messages */}
          {error && (
            <div className="bg-red-50 text-red-500 p-4 rounded-2xl text-xs font-bold border border-red-100">
              {error}
            </div>
          )}

          {/* Balance Box */}
          <div className="bg-gray-100 rounded-[2rem] p-8 flex flex-col gap-2 shadow-inner border border-gray-100">
             <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Total balance</span>
             <span className="text-3xl font-black text-gray-900 tracking-tighter">{user?.balance?.toFixed(2) || '0.00'} <span className="text-sm font-bold text-gray-500 ml-1">USDT</span></span>
          </div>

          {/* Method Selection */}
          <div className="flex flex-col gap-4">
             <span className="text-sm font-black text-gray-800 uppercase tracking-wider">Withdrawal method:</span>
             <div className="grid grid-cols-2 gap-3">
                {currencies.map((method) => (
                  <button 
                    key={method.id} 
                    type="button"
                    onClick={() => setSelectedMethod(method.name)}
                    className={`flex items-center gap-2 px-3 py-3 rounded-2xl text-[10px] font-black border transition-all shadow-sm ${
                      selectedMethod === method.name 
                      ? 'bg-[#2d2a3e] text-white border-[#2d2a3e] shadow-lg shadow-[#2d2a3e]/20' 
                      : 'bg-white text-gray-400 border-gray-100'
                    }`}
                  >
                    <div className={`p-1 rounded-lg ${selectedMethod === method.name ? 'bg-white/10' : 'bg-gray-50'}`}>
                      <img src={method.icon} alt="" className="w-5 h-5 object-contain" />
                    </div>
                    <span className="truncate">{method.name}</span>
                  </button>
                ))}
             </div>
          </div>

          {/* Form Inputs */}
          <div className="flex flex-col gap-4 mt-2">
            <div className="bg-gray-50 rounded-[1.5rem] p-5 border border-gray-100 shadow-inner">
               <input 
                 type="number" 
                 name="amount"
                 value={formData.amount}
                 onChange={handleChange}
                 placeholder="Quota 9.000 - 10000000.000" 
                 className="w-full bg-transparent outline-none text-sm font-black text-gray-800 placeholder:text-gray-300" 
                 autoComplete="off"
               />
            </div>
            <div className="bg-gray-50 rounded-[1.5rem] p-5 border border-gray-100 shadow-inner">
               <input 
                 type="text" 
                 name="address"
                 value={formData.address}
                 onChange={handleChange}
                 placeholder="Withdrawal Address" 
                 className="w-full bg-transparent outline-none text-sm font-black text-gray-800 placeholder:text-gray-300" 
                 autoComplete="off"
               />
            </div>
            <div className="bg-gray-50 rounded-[1.5rem] p-5 border border-gray-100 shadow-inner flex items-center justify-between">
               <input 
                 type={showPassword ? "text" : "password"} 
                 name="password"
                 value={formData.password}
                 onChange={handleChange}
                 placeholder="Withdrawal password" 
                 title="Withdrawal password"
                 className="w-full bg-transparent outline-none text-sm font-black text-gray-800 placeholder:text-gray-300" 
                 autoComplete="new-password"
               />
               <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-300 active:text-gray-900 transition-colors">
                  {showPassword ? <EyeOff size={20} strokeWidth={2.5} /> : <Eye size={20} strokeWidth={2.5} />}
               </button>
            </div>
          </div>

          {/* Confirm Button */}
          <button 
            type="submit"
            disabled={submitting}
            className="w-full bg-[#ffcc80] text-black font-black py-5 rounded-[1.5rem] text-lg shadow-xl shadow-[#ffcc80]/20 active:scale-95 transition-transform uppercase tracking-widest mt-2 disabled:opacity-50"
          >
            {submitting ? 'Processing...' : 'Confirm'}
          </button>
        </form>

        {/* Attention Box */}
        <div className="bg-gray-50 rounded-[2rem] p-8 text-black flex flex-col gap-6 mt-4 border border-gray-100 shadow-inner mb-10">
          <p className="text-sm text-gray-900 font-black uppercase tracking-tight">Please pay attention to the following withdrawal-related matters:</p>
          <ol className="flex flex-col gap-6 text-[11px] text-gray-600 leading-relaxed font-semibold">
            <li className="flex flex-col gap-2">
              <span className="text-gray-900 font-black uppercase tracking-widest">1. Withdrawal method:</span>
              <span className="pl-4 opacity-80 leading-normal">
                - {currencies.map(c => c.name).join(', ')}
              </span>
            </li>
            <li className="flex flex-col gap-2">
              <span className="text-gray-900 font-black uppercase tracking-widest">2. Withdrawal frequency:</span>
              <span className="pl-4 opacity-80 leading-normal">- Each membership level is restricted to one withdrawal per day. [Upgrading the membership level can reset the number of withdrawals and claim it immediately]</span>
            </li>
            <li className="flex flex-col gap-2">
              <span className="text-gray-900 font-black uppercase tracking-widest">3. Withdrawal time:</span>
              <span className="pl-4 opacity-80 leading-normal">- Withdrawals can be made at any time 24 hours a day.</span>
            </li>
          </ol>
          <p className="text-[11px] font-bold text-gray-500 italic mt-2">Thank you for your understanding and support. If you have any questions, please feel free to contact our customer service team.</p>
        </div>
      </div>
    </div>
  );
};

export default Withdraw;
