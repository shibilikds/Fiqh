
import React, { useState } from 'react';
import { HeirInput, Page, ShareResult } from '../types';
import { calculateInheritance } from '../services/inheritanceEngine';
import { ArrowLeft, User, Plus, Minus, Calculator, Users } from 'lucide-react';

interface Props {
  mode: 'share' | 'amount';
  setPage: (page: Page) => void;
}

const InheritanceCalc: React.FC<Props> = ({ mode, setPage }) => {
  const [inputs, setInputs] = useState<HeirInput>({
    husband: false,
    wife: 0,
    father: false,
    mother: false,
    sons: 0,
    daughters: 0,
    fullBrothers: 0,
    fullSisters: 0
  });
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [results, setResults] = useState<ShareResult[] | null>(null);

  const toggleBoolean = (key: keyof HeirInput) => {
    setInputs(prev => ({
      ...prev,
      [key]: !prev[key],
      wife: key === 'husband' && !prev.husband ? 0 : prev.wife,
      husband: key === 'wife' ? false : (key === 'husband' ? !prev.husband : prev.husband)
    }));
  };

  const adjustNumber = (key: keyof HeirInput, delta: number) => {
    setInputs(prev => ({
      ...prev,
      [key]: Math.max(0, (prev[key] as number) + delta)
    }));
  };

  const handleCalculate = () => {
    const res = calculateInheritance(inputs, mode === 'amount' ? totalAmount : undefined);
    setResults(res);
  };

  const getHeirCount = (name: string): number => {
    if (name.includes('Wives')) return inputs.wife;
    if (name.includes('Sons')) return inputs.sons;
    if (name.includes('Daughters')) return inputs.daughters;
    return 1;
  };

  if (results) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
        <button onClick={() => setResults(null)} className="flex items-center text-blue-400 text-sm font-black uppercase tracking-widest hover:text-blue-300 transition-colors">
          <ArrowLeft size={16} className="mr-2" /> Adjust Heirs
        </button>

        <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/10">
          <h2 className="text-xl font-black text-white mb-6 tracking-tight flex items-center">
            <Calculator className="mr-3 text-blue-400" size={24} />
            Distribution Results
          </h2>
          <div className="space-y-4">
            {results.map((res, i) => {
              const count = getHeirCount(res.name);
              return (
                <div key={i} className="p-5 bg-white/5 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-all group">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-black text-slate-100 tracking-wide flex items-center">
                        {res.name}
                        {count > 1 && (
                          <span className="ml-2 px-2 py-0.5 bg-blue-500/20 text-blue-300 text-[9px] rounded-md border border-blue-400/20">
                            {count} persons
                          </span>
                        )}
                      </h3>
                      <p className="text-[10px] text-slate-400 font-medium leading-relaxed mt-1 uppercase tracking-tighter">
                        {res.description.split('.')[0]}.
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-blue-400 font-black text-xl">{res.fraction}</div>
                      <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{res.percentage.toFixed(2)}%</div>
                    </div>
                  </div>

                  {mode === 'amount' && res.amount !== undefined && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      <div className="bg-blue-500/10 border border-blue-400/20 px-3 py-1.5 rounded-xl text-[11px] font-black text-blue-300">
                        Total: ₹{res.amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </div>
                      {count > 1 && (
                        <div className="bg-indigo-500/10 border border-indigo-400/20 px-3 py-1.5 rounded-xl text-[11px] font-black text-indigo-300 flex items-center">
                          <Users size={12} className="mr-2" />
                          Each: ₹{(res.amount / count).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </div>
                      )}
                    </div>
                  )}

                  {mode !== 'amount' && count > 1 && (
                    <div className="mt-3 text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
                      Individual Share: {(res.percentage / count).toFixed(2)}%
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          <div className="mt-8 p-5 bg-blue-900/20 rounded-2xl text-[10px] text-blue-200 leading-relaxed border border-blue-400/20 italic">
            <strong className="text-blue-300 uppercase block mb-1 not-italic">Note:</strong> 
            Shafi'i calculations do not allow "Radd" (Return) to spouses. If there is a surplus and no other heirs, it is held by the Public Treasury for the benefit of the community.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <button onClick={() => setPage(Page.Home)} className="p-2.5 bg-slate-900 border border-white/10 rounded-xl text-blue-400 hover:bg-slate-800 transition-all">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-xl font-black text-white tracking-tight">
          {mode === 'amount' ? 'Estate (Money)' : 'Fractions'} Calculator
        </h2>
      </div>

      <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/10 space-y-6">
        {mode === 'amount' && (
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Total Estate Value (INR)</label>
            <input 
              type="number" 
              placeholder="e.g. 1,000,000"
              className="w-full p-4 bg-slate-950 border border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:outline-none transition-all text-white font-bold text-lg"
              value={totalAmount || ''}
              onChange={(e) => setTotalAmount(Number(e.target.value))}
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <ToggleButton label="Husband" active={inputs.husband} onClick={() => toggleBoolean('husband')} />
          <Counter label="Wives" value={inputs.wife} onDelta={(d) => adjustNumber('wife', d)} max={4} disabled={inputs.husband} />
          <ToggleButton label="Father" active={inputs.father} onClick={() => toggleBoolean('father')} />
          <ToggleButton label="Mother" active={inputs.mother} onClick={() => toggleBoolean('mother')} />
          <Counter label="Sons" value={inputs.sons} onDelta={(d) => adjustNumber('sons', d)} />
          <Counter label="Daughters" value={inputs.daughters} onDelta={(d) => adjustNumber('daughters', d)} />
        </div>

        <button 
          onClick={handleCalculate}
          className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black flex items-center justify-center space-x-3 shadow-[0_10px_30px_rgba(37,99,235,0.3)] hover:bg-blue-500 active:scale-[0.98] transition-all uppercase tracking-widest"
        >
          <Calculator size={22} />
          <span>Calculate Distribution</span>
        </button>
      </div>
    </div>
  );
};

const ToggleButton = ({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${active ? 'bg-blue-600/20 border-blue-400 text-blue-100 shadow-[inset_0_0_20px_rgba(59,130,246,0.1)]' : 'bg-slate-950 border-white/5 text-slate-500 hover:border-white/20'}`}
  >
    <span className="text-[10px] font-black uppercase tracking-wider">{label}</span>
    <div className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${active ? 'bg-blue-400 border-blue-400 scale-110 shadow-[0_0_10px_rgba(96,165,250,0.5)]' : 'bg-slate-800 border-slate-700'}`}></div>
  </button>
);

const Counter = ({ label, value, onDelta, max = 99, disabled = false }: { label: string, value: number, onDelta: (d: number) => void, max?: number, disabled?: boolean }) => (
  <div className={`flex flex-col p-4 rounded-2xl border bg-slate-950 border-white/5 ${disabled ? 'opacity-20 pointer-events-none' : ''}`}>
    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">{label}</span>
    <div className="flex items-center justify-between">
      <button onClick={() => onDelta(-1)} className="p-2 bg-slate-900 rounded-xl border border-white/10 hover:text-blue-400 transition-colors">
        <Minus size={14} />
      </button>
      <span className="font-black text-white text-lg">{value}</span>
      <button onClick={() => onDelta(1)} className="p-2 bg-slate-900 rounded-xl border border-white/10 hover:text-blue-400 transition-colors">
        <Plus size={14} />
      </button>
    </div>
  </div>
);

export default InheritanceCalc;
