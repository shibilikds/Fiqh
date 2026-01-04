
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { 
  Scale, Moon, Sparkles, Calculator, Wallet, ArrowLeft, Plus, Minus, Coins, Wheat, Beef, UserX, UserCheck, AlertCircle, Zap, BookOpen, AlertTriangle, CheckCircle2, RefreshCcw, FileText, Languages, Layers, ChevronRight, Info, Users, User, UserPlus
} from 'lucide-react';

// --- UTILS ---
const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
const lcm = (a: number, b: number): number => (a * b) / gcd(a, b);
const getLCMOfArray = (arr: number[]): number => arr.reduce((acc, val) => lcm(acc, val), 1);

// --- CONSTANTS ---
const GOLD_PRICE_FIXED = 13582;
const SILVER_PRICE_EST = 95;
const NISAB_GOLD = 85;
const NISAB_AGRI_KG = 652;

const TRANSLATIONS: any = {
  en: { 
    title: "Fiqh Hub", subtitle: "Shāfiʿī Jurisprudence Platform", home: "Home", inheritance: "Inheritance", zakath: "Zakah", faraid: "Fara'id", back: "Back", calculate: "Calculate", 
    estateValue: "Total Estate Value (INR)", estateTotal: "Estate Total", runEngine: "Run Engine", wajib: "Wajib (Payable)", exempt: "Exempt", share: "Share", perHead: "Per Individual", 
    blockedBy: "Blocked By", mahjub: "Mahjub", cashSavings: "Cash & Savings", goldWeight: "Gold Weight (g)", businessStock: "Trade Assets", silverWeight: "Silver (g)",
    agriTitle: "Agriculture (Ushr)", agriWeight: "Harvest (kg)", agriType: "Irrigation", rainFed: "Rain-fed (10%)", irrigated: "Irrigated (5%)",
    livestockTitle: "Livestock", sheepGoat: "Sheep/Goat", cattle: "Cattle", festGreeting: "Welcome to the Hub", festAction: "Enter Hub",
    mahjubTitle: "Excluded Relatives (Mahjub)",
    awlTitle: "Al-Awl (Increase) Detected",
    awlDesc: "The total of fixed shares exceeded the original denominator. Shares are proportionally reduced. Affected heirs are highlighted in Purple.",
    specialCaseTitle: "Special Jurisprudential Case",
    originalAsl: "Original Base",
    adjustedAsl: "Adjusted Base (Awl)",
    jabarTitle: "Jabar Masaala (Al-Jabariyyah)",
    jabarDesc: "The male relative compelled the female to become a residuary (Asabah) instead of having a fixed share. These heirs are highlighted in Amber below.",
    doubleCheckTitle: "Critical Verification",
    doubleCheckMsg: "Inheritance calculations are extremely sensitive in Fiqh. Please double-check the potential heir counts and the total estate. Are you sure you wish to continue?",
    confirmBtn: "Yes, Generate Results",
    cancelBtn: "No, Go Back",
    detailedSummary: "Detailed Methodology",
    methodologyDesc: "Breakdown of the Fiqh logic used for this specific case:",
    jabarTag: "Jabar Logic",
    awlTag: "Awl Adjusted",
    blockerTag: "Blocker (Hajib)",
    deceasedGender: "Gender of Deceased",
    male: "Male",
    female: "Female",
    maxLimit: "Limit Reached",
    cats: { 
      primary: "Primary Heirs",
      descendants: "Descendants", 
      ancestors: "Ancestors",
      siblings: "Siblings", 
      nephews: "Nephews", 
      uncles: "Paternal Uncles",
      cousins: "Cousins" 
    } 
  },
  ml: { 
    title: "ഫിഖ്ഹ് ഹബ്", subtitle: "ഷാഫിഈ കർമ്മശാസ്ത്രം", home: "ഹോം", inheritance: "അനന്തരാവകാശം", zakath: "സകാത്ത്", faraid: "ഫറാഇദ്", back: "പിന്നിലേക്ക്", calculate: "കണക്കാക്കുക", 
    estateValue: "സ്വത്ത് മൂല്യം", estateTotal: "ആകെ സ്വത്ത്", runEngine: "കണക്കുകൂട്ടുക", wajib: "നിർബന്ധം (വാജിബ്)", exempt: "നിസാബ് തികഞ്ഞില്ല", share: "വിഹിതം", perHead: "ഒരാൾക്ക്", 
    blockedBy: "തടഞ്ഞത്", mahjub: "ഹജ്ബ്", cashSavings: "പണം & നിക്ഷേപം", goldWeight: "സ്വർണ്ണം (ഗ്രാം)", businessStock: "ബിസിനസ്സ് സ്റ്റോക്ക്", silverWeight: "വെള്ളി (ഗ്രാം)",
    agriTitle: "കൃഷി (ഉശ്ര്)", agriWeight: "വിളവ് (കിലോ)", agriType: "നനയ്ക്കുന്ന രീതി", rainFed: "മഴവെള്ളം (10%)", irrigated: "നനയ്ക്കുന്നത് (5%)",
    livestockTitle: "കന്നുകാലികൾ", sheepGoat: "ആടുകൾ", cattle: "പശുക്കൾ", festGreeting: "ഫിഖ്ഹ് ഹബ്ബിലേക്ക് സ്വാഗതം", festAction: "പ്രവേശിക്കുക",
    mahjubTitle: "ഹജ്ബ് ചെയ്യപ്പെട്ടവർ (Mahjub)",
    awlTitle: "ഔൽ മസ്അല (Al-Awl)",
    awlDesc: "ആകെ ഓഹരികൾ അടിസ്ഥാന സംഖ്യയേക്കാൾ വർദ്ധിച്ചു. അതിനാൽ എല്ലാവർക്കും ആനുപാതികമായ കുറവ് ബാധകമാണ്. ബാധിക്കപ്പെട്ടവർ പർപ്പിൾ നിറത്തിൽ കാണാം.",
    specialCaseTitle: "പ്രത്യേക മസ്അല (Special Case)",
    originalAsl: "യഥാർത്ഥ അടിസ്ഥാനം",
    adjustedAsl: "ക്രമീകരിച്ചത് (ഔൽ)",
    jabarTitle: "ജബർ മസ്അല (Al-Jabariyyah)",
    jabarDesc: "ആൺ ബന്ധു പെൺ ബന്ധുവിനെ 'അസ്വബ'യാക്കി (Residue) മാറ്റിയ സാഹചര്യം. ഈ അവകാശികളെ താഴെ മഞ്ഞ നിറത്തിൽ (Amber Glow) ഹൈലൈറ്റ് ചെയ്തിരിക്കുന്നു.",
    doubleCheckTitle: "അതീവ ശ്രദ്ധിക്കുക!",
    doubleCheckMsg: "അനന്തരാവകാശ കണക്കുകൾ അതീവ സൂക്ഷ്മതയോടെ കൈകാര്യം ചെയ്യേണ്ടതാണ്. അവകാശികളുടെ എണ്ണവും സ്വത്ത് വിവരങ്ങളും കൃത്യമാണോ എന്ന് പരിശോധിക്കുക. കണക്ക് കാണണോ?",
    confirmBtn: "അതെ, ഫലം കാണിക്കുക",
    cancelBtn: "അല്ല, മാറ്റങ്ങൾ വരുത്തണം",
    detailedSummary: "വിശദമായ വിശകലനം",
    methodologyDesc: "ഈ കേസിൽ ഉപയോഗിച്ച ഫിഖ്ഹ് നിയമങ്ങളുടെ വിവരണം താഴെ നൽകുന്നു:",
    jabarTag: "ജബർ മസ്അല",
    awlTag: "ഔൽ മാറ്റം",
    blockerTag: "ഹാജിബ് (തടസ്സപ്പെടുത്തിയവർ)",
    deceasedGender: "മരണപ്പെട്ട വ്യക്തി",
    male: "പുരുഷൻ",
    female: "സ്ത്രീ",
    maxLimit: "പരിധി കഴിഞ്ഞു",
    cats: { 
      primary: "പ്രധാന അവകാശികൾ",
      descendants: "സന്താനങ്ങൾ", 
      ancestors: "മുൻഗാമികൾ",
      siblings: "സഹോദരങ്ങൾ", 
      nephews: "സഹോദര പുത്രന്മാർ", 
      uncles: "പിതൃ സഹോദരന്മാർ",
      cousins: "പിതൃസഹോദര പുത്രന്മാർ"
    } 
  }
};

