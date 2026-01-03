
import React from 'react';
import { Book, Bookmark, ShieldCheck, Scale } from 'lucide-react';

const RulesInheritance: React.FC = () => {
  return (
    <div className="space-y-6 max-w-2xl mx-auto px-1">
      <div className="text-center mb-10">
        <div className="inline-block p-5 bg-blue-500/10 rounded-3xl mb-5 border border-blue-400/20 shadow-2xl">
          <Scale className="text-blue-400" size={44} />
        </div>
        <h1 className="text-3xl font-black text-white leading-tight tracking-tight uppercase">Science of Inheritance</h1>
        <p className="text-xs text-slate-400 font-bold tracking-widest mt-2 uppercase">Shafi'i Legal Principles</p>
      </div>

      <section className="bg-slate-900/40 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/10">
        <div className="flex items-center space-x-4 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-blue-600/20 border border-blue-400/30 flex items-center justify-center text-blue-400 font-black text-lg shadow-lg">1</div>
          <h2 className="text-xl font-black text-slate-100 tracking-wide uppercase">Fixed Share Heirs</h2>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed mb-6 font-medium italic border-l-2 border-blue-400/30 pl-4">
          "The specific portions (Fara'id) defined in sacred law."
        </p>
        <div className="space-y-3">
          <ShareCard title="Husband" share="1/2 | 1/4" condition="1/2 if no issue exists, 1/4 if they do." />
          <ShareCard title="Wife" share="1/4 | 1/8" condition="1/4 if no issue exists, 1/8 if they do." />
          <ShareCard title="Father" share="1/6 + Residue" condition="1/6 if male issue exists; residue if none or only females." />
        </div>
      </section>

      <section className="bg-slate-900/40 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/10">
        <div className="flex items-center space-x-4 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-amber-600/20 border border-amber-400/30 flex items-center justify-center text-amber-400 font-black text-lg shadow-lg">2</div>
          <h2 className="text-xl font-black text-slate-100 tracking-wide uppercase">Rule of Exclusion</h2>
        </div>
        <div className="p-5 bg-amber-500/10 rounded-2xl border border-amber-400/20 text-xs text-amber-200 leading-relaxed font-medium">
          <strong className="text-amber-400 uppercase block mb-1">Hajb (Blocking):</strong> In Shafi'i law, the Son and Father are primary blockers. They exclude distant relatives like siblings and grandparents to maintain the integrity of the immediate family unit.
        </div>
      </section>

      <section className="bg-slate-900/40 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/10">
        <div className="flex items-center space-x-4 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-purple-600/20 border border-purple-400/30 flex items-center justify-center text-purple-400 font-black text-lg shadow-lg">3</div>
          <h2 className="text-xl font-black text-slate-100 tracking-wide uppercase">Proportional Adjustment</h2>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed font-medium">
          When fixed shares exceed the total estate, the school applies <span className="text-purple-400 font-bold">'Awl</span> (Proportional Reduction) to ensure all entitled heirs receive their divinely mandated portion equitably.
        </p>
      </section>

      <div className="p-6 bg-gradient-to-br from-blue-700 to-indigo-900 text-white rounded-[2rem] shadow-2xl border border-white/10 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-110 transition-transform"></div>
        <h3 className="font-black flex items-center mb-4 text-sm uppercase tracking-widest">
          <Bookmark className="mr-3 text-blue-300" size={20} />
          Academic Rigor
        </h3>
        <p className="text-[11px] text-blue-100 leading-relaxed font-medium italic">
          Calculations verified against standard legal texts of the Shafi'i school. Note: The Bait al-Mal receives any residual surplus that cannot be returned to spouses.
        </p>
      </div>
    </div>
  );
};

const ShareCard = ({ title, share, condition }: { title: string, share: string, condition: string }) => (
  <div className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-blue-400/30 transition-all group">
    <div className="flex justify-between items-center">
      <span className="text-xs font-black text-slate-100 uppercase tracking-widest">{title}</span>
      <span className="text-sm font-black text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.3)]">{share}</span>
    </div>
    <p className="text-[10px] text-slate-500 mt-2 font-bold uppercase tracking-tighter leading-tight group-hover:text-slate-400">{condition}</p>
  </div>
);

export default RulesInheritance;
