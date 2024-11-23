import { ethers } from 'ethers';
import { BSC_MAINNET } from './chains';

interface RpcHealth {
  url: string;
  latency: number;
  lastCheck: number;
  isHealthy: boolean;
  failCount: number;
}

class RpcManager {
  private static instance: RpcManager;
  private rpcHealth: Map<string, RpcHealth> = new Map();
  private currentRpcIndex: number = 0;
  private readonly checkInterval: number = 30000; // 30 seconds
  private readonly maxFailCount: number = 3;
  private intervalId?: NodeJS.Timeout;

  private constructor() {
    this.initializeHealthMap();
    this.startHealthCheck();
  }

  public static getInstance(): RpcManager {
    if (!RpcManager.instance) {
      RpcManager.instance = new RpcManager();
    }
    return RpcManager.instance;
  }

  private initializeHealthMap(): void {
    BSC_MAINNET.rpcUrls.default.http.forEach(url => {
      this.rpcHealth.set(url, {
        url,
        latency: 0,
        lastCheck: 0,
        isHealthy: true,
        failCount: 0
      });
    });
  }

  private async checkRpcHealth(url: string): Promise<void> {
    const health = this.rpcHealth.get(url);
    if (!health) return;

    try {
      const startTime = Date.now();
      const provider = new ethers.JsonRpcProvider(url);
      await provider.getBlockNumber();
      
      const latency = Date.now() - startTime;
      this.rpcHealth.set(url, {
        ...health,
        latency,
        lastCheck: Date.now(),
        isHealthy: true,
        failCount: 0
      });
    } catch (error) {
      this.rpcHealth.set(url, {
        ...health,
        isHealthy: false,
        failCount: health.failCount + 1,
        lastCheck: Date.now()
      });
    }
  }

  private startHealthCheck(): void {
    this.checkAllRpcs();
    this.intervalId = setInterval(() => this.checkAllRpcs(), this.checkInterval);
  }

  private async checkAllRpcs(): Promise<void> {
    const checks = BSC_MAINNET.rpcUrls.default.http.map(url => 
      this.checkRpcHealth(url)
    );
    await Promise.all(checks);
  }

  public getFastestHealthyRpc(): string {
    const healthyRpcs = Array.from(this.rpcHealth.values())
      .filter(h => h.isHealthy && h.failCount < this.maxFailCount)
      .sort((a, b) => a.latency - b.latency);

    if (healthyRpcs.length === 0) {
      // If no healthy RPCs, reset fail counts and return the first RPC
      this.resetFailCounts();
      return BSC_MAINNET.rpcUrls.default.http[0];
    }

    return healthyRpcs[0].url;
  }

  public getNextRpc(): string {
    const urls = BSC_MAINNET.rpcUrls.default.http;
    this.currentRpcIndex = (this.currentRpcIndex + 1) % urls.length;
    return urls[this.currentRpcIndex];
  }

  private resetFailCounts(): void {
    this.rpcHealth.forEach(health => {
      health.failCount = 0;
      health.isHealthy = true;
    });
  }

  public cleanup(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}

export const rpcManager = RpcManager.getInstance();