
import React from 'react';
import { Info, Mail, Globe, ShieldCheck, Scale, GraduationCap, Code, Server } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-16">
      {/* App Information */}
      <div className="bg-slate-900/40 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="flex items-center space-x-4 mb-5 relative z-10">
          <div className="p-2 bg-blue-500/20 rounded-xl border border-blue-400/30">
            <ShieldCheck className="text-blue-400" size={24} />
          </div>
          <h2 className="text-xl font-black text-white tracking-tight uppercase">About the Hub</h2>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed mb-4 font-medium relative z-10">
          Founded by Imam Muhammad ibn Idris al-Shafi'i, the Shafi'i Madhhab is celebrated for its precise legal reasoning and textual fidelity. 
        </p>
        <p className="text-sm text-slate-300 leading-relaxed font-medium relative z-10">
          This hub serves as a modern digital companion for students of the school, providing mathematically accurate calculations and rule summaries based on authoritative Shafi'i manuals.
        </p>
      </div>

      {/* Developer Guide Section */}
      <div className="bg-slate-950 rounded-[2.5rem] p-8 shadow-2xl border border-white/10 relative overflow-hidden group">
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-500/5 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700"></div>
        <div className="flex items-center space-x-4 mb-8">
          <div className="p-2 bg-indigo-500/20 rounded-xl border border-indigo-400/30">
            <Code className="text-indigo-400" size={24} />
          </div>
          <h2 className="text-xl font-black text-white uppercase tracking-tight">Technical Specs</h2>
        </div>
        
        <div className="space-y-5">
          <div className="p-5 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-all">
            <div className="flex items-center text-blue-300 font-black text-[10px] uppercase tracking-widest mb-3">
              <Server size={14} className="mr-3" />
              Engine Architecture
            </div>
            <p className="text-[11px] text-slate-400 font-bold leading-relaxed uppercase tracking-tighter">
              Logic centralized in <code className="bg-slate-800 px-2 py-0.5 rounded text-blue-300 border border-blue-400/20 mx-1">inheritanceEngine.ts</code>. Built with modular Shafi'i rulesets for future expansion.
            </p>
          </div>

          <div className="p-5 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-all">
            <div className="flex items-center text-purple-300 font-black text-[10px] uppercase tracking-widest mb-3">
              <GraduationCap size={14} className="mr-3" />
              Content Strategy
            </div>
            <p className="text-[11px] text-slate-400 font-bold leading-relaxed uppercase tracking-tighter">
              Educational modules decoupled into <code className="bg-slate-800 px-2 py-0.5 rounded text-purple-300 border border-purple-400/20 mx-1">RulesInheritance.tsx</code> and <code className="bg-slate-800 px-2 py-0.5 rounded text-purple-300 border border-purple-400/20 mx-1">RulesZakah.tsx</code> for easy editorial updates.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-blue-900/20 rounded-3xl p-6 border border-blue-400/20 shadow-xl">
        <h3 className="text-xs font-black text-blue-300 mb-4 flex items-center uppercase tracking-widest">
          <Mail className="mr-3" size={16} /> Contact & Support
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed mb-5 font-medium">
          For academic clarifications or to report calculation edge-cases, please connect with our editorial team.
        </p>
        <div className="space-y-3">
          <div className="flex items-center text-[10px] text-blue-400 font-black uppercase tracking-widest">
            <Globe className="mr-3" size={14} /> www.shafiifiqh.hub
          </div>
          <div className="flex items-center text-[10px] text-blue-400 font-black uppercase tracking-widest">
            <Mail className="mr-3" size={14} /> desk@shafiifiqh.hub
          </div>
        </div>
      </div>

      <div className="text-center py-6">
        <p className="text-[10px] text-slate-600 uppercase tracking-[0.2em] font-black">
          v1.2.0 • Madhhab Series
        </p>
        <p className="text-[9px] text-slate-700 mt-2 font-bold uppercase">
          Academic Research Only.
        </p>
      </div>
    </div>
  );
};

export default About;
