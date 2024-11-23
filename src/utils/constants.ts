import { Connection, PublicKey } from '@solana/web3.js';

export const SOLANA_CONSTANTS = {
  USDT_MINT: new PublicKey('Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB'),
  INCUBATOR_WALLET: new PublicKey('H8oTGbCNLRXu844GBRXCAfWTxt6Sa9vB9gut9bLrPdWv'),
  RPC_ENDPOINTS: [
    'https://bitter-necessary-fire.solana-mainnet.quiknode.pro/9f2b94fd2a64eca4308bfe2c78043465443a1c54/',
    'https://api.mainnet-beta.solana.com',
    'https://solana-api.projectserum.com'
  ],
  WSS_ENDPOINT: 'wss://bitter-necessary-fire.solana-mainnet.quiknode.pro/9f2b94fd2a64eca4308bfe2c78043465443a1c54/',
  CONNECTION_CONFIG: {
    commitment: 'confirmed',
    wsEndpoint: 'wss://bitter-necessary-fire.solana-mainnet.quiknode.pro/9f2b94fd2a64eca4308bfe2c78043465443a1c54/',
    useWs: true,
    disableRetryOnRateLimit: true,
    confirmTransactionInitialTimeout: 60000,
    httpHeaders: {
      'Content-Type': 'application/json',
    }
  },
  CACHE_DURATION: 120000, // 2 minutes cache
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
  REQUEST_TIMEOUT: 10000,
  USDT_DECIMALS: 6,
  REQUEST_INTERVAL: 500,
  MIN_ENDPOINT_SWITCH_INTERVAL: 5000,
  BATCH_SIZE: 5,
  MAX_SIGNATURE_BATCH_SIZE: 10,
  ERROR_MESSAGES: {
    INSUFFICIENT_BALANCE: 'Insufficient USDT balance',
    WALLET_NOT_CONNECTED: 'Wallet not connected',
    TRANSACTION_FAILED: 'Transaction failed',
    INVALID_AMOUNT: 'Invalid amount',
    RPC_ERROR: 'RPC endpoint error',
    TIMEOUT: 'Request timed out',
    RATE_LIMIT: 'Rate limit exceeded'
  }
};

export const BSC_CONSTANTS = {
  BSCSCAN_API_KEY: 'NE3VPRYDZB4FSFUAH9KQ9G9AX8QK1SQ83M',
  BSCSCAN_API_URL: 'https://api.bscscan.com/api',
  INCUBATOR_WALLET: '0xEA9123FAe9121C45B1c1f10eCf96fbD1284Af5Ed',
  CACHE_DURATION: 60000, // 1 minute cache
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
  REQUEST_TIMEOUT: 10000,
  REQUEST_INTERVAL: 20000, // 20 seconds between requests
  ERROR_MESSAGES: {
    INSUFFICIENT_BALANCE: 'Insufficient balance',
    WALLET_NOT_CONNECTED: 'Wallet not connected',
    TRANSACTION_FAILED: 'Transaction failed',
    INVALID_AMOUNT: 'Invalid amount',
    RPC_ERROR: 'RPC endpoint error',
    TIMEOUT: 'Request timed out',
    RATE_LIMIT: 'Rate limit exceeded'
  }
};