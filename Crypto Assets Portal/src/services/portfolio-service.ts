import { table } from '@devvai/devv-code-backend';

export interface PortfolioHolding {
  _id?: string;
  _uid?: string;
  symbol: string;
  quantity: number;
  avg_buy_price: number;
  total_invested: number;
  purchase_date: string;
  notes?: string;
}

export interface Transaction {
  _id?: string;
  _uid?: string;
  symbol: string;
  transaction_type: 'buy' | 'sell';
  quantity: number;
  price: number;
  total_amount: number;
  transaction_date: string;
  fees: number;
  notes?: string;
}

export interface WatchlistItem {
  _id?: string;
  _uid?: string;
  symbol: string;
  name: string;
  added_date: string;
  price_alert_enabled: string;
  target_price?: number;
  alert_type?: 'above' | 'below' | 'both';
}

class PortfolioService {
  private portfolioTableId = 'evn0rhydw0lc';
  private transactionTableId = 'evn0s4tywmio';
  private watchlistTableId = 'evn0rt343f9c';

  // Portfolio Management
  async getPortfolio(): Promise<PortfolioHolding[]> {
    try {
      const response = await table.getItems(this.portfolioTableId, {
        limit: 100,
        sort: '_id',
        order: 'desc'
      });
      return response.items as PortfolioHolding[];
    } catch (error) {
      console.error('Failed to get portfolio:', error);
      return [];
    }
  }

  async addToPortfolio(holding: Omit<PortfolioHolding, '_id' | '_uid'>): Promise<void> {
    try {
      const existingHoldings = await this.getPortfolio();
      const existingHolding = existingHoldings.find(h => h.symbol === holding.symbol);

      if (existingHolding) {
        // Update existing holding - calculate new average price
        const newTotalQuantity = existingHolding.quantity + holding.quantity;
        const newTotalInvested = existingHolding.total_invested + holding.total_invested;
        const newAvgPrice = newTotalInvested / newTotalQuantity;

        await table.updateItem(this.portfolioTableId, {
          _uid: existingHolding._uid,
          _id: existingHolding._id,
          symbol: holding.symbol,
          quantity: newTotalQuantity,
          avg_buy_price: newAvgPrice,
          total_invested: newTotalInvested,
          purchase_date: existingHolding.purchase_date, // Keep original date
          notes: holding.notes || existingHolding.notes
        });
      } else {
        // Add new holding
        await table.addItem(this.portfolioTableId, {
          ...holding,
          purchase_date: new Date().toISOString()
        });
      }

      // Record transaction
      await this.addTransaction({
        symbol: holding.symbol,
        transaction_type: 'buy',
        quantity: holding.quantity,
        price: holding.avg_buy_price,
        total_amount: holding.total_invested,
        transaction_date: new Date().toISOString(),
        fees: 0,
        notes: holding.notes
      });
    } catch (error) {
      console.error('Failed to add to portfolio:', error);
      throw error;
    }
  }

  async removeFromPortfolio(symbol: string, quantity: number, sellPrice: number): Promise<void> {
    try {
      const holdings = await this.getPortfolio();
      const holding = holdings.find(h => h.symbol === symbol);
      
      if (!holding) {
        throw new Error('Holding not found');
      }

      if (quantity >= holding.quantity) {
        // Remove entire holding
        await table.deleteItem(this.portfolioTableId, {
          _uid: holding._uid,
          _id: holding._id
        });
      } else {
        // Reduce quantity
        const newQuantity = holding.quantity - quantity;
        const newTotalInvested = holding.total_invested * (newQuantity / holding.quantity);

        await table.updateItem(this.portfolioTableId, {
          _uid: holding._uid,
          _id: holding._id,
          symbol: holding.symbol,
          quantity: newQuantity,
          avg_buy_price: holding.avg_buy_price,
          total_invested: newTotalInvested,
          purchase_date: holding.purchase_date,
          notes: holding.notes
        });
      }

      // Record sell transaction
      await this.addTransaction({
        symbol: symbol,
        transaction_type: 'sell',
        quantity: quantity,
        price: sellPrice,
        total_amount: quantity * sellPrice,
        transaction_date: new Date().toISOString(),
        fees: 0
      });
    } catch (error) {
      console.error('Failed to remove from portfolio:', error);
      throw error;
    }
  }

