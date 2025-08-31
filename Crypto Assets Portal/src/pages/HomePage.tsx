import { Header } from '@/components/Header';
import { MarketOverview } from '@/components/MarketOverview';
import { CryptoTable } from '@/components/CryptoTable';
import { TrendingSection } from '@/components/TrendingSection';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Shield, Zap, BarChart3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

function HomePage() {
  const { toast } = useToast();

  const handleGetStarted = () => {
    toast({
      title: "Get Started",
      description: "Authentication and registration features coming soon!",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="crypto-gradient text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Professional Crypto Trading Platform
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
            Real-time market data, advanced analytics, and professional trading tools 
            for serious cryptocurrency investors.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-white/90"
              onClick={handleGetStarted}
            >
              <TrendingUp className="w-5 h-5 mr-2" />
              Start Trading
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white/10"
              onClick={() => toast({
                title: "Learn More",
                description: "Educational content coming soon!",
              })}
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose CryptoHub?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Professional-grade tools and features designed for serious traders and investors.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 crypto-gradient rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Real-Time Data</h3>
                <p className="text-muted-foreground">
                  Live market data and price updates from multiple exchanges with millisecond precision.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 crypto-gradient rounded-lg flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Advanced Analytics</h3>
                <p className="text-muted-foreground">
                  Professional charting tools and technical indicators for in-depth market analysis.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 crypto-gradient rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Bank-Grade Security</h3>
                <p className="text-muted-foreground">
                  Multi-layer security with cold storage and advanced encryption protocols.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Market Data Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Live Market Data</h2>
            <p className="text-muted-foreground text-lg">
              Stay updated with real-time cryptocurrency market information.
            </p>
          </div>
          
          <MarketOverview />
          <CryptoTable />
        </div>
      </section>

      {/* Trending Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Market Movers</h2>
            <p className="text-muted-foreground text-lg">
              Discover trending cryptocurrencies and market opportunities.
            </p>
          </div>
          
          <TrendingSection />
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default HomePage 