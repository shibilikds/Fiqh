
export enum Page {
  Home = 'home',
  InheritanceCalc = 'inheritance-calc',
  InheritanceAmount = 'inheritance-amount',
  ZakahCalc = 'zakah-calc',
  InheritanceRules = 'inheritance-rules',
  ZakahRules = 'zakah-rules',
  Charts = 'charts',
  About = 'about'
}

export enum School {
  SHAFI = 'shafi',
  HANAFI = 'hanafi',
  MALIKI = 'maliki',
  HANBALI = 'hanbali'
}

export interface HeirInput {
  husband: boolean;
  wife: number;
  father: boolean;
  mother: boolean;
  sons: number;
  daughters: number;
  fullBrothers: number;
  fullSisters: number;
}

export interface ShareResult {
  name: string;
  fraction: string;
  percentage: number;
  amount?: number;
  description: string;
}

export interface ZakahInputs {
  cash: number;
  goldWeight: number;
  silverWeight: number;
  businessAssets: number;
  debts: number;
}

export interface GoldPrice {
  price: number;
  currency: string;
  unit: string;
  timestamp: string;
}
