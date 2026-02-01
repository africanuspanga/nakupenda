'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/Button';
import { useLanguage } from '@/context/LanguageContext';
import { getLetterUrl, copyToClipboard } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function SharePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params.slug as string;
  const theme = searchParams.get('theme') || 'classic';
  const { t } = useLanguage();
  const letterUrl = `${getLetterUrl(slug)}?theme=${theme}`;
  const [recipientName, setRecipientName] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch(`/api/letters/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.letter?.recipient_name) {
          setRecipientName(data.letter.recipient_name);
        }
      })
      .catch(console.error);
  }, [slug]);

  const handleCopy = useCallback(async () => {
    const success = await copyToClipboard(letterUrl);
    if (success) {
      setCopied(true);
      toast.success(t('linkCopied'));
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error(t('failedToCopy'));
    }
  }, [letterUrl, t]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-3 sm:px-4 py-8 sm:py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center max-w-md mx-auto w-full"
      >
        {/* Envelope preview */}
        <div className="w-[260px] sm:w-[300px] md:w-[360px] h-[160px] sm:h-[190px] md:h-[225px] bg-burgundy rounded-lg shadow-lg flex flex-col items-center justify-center mx-auto mb-6 sm:mb-8">
          <p className="font-script text-cream-light text-lg sm:text-xl opacity-80">To:</p>
          <p className="font-script text-white text-2xl sm:text-3xl mt-1">{recipientName || '...'}</p>
          <div className="w-40 sm:w-56 h-px bg-cream-light/50 mt-3" />
        </div>

        <h2 className="font-body text-text-dark text-lg sm:text-xl md:text-2xl mb-4 sm:mb-6 px-2">
          {t('readyToShare')}
        </h2>

        {/* Link display */}
        <div className="bg-paper rounded-lg shadow-md p-4 mb-4">
          <p className="font-mono text-sm text-text-dark break-all">{letterUrl}</p>
        </div>

        <Button onClick={handleCopy} fullWidth>
          {copied ? t('copied') : t('copy')}
        </Button>

        <div className="mt-8">
          <Link href="/" className="text-text-muted hover:text-burgundy transition-colors font-body">
            {t('createAnother')}
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
