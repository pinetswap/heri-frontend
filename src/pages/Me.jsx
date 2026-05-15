
import { Wallet, Landmark, FileText, Lock, ChevronRight, Settings, LogOut, MessageSquareCode } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

import { useUser } from '../context/UserContext';

const Me = () => {
  const navigate = useNavigate();
  const { user, loading } = useUser();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
    window.location.reload(); // Force clear context
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#121212] text-white">
        <div className="font-black text-xl animate-pulse">LOADING...</div>
      </div>
    );
  }

  return (
    <div className="p-4 flex flex-col gap-6 bg-[#121212] min-h-screen text-white">
      {/* Profile Header */}
      <div className="flex items-center justify-between mt-4 px-2">
        <div className="flex flex-col">
          <span className="text-gray-500 text-xs font-black uppercase tracking-widest">Welcome back</span>
          <span className="text-3xl font-black tracking-tighter truncate max-w-[200px]">{user?.fullName || 'User'}</span>
        </div>
        <div className="bg-[#d4ff70]/10 text-[#d4ff70] border border-[#d4ff70]/20 px-5 py-2 rounded-2xl flex items-center gap-2 font-black text-xs uppercase tracking-wider shadow-lg shadow-[#d4ff70]/5">
           <Settings size={16} strokeWidth={3} />
           <span>{user?.role?.toUpperCase() || 'USER'}</span>
        </div>
      </div>

      {/* Balance Card */}
      <div className="balance-card-gradient rounded-[2.5rem] p-10 flex flex-col gap-10 relative overflow-hidden shadow-[0_20px_50px_rgba(30,64,175,0.3)] border border-blue-400/20">
        <div className="absolute right-[-15%] top-[-15%] w-56 h-56 bg-white/10 rounded-full blur-[60px]"></div>
        <div className="absolute left-[-15%] bottom-[-15%] w-56 h-56 bg-blue-300/10 rounded-full blur-[60px]"></div>
        
        <div className="flex flex-col gap-2 relative z-10">
          <span className="text-[10px] text-white/50 font-black uppercase tracking-[0.2em]">Total balance (USDT)</span>
          <span className="text-5xl font-black tracking-tighter">{user?.balance?.toFixed(2) || '0.00'}</span>
        </div>
        
        <div className="flex flex-col gap-2 relative z-10">
          <span className="text-[10px] text-white/50 font-black uppercase tracking-[0.2em]">Email Address</span>
          <span className="text-lg font-black tracking-tight text-white/80">{user?.email}</span>
        </div>

        <div className="absolute top-6 right-10 opacity-10">
           <img src="https://cdn-icons-png.flaticon.com/512/2150/2150150.png" width="100" alt="" />
        </div>
      </div>

      {/* Action Grid */}
      <div className="grid grid-cols-4 gap-2 mt-2 px-1">
        {[
          { label: 'Account', icon: Wallet, path: '#' },
          { label: 'Recharge', icon: Landmark, path: '/select-currency' },
          { label: 'Withdraw', icon: FileText, path: '/withdraw' },
          { label: 'Financial records', icon: MessageSquareCode, path: '#' },
        ].map((item, idx) => (
          <Link key={idx} to={item.path} className="flex flex-col items-center gap-3 active:scale-90 transition-transform">
            <div className="bg-[#1e1e1e] p-5 rounded-[1.5rem] text-[#d4ff70] shadow-xl border border-gray-800/50">
               <item.icon size={26} strokeWidth={2.5} />
            </div>
            <span className="text-[9px] text-center font-black uppercase tracking-widest text-gray-400 leading-tight">{item.label}</span>
          </Link>
        ))}
      </div>

      {/* Menu List */}
      <div className="flex flex-col gap-3 mt-4">
        <Link to="/change-password" title="Change Password" className="bg-[#1e1e1e] rounded-[1.5rem] p-5 flex items-center justify-between group active:bg-gray-800 transition-colors border border-gray-800/30 shadow-md">
          <div className="flex items-center gap-5">
            <div className="bg-[#d4ff70]/10 text-[#d4ff70] p-3 rounded-2xl shadow-inner">
               <Lock size={22} strokeWidth={2.5} />
            </div>
            <span className="font-black text-sm uppercase tracking-wider text-gray-200">Change Password</span>
          </div>
          <ChevronRight size={22} strokeWidth={3} className="text-gray-600 group-hover:text-primary transition-colors" />
        </Link>
        
        <button 
          onClick={handleLogout}
          className="bg-[#1e1e1e] rounded-[1.5rem] p-5 flex items-center justify-between group active:bg-red-950/20 transition-colors border border-gray-800/30 shadow-md"
        >
          <div className="flex items-center gap-5 text-red-500">
            <div className="bg-red-500/10 p-3 rounded-2xl shadow-inner">
               <LogOut size={22} strokeWidth={2.5} />
            </div>
            <span className="font-black text-sm uppercase tracking-wider">Logout</span>
          </div>
          <ChevronRight size={22} strokeWidth={3} className="text-gray-700" />
        </button>
      </div>
    </div>
  );
};

export default Me;
