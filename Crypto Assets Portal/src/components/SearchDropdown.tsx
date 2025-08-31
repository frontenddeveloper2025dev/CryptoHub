import React, { useRef, useEffect } from 'react';
import { Search, Loader2, TrendingUp, TrendingDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cryptoService, CryptoCurrency } from '@/services/crypto-service';
import { useCryptoSearch } from '@/hooks/use-crypto-search';

interface SearchDropdownProps {
  onCryptoSelect?: (crypto: CryptoCurrency) => void;
}

export const SearchDropdown: React.FC<SearchDropdownProps> = ({ onCryptoSelect }) => {
  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    showResults,
    setShowResults,
    clearSearch
  } = useCryptoSearch();

  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setShowResults]);

  const handleCryptoClick = (crypto: CryptoCurrency) => {
    onCryptoSelect?.(crypto);
    clearSearch();
  };

  return (
    <div ref={searchRef} className="relative flex-1 max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search cryptocurrencies..."
          className="pl-10 pr-4"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
        />
        {isSearching && (
          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground" />
        )}
      </div>

      {showResults && searchResults.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
          <div className="p-2 border-b bg-muted/30">
            <div className="text-xs text-muted-foreground font-medium">
              {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for "{searchQuery}"
            </div>
          </div>
          
          {searchResults.map((crypto) => (
            <button
              key={crypto.symbol}
              onClick={() => handleCryptoClick(crypto)}
              className="w-full p-3 text-left hover:bg-muted/50 transition-colors border-b last:border-b-0"
            >
              <div className="flex items-center justify-between">
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
                    <div className="font-medium text-sm">{crypto.name}</div>
                    <div className="text-xs text-muted-foreground">{crypto.symbol}</div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-sm font-medium">
                    {cryptoService.formatPrice(crypto.current_price)}
                  </div>
                  <div className={`flex items-center space-x-1 text-xs ${
                    crypto.price_change_24h >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {crypto.price_change_24h >= 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    <span>{cryptoService.formatPercentage(crypto.price_change_24h)}</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
          
          {searchQuery.length >= 2 && searchResults.length === 0 && !isSearching && (
            <div className="p-4 text-center text-muted-foreground text-sm">
              No cryptocurrencies found for "{searchQuery}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};