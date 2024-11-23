import { PublicKey } from '@solana/web3.js';

export interface Token {
  symbol: string;
  name: string;
  icon: string;
  mintAddress: string;
  decimals: number;
  chain?: 'solana' | 'bsc';
}

export const TOKENS: Token[] = [
  {
    symbol: 'USDT',
    name: 'USD Tether',
    icon: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB/logo.svg',
    mintAddress: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
    decimals: 6,
    chain: 'solana'
  },
  {
    symbol: 'SOL',
    name: 'Solana',
    icon: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
    mintAddress: 'So11111111111111111111111111111111111111112',
    decimals: 9,
    chain: 'solana'
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    icon: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png',
    mintAddress: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    decimals: 6,
    chain: 'solana'
  }
];