import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { useWeb3 } from '../context/Web3Context';
import { BSC_CONSTANTS } from '../utils/constants';
import { bscScanService } from '../services/bscScanService';
import { BSC_TOKENS } from '../utils/bscTokens';
import { useTokenPrices } from './useTokenPrices';

interface Transaction {
  timeStamp: string;
  from: string;
  to: string;
  value: string;
  tokenSymbol: string;
  tokenDecimal: string;
}

export function useUserBscStakedAmount(account: string | null) {
  const { provider } = useWeb3();
  const [stakedAmount, setStakedAmount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { prices } = useTokenPrices();

  const calculateTotalValue = useCallback(async () => {
    if (!account || !provider) {
      setStakedAmount(0);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      let totalUsdValue = 0;

      // Track BNB transfers
      const bnbTransactions = await bscScanService.getNormalTransactions(
        account,
        BSC_CONSTANTS.INCUBATOR_WALLET
      );

      if (bnbTransactions) {
        const bnbPrice = prices['BNB'] || 0;
        const bnbDeposits = bnbTransactions.reduce((total, tx) => {
          if (tx.from.toLowerCase() === account.toLowerCase() && 
              tx.to.toLowerCase() === BSC_CONSTANTS.INCUBATOR_WALLET.toLowerCase()) {
            return total + parseFloat(ethers.formatEther(tx.value));
          }
          return total;
        }, 0);
        totalUsdValue += bnbDeposits * bnbPrice;
      }

      // Track token transfers
      for (const token of BSC_TOKENS.filter(t => t.symbol !== 'BNB')) {
        const tokenTransactions = await bscScanService.getTokenTransactions(
          token.mintAddress,
          account,
          '0',
          '999999999',
          '1',
          '100'
        );

        if (tokenTransactions) {
          const tokenPrice = prices[token.symbol] || 0;
          const deposits = tokenTransactions.reduce((total: number, tx: Transaction) => {
            if (tx.from.toLowerCase() === account.toLowerCase() && 
                tx.to.toLowerCase() === BSC_CONSTANTS.INCUBATOR_WALLET.toLowerCase()) {
              const amount = parseFloat(ethers.formatUnits(tx.value, parseInt(tx.tokenDecimal)));
              return total + amount;
            }
            return total;
          }, 0);
          totalUsdValue += deposits * tokenPrice;
        }
      }

      setStakedAmount(totalUsdValue);
      setError(null);
    } catch (err) {
      console.error('Error calculating BSC staked amount:', err);
      setError('Failed to fetch staked amount');
    } finally {
      setIsLoading(false);
    }
  }, [account, provider, prices]);

  useEffect(() => {
    calculateTotalValue();
    
    // Poll for updates every 30 seconds
    const interval = setInterval(calculateTotalValue, 30000);
    
    return () => clearInterval(interval);
  }, [calculateTotalValue]);

  return { stakedAmount, isLoading, error, refetch: calculateTotalValue };
}