import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SuperCelebrationProps {
  trigger: boolean;
  onComplete?: () => void;
}

const generateConfetti = (count: number) => {
  return Array.from({ length: count }).map((_, i) => ({
    id: i,
    x: (Math.random() - 0.5) * window.innerWidth * 1.5,
    y: -window.innerHeight * 0.2 - Math.random() * window.innerHeight,
    size: Math.random() * 12 + 6,
    rotation: Math.random() * 360,
    endRotation: Math.random() * 720,
    duration: Math.random() * 3 + 3,
    color: ['#B59A57', '#C9A694', '#4A4238', '#FAF9F2'][Math.floor(Math.random() * 4)],
  }));
};

const SuperCelebrationAnimation: React.FC<SuperCelebrationProps> = ({ trigger, onComplete }) => {
  const [particles, setParticles] = useState<any[]>([]);
  const [show, setShow] = useState(false);
  const onCompleteRef = React.useRef(onComplete);

  React.useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (trigger) {
      setParticles(generateConfetti(150));
      setShow(true);

      const timer = setTimeout(() => {
        setShow(false);
        if (onCompleteRef.current) onCompleteRef.current();
      }, 7000); // 7 seconds of epic celebration

      return () => clearTimeout(timer);
    } else {
      setShow(false);
    }
  }, [trigger]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-100 flex flex-col items-center justify-center pointer-events-none overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 1.5, ease: "easeInOut" } }}
        >
          {/* Fundo escuro intenso */}
          <motion.div
            className="absolute inset-0 bg-[#4A4238]/40 mix-blend-multiply backdrop-blur-[3px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          />

          {/* Confetes caindo */}
          <div className="absolute inset-0 z-20 flex pointer-events-none">
            {particles.map((p) => (
               <motion.div
                 key={p.id}
                 className="absolute rounded-sm shadow-sm"
                 style={{ width: p.size, height: p.size * 1.5, backgroundColor: p.color, left: '50%', top: '0%' }}
                 initial={{ opacity: 1, x: 0, y: p.y, rotate: 0 }}
                 animate={{
                   opacity: [1, 1, 0],
                   x: [0, p.x / 2, p.x],
                   y: [p.y, window.innerHeight + 100],
                   rotate: [0, p.rotation, p.endRotation]
                 }}
                 transition={{
                   duration: p.duration,
                   ease: "linear",
                   times: [0, 0.8, 1]
                 }}
               />
            ))}
          </div>

          {/* Ícone Central Grandioso */}
          <div className="relative z-10 flex flex-col items-center">
            <motion.div
               className="absolute top-0 w-64 h-64 bg-[#B59A57]/30 rounded-full blur-[80px]"
               initial={{ scale: 0, opacity: 0 }}
               animate={{ scale: [0, 1.5, 2, 1.5], opacity: [0, 1, 0.8, 0] }}
               transition={{ duration: 5, ease: "easeInOut", times: [0, 0.2, 0.8, 1] }}
            />

            <motion.div
              className="w-32 h-32 bg-white rounded-full shadow-2xl flex items-center justify-center text-6xl border-4 border-[#B59A57] relative"
              initial={{ scale: 0, rotate: -30, opacity: 0, y: 100 }}
              animate={{ scale: [0, 1.2, 1], rotate: [ -30, 10, 0 ], opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: -50 }}
              transition={{
                type: "spring",
                stiffness: 150,
                damping: 12,
                duration: 1.2
              }}
            >
              🎉
            </motion.div>

            <motion.h1
              className="mt-8 text-4xl md:text-5xl font-bold text-[#FAF9F2] serif text-center tracking-tight drop-shadow-lg max-w-[80vw]"
              initial={{ opacity: 0, y: 30, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
              style={{ textShadow: "0px 4px 15px rgba(0,0,0,0.3)" }}
            >
              Conseguimos! Meta 100% atingida!
            </motion.h1>
            <motion.p
              className="mt-4 text-[#E8E1D1] text-lg font-medium text-center max-w-lg drop-shadow-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
            >
              Obrigado a todos por tornarem o nosso sonho possível.
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SuperCelebrationAnimation;
