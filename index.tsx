
import React, { useState, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Scale, Calculator, Wallet, Plus, Minus, UserX, 
  RefreshCcw, Layers, User, Zap, FileText, 
  Award, BarChart3, Home as HomeIcon,
  Coins, Server, Ghost, MessageSquare, ShieldCheck, CheckCircle2,
  TrendingUp, TrendingDown, Info
} from 'lucide-react';

// --- CONSTANTS ---
const GOLD_PRICE_FIXED = 6250; 
const NISAB_GOLD = 85;

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
    share: "Share", blockedBy: "Blocked By", mahjub: "Mahjub", 
    cashSavings: "Cash & Savings", goldWeight: "Gold Weight (g)", businessStock: "Trade Assets",
    mahjubTitle: "Excluded Relatives (Mahjub)", 
    awlTitle: "Al-Awl (Proportional Decrease)", 
    raddTitle: "Al-Radd (Proportional Increase)",
    jabarTitle: "Asabah Logic",
    deceasedGender: "Deceased Gender", male: "Male", female: "Female",
    basisLabel: "Inheritance Basis", asabahTypeLabel: "Asabah Category",
    asabahNafsi: "Asabah bi-Nafsihi", asabahGhayri: "Asabah bi-Ghayrihi", asabahMaAl: "Asabah ma'a Ghayrihi",
    categories: {
      descendants: "Descendants",
      ancestors: "Ancestors",
      siblings: "Siblings",
      extended: "Extended Relatives"
    },
    awlDesc: "Total shares exceeded 1. Shares were proportionally reduced.",
    raddDesc: "Residue was left and no agnates exist. Residue was returned to non-spouse heirs."
  },
  ml: { 
    title: "ഫിഖ്ഹ് ഹബ്", subtitle: "ഷാഫിഈ കർമ്മശാസ്ത്രം", home: "ഹോം", inheritance: "അനന്തരാവകാശം", zakath: "സകാത്ത്", 
    back: "പിന്നിലേക്ക്", calculate: "കണക്കാക്കുക", estateValue: "സ്വത്ത് മൂല്യം", runEngine: "കണക്കുകൂട്ടുക", 
    share: "ഓഹരി", blockedBy: "തടഞ്ഞത്", mahjub: "ഹജ്ബ്", 
    cashSavings: "പണം & നിക്ഷേപം", goldWeight: "സ്വർണ്ണം (ഗ്രാം)", businessStock: "ബിസിനസ്സ് സ്റ്റോക്ക്",
    mahjubTitle: "ഹജ്ബ് ചെയ്യപ്പെട്ടവർ (Mahjub)", 
    awlTitle: "ഔൽ മസ്അല (വിഹിതം കുറയുന്നു)", 
    raddTitle: "റദ്ദ് മസ്അല (വിഹിതം കൂടുന്നു)",
    jabarTitle: "അസ്വബ നിയമം",
    deceasedGender: "മരണപ്പെട്ട വ്യക്തി", male: "പുരുഷൻ", female: "സ്ത്രീ",
    basisLabel: "ലഭിക്കാനുള്ള കാരണം", asabahTypeLabel: "അസ്വബ ഇനം",
    asabahNafsi: "അസ്വബ ബിന്നഫ്സിഹി", asabahGhayri: "അസ്വബ ബിൽഗൈരിഹി", asabahMaAl: "അസ്വബ മഅൽഗൈരിഹി",
    categories: {
      descendants: "സന്താനപരമ്പര",
      ancestors: "മുൻഗാമികൾ",
      siblings: "സഹോദരങ്ങൾ",
      extended: "മറ്റ് ബന്ധുക്കൾ"
    },
    awlDesc: "നിശ്ചിത വിഹിതങ്ങൾ ആകെ സ്വത്തിനേക്കാൾ കൂടുതലായതിനാൽ ഔൽ നിയമപ്രകാരം വിഹിതങ്ങൾ കുറച്ചു.",
    raddDesc: "വിഹിതങ്ങൾ നൽകി കഴിഞ്ഞ് ബാക്കിയുള്ള സ്വത്ത് അസ്വബകൾ ഇല്ലാത്തതിനാൽ മറ്റുള്ളവർക്ക് റദ്ദ് നിയമപ്രകാരം വീതിച്ചു നൽകി."
  },
  ar: { 
    title: "مركز الفقه", subtitle: "منصة الشافعية", home: "الرئيسية", inheritance: "المواريث", zakath: "الزكاة", 
    back: "العودة", calculate: "احسب", estateValue: "القيمة الإجمالية للتركة", runEngine: "تشغيل المحرك", 
    share: "نصيب", blockedBy: "محجوب بـ", mahjub: "محجوب", 
    cashSavings: "النقود والمدخرات", goldWeight: "وزن الذهب", businessStock: "عروض التجارة",
    mahjubTitle: "الأقارب المحجوبون", 
    awlTitle: "مسألة العول", 
    raddTitle: "مسألة الرد",
    jabarTitle: "فقه العصبة",
    deceasedGender: "جنس المتوفى", male: "ذكر", female: "أنثى",
    basisLabel: "سبب الإرث", asabahTypeLabel: "نوع العصبة",
    asabahNafsi: "عصبة بالنفس", asabahGhayri: "عصبة بالغير", asabahMaAl: "عصبة مع الغير",
    categories: {
      descendants: "الفروع",
      ancestors: "الأصول",
      siblings: "الحواشي",
      extended: "أقارب آخرون"
    },
    awlDesc: "تجاوزت السهام أصل المسألة، فتم إنقاص السهام بنسبة عادلة (العول).",
    raddDesc: "تبقي نصيب ولم يوجد عاصب، فتم رد الباقي على أصحاب الفروض (ما عدا الزوجين)."
  }
};

