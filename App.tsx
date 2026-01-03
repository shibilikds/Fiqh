
import React, { useState } from 'react';
import Layout from './components/Layout';
import Home from './pages/Home';
import InheritanceCalc from './pages/InheritanceCalc';
import ZakahCalc from './pages/ZakahCalc';
import RulesInheritance from './pages/RulesInheritance';
import RulesZakah from './pages/RulesZakah';
import Charts from './pages/Charts';
import About from './pages/About';
import { Page, School } from './types';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Home);
  const [currentSchool, setCurrentSchool] = useState<School>(School.SHAFI);

  const renderPage = () => {
    switch (currentPage) {
      case Page.Home:
        return <Home setPage={setCurrentPage} school={currentSchool} />;
      case Page.InheritanceCalc:
        return <InheritanceCalc mode="share" setPage={setCurrentPage} school={currentSchool} />;
      case Page.InheritanceAmount:
        return <InheritanceCalc mode="amount" setPage={setCurrentPage} school={currentSchool} />;
      case Page.ZakahCalc:
        return <ZakahCalc setPage={setCurrentPage} school={currentSchool} />;
      case Page.InheritanceRules:
        return <RulesInheritance school={currentSchool} />;
      case Page.ZakahRules:
        return <RulesZakah school={currentSchool} />;
      case Page.Charts:
        return <Charts school={currentSchool} />;
      case Page.About:
        return <About />;
      default:
        return <Home setPage={setCurrentPage} school={currentSchool} />;
    }
  };

  return (
    <Layout 
      currentPage={currentPage} 
      setPage={setCurrentPage} 
      currentSchool={currentSchool} 
      setSchool={setCurrentSchool}
    >
      {renderPage()}
    </Layout>
  );
};

export default App;
