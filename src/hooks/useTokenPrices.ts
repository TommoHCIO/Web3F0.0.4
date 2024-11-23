import { useState, useEffect, useCallback } from 'react';
import { priceService } from '../services/priceService';

export function useTokenPrices() {
  const [prices, setPrices] = useState(() => priceService.getPrices());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const updatePrices = useCallback(async () => {
    try {
      setIsLoading(true);
      const newPrices = await priceService.ensureFreshPrices();
      setPrices(newPrices);
      setError(null);
    } catch (err) {
      setError('Failed to fetch token prices');
      // Keep using existing prices
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    let intervalId: number;

    const fetchPrices = async () => {
      if (!mounted) return;
      await updatePrices();
    };

    fetchPrices();

    // Update prices every minute
    intervalId = window.setInterval(fetchPrices, 60000);

    return () => {
      mounted = false;
      clearInterval(intervalId);
    };
  }, [updatePrices]);

  return { prices, isLoading, error };
}