const HEIR_DATA: any = {
  husband: { term: "Az-Zawj", ar: "الزوج", en: "Husband", ml: "ഭർത്താവ്", cat: "descendants", max: 1 },
  wife: { term: "Az-Zawjah", ar: "الزوجة", en: "Wife", ml: "ഭാര്യ", cat: "descendants", max: 4 },
  sons: { term: "Al-Ibn", ar: "الابن", en: "Son", ml: "മകൻ", cat: "descendants", max: 20 },
  daughters: { term: "Al-Bint", ar: "البنت", en: "Daughter", ml: "മകൾ", cat: "descendants", max: 20 },
  grandSons: { term: "Ibn al-Ibn", ar: "ابن الابن", en: "Grandson", ml: "മകൻറെ മകൻ", cat: "descendants", max: 20 },
  grandDaughters: { term: "Bint al-Ibn", ar: "بنت الابن", en: "Granddaughter", ml: "മകൻറെ മകൾ", cat: "descendants", max: 20 },
  gGrandSons: { term: "Ibn Ibn al-Ibn", ar: "ابن ابن الابن", en: "G-Grandson", ml: "മകൻറെ മകൻറെ മകൻ", cat: "descendants", max: 20 },
  father: { term: "Al-Ab", ar: "الأب", en: "Father", ml: "പിതാവ്", cat: "ancestors", max: 1 },
  mother: { term: "Al-Umm", ar: "الأم", en: "Mother", ml: "മാതാവ്", cat: "ancestors", max: 1 },
  pGrandfather: { term: "Al-Jadd al-Sahih", ar: "الجد الصحيح", en: "Pat. Grandfather", ml: "പിതാമഹൻ", cat: "ancestors", max: 1 },
  pGrandmother: { term: "Al-Jaddah", ar: "الجدة لأب", en: "Pat. Grandmother", ml: "പിതാവിൻറെ ഉമ്മ", cat: "ancestors", max: 1 },
  mGrandmother: { term: "Al-Jaddah", ar: "الجدة لأم", en: "Mat. Grandmother", ml: "മാതാവിൻറെ ഉമ്മ", cat: "ancestors", max: 1 },
  pGGrandfather: { term: "Al-Jadd al-A'la", ar: "الجد الأعلى", en: "Pat. G-Grandfather", ml: "പിതാവിൻറെ പിതാമഹൻ", cat: "ancestors", max: 1 },
  fullBrothers: { term: "Al-Akh Shaqiq", ar: "الأخ الشقيق", en: "Full Brother", ml: "സഹോദരൻ", cat: "siblings", max: 20 },
  fullSisters: { term: "Al-Ukht Shaqiqah", ar: "الأخت الشقيقة", en: "Full Sister", ml: "സഹോദരി", cat: "siblings", max: 20 },
  consBrothers: { term: "Al-Akh li-Ab", ar: "الأخ لأب", en: "Cons. Brother", ml: "പിതാവൊത്ത സഹോദരൻ", cat: "siblings", max: 20 },
  consSisters: { term: "Al-Ukht li-Ab", ar: "الأخت لأب", en: "Cons. Sister", ml: "പിതാവൊത്ത സഹോദരി", cat: "siblings", max: 20 },
  uterBrothers: { term: "Al-Akh li-Umm", ar: "الأخ لأم", en: "Uterine Brother", ml: "മാതാവൊത്ത സഹോദരൻ", cat: "siblings", max: 20 },
  uterSisters: { term: "Al-Ukht li-Umm", ar: "الأخت لأم", en: "Uterine Sister", ml: "മാതാവൊത്ത സഹോദരി", cat: "siblings", max: 20 },
  fBroSon: { term: "Ibn al-Akh Shaqiq", ar: "ابن الأخ الشقيق", en: "Full Bro's Son", ml: "സഹോദര പുത്രൻ", cat: "extended", max: 20 },
  cBroSon: { term: "Ibn al-Akh li-Ab", ar: "ابن الأخ لأب", en: "Cons. Bro's Son", ml: "പിതാവൊത്ത സഹോദരപുത്രൻ", cat: "extended", max: 20 },
  fBroSonSon: { term: "Ibn Ibn Akh Shaqiq", ar: "ابن ابن الأخ الشقيق", en: "Full Bro's G-Son", ml: "സഹോദരൻറെ മകൻറെ മകൻ", cat: "extended", max: 20 },
  fPatUncle: { term: "Al-Amm Shaqiq", ar: "العم الشقيق", en: "Full Pat. Uncle", ml: "പിതാവിൻറെ സഹോദരൻ", cat: "extended", max: 20 },
  cPatUncle: { term: "Al-Amm li-Ab", ar: "العم لأب", en: "Cons. Pat. Uncle", ml: "പിതാവിൻറെ പിതാവൊത്ത സഹോദരൻ", cat: "extended", max: 20 },
  fPatUncleSon: { term: "Ibn al-Amm Shaqiq", ar: "ابن العم الشقيق", en: "Full Uncle's Son", ml: "അമ്മാവൻറെ മകൻ", cat: "extended", max: 20 },
  cPatUncleSon: { term: "Ibn al-Amm li-Ab", ar: "ابن العم لأب", en: "Cons. Uncle's Son", ml: "അമ്മാവൻറെ മകൻ (Cons)", cat: "extended", max: 20 },
  mEmancipator: { term: "Al-Mu'tiq", ar: "المعتق", en: "Male Emancipator", ml: "അടിമയെ മോചിപ്പിച്ച പുരുഷൻ", cat: "extended", max: 1 },
  fEmancipator: { term: "Al-Mu'tiqah", ar: "المعتقة", en: "Fem. Emancipator", ml: "അടിമയെ മോചിപ്പിച്ച സ്ത്രീ", cat: "extended", max: 1 },
  baitAlMal: { term: "Bait al-Mal", ar: "بيت المال", en: "Public Treasury", ml: "ബൈത്തുൽമാൽ", cat: "extended", max: 1 }
};

