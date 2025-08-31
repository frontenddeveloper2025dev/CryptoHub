import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { portfolioService, WatchlistItem } from '@/services/portfolio-service';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Bell } from 'lucide-react';

interface SetAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  watchlistItem: WatchlistItem;
}

export function SetAlertModal({ isOpen, onClose, onSuccess, watchlistItem }: SetAlertModalProps) {
  const [targetPrice, setTargetPrice] = useState(
    watchlistItem.target_price?.toString() || ''
  );
  const [alertType, setAlertType] = useState<'above' | 'below' | 'both'>(
    watchlistItem.alert_type || 'above'
  );
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!targetPrice) {
      toast({
        title: "Error",
        description: "Please enter a target price",
        variant: "destructive"
      });
      return;
    }

    const targetPriceNum = parseFloat(targetPrice);
    if (isNaN(targetPriceNum) || targetPriceNum <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid positive price",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoading(true);
      await portfolioService.updateWatchlistAlert(
        watchlistItem.symbol,
        targetPriceNum,
        alertType
      );

      toast({
        title: "Success",
        description: `Price alert set for ${watchlistItem.symbol}`,
      });

      onSuccess();
    } catch (error) {
      console.error('Failed to set alert:', error);
      toast({
        title: "Error",
        description: "Failed to set price alert",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Set Price Alert for {watchlistItem.symbol}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="targetPrice">Target Price (USD)</Label>
            <Input
              id="targetPrice"
              type="number"
              step="any"
              placeholder="0.00"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="alertType">Alert When Price</Label>
            <Select value={alertType} onValueChange={(value: 'above' | 'below' | 'both') => setAlertType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="above">Goes Above Target</SelectItem>
                <SelectItem value="below">Goes Below Target</SelectItem>
                <SelectItem value="both">Crosses Target (Above or Below)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="bg-muted p-3 rounded-lg text-sm">
            <p className="font-medium mb-1">Alert Summary:</p>
            <p className="text-muted-foreground">
              You will be notified when {watchlistItem.symbol} price {' '}
              {alertType === 'above' && 'rises above'} 
              {alertType === 'below' && 'falls below'}
              {alertType === 'both' && 'crosses'} ${targetPrice}
            </p>
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
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Setting...
                </>
              ) : (
                'Set Alert'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}