import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Users, MessageSquare, Search, Send, Award } from "lucide-react";
import { toast } from "sonner";

interface FarmerProfile {
  id: string;
  full_name: string;
  phone: string;
  experience_years: number;
  district: {
    name: string;
  };
  farmer_crop_experience: Array<{
    crop: {
      name: string;
    };
    year: number;
    yield_achieved: string;
  }>;
}

export default function Community() {
  const navigate = useNavigate();
  const [farmers, setFarmers] = useState<FarmerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCrop, setSelectedCrop] = useState<string>("all");
  const [crops, setCrops] = useState<Array<{ id: string; name: string }>>([]);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  
  // Message dialog state
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [selectedFarmer, setSelectedFarmer] = useState<FarmerProfile | null>(null);
  const [messageSubject, setMessageSubject] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    checkAuth();
    fetchCrops();
    fetchFarmers();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return;
    }
    setCurrentUser(session.user.id);
  };

  const fetchCrops = async () => {
    const { data } = await supabase.from("crops").select("id, name").order("name");
    if (data) setCrops(data);
  };

  const fetchFarmers = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select(`
          id,
          full_name,
          phone,
          experience_years,
          district:districts(name),
          farmer_crop_experience(
            crop:crops(name),
            year,
            yield_achieved
          )
        `)
        .not("full_name", "is", null)
        .gt("experience_years", 0);

      if (error) throw error;
      setFarmers(data || []);
    } catch (error) {
      console.error("Error fetching farmers:", error);
      toast.error("Failed to load farmers");
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!currentUser || !selectedFarmer) return;
    
    if (!messageSubject.trim() || !messageContent.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setSendingMessage(true);
    try {
      const { error } = await supabase.from("farmer_messages").insert({
        sender_id: currentUser,
        receiver_id: selectedFarmer.id,
        subject: messageSubject,
        message: messageContent,
      });

      if (error) throw error;
      
      toast.success("Message sent successfully!");
      setMessageDialogOpen(false);
      setMessageSubject("");
      setMessageContent("");
      setSelectedFarmer(null);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    } finally {
      setSendingMessage(false);
    }
  };

  const filteredFarmers = farmers.filter((farmer) => {
    const matchesSearch = 
      farmer.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      farmer.district?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCrop = selectedCrop === "all" || 
      farmer.farmer_crop_experience?.some(exp => exp.crop?.name === selectedCrop);

    return matchesSearch && matchesCrop;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Farmer Community</h1>
          <p className="text-muted-foreground mt-2">
            Connect with experienced farmers and learn from their real-world knowledge
          </p>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Find Farmers</CardTitle>
            <CardDescription>Search for farmers by name, location, or crop experience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or district..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCrop} onValueChange={setSelectedCrop}>
                <SelectTrigger className="w-full md:w-[250px]">
                  <SelectValue placeholder="Filter by crop" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Crops</SelectItem>
                  {crops.map((crop) => (
                    <SelectItem key={crop.id} value={crop.name}>
                      {crop.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Farmers List */}
        <div className="grid gap-4 md:grid-cols-2">
          {filteredFarmers.length === 0 ? (
            <Card className="md:col-span-2">
              <CardContent className="pt-6 pb-6">
                <p className="text-center text-muted-foreground">
                  No farmers found matching your criteria
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredFarmers.map((farmer) => (
              <Card key={farmer.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary" />
                        {farmer.full_name}
                      </CardTitle>
                      <CardDescription className="mt-2">
                        {farmer.district?.name && (
                          <span>{farmer.district.name} • </span>
                        )}
                        {farmer.experience_years > 0 && (
                          <Badge variant="secondary" className="gap-1">
                            <Award className="h-3 w-3" />
                            {farmer.experience_years} years experience
                          </Badge>
                        )}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {farmer.farmer_crop_experience && farmer.farmer_crop_experience.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">Crops Grown:</p>
                      <div className="flex flex-wrap gap-2">
                        {farmer.farmer_crop_experience.map((exp, idx) => (
                          <Badge key={idx} variant="outline">
                            {exp.crop?.name} ({exp.year})
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {farmer.id !== currentUser && (
                    <Dialog open={messageDialogOpen && selectedFarmer?.id === farmer.id} onOpenChange={(open) => {
                      setMessageDialogOpen(open);
                      if (!open) setSelectedFarmer(null);
                    }}>
                      <DialogTrigger asChild>
                        <Button 
                          className="w-full mt-2" 
                          variant="outline"
                          onClick={() => setSelectedFarmer(farmer)}
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Send Message
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Send Message to {farmer.full_name}</DialogTitle>
                          <DialogDescription>
                            Connect with {farmer.full_name} to learn from their farming experience
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="subject">Subject</Label>
                            <Input
                              id="subject"
                              placeholder="What do you want to discuss?"
                              value={messageSubject}
                              onChange={(e) => setMessageSubject(e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor="message">Message</Label>
                            <Textarea
                              id="message"
                              placeholder="Type your message here..."
                              value={messageContent}
                              onChange={(e) => setMessageContent(e.target.value)}
                              rows={5}
                            />
                          </div>
                          <Button 
                            onClick={handleSendMessage} 
                            disabled={sendingMessage}
                            className="w-full"
                          >
                            <Send className="h-4 w-4 mr-2" />
                            {sendingMessage ? "Sending..." : "Send Message"}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
