
import React from 'react';
import { Scale, ShieldCheck, Bookmark, AlertCircle, Info } from 'lucide-react';
import { School, Language } from '../types';
import { t } from '../services/translations';

interface Props {
  school: School;
  language: Language;
}

const RulesInheritance: React.FC<Props> = ({ school, language }) => {
  const isHanafi = school === School.HANAFI;
  const isShafi = school === School.SHAFI;
  const isMaliki = school === School.MALIKI;
  const isHanbali = school === School.HANBALI;

  const schoolName = t(`school.${school}`, language);
  
  const raddIsAppliedForThisCalculator = true;

  return (
    <div className="space-y-6 max-w-2xl mx-auto px-1">
      <div className="text-center mb-10">
        <div className="inline-block p-5 bg-blue-500/10 rounded-3xl mb-5 border border-blue-400/20 shadow-2xl">
          <Scale className="text-blue-400" size={44} />
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight uppercase">{t('rules.inheritance_page_title', language, { schoolName })}</h1>
        <p className="text-xs text-slate-400 font-bold tracking-widest mt-2 uppercase">{t('rules.inheritance_page_subtitle', language, { schoolName })}</p>
      </div>

      <section className="bg-slate-900/40 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/10">
        <div className="flex items-center space-x-3 mb-4">
          <AlertCircle className="text-blue-400" size={20} />
          <h2 className="text-xl font-black text-slate-100 uppercase tracking-wide">{t('rules.radd_title', language)}</h2>
        </div>
        <div className={`p-5 rounded-2xl border ${raddIsAppliedForThisCalculator ? 'bg-emerald-500/10 border-emerald-400/20' : 'bg-rose-500/10 border-rose-400/20'}`}>
          <p className="text-xs font-medium leading-relaxed text-slate-200">
            {t(raddIsAppliedForThisCalculator ? 'rules.radd_desc_applied' : 'rules.radd_desc_not_applied', language, { schoolName })}
          </p>
        </div>
      </section>

      <section className="bg-slate-900/40 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/10">
        <div className="flex items-center space-x-3 mb-4">
          <Info className="text-indigo-400" size={20} />
          <h2 className="text-xl font-black text-slate-100 uppercase tracking-wide">{t('rules.key_distinctions', language)}</h2>
        </div>
        <div className="space-y-4">
          {isHanafi && (
            <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
              <h4 className="text-xs font-black text-blue-300 uppercase mb-1">{t('rules.hanafi_distinction_title', language)}</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed font-medium">{t('rules.hanafi_distinction_desc', language)}</p>
            </div>
          )}
          {(isShafi || isMaliki) && (
            <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
              <h4 className="text-xs font-black text-blue-300 uppercase mb-1">{t('rules.shafi_maliki_distinction_title', language)}</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed font-medium">{t('rules.shafi_maliki_distinction_desc', language)}</p>
            </div>
          )}
          {isHanbali && (
            <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
              <h4 className="text-xs font-black text-blue-300 uppercase mb-1">{t('rules.hanbali_distinction_title', language)}</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed font-medium">{t('rules.hanbali_distinction_desc', language)}</p>
            </div>
          )}
        </div>
      </section>

      <div className="p-6 bg-gradient-to-br from-blue-700/20 to-indigo-900/20 rounded-[2rem] border border-blue-400/20 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/5 rounded-full blur-3xl"></div>
        <h3 className="font-black flex items-center mb-4 text-xs uppercase tracking-widest text-blue-300 relative z-10">
          <Bookmark className="mr-3" size={16} />
          {t('rules.educational_summary_title', language)}
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed font-medium relative z-10 italic">
          {t('rules.educational_summary_desc', language)}
        </p>
      </div>
    </div>
  );
};

export default RulesInheritance;