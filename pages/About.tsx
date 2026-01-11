
import React from 'react';
import { Info, Mail, Globe, ShieldCheck, Scale, GraduationCap, Code, Server } from 'lucide-react';
import { Page, School, Language } from '../types';
import { t } from '../services/translations';

interface Props {
  setPage: (page: Page) => void;
  school: School;
  language: Language;
}

const About: React.FC<Props> = ({ language }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-16">
      <div className="bg-slate-900/40 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="flex items-center space-x-4 mb-5 relative z-10">
          <div className="p-2 bg-blue-500/20 rounded-xl border border-blue-400/30">
            <ShieldCheck className="text-blue-400" size={24} />
          </div>
          <h2 className="text-xl font-black text-white tracking-tight uppercase">{t('about.title', language)}</h2>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed mb-4 font-medium relative z-10">
          {t('about.shafi_intro', language)}
        </p>
        <p className="text-sm text-slate-300 leading-relaxed font-medium relative z-10">
          {t('about.hub_purpose', language)}
        </p>
      </div>

      <div className="bg-slate-950 rounded-[2.5rem] p-8 shadow-2xl border border-white/10 relative overflow-hidden group">
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-500/5 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700"></div>
        <div className="flex items-center space-x-4 mb-8">
          <div className="p-2 bg-indigo-500/20 rounded-xl border border-indigo-400/30">
            <Code className="text-indigo-400" size={24} />
          </div>
          <h2 className="text-xl font-black text-white uppercase tracking-tight">{t('about.tech_specs', language)}</h2>
        </div>
        
        <div className="space-y-5">
          <div className="p-5 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-all">
            <div className="flex items-center text-blue-300 font-black text-[10px] uppercase tracking-widest mb-3">
              <Server size={14} className="mr-3" />
              {t('about.engine_title', language)}
            </div>
            <p className="text-[11px] text-slate-400 font-bold leading-relaxed uppercase tracking-tighter" dangerouslySetInnerHTML={{ __html: t('about.engine_desc', language, { file: '<code class="bg-slate-800 px-2 py-0.5 rounded text-blue-300 border border-blue-400/20 mx-1">inheritanceEngine.ts</code>' }) }} />
          </div>

          <div className="p-5 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-all">
            <div className="flex items-center text-purple-300 font-black text-[10px] uppercase tracking-widest mb-3">
              <GraduationCap size={14} className="mr-3" />
              {t('about.content_title', language)}
            </div>
            <p className="text-[11px] text-slate-400 font-bold leading-relaxed uppercase tracking-tighter" dangerouslySetInnerHTML={{ __html: t('about.content_desc', language, { file1: '<code class="bg-slate-800 px-2 py-0.5 rounded text-purple-300 border border-purple-400/20 mx-1">RulesInheritance.tsx</code>', file2: '<code class="bg-slate-800 px-2 py-0.5 rounded text-purple-300 border border-purple-400/20 mx-1">RulesZakah.tsx</code>' }) }} />
          </div>
        </div>
      </div>

      <div className="bg-blue-900/20 rounded-3xl p-6 border border-blue-400/20 shadow-xl">
        <h3 className="text-xs font-black text-blue-300 mb-4 flex items-center uppercase tracking-widest">
          <Mail className="mr-3" size={16} /> {t('about.contact_title', language)}
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed mb-5 font-medium">
          {t('about.contact_desc', language)}
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
          {t('about.version', language)}
        </p>
        <p className="text-[9px] text-slate-700 mt-2 font-bold uppercase">
          {t('about.disclaimer', language)}
        </p>
      </div>
    </div>
  );
};

export default About;