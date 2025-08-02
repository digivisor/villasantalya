'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

type ToastProps = {
  title?: string;
  message?: string;
  description?: string;
  type: 'success' | 'error' | 'warning' | 'info';
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
  variant?: string;
};

export default function Toast({
  title,
  message,
  description,
  type,
  isVisible,
  onClose,
  duration = 3000,
  variant,
}: ToastProps) {
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isVisible) {
      timer = setTimeout(() => {
        onClose();
      }, duration);
    }
    
    return () => {
      clearTimeout(timer);
    };
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return {
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          icon: <CheckCircle className="h-5 w-5 text-green-500" />,
        };
      case 'error':
        return {
          bgColor: variant === 'destructive' ? 'bg-red-600' : 'bg-red-100',
          textColor: variant === 'destructive' ? 'text-white' : 'text-red-800',
          icon: <XCircle className={`h-5 w-5 ${variant === 'destructive' ? 'text-white' : 'text-red-500'}`} />,
        };
      case 'warning':
        return {
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-800',
          icon: <XCircle className="h-5 w-5 text-yellow-500" />,
        };
      case 'info':
        return {
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-800',
          icon: <CheckCircle className="h-5 w-5 text-blue-500" />,
        };
      default:
        return {
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          icon: <CheckCircle className="h-5 w-5 text-gray-500" />,
        };
    }
  };

  const { bgColor, textColor, icon } = getToastStyles();
  
  // Mesaj önceliğini belirle (message veya description)
  const displayMessage = message || description || '';

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
      <div className={`${bgColor} ${textColor} px-4 py-3 rounded-lg shadow-lg flex items-center max-w-md`}>
        <div className="mr-3 flex-shrink-0">
          {icon}
        </div>
        <div>
          {title && <div className="font-medium">{title}</div>}
          <div className={title ? "text-sm opacity-90" : ""}>{displayMessage}</div>
        </div>
        <button
          className="ml-auto focus:outline-none"
          onClick={onClose}
          aria-label="Kapat"
        >
          <X className="h-4 w-4 text-current opacity-60 hover:opacity-100" />
        </button>
      </div>
    </div>
  );
}