'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LOVE_EMOJIS = ['❤️', '💕', '💖', '💗', '💘', '💝', '😍', '🥰', '💑', '💏'];

interface ConfettiPiece {
  id: number;
  emoji: string;
  x: number;
  delay: number;
  duration: number;
}

function generatePieces(): ConfettiPiece[] {
  const newPieces: ConfettiPiece[] = [];
  for (let i = 0; i < 30; i++) {
    newPieces.push({
      id: i,
      emoji: LOVE_EMOJIS[Math.floor(Math.random() * LOVE_EMOJIS.length)],
      x: Math.random() * 100,
      delay: Math.random() * 0.5,
      duration: 2 + Math.random() * 2,
    });
  }
  return newPieces;
}

export function LoveConfetti({ show }: { show: boolean }) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);
  const hasTriggered = useRef(false);

  useEffect(() => {
    if (show && !hasTriggered.current) {
      hasTriggered.current = true;
      setPieces(generatePieces());

      const timer = setTimeout(() => {
        setPieces([]);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [show]);

  return (
    <AnimatePresence>
      {pieces.map((piece) => (
        <motion.div
          key={piece.id}
          initial={{ 
            opacity: 1, 
            y: -20, 
            x: `${piece.x}vw`,
            scale: 0.5,
            rotate: 0
          }}
          animate={{ 
            opacity: 0, 
            y: '100vh',
            scale: 1,
            rotate: 360
          }}
          exit={{ opacity: 0 }}
          transition={{ 
            duration: piece.duration, 
            delay: piece.delay,
            ease: 'easeOut'
          }}
          className="fixed top-0 text-2xl sm:text-3xl pointer-events-none z-50"
          style={{ left: 0 }}
        >
          {piece.emoji}
        </motion.div>
      ))}
    </AnimatePresence>
  );
}
