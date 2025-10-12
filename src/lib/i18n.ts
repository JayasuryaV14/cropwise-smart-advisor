import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Navigation
      "nav.dashboard": "Dashboard",
      "nav.support": "Support",
      "nav.community": "Community",
      "nav.profile": "Profile",
      "nav.logout": "Logout",
      
      // Dashboard
      "dashboard.title": "Crop Recommendations",
      "dashboard.subtitle": "AI-powered analysis based on your location's soil and weather conditions",
      "dashboard.selectDistrict": "Step 1: Select Your District",
      "dashboard.selectDistrictDesc": "Choose your district to get personalized crop recommendations",
      "dashboard.selectPlaceholder": "Select a district",
      "dashboard.recommendations": "Recommended Crops",
      "dashboard.backToDistrict": "Back to District Selection",
      "dashboard.compare": "Compare Crops",
      "dashboard.simulate": "Simulate Yield",
      
      // Crop Details
      "crop.suitability": "Suitability Score",
      "crop.yield": "Estimated Yield",
      "crop.harvest": "Harvest Time",
      "crop.price": "Market Price",
      "crop.revenue": "Expected Revenue",
      "crop.soil": "Soil Requirements",
      "crop.water": "Water Needs",
      "crop.temperature": "Temperature",
      "crop.viewDetails": "View Details",
      
      // Comparison
      "compare.title": "Crop Comparison",
      "compare.select": "Select crops to compare",
      "compare.selected": "selected",
      "compare.start": "Start Comparison",
      "compare.clear": "Clear Selection",
      
      // Simulator
      "simulator.title": "Yield Simulator",
      "simulator.rainfall": "Rainfall (mm)",
      "simulator.fertilizer": "Fertilizer Usage",
      "simulator.low": "Low",
      "simulator.medium": "Medium",
      "simulator.high": "High",
      "simulator.technology": "Technology Level",
      "simulator.basic": "Basic",
      "simulator.moderate": "Moderate",
      "simulator.advanced": "Advanced",
      "simulator.projectedYield": "Projected Yield",
      "simulator.estimatedCost": "Estimated Cost",
      "simulator.expectedRevenue": "Expected Revenue",
      "simulator.netProfit": "Net Profit",
      "simulator.roi": "ROI",
      
      // Support
      "support.title": "Farmer Support Center",
      "support.contacts": "Support Contacts",
      "support.qa": "Questions & Answers",
      
      // Community
      "community.title": "Farmer Community",
      "community.connect": "Connect with experienced farmers",
      
      // Profile
      "profile.title": "My Profile",
      "profile.settings": "Profile Settings",
      
      // Common
      "common.loading": "Loading...",
      "common.save": "Save",
      "common.cancel": "Cancel",
      "common.back": "Back",
      "common.next": "Next",
    }
  },
  ta: {
    translation: {
      // Navigation
      "nav.dashboard": "முகப்பு",
      "nav.support": "ஆதரவு",
      "nav.community": "சமூகம்",
      "nav.profile": "சுயவிவரம்",
      "nav.logout": "வெளியேறு",
      
      // Dashboard
      "dashboard.title": "பயிர் பரிந்துரைகள்",
      "dashboard.subtitle": "உங்கள் பகுதியின் மண் மற்றும் வானிலை நிலைமைகளின் அடிப்படையில் AI-இயங்கும் பகுப்பாய்வு",
      "dashboard.selectDistrict": "படி 1: உங்கள் மாவட்டத்தைத் தேர்ந்தெடுக்கவும்",
      "dashboard.selectDistrictDesc": "தனிப்பயனாக்கப்பட்ட பயிர் பரிந்துரைகளைப் பெற உங்கள் மாவட்டத்தைத் தேர்ந்தெடுக்கவும்",
      "dashboard.selectPlaceholder": "ஒரு மாவட்டத்தைத் தேர்ந்தெடுக்கவும்",
      "dashboard.recommendations": "பரிந்துரைக்கப்பட்ட பயிர்கள்",
      "dashboard.backToDistrict": "மாவட்ட தேர்வுக்குத் திரும்பு",
      "dashboard.compare": "பயிர்களை ஒப்பிடுக",
      "dashboard.simulate": "விளைச்சலை உருவகப்படுத்துக",
      
      // Crop Details
      "crop.suitability": "பொருத்தம் மதிப்பெண்",
      "crop.yield": "மதிப்பிடப்பட்ட விளைச்சல்",
      "crop.harvest": "அறுவடை நேரம்",
      "crop.price": "சந்தை விலை",
      "crop.revenue": "எதிர்பார்க்கப்படும் வருவாய்",
      "crop.soil": "மண் தேவைகள்",
      "crop.water": "தண்ணீர் தேவைகள்",
      "crop.temperature": "வெப்பநிலை",
      "crop.viewDetails": "விவரங்களைக் காண்க",
      
      // Comparison
      "compare.title": "பயிர் ஒப்பீடு",
      "compare.select": "ஒப்பிடுவதற்கு பயிர்களைத் தேர்ந்தெடுக்கவும்",
      "compare.selected": "தேர்ந்தெடுக்கப்பட்டது",
      "compare.start": "ஒப்பீட்டைத் தொடங்கு",
      "compare.clear": "தேர்வை அழி",
      
      // Simulator
      "simulator.title": "விளைச்சல் உருவகப்படுத்தி",
      "simulator.rainfall": "மழைப்பொழிவு (மிமீ)",
      "simulator.fertilizer": "உர பயன்பாடு",
      "simulator.low": "குறைவு",
      "simulator.medium": "நடுத்தர",
      "simulator.high": "அதிக",
      "simulator.technology": "தொழில்நுட்ப நிலை",
      "simulator.basic": "அடிப்படை",
      "simulator.moderate": "மிதமான",
      "simulator.advanced": "மேம்பட்ட",
      "simulator.projectedYield": "திட்டமிடப்பட்ட விளைச்சல்",
      "simulator.estimatedCost": "மதிப்பிடப்பட்ட செலவு",
      "simulator.expectedRevenue": "எதிர்பார்க்கப்படும் வருவாய்",
      "simulator.netProfit": "நிகர லாபம்",
      "simulator.roi": "முதலீட்டு வருவாய்",
      
      // Support
      "support.title": "விவசாயி ஆதரவு மையம்",
      "support.contacts": "ஆதரவு தொடர்புகள்",
      "support.qa": "கேள்விகள் & பதில்கள்",
      
      // Community
      "community.title": "விவசாயி சமூகம்",
      "community.connect": "அனுபவமுள்ள விவசாயிகளுடன் இணையுங்கள்",
      
      // Profile
      "profile.title": "எனது சுயவிவரம்",
      "profile.settings": "சுயவிவர அமைப்புகள்",
      
      // Common
      "common.loading": "ஏற்றுகிறது...",
      "common.save": "சேமி",
      "common.cancel": "ரத்து செய்",
      "common.back": "பின்",
      "common.next": "அடுத்து",
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