const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
const lcm = (a: number, b: number): number => (a * b) / gcd(a, b);
const getLCMOfArray = (arr: number[]): number => arr.length === 0 ? 1 : arr.reduce((acc, val) => lcm(acc, val), 1);

const runInheritanceEngine = (inputs: any, estate: number) => {
  const h = (id: string) => inputs[id] || 0;
  let rawResults: any[] = [];
  let exclusions: any[] = [];
  
  const addExcl = (id: string, blocker: string) => { 
    if (h(id) > 0) {
      exclusions.push({ 
        id, 
        blockedBy: HEIR_DATA[blocker]?.term || blocker, 
        blockerNameEn: HEIR_DATA[blocker]?.en || blocker, 
        blockerNameMl: HEIR_DATA[blocker]?.ml || blocker,
        blockerNameAr: HEIR_DATA[blocker]?.ar || blocker
      });
    }
  };
  
  const hasDesc = (h('sons') + h('daughters') + h('grandSons') + h('grandDaughters') + h('gGrandSons')) > 0;
  const hasMaleDesc = (h('sons') + h('grandSons') + h('gGrandSons')) > 0;
  const sibCount = (h('fullBrothers') + h('fullSisters') + h('consBrothers') + h('consSisters') + h('uterBrothers') + h('uterSisters'));

  if (h('sons') > 0) {
    ['grandSons', 'grandDaughters', 'gGrandSons', 'fullBrothers', 'fullSisters', 'consBrothers', 'consSisters', 'uterBrothers', 'uterSisters', 'fBroSon', 'cBroSon', 'fPatUncle', 'cPatUncle', 'fPatUncleSon', 'cPatUncleSon', 'fBroSonSon'].forEach(id => addExcl(id, 'sons'));
  }
  if (h('father') > 0) {
    ['pGrandfather', 'pGGrandfather', 'fullBrothers', 'fullSisters', 'consBrothers', 'consSisters', 'uterBrothers', 'uterSisters', 'fBroSon', 'cBroSon', 'fPatUncle', 'cPatUncle', 'fPatUncleSon', 'cPatUncleSon'].forEach(id => addExcl(id, 'father'));
  }
  if (h('mother') > 0) {
    ['pGrandmother', 'mGrandmother'].forEach(id => addExcl(id, 'mother'));
  }

  const active = { ...inputs };
  exclusions.forEach(e => active[e.id] = 0);

  if (active.husband) {
    const d = hasDesc ? 4 : 2;
    rawResults.push({ id: 'husband', num: 1, den: d, type: 'fixed',
      reasonEn: hasDesc ? "1/4 share (descendants exist)." : "1/2 share (no descendants).",
      reasonMl: hasDesc ? "സന്താനങ്ങൾ ഉള്ളതിനാൽ 1/4 ലഭിക്കുന്നു." : "സന്താനങ്ങൾ ഇല്ലാത്തതിനാൽ 1/2 ലഭിക്കുന്നു.",
      reasonAr: hasDesc ? "الربع لوجود الفرع الوارث." : "النصف لعدم وجود الفرع الوارث."
    });
  } else if (active.wife > 0) {
    const d = hasDesc ? 8 : 4;
    rawResults.push({ id: 'wife', num: 1, den: d, type: 'fixed',
      reasonEn: hasDesc ? "1/8 share (descendants exist)." : "1/4 share (no descendants).",
      reasonMl: hasDesc ? "സന്താനങ്ങൾ ഉള്ളതിനാൽ 1/8 ലഭിക്കുന്നു." : "സന്താനങ്ങൾ ഇല്ലാത്തതിനാൽ 1/4 ലഭിക്കുന്നു.",
      reasonAr: hasDesc ? "الثمن لوجود الفرع الوارث." : "الربع لعدم وجود الفرع الوارث."
    });
  }

  if (active.mother) {
    const d = (hasDesc || sibCount >= 2) ? 6 : 3;
    rawResults.push({ id: 'mother', num: 1, den: d, type: 'fixed',
      reasonEn: (hasDesc || sibCount >= 2) ? "1/6 share (descendants/multiple siblings)." : "1/3 share (no descendants, single sibling).",
      reasonMl: (hasDesc || sibCount >= 2) ? "സന്താനങ്ങളോ ഒന്നിലധികം സഹോദരങ്ങളോ ഉള്ളതിനാൽ 1/6 ലഭിക്കുന്നു." : "സന്താനങ്ങളില്ലാത്തതിനാലും സഹോദരങ്ങൾ ഒന്നിൽ കുറവായതിനാലും 1/3 ലഭിക്കുന്നു.",
      reasonAr: (hasDesc || sibCount >= 2) ? "السدس لوجود الفرع الوارث أو جمع من الأخوة." : "الثلث لعدم وجود الفرع الوارث والجمع من الأخوة."
    });
  }

  if (active.father && hasMaleDesc) {
    rawResults.push({ id: 'father', num: 1, den: 6, type: 'fixed',
      reasonEn: "1/6 fixed share in presence of male descendants.",
      reasonMl: "ആൺ സന്താനങ്ങൾ ഉള്ളതിനാൽ 1/6 ലഭിക്കുന്നു.",
      reasonAr: "السدس فرضاً لوجود الفرع الوارث الذكر."
    });
  }

  if (active.daughters > 0 && active.sons === 0) {
    const n = active.daughters === 1 ? 1 : 2;
    const d = active.daughters === 1 ? 2 : 3;
    rawResults.push({ id: 'daughters', num: n, den: d, type: 'fixed',
      reasonEn: active.daughters === 1 ? "Single daughter takes 1/2." : "Daughters share 2/3.",
      reasonMl: active.daughters === 1 ? "ഏകമകൾക്ക് 1/2 ലഭിക്കുന്നു." : "ഒന്നിലധികം മക്കൾക്ക് 2/3 ലഭിക്കുന്നു.",
      reasonAr: active.daughters === 1 ? "النصف للواحدة المنفردة." : "الثلثان للبنتين فأكثر عند عدم الابن."
    });
  }

  const baseAsl = getLCMOfArray(rawResults.map(r => r.den || 1));
  let units = 0;
  rawResults.forEach(r => units += (baseAsl / r.den) * r.num);
  
  const isAwl = units > baseAsl;
  const isRaddPossible = units < baseAsl;
  const topAgnate = ['sons', 'father', 'grandSons', 'gGrandSons', 'fullBrothers', 'consBrothers', 'fBroSon', 'cBroSon', 'fPatUncle'].find(id => active[id] > 0);
  const sisterAsabah = (active.daughters > 0 || active.grandDaughters > 0) && (active.fullSisters > 0 || active.consSisters > 0);
  const hasAnyAsabah = topAgnate || sisterAsabah;
  const isRadd = isRaddPossible && !hasAnyAsabah;

  let finalAsl = baseAsl;
  if (isAwl) finalAsl = units;
  if (isRadd) finalAsl = units; 

  let results = rawResults.map(r => {
    let p = (((baseAsl / r.den) * r.num) / finalAsl) * 100;
    return {
      ...r, ...HEIR_DATA[r.id],
      p: p,
      f: `${(baseAsl/r.den)*r.num}/${finalAsl}`,
      highlight: isAwl ? 'purple' : isRadd ? 'cyan' : undefined,
      tag: 'fixed',
      amount: estate ? (p/100 * estate) : 0
    };
  });

  if (!isAwl && !isRadd) {
    let residueUnits = finalAsl - units;
    if (residueUnits > 0) {
      if (topAgnate) {
        const pId = topAgnate === 'sons' ? 'daughters' : topAgnate === 'fullBrothers' ? 'fullSisters' : topAgnate === 'consBrothers' ? 'consSisters' : null;
        if (pId && active[pId] > 0) {
          const totalU = active[topAgnate] * 2 + active[pId];
          const resMale = (residueUnits / finalAsl) * (active[topAgnate] * 2 / totalU);
          const resFemale = (residueUnits / finalAsl) * (active[pId] / totalU);
          results.push({ id: topAgnate, ...HEIR_DATA[topAgnate], f: 'Asabah (2:1)', p: resMale * 100, highlight: 'amber', tag: 'asabah', asabahType: 'asabahGhayri', amount: estate ? (resMale * estate) : 0, reasonEn: "Asabah bi-Ghayrihi (2:1).", reasonMl: "മറ്റൊരാൾ മുഖേന അസ്വബയാകുന്നു (2:1).", reasonAr: "عصبة بالغير للذكر مثل حظ الأنثيين." });
          results.push({ id: pId, ...HEIR_DATA[pId], f: 'Asabah (2:1)', p: resFemale * 100, highlight: 'amber', tag: 'asabah', asabahType: 'asabahGhayri', amount: estate ? (resFemale * estate) : 0, reasonEn: "Asabah bi-Ghayrihi with male relative.", reasonMl: "ആൺ ബന്ധുവിനോടൊപ്പം അസ്വബയാകുന്നു.", reasonAr: "عصبة بالغير مع الذكر المساوي." });
        } else {
          results.push({ id: topAgnate, ...HEIR_DATA[topAgnate], f: 'Asabah', p: (residueUnits / finalAsl) * 100, tag: 'asabah', asabahType: 'asabahNafsi', amount: estate ? ((residueUnits / finalAsl) * estate) : 0, reasonEn: "Asabah bi-Nafsihi.", reasonMl: "നേരിട്ട് അസ്വബയാകുന്നു.", reasonAr: "عصبة بالنفس كونه أقرب ذكر." });
        }
      } else if (sisterAsabah) {
        const sisId = active.fullSisters > 0 ? 'fullSisters' : 'consSisters';
        results.push({ id: sisId, ...HEIR_DATA[sisId], f: 'Asabah ma\'a Bint', p: (residueUnits / finalAsl) * 100, tag: 'asabah', asabahType: 'asabahMaAl', amount: estate ? ((residueUnits / finalAsl) * estate) : 0, reasonEn: "Asabah ma'a Ghayrihi.", reasonMl: "പെൺമക്കളോടൊപ്പം സഹോദരി അസ്വബയാകുന്നു.", reasonAr: "عصبة مع الغير (اجعلوا الأخوات مع البنات عصبة)." });
      } else {
        results.push({ id: 'baitAlMal', ...HEIR_DATA['baitAlMal'], f: 'Residue', p: (residueUnits / finalAsl) * 100, tag: 'asabah', amount: estate ? ((residueUnits / finalAsl) * estate) : 0, reasonEn: "Surplus to Public Treasury.", reasonMl: "അസ്വബകൾ ഇല്ലാത്തതിനാൽ ബാക്കി ബൈത്തുൽമാലിലേക്ക്.", reasonAr: "الباقي لبيت المال لعدم وجود عصبة." });
      }
    }
  }

  return { winners: results, losers: exclusions.map(e => ({ ...e, ...HEIR_DATA[e.id] })), awl: isAwl, radd: isRadd };
};

