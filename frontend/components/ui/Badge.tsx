import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'selected' | 'filter';
  onRemove?: () => void;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'default', 
  onRemove, 
  className = '' 
}) => {
  const baseClasses = 'inline-flex items-center gap-1 px-3 py-1 text-sm rounded-full transition-colors';
  
  const variantClasses = {
    default: 'bg-gray-100 text-gray-800',
    selected: 'bg-blue-100 text-blue-800',
    filter: 'bg-blue-100 text-blue-800 hover:bg-blue-200'
  };

  return (
    <span className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
      {onRemove && (
        <button
          onClick={onRemove}
          className="hover:bg-blue-200 rounded-full p-0.5 ml-1"
          aria-label="Remove filter"
        >
          ×
        </button>
      )}
    </span>
  );
};
