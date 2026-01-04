import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { 
  Scale, Moon, Sparkles, Sun, Calculator, Wallet, ArrowLeft, Plus, Minus, Info, Coins, Wheat, Beef, ChevronDown, UserX, UserCheck
} from 'lucide-react';

// --- CONSTANTS ---
const GOLD_PRICE_FIXED = 13582;
const SILVER_PRICE_EST = 95;
const NISAB_GOLD = 85;
const NISAB_AGRI_KG = 652;

const TRANSLATIONS = {
  en: { 
    title: "Fiqh Hub", subtitle: "Shāfiʿī Jurisprudence Platform", home: "Home", inheritance: "Inheritance", zakath: "Zakath", faraid: "Fara'id", back: "Back", calculate: "Calculate", 
    estateValue: "Total Estate Value (INR)", estateTotal: "Estate Total", runEngine: "Run Engine", wajib: "Wajib (Payable)", exempt: "Exempt", share: "Share", perHead: "Per Individual", 
    blockedBy: "Blocked By", mahjub: "Mahjub", cashSavings: "Cash & Savings", goldWeight: "Gold Weight (g)", businessStock: "Trade Assets", silverWeight: "Silver (g)",
    agriTitle: "Agriculture (Ushr)", agriWeight: "Harvest (kg)", agriType: "Irrigation", rainFed: "Rain-fed (10%)", irrigated: "Irrigated (5%)",
    livestockTitle: "Livestock", sheepGoat: "Sheep/Goat", cattle: "Cattle", festGreeting: "Welcome to the Hub", festAction: "Enter Hub",
    mahjubTitle: "Excluded Relatives (Mahjub)",
    cats: { direct: "Direct Heirs", desc: "Descendants", sib: "Siblings", nephew: "Nephews", cousin: "Cousins" } 
  },
  ml: { 
    title: "ഫിഖ്ഹ് ഹബ്", subtitle: "ഷാഫിഈ കർമ്മശാസ്ത്രം", home: "ഹോം", inheritance: "അനന്തരാവകാശം", zakath: "സകാത്ത്", faraid: "ഫറാഇദ്", back: "പിന്നിലേക്ക്", calculate: "കണക്കാക്കുക", 
    estateValue: "സ്വത്ത് മൂല്യം", estateTotal: "ആകെ സ്വത്ത്", runEngine: "കണക്കുകൂട്ടുക", wajib: "നിർബന്ധം (വാജിബ്)", exempt: "നിസാബ് തികഞ്ഞില്ല", share: "വിഹിതം", perHead: "ഒരാൾക്ക്", 
    blockedBy: "തടഞ്ഞത്", mahjub: "ഹജ്ബ്", cashSavings: "പണം & നിക്ഷേപം", goldWeight: "സ്വർണ്ണം (ഗ്രാം)", businessStock: "ബിസിനസ്സ് സ്റ്റോക്ക്", silverWeight: "വെള്ളി (ഗ്രാം)",
    agriTitle: "കൃഷി (ഉശ്ര്)", agriWeight: "വിളവ് (കിലോ)", agriType: "നനയ്ക്കുന്ന രീതി", rainFed: "മഴവെള്ളം (10%)", irrigated: "നനയ്ക്കുന്നത് (5%)",
    livestockTitle: "കന്നുകാലികൾ", sheepGoat: "ആടുകൾ", cattle: "പശുക്കൾ", festGreeting: "ഫിഖ്ഹ് ഹബ്ബിലേക്ക് സ്വാഗതം", festAction: "പ്രവേശിക്കുക",
    mahjubTitle: "ഹജ്ബ് ചെയ്യപ്പെട്ടവർ (Mahjub)",
    cats: { direct: "നേരിട്ടുള്ള ബന്ധുക്കൾ", desc: "സന്താനങ്ങൾ", sib: "സഹോദരങ്ങൾ", nephew: "സഹോദര പുത്രന്മാർ", cousin: "പിതൃസഹോദര പുത്രന്മാർ" } 
  },
  ar: { 
    title: "ملتقى الفقه", subtitle: "منصة الفقه الشافعي", home: "الرئيسية", inheritance: "المواريث", zakath: "الزكاة", faraid: "الفرائض", back: "رجوع", calculate: "احسب", 
    estateValue: "قيمة التركة", estateTotal: "إجمالي التركة", runEngine: "تشغيل النظام", wajib: "واجب", exempt: "دون النصاب", share: "النصيب", perHead: "نصيب الفرد", 
    blockedBy: "حُجب بـ", mahjub: "محجوب", cashSavings: "النقد والمدخرات", goldWeight: "وزن الذهب", businessStock: "التجارة", silverWeight: "الفضة",
    agriTitle: "الزراعة (العشر)", agriWeight: "المحصول (كجم)", agriType: "الري", rainFed: "مطر (10%)", irrigated: "سقي (5%)",
    livestockTitle: "الماشية", sheepGoat: "غنم وماعز", cattle: "بقر وجاموس", festGreeting: "أهلاً بكم في ملتقى الفقه", festAction: "دخول",
    mahjubTitle: "الورثة المحجوبون",
    cats: { direct: "الورثة المباشرون", desc: "الفروع", sib: "الإخوة", nephew: "أبناء الإخوة", cousin: "أبناء الأعمام" } 
  }
};

