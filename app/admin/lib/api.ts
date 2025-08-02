import { User, Property, Comment } from './types';

// Mock data
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@emlak.com',
    name: 'Admin User',
    role: 'admin',
    phone: '+90 555 123 4567',
    createdAt: '2024-01-15T10:00:00Z',
    bio: '',
    avatar: null
  },
  {
    id: '2',
    email: 'ahmet@emlak.com',
    name: 'Ahmet Yılmaz',
    role: 'consultant',
    phone: '+90 555 234 5678',
    createdAt: '2024-01-16T10:00:00Z',
    bio: '',
    avatar: null
  },
  {
    id: '3',
    email: 'ayse@emlak.com',
    name: 'Ayşe Kaya',
    role: 'consultant',
    phone: '+90 555 345 6789',
    createdAt: '2024-01-17T10:00:00Z',
    bio: '',
    avatar: null
  }
];

const mockProperties: Property[] = [
  {
    id: '1',
    title: 'Modern 3+1 Daire Kadıköy',
    description: 'Merkezi konumda, yeni yapılmış modern daire. Denize yakın, ulaşım kolaylığı.',
    price: 2500000,
    location: {
      city: 'İstanbul',
      district: 'Kadıköy',
      address: 'Fenerbahçe Mahallesi, Bağdat Caddesi No:123'
    },
    type: 'apartment',
    status: 'for_sale',
    features: {
      area: 120,
      rooms: 4,
      bathrooms: 2,
      floor: 5,
      parking: true,
      furnished: false
    },
    images: [
      'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg',
      'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg'
    ],
    consultantId: '2',
    consultant: mockUsers[1],
    createdAt: '2024-01-18T10:00:00Z',
    updatedAt: '2024-01-18T10:00:00Z'
  },
  {
    id: '2',
    title: 'Lüks Villa Beşiktaş',
    description: 'Boğaz manzaralı özel villa. Bahçesi ve havuzu bulunan eşsiz konum.',
    price: 8500000,
    location: {
      city: 'İstanbul',
      district: 'Beşiktaş',
      address: 'Bebek Mahallesi, Sahil Sokak No:45'
    },
    type: 'house',
    status: 'for_sale',
    features: {
      area: 350,
      rooms: 6,
      bathrooms: 4,
      floor: 2,
      parking: true,
      furnished: true
    },
    images: [
      'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg',
      'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg'
    ],
    consultantId: '3',
    consultant: mockUsers[2],
    createdAt: '2024-01-19T10:00:00Z',
    updatedAt: '2024-01-19T10:00:00Z'
  }
];

const mockComments: Comment[] = [
  {
    id: '1',
    propertyId: '1',
    property: mockProperties[0],
    userName: 'Mehmet Demir',
    userEmail: 'mehmet@example.com',
    userPhone: '+90 555 987 6543',
    message: 'Bu daire çok beğendiğim. Fiyat konusunda görüşmek istiyorum.',
    rating: 5,
    status: 'pending',
    createdAt: '2024-01-20T10:00:00Z'
  },
  {
    id: '2',
    propertyId: '2',
    property: mockProperties[1],
    userName: 'Fatma Şahin',
    userEmail: 'fatma@example.com',
    message: 'Villa çok güzel ama fiyat biraz yüksek.',
    rating: 4,
    status: 'approved',
    createdAt: '2024-01-21T10:00:00Z'
  }
];

// API functions
export const authAPI = {
  login: async (email: string, password: string): Promise<User | null> => {
    // Mock authentication
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = mockUsers.find(u => u.email === email);
    if (user && password === '123456') {
      return user;
    }
    return null;
  }
};

export const propertiesAPI = {
  getAll: async (): Promise<Property[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockProperties;
  },

  getByConsultant: async (consultantId: string): Promise<Property[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockProperties.filter(p => p.consultantId === consultantId);
  },

  create: async (property: Omit<Property, 'id' | 'createdAt' | 'updatedAt' | 'consultant'>): Promise<Property> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const consultant = mockUsers.find(u => u.id === property.consultantId)!;
    const newProperty: Property = {
      ...property,
      id: Date.now().toString(),
      consultant,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockProperties.push(newProperty);
    return newProperty;
  },

  update: async (id: string, updates: Partial<Property>): Promise<Property> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockProperties.findIndex(p => p.id === id);
    if (index !== -1) {
      mockProperties[index] = {
        ...mockProperties[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      return mockProperties[index];
    }
    throw new Error('Property not found');
  },

  delete: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockProperties.findIndex(p => p.id === id);
    if (index !== -1) {
      mockProperties.splice(index, 1);
    }
  }
};

export const usersAPI = {
  getConsultants: async (): Promise<User[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockUsers.filter(u => u.role === 'consultant');
  },

  create: async (user: Omit<User, 'id' | 'createdAt'>): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newUser: User = {
      ...user,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    mockUsers.push(newUser);
    return newUser;
  },

  delete: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockUsers.findIndex(u => u.id === id);
    if (index !== -1) {
      mockUsers.splice(index, 1);
    }
  }
};

export const commentsAPI = {
  getAll: async (): Promise<Comment[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockComments;
  },

  updateStatus: async (id: string, status: Comment['status']): Promise<Comment> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockComments.findIndex(c => c.id === id);
    if (index !== -1) {
      mockComments[index].status = status;
      return mockComments[index];
    }
    throw new Error('Comment not found');
  },

  delete: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockComments.findIndex(c => c.id === id);
    if (index !== -1) {
      mockComments.splice(index, 1);
    }
  }
};