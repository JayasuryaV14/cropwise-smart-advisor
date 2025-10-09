import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Calendar, DollarSign, ArrowRight, ChevronLeft, Star, Award, AlertCircle, Leaf } from "lucide-react";
import { CropRecommendation } from "@/types/crop";

interface CropSelectorProps {
  recommendations: CropRecommendation[];
  selectedDistrict: string;
  onSelectCrop: (crop: CropRecommendation) => void;
  onBack: () => void;
}

// Calculate crop score based on multiple factors
const calculateCropScore = (crop: CropRecommendation) => {
  const suitabilityScore = crop.suitability;
  const priceValue = parseFloat(crop.marketPrice.replace(/[^0-9.]/g, ''));
  const yieldValue = parseFloat(crop.estimatedYield.split('-')[0]);
  
  // Weighted scoring: suitability (40%), price (30%), yield (30%)
  return (suitabilityScore * 0.4) + (priceValue / 100 * 0.3) + (yieldValue / 10 * 0.3);
};

// Get explanation for why this crop is recommended
const getRecommendationReason = (crop: CropRecommendation, rank: number) => {
  const reasons = [];
  
  if (crop.suitability >= 90) reasons.push("Excellent soil compatibility");
  else if (crop.suitability >= 80) reasons.push("Good soil match");
  
  const priceValue = parseFloat(crop.marketPrice.replace(/[^0-9.]/g, ''));
  if (priceValue >= 30) reasons.push("High market demand");
  else if (priceValue >= 20) reasons.push("Stable market price");
  
  const yieldValue = parseFloat(crop.estimatedYield.split('-')[0]);
  if (yieldValue >= 25) reasons.push("High yield potential");
  else if (yieldValue >= 15) reasons.push("Good yield expected");
  
  if (crop.waterNeeds.toLowerCase().includes("moderate")) reasons.push("Water-efficient");
  if (crop.waterNeeds.toLowerCase().includes("low")) reasons.push("Low water requirement");
  
  return reasons.slice(0, 2).join(" • ");
};

export function CropSelector({ 
  recommendations, 
  selectedDistrict,
  onSelectCrop,
  onBack 
}: CropSelectorProps) {
  // Sort crops by score and get top 3
  const sortedCrops = [...recommendations].sort((a, b) => calculateCropScore(b) - calculateCropScore(a));
  const topThree = sortedCrops.slice(0, 3);
  const otherCrops = sortedCrops.slice(3);

  const getSuitabilityColor = (score: number) => {
    if (score >= 90) return "bg-primary text-primary-foreground";
    if (score >= 80) return "bg-accent text-accent-foreground";
    return "bg-secondary text-secondary-foreground";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" onClick={onBack} className="mb-2">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Change District
          </Button>
          <h2 className="text-2xl font-bold">Step 2: Select a Crop</h2>
          <p className="text-muted-foreground">
            Showing {recommendations.length} recommended crops for {selectedDistrict} district
          </p>
        </div>
      </div>

      {/* Top 3 Recommendations Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Award className="h-5 w-5 text-primary" />
          <h3 className="text-xl font-semibold">Top 3 Recommendations for Your Region</h3>
        </div>
        
        <div className="grid gap-4 md:grid-cols-3">
          {topThree.map((crop, index) => (
            <Card 
              key={crop.name}
              className={`cursor-pointer transition-all hover:shadow-lg border-2 ${
                index === 0 ? 'border-primary bg-primary/5' : 'border-accent/50'
              }`}
              onClick={() => onSelectCrop(crop)}
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant={index === 0 ? "default" : "secondary"} className="gap-1">
                    {index === 0 ? <Star className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
                    #{index + 1} Best Match
                  </Badge>
                  <Badge variant="outline">{crop.suitability}% Match</Badge>
                </div>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-primary" />
                  {crop.name}
                </CardTitle>
                <CardDescription className="flex items-start gap-2 mt-2">
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary" />
                  <span className="text-sm">{getRecommendationReason(crop, index + 1)}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Expected Yield:</span>
                  <span className="font-semibold">{crop.estimatedYield}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Market Price:</span>
                  <span className="font-semibold text-primary">{crop.marketPrice}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Harvest Time:</span>
                  <span className="font-semibold">{crop.harvestDate}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Expected Revenue:</span>
                  <span className="font-semibold text-secondary">{crop.expectedRevenue}</span>
                </div>
                <Button className="w-full mt-2" variant={index === 0 ? "default" : "outline"}>
                  View Detailed Analysis
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* All Other Crops Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">All Other Suitable Crops</h3>
        <div className="grid gap-4 md:grid-cols-2">
        {otherCrops.map((crop, index) => (
          <Card 
            key={index} 
            className="border-2 hover:border-primary hover:shadow-lg transition-all cursor-pointer group"
            onClick={() => onSelectCrop(crop)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {crop.name}
                  </CardTitle>
                  <CardDescription>Rank #{index + 1}</CardDescription>
                </div>
                <Badge className={getSuitabilityColor(crop.suitability)}>
                  {crop.suitability}% Suitable
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    <span className="text-sm text-muted-foreground">Yield</span>
                  </div>
                  <span className="text-sm font-medium">{crop.estimatedYield}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-accent" />
                    <span className="text-sm text-muted-foreground">Harvest</span>
                  </div>
                  <span className="text-sm font-medium">{crop.harvestDate}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-secondary" />
                    <span className="text-sm text-muted-foreground">Revenue</span>
                  </div>
                  <span className="text-sm font-medium text-primary">{crop.expectedRevenue}</span>
                </div>
              </div>

              <Button 
                className="w-full group-hover:bg-primary group-hover:text-primary-foreground"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectCrop(crop);
                }}
              >
                View Details
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      </div>
    </div>
  );
}
