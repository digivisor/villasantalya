'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '../../../../../components/dashboard/DashboardLayout';
import { 
  ArrowLeft, 
  Upload, 
  Save, 
  Plus, 
  X,
  User,
  Calendar,
  Tag as TagIcon,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import Toast from '../../../../../components/ui/toast';
import Image from 'next/image';

// Blog post veri tipi tanımı
interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content?: string;
  date: string;
  author: string;
  image: string;
  tags: string[];
  category: string;
  isActive?: boolean;
  comments?: number;
  views?: number;
  slug: string;
  lastUpdated?: string;
}

// Blog düzenleme formu için veri tipi
interface BlogFormData {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
  isActive: boolean;
  image: File | null;
  originalImage: string;
  slug: string;
  date: string;
}

// Önceden tanımlı kategoriler
const predefinedCategories = [
  'Tasarım İpuçları',
  'Emlak Rehberi',
  'Başlangıç Rehberi',
  'Piyasa Analizi',
  'Yasal Süreçler',
  'Trend Analizi',
  'Finansal Rehber',
  'Yaşam Tarzı',
  'Mimari',
  'Gayrimenkul Teknolojileri'
];

// Blog verileri (gerçek bir uygulamada API'den gelecek)
const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "Mükemmel Açık Hava Yaşam Alanı Oluşturma İpuçları",
    excerpt:
      "Villa bahçenizi ve terasınızı nasıl daha fonksiyonel ve estetik hale getirebileceğinizi öğrenin. Modern peyzaj tasarımı ile yaşam kalitenizi artırın.",
    content: "Bir villa sahibi olmak büyük bir ayrıcalıktır ve dış mekan alanınızı en iyi şekilde değerlendirmek, bu ayrıcalığı daha da zenginleştirir. Antalya'nın eşsiz iklimi, yılın büyük bir bölümünde açık hava yaşam alanlarının keyfini çıkarmanıza olanak tanır. İşte mükemmel bir açık hava yaşam alanı oluşturmak için izleyebileceğiniz adımlar.\n\n## Bölgeleme Yapın\n\nDış mekanınızı işlevlerine göre bölgelere ayırın. Yemek alanı, lounge alanı, güneşlenme terası, çocuk oyun alanı, barbekü bölgesi gibi farklı kullanım alanları oluşturarak her aktivite için özel bir alan tanımlayın.\n\n## Doğru Mobilya Seçimi\n\nDış mekan mobilyalarınız hem estetik hem de dayanıklı olmalıdır. Antalya'nın güneşli ve nemli iklimine dayanabilecek malzemelerden üretilmiş mobilyaları tercih edin. Teak, polirattan veya alüminyum gibi hava koşullarına dayanıklı malzemeler idealdir.\n\n## Gölgelendirme Çözümleri\n\nAntalya'nın sıcak yaz günlerinde gölge alanlar kritik öneme sahiptir. Pergolalar, tenteler, şemsiyeler veya yelken gölgelikler gibi çeşitli gölgelendirme seçeneklerini değerlendirin.\n\n## Su Öğeleri\n\nKüçük bir havuz, şelale veya süs havuzu gibi su öğeleri, bahçenize serinlik katarken aynı zamanda rahatlama hissi de yaratır. Su sesi, dinlendirici bir atmosfer oluşturarak dış mekan deneyiminizi zenginleştirir.\n\n## Aydınlatma\n\nDoğru aydınlatma, akşam saatlerinde de dış mekanınızı kullanmanıza olanak tanır. Çevre aydınlatması, vurgu aydınlatması ve dekoratif aydınlatma gibi katmanlı bir aydınlatma planı oluşturun.\n\n## Yeşillendirme\n\nAntalya iklimine uygun bitki seçimi yaparak bahçenizi canlandırın. Palmiyeler, zeytin ağaçları, bougainvillea ve lavanta gibi Akdeniz bitkileri hem dayanıklı hem de bölgenin karakteristik dokusunu yansıtan seçimlerdir.\n\n## Dış Mekan Mutfağı\n\nAkdeniz yaşam tarzının önemli bir parçası olan dış mekan mutfağı, arkadaşlarınız ve ailenizle keyifli anlar geçirmenizi sağlar. Basit bir barbekü alanından tam donanımlı bir mutfağa kadar bütçenize ve ihtiyaçlarınıza göre çeşitli seçenekler değerlendirebilirsiniz.\n\nDoğru planlama ve tasarımla, villanızın dış mekanını yılın büyük bir bölümünde keyifle kullanabileceğiniz bir yaşam alanına dönüştürebilirsiniz. Unutmayın, iyi tasarlanmış bir açık hava yaşam alanı sadece günlük yaşam kalitenizi artırmakla kalmaz, aynı zamanda mülkünüzün değerini de yükseltir.",
    date: "MART 26, 2024",
    author: "Cem Uzan",
    image: "/blog-1.jpg",
    tags: ["Bahçe", "Tasarım", "Villa"],
    category: "Tasarım İpuçları",
    isActive: true,
    comments: 12,
    views: 456,
    slug: "mukemmel-acik-hava-yasam-alani-olusturma-ipuclari",
    lastUpdated: "2024-03-28"
  },
  {
    id: 2,
    title: "Emlak Danışmanlığında İlk Görüşmenin Önemi",
    excerpt:
      "Doğru emlak danışmanı seçimi, yatırımınızın geleceğini belirler. Profesyonel danışmanlık hizmetinin avantajlarını keşfedin ve ilk görüşmede nelere dikkat etmeniz gerektiğini öğrenin.",
    content: "Emlak alım satım süreçleri, finansal ve duygusal açıdan önemli kararlar içerir. Bu süreçte doğru bir emlak danışmanıyla çalışmak, süreci çok daha verimli ve sorunsuz hale getirebilir. İlk görüşme, danışmanınızla ilişkinizin temellerini atacağı için kritik öneme sahiptir.\n\n## İlk İzlenimler Neden Önemlidir?\n\nİlk görüşme, emlak danışmanının profesyonelliğini, bilgi birikimini ve sizinle ne kadar uyumlu çalışabileceğini değerlendirmeniz için en iyi fırsattır. Bu görüşmede sadece siz danışmanı değil, danışman da sizi ve ihtiyaçlarınızı değerlendirecektir.\n\n## İyi Bir Danışmanın Özellikleri\n\n- **Dinleme Becerisi:** İyi bir danışman önce sizi dinlemeli, ihtiyaçlarınızı ve beklentilerinizi net olarak anlamalıdır.\n- **Piyasa Bilgisi:** Hedeflediğiniz bölge hakkında detaylı bilgi sahibi olmalı ve güncel piyasa koşullarını iyi analiz edebilmelidir.\n- **Şeffaflık:** Komisyon oranları, süreç ve potansiyel zorluklar hakkında dürüst ve açık olmalıdır.\n- **Referanslar:** Geçmiş müşterilerinden referanslar sunabilmelidir.\n- **İletişim Becerileri:** Süreç boyunca sizi bilgilendirmek için etkili iletişim kurabilmelidir.\n\n## İlk Görüşmede Sormanız Gereken Sorular\n\n1. **Deneyim ve Uzmanlık:** \"Bu bölgede kaç yıldır çalışıyorsunuz? Hangi tür gayrimenkullerde uzmanlaştınız?\"\n2. **Satış Stratejisi:** \"Mülkümü satmak için nasıl bir strateji izleyeceksiniz?\"\n3. **İletişim Süreci:** \"Süreç boyunca ne sıklıkta ve hangi yöntemlerle iletişim kuracağız?\"\n4. **Komisyon ve Ücretler:** \"Hizmet bedeli ve komisyon oranlarınız nelerdir? Başka gizli ücretler var mı?\"\n5. **Referanslar:** \"Son altı ayda kaç işlem gerçekleştirdiniz? Referans gösterebileceğiniz müşterileriniz var mı?\"\n\n## İlk Görüşme Sonrası Değerlendirme\n\nGörüşmeden sonra aşağıdaki soruları kendinize sorun:\n- Danışman beni gerçekten dinledi mi?\n- Sorularıma net ve tatmin edici yanıtlar verdi mi?\n- Kendimi bu kişiyle çalışırken rahat hisseder miyim?\n- Piyasa hakkında yeterli bilgi ve deneyime sahip mi?\n\nDoğru emlak danışmanını seçmek, emlak serüveninizin başarısında kritik bir rol oynar. İlk görüşmeyi ciddiye alarak, uzun vadeli ve verimli bir iş ilişkisinin temellerini atabilirsiniz.",
    date: "MART 24, 2024",
    author: "Ayşe Demir",
    image: "/blog-2.jpg",
    tags: ["Danışmanlık", "Yatırım", "İlk Adım"],
    category: "Emlak Rehberi",
    isActive: true,
    comments: 8,
    views: 342,
    slug: "emlak-danismanliginda-ilk-gorusmenin-onemi",
    lastUpdated: "2024-03-25"
  },
  {
    id: 3,
    title: "Emlak Yatırımında Temel Stratejiler",
    excerpt:
      "Emlak yatırımına başlamadan önce bilmeniz gereken temel konular. Piyasa analizi, lokasyon seçimi ve finansman seçenekleri ile yatırımınızı akıllıca planlayın.",
    content: "Emlak yatırımı, doğru yaklaşımla uzun vadeli finansal güvenlik sağlayabilen en güvenilir yatırım araçlarından biridir. Ancak başarılı bir emlak yatırımı için stratejik bir planlama ve temel prensiplere hâkimiyet gereklidir.\n\n## Lokasyon, Lokasyon, Lokasyon\n\nEmlak yatırımında en kritik faktör lokasyondur. Gelişmekte olan bölgeler, altyapı yatırımları olan alanlar veya turizm potansiyeli yüksek yerler, değer artış potansiyelini maksimize edebilir. Antalya özelinde, sahil şeridi, şehir merkezi ve gelişmekte olan ilçeler farklı yatırım fırsatları sunar.\n\n## Yatırım Amacınızı Belirleyin\n\nEmlak yatırımında temel olarak iki ana strateji vardır:\n\n1. **Kira Geliri Odaklı Yatırım:** Düzenli nakit akışı sağlamak için yüksek kira getirisi sunan gayrimenkuller\n2. **Değer Artışı Odaklı Yatırım:** Uzun vadede değer kazanma potansiyeli yüksek olan gayrimenkuller\n\nHangi stratejiyi izleyeceğiniz, finansal hedeflerinize ve risk toleransınıza bağlı olarak değişecektir.\n\n## Piyasa Analizini Doğru Yapın\n\nDoğru bir piyasa analizi, fırsatları ve riskleri değerlendirmenize yardımcı olur:\n\n- Bölgedeki fiyat trendlerini inceleyin\n- Kiralama potansiyelini araştırın\n- Gelecekteki gelişim planlarını öğrenin\n- Benzer gayrimenkullerin performansını değerlendirin",
    date: "MART 22, 2024",
    author: "Mehmet Kaya",
    image: "/blog-3.jpg",
    tags: ["Temel Bilgiler", "Yatırım", "Strateji"],
    category: "Başlangıç Rehberi",
    isActive: true,
    comments: 15,
    views: 528,
    slug: "emlak-yatiriminda-temel-stratejiler",
    lastUpdated: "2024-03-23"
  }
];

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<BlogFormData>({
    id: 0,
    title: '',
    excerpt: '',
    content: '',
    author: '',
    category: '',
    tags: [],
    isActive: true,
    image: null,
    originalImage: '',
    slug: '',
    date: ''
  });
  
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  // Toast state
  const [toast, setToast] = useState({
    message: '',
    type: 'success' as 'success' | 'error' | 'warning' | 'info',
    isVisible: false
  });
  
  // Blog verisini yükle
  useEffect(() => {
    const loadBlogPost = async () => {
      setIsLoading(true);
      try {
        // Gerçek bir uygulamada API çağrısı yapılacak
        // Mock data
        const blogId = Number(id);
        const post = blogPosts.find(post => post.id === blogId);
        
        if (post) {
          setFormData({
            id: post.id,
            title: post.title,
            excerpt: post.excerpt,
            content: post.content || '',
            author: post.author,
            category: post.category,
            tags: [...post.tags], // Dizinin kopyasını oluştur
            isActive: post.isActive !== false,
            image: null,
            originalImage: post.image,
            slug: post.slug,
            date: post.date
          });
          
          setImagePreview(post.image);
        } else {
          // Blog yazısı bulunamadı, ana sayfaya yönlendir
          router.push('/admin/dashboard/admin/blogs');
          showToast('Blog yazısı bulunamadı', 'error');
        }
      } catch (error) {
        showToast('Blog yazısı yüklenirken bir hata oluştu', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadBlogPost();
  }, [id, router]);

  // Hata kontrolü
  const validate = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      errors.title = 'Başlık gereklidir';
    }
    
    if (!formData.excerpt.trim()) {
      errors.excerpt = 'Özet gereklidir';
    }
    
    if (!formData.content.trim()) {
      errors.content = 'İçerik gereklidir';
    }
    
    if (!formData.category) {
      errors.category = 'Kategori seçmelisiniz';
    }
    
    if (!imagePreview) {
      errors.image = 'Blog görseli gereklidir';
    }
    
    if (formData.tags.length === 0) {
      errors.tags = 'En az bir etiket eklemelisiniz';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Form input değişikliği
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Hata mesajını temizle
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: '' });
    }
  };

  // Toggle değişikliği
  const handleToggleChange = (name: string, checked: boolean) => {
    setFormData({ ...formData, [name]: checked });
  };

  // Görsel yükleme
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      // Hata mesajını temizle
      if (formErrors.image) {
        setFormErrors({ ...formErrors, image: '' });
      }
    }
  };

  // Tag ekleme
  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      });
      setTagInput('');
      
      // Hata mesajını temizle
      if (formErrors.tags) {
        setFormErrors({ ...formErrors, tags: '' });
      }
    }
  };

  // Enter tuşu ile tag ekleme
  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  // Tag silme
  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  // Özel kategori ekleme
  const handleAddCategory = () => {
    if (customCategory.trim() && !predefinedCategories.includes(customCategory.trim())) {
      setFormData({
        ...formData,
        category: customCategory.trim()
      });
      setCustomCategory('');
      
      // Hata mesajını temizle
      if (formErrors.category) {
        setFormErrors({ ...formErrors, category: '' });
      }
    }
  };

  // Slug oluşturma
  const createSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/ı/g, 'i')
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  // Form gönderimi
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      showToast('Lütfen gerekli alanları doldurun', 'error');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Gerçek bir uygulamada burada API çağrısı yapılacak
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Güncellenmiş slug oluştur
      const updatedSlug = formData.title !== blogPosts.find(p => p.id === formData.id)?.title
        ? createSlug(formData.title)
        : formData.slug;
      
      showToast('Blog yazısı başarıyla güncellendi!', 'success');
      
      // Başarılı olduğunda blog listesine yönlendir
      setTimeout(() => {
        router.push('/admin/dashboard/admin/blogs');
      }, 1000);
      
    } catch (error) {
      showToast('Blog yazısı güncellenirken bir hata oluştu', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toast gösterme işlevi
  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info') => {
    setToast({
      message,
      type,
      isVisible: true
    });
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
          <span className="ml-2 text-lg font-medium text-gray-700">Blog yazısı yükleniyor...</span>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link 
              href="/admin/dashboard/admin/blogs"
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Blog Yazısı Düzenle</h1>
              <p className="text-gray-600 mt-1">#{formData.id} numaralı blog yazısını düzenleyin</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => router.push('/admin/dashboard/admin/blogs')}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              İptal
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Kaydediliyor...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Değişiklikleri Kaydet
                </>
              )}
            </button>
          </div>
        </div>

        <form className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Ana İçerik - Sol Sütun */}
          <div className="lg:col-span-2 space-y-6">
            {/* Blog Başlığı */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Blog Başlığı <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Etkileyici bir başlık yazın"
                className={`w-full px-4 py-3 border ${formErrors.title ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              />
              {formErrors.title && (
                <p className="mt-1 text-sm text-red-500">{formErrors.title}</p>
              )}
              <p className="mt-2 text-sm text-gray-500">
                Mevcut Slug: <span className="font-mono">{formData.slug}</span>
              </p>
              {formData.title !== blogPosts.find(p => p.id === formData.id)?.title && (
                <p className="mt-1 text-sm text-blue-500">
                  Yeni Slug: <span className="font-mono">{createSlug(formData.title)}</span>
                </p>
              )}
            </div>

            {/* Blog Özeti */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Blog Özeti <span className="text-red-500">*</span>
              </label>
              <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleInputChange}
                placeholder="Blog yazısının kısa bir özetini yazın (150-200 karakter)"
                rows={3}
                className={`w-full px-4 py-3 border ${formErrors.excerpt ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              />
              {formErrors.excerpt && (
                <p className="mt-1 text-sm text-red-500">{formErrors.excerpt}</p>
              )}
              <p className="mt-2 text-sm text-gray-500">
                {formData.excerpt.length} / 200 karakter
              </p>
            </div>

            {/* Blog İçeriği */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Blog İçeriği <span className="text-red-500">*</span>
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                placeholder="Blog yazısının içeriğini buraya yazın. Markdown formatı desteklenmektedir."
                rows={15}
                className={`w-full px-4 py-3 border ${formErrors.content ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono`}
              />
              {formErrors.content && (
                <p className="mt-1 text-sm text-red-500">{formErrors.content}</p>
              )}
              <div className="mt-2 text-sm text-gray-500 flex justify-between">
                <span>{formData.content.length} karakter</span>
                <span>Markdown desteklenmektedir</span>
              </div>
            </div>
          </div>

          {/* Sağ Sütun - Yan Panel */}
          <div className="space-y-6">
            {/* Yayın Durumu */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Yayın Durumu</h2>
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-700">Yayında mı?</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only"
                    checked={formData.isActive}
                    onChange={(e) => handleToggleChange('isActive', e.target.checked)}
                  />
                  <div className={`w-11 h-6 rounded-full transition-colors ${formData.isActive ? 'bg-green-500' : 'bg-gray-300'}`}>
                    <div className={`h-5 w-5 rounded-full bg-white transform transition-transform ${formData.isActive ? 'translate-x-6' : 'translate-x-1'} mt-0.5`}></div>
                  </div>
                </label>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>Yayınlanma tarihi: {formData.date}</span>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-sm text-gray-500">Son güncelleme: {new Date().toLocaleDateString('tr-TR')}</p>
              </div>
            </div>
            
            {/* Blog Görseli */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Blog Görseli</h2>
              
              {imagePreview ? (
                <div className="relative mb-4">
                  <div className="aspect-video relative rounded-lg overflow-hidden">
                    <Image
                      src={imagePreview}
                      alt="Blog görseli önizleme"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      setFormData({ ...formData, image: null, originalImage: '' });
                    }}
                    className="absolute top-2 right-2 bg-gray-800/70 text-white p-1 rounded-full hover:bg-red-500/70 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 mb-4">
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  <label
                    htmlFor="image-upload"
                    className="flex flex-col items-center justify-center cursor-pointer"
                  >
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-sm font-medium text-gray-900 mb-1">Blog görseli yükle</span>
                    <span className="text-xs text-gray-500">PNG, JPG, WEBP (Önerilen: 1200x630px)</span>
                  </label>
                </div>
              )}
              
              {formErrors.image && (
                <p className="mt-1 text-sm text-red-500">{formErrors.image}</p>
              )}
            </div>
            
            {/* Yazar */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Yazar</h2>
              
              <div className="flex items-center space-x-3 mb-4">
                <div className="relative w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  placeholder="Yazar adı"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            {/* Kategori */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Kategori</h2>
              
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border ${formErrors.category ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4`}
              >
                <option value="">Kategori seçin</option>
                {predefinedCategories.map((category, index) => (
                  <option key={index} value={category}>{category}</option>
                ))}
                {!predefinedCategories.includes(formData.category) && formData.category && (
                  <option value={formData.category}>{formData.category} (Özel)</option>
                )}
              </select>
              
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="Özel kategori ekle"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={handleAddCategory}
                  className="bg-gray-100 p-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              
              {formErrors.category && (
                <p className="mt-1 text-sm text-red-500">{formErrors.category}</p>
              )}
            </div>
            
            {/* Etiketler */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Etiketler</h2>
              
              <div className="flex items-center space-x-2 mb-4">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagInputKeyDown}
                  placeholder="Etiket ekle ve Enter'a bas"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="bg-gray-100 p-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <div 
                    key={index} 
                    className="inline-flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
                  >
                    <TagIcon className="h-3 w-3 mr-1" />
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-2 text-blue-700 hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
              
              {formErrors.tags && (
                <p className="mt-2 text-sm text-red-500">{formErrors.tags}</p>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* Toast bildirimleri */}
      <Toast 
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
      />
    </DashboardLayout>
  );
}