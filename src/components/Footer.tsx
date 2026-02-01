'use client';

import { useLanguage } from '@/context/LanguageContext';

export function Footer() {
  const { language, setShowLanguageModal } = useLanguage();

  return (
    <footer className="fixed bottom-0 left-0 right-0 py-3 px-4 bg-cream/95 backdrop-blur-sm border-t border-cream-light/50">
      <div className="flex items-center justify-between max-w-md mx-auto">
        <a
          href="https://driftmark.co.tz"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-body text-text-muted hover:text-burgundy transition-colors"
        >
          Built by <span className="font-semibold text-burgundy">Driftmark</span>
        </a>
        <button
          onClick={() => setShowLanguageModal(true)}
          className="text-sm hover:scale-110 transition-transform"
        >
          {language === 'en' ? '🇬🇧' : '🇹🇿'}
        </button>
      </div>
    </footer>
  );
}
