import { useCallback } from 'react';
import { useUserSolanaStakedAmount } from './useUserSolanaStakedAmount';
import { useUserBscStakedAmount } from './useUserBscStakedAmount';
import { useWeb3 } from '../context/Web3Context';
import { useWallet } from '../context/WalletContext';

export function useUserStakedAmount(address: string | null) {
  const { isConnected: isBscConnected } = useWeb3();
  const { isConnected: isSolanaConnected } = useWallet();

  const solanaStaked = useUserSolanaStakedAmount(isSolanaConnected ? address : null);
  const bscStaked = useUserBscStakedAmount(isBscConnected ? address : null);

  const isLoading = solanaStaked.isLoading || bscStaked.isLoading;
  const error = solanaStaked.error || bscStaked.error;

  const refetch = useCallback(() => {
    if (isSolanaConnected) {
      solanaStaked.refetch();
    }
    if (isBscConnected) {
      bscStaked.refetch();
    }
  }, [isSolanaConnected, isBscConnected, solanaStaked.refetch, bscStaked.refetch]);

  return {
    stakedAmount: isBscConnected ? bscStaked.stakedAmount : solanaStaked.stakedAmount,
    isLoading,
    error,
    refetch
  };
}