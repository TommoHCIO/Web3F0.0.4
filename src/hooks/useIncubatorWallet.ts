import { useWeb3 } from '../context/Web3Context';
import { useWallet } from '../context/WalletContext';
import { SOLANA_CONSTANTS, BSC_CONSTANTS } from '../utils/constants';

export function useIncubatorWallet() {
  const { isConnected: isBscConnected } = useWeb3();
  const { isConnected: isSolanaConnected } = useWallet();

  const getIncubatorWallet = () => {
    if (isBscConnected) {
      return BSC_CONSTANTS.INCUBATOR_WALLET;
    }
    if (isSolanaConnected) {
      return SOLANA_CONSTANTS.INCUBATOR_WALLET.toString();
    }
    return null;
  };

  return {
    incubatorWallet: getIncubatorWallet(),
    chain: isBscConnected ? 'bsc' : isSolanaConnected ? 'solana' : null
  };
}