'use client';

import Link from 'next/link';
import { Button } from '@/components/Button';
import { useLanguage } from '@/context/LanguageContext';

export default function Home() {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-8 safe-area-inset">
      <div className="text-center max-w-md mx-auto">
        <h1 className="font-script text-5xl sm:text-6xl md:text-7xl text-burgundy mb-3">
          Nakupenda
        </h1>
        <p className="font-body text-text-muted text-base sm:text-lg md:text-xl mb-8 sm:mb-12 px-2">
          {t('tagline')}
        </p>

        <div className="flex flex-col gap-4 w-full max-w-xs mx-auto">
          <Link href="/create">
            <Button variant="primary" fullWidth>
              {t('createLetter')}
            </Button>
          </Link>
          <Link href="/open">
            <Button variant="outline" fullWidth>
              {t('openLetter')}
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
