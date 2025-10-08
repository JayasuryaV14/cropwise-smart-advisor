import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TrendingUp, Calendar, DollarSign, Droplets, ThermometerSun, Leaf, TrendingDown, AlertTriangle } from "lucide-react";
import { CropRecommendation } from "@/types/crop";

interface CropComparisonProps {
  crops: CropRecommendation[];
  onBack: () => void;
}

export function CropComparison({ crops, onBack }: CropComparisonProps) {
  // Parse yield for comparison
  const getYieldValue = (yieldStr: string) => {
    return parseFloat(yieldStr.split('-')[0]);
  };

  // Parse revenue for comparison
  const getRevenueValue = (revenueStr: string) => {
    return parseFloat(revenueStr.split('-')[0].replace('₹', '').replace(' lakhs/hectare', ''));
  };

  // Calculate profit potential score
  const getProfitScore = (crop: CropRecommendation) => {
    const revenue = getRevenueValue(crop.expectedRevenue);
    const suitability = crop.suitability / 100;
    return (revenue * suitability).toFixed(2);
  };

  const bestCrop = crops.reduce((best, current) => 
    parseFloat(getProfitScore(current)) > parseFloat(getProfitScore(best)) ? current : best
  , crops[0]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Crop Comparison Analysis</h2>
          <p className="text-muted-foreground">
            Compare yields, revenues, and cultivation requirements
          </p>
        </div>
        <Button variant="outline" onClick={onBack}>
          Back to Selection
        </Button>
      </div>

      {/* Best Choice Highlight */}
      <Card className="border-2 border-primary bg-primary/5">
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <CardTitle>Recommended Choice</CardTitle>
          </div>
          <CardDescription>
            Based on profit potential and suitability score
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">{bestCrop.name}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Profit Score: {getProfitScore(bestCrop)} | Suitability: {bestCrop.suitability}%
              </p>
            </div>
            <Badge className="bg-primary text-primary-foreground">Best Choice</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Comparison Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Comparison</CardTitle>
          <CardDescription>Side-by-side analysis of selected crops</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-4 px-4 font-medium">Metric</th>
                  {crops.map((crop, idx) => (
                    <th key={idx} className="text-left py-4 px-4 font-medium min-w-[180px]">
                      {crop.name}
                      {crop.name === bestCrop.name && (
                        <Badge className="ml-2 bg-primary text-primary-foreground text-xs">Best</Badge>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Suitability */}
                <tr className="border-b hover:bg-muted/50">
                  <td className="py-4 px-4 font-medium">Suitability Score</td>
                  {crops.map((crop, idx) => (
                    <td key={idx} className="py-4 px-4">
                      <Badge variant={crop.suitability >= 90 ? "default" : "secondary"}>
                        {crop.suitability}%
                      </Badge>
                    </td>
                  ))}
                </tr>

                {/* Yield */}
                <tr className="border-b hover:bg-muted/50">
                  <td className="py-4 px-4 font-medium flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    Estimated Yield
                  </td>
                  {crops.map((crop, idx) => {
                    const isHighest = getYieldValue(crop.estimatedYield) === Math.max(...crops.map(c => getYieldValue(c.estimatedYield)));
                    return (
                      <td key={idx} className="py-4 px-4">
                        <span className={isHighest ? "font-bold text-primary" : ""}>
                          {crop.estimatedYield}
                        </span>
                      </td>
                    );
                  })}
                </tr>

                {/* Revenue */}
                <tr className="border-b hover:bg-muted/50">
                  <td className="py-4 px-4 font-medium flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-secondary" />
                    Expected Revenue
                  </td>
                  {crops.map((crop, idx) => {
                    const isHighest = getRevenueValue(crop.expectedRevenue) === Math.max(...crops.map(c => getRevenueValue(c.expectedRevenue)));
                    return (
                      <td key={idx} className="py-4 px-4">
                        <span className={isHighest ? "font-bold text-primary" : ""}>
                          {crop.expectedRevenue}
                        </span>
                      </td>
                    );
                  })}
                </tr>

                {/* Harvest Time */}
                <tr className="border-b hover:bg-muted/50">
                  <td className="py-4 px-4 font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-accent" />
                    Harvest Time
                  </td>
                  {crops.map((crop, idx) => (
                    <td key={idx} className="py-4 px-4 text-sm">
                      {crop.harvestDate}
                    </td>
                  ))}
                </tr>

                {/* Market Price */}
                <tr className="border-b hover:bg-muted/50">
                  <td className="py-4 px-4 font-medium">Market Price</td>
                  {crops.map((crop, idx) => (
                    <td key={idx} className="py-4 px-4 text-sm">
                      {crop.marketPrice}
                    </td>
                  ))}
                </tr>

                <tr className="border-b hover:bg-muted/50">
                  <td className="py-4 px-4 font-medium flex items-center gap-2">
                    <Droplets className="h-4 w-4 text-primary" />
                    Water Needs
                  </td>
                  {crops.map((crop, idx) => (
                    <td key={idx} className="py-4 px-4 text-sm">
                      {crop.waterNeeds}
                    </td>
                  ))}
                </tr>

                <tr className="border-b hover:bg-muted/50">
                  <td className="py-4 px-4 font-medium flex items-center gap-2">
                    <ThermometerSun className="h-4 w-4 text-accent" />
                    Temperature
                  </td>
                  {crops.map((crop, idx) => (
                    <td key={idx} className="py-4 px-4 text-sm">
                      {crop.temperature}
                    </td>
                  ))}
                </tr>

                <tr className="hover:bg-muted/50">
                  <td className="py-4 px-4 font-medium flex items-center gap-2">
                    <Leaf className="h-4 w-4 text-secondary" />
                    Soil Requirements
                  </td>
                  {crops.map((crop, idx) => (
                    <td key={idx} className="py-4 px-4 text-sm">
                      {crop.soilRequirements}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Profit Potential Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Profit Potential Score</CardTitle>
          <CardDescription>
            Calculated based on expected revenue × suitability score
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {crops
              .sort((a, b) => parseFloat(getProfitScore(b)) - parseFloat(getProfitScore(a)))
              .map((crop, idx) => {
                const score = parseFloat(getProfitScore(crop));
                const maxScore = parseFloat(getProfitScore(bestCrop));
                const percentage = (score / maxScore) * 100;
                
                return (
                  <div key={idx} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{crop.name}</span>
                      <span className="text-sm text-muted-foreground">{score} lakhs</span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-primary to-accent transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </CardContent>
      </Card>

      {/* Risk Analysis */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-accent" />
            <CardTitle>Risk Considerations</CardTitle>
          </div>
          <CardDescription>Potential challenges for each crop</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {crops.map((crop, idx) => (
              <div key={idx} className="p-4 border rounded-lg space-y-2">
                <p className="font-medium">{crop.name}</p>
                <Separator />
                <div className="space-y-1 text-sm text-muted-foreground">
                  {crop.suitability < 85 && (
                    <div className="flex items-start gap-2">
                      <TrendingDown className="h-4 w-4 text-destructive mt-0.5" />
                      <span>Lower suitability may affect yield</span>
                    </div>
                  )}
                  {crop.waterNeeds.includes("High") && (
                    <div className="flex items-start gap-2">
                      <Droplets className="h-4 w-4 text-primary mt-0.5" />
                      <span>Requires high water availability</span>
                    </div>
                  )}
                  {getRevenueValue(crop.expectedRevenue) < 2 && (
                    <div className="flex items-start gap-2">
                      <DollarSign className="h-4 w-4 text-accent mt-0.5" />
                      <span>Lower revenue potential</span>
                    </div>
                  )}
                  {crop.suitability >= 85 && !crop.waterNeeds.includes("High") && getRevenueValue(crop.expectedRevenue) >= 2 && (
                    <div className="flex items-start gap-2">
                      <TrendingUp className="h-4 w-4 text-primary mt-0.5" />
                      <span>Low risk, good conditions</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
