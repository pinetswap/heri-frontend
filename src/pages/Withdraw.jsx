import { useState } from 'react';
import { ChevronLeft, Eye, EyeOff, CheckCircle2, Wallet, ArrowUpRight, ShieldCheck, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { currencies } from '../config/currencies';
import { API_URL } from '../config/api';

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
      const response = await fetch(`${API_URL}/withdrawals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          amount,
          walletAddress: formData.address,
        })
      });

      const data = await response.json();

      if (response.ok) {
        setShowSuccessModal(true);
        setFormData({ amount: '', address: '', password: '' });
      } else {
        setError(data.error || 'Failed to submit withdrawal request.');
      }
    } catch (err) {
      setError('Failed to submit withdrawal request.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0e1117] text-white">
        <div className="font-bold text-xl animate-pulse tracking-widest text-[#2196f3]">INITIALIZING...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0e1117] text-white relative">
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setShowSuccessModal(false)}></div>
          <div className="bg-[#1a1e26] rounded-[2.5rem] p-10 flex flex-col items-center text-center gap-6 relative z-10 w-full max-w-sm border border-gray-800 shadow-2xl">
            <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center text-green-500 border border-green-500/20">
               <CheckCircle2 size={60} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-2xl font-bold text-white tracking-tight uppercase">SUCCESSFUL</h3>
              <p className="text-gray-500 text-xs leading-relaxed">Your withdrawal request has been received and is being processed by the finance department.</p>
            </div>
            <button 
              onClick={() => {
                setShowSuccessModal(false);
                navigate('/me');
              }}
              className="w-full bg-[#2196f3] text-white font-bold py-4.5 rounded-2xl text-lg active:scale-95 transition-all mt-2"
            >
              Back to Assets
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center px-4 py-5 border-b border-gray-800 sticky top-0 bg-[#0e1117] z-50">
        <button onClick={() => navigate(-1)} className="p-2 bg-[#1a1e26] rounded-xl border border-gray-800 active:scale-90 transition-transform">
          <ChevronLeft size={20} className="text-gray-400" />
        </button>
        <h1 className="flex-grow text-center font-bold text-lg mr-10 tracking-tight uppercase">Withdraw Funds</h1>
      </div>

      <div className="px-6 py-6 flex flex-col gap-6 overflow-y-auto pb-12">
        {/* Balance Card */}
        <div className="bg-gradient-to-br from-[#1a1e26] to-[#0e1117] rounded-[2rem] p-7 border border-gray-800 shadow-xl relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-5">
              <Wallet size={80} />
           </div>
           <div className="flex flex-col gap-1.5 relative z-10">
              <span className="text-[11px] text-gray-500 font-bold uppercase tracking-widest">Available Balance</span>
              <div className="flex items-baseline gap-2">
                 <span className="text-3xl font-bold text-white">{user?.balance?.toFixed(2) || '0.00'}</span>
                 <span className="text-sm font-bold text-[#2196f3]">USDT</span>
              </div>
           </div>
           <div className="mt-6 flex items-center gap-2 relative z-10">
              <div className="px-2 py-0.5 bg-green-500/10 rounded border border-green-500/20 flex items-center gap-1">
                 <ShieldCheck size={10} className="text-green-500" />
                 <span className="text-[8px] font-bold text-green-500 uppercase">Verified Account</span>
              </div>
           </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {error && (
            <div className="bg-red-500/10 text-red-500 p-4 rounded-xl text-xs font-bold border border-red-500/20">
              {error}
            </div>
          )}

          {/* Method Selection */}
          <div className="flex flex-col gap-3">
             <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Withdrawal Method</span>
                <span className="text-[10px] font-bold text-[#2196f3] uppercase tracking-widest">Change</span>
             </div>
             <div className="grid grid-cols-2 gap-3">
                {currencies.slice(0, 2).map((method) => (
                  <button 
                    key={method.id} 
                    type="button"
                    onClick={() => setSelectedMethod(method.name)}
                    className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${
                      selectedMethod === method.name 
                      ? 'bg-[#1a1e26] border-[#2196f3] shadow-lg shadow-[#2196f3]/5' 
                      : 'bg-[#1a1e26]/40 border-gray-800 opacity-60'
                    }`}
                  >
                    <div className="w-6 h-6 rounded-md overflow-hidden bg-white/5 p-1">
                      <img src={method.icon} alt="" className="w-full h-full object-contain" />
                    </div>
                    <span className="text-xs font-bold whitespace-nowrap">{method.name}</span>
                  </button>
                ))}
             </div>
          </div>

          {/* Form Inputs */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
               <span className="text-[11px] text-gray-500 font-bold uppercase tracking-wider ml-1">Withdrawal Amount</span>
               <div className="bg-[#1a1e26] rounded-2xl p-4 border border-gray-800 flex items-center gap-4 focus-within:border-[#2196f3] transition-colors">
                  <span className="text-[#2196f3] font-bold">$</span>
                  <input 
                    type="number" 
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="Min 9.00 USDT" 
                    className="w-full bg-transparent outline-none text-sm font-semibold text-white placeholder:text-gray-600" 
                  />
                  <button type="button" onClick={() => setFormData({...formData, amount: user?.balance.toString()})} className="text-[10px] font-bold text-[#2196f3] uppercase px-2 py-1 bg-blue-500/10 rounded">Max</button>
               </div>
            </div>

            <div className="flex flex-col gap-2">
               <span className="text-[11px] text-gray-500 font-bold uppercase tracking-wider ml-1">Destination Address</span>
               <div className="bg-[#1a1e26] rounded-2xl p-4 border border-gray-800 flex items-center gap-4 focus-within:border-[#2196f3] transition-colors">
                  <input 
                    type="text" 
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="TRC20 Wallet Address" 
                    className="w-full bg-transparent outline-none text-sm font-semibold text-white placeholder:text-gray-600" 
                  />
               </div>
            </div>

            <div className="flex flex-col gap-2">
               <span className="text-[11px] text-gray-500 font-bold uppercase tracking-wider ml-1">Trading Password</span>
               <div className="bg-[#1a1e26] rounded-2xl p-4 border border-gray-800 flex items-center gap-4 focus-within:border-[#2196f3] transition-colors">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter 6-digit password" 
                    className="w-full bg-transparent outline-none text-sm font-semibold text-white placeholder:text-gray-600" 
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-500 hover:text-white p-1">
                     {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
               </div>
            </div>
          </div>

          <button 
            type="submit"
            disabled={submitting}
            className="w-full bg-[#2196f3] text-white font-bold py-4.5 rounded-2xl text-lg shadow-xl shadow-[#2196f3]/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            <span>Confirm Withdrawal</span>
            <ArrowUpRight size={20} />
          </button>
        </form>

        {/* Withdrawal Info */}
        <div className="bg-[#1a1e26] rounded-[2rem] p-6 border border-gray-800">
           <div className="flex items-center gap-2 mb-4 text-[#2196f3]">
              <HelpCircle size={16} />
              <span className="text-xs font-bold uppercase tracking-widest">Withdrawal Policy</span>
           </div>
           <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center text-[11px]">
                 <span className="text-gray-500">Service Fee</span>
                 <span className="text-white font-bold">1.00 USDT</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                 <span className="text-gray-500">Processing Time</span>
                 <span className="text-white font-bold">24 Hours</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                 <span className="text-gray-500">Daily Limit</span>
                 <span className="text-white font-bold">1 Withdrawal / Day</span>
              </div>
              <p className="text-[10px] text-gray-500 leading-relaxed mt-2 italic">* Withdrawal requests are audited by the financial system to ensure account security. Thank you for your cooperation.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Withdraw;
