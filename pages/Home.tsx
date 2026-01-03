
import React from 'react';
import { Calculator, Banknote, BookText, FileText, PieChart, Info, Scale } from 'lucide-react';
import { Page } from '../types';
import GoldPriceBox from '../components/GoldPriceBox';

interface HomeProps {
  setPage: (page: Page) => void;
}

const Home: React.FC<HomeProps> = ({ setPage }) => {
  const cards = [
    { 
      title: 'Inheritance Shares', 
      label: 'By Fraction', 
      icon: <Calculator size={24} />, 
      color: 'from-cyan-500 to-blue-600', 
      page: Page.InheritanceCalc 
    },
    { 
      title: 'Estate Amount', 
      label: 'By Money', 
      icon: <Banknote size={24} />, 
      color: 'from-indigo-500 to-purple-600', 
      page: Page.InheritanceAmount 
    },
    { 
      title: 'Zakah Calc', 
      label: 'Asset Threshold', 
      icon: <Scale size={24} />, 
      color: 'from-emerald-500 to-teal-600', 
      page: Page.ZakahCalc 
    },
    { 
      title: 'Inheritance Rules', 
      label: 'Legal Guide', 
      icon: <BookText size={24} />, 
      color: 'from-amber-500 to-orange-600', 
      page: Page.InheritanceRules 
    },
    { 
      title: 'Zakah Rules', 
      label: 'Conditions', 
      icon: <FileText size={24} />, 
      color: 'from-sky-500 to-blue-500', 
      page: Page.ZakahRules 
    },
    { 
      title: 'Visual Insights', 
      label: 'Charts & Flow', 
      icon: <PieChart size={24} />, 
      color: 'from-fuchsia-500 to-pink-600', 
      page: Page.Charts 
    },
  ];

  return (
    <div className="space-y-6">
      <section className="text-center py-6">
        <div className="inline-block p-5 bg-blue-500/10 rounded-3xl mb-4 border border-blue-400/20 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
          <Scale className="text-blue-400" size={36} />
        </div>
        <h2 className="text-3xl font-black text-white tracking-tight">Shafi'i Legal Hub</h2>
        <p className="text-sm text-slate-400 font-medium uppercase tracking-widest mt-2">Jurisprudence Portal</p>
      </section>

      <GoldPriceBox />

      <div className="grid grid-cols-2 gap-4">
        {cards.map((card, idx) => (
          <button
            key={idx}
            onClick={() => setPage(card.page)}
            className="flex flex-col items-start p-5 bg-slate-900/40 backdrop-blur-md rounded-2xl shadow-xl border border-white/10 hover:border-blue-400/50 hover:bg-slate-800/60 transition-all duration-300 text-left group"
          >
            <div className={`bg-gradient-to-br ${card.color} p-3 rounded-2xl text-white mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
              {card.icon}
            </div>
            <h3 className="text-sm font-black text-slate-100 leading-tight tracking-wide">{card.title}</h3>
            <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-tighter">{card.label}</p>
          </button>
        ))}
      </div>

      <div className="bg-slate-900/60 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full -mb-12 -mr-12 blur-2xl"></div>
        <h4 className="font-black text-blue-400 mb-3 uppercase tracking-widest text-xs">Our Mission</h4>
        <p className="text-sm text-slate-300 leading-relaxed font-medium">
          To provide precise Shafi'i jurisprudential calculations. 
          The Shafi'i School's distinctive approaches—such as the lack of return (Radd) to spouses and 
          gold-based Zakah thresholds—are mathematically represented for educational accuracy.
        </p>
      </div>
    </div>
  );
};

export default Home;
