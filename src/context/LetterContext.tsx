'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type LetterData = {
  recipientName: string;
  message: string;
  senderName: string;
  photos: File[];
  photoUrls: string[];
};

type LetterContextType = {
  letterData: LetterData;
  setRecipientName: (name: string) => void;
  setMessage: (message: string) => void;
  setSenderName: (name: string) => void;
  addPhoto: (photo: File) => void;
  removePhoto: (index: number) => void;
  resetLetter: () => void;
};

const defaultLetterData: LetterData = {
  recipientName: '',
  message: '',
  senderName: '',
  photos: [],
  photoUrls: [],
};

const LetterContext = createContext<LetterContextType | undefined>(undefined);

export function LetterProvider({ children }: { children: ReactNode }) {
  const [letterData, setLetterData] = useState<LetterData>(defaultLetterData);

  const setRecipientName = (name: string) => {
    setLetterData((prev) => ({ ...prev, recipientName: name }));
  };

  const setMessage = (message: string) => {
    setLetterData((prev) => ({ ...prev, message }));
  };

  const setSenderName = (name: string) => {
    setLetterData((prev) => ({ ...prev, senderName: name }));
  };

  const addPhoto = (photo: File) => {
    if (letterData.photos.length >= 5) return;
    const url = URL.createObjectURL(photo);
    setLetterData((prev) => ({
      ...prev,
      photos: [...prev.photos, photo],
      photoUrls: [...prev.photoUrls, url],
    }));
  };

  const removePhoto = (index: number) => {
    setLetterData((prev) => {
      URL.revokeObjectURL(prev.photoUrls[index]);
      return {
        ...prev,
        photos: prev.photos.filter((_, i) => i !== index),
        photoUrls: prev.photoUrls.filter((_, i) => i !== index),
      };
    });
  };

  const resetLetter = () => {
    letterData.photoUrls.forEach((url) => URL.revokeObjectURL(url));
    setLetterData(defaultLetterData);
  };

  return (
    <LetterContext.Provider
      value={{
        letterData,
        setRecipientName,
        setMessage,
        setSenderName,
        addPhoto,
        removePhoto,
        resetLetter,
      }}
    >
      {children}
    </LetterContext.Provider>
  );
}

export function useLetterContext() {
  const context = useContext(LetterContext);
  if (!context) {
    throw new Error('useLetterContext must be used within a LetterProvider');
  }
  return context;
}
