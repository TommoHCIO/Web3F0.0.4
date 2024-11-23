import { BSC_CONSTANTS } from '../utils/constants';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

interface TransactionReceipt {
  status: string;
  message: string;
  result: {
    status: string;
    blockHash: string;
    blockNumber: string;
    contractAddress: string | null;
    cumulativeGasUsed: string;
    from: string;
    gasUsed: string;
    logs: any[];
    logsBloom: string;
    to: string;
    transactionHash: string;
    transactionIndex: string;
  };
}

interface Transaction {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  from: string;
  to: string;
  value: string;
  contractAddress: string;
  tokenName: string;
  tokenSymbol: string;
  tokenDecimal: string;
  transactionIndex: string;
  gas: string;
  gasPrice: string;
  gasUsed: string;
  cumulativeGasUsed: string;
  input: string;
  confirmations: string;
}

class BscScanService {
  private static instance: BscScanService;
  private cache: Map<string, CacheEntry<any>>;
  private lastRequestTime: number;
  private readonly apiKey: string;
  private readonly baseUrl: string;

  private constructor() {
    this.cache = new Map();
    this.lastRequestTime = 0;
    this.apiKey = BSC_CONSTANTS.BSCSCAN_API_KEY;
    this.baseUrl = BSC_CONSTANTS.BSCSCAN_API_URL;
  }

  public static getInstance(): BscScanService {
    if (!BscScanService.instance) {
      BscScanService.instance = new BscScanService();
    }
    return BscScanService.instance;
  }

  private async waitForRateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < BSC_CONSTANTS.REQUEST_INTERVAL) {
      await new Promise(resolve => 
        setTimeout(resolve, BSC_CONSTANTS.REQUEST_INTERVAL - timeSinceLastRequest)
      );
    }
    
    this.lastRequestTime = Date.now();
  }

  private getCacheKey(module: string, action: string, identifier: string): string {
    return `${module}-${action}-${identifier}`;
  }

  private async makeRequest<T>(params: Record<string, string>): Promise<T> {
    await this.waitForRateLimit();

    const queryParams = new URLSearchParams({
      ...params,
      apikey: this.apiKey
    });

    const response = await fetch(`${this.baseUrl}?${queryParams}`);
    
    if (!response.ok) {
      throw new Error(`BSCScan API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.status === '0' && data.message === 'NOTOK') {
      throw new Error(data.result);
    }

    return data.result;
  }

  public async getTransactionReceipt(txHash: string): Promise<TransactionReceipt> {
    const cacheKey = this.getCacheKey('transaction', 'gettxreceiptstatus', txHash);
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < BSC_CONSTANTS.CACHE_DURATION) {
      return cached.data;
    }

    const result = await this.makeRequest<TransactionReceipt>({
      module: 'transaction',
      action: 'gettxreceiptstatus',
      txhash: txHash,
    });

    this.cache.set(cacheKey, {
      data: result,
      timestamp: Date.now(),
    });

    return result;
  }

  public async getTransactionHistory(
    address: string,
    startBlock: string = '0',
    endBlock: string = '999999999',
    page: string = '1',
    offset: string = '100',
    sort: 'asc' | 'desc' = 'desc'
  ): Promise<Transaction[]> {
    const cacheKey = this.getCacheKey('account', 'txlist', `${address}-${page}`);
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < BSC_CONSTANTS.CACHE_DURATION) {
      return cached.data;
    }

    const result = await this.makeRequest<Transaction[]>({
      module: 'account',
      action: 'txlist',
      address,
      startblock: startBlock,
      endblock: endBlock,
      page,
      offset,
      sort,
    });

    this.cache.set(cacheKey, {
      data: result,
      timestamp: Date.now(),
    });

    return result;
  }

  public async getTokenTransactions(
    contractAddress: string,
    address: string,
    startBlock: string = '0',
    endBlock: string = '999999999',
    page: string = '1',
    offset: string = '100'
  ): Promise<Transaction[]> {
    const cacheKey = this.getCacheKey('account', 'tokentx', `${address}-${contractAddress}-${page}`);
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < BSC_CONSTANTS.CACHE_DURATION) {
      return cached.data;
    }

    const result = await this.makeRequest<Transaction[]>({
      module: 'account',
      action: 'tokentx',
      contractaddress: contractAddress,
      address,
      startblock: startBlock,
      endblock: endBlock,
      page,
      offset,
    });

    this.cache.set(cacheKey, {
      data: result,
      timestamp: Date.now(),
    });

    return result;
  }

  public async getTokenBalance(
    contractAddress: string,
    address: string
  ): Promise<string> {
    const cacheKey = this.getCacheKey('account', 'tokenbalance', `${address}-${contractAddress}`);
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < BSC_CONSTANTS.CACHE_DURATION) {
      return cached.data;
    }

    const result = await this.makeRequest<string>({
      module: 'account',
      action: 'tokenbalance',
      contractaddress: contractAddress,
      address,
      tag: 'latest',
    });

    this.cache.set(cacheKey, {
      data: result,
      timestamp: Date.now(),
    });

    return result;
  }

  public async getNormalTransactions(
    address: string,
    toAddress?: string
  ): Promise<Transaction[]> {
    const cacheKey = this.getCacheKey('account', 'txlist', `${address}-${toAddress || 'all'}`);
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < BSC_CONSTANTS.CACHE_DURATION) {
      return cached.data;
    }

    const params: Record<string, string> = {
      module: 'account',
      action: 'txlist',
      address,
      startblock: '0',
      endblock: '999999999',
      page: '1',
      offset: '100',
      sort: 'desc',
    };

    if (toAddress) {
      params.toaddress = toAddress;
    }

    const result = await this.makeRequest<Transaction[]>(params);

    this.cache.set(cacheKey, {
      data: result,
      timestamp: Date.now(),
    });

    return result;
  }
}

export const bscScanService = BscScanService.getInstance();