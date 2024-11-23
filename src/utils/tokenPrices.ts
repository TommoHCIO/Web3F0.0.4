import { Token } from './tokens';
import { priceService } from '../services/priceService';

// Update prices every minute
const priceUpdateInterval = setInterval(async () => {
  try {
    await priceService.ensureFreshPrices();
  } catch (error) {
    console.error('Error updating token prices:', error);
  }
}, 60000);

// Cleanup interval on module unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    clearInterval(priceUpdateInterval);
  });
}

export function getTokenValue(amount: number, token: Token): number {
  const price = priceService.getPrice(token.symbol);
  
  // For SOL, convert from lamports to SOL (1 SOL = 1e9 lamports)
  if (token.symbol === 'SOL') {
    return (amount / Math.pow(10, token.decimals)) * price;
  }
  
  return amount * price;
}