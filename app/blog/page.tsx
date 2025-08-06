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
  Search,
  ArrowRight,
  Calendar,
  User,
  TagIcon,
  MessageCircle,
  Eye,
  Menu,
  X
} from "lucide-react"
import Image from "next/image"
import ScrollToTop from "@/components/scroll-to-top"
import Footer from "@/components/footer"
import Link from "next/link"
import Header from "@/components/Header"

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
    image: "https://softartmimarlik.com/wp-content/uploads/2023/08/Acik-Hava-Mekanlarinda-Konfor-ve-Sikligin-Birlesimi-Bahce-Tasarimlari-.jpeg",
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
    image: "https://ciusgayrimenkul.com/wp-content/uploads/2023/12/anagorsel-780x520-1.jpg",
    tags: ["Danışmanlık", "Yatırım", "İlk Adım"],
    category: "Emlak Rehberi",
    isActive: true,
    comments: 8,
    views: 342,
    slug: "emlak-danismanliginda-ilk-gorusmenin-onemi"
  },
  {
    id: 3,
    title: "Emlak Yatırımında Temel Stratejiler",
    excerpt:
      "Emlak yatırımına başlamadan önce bilmeniz gereken temel konular. Piyasa analizi, lokasyon seçimi ve finansman seçenekleri ile yatırımınızı akıllıca planlayın.",
    content: "Emlak yatırımı, doğru yaklaşımla uzun vadeli finansal güvenlik sağlayabilen en güvenilir yatırım araçlarından biridir. Ancak başarılı bir emlak yatırımı için stratejik bir planlama ve temel prensiplere hâkimiyet gereklidir.\n\n## Lokasyon, Lokasyon, Lokasyon\n\nEmlak yatırımında en kritik faktör lokasyondur. Gelişmekte olan bölgeler, altyapı yatırımları olan alanlar veya turizm potansiyeli yüksek yerler, değer artış potansiyelini maksimize edebilir. Antalya özelinde, sahil şeridi, şehir merkezi ve gelişmekte olan ilçeler farklı yatırım fırsatları sunar.\n\n## Yatırım Amacınızı Belirleyin\n\nEmlak yatırımında temel olarak iki ana strateji vardır:\n\n1. **Kira Geliri Odaklı Yatırım:** Düzenli nakit akışı sağlamak için yüksek kira getirisi sunan gayrimenkuller\n2. **Değer Artışı Odaklı Yatırım:** Uzun vadede değer kazanma potansiyeli yüksek olan gayrimenkuller\n\nHangi stratejiyi izleyeceğiniz, finansal hedeflerinize ve risk toleransınıza bağlı olarak değişecektir.\n\n## Piyasa Analizini Doğru Yapın\n\nDoğru bir piyasa analizi, fırsatları ve riskleri değerlendirmenize yardımcı olur:\n\n- Bölgedeki fiyat trendlerini inceleyin\n- Kiralama potansiyelini araştırın\n- Gelecekteki gelişim planlarını öğrenin\n- Benzer gayrimenkullerin performansını değerlendirin\n\n## Finansal Planınızı Oluşturun\n\nEmlak yatırımı yaparken sadece satın alma maliyetini değil, aşağıdaki faktörleri de hesaba katmalısınız:\n\n- Emlak vergisi\n- Bakım ve onarım maliyetleri\n- Sigorta\n- Yönetim giderleri (eğer kendiniz yönetmeyecekseniz)\n- Potansiyel boş kalma süreleri\n\n## Çeşitlendirme Yapın\n\nTüm yatırımlarda olduğu gibi, emlak yatırımında da çeşitlendirme riski azaltır. Farklı lokasyonlarda, farklı tipte gayrimenkullere yatırım yapmak, portföyünüzü daha dayanıklı hale getirebilir.\n\n## Uzman Desteği Alın\n\nEmlak piyasası karmaşık olabilir ve yerel dinamiklere göre sürekli değişir. Bu nedenle:\n\n- İyi bir emlak danışmanıyla çalışın\n- Hukuki süreçler için bir avukata danışın\n- Finansal planlama için bir mali müşavir desteği alın\n\n## Uzun Vadeli Düşünün\n\nEmlak yatırımı genellikle uzun vadeli bir yatırım aracıdır. Kısa vadeli dalgalanmalardan etkilenmemek için sabırlı olun ve uzun vadeli stratejinize odaklanın.\n\nDoğru bilgi, stratejik planlama ve profesyonel destekle, emlak yatırımı finansal geleceğiniz için sağlam bir temel oluşturabilir. Antalya'nın dinamik emlak piyasası, bilinçli yatırımcılar için çeşitli fırsatlar sunmaktadır.",
    date: "MART 22, 2024",
    author: "Mehmet Kaya",
    image: "https://www.emlakdekor.com/uploads/haberler/vitrin/emlak-sektorunde-guncel-gelismeler-ve-yeni-donem-stratejileri.jpg",
    tags: ["Temel Bilgiler", "Yatırım", "Strateji"],
    category: "Başlangıç Rehberi",
    isActive: true,
    comments: 15,
    views: 528,
    slug: "emlak-yatiriminda-temel-stratejiler"
  },
  {
    id: 4,
    title: "2024 Antalya Emlak Piyasası Analizi ve Öngörüler",
    excerpt:
      "Antalya emlak piyasasının güncel durumu ve gelecek projeksiyonları. Yatırım fırsatları ve dikkat edilmesi gereken noktalar ile bilinçli kararlar alın.",
    content: "Antalya, sadece Türkiye'nin değil, dünyanın en çekici emlak piyasalarından biri olmaya devam ediyor. 2024 yılında da hem yerli hem de yabancı yatırımcıların gözdesi olan kent, dinamik bir gayrimenkul pazarına sahip. İşte güncel piyasa analizi ve gelecek öngörüleri.\n\n## Güncel Piyasa Durumu\n\n2024'ün ilk çeyreğinde Antalya emlak piyasası, geçen yıla göre ortalama %15-20 değer artışı gösterdi. Özellikle Konyaaltı, Lara ve Muratpaşa gibi merkezi ilçelerde talep yüksek seyrederken, Kepez ve Döşemealtı gibi gelişmekte olan bölgelerde de ilgi artıyor.\n\n## Bölgesel Analiz\n\n### Konyaaltı\nDenize yakınlığı ve gelişmiş altyapısıyla premium segmentte ön plana çıkıyor. Metrekare fiyatları 25.000 TL - 40.000 TL arasında değişiyor.\n\n### Lara\nLüks konut segmentinin merkezi olmaya devam ediyor. Özellikle markalı projelerde metrekare fiyatları 30.000 TL'yi aşabiliyor.\n\n### Kepez\nUygun fiyatlı konutlarıyla yatırım için cazip fırsatlar sunuyor. Metrekare fiyatları 10.000 TL - 18.000 TL aralığında.\n\n### Muratpaşa\nŞehir merkezinde konumuyla hem yerleşim hem de ticari açıdan değerli. Fiyatlar lokasyona göre büyük değişkenlik gösteriyor.\n\n## Yabancı Yatırımcı İlgisi\n\n2024'te yabancıların Antalya gayrimenkul piyasasına ilgisi artarak devam ediyor. Özellikle Rusya, Almanya, İngiltere ve Ortadoğu ülkelerinden yatırımcılar, hem yaşam hem de yatırım amaçlı gayrimenkul satın alıyor. Bu ilgi, lüks konut segmentinde fiyatları yukarı çeken bir faktör olarak karşımıza çıkıyor.\n\n## Turizm Sektörünün Etkisi\n\nAntalya'nın güçlü turizm potansiyeli, kısa dönem kiralama pazarını da canlı tutuyor. Özellikle turistik bölgelerdeki gayrimenkuller, yatırımcılara cazip kira getirileri sunuyor. 2024 turizm sezonunun rekor beklentileri, bu segmentteki yatırımları daha da çekici hale getiriyor.\n\n## Gelecek Öngörüleri\n\n- **Fiyat Artışı:** Önümüzdeki 12 ay içinde %10-15 civarında değer artışı bekleniyor.\n- **Yeni Projeler:** Özellikle Kepez ve Döşemealtı'nda yeni konut projeleri artacak.\n- **Sürdürülebilir Yapılar:** Enerji verimliliği yüksek, çevre dostu projeler önem kazanacak.\n- **Akıllı Ev Sistemleri:** Teknoloji entegrasyonu yüksek gayrimenkuller daha çok talep görecek.\n\n## Yatırımcılar İçin Öneriler\n\n1. **Gelişmekte Olan Bölgeler:** Altyapı yatırımları devam eden bölgeler, uzun vadeli değer artış potansiyeli sunuyor.\n2. **Deniz Manzaralı Mülkler:** Her zaman premium değerini koruyor ve kolayca kiralanabiliyor.\n3. **Küçük Metrekareli Daireler:** Özellikle şehir merkezinde, yatırım getirisi açısından avantajlı olabilir.\n4. **Yasal Düzenlemeleri Takip Edin:** Yabancı yatırımcı düzenlemeleri ve imar kurallarındaki değişiklikler yatırım kararlarınızı etkileyebilir.\n\nAntalya emlak piyasası, doğru analiz ve stratejik yaklaşımla hem yerli hem de yabancı yatırımcılar için cazip fırsatlar sunmaya devam ediyor. Bölgesel dinamikleri iyi anlayarak ve uzman desteği alarak yapılacak yatırımlar, uzun vadede değer yaratma potansiyeline sahip.",
    date: "MART 20, 2024",
    author: "Fatma Özkan",
    image: "https://ozerdem.com/wp-content/uploads/2025/07/antalya-gayrimenkul-yatirim-2026.jpg",
    tags: ["Piyasa", "Trend", "Analiz", "2024"],
    category: "Piyasa Analizi",
    isActive: true,
    comments: 23,
    views: 712,
    slug: "2024-antalya-emlak-piyasasi-analizi-ve-ongoruler"
  },
  {
    id: 5,
    title: "Villa Bahçesi İçin Akdeniz İklimine Uygun Peyzaj Tasarımı",
    excerpt:
      "Villanızın bahçesini Akdeniz iklimine uygun bitkiler ve tasarım öğeleriyle nasıl profesyonel bir peyzaj mimarı gibi tasarlayabilirsiniz.",
    content: "Akdeniz ikliminin sunduğu avantajlarla Antalya'daki villa bahçeniz, yılın büyük bir bölümünde keyifle kullanabileceğiniz bir yaşam alanına dönüşebilir. Doğru planlama ve bitki seçimiyle hem su tasarrufu sağlayan hem de görsel açıdan etkileyici bir bahçeye sahip olabilirsiniz.\n\n## Akdeniz Bahçesi Tasarım Prensipleri\n\nAkdeniz bahçesi tasarımında temel prensipler şunlardır:\n\n- **Su Tasarrufu:** Kuraklığa dayanıklı bitkiler tercih edilir\n- **Doğal Malzemeler:** Taş, ahşap ve terrakota gibi doğal malzemeler kullanılır\n- **Gölgeli Alanlar:** Sıcak yaz günleri için gölgeli oturma alanları oluşturulur\n- **Su Öğeleri:** Serinlik hissi yaratmak için küçük havuzlar veya çeşmeler eklenir\n- **Renk Harmonisi:** Lavanta mavisi, zeytin yeşili, terrakota ve beyaz tonları tercih edilir\n\n## Akdeniz İklimine Uygun Bitkiler\n\n### Ağaçlar\n\n- **Zeytin Ağacı (Olea europaea):** Akdeniz bahçesinin ikonik ağacı, uzun ömürlü ve kuraklığa dayanıklıdır\n- **Narenciye Ağaçları:** Portakal, limon veya mandalina ağaçları hem görsel hem de işlevsel değer katar\n- **Servi (Cupressus sempervirens):** Dikey vurgu yaratır ve rüzgar kırıcı olarak işlev görür\n- **Palmiyeler:** Özellikle Phoenix dactylifera (hurma) ve Washingtonia türleri Antalya iklimine mükemmel uyum sağlar\n\n### Çalılar ve Çiçekli Bitkiler\n\n- **Lavanta (Lavandula):** Harika kokusu ve mavi-mor çiçekleriyle görsel şölen sunar\n- **Bougainvillea:** Canlı renkleriyle duvarları ve çitleri kaplamak için idealdir\n- **Adaçayı (Salvia):** Aromatik yaprakları ve çiçekleriyle bahçeye renk katar\n- **Kekik (Thymus):** Yer örtücü olarak kullanılabilir, ayrıca mutfakta da değerlendirilir\n- **Biberiye (Rosmarinus officinalis):** Hem süs hem de mutfak bitkisi olarak çok yönlüdür\n\n## Bahçe Düzenleme Adımları\n\n### 1. Planlama\n\nÖncelikle bahçenizin güneş alan ve gölgeli alanlarını, toprak yapısını ve drenaj durumunu değerlendirin. Oturma alanları, yemek alanları ve aktivite bölgeleri için alanlar belirleyin.\n\n### 2. Sert Peyzaj Öğeleri\n\nAkdeniz bahçesinde sert peyzaj öğeleri önemlidir:\n\n- Doğal taş patikalar ve teraslar\n- Taş duvarlar veya sınırlayıcılar\n- Pergolalar ve gölgelikler\n- Terrakota saksılar ve kaplar\n- Su öğeleri (küçük havuz, çeşme veya şelale)\n\n### 3. Bitkilendirme\n\nKademeli bir bitkilendirme planı oluşturun:\n\n- Arka planda büyük ağaçlar\n- Orta katmanda çalılar ve boylu çiçekli bitkiler\n- Ön planda yer örtücü bitkiler ve mevsimlik çiçekler\n\n### 4. Sulama Sistemi\n\nAkdeniz bahçesi su tasarrufu odaklı olsa da, özellikle yerleşme döneminde düzenli sulama gerekir. Damla sulama sistemi en verimli çözümdür.\n\n### 5. Aydınlatma\n\nBahçe aydınlatması, akşam saatlerinde de dış mekanı kullanmanıza olanak tanır:\n\n- Patika aydınlatması\n- Vurgu aydınlatması (özel ağaçlar veya peyzaj öğeleri için)\n- Ambiyans aydınlatması (oturma alanları için)\n\n## Bakım İpuçları\n\nAkdeniz bahçesi genellikle düşük bakım gerektirir ancak düzenli bakımla daha sağlıklı ve güzel görünür:\n\n- Düzenli budama yapın\n- Yabani otları kontrol edin\n- Mevsime göre sulama sıklığını ayarlayın\n- Organik malç kullanarak nem korunumunu sağlayın\n- Yılda 2-3 kez organik gübre uygulayın\n\nDoğru planlama ve bitkilerle, Antalya'daki villanızın bahçesi hem su tasarrufu sağlayan hem de yılın büyük bir bölümünde rengarenk çiçeklerle dolu, keyifli bir yaşam alanına dönüşebilir. Akdeniz peyzaj tasarımının sadeliği ve işlevselliği, modern villa mimarisiyle mükemmel bir uyum sağlar.",
    date: "MART 18, 2024",
    author: "Zeynep Arslan",
    image: "https://gulistanpeyzaj.com/trex/assets/img/hizmetler/2950529165.jpg",
    tags: ["Peyzaj", "Bahçe", "Tasarım", "Akdeniz"],
    category: "Tasarım İpuçları",
    isActive: true,
    comments: 19,
    views: 631,
    slug: "villa-bahcesi-icin-akdeniz-iklimine-uygun-peyzaj-tasarimi"
  },
  {
    id: 6,
    title: "Gayrimenkul Alımında Yasal Süreçler ve Güvenli Yatırım",
    excerpt:
      "Mülk satın alırken dikkat edilmesi gereken yasal süreçler ve güvenlik önlemleri. Tapu işlemleri, sigorta ve sözleşme detayları hakkında bilmeniz gerekenler.",
    content: "Gayrimenkul satın almak, çoğumuz için hayatımızın en büyük finansal yatırımlarından biridir. Bu süreçte yasal prosedürleri doğru yönetmek ve gerekli güvenlik önlemlerini almak, gelecekte karşılaşabileceğiniz sorunları önlemek için kritik öneme sahiptir.\n\n## Satın Alma Öncesi Araştırma\n\n### Tapu Durumu Kontrolü\n\nHerhangi bir gayrimenkul satın almadan önce yapmanız gereken ilk iş, tapu kaydını kontrol etmektir. Tapu kaydında şu bilgileri mutlaka incelemelisiniz:\n\n- Malik bilgileri (satıcının gerçekten gayrimenkulün sahibi olup olmadığı)\n- İpotek ve haciz durumu\n- Şerh ve beyanlar\n- İmar durumu ve yapı kullanma izin belgesi\n\n### Belediye İmar Durumu\n\nİlgili belediyeden gayrimenkulün imar durumunu öğrenmek, özellikle arsalar veya yeni yapılar için kritik öneme sahiptir. Bu bilgi size:\n\n- Bölgenin gelecekteki gelişim planları\n- İnşaat yapılabilirlik durumu\n- Olası kısıtlamalar hakkında bilgi verir\n\n## Satış Sözleşmesi ve Tapu Devri\n\n### Satış Vaadi Sözleşmesi\n\nSatış vaadi sözleşmesi, özellikle ödemenin taksitli yapıldığı veya tapu devrinin hemen gerçekleşemediği durumlarda önemlidir. Bu sözleşme noter tarafından onaylanmalı ve şu maddeleri içermelidir:\n\n- Gayrimenkulün açık tanımı ve bilgileri\n- Satış bedeli ve ödeme planı\n- Tapu devir tarihi ve koşulları\n- Cezai şartlar ve yükümlülükler\n\n### Tapu Devri İşlemleri\n\nTapu devri, tarafların (alıcı ve satıcı) birlikte tapu müdürlüğünde hazır bulunmasıyla gerçekleşir. Bu süreçte:\n\n1. Tapu harcı ve değer artış vergisi hesaplanır ve ödenir\n2. Kimlik kontrolleri yapılır\n3. Tapu memuru tarafından resmi senet hazırlanır\n4. Taraflar resmi senedi imzalar\n5. Yeni tapu belgesi düzenlenir\n\n## Gayrimenkul Vergisi ve Masraflar\n\n### Alım-Satım Vergileri\n\n- **Tapu Harcı:** Gayrimenkul değerinin %4'ü (genellikle alıcı ve satıcı %2'şer öder)\n- **Değer Artış Vergisi:** Satıcının ödemekle yükümlü olduğu vergi\n- **Emlak Beyan Değeri:** Belediye tarafından belirlenen asgari değer\n\n### Yıllık Vergiler\n\n- **Emlak Vergisi:** Yıllık olarak ödenen, gayrimenkulün türüne ve değerine göre değişen vergi\n- **Çevre Temizlik Vergisi:** Belediyeye ödenen vergi\n\n## Sigorta ve Güvence\n\n### DASK (Zorunlu Deprem Sigortası)\n\nTürkiye'de konutlar için zorunlu olan DASK, deprem sonucu oluşabilecek hasarlara karşı asgari bir güvence sağlar. Elektrik ve su aboneliği işlemleri için DASK poliçesi gereklidir.\n\n### Konut Sigortası\n\nDASK'a ek olarak, yangın, sel, hırsızlık gibi risklere karşı konut sigortası yaptırmak da önemlidir. Bu, gayrimenkulünüzü ve içindeki eşyalarınızı korur.\n\n## Yabancıların Gayrimenkul Edinimi\n\nYabancıların Türkiye'de gayrimenkul edinimi mümkündür ancak bazı kısıtlamalar vardır:\n\n- Askeri ve stratejik bölgelerde gayrimenkul edinimi kısıtlanabilir\n- Yabancı uyruklu kişiler en fazla 30 hektara kadar arazi edinebilir\n- Bazı ülke vatandaşları için özel kısıtlamalar olabilir\n\n## Profesyonel Destek Alma\n\n### Avukat Desteği\n\nGayrimenkul alım sürecinde bir avukattan destek almak, yasal süreçlerin doğru yönetilmesi için önemlidir. Avukat:\n\n- Sözleşmeleri inceleyebilir\n- Tapu ve imar durumunu kontrol edebilir\n- Olası yasal sorunları önceden tespit edebilir\n\n### Emlak Değerleme Raporu\n\nBağımsız bir değerleme uzmanından alacağınız rapor, gayrimenkulün gerçek piyasa değerini belirlemenize ve adil bir fiyat ödemenize yardımcı olur.\n\n## Son Kontroller\n\n### Gayrimenkul Teslim Tutanağı\n\nÖzellikle yeni binalarda, gayrimenkulü teslim alırken detaylı bir tutanak hazırlanmalı ve varsa eksiklikler veya hatalar belgelenmelidir.\n\n### Abonelik İşlemleri\n\nTapu devrinden sonra elektrik, su, doğalgaz ve internet gibi aboneliklerin devir veya yeni kayıt işlemlerini tamamlamayı unutmayın.\n\nGayrimenkul alımı, yasal prosedürlere hâkim olmayı ve dikkatli planlama yapmayı gerektiren bir süreçtir. Profesyonel destek alarak ve gerekli araştırmaları yaparak, güvenli ve sorunsuz bir yatırım gerçekleştirebilirsiniz.",
    date: "MART 16, 2024",
    author: "Ali Yılmaz",
    image: "https://cdnuploads.aa.com.tr/uploads/Contents/2025/07/24/thumbs_b_c_8b9f55338968ebb6f1f64afbb7034ac9.jpg",
    tags: ["Güvenlik", "Yasal", "Sigorta", "Tapu"],
    category: "Yasal Süreçler",
    isActive: true,
    comments: 31,
    views: 845,
    slug: "gayrimenkul-aliminda-yasal-surecler-ve-guvenli-yatirim"
  },
  {
    id: 7,
    title: "Lüks Gayrimenkulde Son Trendler: Yeni Nesil Konut Teknolojileri",
    excerpt:
      "Lüks gayrimenkul sektöründe öne çıkan yeni teknolojiler ve tasarım trendleri. Akıllı ev sistemlerinden sürdürülebilir lüks kavramına kadar yeni nesil konut özellikleri.",
    date: "MART 14, 2024",
    author: "Serkan Altuğ",
    image: "https://www.unite.ai/wp-content/uploads/2025/03/alex_mc9997_An_aerial_view_of_a_suburban_neighborhood_overlai_acc9e5a0-db66-4163-98b2-6173708aafe6_2.png",
    tags: ["Lüks", "Teknoloji", "Tasarım", "Akıllı Ev"],
    category: "Trend Analizi",
    isActive: true,
    comments: 27,
    views: 736,
    slug: "luks-gayrimenkulde-son-trendler-yeni-nesil-konut-teknolojileri"
  },
  {
    id: 8,
    title: "Uzun Dönem Kiralama mı, Satın Alma mı? Doğru Kararı Verme Rehberi",
    excerpt:
      "Antalya'da uzun dönem kiralama ve satın alma seçeneklerinin avantaj ve dezavantajları. Finansal analizler ve yaşam tarzınıza göre doğru tercihi yapın.",
    date: "MART 12, 2024",
    author: "Canan Korkmaz",
    image: "https://www.hepsiemlak.com/emlak-yasam/wp-content/uploads/2022/06/evimi-satmali-miyim-yoksa-kiraya-mi-vermeliyim.jpg",
    tags: ["Kiralama", "Satın Alma", "Finansal Analiz"],
    category: "Finansal Rehber",
    isActive: true,
    comments: 42,
    views: 925,
    slug: "uzun-donem-kiralama-mi-satin-alma-mi-dogru-karari-verme-rehberi"
  }
]

