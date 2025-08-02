'use client';

import { AlertTriangle } from 'lucide-react';
import Modal from '../ui/Modal';

type DeleteConfirmationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
};

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message
}: DeleteConfirmationModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="text-center space-y-4">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
          <AlertTriangle className="h-8 w-8 text-red-600" />
        </div>
        
        <h3 className="text-lg font-medium text-gray-900">Silmek istediğinize emin misiniz?</h3>
        
        <p className="text-sm text-gray-500">
          {message}
        </p>
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
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
        >
          Evet, Sil
        </button>
      </div>
    </Modal>
  );
}