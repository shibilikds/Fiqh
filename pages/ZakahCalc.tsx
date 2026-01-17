
import React from 'react';
import { useState } from 'react';
import { ZakahInputs, Page, School, Language, MetalPrices, ZakahResult, ZakahResultItem } from '../types';
import { NISAB_GOLD_GRAMS, NISAB_SILVER_GRAMS } from '../services/goldApi';
import { ArrowLeft, Wallet, Info, CheckCircle, XCircle, Scale, Tag, Coins, Landmark, Box } from 'lucide-react';
import { t } from '../services/translations';

type ZakahTab = 'gold' | 'silver' | 'cash' | 'business';

interface Props {
  setPage: (page: Page) => void;
  school: School;
  language: Language;
}

const ZakahCalc: React.FC<Props> = ({ setPage, school, language }) => {
  const [inputs, setInputs] = useState<ZakahInputs>({
    goldGrams: 0,
    silverGrams: 0,
    cash: 0,
    businessStock: 0,
    businessCash: 0,
    receivables: 0,
  });
  
  const [manualPrices, setManualPrices] = useState<MetalPrices>({ gold: 7250, silver: 90 });
  const [results, setResults] = useState<ZakahResult | null>(null);
  const [activeTab, setActiveTab] = useState<ZakahTab>('gold');
  const [hawlCompleted, setHawlCompleted] = useState(true);

  const handleCalculate = () => {
    if (!manualPrices.gold || !manualPrices.silver) return;

    const goldNisabValue = NISAB_GOLD_GRAMS * manualPrices.gold;
    const silverNisabValue = NISAB_SILVER_GRAMS * manualPrices.silver;

    // Gold Calculation
    const goldValue = inputs.goldGrams * manualPrices.gold;
    const isGoldEligible = goldValue >= goldNisabValue;
    const zakahGold = isGoldEligible ? goldValue * 0.025 : 0;

    // Silver Calculation
    const silverValue = inputs.silverGrams * manualPrices.silver;
    const isSilverEligible = silverValue >= silverNisabValue;
    const zakahSilver = isSilverEligible ? silverValue * 0.025 : 0;

    // Cash Calculation
    const cashValue = inputs.cash;
    const isCashEligible = cashValue >= silverNisabValue;
    const zakahCash = isCashEligible ? cashValue * 0.025 : 0;

    // Business Calculation
    const businessValue = inputs.businessStock + inputs.businessCash + inputs.receivables;
    const isBusinessEligible = businessValue >= silverNisabValue && hawlCompleted;
    const zakahBusiness = isBusinessEligible ? businessValue * 0.025 : 0;

    setResults({
      gold: { eligible: isGoldEligible, zakah: zakahGold, zakatableValue: goldValue, nisabValue: goldNisabValue },
      silver: { eligible: isSilverEligible, zakah: zakahSilver, zakatableValue: silverValue, nisabValue: silverNisabValue },
      cash: { eligible: isCashEligible, zakah: zakahCash, zakatableValue: cashValue, nisabValue: silverNisabValue },
      business: { eligible: isBusinessEligible, zakah: zakahBusiness, zakatableValue: businessValue, nisabValue: silverNisabValue },
      total: zakahGold + zakahSilver + zakahCash + zakahBusiness
    });
  };

  const updateInput = (field: keyof ZakahInputs, value: number) => {
    setInputs(prev => ({ ...prev, [field]: value }));
    setResults(null);
  };

  const updatePrice = (metal: keyof MetalPrices, value: number) => {
    setManualPrices(prev => ({ ...prev, [metal]: value }));
    setResults(null);
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center space-x-3">
        <button onClick={() => setPage(Page.Home)} className="p-2.5 bg-slate-900 border border-white/10 rounded-xl text-blue-400 hover:bg-slate-800 transition-all">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-xl font-black text-white tracking-tight uppercase">{t('zakah.title', language)}</h2>
      </div>

      <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/10 space-y-6">
        <div className="bg-blue-600/10 p-5 rounded-2xl border border-blue-400/20 flex items-start space-x-4">
          <Info className="text-blue-400 shrink-0 mt-1" size={20} />
          <div>
            <h4 className="text-[10px] font-black text-blue-300 uppercase tracking-widest">{t('zakah.ihtiyat_note_title', language)}</h4>
            <p className="text-xs text-blue-100 leading-relaxed mt-1 font-medium">{t('zakah.ihtiyat_note_desc', language)}</p>
          </div>
        </div>

        <div>
            <h3 className="text-xs font-black text-blue-400 uppercase tracking-[0.2em] mb-3 ms-1 flex items-center">
                <Tag size={14} className="me-2"/>
                {t('zakah.price_inputs_title', language)}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-5 bg-slate-950 rounded-2xl border border-white/5">
                <InputGroup label={t('zakah.manual_gold_price_label', language)} value={manualPrices.gold} onChange={(v) => updatePrice('gold', v)} unit="₹" />
                <InputGroup label={t('zakah.manual_silver_price_label', language)} value={manualPrices.silver} onChange={(v) => updatePrice('silver', v)} unit="₹" />
            </div>
        </div>
        
        <div>
          <h3 className="text-xs font-black text-blue-400 uppercase tracking-[0.2em] mb-4 ms-1 flex items-center">
            <Wallet size={14} className="me-2"/>
            {t('zakah.assets_title', language)}
          </h3>
          <div className="flex border-b border-white/10">
            <TabButton icon={<Coins size={16}/>} label={t('zakah.gold', language)} active={activeTab === 'gold'} onClick={() => setActiveTab('gold')} />
            <TabButton icon={<Coins size={16}/>} label={t('zakah.silver', language)} active={activeTab === 'silver'} onClick={() => setActiveTab('silver')} />
            <TabButton icon={<Landmark size={16}/>} label={t('zakah.cash', language)} active={activeTab === 'cash'} onClick={() => setActiveTab('cash')} />
            <TabButton icon={<Box size={16}/>} label={t('zakah.business', language)} active={activeTab === 'business'} onClick={() => setActiveTab('business')} />
          </div>

          <div className="mt-5 p-5 bg-slate-950 rounded-2xl border border-white/5 min-h-[120px]">
            <div className="animate-in fade-in duration-300">
              {activeTab === 'gold' && (
                <InputGroup label={t('zakah.gold_label', language)} value={inputs.goldGrams} onChange={(v) => updateInput('goldGrams', v)} unit="g" />
              )}
              {activeTab === 'silver' && (
                <InputGroup label={t('zakah.silver_label', language)} value={inputs.silverGrams} onChange={(v) => updateInput('silverGrams', v)} unit="g" />
              )}
              {activeTab === 'cash' && (
                <InputGroup label={t('zakah.cash_label', language)} value={inputs.cash} onChange={(v) => updateInput('cash', v)} unit="₹" />
              )}
              {activeTab === 'business' && (
                <div className="space-y-5">
                  <InputGroup label={t('zakah.business_stock_label', language)} value={inputs.businessStock} onChange={(v) => updateInput('businessStock', v)} unit="₹" />
                  <InputGroup label={t('zakah.business_cash_label', language)} value={inputs.businessCash} onChange={(v) => updateInput('businessCash', v)} unit="₹" />
                  <InputGroup label={t('zakah.receivables_label', language)} value={inputs.receivables} onChange={(v) => updateInput('receivables', v)} unit="₹" />
                  
                  <div className="pt-4 border-t border-white/10">
                    <label htmlFor="hawl-toggle" className="flex items-center cursor-pointer justify-between">
                        <span className="text-slate-300 font-medium text-sm">{t('zakah.hawl_completed_label', language)}</span>
                        <div className="relative">
                            <input
                                id="hawl-toggle"
                                type="checkbox"
                                className="sr-only"
                                checked={hawlCompleted}
                                onChange={(e) => setHawlCompleted(e.target.checked)}
                            />
                            <div className={`block w-14 h-8 rounded-full transition-colors ${hawlCompleted ? 'bg-blue-600' : 'bg-slate-700'}`}></div>
                            <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${hawlCompleted ? 'transform translate-x-6' : ''}`}></div>
                        </div>
                    </label>
                  </div>
                  
                  <div className="mt-5 bg-indigo-600/10 p-4 rounded-2xl border border-indigo-400/20 flex items-start space-x-3">
                    <Info className="text-indigo-400 shrink-0 mt-1" size={16} />
                    <div>
                        <h4 className="text-[10px] font-black text-indigo-300 uppercase tracking-widest">{t('zakah.business_note_title', language)}</h4>
                        <p className="text-xs text-indigo-100 leading-relaxed mt-1 font-medium">{t('zakah.business_note_desc', language)}</p>
                    </div>
                  </div>

                </div>
              )}
            </div>
          </div>
        </div>


        <button 
          onClick={handleCalculate}
          disabled={!manualPrices.gold || !manualPrices.silver}
          className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black shadow-[0_10px_30px_rgba(37,99,235,0.3)] hover:bg-blue-500 active:scale-[0.98] transition-all uppercase tracking-widest flex items-center justify-center space-x-3 disabled:bg-slate-700 disabled:shadow-none disabled:cursor-not-allowed"
        >
          <Scale size={18} />
          <span>{t('zakah.calculate_button', language)}</span>
        </button>

        {results && (
          <div className="pt-6 border-t border-white/10 space-y-6 animate-in fade-in duration-500">
            <h3 className="text-xl font-black text-center text-blue-300 uppercase tracking-widest">{t('zakah.results_title', language)}</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <ResultCard categoryKey="zakah.gold" data={results.gold} language={language} />
              <ResultCard categoryKey="zakah.silver" data={results.silver} language={language} />
              <ResultCard categoryKey="zakah.cash" data={results.cash} language={language} />
              <ResultCard categoryKey="zakah.business" data={results.business} language={language} />
            </div>
            {results.total > 0 && 
              <div className="mt-8 p-6 bg-slate-950/80 rounded-3xl border-2 border-blue-400/50 shadow-2xl text-center">
                <p className="text-[10px] text-blue-300 uppercase font-black tracking-widest">{t('zakah.total_payable', language)}</p>
                <h3 className="text-4xl font-black text-white tracking-tighter mt-1">₹ {results.total.toLocaleString(undefined, { maximumFractionDigits: 2 })}</h3>
              </div>
            }
          </div>
        )}
      </div>
    </div>
  );
};

const TabButton = ({ icon, label, active, onClick }: { icon: React.ReactNode, label: string; active: boolean; onClick: () => void; }) => (
    <button onClick={onClick} className={`flex-1 px-4 py-3 text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center space-x-2 border-b-2 ${active ? 'text-blue-400 border-blue-400' : 'text-slate-500 border-transparent hover:text-slate-300'}`}>
        {icon}
        <span>{label}</span>
    </button>
);

const InputGroup = ({ label, value, onChange, unit }: { label: string, value: number, onChange: (v: number) => void, unit: string }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ms-1">{label}</label>
    <div className="relative">
        <input type="number" className="w-full ps-10 pe-4 py-4 bg-slate-950 border border-white/10 rounded-2xl font-bold text-white text-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" placeholder="0" value={value || ''} onChange={(e) => onChange(Number(e.target.value))} />
        <span className="absolute start-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">{unit}</span>
    </div>
  </div>
);

const ResultCard = ({ categoryKey, data, language }: { categoryKey: string, data: ZakahResultItem, language: Language }) => (
  <div className={`p-5 rounded-2xl border ${data.eligible ? 'bg-emerald-600/10 border-emerald-500/20' : 'bg-rose-600/10 border-rose-500/20'}`}>
    <div className="flex justify-between items-center">
      <h4 className="font-black text-slate-100 uppercase">{t(categoryKey, language)}</h4>
      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase flex items-center space-x-1.5 ${data.eligible ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
        {data.eligible ? <CheckCircle size={12} /> : <XCircle size={12} />}
        <span>{data.eligible ? t('zakah.eligible_status', language) : t('zakah.ineligible_status', language)}</span>
      </span>
    </div>

    {data.eligible ? (
       <p className="text-3xl font-black text-white mt-4 tracking-tight">₹ {data.zakah.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
    ) : (
       <p className="text-3xl font-black text-slate-600 mt-4 tracking-tight">₹ 0</p>
    )}
    
    <div className="mt-4 pt-3 border-t border-white/5 grid grid-cols-2 gap-2 text-center">
        <div>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{t('zakah.your_value', language)}</p>
            <p className="text-xs font-bold text-white mt-1">₹ {data.zakatableValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
        </div>
        <div>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{t('zakah.nisab_value', language)}</p>
            <p className="text-xs font-bold text-white mt-1">₹ {data.nisabValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
        </div>
    </div>

  </div>
);

export default ZakahCalc;
