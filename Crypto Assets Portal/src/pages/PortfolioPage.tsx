import React from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { PortfolioOverview } from '@/components/portfolio/PortfolioOverview';

export function PortfolioPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Portfolio</h1>
        <p className="text-muted-foreground">
          Track your cryptocurrency investments and monitor performance
        </p>
      </div>

      <ProtectedRoute>
        <PortfolioOverview />
      </ProtectedRoute>
    </div>
  );
}