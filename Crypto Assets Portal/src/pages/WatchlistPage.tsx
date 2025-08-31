import React from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { WatchlistManager } from '@/components/watchlist/WatchlistManager';

export function WatchlistPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Watchlist</h1>
        <p className="text-muted-foreground">
          Monitor your favorite cryptocurrencies and set price alerts
        </p>
      </div>

      <ProtectedRoute>
        <WatchlistManager />
      </ProtectedRoute>
    </div>
  );
}