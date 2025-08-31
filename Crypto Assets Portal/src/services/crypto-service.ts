import { table } from '@devvai/devv-code-backend';

export interface CryptoCurrency {
  _id: string;
  _uid: string;
  _tid: string;
  symbol: string;
  name: string;
  current_price: number;
  market_cap: number;
  volume_24h: number;
  price_change_24h: number;
  price_change_7d: number;
  circulating_supply: number;
  total_supply?: number;
  ath: number;
  atl: number;
  image_url: string;
  rank: number;
  last_updated: string;
}

// Alias for compatibility with portfolio components
export interface CryptoData {
  symbol: string;
  name: string;
  price: number;
}

export interface MarketStats {
  _id: string;
  _uid: string;
  _tid: string;
  total_market_cap: number;
  total_volume_24h: number;
  bitcoin_dominance: number;
  ethereum_dominance: number;
  active_cryptocurrencies: number;
  market_cap_change_24h: number;
  trending_up: string;
  trending_down: string;
  fear_greed_index: number;
  last_updated: string;
}

class CryptoService {
  private readonly CRYPTO_TABLE_ID = 'evmy7kau60w0';
  private readonly MARKET_STATS_TABLE_ID = 'evmy7vqsx5vk';

  // Mock data for demonstration - in real app this would come from external API
  private mockCryptoData: Omit<CryptoCurrency, '_id' | '_uid' | '_tid'>[] = [
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      current_price: 67234.56,
      market_cap: 1320000000000,
      volume_24h: 28500000000,
      price_change_24h: 2.34,
      price_change_7d: -1.23,
      circulating_supply: 19654218,
      total_supply: 21000000,
      ath: 73750.07,
      atl: 67.81,
      image_url: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
      rank: 1,
      last_updated: new Date().toISOString()
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      current_price: 3456.78,
      market_cap: 416000000000,
      volume_24h: 15200000000,
      price_change_24h: 1.87,
      price_change_7d: 4.12,
      circulating_supply: 120280000,
      ath: 4878.26,
      atl: 0.43,
      image_url: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
      rank: 2,
      last_updated: new Date().toISOString()
    },
    {
      symbol: 'BNB',
      name: 'BNB',
      current_price: 598.45,
      market_cap: 87500000000,
      volume_24h: 1800000000,
      price_change_24h: -0.67,
      price_change_7d: 2.89,
      circulating_supply: 146267068,
      total_supply: 200000000,
      ath: 686.31,
      atl: 0.10,
      image_url: 'https://cryptologos.cc/logos/bnb-bnb-logo.png',
      rank: 3,
      last_updated: new Date().toISOString()
    },
    {
      symbol: 'SOL',
      name: 'Solana',
      current_price: 189.23,
      market_cap: 89200000000,
      volume_24h: 3200000000,
      price_change_24h: 5.67,
      price_change_7d: 12.34,
      circulating_supply: 471000000,
      ath: 259.96,
      atl: 0.50,
      image_url: 'https://cryptologos.cc/logos/solana-sol-logo.png',
      rank: 4,
      last_updated: new Date().toISOString()
    },
    {
      symbol: 'XRP',
      name: 'Ripple',
      current_price: 0.5234,
      market_cap: 29800000000,
      volume_24h: 1100000000,
      price_change_24h: -2.14,
      price_change_7d: -0.89,
      circulating_supply: 56925600000,
      total_supply: 99987000000,
      ath: 3.40,
      atl: 0.002802,
      image_url: 'https://cryptologos.cc/logos/xrp-xrp-logo.png',
      rank: 5,
      last_updated: new Date().toISOString()
    },
    {
      symbol: 'USDC',
      name: 'USD Coin',
      current_price: 1.00,
      market_cap: 34500000000,
      volume_24h: 5600000000,
      price_change_24h: 0.01,
      price_change_7d: -0.02,
      circulating_supply: 34500000000,
      ath: 1.17,
      atl: 0.877,
      image_url: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png',
      rank: 6,
      last_updated: new Date().toISOString()
    },
    {
      symbol: 'ADA',
      name: 'Cardano',
      current_price: 0.4567,
      market_cap: 16200000000,
      volume_24h: 890000000,
      price_change_24h: 1.23,
      price_change_7d: -3.45,
      circulating_supply: 35482000000,
      total_supply: 45000000000,
      ath: 3.09,
      atl: 0.017354,
      image_url: 'https://cryptologos.cc/logos/cardano-ada-logo.png',
      rank: 7,
      last_updated: new Date().toISOString()
    },
    {
      symbol: 'DOGE',
      name: 'Dogecoin',
      current_price: 0.1234,
      market_cap: 18100000000,
      volume_24h: 1400000000,
      price_change_24h: 3.45,
      price_change_7d: 8.92,
      circulating_supply: 146700000000,
      ath: 0.738,
      atl: 0.00008547,
      image_url: 'https://cryptologos.cc/logos/dogecoin-doge-logo.png',
      rank: 8,
      last_updated: new Date().toISOString()
    },
    {
      symbol: 'TRX',
      name: 'TRON',
      current_price: 0.1678,
      market_cap: 14500000000,
      volume_24h: 750000000,
      price_change_24h: -1.56,
      price_change_7d: 2.78,
      circulating_supply: 86400000000,
      ath: 0.231,
      atl: 0.00180434,
      image_url: 'https://cryptologos.cc/logos/tron-trx-logo.png',
      rank: 9,
      last_updated: new Date().toISOString()
    },
    {
      symbol: 'AVAX',
      name: 'Avalanche',
      current_price: 34.56,
      market_cap: 13800000000,
      volume_24h: 560000000,
      price_change_24h: 2.89,
      price_change_7d: -4.67,
      circulating_supply: 400000000,
      total_supply: 720000000,
      ath: 146.22,
      atl: 2.79,
      image_url: 'https://cryptologos.cc/logos/avalanche-avax-logo.png',
      rank: 10,
      last_updated: new Date().toISOString()
    }
  ];

  private mockMarketStats: Omit<MarketStats, '_id' | '_uid' | '_tid'> = {
    total_market_cap: 2340000000000,
    total_volume_24h: 89500000000,
    bitcoin_dominance: 56.4,
    ethereum_dominance: 17.8,
    active_cryptocurrencies: 13847,
    market_cap_change_24h: 1.23,
    trending_up: JSON.stringify(['SOL', 'DOGE', 'AVAX']),
    trending_down: JSON.stringify(['XRP', 'TRX', 'ADA']),
    fear_greed_index: 68,
    last_updated: new Date().toISOString()
  };

  async getCryptocurrencies(limit: number = 10): Promise<CryptoCurrency[]> {
    try {
      const response = await table.getItems(this.CRYPTO_TABLE_ID, {
        limit,
        sort: 'rank',
        order: 'asc'
      });
      return response.items as CryptoCurrency[];
    } catch (error) {
      console.log('No data found, using mock data');
      return this.mockCryptoData.slice(0, limit).map((crypto, index) => ({
        ...crypto,
        _id: `crypto_${index}`,
        _uid: 'system',
        _tid: this.CRYPTO_TABLE_ID
      }));
    }
  }

  async getMarketStats(): Promise<MarketStats> {
    try {
      const response = await table.getItems(this.MARKET_STATS_TABLE_ID, { limit: 1 });
      return response.items[0] as MarketStats;
    } catch (error) {
      console.log('No market stats found, using mock data');
      return {
        ...this.mockMarketStats,
        _id: 'stats_1',
        _uid: 'system',
        _tid: this.MARKET_STATS_TABLE_ID
      };
    }
  }

  async searchCryptocurrencies(query: string): Promise<CryptoCurrency[]> {
    const allCryptos = await this.getCryptocurrencies(50);
    const searchTerm = query.toLowerCase();
    
    return allCryptos.filter(crypto => 
      crypto.name.toLowerCase().includes(searchTerm) ||
      crypto.symbol.toLowerCase().includes(searchTerm)
    );
  }

  async getTrendingCryptos(): Promise<{ up: CryptoCurrency[], down: CryptoCurrency[] }> {
    const stats = await this.getMarketStats();
    const allCryptos = await this.getCryptocurrencies(50);
    
    const trendingUpSymbols = JSON.parse(stats.trending_up);
    const trendingDownSymbols = JSON.parse(stats.trending_down);
    
    const up = allCryptos.filter(crypto => trendingUpSymbols.includes(crypto.symbol));
    const down = allCryptos.filter(crypto => trendingDownSymbols.includes(crypto.symbol));
    
    return { up, down };
  }

  formatPrice(price: number): string {
    if (price >= 1) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(price);
    } else {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 6,
        maximumFractionDigits: 6
      }).format(price);
    }
  }

  formatMarketCap(marketCap: number): string {
    if (marketCap >= 1e12) {
      return `$${(marketCap / 1e12).toFixed(2)}T`;
    } else if (marketCap >= 1e9) {
      return `$${(marketCap / 1e9).toFixed(2)}B`;
    } else if (marketCap >= 1e6) {
      return `$${(marketCap / 1e6).toFixed(2)}M`;
    } else {
      return `$${marketCap.toLocaleString()}`;
    }
  }

  formatVolume(volume: number): string {
    return this.formatMarketCap(volume);
  }

  formatPercentage(percentage: number): string {
    const sign = percentage >= 0 ? '+' : '';
    return `${sign}${percentage.toFixed(2)}%`;
  }

  // New methods for portfolio and watchlist functionality
  async getAllCryptos(): Promise<CryptoData[]> {
    const cryptos = await this.getCryptocurrencies(50);
    return cryptos.map(crypto => ({
      symbol: crypto.symbol,
      name: crypto.name,
      price: crypto.current_price
    }));
  }

  async getCryptoBySymbol(symbol: string): Promise<CryptoData[]> {
    const allCryptos = await this.getAllCryptos();
    return allCryptos.filter(crypto => crypto.symbol === symbol);
  }

  // Simulate real-time price updates
  simulatePriceUpdate(crypto: CryptoCurrency): CryptoCurrency {
    const volatility = Math.random() * 0.1 - 0.05; // -5% to +5% change
    const newPrice = crypto.current_price * (1 + volatility);
    const priceChange = ((newPrice - crypto.current_price) / crypto.current_price) * 100;
    
    return {
      ...crypto,
      current_price: newPrice,
      price_change_24h: priceChange,
      market_cap: newPrice * crypto.circulating_supply,
      last_updated: new Date().toISOString()
    };
  }
}

export const cryptoService = new CryptoService();