
import React from 'react';
import { Wallet, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';

const RulesZakah: React.FC = () => {
  return (
    <div className="space-y-6 max-w-2xl mx-auto px-1">
      <div className="text-center mb-10">
        <div className="inline-block p-5 bg-purple-500/10 rounded-3xl mb-5 border border-purple-400/20 shadow-2xl">
          <Wallet className="text-purple-400" size={44} />
        </div>
        <h1 className="text-3xl font-black text-white leading-tight tracking-tight uppercase">Zakah Obligations</h1>
        <p className="text-xs text-slate-400 font-bold tracking-widest mt-2 uppercase">Shafi'i Wealth Tax Guidelines</p>
      </div>

      <section className="bg-slate-900/40 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/10">
        <h2 className="text-xl font-black text-slate-100 mb-6 flex items-center uppercase tracking-wide">
          <CheckCircle2 className="text-emerald-400 mr-3" size={24} />
          Obligation Criteria
        </h2>
        <div className="space-y-5">
          <ConditionItem 
            title="Nisab (Threshold)" 
            desc="The equivalent of 85 grams of 24K gold. Wealth below this is exempt from tax."
          />
          <ConditionItem 
            title="Hawl (Lunar Year)" 
            desc="One complete lunar year must elapse while the wealth remains above the threshold."
          />
          <ConditionItem 
            title="Milk al-Tamm (Ownership)" 
            desc="The individual must have full, legal, and unrestricted possession of the asset."
          />
        </div>
      </section>

      <section className="bg-slate-900/40 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/10">
        <h2 className="text-xl font-black text-slate-100 mb-6 flex items-center uppercase tracking-wide">
          <AlertCircle className="text-blue-400 mr-3" size={24} />
          Taxable Asset Pool
        </h2>
        <ul className="grid grid-cols-1 gap-3">
          <AssetItem name="Cash & Savings" status="2.5%" />
          <AssetItem name="Gold & Silver" status="2.5%" />
          <AssetItem name="Business Assets" status="2.5%" />
          <AssetItem name="Livestock" status="Scaled Rate" />
        </ul>
      </section>

      <div className="p-6 bg-slate-950/80 rounded-3xl border border-blue-400/20 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl"></div>
        <h4 className="text-[10px] font-black text-blue-300 uppercase tracking-widest mb-3 flex items-center">
          <ShieldCheck className="mr-2" size={14} /> Recipient Categories
        </h4>
        <p className="text-xs text-slate-400 leading-relaxed font-medium">
          The Shafi'i school adheres strictly to the eight scriptural categories: the poor, the needy, administrators, those whose hearts are reconciled, captives, debtors, those in the way of Allah, and travelers.
        </p>
      </div>
    </div>
  );
};

const ConditionItem = ({ title, desc }: { title: string, desc: string }) => (
  <div className="flex flex-col group">
    <span className="text-sm font-black text-slate-100 uppercase tracking-wider group-hover:text-blue-400 transition-colors">{title}</span>
    <span className="text-xs text-slate-400 mt-2 leading-relaxed font-medium">{desc}</span>
  </div>
);

const AssetItem = ({ name, status }: { name: string, status: string }) => (
  <li className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-all">
    <span className="text-xs font-black text-slate-200 uppercase tracking-widest">{name}</span>
    <span className="text-[10px] font-black bg-blue-600/20 text-blue-300 px-3 py-1.5 rounded-lg border border-blue-400/30 uppercase tracking-widest">{status}</span>
  </li>
);

export default RulesZakah;
