import { useState, useEffect, useCallback, useRef } from 'react';
import { Connection } from '@solana/web3.js';
import { SolanaConnectionManager } from '../utils/solanaConnection';
import { getTokenBalance } from '../services/balanceService';
import { TOKENS, Token } from '../utils/tokens';

interface TokenBalance {
  token: Token;
  balance: number;
  isLoading: boolean;
  error: string | null;
}

export function useTokenBalances(walletAddress: string | null) {
  const [balances, setBalances] = useState<TokenBalance[]>(
    TOKENS.map(token => ({
      token,
      balance: 0,
      isLoading: true,
      error: null
    }))
  );
  const mountedRef = useRef<boolean>(true);
  const lastFetchRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const fetchBalances = useCallback(async (force = false) => {
    if (!walletAddress || !mountedRef.current) return;

    const now = Date.now();
    if (!force && now - lastFetchRef.current < 30000) return;

    lastFetchRef.current = now;
    const connectionManager = SolanaConnectionManager.getInstance();

    try {
      const updatedBalances = await Promise.all(
        TOKENS.map(async (token) => {
          try {
            const balance = await connectionManager.executeWithRetry(
              async (connection: Connection) => {
                return getTokenBalance(connection, walletAddress, token);
              }
            );

            return {
              token,
              balance,
              isLoading: false,
              error: null
            };
          } catch (error) {
            return {
              token,
              balance: 0,
              isLoading: false,
              error: 'Failed to fetch balance'
            };
          }
        })
      );

      if (mountedRef.current) {
        setBalances(updatedBalances);
      }
    } catch (error) {
      console.error('Error fetching token balances:', error);
    }

    // Schedule next update
    if (mountedRef.current && timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        fetchBalances(true);
      }, 30000);
    }
  }, [walletAddress]);

  useEffect(() => {
    mountedRef.current = true;
    fetchBalances(true);

    return () => {
      mountedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [fetchBalances]);

  const refetch = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    return fetchBalances(true);
  }, [fetchBalances]);

  return { balances, refetch };
}