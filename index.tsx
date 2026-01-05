
import React, { useState, useMemo, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Scale, Calculator, Wallet, ArrowLeft, Plus, Minus, UserX, UserCheck, 
  AlertTriangle, RefreshCcw, Layers, User, Zap, BookOpen, FileText, 
  ChevronRight, Award, BarChart3, Home as HomeIcon,
  Coins, ChevronDown, Server, PieChart as PieIcon, ShieldCheck, Ghost,
  TrendingUp, BookMarked, Info, CheckCircle2, Banknote, Users
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

// --- CONSTANTS ---
const GOLD_PRICE_FIXED = 6250; 
const NISAB_GOLD = 85;

// --- TYPES ---
enum Page {
  Home = 'home',
  Inheritance = 'inheritance',
  Zakah = 'zakah',
  Charts = 'charts'
}

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
    confirmBtn: "Generate Results", cancelBtn: "Cancel", deceasedGender: "Deceased Gender",
    male: "Male", female: "Female",
    detailedSummary: "Jurisprudential Methodology", methodologyDesc: "Breakdown of the Fiqh logic used for this case:",
    jabarTag: "Jabar Logic", awlTag: "Awl Adjusted", asabahTag: "Asabah", fixedTag: "Dhu al-Furud",
    categories: {
      descendants: "Descendants",
      ancestors: "Ancestors",
      siblings: "Siblings",
      extended: "Extended Relatives"
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
    male: "പുരുഷൻ", female: "സ്ത്രീ",
    detailedSummary: "ഫിഖ്ഹ് വിശകലനം (Principles)", methodologyDesc: "ഈ കേസിൽ ഉപയോഗിച്ച പ്രധാന നിയമങ്ങളുടെ വിവരണം താഴെ നൽകുന്നു:",
    jabarTag: "ജബർ മസ്അല", awlTag: "ഔൽ മാറ്റം", asabahTag: "അസ്വബ", fixedTag: "ഫർള്",
    categories: {
      descendants: "സന്താനപരമ്പര",
      ancestors: "മുൻഗാമികൾ",
      siblings: "സഹോദരങ്ങൾ",
      extended: "മറ്റ് ബന്ധുക്കൾ"
    }
  }
};

