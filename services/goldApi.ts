
import { GoldPrice } from '../types';

const API_KEY = 'goldapi-dnkmsmjyq5wle-io';
const API_URL = 'https://www.goldapi.io/api/XAU/INR';

/**
 * Fetches real-time gold price from GoldAPI.io
 * The Shafi'i Madhhab calculates Nisab based on 24K gold weight.
 */
export const fetchGoldPrice = async (): Promise<GoldPrice> => {
  try {
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'x-access-token': API_KEY,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();

    // GoldAPI returns 'price_gram_24k' for INR if available, 
    // otherwise we calculate from 'price' (which is per troy ounce).
    // 1 Troy Ounce = 31.1034768 grams.
    const pricePerGram = data.price_gram_24k || (data.price / 31.1034768);

    return {
      price: pricePerGram,
      currency: 'INR',
      unit: 'gram',
      timestamp: new Date().toLocaleDateString()
    };
  } catch (error) {
    console.error('Failed to fetch real-time gold price:', error);
    // Fallback to a sensible default if API fails (approximate recent market rate)
    return {
      price: 7950.00,
      currency: 'INR',
      unit: 'gram',
      timestamp: `${new Date().toLocaleDateString()} (Estimated)`
    };
  }
};

/**
 * NISAB STANDARDS
 * The Shafi'i Madhhab uses 85g of 24K gold for the Nisab of wealth.
 */
export const NISAB_GOLD_GRAMS = 85;
