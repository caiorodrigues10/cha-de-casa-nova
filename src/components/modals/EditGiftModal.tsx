import React, { useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Gift } from '../../types';
import { giftSchema } from '../../schemas';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Button from '../ui/Button';

interface EditGiftModalProps {
  gift: Gift;
  onSave: (id: string, data: any, uploadedImage: string | null) => void;
  onClose: () => void;
}

const EditGiftModal: React.FC<EditGiftModalProps> = ({ gift, onSave, onClose }) => {
  const [uploadedImage, setUploadedImage] = React.useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm({
    resolver: zodResolver(giftSchema),
    defaultValues: {
      name: gift.name,
      description: gift.description,
      imageUrl: gift.imageUrl || '',
      link: gift.link || '',
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedImage(reader.result as string);
      setValue('imageUrl', ''); // Clear existing image URL if uploading new
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = (data: any) => {
    // If no new image was uploaded and there's an existing imageUrl, it remains from data.imageUrl
    onSave(gift.id, data, uploadedImage);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[#4A4238]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#FAF9F2] rounded-[2.5rem] p-8 sm:p-10 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-300 border border-[#E8E1D1] relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-3xl leading-none text-[#A19A8E] hover:text-[#4A4238] transition"
          type="button"
        >
          ×
        </button>

        <h2 className="text-3xl font-bold mb-6 text-[#4A4238] serif text-center">Editar Presente</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input label="Nome" placeholder="Ex: Conjunto de Facas" {...register('name')} error={errors.name?.message as string} />
          <Textarea label="Descrição" placeholder="Breve detalhe..." {...register('description')} error={errors.description?.message as string} rows={3} />
          <Input label="Link do Presente (Opcional)" placeholder="https://..." {...register('link')} error={errors.link?.message as string} />

          {/* Upload de imagem */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[9px] font-bold text-[#A19A8E] uppercase tracking-[0.2em] ml-1">Imagem do Presente</span>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-[#E8E1D1] rounded-2xl h-32 bg-[#FAF9F2] flex flex-col items-center justify-center cursor-pointer hover:border-[#B59A57] transition-all overflow-hidden relative"
            >
              <input ref={fileInputRef} type="file" onChange={handleFileChange} className="hidden" accept="image/*" />
              {uploadedImage || gift.imageUrl
                ? <img src={uploadedImage || gift.imageUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-50" />
                : <span className="text-2xl mb-2">📸</span>
              }
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#A19A8E] relative z-10 bg-white/70 px-2 py-1 rounded backdrop-blur">
                {uploadedImage || gift.imageUrl ? 'Trocar Imagem' : 'Escolher Foto'}
              </span>
            </div>
          </div>

          <Button type="submit" variant="secondary" size="lg" fullWidth>Salvar Alterações</Button>
        </form>
      </div>
    </div>
  );
};

export default EditGiftModal;
