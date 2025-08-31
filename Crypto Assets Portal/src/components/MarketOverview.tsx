import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Activity, DollarSign, BarChart3, Zap } from 'lucide-react';
import { cryptoService, MarketStats } from '@/services/crypto-service';

export const MarketOverview: React.FC = () => {
  const [marketStats, setMarketStats] = useState<MarketStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMarketStats();
    
    // Update market stats every minute
    const interval = setInterval(loadMarketStats, 60000);
    return () => clearInterval(interval);
  }, []);

  const loadMarketStats = async () => {
    try {
      const stats = await cryptoService.getMarketStats();
      setMarketStats(stats);
    } catch (error) {
      console.error('Error loading market stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFearGreedColor = (index: number) => {
    if (index <= 25) return 'text-red-400';
    if (index <= 50) return 'text-orange-400';
    if (index <= 75) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getFearGreedLabel = (index: number) => {
    if (index <= 25) return 'Extreme Fear';
    if (index <= 50) return 'Fear';
    if (index <= 75) return 'Greed';
    return 'Extreme Greed';
  };

  if (loading || !marketStats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-gray-900 rounded-xl p-6 animate-pulse">
            <div className="h-12 bg-gray-800 rounded mb-4"></div>
            <div className="h-8 bg-gray-800 rounded mb-2"></div>
            <div className="h-4 bg-gray-800 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 mb-8">
      {/* Main Market Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Market Cap */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-600/20 rounded-lg">
              <DollarSign className="h-6 w-6 text-blue-400" />
            </div>
            <div className={`flex items-center space-x-1 text-sm ${
              marketStats.market_cap_change_24h >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {marketStats.market_cap_change_24h >= 0 ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span>{cryptoService.formatPercentage(marketStats.market_cap_change_24h)}</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {cryptoService.formatMarketCap(marketStats.total_market_cap)}
          </div>
          <div className="text-gray-400 text-sm">Total Market Cap</div>
        </div>

        {/* 24h Volume */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-600/20 rounded-lg">
              <BarChart3 className="h-6 w-6 text-purple-400" />
            </div>
            <div className="flex items-center space-x-1 text-sm text-gray-400">
              <Activity className="h-4 w-4" />
              <span>24h</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {cryptoService.formatVolume(marketStats.total_volume_24h)}
          </div>
          <div className="text-gray-400 text-sm">Total Volume</div>
        </div>

        {/* Bitcoin Dominance */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-orange-600/20 rounded-lg">
              <img 
                src="https://cryptologos.cc/logos/bitcoin-btc-logo.png" 
                alt="Bitcoin"
                className="h-6 w-6"
              />
            </div>
            <div className="text-sm text-gray-400">BTC</div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {marketStats.bitcoin_dominance.toFixed(1)}%
          </div>
          <div className="text-gray-400 text-sm">Bitcoin Dominance</div>
        </div>

        {/* Fear & Greed Index */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-yellow-600/20 rounded-lg">
              <Zap className="h-6 w-6 text-yellow-400" />
            </div>
            <div className={`text-sm ${getFearGreedColor(marketStats.fear_greed_index)}`}>
              {getFearGreedLabel(marketStats.fear_greed_index)}
            </div>
          </div>
          <div className={`text-2xl font-bold mb-1 ${getFearGreedColor(marketStats.fear_greed_index)}`}>
            {marketStats.fear_greed_index}
          </div>
          <div className="text-gray-400 text-sm">Fear & Greed Index</div>
        </div>
      </div>

      {/* Additional Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Active Cryptocurrencies */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-green-600/20 rounded-lg">
              <Activity className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <div className="text-xl font-bold text-white">
                {marketStats.active_cryptocurrencies.toLocaleString()}
              </div>
              <div className="text-gray-400 text-sm">Active Cryptocurrencies</div>
            </div>
          </div>
        </div>

        {/* Ethereum Dominance */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-blue-600/20 rounded-lg">
              <img 
                src="https://cryptologos.cc/logos/ethereum-eth-logo.png" 
                alt="Ethereum"
                className="h-5 w-5"
              />
            </div>
            <div>
              <div className="text-xl font-bold text-white">
                {marketStats.ethereum_dominance.toFixed(1)}%
              </div>
              <div className="text-gray-400 text-sm">Ethereum Dominance</div>
            </div>
          </div>
        </div>

        {/* Market Update */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-gray-600/20 rounded-lg">
              <Activity className="h-5 w-5 text-gray-400" />
            </div>
            <div>
              <div className="text-sm text-white font-medium">Last Updated</div>
              <div className="text-gray-400 text-sm">
                {new Date(marketStats.last_updated).toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};