import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Droplets, ThermometerSun, Leaf, TrendingUp, Calendar, DollarSign, AlertCircle, ChevronLeft, Download } from "lucide-react";
import { CropRecommendation } from "@/types/crop";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import jsPDF from "jspdf";

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

  // Generate chart data for rainfall impact
  const rainfallChartData = Array.from({ length: 24 }, (_, i) => {
    const rain = 200 + (i * 100);
    const baseYield = parseFloat(crop.estimatedYield.split('-')[0]);
    let adjustment = 1.0;
    if (rain < 500) adjustment = 0.7;
    else if (rain > 1200) adjustment = 0.85;
    
    // Temperature and pH impact (using current values)
    const tempDiff = Math.abs(temperature[0] - 25);
    if (tempDiff > 10) adjustment *= 0.7;
    else if (tempDiff > 5) adjustment *= 0.85;
    
    const pHDiff = Math.abs(soilpH[0] - 6.5);
    if (pHDiff > 1.5) adjustment *= 0.75;
    else if (pHDiff > 1) adjustment *= 0.9;
    
    return {
      rainfall: rain,
      yield: parseFloat((baseYield * adjustment).toFixed(1))
    };
  });

  // Generate chart data for temperature impact
  const temperatureChartData = Array.from({ length: 36 }, (_, i) => {
    const temp = 10 + i;
    const baseYield = parseFloat(crop.estimatedYield.split('-')[0]);
    let adjustment = 1.0;
    
    // Rainfall impact (using current value)
    if (rainfall[0] < 500) adjustment *= 0.7;
    else if (rainfall[0] > 1200) adjustment *= 0.85;
    
    // Temperature impact
    const tempDiff = Math.abs(temp - 25);
    if (tempDiff > 10) adjustment *= 0.7;
    else if (tempDiff > 5) adjustment *= 0.85;
    
    // pH impact (using current value)
    const pHDiff = Math.abs(soilpH[0] - 6.5);
    if (pHDiff > 1.5) adjustment *= 0.75;
    else if (pHDiff > 1) adjustment *= 0.9;
    
    return {
      temperature: temp,
      yield: parseFloat((baseYield * adjustment).toFixed(1))
    };
  });

  // Generate PDF Report
  const generatePDFReport = () => {
    const doc = new jsPDF();
    const adjustedYield = calculateAdjustedYield();
    
    // Title
    doc.setFontSize(20);
    doc.text("Crop Yield Prediction Report", 20, 20);
    
    // Crop Information
    doc.setFontSize(16);
    doc.text(`Crop: ${crop.name}`, 20, 35);
    
    doc.setFontSize(12);
    doc.text("Environmental Parameters:", 20, 50);
    doc.text(`Rainfall: ${rainfall[0]} mm/year`, 30, 60);
    doc.text(`Temperature: ${temperature[0]}°C`, 30, 70);
    doc.text(`Soil Type: ${soilType}`, 30, 80);
    doc.text(`Soil pH: ${soilpH[0].toFixed(1)}`, 30, 90);
    
    // Yield Prediction
    doc.text("Yield Prediction:", 20, 110);
    doc.setFontSize(14);
    doc.text(`Adjusted Yield: ${adjustedYield} tonnes/hectare`, 30, 120);
    doc.text(`Status: ${yieldStatus.message}`, 30, 130);
    doc.text(`Change: ${yieldStatus.difference}`, 30, 140);
    
    // Crop Details
    doc.setFontSize(12);
    doc.text("Crop Information:", 20, 160);
    doc.text(`Standard Yield Range: ${crop.estimatedYield}`, 30, 170);
    doc.text(`Harvest Time: ${crop.harvestDate}`, 30, 180);
    doc.text(`Market Price: ${crop.marketPrice}`, 30, 190);
    doc.text(`Expected Revenue: ${crop.expectedRevenue}`, 30, 200);
    
    doc.text("Requirements:", 20, 220);
    doc.text(`Soil: ${crop.soilRequirements}`, 30, 230);
    doc.text(`Water: ${crop.waterNeeds}`, 30, 240);
    doc.text(`Temperature: ${crop.temperature}`, 30, 250);
    
    // Footer
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 280);
    
    // Save the PDF
    doc.save(`${crop.name.replace(/\s+/g, '_')}_prediction_report.pdf`);
  };

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
        <Button onClick={generatePDFReport} className="gap-2">
          <Download className="h-4 w-4" />
          Download Report
        </Button>
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

          {/* Yield Visualization Graphs */}
          <Card>
            <CardHeader>
              <CardTitle>Yield Impact Visualization</CardTitle>
              <CardDescription>See how different parameters affect crop yield</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Rainfall Impact Chart */}
              <div>
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-primary" />
                  Yield vs Rainfall
                </h4>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={rainfallChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="rainfall" 
                      label={{ value: 'Rainfall (mm)', position: 'insideBottom', offset: -5 }}
                    />
                    <YAxis 
                      label={{ value: 'Yield (tonnes/ha)', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="yield" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      dot={{ r: 2 }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
                <div className="flex items-center justify-center mt-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                    <span>Current: {rainfall[0]}mm → {calculateAdjustedYield()} tonnes/ha</span>
                  </div>
                </div>
              </div>

              {/* Temperature Impact Chart */}
              <div>
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <ThermometerSun className="h-4 w-4 text-accent" />
                  Yield vs Temperature
                </h4>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={temperatureChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="temperature" 
                      label={{ value: 'Temperature (°C)', position: 'insideBottom', offset: -5 }}
                    />
                    <YAxis 
                      label={{ value: 'Yield (tonnes/ha)', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="yield" 
                      stroke="hsl(var(--accent))" 
                      strokeWidth={2}
                      dot={{ r: 2 }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
                <div className="flex items-center justify-center mt-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="h-2 w-2 rounded-full bg-accent"></div>
                    <span>Current: {temperature[0]}°C → {calculateAdjustedYield()} tonnes/ha</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