const HEIR_DATA = {
  husband: { term: "Az-Zawj", en: "Husband", ml: "ഭർത്താവ്", ar: "الزوج", rules: "Fixed share based on offspring." },
  wife: { term: "Az-Zawjah", en: "Wife", ml: "ഭാര്യ", ar: "الزوجة", rules: "Multiple wives share the fixed portion." },
  sons: { term: "Al-Ibn", en: "Son", ml: "മകൻ", ar: "الابن", rules: "Takes residue after sharers." },
  daughters: { term: "Al-Bint", en: "Daughter", ml: "മകൾ", ar: "البنت", rules: "Fixed share or residue with sons." },
  grandsons: { term: "Ibn al-Ibn", en: "Grandson", ml: "മകന്റെ മകൻ", ar: "ابن الابن", rules: "Excluded by sons." },
  granddaughters: { term: "Bint al-Ibn", en: "Granddaughter", ml: "മകന്റെ മകൾ", ar: "بنت الابن", rules: "Fixed share if no closer offspring." },
  father: { term: "Al-Ab", en: "Father", ml: "പിതാവ്", ar: "الأب", rules: "Fixed 1/6 or residue." },
  mother: { term: "Al-Umm", en: "Mother", ml: "മാതാവ്", ar: "الأم", rules: "Fixed 1/6 or 1/3." },
  grandfather: { term: "Al-Jadd", en: "Grandfather", ml: "പിതാമഹൻ", ar: "الجد", rules: "Excluded by father." },
  patGrandmother: { term: "Al-Jaddah Ab", en: "Pat. Grandma", ml: "പിതാവിന്റെ മാതാവ്", ar: "الجدة لأب", rules: "Excluded by father/mother." },
  matGrandmother: { term: "Al-Jaddah Umm", en: "Mat. Grandma", ml: "മാതാവിന്റെ മാതാവ്", ar: "الجدة لأم", rules: "Excluded by mother." },
  fullBrothers: { term: "Al-Akh Shaqiq", en: "Full Brother", ml: "സഹോദരൻ", ar: "الأخ الشقيق", rules: "Excluded by male descendants/father." },
  fullSisters: { term: "Al-Ukht Shaqiqah", en: "Full Sister", ml: "സഹോദരി", ar: "الأخت الشقيقة", rules: "Excluded by male descendants/father." },
  patBrothers: { term: "Al-Akh Ab", en: "Pat. Brother", ml: "പിതൃ സഹോദരൻ", ar: "الأخ لأب", rules: "Excluded by full brother." },
  patSisters: { term: "Al-Ukht Ab", en: "Pat. Sister", ml: "പിതൃ സഹോദരി", ar: "الأخت لأب", rules: "Excluded by full brother." },
  matBrothers: { term: "Al-Akh Umm", en: "Mat. Brother", ml: "മാതൃ സഹോദരൻ", ar: "الأخ لأം", rules: "Fixed 1/6 or 1/3." },
  matSisters: { term: "Al-Ukht Umm", en: "Mat. Sister", ml: "മാതൃ സഹോദരി", ar: "الأخت لأം", rules: "Fixed 1/6 or 1/3." },
  fullNephews: { term: "Ibn Akh", en: "Full Nephew", ml: "സഹോദര പുത്രൻ", ar: "ابن الأخ", rules: "Agnatic relative." },
  patNephews: { term: "Ibn Akh Ab", en: "Pat. Nephew", ml: "പിതൃ സഹോദര പുത്രൻ", ar: "ابن الأخ لأب", rules: "Agnatic relative." },
  fullNephewSons: { term: "Ibn Ibn Akh", en: "Nephew Son", ml: "സഹോദര പേരക്കുട്ടി", ar: "ابن ابن الأخ", rules: "Agnatic relative." },
  patNephewSons: { term: "Ibn Ibn Akh Ab", en: "Pat. Nephew Son", ml: "പിതൃസഹോദര പേരക്കുട്ടി", ar: "ابن ابن الأخ لأب", rules: "Agnatic relative." },
  fullPatUncles: { term: "Amm Shaqiq", en: "Full Uncle", ml: "വലിയ പിതാവ്", ar: "العم الشقيق", rules: "Father's full brother." },
  patPatUncles: { term: "Amm Ab", en: "Pat. Uncle", ml: "പിതൃ വലിയ പിതാവ്", ar: "العم لأب", rules: "Father's paternal brother." },
  fullCousins: { term: "Ibn Amm", en: "Full Cousin", ml: "കസിൻ", ar: "ابن العم", rules: "Full uncle's son." },
  patCousins: { term: "Ibn Amm Ab", en: "Pat. Cousin", ml: "പിതൃ കസിൻ", ar: "ابن العم لأب", rules: "Paternal uncle's son." },
  fullCousinSons: { term: "Ibn Ibn Amm", en: "Cousin Son", ml: "കസിൻ മകൻ", ar: "ابن ابن العم", rules: "Agnatic relative." },
  patCousinSons: { term: "Ibn Ibn Amm Ab", en: "Pat. Cousin Son", ml: "പിതൃ കസിൻ മകൻ", ar: "ابن ابن العم لأب", rules: "Agnatic relative." },
  fullCousinGrandsons: { term: "Ibn Ibn Ibn Amm", en: "Cousin G-Son", ml: "കസിൻ പേരക്കുട്ടി", ar: "ابن ابن ابن العم", rules: "Agnatic relative." },
  patCousinGrandsons: { term: "Ibn Ibn Ibn Amm Ab", en: "Pat. Cousin G-Son", ml: "പിതൃ കസിൻ പേരക്കുട്ടി", ar: "ابن ابن ابن العم لأب", rules: "Agnatic relative." }
};

