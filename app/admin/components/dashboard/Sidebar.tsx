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
import propertyService from '../../../services/property.service'; // ekle
import { getAllCommentsWithProperty } from '../../../services/comment.service';
import { getAllContactMessages } from '../../../services/contact.service';

interface NavItem {
  label: string;
  href: string;
  icon: any;
  adminOnly?: boolean;
  consultantOnly?: boolean;
}

export default function Sidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Badge state'leri
  const [pendingPropertiesCount, setPendingPropertiesCount] = useState<number>(0);
  const [pendingMessagesCount, setPendingMessagesCount] = useState<number>(0);

  // Bekleyen ilanları ve mesajları çek
  useEffect(() => {
    // Bekleyen ilanlar
    const fetchPendingProperties = async () => {
      try {
        const data = await propertyService.getPendingProperties();
        setPendingPropertiesCount(data?.properties?.length || 0);
      } catch (e) {
        setPendingPropertiesCount(0);
      }
    };

    // Bekleyen mesajlar (comments + contact)
    const fetchPendingMessages = async () => {
      try {
        let unreadComments = 0;
        let unreadContacts = 0;
        // Comments
        try {
          const comments = await getAllCommentsWithProperty();
          const arr = Array.isArray(comments) ? comments : (comments.comments || []);
          unreadComments = arr.filter((c: any) => c.status !== 'read').length;
        } catch {}
        // Contacts
        try {
          const contacts = await getAllContactMessages();
          unreadContacts = Array.isArray(contacts)
            ? contacts.filter((m: any) => m.status !== 'read').length
            : 0;
        } catch {}
        setPendingMessagesCount(unreadComments + unreadContacts);
      } catch (e) {
        setPendingMessagesCount(0);
      }
    };

    fetchPendingProperties();
    fetchPendingMessages();
  }, []);

  if (!user) return null;

  const dashboardUrl = user.isAdmin 
    ? '/admin/dashboard/admin' 
    : '/admin/dashboard/consultant';

  // Tüm menü öğeleri
  const navItems: NavItem[] = [
    {
      label: 'Dashboard',
      href: dashboardUrl,
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
      label: 'İlan Mesajları',
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
  };

  const filteredNavItems = navItems.filter(item => {
    if (item.adminOnly && !user.isAdmin) return false;
    if (item.consultantOnly && user.isAdmin) return false;
    return true;
  });

  const handleNavItemClick = (href: string, e: React.MouseEvent) => {
    if (href === dashboardUrl) {
      e.preventDefault();
      router.push(dashboardUrl);
    }
  };

  // Badge bileşeni
  const Badge = ({ count }: { count: number }) => (
    <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold rounded-full bg-orange-500 text-white min-w-[20px] h-5">
      {count}
    </span>
  );

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
              const isActive = pathname === item.href || 
                (pathname.startsWith('/admin/dashboard/admin') && item.href === dashboardUrl && user.isAdmin) ||
                (pathname.startsWith('/admin/dashboard/consultant') && item.href === dashboardUrl && !user.isAdmin);

              // Badge ekleme
              let badge = null;
              if (item.label === 'İlan Mesajları') {
                badge = <Badge count={pendingMessagesCount} />;
              }
              if (item.label === 'Onay Bekleyen İlanlar') {
              badge = <Badge count={pendingPropertiesCount} />;
              }

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
                  {!isCollapsed && (
                    <>
                      <span>{item.label}</span>
                      {badge}
                    </>
                  )}
                </Link>
              );
            })}
          </nav>

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