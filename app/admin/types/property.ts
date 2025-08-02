export type Property = {
  id: number;
  title: string;
  price: number;
  discountedPrice?: number | null; // İndirimli fiyat özelliği eklendi
  location: string;
  consultant: string;
  status: string;
  type: string;
  views: number;
  createdAt: string;
  image: string;
  isActive: boolean;
  description?: string; // İsteğe bağlı açıklama alanı
  area?: number; // Alan bilgisi
};

export type PendingProperty = {
  id: number;
  title: string;
  price: number;
  location: string;
  consultant: string;
  consultantAvatar: string;
  status: string;
  type: string;
  submittedAt: string;
  image: string;
  description: string;
  features: string[];
  notes: string;
};