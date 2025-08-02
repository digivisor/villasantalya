'use client';

import { useState } from 'react';
import { XCircle } from 'lucide-react';
import Modal from '../ui/Modal';
import { PendingProperty } from '../../types/property';

type PropertyRejectModalProps = {
  property: PendingProperty | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
};

export default function PropertyRejectModal({
  property,
  isOpen,
  onClose,
  onConfirm
}: PropertyRejectModalProps) {
  const [rejectReason, setRejectReason] = useState('');
  const [errors, setErrors] = useState({ reason: '' });

  if (!property) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!rejectReason.trim()) {
      setErrors({ reason: 'Lütfen bir red nedeni belirtin' });
      return;
    }
    
    onConfirm(rejectReason);
    setRejectReason('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="İlan Reddi" size="md">
      <form onSubmit={handleSubmit}>
        <div className="text-center space-y-4 mb-6">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
          
          <h3 className="text-lg font-medium text-gray-900">İlanı reddetmek istediğinize emin misiniz?</h3>
          
          <p className="text-sm text-gray-500">
            <span className="font-semibold">{property.title}</span> başlıklı ilan reddedilecek ve danışmana bildirilecektir.
          </p>
        </div>

        <div className="mb-6">
          <label htmlFor="rejectReason" className="block text-sm font-medium text-gray-700 mb-1">
            Red Nedeni
          </label>
          <textarea
            id="rejectReason"
            rows={4}
            value={rejectReason}
            onChange={(e) => {
              setRejectReason(e.target.value);
              if (e.target.value.trim()) {
                setErrors({ reason: '' });
              }
            }}
            placeholder="İlanın neden reddedildiğini açıklayın..."
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 ${
              errors.reason ? 'border-red-500' : 'border-gray-300'
            }`}
          ></textarea>
          {errors.reason && <p className="mt-1 text-sm text-red-600">{errors.reason}</p>}
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors"
          >
            İptal
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Reddet
          </button>
        </div>
      </form>
    </Modal>
  );
}