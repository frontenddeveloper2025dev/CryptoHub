import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { portfolioService } from '@/services/portfolio-service';
import { cryptoService, CryptoData } from '@/services/crypto-service';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Star } from 'lucide-react';

interface AddToWatchlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddToWatchlistModal({ isOpen, onClose, onSuccess }: AddToWatchlistModalProps) {
  const [cryptos, setCryptos] = useState<CryptoData[]>([]);
  const [selectedSymbol, setSelectedSymbol] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCryptos, setIsLoadingCryptos] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      loadCryptos();
    }
  }, [isOpen]);

  const loadCryptos = async () => {
    try {
      setIsLoadingCryptos(true);
      const cryptoData = await cryptoService.getAllCryptos();
      setCryptos(cryptoData);
    } catch (error) {
      console.error('Failed to load cryptocurrencies:', error);
      toast({
        title: "Error",
        description: "Failed to load cryptocurrency list",
        variant: "destructive"
      });
    } finally {
      setIsLoadingCryptos(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedSymbol) {
      toast({
        title: "Error",
        description: "Please select a cryptocurrency",
        variant: "destructive"
      });
      return;
    }

    const selectedCrypto = cryptos.find(c => c.symbol === selectedSymbol);
    if (!selectedCrypto) {
      toast({
        title: "Error",
        description: "Selected cryptocurrency not found",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoading(true);
      await portfolioService.addToWatchlist({
        symbol: selectedCrypto.symbol,
        name: selectedCrypto.name,
        price_alert_enabled: 'false'
      });

      toast({
        title: "Success",
        description: `${selectedCrypto.symbol} added to watchlist`,
      });

      setSelectedSymbol('');
      onSuccess();
    } catch (error: any) {
      console.error('Failed to add to watchlist:', error);
      if (error.message === 'Already in watchlist') {
        toast({
          title: "Info",
          description: `${selectedCrypto.symbol} is already in your watchlist`,
          variant: "default"
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to add to watchlist",
          variant: "destructive"
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Add to Watchlist
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="symbol">Select Cryptocurrency</Label>
            <Select value={selectedSymbol} onValueChange={setSelectedSymbol} disabled={isLoadingCryptos}>
              <SelectTrigger>
                <SelectValue placeholder={isLoadingCryptos ? "Loading..." : "Choose cryptocurrency to watch"} />
              </SelectTrigger>
              <SelectContent>
                {cryptos.map((crypto) => (
                  <SelectItem key={crypto.symbol} value={crypto.symbol}>
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{crypto.symbol}</span>
                        <span className="text-muted-foreground">{crypto.name}</span>
                      </div>
                      <span className="text-sm font-medium">
                        ${crypto.price.toLocaleString()}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || isLoadingCryptos} className="flex-1">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add to Watchlist'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}