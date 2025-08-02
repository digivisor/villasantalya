'use client';

import { Eye, MapPin, User, Calendar, Home, Tag, DollarSign } from 'lucide-react';
import Modal from '../ui/Modal';
import { Property } from '../../types/property';

type PropertyDetailsModalProps = {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
};

export default function PropertyDetailsModal({ 
  property, 
  isOpen, 
  onClose 
}: PropertyDetailsModalProps) {
  if (!property) return null;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'aktif':
        return 'bg-green-100 text-green-800';
      case 'beklemede':
        return 'bg-yellow-100 text-yellow-800';
      case 'satıldı':
        return 'bg-red-100 text-red-800';
      case 'kiralandı':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    return type === 'Satılık' 
      ? 'bg-blue-100 text-blue-800' 
      : 'bg-purple-100 text-purple-800';
  };

  // İndirim yüzdesini hesapla
  const calculateDiscountPercentage = () => {
    if (!property.discountedPrice || property.discountedPrice >= property.price) return 0;
    return Math.round(100 - (property.discountedPrice / property.price * 100));
  };

  const discountPercentage = calculateDiscountPercentage();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="İlan Detayları" size="lg">
      <div className="space-y-6">
        <div className="relative rounded-lg overflow-hidden h-72">
          <img 
            src={property.image} 
            alt={property.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4 flex space-x-2">
            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getTypeColor(property.type)}`}>
              {property.type}
            </span>
            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(property.status)}`}>
              {property.status}
            </span>
          </div>

          {/* İndirim rozeti */}
          {discountPercentage > 0 && (
            <div className="absolute top-4 right-4">
              <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-red-500 text-white">
                %{discountPercentage} İndirim
              </span>
            </div>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{property.title}</h2>
          <div className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-blue-600">
              {property.discountedPrice ? (
                <span>₺{property.discountedPrice.toLocaleString()}</span>
              ) : (
                <span>₺{property.price.toLocaleString()}</span>
              )}
              {property.type === 'Kiralık' && <span className="text-sm text-gray-500">/ay</span>}
            </div>
            {property.discountedPrice && (
              <span className="text-lg line-through text-gray-400">₺{property.price.toLocaleString()}</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center text-gray-700">
              <MapPin className="h-5 w-5 mr-2 text-blue-600" />
              <span>{property.location}</span>
            </div>
            
            <div className="flex items-center text-gray-700">
              <User className="h-5 w-5 mr-2 text-blue-600" />
              <span>Danışman: {property.consultant}</span>
            </div>
            
            <div className="flex items-center text-gray-700">
              <Calendar className="h-5 w-5 mr-2 text-blue-600" />
              <span>İlan Tarihi: {new Date(property.createdAt).toLocaleDateString('tr-TR')}</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center text-gray-700">
              <Home className="h-5 w-5 mr-2 text-blue-600" />
              <span>İlan Tipi: {property.type}</span>
            </div>
            
            <div className="flex items-center text-gray-700">
              <Tag className="h-5 w-5 mr-2 text-blue-600" />
              <span>Durum: {property.status}</span>
            </div>
            
            <div className="flex items-center text-gray-700">
              <Eye className="h-5 w-5 mr-2 text-blue-600" />
              <span>{property.views} görüntüleme</span>
            </div>

            {property.area && (
              <div className="flex items-center text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                </svg>
                <span>Alan: {property.area}m²</span>
              </div>
            )}
          </div>
        </div>

        {property.description && (
          <div className="pt-4 border-t">
            <h3 className="font-semibold text-lg mb-2">İlan Açıklaması</h3>
            <p className="text-gray-700">
              {property.description}
            </p>
          </div>
        )}
        
        <div className="pt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors"
          >
            Kapat
          </button>
        </div>
      </div>
    </Modal>
  );
}