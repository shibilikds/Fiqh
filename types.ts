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

export interface GoldPrice {
  price: number;
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