// --- ENGINE: CALCULATE INHERITANCE ---
const runInheritanceEngine = (inputs, estate) => {
  const h = (id) => inputs[id] || 0;
  let results = [];
  let exclusions = [];
  const addExcl = (id, blocker) => { if (h(id) > 0) exclusions.push({ id, blockedBy: HEIR_DATA[blocker].term }); };
  
  const hasDesc = (h('sons') > 0 || h('daughters') > 0 || h('grandsons') > 0 || h('granddaughters') > 0);
  const hasMaleDesc = (h('sons') > 0 || h('grandsons') > 0);

  if (h('sons') > 0) ['grandsons', 'granddaughters'].forEach(id => addExcl(id, 'sons'));
  if (h('father') > 0) ['grandfather', 'patGrandmother'].forEach(id => addExcl(id, 'father'));
  if (h('mother') > 0) ['patGrandmother', 'matGrandmother'].forEach(id => addExcl(id, 'mother'));
  if (h('father') > 0 || hasMaleDesc) ['fullBrothers', 'fullSisters', 'patBrothers', 'patSisters', 'matBrothers', 'matSisters'].forEach(s => addExcl(s, h('father') > 0 ? 'father' : 'sons'));

  const asabahOrder = ['sons', 'grandsons', 'father', 'grandfather', 'fullBrothers', 'patBrothers', 'fullNephews', 'patNephews', 'fullNephewSons', 'patNephewSons', 'fullPatUncles', 'patPatUncles', 'fullCousins', 'patCousins', 'fullCousinSons', 'patCousinSons', 'fullCousinGrandsons', 'patCousinGrandsons'];
  let topAgnate = null;
  for (let id of asabahOrder) { if (!exclusions.find(e => e.id === id) && h(id) > 0) { topAgnate = id; break; } }
  if (topAgnate) { asabahOrder.slice(asabahOrder.indexOf(topAgnate) + 1).forEach(id => { if (h(id) > 0 && !exclusions.find(e => e.id === id)) addExcl(id, topAgnate); }); }

  const active = { ...inputs }; exclusions.forEach(e => active[e.id] = 0);
  let totalFixed = 0; const commonD = 24;

  if (active.husband) { const v = hasDesc ? 6 : 12; results.push({ id: 'husband', f: hasDesc ? '1/4' : '1/2', p: (v/24)*100 }); totalFixed += v; }
  else if (active.wife > 0) { const v = hasDesc ? 3 : 6; results.push({ id: 'wife', f: hasDesc ? '1/8' : '1/4', p: (v/24)*100 }); totalFixed += v; }
  if (active.mother) { const v = hasDesc ? 4 : 8; results.push({ id: 'mother', f: hasDesc ? '1/6' : '1/3', p: (v/24)*100 }); totalFixed += v; }
  if (active.father && hasMaleDesc) { results.push({ id: 'father', f: '1/6', p: (4/24)*100 }); totalFixed += 4; }
  if (active.daughters > 0 && active.sons === 0) { const v = active.daughters === 1 ? 12 : 16; results.push({ id: 'daughters', f: active.daughters === 1 ? '1/2' : '2/3', p: (v/24)*100 }); totalFixed += v; }

  if (totalFixed > commonD) { const factor = commonD / totalFixed; results.forEach(r => r.p *= factor); }
  let residue = Math.max(0, 100 - results.reduce((acc, r) => acc + r.p, 0));
  if (residue > 0 && topAgnate) {
    const partners = { 'sons':'daughters', 'grandsons':'granddaughters', 'fullBrothers':'fullSisters', 'patBrothers':'patSisters' };
    const pId = partners[topAgnate];
    if (pId && active[pId] > 0) {
      const units = (active[topAgnate] * 2) + active[pId]; const val = residue / units;
      results.push({ id: topAgnate, f: 'Asabah', p: val * 2 * active[topAgnate] });
      results.push({ id: pId, f: 'Asabah', p: val * active[pId] });
    } else {
      const existing = results.find(r => r.id === topAgnate);
      if (existing) { existing.p += residue; existing.f += ' + Asabah'; }
      else results.push({ id: topAgnate, f: 'Asabah', p: residue });
    }
  }
  return { 
    winners: results.map(r => ({ ...r, ...HEIR_DATA[r.id], amount: estate ? (r.p/100)*estate : 0 })), 
    losers: exclusions.map(e => ({ ...e, ...HEIR_DATA[e.id] })) 
  };
};

