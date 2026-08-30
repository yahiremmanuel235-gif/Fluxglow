import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'terracotta' | 'sage' | 'outline' | 'ghost' | 'glass' | 'sand';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-bold rounded-2xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none active:scale-[0.98]';

  const sizeClasses = {
    xs: 'text-[11px] px-3 py-1.5 gap-1.5 rounded-full',
    sm: 'text-xs px-3.5 py-2 gap-1.5 rounded-xl',
    md: 'text-sm px-5 py-2.5 gap-2 rounded-2xl',
    lg: 'text-base px-7 py-3.5 gap-2.5 rounded-2xl',
  };

  const variantClasses = {
    // Primary brand sage filled - text-white
    primary: 'bg-brand-sage-500 hover:bg-brand-sage-600 text-white shadow-2xs hover:shadow-xs focus-visible:ring-brand-sage-400',
    
    // Terracotta brand warm button - text-white
    terracotta: 'bg-brand-terracotta-500 hover:bg-brand-terracotta-600 text-white shadow-2xs hover:shadow-xs focus-visible:ring-brand-terracotta-400',

    // Explicit sage alias
    sage: 'bg-brand-sage-500 hover:bg-brand-sage-600 text-white shadow-2xs hover:shadow-xs focus-visible:ring-brand-sage-400',

    // Secondary soft background
    secondary: 'bg-brand-sage-100 hover:bg-brand-sage-200 text-brand-sage-900 border border-brand-sage-300 focus-visible:ring-brand-sage-400',

    // Sand soft tone
    sand: 'bg-brand-sand-100 hover:bg-brand-sand-200 text-stone-800 border border-brand-sand-300 shadow-2xs focus-visible:ring-brand-sand-400',

    // Outline subtle
    outline: 'bg-white hover:bg-brand-sand-100 text-stone-800 border border-brand-sand-300 hover:border-brand-sand-400 shadow-2xs focus-visible:ring-stone-400',

    // Ghost transparent
    ghost: 'bg-transparent hover:bg-stone-200/50 text-stone-700 hover:text-stone-900 focus-visible:ring-stone-400',

    // Glass style on dark or hero backgrounds
    glass: 'bg-white/20 backdrop-blur-md hover:bg-white/30 text-white border border-white/30 shadow-xs focus-visible:ring-white/50',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${widthClass} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : (
        leftIcon && <span className="shrink-0">{leftIcon}</span>
      )}
      {children && <span>{children}</span>}
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
};
