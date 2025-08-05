// app/types/property.ts

export interface Property {
  _id: string;
  title: string;
  price: number;
  discountedPrice?: number;
  description?: string;
  location?: {
    lat?: string | number;
    lng?: string | number;
  };
  address?: string;
  district?: string;
  city?: string;
  agent?: {
    _id?: string;
    name: string;
    email: string;
    phone?: string;
    image?: string;
  };
  status: string;
  type?: string;
  propertyType?: string;
  isApproved?: boolean;
  mainImage?: string;
  images?: string[];
  createdAt?: string;
  updatedAt?: string;
  views?: number;
  area?: number;
  bedrooms?: string | number;
  bathrooms?: string | number;
  features?: string[] | string;
  nearbyPlaces?: string[] | string;
  slug?: string;
  currency?: string;
  category?: string;
  buildingAge?: string | number;
  floor?: string | number;
  totalFloors?: string | number;
  furnished?: boolean;
  balcony?: boolean;
  parking?: boolean;
  elevator?: boolean;
  security?: boolean;
  garden?: boolean;
}

export interface PendingProperty extends Property {
  submittedAt?: string;
  notes?: string;
  consultant?: string;
  consultantAvatar?: string;
  image?: string;
}