import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Wallet, Users, Rocket, Lock, Coins, ChevronRight } from 'lucide-react';

const distributions = [
  {
    title: 'Community Rewards',
    percentage: 30,
    icon: Users,
    color: '#2D9CDB',
    description: 'Allocated for user engagement rewards',
    details: ['Social media interactions', 'Content creation', 'Platform participation']
  },
  {
    title: 'Development',
    percentage: 20,
    icon: Rocket,
    color: '#4B94DC',
    description: 'Platform development and marketing',
    details: ['Technical infrastructure', 'Marketing campaigns', 'Team expansion']
  },
  {
    title: 'Ecosystem Growth',
    percentage: 50,
    icon: Lock,
    color: '#7F56D9',
    description: 'Reserved for future ecosystem expansion',
    details: ['Strategic partnerships', 'Market expansion', 'Community initiatives']
  }
];

export const TokenDistribution = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-[#1E2A37]/80 to-[#1E2A37]/50 backdrop-blur-lg rounded-xl md:rounded-3xl p-4 md:p-8 text-white relative overflow-hidden border border-white/5 shadow-xl"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#2D9CDB]/5 to-transparent" />
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1639322537228-f710d846310a')] opacity-5 bg-cover bg-center mix-blend-overlay" />
      
      <div className="relative">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#2D9CDB]/20 to-[#7F56D9]/20 flex items-center justify-center border border-white/10"
          >
            <Coins className="w-8 h-8 text-[#2D9CDB]" />
          </motion.div>
          <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-[#2D9CDB] to-[#7F56D9] bg-clip-text text-transparent mb-2">
            Token Distribution
          </h3>
          <p className="text-sm md:text-base text-gray-400">
            Total Supply: 100,000,000 $CTE
          </p>
        </div>

        {/* Distribution Cards */}
        <div className="space-y-4">
          {distributions.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="bg-gradient-to-br from-[#1E2A37] to-[#1E2A37]/80 rounded-xl border border-white/10 overflow-hidden hover:border-[#2D9CDB]/20 transition-all duration-300">
                  {/* Main Content */}
                  <div className="p-4 md:p-6">
                    <div className="flex items-center gap-4">
                      <motion.div 
                        className="p-3 rounded-xl transition-transform duration-300 group-hover:scale-110"
                        style={{ backgroundColor: `${item.color}20` }}
                        whileHover={{ rotate: 5 }}
                      >
                        <Icon className="w-6 h-6" style={{ color: item.color }} />
                      </motion.div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline justify-between mb-1">
                          <h4 className="font-semibold text-white text-lg">{item.title}</h4>
                          <span 
                            className="text-xl font-bold font-mono"
                            style={{ color: item.color }}
                          >
                            {item.percentage}%
                          </span>
                        </div>
                        <p className="text-sm text-gray-400">{item.description}</p>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mt-4">
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: item.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${item.percentage}%` }}
                          transition={{ duration: 1, delay: 0.5 + index * 0.2 }}
                        />
                      </div>
                    </div>

                    {/* Details */}
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 pl-4 border-l-2"
                      style={{ borderColor: `${item.color}40` }}
                    >
                      <ul className="space-y-2">
                        {item.details.map((detail, i) => (
                          <li 
                            key={i}
                            className="flex items-center gap-2 text-sm text-gray-400"
                          >
                            <ChevronRight 
                              className="w-4 h-4 flex-shrink-0"
                              style={{ color: item.color }}
                            />
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 p-4 bg-gradient-to-r from-[#2D9CDB]/10 to-[#7F56D9]/10 rounded-xl border border-[#2D9CDB]/20"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-[#2D9CDB]" />
              <div>
                <div className="text-sm font-medium">Token Release Schedule</div>
                <div className="text-xs text-gray-400">Gradual unlock starting Q4 2024</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-[#2D9CDB]">12 Months</div>
              <div className="text-xs text-gray-400">Vesting Period</div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};