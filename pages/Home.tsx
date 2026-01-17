
import React from 'react';
import { Calculator, Banknote, BookText, FileText, PieChart, Info, Scale, AlertTriangle } from 'lucide-react';
import { Page, School, Language } from '../types';
import { t } from '../services/translations';

interface HomeProps {
  setPage: (page: Page) => void;
  school: School;
  language: Language;
}

const Home: React.FC<HomeProps> = ({ setPage, school, language }) => {
  const schoolName = t(`school.${school}`, language);

  const cards = [
    { 
      titleKey: 'home.card_inheritance_shares', 
      labelKey: 'home.card_inheritance_shares_label', 
      icon: <Calculator size={24} />, 
      color: 'from-cyan-500 to-blue-600', 
      page: Page.InheritanceCalc 
    },
    { 
      titleKey: 'home.card_estate_amount', 
      labelKey: 'home.card_estate_amount_label', 
      icon: <Banknote size={24} />, 
      color: 'from-indigo-500 to-purple-600', 
      page: Page.InheritanceAmount 
    },
    { 
      titleKey: 'home.card_zakah_calc', 
      labelKey: 'home.card_zakah_calc_label', 
      icon: <Scale size={24} />, 
      color: 'from-emerald-500 to-teal-600', 
      page: Page.ZakahCalc 
    },
    { 
      titleKey: 'home.card_inheritance_rules', 
      labelKey: 'home.card_inheritance_rules_label', 
      icon: <BookText size={24} />, 
      color: 'from-amber-500 to-orange-600', 
      page: Page.InheritanceRules 
    },
    { 
      titleKey: 'home.card_zakah_rules', 
      labelKey: 'home.card_zakah_rules_label', 
      icon: <FileText size={24} />, 
      color: 'from-sky-500 to-blue-500', 
      page: Page.ZakahRules 
    },
    { 
      titleKey: 'home.card_visual_insights', 
      labelKey: 'home.card_visual_insights_label', 
      icon: <PieChart size={24} />, 
      color: 'from-fuchsia-500 to-pink-600', 
      page: Page.Charts 
    },
  ];

  return (
    <div className="space-y-8 lg:space-y-12 pb-10">
      <section className="text-center py-4">
        <div className="inline-block p-6 bg-blue-500/10 rounded-[2rem] mb-6 border border-blue-400/20 shadow-[0_0_50px_rgba(59,130,246,0.2)]">
          <Scale className="text-blue-400" size={48} />
        </div>
        <h2 className="text-3xl lg:text-5xl font-black text-white tracking-tighter">{t('home.title', language)}</h2>
        <div className="flex justify-center mt-3">
          <span className="px-4 py-1.5 bg-blue-600 text-white text-[10px] lg:text-xs font-black uppercase tracking-[0.3em] rounded-full border border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.5)]">
            {t('home.active_madhhab', language, { schoolName })}
          </span>
        </div>
      </section>

      <div className="bg-amber-600/10 rounded-3xl p-6 border border-amber-400/20 shadow-xl max-w-2xl mx-auto w-full">
        <h3 className="text-xs font-black text-amber-300 mb-4 flex items-center uppercase tracking-widest">
            <AlertTriangle className="me-3" size={16} /> {t('about.disclaimer_title', language)}
        </h3>
        <p className="text-xs text-amber-200 leading-relaxed font-medium">
            {t('about.disclaimer_content', language)}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
        {cards.map((card, idx) => (
          <button
            key={idx}
            onClick={() => setPage(card.page)}
            className="flex flex-col items-start p-6 bg-slate-900/40 backdrop-blur-md rounded-3xl shadow-xl border border-white/10 hover:border-blue-400/50 hover:bg-slate-800/60 transition-all duration-300 text-left group overflow-hidden relative"
          >
            <div className={`bg-gradient-to-br ${card.color} p-4 rounded-2xl text-white mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300 relative z-10`}>
              {card.icon}
            </div>
            <h3 className="text-sm lg:text-base font-black text-slate-100 leading-tight tracking-wide relative z-10">{t(card.titleKey, language)}</h3>
            <p className="text-[10px] font-bold text-slate-500 mt-2 uppercase tracking-widest relative z-10">{t(card.labelKey, language)}</p>
            
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12 blur-2xl group-hover:bg-blue-400/5 transition-colors"></div>
          </button>
        ))}
      </div>

      <div className="bg-slate-900/60 backdrop-blur-xl p-8 lg:p-12 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full -mb-24 -mr-24 blur-3xl"></div>
        <h4 className="font-black text-blue-400 mb-6 uppercase tracking-[0.3em] text-xs lg:text-sm">{t('home.comprehensive_jurisprudence', language)}</h4>
        <p className="text-base lg:text-xl text-slate-300 leading-relaxed font-medium">
          {t('home.platform_description', language, { schoolName })}
        </p>
      </div>
    </div>
  );
};

export default Home;
