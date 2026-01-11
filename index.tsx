
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Page, School, Language } from './types';
import Layout from './components/Layout';
import Home from './pages/Home';
import ZakahCalc from './pages/ZakahCalc';
import InheritanceCalc from './pages/InheritanceCalc';
import Charts from './pages/Charts';
import About from './pages/About';
import RulesInheritance from './pages/RulesInheritance';
import RulesZakah from './pages/RulesZakah';

const App = () => {
  const [page, setPage] = useState<Page>(Page.Home);
  const [school, setSchool] = useState<School>(School.SHAFI);
  // Defaulting to English (EN) as requested
  const [language, setLanguage] = useState<Language>(Language.EN);

  useEffect(() => {
    const htmlEl = document.documentElement;
    const bodyEl = document.body;
    
    // Explicitly handle RTL for Arabic and LTR for others
    if (language === Language.AR) {
      htmlEl.setAttribute('dir', 'rtl');
      htmlEl.setAttribute('lang', 'ar');
      bodyEl.classList.add('lang-ar');
      bodyEl.classList.remove('lang-ml');
    } else if (language === Language.ML) {
      htmlEl.setAttribute('dir', 'ltr');
      htmlEl.setAttribute('lang', 'ml');
      bodyEl.classList.add('lang-ml');
      bodyEl.classList.remove('lang-ar');
    } else {
      htmlEl.setAttribute('dir', 'ltr');
      htmlEl.setAttribute('lang', 'en');
      bodyEl.classList.remove('lang-ar', 'lang-ml');
    }
  }, [language]);

  const renderPage = () => {
    const props = { setPage, school, language };
    switch (page) {
      case Page.Home:
        return <Home {...props} />;
      case Page.ZakahCalc:
        return <ZakahCalc {...props} />;
      case Page.ZakahRules:
        return <RulesZakah {...props} />;
      case Page.InheritanceCalc:
        return <InheritanceCalc mode="share" {...props} />;
      case Page.InheritanceAmount:
        return <InheritanceCalc mode="amount" {...props} />;
      case Page.InheritanceRules:
        return <RulesInheritance {...props} />;
      case Page.Charts:
        return <Charts {...props} />;
      case Page.About:
        return <About {...props} />;
      default:
        return <Home {...props} />;
    }
  };

  return (
    <Layout 
      currentPage={page} 
      setPage={setPage} 
      currentSchool={school}
      setSchool={setSchool}
      currentLanguage={language}
      setLanguage={setLanguage}
    >
      {renderPage()}
    </Layout>
  );
};

const rootEl = document.getElementById('root');
if (rootEl) {
  const root = createRoot(rootEl);
  root.render(<App />);
}