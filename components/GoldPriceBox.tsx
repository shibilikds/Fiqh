
import React, { useEffect, useState } from 'react';
import { Coins, RefreshCcw } from 'lucide-react';
import { GoldPrice } from '../types';
import { fetchGoldPrice } from '../services/goldApi';

const GoldPriceBox: React.FC = () => {
  const [data, setData] = useState<GoldPrice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGoldPrice().then(res => {
      setData(res);
      setLoading(false);
    });
  }, []);

  return (
    <div className="bg-slate-900/40 backdrop-blur-xl rounded-2xl p-5 shadow-2xl border border-white/10 w-full mb-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="flex items-center space-x-3">
          <div className="bg-amber-500/20 p-2.5 rounded-xl border border-amber-500/30">
            <Coins className="text-amber-400" size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100">Gold Price (24K)</h3>
            <p className="text-[11px] text-slate-400 uppercase tracking-widest font-semibold">Live Reference</p>
          </div>
        </div>
        {loading ? (
          <RefreshCcw className="animate-spin text-blue-400" size={16} />
        ) : (
          <div className="flex items-center text-[10px] text-cyan-400 bg-cyan-400/10 px-2.5 py-1 rounded-full font-bold border border-cyan-400/30 uppercase tracking-tighter">
            <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mr-2 animate-pulse"></div>
            Market Live
          </div>
        )}
      </div>
      
      <div className="flex items-baseline space-x-2 relative z-10">
        <span className="text-3xl font-black text-white tracking-tight">
          {loading ? '---' : `₹ ${data?.price.toLocaleString()}`}
        </span>
        <span className="text-sm text-slate-400 font-bold uppercase tracking-wider">/ gram</span>
      </div>
      
      <div className="mt-4 pt-4 border-t border-white/5 text-[10px] text-slate-400 italic relative z-10">
        * Reference for calculations only. 
        Nisāb based on 85g 24K gold standard.
      </div>
    </div>
  );
};

export default GoldPriceBox;