// --- THE FULL 29 HEIRS ---
const HEIR_DATA: any = {
  husband: { term: "Az-Zawj", en: "Husband", ml: "ഭർത്താവ്", cat: "descendants", max: 1 },
  wife: { term: "Az-Zawjah", en: "Wife", ml: "ഭാര്യ", cat: "descendants", max: 4 },
  sons: { term: "Al-Ibn", en: "Son", ml: "മകൻ", cat: "descendants", max: 20 },
  daughters: { term: "Al-Bint", en: "Daughter", ml: "മകൾ", cat: "descendants", max: 20 },
  grandSons: { term: "Ibn al-Ibn", en: "Grandson (S.S)", ml: "മകൻറെ മകൻ", cat: "descendants", max: 20 },
  grandDaughters: { term: "Bint al-Ibn", en: "Granddaughter (S.D)", ml: "മകൻറെ മകൾ", cat: "descendants", max: 20 },
  grandGrandSons: { term: "Ibn Ibn al-Ibn", en: "G-Grandson", ml: "മകൻറെ മകൻറെ മകൻ", cat: "descendants", max: 20 },
  father: { term: "Al-Ab", en: "Father", ml: "പിതാവ്", cat: "ancestors", max: 1 },
  mother: { term: "Al-Umm", en: "Mother", ml: "മാതാവ്", cat: "ancestors", max: 1 },
  pGrandfather: { term: "Al-Jadd al-Sahih", en: "Pat. Grandfather", ml: "പിതാമഹൻ", cat: "ancestors", max: 1 },
  pGrandmother: { term: "Al-Jaddah", en: "Pat. Grandmother", ml: "പിതാവിൻറെ ഉമ്മ", cat: "ancestors", max: 1 },
  mGrandmother: { term: "Al-Jaddah", en: "Mat. Grandmother", ml: "മാതാവിൻറെ ഉമ്മ", cat: "ancestors", max: 1 },
  pGGrandfather: { term: "Al-Jadd al-A'la", en: "Pat. G-Grandfather", ml: "പിതാവിൻറെ പിതാമഹൻ", cat: "ancestors", max: 1 },
  fullBrothers: { term: "Al-Akh Shaqiq", en: "Full Brother", ml: "സഹോദരൻ", cat: "siblings", max: 20 },
  fullSisters: { term: "Al-Ukht Shaqiqah", en: "Full Sister", ml: "സഹോദരി", cat: "siblings", max: 20 },
  consBrothers: { term: "Al-Akh li-Ab", en: "Cons. Brother", ml: "പിതാവൊത്ത സഹോദരൻ", cat: "siblings", max: 20 },
  consSisters: { term: "Al-Ukht li-Ab", en: "Cons. Sister", ml: "പിതാവൊത്ത സഹോദരി", cat: "siblings", max: 20 },
  uterBrothers: { term: "Al-Akh li-Umm", en: "Uterine Brother", ml: "മാതാവൊത്ത സഹോദരൻ", cat: "siblings", max: 20 },
  uterSisters: { term: "Al-Ukht li-Umm", en: "Uterine Sister", ml: "മാതാവൊത്ത സഹോദരി", cat: "siblings", max: 20 },
  fBroSon: { term: "Ibn al-Akh Shaqiq", en: "Full Bro's Son", ml: "സഹോദര പുത്രൻ", cat: "extended", max: 20 },
  cBroSon: { term: "Ibn al-Akh li-Ab", en: "Cons. Bro's Son", ml: "പിതാവൊത്ത സഹോദരപുത്രൻ", cat: "extended", max: 20 },
  fPatUncle: { term: "Al-Amm Shaqiq", en: "Full Pat. Uncle", ml: "പിതാവിൻറെ സഹോദരൻ", cat: "extended", max: 20 },
  cPatUncle: { term: "Al-Amm li-Ab", en: "Cons. Pat. Uncle", ml: "പിതാവിൻറെ പിതാവൊത്ത സഹോദരൻ", cat: "extended", max: 20 },
  fPatUncleSon: { term: "Ibn al-Amm Shaqiq", en: "Full Uncle's Son", ml: "അമ്മാവൻറെ മകൻ", cat: "extended", max: 20 },
  cPatUncleSon: { term: "Ibn al-Amm li-Ab", en: "Cons. Uncle's Son", ml: "അമ്മാവൻറെ മകൻ (Cons)", cat: "extended", max: 20 },
  fBroSonSon: { term: "Ibn Ibn Akh Shaqiq", en: "F-Bro G-Son", ml: "സഹോദരൻറെ മകൻറെ മകൻ", cat: "extended", max: 20 },
  mEmancipator: { term: "Al-Mu'tiq", en: "Male Emancipator", ml: "അടിമയെ മോചിപ്പിച്ച പുരുഷൻ", cat: "extended", max: 1 },
  fEmancipator: { term: "Al-Mu'tiqah", en: "Fem. Emancipator", ml: "അടിമയെ മോചിപ്പിച്ച സ്ത്രീ", cat: "extended", max: 1 },
  baitAlMal: { term: "Bait al-Mal", en: "Public Treasury", ml: "ബൈത്തുൽമാൽ", cat: "extended", max: 1 }
};

// --- UTILS ---
const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
const lcm = (a: number, b: number): number => (a * b) / gcd(a, b);
const getLCMOfArray = (arr: number[]): number => arr.length === 0 ? 1 : arr.reduce((acc, val) => lcm(acc, val), 1);

