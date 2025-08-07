'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import { 
  MessageSquare, 
  Search, 
  Filter,
  Star,
  Calendar,
  User,
  Building2,
  Mail,
  Phone
} from 'lucide-react';
import { getAllCommentsWithProperty } from '../../../../services/comment.service';

type Comment = {
  _id: string;
  property?: {
    _id?: string;
    title?: string;
    slug?: string;
  };
  name: string;
  email?: string;
  phone?: string;
  message: string;
  rating?: number; // opsiyonel, istersen kaldır
  createdAt: string;
};

export default function AdminCommentsPage() {
  const [tab, setTab] = useState<'comments'|'contact'>('comments');
  const [comments, setComments] = useState<Comment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  if (tab === 'comments') {
    setIsLoading(true);
    getAllCommentsWithProperty()
      .then(data => {
        const arr = Array.isArray(data) ? data : (data.comments || []);
        // Burada sıralama işlemini yapıyoruz:
        arr.sort((  a: { createdAt: string | number | Date; }, b: { createdAt: string | number | Date; }) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setComments(arr);
      })
      .catch(() => setComments([]))
      .finally(() => setIsLoading(false));
  }
}, [tab]);

  const filteredComments = comments.filter(comment => {
    const title = comment.property?.title || '';
    const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         comment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         comment.message.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const renderStars = (rating?: number) => {
    if (!rating) return null;
    return (
      <div className="flex items-center">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Yorumlar</h1>
          <p className="text-gray-600 mt-1">Kullanıcı yorumlarını görüntüleyin</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 border-b mb-4">
          <button
            className={`px-4 py-2 font-semibold text-sm border-b-2 transition ${
              tab === "comments"
                ? "border-orange-500 text-orange-600 bg-orange-50"
                : "border-transparent text-gray-700 hover:text-orange-500"
            }`}
            onClick={() => setTab('comments')}
          >
            İlan Yorumları
          </button>
          <button
            className={`px-4 py-2 font-semibold text-sm border-b-2 transition ${
              tab === "contact"
                ? "border-orange-500 text-orange-600 bg-orange-50"
                : "border-transparent text-gray-700 hover:text-orange-500"
            }`}
            onClick={() => setTab('contact')}
          >
            İletişim Formu
          </button>
        </div>

        {/* Tab Content */}
        {tab === 'comments' && (
          <>
            {/* Search */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Yorum, ilan veya kullanıcı ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Comments List */}
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredComments.map((comment) => (
                  <div key={comment._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                            <span className="text-sm font-semibold text-white">
                              {comment.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{comment.name}</h3>
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
                          <span className="text-sm font-medium">{comment.property?.title}</span>
                        </div>
                        <div className="flex items-center space-x-4 mb-3 text-sm text-gray-600">
                          {comment.email && (
                            <div className="flex items-center">
                              <Mail className="h-4 w-4 mr-1" />
                              {comment.email}
                            </div>
                          )}
                          {comment.phone && (
                            <div className="flex items-center">
                              <Phone className="h-4 w-4 mr-1" />
                              {comment.phone}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 mb-2">
                      <p className="text-gray-700">{comment.message}</p>
                    </div>
                  </div>
                ))}
                {filteredComments.length === 0 && (
                  <div className="text-center py-12">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Yorum bulunamadı</h3>
                    <p className="text-gray-600">Arama kriterleriyle eşleşen ilan yorumu bulunamadı.</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {tab === 'contact' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-24 flex flex-col items-center justify-center min-h-[300px]">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">İletişim Formu Mesajları</h2>
            <p className="text-gray-600">Bu alanı yakında ekleyeceksiniz.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}