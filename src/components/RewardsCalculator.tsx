import React, { useState } from 'react';
import { Star, ThumbsUp, MessageCircle, Share2, PieChart, Users, Rocket, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { RewardMetricButton } from './rewards/RewardMetricButton';
import { RewardsDisplay } from './rewards/RewardsDisplay';
import { TOKENS } from '../utils/tokens';

const REWARDS = [
  { icon: Star, action: 'Views', amount: 1, color: '#2D9CDB' },
  { icon: ThumbsUp, action: 'Likes', amount: 2, color: '#4B94DC' },
  { icon: MessageCircle, action: 'Comments', amount: 5, color: '#6A75DB' },
  { icon: Share2, action: 'Reposts', amount: 10, color: '#7F56D9' }
];

const DISTRIBUTIONS = [
  {
    title: 'Community Rewards',
    percentage: 30,
    icon: Users,
    color: '#2D9CDB',
    description: 'Allocated for user engagement rewards'
  },
  {
    title: 'Development',
    percentage: 20,
    icon: Rocket,
    color: '#4B94DC',
    description: 'Platform development and marketing'
  },
  {
    title: 'Ecosystem Growth',
    percentage: 50,
    icon: Lock,
    color: '#7F56D9',
    description: 'Reserved for future ecosystem expansion'
  }
];

export const RewardsCalculator = () => {
  const [selectedMetrics, setSelectedMetrics] = useState(new Set([REWARDS[0].action]));
  const [amount, setAmount] = useState('100');
  const [showDistribution, setShowDistribution] = useState(true);
  const [selectedToken] = useState(TOKENS[0]);

  const calculateRewards = () => {
    const numericAmount = parseInt(amount) || 0;
    let total = 0;

    REWARDS.forEach(reward => {
      if (selectedMetrics.has(reward.action)) {
        total += numericAmount * reward.amount;
      }
    });

    return total;
  };

  const handleMetricToggle = (action: string) => {
    const newMetrics = new Set(selectedMetrics);
    if (newMetrics.has(action)) {
      if (newMetrics.size > 1) {
        newMetrics.delete(action);
      }
    } else {
      newMetrics.add(action);
    }
    setSelectedMetrics(newMetrics);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, '');
    if (value === '' || (/^\d*\.?\d*$/.test(value) && parseFloat(value) >= 0)) {
      setAmount(value);
    }
  };

  const totalRewards = calculateRewards();

  return (
    <div className="bg-gradient-to-br from-[#1E2A37]/80 to-[#1E2A37]/50 backdrop-blur-lg rounded-xl md:rounded-3xl p-4 md:p-6 lg:p-8 text-white relative overflow-hidden border border-white/5 shadow-xl">
      <div className="absolute inset-0 bg-gradient-to-br from-[#2D9CDB]/5 to-transparent" />
      
      <div className="relative space-y-8">
        {/* Rewards Calculator Section */}
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-center bg-gradient-to-r from-[#2D9CDB] to-[#7F56D9] bg-clip-text text-transparent mb-6">
            Rewards Calculator
          </h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
            {REWARDS.map((reward) => (
              <RewardMetricButton
                key={reward.action}
                {...reward}
                isSelected={selectedMetrics.has(reward.action)}
                onClick={() => handleMetricToggle(reward.action)}
              />
            ))}
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Enter amount to calculate
              </label>
              <input
                type="text"
                value={amount}
                onChange={handleAmountChange}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2D9CDB]/50 transition-all duration-200"
                placeholder="Enter amount"
              />
            </div>
          </div>

          <RewardsDisplay
            totalRewards={totalRewards}
            selectedMetrics={selectedMetrics}
            amount={amount}
            selectedToken={selectedToken}
            rewards={REWARDS}
          />
        </div>

        {/* Distribution Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#2D9CDB]/10 rounded-lg">
                <PieChart className="w-5 h-5 text-[#2D9CDB]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Token Distribution</h3>
                <p className="text-sm text-gray-400">Total Supply: 100M $CTE</p>
              </div>
            </div>
            <button
              onClick={() => setShowDistribution(!showDistribution)}
              className="text-[#2D9CDB] hover:text-[#2D9CDB]/80 transition-colors text-sm flex items-center gap-2"
            >
              {showDistribution ? 'Hide' : 'Show'} details
              <motion.div
                animate={{ rotate: showDistribution ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                ▼
              </motion.div>
            </button>
          </div>

          <motion.div
            initial={false}
            animate={{
              height: showDistribution ? 'auto' : 0,
              opacity: showDistribution ? 1 : 0
            }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="space-y-4">
              {DISTRIBUTIONS.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-[#2D9CDB]/20 transition-all duration-300 group"
                >
                  <div className="flex items-center gap-4">
                    <div 
                      className="p-3 rounded-lg transition-transform duration-300 group-hover:scale-110"
                      style={{ backgroundColor: `${item.color}20` }}
                    >
                      <item.icon className="w-5 h-5" style={{ color: item.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between mb-1">
                        <h4 className="font-medium text-white">{item.title}</h4>
                        <span className="text-sm font-mono" style={{ color: item.color }}>
                          {item.percentage}%
                        </span>
                      </div>
                      <p className="text-sm text-gray-400">{item.description}</p>
                    </div>
                  </div>
                  
                  <div className="mt-3 h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: item.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${item.percentage}%` }}
                      transition={{ duration: 1, delay: 0.5 + index * 0.2 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};