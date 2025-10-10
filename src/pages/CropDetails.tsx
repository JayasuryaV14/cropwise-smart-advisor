import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, TrendingUp, DollarSign, Calendar, Thermometer, Droplets, Users, Download } from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";

interface CropData {
  id: string;
  name: string;
  category: string;
  growth_duration_days: number;
  water_requirement: string;
  temperature_range: string;
}

interface CultivationStep {
  id: string;
  step_number: number;
  stage_name: string;
  description: string;
  duration_days: number;
  tips: string;
}

interface FarmerExperience {
  id: string;
  farmer: {
    full_name: string;
    phone: string;
    experience_years: number;
  };
  year: number;
  yield_achieved: string;
  tips: string;
  willing_to_help: boolean;
}

export default function CropDetails() {
  const { cropId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [crop, setCrop] = useState<CropData | null>(null);
  const [cultivationSteps, setCultivationSteps] = useState<CultivationStep[]>([]);
  const [farmerExperiences, setFarmerExperiences] = useState<FarmerExperience[]>([]);

  useEffect(() => {
    fetchCropDetails();
  }, [cropId]);

  const fetchCropDetails = async () => {
    try {
      // Fetch crop data
      const { data: cropData, error: cropError } = await supabase
        .from("crops")
        .select("*")
        .eq("id", cropId)
        .single();

      if (cropError) throw cropError;
      setCrop(cropData);

      // Fetch cultivation steps
      const { data: stepsData, error: stepsError } = await supabase
        .from("crop_cultivation_steps")
        .select("*")
        .eq("crop_id", cropId)
        .order("step_number");

      if (stepsError) throw stepsError;
      setCultivationSteps(stepsData || []);

      // Fetch farmer experiences
      const { data: experiencesData, error: experiencesError } = await supabase
        .from("farmer_crop_experience")
        .select(`
          id,
          year,
          yield_achieved,
          tips,
          willing_to_help,
          farmer:profiles(full_name, phone, experience_years)
        `)
        .eq("crop_id", cropId)
        .eq("willing_to_help", true)
        .limit(5);

      if (experiencesError) throw experiencesError;
      setFarmerExperiences(experiencesData || []);
    } catch (error) {
      console.error("Error fetching crop details:", error);
      toast.error("Failed to load crop details");
    } finally {
      setLoading(false);
    }
  };

  const generateDetailedPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text(`${crop?.name} - Complete Growing Guide`, 20, 20);
    
    doc.setFontSize(12);
    let yPosition = 40;
    
    // Crop Overview
    doc.setFontSize(16);
    doc.text("Crop Overview", 20, yPosition);
    yPosition += 10;
    doc.setFontSize(11);
    doc.text(`Category: ${crop?.category}`, 20, yPosition);
    yPosition += 7;
    doc.text(`Growth Duration: ${crop?.growth_duration_days} days`, 20, yPosition);
    yPosition += 7;
    doc.text(`Water Requirement: ${crop?.water_requirement}`, 20, yPosition);
    yPosition += 7;
    doc.text(`Temperature Range: ${crop?.temperature_range}`, 20, yPosition);
    yPosition += 15;

    // Cultivation Steps
    if (cultivationSteps.length > 0) {
      doc.setFontSize(16);
      doc.text("Cultivation Steps", 20, yPosition);
      yPosition += 10;
      
      cultivationSteps.forEach((step, index) => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }
        
        doc.setFontSize(13);
        doc.text(`${step.step_number}. ${step.stage_name}`, 20, yPosition);
        yPosition += 7;
        doc.setFontSize(10);
        const descLines = doc.splitTextToSize(step.description, 170);
        doc.text(descLines, 25, yPosition);
        yPosition += descLines.length * 5 + 5;
        
        if (step.tips) {
          doc.setFontSize(9);
          doc.setTextColor(100, 100, 100);
          const tipLines = doc.splitTextToSize(`Tips: ${step.tips}`, 165);
          doc.text(tipLines, 25, yPosition);
          doc.setTextColor(0, 0, 0);
          yPosition += tipLines.length * 4 + 8;
        }
      });
    }

    doc.save(`${crop?.name}_growing_guide.pdf`);
    toast.success("PDF downloaded successfully!");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!crop) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container py-8">
          <p className="text-center text-muted-foreground">Crop not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{crop.name}</h1>
              <p className="text-muted-foreground">{crop.category}</p>
            </div>
          </div>
          <Button onClick={generateDetailedPDF}>
            <Download className="h-4 w-4 mr-2" />
            Download Full Guide
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                Growth Duration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{crop.growth_duration_days} days</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Droplets className="h-4 w-4 text-blue-500" />
                Water Requirement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-semibold">{crop.water_requirement}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Thermometer className="h-4 w-4 text-orange-500" />
                Temperature Range
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-semibold">{crop.temperature_range}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for detailed information */}
        <Tabs defaultValue="cultivation" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="cultivation">Cultivation Steps</TabsTrigger>
            <TabsTrigger value="farmers">Experienced Farmers</TabsTrigger>
          </TabsList>

          <TabsContent value="cultivation" className="space-y-4">
            {cultivationSteps.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">
                    Detailed cultivation steps will be added soon.
                  </p>
                </CardContent>
              </Card>
            ) : (
              cultivationSteps.map((step) => (
                <Card key={step.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Badge variant="outline">Step {step.step_number}</Badge>
                          {step.stage_name}
                        </CardTitle>
                        {step.duration_days && (
                          <CardDescription className="mt-2">
                            Duration: {step.duration_days} days
                          </CardDescription>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm leading-relaxed">{step.description}</p>
                    {step.tips && (
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <p className="text-sm font-medium mb-1">💡 Pro Tips:</p>
                        <p className="text-sm text-muted-foreground">{step.tips}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="farmers" className="space-y-4">
            {farmerExperiences.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">
                    No farmer experiences available yet. Be the first to share your experience!
                  </p>
                </CardContent>
              </Card>
            ) : (
              farmerExperiences.map((exp) => (
                <Card key={exp.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Users className="h-5 w-5 text-primary" />
                          {exp.farmer.full_name}
                        </CardTitle>
                        <CardDescription>
                          {exp.farmer.experience_years} years of farming experience • Cultivated in {exp.year}
                        </CardDescription>
                      </div>
                      {exp.farmer.phone && (
                        <Button variant="outline" size="sm">
                          Contact
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm font-medium mb-1">Yield Achieved:</p>
                      <p className="text-sm text-muted-foreground">{exp.yield_achieved}</p>
                    </div>
                    {exp.tips && (
                      <div>
                        <p className="text-sm font-medium mb-1">Practical Tips:</p>
                        <p className="text-sm text-muted-foreground">{exp.tips}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
