import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  className,
  disabled,
  ...props
}) => {
  const baseStyles = "font-bold rounded-xl transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg";
  
  const variants = {
    primary: "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white",
    secondary: "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white",
    danger: "bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white",
    success: "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white",
  };
  
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.05 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.95 }}
      className={clsx(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <span className="animate-spin">⚡</span> Loading...
        </span>
      ) : (
        children
      )}
    </motion.button>
  );
};



