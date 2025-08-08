'use client';
import { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import {
  MessageSquare,
  Search,
  Star,
  Building2,
  Mail,
  Phone,
  CheckCircle
} from 'lucide-react';
import {
  getAllCommentsWithProperty,
  markCommentAsRead
} from '../../../../services/comment.service';
import {
  getAllContactMessages,
  markContactMessageAsRead
} from '../../../../services/contact.service';

type Comment = {
  _id: string;
  property?: { _id?: string; title?: string; slug?: string; };
  name: string;
  email?: string;
  phone?: string;
  message: string;
  rating?: number;
  createdAt: string;
  status?: "pending" | "read";
};

type ContactMessage = {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  subject?: string;
  message: string;
  createdAt: string;
  status?: "pending" | "read";
};

export default function AdminCommentsPage() {
  const [tab, setTab] = useState<'comments' | 'contact'>('comments');
  const [comments, setComments] = useState<Comment[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [subTab, setSubTab] = useState<'unread' | 'read'>('unread');

  // Yorumları veya iletişim mesajlarını yükle
  useEffect(() => {
    setIsLoading(true);
    if (tab === 'comments') {
      getAllCommentsWithProperty()
        .then(data => {
          const arr = Array.isArray(data) ? data : (data.comments || data);
          arr.sort((a: { createdAt: string }, b: { createdAt: string }) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          setComments(arr);
        })
        .catch(() => setComments([]))
        .finally(() => setIsLoading(false));
    }
    if (tab === 'contact') {
      getAllContactMessages()
        .then(data => {
          const arr = Array.isArray(data) ? data : [];
          arr.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setContactMessages(arr);
        })
        .catch(() => setContactMessages([]))
        .finally(() => setIsLoading(false));
    }
  }, [tab]);

  // Okundu işlemleri
  const handleMarkCommentRead = async (id: string) => {
    try {
      await markCommentAsRead(id);
      setComments(prev => prev.map(c => c._id === id ? { ...c, status: "read" } : c));
    } catch (err) {
      alert("Yorum okundu olarak işaretlenemedi.");
    }
  };
  const handleMarkContactRead = async (id: string) => {
    try {
      await markContactMessageAsRead(id);
      setContactMessages(prev => prev.map(m => m._id === id ? { ...m, status: "read" } : m));
    } catch (err) {
      alert("Mesaj okundu olarak işaretlenemedi.");
    }
  };

  // Yorumlar için arama
  const filteredComments = comments.filter(comment => {
    const title = comment.property?.title || '';
    const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.message.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Alt sekmeye göre filtrele
  const unreadComments = filteredComments.filter(c => c.status !== 'read');
  const readComments = filteredComments.filter(c => c.status === 'read');
  const unreadContacts = contactMessages.filter(m => m.status !== 'read');
  const readContacts = contactMessages.filter(m => m.status === 'read');

  const renderStars = (rating?: number) => {
    if (!rating) return null;
    return (
      <div className="flex items-center">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  // Listeleri switch ile seç
  const getCurrentList = () => {
    if (tab === 'comments') {
      return subTab === 'unread' ? unreadComments : readComments;
    } else {
      return subTab === 'unread' ? unreadContacts : readContacts;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mesajlar</h1>
          <p className="text-gray-600 mt-1">Kullanıcı ilan mesajlarını ve iletişim mesajlarını görüntüleyin</p>
        </div>

        {/* Ana Tabs */}
        <div className="flex space-x-2 border-b mb-2">
          <button
            className={`px-4 py-2 font-semibold text-sm border-b-2 transition ${tab === "comments"
              ? "border-orange-500 text-orange-600 bg-orange-50"
              : "border-transparent text-gray-700 hover:text-orange-500"
              }`}
            onClick={() => { setTab('comments'); setSubTab('unread'); }}
          >
            İlan Mesajları
          </button>
          <button
            className={`px-4 py-2 font-semibold text-sm border-b-2 transition ${tab === "contact"
              ? "border-orange-500 text-orange-600 bg-orange-50"
              : "border-transparent text-gray-700 hover:text-orange-500"
              }`}
            onClick={() => { setTab('contact'); setSubTab('unread'); }}
          >
            İletişim Mesajları
          </button>
        </div>

        {/* Alt Tabs */}
        <div className="flex space-x-2 border-b mb-4">
          <button
            className={`px-4 py-1 font-semibold text-xs border-b-2 transition ${subTab === "unread"
              ? "border-orange-500 text-orange-600 bg-orange-50"
              : "border-transparent text-gray-700 hover:text-orange-500"
              }`}
            onClick={() => setSubTab('unread')}
          >
            Okunmayanlar
          </button>
          <button
            className={`px-4 py-1 font-semibold text-xs border-b-2 transition ${subTab === "read"
              ? "border-green-500 text-green-600 bg-green-50"
              : "border-transparent text-gray-700 hover:text-green-600"
              }`}
            onClick={() => setSubTab('read')}
          >
            Okunanlar
          </button>
        </div>

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
                {getCurrentList().map((comment) => (
                  <div key={comment._id} className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200 ${comment.status === 'read' ? 'opacity-70' : ''}`}>
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
                              {/* {renderStars(comment.rating)} */}
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
                      <div>
                        {comment.status === 'read' ? (
                          <span className="inline-flex items-center px-2 py-1 text-xs rounded bg-green-100 text-green-700 font-semibold">
                            <CheckCircle className="w-4 h-4 mr-1" /> Okundu
                          </span>
                        ) : (
                          <button
                            className="inline-flex items-center px-2 py-1 text-xs rounded bg-orange-100 text-orange-700 font-semibold hover:bg-orange-200"
                            onClick={() => handleMarkCommentRead(comment._id)}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Okundu olarak işaretle
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 mb-2">
                      <p className="text-gray-700">{comment.message}</p>
                    </div>
                  </div>
                ))}
                {getCurrentList().length === 0 && (
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
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-[300px]">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">İletişim Formu Mesajları</h2>
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
              </div>
            ) : getCurrentList().length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Mesaj bulunamadı</h3>
                <p className="text-gray-600">Henüz iletişim formu mesajı gelmemiş.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {getCurrentList().map((msg: ContactMessage) => (
                  <div key={msg._id} className={`bg-gray-50 rounded-lg p-6 border border-gray-200 ${msg.status === 'read' ? 'opacity-70' : ''}`}>
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-2">
                      <div className="flex items-center space-x-3 mb-2 md:mb-0">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-400 to-blue-400 flex items-center justify-center">
                          <span className="text-sm font-semibold text-white">
                            {msg.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{msg.name}</h3>
                          <div className="flex items-center text-sm text-gray-500">
                            {msg.email && (
                              <span className="mr-2 flex items-center">
                                <Mail className="h-4 w-4 mr-1" />
                                {msg.email}
                              </span>
                            )}
                            {msg.phone && (
                              <span className="mr-2 flex items-center">
                                <Phone className="h-4 w-4 mr-1" />
                                {msg.phone}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(msg.createdAt).toLocaleString('tr-TR')}
                      </span>
                    </div>
                    {msg.subject && (
                      <div className="mb-2">
                        <span className="text-xs text-gray-700 font-semibold">Konu: </span>
                        <span className="text-xs text-gray-700">{msg.subject}</span>
                      </div>
                    )}
                    <div className="flex items-center mb-2">
                      {msg.status === "read" ? (
                        <span className="inline-flex items-center px-2 py-1 text-xs rounded bg-green-100 text-green-700 font-semibold">
                          <CheckCircle className="w-4 h-4 mr-1" /> Okundu
                        </span>
                      ) : (
                        <button
                          className="inline-flex items-center px-2 py-1 text-xs rounded bg-orange-100 text-orange-700 font-semibold hover:bg-orange-200"
                          onClick={() => handleMarkContactRead(msg._id)}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Okundu olarak işaretle
                        </button>
                      )}
                    </div>
                    <div className="bg-white rounded p-4 text-gray-700">
                      {msg.message}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}