  // Transaction History
  async getTransactions(limit: number = 50): Promise<Transaction[]> {
    try {
      const response = await table.getItems(this.transactionTableId, {
        limit,
        sort: '_id',
        order: 'desc'
      });
      return response.items as Transaction[];
    } catch (error) {
      console.error('Failed to get transactions:', error);
      return [];
    }
  }

  async addTransaction(transaction: Omit<Transaction, '_id' | '_uid'>): Promise<void> {
    try {
      await table.addItem(this.transactionTableId, transaction);
    } catch (error) {
      console.error('Failed to add transaction:', error);
      throw error;
    }
  }

  // Watchlist Management
  async getWatchlist(): Promise<WatchlistItem[]> {
    try {
      const response = await table.getItems(this.watchlistTableId, {
        limit: 100,
        sort: '_id',
        order: 'desc'
      });
      return response.items as WatchlistItem[];
    } catch (error) {
      console.error('Failed to get watchlist:', error);
      return [];
    }
  }

  async addToWatchlist(item: Omit<WatchlistItem, '_id' | '_uid' | 'added_date'>): Promise<void> {
    try {
      // Check if already in watchlist
      const watchlist = await this.getWatchlist();
      const exists = watchlist.some(w => w.symbol === item.symbol);
      
      if (exists) {
        throw new Error('Already in watchlist');
      }

      await table.addItem(this.watchlistTableId, {
        ...item,
        added_date: new Date().toISOString(),
        price_alert_enabled: item.price_alert_enabled || 'false'
      });
    } catch (error) {
      console.error('Failed to add to watchlist:', error);
      throw error;
    }
  }

  async removeFromWatchlist(symbol: string): Promise<void> {
    try {
      const watchlist = await this.getWatchlist();
      const item = watchlist.find(w => w.symbol === symbol);
      
      if (!item) {
        throw new Error('Item not found in watchlist');
      }

      await table.deleteItem(this.watchlistTableId, {
        _uid: item._uid,
        _id: item._id
      });
    } catch (error) {
      console.error('Failed to remove from watchlist:', error);
      throw error;
    }
  }

  async updateWatchlistAlert(symbol: string, targetPrice: number, alertType: 'above' | 'below' | 'both'): Promise<void> {
    try {
      const watchlist = await this.getWatchlist();
      const item = watchlist.find(w => w.symbol === symbol);
      
      if (!item) {
        throw new Error('Item not found in watchlist');
      }

      await table.updateItem(this.watchlistTableId, {
        _uid: item._uid,
        _id: item._id,
        symbol: item.symbol,
        name: item.name,
        added_date: item.added_date,
        price_alert_enabled: 'true',
        target_price: targetPrice,
        alert_type: alertType
      });
    } catch (error) {
      console.error('Failed to update watchlist alert:', error);
      throw error;
    }
  }

  // Portfolio Analytics
  calculatePortfolioValue(holdings: PortfolioHolding[], currentPrices: Record<string, number>): {
    totalValue: number;
    totalInvested: number;
    totalProfitLoss: number;
    totalProfitLossPercent: number;
  } {
    let totalValue = 0;
    let totalInvested = 0;

    holdings.forEach(holding => {
      const currentPrice = currentPrices[holding.symbol] || holding.avg_buy_price;
      const holdingValue = holding.quantity * currentPrice;
      
      totalValue += holdingValue;
      totalInvested += holding.total_invested;
    });

    const totalProfitLoss = totalValue - totalInvested;
    const totalProfitLossPercent = totalInvested > 0 ? (totalProfitLoss / totalInvested) * 100 : 0;

    return {
      totalValue,
      totalInvested,
      totalProfitLoss,
      totalProfitLossPercent
    };
  }
}

export const portfolioService = new PortfolioService();