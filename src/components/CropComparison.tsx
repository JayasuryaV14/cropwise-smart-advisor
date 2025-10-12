import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { CropRecommendation } from '@/types/crop';
import { ArrowLeft } from 'lucide-react';

interface CropComparisonProps {
  recommendations: CropRecommendation[];
  onBack: () => void;
}

export function CropComparison({ recommendations, onBack }: CropComparisonProps) {
  const { t } = useTranslation();
  const [selectedCrops, setSelectedCrops] = useState<Set<string>>(new Set());
  const [comparing, setComparing] = useState(false);

  const toggleCrop = (cropName: string) => {
    const newSelection = new Set(selectedCrops);
    if (newSelection.has(cropName)) {
      newSelection.delete(cropName);
    } else if (newSelection.size < 3) {
      newSelection.add(cropName);
    }
    setSelectedCrops(newSelection);
  };

  const comparisonData = recommendations.filter(crop => selectedCrops.has(crop.name));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('common.back')}
        </Button>
        <div>
          <h2 className="text-2xl font-bold">{t('compare.title')}</h2>
          <p className="text-muted-foreground">
            {t('compare.select')} (max 3) - {selectedCrops.size} {t('compare.selected')}
          </p>
        </div>
      </div>

      {!comparing ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendations.map((crop) => (
            <Card
              key={crop.name}
              className={`cursor-pointer transition-all ${
                selectedCrops.has(crop.name) ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => toggleCrop(crop.name)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{crop.name}</CardTitle>
                  <Checkbox
                    checked={selectedCrops.has(crop.name)}
                    onCheckedChange={() => toggleCrop(crop.name)}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p><strong>{t('crop.suitability')}:</strong> {crop.suitability}%</p>
                  <p><strong>{t('crop.yield')}:</strong> {crop.estimatedYield}</p>
                  <p><strong>{t('crop.revenue')}:</strong> {crop.expectedRevenue}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4">Metric</th>
                    {comparisonData.map(crop => (
                      <th key={crop.name} className="text-left p-4">{crop.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-4 font-medium">{t('crop.suitability')}</td>
                    {comparisonData.map(crop => (
                      <td key={crop.name} className="p-4">{crop.suitability}%</td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-medium">{t('crop.yield')}</td>
                    {comparisonData.map(crop => (
                      <td key={crop.name} className="p-4">{crop.estimatedYield}</td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-medium">{t('crop.harvest')}</td>
                    {comparisonData.map(crop => (
                      <td key={crop.name} className="p-4">{crop.harvestDate}</td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-medium">{t('crop.price')}</td>
                    {comparisonData.map(crop => (
                      <td key={crop.name} className="p-4">{crop.marketPrice}</td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-medium">{t('crop.revenue')}</td>
                    {comparisonData.map(crop => (
                      <td key={crop.name} className="p-4">{crop.expectedRevenue}</td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-medium">{t('crop.soil')}</td>
                    {comparisonData.map(crop => (
                      <td key={crop.name} className="p-4">{crop.soilRequirements}</td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-medium">{t('crop.water')}</td>
                    {comparisonData.map(crop => (
                      <td key={crop.name} className="p-4">{crop.waterNeeds}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 font-medium">{t('crop.temperature')}</td>
                    {comparisonData.map(crop => (
                      <td key={crop.name} className="p-4">{crop.temperature}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex gap-4">
        {selectedCrops.size >= 2 && !comparing && (
          <Button onClick={() => setComparing(true)}>
            {t('compare.start')}
          </Button>
        )}
        {comparing && (
          <Button variant="outline" onClick={() => setComparing(false)}>
            {t('common.back')}
          </Button>
        )}
        {selectedCrops.size > 0 && (
          <Button variant="outline" onClick={() => setSelectedCrops(new Set())}>
            {t('compare.clear')}
          </Button>
        )}
      </div>
    </div>
  );
}
