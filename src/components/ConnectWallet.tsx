import React, { useState } from 'react';
import { Wallet } from 'lucide-react';
import { Button } from './Button';
import { WalletModal } from './WalletModal';
import { useWallet } from '../context/WalletContext';
import { useWeb3 } from '../context/Web3Context';
import { TokenBalances } from './TokenBalances';

export const ConnectWallet = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isConnected: isSolanaConnected, disconnect: disconnectSolana, publicKey } = useWallet();
  const { isConnected: isBscConnected, disconnect: disconnectBsc, account } = useWeb3();

  const isConnected = isSolanaConnected || isBscConnected;
  const address = publicKey?.toString() || account;

  const handleClick = () => {
    if (isConnected) {
      if (isSolanaConnected) disconnectSolana();
      if (isBscConnected) disconnectBsc();
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <div className="flex flex-col items-end gap-4">
      <Button
        variant="primary"
        icon={Wallet}
        onClick={handleClick}
        className="shadow-lg shadow-accent/20 hover:shadow-accent/30"
      >
        {isConnected && address
          ? `${address.slice(0, 4)}...${address.slice(-4)}`
          : 'Connect Wallet'
        }
      </Button>

      {isConnected && address && <TokenBalances />}

      <WalletModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};