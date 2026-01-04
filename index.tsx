
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Scale, Calculator, Wallet, ArrowLeft, Plus, Minus, UserX, UserCheck, 
  AlertTriangle, CheckCircle2, RefreshCcw, Layers, Info, User, 
  Zap, BookOpen, FileText, ChevronRight, Award
} from 'lucide-react';

// --- UTILS ---
const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
const lcm = (a: number, b: number): number => (a * b) / gcd(a, b);
const getLCMOfArray = (arr: number[]): number => arr.length === 0 ? 1 : arr.reduce((acc, val) => lcm(acc, val), 1);

// --- CONSTANTS ---
const GOLD_PRICE_FIXED = 6250; 
const NISAB_GOLD = 85;

// --- TRANSLATIONS ---
const TRANSLATIONS: any = {
  en: { 
    title: "Fiqh Hub", subtitle: "Shāfiʿī Jurisprudence Platform", home: "Home", inheritance: "Inheritance", zakath: "Zakah", 
    back: "Back", calculate: "Calculate", estateValue: "Total Estate Value (INR)", runEngine: "Run Engine", 
    share: "Share", perHead: "Per Individual", blockedBy: "Blocked By", mahjub: "Mahjub", 
    cashSavings: "Cash & Savings", goldWeight: "Gold Weight (g)", businessStock: "Trade Assets",
    mahjubTitle: "Excluded Relatives (Mahjub)", awlTitle: "Al-Awl (Increase) Detected",
    awlDesc: "Total shares exceeded the base. Fractions are proportionally reduced. Affected heirs highlighted in Purple.",
    jabarTitle: "Jabar Case Detected", jabarDesc: "Male relative forced female into residue (Asabah) instead of her fixed share. Highlighted in Amber.",
    doubleCheckTitle: "Confirm Data", doubleCheckMsg: "Please verify all heir counts and the total estate before generating the final Shāfiʿī report.",
    confirmBtn: "Generate Results", cancelBtn: "Cancel", deceasedGender: "Deceased Gender",
    male: "Male", female: "Female", maxLimit: "Max Limit",
    detailedSummary: "Jurisprudential Methodology", methodologyDesc: "Breakdown of the Fiqh logic used for this specific case:",
    jabarTag: "Jabar Logic", awlTag: "Awl Adjusted", asabahTag: "Asabah", fixedTag: "Dhu al-Furud",
    cats: { 
      primary: "Primary Heirs", descendants: "Descendants", ancestors: "Ancestors", 
      siblings: "Siblings", nephews: "Nephews", uncles: "Uncles", cousins: "Cousins" 
    } 
  },
  ml: { 
    title: "ഫിഖ്ഹ് ഹബ്", subtitle: "ഷാഫിഈ കർമ്മശാസ്ത്രം", home: "ഹോം", inheritance: "അനന്തരാവകാശം", zakath: "സകാത്ത്", 
    back: "പിന്നിലേക്ക്", calculate: "കണക്കാക്കുക", estateValue: "സ്വത്ത് മൂല്യം", runEngine: "കണക്കുകൂട്ടുക", 
    share: "ഓഹരി", perHead: "ഒരാൾക്ക്", blockedBy: "തടഞ്ഞത്", mahjub: "ഹജ്ബ്", 
    cashSavings: "പണം & നിക്ഷേപം", goldWeight: "സ്വർണ്ണം (ഗ്രാം)", businessStock: "ബിസിനസ്സ് സ്റ്റോക്ക്",
    mahjubTitle: "ഹജ്ബ് ചെയ്യപ്പെട്ടവർ (Mahjub)", awlTitle: "ഔൽ മസ്അല (Al-Awl)",
    awlDesc: "ആകെ ഓഹരികൾ അടിസ്ഥാന സംഖ്യയേക്കാൾ വർദ്ധിച്ചു. എല്ലാവർക്കും ആനുപാതികമായ കുറവ് വരുത്തിയിട്ടുണ്ട് (Purple highlight).",
    jabarTitle: "ജബർ മസ്അല (Jabar Case)", jabarDesc: "ആൺ ബന്ധു പെൺ ബന്ധുവിനെ 'അസ്വബ'യാക്കി (Residue) മാറ്റിയ സാഹചര്യം. ഇവരെ താഴെ മഞ്ഞ നിറത്തിൽ (Amber) കാണാം.",
    doubleCheckTitle: "വിവരങ്ങൾ പരിശോധിക്കുക", doubleCheckMsg: "അവകാശികളുടെ എണ്ണവും സ്വത്ത് വിവരങ്ങളും കൃത്യമാണെന്ന് ഉറപ്പുവരുത്തിയ ശേഷം റിപ്പോർട്ട് കാണുക.",
    confirmBtn: "ഫലം കാണിക്കുക", cancelBtn: "പിന്നിലേക്ക്", deceasedGender: "മരണപ്പെട്ട വ്യക്തി",
    male: "പുരുഷൻ", female: "സ്ത്രീ", maxLimit: "പരിധി കഴിഞ്ഞു",
    detailedSummary: "ഫിഖ്ഹ് വിശകലനം (Principles)", methodologyDesc: "ഈ കേസിൽ ഉപയോഗിച്ച പ്രധാന നിയമങ്ങളുടെ വിവരണം താഴെ നൽകുന്നു:",
    jabarTag: "ജബർ മസ്അല", awlTag: "ഔൽ മാറ്റം", asabahTag: "അസ്വബ", fixedTag: "ഫർള്",
    cats: { 
      primary: "പ്രധാന അവകാശികൾ", descendants: "സന്താനങ്ങൾ", ancestors: "മുൻഗാമികൾ", 
      siblings: "സഹോദരങ്ങൾ", nephews: "സഹോദര പുത്രന്മാർ", uncles: "പിതൃ സഹോദരന്മാർ", cousins: "പിതൃസഹോദര പുത്രന്മാർ" 
    } 
  }
};

