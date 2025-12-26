
export enum AdTone {
  PROFESSIONAL = 'Professional',
  HUMOROUS = 'Humorous',
  URGENT = 'Urgent',
  INSPIRATIONAL = 'Inspirational',
  LUXURIOUS = 'Luxurious',
  FRIENDLY = 'Friendly'
}

export enum Platform {
  FACEBOOK = 'Facebook/Instagram',
  TWITTER = 'Twitter (X)',
  LINKEDIN = 'LinkedIn',
  EMAIL = 'Email Marketing',
  GOOGLE_SEARCH = 'Google Search Ads',
  TIKTOK = 'TikTok Script',
  SLOGAN = 'Catchy Slogan'
}

export interface AdRequest {
  productName: string;
  targetAudience: string;
  tone: AdTone;
  features: string;
  language: string;
  platforms: Platform[];
}

export interface AdVariation {
  id: string;
  platform: Platform;
  headline: string;
  content: string;
  cta: string;
}

export interface AdResponse {
  variations: AdVariation[];
}
