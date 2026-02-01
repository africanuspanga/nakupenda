'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/Button';
import { useLanguage } from '@/context/LanguageContext';
import { LoveConfetti } from '@/components/Confetti';
import { getThemeStyles, type LetterTheme } from '@/components/ThemeSelector';
import type { Letter, LetterAttachment } from '@/lib/supabase';

type EnvelopeState = 'closed' | 'opening' | 'preview' | 'open';

export default function ViewLetterPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params.slug as string;
  const theme = (searchParams.get('theme') || 'classic') as LetterTheme;
  const themeStyles = getThemeStyles(theme);
  const { t } = useLanguage();
  const isTransitioning = useRef(false);
  
  const [state, setState] = useState<EnvelopeState>('closed');
  const [letter, setLetter] = useState<Letter | null>(null);
  const [attachments, setAttachments] = useState<LetterAttachment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    async function fetchLetter() {
      try {
        const response = await fetch(`/api/letters/${slug}`);
        if (!response.ok) {
          if (response.status === 404) {
            setError(t('letterNotFound'));
          } else {
            setError(t('letterNotFound'));
          }
          return;
        }
        const data = await response.json();
        setLetter(data.letter);
        setAttachments(data.attachments || []);
      } catch (err) {
        console.error('Error fetching letter:', err);
        setError(t('letterNotFound'));
      } finally {
        setLoading(false);
      }
    }

    fetchLetter();
  }, [slug, t]);

  const handleClick = useCallback(() => {
    if (isTransitioning.current) return;
    
    if (state === 'closed') {
      isTransitioning.current = true;
      setState('opening');
      setTimeout(() => {
        setState('preview');
        isTransitioning.current = false;
      }, 500);
    } else if (state === 'preview') {
      isTransitioning.current = true;
      setState('open');
      setShowConfetti(true);
      setTimeout(() => {
        isTransitioning.current = false;
      }, 400);
    }
  }, [state]);

  const getInstruction = useCallback(() => {
    switch (state) {
      case 'closed':
        return t('clickToOpen');
      case 'opening':
      case 'preview':
        return t('clickToRead');
      default:
        return '';
    }
  }, [state, t]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">
          <svg width="80" height="60" viewBox="0 0 80 60">
            <rect x="0" y="10" width="80" height="50" rx="4" fill="#8B1A1A" />
            <polygon points="0,10 40,35 80,10" fill="#6D1515" />
          </svg>
        </div>
      </main>
    );
  }

  if (error || !letter) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-4">
        <h1 className="font-script text-4xl text-burgundy mb-4">{t('oops')}</h1>
        <p className="font-body text-text-muted mb-8">{error || t('letterNotFound')}</p>
        <Link href="/">
          <Button>{t('goHome')}</Button>
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col px-3 sm:px-4 py-4 sm:py-6">
      <LoveConfetti show={showConfetti} />
      {/* Header with Write a Letter button */}
      <div className="flex justify-end mb-4">
        <Link href="/create">
          <Button variant="primary" className="text-base px-4 py-2">
            {t('writeALetter')}
          </Button>
        </Link>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {state !== 'open' ? (
            <motion.div
              key="envelope"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="cursor-pointer"
              onClick={handleClick}
            >
              {/* Envelope with animations */}
              <div className="relative w-[280px] h-[175px] sm:w-[320px] sm:h-[200px] md:w-[400px] md:h-[250px]">
                {/* Letter paper (visible when opening) */}
                {(state === 'opening' || state === 'preview') && (
                  <motion.div
                    initial={{ y: 0 }}
                    animate={{ y: state === 'preview' ? -80 : -40 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="absolute top-4 left-1/2 -translate-x-1/2 w-[240px] sm:w-[280px] md:w-[350px] bg-paper rounded-sm shadow-md z-10"
                  >
                    <div className="p-6">
                      <p className="font-script text-2xl text-text-dark">
                        {t('dear')} {letter.recipient_name},
                      </p>
                      <p className="text-text-muted mt-2">...</p>
                    </div>
                  </motion.div>
                )}

                {/* Envelope back - darker shade */}
                <div className="absolute inset-0 bg-[#6B1414] rounded-lg shadow-lg" />

                {/* Envelope flap (top triangle) */}
                <motion.div
                  initial={{ rotateX: 0 }}
                  animate={{
                    rotateX: state === 'closed' ? 0 : 180,
                  }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                  style={{ transformOrigin: 'top center', transformStyle: 'preserve-3d' }}
                  className="absolute top-0 left-0 right-0 h-[87px] sm:h-[100px] md:h-[125px] z-20"
                >
                  <div
                    className="absolute inset-0"
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    <svg viewBox="0 0 400 125" className="w-full h-full" preserveAspectRatio="none">
                      <polygon points="0,0 400,0 200,125" fill="#7B1818" />
                    </svg>
                  </div>
                  <div
                    className="absolute inset-0"
                    style={{ backfaceVisibility: 'hidden', transform: 'rotateX(180deg)' }}
                  >
                    <svg viewBox="0 0 400 125" className="w-full h-full" preserveAspectRatio="none">
                      <polygon points="0,0 400,0 200,125" fill="#5B1010" />
                    </svg>
                  </div>
                </motion.div>

                {/* Envelope front - left triangle (lighter) */}
                <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden rounded-lg">
                  <svg viewBox="0 0 400 250" className="w-full h-full" preserveAspectRatio="none">
                    {/* Left side triangle */}
                    <polygon points="0,0 200,140 0,250" fill="#9B2020" />
                    {/* Right side triangle */}
                    <polygon points="400,0 200,140 400,250" fill="#8B1A1A" />
                    {/* Bottom triangle (front flap) */}
                    <polygon points="0,250 200,140 400,250" fill="#A52828" />
                  </svg>
                </div>

                {/* Wax seal */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40">
                  <Image
                    src="/wax-seal.png"
                    alt="Love You wax seal"
                    width={80}
                    height={80}
                    className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 drop-shadow-lg"
                  />
                </div>
              </div>

              {/* Instruction text */}
              <p className="text-center font-body text-text-muted mt-6">
                {getInstruction()}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="letter"
              initial={{ opacity: 0, rotateY: -90 }}
              animate={{ opacity: 1, rotateY: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="w-full max-w-md"
            >
              {/* Full letter view */}
              <div className={`rounded-lg shadow-xl p-6 sm:p-8 ${themeStyles.paper} ${themeStyles.border}`}>
                <p className={`font-script text-2xl sm:text-3xl ${themeStyles.accent} mb-4`}>
                  {t('dear')} {letter.recipient_name},
                </p>
                <p className={`font-body ${themeStyles.text} text-base sm:text-lg leading-relaxed whitespace-pre-wrap`}>
                  {letter.message}
                </p>

                {/* Photos */}
                {attachments.length > 0 && (
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    {attachments.map((attachment, index) => (
                      <div
                        key={attachment.id}
                        className="relative aspect-square rounded-lg overflow-hidden shadow-md bg-cream-light"
                      >
                        <Image
                          src={attachment.file_url}
                          alt={`Photo ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
