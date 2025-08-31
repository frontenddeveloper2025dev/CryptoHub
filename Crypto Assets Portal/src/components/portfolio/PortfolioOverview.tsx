import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { portfolioService, PortfolioHolding } from '@/services/portfolio-service';
import { cryptoService } from '@/services/crypto-service';
import { formatCurrency, formatPercent } from '@/lib/utils';
import { Plus, TrendingUp, TrendingDown, DollarSign, PieChart } from 'lucide-react';
import { AddHoldingModal } from './AddHoldingModal';

export function PortfolioOverview() {
  const [holdings, setHoldings] = useState<PortfolioHolding[]>([]);
  const [currentPrices, setCurrentPrices] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    loadPortfolio();
  }, []);

  const loadPortfolio = async () => {
    try {
      setIsLoading(true);
      const portfolioData = await portfolioService.getPortfolio();
      setHoldings(portfolioData);

      // Get current prices for all holdings
      const prices: Record<string, number> = {};
      for (const holding of portfolioData) {
        const cryptoData = await cryptoService.getCryptoBySymbol(holding.symbol);
        if (cryptoData.length > 0) {
          prices[holding.symbol] = cryptoData[0].price;
        }
      }
      setCurrentPrices(prices);
    } catch (error) {
      console.error('Failed to load portfolio:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const portfolioStats = portfolioService.calculatePortfolioValue(holdings, currentPrices);

  const handleAddHolding = () => {
    setShowAddModal(true);
  };

  const handleHoldingAdded = () => {
    loadPortfolio();
    setShowAddModal(false);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                  <div className="h-8 bg-muted rounded w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-muted rounded"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Portfolio Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Value</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(portfolioStats.totalValue)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Invested</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(portfolioStats.totalInvested)}
                </p>
              </div>
              <PieChart className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Profit/Loss</p>
                <p className={`text-2xl font-bold ${
                  portfolioStats.totalProfitLoss >= 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {formatCurrency(portfolioStats.totalProfitLoss)}
                </p>
                <p className={`text-sm ${
                  portfolioStats.totalProfitLoss >= 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {formatPercent(portfolioStats.totalProfitLossPercent / 100)}
                </p>
              </div>
              {portfolioStats.totalProfitLoss >= 0 ? (
                <TrendingUp className="h-8 w-8 text-green-500" />
              ) : (
                <TrendingDown className="h-8 w-8 text-red-500" />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Holdings Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Your Holdings</CardTitle>
            <Button onClick={handleAddHolding}>
              <Plus className="h-4 w-4 mr-2" />
              Add Holding
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {holdings.length === 0 ? (
            <div className="text-center py-8">
              <PieChart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Holdings Yet</h3>
              <p className="text-muted-foreground mb-4">
                Start building your portfolio by adding your first cryptocurrency holding.
              </p>
              <Button onClick={handleAddHolding}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Holding
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 font-medium">Asset</th>
                    <th className="text-right py-3 font-medium">Quantity</th>
                    <th className="text-right py-3 font-medium">Avg Buy Price</th>
                    <th className="text-right py-3 font-medium">Current Price</th>
                    <th className="text-right py-3 font-medium">Total Value</th>
                    <th className="text-right py-3 font-medium">P&L</th>
                  </tr>
                </thead>
                <tbody>
                  {holdings.map((holding) => {
                    const currentPrice = currentPrices[holding.symbol] || holding.avg_buy_price;
                    const currentValue = holding.quantity * currentPrice;
                    const profitLoss = currentValue - holding.total_invested;
                    const profitLossPercent = (profitLoss / holding.total_invested) * 100;

                    return (
                      <tr key={holding._id} className="border-b hover:bg-muted/50">
                        <td className="py-4">
                          <div className="font-medium">{holding.symbol}</div>
                        </td>
                        <td className="text-right py-4">
                          {holding.quantity.toFixed(8)}
                        </td>
                        <td className="text-right py-4">
                          {formatCurrency(holding.avg_buy_price)}
                        </td>
                        <td className="text-right py-4">
                          {formatCurrency(currentPrice)}
                        </td>
                        <td className="text-right py-4 font-medium">
                          {formatCurrency(currentValue)}
                        </td>
                        <td className="text-right py-4">
                          <div className={profitLoss >= 0 ? 'text-green-500' : 'text-red-500'}>
                            <div className="font-medium">
                              {formatCurrency(profitLoss)}
                            </div>
                            <Badge variant={profitLoss >= 0 ? 'default' : 'destructive'} className="text-xs">
                              {formatPercent(profitLossPercent / 100)}
                            </Badge>
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

      <AddHoldingModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleHoldingAdded}
      />
    </div>
  );
}