const recentPosts = blogPosts
  .filter(post => post.isActive !== false)
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  .slice(0, 3)
  .map(post => ({
    id: post.id,
    title: post.title,
    date: post.date,
    image: post.image,
    slug: post.slug
  }))

// Tüm etiketleri topla ve benzersiz hale getir
const allTags = Array.from(new Set(blogPosts.flatMap(post => post.tags)))

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Mobil menüyü aç/kapat
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Filtreleme işlevi
  const filteredPosts = blogPosts
    .filter(post => post.isActive !== false)
    .filter(post => {
      const matchesSearch = searchTerm === "" || 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesCategory = selectedCategory === null || post.category === selectedCategory
      
      const matchesTag = selectedTag === null || post.tags.includes(selectedTag)
      
      return matchesSearch && matchesCategory && matchesTag
    })

  // Benzersiz kategorileri topla
  const categories = Array.from(new Set(blogPosts.map(post => post.category)))

  return (
    <div className="min-h-screen bg-white">
      
      <Header/>

      {/* Hero Section */}
      <section className="relative h-72 md:h-96 overflow-hidden">
        <Image src="/about-hero-bg.jpg" alt="Blog Hero" fill className="object-cover" />
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 w-full">
            <div className="text-white">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4">Emlak Blogumuz</h1>
              <p className="text-base md:text-xl max-w-2xl mb-4 md:mb-6">Gayrimenkul dünyasındaki son gelişmeler, yatırım tavsiyeleri, tasarım fikirleri ve daha fazlası</p>
              <div className="flex items-center space-x-2 text-sm md:text-lg">
                <Link href="/" className="hover:text-orange-500 transition-colors">
                  Ana Sayfa
                </Link>
                <span>-</span>
                <span className="text-orange-500">Blog</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Content */}
      <section className="py-8 md:py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8 md:gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Kategori Filtreleri */}
              <div className="flex flex-wrap gap-2 mb-6 md:mb-8">
                <Button 
                  onClick={() => setSelectedCategory(null)}
                  variant={selectedCategory === null ? "default" : "outline"}
                  className={`text-xs md:text-sm ${selectedCategory === null ? "bg-orange-500 hover:bg-orange-600" : ""}`}
                  size="sm"
                >
                  Tümü
                </Button>
                {categories.map((category, idx) => (
                  <Button 
                    key={idx} 
                    onClick={() => setSelectedCategory(category)}
                    variant={selectedCategory === category ? "default" : "outline"}
                    className={`text-xs md:text-sm ${selectedCategory === category ? "bg-orange-500 hover:bg-orange-600" : ""}`}
                    size="sm"
                  >
                    {category}
                  </Button>
                ))}
              </div>

              {/* Sonuç Sayısı */}
              <div className="text-gray-600 mb-6 md:mb-8 text-sm">
                {filteredPosts.length} yazı bulundu
                {selectedCategory && <span> / Kategori: <span className="font-medium">{selectedCategory}</span></span>}
                {selectedTag && <span> / Etiket: <span className="font-medium">#{selectedTag}</span></span>}
                {searchTerm && <span> / Arama: <span className="font-medium">"{searchTerm}"</span></span>}
                {(selectedCategory || selectedTag || searchTerm) && (
                  <button 
                    onClick={() => {
                      setSelectedCategory(null)
                      setSelectedTag(null)
                      setSearchTerm("")
                    }}
                    className="ml-2 text-orange-500 hover:underline"
                  >
                    Filtreleri Temizle
                  </button>
                )}
              </div>

              {/* Blog Posts */}
              <div className="grid gap-6 md:gap-8">
                {filteredPosts.length > 0 ? filteredPosts.map((post, index) => (
                  <article
                    key={post.id}
                    className={`bg-white rounded-xl md:rounded-3xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 ${
                      index === 0 && !selectedCategory && !selectedTag && !searchTerm ? "lg:col-span-2" : ""
                    }`}
                  >
                    {/* Blog Image */}
                    <div className="relative h-48 md:h-64 lg:h-80 overflow-hidden">
                      <Image
                        src={post.image || "/placeholder.svg"}
                        alt={post.title}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                      />

                      {/* Category Tag */}
                      <div className="absolute top-2 md:top-4 left-2 md:left-4 bg-orange-500 text-white px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-semibold">
                        {post.category}
                      </div>
                    </div>

                    {/* Blog Content */}
                    <div className="p-4 md:p-8">
                      {/* Date */}
                      <div className="text-orange-500 text-xs md:text-sm font-semibold mb-2 md:mb-4 tracking-wider uppercase">
                        {post.date}
                      </div>

                      {/* Title */}
                      <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 md:mb-4 hover:text-orange-500 transition-colors duration-300 cursor-pointer">
                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                      </h2>

                      {/* Excerpt */}
                      <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-4 md:mb-6">{post.excerpt}</p>

                      {/* Meta Info */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm text-gray-500 mb-3 sm:mb-0">
                          <div className="flex items-center space-x-1">
                            <User className="w-3 h-3 md:w-4 md:h-4" />
                            <span>{post.author}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                            <span>{post.date}</span>
                          </div>
                          {post.comments && (
                            <div className="flex items-center space-x-1">
                              <MessageCircle className="w-3 h-3 md:w-4 md:h-4" />
                              <span>{post.comments}</span>
                            </div>
                          )}
                          {post.views && (
                            <div className="flex items-center space-x-1">
                              <Eye className="w-3 h-3 md:w-4 md:h-4" />
                              <span>{post.views}</span>
                            </div>
                          )}
                        </div>

                        <Link href={`/blog/${post.slug}`}>
                          <Button
                            variant="ghost"
                            className="text-orange-500 hover:text-orange-600 hover:bg-orange-50 p-0 h-auto text-xs md:text-sm font-semibold"
                          >
                            Devamını Oku
                            <ArrowRight className="w-3 h-3 md:w-4 md:h-4 ml-1 md:ml-2" />
                          </Button>
                        </Link>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mt-4 md:mt-6 pt-4 md:pt-6 border-t border-gray-100">
                        {post.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            onClick={() => setSelectedTag(tag)}
                            className="bg-gray-100 text-gray-600 px-2 md:px-3 py-1 rounded-full text-xs hover:bg-orange-100 hover:text-orange-600 transition-colors duration-300 cursor-pointer"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </article>
                )) : (
                  <div className="bg-white p-6 md:p-8 rounded-xl md:rounded-3xl text-center">
                    <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-2">Aradığınız kriterlere uygun yazı bulunamadı</h3>
                    <p className="text-gray-600 mb-4">Farklı anahtar kelimeler deneyebilir veya filtreleri kaldırabilirsiniz</p>
                    <Button 
                      onClick={() => {
                        setSelectedCategory(null)
                        setSelectedTag(null)
                        setSearchTerm("")
                      }}
                      className="bg-orange-500 hover:bg-orange-600"
                    >
                      Tüm Yazıları Göster
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6 md:space-y-8">
              {/* Search */}
              <div className="bg-white rounded-xl md:rounded-3xl p-4 md:p-6 shadow-md md:shadow-lg">
                <div className="relative">
                  <Input
                    placeholder="Anahtar Kelime Girin"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-10 md:h-12 rounded-lg md:rounded-xl border-gray-200 text-gray-600 placeholder:text-gray-400 pr-10 md:pr-12 text-sm"
                  />
                  <Button
                    size="sm"
                    className="absolute right-2 top-2 h-6 w-6 md:h-8 md:w-8 p-0 bg-orange-500 hover:bg-orange-600 rounded-md md:rounded-lg"
                  >
                    <Search className="w-3 h-3 md:w-4 md:h-4" />
                  </Button>
                </div>
              </div>

              {/* Categories */}
              <div className="bg-white rounded-xl md:rounded-3xl p-4 md:p-6 shadow-md md:shadow-lg">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6">Kategoriler</h3>
                <div className="space-y-2 md:space-y-3">
                  {categories.map((category, idx) => {
                    const count = blogPosts.filter(post => post.category === category && post.isActive !== false).length
                    return (
                      <div 
                        key={idx}
                        onClick={() => setSelectedCategory(category)}
                        className="flex items-center justify-between p-2 md:p-3 rounded-lg hover:bg-orange-50 transition-colors cursor-pointer group"
                      >
                        <span className="font-medium text-gray-700 text-sm md:text-base group-hover:text-orange-500">{category}</span>
                        <span className="bg-gray-100 text-gray-600 group-hover:bg-orange-100 group-hover:text-orange-600 px-1.5 md:px-2 py-0.5 md:py-1 rounded-full text-xs">
                          {count}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Recent Posts */}
              <div className="bg-white rounded-xl md:rounded-3xl p-4 md:p-6 shadow-md md:shadow-lg">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6">Son Yazılar</h3>
                <div className="space-y-3 md:space-y-4">
                  {recentPosts.map((post) => (
                    <Link href={`/blog/${post.slug}`} key={post.id}>
                      <div className="flex items-center space-x-3 md:space-x-4 group cursor-pointer">
                        <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-lg md:rounded-xl overflow-hidden flex-shrink-0">
                          <Image
                            src={post.image || "/placeholder.svg"}
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="text-orange-500 text-xs font-semibold mb-1 tracking-wider uppercase">
                            {post.date}
                          </div>
                          <h4 className="text-xs md:text-sm font-semibold text-gray-900 group-hover:text-orange-500 transition-colors duration-300 line-clamp-2">
                            {post.title}
                          </h4>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="bg-white rounded-xl md:rounded-3xl p-4 md:p-6 shadow-md md:shadow-lg">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6">Etiketler</h3>
                <div className="flex flex-wrap gap-2">
                  {allTags.map((tag, index) => (
                    <span
                      key={index}
                      onClick={() => setSelectedTag(tag)}
                      className={`px-3 py-1.5 rounded-full text-xs cursor-pointer transition-colors duration-300 ${
                        selectedTag === tag 
                          ? 'bg-orange-500 text-white' 
                          : 'bg-gray-100 text-gray-600 hover:bg-orange-100 hover:text-orange-600'
                      }`}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Instagram */}
              <div className="bg-white rounded-xl md:rounded-3xl p-4 md:p-6 shadow-md md:shadow-lg">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6">Instagram</h3>
                <div className="grid grid-cols-3 gap-1.5 md:gap-2">
                  {blogPosts.slice(0, 6).map((post, idx) => (
                    <div
                      key={idx}
                      className="aspect-square rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300 cursor-pointer relative"
                    >
                      <Image
                        src={post.image || "/placeholder.svg"}
                        alt={`Instagram ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Scroll to Top */}
      <ScrollToTop />
    </div>
  )
}