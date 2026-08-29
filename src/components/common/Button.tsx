import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'terracotta' | 'sage' | 'outline' | 'ghost' | 'glass';
  size?: 'sm' | 'md' | 'lg';
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
    sm: 'text-xs px-3.5 py-2 gap-1.5 rounded-xl',
    md: 'text-sm px-5 py-2.5 gap-2 rounded-2xl',
    lg: 'text-base px-7 py-3.5 gap-2.5 rounded-2xl',
  };

  const variantClasses = {
    // Primary brand sage filled - ALWAYS text-white for pristine contrast
    primary: 'bg-[#548c71] hover:bg-[#42715b] text-white shadow-sm hover:shadow-md focus-visible:ring-[#548c71]',
    
    // Terracotta brand warm button - ALWAYS text-white for pristine contrast
    terracotta: 'bg-[#de6943] hover:bg-[#cb512e] text-white shadow-sm hover:shadow-md focus-visible:ring-[#de6943]',

    // Explicit sage alias
    sage: 'bg-[#548c71] hover:bg-[#42715b] text-white shadow-sm hover:shadow-md focus-visible:ring-[#548c71]',

    // Secondary soft background
    secondary: 'bg-[#e2eee6] hover:bg-[#c5ddd0] text-[#253d33] border border-[#c5ddd0] focus-visible:ring-[#548c71]',

    // Outline subtle
    outline: 'bg-white hover:bg-[#faf7f2] text-stone-800 border border-stone-300 hover:border-stone-400 shadow-2xs focus-visible:ring-stone-400',

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
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
};
