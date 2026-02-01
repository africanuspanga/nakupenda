'use client';

import { motion } from 'framer-motion';

type EnvelopeProps = {
  recipientName?: string;
  state: 'closed' | 'opening' | 'open';
  onClick?: () => void;
  showLetter?: boolean;
  letterPreview?: string;
};

export function Envelope({
  recipientName,
  state,
  onClick,
  showLetter = false,
  letterPreview,
}: EnvelopeProps) {
  return (
    <div className="relative cursor-pointer" onClick={onClick}>
      {/* Envelope body */}
      <div className="relative w-[320px] h-[200px] sm:w-[400px] sm:h-[250px]">
        {/* Letter paper (visible when opening/open) */}
        {showLetter && (
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: state === 'open' ? -80 : state === 'opening' ? -60 : 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="absolute top-4 left-1/2 -translate-x-1/2 w-[280px] sm:w-[350px] bg-paper rounded-sm shadow-md z-10"
          >
            <div className="p-6">
              <p className="font-script text-2xl text-text-dark">
                Dear {recipientName},
              </p>
              <p className="text-text-muted mt-2">...</p>
            </div>
          </motion.div>
        )}

        {/* Envelope back */}
        <div className="absolute inset-0 bg-burgundy rounded-lg shadow-lg" />

        {/* Envelope flap (top triangle) */}
        <motion.div
          initial={{ rotateX: 0 }}
          animate={{
            rotateX: state === 'closed' ? 0 : 180,
          }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          style={{ transformOrigin: 'top center', transformStyle: 'preserve-3d' }}
          className="absolute top-0 left-0 right-0 h-[100px] sm:h-[125px] z-20"
        >
          {/* Front of flap */}
          <div
            className="absolute inset-0"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <svg viewBox="0 0 400 125" className="w-full h-full" preserveAspectRatio="none">
              <polygon
                points="0,0 400,0 200,125"
                fill="#6D1515"
              />
            </svg>
          </div>
          {/* Back of flap */}
          <div
            className="absolute inset-0"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateX(180deg)' }}
          >
            <svg viewBox="0 0 400 125" className="w-full h-full" preserveAspectRatio="none">
              <polygon
                points="0,0 400,0 200,125"
                fill="#7D1919"
              />
            </svg>
          </div>
        </motion.div>

        {/* Envelope front (bottom part with triangles) */}
        <div className="absolute inset-0 z-30 pointer-events-none">
          <svg viewBox="0 0 400 250" className="w-full h-full" preserveAspectRatio="none">
            {/* Left triangle */}
            <polygon
              points="0,0 200,125 0,250"
              fill="#A52A2A"
            />
            {/* Right triangle */}
            <polygon
              points="400,0 200,125 400,250"
              fill="#A52A2A"
            />
            {/* Bottom triangle */}
            <polygon
              points="0,250 200,125 400,250"
              fill="#8B1A1A"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

export function EnvelopeFront({ recipientName }: { recipientName: string }) {
  return (
    <div className="w-[320px] sm:w-[400px] h-[200px] sm:h-[250px] bg-burgundy rounded-lg shadow-lg flex flex-col items-center justify-center">
      <p className="font-script text-cream-light text-xl sm:text-2xl opacity-80">To:</p>
      <p className="font-script text-white text-3xl sm:text-4xl mt-2">{recipientName}</p>
      <div className="w-48 sm:w-64 h-px bg-cream-light/50 mt-4" />
    </div>
  );
}

export function EnvelopeInput({
  recipientName,
  onChange,
}: {
  recipientName: string;
  onChange: (name: string) => void;
}) {
  return (
    <div className="w-[320px] sm:w-[400px] h-[200px] sm:h-[250px] bg-burgundy rounded-lg shadow-lg flex flex-col items-center justify-center">
      <p className="font-script text-cream-light text-xl sm:text-2xl opacity-80">To:</p>
      <input
        type="text"
        value={recipientName}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Recipient's name"
        className="font-script text-white text-3xl sm:text-4xl mt-2 bg-transparent border-none outline-none text-center placeholder:text-white/50 w-full px-4"
      />
      <div className="w-48 sm:w-64 h-px bg-cream-light/50 mt-4" />
    </div>
  );
}
