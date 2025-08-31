import { TrendingUp, Twitter, Github, Linkedin, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export function Footer() {
  const { toast } = useToast();

  const handleLinkClick = (link: string) => {
    toast({
      title: "Feature Coming Soon",
      description: `${link} will be available soon.`,
    });
  };

  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 crypto-gradient rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">CryptoHub</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Professional cryptocurrency trading platform with real-time market data and advanced analytics.
            </p>
            <div className="flex space-x-2">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => handleLinkClick("Twitter")}
              >
                <Twitter className="w-4 h-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => handleLinkClick("GitHub")}
              >
                <Github className="w-4 h-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => handleLinkClick("LinkedIn")}
              >
                <Linkedin className="w-4 h-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => handleLinkClick("Email")}
              >
                <Mail className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Products */}
          <div className="space-y-4">
            <h3 className="font-semibold">Products</h3>
            <div className="space-y-2">
              {['Market Data', 'Portfolio Tracker', 'Price Alerts', 'Trading Tools'].map((item) => (
                <button
                  key={item}
                  className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => handleLinkClick(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="font-semibold">Company</h3>
            <div className="space-y-2">
              {['About Us', 'Careers', 'Press', 'Contact'].map((item) => (
                <button
                  key={item}
                  className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => handleLinkClick(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="font-semibold">Support</h3>
            <div className="space-y-2">
              {['Help Center', 'API Docs', 'Status', 'Security'].map((item) => (
                <button
                  key={item}
                  className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => handleLinkClick(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © 2024 CryptoHub. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
              <button
                key={item}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => handleLinkClick(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}