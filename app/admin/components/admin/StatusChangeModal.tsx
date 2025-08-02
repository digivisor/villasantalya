'use client';

import Modal from '../ui/Modal';
import { CheckCircle, XCircle } from 'lucide-react';

type StatusChangeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  status: boolean;
};

export default function StatusChangeModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  status
}: StatusChangeModalProps) {
  const Icon = status ? CheckCircle : XCircle;
  const iconColor = status ? 'text-green-600' : 'text-gray-600';
  const bgColor = status ? 'bg-green-100' : 'bg-gray-100';
  const buttonColor = status ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="text-center space-y-4">
        <div className={`mx-auto flex items-center justify-center h-16 w-16 rounded-full ${bgColor}`}>
          <Icon className={`h-8 w-8 ${iconColor}`} />
        </div>
        
        <h3 className="text-lg font-medium text-gray-900">{message}</h3>
      </div>

      <div className="mt-6 flex justify-center space-x-4">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors"
        >
          İptal
        </button>
        <button
          onClick={onConfirm}
          className={`px-4 py-2 ${buttonColor} text-white rounded-lg transition-colors`}
        >
          Evet, Onayla
        </button>
      </div>
    </Modal>
  );
}