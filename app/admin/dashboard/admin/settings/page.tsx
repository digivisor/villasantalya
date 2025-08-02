'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import { 
  Settings, 
  User, 
  Lock, 
  Bell, 
  Globe, 
  Database,
  Shield,
  Mail,
  Phone,
  Save,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    avatar: null
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNewProperty: true,
    emailNewComment: true,
    emailSystemUpdates: false,
    pushNewProperty: true,
    pushNewComment: false,
    pushSystemUpdates: true
  });

  const [systemSettings, setSystemSettings] = useState({
    siteName: 'Emlak Portal',
    siteDescription: 'Profesyonel emlak yönetim sistemi',
    contactEmail: 'info@emlak.com',
    contactPhone: '+90 212 123 4567',
    maxFileSize: '10',
    allowedFileTypes: 'jpg,jpeg,png,pdf',
    maintenanceMode: false,
    userRegistration: true
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        bio: user.bio || '',
        avatar: user.avatar || null
      });
    }
  }, [user]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    alert('Profil bilgileri güncellendi!');
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Yeni şifreler eşleşmiyor!');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      alert('Şifre en az 6 karakter olmalıdır!');
      return;
    }

    setIsLoading(true);
    
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setIsLoading(false);
    alert('Şifre başarıyla güncellendi!');
  };

  const handleNotificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsLoading(false);
    alert('Bildirim ayarları güncellendi!');
  };

  const handleSystemSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    alert('Sistem ayarları güncellendi!');
  };

  const tabs = [
    { id: 'profile', label: 'Profil Bilgileri', icon: User, roles: ['admin', 'consultant'] },
    { id: 'password', label: 'Şifre Değiştir', icon: Lock, roles: ['admin', 'consultant'] },
    { id: 'notifications', label: 'Bildirimler', icon: Bell, roles: ['admin', 'consultant'] },
    { id: 'system', label: 'Sistem Ayarları', icon: Database, roles: ['admin'] },
    { id: 'security', label: 'Güvenlik', icon: Shield, roles: ['admin'] }
  ];

  const filteredTabs = tabs.filter(tab => 
    tab.roles.includes(user?.role || 'consultant')
  );

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ayarlar</h1>
          <p className="text-gray-600 mt-1">Hesap ve sistem ayarlarınızı yönetin</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <nav className="space-y-2">
                {filteredTabs.map((tab) => {
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
              {/* Profile Settings */}
              {activeTab === 'profile' && (
                <form onSubmit={handleProfileSubmit} className="p-6 space-y-6">
                  <div className="flex items-center space-x-2 mb-6">
                    <User className="h-5 w-5 text-blue-600" />
                    <h2 className="text-lg font-semibold text-gray-900">Profil Bilgileri</h2>
                  </div>

                  {/* Avatar */}
                  <div className="flex items-center space-x-6">
                    <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                      <span className="text-2xl font-semibold text-white">
                        {profileData.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <button
                        type="button"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                      >
                        Fotoğraf Değiştir
                      </button>
                      <p className="text-sm text-gray-500 mt-1">JPG, PNG formatında maksimum 5MB</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ad Soyad *</label>
                      <input
                        type="text"
                        required
                        value={profileData.name}
                        onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">E-posta *</label>
                      <input
                        type="email"
                        required
                        value={profileData.email}
                        onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Biyografi</label>
                      <textarea
                        value={profileData.bio}
                        onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        placeholder="Kendiniz hakkında kısa bilgi..."
                      />
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

              {/* Password Settings */}
              {activeTab === 'password' && (
                <form onSubmit={handlePasswordSubmit} className="p-6 space-y-6">
                  <div className="flex items-center space-x-2 mb-6">
                    <Lock className="h-5 w-5 text-blue-600" />
                    <h2 className="text-lg font-semibold text-gray-900">Şifre Değiştir</h2>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Mevcut Şifre *</label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? 'text' : 'password'}
                          required
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                          className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Yeni Şifre *</label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          required
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                          className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Yeni Şifre (Tekrar) *</label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          required
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Güvenli Şifre İpuçları:</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• En az 8 karakter uzunluğunda olmalı</li>
                      <li>• Büyük ve küçük harf içermeli</li>
                      <li>• En az bir rakam içermeli</li>
                      <li>• Özel karakter (!@#$%^&*) içermeli</li>
                    </ul>
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
                          Şifreyi Güncelle
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* Notification Settings */}
              {activeTab === 'notifications' && (
                <form onSubmit={handleNotificationSubmit} className="p-6 space-y-6">
                  <div className="flex items-center space-x-2 mb-6">
                    <Bell className="h-5 w-5 text-blue-600" />
                    <h2 className="text-lg font-semibold text-gray-900">Bildirim Ayarları</h2>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-base font-medium text-gray-900 mb-4">E-posta Bildirimleri</h3>
                      <div className="space-y-3">
                        {[
                          { key: 'emailNewProperty', label: 'Yeni ilan eklendiğinde' },
                          { key: 'emailNewComment', label: 'Yeni yorum eklendiğinde' },
                          { key: 'emailSystemUpdates', label: 'Sistem güncellemeleri' }
                        ].map(item => (
                          <label key={item.key} className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">{item.label}</span>
                            <input
                              type="checkbox"
                              checked={notificationSettings[item.key as keyof typeof notificationSettings]}
                              onChange={(e) => setNotificationSettings(prev => ({
                                ...prev,
                                [item.key]: e.target.checked
                              }))}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-base font-medium text-gray-900 mb-4">Push Bildirimleri</h3>
                      <div className="space-y-3">
                        {[
                          { key: 'pushNewProperty', label: 'Yeni ilan eklendiğinde' },
                          { key: 'pushNewComment', label: 'Yeni yorum eklendiğinde' },
                          { key: 'pushSystemUpdates', label: 'Sistem güncellemeleri' }
                        ].map(item => (
                          <label key={item.key} className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">{item.label}</span>
                            <input
                              type="checkbox"
                              checked={notificationSettings[item.key as keyof typeof notificationSettings]}
                              onChange={(e) => setNotificationSettings(prev => ({
                                ...prev,
                                [item.key]: e.target.checked
                              }))}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                          </label>
                        ))}
                      </div>
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

              {/* System Settings - Admin Only */}
              {activeTab === 'system' && user?.role === 'admin' && (
                <form onSubmit={handleSystemSubmit} className="p-6 space-y-6">
                  <div className="flex items-center space-x-2 mb-6">
                    <Database className="h-5 w-5 text-blue-600" />
                    <h2 className="text-lg font-semibold text-gray-900">Sistem Ayarları</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Site Adı</label>
                      <input
                        type="text"
                        value={systemSettings.siteName}
                        onChange={(e) => setSystemSettings(prev => ({ ...prev, siteName: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">İletişim E-postası</label>
                      <input
                        type="email"
                        value={systemSettings.contactEmail}
                        onChange={(e) => setSystemSettings(prev => ({ ...prev, contactEmail: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">İletişim Telefonu</label>
                      <input
                        type="tel"
                        value={systemSettings.contactPhone}
                        onChange={(e) => setSystemSettings(prev => ({ ...prev, contactPhone: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Max Dosya Boyutu (MB)</label>
                      <input
                        type="number"
                        value={systemSettings.maxFileSize}
                        onChange={(e) => setSystemSettings(prev => ({ ...prev, maxFileSize: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Site Açıklaması</label>
                      <textarea
                        value={systemSettings.siteDescription}
                        onChange={(e) => setSystemSettings(prev => ({ ...prev, siteDescription: e.target.value }))}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-base font-medium text-gray-900">Sistem Durumu</h3>
                    <div className="space-y-3">
                      {[
                        { key: 'maintenanceMode', label: 'Bakım Modu', description: 'Site bakım moduna alınır' },
                        { key: 'userRegistration', label: 'Kullanıcı Kaydı', description: 'Yeni kullanıcı kaydına izin ver' }
                      ].map(item => (
                        <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <label className="text-sm font-medium text-gray-900">{item.label}</label>
                            <p className="text-sm text-gray-500">{item.description}</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={systemSettings[item.key as keyof typeof systemSettings] as boolean}
                            onChange={(e) => setSystemSettings(prev => ({
                              ...prev,
                              [item.key]: e.target.checked
                            }))}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </div>
                      ))}
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

              {/* Security Settings - Admin Only */}
              {activeTab === 'security' && user?.role === 'admin' && (
                <div className="p-6 space-y-6">
                  <div className="flex items-center space-x-2 mb-6">
                    <Shield className="h-5 w-5 text-blue-600" />
                    <h2 className="text-lg font-semibold text-gray-900">Güvenlik Ayarları</h2>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <h3 className="text-lg font-medium text-yellow-800 mb-2">Sistem Güvenliği</h3>
                      <p className="text-yellow-700 text-sm mb-4">
                        Bu bölüm geliştirme aşamasındadır. Güvenlik ayarları yakında eklenecektir.
                      </p>
                      <ul className="text-sm text-yellow-700 space-y-2">
                        <li>• İki faktörlü doğrulama</li>
                        <li>• IP beyaz listesi</li>
                        <li>• Güvenlik logları</li>
                        <li>• Otomatik yedekleme</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}