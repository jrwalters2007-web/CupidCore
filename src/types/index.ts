export interface UserProfile {
  id: string;
  displayName: string;
  email: string;
  age?: number;
  gender?: string;
  lookingFor?: string;
  bio?: string;
  photos?: string[];
  interests?: string[];
  occupation?: string;
  location?: string;
  createdAt: Date;
  updatedAt: Date;
  isPremium: boolean;
  premiumTier?: string;
  premiumExpiresAt?: Date;
  purchasedTemplates?: string[];
  adFree?: boolean;
  profileScore?: number;
}

export interface DatingProfile {
  bio: string;
  photos: string[];
  interests: string[];
  redFlags: string[];
  strengths: string[];
  aiFeedback: string;
  score: number;
}

export interface PremiumPlan {
  id: string;
  title: string;
  price: string;
  period: string;
  features: string[];
  popular?: boolean;
}

export interface OneTimeProduct {
  id: string;
  title: string;
  description: string;
  price: string;
  icon: string;
}

export interface AdviceMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface BioTemplate {
  id: string;
  title: string;
  category: string;
  content: string;
  premium: boolean;
  purchased?: boolean;
}

export interface PhotoTip {
  id: string;
  title: string;
  description: string;
  category: string;
  premium: boolean;
}
