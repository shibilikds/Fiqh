
import React from 'react';
import { Scale, ShieldCheck, Bookmark, AlertCircle, Info } from 'lucide-react';
import { School } from '../types';

const RulesInheritance: React.FC<{ school: School }> = ({ school }) => {
  const isHanafi = school === School.HANAFI;
  const isShafi = school === School.SHAFI;
  const isMaliki = school === School.MALIKI;
  const isHanbali = school === School.HANBALI;

  const schoolName = school.charAt(0).toUpperCase() + school.slice(1);

  return (
    <div className="space-y-6 max-w-2xl mx-auto px-1">
      <div className="text-center mb-10">
        <div className="inline-block p-5 bg-blue-500/10 rounded-3xl mb-5 border border-blue-400/20 shadow-2xl">
          <Scale className="text-blue-400" size={44} />
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight uppercase">{schoolName} INHERITANCE</h1>
        <p className="text-xs text-slate-400 font-bold tracking-widest mt-2 uppercase">Principles of {schoolName} Jurisprudence</p>
      </div>

      {/* Radd (Return) Section */}
      <section className="bg-slate-900/40 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/10">
        <div className="flex items-center space-x-3 mb-4">
          <AlertCircle className="text-blue-400" size={20} />
          <h2 className="text-xl font-black text-slate-100 uppercase tracking-wide">Al-Radd (The Return)</h2>
        </div>
        <div className={`p-5 rounded-2xl border ${isHanafi || isHanbali ? 'bg-emerald-500/10 border-emerald-400/20' : 'bg-rose-500/10 border-rose-400/20'}`}>
          <p className="text-xs font-medium leading-relaxed text-slate-200">
            {isHanafi || isHanbali 
              ? `The ${schoolName} school holds that if fixed shares do not exhaust the estate and no agnates (Asaba) exist, the surplus is returned to the sharers (except spouses) in proportion to their shares.`
              : `The ${schoolName} school traditionally maintains that surplus residue after fixed shares is transferred to the Bait al-Mal (Public Treasury) to benefit the Muslim community, rather than being returned to individual heirs.`}
          </p>
        </div>
      </section>

      {/* Specific Nuances */}
      <section className="bg-slate-900/40 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/10">
        <div className="flex items-center space-x-3 mb-4">
          <Info className="text-indigo-400" size={20} />
          <h2 className="text-xl font-black text-slate-100 uppercase tracking-wide">Key Distinctions</h2>
        </div>
        <div className="space-y-4">
          {isHanafi && (
            <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
              <h4 className="text-xs font-black text-blue-300 uppercase mb-1">Distant Kindred (Dhu al-Arham)</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed font-medium">Hanafis have a highly structured system for distant relatives (like aunts, cousins) inheriting in the complete absence of primary sharers and agnates.</p>
            </div>
          )}
          {(isShafi || isMaliki) && (
            <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
              <h4 className="text-xs font-black text-blue-300 uppercase mb-1">Public Treasury (Bait al-Mal)</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed font-medium">Strict adherence to scriptural shares. Surplus wealth is considered a communal asset managed by the state for public interest.</p>
            </div>
          )}
          {isHanbali && (
            <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
              <h4 className="text-xs font-black text-blue-300 uppercase mb-1">Specific Blood Ties</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed font-medium">Hanbalis emphasize specific scriptural proofs for Radd and have unique views on the grandmother's shares in complex cases.</p>
            </div>
          )}
        </div>
      </section>

      <div className="p-6 bg-gradient-to-br from-blue-700/20 to-indigo-900/20 rounded-[2rem] border border-blue-400/20 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/5 rounded-full blur-3xl"></div>
        <h3 className="font-black flex items-center mb-4 text-xs uppercase tracking-widest text-blue-300 relative z-10">
          <Bookmark className="mr-3" size={16} />
          Educational Summary
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed font-medium relative z-10 italic">
          Inheritance law ('Ilm al-Fara'id) is the bedrock of Islamic civil law. While the 2:1 male-to-female ratio and primary fixed shares are universally agreed upon by all Sunni schools, the treatment of surplus (Radd) and distant relatives remains a point of scholarly richness.
        </p>
      </div>
    </div>
  );
};

export default RulesInheritance;
