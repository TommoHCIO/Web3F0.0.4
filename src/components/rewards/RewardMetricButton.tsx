import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface RewardMetricButtonProps {
  icon: LucideIcon;
  action: string;
  amount: number;
  color: string;
  isSelected: boolean;
  onClick: () => void;
}

export const RewardMetricButton: React.FC<RewardMetricButtonProps> = ({
  icon: Icon,
  action,
  amount,
  color,
  isSelected,
  onClick
}) => {
  return (
    <motion.button
      onClick={onClick}
      className={`p-3 rounded-lg border transition-all duration-200 flex flex-col items-center gap-2 ${
        isSelected
          ? `bg-white/10 border-[${color}] shadow-lg`
          : 'bg-white/5 border-white/10 hover:bg-white/10'
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Icon className="w-5 h-5" style={{ color }} />
      <div className="text-xs">{action}</div>
      <div className="text-sm font-bold" style={{ color }}>
        +{amount} $CTE
      </div>
    </motion.button>
  );
};