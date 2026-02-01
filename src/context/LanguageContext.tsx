'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'sw';

type Translations = {
  [key: string]: {
    en: string;
    sw: string;
  };
};

export const translations: Translations = {
  // Landing page
  tagline: {
    en: 'Create beautiful letters for your loved ones',
    sw: 'Waandikie wapendwa wako barua za kipekee',
  },
  createLetter: {
    en: 'Create a Letter',
    sw: 'Andika Barua',
  },
  openLetter: {
    en: 'Open a Letter',
    sw: 'Fungua Barua',
  },
  // Create page
  dear: {
    en: 'My Love',
    sw: 'Mpenzi Wangu',
  },
  name: {
    en: 'Name',
    sw: 'Jina',
  },
  writeMessage: {
    en: 'Write your message here...',
    sw: 'Andika ujumbe wako hapa...',
  },
  done: {
    en: 'Done',
    sw: 'Tuma',
  },
  send: {
    en: 'Send',
    sw: 'Tuma',
  },
  recipientName: {
    en: "Recipient's name",
    sw: 'Jina la mpokeaji',
  },
  backToLetter: {
    en: '← Back to letter',
    sw: '← Rudi kwenye barua',
  },
  creatingLetter: {
    en: 'Creating your letter...',
    sw: 'Barua yako inaandaliwa...',
  },
  // Share page
  readyToShare: {
    en: 'Your letter is ready to share!',
    sw: 'Barua yako iko tayari kutumwa!',
  },
  copy: {
    en: 'Copy',
    sw: 'Copy',
  },
  copied: {
    en: 'Copied!',
    sw: 'Copied!',
  },
  createAnother: {
    en: 'Create another letter',
    sw: 'Andika barua nyingine',
  },
  // Open page
  openALetter: {
    en: 'Open a Letter',
    sw: 'Fungua Barua',
  },
  enterCode: {
    en: 'Enter the letter link or code you received',
    sw: 'Weka link au code ya barua uliyopokea',
  },
  pasteLink: {
    en: 'Paste link or enter code...',
    sw: 'Weka link au code...',
  },
  backHome: {
    en: '← Back home',
    sw: '← Rudi nyumbani',
  },
  // View letter page
  writeALetter: {
    en: 'Write a Letter',
    sw: 'Andika Barua',
  },
  clickToOpen: {
    en: 'Click to open',
    sw: 'Bofya kufungua',
  },
  clickToRead: {
    en: 'Click to read',
    sw: 'Bofya kusoma',
  },
  clickToFlip: {
    en: 'Click to flip',
    sw: 'Bofya kugeuza',
  },
  letterNotFound: {
    en: 'Letter not found',
    sw: 'Barua haijapatikana',
  },
  goHome: {
    en: 'Go Home',
    sw: 'Rudi Nyumbani',
  },
  oops: {
    en: 'Oops!',
    sw: 'Pole!',
  },
  // Language selector
  chooseLanguage: {
    en: 'Choose your language',
    sw: 'Chagua lugha yako',
  },
  english: {
    en: 'English',
    sw: 'Kiingereza',
  },
  swahili: {
    en: 'Swahili',
    sw: 'Kiswahili',
  },
  // Footer - always English
  addPhotos: {
    en: 'Add Photos',
    sw: 'Weka Picha',
  },
  addVoiceNote: {
    en: 'Add voice note',
    sw: 'Weka sauti',
  },
  stopRecording: {
    en: 'Stop',
    sw: 'Simama',
  },
  voiceNote: {
    en: 'Voice note attached',
    sw: 'Sauti imeambatishwa',
  },
  voiceMessage: {
    en: 'Voice message',
    sw: 'Ujumbe wa sauti',
  },
  // Errors
  pleaseWriteMessage: {
    en: 'Please write a message',
    sw: 'Tafadhali andika ujumbe',
  },
  pleaseEnterName: {
    en: 'Please enter recipient name',
    sw: 'Tafadhali ingiza jina la mpokeaji',
  },
  failedToCreate: {
    en: 'Failed to create letter. Please try again.',
    sw: 'Imeshindwa kuunda barua. Tafadhali jaribu tena.',
  },
  pleaseEnterCode: {
    en: 'Please enter a letter code or link',
    sw: 'Tafadhali ingiza msimbo au kiungo cha barua',
  },
  linkCopied: {
    en: 'Link copied!',
    sw: 'Link copied!',
  },
  failedToCopy: {
    en: 'Failed to copy',
    sw: 'Imeshindwa kunakili',
  },
  photoTooLarge: {
    en: 'Photo must be less than 5MB',
    sw: 'Picha lazima iwe chini ya 5MB',
  },
};

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  showLanguageModal: boolean;
  setShowLanguageModal: (show: boolean) => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('nakupenda-language') as Language) || 'en';
    }
    return 'en';
  });
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem('nakupenda-language') as Language | null;
    if (!savedLang) {
      setShowLanguageModal(true);
    }
    setIsInitialized(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('nakupenda-language', lang);
    setShowLanguageModal(false);
  };

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) return key;
    return translation[language] || translation.en || key;
  };

  if (!isInitialized) {
    return null;
  }

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, t, showLanguageModal, setShowLanguageModal }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
