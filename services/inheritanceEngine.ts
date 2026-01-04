// Core engine for calculating Islamic inheritance (Fara'id)
import { HeirInput, ShareResult, School } from '../types';

export const calculateInheritance = (
  inputs: HeirInput,
  totalAmount: number | undefined,
  school: School
): ShareResult[] => {
  const results: ShareResult[] = [];
  const hasOffspring = inputs.sons > 0 || inputs.daughters > 0;
  
  // 1. Calculate Primary Fixed Shares (Dhu al-Furud)
  
  // Spouse
  if (inputs.husband) {
    const fraction = hasOffspring ? "1/4" : "1/2";
    const percentage = hasOffspring ? 25 : 50;
    results.push({
      name: "Husband",
      fraction,
      percentage,
      description: hasOffspring ? "Reduced share due to children" : "Full share for husband"
    });
  } else if (inputs.wife > 0) {
    const fraction = hasOffspring ? "1/8" : "1/4";
    const percentage = hasOffspring ? 12.5 : 25;
    results.push({
      name: inputs.wife > 1 ? "Wives" : "Wife",
      fraction,
      percentage,
      description: hasOffspring ? "Reduced share due to children" : "Full share for wife/wives"
    });
  }

  // Parents
  if (inputs.mother) {
    const fraction = hasOffspring ? "1/6" : "1/3";
    const percentage = hasOffspring ? 16.67 : 33.33;
    results.push({
      name: "Mother",
      fraction,
      percentage,
      description: hasOffspring ? "Reduced share due to children" : "Standard share"
    });
  }
  
  if (inputs.father) {
    // Father's share logic can vary; simplified here
    const fraction = "1/6";
    const percentage = 16.67;
    results.push({
      name: "Father",
      fraction,
      percentage,
      description: "Standard fixed share for father"
    });
  }

  // 2. Calculate Residue (Asaba)
  const distributedSoFar = results.reduce((sum, r) => sum + (r.percentage / 100), 0);
  let residue = 1 - distributedSoFar;

  if (residue > 0) {
    if (inputs.sons > 0 || inputs.daughters > 0) {
      // Residuary children (2:1 ratio)
      const totalUnits = (inputs.sons * 2) + inputs.daughters;
      if (inputs.sons > 0) {
        results.push({
          name: "Sons",
          fraction: "Residue",
          percentage: (residue * (inputs.sons * 2 / totalUnits)) * 100,
          description: "Residuary share (2 parts per son)"
        });
      }
      if (inputs.daughters > 0) {
        results.push({
          name: "Daughters",
          fraction: "Residue",
          percentage: (residue * (inputs.daughters / totalUnits)) * 100,
          description: "Residuary share (1 part per daughter)"
        });
      }
    } else if (inputs.fullBrothers > 0 || inputs.fullSisters > 0) {
      // Collateral residuaries
      const totalUnits = (inputs.fullBrothers * 2) + inputs.fullSisters;
      if (inputs.fullBrothers > 0) {
        results.push({
          name: "Full Brothers",
          fraction: "Residue",
          percentage: (residue * (inputs.fullBrothers * 2 / totalUnits)) * 100,
          description: "Residuary collateral share"
        });
      }
      if (inputs.fullSisters > 0) {
        results.push({
          name: "Full Sisters",
          fraction: "Residue",
          percentage: (residue * (inputs.fullSisters / totalUnits)) * 100,
          description: "Residuary collateral share"
        });
      }
    } else {
      // Radd (Return) logic for schools that allow it
      const allowsRadd = school === School.HANAFI || school === School.HANBALI;
      if (allowsRadd) {
        const raddHeirs = results.filter(r => r.name !== "Husband" && !r.name.includes("Wife"));
        if (raddHeirs.length > 0) {
          const totalWeight = raddHeirs.reduce((sum, r) => sum + r.percentage, 0);
          raddHeirs.forEach(r => {
            const extra = (r.percentage / totalWeight) * (residue * 100);
            r.percentage += extra;
            r.description += " (Incl. Radd)";
          });
        } else {
          results.push({ name: "Treasury", fraction: "Residue", percentage: residue * 100, description: "Surplus to state" });
        }
      } else {
        results.push({ name: "Public Treasury (Bait al-Mal)", fraction: "Residue", percentage: residue * 100, description: "Surplus returned to the community" });
      }
    }
  }

  // Apply total estate amount if provided
  if (totalAmount !== undefined) {
    results.forEach(res => {
      res.amount = (res.percentage / 100) * totalAmount;
    });
  }

  return results;
};
