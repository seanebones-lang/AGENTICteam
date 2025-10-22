/**
 * Button Component
 */

import { FC, ButtonHTMLAttributes, ReactNode, cloneElement, isValidElement } from 'react';
import { clsx } from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'outline' | 'danger' | 'destructive' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  loading?: boolean;
  fullWidth?: boolean;
  asChild?: boolean;
}

export const Button: FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  disabled,
  className,
  asChild,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantStyles = {
    default: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
    outline: 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    destructive: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    ghost: 'hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-gray-500',
    link: 'text-blue-600 underline-offset-4 hover:underline focus:ring-blue-500',
  };
  
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    icon: 'p-2',
  };

  const combinedClassName = clsx(
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    fullWidth && 'w-full',
    (disabled || loading) && 'opacity-50 cursor-not-allowed',
    className
  );

  // If asChild is true, clone the child element and pass the className to it
  if (asChild && isValidElement(children)) {
    return cloneElement(children as any, {
      className: clsx((children as any).props.className, combinedClassName),
      ...(disabled && { 'aria-disabled': true }),
    });
  }

  return (
    <button
      className={combinedClassName}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center">
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
};

