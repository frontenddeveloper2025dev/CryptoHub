import { table, auth } from '@devvai/devv-code-backend';

const CRYPTO_TABLE_ID = 'evmy7kau60w0';
const MARKET_STATS_TABLE_ID = 'evmy7vqsx5vk';

// Initial cryptocurrency data
const initialCryptoData = [
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
  }
];

// Initial market statistics
const initialMarketStats = {
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

export const initializeMarketData = async (email: string, verificationCode: string) => {
  try {
    // Authenticate user first
    const authResponse = await auth.verifyOTP(email, verificationCode);
    console.log('Authenticated successfully:', authResponse.user.email);

    // Add cryptocurrency data
    console.log('Adding cryptocurrency data...');
    for (const crypto of initialCryptoData) {
      await table.addItem(CRYPTO_TABLE_ID, crypto);
      console.log(`Added ${crypto.name} (${crypto.symbol})`);
    }

    // Add market statistics
    console.log('Adding market statistics...');
    await table.addItem(MARKET_STATS_TABLE_ID, initialMarketStats);
    console.log('Market statistics added successfully');

    console.log('Market data initialization completed!');
    return true;
  } catch (error) {
    console.error('Error initializing market data:', error);
    throw error;
  }
};

// Utility function to update prices with random fluctuations
export const simulateMarketUpdate = async () => {
  try {
    const cryptos = await table.getItems(CRYPTO_TABLE_ID, { limit: 20 });
    
    for (const crypto of cryptos.items) {
      const volatility = (Math.random() - 0.5) * 0.1; // -5% to +5%
      const newPrice = crypto.current_price * (1 + volatility);
      const priceChange = ((newPrice - crypto.current_price) / crypto.current_price) * 100;
      
      await table.updateItem(CRYPTO_TABLE_ID, {
        _uid: crypto._uid,
        _id: crypto._id,
        current_price: newPrice,
        price_change_24h: priceChange,
        market_cap: newPrice * crypto.circulating_supply,
        last_updated: new Date().toISOString()
      });
    }
    
    console.log('Market prices updated successfully');
  } catch (error) {
    console.error('Error updating market prices:', error);
  }
};