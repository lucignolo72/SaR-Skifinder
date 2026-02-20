
export type RiderProfile = {
  level: string;
  physique: string;
  terrain: string;
  snowType: string;
  style: string;
  speed: string;
  turns: string;
  typicalDay: string;
  freerideInterest: string;
};

export type SkiRecommendation = {
  brand: string;
  model: string;
  year: string;
  description: string;
  pros: string[];
  cons: string[];
  approxPrice: string;
  imagePrompt: string;
  imageUrl?: string; // To be populated after generation
};

export type FullRecommendation = {
  technicalAnalysis: string;
  skis: SkiRecommendation[];
  lengthRecommendation: string;
  terrain: string;
  setup: string;
  safetyNote: string;
  expertTip: string;
};

export type Question = {
  id: keyof RiderProfile;
  label: string;
  options: string[];
};

export type Message = {
  role: 'user' | 'assistant';
  content: string;
};
