import React from 'react';
import { X, Wallet } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet } from '../context/WalletContext';
import { useWeb3 } from '../context/Web3Context';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const wallets = [
  {
    name: 'Solflare',
    icon: '/solflare.png',
    type: 'Solflare' as const,
    chain: 'solana'
  },
  {
    name: 'Phantom',
    icon: '/phantom.png',
    type: 'Phantom' as const,
    chain: 'solana'
  },
  {
    name: 'MetaMask',
    icon: '/metamask.png',
    type: 'MetaMask' as const,
    chain: 'bsc'
  }
];

export const WalletModal = ({ isOpen, onClose }: WalletModalProps) => {
  const { connect: connectSolana, isConnecting: isSolanaConnecting } = useWallet();
  const { connect: connectBsc, isConnecting: isBscConnecting } = useWeb3();

  const handleWalletConnect = async (wallet: typeof wallets[0]) => {
    try {
      if (wallet.chain === 'solana') {
        await connectSolana(wallet.type);
      } else if (wallet.chain === 'bsc') {
        await connectBsc();
      }
      onClose();
    } catch (error: any) {
      console.error(`Failed to connect to ${wallet.name}:`, error);
    }
  };

  const isConnecting = isSolanaConnecting || isBscConnecting;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-sm bg-[#1E2A37] border border-white/10 rounded-2xl shadow-xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <Wallet className="w-5 h-5 text-[#2D9CDB]" />
                <span className="font-semibold text-white">Connect Wallet</span>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            {/* Wallet List */}
            <div className="p-3">
              <div className="space-y-2">
                {wallets.map((wallet) => (
                  <motion.button
                    key={wallet.name}
                    onClick={() => handleWalletConnect(wallet)}
                    disabled={isConnecting}
                    className="w-full group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-200">
                      <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                        <img
                          src={wallet.icon}
                          alt={wallet.name}
                          className="w-6 h-6"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.parentElement!.textContent = wallet.name[0];
                          }}
                        />
                      </div>
                      <span className="text-white group-hover:text-[#2D9CDB] transition-colors">
                        {wallet.name}
                      </span>
                      <div className="flex-1 text-right">
                        <span className="text-xs text-gray-400 px-2 py-1 rounded-full bg-white/5">
                          {wallet.chain === 'solana' ? 'Solana' : 'BSC'}
                        </span>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-3 text-center text-xs text-gray-400 border-t border-white/10">
              By connecting, you agree to our Terms of Service
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};