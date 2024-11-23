import { Transaction, PublicKey, Connection, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { 
  createTransferInstruction, 
  getAssociatedTokenAddress, 
  TOKEN_PROGRAM_ID, 
  getAccount,
  createAssociatedTokenAccountInstruction
} from '@solana/spl-token';
import { SolanaConnectionManager } from '../utils/solanaConnection';
import { SOLANA_CONSTANTS } from '../utils/constants';
import { Token } from '../utils/tokens';

async function getOrCreateAssociatedTokenAccount(
  connection: Connection,
  wallet: any,
  mint: PublicKey,
  owner: PublicKey
): Promise<PublicKey> {
  const associatedToken = await getAssociatedTokenAddress(mint, owner);
  
  try {
    await getAccount(connection, associatedToken);
    return associatedToken;
  } catch (error: any) {
    if (error.name === 'TokenAccountNotFoundError') {
      const instruction = createAssociatedTokenAccountInstruction(
        wallet.publicKey,
        associatedToken,
        owner,
        mint
      );
      
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed');
      const transaction = new Transaction({
        feePayer: wallet.publicKey,
        blockhash,
        lastValidBlockHeight,
      }).add(instruction);

      const signed = await wallet.signTransaction(transaction);
      const signature = await connection.sendRawTransaction(signed.serialize());
      await connection.confirmTransaction({
        signature,
        blockhash: transaction.blockhash,
        lastValidBlockHeight: transaction.lastValidBlockHeight,
      });

      return associatedToken;
    }
    throw error;
  }
}

export async function createTokenTransferTransaction(
  wallet: any,
  amount: number,
  selectedToken: Token
): Promise<Transaction> {
  const connectionManager = SolanaConnectionManager.getInstance();

  return connectionManager.executeWithRetry(async (connection: Connection) => {
    if (!wallet.publicKey) {
      throw new Error('Wallet not connected');
    }

    if (amount <= 0) {
      throw new Error('Invalid transfer amount');
    }

    const mintPubkey = new PublicKey(selectedToken.mintAddress);

    // Handle SOL transfers differently
    if (selectedToken.symbol === 'SOL') {
      // Check SOL balance
      const balance = await connection.getBalance(wallet.publicKey);
      const transferAmount = amount * LAMPORTS_PER_SOL;
      
      if (balance < transferAmount) {
        throw new Error(`Insufficient SOL balance. You have ${balance / LAMPORTS_PER_SOL} SOL`);
      }

      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed');
      
      return new Transaction({
        feePayer: wallet.publicKey,
        blockhash,
        lastValidBlockHeight,
      }).add(
        SystemProgram.transfer({
          fromPubkey: wallet.publicKey,
          toPubkey: SOLANA_CONSTANTS.INCUBATOR_WALLET,
          lamports: transferAmount
        })
      );
    }

    // Handle SPL token transfers
    const userTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      wallet,
      mintPubkey,
      wallet.publicKey
    );

    const incubatorTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      wallet,
      mintPubkey,
      SOLANA_CONSTANTS.INCUBATOR_WALLET
    );

    // Check token balance
    try {
      const userAccount = await getAccount(connection, userTokenAccount);
      const userBalance = Number(userAccount.amount) / Math.pow(10, selectedToken.decimals);
      if (userBalance < amount) {
        throw new Error(`Insufficient ${selectedToken.symbol} balance. You have ${userBalance.toFixed(selectedToken.decimals)} ${selectedToken.symbol}`);
      }
    } catch (error: any) {
      if (error.name === 'TokenAccountNotFoundError') {
        throw new Error(`No ${selectedToken.symbol} account found. Please fund your wallet first.`);
      }
      throw new Error(`Failed to check ${selectedToken.symbol} balance`);
    }

    // Create transfer instruction
    const transferAmount = BigInt(Math.floor(amount * Math.pow(10, selectedToken.decimals)));
    const transferInstruction = createTransferInstruction(
      userTokenAccount,
      incubatorTokenAccount,
      wallet.publicKey,
      transferAmount,
      [],
      TOKEN_PROGRAM_ID
    );

    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed');

    return new Transaction({
      feePayer: wallet.publicKey,
      blockhash,
      lastValidBlockHeight,
    }).add(transferInstruction);
  });
}

export async function sendAndConfirmTransaction(wallet: any, transaction: Transaction): Promise<string> {
  const connectionManager = SolanaConnectionManager.getInstance();

  return connectionManager.executeWithRetry(async (connection: Connection) => {
    try {
      const signedTransaction = await wallet.signTransaction(transaction);
      
      const signature = await connection.sendRawTransaction(signedTransaction.serialize(), {
        skipPreflight: false,
        preflightCommitment: 'confirmed',
      });
      
      const confirmation = await connection.confirmTransaction({
        signature,
        blockhash: transaction.blockhash,
        lastValidBlockHeight: transaction.lastValidBlockHeight,
      }, 'confirmed');

      if (confirmation.value.err) {
        throw new Error('Transaction failed to confirm');
      }

      return signature;
    } catch (error: any) {
      if (error.message.includes('User rejected')) {
        throw new Error('Transaction cancelled by user');
      }
      throw new Error(`Transaction failed: ${error.message}`);
    }
  });
}