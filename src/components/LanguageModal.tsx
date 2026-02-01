'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

export function LanguageModal() {
  const { showLanguageModal, setLanguage, t } = useLanguage();

  if (!showLanguageModal) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-paper rounded-2xl p-8 max-w-sm w-full shadow-2xl text-center"
        >
          <h2 className="font-script text-4xl text-burgundy mb-2">Nakupenda</h2>
          <p className="font-body text-text-muted mb-6">{t('chooseLanguage')}</p>
          
          <div className="space-y-3">
            <button
              onClick={() => setLanguage('en')}
              className="w-full py-4 px-6 rounded-xl border-2 border-burgundy/20 hover:border-burgundy hover:bg-burgundy/5 transition-all font-body text-lg text-text-dark flex items-center justify-center gap-3"
            >
              <span className="text-2xl">🇬🇧</span>
              English
            </button>
            <button
              onClick={() => setLanguage('sw')}
              className="w-full py-4 px-6 rounded-xl border-2 border-burgundy/20 hover:border-burgundy hover:bg-burgundy/5 transition-all font-body text-lg text-text-dark flex items-center justify-center gap-3"
            >
              <span className="text-2xl">🇹🇿</span>
              Kiswahili
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
