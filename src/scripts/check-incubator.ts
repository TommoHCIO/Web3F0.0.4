import { Connection } from '@solana/web3.js';
import { SolanaConnectionManager } from '../utils/solanaConnection';
import { SOLANA_CONSTANTS } from '../utils/constants';
import { getTokenBalance } from '../services/balanceService';
import { TOKENS } from '../utils/tokens';

async function checkIncubatorBalance() {
  try {
    console.log('Fetching incubator USDT balance...');
    
    const connectionManager = SolanaConnectionManager.getInstance();
    const usdtToken = TOKENS.find(t => t.symbol === 'USDT');
    
    if (!usdtToken) {
      throw new Error('USDT token not found');
    }

    const balance = await connectionManager.executeWithRetry(async (connection: Connection) => {
      return getTokenBalance(
        connection,
        SOLANA_CONSTANTS.INCUBATOR_WALLET.toString(),
        usdtToken
      );
    });

    console.log(`Current USDT Balance: ${balance.toLocaleString()} USDT`);
    return balance;
  } catch (error) {
    console.error('Error fetching incubator balance:', error);
    process.exit(1);
  }
}

// Execute the check
checkIncubatorBalance();