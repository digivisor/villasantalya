'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import { Save, Database, Clock } from 'lucide-react';

// Import only the needed services
import {
  getSocialLinks, updateSocialLinks,
  getYoutubeVideoId, updateYoutubeVideoId,
  getContactInfo, updateContactInfo,
  getWorkingHours, updateWorkingHours,
  type WorkingHours 
} from '../../../../services/settings.service';

export default function SettingsPage() {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";
  const [activeTab, setActiveTab] = useState('contact');
  const [isLoading, setIsLoading] = useState(false);

  // Contact Info State
  const [contactInfo, setContactInfo] = useState({
    address: '',
    phone: '',
    email: ''
  });

  const [workingHours, setWorkingHours] = useState<WorkingHours>({
  weekday: { start: '09:00', end: '18:00' },
  saturday: { start: '10:00', end: '14:00' },
  sunday: { isOpen: false, start: '00:00', end: '00:00' }
});

  // Social Media State
  const [socialLinks, setSocialLinks] = useState({
    instagram: '',
    twitter: '',
    facebook: '',
    youtube: '',
    linkedin: ''
  });

  // Youtube Video State
  const [videoId, setVideoId] = useState("");
  const [videoInput, setVideoInput] = useState("");

  // Fetch data
  useEffect(() => {
    if (!token) return;
    getSocialLinks(token).then(res => setSocialLinks(res));
    getYoutubeVideoId(token).then(res => setVideoId(res.videoId || ""));
    getContactInfo(token).then(res => setContactInfo(res)); // New service call
      getWorkingHours(token).then(res => setWorkingHours(res)); // Çalışma saatlerini çek

  }, [token]);

  const handleWorkingHoursSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  try {
    await updateWorkingHours(workingHours, token);
    alert('Çalışma saatleri güncellendi!');
  } catch (error) {
    console.error('Güncelleme hatası:', error);
    alert('Çalışma saatleri güncellenirken bir hata oluştu!');
  }
  setIsLoading(false);
};

  // Contact info update
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await updateContactInfo(contactInfo, token);
    setIsLoading(false);
    alert('İletişim bilgileri güncellendi!');
  };

  // Social media update
  const handleSocialLinksSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await updateSocialLinks(socialLinks, token);
    setIsLoading(false);
    alert('Sosyal medya ayarları güncellendi!');
  };

  // Youtube update
  const handleYoutubeChange = async (e: React.FormEvent) => {
    e.preventDefault();
    let newVideoId = videoInput;
    if (videoInput.includes("youtube")) {
      const match = videoInput.match(/(?:v=|\/embed\/|\.be\/)([a-zA-Z0-9_-]{11})/);
      if (match && match[1]) newVideoId = match[1];
    }
    await updateYoutubeVideoId(newVideoId, token);
    setVideoInput("");
    getYoutubeVideoId(token).then(res => setVideoId(res.videoId || ""));
  };

