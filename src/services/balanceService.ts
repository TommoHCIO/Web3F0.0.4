import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from '@solana/spl-token';
import { Token } from '../utils/tokens';
import { SOLANA_CONSTANTS } from '../utils/constants';

interface CacheEntry {
  balance: number;
  timestamp: number;
}

const balanceCache = new Map<string, CacheEntry>();

export async function getTokenBalance(
  connection: Connection, 
  walletAddress: string,
  token: Token
): Promise<number> {
  if (!walletAddress) {
    throw new Error('Wallet address is required');
  }

  const cacheKey = `${walletAddress}-${token.symbol}`;
  const now = Date.now();
  const cached = balanceCache.get(cacheKey);

  // Return cached value if still valid
  if (cached && (now - cached.timestamp) < 30000) {
    return cached.balance;
  }

  try {
    const walletPubkey = new PublicKey(walletAddress);
    let balance = 0;

    if (token.symbol === 'SOL') {
      const rawBalance = await connection.getBalance(walletPubkey, 'confirmed');
      balance = rawBalance / LAMPORTS_PER_SOL;
    } else {
      // Get the associated token account address
      const associatedTokenAddress = await getAssociatedTokenAddress(
        new PublicKey(token.mintAddress),
        walletPubkey
      );

      try {
        // Try to get the token account info directly first
        const accountInfo = await connection.getTokenAccountBalance(
          associatedTokenAddress,
          'confirmed'
        );
        balance = accountInfo.value.uiAmount || 0;
      } catch (error) {
        // If the direct approach fails, fall back to getting all token accounts
        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
          walletPubkey,
          { mint: new PublicKey(token.mintAddress) },
          { commitment: 'confirmed' }
        );

        if (tokenAccounts.value.length > 0) {
          const tokenAmount = tokenAccounts.value[0].account.data.parsed.info.tokenAmount;
          balance = tokenAmount.uiAmount || 0;
        }
      }
    }

    // Update cache with new value
    balanceCache.set(cacheKey, {
      balance,
      timestamp: now
    });

    return balance;
  } catch (error) {
    console.error(`Balance fetch error for ${token.symbol}:`, error);
    
    // Return cached value if available, even if expired
    const cached = balanceCache.get(cacheKey);
    if (cached) {
      return cached.balance;
    }
    
    throw error;
  }
}