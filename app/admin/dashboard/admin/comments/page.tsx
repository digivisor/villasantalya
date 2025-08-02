'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import { 
  MessageSquare, 
  Search, 
  Filter,
  Check, 
  X,
  Trash2,
  Star,
  Calendar,
  User,
  Building2,
  Mail,
  Phone
} from 'lucide-react';

type Comment = {
  id: number;
  propertyTitle: string;
  propertyId: number;
  userName: string;
  userEmail: string;
  userPhone: string | null;
  message: string;
  rating: number;
  status: string;
  createdAt: string;
};

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock data loading
    setTimeout(() => {
      setComments([
        {
          id: 1,
          propertyTitle: 'Modern 3+1 Daire Kadıköy',
          propertyId: 1,
          userName: 'Mehmet Demir',
          userEmail: 'mehmet@example.com',
          userPhone: '+90 555 987 6543',
          message: 'Bu daire çok beğendiğim. Fiyat konusunda görüşmek istiyorum. Yakın zamanda görüşmek üzere iletişime geçeceğim.',
          rating: 5,
          status: 'pending',
          createdAt: '2024-01-20T10:00:00Z'
        },
        {
          id: 2,
          propertyTitle: 'Lüks Villa Beşiktaş',
          propertyId: 2,
          userName: 'Fatma Şahin',
          userEmail: 'fatma@example.com',
          userPhone: null,
          message: 'Villa çok güzel ama fiyat biraz yüksek. Pazarlık imkanı var mı?',
          rating: 4,
          status: 'approved',
          createdAt: '2024-01-21T10:00:00Z'
        },
        {
          id: 3,
          propertyTitle: '2+1 Kiralık Ofis Levent',
          propertyId: 3,
          userName: 'Ali Veli',
          userEmail: 'ali@example.com',
          userPhone: '+90 555 123 9876',
          message: 'Ofis konumu çok iyi. Ne zaman müsait olduğunu öğrenebilir miyim?',
          rating: 5,
          status: 'pending',
          createdAt: '2024-01-22T10:00:00Z'
        },
        {
          id: 4,
          propertyTitle: 'Modern 3+1 Daire Kadıköy',
          propertyId: 1,
          userName: 'Zeynep Yılmaz',
          userEmail: 'zeynep@example.com',
          userPhone: '+90 555 456 7890',
          message: 'Daire temiz ve güzel. Ancak fiyat çok yüksek.',
          rating: 3,
          status: 'rejected',
          createdAt: '2024-01-19T10:00:00Z'
        },
        {
          id: 5,
          propertyTitle: 'Lüks Villa Beşiktaş',
          propertyId: 2,
          userName: 'Osman Kaya',
          userEmail: 'osman@example.com',
          userPhone: null,
          message: 'Harika bir villa! Kesinlikle görmeye geleceğim.',
          rating: 5,
          status: 'approved',
          createdAt: '2024-01-18T10:00:00Z'
        }
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredComments = comments.filter(comment => {
    const matchesSearch = comment.propertyTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         comment.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         comment.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || comment.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const handleStatusChange = (id: number, newStatus: string) => {
    setComments(comments.map(comment => 
      comment.id === id ? { ...comment, status: newStatus } : comment
    ));
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Bu yorumu silmek istediğinize emin misiniz?')) {
      setComments(comments.filter(c => c.id !== id));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Onaylandı';
      case 'pending':
        return 'Beklemede';
      case 'rejected':
        return 'Reddedildi';
      default:
        return status;
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
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
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Yorumlar</h1>
          <p className="text-gray-600 mt-1">Kullanıcı yorumlarını yönetin</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="text-2xl font-bold text-gray-900">{comments.length}</div>
            <div className="text-sm text-gray-600">Toplam Yorum</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="text-2xl font-bold text-yellow-600">{comments.filter(c => c.status === 'pending').length}</div>
            <div className="text-sm text-gray-600">Bekleyen</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="text-2xl font-bold text-green-600">{comments.filter(c => c.status === 'approved').length}</div>
            <div className="text-sm text-gray-600">Onaylanan</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="text-2xl font-bold text-red-600">{comments.filter(c => c.status === 'rejected').length}</div>
            <div className="text-sm text-gray-600">Reddedilen</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Yorum ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Tüm Durumlar</option>
                  <option value="pending">Beklemede</option>
                  <option value="approved">Onaylandı</option>
                  <option value="rejected">Reddedildi</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Comments List */}
        <div className="space-y-4">
          {filteredComments.map((comment) => (
            <div key={comment.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                      <span className="text-sm font-semibold text-white">
                        {comment.userName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{comment.userName}</h3>
                      <div className="flex items-center space-x-1">
                        {renderStars(comment.rating)}
                        <span className="text-sm text-gray-500 ml-2">
                          {new Date(comment.createdAt).toLocaleDateString('tr-TR')}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-blue-600 mb-2">
                    <Building2 className="h-4 w-4 mr-1" />
                    <span className="text-sm font-medium">{comment.propertyTitle}</span>
                  </div>
                  
                  <div className="flex items-center space-x-4 mb-3 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-1" />
                      {comment.userEmail}
                    </div>
                    {comment.userPhone && (
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-1" />
                        {comment.userPhone}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(comment.status)}`}>
                    {getStatusText(comment.status)}
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-gray-700">{comment.message}</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {comment.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleStatusChange(comment.id, 'approved')}
                        className="flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Onayla
                      </button>
                      <button
                        onClick={() => handleStatusChange(comment.id, 'rejected')}
                        className="flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Reddet
                      </button>
                    </>
                  )}
                  {comment.status === 'approved' && (
                    <button
                      onClick={() => handleStatusChange(comment.id, 'rejected')}
                      className="flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Reddet
                    </button>
                  )}
                  {comment.status === 'rejected' && (
                    <button
                      onClick={() => handleStatusChange(comment.id, 'approved')}
                      className="flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm"
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Onayla
                    </button>
                  )}
                </div>
                
                <button
                  onClick={() => handleDelete(comment.id)}
                  className="flex items-center px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Sil
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredComments.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Yorum bulunamadı</h3>
            <p className="text-gray-600">Arama kriterleriyle eşleşen yorum bulunamadı.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}