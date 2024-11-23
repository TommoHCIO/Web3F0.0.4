import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { useWeb3 } from '../context/Web3Context';
import { BSC_TOKENS } from '../utils/bscTokens';
import { bscScanService } from '../services/bscScanService';

const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function name() view returns (string)'
];

export function useBscBalance() {
  const { provider, account, isConnected } = useWeb3();
  const [balances, setBalances] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBalances = useCallback(async () => {
    if (!provider || !account || !isConnected) {
      setBalances({});
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const newBalances: { [key: string]: string } = {};

      // Fetch BNB balance
      const bnbBalance = await provider.getBalance(account);
      newBalances.BNB = ethers.formatEther(bnbBalance);

      // Fetch token balances using BSCScan API for better reliability
      const tokenPromises = BSC_TOKENS
        .filter(token => token.symbol !== 'BNB')
        .map(async (token) => {
          try {
            const balance = await bscScanService.getTokenBalance(token.mintAddress, account);
            return {
              symbol: token.symbol,
              balance: ethers.formatUnits(balance, token.decimals)
            };
          } catch (error) {
            // Fallback to contract call if BSCScan API fails
            const contract = new ethers.Contract(token.mintAddress, ERC20_ABI, provider);
            const balance = await contract.balanceOf(account);
            return {
              symbol: token.symbol,
              balance: ethers.formatUnits(balance, token.decimals)
            };
          }
        });

      const tokenBalances = await Promise.all(tokenPromises);
      tokenBalances.forEach(({ symbol, balance }) => {
        newBalances[symbol] = balance;
      });

      setBalances(newBalances);
      setError(null);
    } catch (err) {
      console.error('Error fetching BSC balances:', err);
      setError('Failed to fetch balances');
    } finally {
      setIsLoading(false);
    }
  }, [provider, account, isConnected]);

  useEffect(() => {
    fetchBalances();
    
    // Set up polling for balance updates
    const interval = setInterval(fetchBalances, 15000); // Poll every 15 seconds
    
    return () => clearInterval(interval);
  }, [fetchBalances]);

  return { balances, isLoading, error, refetch: fetchBalances };
}