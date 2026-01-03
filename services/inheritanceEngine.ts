
import { HeirInput, ShareResult, School } from '../types';

/**
 * MULTI-MADHHAB INHERITANCE ENGINE
 * Logic refined for Shafi'i, Hanafi, Maliki, and Hanbali.
 */
export const calculateInheritance = (inputs: HeirInput, totalAmount?: number, school: School = School.SHAFI): ShareResult[] => {
  const results: ShareResult[] = [];
  const hasSons = inputs.sons > 0;
  const hasDaughters = inputs.daughters > 0;
  const hasChildren = hasSons || hasDaughters;
  
  let totalSharesNum = 0;
  const commonDenominator = 24;

  // 1. SPONSAL SHARES
  if (inputs.husband) {
    const val = hasChildren ? 6 : 12;
    results.push({
      name: 'Husband',
      fraction: hasChildren ? '1/4' : '1/2',
      percentage: (val / 24) * 100,
      description: `Fixed share for the husband (${hasChildren ? 'reduced' : 'full'}).`
    });
    totalSharesNum += val;
  } else if (inputs.wife > 0) {
    const val = hasChildren ? 3 : 6;
    results.push({
      name: inputs.wife > 1 ? `Wives (${inputs.wife})` : 'Wife',
      fraction: hasChildren ? '1/8' : '1/4',
      percentage: (val / 24) * 100,
      description: `Collective share for the ${inputs.wife > 1 ? 'wives' : 'wife'}.`
    });
    totalSharesNum += val;
  }

  // 2. MOTHER'S SHARE
  if (inputs.mother) {
    const hasSiblings = (inputs.fullBrothers + inputs.fullSisters) >= 2;
    const val = (hasChildren || hasSiblings) ? 4 : 8;
    results.push({
      name: 'Mother',
      fraction: (hasChildren || hasSiblings) ? '1/6' : '1/3',
      percentage: (val / 24) * 100,
      description: (hasChildren || hasSiblings) ? 'Reduced to 1/6 due to existence of children or multiple siblings.' : 'Full 1/3 share.'
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
        description: 'Fixed 1/6 share due to male descendants.'
      });
      totalSharesNum += 4;
    } else if (hasDaughters) {
      results.push({
        name: 'Father',
        fraction: '1/6 + Residue',
        percentage: (4 / 24) * 100, 
        description: 'Takes 1/6 fixed portion plus any residue as an agnate.'
      });
      totalSharesNum += 4;
    } else {
      // Father takes entire residue if no children
      // We'll calculate residue later
    }
  }

  // 4. DAUGHTERS (FIXED PORTION) - Only if NO Sons exist
  if (hasDaughters && !hasSons) {
    const val = inputs.daughters === 1 ? 12 : 16;
    results.push({
      name: inputs.daughters > 1 ? `Daughters (${inputs.daughters})` : 'Daughter',
      fraction: inputs.daughters === 1 ? '1/2' : '2/3',
      percentage: (val / 24) * 100,
      description: 'Fixed scriptural share for daughters.'
    });
    totalSharesNum += val;
  }

  // HANDLE 'AWL (Proportional Reduction) - Accepted by all 4 schools
  if (totalSharesNum > commonDenominator) {
    const newDenominator = totalSharesNum;
    results.forEach(r => {
      const originalNum = (r.percentage / 100) * 24;
      r.percentage = (originalNum / newDenominator) * 100;
    });
  }

  // 5. CALCULATE RESIDUE (ASABA)
  let distributedPercentage = results.reduce((acc, r) => acc + r.percentage, 0);
  let remainder = Math.max(0, 100 - distributedPercentage);
  
  if (remainder > 0) {
    if (hasSons) {
      // Sons and Daughters share the residue in a 2:1 ratio
      const ratioParts = (inputs.sons * 2) + inputs.daughters;
      const partValue = remainder / ratioParts;
      
      results.push({
        name: inputs.sons > 1 ? `Sons (${inputs.sons})` : 'Son',
        fraction: 'Residue (2:1)',
        percentage: (partValue * 2) * inputs.sons,
        description: `Agnatic residue shared with daughters. Individual Son: ${(partValue * 2).toFixed(2)}%.`
      });

      if (hasDaughters) {
        results.push({
          name: inputs.daughters > 1 ? `Daughters (${inputs.daughters})` : 'Daughter',
          fraction: 'Residue (2:1)',
          percentage: (partValue * 1) * inputs.daughters,
          description: `Agnatic residue shared with sons. Individual Daughter: ${(partValue).toFixed(2)}%.`
        });
      }
      remainder = 0;
    } else if (inputs.father) {
      const fatherRes = results.find(r => r.name === 'Father');
      if (fatherRes) {
        fatherRes.percentage += remainder;
      } else {
        results.push({
          name: 'Father',
          fraction: 'Residue',
          percentage: remainder,
          description: 'Takes the entire residue as the closest male agnate.'
        });
      }
      remainder = 0;
    } else {
      // RADD (Return) Logic
      const canRadd = school === School.HANAFI || school === School.HANBALI;
      if (canRadd) {
        // Return to non-spouse heirs
        const bloodHeirs = results.filter(r => !['Husband', 'Wife'].some(s => r.name.includes(s)));
        if (bloodHeirs.length > 0) {
          const bloodWeight = bloodHeirs.reduce((acc, r) => acc + r.percentage, 0);
          bloodHeirs.forEach(bh => {
            const extra = (bh.percentage / bloodWeight) * remainder;
            bh.percentage += extra;
            bh.description += " Includes Radd (surplus return).";
          });
          remainder = 0;
        } else {
          // If only spouse, surplus goes to Bait al-Mal or back to spouse in some modern codes.
          // We'll stick to classical: Bait al-Mal.
          results.push({
            name: 'Public Treasury (Bait al-Mal)',
            fraction: 'Residue',
            percentage: remainder,
            description: 'Surplus residue stored for community welfare.'
          });
        }
      } else {
        // Shafi'i / Maliki position
        results.push({
          name: 'Public Treasury (Bait al-Mal)',
          fraction: 'Residue',
          percentage: remainder,
          description: 'Surplus residue; Shafi\'i/Maliki do not return surplus to spouses or relatives.'
        });
      }
    }
  }

  // Calculate final amounts
  if (totalAmount) {
    results.forEach(r => {
      r.amount = (r.percentage / 100) * totalAmount;
    });
  }

  return results;
};
