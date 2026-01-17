
// Service to handle metal price data
import { MetalPrices } from '../types';

export const NISAB_GOLD_GRAMS = 85;
export const NISAB_SILVER_GRAMS = 595;

// Using a reliable, public, key-less API from goldsilverprice.in for live metal prices in INR.
const API_URL = 'https://api.goldsilverprice.in/v1/price';

export const fetchMetalPrices = async (): Promise<MetalPrices> => {
  try {
    const response = await fetch(API_URL);
    
    if (!response.ok) {
      console.error(`API request failed with status ${response.status}, using fallback values.`);
      return { gold: 6250, silver: 80 }; // Fallback prices
    }
    
    const data = await response.json();
    
    const goldPrice = data.gold_price_gram;
    const silverPrice = data.silver_price_gram;
    
    if (typeof goldPrice !== 'number' || typeof silverPrice !== 'number') {
        console.error('Invalid data format from metal price API, using fallback values.');
        return { gold: 6250, silver: 80 };
    }
    
    return { gold: goldPrice, silver: silverPrice };
  } catch (error) {
    console.error('Error fetching metal prices:', error);
    // In case of a network error or other exception, return fallback prices.
    return { gold: 6250, silver: 80 };
  }
};
