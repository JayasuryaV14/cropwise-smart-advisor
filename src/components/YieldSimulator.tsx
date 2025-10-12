import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { CropRecommendation } from '@/types/crop';
import { ArrowLeft } from 'lucide-react';

interface YieldSimulatorProps {
  crop: CropRecommendation;
  onBack: () => void;
}

export function YieldSimulator({ crop, onBack }: YieldSimulatorProps) {
  const { t } = useTranslation();
  const [rainfall, setRainfall] = useState(600);
  const [fertilizer, setFertilizer] = useState<'low' | 'medium' | 'high'>('medium');
  const [technology, setTechnology] = useState<'basic' | 'moderate' | 'advanced'>('moderate');

  // Parse base yield (take average if range)
  const baseYield = parseFloat(crop.estimatedYield.match(/\d+/)?.[0] || '0');
  
  // Calculate modifiers
  const rainfallModifier = rainfall / 600; // 600mm as baseline
  const fertilizerModifier = fertilizer === 'low' ? 0.8 : fertilizer === 'high' ? 1.2 : 1.0;
  const technologyModifier = technology === 'basic' ? 0.85 : technology === 'advanced' ? 1.15 : 1.0;
  
  // Calculate projected yield
  const projectedYield = (baseYield * rainfallModifier * fertilizerModifier * technologyModifier).toFixed(1);
  
  // Extract base price
  const basePrice = parseFloat(crop.marketPrice.match(/\d+/)?.[0] || '0');
  
  // Calculate financials (per hectare)
  const seedCost = baseYield * 0.1 * 1000; // ₹100 per unit estimate
  const fertilizerCost = fertilizer === 'low' ? 15000 : fertilizer === 'high' ? 40000 : 25000;
  const laborCost = 30000;
  const technologyCost = technology === 'basic' ? 5000 : technology === 'advanced' ? 20000 : 10000;
  const totalCost = seedCost + fertilizerCost + laborCost + technologyCost;
  
  const revenue = parseFloat(projectedYield) * 1000 * basePrice; // Convert tonnes to kg
  const netProfit = revenue - totalCost;
  const roi = ((netProfit / totalCost) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('common.back')}
        </Button>
        <div>
          <h2 className="text-2xl font-bold">{t('simulator.title')}</h2>
          <p className="text-muted-foreground">Adjust parameters to see projected outcomes for {crop.name}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Parameters */}
        <Card>
          <CardHeader>
            <CardTitle>Simulation Parameters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>{t('simulator.rainfall')}: {rainfall}mm</Label>
              <Slider
                value={[rainfall]}
                onValueChange={(value) => setRainfall(value[0])}
                min={200}
                max={1500}
                step={50}
              />
            </div>

            <div className="space-y-2">
              <Label>{t('simulator.fertilizer')}</Label>
              <Select value={fertilizer} onValueChange={(value: any) => setFertilizer(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">{t('simulator.low')}</SelectItem>
                  <SelectItem value="medium">{t('simulator.medium')}</SelectItem>
                  <SelectItem value="high">{t('simulator.high')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{t('simulator.technology')}</Label>
              <Select value={technology} onValueChange={(value: any) => setTechnology(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">{t('simulator.basic')}</SelectItem>
                  <SelectItem value="moderate">{t('simulator.moderate')}</SelectItem>
                  <SelectItem value="advanced">{t('simulator.advanced')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <Card className="bg-primary/5">
          <CardHeader>
            <CardTitle>Projected Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">{t('simulator.projectedYield')}</span>
                <span className="text-2xl font-bold">{projectedYield} tonnes/ha</span>
              </div>
              <div className="text-sm text-muted-foreground">
                Base: {baseYield} tonnes/ha
              </div>
            </div>

            <div className="border-t pt-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('simulator.estimatedCost')}</span>
                <span className="font-semibold">₹{totalCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('simulator.expectedRevenue')}</span>
                <span className="font-semibold text-green-600">₹{revenue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="font-medium">{t('simulator.netProfit')}</span>
                <span className={`text-xl font-bold ${netProfit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ₹{netProfit.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">{t('simulator.roi')}</span>
                <span className={`text-lg font-bold ${parseFloat(roi) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {roi}%
                </span>
              </div>
            </div>

            <div className="bg-background/50 p-4 rounded-lg mt-4">
              <p className="text-sm text-muted-foreground">
                💡 Tip: Higher rainfall and fertilizer inputs generally increase yield, but also raise costs. 
                Find the optimal balance for maximum profitability.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
