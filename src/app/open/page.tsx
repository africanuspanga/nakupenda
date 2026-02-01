'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/Button';
import { useLanguage } from '@/context/LanguageContext';
import toast from 'react-hot-toast';

export default function OpenLetterPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [letterCode, setLetterCode] = useState('');

  const handleOpen = useCallback(() => {
    const code = letterCode.trim();
    if (!code) {
      toast.error(t('pleaseEnterCode'));
      return;
    }

    let slug = code;
    if (code.includes('/')) {
      const parts = code.split('/');
      slug = parts[parts.length - 1];
    }

    router.push(`/${slug}`);
  }, [letterCode, router, t]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-3 sm:px-4 py-8 sm:py-12">
      <div className="text-center max-w-md mx-auto w-full">
        <h1 className="font-script text-4xl sm:text-5xl md:text-6xl text-burgundy mb-3 sm:mb-4">
          {t('openALetter')}
        </h1>
        <p className="font-body text-text-muted text-base sm:text-lg mb-6 sm:mb-8 px-2">
          {t('enterCode')}
        </p>

        <div className="space-y-4">
          <input
            type="text"
            value={letterCode}
            onChange={(e) => setLetterCode(e.target.value)}
            placeholder={t('pasteLink')}
            className="w-full px-4 py-3 rounded-lg border-2 border-burgundy/20 focus:border-burgundy outline-none font-body text-text-dark bg-paper"
            onKeyDown={(e) => e.key === 'Enter' && handleOpen()}
          />
          <Button onClick={handleOpen} fullWidth>
            {t('openLetter')}
          </Button>
        </div>

        <button
          onClick={() => router.push('/')}
          className="mt-8 text-text-muted hover:text-burgundy transition-colors font-body"
        >
          {t('backHome')}
        </button>
      </div>
    </main>
  );
}
