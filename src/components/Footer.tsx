'use client';

import { useLanguage } from '@/context/LanguageContext';

export function Footer() {
  const { language, setShowLanguageModal } = useLanguage();

  return (
    <footer className="fixed bottom-0 left-0 right-0 py-3 px-4 text-center bg-gradient-to-t from-cream via-cream to-transparent">
      <div className="flex items-center justify-center gap-2 text-text-muted text-sm font-body">
        <span>Built by</span>
        <a
          href="https://driftmark.co.tz"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-burgundy hover:text-burgundy/80 transition-colors"
        >
          Driftmark
        </a>
        <span className="mx-2">•</span>
        <button
          onClick={() => setShowLanguageModal(true)}
          className="hover:text-burgundy transition-colors"
        >
          {language === 'en' ? '🇬🇧 EN' : '🇹🇿 SW'}
        </button>
      </div>
    </footer>
  );
}
