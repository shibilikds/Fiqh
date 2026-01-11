
import { HeirInput, CalculationResult, School, ShareResult, Language } from '../types';
import { t } from './translations';

const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
const lcm = (a: number, b: number): number => (a * b) / gcd(a, b);
const getLCMOfArray = (arr: number[]): number => arr.length === 0 ? 1 : arr.reduce((acc, val) => lcm(acc, val), 1);

export const calculateInheritance = (
  inputs: HeirInput,
  totalAmount: number | undefined,
  school: School,
  language: Language,
): CalculationResult => {
  const h = (id: string) => inputs[id] || 0;
  let rawResults: any[] = [];
  let exclusions: any[] = [];
  
  const addExcl = (id: string, blockerId: string) => { 
    if (h(id) > 0 && !exclusions.some(e => e.id === id)) {
      exclusions.push({ id, blockedBy: blockerId });
    }
  };
  
  // --- Heir Presence & Counts ---
  const hasDesc = (h('sons') + h('daughters') + h('grandSons') + h('grandDaughters')) > 0;
  const hasMaleDesc = (h('sons') + h('grandSons')) > 0;
  const allSibCount = (h('fullBrothers') + h('fullSisters') + h('consBrothers') + h('consSisters') + h('uterBrothers') + h('uterSisters'));
  const uterSibCount = h('uterBrothers') + h('uterSisters');

  // --- Blocking (Hajb) Logic ---
  const active = { ...inputs };
  
  const distantAgnates = ['fullBrotherSon', 'consBrotherSon', 'fullPaternalUncle', 'consPaternalUncle', 'fullPaternalUncleSon', 'consPaternalUncleSon'];
  const emancipators = ['maleEmancipator', 'femaleEmancipator'];

  // Blocking Priority
  if (h('sons') > 0) {
    ['grandSons', 'grandDaughters', 'fullBrothers', 'fullSisters', 'consBrothers', 'consSisters', 'uterBrothers', 'uterSisters', ...distantAgnates, ...emancipators].forEach(id => addExcl(id, 'sons'));
  }
  if (h('grandSons') > 0) {
     ['fullBrothers', 'fullSisters', 'consBrothers', 'consSisters', ...distantAgnates, ...emancipators].forEach(id => addExcl(id, 'grandSons'));
  }
  if (h('father') > 0) {
    ['pGrandfather', 'fullBrothers', 'fullSisters', 'consBrothers', 'consSisters', 'uterBrothers', 'uterSisters', ...distantAgnates, ...emancipators, 'pGrandmother'].forEach(id => addExcl(id, 'father'));
  }
  if (h('pGrandfather') > 0) {
     ['fullBrothers', 'fullSisters', 'consBrothers', 'consSisters', ...distantAgnates, ...emancipators].forEach(id => addExcl(id, 'pGrandfather'));
  }
  if (h('fullBrothers') > 0) {
    ['consBrothers', 'consSisters', ...distantAgnates, ...emancipators].forEach(id => addExcl(id, 'fullBrothers'));
  }
  if (h('consBrothers') > 0) {
     ['fullBrotherSon', 'consBrotherSon', ...distantAgnates.slice(2), ...emancipators].forEach(id => addExcl(id, 'consBrothers'));
  }
   if (h('fullSisters') > 0 && h('daughters') > 0) { // Asabah ma'a al-ghayr
    ['consBrothers', 'consSisters', ...distantAgnates, ...emancipators].forEach(id => addExcl(id, 'fullSisters'));
  }
  if (h('fullBrotherSon') > 0) {
    ['consBrotherSon', ...distantAgnates.slice(2), ...emancipators].forEach(id => addExcl(id, 'fullBrotherSon'));
  }
  if (h('consBrotherSon') > 0) {
    [...distantAgnates.slice(2), ...emancipators].forEach(id => addExcl(id, 'consBrotherSon'));
  }
  if (h('fullPaternalUncle') > 0) {
    ['consPaternalUncle', 'fullPaternalUncleSon', 'consPaternalUncleSon', ...emancipators].forEach(id => addExcl(id, 'fullPaternalUncle'));
  }
  if (h('consPaternalUncle') > 0) {
    ['fullPaternalUncleSon', 'consPaternalUncleSon', ...emancipators].forEach(id => addExcl(id, 'consPaternalUncle'));
  }
  if (h('fullPaternalUncleSon') > 0) {
    ['consPaternalUncleSon', ...emancipators].forEach(id => addExcl(id, 'fullPaternalUncleSon'));
  }
  if (h('consPaternalUncleSon') > 0) {
    emancipators.forEach(id => addExcl(id, 'consPaternalUncleSon'));
  }
  
  if (hasDesc || h('father') > 0 || h('pGrandfather') > 0) {
      ['uterBrothers', 'uterSisters'].forEach(id => addExcl(id, hasDesc ? 'daughters' : 'father'));
  }
  if (h('mother') > 0) ['pGrandmother', 'mGrandmother'].forEach(id => addExcl(id, 'mother'));
  
  exclusions.forEach(e => active[e.id] = 0);
  const hActive = (id: string) => active[id] || 0;

  // --- 1. Fixed Shares (Furud) Assignment ---
  if (hActive('husband') > 0) rawResults.push({ id: 'husband', num: 1, den: hasDesc ? 4 : 2, reasonKey: hasDesc ? "reason.hasDesc" : "reason.noDesc" });
  if (hActive('wife') > 0) rawResults.push({ id: 'wife', num: 1, den: hasDesc ? 8 : 4, reasonKey: hasDesc ? "reason.hasDesc" : "reason.noDesc" });
  if (hActive('mother') > 0) rawResults.push({ id: 'mother', num: 1, den: (hasDesc || allSibCount >= 2) ? 6 : 3, reasonKey: (hasDesc || allSibCount >= 2) ? "reason.hasDescOrSibs" : "reason.noDescOrSibs" });
  if (hActive('father') > 0 && hasMaleDesc) rawResults.push({ id: 'father', num: 1, den: 6, reasonKey: "reason.hasMaleDesc" });
  if (hActive('pGrandfather') > 0 && hasMaleDesc) rawResults.push({ id: 'pGrandfather', num: 1, den: 6, reasonKey: "reason.hasMaleDesc" });
  if (hActive('daughters') > 0 && hActive('sons') === 0) rawResults.push({ id: 'daughters', num: hActive('daughters') === 1 ? 1 : 2, den: hActive('daughters') === 1 ? 2 : 3, reasonKey: hActive('daughters') === 1 ? "reason.singleDaughter" : "reason.multiDaughters" });
  if (uterSibCount > 0) rawResults.push({ id: 'uterSiblings', num: 1, den: uterSibCount === 1 ? 6 : 3, reasonKey: uterSibCount === 1 ? "reason.uterSingle" : "reason.uterMulti" });
  if (hActive('fullSisters') > 0 && hActive('fullBrothers') === 0 && !hasDesc) rawResults.push({ id: 'fullSisters', num: hActive('fullSisters') === 1 ? 1 : 2, den: hActive('fullSisters') === 1 ? 2 : 3, reasonKey: hActive('fullSisters') === 1 ? "reason.fullSisterSingle" : "reason.fullSisterMulti" });
  if (hActive('consSisters') > 0 && hActive('consBrothers') === 0 && !hasDesc && hActive('fullBrothers') === 0) {
    if (hActive('fullSisters') === 0) rawResults.push({ id: 'consSisters', num: hActive('consSisters') === 1 ? 1 : 2, den: hActive('consSisters') === 1 ? 2 : 3, reasonKey: hActive('consSisters') === 1 ? "reason.consSisterSingle" : "reason.consSisterMulti" });
    else if (hActive('fullSisters') === 1) rawResults.push({ id: 'consSisters', num: 1, den: 6, reasonKey: "reason.consSisterWithFull" });
  }

  // --- 2. Sum Shares & Determine Case ---
  const baseAsl = getLCMOfArray(rawResults.map(r => r.den || 1));
  let totalUnits = rawResults.reduce((sum, r) => sum + (baseAsl / r.den) * r.num, 0);
  
  const hasAsabah = ['sons', 'father', 'pGrandfather', 'grandSons', 'fullBrothers', 'consBrothers', ...distantAgnates, ...emancipators].some(id => hActive(id) > 0 && !((id === 'father' || id === 'pGrandfather') && hasMaleDesc)) || (hActive('daughters') > 0 && (hActive('fullSisters') > 0 || hActive('consSisters') > 0));
  const isAwl = totalUnits > baseAsl;
  const isRadd = totalUnits < baseAsl && !hasAsabah;

  let intermediate = rawResults.map(r => ({ ...r, weight: (baseAsl / r.den) * r.num }));
  let finalAsl = isAwl ? totalUnits : baseAsl;
  let finalWinners: any[] = [];

  if (isRadd) {
    const spouse = intermediate.find(r => ['husband', 'wife'].includes(r.id));
    if (spouse) {
      finalWinners.push({ ...spouse, finalWeight: spouse.weight, isRaddRecipient: false });
      const raddHeirs = intermediate.filter(r => !['husband', 'wife'].includes(r.id));
      const raddHeirUnits = raddHeirs.reduce((sum, r) => sum + r.weight, 0);
      const residueForRadd = baseAsl - spouse.weight;
      raddHeirs.forEach(r => {
        finalWinners.push({ ...r, finalWeight: (r.weight / raddHeirUnits) * residueForRadd, isRaddRecipient: true });
      });
    } else {
      finalAsl = totalUnits;
      intermediate.forEach(r => finalWinners.push({ ...r, finalWeight: r.weight, isRaddRecipient: true }));
    }
  } else {
    intermediate.forEach(r => finalWinners.push({ ...r, finalWeight: r.weight }));
  }
  
  let residueUnits = finalAsl - totalUnits;
  if (!isAwl && !isRadd && residueUnits > 0) {
    let asabahAdded = false;
    const addAsabah = (id: string, reasonKey: string) => { finalWinners.push({ id, weight: residueUnits, reasonKey, isAsabah: true }); asabahAdded = true; };
    const addAsabahBilGhayr = (maleId: string, femaleId: string, reasonKey: string) => {
        const maleCount = hActive(maleId), femaleCount = hActive(femaleId);
        const totalParts = (maleCount * 2) + femaleCount;
        if(hActive(maleId)>0) finalWinners.push({ id: maleId, weight: residueUnits * (maleCount * 2) / totalParts, reasonKey, isAsabah: true });
        finalWinners = finalWinners.filter(w => w.id !== femaleId);
        if(hActive(femaleId)>0) finalWinners.push({ id: femaleId, weight: residueUnits * femaleCount / totalParts, reasonKey, isAsabah: true });
        asabahAdded = true;
    };
    if (hActive('sons') > 0) addAsabahBilGhayr('sons', 'daughters', "reason.asabahSon");
    else if (hActive('grandSons') > 0) addAsabahBilGhayr('grandSons', 'grandDaughters', "reason.asabahGrandson");
    else if (hActive('father') > 0 && !hasMaleDesc) addAsabah('father', "reason.asabahFather");
    else if (hActive('pGrandfather') > 0 && !hasMaleDesc) addAsabah('pGrandfather', "reason.asabahPGrandfather");
    else if (hActive('fullBrothers') > 0) addAsabahBilGhayr('fullBrothers', 'fullSisters', "reason.asabahFullBrother");
    else if (hActive('consBrothers') > 0) addAsabahBilGhayr('consBrothers', 'consSisters', "reason.asabahConsBrother");
    else if (hActive('fullSisters') > 0 && hActive('daughters') > 0) addAsabah('fullSisters', "reason.asabahFullSister");
    else if (hActive('consSisters') > 0 && hActive('daughters') > 0) addAsabah('consSisters', "reason.asabahConsSister");
    else if (hActive('fullBrotherSon') > 0) addAsabah('fullBrotherSon', "reason.asabahFullBrotherSon");
    else if (hActive('consBrotherSon') > 0) addAsabah('consBrotherSon', "reason.asabahConsBrotherSon");
    else if (hActive('fullPaternalUncle') > 0) addAsabah('fullPaternalUncle', "reason.asabahFullPaternalUncle");
    else if (hActive('consPaternalUncle') > 0) addAsabah('consPaternalUncle', "reason.asabahConsPaternalUncle");
    else if (hActive('fullPaternalUncleSon') > 0) addAsabah('fullPaternalUncleSon', "reason.asabahFullPaternalUncleSon");
    else if (hActive('consPaternalUncleSon') > 0) addAsabah('consPaternalUncleSon', "reason.asabahConsPaternalUncleSon");
    else if (hActive('maleEmancipator') > 0) addAsabah('maleEmancipator', "reason.asabahMaleEmancipator");
    else if (hActive('femaleEmancipator') > 0) addAsabah('femaleEmancipator', "reason.asabahFemaleEmancipator");
    
    if (!asabahAdded) finalWinners.push({ id: 'baitAlMal', weight: residueUnits, reasonKey: "reason.baitAlMal", isAsabah: true });
  }

  const formatResult = (r: any): ShareResult => {
    const finalWeight = r.finalWeight ?? r.weight;
    const percentage = (finalWeight / finalAsl) * 100;
    const common = gcd(Math.round(finalWeight * 1000), Math.round(finalAsl * 1000));
    const finalFraction = `${Math.round(finalWeight * 1000 / common)}/${Math.round(finalAsl * 1000 / common)}`;
    const count = r.id === 'uterSiblings' ? uterSibCount : (h(r.id) || 1);
    
    return {
      id: r.id,
      name: t(`heir.${r.id}`, language),
      count,
      shareType: (r.isAsabah ? 'Asabah' : 'Fard') as 'Asabah' | 'Fard',
      baseFraction: r.num ? `${r.num}/${r.den}` : 'Residue',
      finalFraction: isAwl || isRadd ? finalFraction : (r.num ? `${r.num}/${r.den}` : 'Residue'),
      percentage,
      amount: totalAmount !== undefined ? (percentage / 100) * totalAmount : undefined,
      reason: t(r.reasonKey, language),
      isRaddRecipient: !!r.isRaddRecipient
    };
  };

  const losers: ShareResult[] = exclusions.map(e => {
    const blockerNameStr = t(`heir.${e.blockedBy}`, language);
    return {
      id: e.id,
      name: t(`heir.${e.id}`, language),
      count: h(e.id),
      shareType: 'Mahjub' as const,
      baseFraction: '-', finalFraction: '-', percentage: 0,
      reason: t('reason.blockedBy', language, { blockerName: blockerNameStr }),
      blockedBy: e.blockedBy,
      blockerName: blockerNameStr
    };
  });

  return { winners: finalWinners.map(formatResult), losers, awl: isAwl, radd: isRadd, asl: baseAsl, finalAsl };
};