import axios from 'axios';
import { Decimal } from 'decimal.js';

interface CoinGeckoResponse {
  solana: {
    usd: number;
  };
  tether: {
    usd: number;
  };
  'usd-coin': {
    usd: number;
  };
  'binancecoin': {
    usd: number;
  };
}

const COINGECKO_API = 'https://api.coingecko.com/api/v3';
const COINGECKO_API_KEY = 'CG-9QVahLj32NHR3iQ6qobb8beJ';

const COIN_IDS = {
  'SOL': 'solana',
  'USDT': 'tether',
  'USDC': 'usd-coin',
  'BNB': 'binancecoin'
};

const FALLBACK_PRICES = {
  'SOL': 100,
  'USDT': 1,
  'USDC': 1,
  'BNB': 300
};

class PriceService {
  private static instance: PriceService;
  private prices: Map<string, number>;
  private lastUpdate: number;
  private readonly cacheDuration = 60000; // 1 minute
  private updating: boolean = false;

  private constructor() {
    this.prices = new Map(Object.entries(FALLBACK_PRICES));
    this.lastUpdate = 0;
  }

  public static getInstance(): PriceService {
    if (!PriceService.instance) {
      PriceService.instance = new PriceService();
    }
    return PriceService.instance;
  }

  public getPrices(): Record<string, number> {
    return Object.fromEntries(this.prices);
  }

  public getPrice(symbol: string): number {
    return this.prices.get(symbol) || FALLBACK_PRICES[symbol] || 0;
  }

  private async fetchPrices(): Promise<void> {
    if (this.updating) return;
    this.updating = true;

    try {
      const response = await axios.get<CoinGeckoResponse>(
        `${COINGECKO_API}/simple/price`,
        {
          params: {
            ids: Object.values(COIN_IDS).join(','),
            vs_currencies: 'usd',
            x_cg_demo_api_key: COINGECKO_API_KEY
          },
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          timeout: 5000
        }
      );

      if (response.data) {
        // Update prices for each token
        Object.entries(COIN_IDS).forEach(([symbol, id]) => {
          const price = response.data[id]?.usd;
          if (price) {
            // Use Decimal.js for precise number handling
            const decimal = new Decimal(price);
            this.prices.set(symbol, decimal.toNumber());
          }
        });

        this.lastUpdate = Date.now();
      }
    } catch (error) {
      console.error('Error fetching prices:', error);
      // Keep existing prices or use fallbacks
      Object.keys(FALLBACK_PRICES).forEach(symbol => {
        if (!this.prices.has(symbol)) {
          this.prices.set(symbol, FALLBACK_PRICES[symbol]);
        }
      });
    } finally {
      this.updating = false;
    }
  }

  public async ensureFreshPrices(): Promise<Record<string, number>> {
    if (Date.now() - this.lastUpdate < this.cacheDuration) {
      return this.getPrices();
    }

    await this.fetchPrices();
    return this.getPrices();
  }
}

export const priceService = PriceService.getInstance();

export async function getTokenPrices(): Promise<Record<string, number>> {
  return priceService.ensureFreshPrices();
}