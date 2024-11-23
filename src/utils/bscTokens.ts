import { Token } from './tokens';

export const BSC_TOKENS: Token[] = [
  {
    symbol: 'BNB',
    name: 'Binance Coin',
    icon: 'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/smartchain/assets/0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c/logo.png',
    mintAddress: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    decimals: 18,
    chain: 'bsc'
  },
  {
    symbol: 'USDT',
    name: 'Binance-Peg USDT',
    icon: 'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/smartchain/assets/0x55d398326f99059fF775485246999027B3197955/logo.png',
    mintAddress: '0x55d398326f99059fF775485246999027B3197955',
    decimals: 18,
    chain: 'bsc'
  },
  {
    symbol: 'USDC',
    name: 'Binance-Peg USDC',
    icon: 'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/smartchain/assets/0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d/logo.png',
    mintAddress: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
    decimals: 18,
    chain: 'bsc'
  }
];