const HEIR_DATA: any = {
  husband: { term: "Az-Zawj", en: "Husband", ml: "ഭർത്താവ്", rules: "1/2 or 1/4", max: 1 },
  wife: { term: "Az-Zawjah", en: "Wife", ml: "ഭാര്യ", rules: "1/4 or 1/8", max: 4 },
  father: { term: "Al-Ab", en: "Father", ml: "പിതാവ്", rules: "1/6, Asabah", max: 1 },
  mother: { term: "Al-Umm", en: "Mother", ml: "മാതാവ്", rules: "1/6 or 1/3", max: 1 },
  sons: { term: "Al-Ibn", en: "Son", ml: "മകൻ", max: 20 },
  daughters: { term: "Al-Bint", en: "Daughter", ml: "മകൾ", max: 20 },
  grandsons: { term: "Ibn al-Ibn", en: "Grandson", ml: "മകന്റെ മകൻ", max: 20 },
  granddaughters: { term: "Bint al-Ibn", en: "Granddaughter", ml: "മകന്റെ മകൾ", max: 20 },
  greatGrandsons: { term: "Ibn Ibn al-Ibn", en: "Gt-Grandson", ml: "മകന്റെ മകന്റെ മകൻ", max: 20 },
  greatGranddaughters: { term: "Bint Ibn al-Ibn", en: "Gt-Granddaughter", ml: "മകന്റെ മകന്റെ മകൾ", max: 20 },
  grandfather: { term: "Al-Jadd", en: "Grandfather", ml: "പിതാമഹൻ", max: 1 },
  patGrandmother: { term: "Al-Jaddah Ab", en: "Pat. Grandma", ml: "പിതാവിന്റെ മാതാവ്", max: 1 },
  matGrandmother: { term: "Al-Jaddah Umm", en: "Mat. Grandma", ml: "മാതാവിന്റെ മാതാവ്", max: 1 },
  greatGrandfather: { term: "Al-Jadd al-A'la", en: "Gt-Grandfather", ml: "പിതാവിന്റെ പിതാവ്", max: 1 },
  fullBrothers: { term: "Al-Akh Shaqiq", en: "Full Brother", ml: "സഹോദരൻ", max: 20 },
  fullSisters: { term: "Al-Ukht Shaqiqah", en: "Full Sister", ml: "സഹോദരി", max: 20 },
  patBrothers: { term: "Al-Akh Ab", en: "Pat. Brother", ml: "പിതൃ സഹോദരൻ", max: 20 },
  patSisters: { term: "Al-Ukht Ab", en: "Pat. Sister", ml: "പിതൃ സഹോദരി", max: 20 },
  matBrothers: { term: "Al-Akh Umm", en: "Mat. Brother", ml: "മാതൃ സഹോദരൻ", max: 20 },
  matSisters: { term: "Al-Ukht Umm", en: "Mat. Sister", ml: "മാതൃ സഹോദരി", max: 20 },
  fullBroSon: { term: "Ibn al-Shaqiq", en: "Full Nephew", ml: "സഹോദര പുത്രൻ", max: 20 },
  patBroSon: { term: "Ibn al-Akh Ab", en: "Pat. Nephew", ml: "പിതൃ സഹോദര പുത്രൻ", max: 20 },
  fullBroGrs: { term: "Ibn Ibn Shaqiq", en: "Full Nephew Gs", ml: "സഹോദര പൗത്രൻ", max: 20 },
  patBroGrs: { term: "Ibn Ibn Akh Ab", en: "Pat. Nephew Gs", ml: "പിതൃ സഹോദര പൗത്രൻ", max: 20 },
  fullPatUncle: { term: "Al-Amm Shaqiq", en: "Full P. Uncle", ml: "പിതൃ സഹോദരൻ (Shaqiq)", max: 20 },
  patUncle: { term: "Al-Amm Li-Ab", en: "Pat. P. Uncle", ml: "പിതൃ സഹോദരൻ (Ab)", max: 20 },
  fullPatUncleSon: { term: "Ibn al-Amm Shaqiq", en: "Full Cousin", ml: "പിതൃ സഹോദര പുത്രൻ", max: 20 },
  patUncleSon: { term: "Ibn al-Amm Ab", en: "Pat. Cousin", ml: "പിതൃ സഹോദര പുത്രൻ (Ab)", max: 20 },
  fullPatUncleGrs: { term: "Ibn Ibn Amm", en: "Cousin's Son", ml: "പിതൃ സഹോദര പൗത്രൻ", max: 20 }
};

