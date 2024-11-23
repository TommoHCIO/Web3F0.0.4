import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { useTokenBalances } from '../hooks/useTokenBalances';
import { useBscBalance } from '../hooks/useBscBalance';
import { useWallet } from '../context/WalletContext';
import { useWeb3 } from '../context/Web3Context';
import { BSC_TOKENS } from '../utils/bscTokens';

export const TokenBalances = () => {
  const { publicKey } = useWallet();
  const { account } = useWeb3();
  const { balances: solanaBalances, refetch: refetchSolana } = useTokenBalances(publicKey);
  const { balances: bscBalances, refetch: refetchBsc, isLoading: isBscLoading } = useBscBalance();

  const handleRefresh = (e: React.MouseEvent) => {
    e.preventDefault();
    if (publicKey) refetchSolana();
    if (account) refetchBsc();
  };

  if (!publicKey && !account) return null;

  const renderBalanceItem = (
    symbol: string,
    balance: string | number,
    icon: string,
    name: string
  ) => (
    <motion.div
      key={symbol}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 group"
    >
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2D9CDB]/20 to-[#7F56D9]/20 flex items-center justify-center">
        {icon ? (
          <img
            src={icon}
            alt={symbol}
            className="w-6 h-6"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.parentElement!.innerHTML = symbol[0];
            }}
          />
        ) : (
          <span className="text-[#2D9CDB]">{symbol[0]}</span>
        )}
      </div>

      <div className="flex-1">
        <div className="flex items-baseline justify-between">
          <span className="text-sm font-medium text-white group-hover:text-[#2D9CDB] transition-colors">
            {symbol}
          </span>
          <span className="text-sm font-mono text-gray-300">
            {typeof balance === 'number' 
              ? balance.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 6
                })
              : parseFloat(balance).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 6
                })
            }
          </span>
        </div>
        <div className="text-xs text-gray-500">{name}</div>
      </div>
    </motion.div>
  );

  return (
    <div className="w-full bg-[#1E2A37]/50 backdrop-blur-lg rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-400">Available Balance</h3>
        <button
          onClick={handleRefresh}
          className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
          title="Refresh balances"
        >
          <RefreshCw className={`w-4 h-4 text-gray-400 ${isBscLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="space-y-3">
        {/* Solana Balances */}
        {publicKey && solanaBalances.map(({ token, balance, isLoading, error }) => (
          <React.Fragment key={token.symbol}>
            {!error && renderBalanceItem(
              token.symbol,
              balance,
              token.icon,
              token.name
            )}
          </React.Fragment>
        ))}

        {/* BSC Balances */}
        {account && Object.entries(bscBalances).map(([symbol, balance]) => {
          const token = BSC_TOKENS.find(t => t.symbol === symbol);
          if (!token) return null;
          return renderBalanceItem(
            symbol,
            balance,
            token.icon,
            token.name
          );
        })}
      </div>

      <div className="text-xs text-gray-500 pt-2 border-t border-white/10">
        {publicKey ? `${publicKey.slice(0, 4)}...${publicKey.slice(-4)}` : 
         account ? `${account.slice(0, 4)}...${account.slice(-4)}` : ''}
      </div>
    </div>
  );
};