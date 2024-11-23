import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Calendar, Timer, Rocket } from 'lucide-react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const Countdown = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const endDate = new Date('2024-12-01T00:00:00');
      const difference = endDate.getTime() - new Date().getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  const timeUnits = [
    { label: 'Days', value: timeLeft.days, icon: Calendar, color: '#2D9CDB' },
    { label: 'Hours', value: timeLeft.hours, icon: Clock, color: '#4B94DC' },
    { label: 'Minutes', value: timeLeft.minutes, icon: Timer, color: '#6A75DB' },
    { label: 'Seconds', value: timeLeft.seconds, icon: Timer, color: '#7F56D9' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-[#1E2A37]/80 to-[#1E2A37]/50 backdrop-blur-lg rounded-xl md:rounded-3xl p-4 md:p-8 text-white relative overflow-hidden border border-white/5 shadow-xl"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#2D9CDB]/5 to-transparent" />
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1639322537504-6427a16b0a28')] opacity-5 bg-cover bg-center mix-blend-overlay" />
      
      <div className="relative">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#2D9CDB]/20 to-[#7F56D9]/20 flex items-center justify-center border border-white/10"
          >
            <Rocket className="w-8 h-8 text-[#2D9CDB]" />
          </motion.div>
          <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-[#2D9CDB] to-[#7F56D9] bg-clip-text text-transparent mb-2">
            Platform Launch Countdown
          </h3>
          <p className="text-sm md:text-base text-gray-400">
            Join early and maximize your rewards
          </p>
        </div>
        
        {/* Countdown Grid */}
        <div className="grid grid-cols-4 gap-2 md:gap-4 max-w-4xl mx-auto">
          {timeUnits.map((unit, index) => {
            const Icon = unit.icon;
            return (
              <motion.div
                key={unit.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
                className="relative group"
              >
                {/* Main Card */}
                <div className="bg-gradient-to-br from-[#1E2A37] to-[#1E2A37]/80 rounded-xl border border-white/10 p-4 text-center relative overflow-hidden group-hover:border-[#2D9CDB]/20 transition-colors duration-300">
                  {/* Background Gradient */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: `linear-gradient(45deg, ${unit.color}10, transparent)`
                    }}
                  />
                  
                  {/* Icon */}
                  <div 
                    className="w-8 h-8 mx-auto mb-2 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                    style={{ backgroundColor: `${unit.color}20` }}
                  >
                    <Icon className="w-4 h-4" style={{ color: unit.color }} />
                  </div>
                  
                  {/* Number */}
                  <motion.div
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
                    className="text-2xl md:text-3xl lg:text-4xl font-bold font-mono mb-1"
                    style={{ color: unit.color }}
                  >
                    {unit.value.toString().padStart(2, '0')}
                  </motion.div>
                  
                  {/* Label */}
                  <div className="text-xs uppercase tracking-wider text-gray-400">
                    {unit.label}
                  </div>
                </div>

                {/* Decorative Dots */}
                <div className="absolute -right-1 -top-1 w-2 h-2 rounded-full" style={{ backgroundColor: unit.color }} />
                <div className="absolute -left-1 -bottom-1 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: unit.color }} />
              </motion.div>
            );
          })}
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#2D9CDB]/10 to-[#7F56D9]/10 border border-white/10">
            <Calendar className="w-4 h-4 text-[#2D9CDB]" />
            <span className="text-sm text-gray-400">Launch Date: December 1st, 2024</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};