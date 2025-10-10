export interface CropRecommendation {
  name: string;
  suitability: number;
  estimatedYield: string;
  harvestDate: string;
  marketPrice: string;
  expectedRevenue: string;
  soilRequirements: string;
  waterNeeds: string;
  temperature: string;
  cropId?: string;
}
