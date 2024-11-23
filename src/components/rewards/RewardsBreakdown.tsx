import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Token } from '../../utils/tokens';
import { motion } from 'framer-motion';

interface RewardsBreakdownProps {
  selectedMetrics: Set<string>;
  amount: string;
  selectedToken: Token;
  rewards: Array<{
    icon: LucideIcon;
    action: string;
    amount: number;
    color: string;
  }>;
}

export const RewardsBreakdown: React.FC<RewardsBreakdownProps> = ({
  selectedMetrics,
  amount,
  selectedToken,
  rewards
}) => {
  const inputAmount = parseFloat(amount) || 0;

  return (
    <div className="space-y-2">
      {Array.from(selectedMetrics).map((action, index) => {
        const reward = rewards.find(r => r.action === action);
        if (!reward) return null;
        const rewardAmount = inputAmount * reward.amount;
        
        return (
          <motion.div 
            key={action}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gradient-to-r from-white/5 to-transparent rounded-lg p-3 hover:from-white/10 transition-all duration-300 group"
            style={{
              borderLeft: `2px solid ${reward.color}20`,
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div 
                  className="p-2 rounded-lg transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: `${reward.color}10` }}
                >
                  <reward.icon 
                    className="w-4 h-4" 
                    style={{ color: reward.color }}
                  />
                </div>
                <div>
                  <div className="text-sm text-gray-300 group-hover:text-white transition-colors">
                    {action}
                  </div>
                  <div className="text-xs text-gray-500">
                    +{reward.amount} $CTE per action
                  </div>
                </div>
              </div>
              <div 
                className="font-mono text-sm font-bold"
                style={{ color: reward.color }}
              >
                {rewardAmount.toLocaleString()}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};