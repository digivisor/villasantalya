"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  MapPin,
  Phone,
  Clock,
  Facebook,
  Twitter,
  Youtube,
  Instagram,
  Calendar,
  User,
  Eye,
  MessageCircle,
  Share2,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useParams, useRouter } from 'next/navigation'
import ScrollToTop from "@/components/scroll-to-top"
import Footer from "@/components/footer"

// Blog post veri tipi tanımı
interface BlogPost {
  id: number
  title: string
  excerpt: string
  content?: string
  date: string
  author: string
  image: string
  tags: string[]
  category: string
  isActive?: boolean
  comments?: number
  views?: number
  slug: string
}

// Blog verileri
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
    slug: "mukemmel-acik-hava-yasam-alani-olusturma-ipuclari"
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
    slug: "emlak-danismanliginda-ilk-gorusmenin-onemi"
  },
  // Diğer blog yazıları
  {
    id: 3,
    title: "Emlak Yatırımında Temel Stratejiler",
    excerpt:
      "Emlak yatırımına başlamadan önce bilmeniz gereken temel konular. Piyasa analizi, lokasyon seçimi ve finansman seçenekleri ile yatırımınızı akıllıca planlayın.",
    content: "Emlak yatırımı, doğru yaklaşımla uzun vadeli finansal güvenlik sağlayabilen en güvenilir yatırım araçlarından biridir. Ancak başarılı bir emlak yatırımı için stratejik bir planlama ve temel prensiplere hâkimiyet gereklidir.\n\n## Lokasyon, Lokasyon, Lokasyon\n\nEmlak yatırımında en kritik faktör lokasyondur. Gelişmekte olan bölgeler, altyapı yatırımları olan alanlar veya turizm potansiyeli yüksek yerler, değer artış potansiyelini maksimize edebilir. Antalya özelinde, sahil şeridi, şehir merkezi ve gelişmekte olan ilçeler farklı yatırım fırsatları sunar.\n\n## Yatırım Amacınızı Belirleyin\n\nEmlak yatırımında temel olarak iki ana strateji vardır:\n\n1. **Kira Geliri Odaklı Yatırım:** Düzenli nakit akışı sağlamak için yüksek kira getirisi sunan gayrimenkuller\n2. **Değer Artışı Odaklı Yatırım:** Uzun vadede değer kazanma potansiyeli yüksek olan gayrimenkuller\n\nHangi stratejiyi izleyeceğiniz, finansal hedeflerinize ve risk toleransınıza bağlı olarak değişecektir.\n\n## Piyasa Analizini Doğru Yapın\n\nDoğru bir piyasa analizi, fırsatları ve riskleri değerlendirmenize yardımcı olur:\n\n- Bölgedeki fiyat trendlerini inceleyin\n- Kiralama potansiyelini araştırın\n- Gelecekteki gelişim planlarını öğrenin\n- Benzer gayrimenkullerin performansını değerlendirin\n\n## Finansal Planınızı Oluşturun\n\nEmlak yatırımı yaparken sadece satın alma maliyetini değil, aşağıdaki faktörleri de hesaba katmalısınız:\n\n- Emlak vergisi\n- Bakım ve onarım maliyetleri\n- Sigorta\n- Yönetim giderleri (eğer kendiniz yönetmeyecekseniz)\n- Potansiyel boş kalma süreleri\n\n## Çeşitlendirme Yapın\n\nTüm yatırımlarda olduğu gibi, emlak yatırımında da çeşitlendirme riski azaltır. Farklı lokasyonlarda, farklı tipte gayrimenkullere yatırım yapmak, portföyünüzü daha dayanıklı hale getirebilir.\n\n## Uzman Desteği Alın\n\nEmlak piyasası karmaşık olabilir ve yerel dinamiklere göre sürekli değişir. Bu nedenle:\n\n- İyi bir emlak danışmanıyla çalışın\n- Hukuki süreçler için bir avukata danışın\n- Finansal planlama için bir mali müşavir desteği alın\n\n## Uzun Vadeli Düşünün\n\nEmlak yatırımı genellikle uzun vadeli bir yatırım aracıdır. Kısa vadeli dalgalanmalardan etkilenmemek için sabırlı olun ve uzun vadeli stratejinize odaklanın.\n\nDoğru bilgi, stratejik planlama ve profesyonel destekle, emlak yatırımı finansal geleceğiniz için sağlam bir temel oluşturabilir. Antalya'nın dinamik emlak piyasası, bilinçli yatırımcılar için çeşitli fırsatlar sunmaktadır.",
    date: "MART 22, 2024",
    author: "Mehmet Kaya",
    image: "/blog-3.jpg",
    tags: ["Temel Bilgiler", "Yatırım", "Strateji"],
    category: "Başlangıç Rehberi",
    isActive: true,
    comments: 15,
    views: 528,
    slug: "emlak-yatiriminda-temel-stratejiler"
  }
]