const App = () => {
  const [state, setState] = useState({
    page: 'splash', lang: 'en', inheritanceInputs: {}, estate: 0, inheritanceResults: null,
    zakahInputs: { cash: 0, gold: 0, silver: 0, business: 0, agriWeight: 0, agriType: 'rainFed', sheepGoat: 0, cattle: 0 },
    zakahRes: null
  });

  const t = TRANSLATIONS[state.lang];
  const isAr = state.lang === 'ar';

  const setPage = (p) => setState(s => ({ ...s, page: p, inheritanceResults: null, zakahRes: null }));
  const setLang = (l) => setState(s => ({ ...s, lang: l }));

  const calculateZakah = () => {
    const zi = state.zakahInputs;
    const wealthTotal = (zi.cash) + (zi.gold * GOLD_PRICE_FIXED) + (zi.silver * SILVER_PRICE_EST) + (zi.business);
    const nisabReached = wealthTotal >= (NISAB_GOLD * GOLD_PRICE_FIXED);
    
    let res = {
      wealth: { payable: nisabReached ? wealthTotal * 0.025 : 0, reached: nisabReached, total: wealthTotal },
      agri: { payable: zi.agriWeight >= NISAB_AGRI_KG ? zi.agriWeight * (zi.agriType === 'rainFed' ? 0.1 : 0.05) : 0, weight: zi.agriWeight },
      livestock: []
    };

    if (zi.sheepGoat >= 40) {
      let count = 0;
      if (zi.sheepGoat <= 120) count = 1; else if (zi.sheepGoat <= 200) count = 2; else count = Math.floor(zi.sheepGoat / 100);
      res.livestock.push(`${count} ${t.sheepGoat} (Nisāb: 40)`);
    }
    if (zi.cattle >= 30) {
      let cowTax = zi.cattle <= 39 ? "1 Tabi' (1yr calf)" : "1 Musinna (2yr cow)";
      res.livestock.push(`${cowTax} (Nisāb: 30)`);
    }
    setState(s => ({ ...s, zakahRes: res }));
  };

  if (state.page === 'splash') {
    return (
      <div className="fixed inset-0 bg-[#020617] flex flex-col items-center justify-center p-6 overflow-hidden">
        <div className="absolute inset-0 star-field opacity-20"></div>
        <div className="absolute top-20 left-1/2 -translate-x-1/2 floating-lantern glowing-moon">
          <Moon size={120} className="text-amber-400" />
        </div>
        <div className="relative z-10 text-center space-y-16 animate-fade-in">
          <div className="space-y-4">
            <h2 className="text-amber-400 text-sm font-black uppercase tracking-[0.5em]">Bismillah</h2>
            <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase leading-none">{t.festGreeting}</h1>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">{t.subtitle}</p>
          </div>
          <div className="flex bg-slate-900/40 p-1.5 rounded-2xl border border-white/10 inline-flex">
            {['en','ml','ar'].map(l => (
              <button key={l} onClick={() => setLang(l)} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${state.lang === l ? 'bg-amber-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}>{l}</button>
            ))}
          </div>
          <button onClick={() => setPage('home')} className="group relative px-12 py-6 bg-transparent rounded-full font-black uppercase tracking-[0.4em] text-white border border-amber-400/30 overflow-hidden hover:border-amber-400 hover:shadow-[0_0_50px_rgba(251,191,36,0.3)] transition-all">
            <span className="relative z-10">{t.festAction}</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col ${isAr ? 'arabic' : ''}`}>
      <header className="bg-slate-900/60 backdrop-blur-xl border-b border-white/10 p-6 sticky top-0 z-50 flex justify-between items-center">
        <div onClick={() => setPage('home')} className="flex items-center gap-4 cursor-pointer group">
          <Scale className="text-blue-400 group-hover:rotate-12 transition-transform" />
          <h1 className="font-black text-2xl tracking-tighter uppercase">{t.title}</h1>
        </div>
        <div className="flex bg-slate-950 p-1 rounded-xl border border-white/5">
          {['en','ml','ar'].map(l => (
            <button key={l} onClick={() => setLang(l)} className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase ${state.lang === l ? 'bg-blue-600 text-white' : 'text-slate-500'}`}>{l}</button>
          ))}
        </div>
      </header>

      <main className="flex-grow w-full max-w-7xl mx-auto p-8">
        {state.page === 'home' && (
          <div className="space-y-16 animate-fade-in py-10">
            <div className="text-center">
              <div className="inline-block p-12 bg-blue-600/10 rounded-[4rem] mb-8 border border-blue-400/20 shadow-2xl"><Scale size={80} className="text-blue-400" /></div>
              <h1 className="text-7xl font-black tracking-tighter uppercase">{t.title}</h1>
              <p className="text-xs font-black uppercase tracking-[0.4em] text-blue-400 mt-4">{t.subtitle}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <button onClick={() => setPage('inheritance')} className="p-16 glass-card rounded-[3rem] hover:border-blue-400 transition-all text-left group">
                <div className="bg-blue-600 p-6 rounded-3xl mb-10 inline-block shadow-lg"><Calculator size={40} /></div>
                <h3 className="text-3xl font-black uppercase">{t.inheritance}</h3>
              </button>
              <button onClick={() => setPage('zakath')} className="p-16 glass-card rounded-[3rem] hover:border-emerald-400 transition-all text-left group">
                <div className="bg-emerald-600 p-6 rounded-3xl mb-10 inline-block shadow-lg"><Wallet size={40} /></div>
                <h3 className="text-3xl font-black uppercase">{t.zakath}</h3>
              </button>
            </div>
          </div>
        )}

        {state.page === 'inheritance' && (
          <div className="space-y-12 animate-fade-in">
            <div className="flex items-center gap-4">
              <button onClick={() => setPage('home')} className="p-4 bg-slate-900 border border-white/10 rounded-2xl"><ArrowLeft /></button>
              <h2 className="text-4xl font-black uppercase tracking-tighter">{t.inheritance}</h2>
            </div>
            {!state.inheritanceResults ? (
              <div className="glass-card rounded-[3rem] p-10 lg:p-16 space-y-16 shadow-2xl">
                <div className="max-w-md mx-auto text-center space-y-4">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest">{t.estateValue}</label>
                  <input type="number" onChange={e => setState(s => ({ ...s, estate: Number(e.target.value) }))} className="w-full p-10 bg-slate-950 border border-white/10 rounded-[2.5rem] text-5xl font-black text-center text-white outline-none focus:ring-4 focus:ring-blue-500/20" placeholder="0.00" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                   {Object.keys(HEIR_DATA).map(id => (
                     <div key={id} className="p-6 bg-slate-950 rounded-[2rem] border border-white/5 flex flex-col gap-4">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black uppercase text-slate-500">{HEIR_DATA[id][state.lang]}</span>
                          <span className="text-[8px] font-bold text-slate-600 tracking-widest uppercase">({HEIR_DATA[id].term})</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <button onClick={() => setState(s => ({ ...s, inheritanceInputs: { ...s.inheritanceInputs, [id]: Math.max(0, (s.inheritanceInputs[id] || 0) - 1) } }))} className="p-2 bg-slate-900 rounded-lg"><Minus size={14}/></button>
                          <span className="font-black text-xl">{state.inheritanceInputs[id] || 0}</span>
                          <button onClick={() => setState(s => ({ ...s, inheritanceInputs: { ...s.inheritanceInputs, [id]: (s.inheritanceInputs[id] || 0) + 1 } }))} className="p-2 bg-slate-900 rounded-lg"><Plus size={14}/></button>
                        </div>
                     </div>
                   ))}
                </div>
                <button onClick={() => setState(s => ({ ...s, inheritanceResults: runInheritanceEngine(s.inheritanceInputs, s.estate) }))} className="w-full bg-blue-600 py-10 rounded-[2.5rem] font-black uppercase tracking-widest text-2xl shadow-2xl">{t.runEngine}</button>
              </div>
            ) : (
              <div className="space-y-12">
                <div className="flex flex-col md:flex-row justify-between items-baseline gap-4 border-b border-white/5 pb-8">
                   <h3 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-3">
                     <UserCheck className="text-blue-400" /> {t.faraid} Results
                   </h3>
                   {state.estate > 0 && <span className="text-4xl font-black text-blue-400">₹{state.estate.toLocaleString()}</span>}
                </div>

                {/* WINNERS SECTION */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
                  {state.inheritanceResults.winners.map(r => (
                    <div key={r.id} className="p-8 glass-card border-blue-400/20 rounded-[2.5rem] flex flex-col hover:border-blue-400/50 transition-all shadow-xl">
                      <div className="flex justify-between mb-6">
                        <div className="flex flex-col">
                          <span className="font-black text-xl text-white tracking-tighter">{r[state.lang]}</span>
                          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none">({r.term})</span>
                        </div>
                        <div className="text-right">
                          <span className="text-3xl font-black text-blue-400 leading-none">{r.f}</span>
                          <div className="text-[10px] text-slate-500 font-bold uppercase mt-1">{r.p.toFixed(2)}%</div>
                        </div>
                      </div>
                      <p className="text-[9px] text-slate-500 italic mb-6">"{r.rules}"</p>
                      {state.estate > 0 && (
                        <div className="mt-auto pt-6 border-t border-white/5 flex flex-col gap-2">
                          <div className="flex justify-between items-baseline">
                            <span className="text-[9px] font-black text-slate-500 uppercase">{t.share}:</span>
                            <span className="text-2xl font-black text-white">₹{r.amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                          </div>
                          {state.inheritanceInputs[r.id] > 1 && (
                            <div className="flex justify-between items-baseline">
                              <span className="text-[9px] font-black text-blue-500 uppercase">{t.perHead}:</span>
                              <span className="text-sm font-black text-blue-400">₹{(r.amount/state.inheritanceInputs[r.id]).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* MAHJUB (LOSERS) SECTION */}
                {state.inheritanceResults.losers.length > 0 && (
                  <div className="space-y-8 pt-10 border-t border-white/10">
                    <h3 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3 text-slate-500">
                      <UserX className="text-rose-500" /> {t.mahjubTitle}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {state.inheritanceResults.losers.map(r => (
                        <div key={r.id} className="p-8 glass-card border-rose-500/10 rounded-[2.5rem] flex flex-col mahjub-card shadow-lg">
                          <div className="flex justify-between mb-4">
                            <div className="flex flex-col">
                              <span className="font-black text-xl text-slate-300 tracking-tighter">{r[state.lang]}</span>
                              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none">({r.term})</span>
                            </div>
                            <div className="p-2 bg-rose-500/10 rounded-xl">
                              <UserX className="text-rose-500/50" size={20} />
                            </div>
                          </div>
                          <div className="mt-auto pt-4 border-t border-white/5">
                            <span className="text-[10px] font-black text-rose-400/70 uppercase tracking-widest">{t.blockedBy}:</span>
                            <div className="text-sm font-black text-slate-200 mt-1 uppercase tracking-tighter">{r.blockedBy}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <button onClick={() => setPage('inheritance')} className="w-full py-6 bg-slate-900 border border-white/5 rounded-3xl font-black uppercase text-slate-500 tracking-widest hover:text-white transition-all">Recalculate</button>
              </div>
            )}
          </div>
        )}

        {state.page === 'zakath' && (
          <div className="space-y-12 animate-fade-in">
            <div className="flex items-center gap-4">
              <button onClick={() => setPage('home')} className="p-4 bg-slate-900 border border-white/10 rounded-2xl"><ArrowLeft /></button>
              <h2 className="text-4xl font-black uppercase tracking-tighter">{t.zakath}</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="glass-card p-10 rounded-[3rem] space-y-10">
                <section className="space-y-6">
                  <h4 className="text-xs font-black text-blue-400 uppercase tracking-widest flex items-center gap-2"><Coins size={16}/> Wealth</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-500 uppercase">{t.cashSavings}</label>
                      <input type="number" onChange={e => setState(s => ({ ...s, zakahInputs: { ...s.zakahInputs, cash: Number(e.target.value) } }))} className="w-full p-4 bg-slate-950 rounded-2xl border border-white/5 font-black text-white outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-500 uppercase">{t.goldWeight}</label>
                      <input type="number" onChange={e => setState(s => ({ ...s, zakahInputs: { ...s.zakahInputs, gold: Number(e.target.value) } }))} className="w-full p-4 bg-slate-950 rounded-2xl border border-white/5 font-black text-white outline-none" />
                    </div>
                  </div>
                </section>
                <section className="space-y-6">
                  <h4 className="text-xs font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2"><Wheat size={16}/> {t.agriTitle}</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <input type="number" placeholder={t.agriWeight} onChange={e => setState(s => ({ ...s, zakahInputs: { ...s.zakahInputs, agriWeight: Number(e.target.value) } }))} className="w-full p-4 bg-slate-950 rounded-2xl border border-white/5 font-black text-white outline-none" />
                    <select onChange={e => setState(s => ({ ...s, zakahInputs: { ...s.zakahInputs, agriType: e.target.value } }))} className="p-4 bg-slate-950 rounded-2xl border border-white/5 font-black text-white outline-none">
                      <option value="rainFed">{t.rainFed}</option>
                      <option value="irrigated">{t.irrigated}</option>
                    </select>
                  </div>
                </section>
                <section className="space-y-6">
                  <h4 className="text-xs font-black text-amber-400 uppercase tracking-widest flex items-center gap-2"><Beef size={16}/> {t.livestockTitle}</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <input type="number" placeholder={t.sheepGoat} onChange={e => setState(s => ({ ...s, zakahInputs: { ...s.zakahInputs, sheepGoat: Number(e.target.value) } }))} className="w-full p-4 bg-slate-950 rounded-2xl border border-white/5 font-black text-white outline-none" />
                    <input type="number" placeholder={t.cattle} onChange={e => setState(s => ({ ...s, zakahInputs: { ...s.zakahInputs, cattle: Number(e.target.value) } }))} className="w-full p-4 bg-slate-950 rounded-2xl border border-white/5 font-black text-white outline-none" />
                  </div>
                </section>
                <button onClick={calculateZakah} className="w-full bg-blue-600 py-8 rounded-3xl font-black uppercase text-xl shadow-2xl hover:bg-blue-500 transition-all">{t.calculate}</button>
              </div>

              <div className="space-y-8">
                <div className="glass-card p-10 rounded-[3rem] text-center space-y-4 shadow-xl">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Current Rate Reference</span>
                  <div className="text-5xl font-black">₹{GOLD_PRICE_FIXED.toLocaleString()} <span className="text-sm text-blue-500">/ g</span></div>
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Nisāb (85g): ₹{(NISAB_GOLD * GOLD_PRICE_FIXED).toLocaleString()}</p>
                </div>
                {state.zakahRes && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="p-10 glass-card rounded-[3rem] bg-emerald-600/10 border-emerald-400/20 shadow-2xl">
                      <span className="text-xs font-black text-emerald-400 uppercase tracking-widest block mb-4">Zakah Payable (Cash/Gold)</span>
                      <h3 className="text-6xl font-black text-white">₹{state.zakahRes.wealth.payable.toLocaleString()}</h3>
                      {!state.zakahRes.wealth.reached && <p className="text-rose-400 text-[10px] font-black uppercase mt-4">{t.exempt}</p>}
                    </div>
                    {state.zakahRes.agri.payable > 0 && (
                      <div className="p-8 glass-card rounded-3xl bg-amber-600/10 border-amber-400/20 shadow-lg">
                        <span className="text-xs font-black text-amber-400 uppercase block mb-2">{t.agriTitle}</span>
                        <h4 className="text-3xl font-black">{state.zakahRes.agri.payable.toFixed(1)} kg <span className="text-xs text-slate-500 lowercase">of produce</span></h4>
                      </div>
                    )}
                    {state.zakahRes.livestock.length > 0 && (
                      <div className="p-8 glass-card rounded-3xl bg-amber-600/10 border-amber-400/20 shadow-lg">
                        <span className="text-xs font-black text-amber-400 uppercase block mb-4">{t.livestockTitle}</span>
                        {state.zakahRes.livestock.map((l, i) => <div key={i} className="font-black text-white text-lg mb-2 pl-4 border-l-2 border-amber-400">{l}</div>)}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);