import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDownRight, ArrowUpRight, RefreshCw } from 'lucide-react';
import { useTransactionHistory } from '../hooks/useTransactionHistory';
import { useWeb3 } from '../context/Web3Context';
import { useWallet } from '../context/WalletContext';
import { BSC_CONSTANTS } from '../utils/constants';
import { ethers } from 'ethers';

export const TransactionHistory = () => {
  const { transactions, isLoading, error, refetch } = useTransactionHistory();
  const { account } = useWeb3();
  const { publicKey } = useWallet();

  const formatAmount = (value: string, decimals: number = 18) => {
    return parseFloat(ethers.formatUnits(value, decimals)).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    });
  };

  const getTransactionType = (tx: any) => {
    const userAddress = account?.toLowerCase() || publicKey?.toString();
    const isDeposit = tx.to.toLowerCase() === BSC_CONSTANTS.INCUBATOR_WALLET.toLowerCase();
    return isDeposit ? 'deposit' : 'withdrawal';
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-16 bg-white/5 rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-400">
        {error}
        <button
          onClick={refetch}
          className="mt-4 px-4 py-2 bg-red-500/10 rounded-lg hover:bg-red-500/20 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        No transactions found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={refetch}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          title="Refresh transactions"
        >
          <RefreshCw className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      {transactions.map((tx, index) => {
        const type = getTransactionType(tx);
        return (
          <motion.div
            key={tx.hash}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  type === 'deposit' 
                    ? 'bg-green-500/10 text-green-400' 
                    : 'bg-red-500/10 text-red-400'
                }`}>
                  {type === 'deposit' ? <ArrowDownRight /> : <ArrowUpRight />}
                </div>
                <div>
                  <div className="font-medium">
                    {type === 'deposit' ? 'Deposit' : 'Withdrawal'}
                  </div>
                  <div className="text-sm text-gray-400">
                    {new Date(parseInt(tx.timeStamp) * 1000).toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={`font-medium ${
                  type === 'deposit' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {type === 'deposit' ? '+' : '-'}
                  {formatAmount(tx.value, parseInt(tx.tokenDecimal || '18'))}
                  {' '}
                  {tx.tokenSymbol || 'BNB'}
                </div>
                <a
                  href={`https://bscscan.com/tx/${tx.hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#2D9CDB] hover:text-[#2D9CDB]/80 transition-colors"
                >
                  View on BSCScan
                </a>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};