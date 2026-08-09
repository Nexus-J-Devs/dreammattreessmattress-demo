export type Category = 'Hybrid' | 'Cooling Gel' | 'Organic Latex' | 'Orthopedic' | 'Adjustable';

export interface MattressLayer {
  title: string;
  depth: string;
  description: string;
}

export interface Mattress {
  id: string;
  name: string;
  tagline: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewCount: number;
  firmness: number; // 1 to 10
  firmnessLabel: string;
  stock: number;
  category: Category;
  coolingTech: string;
  thickness: string;
  coilCount: string;
  trialPeriod: string;
  warranty: string;
  image: string;
  features: string[];
  isPopular?: boolean;
  isBestForBackPain?: boolean;
  layers: MattressLayer[];
  description: string;
}

export interface QuizAnswers {
  sleepPosition: 'side' | 'back' | 'stomach' | 'combination';
  firmnessPreference: 'soft' | 'medium-soft' | 'medium-firm' | 'firm';
  temperature: 'hot' | 'neutral' | 'cold';
  painPoints: string[]; // e.g. ['lower_back', 'shoulders', 'hips', 'snoring']
  bodyType: 'light' | 'average' | 'heavy';
  budget: 'budget' | 'mid' | 'luxury';
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
}

export interface QuizSubmission {
  id: string;
  timestamp: string;
  answers: QuizAnswers;
  recommendedProduct: Mattress;
  matchScore: number;
  status: 'New' | 'Contacted' | 'Converted';
  notes?: string;
}

export interface DiscountPromo {
  id: string;
  code: string;
  title: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  description: string;
  isActive: boolean;
  validUntil: string;
}

export type Role = 'customer' | 'admin';

export interface UserSession {
  role: Role;
  token?: string;
  email?: string;
  name?: string;
}

export interface WSNotification {
  id: string;
  type: 'LOW_STOCK' | 'QUIZ_SUBMISSION' | 'INVENTORY_UPDATE' | 'NEW_SALE' | 'SYSTEM';
  title: string;
  message: string;
  timestamp: string;
  severity: 'info' | 'warning' | 'danger' | 'success';
  data?: any;
}
