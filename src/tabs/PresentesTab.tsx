import React, { useState } from 'react';
import { Gift, User } from '../../types';
import GiftCard from '../components/gifts/GiftCard';
import EmptyState from '../components/ui/EmptyState';
import EditGiftModal from '../components/modals/EditGiftModal';

interface PresentesTabProps {
  gifts: Gift[];
  currentUser: User | null;
  isAdmin: boolean;
  onReserve: (id: string) => void;
  onCancel: (id: string) => void;
  onRemove: (id: string) => void;
  onEdit: (id: string, data: any, uploadedImage: string | null) => void;
  onViewDetails: (id: string) => void;
}

const PresentesTab: React.FC<PresentesTabProps> = ({
  gifts,
  currentUser,
  isAdmin,
  onReserve,
  onCancel,
  onRemove,
  onEdit,
  onViewDetails,
}) => {
  const [editingGiftId, setEditingGiftId] = useState<string | null>(null);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {gifts.map(gift => (
          <GiftCard
            key={gift.id}
            gift={gift}
            onReserve={onReserve}
            onCancel={onCancel}
            isAdmin={isAdmin}
            currentUser={currentUser}
            onRemove={onRemove}
            onEdit={(id) => setEditingGiftId(id)}
            onViewDetails={onViewDetails}
          />
        ))}
      </div>

      {gifts.length === 0 && (
        <EmptyState icon="🥂" message="Em breve teremos novidades aqui..." />
      )}

      {editingGiftId && (
        <EditGiftModal
          gift={gifts.find(g => g.id === editingGiftId)!}
          onSave={onEdit}
          onClose={() => setEditingGiftId(null)}
        />
      )}
    </div>
  );
};

export default PresentesTab;
