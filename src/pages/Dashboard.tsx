import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { CropRecommendation } from "@/types/crop";
import { CropSelector } from "@/components/CropSelector";
import { ParameterAdjustment } from "@/components/ParameterAdjustment";

type ViewMode = "district" | "crops" | "detail";

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [recommendations, setRecommendations] = useState<CropRecommendation[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("district");
  const [selectedCrop, setSelectedCrop] = useState<CropRecommendation | null>(null);

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
    // Vegetables
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
      suitability: 92,
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
      suitability: 89,
      estimatedYield: "25-30 tonnes/hectare",
      harvestDate: "90-120 days from planting",
      marketPrice: "₹15-25/kg",
      expectedRevenue: "₹3.75-7.5 lakhs/hectare",
      soilRequirements: "Well-drained sandy loam, pH 5.5-6.5",
      waterNeeds: "Medium (500-700mm)",
      temperature: "15-25°C optimal"
    },
    {
      name: "Onion",
      suitability: 87,
      estimatedYield: "20-25 tonnes/hectare",
      harvestDate: "120-150 days from planting",
      marketPrice: "₹18-30/kg",
      expectedRevenue: "₹3.6-7.5 lakhs/hectare",
      soilRequirements: "Sandy loam to clay loam, pH 6.0-7.5",
      waterNeeds: "Medium (400-600mm)",
      temperature: "13-24°C optimal"
    },
    {
      name: "Cabbage",
      suitability: 85,
      estimatedYield: "35-40 tonnes/hectare",
      harvestDate: "90-120 days from planting",
      marketPrice: "₹12-18/kg",
      expectedRevenue: "₹4.2-7.2 lakhs/hectare",
      soilRequirements: "Well-drained loamy soil, pH 5.5-6.5",
      waterNeeds: "Medium to high (450-600mm)",
      temperature: "15-25°C optimal"
    },
    {
      name: "Cauliflower",
      suitability: 84,
      estimatedYield: "20-25 tonnes/hectare",
      harvestDate: "90-120 days from planting",
      marketPrice: "₹15-25/kg",
      expectedRevenue: "₹3-6.25 lakhs/hectare",
      soilRequirements: "Well-drained loamy soil, pH 5.5-6.5",
      waterNeeds: "Medium to high (450-600mm)",
      temperature: "15-20°C optimal"
    },
    {
      name: "Brinjal (Eggplant)",
      suitability: 88,
      estimatedYield: "25-30 tonnes/hectare",
      harvestDate: "120-150 days from planting",
      marketPrice: "₹20-30/kg",
      expectedRevenue: "₹5-9 lakhs/hectare",
      soilRequirements: "Sandy loam to clay loam, pH 5.5-6.5",
      waterNeeds: "Medium (500-750mm)",
      temperature: "20-30°C optimal"
    },
    {
      name: "Okra (Ladies Finger)",
      suitability: 86,
      estimatedYield: "10-12 tonnes/hectare",
      harvestDate: "50-60 days from planting",
      marketPrice: "₹25-40/kg",
      expectedRevenue: "₹2.5-4.8 lakhs/hectare",
      soilRequirements: "Well-drained loamy soil, pH 6.0-6.8",
      waterNeeds: "Medium (500-700mm)",
      temperature: "25-35°C optimal"
    },
    // Cereals
    {
      name: "Paddy (Rice)",
      suitability: 94,
      estimatedYield: "5-6 tonnes/hectare",
      harvestDate: "120-150 days from planting",
      marketPrice: "₹20-25/kg",
      expectedRevenue: "₹1-1.5 lakhs/hectare",
      soilRequirements: "Clay loam to clayey soil, pH 5.5-7.0",
      waterNeeds: "High (1200-1500mm)",
      temperature: "20-35°C optimal"
    },
    {
      name: "Maize (Corn)",
      suitability: 90,
      estimatedYield: "6-8 tonnes/hectare",
      harvestDate: "90-120 days from planting",
      marketPrice: "₹15-20/kg",
      expectedRevenue: "₹0.9-1.6 lakhs/hectare",
      soilRequirements: "Well-drained loamy soil, pH 5.5-7.0",
      waterNeeds: "Medium (500-800mm)",
      temperature: "21-30°C optimal"
    },
    {
      name: "Finger Millet (Ragi)",
      suitability: 83,
      estimatedYield: "2-3 tonnes/hectare",
      harvestDate: "120-130 days from planting",
      marketPrice: "₹30-40/kg",
      expectedRevenue: "₹0.6-1.2 lakhs/hectare",
      soilRequirements: "Red loamy to black soil, pH 5.0-8.2",
      waterNeeds: "Low to medium (300-500mm)",
      temperature: "12-27°C optimal"
    },
    {
      name: "Pearl Millet (Bajra)",
      suitability: 81,
      estimatedYield: "1.5-2.5 tonnes/hectare",
      harvestDate: "75-90 days from planting",
      marketPrice: "₹25-35/kg",
      expectedRevenue: "₹0.375-0.875 lakhs/hectare",
      soilRequirements: "Sandy loam, pH 6.5-7.5",
      waterNeeds: "Low (400-600mm)",
      temperature: "25-35°C optimal"
    },
    // Pulses
    {
      name: "Green Gram (Moong)",
      suitability: 85,
      estimatedYield: "0.8-1.2 tonnes/hectare",
      harvestDate: "60-75 days from planting",
      marketPrice: "₹70-90/kg",
      expectedRevenue: "₹0.56-1.08 lakhs/hectare",
      soilRequirements: "Sandy loam to clayey loam, pH 6.2-7.2",
      waterNeeds: "Low to medium (350-450mm)",
      temperature: "25-35°C optimal"
    },
    {
      name: "Black Gram (Urad)",
      suitability: 84,
      estimatedYield: "0.8-1.0 tonnes/hectare",
      harvestDate: "70-80 days from planting",
      marketPrice: "₹75-95/kg",
      expectedRevenue: "₹0.6-0.95 lakhs/hectare",
      soilRequirements: "Sandy loam to clayey loam, pH 6.5-7.8",
      waterNeeds: "Low to medium (350-450mm)",
      temperature: "25-35°C optimal"
    },
    {
      name: "Red Gram (Pigeon Pea)",
      suitability: 82,
      estimatedYield: "1.5-2.0 tonnes/hectare",
      harvestDate: "150-180 days from planting",
      marketPrice: "₹60-80/kg",
      expectedRevenue: "₹0.9-1.6 lakhs/hectare",
      soilRequirements: "Well-drained loamy soil, pH 6.0-7.5",
      waterNeeds: "Medium (600-900mm)",
      temperature: "20-30°C optimal"
    },
    // Fruits
    {
      name: "Banana",
      suitability: 93,
      estimatedYield: "50-60 tonnes/hectare",
      harvestDate: "11-13 months from planting",
      marketPrice: "₹15-25/kg",
      expectedRevenue: "₹7.5-15 lakhs/hectare",
      soilRequirements: "Deep, well-drained loamy soil, pH 6.5-7.5",
      waterNeeds: "High (1500-2000mm)",
      temperature: "15-35°C optimal"
    },
    {
      name: "Papaya",
      suitability: 88,
      estimatedYield: "80-100 tonnes/hectare",
      harvestDate: "10-12 months from planting",
      marketPrice: "₹12-20/kg",
      expectedRevenue: "₹9.6-20 lakhs/hectare",
      soilRequirements: "Well-drained sandy loam, pH 6.0-7.0",
      waterNeeds: "Medium to high (1000-1500mm)",
      temperature: "21-33°C optimal"
    },
    {
      name: "Dragon Fruit",
      suitability: 86,
      estimatedYield: "15-20 tonnes/hectare",
      harvestDate: "12-18 months from planting",
      marketPrice: "₹100-150/kg",
      expectedRevenue: "₹15-30 lakhs/hectare",
      soilRequirements: "Well-drained sandy loam, pH 6.0-7.0",
      waterNeeds: "Low to medium (500-700mm)",
      temperature: "20-30°C optimal"
    },
    {
      name: "Mango",
      suitability: 90,
      estimatedYield: "10-15 tonnes/hectare",
      harvestDate: "3-4 years from planting (commercial)",
      marketPrice: "₹40-80/kg",
      expectedRevenue: "₹4-12 lakhs/hectare",
      soilRequirements: "Well-drained deep loamy soil, pH 5.5-7.5",
      waterNeeds: "Medium (750-1250mm)",
      temperature: "24-27°C optimal"
    },
    // Flowers
    {
      name: "Gloriosa (Glory Lily)",
      suitability: 83,
      estimatedYield: "2-3 tonnes tubers/hectare",
      harvestDate: "8-10 months from planting",
      marketPrice: "₹200-300/kg (tubers)",
      expectedRevenue: "₹4-9 lakhs/hectare",
      soilRequirements: "Well-drained red loamy soil, pH 6.0-7.5",
      waterNeeds: "Medium (600-900mm)",
      temperature: "20-30°C optimal"
    },
    {
      name: "Marigold",
      suitability: 87,
      estimatedYield: "15-20 tonnes flowers/hectare",
      harvestDate: "60-90 days from planting",
      marketPrice: "₹20-30/kg",
      expectedRevenue: "₹3-6 lakhs/hectare",
      soilRequirements: "Well-drained loamy soil, pH 6.0-7.5",
      waterNeeds: "Medium (500-700mm)",
      temperature: "18-25°C optimal"
    },
    {
      name: "Jasmine",
      suitability: 89,
      estimatedYield: "5-8 tonnes flowers/hectare",
      harvestDate: "Year-round (peak: Oct-Mar)",
      marketPrice: "₹100-150/kg",
      expectedRevenue: "₹5-12 lakhs/hectare",
      soilRequirements: "Well-drained loamy soil, pH 6.5-7.5",
      waterNeeds: "Medium to high (1000-1500mm)",
      temperature: "20-35°C optimal"
    },
    // Cash Crops
    {
      name: "Sugarcane",
      suitability: 91,
      estimatedYield: "100-120 tonnes/hectare",
      harvestDate: "12-18 months from planting",
      marketPrice: "₹3-4/kg",
      expectedRevenue: "₹3-4.8 lakhs/hectare",
      soilRequirements: "Deep loamy to clayey soil, pH 6.5-7.5",
      waterNeeds: "High (1500-2500mm)",
      temperature: "21-27°C optimal"
    },
    {
      name: "Cotton",
      suitability: 85,
      estimatedYield: "2-3 tonnes/hectare",
      harvestDate: "150-180 days from planting",
      marketPrice: "₹50-70/kg",
      expectedRevenue: "₹1-2.1 lakhs/hectare",
      soilRequirements: "Deep black cotton soil, pH 6.0-8.0",
      waterNeeds: "Medium (500-1000mm)",
      temperature: "21-30°C optimal"
    },
    {
      name: "Groundnut",
      suitability: 86,
      estimatedYield: "2-2.5 tonnes/hectare",
      harvestDate: "100-120 days from planting",
      marketPrice: "₹50-65/kg",
      expectedRevenue: "₹1-1.625 lakhs/hectare",
      soilRequirements: "Well-drained sandy loam, pH 6.0-6.5",
      waterNeeds: "Medium (500-700mm)",
      temperature: "20-30°C optimal"
    },
    {
      name: "Turmeric",
      suitability: 88,
      estimatedYield: "25-30 tonnes/hectare",
      harvestDate: "7-9 months from planting",
      marketPrice: "₹80-120/kg",
      expectedRevenue: "₹20-36 lakhs/hectare",
      soilRequirements: "Well-drained loamy to clayey loam, pH 5.0-7.5",
      waterNeeds: "Medium to high (1500-2250mm)",
      temperature: "20-30°C optimal"
    }
  ];

  const handleDistrictChange = (value: string) => {
    setSelectedDistrict(value);
    setRecommendations(mockRecommendations);
    setViewMode("crops");
    setSelectedCrop(null);
    toast.success(`Loading crops for ${value} district...`);
  };

  const handleSelectCrop = (crop: CropRecommendation) => {
    setSelectedCrop(crop);
    setViewMode("detail");
    toast.success(`Analyzing ${crop.name}...`);
  };

  const handleBackToCrops = () => {
    setViewMode("crops");
    setSelectedCrop(null);
  };

  const handleBackToDistrict = () => {
    setViewMode("district");
    setSelectedDistrict("");
    setRecommendations([]);
    setSelectedCrop(null);
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
          {viewMode === "district" && (
            <Card>
              <CardHeader>
                <CardTitle>Step 1: Select Your District</CardTitle>
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
          )}

          {/* Crop List */}
          {viewMode === "crops" && (
            <CropSelector
              recommendations={recommendations}
              selectedDistrict={selectedDistrict}
              onSelectCrop={handleSelectCrop}
              onBack={handleBackToDistrict}
            />
          )}

          {/* Detail View with Parameters */}
          {viewMode === "detail" && selectedCrop && (
            <ParameterAdjustment
              crop={selectedCrop}
              onBack={handleBackToCrops}
            />
          )}
        </div>
      </div>
    </div>
  );
}
