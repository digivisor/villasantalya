// app/components/admin/PropertyRejectModal.tsx

import { useState } from 'react';
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Property, PendingProperty } from '../../types/property';

interface PropertyRejectModalProps {
  property: Property | PendingProperty | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

export default function PropertyRejectModal({ property, isOpen, onClose, onConfirm }: PropertyRejectModalProps) {
  const [reason, setReason] = useState('');

  if (!isOpen || !property) return null;

  const handleSubmit = () => {
    onConfirm(reason);
    setReason('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>İlan Reddetme</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <p className="text-gray-700">
            <strong>{property.title}</strong> başlıklı ilanı reddetmek istediğinize emin misiniz?
          </p>
          <p className="text-sm text-gray-500 mt-2 mb-4">
            Reddetme nedeninizi belirtirseniz, danışmana geri bildirimde bulunabilirsiniz.
          </p>

          <Textarea
            placeholder="Reddetme nedeni (opsiyonel)"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full"
            rows={3}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            İptal
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="destructive"
            className="bg-red-600 hover:bg-red-700"
          >
            Reddet
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}