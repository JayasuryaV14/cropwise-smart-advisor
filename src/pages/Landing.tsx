import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { Link } from "react-router-dom";
import { Brain, TrendingUp, DollarSign, Download, MapPin, Calendar } from "lucide-react";
import heroImage from "@/assets/hero-farm.jpg";

export default function Landing() {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Recommendations",
      description: "Machine learning analyzes soil, weather, and climate data to suggest the best crops for your land"
    },
    {
      icon: MapPin,
      title: "Location-Based Analysis",
      description: "Get precise recommendations based on your district's specific soil nutrients and weather patterns"
    },
    {
      icon: TrendingUp,
      title: "Yield Predictions",
      description: "Accurate forecasts of expected harvest per hectare to plan your farming operations"
    },
    {
      icon: Calendar,
      title: "Harvest Planning",
      description: "Know exactly when to plant and when to harvest for optimal crop yield and quality"
    },
    {
      icon: DollarSign,
      title: "Market Intelligence",
      description: "Real-time market prices and profit optimization to maximize your agricultural income"
    },
    {
      icon: Download,
      title: "Detailed Reports",
      description: "Download comprehensive crop advisory reports in PDF or CSV format for offline access"
    }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
        <div className="container relative py-24 lg:py-32">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                  Smarter Farming with{" "}
                  <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    AI-Powered
                  </span>{" "}
                  Crop Recommendations
                </h1>
                <p className="text-xl text-muted-foreground">
                  Make data-driven decisions for maximum yield and profitability. Our intelligent system analyzes soil, weather, and market data to recommend the perfect crops for your farm.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="text-lg" asChild>
                  <Link to="/auth">Get Started Free</Link>
                </Button>
                <Button size="lg" variant="outline" className="text-lg">
                  Learn More
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary to-accent opacity-20 blur-3xl" />
              <img
                src={heroImage}
                alt="Modern smart farming with technology"
                className="relative rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-24">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Everything You Need for Smart Farming
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From crop selection to harvest planning, we've got you covered with advanced analytics and actionable insights
          </p>
        </div>
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="border-2 transition-all hover:shadow-lg hover:border-primary/50">
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-24">
        <div className="rounded-2xl bg-gradient-to-br from-primary to-accent p-12 text-center text-primary-foreground shadow-xl">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
            Ready to Transform Your Farming?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of farmers making smarter decisions with AI-powered crop recommendations
          </p>
          <Button size="lg" variant="secondary" className="text-lg" asChild>
            <Link to="/auth">Start Your Free Trial</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="container py-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 CropSmart. Empowering farmers with intelligent agriculture.</p>
        </div>
      </footer>
    </div>
  );
}
