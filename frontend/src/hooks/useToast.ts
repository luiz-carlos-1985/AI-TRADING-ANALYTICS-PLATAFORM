'use client';

import { toast } from 'react-hot-toast';

export const useToast = () => {
  const showSuccess = (message: string) => {
    toast.success(message, {
      duration: 3000,
      style: {
        background: '#1e293b',
        color: '#f8fafc',
        border: '1px solid #22c55e',
      },
    });
  };

  const showError = (message: string) => {
    toast.error(message, {
      duration: 4000,
      style: {
        background: '#1e293b',
        color: '#f8fafc',
        border: '1px solid #ef4444',
      },
    });
  };

  const showInfo = (message: string) => {
    toast(message, {
      duration: 3000,
      icon: '💡',
      style: {
        background: '#1e293b',
        color: '#f8fafc',
        border: '1px solid #3b82f6',
      },
    });
  };

  return { showSuccess, showError, showInfo };
};