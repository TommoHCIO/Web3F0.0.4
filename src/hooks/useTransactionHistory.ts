import { useState, useEffect, useCallback } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { useWallet } from '../context/WalletContext';
import { bscScanService } from '../services/bscScanService';
import { BSC_CONSTANTS } from '../utils/constants';

interface Transaction {
  hash: string;
  timeStamp: string;
  from: string;
  to: string;
  value: string;
  tokenSymbol?: string;
  tokenDecimal?: string;
  status?: string;
}

export function useTransactionHistory() {
  const { account, isConnected: isBscConnected } = useWeb3();
  const { publicKey, isConnected: isSolanaConnected } = useWallet();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBscTransactions = useCallback(async () => {
    if (!account || !isBscConnected) return [];

    try {
      const txs = await bscScanService.getTransactionHistory(
        account,
        '0',
        '999999999',
        '1',
        '100',
        'desc'
      );

      // Filter transactions related to the incubator wallet
      return txs.filter(tx => 
        tx.to.toLowerCase() === BSC_CONSTANTS.INCUBATOR_WALLET.toLowerCase() ||
        tx.from.toLowerCase() === BSC_CONSTANTS.INCUBATOR_WALLET.toLowerCase()
      );
    } catch (error) {
      console.error('Error fetching BSC transactions:', error);
      throw error;
    }
  }, [account, isBscConnected]);

  const fetchTransactions = useCallback(async () => {
    if (!isBscConnected && !isSolanaConnected) {
      setTransactions([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (isBscConnected) {
        const bscTxs = await fetchBscTransactions();
        setTransactions(bscTxs);
      } else if (isSolanaConnected) {
        // Solana transactions will be handled separately
        // This is just a placeholder for now
        setTransactions([]);
      }
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError('Failed to fetch transaction history');
    } finally {
      setIsLoading(false);
    }
  }, [isBscConnected, isSolanaConnected, fetchBscTransactions]);

  useEffect(() => {
    fetchTransactions();
    
    // Poll for updates every 30 seconds
    const interval = setInterval(fetchTransactions, 30000);
    
    return () => clearInterval(interval);
  }, [fetchTransactions]);

  const refetch = useCallback(() => {
    return fetchTransactions();
  }, [fetchTransactions]);

  return {
    transactions,
    isLoading,
    error,
    refetch
  };
}