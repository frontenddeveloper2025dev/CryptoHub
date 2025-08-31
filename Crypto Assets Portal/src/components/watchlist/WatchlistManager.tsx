import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { portfolioService, WatchlistItem } from '@/services/portfolio-service';
import { cryptoService } from '@/services/crypto-service';
import { formatCurrency, formatPercent } from '@/lib/utils';
import { Plus, Star, Trash2, Bell, BellOff, Eye } from 'lucide-react';
import { AddToWatchlistModal } from './AddToWatchlistModal';
import { SetAlertModal } from './SetAlertModal';
import { useToast } from '@/hooks/use-toast';

export function WatchlistManager() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [currentPrices, setCurrentPrices] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<WatchlistItem | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadWatchlist();
  }, []);

  const loadWatchlist = async () => {
    try {
      setIsLoading(true);
      const watchlistData = await portfolioService.getWatchlist();
      setWatchlist(watchlistData);

      // Get current prices for all watchlist items
      const prices: Record<string, number> = {};
      for (const item of watchlistData) {
        const cryptoData = await cryptoService.getCryptoBySymbol(item.symbol);
        if (cryptoData.length > 0) {
          prices[item.symbol] = cryptoData[0].price;
        }
      }
      setCurrentPrices(prices);
    } catch (error) {
      console.error('Failed to load watchlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFromWatchlist = async (symbol: string) => {
    try {
      await portfolioService.removeFromWatchlist(symbol);
      toast({
        title: "Removed",
        description: `${symbol} removed from watchlist`,
      });
      loadWatchlist();
    } catch (error) {
      console.error('Failed to remove from watchlist:', error);
      toast({
        title: "Error",
        description: "Failed to remove from watchlist",
        variant: "destructive"
      });
    }
  };

  const handleSetAlert = (item: WatchlistItem) => {
    setSelectedItem(item);
    setShowAlertModal(true);
  };

  const handleWatchlistUpdated = () => {
    loadWatchlist();
    setShowAddModal(false);
    setShowAlertModal(false);
    setSelectedItem(null);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Watchlist
            </CardTitle>
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add to Watchlist
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {watchlist.length === 0 ? (
            <div className="text-center py-8">
              <Eye className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Items in Watchlist</h3>
              <p className="text-muted-foreground mb-4">
                Track your favorite cryptocurrencies and set price alerts.
              </p>
              <Button onClick={() => setShowAddModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Item
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 font-medium">Asset</th>
                    <th className="text-right py-3 font-medium">Current Price</th>
                    <th className="text-right py-3 font-medium">24h Change</th>
                    <th className="text-right py-3 font-medium">Alert Status</th>
                    <th className="text-right py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {watchlist.map((item) => {
                    const currentPrice = currentPrices[item.symbol] || 0;
                    const hasAlert = item.price_alert_enabled === 'true';
                    const change24h = Math.random() * 20 - 10; // Simulated 24h change

                    return (
                      <tr key={item._id} className="border-b hover:bg-muted/50">
                        <td className="py-4">
                          <div>
                            <div className="font-medium">{item.symbol}</div>
                            <div className="text-sm text-muted-foreground">{item.name}</div>
                          </div>
                        </td>
                        <td className="text-right py-4 font-medium">
                          {formatCurrency(currentPrice)}
                        </td>
                        <td className="text-right py-4">
                          <Badge variant={change24h >= 0 ? 'default' : 'destructive'} className="text-xs">
                            {formatPercent(change24h / 100)}
                          </Badge>
                        </td>
                        <td className="text-right py-4">
                          {hasAlert ? (
                            <div className="flex items-center justify-end gap-1">
                              <Bell className="h-4 w-4 text-primary" />
                              <span className="text-sm text-primary">
                                {item.alert_type} {formatCurrency(item.target_price || 0)}
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center justify-end gap-1">
                              <BellOff className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">No Alert</span>
                            </div>
                          )}
                        </td>
                        <td className="text-right py-4">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleSetAlert(item)}
                            >
                              <Bell className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRemoveFromWatchlist(item.symbol)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <AddToWatchlistModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleWatchlistUpdated}
      />

      {selectedItem && (
        <SetAlertModal
          isOpen={showAlertModal}
          onClose={() => {
            setShowAlertModal(false);
            setSelectedItem(null);
          }}
          onSuccess={handleWatchlistUpdated}
          watchlistItem={selectedItem}
        />
      )}
    </div>
  );
}