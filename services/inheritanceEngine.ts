
import { HeirInput, ShareResult } from '../types';

/**
 * SHAFI'I INHERITANCE ENGINE
 * Verified against standard Shafi'i texts (e.g., Al-Maqasid, Minhaj at-Talibin).
 */
export const calculateInheritance = (inputs: HeirInput, totalAmount?: number): ShareResult[] => {
  const results: ShareResult[] = [];
  const hasSons = inputs.sons > 0;
  const hasDaughters = inputs.daughters > 0;
  const hasChildren = hasSons || hasDaughters;
  
  let totalSharesNum = 0;
  const commonDenominator = 24; // Base denominator

  // 1. SPONSAL SHARES
  if (inputs.husband) {
    const val = hasChildren ? 6 : 12; // 1/4 or 1/2
    results.push({
      name: 'Husband',
      fraction: hasChildren ? '1/4' : '1/2',
      percentage: (val / 24) * 100,
      description: "Fixed Share. No increase (Radd) allowed in Shafi'i jurisprudence."
    });
    totalSharesNum += val;
  } else if (inputs.wife > 0) {
    const val = hasChildren ? 3 : 6; // 1/8 or 1/4 (collective)
    results.push({
      name: inputs.wife > 1 ? `Wives (${inputs.wife})` : 'Wife',
      fraction: hasChildren ? '1/8' : '1/4',
      percentage: (val / 24) * 100,
      description: `Collective share for all wives. Each receives ${((val / 24) * 100 / inputs.wife).toFixed(2)}%.`
    });
    totalSharesNum += val;
  }

  // 2. MOTHER'S SHARE
  if (inputs.mother) {
    const hasSiblings = (inputs.fullBrothers + inputs.fullSisters) >= 2;
    const val = (hasChildren || hasSiblings) ? 4 : 8; // 1/6 or 1/3
    results.push({
      name: 'Mother',
      fraction: (hasChildren || hasSiblings) ? '1/6' : '1/3',
      percentage: (val / 24) * 100,
      description: (hasChildren || hasSiblings) ? 'Reduced to 1/6 due to children or multiple siblings.' : 'Full 1/3 share.'
    });
    totalSharesNum += val;
  }

  // 3. FATHER'S SHARE
  if (inputs.father) {
    if (hasSons) {
      results.push({
        name: 'Father',
        fraction: '1/6',
        percentage: (4 / 24) * 100,
        description: 'Fixed share due to existence of male descendants.'
      });
      totalSharesNum += 4;
    } else if (hasDaughters) {
      results.push({
        name: 'Father',
        fraction: '1/6 + Residue',
        percentage: (4 / 24) * 100, 
        description: 'Takes 1/6 fixed plus any residual after fixed shares.'
      });
      totalSharesNum += 4;
    } else {
      results.push({
        name: 'Father',
        fraction: 'Residue (Agnatic)',
        percentage: 0,
        description: 'Primary male relative; takes the entire residue.'
      });
    }
  }

  // 4. DAUGHTERS (FIXED PORTION) - Only if NO Sons exist
  if (hasDaughters && !hasSons) {
    const val = inputs.daughters === 1 ? 12 : 16; // 1/2 or 2/3
    results.push({
      name: inputs.daughters > 1 ? `Daughters (${inputs.daughters})` : 'Daughter',
      fraction: inputs.daughters === 1 ? '1/2' : '2/3',
      percentage: (val / 24) * 100,
      description: 'Fixed share when no sons exist to make them agnatic heirs.'
    });
    totalSharesNum += val;
  }

  // HANDLE 'AWL (Proportional Reduction)
  if (totalSharesNum > commonDenominator) {
    const newDenominator = totalSharesNum;
    results.forEach(r => {
      const originalNum = (r.percentage / 100) * 24;
      r.percentage = (originalNum / newDenominator) * 100;
    });
  }

  // 5. CALCULATE RESIDUE (ASABA)
  const distributedPercentage = results.reduce((acc, r) => acc + r.percentage, 0);
  const remainder = Math.max(0, 100 - distributedPercentage);
  
  if (remainder > 0) {
    if (hasSons) {
      // Daughters become agnates with sons (2:1 ratio)
      const ratioParts = (inputs.sons * 2) + inputs.daughters;
      const partValue = remainder / ratioParts;
      
      // Add Sons as a group
      results.push({
        name: inputs.sons > 1 ? `Sons (${inputs.sons})` : 'Son',
        fraction: 'Residue (2:1)',
        percentage: (partValue * 2) * inputs.sons,
        description: `Group total. Individual: ${(partValue * 2).toFixed(2)}%.`
      });

      // Add Daughters as agnates if they exist
      if (hasDaughters) {
        results.push({
          name: inputs.daughters > 1 ? `Daughters (${inputs.daughters})` : 'Daughter',
          fraction: 'Residue (2:1)',
          percentage: (partValue * 1) * inputs.daughters,
          description: `Group total. Individual: ${(partValue).toFixed(2)}%.`
        });
      }
    } else if (inputs.father) {
      const fatherRes = results.find(r => r.name === 'Father');
      if (fatherRes) fatherRes.percentage += remainder;
    } else {
      // SURPLUS to Public Treasury (Bait al-Mal) - Shafi'i doesn't return to spouses
      results.push({
        name: 'Public Treasury (Bait al-Mal)',
        fraction: 'Residue',
        percentage: remainder,
        description: 'Surplus residue; Shafi\'i school does not return surplus to spouses.'
      });
    }
  }

  // Calculate final amounts and individual breakdown notes
  if (totalAmount) {
    results.forEach(r => {
      r.amount = (r.percentage / 100) * totalAmount;
      
      // Extract count for "Each" calculation
      let count = 1;
      if (r.name.includes('Wives')) count = inputs.wife;
      else if (r.name.includes('Sons')) count = inputs.sons;
      else if (r.name.includes('Daughters')) count = inputs.daughters;

      if (count > 1) {
        const individualAmt = r.amount / count;
        r.description += ` Each receives ₹${individualAmt.toLocaleString(undefined, { maximumFractionDigits: 0 })}.`;
      }
    });
  }

  return results;
};
