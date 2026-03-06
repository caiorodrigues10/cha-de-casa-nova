import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CelebrationAnimationProps {
  trigger: boolean;
  onComplete?: () => void;
}

// Função pura para gerar as partículas
const generateParticles = (count: number) => {
  return Array.from({ length: count }).map((_, i) => ({
    id: i,
    x: (Math.random() - 0.5) * window.innerWidth,
    y: (Math.random() - 0.5) * window.innerHeight,
    size: Math.random() * 8 + 4,
    duration: Math.random() * 2 + 1,
    delay: Math.random() * 0.3,
  }));
};

const CelebrationAnimation: React.FC<CelebrationAnimationProps> = ({ trigger, onComplete }) => {
  const [particles, setParticles] = useState<any[]>([]);

  // Gera novas partículas sempre que a animação for disparada
  useEffect(() => {
    if (trigger) {
      setParticles(generateParticles(60));
    }
  }, [trigger]);

  return (
    <AnimatePresence>
      {trigger && (
        <motion.div
          key="celebration-overlay"
          className="fixed inset-0 flex flex-col items-center justify-center pointer-events-none overflow-hidden"
          style={{ zIndex: 9999 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0] }} // Aparece, segura na tela, some
          exit={{ opacity: 0 }}
          transition={{ duration: 4, times: [0, 0.1, 0.9, 1] }}
          onAnimationComplete={onComplete} // Informa ao pai que terminou
        >
          {/* Fundo Desfocado e Claro */}
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[4px]" />

          {/* Partículas Douradas Espalhando */}
          <div className="absolute inset-0 z-20 flex items-center justify-center">
            {particles.map((p) => (
               <motion.div
                 key={p.id}
                 className="absolute rounded-full bg-[#B59A57]"
                 style={{ width: p.size, height: p.size, boxShadow: '0 0 12px rgba(181,154,87,0.9)' }}
                 initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                 animate={{
                   opacity: [0, 1, 0],
                   scale: [0, 1, 0],
                   x: [0, p.x],
                   y: [0, p.y]
                 }}
                 transition={{
                   duration: p.duration,
                   delay: p.delay,
                   ease: "easeOut",
                 }}
               />
            ))}
          </div>

          {/* Conteúdo Central (Glow, Card e Imagem da Casa) */}
          <div className="relative z-30 flex flex-col items-center">
            {/* Brilho Fundo */}
            <motion.div
               className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[450px] md:h-[450px] bg-[#B59A57]/15 rounded-full blur-[50px]"
               animate={{ scale: [0.9, 1.1, 0.9], opacity: [0.6, 1, 0.6] }}
               transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Caixa Branca do Ícone */}
            <motion.div
              className="w-[200px] h-[200px] md:w-[300px] md:h-[300px] bg-white rounded-[3rem] shadow-2xl flex items-center justify-center border border-[#E8E1D1] relative"
              initial={{ scale: 0, rotate: -15, y: 60 }}
              animate={{ scale: 1, rotate: 0, y: 0 }}
              transition={{ type: "spring", stiffness: 220, damping: 18 }}
            >
              <img
                src="/house-img.png"
                alt="Nosso Novo Lar"
                className="w-[160px] h-[160px] md:w-[260px] md:h-[260px] object-contain drop-shadow-[0_12px_18px_rgba(0,0,0,0.18)]"
              />
            </motion.div>

            {/* Texto de Celebração */}
            <motion.h2
              className="mt-8 text-2xl md:text-3xl font-bold text-[#4A4238] serif text-center tracking-tight drop-shadow-sm px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Mais um passo para o nosso novo lar
            </motion.h2>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CelebrationAnimation;
