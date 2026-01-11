
import React from 'react';
import { Wallet, CheckCircle2, AlertCircle, ShieldCheck, Scale, Info } from 'lucide-react';
import { School, Language } from '../types';
import { t } from '../services/translations';

interface Props {
  school: School;
  language: Language;
}

const RulesZakah: React.FC<Props> = ({ school, language }) => {
  const isHanafi = school === School.HANAFI;
  const isHanbali = school === School.HANBALI;
  const allowsDebtDeduction = isHanafi || isHanbali;
  const schoolName = t(`school.${school}`, language);
  const debtPosition = t(allowsDebtDeduction ? 'rules.zakah_debt_deductible' : 'rules.zakah_debt_not_deductible', language);

  return (
    <div className="space-y-6 max-w-2xl mx-auto px-1">
      <div className="text-center mb-10">
        <div className="inline-block p-5 bg-purple-500/10 rounded-3xl mb-5 border border-purple-400/20 shadow-2xl">
          <Wallet className="text-purple-400" size={44} />
        </div>
        <h1 className="text-3xl font-black text-white leading-tight tracking-tight uppercase">{t('rules.zakah_page_title', language, { schoolName })}</h1>
        <p className="text-xs text-slate-400 font-bold tracking-widest mt-2 uppercase">{t('rules.zakah_page_subtitle', language, { schoolName })}</p>
      </div>

      <section className="bg-slate-900/40 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/10">
        <h2 className="text-xl font-black text-slate-100 mb-6 flex items-center uppercase tracking-wide">
          <CheckCircle2 className="text-emerald-400 mr-3" size={24} />
          {t('rules.zakah_obligation_criteria', language)}
        </h2>
        <div className="space-y-5">
          <ConditionItem 
            title={t('rules.zakah_nisab_title', language)} 
            desc={t('rules.zakah_nisab_desc', language)}
          />
          <ConditionItem 
            title={t('rules.zakah_hawl_title', language)} 
            desc={t('rules.zakah_hawl_desc', language)}
          />
          <ConditionItem 
            title={t('rules.zakah_ownership_title', language)} 
            desc={t('rules.zakah_ownership_desc', language)}
          />
        </div>
      </section>

      <section className="bg-slate-900/40 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/10">
        <div className="flex items-center space-x-3 mb-6">
          <AlertCircle className="text-amber-400" size={24} />
          <h2 className="text-xl font-black text-slate-100 uppercase tracking-wide">{t('rules.zakah_debt_rule_title', language)}</h2>
        </div>
        <div className={`p-5 rounded-2xl border ${allowsDebtDeduction ? 'bg-emerald-500/10 border-emerald-400/20' : 'bg-blue-500/10 border-blue-400/20'}`}>
          <p className="text-xs font-bold leading-relaxed text-slate-200 uppercase tracking-tight mb-2">
            {t('rules.zakah_debt_position', language, { position: debtPosition })}
          </p>
          <p className="text-[11px] leading-relaxed text-slate-400">
            {t(allowsDebtDeduction ? 'rules.zakah_debt_desc_yes' : 'rules.zakah_debt_desc_no', language, { schoolName })}
          </p>
        </div>
      </section>

      <section className="bg-slate-900/40 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/10">
        <h2 className="text-xl font-black text-slate-100 mb-6 flex items-center uppercase tracking-wide">
          <Info className="text-blue-400 mr-3" size={24} />
          {t('rules.zakah_standard_rates', language)}
        </h2>
        <ul className="grid grid-cols-1 gap-3">
          <AssetItem name={t('rules.zakah_asset_cash', language)} status="2.5%" />
          <AssetItem name={t('rules.zakah_asset_gold', language)} status="2.5%" />
          <AssetItem name={t('rules.zakah_asset_trade', language)} status="2.5%" />
          <AssetItem name={t('rules.zakah_asset_agri', language)} status="5% - 10%" />
        </ul>
      </section>

      <div className="p-6 bg-slate-950/80 rounded-3xl border border-blue-400/20 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl"></div>
        <h4 className="text-[10px] font-black text-blue-300 uppercase tracking-widest mb-3 flex items-center">
          <ShieldCheck className="mr-2" size={14} /> {t('rules.zakah_recipient_title', language)}
        </h4>
        <p className="text-xs text-slate-400 leading-relaxed font-medium">
          {t('rules.zakah_recipient_desc', language)}
        </p>
      </div>
    </div>
  );
};

const ConditionItem = ({ title, desc }: { title: string, desc: string }) => (
  <div className="flex flex-col group">
    <span className="text-sm font-black text-slate-100 uppercase tracking-wider group-hover:text-blue-400 transition-colors">{title}</span>
    <span className="text-xs text-slate-400 mt-2 leading-relaxed font-medium">{desc}</span>
  </div>
);

const AssetItem = ({ name, status }: { name: string, status: string }) => (
  <li className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-all">
    <span className="text-xs font-black text-slate-200 uppercase tracking-widest">{name}</span>
    <span className="text-[10px] font-black bg-blue-600/20 text-blue-300 px-3 py-1.5 rounded-lg border border-blue-400/30 uppercase tracking-widest">{status}</span>
  </li>
);

export default RulesZakah;