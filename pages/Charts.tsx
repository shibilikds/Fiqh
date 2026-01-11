
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { GitGraph, ArrowRight, Layers, BarChart3, ChevronDown } from 'lucide-react';
import { School, Language } from '../types';
import { t } from '../services/translations';

interface ChartsProps {
  school: School;
  language: Language;
}

const Charts: React.FC<ChartsProps> = ({ school, language }) => {
  const schoolName = t(`school.${school}`, language);
  
  const exampleInheritanceData = [
    { name: t('charts.heir_spouse', language), value: 25 },
    { name: t('charts.heir_mother', language), value: 16.67 },
    { name: t('charts.heir_father', language), value: 16.67 },
    { name: t('charts.heir_son', language), value: 27.77 },
    { name: t('charts.heir_daughter', language), value: 13.89 },
  ];

  const COLORS = ['#60A5FA', '#818CF8', '#C084FC', '#2DD4BF', '#FBBF24'];
  const allowsDebtDeduction = school === School.HANAFI || school === School.HANBALI;

  return (
    <div className="space-y-8 lg:space-y-16 pb-16">
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-block p-6 bg-blue-500/10 rounded-[2rem] mb-6 border border-blue-400/20 shadow-xl">
          <BarChart3 className="text-blue-400" size={40} />
        </div>
        <h2 className="text-3xl lg:text-5xl font-black text-white uppercase tracking-tighter">{t('charts.title', language)}</h2>
        <p className="text-[10px] lg:text-xs text-slate-500 font-black tracking-[0.4em] mt-3 uppercase">{t('charts.subtitle', language, { schoolName })}</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-12">
        <div className="bg-slate-900/40 backdrop-blur-xl p-8 lg:p-12 rounded-[2.5rem] shadow-2xl border border-white/10 relative overflow-hidden flex flex-col">
          <div className="absolute -top-10 -left-10 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl"></div>
          <h3 className="text-sm font-black text-slate-300 mb-10 flex items-center uppercase tracking-[0.2em] relative z-10">
            <Layers className="mr-4 text-blue-400" size={20} />
            {t('charts.dist_title', language)}
          </h3>
          <div className="h-[350px] w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={exampleInheritanceData}
                  cx="50%"
                  cy="45%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {exampleInheritanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="drop-shadow-[0_0_15px_rgba(255,255,255,0.05)]" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    borderRadius: '24px', 
                    border: '1px solid rgba(255,255,255,0.1)', 
                    boxShadow: '0 20px 50px rgba(0,0,0,0.6)', 
                    fontSize: '12px',
                    fontWeight: '900',
                    color: '#fff',
                    textTransform: 'uppercase',
                    padding: '16px'
                  }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={40} 
                  iconType="circle"
                  wrapperStyle={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#64748b', paddingTop: '20px' }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[10px] text-slate-500 mt-8 font-black uppercase tracking-widest text-center italic relative z-10">
            {t('charts.dist_sample_note', language)}
          </p>
        </div>

        <div className="bg-slate-900/40 backdrop-blur-xl p-8 lg:p-12 rounded-[2.5rem] shadow-2xl border border-white/10 flex flex-col">
          <h3 className="text-sm font-black text-slate-300 mb-10 flex items-center uppercase tracking-[0.2em]">
            <GitGraph className="mr-4 text-indigo-400" size={20} />
            {t('charts.zakah_logic_title', language)}
          </h3>
          <div className="flex-grow flex flex-col justify-center space-y-6 lg:space-y-8">
            <FlowStep label={t('charts.flow_step1', language)} />
            <div className="flex justify-center"><ChevronDown className="text-slate-800" size={24} /></div>
            <FlowStep label={t(allowsDebtDeduction ? 'charts.flow_step2_yes' : 'charts.flow_step2_no', language)} />
            <div className="flex justify-center"><ChevronDown className="text-slate-800" size={24} /></div>
            <FlowStep label={t('charts.flow_step3', language)} highlight />
            <div className="flex justify-center"><ChevronDown className="text-slate-800" size={24} /></div>
            <FlowStep label={t('charts.flow_step4', language)} success />
          </div>
        </div>
      </div>
    </div>
  );
};

const FlowStep = ({ label, highlight, success }: { label: string, highlight?: boolean, success?: boolean }) => (
  <div className={`p-6 lg:p-8 rounded-3xl border text-center font-black text-xs lg:text-sm uppercase tracking-[0.2em] transition-all duration-300 transform hover:scale-[1.02] ${
    success ? 'bg-blue-600 border-blue-400 text-white shadow-[0_20px_40px_rgba(37,99,235,0.3)]' : 
    highlight ? 'bg-indigo-500/20 border-indigo-400/50 text-indigo-300 shadow-xl' : 
    'bg-slate-950 border-white/5 text-slate-500'
  }`}>
    {label}
  </div>
);

export default Charts;