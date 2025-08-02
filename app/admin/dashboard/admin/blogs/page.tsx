'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import { 
  Search, 
  Filter, 
  Plus,
  Eye,
  Edit, 
  Trash2,
  Calendar,
  User,
  Tag as TagIcon,
  MessageCircle,
  ToggleRight,
  Pencil,
  BookOpen,
  Clock
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import DeleteConfirmationModal from '../../.././components/admin/DeleteConfirmationModal';
import Toast from '../../../components/ui/toast';
import Toggle from '../../../components/ui/toggle';
import StatusChangeModal from '../../../components/admin/StatusChangeModal';

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

export default function AdminBlogsPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal states
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState(false);
  
  // Toast state
  const [toast, setToast] = useState({
    message: '',
    type: 'success' as 'success' | 'error' | 'warning' | 'info',
    isVisible: false
  });

  useEffect(() => {
    // Mock data loading
    setTimeout(() => {
      const mockBlogs: BlogPost[] = [
        {
          id: 1,
          title: "Mükemmel Açık Hava Yaşam Alanı Oluşturma İpuçları",
          excerpt:
            "Villa bahçenizi ve terasınızı nasıl daha fonksiyonel ve estetik hale getirebileceğinizi öğrenin. Modern peyzaj tasarımı ile yaşam kalitenizi artırın.",
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
        },
        {
          id: 4,
          title: "2024 Antalya Emlak Piyasası Analizi ve Öngörüler",
          excerpt:
            "Antalya emlak piyasasının güncel durumu ve gelecek projeksiyonları. Yatırım fırsatları ve dikkat edilmesi gereken noktalar ile bilinçli kararlar alın.",
          date: "MART 20, 2024",
          author: "Fatma Özkan",
          image: "/blog-4.jpg",
          tags: ["Piyasa", "Trend", "Analiz", "2024"],
          category: "Piyasa Analizi",
          isActive: true,
          comments: 23,
          views: 712,
          slug: "2024-antalya-emlak-piyasasi-analizi-ve-ongoruler",
          lastUpdated: "2024-03-22"
        },
        {
          id: 5,
          title: "Villa Bahçesi İçin Akdeniz İklimine Uygun Peyzaj Tasarımı",
          excerpt:
            "Villanızın bahçesini Akdeniz iklimine uygun bitkiler ve tasarım öğeleriyle nasıl profesyonel bir peyzaj mimarı gibi tasarlayabilirsiniz.",
          date: "MART 18, 2024",
          author: "Zeynep Arslan",
          image: "/blog-5.jpg",
          tags: ["Peyzaj", "Bahçe", "Tasarım", "Akdeniz"],
          category: "Tasarım İpuçları",
          isActive: false,
          comments: 19,
          views: 631,
          slug: "villa-bahcesi-icin-akdeniz-iklimine-uygun-peyzaj-tasarimi",
          lastUpdated: "2024-03-20"
        },
        {
          id: 6,
          title: "Gayrimenkul Alımında Yasal Süreçler ve Güvenli Yatırım",
          excerpt:
            "Mülk satın alırken dikkat edilmesi gereken yasal süreçler ve güvenlik önlemleri. Tapu işlemleri, sigorta ve sözleşme detayları hakkında bilmeniz gerekenler.",
          date: "MART 16, 2024",
          author: "Ali Yılmaz",
          image: "/blog-6.jpg",
          tags: ["Güvenlik", "Yasal", "Sigorta", "Tapu"],
          category: "Yasal Süreçler",
          isActive: false,
          comments: 31,
          views: 845,
          slug: "gayrimenkul-aliminda-yasal-surecler-ve-guvenli-yatirim",
          lastUpdated: "2024-03-17"
        },
        {
          id: 7,
          title: "Lüks Gayrimenkulde Son Trendler: Yeni Nesil Konut Teknolojileri",
          excerpt:
            "Lüks gayrimenkul sektöründe öne çıkan yeni teknolojiler ve tasarım trendleri. Akıllı ev sistemlerinden sürdürülebilir lüks kavramına kadar yeni nesil konut özellikleri.",
          date: "MART 14, 2024",
          author: "Serkan Altuğ",
          image: "/blog-7.jpg",
          tags: ["Lüks", "Teknoloji", "Tasarım", "Akıllı Ev"],
          category: "Trend Analizi",
          isActive: true,
          comments: 27,
          views: 736,
          slug: "luks-gayrimenkulde-son-trendler-yeni-nesil-konut-teknolojileri",
          lastUpdated: "2024-03-15"
        },
        {
          id: 8,
          title: "Uzun Dönem Kiralama mı, Satın Alma mı? Doğru Kararı Verme Rehberi",
          excerpt:
            "Antalya'da uzun dönem kiralama ve satın alma seçeneklerinin avantaj ve dezavantajları. Finansal analizler ve yaşam tarzınıza göre doğru tercihi yapın.",
          date: "MART 12, 2024",
          author: "Canan Korkmaz",
          image: "/blog-8.jpg",
          tags: ["Kiralama", "Satın Alma", "Finansal Analiz"],
          category: "Finansal Rehber",
          isActive: true,
          comments: 42,
          views: 925,
          slug: "uzun-donem-kiralama-mi-satin-alma-mi-dogru-karari-verme-rehberi",
          lastUpdated: "2024-03-14"
        }
      ];
      
      setBlogPosts(mockBlogs);
      setFilteredPosts(mockBlogs);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Kategori listesi
  const categories = Array.from(new Set(blogPosts.map(post => post.category)));

  // Filtreleme işlevi
  useEffect(() => {
    const filtered = blogPosts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          post.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = filterCategory === 'all' || post.category === filterCategory;
      
      const matchesStatus = filterStatus === 'all' || 
                           (filterStatus === 'active' && post.isActive) || 
                           (filterStatus === 'inactive' && !post.isActive);
      
      return matchesSearch && matchesCategory && matchesStatus;
    });
    
    setFilteredPosts(filtered);
  }, [searchTerm, filterCategory, filterStatus, blogPosts]);

  // Modal handlers
  const handleDeletePost = (post: BlogPost) => {
    setSelectedPost(post);
    setIsDeleteModalOpen(true);
  };

  const confirmDeletePost = () => {
    if (selectedPost) {
      setBlogPosts(blogPosts.filter(p => p.id !== selectedPost.id));
      setFilteredPosts(filteredPosts.filter(p => p.id !== selectedPost.id));
      setIsDeleteModalOpen(false);
      showToast('Blog yazısı başarıyla silindi.', 'success');
    }
  };
  
  const handleToggleStatus = (post: BlogPost) => {
    setSelectedPost(post);
    setNewStatus(!post.isActive);
    setIsStatusModalOpen(true);
  };
  
  const confirmStatusChange = () => {
    if (selectedPost) {
      const updatedPosts = blogPosts.map(p => 
        p.id === selectedPost.id 
          ? {
              ...p,
              isActive: newStatus
            }
          : p
      );
      
      setBlogPosts(updatedPosts);
      
      // Filtreleri uygula
      const updatedFilteredPosts = updatedPosts.filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            post.author.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesCategory = filterCategory === 'all' || post.category === filterCategory;
        
        const matchesStatus = filterStatus === 'all' || 
                             (filterStatus === 'active' && post.isActive) || 
                             (filterStatus === 'inactive' && !post.isActive);
        
        return matchesSearch && matchesCategory && matchesStatus;
      });
      
      setFilteredPosts(updatedFilteredPosts);
      setIsStatusModalOpen(false);
      showToast(
        `Blog yazısı başarıyla ${newStatus ? 'aktif' : 'pasif'} duruma getirildi.`,
        'success'
      );
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
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Blog Yönetimi</h1>
            <p className="text-gray-600 mt-1">Blog yazılarını yönetin</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Link 
              href="/admin/dashboard/admin/blogs/create"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Yeni Blog Yazısı
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="text-2xl font-bold text-gray-900">{blogPosts.length}</div>
            <div className="text-sm text-gray-600">Toplam Yazı</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="text-2xl font-bold text-green-600">{blogPosts.filter(p => p.isActive).length}</div>
            <div className="text-sm text-gray-600">Aktif Yazı</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="text-2xl font-bold text-yellow-600">{blogPosts.filter(p => !p.isActive).length}</div>
            <div className="text-sm text-gray-600">Pasif Yazı</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="text-2xl font-bold text-blue-600">{blogPosts.reduce((sum, post) => sum + (post.comments || 0), 0)}</div>
            <div className="text-sm text-gray-600">Toplam Yorum</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Blog ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Tüm Kategoriler</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <ToggleRight className="h-4 w-4 text-gray-500" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Tüm Durumlar</option>
                  <option value="active">Aktif</option>
                  <option value="inactive">Pasif</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Blog List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full whitespace-nowrap">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Blog
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kategori
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Yazar
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tarih
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Etkileşim
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPosts.length > 0 ? (
                  filteredPosts.map((post) => (
                    <tr key={post.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="relative flex-shrink-0 w-16 h-12 rounded-md overflow-hidden">
                            <Image 
                              src={post.image} 
                              alt={post.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{post.title}</p>
                            <p className="text-xs text-gray-500 truncate">{post.excerpt.substring(0, 60)}...</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                          {post.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{post.author}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <div className="text-sm text-gray-900">{post.date}</div>
                          <div className="text-xs text-gray-500 flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>Son güncelleme: {post.lastUpdated}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Eye className="h-4 w-4 mr-1" />
                            <span>{post.views || 0}</span>
                          </div>
                          <div className="flex items-center">
                            <MessageCircle className="h-4 w-4 mr-1" />
                            <span>{post.comments || 0}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span 
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            post.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {post.isActive ? 'Aktif' : 'Pasif'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                        <div className="flex justify-end space-x-2">
                          <Link href={`/blog/${post.slug}`} target="_blank">
                            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                              <Eye className="h-4 w-4" />
                            </button>
                          </Link>
                          <Link href={`/admin/dashboard/admin/blogs/edit/${post.id}`}>
                            <button className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-colors">
                              <Edit className="h-4 w-4" />
                            </button>
                          </Link>
                          <button 
                            onClick={() => handleToggleStatus(post)}
                            className={`p-2 ${post.isActive ? 'text-yellow-600 hover:text-yellow-800 hover:bg-yellow-100' : 'text-green-600 hover:text-green-800 hover:bg-green-100'} rounded-lg transition-colors`}
                          >
                            <ToggleRight className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDeletePost(post)}
                            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                      <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-lg font-medium">Blog yazısı bulunamadı</p>
                      <p className="text-sm">Filtreleri değiştirerek tekrar deneyin veya yeni bir blog yazısı ekleyin.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modals */}
      <DeleteConfirmationModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeletePost}
        title="Blog Yazısını Sil"
        message={`"${selectedPost?.title}" başlıklı blog yazısını silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`}
      />
      
      <StatusChangeModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        onConfirm={confirmStatusChange}
        title={`Blog Yazısını ${newStatus ? 'Aktif' : 'Pasif'} Yap`}
        message={`"${selectedPost?.title}" başlıklı blog yazısını ${newStatus ? 'aktif' : 'pasif'} duruma getirmek istediğinize emin misiniz?`}
        status={newStatus}
      />
      
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