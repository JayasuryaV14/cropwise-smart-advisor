import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TrendingUp, Calendar, DollarSign, Droplets, ThermometerSun, Leaf } from "lucide-react";
import { toast } from "sonner";

interface CropRecommendation {
  name: string;
  suitability: number;
  estimatedYield: string;
  harvestDate: string;
  marketPrice: string;
  expectedRevenue: string;
  soilRequirements: string;
  waterNeeds: string;
  temperature: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [recommendations, setRecommendations] = useState<CropRecommendation[]>([]);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
      } else {
        setLoading(false);
      }
    };
    checkAuth();
  }, [navigate]);

  const districts = [
    "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri",
    "Dindigul", "Erode", "Kallakurichi", "Kanchipuram", "Kanyakumari", "Karur",
    "Krishnagiri", "Madurai", "Mayiladuthurai", "Nagapattinam", "Namakkal",
    "Nilgiris", "Perambalur", "Pudukkottai", "Ramanathapuram", "Ranipet",
    "Salem", "Sivaganga", "Tenkasi", "Thanjavur", "Theni", "Thoothukudi",
    "Tiruchirappalli", "Tirunelveli", "Tirupathur", "Tiruppur", "Tiruvallur",
    "Tiruvannamalai", "Tiruvarur", "Vellore", "Viluppuram", "Virudhunagar"
  ];

  const mockRecommendations: CropRecommendation[] = [
    {
      name: "Tomato",
      suitability: 95,
      estimatedYield: "45-55 tonnes/hectare",
      harvestDate: "90-100 days from planting",
      marketPrice: "₹25-35/kg",
      expectedRevenue: "₹11-19 lakhs/hectare",
      soilRequirements: "Well-drained loamy soil, pH 6.0-7.0",
      waterNeeds: "Medium to high (500-800mm)",
      temperature: "20-27°C optimal"
    },
    {
      name: "Chilli",
      suitability: 88,
      estimatedYield: "2-3 tonnes/hectare",
      harvestDate: "150-180 days from planting",
      marketPrice: "₹80-120/kg",
      expectedRevenue: "₹1.6-3.6 lakhs/hectare",
      soilRequirements: "Sandy loam to clay loam, pH 6.5-7.5",
      waterNeeds: "Medium (600-1000mm)",
      temperature: "20-30°C optimal"
    },
    {
      name: "Potato",
      suitability: 82,
      estimatedYield: "25-30 tonnes/hectare",
      harvestDate: "90-120 days from planting",
      marketPrice: "₹15-25/kg",
      expectedRevenue: "₹3.75-7.5 lakhs/hectare",
      soilRequirements: "Well-drained sandy loam, pH 5.5-6.5",
      waterNeeds: "Medium (500-700mm)",
      temperature: "15-25°C optimal"
    }
  ];

  const handleDistrictChange = (value: string) => {
    setSelectedDistrict(value);
    setRecommendations(mockRecommendations);
    toast.success(`Analyzing data for ${value} district...`);
  };

  const getSuitabilityColor = (score: number) => {
    if (score >= 90) return "bg-primary text-primary-foreground";
    if (score >= 80) return "bg-accent text-accent-foreground";
    return "bg-secondary text-secondary-foreground";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="container py-8">
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Crop Recommendations</h1>
            <p className="text-muted-foreground mt-2">
              AI-powered analysis based on your location's soil and weather conditions
            </p>
          </div>

          {/* District Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Your District</CardTitle>
              <CardDescription>
                Choose your district to get personalized crop recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={selectedDistrict} onValueChange={handleDistrictChange}>
                <SelectTrigger className="w-full md:w-96">
                  <SelectValue placeholder="Select a district" />
                </SelectTrigger>
                <SelectContent>
                  {districts.map((district) => (
                    <SelectItem key={district} value={district}>
                      {district}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Top Recommendations</h2>
                  <p className="text-muted-foreground">
                    Based on {selectedDistrict} district's soil and climate data
                  </p>
                </div>
                <Button variant="outline">Download Report</Button>
              </div>

              <div className="grid gap-6">
                {recommendations.map((crop, index) => (
                  <Card key={index} className="border-2 hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-2xl">{crop.name}</CardTitle>
                          <CardDescription>Rank #{index + 1}</CardDescription>
                        </div>
                        <Badge className={getSuitabilityColor(crop.suitability)}>
                          {crop.suitability}% Suitable
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                            <TrendingUp className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Estimated Yield</p>
                            <p className="text-sm text-muted-foreground">{crop.estimatedYield}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                            <Calendar className="h-5 w-5 text-accent" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Harvest Time</p>
                            <p className="text-sm text-muted-foreground">{crop.harvestDate}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10">
                            <DollarSign className="h-5 w-5 text-secondary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Market Price</p>
                            <p className="text-sm text-muted-foreground">{crop.marketPrice}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                            <Leaf className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Soil Requirements</p>
                            <p className="text-sm text-muted-foreground">{crop.soilRequirements}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                            <Droplets className="h-5 w-5 text-accent" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Water Needs</p>
                            <p className="text-sm text-muted-foreground">{crop.waterNeeds}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10">
                            <ThermometerSun className="h-5 w-5 text-secondary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Temperature</p>
                            <p className="text-sm text-muted-foreground">{crop.temperature}</p>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div className="bg-primary/5 rounded-lg p-4">
                        <p className="font-semibold text-primary mb-1">Expected Revenue</p>
                        <p className="text-2xl font-bold">{crop.expectedRevenue}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {selectedDistrict && recommendations.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">Analyzing data for your district...</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