const tabs = [
  { id: 'contact', label: 'İletişim Bilgileri', icon: Database },
  { id: 'social', label: 'Sosyal Medya', icon: Database },
  { id: 'youtube', label: 'YouTube Video', icon: Database },
  { id: 'hours', label: 'Çalışma Saatleri', icon: Clock } // Yeni tab
];

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ayarlar</h1>
          <p className="text-gray-600 mt-1">İletişim ve sosyal medya ayarlarınızı yönetin</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              {/* Contact Info */}
              {activeTab === 'contact' && (
                <form onSubmit={handleContactSubmit} className="p-6 space-y-6">
                  <div className="flex items-center space-x-2 mb-6">
                    <Database className="h-5 w-5 text-blue-600" />
                    <h2 className="text-lg font-semibold text-gray-900">İletişim Bilgileri</h2>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Adres</label>
                      <textarea
                        value={contactInfo.address}
                        onChange={e => setContactInfo(prev => ({ ...prev, address: e.target.value }))}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
                      <input
                        type="tel"
                        value={contactInfo.phone}
                        onChange={e => setContactInfo(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">E-posta</label>
                      <input
                        type="email"
                        value={contactInfo.email}
                        onChange={e => setContactInfo(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button type="submit" disabled={isLoading}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50">
                      {isLoading ? 
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Güncelleniyor...
                        </> : 
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Kaydet
                        </>
                      }
                    </button>
                  </div>
                </form>
              )}

              {/* Social Media Settings */}
              {activeTab === 'social' && (
                <form onSubmit={handleSocialLinksSubmit} className="p-6 space-y-6">
                  <div className="flex items-center space-x-2 mb-6">
                    <Database className="h-5 w-5 text-blue-600" />
                    <h2 className="text-lg font-semibold text-gray-900">Sosyal Medya Ayarları</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {['instagram','twitter','facebook','youtube','linkedin'].map(key => (
                      <div key={key}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {key.charAt(0).toUpperCase()+key.slice(1)}
                        </label>
                        <input
                          type="text"
                          value={socialLinks[key as keyof typeof socialLinks]}
                          onChange={e => setSocialLinks(prev => ({ 
                            ...prev, 
                            [key as keyof typeof socialLinks]: e.target.value 
                          }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end">
                    <button type="submit" disabled={isLoading}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50">
                      {isLoading ? 
                        <>Kaydediliyor...</> : 
                        <><Save className="h-4 w-4 mr-2" /> Kaydet</>
                      }
                    </button>
                  </div>
                </form>
              )}

              {/* Youtube Video Setting */}
              {activeTab === 'youtube' && (
                <form onSubmit={handleYoutubeChange} className="p-6 space-y-6">
                  <div className="flex items-center space-x-2 mb-6">
                    <Database className="h-5 w-5 text-blue-600" />
                    <h2 className="text-lg font-semibold text-gray-900">Youtube Video Ayarı</h2>
                  </div>
                  <div className="flex flex-col md:flex-row gap-4 items-center">
                    <input
                      type="text"
                      value={videoInput}
                      onChange={e => setVideoInput(e.target.value)}
                      placeholder="YouTube video linki veya ID girin"
                      className="border px-3 py-2 rounded-lg w-full md:w-2/3"
                    />
                    <button type="submit" className="bg-orange-500 text-white rounded-lg px-5 py-2 font-semibold hover:bg-orange-600 transition">
                      Güncelle
                    </button>
                  </div>
                  {videoId && (
                    <div className="relative h-52 md:h-64 rounded-2xl overflow-hidden shadow-xl mt-4">
                      <iframe
                        src={`https://www.youtube-nocookie.com/embed/${videoId}`}
                        title="Tanıtım Videosu"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute inset-0 w-full h-full"
                      ></iframe>
                    </div>
                  )}
                </form>
              )}
              {activeTab === 'hours' && (
  <form onSubmit={handleWorkingHoursSubmit} className="p-6 space-y-6">
    <div className="flex items-center space-x-2 mb-6">
      <Clock className="h-5 w-5 text-blue-600" />
      <h2 className="text-lg font-semibold text-gray-900">Çalışma Saatleri</h2>
    </div>
    
    <div className="space-y-6">
      {/* Hafta İçi */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Hafta İçi (Pazartesi - Cuma)</label>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Açılış:</span>
            <input
              type="time"
              value={workingHours.weekday.start}
              onChange={e => setWorkingHours(prev => ({
                ...prev,
                weekday: { ...prev.weekday, start: e.target.value }
              }))}
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Kapanış:</span>
            <input
              type="time"
              value={workingHours.weekday.end}
              onChange={e => setWorkingHours(prev => ({
                ...prev,
                weekday: { ...prev.weekday, end: e.target.value }
              }))}
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Cumartesi */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Cumartesi</label>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Açılış:</span>
            <input
              type="time"
              value={workingHours.saturday.start}
              onChange={e => setWorkingHours(prev => ({
                ...prev,
                saturday: { ...prev.saturday, start: e.target.value }
              }))}
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Kapanış:</span>
            <input
              type="time"
              value={workingHours.saturday.end}
              onChange={e => setWorkingHours(prev => ({
                ...prev,
                saturday: { ...prev.saturday, end: e.target.value }
              }))}
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Pazar */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="sundayOpen"
            checked={workingHours.sunday.isOpen}
            onChange={e => setWorkingHours(prev => ({
              ...prev,
              sunday: { ...prev.sunday, isOpen: e.target.checked }
            }))}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="sundayOpen" className="text-sm font-medium text-gray-700">
            Pazar Günü Açık
          </label>
        </div>

        {workingHours.sunday.isOpen && (
          <div className="flex items-center space-x-4 ml-6">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Açılış:</span>
              <input
                type="time"
                value={workingHours.sunday.start}
                onChange={e => setWorkingHours(prev => ({
                  ...prev,
                  sunday: { ...prev.sunday, start: e.target.value }
                }))}
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Kapanış:</span>
              <input
                type="time"
                value={workingHours.sunday.end}
                onChange={e => setWorkingHours(prev => ({
                  ...prev,
                  sunday: { ...prev.sunday, end: e.target.value }
                }))}
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        )}
      </div>
    </div>

    <div className="flex justify-end">
      <button
        type="submit"
        disabled={isLoading}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50"
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Güncelleniyor...
          </>
        ) : (
          <>
            <Save className="h-4 w-4 mr-2" />
            Kaydet
          </>
        )}
      </button>
    </div>
  </form>
)}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}