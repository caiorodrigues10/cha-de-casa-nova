import React, { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Gift, Presenca, EventConfig } from '../../types';
import { configSchema, giftSchema } from '../schemas';
import StatCard from '../components/ui/StatCard';
import SectionCard from '../components/ui/SectionCard';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import Button from '../components/ui/Button';

interface AdminTabProps {
  gifts: Gift[];
  confirmacoes: Presenca[];
  config: EventConfig;
  onSaveConfig: (data: any) => void;
  onAddGift: (data: any, uploadedImage: string | null) => void;
  totalPessoas: number;
  totalAdultos: number;
  totalCriancas: number;
  totalNaoVao: number;
}

const TABLE_HEADERS = ['Convidado', 'Status', 'Adultos', 'Crianças', 'Contato'];

const AdminTab: React.FC<AdminTabProps> = ({
  gifts,
  confirmacoes,
  config,
  onSaveConfig,
  onAddGift,
  totalPessoas,
  totalAdultos,
  totalCriancas,
  totalNaoVao,
}) => {
  const [uploadedImage, setUploadedImage] = React.useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register: regConfig,
    handleSubmit: subConfig,
    formState: { errors: errConfig },
  } = useForm({ resolver: zodResolver(configSchema), values: config });

  const {
    register: regGift,
    handleSubmit: subGift,
    reset: resGift,
    formState: { errors: errGift },
    setValue: setGiftValue,
  } = useForm({ resolver: zodResolver(giftSchema) });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedImage(reader.result as string);
      setGiftValue('imageUrl', '');
    };
    reader.readAsDataURL(file);
  };

  const handleAddGift = (data: any) => {
    onAddGift(data, uploadedImage);
    resGift();
    setUploadedImage(null);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-10">

      {/* Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard variant="dark" label="Total Geral"     value={totalPessoas}  sublabel="Convidados Totais" />
        <StatCard               label="Público Adulto"  value={totalAdultos}  sublabel="Maiores de Idade" />
        <StatCard               label="Público Infantil" value={totalCriancas} sublabel="Crianças" />
        <StatCard               label="Ausências"        value={totalNaoVao}   sublabel='Formulários "Não Vou"' accentColor="#C9A694" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Configuração do Evento */}
        <SectionCard title="Configuração do Evento" icon="⚙️">
          <form onChange={subConfig(onSaveConfig)} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <Input label="Data"  type="date" {...regConfig('eventDate')}   error={errConfig.eventDate?.message as string} />
              <Input label="Hora"  type="time" {...regConfig('eventTime')}   error={errConfig.eventTime?.message as string} />
            </div>
            <Input    label="Prazo RSVP" type="date" {...regConfig('rsvpDeadline')} error={errConfig.rsvpDeadline?.message as string} />
            <Textarea label="Endereço"   rows={3}   {...regConfig('location')}      error={errConfig.location?.message as string} />
            <Input
              label="Link do Mapa (Google Maps)"
              placeholder="https://maps.app.goo.gl/..."
              {...regConfig('locationLink')}
              error={errConfig.locationLink?.message as string}
            />
          </form>
        </SectionCard>

        {/* Adicionar Presente */}
        <SectionCard title="Adicionar Presente" icon="✨">
          <form onSubmit={subGift(handleAddGift)} className="space-y-5">
            <Input    label="Nome"      placeholder="Ex: Conjunto de Facas" {...regGift('name')}        error={errGift.name?.message as string} />
            <Textarea label="Descrição" placeholder="Breve detalhe..."      {...regGift('description')} error={errGift.description?.message as string} rows={3} />
            <Input    label="Link do Presente (Opcional)" placeholder="https://..." {...regGift('link')} error={errGift.link?.message as string} />

            {/* Upload de imagem */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[9px] font-bold text-[#A19A8E] uppercase tracking-[0.2em] ml-1">Imagem do Presente</span>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[#E8E1D1] rounded-2xl h-32 bg-[#FAF9F2] flex flex-col items-center justify-center cursor-pointer hover:border-[#B59A57] transition-all overflow-hidden relative"
              >
                <input ref={fileInputRef} type="file" onChange={handleFileChange} className="hidden" accept="image/*" />
                {uploadedImage
                  ? <img src={uploadedImage} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-50" />
                  : <span className="text-2xl mb-2">📸</span>
                }
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#A19A8E] relative z-10">
                  {uploadedImage ? 'Trocar Imagem' : 'Escolher Foto'}
                </span>
              </div>
            </div>

            <Button type="submit" variant="secondary" size="lg" fullWidth>Salvar Presente</Button>
          </form>
        </SectionCard>
      </div>

      {/* Lista de Convidados */}
      <SectionCard title="Lista de Convidados" icon="📜" className="overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#FAF9F2]">
                {TABLE_HEADERS.map(h => (
                  <th key={h} className="pb-6 font-bold text-[#A19A8E] uppercase tracking-[0.2em] text-[9px]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FAF9F2]">
              {confirmacoes.map((r, i) => (
                <tr key={i} className="hover:bg-[#FAF9F2]/50 transition">
                  <td className="py-6 font-bold text-[#4A4238]">{r.name}</td>
                  <td className="py-6">
                    <span className={`px-3 py-1.5 rounded-full text-[8px] font-bold uppercase tracking-widest ${r.attending ? 'bg-[#F2EADA] text-[#B59A57]' : 'bg-red-50 text-red-400'}`}>
                      {r.attending ? 'Confirmado' : 'Não Vai'}
                    </span>
                  </td>
                  <td className="py-6 text-[#4A4238] font-bold">{r.attending ? r.adultsCount : '-'}</td>
                  <td className="py-6 text-[#4A4238] font-bold">{r.attending ? r.childrenCount : '-'}</td>
                  <td className="py-6 text-[#A19A8E] font-mono text-[9px] tracking-widest">{r.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
};

export default AdminTab;