const HEIR_DATA: any = {
  // Primary
  husband: { term: "Az-Zawj", en: "Husband", ml: "ഭർത്താവ്", rules: "1/2 or 1/4 (with children)", max: 1 },
  wife: { term: "Az-Zawjah", en: "Wife", ml: "ഭാര്യ", rules: "1/4 or 1/8 (with children)", max: 4 },
  father: { term: "Al-Ab", en: "Father", ml: "പിതാവ്", rules: "1/6, Residue, or both", max: 1 },
  mother: { term: "Al-Umm", en: "Mother", ml: "മാതാവ്", rules: "1/6 or 1/3", max: 1 },
  // Descendants
  sons: { term: "Al-Ibn", en: "Son", ml: "മകൻ", rules: "Residue (Asabah bi-Nafsihi)", max: 20 },
  daughters: { term: "Al-Bint", en: "Daughter", ml: "മകൾ", rules: "1/2, 2/3, or Residue with Son", max: 20 },
  grandsons: { term: "Ibn al-Ibn", en: "Grandson", ml: "മകന്റെ മകൻ", rules: "Residue, excluded by Son", max: 20 },
  granddaughters: { term: "Bint al-Ibn", en: "Granddaughter", ml: "മകന്റെ മകൾ", rules: "1/2, 2/3, 1/6, or Residue", max: 20 },
  greatGrandsons: { term: "Ibn Ibn al-Ibn", en: "Gt-Grandson", ml: "മകന്റെ മകന്റെ മകൻ", rules: "Residue", max: 20 },
  greatGranddaughters: { term: "Bint Ibn al-Ibn", en: "Gt-Granddaughter", ml: "മകന്റെ മകന്റെ മകൾ", rules: "Complex placement", max: 20 },
  // Ancestors
  grandfather: { term: "Al-Jadd", en: "Grandfather", ml: "പിതാമഹൻ", rules: "Excluded by Father", max: 1 },
  patGrandmother: { term: "Al-Jaddah Ab", en: "Pat. Grandma", ml: "പിതാവിന്റെ മാതാവ്", rules: "Excluded by Father/Mother", max: 1 },
  matGrandmother: { term: "Al-Jaddah Umm", en: "Mat. Grandma", ml: "മാതാവിന്റെ മാതാവ്", rules: "Excluded by Mother", max: 1 },
  greatGrandfather: { term: "Al-Jadd al-A'la", en: "Gt-Grandfather", ml: "പിതാവിന്റെ പിതാവ്", rules: "Excluded by closer males", max: 1 },
  // Siblings
  fullBrothers: { term: "Al-Akh Shaqiq", en: "Full Brother", ml: "സഹോദരൻ", rules: "Strongest sibling asabah", max: 20 },
  fullSisters: { term: "Al-Ukht Shaqiqah", en: "Full Sister", ml: "സഹോദരി", rules: "Fixed or Residue", max: 20 },
  patBrothers: { term: "Al-Akh Ab", en: "Pat. Brother", ml: "പിതൃ സഹോദരൻ", rules: "Excluded by Full Brother", max: 20 },
  patSisters: { term: "Al-Ukht Ab", en: "Pat. Sister", ml: "പിതൃ സഹോദരി", rules: "Excluded by Full Brother", max: 20 },
  matBrothers: { term: "Al-Akh Umm", en: "Mat. Brother", ml: "മാതൃ സഹോദരൻ", rules: "1/6 or 1/3 (share equally)", max: 20 },
  matSisters: { term: "Al-Ukht Umm", en: "Mat. Sister", ml: "മാതൃ സഹോദരി", rules: "1/6 or 1/3 (share equally)", max: 20 },
  // Nephews
  fullBroSon: { term: "Ibn al-Shaqiq", en: "Full Nephew", ml: "സഹോദര പുത്രൻ", rules: "Residue", max: 20 },
  patBroSon: { term: "Ibn al-Akh Ab", en: "Pat. Nephew", ml: "പിതൃ സഹോദര പുത്രൻ", rules: "Residue", max: 20 },
  fullBroGrs: { term: "Ibn Ibn Shaqiq", en: "Full Nephew Gs", ml: "സഹോദര പൗത്രൻ", rules: "Residue", max: 20 },
  patBroGrs: { term: "Ibn Ibn Akh Ab", en: "Pat. Nephew Gs", ml: "പിതൃ സഹോദര പൗത്രൻ", rules: "Residue", max: 20 },
  // Uncles
  fullPatUncle: { term: "Al-Amm Shaqiq", en: "Full P. Uncle", ml: "പിതൃ സഹോദരൻ (Shaqiq)", rules: "Residue", max: 20 },
  patUncle: { term: "Al-Amm Li-Ab", en: "Pat. P. Uncle", ml: "പിതൃ സഹോദരൻ (Ab)", rules: "Residue", max: 20 },
  // Cousins
  fullPatUncleSon: { term: "Ibn al-Amm Shaqiq", en: "Full Cousin", ml: "പിതൃ സഹോദര പുത്രൻ", rules: "Residue", max: 20 },
  patUncleSon: { term: "Ibn al-Amm Ab", en: "Pat. Cousin", ml: "പിതൃ സഹോദര പുത്രൻ (Ab)", rules: "Residue", max: 20 },
  fullPatUncleGrs: { term: "Ibn Ibn Amm", en: "Cousin's Son", ml: "പിതൃ സഹോദര പൗത്രൻ", rules: "Residue", max: 20 }
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

const runInheritanceEngine = (inputs: any, estate: number) => {
  const h = (id: string) => inputs[id] || 0;
  let rawResults: { id: string, num?: number, den?: number, type: 'fixed' | 'asabah' | 'jabar', p?: number, f?: string, note?: string, highlight?: 'amber' | 'purple' | 'indigo' }[] = [];
  let exclusions: any[] = [];
  let blockers = new Set<string>();
  let logicML: string[] = [];
  let logicEN: string[] = [];
  
  const addExcl = (id: string, blocker: string) => { 
    if (h(id) > 0) {
      exclusions.push({ id, blockedBy: HEIR_DATA[blocker].term });
      blockers.add(blocker);
      logicML.push(`${HEIR_DATA[id].ml} ഹജ്ബ് ചെയ്യപ്പെട്ടു (${HEIR_DATA[blocker].ml} ഉള്ളതിനാൽ).`);
      logicEN.push(`${HEIR_DATA[id].en} is excluded (Mahjub) because of ${HEIR_DATA[blocker].en}.`);
    }
  };
  
  const hasDesc = (h('sons') > 0 || h('daughters') > 0 || h('grandsons') > 0 || h('granddaughters') > 0 || h('greatGrandsons') > 0 || h('greatGranddaughters') > 0);
  const hasMaleDesc = (h('sons') > 0 || h('grandsons') > 0 || h('greatGrandsons') > 0);
  const sibCount = h('fullBrothers') + h('fullSisters') + h('patBrothers') + h('patSisters') + h('matBrothers') + h('matSisters');

  // Blocking logic (Hierarchy of 29)
  if (h('sons') > 0) ['grandsons', 'granddaughters', 'greatGrandsons', 'greatGranddaughters'].forEach(id => addExcl(id, 'sons'));
  if (h('grandsons') > 0) ['greatGrandsons', 'greatGranddaughters'].forEach(id => addExcl(id, 'grandsons'));
  
  if (h('father') > 0) {
    ['grandfather', 'greatGrandfather', 'patGrandmother', 'fullBrothers', 'fullSisters', 'patBrothers', 'patSisters', 'matBrothers', 'matSisters', 'fullBroSon', 'patBroSon', 'fullBroGrs', 'patBroGrs', 'fullPatUncle', 'patUncle', 'fullPatUncleSon', 'patUncleSon', 'fullPatUncleGrs'].forEach(id => addExcl(id, 'father'));
  }
  if (h('mother') > 0) ['patGrandmother', 'matGrandmother'].forEach(id => addExcl(id, 'mother'));
  if (hasMaleDesc) ['fullBrothers', 'fullSisters', 'patBrothers', 'patSisters', 'matBrothers', 'matSisters', 'fullBroSon', 'patBroSon', 'fullBroGrs', 'patBroGrs', 'fullPatUncle', 'patUncle', 'fullPatUncleSon', 'patUncleSon', 'fullPatUncleGrs'].forEach(id => addExcl(id, h('sons') > 0 ? 'sons' : 'grandsons'));

  // Sibling blocking
  if (h('fullBrothers') > 0) ['patBrothers', 'patSisters', 'fullBroSon', 'patBroSon', 'fullBroGrs', 'patBroGrs', 'fullPatUncle', 'patUncle', 'fullPatUncleSon', 'patUncleSon', 'fullPatUncleGrs'].forEach(id => addExcl(id, 'fullBrothers'));
  if (h('patBrothers') > 0) ['fullBroSon', 'patBroSon', 'fullBroGrs', 'patBroGrs', 'fullPatUncle', 'patUncle', 'fullPatUncleSon', 'patUncleSon', 'fullPatUncleGrs'].forEach(id => addExcl(id, 'patBrothers'));

  const active = { ...inputs }; exclusions.forEach(e => active[e.id] = 0);

  // Assignment Logic
  if (active.husband) {
    const d = hasDesc ? 4 : 2;
    rawResults.push({ id: 'husband', num: 1, den: d, type: 'fixed' });
  } else if (active.wife > 0) {
    const d = hasDesc ? 8 : 4;
    rawResults.push({ id: 'wife', num: 1, den: d, type: 'fixed' });
  }

  if (active.mother) {
    const d = (hasDesc || sibCount >= 2) ? 6 : 3;
    rawResults.push({ id: 'mother', num: 1, den: d, type: 'fixed' });
  }

  if (active.father && hasMaleDesc) {
    rawResults.push({ id: 'father', num: 1, den: 6, type: 'fixed' });
  }

  // Daughters and Granddaughters
  if (active.daughters > 0 && active.sons === 0) {
    const n = active.daughters === 1 ? 1 : 2;
    const d = active.daughters === 1 ? 2 : 3;
    rawResults.push({ id: 'daughters', num: n, den: d, type: 'fixed' });
  }

  // Maternal Siblings
  if ((active.matBrothers + active.matSisters) > 0) {
    const totalMat = active.matBrothers + active.matSisters;
    const n = totalMat === 1 ? 1 : 1;
    const d = totalMat === 1 ? 6 : 3;
    if (active.matBrothers > 0) rawResults.push({ id: 'matBrothers', num: n, den: d, type: 'fixed' });
    if (active.matSisters > 0) rawResults.push({ id: 'matSisters', num: n, den: d, type: 'fixed' });
  }

  // Common denominator calculation
  const denominators = rawResults.map(r => r.den || 1);
  const baseAsl = denominators.length > 0 ? getLCMOfArray(denominators) : 1;
  let totalFixedUnits = 0;
  rawResults.forEach(r => totalFixedUnits += (baseAsl / (r.den || 1)) * (r.num || 0));
  let finalAsl = Math.max(baseAsl, totalFixedUnits);
  const isAwl = totalFixedUnits > baseAsl;

  rawResults = rawResults.map(r => ({
    ...r,
    p: (((baseAsl / (r.den || 1)) * (r.num || 0)) / finalAsl) * 100,
    f: `${r.num}/${r.den}`,
    highlight: isAwl ? 'purple' : undefined
  }));

  // Residue (Asabah)
  let residueUnits = finalAsl - totalFixedUnits;
  let hasJabar = false;
  if (residueUnits > 0) {
    const asabahOrder = ['sons', 'grandsons', 'greatGrandsons', 'father', 'grandfather', 'fullBrothers', 'patBrothers', 'fullBroSon', 'patBroSon', 'fullBroGrs', 'patBroGrs', 'fullPatUncle', 'patUncle', 'fullPatUncleSon', 'patUncleSon', 'fullPatUncleGrs'];
    let topAgnate = asabahOrder.find(id => active[id] > 0);
    
    if (topAgnate) {
      const partners: any = { 'sons':'daughters', 'grandsons':'granddaughters', 'fullBrothers':'fullSisters', 'patBrothers':'patSisters' };
      const pId = partners[topAgnate];
      if (pId && active[pId] > 0) {
        hasJabar = true;
        const totalAgnateUnits = (active[topAgnate] * 2 + active[pId]);
        const shareMale = (residueUnits / finalAsl * (2/totalAgnateUnits)) * 100;
        const shareFemale = (residueUnits / finalAsl * (1/totalAgnateUnits)) * 100;
        rawResults.push({ id: topAgnate, f: 'Asabah (Jabar)', p: shareMale * active[topAgnate], type: 'jabar', highlight: 'amber' });
        rawResults.push({ id: pId, f: 'Asabah (Jabar)', p: shareFemale * active[pId], type: 'jabar', highlight: 'amber' });
      } else {
        rawResults.push({ id: topAgnate, f: 'Asabah', p: (residueUnits / finalAsl) * 100, type: 'asabah' });
      }
    }
  }

  return { 
    awl: { occurred: isAwl, originalAsl: baseAsl, newAsl: finalAsl },
    hasJabar,
    hasExclusion: blockers.size > 0,
    logicML,
    logicEN,
    winners: rawResults.map(r => ({ ...r, ...HEIR_DATA[r.id], amount: estate ? ((r.p || 0)/100)*estate : 0 })), 
    losers: exclusions.map(e => ({ ...e, ...HEIR_DATA[e.id] })) 
  };
};

const App = () => {
  const [state, setState] = useState<any>({
    page: 'splash', lang: 'en', inheritanceInputs: {}, estate: 0, inheritanceResults: null,
    deceasedGender: 'male',
    isConfirming: false, detailLang: 'ml',
    zakahInputs: { cash: 0, gold: 0, silver: 0, business: 0, agriWeight: 0, agriType: 'rainFed', sheepGoat: 0, cattle: 0 },
    zakahRes: null
  });

  const t = TRANSLATIONS[state.lang];
  const isAr = state.lang === 'ar';
  const setPage = (p: string) => setState((s: any) => ({ ...s, page: p, inheritanceResults: null, isConfirming: false }));
  const setLang = (l: string) => setState((s: any) => ({ ...s, lang: l }));

  const calculateInheritance = () => {
    setState((s: any) => ({ ...s, inheritanceResults: runInheritanceEngine(s.inheritanceInputs, s.estate), isConfirming: false }));
  };

  const calculateZakah = () => {
    const zi = state.zakahInputs;
    const wealthTotal = zi.cash + (zi.gold * GOLD_PRICE_FIXED) + (zi.silver * SILVER_PRICE_EST) + (zi.business);
    const nisabReached = wealthTotal >= (NISAB_GOLD * GOLD_PRICE_FIXED);
    const res = {
      wealth: { payable: nisabReached ? wealthTotal * 0.025 : 0, reached: nisabReached, total: wealthTotal },
      agri: { payable: zi.agriWeight >= NISAB_AGRI_KG ? zi.agriWeight * (zi.agriType === 'rainFed' ? 0.1 : 0.05) : 0, weight: zi.agriWeight },
      livestock: [] as string[]
    };
    if (zi.sheepGoat >= 40) res.livestock.push(`${Math.floor(zi.sheepGoat/40)} Sheep/Goat`);
    setState((s: any) => ({ ...s, zakahRes: res }));
  };

  const updateHeirCount = (id: string, delta: number) => {
    const current = state.inheritanceInputs[id] || 0;
    const max = HEIR_DATA[id]?.max || 20;
    const nextValue = Math.max(0, Math.min(max, current + delta));
    setState((s: any) => ({ ...s, inheritanceInputs: { ...s.inheritanceInputs, [id]: nextValue } }));
  };

  const setDeceasedGender = (g: 'male' | 'female') => {
    // Clear impossible heirs
    const newInputs = { ...state.inheritanceInputs };
    if (g === 'male') delete newInputs.husband;
    else delete newInputs.wife;
    setState((s: any) => ({ ...s, deceasedGender: g, inheritanceInputs: newInputs }));
  };

  if (state.page === 'splash') {
    return (
      <div className="fixed inset-0 bg-[#020617] flex flex-col items-center justify-center p-6 overflow-hidden">
        <div className="absolute inset-0 star-field opacity-20"></div>
        <div className="relative z-10 text-center space-y-16 animate-fade-in">
          <div className="space-y-4">
            <h2 className="text-amber-400 text-sm font-black uppercase tracking-[0.5em]">Bismillah</h2>
            <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter uppercase leading-none">{t.festGreeting}</h1>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">{t.subtitle}</p>
          </div>
          <div className="flex bg-slate-900/40 p-1.5 rounded-2xl border border-white/10 inline-flex">
            {['en','ml'].map(l => (
              <button key={l} onClick={() => setLang(l)} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${state.lang === l ? 'bg-amber-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}>{l}</button>
            ))}
          </div>
          <button onClick={() => setPage('home')} className="group px-12 py-6 bg-transparent rounded-full font-black uppercase tracking-[0.4em] text-white border border-amber-400 hover:shadow-[0_0_50px_rgba(251,191,36,0.3)] transition-all">
            {t.festAction}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col ${isAr ? 'arabic text-right' : ''}`}>
      <header className="bg-slate-900/60 backdrop-blur-xl border-b border-white/10 p-4 lg:p-6 sticky top-0 z-50 flex justify-between items-center">
        <div onClick={() => setPage('home')} className="flex items-center gap-4 cursor-pointer group">
          <Scale className="text-blue-400 group-hover:rotate-12 transition-transform" />
          <h1 className="font-black text-xl lg:text-2xl tracking-tighter uppercase">{t.title}</h1>
        </div>
        <div className="flex bg-slate-950 p-1 rounded-xl border border-white/5">
          {['en','ml'].map(l => (
            <button key={l} onClick={() => setLang(l)} className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase ${state.lang === l ? 'bg-blue-600 text-white' : 'text-slate-500'}`}>{l}</button>
          ))}
        </div>
      </header>

      <main className="flex-grow w-full max-w-7xl mx-auto p-4 lg:p-8">
        {state.page === 'home' && (
          <div className="space-y-12 animate-fade-in py-10">
            <div className="text-center">
              <div className="inline-block p-10 bg-blue-600/10 rounded-[3.5rem] mb-8 border border-blue-400/20 shadow-2xl"><Scale size={60} className="text-blue-400" /></div>
              <h1 className="text-5xl lg:text-7xl font-black tracking-tighter uppercase">{t.title}</h1>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-400 mt-4">{t.subtitle}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <button onClick={() => setPage('inheritance')} className="p-10 lg:p-16 glass-card rounded-[2.5rem] hover:border-blue-400 transition-all text-left group">
                <Calculator size={32} className="mb-6 text-blue-400 group-hover:scale-110 transition-transform" />
                <h3 className="text-2xl lg:text-3xl font-black uppercase">{t.inheritance}</h3>
                <p className="text-[9px] text-slate-500 font-bold uppercase mt-2">29 Heirs Support Engine</p>
              </button>
              <button onClick={() => setPage('zakath')} className="p-10 lg:p-16 glass-card rounded-[2.5rem] hover:border-emerald-400 transition-all text-left group">
                <Wallet size={32} className="mb-6 text-emerald-400 group-hover:scale-110 transition-transform" />
                <h3 className="text-2xl lg:text-3xl font-black uppercase">{t.zakath}</h3>
                <p className="text-[9px] text-slate-500 font-bold uppercase mt-2">Nisab Tracking System</p>
              </button>
            </div>
          </div>
        )}

        {state.page === 'inheritance' && (
          <div className="space-y-10 animate-fade-in">
            <div className="flex items-center gap-4">
              <button onClick={() => setPage('home')} className="p-3 bg-slate-900 border border-white/10 rounded-xl"><ArrowLeft size={18}/></button>
              <h2 className="text-3xl font-black uppercase tracking-tighter">{t.inheritance}</h2>
            </div>
            
            {state.isConfirming && (
              <div className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-6">
                <div className="max-w-md w-full glass-card p-10 rounded-[2.5rem] border-rose-500/30 space-y-8 animate-in zoom-in duration-300">
                   <div className="flex flex-col items-center text-center space-y-4">
                      <div className="p-5 bg-rose-500/10 rounded-full border border-rose-500/20 text-rose-500">
                        <AlertTriangle size={40} />
                      </div>
                      <h3 className="text-2xl font-black uppercase tracking-tight text-rose-400">{t.doubleCheckTitle}</h3>
                      <p className="text-slate-400 font-medium text-xs leading-relaxed">{t.doubleCheckMsg}</p>
                   </div>
                   <div className="flex flex-col gap-3">
                     <button onClick={calculateInheritance} className="w-full bg-blue-600 py-5 rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-3">
                       <CheckCircle2 size={20} /> {t.confirmBtn}
                     </button>
                     <button onClick={() => setState((s: any) => ({ ...s, isConfirming: false }))} className="w-full bg-slate-900 py-5 rounded-xl font-black uppercase tracking-widest text-slate-500 text-xs border border-white/5">
                       {t.cancelBtn}
                     </button>
                   </div>
                </div>
              </div>
            )}

            {!state.inheritanceResults ? (
              <div className="glass-card rounded-[2.5rem] p-8 lg:p-12 space-y-12 shadow-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block text-center md:text-left">{t.estateValue}</label>
                    <input type="number" onChange={e => setState((s: any) => ({ ...s, estate: Number(e.target.value) }))} className="w-full p-6 bg-slate-950 border border-white/10 rounded-[1.5rem] text-4xl font-black text-center text-white outline-none focus:ring-2 focus:ring-blue-500/20" placeholder="0.00" />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block text-center md:text-left">{t.deceasedGender}</label>
                    <div className="flex bg-slate-950 p-2 rounded-[1.5rem] border border-white/10 gap-2">
                      <button onClick={() => setDeceasedGender('male')} className={`flex-1 py-4 rounded-xl font-black uppercase text-xs flex items-center justify-center gap-2 transition-all ${state.deceasedGender === 'male' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-400'}`}>
                        <User size={16} /> {t.male}
                      </button>
                      <button onClick={() => setDeceasedGender('female')} className={`flex-1 py-4 rounded-xl font-black uppercase text-xs flex items-center justify-center gap-2 transition-all ${state.deceasedGender === 'female' ? 'bg-rose-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-400'}`}>
                        <User size={16} /> {t.female}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-10">
                  {HEIR_CATEGORIES.map(cat => (
                    <div key={cat.id} className="space-y-4">
                      <div className="flex items-center gap-3 px-2">
                        <ChevronRight size={14} className="text-blue-400" />
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-300">{t.cats[cat.id]}</h3>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {cat.heirs
                          .filter(id => (state.deceasedGender === 'male' && id !== 'husband') || (state.deceasedGender === 'female' && id !== 'wife') || (id !== 'husband' && id !== 'wife'))
                          .map(id => {
                            const val = state.inheritanceInputs[id] || 0;
                            const max = HEIR_DATA[id]?.max || 20;
                            const isMax = val >= max;
                            const isPrimary = cat.id === 'primary';
                            
                            return (
                              <div key={id} className={`p-5 rounded-[1.5rem] border flex flex-col gap-3 transition-all ${isPrimary ? 'bg-blue-900/10 border-blue-500/20 shadow-blue-500/5' : 'bg-slate-950/50 border-white/5'} hover:border-blue-500/40`}>
                                <div className="flex justify-between items-start">
                                  <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase text-white leading-tight">{(HEIR_DATA as any)[id][state.lang]}</span>
                                    {max < 20 && <span className="text-[7px] font-bold text-slate-500 uppercase mt-1">Max {max}</span>}
                                  </div>
                                  <Info size={10} className="text-slate-700" title={HEIR_DATA[id].rules} />
                                </div>
                                <div className="flex justify-between items-center">
                                  <button onClick={() => updateHeirCount(id, -1)} className="p-2 bg-slate-900 rounded-lg border border-white/5 text-slate-500 hover:text-white transition-colors"><Minus size={14}/></button>
                                  <div className="flex flex-col items-center">
                                    <span className={`font-black text-xl ${isMax && max < 20 ? 'text-blue-400' : 'text-white'}`}>{val}</span>
                                  </div>
                                  <button onClick={() => updateHeirCount(id, 1)} disabled={isMax} className={`p-2 bg-slate-900 rounded-lg border border-white/5 transition-colors ${isMax ? 'opacity-20 cursor-not-allowed' : 'text-slate-500 hover:text-white'}`}><Plus size={14}/></button>
                                </div>
                                {isMax && max < 20 && <div className="text-center text-[7px] font-black uppercase text-blue-500 tracking-widest">{t.maxLimit}</div>}
                              </div>
                            );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
                
                <button onClick={() => setState((s: any) => ({ ...s, isConfirming: true }))} className="w-full bg-blue-600 py-8 rounded-[1.5rem] font-black uppercase tracking-widest text-xl shadow-2xl hover:bg-blue-500 transition-all active:scale-[0.98]">{t.runEngine}</button>
              </div>
            ) : (
              <div className="space-y-10 pb-20">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3 text-blue-400">
                    <UserCheck /> {t.faraid} Results
                  </h3>
                  <button onClick={() => setState((s: any) => ({ ...s, inheritanceResults: null }))} className="flex items-center gap-2 text-[9px] font-black uppercase text-slate-500 hover:text-white transition-colors">
                    <RefreshCcw size={12} /> Recalculate
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {state.inheritanceResults.awl.occurred && (
                    <div className="p-6 bg-purple-500/10 border border-purple-500/30 rounded-[1.5rem] flex items-start gap-4 animate-fade-in relative overflow-hidden">
                      <Layers className="text-purple-400 shrink-0" size={24} />
                      <div className="space-y-1">
                        <h4 className="text-sm font-black uppercase tracking-tight text-purple-400">{t.awlTitle}</h4>
                        <p className="text-[10px] text-slate-400 leading-relaxed">{t.awlDesc}</p>
                      </div>
                    </div>
                  )}
                  {state.inheritanceResults.hasJabar && (
                    <div className="p-6 bg-amber-500/10 border border-amber-500/30 rounded-[1.5rem] flex items-start gap-4 animate-fade-in relative overflow-hidden">
                      <Zap className="text-amber-500 shrink-0" size={24} />
                      <div className="space-y-1">
                        <h4 className="text-sm font-black uppercase tracking-tight text-amber-500">{t.jabarTitle}</h4>
                        <p className="text-[10px] text-slate-400 leading-relaxed">{t.jabarDesc}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
                  {state.inheritanceResults.winners.map((r: any) => {
                    const hType = r.highlight;
                    const borderClass = hType === 'amber' ? 'border-amber-400 bg-amber-400/5' : 
                                      hType === 'purple' ? 'border-purple-500 bg-purple-500/5' : 
                                      'border-blue-400/20 hover:border-blue-400/40';
                    const tagLabel = hType === 'amber' ? t.jabarTag : hType === 'purple' ? t.awlTag : null;
                    const tagColor = hType === 'amber' ? 'bg-amber-400' : hType === 'purple' ? 'bg-purple-500' : '';
                    const count = state.inheritanceInputs[r.id] || 1;

                    return (
                      <div key={r.id} className={`p-6 glass-card rounded-[1.5rem] flex flex-col transition-all relative overflow-hidden border-2 ${borderClass}`}>
                        {tagLabel && (
                          <div className={`absolute top-0 right-0 px-2 py-1 ${tagColor} text-slate-900 font-black text-[7px] uppercase tracking-widest rounded-bl-xl z-20`}>
                            {tagLabel}
                          </div>
                        )}
                        <div className="flex justify-between mb-4">
                          <div className="flex flex-col">
                            <span className={`font-black text-lg tracking-tighter ${hType === 'amber' ? 'text-amber-400' : hType === 'purple' ? 'text-purple-300' : 'text-white'}`}>{r[state.lang]}</span>
                            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">({r.term})</span>
                          </div>
                          <div className="text-right">
                            <span className={`text-2xl font-black ${hType === 'amber' ? 'text-amber-400' : hType === 'purple' ? 'text-purple-400' : 'text-blue-400'}`}>{r.f || 'Asabah'}</span>
                            <div className="text-[9px] text-slate-500 font-bold uppercase">{(r.p || 0).toFixed(2)}%</div>
                          </div>
                        </div>
                        {state.estate > 0 && (
                          <div className="mt-auto pt-4 border-t border-white/5 flex flex-col gap-2">
                            <div className="flex justify-between items-baseline">
                              <span className="text-[8px] font-black text-slate-500 uppercase">{t.share}:</span>
                              <span className={`text-xl font-black ${hType === 'amber' ? 'text-amber-400' : hType === 'purple' ? 'text-purple-200' : 'text-white'}`}>₹{r.amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                            </div>
                            {count > 1 && (
                              <div className="flex justify-between items-center px-3 py-1.5 bg-white/5 rounded-lg border border-white/5">
                                <span className="text-[7px] font-black text-slate-500 uppercase">{t.perHead} ({count}):</span>
                                <span className="text-[10px] font-black text-blue-400">₹{(r.amount / count).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {state.inheritanceResults.losers.length > 0 && (
                  <div className="space-y-6 pt-10 border-t border-white/10">
                    <h3 className="text-xl font-black uppercase tracking-tighter flex items-center gap-3 text-slate-500"><UserX className="text-rose-500" /> {t.mahjubTitle}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {state.inheritanceResults.losers.map((r: any) => (
                        <div key={r.id} className="p-5 glass-card border-rose-500/10 rounded-[1.5rem] flex flex-col mahjub-card">
                          <span className="font-black text-base text-slate-300 tracking-tighter">{r[state.lang]}</span>
                          <div className="mt-auto pt-3 border-t border-white/5 font-black text-[8px] text-rose-400 uppercase tracking-widest">{t.blockedBy}: {r.blockedBy}</div>
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
          <div className="space-y-12 animate-fade-in">
             <div className="flex items-center gap-4">
              <button onClick={() => setPage('home')} className="p-3 bg-slate-900 border border-white/10 rounded-xl"><ArrowLeft size={18}/></button>
              <h2 className="text-3xl font-black uppercase tracking-tighter">{t.zakath}</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="glass-card p-10 rounded-[2.5rem] space-y-10 shadow-2xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{t.cashSavings}</label>
                      <input type="number" onChange={e => setState((s: any) => ({ ...s, zakahInputs: { ...s.zakahInputs, cash: Number(e.target.value) } }))} className="w-full p-4 bg-slate-950 rounded-xl border border-white/5 text-white font-black outline-none focus:ring-2 focus:ring-blue-500/20" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{t.goldWeight}</label>
                      <input type="number" onChange={e => setState((s: any) => ({ ...s, zakahInputs: { ...s.zakahInputs, gold: Number(e.target.value) } }))} className="w-full p-4 bg-slate-950 rounded-xl border border-white/5 text-white font-black outline-none focus:ring-2 focus:ring-blue-500/20" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{t.businessStock}</label>
                      <input type="number" onChange={e => setState((s: any) => ({ ...s, zakahInputs: { ...s.zakahInputs, business: Number(e.target.value) } }))} className="w-full p-4 bg-slate-950 rounded-xl border border-white/5 text-white font-black outline-none focus:ring-2 focus:ring-blue-500/20" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{t.silverWeight}</label>
                      <input type="number" onChange={e => setState((s: any) => ({ ...s, zakahInputs: { ...s.zakahInputs, silver: Number(e.target.value) } }))} className="w-full p-4 bg-slate-950 rounded-xl border border-white/5 text-white font-black outline-none focus:ring-2 focus:ring-blue-500/20" />
                   </div>
                </div>
                <button onClick={calculateZakah} className="w-full bg-blue-600 py-6 rounded-xl font-black uppercase text-lg shadow-2xl hover:bg-blue-500 transition-all active:scale-[0.98]">{t.calculate}</button>
              </div>
              {state.zakahRes && (
                <div className="p-10 glass-card rounded-[2.5rem] bg-emerald-600/5 border-emerald-400/20 shadow-2xl flex flex-col justify-center text-center animate-in zoom-in">
                   <span className="text-xs font-black text-emerald-400 uppercase tracking-[0.3em] block mb-4">Payable Zakah</span>
                   <h3 className="text-5xl lg:text-7xl font-black text-white tracking-tighter">₹{state.zakahRes.wealth.payable.toLocaleString()}</h3>
                   {!state.zakahRes.wealth.reached && (
                     <p className="text-[10px] text-rose-400 font-bold uppercase mt-4 tracking-widest">Nisab not reached</p>
                   )}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);
