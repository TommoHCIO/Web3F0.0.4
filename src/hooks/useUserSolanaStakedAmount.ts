import { useState, useEffect, useCallback } from 'react';
import { Connection } from '@solana/web3.js';
import { SolanaConnectionManager } from '../utils/solanaConnection';
import { getUserStakedAmount } from '../utils/solana';

export function useUserSolanaStakedAmount(walletAddress: string | null) {
  const [stakedAmount, setStakedAmount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStakedAmount = useCallback(async () => {
    if (!walletAddress) {
      setStakedAmount(0);
      setIsLoading(false);
      return;
    }

    try {
      const connectionManager = SolanaConnectionManager.getInstance();
      
      const amount = await connectionManager.executeWithRetry(async (connection: Connection) => {
        return getUserStakedAmount(connection, walletAddress);
      });
      
      setStakedAmount(amount);
      setError(null);
    } catch (err) {
      console.error('Error fetching Solana staked amount:', err);
      setError('Failed to fetch staked amount');
    } finally {
      setIsLoading(false);
    }
  }, [walletAddress]);

  useEffect(() => {
    fetchStakedAmount();
    
    // Poll for updates every 30 seconds
    const interval = setInterval(fetchStakedAmount, 30000);
    
    return () => clearInterval(interval);
  }, [fetchStakedAmount]);

  return { stakedAmount, isLoading, error, refetch: fetchStakedAmount };
}