// --- INHERITANCE ENGINE ---
const runInheritanceEngine = (inputs: any, estate: number) => {
  const h = (id: string) => inputs[id] || 0;
  let rawResults: any[] = [];
  let exclusions: any[] = [];
  let methodologyML: string[] = [];
  let methodologyEN: string[] = [];
  
  const addExcl = (id: string, blocker: string) => { 
    if (h(id) > 0) {
      exclusions.push({ 
        id, 
        blockedBy: HEIR_DATA[blocker]?.term || blocker, 
        blockerNameEn: HEIR_DATA[blocker]?.en || blocker, 
        blockerNameMl: HEIR_DATA[blocker]?.ml || blocker 
      });
      methodologyML.push(`${HEIR_DATA[id].ml} ഹജ്ബ് ചെയ്യപ്പെട്ടു (${HEIR_DATA[blocker].ml} ഉള്ളതിനാൽ).`);
      methodologyEN.push(`${HEIR_DATA[id].en} is excluded (Mahjub) because of ${HEIR_DATA[blocker].en}.`);
    }
  };
  
  const hasDesc = (h('sons') + h('daughters') + h('grandSons') + h('grandDaughters') + h('grandGrandSons')) > 0;
  const hasMaleDesc = (h('sons') + h('grandSons') + h('grandGrandSons')) > 0;
  const sibCount = (h('fullBrothers') + h('fullSisters') + h('consBrothers') + h('consSisters') + h('uterBrothers') + h('uterSisters'));

  const active = { ...inputs };
  
  // HAJB LOGIC
  if (h('sons') > 0) {
    ['grandSons', 'grandDaughters', 'grandGrandSons', 'fullBrothers', 'fullSisters', 'consBrothers', 'consSisters', 'uterBrothers', 'uterSisters', 'fBroSon', 'cBroSon', 'fPatUncle', 'cPatUncle', 'fPatUncleSon', 'cPatUncleSon', 'fBroSonSon'].forEach(id => addExcl(id, 'sons'));
  }
  if (h('grandSons') > 0 && h('sons') === 0) {
    ['grandGrandSons', 'fullBrothers', 'fullSisters', 'consBrothers', 'consSisters', 'uterBrothers', 'uterSisters', 'fBroSon', 'cBroSon', 'fPatUncle', 'cPatUncle', 'fPatUncleSon', 'cPatUncleSon'].forEach(id => addExcl(id, 'grandSons'));
  }
  if (h('father') > 0) {
    ['pGrandfather', 'pGGrandfather', 'fullBrothers', 'fullSisters', 'consBrothers', 'consSisters', 'uterBrothers', 'uterSisters', 'fBroSon', 'cBroSon', 'fPatUncle', 'cPatUncle', 'fPatUncleSon', 'cPatUncleSon'].forEach(id => addExcl(id, 'father'));
  }
  if (h('mother') > 0) {
    ['pGrandmother', 'mGrandmother'].forEach(id => addExcl(id, 'mother'));
  }

  exclusions.forEach(e => active[e.id] = 0);

  // SHARES
  if (active.husband) {
    rawResults.push({ id: 'husband', num: 1, den: hasDesc ? 4 : 2, type: 'fixed' });
  } else if (active.wife > 0) {
    rawResults.push({ id: 'wife', num: 1, den: hasDesc ? 8 : 4, type: 'fixed' });
  }
  if (active.mother) {
    rawResults.push({ id: 'mother', num: 1, den: (hasDesc || sibCount >= 2) ? 6 : 3, type: 'fixed' });
  }
  if (active.father && hasMaleDesc) {
    rawResults.push({ id: 'father', num: 1, den: 6, type: 'fixed' });
  }
  if (active.daughters > 0 && active.sons === 0) {
    rawResults.push({ id: 'daughters', num: active.daughters === 1 ? 1 : 2, den: active.daughters === 1 ? 2 : 3, type: 'fixed' });
  }

  const baseAsl = getLCMOfArray(rawResults.map(r => r.den || 1));
  let units = 0;
  rawResults.forEach(r => units += (baseAsl / r.den) * r.num);
  const isAwl = units > baseAsl;
  const finalAsl = isAwl ? units : baseAsl;

  let results = rawResults.map(r => ({
    ...r, ...HEIR_DATA[r.id],
    p: (((baseAsl / r.den) * r.num) / finalAsl) * 100,
    f: `${r.num}/${r.den}`,
    highlight: isAwl ? 'purple' : undefined,
    tag: 'fixed',
    amount: estate ? ((((baseAsl / r.den) * r.num) / finalAsl) * estate) : 0
  }));

  let residueUnits = finalAsl - units;
  if (residueUnits > 0) {
    const topAgnate = ['sons', 'father', 'grandSons', 'fullBrothers', 'consBrothers', 'fBroSon', 'cBroSon', 'fPatUncle'].find(id => active[id] > 0);
    if (topAgnate) {
      const pId = topAgnate === 'sons' ? 'daughters' : topAgnate === 'fullBrothers' ? 'fullSisters' : null;
      if (pId && active[pId] > 0) {
        const totalU = active[topAgnate] * 2 + active[pId];
        const resMale = (residueUnits / finalAsl) * (active[topAgnate] * 2 / totalU);
        const resFemale = (residueUnits / finalAsl) * (active[pId] / totalU);
        results.push({ id: topAgnate, ...HEIR_DATA[topAgnate], f: 'Asabah (2:1)', p: resMale * 100, highlight: 'amber', tag: 'jabar', amount: estate ? (resMale * estate) : 0 });
        results.push({ id: pId, ...HEIR_DATA[pId], f: 'Asabah (2:1)', p: resFemale * 100, highlight: 'amber', tag: 'jabar', amount: estate ? (resFemale * estate) : 0 });
      } else {
        results.push({ id: topAgnate, ...HEIR_DATA[topAgnate], f: 'Asabah', p: (residueUnits / finalAsl) * 100, tag: 'asabah', amount: estate ? ((residueUnits / finalAsl) * estate) : 0 });
      }
    } else {
       results.push({ id: 'baitAlMal', ...HEIR_DATA['baitAlMal'], f: 'Residue', p: (residueUnits / finalAsl) * 100, tag: 'asabah', amount: estate ? ((residueUnits / finalAsl) * estate) : 0 });
    }
  }

  return { winners: results, losers: exclusions.map(e => ({ ...e, ...HEIR_DATA[e.id] })), awl: isAwl, hasJabar: !!results.find(r => r.tag === 'jabar'), methodologyML, methodologyEN };
};

