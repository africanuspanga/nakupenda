'use client';

import Image from 'next/image';

type LetterPaperProps = {
  recipientName: string;
  message: string;
  photoUrls?: string[];
  isEditable?: boolean;
  onRecipientChange?: (name: string) => void;
  onMessageChange?: (message: string) => void;
};

export function LetterPaper({
  recipientName,
  message,
  photoUrls = [],
  isEditable = false,
  onRecipientChange,
  onMessageChange,
}: LetterPaperProps) {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-paper rounded-lg shadow-xl p-6 sm:p-8 min-h-[400px]">
        {/* Header */}
        <div className="mb-4">
          <span className="font-script text-2xl sm:text-3xl text-text-dark">Dear </span>
          {isEditable ? (
            <input
              type="text"
              value={recipientName}
              onChange={(e) => onRecipientChange?.(e.target.value)}
              placeholder="Name"
              className="font-script text-2xl sm:text-3xl text-text-dark bg-transparent border-none outline-none border-b border-text-muted/30 focus:border-burgundy w-32 sm:w-40"
            />
          ) : (
            <span className="font-script text-2xl sm:text-3xl text-text-dark">{recipientName}</span>
          )}
          <span className="font-script text-2xl sm:text-3xl text-text-dark">,</span>
        </div>

        {/* Message body */}
        {isEditable ? (
          <textarea
            value={message}
            onChange={(e) => onMessageChange?.(e.target.value)}
            placeholder="Write your message here..."
            className="w-full min-h-[250px] font-body text-text-dark text-base sm:text-lg leading-relaxed bg-transparent border-none outline-none resize-none placeholder:text-text-muted/50"
          />
        ) : (
          <p className="font-body text-text-dark text-base sm:text-lg leading-relaxed whitespace-pre-wrap">
            {message}
          </p>
        )}

        {/* Photos */}
        {photoUrls.length > 0 && (
          <div className="mt-6 grid grid-cols-2 gap-3">
            {photoUrls.map((url, index) => (
              <div
                key={index}
                className="relative aspect-square rounded-lg overflow-hidden shadow-md bg-cream-light"
              >
                <Image
                  src={url}
                  alt={`Attachment ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Decorative envelope at bottom */}
      <div className="flex justify-center mt-4 opacity-30">
        <svg width="60" height="40" viewBox="0 0 60 40" className="transform rotate-[-10deg]">
          <rect x="0" y="0" width="60" height="40" rx="2" fill="#8B1A1A" />
          <polygon points="0,0 30,20 60,0" fill="#6D1515" />
        </svg>
      </div>
    </div>
  );
}
