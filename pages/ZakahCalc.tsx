
import React, { useState, useEffect } from 'react';
import { ZakahInputs, Page, School, Language } from '../types';
import { fetchGoldPrice, NISAB_GOLD_GRAMS } from '../services/goldApi';
import { ArrowLeft, Wallet, AlertTriangle, ShieldCheck, Scale } from 'lucide-react';
import { t } from '../services/translations';

interface Props {
  setPage: (page: Page) => void;
  school: School;
  language: Language;
}

const ZakahCalc: React.FC<Props> = ({ setPage, school, language }) => {
  const [inputs, setInputs] = useState<ZakahInputs>({
    cash: 0,
    goldWeight: 0,
    silverWeight: 0,
    businessAssets: 0,
    debts: 0
  });
  const [goldPrice, setGoldPrice] = useState<number>(0);
  const [calculated, setCalculated] = useState(false);

  useEffect(() => {
    fetchGoldPrice().then(res => setGoldPrice(res.price));
  }, []);

  const schoolName = t(`school.${school}`, language);
  const allowsDebtDeduction = school === School.HANAFI || school === School.HANBALI;
  const thresholdValue = goldPrice * NISAB_GOLD_GRAMS;
  const totalAssets = inputs.cash + (inputs.goldWeight * goldPrice) + inputs.businessAssets; 
  const netWealth = allowsDebtDeduction ? Math.max(0, totalAssets - inputs.debts) : totalAssets;
  const thresholdReached = netWealth >= thresholdValue;
  const zakahPayable = thresholdReached ? netWealth * 0.025 : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <button onClick={() => setPage(Page.Home)} className="p-2.5 bg-slate-900 border border-white/10 rounded-xl text-blue-400 hover:bg-slate-800 transition-all">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-xl font-black text-white tracking-tight uppercase">{t('zakah.title', language)}</h2>
      </div>

      <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/10 space-y-6">
        <div className="bg-blue-600/10 p-5 rounded-2xl border border-blue-400/20 flex items-start space-x-4">
          <Scale className="text-blue-400 shrink-0 mt-1" size={20} />
          <div>
            <h4 className="text-[10px] font-black text-blue-300 uppercase tracking-widest">{t('zakah.school_position', language, { schoolName: schoolName })}</h4>
            <p className="text-xs text-blue-100 leading-relaxed mt-1 font-medium">
              {t(allowsDebtDeduction ? 'zakah.debt_deductible' : 'zakah.debt_not_deductible', language)}
            </p>
          </div>
        </div>

        <div className="space-y-5">
          <InputGroup label={t('zakah.cash_label', language)} value={inputs.cash} onChange={(v) => setInputs({...inputs, cash: v})} />
          <InputGroup label={t('zakah.gold_label', language)} value={inputs.goldWeight} onChange={(v) => setInputs({...inputs, goldWeight: v})} />
          <InputGroup label={t('zakah.trade_label', language)} value={inputs.businessAssets} onChange={(v) => setInputs({...inputs, businessAssets: v})} />
          
          <div className={`pt-2 transition-all ${!allowsDebtDeduction ? 'opacity-30 grayscale' : ''}`}>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ms-1 flex items-center">
              {t('zakah.debt_label', language)} {!allowsDebtDeduction && <AlertTriangle size={12} className="ms-2" />}
            </label>
            <input 
              type="number" 
              disabled={!allowsDebtDeduction}
              className={`w-full p-4 bg-slate-950 border border-white/10 rounded-2xl font-bold text-white transition-all ${!allowsDebtDeduction ? 'cursor-not-allowed opacity-50' : 'focus:ring-2 focus:ring-blue-500'}`}
              placeholder={t(allowsDebtDeduction ? 'zakah.debt_placeholder_yes' : 'zakah.debt_placeholder_no', language)}
              value={inputs.debts || ''}
              onChange={(e) => setInputs({...inputs, debts: Number(e.target.value)})}
            />
          </div>
        </div>

        <button 
          onClick={() => setCalculated(true)}
          className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black shadow-[0_10px_30px_rgba(37,99,235,0.3)] hover:bg-blue-500 active:scale-[0.98] transition-all uppercase tracking-widest"
        >
          {t('zakah.calculate_button', language)}
        </button>

        {calculated && (
          <div className="mt-8 p-6 bg-slate-950/80 rounded-3xl border border-blue-400/30 animate-in zoom-in duration-300 shadow-2xl relative overflow-hidden">
             <div className="flex justify-between items-center mb-5">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{t('zakah.nisab_check', language)}</span>
              <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${thresholdReached ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'}`}>
                {t(thresholdReached ? 'zakah.payable' : 'zakah.exempt', language)}
              </span>
            </div>
            <p className="text-[10px] text-blue-300 uppercase font-black tracking-widest">{t('zakah.zakah_amount', language)}</p>
            <h3 className="text-4xl font-black text-white tracking-tighter">₹ {zakahPayable.toLocaleString(undefined, { maximumFractionDigits: 2 })}</h3>
          </div>
        )}
      </div>
    </div>
  );
};

const InputGroup = ({ label, value, onChange }: { label: string, value: number, onChange: (v: number) => void }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ms-1">{label}</label>
    <input type="number" className="w-full p-4 bg-slate-950 border border-white/10 rounded-2xl font-bold text-white text-lg" value={value || ''} onChange={(e) => onChange(Number(e.target.value))} />
  </div>
);

export default ZakahCalc;
