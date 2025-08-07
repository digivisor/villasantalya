import { useEffect, useState } from 'react';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogContent, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { PropertyFormData } from '../../../services/property.service';

interface PropertyEditModalProps {
  property: PropertyFormData | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (propertyData: PropertyFormData) => void;
}

const propertyTypes = [
  'Daire', 'Villa', 'Müstakil Ev', 'İkiz Villa', 'Yazlık', 'Residence', 'Dağ Evi', 'Ofis', 'Dükkan', 'Depo', 'Arsa'
];
const categories = ['Konut', 'İşyeri', 'Arsa', 'Turistik Tesis'];
const districts = [
  'Muratpaşa', 'Konyaaltı', 'Kepez', 'Döşemealtı', 'Aksu', 'Manavgat',
  'Alanya', 'Serik', 'Side', 'Belek', 'Lara', 'Kaş', 'Kalkan', 'Kemer'
];
const statuses = [
  { value: 'pending', label: 'Beklemede' },
  { value: 'active', label: 'Aktif' },
  { value: 'sold', label: 'Satıldı' },
  { value: 'rejected', label: 'Reddedildi' }
];

// Noktalı fiyatı karşılaştırmak veya backend'e göndermek için temizler
const cleanPrice = (val: string) => Number(val.replace(/[^\d]/g, ''));

export default function PropertyEditModal({ property, isOpen, onClose, onSave }: PropertyEditModalProps) {
  const [formData, setFormData] = useState<PropertyFormData & { status?: string }>({
    title: '',
    description: '',
    price: '',
    currency: 'TRY',
    discountedPrice: '',
    propertyType: '',
    category: '',
    type: 'sale',
    bedrooms: '',
    bathrooms: '',
    area: '',
    buildingAge: '',
    floor: '',
    totalFloors: '',
    furnished: false,
    balcony: false,
    parking: false,
    elevator: false,
    security: false,
    garden: false,
    address: '',
    district: '',
    city: 'Antalya',
    location: { lat: '', lng: '' },
    features: [],
    nearbyPlaces: [],
    status: 'pending',
  });

  useEffect(() => {
    if (property) {
      setFormData({
        ...formData,
        ...property,
        price: property.price ?? '',
        discountedPrice: property.discountedPrice ?? '',
        area: property.area ? property.area.toString() : '',
        buildingAge: property.buildingAge ? property.buildingAge.toString() : '',
        floor: property.floor ? property.floor.toString() : '',
        totalFloors: property.totalFloors ? property.totalFloors.toString() : '',
        bedrooms: property.bedrooms ?? '',
        bathrooms: property.bathrooms ?? '',
        features: property.features ?? [],
        nearbyPlaces: property.nearbyPlaces ?? [],
        location: property.location ?? { lat: '', lng: '' },
        status: (property as any).status || 'pending'
      });
    }
    // eslint-disable-next-line
  }, [property]);

  // Fiyat inputunda sadece sayı ve nokta kabul et, state'e string kaydet
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^\d.]/g, '');
    setFormData(prev => ({ ...prev, price: value }));
  };
  const handleDiscountedPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^\d.]/g, '');
    setFormData(prev => ({ ...prev, discountedPrice: value }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name.includes('.')) {
      // Nested property (location.lat, location.lng gibi)
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev] as object,
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Özellikler ve yakın yerler için checkbox
  const handleArrayChange = (array: string[], item: string, field: 'features' | 'nearbyPlaces') => {
    const newArray = array.includes(item)
      ? array.filter(i => i !== item)
      : [...array, item];
    setFormData(prev => ({ ...prev, [field]: newArray }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Fiyat karşılaştırması (ör. validasyon) için temizle (noktalardan arındır)
    if (
      formData.discountedPrice &&
      cleanPrice(formData.discountedPrice) >= cleanPrice(formData.price)
    ) {
      alert('İndirimli fiyat, normal fiyattan küçük olmalı.');
      return;
    }

    // area, floor vb. sayısal alanları number'a çevir, ama price string olarak kalsın
    const submissionData: PropertyFormData = {
      ...formData,
      area: formData.area ? Number(formData.area) : '',
      buildingAge: formData.buildingAge ? Number(formData.buildingAge) : '',
      floor: formData.floor ? Number(formData.floor) : '',
      totalFloors: formData.totalFloors ? Number(formData.totalFloors) : '',
      // price ve discountedPrice string olarak gider
    };
    // status alanı için
    (submissionData as any).status = formData.status;
    onSave(submissionData);
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>İlanı Düzenle</DialogTitle>
          <DialogDescription>
            İlan bilgilerini güncelleyin. Tüm değişiklikler kaydedilecektir.
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
            <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
              Para Birimi
            </label>
            <select
              id="currency"
              name="currency"
              value={formData.currency}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md p-2"
            >
              <option value="TRY">₺ TL</option>
              <option value="USD">$ Dolar</option>
              <option value="EUR">€ Euro</option>
            </select>
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Fiyat
            </label>
            <Input
              id="price"
              name="price"
              type="text"
              value={formData.price}
              onChange={handlePriceChange}
              required
            />
          </div>
          <div>
            <label htmlFor="discountedPrice" className="block text-sm font-medium text-gray-700 mb-1">
              İndirimli Fiyat
            </label>
            <Input
              id="discountedPrice"
              name="discountedPrice"
              type="text"
              value={formData.discountedPrice}
              onChange={handleDiscountedPriceChange}
            />
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              İlan Durumu
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md p-2"
            >
              {statuses.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Kategori
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md p-2"
              required
            >
              <option value="">Kategori Seçin</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700 mb-1">
              Mülk Tipi
            </label>
            <select
              id="propertyType"
              name="propertyType"
              value={formData.propertyType}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md p-2"
              required
            >
              <option value="">Mülk Tipi Seçin</option>
              {propertyTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
              İlan Türü
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md p-2"
              required
            >
              <option value="sale">Satılık</option>
              <option value="rent">Kiralık</option>
            </select>
          </div>
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
          <div>
            <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-1">
              İlçe/Bölge
            </label>
            <select
              id="district"
              name="district"
              value={formData.district}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md p-2"
              required
            >
              <option value="">İlçe/Bölge Seçin</option>
              {districts.map((district) => (
                <option key={district} value={district}>{district}</option>
              ))}
            </select>
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
              required
            />
          </div>
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Tam Adres
            </label>
            <Textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              rows={2}
            />
          </div>
          {/* Ek alanlar ve checkboxlar için alan açabilirsin (örn: eşyalı, balkon vs.) */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="furnished"
              name="furnished"
              checked={formData.furnished}
              onChange={handleInputChange}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="furnished" className="text-sm font-medium text-gray-700">
              Eşyalı
            </label>
          </div>

          {/* Diğer boolean alanlar için de benzer şekilde */}
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