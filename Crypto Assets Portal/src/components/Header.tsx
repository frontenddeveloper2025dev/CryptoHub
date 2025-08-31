import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SearchDropdown } from '@/components/SearchDropdown';
import { LoginModal } from '@/components/auth/LoginModal';
import { Menu, TrendingUp, User, Moon, Sun, Settings, LogOut, Wallet, Star } from 'lucide-react';
import { cryptoService } from '@/services/crypto-service';
import { useAuthStore } from '@/store/auth-store';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

export function Header() {
  const [isDark, setIsDark] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();
  const { toast } = useToast();

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const handleFeatureClick = (feature: string) => {
    toast({
      title: "Feature Coming Soon",
      description: `${feature} will be available in the next update.`,
    });
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to logout. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 crypto-gradient rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold">CryptoHub</span>
        </Link>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-8">
          <SearchDropdown 
            onCryptoSelect={(crypto) => {
              toast({
                title: `${crypto.name} (${crypto.symbol})`,
                description: `Current price: ${cryptoService.formatPrice(crypto.current_price)}`,
              });
            }}
          />
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/">
            <Button variant="ghost">Market</Button>
          </Link>
          {isAuthenticated ? (
            <>
              <Link to="/portfolio">
                <Button variant="ghost">
                  <Wallet className="w-4 h-4 mr-2" />
                  Portfolio
                </Button>
              </Link>
              <Link to="/watchlist">
                <Button variant="ghost">
                  <Star className="w-4 h-4 mr-2" />
                  Watchlist
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Button 
                variant="ghost" 
                onClick={() => handleFeatureClick("Portfolio")}
              >
                <Wallet className="w-4 h-4 mr-2" />
                Portfolio
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => handleFeatureClick("Watchlist")}
              >
                <Star className="w-4 h-4 mr-2" />
                Watchlist
              </Button>
            </>
          )}
          <Button 
            variant="ghost" 
            onClick={() => handleFeatureClick("News")}
          >
            News
          </Button>
          <Link to="/admin">
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Admin
            </Button>
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <User className="w-4 h-4 mr-2" />
                  {user?.name || user?.email?.split('@')[0] || 'User'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to="/portfolio" className="flex items-center">
                    <Wallet className="w-4 h-4 mr-2" />
                    Portfolio
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/watchlist" className="flex items-center">
                    <Star className="w-4 h-4 mr-2" />
                    Watchlist
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button 
              variant="outline"
              onClick={() => setShowLoginModal(true)}
            >
              <User className="w-4 h-4 mr-2" />
              Login
            </Button>
          )}

          {/* Mobile Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to="/">Market</Link>
              </DropdownMenuItem>
              {isAuthenticated ? (
                <>
                  <DropdownMenuItem asChild>
                    <Link to="/portfolio">Portfolio</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/watchlist">Watchlist</Link>
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem onClick={() => handleFeatureClick("Portfolio")}>
                    Portfolio
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleFeatureClick("Watchlist")}>
                    Watchlist
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuItem onClick={() => handleFeatureClick("News")}>
                News
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)}
      />
    </header>
  );
}