const App = () => {
  const [page, setPage] = useState(Page.Home);
  const [lang, setLang] = useState('en'); // SET ENGLISH AS PRIMARY
  const [inputs, setInputs] = useState<any>({});
  const [estate, setEstate] = useState(0);
  const [results, setResults] = useState<any>(null);
  const [gender, setGender] = useState('male');

  const t = TRANSLATIONS[lang];

  const updateHeir = (id: string, d: number) => {
    const max = HEIR_DATA[id].max || 20;
    setInputs((prev: any) => ({ ...prev, [id]: Math.min(max, Math.max(0, (prev[id] || 0) + d)) }));
  };

  const isRTL = lang === 'ar';

  return (
    <div className={`min-h-screen bg-[#020617] text-slate-100 flex flex-col lg:flex-row font-sans selection:bg-blue-500/30 ${isRTL ? 'dir-rtl' : 'dir-ltr'}`}>
      {/* Sidebar Desktop */}
      <aside className={`hidden lg:flex flex-col w-72 bg-slate-950 border-white/5 sticky top-0 h-screen p-8 shrink-0 ${isRTL ? 'border-l' : 'border-r'}`}>
        <div className="mb-12">
          <h1 className="text-3xl font-black tracking-tighter bg-gradient-to-br from-blue-400 to-cyan-400 bg-clip-text text-transparent">{t.title}</h1>
          <p className="text-[10px] text-blue-500 uppercase tracking-[0.4em] font-bold mt-2">{t.subtitle}</p>
        </div>
        <nav className="flex-grow space-y-2">
          {[{ id: Page.Home, icon: <HomeIcon size={20}/>, label: t.home }, { id: Page.Inheritance, icon: <Calculator size={20}/>, label: t.inheritance }, { id: Page.Zakah, icon: <Wallet size={20}/>, label: t.zakath }].map(item => (
            <button key={item.id} onClick={() => { setPage(item.id); setResults(null); }} className={`flex items-center space-x-4 w-full px-5 py-4 rounded-2xl transition-all ${isRTL ? 'space-x-reverse' : ''} ${page === item.id ? 'bg-blue-600/10 text-blue-400 border border-blue-400/20 shadow-lg' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}>
              {item.icon} <span className="text-sm font-black uppercase tracking-widest">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="mt-auto flex bg-slate-900 p-1 rounded-xl border border-white/5">
          {['en', 'ar', 'ml'].map(l => (
            <button key={l} onClick={() => setLang(l)} className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${lang === l ? 'bg-blue-600 text-white' : 'text-slate-500'}`}>{l}</button>
          ))}
        </div>
      </aside>

      <main className="flex-grow p-4 lg:p-12 max-w-6xl mx-auto w-full pb-32 lg:pb-12 overflow-x-hidden">
        {page === Page.Home && (
          <div className="space-y-12 animate-fade-in py-10 text-center">
            <div className="inline-block p-10 bg-blue-500/10 rounded-[3rem] border border-blue-400/20 shadow-2xl animate-pulse mb-10"><Scale size={80} className="text-blue-400" /></div>
            <h2 className="text-5xl lg:text-7xl font-black tracking-tighter uppercase mb-6 leading-none">{t.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 text-left">
              <button onClick={() => setPage(Page.Inheritance)} className="p-12 bg-slate-900/40 rounded-[4rem] border border-white/10 hover:border-blue-500/50 transition-all group shadow-xl">
                <Calculator size={48} className="text-blue-400 mb-8"/><h3 className="text-4xl font-black uppercase tracking-tight">{t.inheritance}</h3>
                <p className="text-slate-500 text-[10px] font-black tracking-widest mt-2 uppercase italic">{HEIR_DATA.baitAlMal.ar} Logic Enabled</p>
              </button>
              <button onClick={() => setPage(Page.Zakah)} className="p-12 bg-slate-900/40 rounded-[4rem] border border-white/10 hover:border-emerald-500/50 transition-all group shadow-xl">
                <Wallet size={48} className="text-emerald-400 mb-8"/><h3 className="text-4xl font-black uppercase tracking-tight">{t.zakath}</h3>
                <p className="text-slate-500 text-[10px] font-black tracking-widest mt-2 uppercase italic">85g Gold Nisab Engine</p>
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
                    <label className={`text-[10px] font-black text-slate-500 uppercase tracking-widest block ${isRTL ? 'text-right mr-4' : 'ml-4'}`}>{t.estateValue}</label>
                    <input type="number" onChange={e => setEstate(Number(e.target.value))} className="w-full p-8 bg-slate-950 border border-white/10 rounded-3xl text-4xl font-black text-center text-white" placeholder="0.00" />
                  </div>
                  <div className="space-y-4">
                    <label className={`text-[10px] font-black text-slate-500 uppercase tracking-widest block ${isRTL ? 'text-right mr-4' : 'ml-4'}`}>{t.deceasedGender}</label>
                    <div className="flex bg-slate-950 p-2 rounded-3xl border border-white/10 gap-2 h-[106px]">
                      {['male', 'female'].map(g => (
                        <button key={g} onClick={() => setGender(g)} className={`flex-1 rounded-2xl font-black uppercase text-xs flex items-center justify-center transition-all ${gender === g ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-600 hover:text-slate-400'}`}>{t[g]}</button>
                      ))}
                    </div>
                  </div>
                </div>

                {Object.keys(t.categories).map(catKey => (
                  <div key={catKey} className="space-y-6">
                    <h3 className={`text-xs font-black text-blue-400 uppercase tracking-[0.4em] ${isRTL ? 'text-right mr-6' : 'ml-6'}`}>{t.categories[catKey]}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                      {Object.keys(HEIR_DATA).filter(id => HEIR_DATA[id].cat === catKey).filter(id => (id === 'husband' ? gender === 'female' : id === 'wife' ? gender === 'male' : true)).map(id => (
                        <div key={id} className="p-8 bg-slate-950 rounded-[3rem] border border-white/5 flex flex-col gap-8 shadow-xl">
                          <div className={`flex flex-col ${isRTL ? 'items-end' : 'items-start'}`}>
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-tight">{HEIR_DATA[id][lang]}</span>
                            <span className="text-[14px] font-bold text-blue-400 mt-1 arabic" dir="rtl">{HEIR_DATA[id].ar}</span>
                            <span className="text-[9px] font-medium text-slate-600 italic uppercase">{HEIR_DATA[id].term}</span>
                          </div>
                          <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <button onClick={() => updateHeir(id, -1)} className="p-3 bg-slate-900 rounded-xl hover:bg-slate-800 transition-all active:scale-90"><Minus size={16}/></button>
                            <span className="text-3xl font-black text-white">{inputs[id] || 0}</span>
                            <button onClick={() => updateHeir(id, 1)} className="p-3 bg-slate-900 rounded-xl hover:bg-slate-800 transition-all active:scale-90"><Plus size={16}/></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <button onClick={() => setResults(runInheritanceEngine(inputs, estate))} className="w-full bg-blue-600 py-10 rounded-[3rem] font-black uppercase tracking-[0.4em] text-2xl shadow-2xl hover:bg-blue-500 transition-all active:scale-[0.98] mb-20">{t.runEngine}</button>
              </div>
            ) : (
              <div className="space-y-12 pb-24">
                <div className={`flex justify-between items-center border-b border-white/10 pb-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <h2 className="text-4xl font-black uppercase tracking-tighter text-blue-400">Results</h2>
                  <button onClick={() => setResults(null)} className={`p-4 bg-slate-900 rounded-2xl border border-white/10 text-slate-400 hover:text-white flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${isRTL ? 'flex-row-reverse' : ''}`}><RefreshCcw size={16}/> {t.back}</button>
                </div>

                {/* PINPOINT SECTION */}
                {(results.awl || results.radd) && (
                  <div className={`p-8 rounded-[2.5rem] border-2 flex items-center gap-6 animate-pulse shadow-2xl ${isRTL ? 'flex-row-reverse text-right' : ''} ${results.awl ? 'bg-purple-600/10 border-purple-500/50' : 'bg-cyan-600/10 border-cyan-500/50'}`}>
                    {results.awl ? <TrendingDown size={48} className="text-purple-400"/> : <TrendingUp size={48} className="text-cyan-400"/>}
                    <div>
                      <h3 className={`text-2xl font-black uppercase tracking-tight ${results.awl ? 'text-purple-400' : 'text-cyan-400'}`}>{results.awl ? t.awlTitle : t.raddTitle}</h3>
                      <p className="text-sm text-slate-300 font-medium">{results.awl ? t.awlDesc : t.raddDesc}</p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {results.winners.map((r: any) => (
                    <div key={r.id} className={`p-10 bg-slate-900/40 rounded-[4rem] border-2 relative overflow-hidden shadow-2xl ${isRTL ? 'text-right' : ''} ${r.highlight === 'purple' ? 'border-purple-500/40' : r.highlight === 'cyan' ? 'border-cyan-500/40' : r.highlight === 'amber' ? 'border-amber-500/40' : 'border-white/5'}`}>
                      <div className={`absolute top-0 ${isRTL ? 'left-0 rounded-br-[2rem]' : 'right-0 rounded-bl-[2rem]'} px-6 py-2 ${r.highlight === 'purple' ? 'bg-purple-500' : r.highlight === 'cyan' ? 'bg-cyan-500' : r.highlight === 'amber' ? 'bg-amber-400' : 'bg-blue-600'} text-slate-900 font-black text-[10px] uppercase tracking-widest`}>
                        {r.highlight === 'purple' ? 'Awl' : r.highlight === 'cyan' ? 'Radd' : r.highlight === 'amber' ? 'Asabah' : 'Fixed'}
                      </div>
                      <h4 className="text-3xl font-black mb-1 text-white tracking-tight">{r[lang]}</h4>
                      <p className="text-[11px] text-slate-500 font-bold uppercase mb-4 tracking-[0.2em]">{r.term} | <span className="arabic">{r.ar}</span></p>
                      <div className={`flex justify-between items-baseline mb-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className="text-5xl font-black text-blue-400 tracking-tighter">{r.f}</span>
                        <span className="text-sm font-black text-slate-500 tracking-widest">{r.p.toFixed(1)}%</span>
                      </div>
                      <div className="bg-slate-950/60 p-6 rounded-3xl border border-white/5 mb-8">
                         <span className={`text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 flex items-center gap-2 mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}><MessageSquare size={12}/> {t.basisLabel}</span>
                         <p className="text-xs text-slate-300 leading-relaxed font-medium italic leading-relaxed">{lang === 'ml' ? r.reasonMl : lang === 'ar' ? r.reasonAr : r.reasonEn}</p>
                      </div>
                      {estate > 0 && <div className="pt-8 border-t border-white/5"><span className="text-4xl font-black text-white">₹{r.amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span></div>}
                    </div>
                  ))}
                </div>

                {results.losers.length > 0 && (
                  <div className="space-y-8 animate-fade-in">
                    <h3 className={`text-4xl font-black uppercase text-rose-500 flex items-center gap-6 tracking-tighter ${isRTL ? 'flex-row-reverse' : ''}`}><Ghost size={40}/> {t.mahjubTitle}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 opacity-60 grayscale">
                      {results.losers.map((l: any) => (
                        <div key={l.id} className={`p-10 bg-slate-950/40 rounded-[3rem] border border-rose-500/20 transition-all hover:grayscale-0 hover:opacity-100 ${isRTL ? 'text-right' : ''}`}>
                           <h4 className="text-2xl font-black text-slate-300">{l[lang]}</h4>
                           <p className="text-[10px] font-black uppercase text-slate-600 mb-6">{l.term} | {l.ar}</p>
                           <div className="bg-rose-500/5 p-4 rounded-2xl border border-rose-500/10 text-xs text-rose-400 font-black uppercase tracking-widest">{t.blockedBy} {lang === 'ml' ? l.blockerNameMl : lang === 'ar' ? l.blockerNameAr : l.blockerNameEn}</div>
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
             <div className="bg-slate-900/40 p-12 lg:p-16 rounded-[4rem] border border-white/10 shadow-2xl text-center"><Wallet size={80} className="text-emerald-400 mx-auto mb-8"/><h2 className="text-6xl font-black uppercase tracking-tighter mb-4">Nisab Engine</h2><p className="text-slate-500 font-black tracking-[0.4em] uppercase text-xs">Shafi'i Zakah Standards</p></div>
          </div>
        )}
      </main>

      {/* Mobile Nav */}
      <nav className={`lg:hidden fixed bottom-0 left-0 right-0 bg-slate-950/95 backdrop-blur-2xl border-t border-white/10 flex justify-around items-center py-5 z-50 shadow-2xl ${isRTL ? 'flex-row-reverse' : ''}`}>
        {[{ id: Page.Home, icon: <HomeIcon size={24}/>, label: t.home }, { id: Page.Inheritance, icon: <Calculator size={24}/>, label: t.inheritance }, { id: Page.Zakah, icon: <Wallet size={24}/>, label: t.zakath }].map(item => (
          <button key={item.id} onClick={() => { setPage(item.id); setResults(null); }} className={`flex flex-col items-center space-y-1.5 px-4 py-1 rounded-2xl transition-all active:scale-95 ${page === item.id ? 'text-blue-400 bg-blue-400/5' : 'text-slate-500'}`}>
            {item.icon} <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

const rootEl = document.getElementById('root');
if (rootEl) {
  const root = createRoot(rootEl);
  root.render(<App />);
}
