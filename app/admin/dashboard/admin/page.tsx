'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { 
  Building2, 
  Users, 
  MessageSquare, 
  TrendingUp,
  Eye,
  DollarSign,
  MapPin
} from 'lucide-react';
import propertyService from "../../../services/property.service";
import { updateYoutubeVideoId } from "../../../services/settings.service";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalConsultants: 0,
    pendingComments: 0,
    monthlyRevenue: 0,
    propertiesChange: 0,
    consultantsChange: 0,
    revenueChange: 0
  });

  const [recentProperties, setRecentProperties] = useState([]);
  const [videoId, setVideoId] = useState("");
  const [videoInput, setVideoInput] = useState("");

  useEffect(() => {
    // Statları ve son eklenen ilanları API'den çek
    const fetchStatsAndProperties = async () => {
      try {
        // Statlar için backend endpoint'iniz olmalı (örnek: /api/admin/dashboard-stats)
        const statsRes = await fetch('/api/admin/dashboard-stats');
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }

        // İlanlar propertyService ile çekiliyor
        const propData = await propertyService.getAllProperties({ limit: 5, sort: '-createdAt' });
        setRecentProperties(propData?.properties || []);
      } catch (error) {
        console.error("Dashboard verileri çekilemedi:", error);
      }
    };

    // YouTube video id'yi çek
     const fetchVideoId = async () => {
      try {
        const res = await fetch("https://api.villasantalya.com/api/settings/youtube-video");
        if (res.ok) {
          const data = await res.json();
          if (data.videoId) setVideoId(data.videoId);
          else if (data.videoUrl) {
            const match = data.videoUrl.match(/(?:v=|\/embed\/|\.be\/)([a-zA-Z0-9_-]{11})/);
            if (match && match[1]) setVideoId(match[1]);
          }
        }
      } catch (error) {
        console.error("Video ID çekilemedi:", error);
      }
    };

    fetchStatsAndProperties();
    fetchVideoId();
  }, []);

  // YouTube video admin panelinden değiştirilebilsin
  const handleVideoChange = async (e: React.FormEvent) => {
  e.preventDefault();
  let newVideoId = videoInput;
  if (videoInput.includes("youtube")) {
    const match = videoInput.match(/(?:v=|\/embed\/|\.be\/)([a-zA-Z0-9_-]{11})/);
    if (match && match[1]) newVideoId = match[1];
  }
  // Get token from localStorage or your auth context/provider
  const token = typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";
  await updateYoutubeVideoId(newVideoId, token);
  setVideoId(newVideoId);
  setVideoInput("");
};

  const StatCard = ({ title, value, icon: Icon, color, change }: any) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change && (
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">+{change}%</span>
              <span className="text-sm text-gray-500 ml-1">bu ay</span>
            </div>
          )}
        </div>
        <div className={`h-12 w-12 rounded-lg ${color} flex items-center justify-center`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Emlak sisteminin genel durumu</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Toplam İlan"
            value={stats.totalProperties}
            icon={Building2}
            color="bg-gradient-to-br from-blue-500 to-blue-600"
            change={stats.propertiesChange || undefined}
          />
          <StatCard
            title="Danışman Sayısı"
            value={stats.totalConsultants}
            icon={Users}
            color="bg-gradient-to-br from-green-500 to-green-600"
            change={stats.consultantsChange || undefined}
          />
          <StatCard
            title="Bekleyen Yorum"
            value={stats.pendingComments}
            icon={MessageSquare}
            color="bg-gradient-to-br from-orange-500 to-orange-600"
          />
          <StatCard
            title="Aylık Gelir"
            value={`₺${stats.monthlyRevenue?.toLocaleString?.() ?? 0}`}
            icon={DollarSign}
            color="bg-gradient-to-br from-purple-500 to-purple-600"
            change={stats.revenueChange || undefined}
          />
        </div>

        {/* Youtube Video Yönetimi */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row md:items-center gap-8">
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Tanıtım Videosu</h2>
            <form className="flex gap-4 mb-4" onSubmit={handleVideoChange}>
              <input
                type="text"
                placeholder="YouTube video linki veya ID girin"
                className="border px-3 py-2 rounded-lg w-full"
                value={videoInput}
                onChange={e => setVideoInput(e.target.value)}
              />
              <button
                type="submit"
                className="bg-orange-500 text-white rounded-lg px-5 font-semibold hover:bg-orange-600 transition"
              >
                Güncelle
              </button>
            </form>
            <p className="text-gray-500 text-sm">YouTube video ID veya tam link girerek değiştirebilirsiniz.</p>
          </div>
          <div className="flex-1">
            {videoId && (
              <div className="relative h-52 md:h-64 rounded-2xl overflow-hidden shadow-xl">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${videoId}`}
                  title="Villa Tanıtım Videosu"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                ></iframe>
              </div>
            )}
          </div>
        </div>

        {/* Recent Properties Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Son Eklenen İlanlar</h2>
              <a href="/admin/dashboard/admin/properties" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Tümünü Gör
              </a>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İlan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fiyat
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Konum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Danışman
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Görüntüleme
                  </th>
                </tr>
              </thead>
  <tbody className="bg-white divide-y divide-gray-200">
  {recentProperties?.map((property: any) => (
    <tr key={property.id ?? property._id} className="hover:bg-gray-50 transition-colors duration-150">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">{property.title}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          ₺{property.price?.toLocaleString?.() ?? property.price}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center text-sm text-gray-500">
          <MapPin className="h-4 w-4 mr-1" />
          {property.address ||
           property.district ||
           property.city ||
           (typeof property.location === "string" ? property.location : "")}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          {property.consultant?.name ||
           property.consultantName ||
           property.agent?.name ||
           "Bilinmiyor"}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          property.status === 'active' 
            ? 'bg-green-100 text-green-800' 
            : property.status === 'pending'
            ? 'bg-yellow-100 text-yellow-800'
            : property.status === 'rejected'
            ? 'bg-red-100 text-red-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {property.status === "active" ? "Aktif" 
           : property.status === "rejected" ? "Reddedildi"
           : property.status === "pending" ? "Beklemede"
           : property.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center text-sm text-gray-500">
          <Eye className="h-4 w-4 mr-1" />
          {property.views}
        </div>
      </td>
    </tr>
  ))}
</tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <Building2 className="h-8 w-8 mb-3" />
            <h3 className="text-lg font-semibold mb-2">İlan Yönetimi</h3>
            <p className="text-blue-100 text-sm mb-4">Tüm ilanları görüntüle ve yönet</p>
            <a 
              href="/admin/dashboard/admin/properties"
              className="inline-block bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors"
            >
              İlanlara Git
            </a>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
            <Users className="h-8 w-8 mb-3" />
            <h3 className="text-lg font-semibold mb-2">Danışman Yönetimi</h3>
            <p className="text-green-100 text-sm mb-4">Danışmanları yönet ve yeni ekle</p>
            <a 
              href="/admin/dashboard/admin/consultants"
              className="inline-block bg-white text-green-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-50 transition-colors"
            >
              Danışmanlar
            </a>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
            <MessageSquare className="h-8 w-8 mb-3" />
            <h3 className="text-lg font-semibold mb-2">Yorum Yönetimi</h3>
            <p className="text-orange-100 text-sm mb-4">Kullanıcı yorumlarını incele</p>
            <a 
              href="/admin/dashboard/admin/comments"
              className="inline-block bg-white text-orange-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-50 transition-colors"
            >
              Yorumlar
            </a>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}