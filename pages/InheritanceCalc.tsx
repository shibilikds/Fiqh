
import React, { useState } from 'react';
import { HeirInput, Page, ShareResult, School } from '../types';
import { calculateInheritance } from '../services/inheritanceEngine';
import { ArrowLeft, User, Plus, Minus, Calculator, Users, HelpCircle } from 'lucide-react';

interface Props {
  mode: 'share' | 'amount';
  setPage: (page: Page) => void;
  school: School;
}

const InheritanceCalc: React.FC<Props> = ({ mode, setPage, school }) => {
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

  const schoolName = school.charAt(0).toUpperCase() + school.slice(1);

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
    const res = calculateInheritance(inputs, mode === 'amount' ? totalAmount : undefined, school);
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
      <div className="space-y-6 lg:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16">
        <button onClick={() => setResults(null)} className="flex items-center text-blue-400 text-sm font-black uppercase tracking-[0.2em] hover:text-blue-300 transition-colors">
          <ArrowLeft size={16} className="mr-2" /> Adjust Heirs
        </button>

        <div className="bg-slate-900/60 backdrop-blur-xl rounded-[2.5rem] p-6 lg:p-10 shadow-2xl border border-white/10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight flex items-center">
                <Calculator className="mr-4 text-blue-400" size={32} />
                Distribution Report
              </h2>
              <p className="text-[10px] text-blue-400 font-black uppercase tracking-[0.2em] mt-1">School: {schoolName}</p>
            </div>
            {mode === 'amount' && (
              <div className="text-left sm:text-right">
                <span className="block text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Total Estate</span>
                <span className="text-xl font-black text-blue-400">₹{totalAmount.toLocaleString()}</span>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            {results.map((res, i) => {
              const count = getHeirCount(res.name);
              return (
                <div key={i} className="p-6 bg-white/5 rounded-3xl border border-white/5 hover:border-blue-500/30 transition-all group relative overflow-hidden">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-black text-slate-100 text-lg tracking-wide flex items-center">
                        {res.name}
                        {count > 1 && (
                          <span className="ml-3 px-2 py-0.5 bg-blue-500/20 text-blue-300 text-[9px] rounded-md border border-blue-400/20 uppercase tracking-widest">
                            {count} persons
                          </span>
                        )}
                      </h3>
                      <p className="text-[11px] text-slate-400 font-bold leading-relaxed mt-2 uppercase tracking-tighter">
                        {res.description}
                      </p>
                    </div>
                    <div className="text-right shrink-0 ml-4">
                      <div className="text-blue-400 font-black text-2xl drop-shadow-[0_0_10px_rgba(96,165,250,0.3)]">{res.fraction}</div>
                      <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">{res.percentage.toFixed(2)}%</div>
                    </div>
                  </div>

                  {mode === 'amount' && res.amount !== undefined && (
                    <div className="mt-6 flex flex-wrap gap-3">
                      <div className="bg-blue-600/20 border border-blue-400/30 px-4 py-2 rounded-2xl text-sm font-black text-blue-300 shadow-lg">
                        Total: ₹{res.amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </div>
                      {count > 1 && (
                        <div className="bg-indigo-600/20 border border-indigo-400/30 px-4 py-2 rounded-2xl text-sm font-black text-indigo-300 flex items-center shadow-lg">
                          <Users size={14} className="mr-2" />
                          Each: ₹{(res.amount / count).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </div>
                      )}
                    </div>
                  )}

                  {mode !== 'amount' && count > 1 && (
                    <div className="mt-4 inline-flex items-center px-4 py-2 bg-indigo-500/10 border border-indigo-400/20 rounded-2xl text-[10px] font-black text-indigo-400 uppercase tracking-widest">
                      Individual Share: {(res.percentage / count).toFixed(2)}%
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          <div className="mt-12 p-8 bg-blue-900/20 rounded-[2rem] text-xs lg:text-sm text-blue-200 leading-relaxed border border-blue-400/20 italic shadow-xl">
            <strong className="text-blue-300 uppercase block mb-3 not-italic tracking-[0.2em] font-black">Legal Compliance Statement:</strong> 
            This calculation is based on the authoritative rules of the {schoolName} school. 
            {['shafi', 'maliki'].includes(school) ? "Surplus return (Radd) is not distributed to heirs in this madhhab." : "Surplus residue is returned to blood relatives (Radd) in accordance with the school's specific principles."}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10 max-w-5xl mx-auto w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button onClick={() => setPage(Page.Home)} className="p-3 bg-slate-900 border border-white/10 rounded-2xl text-blue-400 hover:bg-slate-800 transition-all shadow-lg">
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-2xl lg:text-3xl font-black text-white tracking-tight uppercase">
            {mode === 'amount' ? 'Financial Estate' : 'Fractional Shares'}
          </h2>
        </div>
        <div className="hidden sm:flex items-center text-slate-500 text-[10px] font-black uppercase tracking-widest bg-white/5 px-4 py-2 rounded-2xl border border-white/5">
          <span className="mr-2 px-2 py-1 bg-blue-600 text-white rounded text-[8px]">{schoolName}</span>
          Madhhab Rules
        </div>
      </div>

      <div className="bg-slate-900/50 backdrop-blur-xl rounded-[2.5rem] p-6 lg:p-10 shadow-2xl border border-white/10 space-y-8 lg:space-y-12">
        {mode === 'amount' && (
          <div className="max-w-md mx-auto space-y-3">
            <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Total Net Estate (INR)</label>
            <div className="relative">
              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-blue-400 font-black text-xl">₹</span>
              <input 
                type="number" 
                placeholder="0.00"
                className="w-full pl-12 p-6 bg-slate-950 border border-white/10 rounded-3xl focus:ring-4 focus:ring-blue-500/20 focus:outline-none transition-all text-white font-black text-2xl placeholder-slate-900"
                value={totalAmount || ''}
                onChange={(e) => setTotalAmount(Number(e.target.value))}
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <ToggleButton label="Husband" active={inputs.husband} onClick={() => toggleBoolean('husband')} />
          <Counter label="Wives" value={inputs.wife} onDelta={(d) => adjustNumber('wife', d)} max={4} disabled={inputs.husband} />
          <ToggleButton label="Father" active={inputs.father} onClick={() => toggleBoolean('father')} />
          <ToggleButton label="Mother" active={inputs.mother} onClick={() => toggleBoolean('mother')} />
          <Counter label="Sons" value={inputs.sons} onDelta={(d) => adjustNumber('sons', d)} />
          <Counter label="Daughters" value={inputs.daughters} onDelta={(d) => adjustNumber('daughters', d)} />
          <Counter label="Full Bros" value={inputs.fullBrothers} onDelta={(d) => adjustNumber('fullBrothers', d)} />
          <Counter label="Full Sis" value={inputs.fullSisters} onDelta={(d) => adjustNumber('fullSisters', d)} />
        </div>

        <div className="max-w-md mx-auto pt-4">
          <button 
            onClick={handleCalculate}
            className="w-full bg-blue-600 text-white py-6 rounded-3xl font-black flex items-center justify-center space-x-4 shadow-[0_20px_40px_rgba(37,99,235,0.25)] hover:bg-blue-500 active:scale-[0.98] transition-all uppercase tracking-[0.2em] text-lg lg:text-xl"
          >
            <Calculator size={28} />
            <span>Calculate Distribution</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const ToggleButton = ({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`flex items-center justify-between p-6 rounded-3xl border transition-all duration-300 ${active ? 'bg-blue-600/20 border-blue-400 text-blue-100 shadow-[inset_0_0_20px_rgba(59,130,246,0.1)]' : 'bg-slate-950 border-white/5 text-slate-500 hover:border-white/20 hover:bg-white/5'}`}
  >
    <span className="text-[10px] lg:text-xs font-black uppercase tracking-widest">{label}</span>
    <div className={`w-5 h-5 rounded-full border-2 transition-all duration-300 ${active ? 'bg-blue-400 border-blue-400 scale-125 shadow-[0_0_15px_rgba(96,165,250,0.6)]' : 'bg-slate-800 border-slate-700'}`}></div>
  </button>
);

const Counter = ({ label, value, onDelta, max = 99, disabled = false }: { label: string, value: number, onDelta: (d: number) => void, max?: number, disabled?: boolean }) => (
  <div className={`flex flex-col p-6 rounded-3xl border bg-slate-950 border-white/5 ${disabled ? 'opacity-20 pointer-events-none' : 'hover:border-white/20 transition-all'}`}>
    <span className="text-[10px] lg:text-xs font-black uppercase tracking-widest text-slate-500 mb-5">{label}</span>
    <div className="flex items-center justify-between">
      <button onClick={() => onDelta(-1)} className="p-3 bg-slate-900 rounded-2xl border border-white/10 text-slate-400 hover:text-blue-400 hover:border-blue-400/50 transition-all">
        <Minus size={18} />
      </button>
      <span className="font-black text-white text-2xl lg:text-3xl tracking-tighter">{value}</span>
      <button onClick={() => onDelta(1)} className="p-3 bg-slate-900 rounded-2xl border border-white/10 text-slate-400 hover:text-blue-400 hover:border-blue-400/50 transition-all">
        <Plus size={18} />
      </button>
    </div>
  </div>
);

export default InheritanceCalc;
