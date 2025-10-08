import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Calendar, DollarSign } from "lucide-react";
import { CropRecommendation } from "@/types/crop";

interface CropSelectorProps {
  recommendations: CropRecommendation[];
  selectedCrops: string[];
  onToggleCrop: (cropName: string) => void;
  onContinue: () => void;
}

export function CropSelector({ 
  recommendations, 
  selectedCrops, 
  onToggleCrop,
  onContinue 
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
          <h2 className="text-2xl font-bold">Select Crops to Analyze</h2>
          <p className="text-muted-foreground">
            Choose crops you're interested in cultivating (max 5 for comparison)
          </p>
        </div>
        <div className="flex gap-3">
          <Badge variant="outline" className="h-fit">
            {selectedCrops.length} selected
          </Badge>
          <Button 
            onClick={onContinue}
            disabled={selectedCrops.length === 0}
          >
            Continue to Analysis
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {recommendations.map((crop, index) => (
          <Card 
            key={index} 
            className={`border-2 transition-all cursor-pointer ${
              selectedCrops.includes(crop.name) 
                ? 'border-primary bg-primary/5' 
                : 'hover:border-muted-foreground/50'
            }`}
            onClick={() => onToggleCrop(crop.name)}
          >
            <CardHeader>
              <div className="flex items-start gap-4">
                <Checkbox
                  checked={selectedCrops.includes(crop.name)}
                  onCheckedChange={() => onToggleCrop(crop.name)}
                  disabled={!selectedCrops.includes(crop.name) && selectedCrops.length >= 5}
                  onClick={(e) => e.stopPropagation()}
                />
                <div className="flex-1 flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{crop.name}</CardTitle>
                    <CardDescription>Rank #{index + 1}</CardDescription>
                  </div>
                  <Badge className={getSuitabilityColor(crop.suitability)}>
                    {crop.suitability}% Suitable
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
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
                    <p className="text-sm font-medium">Expected Revenue</p>
                    <p className="text-sm text-muted-foreground">{crop.expectedRevenue}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
