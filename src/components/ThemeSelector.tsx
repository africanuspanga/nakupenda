'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

export type LetterTheme = 'classic' | 'rose' | 'sunset' | 'vintage' | 'modern';

interface ThemeSelectorProps {
  selectedTheme: LetterTheme;
  onSelectTheme: (theme: LetterTheme) => void;
}

const themes: { id: LetterTheme; name: { en: string; sw: string }; preview: string; bg: string }[] = [
  {
    id: 'classic',
    name: { en: 'Classic', sw: 'Kawaida' },
    preview: 'bg-[#FEFEFE]',
    bg: 'bg-[#FEFEFE]',
  },
  {
    id: 'rose',
    name: { en: 'Rose Petals', sw: 'Waridi' },
    preview: 'bg-gradient-to-br from-pink-50 to-rose-100',
    bg: 'bg-gradient-to-br from-pink-50 to-rose-100',
  },
  {
    id: 'sunset',
    name: { en: 'Sunset', sw: 'Machweo' },
    preview: 'bg-gradient-to-br from-orange-200 via-pink-200 to-purple-200',
    bg: 'bg-gradient-to-br from-orange-100 via-pink-100 to-purple-100',
  },
  {
    id: 'vintage',
    name: { en: 'Vintage', sw: 'Kale' },
    preview: 'bg-gradient-to-br from-amber-50 to-orange-100',
    bg: 'bg-gradient-to-br from-amber-50 to-orange-100',
  },
  {
    id: 'modern',
    name: { en: 'Modern', sw: 'Kisasa' },
    preview: 'bg-gradient-to-br from-slate-50 to-gray-100',
    bg: 'bg-slate-50',
  },
];

export function getThemeStyles(theme: LetterTheme) {
  const styles = {
    classic: {
      paper: 'bg-[#FEFEFE]',
      text: 'text-text-dark',
      accent: 'text-burgundy',
      border: '',
    },
    rose: {
      paper: 'bg-gradient-to-br from-pink-50 to-rose-100',
      text: 'text-rose-900',
      accent: 'text-rose-600',
      border: 'border-2 border-rose-200',
    },
    sunset: {
      paper: 'bg-gradient-to-br from-orange-100 via-pink-100 to-purple-100',
      text: 'text-purple-900',
      accent: 'text-pink-600',
      border: 'border-2 border-pink-200',
    },
    vintage: {
      paper: 'bg-gradient-to-br from-amber-50 to-orange-100',
      text: 'text-amber-900',
      accent: 'text-amber-700',
      border: 'border-2 border-amber-200',
    },
    modern: {
      paper: 'bg-slate-50',
      text: 'text-slate-800',
      accent: 'text-slate-600',
      border: 'border border-slate-200',
    },
  };
  return styles[theme];
}

export function ThemeSelector({ selectedTheme, onSelectTheme }: ThemeSelectorProps) {
  const { language } = useLanguage();

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2">
      {themes.map((theme) => (
        <motion.button
          key={theme.id}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelectTheme(theme.id)}
          className={`flex-shrink-0 flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${
            selectedTheme === theme.id
              ? 'bg-burgundy/10 ring-2 ring-burgundy'
              : 'hover:bg-cream-light'
          }`}
        >
          <div
            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-lg shadow-md ${theme.preview} ${
              theme.id === 'sunset' ? '' : 'border border-gray-200'
            }`}
          />
          <span className="text-xs font-body text-text-muted">
            {theme.name[language]}
          </span>
        </motion.button>
      ))}
    </div>
  );
}

export { themes };
