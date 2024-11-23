import React from 'react';
import { motion } from 'framer-motion';
import { Clock, TrendingUp, Sparkles, ChevronRight } from 'lucide-react';
import { RewardsBreakdown } from './RewardsBreakdown';
import { Token } from '../../utils/tokens';

interface RewardsDisplayProps {
  totalRewards: number;
  selectedMetrics: Set<string>;
  amount: string;
  selectedToken: Token;
  rewards: Array<{
    icon: any;
    action: string;
    amount: number;
    color: string;
  }>;
}

export const RewardsDisplay: React.FC<RewardsDisplayProps> = ({
  totalRewards,
  selectedMetrics,
  amount,
  selectedToken,
  rewards
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-[#1E2A37] to-[#1E2A37]/80 rounded-lg border border-[#2D9CDB]/20 overflow-hidden shadow-lg"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-[#2D9CDB]/10 to-[#7F56D9]/10 p-6 border-b border-[#2D9CDB]/20">
        <div className="flex flex-col items-center gap-4">
          <motion.div 
            className="p-3 rounded-xl bg-gradient-to-br from-[#2D9CDB]/20 to-[#7F56D9]/20 border border-white/10"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Sparkles className="w-6 h-6 text-[#2D9CDB]" />
          </motion.div>
          
          <motion.div 
            className="text-3xl font-bold bg-gradient-to-r from-[#2D9CDB] to-[#7F56D9] bg-clip-text text-transparent"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 200,
              damping: 10
            }}
          >
            {totalRewards.toLocaleString()} $CTE
          </motion.div>
        </div>
      </div>

      {/* Breakdown */}
      <div className="p-4">
        <div className="text-sm text-gray-400 mb-3 flex items-center gap-2">
          <ChevronRight className="w-4 h-4" />
          <span>Rewards Breakdown</span>
        </div>
        <RewardsBreakdown
          selectedMetrics={selectedMetrics}
          amount={amount}
          selectedToken={selectedToken}
          rewards={rewards}
        />
      </div>

      {/* Footer */}
      <div className="px-4 py-3 bg-gradient-to-r from-[#2D9CDB]/5 to-[#7F56D9]/5 border-t border-[#2D9CDB]/10">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Clock className="w-4 h-4 text-[#2D9CDB]" />
            <span>Daily Distribution</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400 justify-end">
            <TrendingUp className="w-4 h-4 text-[#7F56D9]" />
            <span>Live Rates</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};