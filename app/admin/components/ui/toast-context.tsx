'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';
import Toast from './toast';

type ToastType = 'success' | 'error' | 'warning' | 'info';

type ToastData = {
  id: string;
  title?: string;
  message?: string;
  description?: string;
  type: ToastType;
  duration?: number;
  variant?: string;
};

interface ToastOptions {
  title?: string;
  description?: string;
  message?: string;
  variant?: string;
}

interface ToastContextProps {
  showToast: (type: ToastType, options: ToastOptions, duration?: number) => void;
  toast: (options: ToastOptions & { variant?: string }) => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const showToast = (type: ToastType, options: ToastOptions, duration: number = 3000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prevToasts) => [
      ...prevToasts, 
      { 
        id, 
        type, 
        title: options.title, 
        message: options.message, 
        description: options.description,
        variant: options.variant,
        duration 
      }
    ]);
  };

  // Shadcn UI toast compatibility
  const toast = (options: ToastOptions & { variant?: string }) => {
    const type = options.variant === 'destructive' ? 'error' : 'success';
    showToast(type, options);
  };

  const closeToast = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast, toast }}>
      {children}
      <div className="toast-container">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            title={toast.title}
            message={toast.message}
            description={toast.description}
            type={toast.type}
            isVisible={true}
            onClose={() => closeToast(toast.id)}
            duration={toast.duration}
            variant={toast.variant}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
} 