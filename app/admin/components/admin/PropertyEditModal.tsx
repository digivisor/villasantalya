import { useEffect, useState } from 'react';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogContent, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Property } from '../../types/property';

// Form veri tipi
interface PropertyFormData {
  title: string;
  price: number;
  description: string;
  status: string;
  propertyType: string;
  district: string;
  city: string;
  address: string;
  bedrooms: string;
  bathrooms: string | number;
  area: number;
  isApproved: boolean;
}

interface PropertyEditModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (property: Property) => void;
}

export default function PropertyEditModal({ property, isOpen, onClose, onSave }: PropertyEditModalProps) {
  const [formData, setFormData] = useState<PropertyFormData>({
    title: '',
    price: 0,
    description: '',
    status: 'pending',
    propertyType: '',
    district: '',
    city: '',
    address: '',
    bedrooms: '',
    bathrooms: '',
    area: 0,
    isApproved: false
  });

  useEffect(() => {
    if (property) {
      setFormData({
        title: property.title || '',
        price: property.price || 0,
        description: property.description || '',
        status: property.status || 'pending',
        propertyType: property.propertyType || '',
        district: property.district || '',
        city: property.city || '',
        address: property.address || '',
        bedrooms: property.bedrooms ? String(property.bedrooms) : '',
        bathrooms: property.bathrooms || '',
        area: property.area || 0,
        isApproved: property.isApproved || false
      });
    }
  }, [property]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!property) return;
    
    onSave({
      ...property,
      title: formData.title,
      price: Number(formData.price),
      description: formData.description,
      status: formData.status,
      propertyType: formData.propertyType,
      district: formData.district,
      city: formData.city,
      address: formData.address,
      bedrooms: formData.bedrooms,
      bathrooms: formData.bathrooms,
      area: Number(formData.area),
      isApproved: formData.isApproved
    });
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>İlan Düzenle</DialogTitle>
          <DialogDescription>
            İlan bilgilerini düzenleyin. Tüm değişiklikler kaydedilecektir.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              İlan Başlığı
            </label>
            <Input 
              id="title" 
              name="title" 
              value={formData.title} 
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Fiyat
            </label>
            <Input 
              id="price" 
              name="price" 
              type="number" 
              value={formData.price} 
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Açıklama
            </label>
            <Textarea 
              id="description" 
              name="description" 
              value={formData.description} 
              onChange={handleInputChange}
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700 mb-1">
                Emlak Türü
              </label>
              <select 
                id="propertyType" 
                name="propertyType" 
                value={formData.propertyType} 
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md p-2"
              >
                <option value="">Seçiniz</option>
                <option value="Daire">Daire</option>
                <option value="Villa">Villa</option>
                <option value="Müstakil Ev">Müstakil Ev</option>
                <option value="Yazlık">Yazlık</option>
                <option value="İş Yeri">İş Yeri</option>
                <option value="Arsa">Arsa</option>
              </select>
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Durum
              </label>
              <select 
                id="status" 
                name="status" 
                value={formData.status} 
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md p-2"
              >
                <option value="active">Aktif</option>
                <option value="pending">Beklemede</option>
                <option value="rejected">Reddedildi</option>
                <option value="sold">Satıldı</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-1">
                İlçe/Semt
              </label>
              <Input 
                id="district" 
                name="district" 
                value={formData.district} 
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                Şehir
              </label>
              <Input 
                id="city" 
                name="city" 
                value={formData.city} 
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Adres
            </label>
            <Input 
              id="address" 
              name="address" 
              value={formData.address} 
              onChange={handleInputChange}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-1">
                Oda Sayısı
              </label>
              <Input 
                id="bedrooms" 
                name="bedrooms" 
                value={formData.bedrooms} 
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700 mb-1">
                Banyo Sayısı
              </label>
              <Input 
                id="bathrooms" 
                name="bathrooms" 
                value={formData.bathrooms} 
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-1">
                Alan (m²)
              </label>
              <Input 
                id="area" 
                name="area" 
                type="number" 
                value={formData.area} 
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isApproved"
              checked={formData.isApproved}
              onChange={(e) => handleCheckboxChange('isApproved', e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="isApproved" className="text-sm font-medium text-gray-700">
              Onaylı İlan
            </label>
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              İptal
            </Button>
            <Button type="submit">
              Değişiklikleri Kaydet
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}