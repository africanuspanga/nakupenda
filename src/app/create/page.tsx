'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, IconButton } from '@/components/Button';
import { ThemeSelector, getThemeStyles, type LetterTheme } from '@/components/ThemeSelector';
import { VoiceRecorder } from '@/components/VoiceRecorder';
import { useLanguage } from '@/context/LanguageContext';
import toast from 'react-hot-toast';

type CreateStep = 'compose' | 'recipient' | 'sending';

export default function CreatePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();
  
  const [step, setStep] = useState<CreateStep>('compose');
  const [recipientName, setRecipientName] = useState('');
  const [message, setMessage] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [theme, setTheme] = useState<LetterTheme>('classic');
  const [voiceNote, setVoiceNote] = useState<Blob | null>(null);
  
  const themeStyles = getThemeStyles(theme);

  const handleAddPhoto = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const remainingSlots = 5 - photos.length;
    const newFiles = Array.from(files).slice(0, remainingSlots);

    newFiles.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(t('photoTooLarge'));
        return;
      }
      const url = URL.createObjectURL(file);
      setPhotos((prev) => [...prev, file]);
      setPhotoUrls((prev) => [...prev, url]);
    });

    e.target.value = '';
  }, [photos.length, t]);

  const handleRemovePhoto = useCallback((index: number) => {
    setPhotoUrls((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleDone = useCallback(() => {
    if (!message.trim()) {
      toast.error(t('pleaseWriteMessage'));
      return;
    }
    setStep('recipient');
  }, [message, t]);

  const handleSend = useCallback(async () => {
    if (!recipientName.trim()) {
      toast.error(t('pleaseEnterName'));
      return;
    }

    setIsSending(true);
    setStep('sending');

    try {
      const formData = new FormData();
      formData.append('recipientName', recipientName);
      formData.append('message', message);
      formData.append('theme', theme);
      photos.forEach((photo) => {
        formData.append('photos', photo);
      });
      
      if (voiceNote) {
        formData.append('voiceNote', voiceNote, 'voice-note.webm');
      }

      const response = await fetch('/api/letters', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to create letter');
      }

      const { slug } = await response.json();
      router.push(`/create/share/${slug}?theme=${theme}`);
    } catch (error) {
      console.error('Error creating letter:', error);
      toast.error(t('failedToCreate'));
      setStep('recipient');
      setIsSending(false);
    }
  }, [recipientName, message, photos, router, t, theme, voiceNote]);

  return (
    <main className="min-h-screen flex flex-col px-3 sm:px-4 py-4 sm:py-6">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />

      <AnimatePresence mode="wait">
        {step === 'compose' && (
          <motion.div
            key="compose"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 flex flex-col"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <IconButton onClick={handleAddPhoto} disabled={photos.length >= 5}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </IconButton>
                <span className="text-sm text-text-muted font-body">{t('addPhotos')}</span>
              </div>
              <Button
                variant="primary"
                onClick={handleDone}
                disabled={!message.trim()}
                className="text-lg px-6 py-2"
              >
                {t('done')}
              </Button>
            </div>

            {/* Theme Selector */}
            <div className="mb-4 max-w-md mx-auto w-full">
              <ThemeSelector selectedTheme={theme} onSelectTheme={setTheme} />
            </div>

            {/* Letter Paper */}
            <div className={`flex-1 rounded-lg shadow-xl p-5 sm:p-6 md:p-8 max-w-md mx-auto w-full ${themeStyles.paper} ${themeStyles.border}`}>
              <div className="mb-4">
                <span className={`font-script text-2xl sm:text-3xl md:text-4xl ${themeStyles.accent}`}>{t('dear')} </span>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder={t('name')}
                  className={`font-script text-2xl sm:text-3xl md:text-4xl ${themeStyles.text} bg-transparent border-none outline-none w-28 sm:w-36 md:w-44 placeholder:opacity-50`}
                />
                <span className={`font-script text-2xl sm:text-3xl md:text-4xl ${themeStyles.text}`}>,</span>
              </div>

              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t('writeMessage')}
                className={`w-full min-h-[200px] sm:min-h-[250px] font-body ${themeStyles.text} text-base sm:text-lg md:text-xl leading-relaxed bg-transparent border-none outline-none resize-none placeholder:opacity-40`}
              />

              {/* Photo Gallery */}
              {photoUrls.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {photoUrls.map((url, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden shadow-md group">
                      <Image
                        src={url}
                        alt={`Photo ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                      <button
                        onClick={() => handleRemovePhoto(index)}
                        className="absolute top-1 right-1 w-6 h-6 bg-burgundy text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-sm"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Voice Recorder */}
              <VoiceRecorder
                onRecordingComplete={(blob) => setVoiceNote(blob)}
                onRemove={() => setVoiceNote(null)}
              />
            </div>

            {/* Decorative envelope */}
            <div className="flex justify-center mt-6 opacity-30">
              <svg width="60" height="40" viewBox="0 0 60 40" className="transform rotate-[-10deg]">
                <rect x="0" y="0" width="60" height="40" rx="2" fill="#8B1A1A" />
                <polygon points="0,0 30,20 60,0" fill="#6D1515" />
              </svg>
            </div>
          </motion.div>
        )}

        {step === 'recipient' && (
          <motion.div
            key="recipient"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 flex flex-col items-center justify-center"
          >
            {/* Envelope with input */}
            <div className="w-[320px] sm:w-[400px] h-[200px] sm:h-[250px] bg-burgundy rounded-lg shadow-lg flex flex-col items-center justify-center">
              <p className="font-script text-cream-light text-xl sm:text-2xl opacity-80">To:</p>
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder={t('recipientName')}
                className="font-script text-white text-3xl sm:text-4xl mt-2 bg-transparent border-none outline-none text-center placeholder:text-white/50 w-full px-4"
                autoFocus
              />
              <div className="w-48 sm:w-64 h-px bg-cream-light/50 mt-4" />
            </div>

            <div className="mt-8">
              <Button onClick={handleSend} disabled={!recipientName.trim() || isSending}>
                {isSending ? '...' : t('send')}
              </Button>
            </div>

            <button
              onClick={() => setStep('compose')}
              className="mt-4 text-text-muted hover:text-text-dark transition-colors font-body"
            >
              {t('backToLetter')}
            </button>
          </motion.div>
        )}

        {step === 'sending' && (
          <motion.div
            key="sending"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col items-center justify-center"
          >
            <div className="animate-pulse">
              <svg width="80" height="60" viewBox="0 0 80 60">
                <rect x="0" y="10" width="80" height="50" rx="4" fill="#8B1A1A" />
                <polygon points="0,10 40,35 80,10" fill="#6D1515" />
              </svg>
            </div>
            <p className="font-body text-text-muted mt-4">{t('creatingLetter')}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
