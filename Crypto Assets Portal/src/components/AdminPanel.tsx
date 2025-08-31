import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { initializeMarketData, simulateMarketUpdate } from '@/utils/market-data-initializer';
import { useToast } from '@/hooks/use-toast';

export const AdminPanel: React.FC = () => {
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const { toast } = useToast();

  const handleInitializeData = async () => {
    if (!email || !verificationCode) {
      toast({
        title: "Missing Information",
        description: "Please provide both email and verification code.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      await initializeMarketData(email, verificationCode);
      setInitialized(true);
      toast({
        title: "Success!",
        description: "Market data has been initialized successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to initialize market data. Please check your credentials.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePrices = async () => {
    setLoading(true);
    try {
      await simulateMarketUpdate();
      toast({
        title: "Updated!",
        description: "Market prices have been updated with simulated changes.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update market prices.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Database className="h-5 w-5" />
          <span>Market Data Admin</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!initialized && (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Verification Code</label>
              <Input
                type="text"
                placeholder="123456"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
              />
            </div>
            
            <Button
              onClick={handleInitializeData}
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Database className="h-4 w-4 mr-2" />
              )}
              Initialize Market Data
            </Button>
          </>
        )}

        {initialized && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <span className="text-sm font-medium">Data Initialized</span>
            </div>
            
            <Button
              onClick={handleUpdatePrices}
              disabled={loading}
              variant="outline"
              className="w-full"
            >
              {loading ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Simulate Price Updates
            </Button>
          </div>
        )}

        <div className="text-xs text-muted-foreground bg-muted p-3 rounded">
          <div className="flex items-start space-x-2">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <div>
              This admin panel is for development purposes. It initializes the database 
              with sample cryptocurrency data and enables real-time price simulations.
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};