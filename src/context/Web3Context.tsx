import React, { createContext, useContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { BSC_MAINNET } from '../utils/chains';
import { rpcManager } from '../utils/rpcManager';

interface Web3ContextType {
  provider: ethers.Provider | null;
  signer: ethers.Signer | null;
  account: string | null;
  chainId: number | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  isConnecting: boolean;
  isConnected: boolean;
  switchChain: (chainId: number) => Promise<void>;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [provider, setProvider] = useState<ethers.Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const createProvider = async () => {
    try {
      const rpcUrl = rpcManager.getFastestHealthyRpc();
      const provider = new ethers.JsonRpcProvider(rpcUrl);
      await provider.getBlockNumber(); // Test the connection
      return provider;
    } catch (error) {
      console.error('RPC connection failed, trying next RPC...');
      const nextRpc = rpcManager.getNextRpc();
      return new ethers.JsonRpcProvider(nextRpc);
    }
  };

  const connect = async () => {
    if (!window.ethereum) {
      window.open('https://metamask.io/download.html', '_blank');
      throw new Error('Please install MetaMask');
    }

    try {
      setIsConnecting(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      const signer = await provider.getSigner();
      const network = await provider.getNetwork();

      setProvider(provider);
      setSigner(signer);
      setAccount(accounts[0]);
      setChainId(Number(network.chainId));
      setIsConnected(true);

      // Switch to BSC if not already on it
      if (Number(network.chainId) !== BSC_MAINNET.id) {
        await switchChain(BSC_MAINNET.id);
      }
    } catch (error) {
      console.error('Connection error:', error);
      throw error;
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setProvider(null);
    setSigner(null);
    setAccount(null);
    setChainId(null);
    setIsConnected(false);
  };

  const switchChain = async (chainId: number) => {
    if (!window.ethereum) throw new Error('No crypto wallet found');

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          const rpcUrls = BSC_MAINNET.rpcUrls.default.http.slice(0, 3); // Use first 3 RPCs
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${BSC_MAINNET.id.toString(16)}`,
                chainName: BSC_MAINNET.name,
                nativeCurrency: BSC_MAINNET.nativeCurrency,
                rpcUrls,
                blockExplorerUrls: [BSC_MAINNET.blockExplorers.default.url],
              },
            ],
          });
        } catch (addError) {
          console.error('Error adding chain:', addError);
          throw addError;
        }
      }
      console.error('Error switching chain:', switchError);
      throw switchError;
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('chainChanged', (chainId: string) => {
        setChainId(Number(chainId));
      });

      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          disconnect();
        }
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('chainChanged');
        window.ethereum.removeAllListeners('accountsChanged');
      }
      rpcManager.cleanup();
    };
  }, []);

  return (
    <Web3Context.Provider
      value={{
        provider,
        signer,
        account,
        chainId,
        connect,
        disconnect,
        isConnecting,
        isConnected,
        switchChain,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
}