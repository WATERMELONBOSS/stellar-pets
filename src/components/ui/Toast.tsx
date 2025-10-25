import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';
import { clsx } from 'clsx';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type,
  isVisible,
  onClose,
  duration = 3000,
}) => {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const icons = {
    success: <CheckCircle className="text-green-400" size={24} />,
    error: <XCircle className="text-red-400" size={24} />,
    warning: <AlertCircle className="text-yellow-400" size={24} />,
    info: <Info className="text-blue-400" size={24} />,
  };

  const backgrounds = {
    success: 'bg-green-900/90 border-green-500/50',
    error: 'bg-red-900/90 border-red-500/50',
    warning: 'bg-yellow-900/90 border-yellow-500/50',
    info: 'bg-blue-900/90 border-blue-500/50',
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: -50, x: '-50%' }}
          className={clsx(
            "fixed top-4 left-1/2 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl border backdrop-blur",
            backgrounds[type]
          )}
        >
          {icons[type]}
          <p className="text-white font-medium">{message}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};



