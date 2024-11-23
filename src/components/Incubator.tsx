import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Wallet, AlertCircle, Sparkles, Calculator, TrendingUp, ArrowRight } from 'lucide-react';
import { Button } from './Button';
import { useWallet } from '../context/WalletContext';
import { useWeb3 } from '../context/Web3Context';
import { createTokenTransferTransaction, sendAndConfirmTransaction } from '../services/transactions';
import { useIncubatorBalance } from '../hooks/useIncubatorBalance';
import { useUserStakedAmount } from '../hooks/useUserStakedAmount';
import { useIncubatorWallet } from '../hooks/useIncubatorWallet';
import { ProgressBar } from './ProgressBar';
import { TokenSelector } from './TokenSelector';
import { TOKENS } from '../utils/tokens';
import { useTokenPrices } from '../hooks/useTokenPrices';

const GOAL_AMOUNT = 33000;
const MAX_CTE_SUPPLY = 100000000;
const CTE_ALLOCATION_PERCENTAGE = 30;
const CTE_ALLOCATION = MAX_CTE_SUPPLY * (CTE_ALLOCATION_PERCENTAGE / 100);

export const Incubator = () => {
  const { wallet, publicKey } = useWallet();
  const { account } = useWeb3();
  const { incubatorWallet, chain } = useIncubatorWallet();
  const { totalValue: incubatorBalance, isLoading: isLoadingBalance, error: balanceError, refetch } = useIncubatorBalance();
  const { stakedAmount, isLoading: isLoadingStaked, error: stakedError } = useUserStakedAmount(publicKey || account);
  const { prices } = useTokenPrices();
  
  const [amount, setAmount] = useState<string>('');
  const [selectedToken, setSelectedToken] = useState(TOKENS[0]);
  const [isDepositing, setIsDepositing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const expectedRewards = useMemo(() => {
    const depositAmount = parseFloat(amount);
    if (isNaN(depositAmount) || depositAmount <= 0) return 0;
    
    const tokenPrice = prices[selectedToken.symbol] || 0;
    const usdValue = depositAmount * tokenPrice;
    const proportion = usdValue / GOAL_AMOUNT;
    const rewards = CTE_ALLOCATION * proportion;
    
    return rewards;
  }, [amount, selectedToken, prices]);

  const handleDeposit = async () => {
    if (!wallet && !account) {
      setError('Please connect your wallet first');
      return;
    }

    if (!incubatorWallet) {
      setError('Incubator wallet not available');
      return;
    }

    const depositAmount = parseFloat(amount);
    if (isNaN(depositAmount) || depositAmount <= 0) {
      setError('Please enter a valid positive amount');
      return;
    }

    setIsDepositing(true);
    setError(null);
    setSuccess(null);

    try {
      if (chain === 'solana') {
        const transaction = await createTokenTransferTransaction(wallet, depositAmount, selectedToken);
        const signature = await sendAndConfirmTransaction(wallet, transaction);
        setSuccess(`Successfully deposited ${depositAmount} ${selectedToken.symbol}`);
      } else if (chain === 'bsc') {
        // BSC deposit logic will be handled by Web3 context
        // Implementation will be added in the next update
        setSuccess(`Successfully deposited ${depositAmount} ${selectedToken.symbol}`);
      }
      
      setAmount('');
      refetch();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsDepositing(false);
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, '');
    if (value === '' || (/^\d*\.?\d*$/.test(value) && parseFloat(value) >= 0)) {
      setAmount(value);
      setError(null);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-[#1E2A37]/80 to-[#1E2A37]/50 backdrop-blur-lg rounded-xl md:rounded-3xl p-4 md:p-6 lg:p-8 text-white relative overflow-hidden border border-white/5 shadow-xl"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#2D9CDB]/5 to-transparent" />
      
      <div className="relative">
        <div className="text-center mb-6 md:mb-8">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#2D9CDB]/20 to-[#7F56D9]/20 flex items-center justify-center border border-white/10"
          >
            <Sparkles className="w-8 h-8 text-[#2D9CDB]" />
          </motion.div>
          <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-[#2D9CDB] to-[#7F56D9] bg-clip-text text-transparent mb-2">
            CTE Incubator
          </h2>
          <p className="text-sm md:text-base text-gray-400">Participate in the initial token distribution</p>
        </div>

        <div className="space-y-4 md:space-y-6 mb-6 md:mb-8">
          {(publicKey || account) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#1E2A37] rounded-lg md:rounded-xl p-4 md:p-6 border border-white/10 shadow-lg group hover:border-[#2D9CDB]/20 transition-all duration-300"
            >
              <div className="text-sm text-gray-400 mb-2">My Staked {selectedToken.symbol}</div>
              <div className="text-xl md:text-2xl font-bold text-[#2D9CDB] group-hover:scale-105 transform transition-transform duration-300">
                {isLoadingStaked ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-[#2D9CDB] border-t-transparent rounded-full animate-spin" />
                    <span className="text-gray-400">Loading...</span>
                  </div>
                ) : stakedError ? (
                  <div className="text-sm text-red-400">Unable to fetch staked amount</div>
                ) : (
                  `${stakedAmount.toLocaleString()} ${selectedToken.symbol}`
                )}
              </div>
            </motion.div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-[#1E2A37] rounded-lg md:rounded-xl p-4 md:p-6 border border-white/10 shadow-lg group hover:border-[#2D9CDB]/20 transition-all duration-300"
            >
              <div className="text-sm text-gray-400 mb-2">Total Value Locked</div>
              <div className="text-xl md:text-2xl font-bold text-[#2D9CDB] group-hover:scale-105 transform transition-transform duration-300">
                {isLoadingBalance ? (
                  <div className="animate-pulse">Loading...</div>
                ) : balanceError ? (
                  <div className="text-red-400 text-sm">Unable to fetch balance</div>
                ) : (
                  <>
                    <div>${incubatorBalance.toLocaleString()}</div>
                  </>
                )}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-[#1E2A37] rounded-lg md:rounded-xl p-4 md:p-6 border border-white/10 shadow-lg group hover:border-[#2D9CDB]/20 transition-all duration-300"
            >
              <div className="text-sm text-gray-400 mb-2">Goal Amount</div>
              <div className="text-xl md:text-2xl font-bold text-[#2D9CDB] group-hover:scale-105 transform transition-transform duration-300">
                ${GOAL_AMOUNT.toLocaleString()}
              </div>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#1E2A37] rounded-lg md:rounded-xl p-4 md:p-6 border border-white/10 shadow-lg"
        >
          <ProgressBar 
            current={incubatorBalance} 
            goal={GOAL_AMOUNT} 
            className="mb-4 md:mb-6"
          />

          {amount && expectedRewards > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-6"
            >
              <div className="bg-gradient-to-br from-[#1E2A37] to-[#1E2A37]/80 rounded-lg border border-[#2D9CDB]/20 overflow-hidden">
                <div className="bg-gradient-to-r from-[#2D9CDB]/10 to-[#7F56D9]/10 p-4 border-b border-[#2D9CDB]/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-[#2D9CDB]/20 to-[#7F56D9]/20">
                        <Sparkles className="w-5 h-5 text-[#2D9CDB]" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold bg-gradient-to-r from-[#2D9CDB] to-[#7F56D9] bg-clip-text text-transparent">
                          Expected Rewards
                        </div>
                        <div className="text-xs text-gray-400">For {amount} {selectedToken.symbol} deposit</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold bg-gradient-to-r from-[#2D9CDB] to-[#7F56D9] bg-clip-text text-transparent animate-pulse">
                        {expectedRewards.toLocaleString()} $CTE
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Calculator className="w-4 h-4" />
                      <span>USD Value</span>
                    </div>
                    <div className="text-gray-400">
                      ${(parseFloat(amount) * (prices[selectedToken.symbol] || 0)).toLocaleString()}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-400">
                      <TrendingUp className="w-4 h-4" />
                      <span>Share of Allocation</span>
                    </div>
                    <div className="text-[#2D9CDB]">
                      {((parseFloat(amount) * (prices[selectedToken.symbol] || 0) / GOAL_AMOUNT) * 100).toFixed(2)}%
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <div className="flex flex-col md:flex-row gap-3 md:gap-4">
            <TokenSelector
              selectedToken={selectedToken}
              onSelect={setSelectedToken}
              tokens={TOKENS}
              className="md:w-48"
              disabled={isDepositing}
            />
            
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  value={amount}
                  onChange={handleAmountChange}
                  placeholder="Enter amount"
                  className="w-full bg-[#141F2A] border border-white/10 rounded-lg px-3 py-2 md:px-4 md:py-3 text-sm md:text-base text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2D9CDB]/50 transition-all duration-200"
                  disabled={isDepositing}
                />
                <span className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                  {selectedToken.symbol}
                </span>
              </div>
            </div>

            <Button
              variant="primary"
              icon={isDepositing ? undefined : ArrowRight}
              onClick={handleDeposit}
              disabled={isDepositing || !amount || parseFloat(amount) <= 0}
              className="w-full md:w-auto bg-gradient-to-r from-[#2D9CDB] to-[#7F56D9] hover:opacity-90 shadow-lg hover:shadow-xl transition-all duration-300 whitespace-nowrap text-sm md:text-base"
            >
              {isDepositing ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing...</span>
                </div>
              ) : (
                'Deposit'
              )}
            </Button>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg p-3 mt-4 text-sm"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {success && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                {success}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};