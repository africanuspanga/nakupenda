'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

type ButtonVariant = 'primary' | 'secondary' | 'outline';

type ButtonProps = {
  variant?: ButtonVariant;
  children: ReactNode;
  fullWidth?: boolean;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
};

export function Button({
  variant = 'primary',
  children,
  fullWidth = false,
  className = '',
  disabled,
  onClick,
  type = 'button',
}: ButtonProps) {
  const baseStyles =
    'font-body font-medium text-lg sm:text-xl px-8 py-3 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-burgundy text-white hover:bg-burgundy-dark shadow-lg hover:shadow-xl',
    secondary: 'bg-burgundy-light text-white hover:bg-burgundy shadow-md',
    outline: 'bg-transparent border-2 border-burgundy text-burgundy hover:bg-burgundy hover:text-white',
  };

  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      {children}
    </motion.button>
  );
}

type IconButtonProps = {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
};

export function IconButton({
  children,
  className = '',
  onClick,
  disabled,
}: IconButtonProps) {
  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.05 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      className={`w-12 h-12 rounded-full bg-burgundy text-white flex items-center justify-center shadow-lg hover:bg-burgundy-dark transition-colors disabled:opacity-50 ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </motion.button>
  );
}
