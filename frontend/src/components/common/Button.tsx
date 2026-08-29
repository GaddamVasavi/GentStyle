import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'gold' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0b0d10] disabled:opacity-50 disabled:cursor-not-allowed select-none rounded-md tracking-wider uppercase text-xs';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-[11px] gap-1.5',
    md: 'px-5 py-2.5 text-xs gap-2',
    lg: 'px-7 py-3.5 text-sm gap-2.5',
  };

  const variantStyles = {
    primary: 'bg-luxury-600 hover:bg-luxury-500 text-white shadow-glow hover:shadow-luxury-500/50 focus:ring-luxury-500',
    gold: 'bg-gradient-to-r from-gold-500 to-luxury-500 hover:from-gold-400 hover:to-luxury-400 text-gentblack font-semibold shadow-glow-gold focus:ring-gold-400',
    secondary: 'bg-gentcard hover:bg-gentborder text-gray-200 border border-gentborder focus:ring-gray-400',
    outline: 'bg-transparent border border-luxury-500/60 text-luxury-400 hover:bg-luxury-500/10 hover:border-luxury-400 focus:ring-luxury-400',
    ghost: 'bg-transparent hover:bg-white/5 text-gray-300 hover:text-white focus:ring-gray-400',
    danger: 'bg-red-600/90 hover:bg-red-500 text-white focus:ring-red-500',
  };

  return (
    <button
      className={twMerge(clsx(baseStyles, sizeStyles[size], variantStyles[variant], className))}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-current" />
          <span>Processing...</span>
        </>
      ) : (
        <>
          {leftIcon && <span className="inline-flex">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="inline-flex">{rightIcon}</span>}
        </>
      )}
    </button>
  );
};
