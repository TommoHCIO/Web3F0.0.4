import { useState, useEffect, useCallback, useRef } from 'react';
import { Connection } from '@solana/web3.js';
import { SolanaConnectionManager } from '../utils/solanaConnection';
import { SOLANA_CONSTANTS } from '../utils/constants';
import { getTokenBalance } from '../services/balanceService';
import { TOKENS } from '../utils/tokens';
import { useTokenPrices } from './useTokenPrices';

const RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 1000;

export function useIncubatorBalance() {
  const [balances, setBalances] = useState<{ [key: string]: number }>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const { prices } = useTokenPrices();
  const mountedRef = useRef<boolean>(true);
  const lastFetchRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const retryCountRef = useRef<number>(0);

  const fetchBalances = useCallback(async (force = false) => {
    if (!mountedRef.current) return;

    const now = Date.now();
    if (!force && now - lastFetchRef.current < SOLANA_CONSTANTS.REQUEST_INTERVAL) {
      return;
    }

    try {
      lastFetchRef.current = now;
      const connectionManager = SolanaConnectionManager.getInstance();
      
      const newBalances = await connectionManager.executeWithRetry(async (connection: Connection) => {
        const tokenBalances = await Promise.all(
          TOKENS.map(async token => {
            const balance = await getTokenBalance(
              connection,
              SOLANA_CONSTANTS.INCUBATOR_WALLET.toString(),
              token
            );
            return { symbol: token.symbol, balance };
          })
        );

        return tokenBalances.reduce((acc, { symbol, balance }) => {
          acc[symbol] = balance;
          return acc;
        }, {} as { [key: string]: number });
      });
      
      if (mountedRef.current) {
        setBalances(newBalances);
        setLastUpdated(new Date());
        setError(null);
        retryCountRef.current = 0;
      }
    } catch (err: any) {
      if (mountedRef.current) {
        console.error('Incubator balance fetch error:', err);
        setError('Failed to fetch incubator balance');

        if (retryCountRef.current < RETRY_ATTEMPTS) {
          retryCountRef.current++;
          const delay = RETRY_DELAY * Math.pow(2, retryCountRef.current - 1);
          timeoutRef.current = setTimeout(() => {
            fetchBalances(true);
          }, delay);
          return;
        }
      }
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
        
        if (retryCountRef.current === 0 && timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = setTimeout(() => {
            fetchBalances(true);
          }, SOLANA_CONSTANTS.REQUEST_INTERVAL);
        }
      }
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    retryCountRef.current = 0;
    setIsLoading(true);
    fetchBalances(true);

    return () => {
      mountedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [fetchBalances]);

  const refetch = useCallback(() => {
    setIsLoading(true);
    retryCountRef.current = 0;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    return fetchBalances(true);
  }, [fetchBalances]);

  // Calculate total USD value
  const totalValue = Object.entries(balances).reduce((total, [symbol, balance]) => {
    const price = prices[symbol] || 0;
    return total + (balance * price);
  }, 0);

  return { balances, totalValue, isLoading, error, refetch, lastUpdated };
}