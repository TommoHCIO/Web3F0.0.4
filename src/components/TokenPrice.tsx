import React from 'react';
import { useTokenPrices } from '../hooks/useTokenPrices';
import { RefreshCw } from 'lucide-react';

interface TokenPriceProps {
  symbol: string;
  className?: string;
}

export const TokenPrice: React.FC<TokenPriceProps> = ({ symbol, className = '' }) => {
  const { prices, isLoading, error } = useTokenPrices();
  const price = prices[symbol];

  return (
    <div className={`text-sm ${className}`}>
      {isLoading ? (
        <div className="flex items-center gap-2 text-gray-400">
          <RefreshCw className="w-3 h-3 animate-spin" />
          <span>Loading price...</span>
        </div>
      ) : error ? (
        <div className="text-red-400">Using fallback price</div>
      ) : (
        <div className="text-gray-400">
          1 {symbol} = ${price?.toFixed(2) || '0.00'}
        </div>
      )}
    </div>
  );
};