'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Home, 
  Building2, 
  Users, 
  MessageSquare, 
  Plus, 
  LogOut,
  Menu,
  X,
  Settings,
  BarChart3,
  FileText,
  PlaneLanding,
  LucideTableProperties,
  Check,
  BookOpen,
  User2,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
  icon: any;
  adminOnly?: boolean; // sadece admin için
  consultantOnly?: boolean; // sadece danışman için
}

export default function Sidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Debug için
  useEffect(() => {
    if (user) {
      console.log('Sidebar user data:', user);
      console.log('isAdmin value:', user.isAdmin);
    }
  }, [user]);

  if (!user) return null;

  // Admin/danışman durumuna göre dashboard URL'sini belirle
  const dashboardUrl = user.isAdmin 
    ? '/admin/dashboard/admin' 
    : '/admin/dashboard/consultant';

  // Tüm menü öğeleri
  const navItems: NavItem[] = [
    {
      label: 'Dashboard',
      href: dashboardUrl, // Dinamik olarak belirlenen URL
      icon: Home
    },
    {
      label: 'Tüm İlanlar',
      href: '/admin/dashboard/admin/properties',
      icon: Building2,
      adminOnly: true
    },
    {
      label: 'Danışmanlar',
      href: '/admin/dashboard/admin/consultants',
      icon: Users,
      adminOnly: true
    },
    {
      label: 'Yorumlar',
      href: '/admin/dashboard/admin/comments',
      icon: MessageSquare,
      adminOnly: true
    },
    {
      label: 'Blog Yazıları',
      href: '/admin/dashboard/admin/blogs',
      icon: BookOpen,
      adminOnly: true
    },
    {
      label: 'Onay Bekleyen İlanlar',
      href: '/admin/dashboard/admin/pending-properties',
      icon: Check,
      adminOnly: true
    },
    {
      label: 'İlanlarım',
      href: '/admin/dashboard/consultant/my-properties',
      icon: FileText,
      consultantOnly: true
    },
    {
      label: 'İlan Ekle',
      href: '/admin/dashboard/admin/add-property',
      icon: Plus,
      consultantOnly: true
    },
    {
      label: 'Profil',
      href: '/admin/dashboard/consultant/profile',
      icon: User2,
      consultantOnly: true
    },
    {
      label: 'Ayarlar',
      href:  '/admin/dashboard/admin/settings' ,
      icon: Settings,
         adminOnly: true
    }
  ];
const getImageUrl = (imagePath: string) => {
  if (!imagePath.startsWith('http')) {
    return `https://api.villasantalya.com${imagePath}`;
  }
  return imagePath;
}
  // Kullanıcı rolüne göre filtreleme
  const filteredNavItems = navItems.filter(item => {
    // Sadece admin için öğeler
    if (item.adminOnly && !user.isAdmin) return false;
    // Sadece danışman için öğeler
    if (item.consultantOnly && user.isAdmin) return false;
    return true;
  });

  const handleNavItemClick = (href: string, e: React.MouseEvent) => {
    if (href === dashboardUrl) {
      e.preventDefault();
      console.log('Dashboard clicked, redirecting to:', dashboardUrl);
      router.push(dashboardUrl);
    }
  };

  return (
    <>
      <div className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-white border-r border-gray-200 transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}>
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200">
            {!isCollapsed && (
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-white" />
                </div>
                <span className="font-semibold text-gray-900">Emlak Panel</span>
              </div>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
            </button>
          </div>

          {/* User Info */}
          {!isCollapsed && (
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center">
                  {/* <span className="text-sm font-semibold text-white">
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </span> */}
                 <img
                        src={getImageUrl(user.image) || '/default-avatar.png'}
                        alt={`Kullanıcı Avatarı ${user.name || 'Kullanıcı'}`}
                        style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                      />

                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{user.name || 'Kullanıcı'}</p>
                  <p className="text-xs text-gray-500">
                    {user.isAdmin ? 'Admin' : 'Danışman'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-2">
            {filteredNavItems.map((item, index) => {
              const Icon = item.icon;
              // pathname değil href ile kontrol ediyoruz
              const isActive = pathname === item.href || 
                (pathname.startsWith('/admin/dashboard/admin') && item.href === dashboardUrl && user.isAdmin) ||
                (pathname.startsWith('/admin/dashboard/consultant') && item.href === dashboardUrl && !user.isAdmin);
              
              return (
                <Link
                  key={`${item.href}-${index}`}
                  href={item.href}
                  onClick={(e) => handleNavItemClick(item.href, e)}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive 
                      ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700" 
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                    isCollapsed && "justify-center px-2"
                  )}
                >
                  <Icon className={cn("h-5 w-5", isActive && "text-blue-700")} />
                  {!isCollapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>

          {/* Debug info - Development modunda göster */}
          {!isCollapsed && process.env.NODE_ENV === 'development' && (
            <div className="px-4 py-2 border-t border-gray-200 text-xs text-gray-500">
              <details>
                <summary className="cursor-pointer">Debug Info</summary>
                <div className="mt-2 p-2 bg-gray-50 rounded overflow-auto max-h-40">
                  <pre>{JSON.stringify({ isAdmin: user.isAdmin, pathname }, null, 2)}</pre>
                </div>
              </details>
            </div>
          )}

          {/* Logout */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={logout}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors w-full",
                isCollapsed && "justify-center px-2"
              )}
            >
              <LogOut className="h-5 w-5" />
              {!isCollapsed && <span>Çıkış Yap</span>}
            </button>
          </div>
        </div>
      </div>
      <div className={cn("transition-all duration-300", isCollapsed ? "ml-16" : "ml-64")} />
    </>
  );
}