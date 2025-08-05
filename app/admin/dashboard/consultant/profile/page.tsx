  "use client"
  import { useState, useEffect, useRef } from "react"
  import { useRouter } from "next/navigation"
  import Image from "next/image"
  import { 
    User, 
    Phone, 
    Mail, 
    Building, 
    MapPin, 
    Save, 
    Upload, 
    Calendar,
    Languages,
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    X,
    Star,
    Lock,
    Eye,
    EyeOff,
    Loader2
  } from "lucide-react"

  import { Button } from "@/components/ui/button"
  import { Input } from "@/components/ui/input"
  import { Textarea } from "@/components/ui/textarea"
  import { Label } from "@/components/ui/label"
  import { 
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
  import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
  import { Card, CardContent } from "@/components/ui/card"
  import { Badge } from "@/components/ui/badge"
  import AdminLayout from "../../../components/dashboard/DashboardLayout"
  import { useToast } from '../../../components/ui/toast-context';
  import profileService, { ProfileData, PasswordUpdateData } from "../../../../services/profile.service";

  // Örnek bölgeler
  const allRegions = [
    "Lara", "Muratpaşa", "Konyaaltı", "Kepez", "Döşemealtı", "Aksu", 
    "Serik", "Belek", "Side", "Alanya", "Manavgat", "Kalkan", "Kaş", "Kemer"
  ];

  // Örnek uzmanlık alanları
  const allSpecialties = [
    "Lüks Villalar", "Deniz Manzaralı Daireler", "Yatırım Mülkleri", "Site İçi Konutlar",
    "Yazlık Konutlar", "Turistik Tesisler", "Ticari Gayrimenkuller", "Arsa Yatırımları",
    "Ultra Lüks Villalar", "Butik Oteller", "Özel Tasarım Konutlar", "Turizm Yatırımları"
  ];

  export default function AgentProfilePage() {
    const router = useRouter();
    
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState("basic");
    const { toast } = useToast(); 
      const regionContainerRef = useRef(null);
  const specialtyContainerRef = useRef(null);
  

    // Temel danışman bilgileri
    const [userData, setUserData] = useState<ProfileData>({
      username: "",
      name: "",
      title: "",
      email: "",
      phone: "",
      about: "",
      languages: [],
      regions: [],
      specialties: [],
      social: {
        facebook: "",
        twitter: "",
        instagram: "",
        linkedin: ""
      },
      experience: 0
    });
    
    const [image, setImage] = useState<string>("/placeholder-agent.jpg");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [newLanguage, setNewLanguage] = useState("");
    
    // Şifre değişikliği
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [newRegion, setNewRegion] = useState("");
  const [newSpecialty, setNewSpecialty] = useState("");
  const [showRegionDropdown, setShowRegionDropdown] = useState(false);
  const [showSpecialtyDropdown, setShowSpecialtyDropdown] = useState(false);

  // Dropdown'ları kapatmak için useEffect ekleyin
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const regionInput = document.getElementById("region-input");
      const specialtyInput = document.getElementById("specialty-input");
      
      if (regionInput && !regionInput.contains(event.target as Node)) {
        setShowRegionDropdown(false);
      }
      
      if (specialtyInput && !specialtyInput.contains(event.target as Node)) {
        setShowSpecialtyDropdown(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

    // API URL'si
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL 
      ? process.env.NEXT_PUBLIC_API_URL.includes('/api')
        ? process.env.NEXT_PUBLIC_API_URL.split('/api')[0]
        : process.env.NEXT_PUBLIC_API_URL
      : 'http://localhost:5000';
      
    // Resim URL'si formatlama
    const formatImageUrl = (imagePath?: string) => {
      if (!imagePath) return "/placeholder-agent.jpg";
      if (imagePath.startsWith('http')) return imagePath;
      return `${apiBaseUrl}${imagePath}`;
    };

    useEffect(() => {
      // API'den profil verilerini çek
      const fetchUserProfile = async () => {
        try {
          setLoading(true);
          const data = await profileService.getProfile();
          
          // Form verilerini güncelle
          setUserData({
            username: data.agent.username || "",
            name: data.agent.name || "",
            title: data.agent.title || "",
            email: data.agent.email || "",
            phone: data.agent.phone || "",
            about: data.agent.about || "",
            company: data.agent.company,
            rating: data.agent.rating || 0,
            experience: data.agent.experience || 0,
            languages: data.agent.languages || [],
            regions: data.agent.regions || [],
            specialties: data.agent.specialties || [],
            social: data.agent.social || {
              facebook: "",
              twitter: "",
              instagram: "",
              linkedin: ""
            }
          });
          
          // Resim varsa göster
          if (data.agent.image) {
            setImage(formatImageUrl(data.agent.image));
          }
          
        } catch (error: any) {
          console.error("Profil verileri çekilemedi:", error);
          toast({
            title: "Hata",
            description: error.message || "Profil bilgileri yüklenemedi.",
            variant: "destructive"
          });
        } finally {
          setLoading(false);
        }
      };
      
      fetchUserProfile();
    }, [toast]);

 // Event parametreleri için tip tanımları ekleyin
const handleRegionSelect = (region: string, e: React.MouseEvent) => {
  e.stopPropagation();
  
  setUserData(prevData => ({
    ...prevData,
    regions: [...(prevData.regions || []), region]
  }));
  
  setNewRegion("");
  setShowRegionDropdown(false);
};

const handleSpecialtySelect = (specialty: string, e: React.MouseEvent) => {
  e.stopPropagation();
  
  setUserData(prevData => ({
    ...prevData,
    specialties: [...(prevData.specialties || []), specialty]
  }));
  
  setNewSpecialty("");
  setShowSpecialtyDropdown(false);
};
  

useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    // Type assertion kullanarak contains metodunu güvenli şekilde çağıralım
    if (
      regionContainerRef.current && 
      !(regionContainerRef.current as HTMLDivElement).contains(event.target as Node)
    ) {
      setShowRegionDropdown(false);
    }
    
    if (
      specialtyContainerRef.current && 
      !(specialtyContainerRef.current as HTMLDivElement).contains(event.target as Node)
    ) {
      setShowSpecialtyDropdown(false);
    }
  };
  
  document.addEventListener("mousedown", handleClickOutside as EventListener);
  
  return () => {
    document.removeEventListener("mousedown", handleClickOutside as EventListener);
  };
}, []);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setImage(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    };

    const addLanguage = () => {
      if (newLanguage && !userData.languages?.includes(newLanguage)) {
        setUserData({
          ...userData,
          languages: [...(userData.languages || []), newLanguage]
        });
        setNewLanguage("");
      }
    };

    const removeLanguage = (language: string) => {
      setUserData({
        ...userData,
        languages: userData.languages?.filter(lang => lang !== language) || []
      });
    };

    const handleSocialMediaChange = (platform: keyof typeof userData.social, value: string) => {
      setUserData({
        ...userData,
        social: { 
          ...(userData.social || {}), 
          [platform]: value 
        }
      });
    };
    
    const handleInputChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      const { name, value } = e.target;
      setUserData({
        ...userData,
        [name]: value,
      });
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setSaving(true);
      
      // Form doğrulama
      if (!userData.name || !userData.email || !userData.phone) {
        toast({
          title: "Hata",
          description: "Lütfen gerekli alanları doldurun.",
          variant: "destructive"
        });
        setSaving(false);
        return;
      }
      
      try {
        // Profil bilgilerini güncelle
        await profileService.updateProfile(userData, imageFile || undefined);
        
        // Şifre değişikliği yapılıyorsa
        if (newPassword && currentPassword) {
          if (newPassword !== confirmPassword) {
            toast({
              title: "Hata",
              description: "Yeni şifreler eşleşmiyor.",
              variant: "destructive"
            });
          } else {
            // Şifre güncelleme
            await profileService.updatePassword({
              currentPassword,
              newPassword
            });
          }
        }
        
        // Başarılı kayıt mesajı
        toast({
          title: "Profil güncellendi",
          description: "Bilgileriniz başarıyla kaydedildi.",
        });
        
        // Şifre alanlarını temizle
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        
      } catch (error: any) {
        console.error("Kayıt hatası:", error);
        toast({
          title: "Hata",
          description: error.message || "Profiliniz kaydedilirken bir hata oluştu.",
          variant: "destructive"
        });
      } finally {
        setSaving(false);
      }
    };

    if (loading) {
      return (
        <AdminLayout>
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="animate-spin h-12 w-12 text-orange-500 mx-auto" />
              <p className="mt-4 text-gray-600">Profil bilgileriniz yükleniyor...</p>
            </div>
          </div>
        </AdminLayout>
      );
    }

    return (
      <AdminLayout>
        <div className="p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Profilim</h1>
                <p className="text-gray-600">Kişisel bilgilerinizi ve profil ayarlarınızı güncelleyebilirsiniz</p>
              </div>
              
              <Button 
                onClick={handleSubmit}
                disabled={saving}
                className="mt-4 md:mt-0 bg-orange-500 hover:bg-orange-600"
              >
                {saving ? (
                  <div className="flex items-center">
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    Kaydediliyor...
                  </div>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Değişiklikleri Kaydet
                  </>
                )}
              </Button>
            </div>
            
            {/* Content */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Sidebar */}
              <div className="lg:col-span-1 space-y-6">
                {/* Profile Picture */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center">
                      <div className="relative w-40 h-40 mb-4">
                        <Image
                          src={image}
                          alt="Profil Fotoğrafı"
                          fill
                          className="object-cover rounded-full"
                        />
                      </div>
                      <h3 className="text-lg font-semibold text-center mb-2">{userData.name}</h3>
                      <p className="text-orange-500 text-center mb-4">{userData.title}</p>
                      <Label 
                        htmlFor="profile-picture" 
                        className="bg-orange-500 hover:bg-orange-600 transition-colors py-2 px-4 rounded-md cursor-pointer flex items-center text-white font-medium w-full justify-center"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Fotoğraf Değiştir
                      </Label>
                      <Input 
                        id="profile-picture"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        Önerilen: 500x500 piksel, maksimum 1MB
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Company Info */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Şirket Bilgisi</h3>
                    <div className="flex items-start">
                      <Building className="w-5 h-5 text-orange-500 mr-2 flex-shrink-0" />
                      <div>
                        <p className="font-medium">{userData.company?.name || 'Villas Antalya'}</p>
                        <p className="text-sm text-gray-500">
                          Şirket bilgileriniz sistem yöneticisi tarafından ayarlanır. Değişiklik için yöneticinizle iletişime geçin.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Main Form */}
              <div className="lg:col-span-3">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid grid-cols-3 mb-6">
                    <TabsTrigger value="basic">Temel Bilgiler</TabsTrigger>
                    <TabsTrigger value="details">Detaylar</TabsTrigger>
                    <TabsTrigger value="account">Hesap</TabsTrigger>
                  </TabsList>
                  
                  {/* Basic Info Tab */}
                  <TabsContent value="basic" className="space-y-6">
                    <Card>
                      <CardContent className="p-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">İsim Soyisim <span className="text-red-500">*</span></Label>
                            <Input
                              id="name"
                              name="name"
                              placeholder="İsim Soyisim"
                              value={userData.name}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="title">Ünvan <span className="text-red-500">*</span></Label>
                            <Input
                              id="title"
                              name="title"
                              placeholder="Emlak Danışmanı"
                              value={userData.title}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="email">E-posta <span className="text-red-500">*</span></Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              placeholder="ornek@domain.com"
                              value={userData.email}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="phone">Telefon <span className="text-red-500">*</span></Label>
                            <Input
                              id="phone"
                              name="phone"
                              placeholder="+90 5XX XXX XX XX"
                              value={userData.phone}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="about">Hakkında</Label>
                          <Textarea
                            id="about"
                            name="about"
                            placeholder="Kendiniz hakkında kısa bir biyografi..."
                            value={userData.about || ''}
                            onChange={handleInputChange}
                            className="min-h-32"
                          />
                          <p className="text-sm text-gray-500">
                            Bu bilgi danışman profil sayfanızda gösterilecektir.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Social Media */}
                    <Card>
                      <CardContent className="p-6 space-y-4">
                        <h3 className="text-lg font-semibold">Sosyal Medya</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="facebook" className="flex items-center">
                              <Facebook className="w-4 h-4 mr-2 text-blue-600" />
                              Facebook
                            </Label>
                            <Input
                              id="facebook"
                              placeholder="https://facebook.com/username"
                              value={userData.social?.facebook || ''}
                              onChange={(e) => handleSocialMediaChange("facebook", e.target.value)}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="twitter" className="flex items-center">
                              <Twitter className="w-4 h-4 mr-2 text-blue-400" />
                              Twitter
                            </Label>
                            <Input
                              id="twitter"
                              placeholder="https://twitter.com/username"
                              value={userData.social?.twitter || ''}
                              onChange={(e) => handleSocialMediaChange("twitter", e.target.value)}
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="instagram" className="flex items-center">
                              <Instagram className="w-4 h-4 mr-2 text-pink-600" />
                              Instagram
                            </Label>
                            <Input
                              id="instagram"
                              placeholder="https://instagram.com/username"
                              value={userData.social?.instagram || ''}
                              onChange={(e) => handleSocialMediaChange("instagram", e.target.value)}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="linkedin" className="flex items-center">
                              <Linkedin className="w-4 h-4 mr-2 text-blue-700" />
                              LinkedIn
                            </Label>
                            <Input
                              id="linkedin"
                              placeholder="https://linkedin.com/in/username"
                              value={userData.social?.linkedin || ''}
                              onChange={(e) => handleSocialMediaChange("linkedin", e.target.value)}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  {/* Details Tab */}
                  <TabsContent value="details" className="space-y-6">
                    <Card>
                      <CardContent className="p-6 space-y-4">
                        <h3 className="text-lg font-semibold">İstatistikler</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="rating" className="flex items-center">
                              <Star className="w-4 h-4 mr-2 text-yellow-500" />
                              Değerlendirme Puanı
                            </Label>
                            <Input
                              id="rating"
                              type="number"
                              min="0"
                              max="5"
                              step="0.1"
                              value={userData.rating || 0}
                              className="w-full"
                              disabled
                            />
                            <p className="text-sm text-gray-500">
                              Bu değer müşteri değerlendirmelerine göre otomatik hesaplanır.
                            </p>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="experience" className="flex items-center">
                              <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                              Deneyim (Yıl)
                            </Label>
                            <Input
                              id="experience"
                              name="experience"
                              type="number"
                              min="0"
                              value={userData.experience || 0}
                              onChange={(e) => setUserData({
                                ...userData,
                                experience: parseInt(e.target.value)
                              })}
                              className="w-full"
                            />
                          </div>
                        </div>
                        
                        {/* Languages */}
                        <div className="space-y-2 pt-4">
                          <Label className="flex items-center">
                            <Languages className="w-4 h-4 mr-2 text-green-500" />
                            Konuşulan Diller
                          </Label>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {userData.languages?.map(lang => (
                              <Badge key={lang} variant="secondary" className="flex items-center gap-1">
                                {lang}
                                <button type="button" onClick={() => removeLanguage(lang)} className="ml-1">
                                  <X className="h-3 w-3" />
                                </button>
                              </Badge>
                            ))}
                          </div>
                          <div className="flex items-center space-x-2">
                            <Input
                              placeholder="Yeni dil ekle..."
                              value={newLanguage}
                              onChange={(e) => setNewLanguage(e.target.value)}
                              className="flex-grow"
                            />
                            <Button 
                              onClick={addLanguage} 
                              type="button"
                              size="sm"
                              className="bg-orange-500 hover:bg-orange-600"
                            >
                              Ekle
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Regions */}
      <Card>
        <CardContent className="p-6 space-y-2">
          <Label className="flex items-center">
            <MapPin className="w-4 h-4 mr-2 text-red-500" />
            Çalıştığım Bölgeler
          </Label>
          
          {/* Select kullanmak yerine açılır liste yapalım */}
          <div className="flex items-center space-x-2">
           <div className="relative w-full" ref={regionContainerRef}>
    <Input 
      placeholder="Yeni bölge eklemek için yazın veya seçin" 
      value={newRegion}
      onChange={(e) => setNewRegion(e.target.value)}
      onFocus={() => setShowRegionDropdown(true)}
    />
    {showRegionDropdown && (
      <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
       {allRegions
  .filter(region => 
    Array.isArray(userData.regions) && 
    !userData.regions.includes(region) && 
    region.toLowerCase().includes(newRegion.toLowerCase())
  )
  .map(region => (
    <div 
      key={region} 
      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
      onMouseDown={(e: React.MouseEvent) => handleRegionSelect(region, e)}
    >
      {region}
    </div>
  ))
}

      </div>
    )}
  </div>
            <Button 
              onClick={() => {
                if (newRegion && !userData.regions?.includes(newRegion)) {
                  setUserData({
                    ...userData,
                    regions: [...(userData.regions || []), newRegion]
                  });
                  setNewRegion("");
                }
              }}
              type="button"
              size="sm"
              className="bg-orange-500 hover:bg-orange-600"
            >
              Ekle
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-2">
            {userData.regions?.map(region => (
              <Badge key={region} variant="secondary" className="flex items-center gap-1">
                {region}
                <button 
                  type="button"
                  onClick={() => setUserData({
                    ...userData,
                    regions: userData.regions?.filter(r => r !== region) || []
                  })} 
                  className="ml-1"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Specialties */}
      <Card>
        <CardContent className="p-6 space-y-2">
          <Label className="flex items-center">
            <Building className="w-4 h-4 mr-2 text-purple-500" />
            Uzmanlık Alanlarım
          </Label>
          
          <div className="flex items-center space-x-2">
  <div className="relative w-full" ref={specialtyContainerRef}>
    <Input 
      placeholder="Yeni uzmanlık alanı eklemek için yazın veya seçin" 
      value={newSpecialty}
      onChange={(e) => setNewSpecialty(e.target.value)}
      onFocus={() => setShowSpecialtyDropdown(true)}
    />
    {showSpecialtyDropdown && (
      <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
        {allSpecialties
  .filter(specialty => 
    Array.isArray(userData.specialties) && 
    !userData.specialties.includes(specialty) && 
    specialty.toLowerCase().includes(newSpecialty.toLowerCase())
  )
  .map(specialty => (
    <div
      key={specialty}
      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
      onMouseDown={(e: React.MouseEvent) => handleSpecialtySelect(specialty, e)}
    >
      {specialty}
    </div>
  ))
}
      </div>
    )}
  </div>
            <Button 
              onClick={() => {
                if (newSpecialty && !userData.specialties?.includes(newSpecialty)) {
                  setUserData({
                    ...userData,
                    specialties: [...(userData.specialties || []), newSpecialty]
                  });
                  setNewSpecialty("");
                }
              }}
              type="button"
              size="sm"
              className="bg-orange-500 hover:bg-orange-600"
            >
              Ekle
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-2">
            {userData.specialties?.map(specialty => (
              <Badge key={specialty} variant="secondary" className="flex items-center gap-1">
                {specialty}
                <button 
                  type="button"
                  onClick={() => setUserData({
                    ...userData,
                    specialties: userData.specialties?.filter(s => s !== specialty) || []
                  })} 
                  className="ml-1"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
                  </TabsContent>
                  
                  {/* Account Tab */}
                  <TabsContent value="account" className="space-y-6">
                    <Card>
                      <CardContent className="p-6 space-y-4">
                        <h3 className="text-lg font-semibold">Hesap Bilgileri</h3>
                        
                        <div className="space-y-2">
                          <Label htmlFor="username">Kullanıcı Adı</Label>
                          <Input
                            id="username"
                            name="username"
                            value={userData.username}
                            disabled
                          />
                          <p className="text-sm text-gray-500">
                            Kullanıcı adı değişikliği için yöneticinizle iletişime geçin.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-6 space-y-4">
                        <h3 className="text-lg font-semibold">Şifre Değiştir</h3>
                        
                        <div className="space-y-2">
                          <Label htmlFor="current-password">Mevcut Şifre</Label>
                          <div className="relative">
                            <Input
                              id="current-password"
                              type={showCurrentPassword ? "text" : "password"}
                              placeholder="Mevcut şifrenizi girin"
                              value={currentPassword}
                              onChange={(e) => setCurrentPassword(e.target.value)}
                            />
                            <button
                              type="button"
                              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2"
                            >
                              {showCurrentPassword ? (
                                <EyeOff className="h-4 w-4 text-gray-500" />
                              ) : (
                                <Eye className="h-4 w-4 text-gray-500" />
                              )}
                            </button>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="new-password">Yeni Şifre</Label>
                          <div className="relative">
                            <Input
                              id="new-password"
                              type={showNewPassword ? "text" : "password"}
                              placeholder="Yeni şifre oluşturun"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <button
                              type="button"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2"
                            >
                              {showNewPassword ? (
                                <EyeOff className="h-4 w-4 text-gray-500" />
                              ) : (
                                <Eye className="h-4 w-4 text-gray-500" />
                              )}
                            </button>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="confirm-password">Yeni Şifre (Tekrar)</Label>
                          <div className="relative">
                            <Input
                              id="confirm-password"
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Yeni şifrenizi tekrar girin"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2"
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="h-4 w-4 text-gray-500" />
                              ) : (
                                <Eye className="h-4 w-4 text-gray-500" />
                              )}
                            </button>
                          </div>
                        </div>
                        
                        <div className="bg-yellow-50 border border-yellow-100 rounded-md p-4 mt-4">
                          <div className="flex items-start">
                            <Lock className="w-5 h-5 text-yellow-500 mr-3 mt-0.5 flex-shrink-0" />
                            <div>
                              <h4 className="text-sm font-medium text-yellow-800">Güvenlik Hatırlatması</h4>
                              <p className="text-sm text-yellow-700 mt-1">
                                Güçlü bir şifre için en az 8 karakter, büyük/küçük harf, rakam ve özel karakter kullanın.
                                Şifrenizi hiç kimseyle paylaşmayın ve düzenli olarak değiştirin.
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }