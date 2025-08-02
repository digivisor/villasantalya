import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './components/ui/toast-context';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Emlak Admin Panel',
  description: 'Profesyonel emlak yönetim sistemi',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className={inter.className}>
          <ToastProvider>
        <AuthProvider>
        
            {children}
   </AuthProvider>
          </ToastProvider>
     

      </body>
    </html>
  );
}