import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Droplets, ThermometerSun, Leaf, TrendingUp, Calendar, DollarSign, AlertCircle, ChevronLeft } from "lucide-react";
import { CropRecommendation } from "@/types/crop";

interface ParameterAdjustmentProps {
  crop: CropRecommendation;
  onBack: () => void;
}

export function ParameterAdjustment({ crop, onBack }: ParameterAdjustmentProps) {
  const [rainfall, setRainfall] = useState([700]);
  const [temperature, setTemperature] = useState([25]);
  const [soilType, setSoilType] = useState("loamy");
  const [soilpH, setSoilpH] = useState([6.5]);

  // Calculate adjusted yield based on parameters
  const calculateAdjustedYield = () => {
    const baseYield = parseFloat(crop.estimatedYield.split('-')[0]);
    let adjustment = 1.0;

    // Rainfall impact
    if (rainfall[0] < 500) adjustment *= 0.7;
    else if (rainfall[0] > 1200) adjustment *= 0.85;

    // Temperature impact
    const optimalTemp = 25;
    const tempDiff = Math.abs(temperature[0] - optimalTemp);
    if (tempDiff > 10) adjustment *= 0.7;
    else if (tempDiff > 5) adjustment *= 0.85;

    // Soil pH impact
    const optimalPH = 6.5;
    const pHDiff = Math.abs(soilpH[0] - optimalPH);
    if (pHDiff > 1.5) adjustment *= 0.75;
    else if (pHDiff > 1) adjustment *= 0.9;

    return (baseYield * adjustment).toFixed(1);
  };

  const getYieldStatus = () => {
    const adjustedYield = parseFloat(calculateAdjustedYield());
    const baseYield = parseFloat(crop.estimatedYield.split('-')[0]);
    const difference = ((adjustedYield - baseYield) / baseYield * 100).toFixed(1);
    
    if (adjustedYield >= baseYield * 0.95) {
      return { color: "text-primary", icon: "✓", message: "Optimal conditions", difference: `+${difference}%` };
    } else if (adjustedYield >= baseYield * 0.8) {
      return { color: "text-accent", icon: "⚠", message: "Good conditions", difference: `${difference}%` };
    } else {
      return { color: "text-destructive", icon: "⚠", message: "Suboptimal conditions", difference: `${difference}%` };
    }
  };

  const yieldStatus = getYieldStatus();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" onClick={onBack} className="mb-2">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Crop Selection
          </Button>
          <h2 className="text-2xl font-bold">Step 3: {crop.name} - Detailed Prediction</h2>
          <p className="text-muted-foreground">
            Adjust environmental parameters to see how they affect yield predictions
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Parameter Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Environmental Parameters</CardTitle>
            <CardDescription>
              Adjust these to simulate different growing conditions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Rainfall */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-primary" />
                  Rainfall (mm/year)
                </Label>
                <span className="text-sm font-medium">{rainfall[0]} mm</span>
              </div>
              <Slider
                value={rainfall}
                onValueChange={setRainfall}
                min={200}
                max={2500}
                step={50}
                className="w-full"
              />
            </div>

            <Separator />

            {/* Temperature */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <ThermometerSun className="h-4 w-4 text-accent" />
                  Temperature (°C)
                </Label>
                <span className="text-sm font-medium">{temperature[0]}°C</span>
              </div>
              <Slider
                value={temperature}
                onValueChange={setTemperature}
                min={10}
                max={45}
                step={1}
                className="w-full"
              />
            </div>

            <Separator />

            {/* Soil Type */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Leaf className="h-4 w-4 text-secondary" />
                Soil Type
              </Label>
              <Select value={soilType} onValueChange={setSoilType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sandy">Sandy</SelectItem>
                  <SelectItem value="loamy">Loamy</SelectItem>
                  <SelectItem value="clay">Clay</SelectItem>
                  <SelectItem value="silt">Silt</SelectItem>
                  <SelectItem value="red">Red Soil</SelectItem>
                  <SelectItem value="black">Black Cotton Soil</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            {/* Soil pH */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Leaf className="h-4 w-4 text-secondary" />
                  Soil pH
                </Label>
                <span className="text-sm font-medium">{soilpH[0].toFixed(1)}</span>
              </div>
              <Slider
                value={soilpH}
                onValueChange={setSoilpH}
                min={4.0}
                max={9.0}
                step={0.1}
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>

        {/* Predictions */}
        <div className="space-y-6">
          {/* Yield Prediction */}
          <Card className="border-2 border-primary">
            <CardHeader>
              <CardTitle>Adjusted Yield Prediction</CardTitle>
              <CardDescription>Based on your selected parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Predicted Yield</p>
                  <p className="text-3xl font-bold">{calculateAdjustedYield()} tonnes/hectare</p>
                </div>
                <Badge className={yieldStatus.color}>
                  {yieldStatus.difference}
                </Badge>
              </div>

              <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                <AlertCircle className={`h-5 w-5 ${yieldStatus.color}`} />
                <div>
                  <p className="font-medium">{yieldStatus.message}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {yieldStatus.icon === "✓" 
                      ? "Your parameters are well-suited for this crop"
                      : "Consider adjusting parameters for better yield"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Crop Details */}
          <Card>
            <CardHeader>
              <CardTitle>Crop Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Standard Yield Range</p>
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

                <Separator />

                <div className="space-y-2">
                  <p className="text-sm font-medium">Soil Requirements</p>
                  <p className="text-sm text-muted-foreground">{crop.soilRequirements}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Water Needs</p>
                  <p className="text-sm text-muted-foreground">{crop.waterNeeds}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Optimal Temperature</p>
                  <p className="text-sm text-muted-foreground">{crop.temperature}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
