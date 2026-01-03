
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { GitGraph, ArrowRight, Layers, BarChart3 } from 'lucide-react';

const Charts: React.FC = () => {
  const exampleInheritanceData = [
    { name: 'Spouse (Fixed)', value: 25 },
    { name: 'Mother (Fixed)', value: 16.67 },
    { name: 'Father (Fixed)', value: 16.67 },
    { name: 'Son (Residue)', value: 27.77 },
    { name: 'Daughter (Residue)', value: 13.89 },
  ];

  // Neon palette for charts
  const COLORS = ['#60A5FA', '#818CF8', '#C084FC', '#2DD4BF', '#FBBF24'];

  return (
    <div className="space-y-8 pb-10">
      <div className="text-center">
        <div className="inline-block p-4 bg-blue-500/10 rounded-2xl mb-4 border border-blue-400/20">
          <BarChart3 className="text-blue-400" size={32} />
        </div>
        <h2 className="text-2xl font-black text-white uppercase tracking-tight">Visual Legal Guides</h2>
        <p className="text-[10px] text-slate-500 font-bold tracking-widest mt-1 uppercase">Academic Study Aid</p>
      </div>

      <div className="bg-slate-900/40 backdrop-blur-xl p-6 rounded-3xl shadow-2xl border border-white/10 relative overflow-hidden">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl"></div>
        <h3 className="text-xs font-black text-slate-300 mb-8 flex items-center uppercase tracking-widest relative z-10">
          <Layers className="mr-3 text-blue-400" size={18} />
          Distribution Matrix (Example)
        </h3>
        <div className="h-[280px] w-full relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={exampleInheritanceData}
                cx="50%"
                cy="45%"
                innerRadius={70}
                outerRadius={95}
                paddingAngle={8}
                dataKey="value"
                stroke="none"
              >
                {exampleInheritanceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]" />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0f172a', 
                  borderRadius: '16px', 
                  border: '1px solid rgba(255,255,255,0.1)', 
                  boxShadow: '0 10px 30px rgba(0,0,0,0.5)', 
                  fontSize: '11px',
                  fontWeight: '900',
                  color: '#fff',
                  textTransform: 'uppercase'
                }}
                itemStyle={{ color: '#fff' }}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36} 
                iconType="circle"
                wrapperStyle={{ fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8' }} 
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <p className="text-[9px] text-slate-500 mt-4 font-bold uppercase tracking-widest text-center italic relative z-10">
          * Scenario: Husband, Mother, Father, 1 Son, 1 Daughter.
        </p>
      </div>

      <div className="bg-slate-900/40 backdrop-blur-xl p-6 rounded-3xl shadow-2xl border border-white/10">
        <h3 className="text-xs font-black text-slate-300 mb-8 flex items-center uppercase tracking-widest">
          <GitGraph className="mr-3 text-indigo-400" size={18} />
          Zakah Decision Logic
        </h3>
        <div className="space-y-4">
          <FlowStep label="Aggregate Liquid Assets" />
          <div className="flex justify-center"><ArrowRight className="text-slate-700 rotate-90" size={20} /></div>
          <FlowStep label="Disregard Liabilities (Shafi'i)" />
          <div className="flex justify-center"><ArrowRight className="text-slate-700 rotate-90" size={20} /></div>
          <FlowStep label="Assess Against Gold Nisab" highlight />
          <div className="flex justify-center"><ArrowRight className="text-slate-700 rotate-90" size={20} /></div>
          <FlowStep label="Execute 2.5% Payment" success />
        </div>
      </div>
    </div>
  );
};

const FlowStep = ({ label, highlight, success }: { label: string, highlight?: boolean, success?: boolean }) => (
  <div className={`p-5 rounded-2xl border text-center font-black text-[10px] uppercase tracking-widest transition-all duration-300 ${
    success ? 'bg-blue-600 border-blue-400 text-white shadow-[0_10px_20px_rgba(37,99,235,0.3)]' : 
    highlight ? 'bg-indigo-500/20 border-indigo-400/50 text-indigo-300 shadow-lg' : 
    'bg-slate-950 border-white/10 text-slate-500'
  }`}>
    {label}
  </div>
);

export default Charts;
