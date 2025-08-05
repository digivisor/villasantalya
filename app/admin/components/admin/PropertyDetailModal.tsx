import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Property } from '../../types/property';

interface PropertyDetailsModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function PropertyDetailsModal({ property, isOpen, onClose }: PropertyDetailsModalProps) {
  if (!property) return null;

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  const formatImageUrl = (imagePath?: string) => {
    if (!imagePath) return "/placeholder.svg";
    if (imagePath.startsWith('http')) return imagePath;
    return `${apiBaseUrl.replace('/api', '')}${imagePath}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{property.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="aspect-video relative overflow-hidden rounded-lg">
            <img 
              src={formatImageUrl(property.mainImage)} 
              alt={property.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Fiyat</h4>
              <p className="text-lg font-semibold">{property.price?.toLocaleString()} {property.currency || '₺'}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500">İlan Türü</h4>
              <p className="text-lg font-semibold">{property.type === 'sale' ? 'Satılık' : 'Kiralık'}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500">Durum</h4>
              <p className="text-lg font-semibold">
                {property.status === 'active' ? 'Aktif' : 
                 property.status === 'pending' ? 'Beklemede' :
                 property.status === 'rejected' ? 'Reddedildi' : 
                 property.status === 'sold' ? 'Satıldı' : property.status}
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500">İlan Tarihi</h4>
              <p className="text-lg font-semibold">
                {property.createdAt ? new Date(property.createdAt).toLocaleDateString('tr-TR') : '-'}
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2">Açıklama</h4>
            <p className="text-gray-700 whitespace-pre-line">{property.description || 'Açıklama bulunmuyor.'}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Emlak Türü</h4>
              <p className="text-lg font-semibold">{property.propertyType || '-'}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500">Alan</h4>
              <p className="text-lg font-semibold">{property.area ? `${property.area} m²` : '-'}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500">Oda Sayısı</h4>
              <p className="text-lg font-semibold">{property.bedrooms || '-'}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500">Banyo Sayısı</h4>
              <p className="text-lg font-semibold">{property.bathrooms || '-'}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500">Şehir</h4>
              <p className="text-lg font-semibold">{property.city || '-'}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500">İlçe/Semt</h4>
              <p className="text-lg font-semibold">{property.district || '-'}</p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2">Adres</h4>
            <p className="text-gray-700">{property.address || 'Adres bilgisi bulunmuyor.'}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2">Danışman Bilgileri</h4>
            <div className="flex items-center space-x-3">
              {property.agent?.image && (
                <img 
                  src={formatImageUrl(property.agent.image)} 
                  alt={property.agent.name} 
                  className="w-10 h-10 rounded-full"
                />
              )}
              <div>
                <p className="font-medium">{property.agent?.name || '-'}</p>
                <p className="text-sm text-gray-500">{property.agent?.email || '-'}</p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose}>Kapat</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}