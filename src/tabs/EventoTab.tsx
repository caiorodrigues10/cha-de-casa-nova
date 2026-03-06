import React, { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Presenca, EventConfig } from '../../types';
import { presencaSchema } from '../schemas';
import InfoRow from '../components/ui/InfoRow';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';

interface EventoTabProps {
  user: User | null;
  isAdmin: boolean;
  config: EventConfig;
  userReserva: Presenca | undefined | null;
  confirmacoes: Presenca[];
  onConfirmPresenca: (data: any) => void;
  isReservaPast: boolean;
}

const ADULTS_OPTIONS  = [1,2,3,4,5,6,7,8,9,10].map(n => ({ value: n, label: String(n) }));
const CHILDREN_OPTIONS = [0,1,2,3,4,5,6,7,8,9,10].map(n => ({ value: n, label: String(n) }));

const EventoTab: React.FC<EventoTabProps> = ({
  user,
  isAdmin,
  config,
  userReserva,
  onConfirmPresenca,
  isReservaPast,
}) => {
  const [showForm, setShowForm] = React.useState(false);
  const rsvpRef = useRef<HTMLDivElement>(null);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(presencaSchema),
    defaultValues: { attending: true, adults: 1, children: 0 },
  });

  const attending = watch('attending');

  const scrollToRSVP = () => {
    setShowForm(true);
    setTimeout(() => rsvpRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
  };

  const onSubmit = (data: any) => {
    onConfirmPresenca(data);
    setShowForm(false);
  };

  const generateCalendarLink = () => {
    try {
      const title = encodeURIComponent("Chá de Casa do Caio & Jhennifer");
      const details = encodeURIComponent("Venha celebrar conosco!");
      const location = encodeURIComponent(config.location || "");

      const startDateStr = config.eventDate.replace(/-/g, '');
      const startTimeStr = config.eventTime.replace(':', '') + '00';

      const [year, month, day] = config.eventDate.split('-').map(Number);
      const [hours, minutes] = config.eventTime.split(':').map(Number);

      const endDate = new Date(year, month - 1, day, hours + 4, minutes);
      const endYear = endDate.getFullYear();
      const endMonth = String(endDate.getMonth() + 1).padStart(2, '0');
      const endDay = String(endDate.getDate()).padStart(2, '0');
      const endHours = String(endDate.getHours()).padStart(2, '0');
      const endMinutes = String(endDate.getMinutes()).padStart(2, '0');

      const dates = `${startDateStr}T${startTimeStr}/${endYear}${endMonth}${endDay}T${endHours}${endMinutes}00`;
      return `https://calendar.google.com/calendar/r/eventedit?text=${title}&details=${details}&location=${location}&dates=${dates}`;
    } catch {
      return config.googleCalendarLink || "#";
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-in fade-in slide-in-from-bottom-8 duration-700">

      {/* Informações do Evento */}
      <div className="bg-white rounded-[3rem] p-12 border border-[#E8E1D1] shadow-sm flex flex-col justify-center">
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#B59A57] mb-8 block">A Celebração</span>
        <h3 className="text-4xl font-bold mb-10 text-[#4A4238] serif leading-tight">
          Cada detalhe <br />foi pensado para você.
        </h3>

        <div className="space-y-10">
          <InfoRow icon="📅" label="Data e Horário">
            <p className="text-xl font-bold text-[#4A4238]">
              {new Date(config.eventDate).toLocaleDateString('pt-BR', { timeZone: 'UTC' })} às {config.eventTime}
            </p>
          </InfoRow>

          <InfoRow icon="📍" label="Localização">
            <div className="flex flex-col gap-2">
              <p className="text-xl font-bold text-[#4A4238] leading-tight">{config.location}</p>
              {config.locationLink && (
                <a href={config.locationLink} target="_blank" rel="noreferrer"
                  className="text-[10px] font-bold text-[#B59A57] uppercase tracking-widest hover:underline flex items-center gap-1">
                  Ver no Mapa <span>↗</span>
                </a>
              )}
            </div>
          </InfoRow>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button variant="primary" size="md" fullWidth onClick={scrollToRSVP}>Confirmar Presença</Button>
            <Button variant="secondary" className='text-center' size="md" fullWidth as="a" href={generateCalendarLink()} target="_blank" rel="noreferrer">
              Agendar no Calendário
            </Button>
          </div>
        </div>
      </div>

      {/* Formulário de Presença */}
      <div ref={rsvpRef} className="bg-[#4A4238] text-[#FAF9F2] rounded-[3.5rem] p-12 shadow-2xl flex flex-col relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#B59A57] mb-8 block relative z-10">Presença</span>
        <h3 className="text-4xl font-bold mb-4 serif relative z-10">Vamos celebrar <br />juntos?</h3>

        <div className="bg-[#B59A57]/10 border border-[#B59A57]/30 rounded-2xl p-4 mb-8 relative z-10 flex items-start gap-4">
          <span className="text-2xl mt-1">🍖</span>
          <p className="text-sm text-[#E8E1D1] leading-relaxed">
            <strong className="text-[#FAF9F2] block mb-1">Não se esqueça do Kit Churrasco!</strong>
            Para aproveitarmos juntos essa comemoração, pedimos que cada convidado traga seu próprio <strong className="text-[#B59A57]">cooler (opcional), carne, cerveja e guaraná</strong>.
          </p>
        </div>

        {isAdmin ? (
          <DarkInfoBox>
            Você está visualizando como Administrador. Troque para o perfil de visitante para confirmar presença.
          </DarkInfoBox>
        ) : (
          <div className="grow flex flex-col justify-center relative z-10">
            {userReserva ? (
              <div className="bg-white/5 p-8 rounded-4xl border border-white/10 mb-8">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#B59A57] block mb-2">Sua Reserva Atual</span>
                <p className="text-lg font-bold mb-1">
                  {userReserva.attending ? '✓ Confirmado' : '✗ Você informou que não poderá ir.'}
                </p>
                {userReserva.attending && (
                  <p className="text-[10px] text-[#A19A8E] uppercase tracking-widest">
                    {userReserva.adultsCount} Adultos • {userReserva.childrenCount} Crianças
                  </p>
                )}
                <button
                  onClick={() => setShowForm(true)}
                  className="mt-4 text-[10px] font-bold uppercase tracking-widest text-[#A19A8E] hover:text-white transition"
                >
                  Alterar minha reserva
                </button>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="lg"
                fullWidth
                onClick={() => setShowForm(true)}
                className="bg-[#FAF9F2] text-[#4A4238] border-none hover:bg-white shadow-xl"
              >
                Reservar Presença
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Modal do Formulário de Presença */}
      {showForm && (
        <div className="fixed inset-0 bg-[#4A4238]/60 backdrop-blur-sm z-100 flex items-center justify-center p-4">
          <div className="bg-[#FAF9F2] rounded-[2.5rem] p-8 sm:p-10 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-300 border border-[#E8E1D1] relative">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-6 right-6 text-3xl leading-none text-[#A19A8E] hover:text-[#4A4238] transition"
              type="button"
            >
              ×
            </button>

            <h2 className="text-3xl font-bold mb-2 text-[#4A4238] serif text-center">Sua Presença</h2>
            <p className="text-[#7A7165] mb-8 text-sm text-center">Preencha os dados abaixo para confirmar.</p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Sim / Não */}
              <div className="flex gap-4">
                <RadioCard
                   label="Sim, eu vou"
                   active={attending === true}
                   onClick={() => setValue('attending', true)}
                   activeClass="bg-[#B59A57] border-[#B59A57] text-white"
                />
                <RadioCard
                   label="Infelizmente não"
                   active={attending === false}
                   onClick={() => setValue('attending', false)}
                   activeClass="bg-[#7A7165] border-[#7A7165] text-white"
                />
              </div>

              {attending && (
                <div className="grid grid-cols-2 gap-4">
                  <Select
                    label="Adultos"
                    options={ADULTS_OPTIONS}
                    {...register('adults', { valueAsNumber: true })}
                    error={errors.adults?.message as string}
                  />
                  <Select
                    label="Crianças"
                    options={CHILDREN_OPTIONS}
                    {...register('children', { valueAsNumber: true })}
                    error={errors.children?.message as string}
                  />
                </div>
              )}

              <Button type="submit" variant="secondary" size="lg" fullWidth className="mt-4">
                Salvar Reserva
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Sub-componentes locais
const DarkInfoBox: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="bg-white/5 p-8 rounded-4xl border border-white/10 relative z-10">
    <p className="text-[#A19A8E] text-sm italic leading-relaxed">{children}</p>
  </div>
);

interface RadioCardProps {
  label: string;
  active: boolean;
  onClick: () => void;
  activeClass: string;
}

const RadioCard: React.FC<RadioCardProps> = ({ label, active, onClick, activeClass }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex-1 py-5 rounded-xl text-[9px] font-bold uppercase tracking-widest border-2 transition-all text-center select-none ${active ? `${activeClass}` : 'border-[#E8E1D1] text-[#A19A8E] hover:border-[#C9A694] bg-transparent'}`}
  >
    {label}
  </button>
);

export default EventoTab;
