
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

export type Question = {
  id: keyof RiderProfile;
  label: string;
  options: string[];
};

export type Message = {
  role: 'user' | 'assistant';
  content: string;
};
