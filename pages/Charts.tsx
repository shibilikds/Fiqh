
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { GitGraph, ArrowRight, Layers, BarChart3, ChevronDown } from 'lucide-react';
// Correctly import School type to support the new prop
import { School } from '../types';

interface ChartsProps {
  school: School;
}

const Charts: React.FC<ChartsProps> = ({ school }) => {
  // Extract school name for UI labels
  const schoolName = school.charAt(0).toUpperCase() + school.slice(1);
  
  const exampleInheritanceData = [
    { name: 'Spouse (Fixed)', value: 25 },
    { name: 'Mother (Fixed)', value: 16.67 },
    { name: 'Father (Fixed)', value: 16.67 },
    { name: 'Son (Residue)', value: 27.77 },
    { name: 'Daughter (Residue)', value: 13.89 },
  ];

  // Neon palette for charts
  const COLORS = ['#60A5FA', '#818CF8', '#C084FC', '#2DD4BF', '#FBBF24'];

  // Determine Madhhab-specific logic for visualization text
  const allowsDebtDeduction = school === School.HANAFI || school === School.HANBALI;

  return (
    <div className="space-y-8 lg:space-y-16 pb-16">
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-block p-6 bg-blue-500/10 rounded-[2rem] mb-6 border border-blue-400/20 shadow-xl">
          <BarChart3 className="text-blue-400" size={40} />
        </div>
        <h2 className="text-3xl lg:text-5xl font-black text-white uppercase tracking-tighter">Visual Analytics</h2>
        {/* Dynamic Madhhab Label */}
        <p className="text-[10px] lg:text-xs text-slate-500 font-black tracking-[0.4em] mt-3 uppercase">{schoolName} Statistical Logic</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-12">
        {/* Pie Chart Card */}
        <div className="bg-slate-900/40 backdrop-blur-xl p-8 lg:p-12 rounded-[2.5rem] shadow-2xl border border-white/10 relative overflow-hidden flex flex-col">
          <div className="absolute -top-10 -left-10 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl"></div>
          <h3 className="text-sm font-black text-slate-300 mb-10 flex items-center uppercase tracking-[0.2em] relative z-10">
            <Layers className="mr-4 text-blue-400" size={20} />
            Fractional Distribution
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
            * Sample Dataset: Spouse, Mother, Father, 1 Son, 1 Daughter.
          </p>
        </div>

        {/* Process Flow Card */}
        <div className="bg-slate-900/40 backdrop-blur-xl p-8 lg:p-12 rounded-[2.5rem] shadow-2xl border border-white/10 flex flex-col">
          <h3 className="text-sm font-black text-slate-300 mb-10 flex items-center uppercase tracking-[0.2em]">
            <GitGraph className="mr-4 text-indigo-400" size={20} />
            Zakah Algorithmic Logic
          </h3>
          <div className="flex-grow flex flex-col justify-center space-y-6 lg:space-y-8">
            <FlowStep label="Identify Zakatable Asset Pool" />
            <div className="flex justify-center"><ChevronDown className="text-slate-800" size={24} /></div>
            {/* Dynamic Logic Step Based on Madhhab */}
            <FlowStep label={allowsDebtDeduction ? "Deduct Personal Liabilities (Hanafi/Hanbali)" : "Exclude Liabilities (Shafi'i/Maliki)"} />
            <div className="flex justify-center"><ChevronDown className="text-slate-800" size={24} /></div>
            <FlowStep label="Validate Against Gold Nisab Threshold" highlight />
            <div className="flex justify-center"><ChevronDown className="text-slate-800" size={24} /></div>
            <FlowStep label="Commit 2.5% to Beneficiaries" success />
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
