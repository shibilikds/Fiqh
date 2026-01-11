
import React from 'react';
import { Home, Calculator, BookOpen, BarChart3, Info, Wallet, Scale, ChevronDown, Languages, Moon } from 'lucide-react';
import { Page, School, Language } from '../types';
import { t } from '../services/translations';


interface LayoutProps {
  children: React.ReactNode;
  currentPage: Page;
  setPage: (page: Page) => void;
  currentSchool: School;
  setSchool: (school: School) => void;
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentPage, setPage, currentSchool, setSchool, currentLanguage, setLanguage }) => {
  const navItems = [
    { id: Page.Home, icon: <Home size={22} />, labelKey: "nav.home" },
    { id: Page.ZakahCalc, icon: <Wallet size={22} />, labelKey: "nav.zakah" },
    { id: Page.InheritanceCalc, icon: <Calculator size={22} />, labelKey: "nav.inheritance" },
    { id: Page.Charts, icon: <BarChart3 size={22} />, labelKey: "nav.charts" },
    { id: Page.About, icon: <Info size={22} />, labelKey: "nav.about" },
  ];

  const languages = [
    { id: Language.EN, label: "English" },
    { id: Language.ML, label: "മലയാളം" },
    { id: Language.AR, label: "العربية" },
  ];

  const isZakah = currentPage === Page.ZakahCalc || currentPage === Page.ZakahRules;
  const isInherit = currentPage === Page.InheritanceCalc || currentPage === Page.InheritanceAmount || currentPage === Page.InheritanceRules;

  const getSchoolLabel = (id: School) => t(`school.${id}`, currentLanguage);

  return (
    <div className="min-h-screen text-slate-100 flex flex-col lg:flex-row relative z-0">
      
      <aside className="hidden lg:flex flex-col w-64 bg-slate-950/50 backdrop-blur-xl border-r border-white/5 sticky top-0 h-screen p-6 shrink-0 z-10">
        <div className="mb-8 px-2">
          <h1 className="text-2xl font-black tracking-tighter bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            {t('app.title', currentLanguage)}
          </h1>
          <p className="text-[10px] text-blue-400 uppercase tracking-[0.3em] font-bold mt-1">{t('app.subtitle', currentLanguage)}</p>
        </div>
        
        <nav className="flex-grow space-y-1">
          {navItems.map((item) => (
            <SidebarItem 
              key={item.id}
              icon={item.icon}
              label={t(item.labelKey, currentLanguage)}
              active={
                currentPage === item.id || 
                (item.id === Page.ZakahCalc && isZakah) ||
                (item.id === Page.InheritanceCalc && isInherit)
              }
              onClick={() => setPage(item.id)}
            />
          ))}
        </nav>
        
        <div className="mb-4">
            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 block px-2">{t('lang.switcher_label', currentLanguage)}</label>
             <div className="grid grid-cols-1 gap-1.5">
                {languages.map(lang => (
                  <button
                    key={lang.id}
                    onClick={() => setLanguage(lang.id)}
                    className={`text-center px-3 py-2 rounded-lg text-xs font-black transition-all ${currentLanguage === lang.id ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
                  >
                    {lang.label}
                  </button>
                ))}
            </div>
        </div>

        <div className="mt-auto p-4 bg-blue-500/5 rounded-2xl border border-blue-400/10">
          <div className="flex items-center text-blue-300 text-[10px] font-black uppercase tracking-widest mb-2">
            <Scale size={14} className="mr-2" /> {t('layout.academic_mode', currentLanguage)}
          </div>
          <p className="text-[9px] text-slate-500 font-bold leading-relaxed">
            {t('layout.madhhab_engine_note', currentLanguage)}
          </p>
        </div>
      </aside>

      <div className="flex-grow flex flex-col items-center z-10">
        <header className="lg:hidden w-full bg-slate-900/80 backdrop-blur-md text-white py-4 px-6 border-b border-white/10 sticky top-0 z-50 flex justify-between items-center">
          <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">{t('app.title_short', currentLanguage)}</h1>
          <div className="relative group">
            <button className="p-2.5 rounded-lg bg-indigo-500/10 border border-indigo-400/30">
              <Languages size={16} className="text-indigo-300" />
            </button>
            <div className="absolute right-0 mt-2 w-32 bg-slate-900 border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[60]">
               {languages.map(s => (
                <button key={s.id} onClick={() => setLanguage(s.id)} className={`w-full text-center px-4 py-2 text-xs font-black uppercase tracking-tighter hover:bg-indigo-600 hover:text-white first:rounded-t-xl last:rounded-b-xl border-b border-white/5 last:border-0 ${currentLanguage === s.id ? 'text-indigo-300' : 'text-slate-300'}`}>
                  {s.label}
                </button>
               ))}
            </div>
          </div>
        </header>

        <main className="w-full max-w-4xl lg:max-w-5xl px-4 py-6 lg:py-12 flex-grow overflow-x-hidden">
          <div className="mb-8 lg:mb-12 bg-blue-900/30 border-l-4 border-blue-400/50 p-4 lg:p-6 text-sm text-blue-100 rounded-r backdrop-blur-sm shadow-xl flex items-center justify-between">
            <div>
              <strong className="text-blue-300">{t('layout.note', currentLanguage)}:</strong> {t('layout.school_notice', currentLanguage, { schoolName: getSchoolLabel(currentSchool) })}
            </div>
          </div>
          {children}
        </main>

        <div className="h-20 lg:hidden" />
      </div>

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/90 backdrop-blur-xl border-t border-white/10 flex justify-around items-center py-3 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        {navItems.map((item) => (
          <NavItem 
            key={item.id}
            icon={item.icon}
            label={t(item.labelKey, currentLanguage)}
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