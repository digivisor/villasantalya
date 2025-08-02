'use client';

import { CheckCircle } from 'lucide-react';
import Modal from '../ui/Modal';
import { PendingProperty } from '../../types/property';

type PropertyApprovalModalProps = {
  property: PendingProperty | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function PropertyApprovalModal({
  property,
  isOpen,
  onClose,
  onConfirm
}: PropertyApprovalModalProps) {
  if (!property) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="İlan Onayı" size="sm">
      <div className="text-center space-y-4">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        
        <h3 className="text-lg font-medium text-gray-900">İlanı onaylamak istediğinize emin misiniz?</h3>
        
        <p className="text-sm text-gray-500">
          <span className="font-semibold">{property.title}</span> başlıklı ilan onaylandıktan sonra sitede yayınlanacaktır.
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
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
        >
          Evet, Onayla
        </button>
      </div>
    </Modal>
  );
}