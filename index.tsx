
import React, { useState, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import { 
    Home as HomeIcon, Calculator as CalcIcon, Wallet, Scale, ArrowLeft, Plus, Minus, 
    ArrowRight, BookOpen, AlertCircle, Coins
} from 'lucide-react';

const TRANSLATIONS = {
    en: {
        title: "Fiqh Hub",
        subtitle: "Shāfiʿī Jurisprudence Platform",
        home: "Home",
        inheritance: "Inheritance",
        zakath: "Zakath",
        faraid: "Fara'id",
        back: "Back",
        calculate: "Calculate",
        estateValue: "Total Estate Value (INR)",
        estateTotal: "Estate Total",
        runEngine: "Run Shāfiʿī Engine",
        wajib: "Wajib (Payable)",
        exempt: "Below Nisāb",
        share: "Share",
        perHead: "Per Individual",
        blockedBy: "Blocked By",
        mahjub: "Mahjub",
        nisabCheck: "Nisāb Check",
        cashSavings: "Cash & Savings (INR)",
        goldWeight: "Gold Weight (Grams)",
        cats: {
            direct: "Direct Heirs",
            desc: "Descendants",
            sib: "Siblings",
            nephew: "Nephews & Extended",
            cousin: "Paternal Cousins"
        }
    },
    ml: {
        title: "ഫിഖ്ഹ് ഹബ്",
        subtitle: "ഷാഫിഈ കർമ്മശാസ്ത്രം",
        home: "ഹോം",
        inheritance: "അനന്തരാവകാശം",
        zakath: "സകാത്ത്",
        faraid: "ഫറാഇദ്",
        back: "പിന്നിലേക്ക്",
        calculate: "കണക്കാക്കുക",
        estateValue: "സ്വത്ത് മൂല്യം (രൂപ)",
        estateTotal: "ആകെ സ്വത്ത്",
        runEngine: "കണക്കുകൂട്ടുക",
        wajib: "നിർബന്ധം (വാജിബ്)",
        exempt: "നിസാബ് തികഞ്ഞില്ല",
        share: "വിഹിതം",
        perHead: "ഒരാൾക്ക്",
        blockedBy: "തടഞ്ഞത്",
        mahjub: "ഹജ്ബ്",
        nisabCheck: "നിസാബ് പരിശോധന",
        cashSavings: "പണം & നിക്ഷേപം",
        goldWeight: "സ്വർണ്ണം (ഗ്രാം)",
        cats: {
            direct: "നേരിട്ടുള്ള ബന്ധുക്കൾ",
            desc: "സന്താനങ്ങൾ",
            sib: "സഹോദരങ്ങൾ",
            nephew: "സഹോദര പുത്രന്മാര്",
            cousin: "പിതൃസഹോദര പുത്രന്മാര്"
        }
    },
    ar: {
        title: "ملتقى الفقه",
        subtitle: "منصة الفقه الشافعي",
        home: "الرئيسية",
        inheritance: "المواريث",
        zakath: "الزكاة",
        faraid: "الفرائض",
        back: "رجوع",
        calculate: "احسب",
        estateValue: "قيمة التركة الإجمالية",
        estateTotal: "إجمالي التركة",
        runEngine: "تشغيل النظام الشافعي",
        wajib: "واجب",
        exempt: "دون النصاب",
        share: "النصيب",
        perHead: "نصيب الفرد",
        blockedBy: "حُجب بـ",
        mahjub: "محجوب",
        nisabCheck: "فحص النصاب",
        cashSavings: "النقد والمدخرات",
        goldWeight: "وزن الذهب (جرام)",
        cats: {
            direct: "الورثة المباشرون",
            desc: "الفروع",
            sib: "الإخوة",
            nephew: "أبناء الإخوة والحواشي",
            cousin: "أبناء الأعمام"
        }
    }
};

const HEIR_DATA = {
    husband: { term: "Az-Zawj", en: "Husband", ml: "ഭർത്താവ്", ar: "الزوج", rules: "Legally married. Active marriage or Iddah." },
    wife: { term: "Az-Zawjah", en: "Wife / Wives", ml: "ഭാര്യ / ഭാര്യമാർ", ar: "الزوجة", rules: "Multiple wives share the fixed portion." },
    sons: { term: "Al-Ibn", en: "Son", ml: "മകൻ", ar: "الابن", rules: "Direct male descendant (Agnate)." },
    daughters: { term: "Al-Bint", en: "Daughter", ml: "മകൾ", ar: "البنت", rules: "Direct female descendant." },
    grandsons: { term: "Ibn al-Ibn", en: "Grandson", ml: "മകന്റെ മകൻ", ar: "ابن الابن", rules: "Son's son only." },
    granddaughters: { term: "Bint al-Ibn", en: "Granddaughter", ml: "മകന്റെ മകൾ", ar: "بنت الابن", rules: "Son's daughter only." },
    father: { term: "Al-Ab", en: "Father", ml: "പിതാവ്", ar: "الأب", rules: "Direct male ascendant." },
    mother: { term: "Al-Umm", en: "Mother", ml: "മാതാവ്", ar: "الأم", rules: "Direct female ascendant." },
    grandfather: { term: "Al-Jadd al-Sahih", en: "Grandfather", ml: "പിതാമഹൻ", ar: "الجد الصحيح", rules: "Paternal grandfather." },
    patGrandmother: { term: "Al-Jaddah li-Ab", en: "Paternal Grandma", ml: "പിതാവിന്റെ മാതാവ്", ar: "الجدة لأب", rules: "Father's mother." },
    matGrandmother: { term: "Al-Jaddah li-Umm", en: "Maternal Grandma", ml: "മാതാവിന്റെ മാതാവ്", ar: "الجدة لأം", rules: "Mother's mother." },
    fullBrothers: { term: "Al-Akh al-Shaqiq", en: "Full Brother", ml: "സഹോദരൻ", ar: "الأخ الشقيق", rules: "Same father and mother." },
    fullSisters: { term: "Al-Ukht al-Shaqiqah", en: "Full Sister", ml: "സഹോദരി", ar: "الأخت الشقيقة", rules: "Same father and mother." },
    patBrothers: { term: "Al-Akh li-Ab", en: "Paternal Brother", ml: "പിതൃസഹോദരൻ", ar: "الأخ لأب", rules: "Same father only." },
    patSisters: { term: "Al-Ukht li-Ab", en: "Paternal Sister", ml: "പിതൃസഹോദരി", ar: "الأخت لأب", rules: "Same father only." },
    matBrothers: { term: "Al-Akh li-Umm", en: "Maternal Brother", ml: "മാതൃസഹോദരൻ", ar: "الأخ لأم", rules: "Same mother only." },
    matSisters: { term: "Al-Ukht li-Umm", en: "Maternal Sister", ml: "മാതൃസഹോദരി", ar: "الأخت لأം", rules: "Same mother only." },
    fullNephews: { term: "Ibn al-Akh al-Shaqiq", en: "Full Nephew", ml: "സഹോദര പുത്രൻ", ar: "ابن الأخ الشقيق", rules: "Full brother's son." },
    patNephews: { term: "Ibn al-Akh li-Ab", en: "Paternal Nephew", ml: "പിതൃസഹോദര പുത്രൻ", ar: "ابن الأخ لأب", rules: "Paternal brother's son." },
    fullNephewSons: { term: "Ibn Ibn al-Akh al-Shaqiq", en: "Full Nephew's Son", ml: "സഹോദരന്റെ പേരക്കുട്ടി", ar: "ابن ابن الأخ الشقيق", rules: "Full brother's grandson." },
    patNephewSons: { term: "Ibn Ibn al-Akh li-Ab", en: "Pat. Nephew's Son", ml: "പിതൃസഹോദരന്റെ പേരക്കുട്ടി", ar: "ابن ابن الأخ لأب", rules: "Paternal brother's grandson." },
    fullPatUncles: { term: "Al-Amm al-Shaqiq", en: "Full Paternal Uncle", ml: "വലിയ പിതാവ് (അമ്മ വഴി)", ar: "العم الشقيق", rules: "Father's full brother." },
    patPatUncles: { term: "Al-Amm li-Ab", en: "Paternal Paternal Uncle", ml: "വലിയ പിതാവ് (അച്ഛൻ വഴി)", ar: "العم لأب", rules: "Father's paternal brother." },
    fullCousins: { term: "Ibn al-Amm al-Shaqiq", en: "Full Cousin", ml: "പിതൃസഹോദര പുത്രൻ", ar: "ابن العم الشقيق", rules: "Father's full brother's son." },
    patCousins: { term: "Ibn al-Amm li-Ab", en: "Paternal Cousin", ml: "പിതൃസഹോദര പുത്രൻ (പിതാവ് വഴി)", ar: "ابن العم لأب", rules: "Father's paternal brother's son." },
    fullCousinSons: { term: "Ibn Ibn al-Amm al-Shaqiq", en: "Full Cousin's Son", ml: "കസിൻറെ മകൻ", ar: "ابن ابن العم الشقيق", rules: "Full cousin's son." },
    patCousinSons: { term: "Ibn Ibn al-Amm li-Ab", en: "Pat. Cousin's Son", ml: "കസിൻറെ മകൻ (പിതാവ് വഴി)", ar: "ابن ابن العم لأب", rules: "Pat. cousin's son." },
    fullCousinGrandsons: { term: "Ibn Ibn Ibn al-Amm al-Shaqiq", en: "Full Cousin's Grandson", ml: "കസിൻറെ പേരക്കുട്ടി", ar: "ابن ابن ابن العم الشقيق", rules: "Full cousin's grandson." },
    patCousinGrandsons: { term: "Ibn Ibn Ibn al-Amm li-Ab", en: "Pat. Cousin's Grandson", ml: "കസിൻറെ പേരക്കുട്ടി (പിതാവ് വഴി)", ar: "ابن ابن ابن العم لأب", rules: "Pat. cousin's grandson." }
};

const calculateFaraid = (inputs, estate) => {
    const h = (id) => inputs[id] || 0;
    const isH = (id) => !!inputs[id];
    let results = [];
    let exclusions = [];

    const addExcl = (id, blocker) => {
        if (h(id) > 0) exclusions.push({ id, blockedBy: HEIR_DATA[blocker].term });
    };

    const hasDescendants = (h('sons') > 0 || h('daughters') > 0 || h('grandsons') > 0 || h('granddaughters') > 0);
    const hasMaleDescendants = (h('sons') > 0 || h('grandsons') > 0);

    // Hajb (Exclusion) Logic
    if (h('sons') > 0) {
        ['grandsons', 'granddaughters'].forEach(id => addExcl(id, 'sons'));
    }
    if (isH('father')) {
        ['grandfather', 'patGrandmother'].forEach(id => addExcl(id, 'father'));
    }
    if (isH('mother')) {
        ['patGrandmother', 'matGrandmother'].forEach(id => addExcl(id, 'mother'));
    }

    if (isH('father') || hasMaleDescendants) {
        ['fullBrothers', 'fullSisters', 'patBrothers', 'patSisters', 'matBrothers', 'matSisters'].forEach(s => addExcl(s, isH('father') ? 'father' : 'sons'));
    }

    const asabahOrder = [
        'sons', 'grandsons', 'father', 'grandfather', 'fullBrothers', 'patBrothers', 
        'fullNephews', 'patNephews', 'fullNephewSons', 'patNephewSons',
        'fullPatUncles', 'patPatUncles', 'fullCousins', 'patCousins',
        'fullCousinSons', 'patCousinSons', 'fullCousinGrandsons', 'patCousinGrandsons'
    ];

    let topAgnate = null;
    for (let id of asabahOrder) {
        if (exclusions.some(e => e.id === id)) continue;
        if (h(id) > 0) { topAgnate = id; break; }
    }
    
    if (topAgnate) {
        const idx = asabahOrder.indexOf(topAgnate);
        asabahOrder.slice(idx + 1).forEach(id => {
            if (h(id) > 0 && !exclusions.some(e => e.id === id)) addExcl(id, topAgnate);
        });
    }

    const active = { ...inputs };
    exclusions.forEach(e => active[e.id] = 0);

    let totalFixed = 0;
    const commonD = 24;

    if (active.husband) {
        const v = hasDescendants ? 6 : 12;
        results.push({ id: 'husband', f: hasDescendants ? '1/4' : '1/2', p: (v/24)*100 });
        totalFixed += v;
    } else if (active.wife > 0) {
        const v = hasDescendants ? 3 : 6;
        results.push({ id: 'wife', f: hasDescendants ? '1/8' : '1/4', p: (v/24)*100 });
        totalFixed += v;
    }

    if (active.mother) {
        const v = hasDescendants ? 4 : 8;
        results.push({ id: 'mother', f: hasDescendants ? '1/6' : '1/3', p: (v/24)*100 });
        totalFixed += v;
    }

    if (active.father && hasMaleDescendants) {
        results.push({ id: 'father', f: '1/6', p: (4/24)*100 });
        totalFixed += 4;
    }

    if (active.daughters > 0 && active.sons === 0) {
        const v = active.daughters === 1 ? 12 : 16;
        results.push({ id: 'daughters', f: active.daughters === 1 ? '1/2' : '2/3', p: (v/24)*100 });
        totalFixed += v;
    }

    if (totalFixed > commonD) {
        const f = commonD / totalFixed;
        results.forEach(r => r.p *= f);
    }

    let residue = Math.max(0, 100 - results.reduce((acc, r) => acc + r.p, 0));
    if (residue > 0 && topAgnate) {
        const partners = { 'sons':'daughters', 'grandsons':'granddaughters', 'fullBrothers':'fullSisters', 'patBrothers':'patSisters' };
        const partner = partners[topAgnate];
        if (partner && active[partner] > 0) {
            const units = (active[topAgnate] * 2) + active[partner];
            const val = residue / units;
            results.push({ id: topAgnate, f: 'Asabah', p: val * 2 * active[topAgnate] });
            results.push({ id: partner, f: 'Asabah', p: val * active[partner] });
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
    const [page, setPage] = useState('home');
    const [lang, setLang] = useState('en');
    const [inputs, setInputs] = useState({});
    const [estate, setEstate] = useState(0);
    const [results, setResults] = useState(null);
    const [zakahInputs, setZakahInputs] = useState({ cash: 0, gold: 0 });
    const [zakahRes, setZakahRes] = useState(null);

    const t = TRANSLATIONS[lang];

    const toggle = (id) => setInputs(p => ({ ...p, [id]: !p[id] }));
    const adjust = (id, d) => setInputs(p => ({ ...p, [id]: Math.max(0, (p[id]||0)+d) }));

    const Category = ({ title, ids }) => (
        <div className="space-y-4">
            <h4 className={`text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] pl-4 border-l-4 border-blue-600 ${lang === 'ar' ? 'text-right pr-4 border-l-0 border-r-4' : ''}`}>
                {title}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {ids.map(id => (
                    ['husband','father','mother','grandfather','patGrandmother','matGrandmother'].includes(id) ? (
                        <button key={id} onClick={() => toggle(id)} className={`p-6 rounded-[2rem] border flex justify-between items-center transition-all ${inputs[id] ? 'bg-blue-600/10 border-blue-400 text-white' : 'bg-slate-950 border-white/5 text-slate-500'}`}>
                            <div className={lang === 'ar' ? 'text-right' : 'text-left'}>
                                <div className={`text-[11px] font-black uppercase tracking-tight ${lang === 'ar' ? 'arabic text-lg' : ''}`}>{HEIR_DATA[id][lang]}</div>
                                <div className="text-[9px] font-bold text-slate-500 uppercase">{HEIR_DATA[id].term}</div>
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 ${inputs[id] ? 'bg-blue-400 border-blue-400' : 'border-slate-800'}`}/>
                        </button>
                    ) : (
                        <div key={id} className="p-6 rounded-[2rem] bg-slate-950 border border-white/5 flex flex-col gap-4">
                            <div className={`text-[11px] font-black text-slate-500 uppercase tracking-widest leading-tight ${lang === 'ar' ? 'text-right' : ''}`}>
                                <span className={lang === 'ar' ? 'arabic text-white text-lg block mb-1' : 'block mb-1 text-white'}>{HEIR_DATA[id][lang]}</span>
                                <span className="text-[8px] font-bold uppercase">({HEIR_DATA[id].term})</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <button onClick={() => adjust(id, -1)} className="p-2 bg-slate-900 rounded-lg hover:text-blue-400"><Minus size={14}/></button>
                                <span className="font-black text-xl tracking-tighter">{inputs[id] || 0}</span>
                                <button onClick={() => adjust(id, 1)} className="p-2 bg-slate-900 rounded-lg hover:text-blue-400"><Plus size={14}/></button>
                            </div>
                        </div>
                    )
                ))}
            </div>
        </div>
    );

    const renderHome = () => (
        <div className="space-y-16 animate-fade-in py-10">
            <section className="text-center">
                <div className="inline-block p-12 bg-blue-600/10 rounded-[4rem] mb-10 border border-blue-400/20 shadow-2xl">
                    <Scale className="text-blue-400" size={80} />
                </div>
                <h1 className="text-7xl font-black text-white uppercase tracking-tighter">{t.title}</h1>
                <p className="text-xs font-black uppercase tracking-[0.5em] text-blue-400 mt-4">{t.subtitle}</p>
            </section>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <button onClick={() => setPage('inheritance')} className="p-16 glass-card rounded-[3.5rem] hover:border-blue-400 transition-all text-left shadow-2xl group overflow-hidden relative">
                    <div className="bg-blue-600 p-6 rounded-[1.5rem] mb-10 inline-block group-hover:scale-110 transition-all shadow-lg"><CalcIcon size={40}/></div>
                    <h3 className="text-3xl font-black uppercase tracking-tighter">{t.inheritance}</h3>
                    <p className="text-xs text-slate-500 mt-4 font-black uppercase tracking-widest opacity-60">Complete 29-Relative Engine</p>
                </button>
                <button onClick={() => setPage('zakath')} className="p-16 glass-card rounded-[3.5rem] hover:border-emerald-400 transition-all text-left shadow-2xl group overflow-hidden relative">
                    <div className="bg-emerald-600 p-6 rounded-[1.5rem] mb-10 inline-block group-hover:scale-110 transition-all shadow-lg"><Wallet size={40}/></div>
                    <h3 className="text-3xl font-black uppercase tracking-tighter">{t.zakath}</h3>
                    <p className="text-xs text-slate-500 mt-4 font-black uppercase tracking-widest opacity-60">Wealth Purification & Nisāb</p>
                </button>
            </div>
        </div>
    );

    const renderResults = () => (
        <div className="space-y-10 animate-fade-in pb-32">
            <button onClick={() => setResults(null)} className="flex items-center gap-2 text-blue-400 font-black uppercase text-xs tracking-widest">
                <ArrowLeft size={16}/> {t.back}
            </button>
            <div className={`flex flex-col md:flex-row justify-between items-end border-b border-white/5 pb-8 gap-6 ${lang === 'ar' ? 'flex-row-reverse text-right' : ''}`}>
                <h2 className="text-5xl font-black uppercase tracking-tighter">{t.faraid} Report</h2>
                {estate > 0 && (
                    <div className={lang === 'ar' ? 'text-left' : 'text-right'}>
                        <span className="text-[10px] font-black text-slate-500 uppercase block mb-1">{t.estateTotal}</span>
                        <span className="text-4xl font-black text-blue-400">₹{estate.toLocaleString()}</span>
                    </div>
                )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.winners.map((r, i) => (
                    <div key={i} className="p-8 rounded-[2.5rem] glass-card border border-blue-400/20 flex flex-col hover:border-blue-400/40 shadow-2xl transition-all">
                        <div className={`flex justify-between items-start mb-4 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                            <div className={lang === 'ar' ? 'text-right' : 'text-left'}>
                                <h3 className={`font-black text-xl text-white uppercase tracking-tighter ${lang === 'ar' ? 'arabic text-2xl' : ''}`}>{r[lang]}</h3>
                                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">({r.term})</div>
                            </div>
                            <div className={lang === 'ar' ? 'text-left' : 'text-right'}>
                                <div className="text-3xl font-black text-blue-400 leading-none">{r.f}</div>
                                <div className="text-[10px] font-black text-slate-500 mt-1">{r.p.toFixed(2)}%</div>
                            </div>
                        </div>
                        <p className={`text-[9px] text-slate-500 italic mb-6 leading-relaxed ${lang === 'ar' ? 'text-right' : 'text-left'}`}>"{r.rules}"</p>
                        {estate > 0 && (
                            <div className="mt-auto pt-6 border-t border-white/5 space-y-3">
                                <div className={`flex justify-between items-baseline ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                                    <span className="text-[9px] font-black text-slate-500 uppercase">{t.share}:</span>
                                    <span className="text-xl font-black text-white">₹{r.amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                                </div>
                                {inputs[r.id] > 1 && (
                                    <div className={`flex justify-between items-baseline ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                                        <span className="text-[9px] font-black text-blue-500 uppercase">{t.perHead}:</span>
                                        <span className="text-sm font-black text-blue-400">₹{(r.amount/inputs[r.id]).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
                {results.losers.map((r, i) => (
                    <div key={i} className="p-8 rounded-[2.5rem] glass-card border border-white/5 mahjub-card flex flex-col">
                        <div className={`flex justify-between items-start mb-4 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                            <div className={lang === 'ar' ? 'text-right' : 'text-left'}>
                                <h3 className={`font-black text-xl text-slate-500 uppercase tracking-tighter ${lang === 'ar' ? 'arabic text-2xl' : ''}`}>{r[lang]}</h3>
                                <div className="text-[10px] font-black text-slate-600 uppercase">({r.term})</div>
                            </div>
                            <div className="bg-red-500/10 text-red-500 px-3 py-1 rounded-lg text-[9px] font-black uppercase">{t.mahjub}</div>
                        </div>
                        <div className={`mt-auto pt-4 border-t border-white/5 text-[9px] font-black text-blue-400 uppercase tracking-widest ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                            {t.blockedBy}: {r.blockedBy}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderInheritance = () => (
        results ? renderResults() : (
            <div className="space-y-12 animate-fade-in pb-32">
                <div className={`flex items-center gap-4 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                    <button onClick={() => setPage('home')} className="p-4 bg-slate-900 border border-white/10 rounded-2xl">
                        <ArrowLeft size={24} className={lang === 'ar' ? 'rotate-180' : ''}/>
                    </button>
                    <h2 className="text-4xl font-black uppercase tracking-tighter">{t.inheritance}</h2>
                </div>
                <div className="glass-card rounded-[3.5rem] p-10 lg:p-16 space-y-16 shadow-2xl">
                    <div className="max-w-md mx-auto space-y-4 text-center">
                        <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">{t.estateValue}</label>
                        <input type="number" className="w-full p-10 bg-slate-950 border border-white/10 rounded-[2.5rem] text-5xl font-black text-center text-white outline-none focus:ring-4 focus:ring-blue-500/20 transition-all" onChange={e => setEstate(Number(e.target.value))} placeholder="0.00" />
                    </div>
                    <div className="space-y-16">
                        <Category title={t.cats.direct} ids={['husband','wife','father','mother','grandfather','patGrandmother','matGrandmother']} />
                        <Category title={t.cats.desc} ids={['sons','daughters','grandsons','granddaughters']} />
                        <Category title={t.cats.sib} ids={['fullBrothers','fullSisters','patBrothers','patSisters','matBrothers','matSisters']} />
                        <Category title={t.cats.nephew} ids={['fullNephews','patNephews','fullNephewSons','patNephewSons','fullPatUncles','patPatUncles']} />
                        <Category title={t.cats.cousin} ids={['fullCousins','patCousins','fullCousinSons','patCousinSons','fullCousinGrandsons','patCousinGrandsons']} />
                    </div>
                    <button onClick={() => setResults(calculateFaraid(inputs, estate))} className="w-full bg-blue-600 py-10 rounded-[2.5rem] font-black uppercase tracking-[0.4em] text-2xl shadow-2xl hover:bg-blue-500 transition-all active:scale-95">
                        {t.runEngine}
                    </button>
                </div>
            </div>
        )
    );

    const renderZakath = () => (
        <div className="space-y-12 animate-fade-in pb-32">
            <div className={`flex items-center gap-4 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                <button onClick={() => setPage('home')} className="p-4 bg-slate-900 border border-white/10 rounded-2xl">
                    <ArrowLeft size={24} className={lang === 'ar' ? 'rotate-180' : ''}/>
                </button>
                <h2 className="text-4xl font-black uppercase tracking-tighter">{t.zakath}</h2>
            </div>
            <div className="glass-card rounded-[3.5rem] p-10 lg:p-16 space-y-16 shadow-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                        <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-4">{t.cashSavings}</label>
                        <input type="number" className="w-full p-8 bg-slate-950 border border-white/5 rounded-3xl font-black text-3xl text-white outline-none focus:ring-4 focus:ring-emerald-500/20" onChange={e => setZakahInputs(p => ({ ...p, cash: Number(e.target.value) }))} />
                    </div>
                    <div className="space-y-4">
                        <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-4">{t.goldWeight}</label>
                        <input type="number" className="w-full p-8 bg-slate-950 border border-white/5 rounded-3xl font-black text-3xl text-white outline-none focus:ring-4 focus:ring-emerald-500/20" onChange={e => setZakahInputs(p => ({ ...p, gold: Number(e.target.value) }))} />
                    </div>
                </div>
                <button onClick={() => {
                    const goldPrice = 7950;
                    const total = zakahInputs.cash + (zakahInputs.gold * goldPrice);
                    const nisab = 85 * goldPrice;
                    setZakahRes(total >= nisab ? total * 0.025 : 0);
                }} className="w-full bg-emerald-600 py-8 rounded-[2rem] font-black uppercase tracking-widest text-xl shadow-2xl hover:bg-emerald-500 transition-all">
                    {t.calculate}
                </button>
                {zakahRes !== null && (
                    <div className="p-16 bg-slate-950/90 rounded-[3rem] border border-emerald-400/20 text-center animate-fade-in shadow-2xl">
                        <span className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest ${zakahRes > 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                            {zakahRes > 0 ? t.wajib : t.exempt}
                        </span>
                        <h3 className="text-7xl font-black mt-12 tracking-tighter text-white">₹ {zakahRes.toLocaleString()}</h3>
                        <p className="text-slate-500 mt-6 font-black uppercase text-[10px] tracking-[0.2em]">Based on 85g 24K Gold Nisāb</p>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className={`min-h-screen flex flex-col ${lang === 'ar' ? 'arabic' : ''}`}>
            <header className={`bg-slate-900/60 backdrop-blur-xl border-b border-white/10 p-6 sticky top-0 z-50 flex justify-between items-center shadow-xl ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                <div onClick={() => setPage('home')} className={`flex items-center gap-4 cursor-pointer group ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                    <Scale className="text-blue-400 group-hover:rotate-12 transition-transform" size={32}/>
                    <h1 className="font-black text-2xl tracking-tighter uppercase">{t.title}</h1>
                </div>
                <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-white/10 shadow-inner">
                    {['en','ml','ar'].map(l => (
                        <button key={l} onClick={()=>setLang(l)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${lang === l ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-500 hover:text-slate-300'}`}>{l}</button>
                    ))}
                </div>
            </header>
            <main className="flex-grow w-full max-w-7xl mx-auto p-8 lg:p-12">
                {page === 'home' && renderHome()}
                {page === 'inheritance' && renderInheritance()}
                {/* Corrected renderZakah to renderZakath to match function definition */}
                {page === 'zakath' && renderZakath()}
            </main>
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
