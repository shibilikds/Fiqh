
import React from 'react';
import { Home, Calculator, BookOpen, BarChart3, Info, Wallet } from 'lucide-react';
import { Page } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: Page;
  setPage: (page: Page) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentPage, setPage }) => {
  return (
    <div className="min-h-screen pb-20 flex flex-col items-center">
      {/* Header */}
      <header className="w-full bg-slate-900/80 backdrop-blur-md text-white py-4 px-6 border-b border-white/10 sticky top-0 z-50 flex justify-between items-center">
        <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Shafi'i Fiqh Hub</h1>
        <div className="text-[10px] text-blue-200 uppercase tracking-widest font-semibold border border-blue-400/30 px-2 py-1 rounded bg-blue-500/10">
          Shafi'i School
        </div>
      </header>

      {/* Content Area */}
      <main className="w-full max-w-2xl px-4 py-6 flex-grow">
        <div className="mb-6 bg-blue-900/30 border-l-4 border-blue-400/50 p-4 text-sm text-blue-100 rounded-r backdrop-blur-sm shadow-xl">
          <strong className="text-blue-300">Note:</strong> All rulings and calculations follow the Shafi'i School of Jurisprudence.
        </div>
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="bottom-nav bg-slate-950/90 backdrop-blur-xl border-t border-white/10 flex justify-around items-center py-3 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        <NavItem 
          icon={<Home size={22} />} 
          label="Home" 
          active={currentPage === Page.Home} 
          onClick={() => setPage(Page.Home)} 
        />
        <NavItem 
          icon={<Wallet size={22} />} 
          label="Zakah" 
          active={currentPage === Page.ZakahCalc || currentPage === Page.ZakahRules} 
          onClick={() => setPage(Page.ZakahCalc)} 
        />
        <NavItem 
          icon={<Calculator size={22} />} 
          label="Inheritance" 
          active={currentPage === Page.InheritanceCalc || currentPage === Page.InheritanceAmount} 
          onClick={() => setPage(Page.InheritanceCalc)} 
        />
        <NavItem 
          icon={<BarChart3 size={22} />} 
          label="Charts" 
          active={currentPage === Page.Charts} 
          onClick={() => setPage(Page.Charts)} 
        />
        <NavItem 
          icon={<Info size={22} />} 
          label="About" 
          active={currentPage === Page.About} 
          onClick={() => setPage(Page.About)} 
        />
      </nav>
    </div>
  );
};

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