// --- APP COMPONENT ---
const App = () => {
  const [page, setPage] = useState(Page.Home);
  const [lang, setLang] = useState('en'); 
  const [inputs, setInputs] = useState<any>({});
  const [estate, setEstate] = useState(0);
  const [results, setResults] = useState<any>(null);
  const [gender, setGender] = useState('male');
  const [zakahInputs, setZakahInputs] = useState({ cash: 0, gold: 0, business: 0 });

  const t = TRANSLATIONS[lang];

  const updateHeir = (id: string, d: number) => {
    setInputs((prev: any) => ({ ...prev, [id]: Math.max(0, (prev[id] || 0) + d) }));
  };

  const zakahTotal = zakahInputs.cash + (zakahInputs.gold * GOLD_PRICE_FIXED) + zakahInputs.business;
  const zakahPayable = zakahTotal >= (NISAB_GOLD * GOLD_PRICE_FIXED) ? zakahTotal * 0.025 : 0;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col lg:flex-row font-sans selection:bg-blue-500/30">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 bg-slate-950 border-r border-white/5 sticky top-0 h-screen p-8 shrink-0">
        <div className="mb-12">
          <h1 className="text-3xl font-black tracking-tighter bg-gradient-to-br from-blue-400 to-cyan-400 bg-clip-text text-transparent">{t.title}</h1>
          <p className="text-[10px] text-blue-500 uppercase tracking-[0.4em] font-bold mt-2">{t.subtitle}</p>
        </div>
        <nav className="flex-grow space-y-2">
          {[
            { id: Page.Home, icon: <HomeIcon size={20}/>, label: t.home },
            { id: Page.Inheritance, icon: <Calculator size={20}/>, label: t.inheritance },
            { id: Page.Zakah, icon: <Wallet size={20}/>, label: t.zakath },
            { id: Page.Charts, icon: <BarChart3 size={20}/>, label: "Analytics" }
          ].map(item => (
            <button key={item.id} onClick={() => { setPage(item.id); setResults(null); }} className={`flex items-center space-x-4 w-full px-5 py-4 rounded-2xl transition-all ${page === item.id ? 'bg-blue-600/10 text-blue-400 border border-blue-400/20 shadow-lg' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}>
              {item.icon} <span className="text-sm font-black uppercase tracking-widest">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="mt-auto">
          <div className="flex bg-slate-900 p-1 rounded-xl border border-white/5">
            {['en', 'ml'].map(l => (
              <button key={l} onClick={() => setLang(l)} className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${lang === l ? 'bg-blue-600 text-white' : 'text-slate-500'}`}>{l}</button>
            ))}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-grow p-4 lg:p-12 max-w-6xl mx-auto w-full pb-32 lg:pb-12 overflow-x-hidden">
        <header className="lg:hidden flex justify-between items-center mb-10">
          <h1 className="text-2xl font-black text-blue-400 tracking-tighter">{t.title}</h1>
          <div className="flex bg-slate-900 p-1 rounded-xl border border-white/5">
            {['en', 'ml'].map(l => (
              <button key={l} onClick={() => setLang(l)} className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${lang === l ? 'bg-blue-600 text-white' : 'text-slate-500'}`}>{l}</button>
            ))}
          </div>
        </header>

        {page === Page.Home && (
          <div className="space-y-12 animate-fade-in py-10">
            <section className="text-center py-6">
              <div className="inline-block p-10 bg-blue-500/10 rounded-[3rem] mb-10 border border-blue-400/20 shadow-2xl animate-pulse">
                <Scale size={80} className="text-blue-400" />
              </div>
              <h2 className="text-5xl lg:text-7xl font-black tracking-tighter uppercase mb-6 leading-none">{t.title}</h2>
              <p className="text-slate-400 text-lg lg:text-xl max-w-xl mx-auto font-medium tracking-tight">Shāfiʿī Jurisprudence Platform for Estate & Zakāh.</p>
            </section>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
              <button onClick={() => setPage(Page.Inheritance)} className="p-12 bg-slate-900/40 rounded-[4rem] border border-white/10 hover:border-blue-500/50 hover:bg-slate-900/60 transition-all text-left group shadow-xl">
                <Calculator size={48} className="text-blue-400 mb-8 group-hover:scale-110 transition-transform"/>
                <h3 className="text-4xl font-black uppercase tracking-tight">{t.inheritance}</h3>
                <p className="text-slate-500 text-sm mt-3 font-bold tracking-[0.2em] uppercase">29 Heir Matrix</p>
              </button>
              <button onClick={() => setPage(Page.Zakah)} className="p-12 bg-slate-900/40 rounded-[4rem] border border-white/10 hover:border-emerald-500/50 hover:bg-slate-900/60 transition-all text-left group shadow-xl">
                <Wallet size={48} className="text-emerald-400 mb-8 group-hover:scale-110 transition-transform"/>
                <h3 className="text-4xl font-black uppercase tracking-tight">{t.zakath}</h3>
                <p className="text-slate-500 text-sm mt-3 font-bold tracking-[0.2em] uppercase">Nisab Engine</p>
              </button>
            </div>
          </div>
        )}

        {page === Page.Inheritance && (
          <div className="animate-fade-in">
            {!results ? (
              <div className="space-y-12 max-w-5xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-slate-900/40 p-12 rounded-[4rem] border border-white/5 shadow-2xl">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">{t.estateValue}</label>
                    <input type="number" onChange={e => setEstate(Number(e.target.value))} className="w-full p-8 bg-slate-950 border border-white/10 rounded-3xl text-4xl font-black text-center outline-none focus:ring-4 focus:ring-blue-500/20 text-white transition-all shadow-inner" placeholder="0.00" />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">{t.deceasedGender}</label>
                    <div className="flex bg-slate-950 p-2.5 rounded-3xl border border-white/10 gap-2 h-[106px]">
                      {['male', 'female'].map(g => (
                        <button key={g} onClick={() => setGender(g)} className={`flex-1 rounded-2xl font-black uppercase text-xs flex items-center justify-center gap-3 transition-all ${gender === g ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-600 hover:text-slate-400'}`}>
                          <User size={18}/> {t[g]}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {Object.keys(t.categories).map(catKey => (
                  <div key={catKey} className="space-y-6">
                    <h3 className="text-xs font-black text-blue-400 uppercase tracking-[0.4em] ml-6">{t.categories[catKey]}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      {Object.keys(HEIR_DATA).filter(id => HEIR_DATA[id].cat === catKey).filter(id => (id === 'husband' ? gender === 'female' : id === 'wife' ? gender === 'male' : true)).map(id => (
                        <div key={id} className="p-8 bg-slate-950 rounded-[3rem] border border-white/5 flex flex-col gap-8 shadow-xl hover:border-blue-500/30 transition-all">
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-tight">{HEIR_DATA[id][lang]}</span>
                          <div className="flex justify-between items-center">
                            <button onClick={() => updateHeir(id, -1)} className="p-3 bg-slate-900 rounded-xl hover:bg-slate-800"><Minus size={16}/></button>
                            <span className="text-3xl font-black text-white tracking-tighter">{inputs[id] || 0}</span>
                            <button onClick={() => updateHeir(id, 1)} className="p-3 bg-slate-900 rounded-xl hover:bg-slate-800"><Plus size={16}/></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                
                <button onClick={() => setResults(runInheritanceEngine(inputs, estate))} className="w-full bg-blue-600 py-10 rounded-[3rem] font-black uppercase tracking-[0.4em] text-2xl shadow-2xl hover:bg-blue-500 active:scale-95 transition-all mb-20">{t.runEngine}</button>
              </div>
            ) : (
              <div className="space-y-12 pb-24">
                <div className="flex justify-between items-center border-b border-white/10 pb-8">
                  <h2 className="text-4xl font-black uppercase tracking-tighter text-blue-400">Results</h2>
                  <button onClick={() => setResults(null)} className="p-4 bg-slate-900 rounded-2xl border border-white/10 text-slate-400 hover:text-white flex items-center gap-2 text-[10px] font-black uppercase"><RefreshCcw size={16}/> {t.back}</button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {results.winners.map((r: any) => {
                    const isAmber = r.highlight === 'amber';
                    const isPurple = r.highlight === 'purple';
                    const tag = isAmber ? t.jabarTag : isPurple ? t.awlTag : r.tag === 'asabah' ? t.asabahTag : t.fixedTag;
                    const tagColor = isAmber ? 'bg-amber-400' : isPurple ? 'bg-purple-500' : 'bg-blue-600';
                    return (
                      <div key={r.id} className={`p-10 bg-slate-900/40 rounded-[4rem] border-2 relative overflow-hidden shadow-2xl ${isAmber ? 'border-amber-500/40' : isPurple ? 'border-purple-500/40' : 'border-white/5'}`}>
                        <div className={`absolute top-0 right-0 px-6 py-2 ${tagColor} text-slate-900 font-black text-[10px] uppercase tracking-widest rounded-bl-[2rem]`}>{tag}</div>
                        <h4 className="text-3xl font-black mb-1 text-white tracking-tight">{r[lang]}</h4>
                        <p className="text-[11px] text-slate-500 font-bold uppercase mb-10 tracking-[0.2em]">{r.term}</p>
                        <div className="flex justify-between items-baseline mb-8">
                          <span className="text-5xl font-black text-blue-400 tracking-tighter">{r.f}</span>
                          <span className="text-sm font-black text-slate-500 tracking-widest">{r.p.toFixed(1)}%</span>
                        </div>
                        {estate > 0 && <div className="pt-8 border-t border-white/5 flex flex-col gap-2">
                           <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Total Share</span>
                           <span className="text-4xl font-black text-white">₹{r.amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                        </div>}
                      </div>
                    );
                  })}
                </div>

                {results.losers.length > 0 && (
                  <div className="space-y-8 animate-fade-in">
                    <h3 className="text-4xl font-black uppercase text-rose-500 flex items-center gap-6 tracking-tighter"><Ghost size={40}/> {t.mahjubTitle}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {results.losers.map((l: any) => (
                        <div key={l.id} className="p-10 bg-slate-950/40 rounded-[3rem] border border-rose-500/20 flex flex-col gap-6 grayscale opacity-60">
                          <div className="flex justify-between items-start">
                            <div>
                               <h4 className="text-2xl font-black text-slate-300">{l[lang]}</h4>
                               <p className="text-[10px] font-black uppercase text-slate-600">{l.term}</p>
                            </div>
                            <UserX className="text-rose-500" size={24} />
                          </div>
                          <div className="bg-rose-500/5 p-4 rounded-2xl border border-rose-500/10">
                            <span className="text-[10px] font-black uppercase tracking-widest text-rose-400 block mb-1">{t.blockedBy}</span>
                            <span className="text-lg font-black text-slate-400">{lang === 'ml' ? l.blockerNameMl : l.blockerNameEn}</span>
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

        {page === Page.Zakah && (
          <div className="max-w-2xl mx-auto space-y-12 animate-fade-in py-10">
             <div className="bg-slate-900/40 p-12 lg:p-16 rounded-[4rem] border border-white/10 space-y-12 shadow-2xl">
              <div className="space-y-10">
                {[
                  { id: 'cash', label: t.cashSavings, icon: <Coins size={24}/> },
                  { id: 'gold', label: t.goldWeight, icon: <Award size={24}/> },
                  { id: 'business', label: t.businessStock, icon: <Server size={24}/> }
                ].map(field => (
                  <div key={field.id} className="space-y-4">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-4 flex items-center gap-3">{field.icon} {field.label}</label>
                    <input type="number" onChange={e => setZakahInputs(s => ({...s, [field.id]: Number(e.target.value)}))} className="w-full p-8 bg-slate-950 border border-white/10 rounded-3xl text-4xl font-black text-center outline-none focus:ring-4 focus:ring-emerald-500/20 text-white transition-all shadow-inner" placeholder="0" />
                  </div>
                ))}
              </div>
              <div className="p-16 bg-emerald-600/10 border-2 border-emerald-400/20 rounded-[4rem] text-center shadow-2xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-110 transition-transform"><Wallet size={150}/></div>
                 <span className="text-[12px] font-black text-emerald-400 uppercase tracking-[0.6em] block mb-8">Zakah Payable (2.5%)</span>
                 <h3 className="text-8xl font-black tracking-tighter text-white">₹ {zakahPayable.toLocaleString()}</h3>
                 {zakahPayable === 0 && zakahTotal > 0 && <p className="text-[12px] font-black text-slate-500 mt-6 uppercase tracking-[0.3em]">Nisab Threshold not reached (85g Gold)</p>}
              </div>
            </div>
          </div>
        )}

        {page === Page.Charts && (
          <div className="space-y-20 animate-fade-in py-10 text-center">
             <div className="max-w-2xl mx-auto space-y-6">
              <div className="inline-block p-10 bg-blue-500/10 rounded-[3rem] border border-blue-400/20 shadow-2xl mb-4"><BarChart3 size={64} className="text-blue-400" /></div>
              <h2 className="text-6xl font-black uppercase tracking-tighter leading-none">Analytics</h2>
              <p className="text-slate-500 font-black tracking-[0.4em] uppercase text-xs italic">Shāfiʿī Methodology Visualization</p>
            </div>
          </div>
        )}
      </main>

      {/* Mobile Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-slate-950/95 backdrop-blur-2xl border-t border-white/10 flex justify-around items-center py-5 z-50 shadow-2xl">
        {[
          { id: Page.Home, icon: <HomeIcon size={24}/>, label: t.home },
          { id: Page.Inheritance, icon: <Calculator size={24}/>, label: t.inheritance },
          { id: Page.Zakah, icon: <Wallet size={24}/>, label: t.zakath },
          { id: Page.Charts, icon: <BarChart3 size={24}/>, label: "Stats" }
        ].map(item => (
          <button key={item.id} onClick={() => { setPage(item.id); setResults(null); }} className={`flex flex-col items-center space-y-1.5 px-4 py-1 rounded-2xl transition-all ${page === item.id ? 'text-blue-400 bg-blue-400/5' : 'text-slate-500'}`}>
            {item.icon} <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

// --- RENDER ---
const rootEl = document.getElementById('root');
if (rootEl) {
  const root = createRoot(rootEl);
  root.render(<App />);
}
