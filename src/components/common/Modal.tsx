import { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'small' | 'medium' | 'large';
}

export function Modal({ isOpen, onClose, title, children, size = 'medium' }: ModalProps) {
  if (!isOpen) return null;

  const sizeClasses = {
    small: 'md:max-w-md',
    medium: 'md:max-w-2xl',
    large: 'md:max-w-4xl'
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-0 md:px-4 pt-0 md:pt-4 pb-0 md:pb-20 text-center sm:p-0">
        {/* Backdrop */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        />

        {/* Modal - Full screen on mobile, centered on desktop */}
        <div className={`relative inline-block w-full h-full md:h-auto ${sizeClasses[size]} overflow-hidden text-left align-middle transition-all transform bg-white md:rounded-lg shadow-xl`}>
          {/* Header */}
          <div className="px-4 md:px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">{title}</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 w-11 h-11 flex items-center justify-center"
                aria-label="Close"
              >
                <span className="text-3xl">&times;</span>
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="px-4 md:px-6 py-4 overflow-y-auto max-h-[calc(100vh-80px)] md:max-h-[calc(100vh-200px)]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
