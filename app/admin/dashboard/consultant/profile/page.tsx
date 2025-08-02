"use client"
import { useState, useEffect } from "react"
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
  EyeOff
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

  // Temel danışman bilgileri
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState("/agent-1.jpg");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [company, setCompany] = useState({
    id: "villas-antalya",
    name: "Villas Antalya"
  });
  
  // Detaylı danışman bilgileri
  const [about, setAbout] = useState("");
  const [rating, setRating] = useState(4.9);
  const [experience, setExperience] = useState(8);
  const [languages, setLanguages] = useState<string[]>(["Türkçe", "İngilizce"]);
  const [newLanguage, setNewLanguage] = useState("");
  const [regions, setRegions] = useState<string[]>(["Lara", "Muratpaşa", "Konyaaltı"]);
  const [specialties, setSpecialties] = useState<string[]>(["Lüks Villalar", "Deniz Manzaralı Daireler", "Yatırım Mülkleri"]);
  
  // Sosyal medya
  const [socialMedia, setSocialMedia] = useState({
    facebook: "https://facebook.com/fazilcanakbas",
    twitter: "https://twitter.com/fazilcanakbas",
    instagram: "https://instagram.com/fazilcanakbas",
    linkedin: "https://linkedin.com/in/fazilcanakbas"
  });
  
  // Hesap bilgileri
  const [username, setUsername] = useState("fazilcanakbas");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    // Gerçek bir API'den danışman bilgilerini çekmek için
    const fetchAgentData = async () => {
      try {
        // Burada gerçek bir API çağrısı yapılacak
        // const response = await fetch('/api/agent/profile');
        // const data = await response.json();
        
        // Örnek veri kullanıyoruz (gerçek uygulamada API'den gelecek)
        const data = {
          id: "fazilcan-akbas",
          name: "Fazıl Can Akbaş",
          title: "Kıdemli Emlak Danışmanı",
          email: "fazil@villasantalya.com",
          phone: "+90 551 389 52 55",
          image: "/agent-1.jpg",
          company: {
            id: "villas-antalya",
            name: "Villas Antalya"
          },
          about: "2015 yılından bu yana Antalya'nın prestijli bölgelerinde emlak danışmanlığı hizmeti vermekteyim. Lüks konut pazarında uzmanlaşmış olup, özellikle Lara ve Muratpaşa bölgelerindeki gayrimenkul piyasasına hakimim.",
          rating: 4.9,
          experience: 8,
          languages: ["Türkçe", "İngilizce"],
          regions: ["Lara", "Muratpaşa", "Konyaaltı"],
          specialties: ["Lüks Villalar", "Deniz Manzaralı Daireler", "Yatırım Mülkleri"],
          social: {
            facebook: "https://facebook.com/fazilcanakbas",
            twitter: "https://twitter.com/fazilcanakbas",
            instagram: "https://instagram.com/fazilcanakbas",
            linkedin: "https://linkedin.com/in/fazilcanakbas"
          },
          username: "fazilcanakbas"
        };
        
        setName(data.name);
        setTitle(data.title);
        setEmail(data.email);
        setPhone(data.phone);
        setImage(data.image);
        setCompany(data.company);
        setAbout(data.about);
        setRating(data.rating);
        setExperience(data.experience);
        setLanguages(data.languages);
        setRegions(data.regions);
        setSpecialties(data.specialties);
        setSocialMedia(data.social);
        setUsername(data.username);
        
        setLoading(false);
      } catch (error) {
        console.error("Profil verileri çekilemedi:", error);
        setLoading(false);
      }
    };
    
    fetchAgentData();
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
    if (newLanguage && !languages.includes(newLanguage)) {
      setLanguages([...languages, newLanguage]);
      setNewLanguage("");
    }
  };

  const removeLanguage = (language: string) => {
    setLanguages(languages.filter(lang => lang !== language));
  };

  const handleSocialMediaChange = (platform: keyof typeof socialMedia, value: string) => {
    setSocialMedia({ ...socialMedia, [platform]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    // Form doğrulama
    if (!name || !email || !phone) {
      toast({
        title: "Hata",
        description: "Lütfen gerekli alanları doldurun.",
        variant: "destructive"
      });
      setSaving(false);
      return;
    }
    
    // Şifre değişikliği yapılıyorsa
    if (newPassword) {
      if (!currentPassword) {
        toast({
          title: "Hata",
          description: "Mevcut şifrenizi girmelisiniz.",
          variant: "destructive"
        });
        setSaving(false);
        return;
      }
      
      if (newPassword !== confirmPassword) {
        toast({
          title: "Hata",
          description: "Yeni şifreler eşleşmiyor.",
          variant: "destructive"
        });
        setSaving(false);
        return;
      }
    }
    
    try {
      // Burada API'ye kayıt işlemi yapılacak
      // const formData = new FormData();
      // formData.append("name", name);
      // formData.append("title", title);
      // ...diğer alanlar
      
      // if (imageFile) {
      //   formData.append("image", imageFile);
      // }
      
      // const response = await fetch('/api/agent/profile', {
      //   method: 'PUT',
      //   body: formData
      // });
      
      // if (!response.ok) {
      //   throw new Error('API hatası');
      // }
      
      // Başarılı kayıt mesajı
      toast({
        title: "Profil güncellendi",
        description: "Bilgileriniz başarıyla kaydedildi.",
      });
      
      // Şifre alanlarını temizle
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      
    } catch (error) {
      console.error("Kayıt hatası:", error);
      toast({
        title: "Hata",
        description: "Profiliniz kaydedilirken bir hata oluştu.",
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
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
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
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
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
                    <h3 className="text-lg font-semibold text-center mb-2">{name}</h3>
                    <p className="text-orange-500 text-center mb-4">{title}</p>
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
                      <p className="font-medium">{company.name}</p>
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
                            placeholder="İsim Soyisim"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="title">Ünvan <span className="text-red-500">*</span></Label>
                          <Input
                            id="title"
                            placeholder="Emlak Danışmanı"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">E-posta <span className="text-red-500">*</span></Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="ornek@domain.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="phone">Telefon <span className="text-red-500">*</span></Label>
                          <Input
                            id="phone"
                            placeholder="+90 5XX XXX XX XX"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="about">Hakkında</Label>
                        <Textarea
                          id="about"
                          placeholder="Kendiniz hakkında kısa bir biyografi..."
                          value={about}
                          onChange={(e) => setAbout(e.target.value)}
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
                            value={socialMedia.facebook}
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
                            value={socialMedia.twitter}
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
                            value={socialMedia.instagram}
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
                            value={socialMedia.linkedin}
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
                            value={rating}
                            onChange={(e) => setRating(parseFloat(e.target.value))}
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
                            type="number"
                            min="0"
                            value={experience}
                            onChange={(e) => setExperience(parseInt(e.target.value))}
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
                          {languages.map(lang => (
                            <Badge key={lang} variant="secondary" className="flex items-center gap-1">
                              {lang}
                              <button onClick={() => removeLanguage(lang)} className="ml-1">
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
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Bölge seçin" />
                          </SelectTrigger>
                          <SelectContent>
                            {allRegions
                              .filter(region => !regions.includes(region))
                              .map(region => (
                                <SelectItem 
                                  key={region} 
                                  value={region}
                                  onClick={() => setRegions([...regions, region])}
                                >
                                  {region}
                                </SelectItem>
                              ))
                            }
                          </SelectContent>
                        </Select>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {regions.map(region => (
                            <Badge key={region} variant="secondary" className="flex items-center gap-1">
                              {region}
                              <button onClick={() => setRegions(regions.filter(r => r !== region))} className="ml-1">
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
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Uzmanlık alanı seçin" />
                          </SelectTrigger>
                          <SelectContent>
                            {allSpecialties
                              .filter(specialty => !specialties.includes(specialty))
                              .map(specialty => (
                                <SelectItem 
                                  key={specialty} 
                                  value={specialty}
                                  onClick={() => setSpecialties([...specialties, specialty])}
                                >
                                  {specialty}
                                </SelectItem>
                              ))
                            }
                          </SelectContent>
                        </Select>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {specialties.map(specialty => (
                            <Badge key={specialty} variant="secondary" className="flex items-center gap-1">
                              {specialty}
                              <button 
                                onClick={() => setSpecialties(specialties.filter(s => s !== specialty))} 
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
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
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