const HEIR_CATEGORIES = [
  { id: 'primary', heirs: ['husband', 'wife', 'father', 'mother'] },
  { id: 'descendants', heirs: ['sons', 'daughters', 'grandsons', 'granddaughters', 'greatGrandsons', 'greatGranddaughters'] },
  { id: 'ancestors', heirs: ['grandfather', 'patGrandmother', 'matGrandmother', 'greatGrandfather'] },
  { id: 'siblings', heirs: ['fullBrothers', 'fullSisters', 'patBrothers', 'patSisters', 'matBrothers', 'matSisters'] },
  { id: 'nephews', heirs: ['fullBroSon', 'patBroSon', 'fullBroGrs', 'patBroGrs'] },
  { id: 'uncles', heirs: ['fullPatUncle', 'patUncle'] },
  { id: 'cousins', heirs: ['fullPatUncleSon', 'patUncleSon', 'fullPatUncleGrs'] }
];

// --- ENGINE ---
const runInheritanceEngine = (inputs: any, estate: number) => {
  const h = (id: string) => inputs[id] || 0;
  let rawResults: any[] = [];
  let exclusions: any[] = [];
  let methodologyML: string[] = [];
  let methodologyEN: string[] = [];
  
  const addExcl = (id: string, blocker: string) => { 
    if (h(id) > 0) {
      exclusions.push({ id, blockedBy: HEIR_DATA[blocker]?.term || blocker });
      methodologyML.push(`${HEIR_DATA[id].ml} ഹജ്ബ് ചെയ്യപ്പെട്ടു (${HEIR_DATA[blocker].ml} ഉള്ളതിനാൽ).`);
      methodologyEN.push(`${HEIR_DATA[id].en} is excluded (Mahjub) because of ${HEIR_DATA[blocker].en}.`);
    }
  };
  
  const hasDesc = (h('sons') + h('daughters') + h('grandsons') + h('granddaughters') + h('greatGrandsons') + h('greatGranddaughters')) > 0;
  const hasMaleDesc = (h('sons') + h('grandsons') + h('greatGrandsons')) > 0;
  const sibCount = (h('fullBrothers') + h('fullSisters') + h('patBrothers') + h('patSisters') + h('matBrothers') + h('matSisters'));

  // Blocking logic (Hierarchy)
  if (h('sons') > 0) ['grandsons', 'granddaughters', 'greatGrandsons', 'greatGranddaughters'].forEach(id => addExcl(id, 'sons'));
  if (h('father') > 0) ['grandfather', 'greatGrandfather', 'patGrandmother', 'fullBrothers', 'fullSisters', 'patBrothers', 'patSisters', 'matBrothers', 'matSisters', 'fullBroSon', 'patBroSon', 'fullBroGrs', 'patBroGrs', 'fullPatUncle', 'patUncle', 'fullPatUncleSon', 'patUncleSon', 'fullPatUncleGrs'].forEach(id => addExcl(id, 'father'));
  if (h('mother') > 0) ['patGrandmother', 'matGrandmother'].forEach(id => addExcl(id, 'mother'));
  if (hasMaleDesc) ['fullBrothers', 'fullSisters', 'patBrothers', 'patSisters', 'matBrothers', 'matSisters', 'fullBroSon', 'patBroSon', 'fullBroGrs', 'patBroGrs', 'fullPatUncle', 'patUncle', 'fullPatUncleSon', 'patUncleSon', 'fullPatUncleGrs'].forEach(id => addExcl(id, h('sons') > 0 ? 'sons' : 'grandsons'));
  if (h('fullBrothers') > 0) ['patBrothers', 'patSisters', 'fullBroSon', 'patBroSon', 'fullBroGrs', 'patBroGrs', 'fullPatUncle', 'patUncle', 'fullPatUncleSon', 'patUncleSon', 'fullPatUncleGrs'].forEach(id => addExcl(id, 'fullBrothers'));

  const active = { ...inputs }; exclusions.forEach(e => active[e.id] = 0);

  // Assignment logic
  if (active.husband) {
    const d = hasDesc ? 4 : 2;
    rawResults.push({ id: 'husband', num: 1, den: d, type: 'fixed' });
    methodologyEN.push(`Husband receives 1/${d} ${hasDesc ? 'due to children' : 'as no children exist'}.`);
    methodologyML.push(`ഭർത്താവിന് 1/${d} ലഭിക്കുന്നു (${hasDesc ? 'സന്താനങ്ങൾ ഉള്ളതിനാൽ' : 'സന്താനങ്ങൾ ഇല്ലാത്തതിനാൽ'}).`);
  } else if (active.wife > 0) {
    const d = hasDesc ? 8 : 4;
    rawResults.push({ id: 'wife', num: 1, den: d, type: 'fixed' });
    methodologyEN.push(`Wife/Wives receive 1/${d} ${hasDesc ? 'due to children' : 'as no children exist'}.`);
    methodologyML.push(`ഭാര്യ(മാർ)ക്ക് 1/${d} ലഭിക്കുന്നു (${hasDesc ? 'സന്താനങ്ങൾ ഉള്ളതിനാൽ' : 'സന്താനങ്ങൾ ഇല്ലാത്തതിനാൽ'}).`);
  }

  if (active.mother) {
    const d = (hasDesc || sibCount >= 2) ? 6 : 3;
    rawResults.push({ id: 'mother', num: 1, den: d, type: 'fixed' });
    methodologyEN.push(`Mother receives 1/${d} ${hasDesc || sibCount >= 2 ? 'due to children or multiple siblings' : 'standard share'}.`);
    methodologyML.push(`മാതാവിന് 1/${d} ലഭിക്കുന്നു (${hasDesc || sibCount >= 2 ? 'സന്താനങ്ങളോ ഒന്നിലധികം സഹോദരങ്ങളോ ഉള്ളതിനാൽ' : 'സാധാരണ ഓഹരി'}).`);
  }

  if (active.father && hasMaleDesc) {
    rawResults.push({ id: 'father', num: 1, den: 6, type: 'fixed' });
    methodologyEN.push(`Father receives 1/6 fixed share due to male descendants.`);
    methodologyML.push(`ആൺ സന്താനങ്ങൾ ഉള്ളതിനാൽ പിതാവിന് 1/6 നിശ്ചിത ഓഹരി ലഭിക്കുന്നു.`);
  }

  if (active.daughters > 0 && active.sons === 0) {
    const n = active.daughters === 1 ? 1 : 2;
    const d = active.daughters === 1 ? 2 : 3;
    rawResults.push({ id: 'daughters', num: n, den: d, type: 'fixed' });
    methodologyEN.push(`Daughters receive ${n}/${d} fixed share (no sons present).`);
    methodologyML.push(`ആൺമക്കൾ ഇല്ലാത്തതിനാൽ പെൺമക്കൾക്ക് ${n}/${d} നിശ്ചിത ഓഹരി ലഭിക്കുന്നു.`);
  }

  // Base Asl Calculation
  const baseAsl = getLCMOfArray(rawResults.map(r => r.den || 1));
  let units = 0;
  rawResults.forEach(r => units += (baseAsl / r.den) * r.num);
  const isAwl = units > baseAsl;
  const finalAsl = isAwl ? units : baseAsl;

  if (isAwl) {
    methodologyEN.push(`Al-Awl (Increase) occurred. Total shares ${units} exceeded original base ${baseAsl}. Proportionally adjusted to ${finalAsl}.`);
    methodologyML.push(`ഔൽ മസ്അല സംഭവിച്ചു. ആകെ ഓഹരികൾ തികയാത്തതിനാൽ അടിസ്ഥാന സംഖ്യ ${baseAsl}-ൽ നിന്നും ${finalAsl}-ലേക്ക് വർദ്ധിപ്പിച്ചു.`);
  }

  let results = rawResults.map(r => ({
    ...r, ...HEIR_DATA[r.id],
    p: (((baseAsl / r.den) * r.num) / finalAsl) * 100,
    f: `${r.num}/${r.den}`,
    highlight: isAwl ? 'purple' : undefined,
    tag: 'fixed',
    amount: estate ? ((((baseAsl / r.den) * r.num) / finalAsl) * estate) : 0
  }));

  // Residue logic
  let residueUnits = finalAsl - units;
  let hasJabar = false;
  if (residueUnits > 0) {
    const asabahOrder = ['sons', 'grandsons', 'father', 'grandfather', 'fullBrothers', 'patBrothers', 'fullBroSon', 'patBroSon', 'fullPatUncle', 'patUncle'];
    const topAgnate = asabahOrder.find(id => active[id] > 0);
    if (topAgnate) {
      const partners: any = { 'sons': 'daughters', 'grandsons': 'granddaughters', 'fullBrothers': 'fullSisters', 'patBrothers': 'patSisters' };
      const pId = partners[topAgnate];
      if (pId && active[pId] > 0) {
        hasJabar = true;
        const maleCount = active[topAgnate];
        const femaleCount = active[pId];
        const totalU = maleCount * 2 + femaleCount;
        const resMale = (residueUnits / finalAsl) * (maleCount * 2 / totalU);
        const resFemale = (residueUnits / finalAsl) * (femaleCount / totalU);
        results.push({ id: topAgnate, ...HEIR_DATA[topAgnate], f: 'Asabah (2:1)', p: resMale * 100, highlight: 'amber', tag: 'jabar', amount: estate ? (resMale * estate) : 0 });
        results.push({ id: pId, ...HEIR_DATA[pId], f: 'Asabah (2:1)', p: resFemale * 100, highlight: 'amber', tag: 'jabar', amount: estate ? (resFemale * estate) : 0 });
        methodologyEN.push(`Jabar Case: ${HEIR_DATA[topAgnate].en} forced ${HEIR_DATA[pId].en} into residue (Asabah) with 2:1 distribution.`);
        methodologyML.push(`ജബർ മസ്അല: ${HEIR_DATA[topAgnate].ml}, ${HEIR_DATA[pId].ml}-നെ 'അസ്വബ'യാക്കി മാറ്റി (2:1 അനുപാതത്തിൽ വിഹിതം വെക്കുന്നു).`);
      } else {
        results.push({ id: topAgnate, ...HEIR_DATA[topAgnate], f: 'Asabah', p: (residueUnits / finalAsl) * 100, tag: 'asabah', amount: estate ? ((residueUnits / finalAsl) * estate) : 0 });
        methodologyEN.push(`${HEIR_DATA[topAgnate].en} takes the remaining residue (Asabah).`);
        methodologyML.push(`${HEIR_DATA[topAgnate].ml} ബാക്കി വരുന്ന മുഴുവൻ സ്വത്തും (അസ്വബ) കൈപ്പറ്റുന്നു.`);
      }
    }
  }

  return { winners: results, losers: exclusions.map(e => ({ ...e, ...HEIR_DATA[e.id] })), awl: isAwl, hasJabar, methodologyML, methodologyEN };
};

const App = () => {
  const [state, setState] = useState<any>({
    page: 'splash', lang: 'ml', deceasedGender: 'male', inheritanceInputs: {}, estate: 0, results: null,
    isConfirming: false, zakahInputs: { cash: 0, gold: 0, business: 0 }
  });

  const t = TRANSLATIONS[state.lang];

  const updateHeir = (id: string, delta: number) => {
    const max = HEIR_DATA[id]?.max || 20;
    const nextValue = Math.max(0, Math.min(max, (state.inheritanceInputs[id] || 0) + delta));
    setState((s: any) => ({ ...s, inheritanceInputs: { ...s.inheritanceInputs, [id]: nextValue } }));
  };

  if (state.page === 'splash') {
    return (
      <div className="fixed inset-0 bg-[#020617] flex flex-col items-center justify-center p-6 text-center animate-fade-in overflow-hidden">
        <div className="star-field opacity-20 absolute inset-0"></div>
        <Scale size={80} className="text-blue-500 mb-8 animate-bounce" />
        <h1 className="text-6xl font-black text-white tracking-tighter uppercase mb-4">{t.title}</h1>
        <p className="text-blue-400 font-bold uppercase tracking-[0.4em] text-xs">{t.subtitle}</p>
        <div className="flex bg-slate-900/60 p-1.5 rounded-2xl border border-white/10 my-10 relative z-10">
          {['en', 'ml'].map(l => (
            <button key={l} onClick={() => setState((s: any) => ({ ...s, lang: l }))} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${state.lang === l ? 'bg-blue-600 text-white shadow-xl scale-105' : 'text-slate-500 hover:text-slate-300'}`}>{l}</button>
          ))}
        </div>
        <button onClick={() => setState((s: any) => ({ ...s, page: 'home' }))} className="relative z-10 px-16 py-6 bg-transparent border-2 border-blue-600 rounded-full font-black text-white uppercase tracking-[0.3em] shadow-[0_0_50px_rgba(37,99,235,0.2)] hover:bg-blue-600 transition-all active:scale-95 group">
          <span className="flex items-center gap-3">പ്രവേശിക്കുക <ChevronRight className="group-hover:translate-x-2 transition-transform"/></span>
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col font-sans overflow-x-hidden">
      <header className="p-5 border-b border-white/10 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50 flex justify-between items-center">
        <div onClick={() => setState((s: any) => ({ ...s, page: 'home', results: null }))} className="flex items-center gap-3 cursor-pointer group">
          <Scale className="text-blue-400 group-hover:rotate-12 transition-transform" />
          <h1 className="font-black text-xl lg:text-2xl tracking-tighter uppercase">{t.title}</h1>
        </div>
        <div className="flex bg-slate-900 p-1 rounded-xl border border-white/5">
          {['en', 'ml'].map(l => (
            <button key={l} onClick={() => setState((s: any) => ({ ...s, lang: l }))} className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase ${state.lang === l ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500'}`}>{l}</button>
          ))}
        </div>
      </header>

      <main className="max-w-6xl mx-auto w-full p-4 lg:p-10 flex-grow">
        {state.page === 'home' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
            <button onClick={() => setState((s: any) => ({ ...s, page: 'inheritance' }))} className="p-12 lg:p-16 bg-slate-900/40 border border-white/10 rounded-[3.5rem] text-left hover:border-blue-500/50 hover:bg-slate-900/60 transition-all group relative overflow-hidden">
              <Calculator size={48} className="mb-6 text-blue-400 group-hover:scale-110 transition-transform" />
              <h2 className="text-4xl font-black uppercase tracking-tight">{t.inheritance}</h2>
              <p className="text-[11px] text-slate-500 font-bold uppercase mt-2 tracking-widest">Shafi'i 29-Heir Calculation</p>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl"></div>
            </button>
            <button onClick={() => setState((s: any) => ({ ...s, page: 'zakath' }))} className="p-12 lg:p-16 bg-slate-900/40 border border-white/10 rounded-[3.5rem] text-left hover:border-emerald-500/50 hover:bg-slate-900/60 transition-all group relative overflow-hidden">
              <Wallet size={48} className="mb-6 text-emerald-400 group-hover:scale-110 transition-transform" />
              <h2 className="text-4xl font-black uppercase tracking-tight">{t.zakath}</h2>
              <p className="text-[11px] text-slate-500 font-bold uppercase mt-2 tracking-widest">Nisab Threshold Checker</p>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-500/5 rounded-full blur-3xl"></div>
            </button>
          </div>
        )}

        {state.page === 'inheritance' && (
          <div className="space-y-10 animate-fade-in">
            <div className="flex items-center gap-4">
              <button onClick={() => setState((s: any) => ({ ...s, page: 'home' }))} className="p-3 bg-slate-900 border border-white/10 rounded-2xl hover:bg-slate-800 transition-colors"><ArrowLeft size={20}/></button>
              <h2 className="text-3xl font-black uppercase tracking-tighter">{t.inheritance}</h2>
            </div>

            {state.isConfirming && (
              <div className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-sm flex items-center justify-center p-6 text-center">
                <div className="max-w-md w-full bg-slate-900 p-12 rounded-[3.5rem] border border-white/10 space-y-8 shadow-2xl animate-in zoom-in duration-300">
                   <AlertTriangle size={64} className="text-blue-500 mx-auto animate-pulse" />
                   <h3 className="text-2xl font-black uppercase tracking-tight">{t.doubleCheckTitle}</h3>
                   <p className="text-slate-400 text-sm leading-relaxed">{t.doubleCheckMsg}</p>
                   <div className="flex flex-col gap-4">
                     <button onClick={() => setState((s: any) => ({ ...s, results: runInheritanceEngine(state.inheritanceInputs, state.estate), isConfirming: false }))} className="w-full bg-blue-600 py-6 rounded-2xl font-black uppercase text-lg hover:bg-blue-500 shadow-xl transition-all">{t.confirmBtn}</button>
                     <button onClick={() => setState((s: any) => ({ ...s, isConfirming: false }))} className="w-full bg-slate-950 py-5 rounded-2xl font-black uppercase text-xs text-slate-500 border border-white/5">{t.cancelBtn}</button>
                   </div>
                </div>
              </div>
            )}

            {!state.results ? (
              <div className="bg-slate-900/40 p-10 lg:p-14 rounded-[4rem] border border-white/5 space-y-16 shadow-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest block text-center md:text-left">{t.estateValue}</label>
                    <input type="number" onChange={e => setState((s: any) => ({ ...s, estate: Number(e.target.value) }))} className="w-full p-8 bg-slate-950 border border-white/10 rounded-[2.5rem] text-4xl font-black text-center text-white outline-none focus:ring-4 focus:ring-blue-500/20 transition-all placeholder-slate-900" placeholder="0.00" />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest block text-center md:text-left">{t.deceasedGender}</label>
                    <div className="flex bg-slate-950 p-2.5 rounded-[2.5rem] border border-white/10 gap-3">
                      {['male', 'female'].map(g => (
                        <button key={g} onClick={() => setState((s: any) => ({ ...s, deceasedGender: g }))} className={`flex-1 py-5 rounded-2xl font-black uppercase text-xs flex items-center justify-center gap-3 transition-all ${state.deceasedGender === g ? 'bg-blue-600 text-white shadow-xl scale-105' : 'text-slate-600 hover:text-slate-400'}`}>
                          <User size={18} /> {t[g]}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-14">
                  {HEIR_CATEGORIES.map(cat => (
                    <div key={cat.id} className="space-y-6">
                      <div className="flex items-center gap-3 px-2 border-l-4 border-blue-500">
                        <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-blue-400 ml-3">{t.cats[cat.id]}</h3>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                        {cat.heirs.filter(id => (id === 'husband' ? state.deceasedGender === 'female' : id === 'wife' ? state.deceasedGender === 'male' : true)).map(id => (
                          <div key={id} className="p-6 bg-slate-950/50 rounded-[2.5rem] border border-white/5 flex flex-col gap-6 hover:border-blue-500/40 transition-all shadow-lg group">
                            <span className="text-[10px] font-black uppercase text-slate-500 group-hover:text-slate-300 transition-colors leading-tight">{(HEIR_DATA as any)[id][state.lang]}</span>
                            <div className="flex justify-between items-center">
                              <button onClick={() => updateHeir(id, -1)} className="p-3 bg-slate-900 rounded-xl hover:bg-slate-800"><Minus size={16}/></button>
                              <span className="font-black text-3xl tracking-tighter text-white">{state.inheritanceInputs[id] || 0}</span>
                              <button onClick={() => updateHeir(id, 1)} className="p-3 bg-slate-900 rounded-xl hover:bg-slate-800"><Plus size={16}/></button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={() => setState((s: any) => ({ ...s, isConfirming: true }))} className="w-full bg-blue-600 py-10 rounded-[3rem] font-black uppercase tracking-[0.3em] text-2xl shadow-2xl hover:bg-blue-500 active:scale-95 transition-all">{t.runEngine}</button>
              </div>
            ) : (
              <div className="space-y-12 pb-24 animate-in slide-in-from-bottom-10 duration-500">
                <div className="flex justify-between items-center border-b border-white/5 pb-8">
                  <h3 className="text-3xl font-black uppercase tracking-tighter text-blue-400 flex items-center gap-4"><UserCheck size={32}/> {t.inheritance} Results</h3>
                  <button onClick={() => setState((s: any) => ({ ...s, results: null }))} className="text-[10px] font-black uppercase text-slate-500 hover:text-white transition-colors bg-slate-900 px-6 py-3 rounded-2xl border border-white/10 shadow-lg flex items-center gap-2"><RefreshCcw size={16}/> {t.back}</button>
                </div>

                {/* SPECIAL CASE ALERTS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {state.results.awl && (
                    <div className="p-10 bg-purple-500/10 border-2 border-purple-500/30 rounded-[3rem] flex items-start gap-6 shadow-[0_0_50px_rgba(168,85,247,0.15)] relative overflow-hidden group">
                      <div className="absolute -right-5 -bottom-5 opacity-10 group-hover:scale-110 transition-transform"><Layers size={100} /></div>
                      <div className="p-4 bg-purple-500/20 rounded-2xl border border-purple-500/40"><Layers className="text-purple-400" size={32} /></div>
                      <div>
                        <h4 className="text-xl font-black uppercase tracking-tight text-purple-400 mb-2">{t.awlTitle}</h4>
                        <p className="text-sm text-slate-300 leading-relaxed font-medium">{t.awlDesc}</p>
                      </div>
                    </div>
                  )}
                  {state.results.hasJabar && (
                    <div className="p-10 bg-amber-500/10 border-2 border-amber-500/30 rounded-[3rem] flex items-start gap-6 shadow-[0_0_50px_rgba(245,158,11,0.15)] relative overflow-hidden group">
                      <div className="absolute -right-5 -bottom-5 opacity-10 group-hover:scale-110 transition-transform"><Zap size={100} /></div>
                      <div className="p-4 bg-amber-500/20 rounded-2xl border border-amber-500/40"><Zap className="text-amber-500" size={32} /></div>
                      <div>
                        <h4 className="text-xl font-black uppercase tracking-tight text-amber-500 mb-2">{t.jabarTitle}</h4>
                        <p className="text-sm text-slate-300 leading-relaxed font-medium">{t.jabarDesc}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {state.results.winners.map((r: any) => {
                    const count = state.inheritanceInputs[r.id] || 1;
                    const isAmber = r.highlight === 'amber';
                    const isPurple = r.highlight === 'purple';
                    const borderColor = isAmber ? 'border-amber-400 shadow-[0_0_40px_rgba(251,191,36,0.1)]' : isPurple ? 'border-purple-500 shadow-[0_0_40px_rgba(168,85,247,0.1)]' : 'border-white/5';
                    const tagLabel = isAmber ? t.jabarTag : isPurple ? t.awlTag : (r.tag === 'asabah' ? t.asabahTag : t.fixedTag);
                    const tagColor = isAmber ? 'bg-amber-400' : isPurple ? 'bg-purple-500' : (r.tag === 'asabah' ? 'bg-blue-600' : 'bg-slate-800');

                    return (
                      <div key={r.id} className={`p-10 bg-slate-900/40 rounded-[3rem] border-2 transition-all relative overflow-hidden group hover:scale-[1.02] duration-300 ${borderColor}`}>
                        <div className={`absolute top-0 right-0 px-5 py-2 ${tagColor} text-slate-900 font-black text-[9px] uppercase tracking-widest rounded-bl-[1.5rem] z-20 shadow-lg`}>
                          {tagLabel}
                        </div>
                        <div className="flex justify-between items-start mb-10">
                          <div>
                            <h4 className={`text-2xl font-black tracking-tighter ${isAmber ? 'text-amber-400' : isPurple ? 'text-purple-300' : 'text-white'}`}>{r[state.lang]}</h4>
                            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest mt-1">({r.term})</p>
                          </div>
                          <div className="text-right">
                            <span className={`text-4xl font-black ${isAmber ? 'text-amber-400' : isPurple ? 'text-purple-400' : 'text-blue-500'}`}>{r.f || 'Asabah'}</span>
                            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-2">{(r.p || 0).toFixed(1)}%</p>
                          </div>
                        </div>
                        {state.estate > 0 && (
                          <div className="pt-8 border-t border-white/5 space-y-5">
                            <div className="flex justify-between items-baseline">
                              <span className="text-[11px] font-black text-slate-600 uppercase tracking-[0.3em]">{t.share}:</span>
                              <span className="text-3xl font-black text-white">₹{r.amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                            </div>
                            {count > 1 && (
                              <div className="bg-white/5 p-4 rounded-2xl flex justify-between items-center border border-white/5 shadow-inner">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t.perHead} ({count}):</span>
                                <span className="text-base font-black text-blue-400">₹{(r.amount / count).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* METHODOLOGY SECTION (PRINCIPLES / TEACHERS) */}
                <div className="bg-slate-900/60 p-12 lg:p-16 rounded-[4rem] border border-white/10 space-y-10 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none"><BookOpen size={180}/></div>
                  <div className="flex items-center gap-4 text-blue-400 border-b border-white/10 pb-8">
                    <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20"><FileText size={32}/></div>
                    <h3 className="text-3xl font-black uppercase tracking-tight">{t.detailedSummary}</h3>
                  </div>
                  <p className="text-slate-400 text-sm italic font-medium">{t.methodologyDesc}</p>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {(state.lang === 'ml' ? state.results.methodologyML : state.results.methodologyEN).map((step: string, idx: number) => (
                      <li key={idx} className="flex gap-6 items-start bg-slate-950/40 p-6 rounded-3xl border border-white/5 hover:border-blue-500/30 transition-all group">
                        <div className="w-10 h-10 rounded-full bg-blue-600/10 border border-blue-400/20 flex items-center justify-center shrink-0 font-black text-blue-400 text-sm shadow-xl group-hover:scale-110 transition-transform">{idx + 1}</div>
                        <p className="text-slate-200 text-sm leading-relaxed font-semibold">{step}</p>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* EXCLUDED RELATIVES */}
                {state.results.losers.length > 0 && (
                   <div className="space-y-8 pt-12 border-t border-white/10">
                    <h3 className="text-2xl font-black uppercase text-slate-500 flex items-center gap-4"><UserX className="text-rose-500" size={32}/> {t.mahjubTitle}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {state.results.losers.map((r: any) => (
                        <div key={r.id} className="p-8 bg-slate-900/20 border-2 border-white/5 border-dashed rounded-[3rem] opacity-60 flex flex-col justify-between h-44 hover:opacity-100 transition-all hover:bg-rose-500/5 group">
                          <div>
                            <span className="font-black text-xl text-slate-300 tracking-tight group-hover:text-white transition-colors">{r[state.lang]}</span>
                            <p className="text-[10px] text-slate-600 font-bold uppercase mt-1 tracking-widest">{r.term}</p>
                          </div>
                          <div className="mt-4 py-2 px-4 bg-rose-500/10 rounded-xl border border-rose-500/20 flex items-center gap-2">
                             <UserX size={14} className="text-rose-400" />
                             <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest">{t.blockedBy}: {r.blockedBy}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                   </div>
                )}
              </div>
            )}
          </div>
        )}

        {state.page === 'zakath' && (
          <div className="space-y-12 animate-fade-in max-w-2xl mx-auto py-10">
             <div className="flex items-center gap-4">
              <button onClick={() => setState((s: any) => ({ ...s, page: 'home' }))} className="p-3 bg-slate-900 border border-white/10 rounded-2xl hover:bg-slate-800 transition-colors"><ArrowLeft size={24}/></button>
              <h2 className="text-3xl font-black uppercase tracking-tighter">{t.zakath}</h2>
            </div>
            <div className="bg-slate-900/40 p-12 rounded-[4rem] border border-white/10 space-y-12 shadow-2xl relative overflow-hidden">
               <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/5 rounded-full blur-3xl"></div>
               <div className="grid grid-cols-1 gap-8">
                  {[
                    { key: 'cash', label: t.cashSavings },
                    { key: 'gold', label: t.goldWeight },
                    { key: 'business', label: t.businessStock }
                  ].map(field => (
                    <div key={field.key} className="space-y-3">
                      <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">{field.label}</label>
                      <input type="number" onChange={e => setState((s: any) => ({ ...s, zakahInputs: { ...s.zakahInputs, [field.key]: Number(e.target.value) } }))} className="w-full p-8 bg-slate-950 border border-white/10 rounded-[2.5rem] text-3xl font-black outline-none focus:ring-4 focus:ring-emerald-500/20 text-white transition-all shadow-inner" placeholder="0" />
                    </div>
                  ))}
               </div>
               <div className="p-12 bg-emerald-600/5 border-2 border-emerald-400/20 rounded-[3rem] text-center shadow-xl relative group">
                  <div className="absolute top-0 right-0 p-4 opacity-10"><Award size={32} className="text-emerald-400" /></div>
                  <span className="text-[11px] font-black text-emerald-400 uppercase tracking-[0.4em] block mb-6">Payable Zakah Amount</span>
                  <h3 className="text-7xl font-black tracking-tighter text-white group-hover:scale-110 transition-transform">₹ {Math.max(0, (state.zakahInputs.cash + state.zakahInputs.gold * GOLD_PRICE_FIXED + state.zakahInputs.business) >= (NISAB_GOLD * GOLD_PRICE_FIXED) ? (state.zakahInputs.cash + state.zakahInputs.gold * GOLD_PRICE_FIXED + state.zakahInputs.business) * 0.025 : 0).toLocaleString()}</h3>
               </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const rootEl = document.getElementById('root');
if (rootEl) {
  const root = createRoot(rootEl);
  root.render(<App />);
}
