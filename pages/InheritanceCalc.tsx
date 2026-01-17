
import React, { useState } from 'react';
import { HeirInput, Page, CalculationResult, School, Language } from '../types';
import { calculateInheritance } from '../services/inheritanceEngine';
import { ArrowLeft, User, Plus, Minus, Calculator, Users, HelpCircle, Ghost, TrendingUp, TrendingDown, Info } from 'lucide-react';
import { t } from '../services/translations';

interface Props {
  mode: 'share' | 'amount';
  setPage: (page: Page) => void;
  school: School;
  language: Language;
}

type DistributionType = 'value' | 'area';
type AreaUnit = 'cent' | 'sqft' | 'acre';

const HEIR_CONFIG = [
    { categoryKey: 'heir.category_primary', heirs: ['husband', 'wife', 'sons', 'daughters', 'father', 'mother'] },
    { categoryKey: 'heir.category_grandchildren', heirs: ['grandSons', 'grandDaughters'] },
    { categoryKey: 'heir.category_grandparents', heirs: ['pGrandfather', 'mGrandmother', 'pGrandmother'] },
    { categoryKey: 'heir.category_full_siblings', heirs: ['fullBrothers', 'fullSisters'] },
    { categoryKey: 'heir.category_cons_siblings', heirs: ['consBrothers', 'consSisters'] },
    { categoryKey: 'heir.category_uter_siblings', heirs: ['uterBrothers', 'uterSisters'] },
    { categoryKey: 'heir.category_agnates', heirs: ['fullBrotherSon', 'consBrotherSon', 'fullPaternalUncle', 'consPaternalUncle', 'fullPaternalUncleSon', 'consPaternalUncleSon'] },
    { categoryKey: 'heir.category_wala', heirs: ['maleEmancipator', 'femaleEmancipator'] }
];

const HEIR_META: { [key: string]: { labelKey: string, max?: number, disabledBy?: string } } = {
    husband: { labelKey: 'heir.husband', max: 1 },
    wife: { labelKey: 'heir.wife', max: 4, disabledBy: 'husband' },
    sons: { labelKey: 'heir.sons' },
    daughters: { labelKey: 'heir.daughters' },
    father: { labelKey: 'heir.father', max: 1 },
    mother: { labelKey: 'heir.mother', max: 1 },
    grandSons: { labelKey: 'heir.grandSons' },
    grandDaughters: { labelKey: 'heir.grandDaughters' },
    pGrandfather: { labelKey: 'heir.pGrandfather', max: 1 },
    mGrandmother: { labelKey: 'heir.mGrandmother', max: 1 },
    pGrandmother: { labelKey: 'heir.pGrandmother', max: 1 },
    fullBrothers: { labelKey: 'heir.fullBrothers' },
    fullSisters: { labelKey: 'heir.fullSisters' },
    consBrothers: { labelKey: 'heir.consBrothers' },
    consSisters: { labelKey: 'heir.consSisters' },
    uterBrothers: { labelKey: 'heir.uterBrothers' },
    uterSisters: { labelKey: 'heir.uterSisters' },
    fullBrotherSon: { labelKey: 'heir.fullBrotherSon' },
    consBrotherSon: { labelKey: 'heir.consBrotherSon' },
    fullPaternalUncle: { labelKey: 'heir.fullPaternalUncle' },
    consPaternalUncle: { labelKey: 'heir.consPaternalUncle' },
    fullPaternalUncleSon: { labelKey: 'heir.fullPaternalUncleSon' },
    consPaternalUncleSon: { labelKey: 'heir.consPaternalUncleSon' },
    maleEmancipator: { labelKey: 'heir.maleEmancipator', max: 1 },
    femaleEmancipator: { labelKey: 'heir.femaleEmancipator', max: 1 },
};

