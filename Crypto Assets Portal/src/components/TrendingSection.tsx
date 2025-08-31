import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Flame, Zap } from 'lucide-react';
import { cryptoService, CryptoCurrency } from '@/services/crypto-service';

export const TrendingSection: React.FC = () => {
  const [trendingData, setTrendingData] = useState<{
    up: CryptoCurrency[];
    down: CryptoCurrency[];
  }>({ up: [], down: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrendingData();
    
    // Update trending data every 2 minutes
    const interval = setInterval(loadTrendingData, 120000);
    return () => clearInterval(interval);
  }, []);

  const loadTrendingData = async () => {
    try {
      const data = await cryptoService.getTrendingCryptos();
      setTrendingData(data);
    } catch (error) {
      console.error('Error loading trending data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-6">Trending Now</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-gray-900 rounded-xl p-6 animate-pulse">
              <div className="h-6 bg-gray-800 rounded mb-4 w-1/2"></div>
              <div className="space-y-3">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="h-16 bg-gray-800 rounded"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
        <Flame className="h-6 w-6 text-orange-400" />
        <span>Trending Now</span>
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trending Up */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <div className="flex items-center space-x-2 mb-4">
            <div className="p-2 bg-green-600/20 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Top Gainers</h3>
          </div>
          
          <div className="space-y-3">
            {trendingData.up.slice(0, 5).map((crypto, index) => (
              <div
                key={crypto.symbol}
                className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-6 h-6 bg-green-600/20 rounded text-green-400 text-xs font-bold">
                    {index + 1}
                  </div>
                  <img
                    src={crypto.image_url}
                    alt={crypto.name}
                    className="w-8 h-8 rounded-full"
                    onError={(e) => {
                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${crypto.symbol}&background=random`;
                    }}
                  />
                  <div>
                    <div className="font-medium text-white">{crypto.symbol}</div>
                    <div className="text-sm text-gray-400">{crypto.name}</div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-white font-medium">
                    {cryptoService.formatPrice(crypto.current_price)}
                  </div>
                  <div className="flex items-center space-x-1 text-green-400 text-sm">
                    <TrendingUp className="h-3 w-3" />
                    <span>{cryptoService.formatPercentage(crypto.price_change_24h)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trending Down */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <div className="flex items-center space-x-2 mb-4">
            <div className="p-2 bg-red-600/20 rounded-lg">
              <TrendingDown className="h-5 w-5 text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Top Losers</h3>
          </div>
          
          <div className="space-y-3">
            {trendingData.down.slice(0, 5).map((crypto, index) => (
              <div
                key={crypto.symbol}
                className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-6 h-6 bg-red-600/20 rounded text-red-400 text-xs font-bold">
                    {index + 1}
                  </div>
                  <img
                    src={crypto.image_url}
                    alt={crypto.name}
                    className="w-8 h-8 rounded-full"
                    onError={(e) => {
                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${crypto.symbol}&background=random`;
                    }}
                  />
                  <div>
                    <div className="font-medium text-white">{crypto.symbol}</div>
                    <div className="text-sm text-gray-400">{crypto.name}</div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-white font-medium">
                    {cryptoService.formatPrice(crypto.current_price)}
                  </div>
                  <div className="flex items-center space-x-1 text-red-400 text-sm">
                    <TrendingDown className="h-3 w-3" />
                    <span>{cryptoService.formatPercentage(crypto.price_change_24h)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="mt-6 bg-gray-900 rounded-xl p-4 border border-gray-800">
        <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
          <div className="flex items-center space-x-2 text-gray-400">
            <Zap className="h-4 w-4" />
            <span>Market Activity:</span>
            <span className="text-white font-medium">High</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400">{trendingData.up.length} Gainers</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
              <span className="text-red-400">{trendingData.down.length} Losers</span>
            </div>
          </div>
          
          <div className="text-gray-400">
            Updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
};