import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Calendar, DollarSign, ArrowRight, ChevronLeft } from "lucide-react";
import { CropRecommendation } from "@/types/crop";

interface CropSelectorProps {
  recommendations: CropRecommendation[];
  selectedDistrict: string;
  onSelectCrop: (crop: CropRecommendation) => void;
  onBack: () => void;
}

export function CropSelector({ 
  recommendations, 
  selectedDistrict,
  onSelectCrop,
  onBack 
}: CropSelectorProps) {
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

      <div className="grid gap-4 md:grid-cols-2">
        {recommendations.map((crop, index) => (
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
  );
}
