
import { useState, useEffect } from 'react';
import { 
  Menu, 
  ChevronDown, 
  Volume2, 
  Bell, 
  Plus, 
  Minus,
  Settings2,
  Wallet,
  Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import TradingChart from '../components/TradingChart';
import { useUser } from '../context/UserContext';
import { API_URL } from '../config/api';

const Home = () => {
  const { user, fetchUser } = useUser();
  const [stake, setStake] = useState(10);
  const [activeTab, setActiveTab] = useState('Even/Odd');
  const [isAuto, setIsAuto] = useState(false);
  const [lastDigits, setLastDigits] = useState([8.8, 9.0, 8.2, 9.6, 9.2, 11.8, 11.8, 8.4, 10.8, 12.4]);
  const [liveData, setLiveData] = useState({ price: 0, change: 0, changePercent: 0 });
  const [isTrading, setIsTrading] = useState(false);

  // Simulate changing digits occasionally
  useEffect(() => {
    const interval = setInterval(() => {
      setLastDigits(prev => prev.map(d => Math.max(0, Math.min(20, d + (Math.random() - 0.5) * 2))));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleTrade = async (type) => {
    if (isTrading) return;

    if (stake < 10) {
      alert('Minimum stake amount is $10.');
      return;
    }

    if (!user || user.balance < stake) {
      alert('Insufficient balance to place this trade. Please recharge.');
      return;
    }

    setIsTrading(true);

    try {
      // Simulate "Working..." for 2.5 seconds
      await new Promise(resolve => setTimeout(resolve, 2500));

      const response = await fetch(`${API_URL}/users/update-balance`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          amount: stake,
          isTrade: true
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Refresh user data to show new balance
        await fetchUser();
        
        if (data.result === 'win') {
          alert(`Congratulations! You WON the trade. +$${data.payout.toFixed(2)} added to your balance.`);
        } else {
          alert(`Trade closed. Result: Loss. -$${stake} deducted from your balance.`);
        }
      } else {
        alert(data.error || 'Failed to process trade.');
      }
    } catch (err) {
      console.error('Trade error:', err);
      alert('Network error while processing trade.');
    } finally {
      setIsTrading(false);
    }
  };

  const tabs = ['Matches/Differs', 'Even/Odd', 'Over/Under'];
  const presets = [10, 25, 50, 100, 200, 500];

  return (
    <div className="flex flex-col min-h-screen bg-[#0e1117] text-white pb-20 relative">
      {/* Trading Overlay */}
      {isTrading && (
        <div className="absolute inset-0 z-[100] bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
           <div className="bg-[#1a1e26] p-8 rounded-[2rem] border border-gray-800 flex flex-col items-center gap-4 shadow-2xl">
              <Loader2 size={48} className="text-[#2196f3] animate-spin" />
              <div className="flex flex-col items-center">
                 <span className="text-xl font-bold tracking-tight">Working...</span>
                 <span className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Analyzing Market Data</span>
              </div>
           </div>
        </div>
      )}

      {/* Top Navigation */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <Menu size={24} className="text-gray-400" />
          <div className="w-8 h-8 bg-[#ff3b30] rounded-lg flex items-center justify-center font-bold">T</div>
          <div className="flex flex-col items-start bg-[#1a1e26] px-3 py-1 rounded-lg border border-gray-800">
            <span className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">Balance</span>
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold text-[#2196f3]">$</span>
              <span className="text-sm font-bold tracking-tight">{user?.balance?.toFixed(2) || '0.00'}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Volume2 size={20} className="text-[#2196f3]" />
          <Link to="/select-currency" className="bg-[#2196f3] text-white px-4 py-1.5 rounded-lg text-sm font-bold">Deposit</Link>
          <Bell size={20} className="text-gray-400" />
        </div>
      </div>

      {/* Trade Type Tabs */}
      <div className="flex items-center gap-4 px-4 py-2 border-b border-gray-800 overflow-x-auto no-scrollbar">
        {tabs.map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              activeTab === tab ? 'bg-[#1a1e26] text-[#2196f3] border border-gray-700' : 'text-gray-500'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Asset Selector & Chart Info */}
      <div className="p-4 flex justify-between items-start">
        <div className="bg-[#1a1e26] p-3 rounded-xl border border-gray-700 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500/20 rounded flex items-center justify-center text-blue-500">
            <Settings2 size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold">Volatility 100 Index</span>
              <ChevronDown size={14} className="text-gray-500" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-mono">{liveData.price ? liveData.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 'Loading...'}</span>
              <span className={`text-xs ${liveData.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {liveData.changePercent ? (liveData.changePercent >= 0 ? '+' : '') + liveData.changePercent.toFixed(2) + '%' : ''}
              </span>
            </div>
          </div>
        </div>
        <div className="bg-[#1a1e26] px-3 py-1 rounded border border-gray-700 text-xs font-mono text-gray-400">
          100%
        </div>
      </div>

      {/* Chart Section */}
      <div className="h-48 px-4 relative">
        <TradingChart onPriceUpdate={setLiveData} />
      </div>

      {/* Last Digits Ticker */}
      <div className="px-4 py-4 flex justify-between gap-1 overflow-x-auto no-scrollbar">
        {lastDigits.map((pct, idx) => (
          <div key={idx} className="flex flex-col items-center flex-1 min-w-[30px]">
            <span className="text-xs font-bold mb-1">{idx}</span>
            <div className={`text-[10px] ${idx === 2 ? 'text-red-500' : idx === 9 ? 'text-green-500' : 'text-gray-400'}`}>
              {pct.toFixed(1)}%
            </div>
            {idx === 7 && <div className="mt-1 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[6px] border-t-orange-500"></div>}
          </div>
        ))}
      </div>

      {/* Controls Panel */}
      <div className="bg-[#1a1e26] mx-4 rounded-2xl border border-gray-700 overflow-hidden mb-4 shadow-2xl">
        {/* Toggle */}
        <div className="flex p-1 bg-[#0e1117] m-2 rounded-xl border border-gray-800">
          <button 
            onClick={() => setIsAuto(true)}
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${isAuto ? 'bg-[#2196f3] text-white shadow-lg' : 'text-gray-500'}`}
          >
            AUTO
          </button>
          <button 
            onClick={() => setIsAuto(false)}
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${!isAuto ? 'bg-[#2196f3] text-white shadow-lg' : 'text-gray-500'}`}
          >
            MANUAL
          </button>
        </div>

        {/* Stake Input */}
        <div className="px-4 py-2">
          <div className="text-center text-[10px] font-bold text-[#2196f3] uppercase tracking-wider mb-2">Stake</div>
          <div className="flex items-center justify-between gap-4 mb-4">
            <button onClick={() => setStake(s => Math.max(1, s - 1))} className="w-10 h-10 rounded-xl bg-[#0e1117] border border-gray-800 flex items-center justify-center text-gray-400 active:scale-90 transition-transform">
              <Minus size={20} />
            </button>
            <div className="flex-grow flex items-center justify-center gap-2">
              <span className="text-[#2196f3] text-xl font-bold">$</span>
              <input 
                type="number" 
                value={stake} 
                onChange={(e) => setStake(Number(e.target.value))}
                className="bg-transparent text-center text-3xl font-bold w-24 outline-none font-mono"
              />
            </div>
            <button onClick={() => setStake(s => s + 1)} className="w-10 h-10 rounded-xl bg-[#0e1117] border border-gray-800 flex items-center justify-center text-gray-400 active:scale-90 transition-transform">
              <Plus size={20} />
            </button>
          </div>

          {/* Presets */}
          <div className="grid grid-cols-6 gap-2 mb-4">
            {presets.map(p => (
              <button 
                key={p} 
                onClick={() => setStake(p)}
                className={`py-1.5 rounded-lg text-xs font-bold border transition-all ${stake === p ? 'bg-[#2196f3]/10 border-[#2196f3] text-[#2196f3]' : 'bg-[#0e1117] border-gray-800 text-gray-400 active:bg-gray-800'}`}
              >
                ${p}
              </button>
            ))}
          </div>
        </div>

        {/* Secondary Inputs */}
        <div className="grid grid-cols-3 gap-2 px-4 pb-4">
          <div className="bg-[#0e1117] p-2 rounded-xl border border-gray-800">
            <div className="text-[8px] font-bold text-green-500 uppercase text-center">Target Profit</div>
            <div className="text-center font-bold mt-1 text-sm">$200</div>
          </div>
          <div className="bg-[#0e1117] p-2 rounded-xl border border-gray-800">
            <div className="text-[8px] font-bold text-red-500 uppercase text-center">Stop Loss</div>
            <div className="text-center font-bold mt-1 text-sm">$999</div>
          </div>
          <div className="bg-[#0e1117] p-2 rounded-xl border border-gray-800">
            <div className="text-[8px] font-bold text-orange-500 uppercase text-center">Multiplier</div>
            <div className="text-center font-bold mt-1 text-sm">x 2</div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-4 grid grid-cols-2 gap-4">
        <button 
          onClick={() => handleTrade('Even')}
          disabled={isTrading}
          className="bg-green-600 rounded-2xl p-4 flex flex-col items-start gap-1 shadow-lg shadow-green-600/30 active:scale-95 transition-all disabled:opacity-50"
        >
          <span className="text-lg font-bold">Even</span>
          <div className="flex items-center justify-between w-full">
            <span className="text-[10px] opacity-80">95.2%</span>
            <div className="text-right">
              <div className="text-xs font-bold">${(stake * 1.952).toFixed(2)}</div>
              <div className="text-[8px] opacity-60">Payout</div>
            </div>
          </div>
        </button>
        <button 
          onClick={() => handleTrade('Odd')}
          disabled={isTrading}
          className="bg-red-600 rounded-2xl p-4 flex flex-col items-start gap-1 shadow-lg shadow-red-600/30 active:scale-95 transition-all disabled:opacity-50"
        >
          <span className="text-lg font-bold">Odd</span>
          <div className="flex items-center justify-between w-full">
            <span className="text-[10px] opacity-80">95.2%</span>
            <div className="text-right">
              <div className="text-xs font-bold">${(stake * 1.952).toFixed(2)}</div>
              <div className="text-[8px] opacity-60">Payout</div>
            </div>
          </div>
        </button>
      </div>

      {/* Extra Link for Withdraw */}
      <div className="mt-4 px-4 pb-4 text-center">
        <Link to="/withdraw" className="text-xs text-gray-500 font-bold uppercase tracking-widest hover:text-[#2196f3] transition-colors">
          Need to withdraw? Go to Withdraw Page &gt;
        </Link>
      </div>
    </div>
  );
};

export default Home;
