export interface User {
  bio: string;
  avatar: null;
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'consultant';
  phone?: string;
  createdAt: string;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: {
    city: string;
    district: string;
    address: string;
  };
  type: 'apartment' | 'house' | 'commercial' | 'land';
  status: 'for_sale' | 'for_rent' | 'sold' | 'rented';
  features: {
    area: number;
    rooms: number;
    bathrooms: number;
    floor: number;
    parking: boolean;
    furnished: boolean;
  };
  images: string[];
  consultantId: string;
  consultant: User;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  propertyId: string;
  property: Property;
  userName: string;
  userEmail: string;
  userPhone?: string;
  message: string;
  rating: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}