import { useState } from 'react';
import { ChevronLeft, Info, CheckCircle2, Copy, Zap } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getCurrencyById } from '../config/currencies';

import logo from '../assets/logo.jpeg';

const Recharge = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const currencyData = getCurrencyById(location.state?.currencyId);
  const { name, network, address } = currencyData;

  const handleRechargeComplete = () => {
    setShowSuccessModal(true);
  };

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
              <h3 className="text-2xl font-bold text-white tracking-tight">REQUEST SUBMITTED</h3>
              <p className="text-gray-500 text-xs leading-relaxed">Your recharge request is being verified. Funds will be credited to your wallet in 1-3 minutes.</p>
            </div>
            <button 
              onClick={() => {
                setShowSuccessModal(false);
                navigate('/me');
              }}
              className="w-full bg-[#2196f3] text-white font-bold py-4.5 rounded-2xl text-lg active:scale-95 transition-all uppercase tracking-widest mt-2"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center px-4 py-5 border-b border-gray-800 sticky top-0 bg-[#0e1117] z-50">
        <button onClick={() => navigate(-1)} className="p-2 bg-[#1a1e26] rounded-xl border border-gray-800 active:scale-90 transition-transform">
          <ChevronLeft size={20} className="text-gray-400" />
        </button>
        <h1 className="flex-grow text-center font-bold text-lg mr-10 tracking-tight">RECHARGE</h1>
      </div>

      <div className="px-6 py-6 flex flex-col gap-6">
        {/* Wallet Address Section */}
        <div className="bg-[#1a1e26] rounded-[2rem] p-6 flex flex-col items-center gap-6 border border-gray-800 shadow-xl">
          <div className="flex items-center gap-3 self-start">
            <div className="w-10 h-10 bg-[#0e1117] rounded-xl flex items-center justify-center overflow-hidden border border-gray-800">
               <img src={logo} alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col">
               <span className="font-bold text-sm">Trading Wallet</span>
               <span className="text-[10px] text-gray-500 uppercase tracking-widest">Network: {network}</span>
            </div>
          </div>

          <div className="w-full bg-[#0e1117] rounded-2xl p-5 flex flex-col gap-3 border border-gray-800">
            <div className="flex items-center justify-between">
               <span className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">{name} ADDRESS</span>
               <div className="flex items-center gap-1.5 px-2 py-0.5 bg-blue-500/10 rounded-md border border-blue-500/20">
                  <Zap size={10} className="text-blue-500" />
                  <span className="text-[8px] font-bold text-blue-500 uppercase">Instant Pay</span>
               </div>
            </div>
            <div className="bg-[#1a1e26] p-4 rounded-xl border border-gray-800 flex flex-col gap-4">
               <p className="text-xs text-white font-mono break-all leading-relaxed text-center">{address}</p>
               <button 
                onClick={() => {
                  navigator.clipboard.writeText(address);
                  // Using a more subtle alert for now, could be a toast later
                  alert('Address copied');
                }}
                className="w-full bg-[#2196f3] text-white py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-lg shadow-[#2196f3]/10"
              >
                <Copy size={16} />
                <span>Copy Address</span>
              </button>
            </div>
          </div>

          <button 
            onClick={handleRechargeComplete}
            className="w-full bg-[#1a1e26] text-blue-500 font-bold py-4.5 rounded-2xl text-base border border-blue-500/20 active:bg-blue-500/5 transition-all uppercase tracking-widest"
          >
             I have transferred
          </button>
        </div>

        {/* Instructions */}
        <div className="bg-[#1a1e26] rounded-[2rem] p-6 text-white flex flex-col gap-5 border border-gray-800 mb-10">
          <div className="flex items-center gap-3 text-gray-400 font-bold text-xs uppercase tracking-widest">
             <div className="bg-[#0e1117] p-2 rounded-lg border border-gray-800">
               <Info size={16} className="text-[#2196f3]" />
             </div>
             <span>Deposit Instructions</span>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex gap-4 p-3 rounded-xl bg-[#0e1117]/50 border border-gray-800/50">
               <span className="text-blue-500 font-bold text-sm">01</span>
               <p className="text-[11px] text-gray-400 leading-relaxed">Ensure you are sending assets using the <span className="text-white font-bold">{network}</span> network. Using the wrong network will result in permanent loss.</p>
            </div>
            <div className="flex gap-4 p-3 rounded-xl bg-[#0e1117]/50 border border-gray-800/50">
               <span className="text-blue-500 font-bold text-sm">02</span>
               <p className="text-[11px] text-gray-400 leading-relaxed">Deposit only <span className="text-white font-bold">{name}</span> to this address. Other assets will not be credited.</p>
            </div>
            <div className="flex gap-4 p-3 rounded-xl bg-[#0e1117]/50 border border-gray-800/50">
               <span className="text-blue-500 font-bold text-sm">03</span>
               <p className="text-[11px] text-gray-400 leading-relaxed">The average processing time is 1-3 minutes. If funds are not visible after 10 minutes, contact live support.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recharge;
