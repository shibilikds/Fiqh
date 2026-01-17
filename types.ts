
// Types and enums for the Fiqh Hub application
export enum Page {
  Home = 'home',
  ZakahCalc = 'zakah-calc',
  ZakahRules = 'zakah-rules',
  InheritanceCalc = 'inheritance-calc',
  InheritanceAmount = 'inheritance-amount',
  InheritanceRules = 'inheritance-rules',
  Charts = 'charts',
  About = 'about'
}

export enum School {
  SHAFI = 'shafi',
  HANAFI = 'hanafi',
  MALIKI = 'maliki',
  HANBALI = 'hanbali'
}

export enum Language {
  EN = 'en',
  ML = 'ml',
  AR = 'ar'
}

// All possible heirs for the engine
export interface HeirInput {
  [key: string]: number;
  husband?: number;
  wife?: number;
  sons?: number;
  daughters?: number;

  father?: number;
  mother?: number;
  grandSons?: number;
  grandDaughters?: number;
  pGrandfather?: number;
  pGrandmother?: number;
  mGrandmother?: number;
  fullBrothers?: number;
  fullSisters?: number;
  consBrothers?: number; // Consanguine
  consSisters?: number;
  uterBrothers?: number; // Uterine
  uterSisters?: number;

  // Added based on user request for more heirs
  fullBrotherSon?: number;
  consBrotherSon?: number; // Paternal half-brother's son
  fullPaternalUncle?: number;
  consPaternalUncle?: number; // Father's consanguine brother
  fullPaternalUncleSon?: number;
  consPaternalUncleSon?: number;
  maleEmancipator?: number;
  femaleEmancipator?: number;
}


export interface ShareResult {
  id: string;
  name: string;
  count: number;
  shareType: 'Fard' | 'Asabah' | 'Mahjub' | 'Residue';
  baseFraction: string;
  finalFraction: string;
  percentage: number;
  amount?: number;
  reason: string;
  blockedBy?: string;
  blockerName?: string;
  isRaddRecipient?: boolean;
}

export interface CalculationResult {
  winners: ShareResult[];
  losers: ShareResult[];
  awl: boolean;
  radd: boolean;
  asl: number;
  finalAsl: number;
}


// Metal Prices
export interface MetalPrices {
  gold: number;
  silver: number;
}

// Zakah Calculation Inputs
export interface ZakahInputs {
  goldGrams: number;
  silverGrams: number;
  cash: number;
  businessStock: number;
  businessCash: number;
  receivables: number;
}

// Zakah Calculation Result breakdown
export interface ZakahResultItem {
  eligible: boolean;
  zakah: number;
  zakatableValue: number;
  nisabValue: number;
}

export interface ZakahResult {
  gold: ZakahResultItem;
  silver: ZakahResultItem;
  cash: ZakahResultItem;
  business: ZakahResultItem;
  total: number;
}