export default function BlogDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { slug } = params
  
  const [post, setPost] = useState<BlogPost | null>(null)
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([])
  const [prevPost, setPrevPost] = useState<BlogPost | null>(null)
  const [nextPost, setNextPost] = useState<BlogPost | null>(null)
  
  // Sayfaya göre post verisini yükle
  useEffect(() => {
    // Slug'a göre yazıyı bul
    const currentPost = blogPosts.find((p) => p.slug === slug && p.isActive !== false)
    
    if (currentPost) {
      setPost(currentPost)
      
      // İlişkili yazıları bul (aynı kategori ve etiketlere sahip)
      const related = blogPosts
        .filter(p => p.id !== currentPost.id && p.isActive !== false)
        .filter(p => 
          p.category === currentPost.category || 
          p.tags.some(tag => currentPost.tags.includes(tag))
        )
        .slice(0, 3)
      
      setRelatedPosts(related)
      
      // Önceki ve sonraki yazıları bul
      const sortedPosts = blogPosts
        .filter(p => p.isActive !== false)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      
      const currentIndex = sortedPosts.findIndex(p => p.id === currentPost.id)
      
      if (currentIndex > 0) {
        setNextPost(sortedPosts[currentIndex - 1])
      } else {
        setNextPost(null)
      }
      
      if (currentIndex < sortedPosts.length - 1) {
        setPrevPost(sortedPosts[currentIndex + 1])
      } else {
        setPrevPost(null)
      }
      
    } else {
      // Post bulunamadıysa anasayfaya yönlendir
      router.push('/blog')
    }
  }, [slug, router])
  
  if (!post) return null
  
  // Markdown içeriği HTML'e çevir (basit bir çözüm, gerçek projede markdown-it gibi bir kütüphane kullanılabilir)
  const renderContent = (content: string) => {
    if (!content) return null
    
    // Headers
    content = content.replace(/## (.*)/g, '<h2 class="text-2xl font-bold mt-8 mb-4">$1</h2>')
    
    // Lists
    content = content.replace(/- (.*)/g, '<li class="ml-4 mb-1">• $1</li>')
    
    // Paragraphs
    const paragraphs = content.split('\n\n')
    return paragraphs.map((paragraph, index) => {
      if (paragraph.startsWith('<h2')) {
        return <div key={index} dangerouslySetInnerHTML={{ __html: paragraph }} />
      } else if (paragraph.includes('<li')) {
        return (
          <ul key={index} className="my-4">
            <div dangerouslySetInnerHTML={{ __html: paragraph }} />
          </ul>
        )
      } else if (paragraph.trim()) {
        return <p key={index} className="mb-4 text-gray-700 leading-relaxed">{paragraph}</p>
      }
      return null
    })
  }
  
  return (
    <div className="min-h-screen bg-white">
      {/* Top Bar */}
      <div className="bg-gray-800/90 text-white text-sm py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-orange-500" />
              <span>Lara, Muratpaşa Antalya</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-orange-500" />
              <span>+90 551 389 52 55</span>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-orange-500" />
              <span>Pzt to Cmt - 09:00 to 21:00</span>
            </div>
            <div className="flex items-center space-x-2">
              <Facebook className="w-4 h-4 hover:text-orange-500 cursor-pointer" />
              <Twitter className="w-4 h-4 hover:text-orange-500 cursor-pointer" />
              <Youtube className="w-4 h-4 hover:text-orange-500 cursor-pointer" />
              <Instagram className="w-4 h-4 hover:text-orange-500 cursor-pointer" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-gray-900/95 backdrop-blur-sm text-white py-4 px-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Image
              src="/villasantalya-logo.png"
              alt="VillasAntalya Logo"
              width={80}
              height={60}
              className="h-12 w-auto"
            />
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <a href="/" className="hover:text-orange-500 transition-colors">
              Anasayfa
            </a>
            <a href="/about" className="hover:text-orange-500 transition-colors">
              Hakkımızda
            </a>
            <a href="/properties" className="hover:text-orange-500 transition-colors">
              Emlak Listesi
            </a>
            <a href="/blog" className="text-orange-500 hover:text-orange-400 font-medium">
              Blog
            </a>
            <a href="#" className="hover:text-orange-500 transition-colors">
              İletişim
            </a>
          </nav>

          <Button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium">
            Giriş Yap / Kayıt Ol
          </Button>
        </div>
      </header>

      {/* Blog Content */}
      <div className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumbs */}
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
            <Link href="/" className="hover:text-orange-500">Ana Sayfa</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-orange-500">Blog</Link>
            <span>/</span>
            <span className="text-gray-700 font-medium truncate max-w-[300px]">{post.title}</span>
          </div>
          
          {/* Blog Hero */}
          <div className="relative h-[400px] w-full rounded-3xl overflow-hidden mb-12">
            <Image 
              src={post.image} 
              alt={post.title} 
              fill 
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60"></div>
            
            {/* Category Tag */}
            <div className="absolute top-6 left-6">
              <div className="bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                {post.category}
              </div>
            </div>
            
            {/* Article Info */}
            <div className="absolute bottom-0 left-0 p-8 w-full">
              <div className="max-w-4xl">
                <div className="text-orange-500 text-sm font-semibold mb-2 tracking-wider uppercase">
                  {post.date}
                </div>
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">{post.title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-white/80">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>{post.date}</span>
                  </div>
                  {post.comments && (
                    <div className="flex items-center space-x-2">
                      <MessageCircle className="w-4 h-4" />
                      <span>{post.comments} yorum</span>
                    </div>
                  )}
                  {post.views && (
                    <div className="flex items-center space-x-2">
                      <Eye className="w-4 h-4" />
                      <span>{post.views} görüntüleme</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <article className="bg-white rounded-3xl p-8 shadow-md">
                {/* Content */}
                <div className="prose max-w-none">
                  {renderContent(post.content || '')}
                </div>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-gray-100">
                  {post.tags.map((tag, tagIndex) => (
                    <Link 
                      href={`/blog?tag=${tag}`}
                      key={tagIndex}
                      className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm hover:bg-orange-100 hover:text-orange-600 transition-colors"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
                
                {/* Share */}
                <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-100">
                  <div className="text-gray-600 font-semibold">Bu yazıyı paylaş:</div>
                  <div className="flex space-x-2">
                    <Button size="icon" variant="ghost" className="rounded-full text-blue-600 hover:bg-blue-50">
                      <Facebook className="w-5 h-5" />
                    </Button>
                    <Button size="icon" variant="ghost" className="rounded-full text-sky-500 hover:bg-sky-50">
                      <Twitter className="w-5 h-5" />
                    </Button>
                    <Button size="icon" variant="ghost" className="rounded-full text-red-600 hover:bg-red-50">
                      <Youtube className="w-5 h-5" />
                    </Button>
                    <Button size="icon" variant="ghost" className="rounded-full text-pink-600 hover:bg-pink-50">
                      <Instagram className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </article>
              
              {/* Author */}
              <div className="bg-white rounded-3xl p-8 shadow-md mt-8">
                <div className="flex items-start gap-6">
                  <div className="relative w-20 h-20 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={`/authors/${post.author.toLowerCase().replace(/\s+/g, '-')}.jpg`}
                      alt={post.author}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        // Fallback for missing author images
                        e.currentTarget.src = '/authors/default-author.jpg'
                      }}
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{post.author}</h3>
                    <p className="text-gray-600 mb-4">
                      Emlak sektöründe {Math.floor(Math.random() * 10) + 5} yıllık deneyime sahip uzman danışman.
                      Antalya bölgesindeki gayrimenkul piyasasını yakından takip ediyor ve müşterilerine
                      en doğru yatırım kararlarını vermelerinde yardımcı oluyor.
                    </p>
                    <div className="flex space-x-2">
                      <Button size="icon" variant="ghost" className="rounded-full text-blue-600 hover:bg-blue-50 h-8 w-8">
                        <Facebook className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="rounded-full text-sky-500 hover:bg-sky-50 h-8 w-8">
                        <Twitter className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="rounded-full text-pink-600 hover:bg-pink-50 h-8 w-8">
                        <Instagram className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Next/Prev Posts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                {prevPost && (
                  <Link href={`/blog/${prevPost.slug}`}>
                    <div className="bg-white rounded-3xl p-6 shadow-md flex items-center space-x-4 hover:shadow-lg transition-shadow group">
                      <ChevronLeft className="w-8 h-8 text-gray-400 group-hover:text-orange-500 transition-colors" />
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Önceki Yazı</div>
                        <h3 className="font-semibold text-gray-800 group-hover:text-orange-500 transition-colors line-clamp-1">{prevPost.title}</h3>
                      </div>
                    </div>
                  </Link>
                )}
                
                {nextPost && (
                  <Link href={`/blog/${nextPost.slug}`}>
                    <div className="bg-white rounded-3xl p-6 shadow-md flex items-center justify-end space-x-4 hover:shadow-lg transition-shadow group">
                      <div className="text-right">
                        <div className="text-sm text-gray-500 mb-1">Sonraki Yazı</div>
                        <h3 className="font-semibold text-gray-800 group-hover:text-orange-500 transition-colors line-clamp-1">{nextPost.title}</h3>
                      </div>
                      <ChevronRight className="w-8 h-8 text-gray-400 group-hover:text-orange-500 transition-colors" />
                    </div>
                  </Link>
                )}
              </div>
              
              {/* Comments Section */}
              <div className="bg-white rounded-3xl p-8 shadow-md mt-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Yorumlar ({post.comments || 0})</h3>
                
                {/* Comment Form */}
                <div className="mb-8 pb-8 border-b">
                  <h4 className="text-xl font-semibold text-gray-800 mb-4">Yorum Yapın</h4>
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input placeholder="İsim *" className="h-12" required />
                      <Input placeholder="E-posta *" type="email" className="h-12" required />
                    </div>
                    <textarea 
                      className="w-full border border-gray-300 rounded-xl p-4 h-32 focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                      placeholder="Yorumunuz *"
                      required
                    ></textarea>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="save-info" className="rounded border-gray-300 text-orange-600 focus:ring-orange-500" />
                      <label htmlFor="save-info" className="text-gray-600 text-sm">Bir dahaki sefere yorum yaptığımda kullanılmak üzere adımı ve e-posta adresimi bu tarayıcıya kaydet.</label>
                    </div>
                    <Button className="bg-orange-500 hover:bg-orange-600">Yorumu Gönder</Button>
                  </form>
                </div>
                
                {/* Comments List */}
                {post.comments && post.comments > 0 ? (
                  <div className="space-y-8">
                    {Array.from({ length: Math.min(post.comments, 3) }, (_, i) => (
                      <div key={i} className="flex gap-4">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                          <Image
                            src={`/avatars/avatar-${i+1}.jpg`}
                            alt="Commenter"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <h5 className="font-semibold text-gray-900">
                              {["Ali Yıldız", "Ayşe Kaya", "Mehmet Demir"][i]}
                            </h5>
                            <span className="text-sm text-gray-500">
                              {["20 Nisan 2024", "18 Nisan 2024", "15 Nisan 2024"][i]}
                            </span>
                          </div>
                          <p className="text-gray-600">
                            {[
                              "Harika bir yazı olmuş, özellikle açık hava alanlarında gölgelendirme konusundaki önerileriniz çok değerli. Antalya'daki villamızda bu tavsiyeleri uygulayacağız.",
                              "Yeni ev almayı düşünüyorduk ve bu makalede verdiğiniz bilgiler çok yardımcı oldu. Özellikle ilk görüşmede sorulması gereken sorular listeniz için teşekkür ederim.",
                              "Emlak yatırımıyla ilgili bu kadar detaylı ve anlaşılır bilgi paylaştığınız için teşekkür ederim. Lokasyon konusundaki vurgunuz gerçekten çok önemli."
                            ][i]}
                          </p>
                          <Button variant="ghost" size="sm" className="text-orange-500 hover:text-orange-600 hover:bg-orange-50 mt-2 p-0 h-auto">
                            Yanıtla
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    {post.comments > 3 && (
                      <Button variant="outline" className="w-full">
                        Daha Fazla Yorum Göster ({post.comments - 3})
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Henüz yorum yapılmamış. İlk yorumu siz yapın!
                  </div>
                )}
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="space-y-8">
              {/* Related Posts */}
              <div className="bg-white rounded-3xl p-6 shadow-md">
                <h3 className="text-xl font-bold text-gray-900 mb-6">İlgili Yazılar</h3>
                <div className="space-y-4">
                  {relatedPosts.length > 0 ? relatedPosts.map((relatedPost) => (
                    <Link href={`/blog/${relatedPost.slug}`} key={relatedPost.id}>
                      <div className="flex items-center space-x-4 group cursor-pointer">
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                          <Image
                            src={relatedPost.image || "/placeholder.svg"}
                            alt={relatedPost.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="text-orange-500 text-xs font-semibold mb-1 tracking-wider uppercase">
                            {relatedPost.date}
                          </div>
                          <h4 className="text-sm font-semibold text-gray-900 group-hover:text-orange-500 transition-colors duration-300 line-clamp-2">
                            {relatedPost.title}
                          </h4>
                        </div>
                      </div>
                    </Link>
                  )) : (
                    <p className="text-gray-500 text-center py-4">İlgili yazı bulunamadı</p>
                  )}
                </div>
              </div>
              
              {/* Tags */}
              <div className="bg-white rounded-3xl p-6 shadow-md">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Etiketler</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <Link
                      href={`/blog?tag=${tag}`}
                      key={index}
                      className="bg-gray-100 text-gray-600 px-4 py-2 rounded-full text-sm hover:bg-orange-500 hover:text-white transition-colors"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              </div>
              
              {/* Share */}
              <div className="bg-white rounded-3xl p-6 shadow-md">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Paylaş</h3>
                <div className="flex space-x-3">
                  <Button size="icon" variant="outline" className="rounded-full text-blue-600 hover:bg-blue-50 hover:text-blue-700 flex-1 h-12">
                    <Facebook className="w-5 h-5" />
                  </Button>
                  <Button size="icon" variant="outline" className="rounded-full text-sky-500 hover:bg-sky-50 hover:text-sky-600 flex-1 h-12">
                    <Twitter className="w-5 h-5" />
                  </Button>
                  <Button size="icon" variant="outline" className="rounded-full text-pink-600 hover:bg-pink-50 hover:text-pink-700 flex-1 h-12">
                    <Instagram className="w-5 h-5" />
                  </Button>
                  <Button size="icon" variant="outline" className="rounded-full text-green-600 hover:bg-green-50 hover:text-green-700 flex-1 h-12">
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />

      {/* Scroll to Top */}
      <ScrollToTop />
    </div>
  )
}