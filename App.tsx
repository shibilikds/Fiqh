
import React, { useState } from 'react';
import Layout from './components/Layout';
import Home from './pages/Home';
import InheritanceCalc from './pages/InheritanceCalc';
import ZakahCalc from './pages/ZakahCalc';
import RulesInheritance from './pages/RulesInheritance';
import RulesZakah from './pages/RulesZakah';
import Charts from './pages/Charts';
import About from './pages/About';
import { Page } from './types';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Home);

  const renderPage = () => {
    switch (currentPage) {
      case Page.Home:
        return <Home setPage={setCurrentPage} />;
      case Page.InheritanceCalc:
        return <InheritanceCalc mode="share" setPage={setCurrentPage} />;
      case Page.InheritanceAmount:
        return <InheritanceCalc mode="amount" setPage={setCurrentPage} />;
      case Page.ZakahCalc:
        return <ZakahCalc setPage={setCurrentPage} />;
      case Page.InheritanceRules:
        return <RulesInheritance />;
      case Page.ZakahRules:
        return <RulesZakah />;
      case Page.Charts:
        return <Charts />;
      case Page.About:
        return <About />;
      default:
        return <Home setPage={setCurrentPage} />;
    }
  };

  return (
    <Layout currentPage={currentPage} setPage={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
};

export default App;