const InheritanceCalc: React.FC<Props> = ({ mode, setPage, school, language }) => {
  const [inputs, setInputs] = useState<HeirInput>({});
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [totalArea, setTotalArea] = useState<number>(0);
  const [distributionType, setDistributionType] = useState<DistributionType>('value');
  const [areaUnit, setAreaUnit] = useState<AreaUnit>('cent');
  const [results, setResults] = useState<CalculationResult | null>(null);
  const [totalAreaInCents, setTotalAreaInCents] = useState<number>(0);

  const schoolName = t(`school.${school}`, language);

  const updateHeir = (key: string, delta: number) => {
    setInputs(prev => {
        const currentVal = prev[key] || 0;
        const newVal = Math.max(0, currentVal + delta);
        const newInputs = { ...prev, [key]: newVal };
        if (key === 'husband' && newVal > 0) newInputs.wife = 0;
        if (key === 'wife' && newVal > 0) newInputs.husband = 0;
        return newInputs;
    });
  };

  const handleCalculate = () => {
    let valueForEngine: number;

    if (distributionType === 'value') {
      valueForEngine = totalAmount;
    } else {
      let convertedArea: number;
      if (areaUnit === 'acre') {
        convertedArea = totalArea * 100;
      } else if (areaUnit === 'sqft') {
        convertedArea = totalArea / 435.6;
      } else {
        convertedArea = totalArea;
      }
      valueForEngine = convertedArea;
      setTotalAreaInCents(convertedArea);
    }

    const res = calculateInheritance(inputs, valueForEngine > 0 ? valueForEngine : undefined, school, language);
    setResults(res);
  };

  if (results) {
    const totalValue = distributionType === 'value' ? totalAmount : totalAreaInCents;
    return (
      <div className="space-y-6 lg:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16">
        <button onClick={() => setResults(null)} className="flex items-center text-blue-400 text-sm font-black uppercase tracking-[0.2em] hover:text-blue-300 transition-colors">
          <ArrowLeft size={16} className="me-2" /> {t('calc.adjust_heirs', language)}
        </button>

        <div className="bg-slate-900/60 backdrop-blur-xl rounded-[2.5rem] p-6 lg:p-10 shadow-2xl border border-white/10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight flex items-center">
                <Calculator className="me-4 text-blue-400" size={32} />
                {t('calc.distribution_report', language)}
              </h2>
              <p className="text-[10px] text-blue-400 font-black uppercase tracking-[0.2em] mt-1">{t('calc.school', language)}: {schoolName}</p>
            </div>
            {mode === 'amount' && (
              <div className="text-left sm:text-right">
                <span className="block text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">
                  {distributionType === 'value' ? t('calc.total_estate', language) : t('calc.total_estate_area', language)}
                </span>
                <span className="text-xl font-black text-blue-400">
                  {distributionType === 'value' 
                    ? `₹${totalValue.toLocaleString()}`
                    : `${totalValue.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${t('calc.unit_cent', language)}`
                  }
                </span>
              </div>
            )}
          </div>

          {(results.awl || results.radd) && (
            <div className={`p-6 rounded-3xl border-2 flex items-center gap-4 mb-8 shadow-2xl ${results.awl ? 'bg-purple-600/10 border-purple-500/50' : 'bg-cyan-600/10 border-cyan-500/50'}`}>
                {results.awl ? <TrendingDown size={32} className="text-purple-400"/> : <TrendingUp size={32} className="text-cyan-400"/>}
                <div>
                    <h3 className={`text-lg font-black uppercase tracking-tight ${results.awl ? 'text-purple-400' : 'text-cyan-400'}`}>{results.awl ? t('calc.awl_title', language) : t('calc.radd_title', language)}</h3>
                    <p className="text-xs text-slate-300 font-medium">{results.awl ? t('calc.awl_desc', language, { asl: results.asl, finalAsl: results.finalAsl }) : t('calc.radd_desc', language, { asl: results.asl })}</p>
                </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            {results.winners.filter(r => r.percentage > 0).map((res) => (
              <div key={res.id} className={`p-6 bg-white/5 rounded-3xl border border-white/5 relative overflow-hidden ${res.isRaddRecipient ? 'border-cyan-500/30' : ''}`}>
                <h3 className="font-black text-slate-100 text-lg tracking-wide">{res.name}{res.count > 1 ? ` (x${res.count})`: ''}</h3>
                <p className="text-[11px] text-slate-400 font-bold leading-relaxed mt-2 uppercase tracking-tighter">{res.reason}</p>
                <div className="flex justify-between items-end my-4">
                    <div className="text-blue-400 font-black text-3xl drop-shadow-[0_0_10px_rgba(96,165,250,0.3)]">{res.finalFraction}</div>
                    {(results.awl || results.radd) && <div className="text-slate-500 font-bold text-sm line-through">{res.baseFraction}</div>}
                    <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">{res.percentage.toFixed(2)}%</div>
                </div>
                {mode === 'amount' && res.amount !== undefined && (
                    <div className="mt-4 flex flex-wrap gap-2">
                        <div className="bg-blue-600/20 border border-blue-400/30 px-3 py-1.5 rounded-xl text-xs font-black text-blue-300">
                          {t('calc.total', language)}: {
                            distributionType === 'value' 
                              ? `₹${res.amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
                              : `${res.amount.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${t('calc.unit_cent', language)}`
                          }
                        </div>
                        {res.count > 1 && <div className="bg-indigo-600/20 border border-indigo-400/30 px-3 py-1.5 rounded-xl text-xs font-black text-indigo-300">
                          {t('calc.each', language)}: {
                            distributionType === 'value' 
                              ? `₹${(res.amount / res.count).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
                              : `${(res.amount / res.count).toLocaleString(undefined, { maximumFractionDigits: 2 })} ${t('calc.unit_cent', language)}`
                          }
                        </div>}
                    </div>
                )}
              </div>
            ))}
          </div>

           {results.losers.length > 0 && (
                <div className="mt-12">
                    <h3 className="text-xl font-black text-rose-500 flex items-center gap-3 uppercase tracking-wider mb-6"><Ghost size={24}/> {t('calc.excluded_heirs', language)}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {results.losers.map(res => (
                            <div key={res.id} className="p-5 bg-rose-500/5 rounded-2xl border border-rose-500/10">
                                <h4 className="font-black text-slate-300">{res.name}{res.count > 1 ? ` (x${res.count})`: ''}</h4>
                                <p className="text-xs text-rose-400 font-bold mt-1">{res.reason}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10 max-w-5xl mx-auto w-full">
      <div className="flex items-center space-x-4">
        <button onClick={() => setPage(Page.Home)} className="p-3 bg-slate-900 border border-white/10 rounded-2xl text-blue-400 hover:bg-slate-800 transition-all shadow-lg">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-2xl lg:text-3xl font-black text-white tracking-tight uppercase">{mode === 'amount' ? t('calc.financial_estate', language) : t('calc.fractional_shares', language)}</h2>
      </div>

      <div className="bg-slate-900/50 backdrop-blur-xl rounded-[2.5rem] p-6 lg:p-10 shadow-2xl border border-white/10 space-y-8 lg:space-y-12">
        {mode === 'amount' && (
          <div className="max-w-md mx-auto space-y-6">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ms-2 mb-2 block">{t('calc.select_distribution_method', language)}</label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-2xl border border-white/10">
                <button onClick={() => setDistributionType('value')} className={`px-4 py-3 rounded-xl text-xs font-black transition-all ${distributionType === 'value' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-white/5'}`}>
                  {t('calc.dist_by_value', language)}
                </button>
                <button onClick={() => setDistributionType('area')} className={`px-4 py-3 rounded-xl text-xs font-black transition-all ${distributionType === 'area' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-white/5'}`}>
                  {t('calc.dist_by_area', language)}
                </button>
              </div>
            </div>
            {distributionType === 'value' ? (
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ms-2">{t('calc.total_net_estate', language)}</label>
                <div className="p-4 bg-amber-600/10 rounded-2xl border border-amber-400/20 text-xs text-amber-200 flex items-start gap-3">
                  <Info size={16} className="shrink-0 mt-0.5"/>
                  <span>{t('calc.net_estate_note', language)}</span>
                </div>
                <input type="number" placeholder="0" className="w-full p-6 bg-slate-950 border border-white/10 rounded-3xl focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all text-white font-black text-2xl" value={totalAmount || ''} onChange={(e) => setTotalAmount(Number(e.target.value))} />
              </div>
            ) : (
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ms-2">{t('calc.total_area', language)}</label>
                <input type="number" placeholder="0" className="w-full p-6 bg-slate-950 border border-white/10 rounded-3xl focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all text-white font-black text-2xl" value={totalArea || ''} onChange={(e) => setTotalArea(Number(e.target.value))} />
                <div className="grid grid-cols-3 gap-2 p-1 bg-slate-950 rounded-2xl border border-white/10">
                  <button onClick={() => setAreaUnit('cent')} className={`px-4 py-3 rounded-xl text-xs font-black transition-all ${areaUnit === 'cent' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-white/5'}`}>{t('calc.unit_cent', language)}</button>
                  <button onClick={() => setAreaUnit('sqft')} className={`px-4 py-3 rounded-xl text-xs font-black transition-all ${areaUnit === 'sqft' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-white/5'}`}>{t('calc.unit_sqft', language)}</button>
                  <button onClick={() => setAreaUnit('acre')} className={`px-4 py-3 rounded-xl text-xs font-black transition-all ${areaUnit === 'acre' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-white/5'}`}>{t('calc.unit_acre', language)}</button>
                </div>
                <div className="p-4 bg-indigo-600/10 rounded-2xl border border-indigo-400/20 text-xs text-indigo-200 flex items-start gap-3">
                  <Info size={16} className="shrink-0 mt-0.5"/>
                  <span>{t('calc.area_conversion_note', language)}</span>
                </div>
              </div>
            )}
          </div>
        )}
        
        {HEIR_CONFIG.map(cat => (
            <div key={cat.categoryKey}>
                <h3 className="text-xs font-black text-blue-400 uppercase tracking-[0.3em] mb-4 ms-2">{t(cat.categoryKey, language)}</h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {cat.heirs.map(id => {
                        const meta = HEIR_META[id];
                        const isDisabled = meta.disabledBy && (inputs[meta.disabledBy] || 0) > 0;
                        return <Counter key={id} label={t(meta.labelKey, language)} value={inputs[id] || 0} onDelta={(d) => updateHeir(id, d)} max={meta.max} disabled={isDisabled} />;
                    })}
                </div>
            </div>
        ))}
        
        <div className="max-w-md mx-auto pt-4">
          <button onClick={handleCalculate} className="w-full bg-blue-600 text-white py-6 rounded-3xl font-black flex items-center justify-center space-x-4 shadow-[0_20px_40px_rgba(37,99,235,0.25)] hover:bg-blue-500 active:scale-[0.98] transition-all uppercase tracking-[0.2em] text-lg">
            <Calculator size={24} /> <span>{t('calc.calculate_distribution', language)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

interface CounterProps {
  label: string;
  value: number;
  onDelta: (d: number) => void;
  max?: number;
  disabled?: boolean;
}

const Counter: React.FC<CounterProps> = ({ label, value, onDelta, max = 99, disabled = false }) => (
  <div className={`flex flex-col p-5 rounded-3xl border bg-slate-950 border-white/5 ${disabled ? 'opacity-20 pointer-events-none' : 'hover:border-white/20 transition-all'}`}>
    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">{label}</span>
    <div className="flex items-center justify-between mt-auto">
      <button onClick={() => onDelta(-1)} className="p-2.5 bg-slate-900 rounded-xl border border-white/10 text-slate-400 hover:text-blue-400 hover:border-blue-400/50 transition-all active:scale-90"><Minus size={16} /></button>
      <span className="font-black text-white text-3xl tracking-tighter">{value}</span>
      <button onClick={() => onDelta(1)} disabled={value >= max} className="p-2.5 bg-slate-900 rounded-xl border border-white/10 text-slate-400 hover:text-blue-400 hover:border-blue-400/50 transition-all active:scale-90 disabled:opacity-30"><Plus size={16} /></button>
    </div>
  </div>
);

export default InheritanceCalc;
