import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Phone, Mail, MapPin, Search, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface SupportContact {
  id: string;
  name: string;
  designation: string;
  phone: string;
  email: string;
  address: string;
  contact_type: string;
  specialization: string;
  verified: boolean;
  district: {
    name: string;
  };
}

export default function Support() {
  const [contacts, setContacts] = useState<SupportContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [districts, setDistricts] = useState<Array<{ id: string; name: string }>>([]);

  useEffect(() => {
    fetchDistricts();
    fetchContacts();
  }, []);

  const fetchDistricts = async () => {
    const { data } = await supabase.from("districts").select("id, name").order("name");
    if (data) setDistricts(data);
  };

  const fetchContacts = async () => {
    try {
      let query = supabase
        .from("support_contacts")
        .select(`
          *,
          district:districts(name)
        `)
        .order("verified", { ascending: false });

      const { data, error } = await query;
      
      if (error) throw error;
      setContacts(data || []);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      toast.error("Failed to load support contacts");
    } finally {
      setLoading(false);
    }
  };

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch = 
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.designation?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.specialization?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDistrict = selectedDistrict === "all" || contact.district.name === selectedDistrict;
    const matchesType = selectedType === "all" || contact.contact_type === selectedType;

    return matchesSearch && matchesDistrict && matchesType;
  });

  const getContactTypeColor = (type: string) => {
    switch (type) {
      case "officer": return "bg-blue-500/10 text-blue-700";
      case "dealer": return "bg-green-500/10 text-green-700";
      case "cooperative": return "bg-purple-500/10 text-purple-700";
      default: return "bg-gray-500/10 text-gray-700";
    }
  };

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
          <h1 className="text-3xl font-bold">Agricultural Support Center</h1>
          <p className="text-muted-foreground mt-2">
            Find verified contacts for agriculture officers, dealers, and cooperatives
          </p>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Find Support</CardTitle>
            <CardDescription>Search and filter support contacts by location and type</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, designation, or specialization..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Select District" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Districts</SelectItem>
                  {districts.map((district) => (
                    <SelectItem key={district.id} value={district.name}>
                      {district.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Contact Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="officer">Officers</SelectItem>
                  <SelectItem value="dealer">Dealers</SelectItem>
                  <SelectItem value="cooperative">Cooperatives</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-4">
          {filteredContacts.length === 0 ? (
            <Card>
              <CardContent className="pt-6 pb-6">
                <p className="text-center text-muted-foreground">
                  {searchQuery || selectedDistrict !== "all" || selectedType !== "all"
                    ? "No contacts found matching your criteria"
                    : "No support contacts available yet"}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredContacts.map((contact) => (
              <Card key={contact.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle>{contact.name}</CardTitle>
                        {contact.verified && (
                          <Badge variant="outline" className="gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <CardDescription>
                        {contact.designation && <span>{contact.designation} • </span>}
                        <Badge className={getContactTypeColor(contact.contact_type)}>
                          {contact.contact_type.charAt(0).toUpperCase() + contact.contact_type.slice(1)}
                        </Badge>
                      </CardDescription>
                      {contact.specialization && (
                        <p className="text-sm text-muted-foreground mt-2">
                          Specialization: {contact.specialization}
                        </p>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid gap-3 md:grid-cols-2">
                    {contact.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <a href={`tel:${contact.phone}`} className="text-sm hover:underline">
                          {contact.phone}
                        </a>
                      </div>
                    )}
                    {contact.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <a href={`mailto:${contact.email}`} className="text-sm hover:underline">
                          {contact.email}
                        </a>
                      </div>
                    )}
                  </div>
                  {contact.address && (
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <p className="text-sm text-muted-foreground">
                        {contact.address}, {contact.district.name}
                      </p>
                    </div>
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
