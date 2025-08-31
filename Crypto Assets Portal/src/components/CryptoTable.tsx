import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Star, StarOff, Search, Filter } from 'lucide-react';
import { cryptoService, CryptoCurrency } from '@/services/crypto-service';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const CryptoTable: React.FC = () => {
  const [cryptos, setCryptos] = useState<CryptoCurrency[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'rank' | 'price' | 'change' | 'market_cap'>('rank');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadCryptos();
    
    // Simulate real-time updates every 30 seconds
    const interval = setInterval(() => {
      setCryptos(prevCryptos => 
        prevCryptos.map(crypto => cryptoService.simulatePriceUpdate(crypto))
      );
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const loadCryptos = async () => {
    try {
      setLoading(true);
      const data = await cryptoService.getCryptocurrencies(20);
      setCryptos(data);
    } catch (error) {
      console.error('Error loading cryptocurrencies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      try {
        const results = await cryptoService.searchCryptocurrencies(query);
        setCryptos(results);
      } catch (error) {
        console.error('Search error:', error);
      }
    } else {
      loadCryptos();
    }
  };

  const toggleFavorite = (symbol: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(symbol)) {
        newFavorites.delete(symbol);
      } else {
        newFavorites.add(symbol);
      }
      return newFavorites;
    });
  };

  const sortedCryptos = [...cryptos].sort((a, b) => {
    let aValue: number, bValue: number;
    
    switch (sortBy) {
      case 'rank':
        aValue = a.rank;
        bValue = b.rank;
        break;
      case 'price':
        aValue = a.current_price;
        bValue = b.current_price;
        break;
      case 'change':
        aValue = a.price_change_24h;
        bValue = b.price_change_24h;
        break;
      case 'market_cap':
        aValue = a.market_cap;
        bValue = b.market_cap;
        break;
      default:
        return 0;
    }

    return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
  });

  if (loading) {
    return (
      <div className="bg-gray-900 rounded-xl p-6 animate-pulse">
        <div className="h-8 bg-gray-800 rounded mb-4 w-1/3"></div>
        {[...Array(10)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-800 rounded mb-2"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-xl overflow-hidden">
      {/* Header with Search and Filters */}
      <div className="p-6 border-b border-gray-800">
        <h2 className="text-2xl font-bold text-white mb-4">Cryptocurrency Markets</h2>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search cryptocurrencies..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-32 bg-gray-800 border-gray-700 text-white">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="rank">Rank</SelectItem>
                <SelectItem value="price">Price</SelectItem>
                <SelectItem value="change">Change</SelectItem>
                <SelectItem value="market_cap">Market Cap</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-800">
            <tr>
              <th className="text-left p-4 text-gray-300 font-medium">#</th>
              <th className="text-left p-4 text-gray-300 font-medium">Name</th>
              <th className="text-right p-4 text-gray-300 font-medium">Price</th>
              <th className="text-right p-4 text-gray-300 font-medium">24h %</th>
              <th className="text-right p-4 text-gray-300 font-medium">7d %</th>
              <th className="text-right p-4 text-gray-300 font-medium">Market Cap</th>
              <th className="text-right p-4 text-gray-300 font-medium">Volume (24h)</th>
              <th className="text-center p-4 text-gray-300 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {sortedCryptos.map((crypto) => (
              <tr
                key={crypto.symbol}
                className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
              >
                <td className="p-4 text-gray-400">{crypto.rank}</td>
                
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={crypto.image_url}
                      alt={crypto.name}
                      className="w-8 h-8 rounded-full"
                      onError={(e) => {
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${crypto.symbol}&background=random`;
                      }}
                    />
                    <div>
                      <div className="font-medium text-white">{crypto.name}</div>
                      <div className="text-sm text-gray-400">{crypto.symbol}</div>
                    </div>
                  </div>
                </td>
                
                <td className="p-4 text-right text-white font-medium">
                  {cryptoService.formatPrice(crypto.current_price)}
                </td>
                
                <td className="p-4 text-right">
                  <div className={`flex items-center justify-end space-x-1 ${
                    crypto.price_change_24h >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {crypto.price_change_24h >= 0 ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    <span>{cryptoService.formatPercentage(crypto.price_change_24h)}</span>
                  </div>
                </td>
                
                <td className="p-4 text-right">
                  <span className={crypto.price_change_7d >= 0 ? 'text-green-400' : 'text-red-400'}>
                    {cryptoService.formatPercentage(crypto.price_change_7d)}
                  </span>
                </td>
                
                <td className="p-4 text-right text-gray-300">
                  {cryptoService.formatMarketCap(crypto.market_cap)}
                </td>
                
                <td className="p-4 text-right text-gray-300">
                  {cryptoService.formatVolume(crypto.volume_24h)}
                </td>
                
                <td className="p-4 text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleFavorite(crypto.symbol)}
                    className="text-gray-400 hover:text-yellow-400"
                  >
                    {favorites.has(crypto.symbol) ? (
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ) : (
                      <StarOff className="h-4 w-4" />
                    )}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="p-4 bg-gray-800/50 text-center text-gray-400 text-sm">
        Data updates every 30 seconds • {cryptos.length} cryptocurrencies shown
      </div>
    </div>
  );
};