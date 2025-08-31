import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AdminPanel } from '@/components/AdminPanel';

function AdminPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold mb-4">Market Data Administration</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Initialize and manage cryptocurrency market data for the platform.
            </p>
          </div>
          
          <AdminPanel />
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default AdminPage;