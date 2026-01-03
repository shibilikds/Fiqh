
import React from 'react';
import { Home, Calculator, BookOpen, BarChart3, Info, Wallet, Scale, ChevronDown } from 'lucide-react';
import { Page, School } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: Page;
  setPage: (page: Page) => void;
  currentSchool: School;
  setSchool: (school: School) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentPage, setPage, currentSchool, setSchool }) => {
  const navItems = [
    { id: Page.Home, icon: <Home size={22} />, label: "Home" },
    { id: Page.ZakahCalc, icon: <Wallet size={22} />, label: "Zakah" },
    { id: Page.InheritanceCalc, icon: <Calculator size={22} />, label: "Inheritance" },
    { id: Page.Charts, icon: <BarChart3 size={22} />, label: "Charts" },
    { id: Page.About, icon: <Info size={22} />, label: "About" },
  ];

  const schools = [
    { id: School.SHAFI, label: "Shāfiʿī" },
    { id: School.HANAFI, label: "Ḥanafī" },
    { id: School.MALIKI, label: "Mālikī" },
    { id: School.HANBALI, label: "Ḥanbalī" },
  ];

  const isZakah = currentPage === Page.ZakahCalc || currentPage === Page.ZakahRules;
  const isInherit = currentPage === Page.InheritanceCalc || currentPage === Page.InheritanceAmount || currentPage === Page.InheritanceRules;

  const getSchoolLabel = (id: School) => schools.find(s => s.id === id)?.label || "Select Madhhab";

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col lg:flex-row">
      
      {/* Sidebar for Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-950/50 backdrop-blur-xl border-r border-white/5 sticky top-0 h-screen p-6 shrink-0">
        <div className="mb-8 px-2">
          <h1 className="text-2xl font-black tracking-tighter bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Fiqh Hub
          </h1>
          <p className="text-[10px] text-blue-400 uppercase tracking-[0.3em] font-bold mt-1">Sunni Jurisprudence</p>
        </div>

        {/* School Selector Desktop */}
        <div className="mb-8 px-2">
          <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Active Madhhab</label>
          <div className="grid grid-cols-1 gap-1.5">
            {schools.map(s => (
              <button
                key={s.id}
                onClick={() => setSchool(s.id)}
                className={`text-left px-3 py-2 rounded-lg text-xs font-black transition-all ${currentSchool === s.id ? 'bg-blue-600 text-white shadow-lg' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
        
        <nav className="flex-grow space-y-1">
          {navItems.map((item) => (
            <SidebarItem 
              key={item.id}
              icon={item.icon}
              label={item.label}
              active={
                currentPage === item.id || 
                (item.id === Page.ZakahCalc && isZakah) ||
                (item.id === Page.InheritanceCalc && isInherit)
              }
              onClick={() => setPage(item.id)}
            />
          ))}
        </nav>

        <div className="mt-auto p-4 bg-blue-500/5 rounded-2xl border border-blue-400/10">
          <div className="flex items-center text-blue-300 text-[10px] font-black uppercase tracking-widest mb-2">
            <Scale size={14} className="mr-2" /> Academic Mode
          </div>
          <p className="text-[9px] text-slate-500 font-bold leading-relaxed">
            Multi-Madhhab engine active. Rules change based on selection.
          </p>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col items-center">
        {/* Header (Mobile Only) */}
        <header className="lg:hidden w-full bg-slate-900/80 backdrop-blur-md text-white py-4 px-6 border-b border-white/10 sticky top-0 z-50 flex justify-between items-center">
          <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Fiqh Hub</h1>
          <div className="relative group">
            <button className="text-[10px] text-blue-200 uppercase tracking-widest font-black border border-blue-400/30 px-3 py-1.5 rounded-lg bg-blue-500/10 flex items-center">
              {getSchoolLabel(currentSchool)} <ChevronDown size={12} className="ml-2" />
            </button>
            <div className="absolute right-0 mt-2 w-32 bg-slate-900 border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[60]">
               {schools.map(s => (
                <button key={s.id} onClick={() => setSchool(s.id)} className="w-full text-left px-4 py-2 text-[10px] font-black uppercase tracking-tighter text-slate-300 hover:bg-blue-600 hover:text-white first:rounded-t-xl last:rounded-b-xl border-b border-white/5 last:border-0">
                  {s.label}
                </button>
               ))}
            </div>
          </div>
        </header>

        {/* Content Container */}
        <main className="w-full max-w-4xl lg:max-w-5xl px-4 py-6 lg:py-12 flex-grow overflow-x-hidden">
          <div className="mb-8 lg:mb-12 bg-blue-900/30 border-l-4 border-blue-400/50 p-4 lg:p-6 text-sm text-blue-100 rounded-r backdrop-blur-sm shadow-xl flex items-center justify-between">
            <div>
              <strong className="text-blue-300">Note:</strong> Calculations currently follow the <span className="font-black text-blue-400 underline">{getSchoolLabel(currentSchool)}</span> School.
            </div>
          </div>
          {children}
        </main>

        {/* Space for Bottom Nav on Mobile */}
        <div className="h-20 lg:hidden" />
      </div>

      {/* Bottom Navigation (Mobile Only) */}
      <nav className="lg:hidden bottom-nav bg-slate-950/90 backdrop-blur-xl border-t border-white/10 flex justify-around items-center py-3 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        {navItems.map((item) => (
          <NavItem 
            key={item.id}
            icon={item.icon}
            label={item.label}
            active={
              currentPage === item.id || 
              (item.id === Page.ZakahCalc && isZakah) ||
              (item.id === Page.InheritanceCalc && isInherit)
            }
            onClick={() => setPage(item.id)}
          />
        ))}
      </nav>
    </div>
  );
};

const SidebarItem: React.FC<{ icon: React.ReactNode, label: string, active: boolean, onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex items-center space-x-4 w-full px-4 py-3 rounded-xl transition-all duration-300 ${
      active 
        ? 'bg-blue-600/10 text-blue-400 border border-blue-400/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]' 
        : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
    }`}
  >
    <span className={`${active ? 'scale-110 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]' : ''}`}>
      {icon}
    </span>
    <span className="text-sm font-black tracking-wide uppercase">{label}</span>
  </button>
);

const NavItem: React.FC<{ icon: React.ReactNode, label: string, active: boolean, onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center space-y-1 w-full transition-all duration-300 ${active ? 'text-blue-400 scale-110 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]' : 'text-slate-500 hover:text-slate-300'}`}
  >
    {icon}
    <span className="text-[10px] font-bold tracking-wide uppercase">{label}</span>
  </button>
);

export default Layout;
