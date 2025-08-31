import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { portfolioService } from '@/services/portfolio-service';
import { cryptoService, CryptoData } from '@/services/crypto-service';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus } from 'lucide-react';

interface AddHoldingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddHoldingModal({ isOpen, onClose, onSuccess }: AddHoldingModalProps) {
  const [cryptos, setCryptos] = useState<CryptoData[]>([]);
  const [selectedSymbol, setSelectedSymbol] = useState('');
  const [quantity, setQuantity] = useState('');
  const [buyPrice, setBuyPrice] = useState('');
  const [notes, setNotes] = useState('');
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
    
    if (!selectedSymbol || !quantity || !buyPrice) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const quantityNum = parseFloat(quantity);
    const buyPriceNum = parseFloat(buyPrice);

    if (isNaN(quantityNum) || isNaN(buyPriceNum) || quantityNum <= 0 || buyPriceNum <= 0) {
      toast({
        title: "Error",
        description: "Please enter valid positive numbers",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoading(true);
      await portfolioService.addToPortfolio({
        symbol: selectedSymbol,
        quantity: quantityNum,
        avg_buy_price: buyPriceNum,
        total_invested: quantityNum * buyPriceNum,
        purchase_date: new Date().toISOString(),
        notes: notes.trim() || undefined
      });

      toast({
        title: "Success",
        description: `Added ${quantity} ${selectedSymbol} to your portfolio`,
      });

      // Reset form
      setSelectedSymbol('');
      setQuantity('');
      setBuyPrice('');
      setNotes('');
      
      onSuccess();
    } catch (error) {
      console.error('Failed to add holding:', error);
      toast({
        title: "Error",
        description: "Failed to add holding to portfolio",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSymbolChange = (symbol: string) => {
    setSelectedSymbol(symbol);
    // Auto-fill current price as buy price
    const crypto = cryptos.find(c => c.symbol === symbol);
    if (crypto) {
      setBuyPrice(crypto.price.toString());
    }
  };

  const calculateTotal = () => {
    const quantityNum = parseFloat(quantity);
    const buyPriceNum = parseFloat(buyPrice);
    if (!isNaN(quantityNum) && !isNaN(buyPriceNum)) {
      return (quantityNum * buyPriceNum).toFixed(2);
    }
    return '0.00';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add to Portfolio
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="symbol">Cryptocurrency *</Label>
            <Select value={selectedSymbol} onValueChange={handleSymbolChange} disabled={isLoadingCryptos}>
              <SelectTrigger>
                <SelectValue placeholder={isLoadingCryptos ? "Loading..." : "Select cryptocurrency"} />
              </SelectTrigger>
              <SelectContent>
                {cryptos.map((crypto) => (
                  <SelectItem key={crypto.symbol} value={crypto.symbol}>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{crypto.symbol}</span>
                      <span className="text-muted-foreground">{crypto.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                step="any"
                placeholder="0.00"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="buyPrice">Buy Price (USD) *</Label>
              <Input
                id="buyPrice"
                type="number"
                step="any"
                placeholder="0.00"
                value={buyPrice}
                onChange={(e) => setBuyPrice(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Total Investment</Label>
            <div className="text-lg font-semibold text-primary">
              ${calculateTotal()}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any notes about this investment..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={isLoading}
              rows={3}
            />
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
                'Add to Portfolio'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}