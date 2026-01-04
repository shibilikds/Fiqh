// Service to handle gold price data
import { GoldPrice } from '../types';

export const NISAB_GOLD_GRAMS = 85;

export const fetchGoldPrice = async (): Promise<GoldPrice> => {
  // Simulating an API call to get live gold price in INR
  // In a real implementation, this would call an external financial API
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mocked price for demonstration (INR per gram of 24K gold)
      resolve({ price: 6250 });
    }, 500);
  });
};
