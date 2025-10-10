-- Districts with agricultural data
CREATE TABLE public.districts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  state TEXT DEFAULT 'Tamil Nadu',
  avg_rainfall NUMERIC,
  soil_type TEXT,
  climate_zone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Crops with complete cultivation data
CREATE TABLE public.crops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  category TEXT,
  growth_duration_days INTEGER,
  water_requirement TEXT,
  temperature_range TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- District-specific crop suitability scores
CREATE TABLE public.district_crop_suitability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  district_id UUID REFERENCES public.districts(id) ON DELETE CASCADE,
  crop_id UUID REFERENCES public.crops(id) ON DELETE CASCADE,
  suitability_score NUMERIC CHECK (suitability_score >= 0 AND suitability_score <= 100),
  estimated_yield TEXT,
  market_price TEXT,
  expected_revenue TEXT,
  harvest_months TEXT,
  soil_requirements TEXT,
  water_needs TEXT,
  temperature TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(district_id, crop_id)
);

-- Step-by-step cultivation procedures
CREATE TABLE public.crop_cultivation_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  crop_id UUID REFERENCES public.crops(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  stage_name TEXT NOT NULL,
  description TEXT NOT NULL,
  duration_days INTEGER,
  tips TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agriculture support contacts
CREATE TABLE public.support_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  district_id UUID REFERENCES public.districts(id) ON DELETE CASCADE,
  contact_type TEXT NOT NULL,
  name TEXT NOT NULL,
  designation TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  specialization TEXT,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Update profiles table with new fields
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS district_id UUID REFERENCES public.districts(id);
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS experience_years INTEGER;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS preferred_language TEXT DEFAULT 'en';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio TEXT;

-- Track which crops farmers have grown
CREATE TABLE public.farmer_crop_experience (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  crop_id UUID REFERENCES public.crops(id) ON DELETE CASCADE,
  district_id UUID REFERENCES public.districts(id) ON DELETE CASCADE,
  year INTEGER,
  yield_achieved TEXT,
  challenges TEXT,
  tips TEXT,
  willing_to_help BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Peer communication/messaging
CREATE TABLE public.farmer_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  crop_id UUID REFERENCES public.crops(id) ON DELETE SET NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Q&A / Help requests
CREATE TABLE public.help_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  crop_id UUID REFERENCES public.crops(id) ON DELETE SET NULL,
  question TEXT NOT NULL,
  status TEXT DEFAULT 'open',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.help_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES public.help_requests(id) ON DELETE CASCADE,
  responder_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  response TEXT NOT NULL,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.districts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.district_crop_suitability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crop_cultivation_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farmer_crop_experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farmer_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.help_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.help_responses ENABLE ROW LEVEL SECURITY;

-- RLS Policies for districts (public read)
CREATE POLICY "Anyone can view districts" ON public.districts FOR SELECT USING (true);

-- RLS Policies for crops (public read)
CREATE POLICY "Anyone can view crops" ON public.crops FOR SELECT USING (true);

-- RLS Policies for district_crop_suitability (public read)
CREATE POLICY "Anyone can view crop suitability" ON public.district_crop_suitability FOR SELECT USING (true);

-- RLS Policies for crop_cultivation_steps (public read)
CREATE POLICY "Anyone can view cultivation steps" ON public.crop_cultivation_steps FOR SELECT USING (true);

-- RLS Policies for support_contacts (public read)
CREATE POLICY "Anyone can view support contacts" ON public.support_contacts FOR SELECT USING (true);

-- RLS Policies for farmer_crop_experience (users can view, insert own, update own)
CREATE POLICY "Anyone can view farmer experiences" ON public.farmer_crop_experience FOR SELECT USING (true);
CREATE POLICY "Users can insert own experience" ON public.farmer_crop_experience FOR INSERT WITH CHECK (auth.uid() = farmer_id);
CREATE POLICY "Users can update own experience" ON public.farmer_crop_experience FOR UPDATE USING (auth.uid() = farmer_id);
CREATE POLICY "Users can delete own experience" ON public.farmer_crop_experience FOR DELETE USING (auth.uid() = farmer_id);

-- RLS Policies for farmer_messages
CREATE POLICY "Users can view their messages" ON public.farmer_messages FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Users can send messages" ON public.farmer_messages FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Users can update their received messages" ON public.farmer_messages FOR UPDATE USING (auth.uid() = receiver_id);

-- RLS Policies for help_requests
CREATE POLICY "Anyone can view help requests" ON public.help_requests FOR SELECT USING (true);
CREATE POLICY "Users can create help requests" ON public.help_requests FOR INSERT WITH CHECK (auth.uid() = farmer_id);
CREATE POLICY "Users can update own help requests" ON public.help_requests FOR UPDATE USING (auth.uid() = farmer_id);

-- RLS Policies for help_responses
CREATE POLICY "Anyone can view help responses" ON public.help_responses FOR SELECT USING (true);
CREATE POLICY "Users can create help responses" ON public.help_responses FOR INSERT WITH CHECK (auth.uid() = responder_id);
CREATE POLICY "Users can update own responses" ON public.help_responses FOR UPDATE USING (auth.uid() = responder_id);

-- Insert sample districts
INSERT INTO public.districts (name, avg_rainfall, soil_type, climate_zone) VALUES
('Ariyalur', 950, 'Clay loam', 'Semi-arid'),
('Chengalpattu', 1200, 'Red soil', 'Tropical'),
('Chennai', 1400, 'Sandy loam', 'Tropical coastal'),
('Coimbatore', 700, 'Red soil', 'Semi-arid'),
('Cuddalore', 1300, 'Alluvial', 'Tropical'),
('Dharmapuri', 900, 'Red soil', 'Semi-arid'),
('Dindigul', 850, 'Red soil', 'Semi-arid'),
('Erode', 750, 'Black soil', 'Semi-arid'),
('Kallakurichi', 1100, 'Red soil', 'Sub-humid'),
('Kanchipuram', 1250, 'Red loam', 'Tropical'),
('Kanyakumari', 1800, 'Laterite', 'Tropical humid'),
('Karur', 800, 'Black soil', 'Semi-arid'),
('Krishnagiri', 850, 'Red soil', 'Semi-arid'),
('Madurai', 900, 'Red soil', 'Semi-arid'),
('Mayiladuthurai', 1200, 'Alluvial', 'Tropical'),
('Nagapattinam', 1350, 'Alluvial', 'Tropical coastal'),
('Namakkal', 800, 'Red soil', 'Semi-arid'),
('Nilgiris', 2500, 'Mountain soil', 'Temperate'),
('Perambalur', 900, 'Red soil', 'Semi-arid'),
('Pudukkottai', 950, 'Red soil', 'Semi-arid'),
('Ramanathapuram', 850, 'Sandy', 'Semi-arid'),
('Ranipet', 1100, 'Red soil', 'Sub-humid'),
('Salem', 850, 'Red soil', 'Semi-arid'),
('Sivaganga', 900, 'Red soil', 'Semi-arid'),
('Tenkasi', 1100, 'Red loam', 'Sub-humid'),
('Thanjavur', 1100, 'Alluvial', 'Tropical'),
('Theni', 800, 'Red soil', 'Semi-arid'),
('Thoothukudi', 700, 'Sandy loam', 'Semi-arid coastal'),
('Tiruchirappalli', 850, 'Alluvial', 'Semi-arid'),
('Tirunelveli', 750, 'Black soil', 'Semi-arid'),
('Tirupathur', 950, 'Red soil', 'Semi-arid'),
('Tiruppur', 700, 'Red soil', 'Semi-arid'),
('Tiruvallur', 1200, 'Red loam', 'Tropical'),
('Tiruvannamalai', 1000, 'Red soil', 'Sub-humid'),
('Tiruvarur', 1150, 'Alluvial', 'Tropical'),
('Vellore', 1000, 'Red soil', 'Semi-arid'),
('Viluppuram', 1200, 'Red soil', 'Sub-humid'),
('Virudhunagar', 850, 'Red soil', 'Semi-arid');

-- Insert sample crops
INSERT INTO public.crops (name, category, growth_duration_days, water_requirement, temperature_range) VALUES
('Rice', 'Cereals', 120, 'High - 1200-1500mm', '20-35°C'),
('Sugarcane', 'Cash Crops', 365, 'High - 1500-2500mm', '20-35°C'),
('Cotton', 'Cash Crops', 180, 'Moderate - 600-1200mm', '21-30°C'),
('Groundnut', 'Oilseeds', 120, 'Moderate - 500-750mm', '20-30°C'),
('Maize', 'Cereals', 90, 'Moderate - 500-750mm', '18-27°C'),
('Millets', 'Cereals', 90, 'Low - 350-450mm', '25-35°C'),
('Black Gram', 'Pulses', 75, 'Low - 400-600mm', '25-35°C'),
('Green Gram', 'Pulses', 70, 'Low - 400-600mm', '25-35°C'),
('Red Gram', 'Pulses', 180, 'Moderate - 600-1000mm', '20-30°C'),
('Banana', 'Horticulture', 365, 'High - 2000-2500mm', '15-35°C'),
('Coconut', 'Plantation', 1825, 'High - 1500-2500mm', '20-32°C'),
('Turmeric', 'Spices', 270, 'Moderate - 1500-2250mm', '20-30°C'),
('Chilli', 'Spices', 150, 'Moderate - 600-1250mm', '20-30°C'),
('Onion', 'Vegetables', 120, 'Moderate - 650-1000mm', '15-25°C'),
('Tomato', 'Vegetables', 120, 'Moderate - 600-1250mm', '15-30°C');