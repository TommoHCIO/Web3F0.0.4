import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins, ChevronDown } from 'lucide-react';
import { TokenPrice } from './TokenPrice';
import { useWeb3 } from '../context/Web3Context';
import { BSC_TOKENS } from '../utils/bscTokens';
import { Token } from '../utils/tokens';

interface TokenSelectorProps {
  selectedToken: Token;
  onSelect: (token: Token) => void;
  tokens: Token[];
  className?: string;
  disabled?: boolean;
}

export const TokenSelector: React.FC<TokenSelectorProps> = ({
  selectedToken,
  onSelect,
  tokens,
  className = '',
  disabled = false
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { isConnected: isBscConnected } = useWeb3();

  // Filter tokens based on connected wallet
  const availableTokens = isBscConnected ? BSC_TOKENS : tokens;

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full flex items-center gap-2 p-3 rounded-lg border transition-all duration-200 ${
          disabled
            ? 'bg-white/5 border-white/5 opacity-50 cursor-not-allowed'
            : 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-[#2D9CDB]/20'
        }`}
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2D9CDB]/20 to-[#7F56D9]/20 flex items-center justify-center">
          {selectedToken.icon ? (
            <img
              src={selectedToken.icon}
              alt={selectedToken.symbol}
              className="w-6 h-6"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.parentElement!.innerHTML = selectedToken.symbol[0];
              }}
            />
          ) : (
            <Coins className="w-5 h-5 text-[#2D9CDB]" />
          )}
        </div>
        <div className="flex-1 text-left">
          <div className="font-medium text-white">{selectedToken.symbol}</div>
          <TokenPrice symbol={selectedToken.symbol} />
        </div>
        <ChevronDown 
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute z-50 w-full bottom-full mb-2 py-2 bg-[#1E2A37] rounded-lg border border-white/10 shadow-xl backdrop-blur-lg"
            >
              {availableTokens.map((token) => (
                <motion.button
                  key={token.mintAddress}
                  onClick={() => {
                    onSelect(token);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-all duration-200 group ${
                    selectedToken.mintAddress === token.mintAddress
                      ? 'bg-white/5'
                      : ''
                  }`}
                  whileHover={{ x: 4 }}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
                    selectedToken.mintAddress === token.mintAddress
                      ? 'bg-gradient-to-br from-[#2D9CDB]/20 to-[#7F56D9]/20'
                      : 'bg-white/10 group-hover:bg-gradient-to-br group-hover:from-[#2D9CDB]/10 group-hover:to-[#7F56D9]/10'
                  }`}>
                    {token.icon ? (
                      <img
                        src={token.icon}
                        alt={token.symbol}
                        className="w-6 h-6"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.parentElement!.innerHTML = token.symbol[0];
                        }}
                      />
                    ) : (
                      <Coins className="w-5 h-5 text-[#2D9CDB]" />
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium text-white group-hover:text-[#2D9CDB] transition-colors">
                      {token.symbol}
                    </div>
                    <TokenPrice symbol={token.symbol} />
                  </div>
                  {selectedToken.mintAddress === token.mintAddress && (
                    <div className="w-2 h-2 rounded-full bg-[#2D9CDB]" />
                  )}
                </motion.button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};