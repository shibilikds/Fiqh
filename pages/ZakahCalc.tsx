
import React, { useState, useEffect } from 'react';
import { ZakahInputs, Page } from '../types';
import { fetchGoldPrice, NISAB_GOLD_GRAMS } from '../services/goldApi';
import { ArrowLeft, Wallet, Info, AlertTriangle, ShieldCheck } from 'lucide-react';

interface Props {
  setPage: (page: Page) => void;
}

const ZakahCalc: React.FC<Props> = ({ setPage }) => {
  const [inputs, setInputs] = useState<ZakahInputs>({
    cash: 0,
    goldWeight: 0,
    silverWeight: 0,
    businessAssets: 0,
    debts: 0
  });
  const [goldPrice, setGoldPrice] = useState<number>(0);
  const [calculated, setCalculated] = useState(false);

  useEffect(() => {
    fetchGoldPrice().then(res => setGoldPrice(res.price));
  }, []);

  const thresholdValue = goldPrice * NISAB_GOLD_GRAMS;
  const totalAssets = inputs.cash + (inputs.goldWeight * goldPrice) + inputs.businessAssets; 
  const netWealth = totalAssets; 
  const thresholdReached = netWealth >= thresholdValue;
  const zakahPayable = thresholdReached ? netWealth * 0.025 : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <button onClick={() => setPage(Page.Home)} className="p-2.5 bg-slate-900 border border-white/10 rounded-xl text-blue-400 hover:bg-slate-800 transition-all">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-xl font-black text-white tracking-tight uppercase">Zakah Calculator</h2>
      </div>

      <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/10 space-y-6">
        <div className="bg-blue-600/10 p-5 rounded-2xl border border-blue-400/20 flex items-start space-x-4">
          <ShieldCheck className="text-blue-400 shrink-0" size={20} />
          <div>
            <h4 className="text-[10px] font-black text-blue-300 uppercase tracking-widest">Shafi'i Jurisprudence</h4>
            <p className="text-xs text-blue-100 leading-relaxed mt-1 font-medium">
              Debts do NOT reduce the threshold (Nisab) for cash/gold assets in the authoritative Shafi'i position. Zakah is due on the gross taxable wealth.
            </p>
          </div>
        </div>

        <div className="space-y-5">
          <InputGroup label="Cash & Bank Balance (INR)" value={inputs.cash} onChange={(v) => setInputs({...inputs, cash: v})} />
          <InputGroup label="Gold Weight (Grams)" value={inputs.goldWeight} onChange={(v) => setInputs({...inputs, goldWeight: v})} />
          <InputGroup label="Trade Inventory (INR)" value={inputs.businessAssets} onChange={(v) => setInputs({...inputs, businessAssets: v})} />
          
          <div className="pt-2 opacity-30">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center">
              Personal Debts (INR) <AlertTriangle size={12} className="ml-2" />
            </label>
            <input 
              type="number" 
              disabled
              className="w-full p-4 bg-slate-950/50 border border-white/5 rounded-2xl cursor-not-allowed font-bold text-slate-600"
              placeholder="Not deductible in this school"
            />
          </div>
        </div>

        <button 
          onClick={() => setCalculated(true)}
          className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black shadow-[0_10px_30px_rgba(37,99,235,0.3)] hover:bg-blue-500 active:scale-[0.98] transition-all uppercase tracking-widest"
        >
          Calculate Zakah
        </button>

        {calculated && (
          <div className="mt-8 p-6 bg-slate-950/80 rounded-3xl border border-blue-400/30 animate-in zoom-in duration-300 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
            
            <div className="flex justify-between items-center mb-5 relative z-10">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Threshold Status</span>
              <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg ${thresholdReached ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'}`}>
                {thresholdReached ? 'Met (Wajib)' : 'Not Met'}
              </span>
            </div>
            
            <div className="space-y-1 mb-6 relative z-10">
              <p className="text-[10px] text-blue-300 uppercase font-black tracking-widest">Total Payable (2.5%)</p>
              <h3 className="text-4xl font-black text-white tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                ₹ {zakahPayable.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </h3>
            </div>

            <p className="mt-4 text-[10px] text-slate-500 leading-relaxed text-center font-bold uppercase tracking-tighter relative z-10">
              * Based on {NISAB_GOLD_GRAMS}g 24K Gold standard.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const InputGroup = ({ label, value, onChange }: { label: string, value: number, onChange: (v: number) => void }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <input 
      type="number" 
      className="w-full p-4 bg-slate-950 border border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:outline-none transition-all font-bold text-white text-lg placeholder-slate-800"
      value={value || ''}
      onChange={(e) => onChange(Number(e.target.value))}
    />
  </div>
);

export default ZakahCalc;
