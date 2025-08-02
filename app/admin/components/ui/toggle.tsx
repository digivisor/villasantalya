'use client';

import React from 'react';

type ToggleProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
};

export default function Toggle({ checked, onChange, disabled = false, size = 'md' }: ToggleProps) {
  const handleChange = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  // Size sınıflarını belirle
  const getSize = () => {
    switch (size) {
      case 'sm':
        return {
          container: 'w-9 h-5',
          circle: 'w-3.5 h-3.5',
          translate: checked ? 'translate-x-4' : 'translate-x-0'
        };
      case 'lg':
        return {
          container: 'w-14 h-7',
          circle: 'w-6 h-6',
          translate: checked ? 'translate-x-7' : 'translate-x-0'
        };
      default:
        return {
          container: 'w-12 h-6',
          circle: 'w-5 h-5',
          translate: checked ? 'translate-x-6' : 'translate-x-0'
        };
    }
  };

  const sizeStyles = getSize();

  return (
    <button
      type="button"
      onClick={handleChange}
      disabled={disabled}
      className={`
        ${sizeStyles.container} 
        ${checked ? 'bg-green-500' : 'bg-gray-300'} 
        relative inline-flex flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
        transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
      aria-pressed={checked}
    >
      <span className="sr-only">{checked ? 'Aktif' : 'Pasif'}</span>
      <span
        aria-hidden="true"
        className={`
          ${sizeStyles.circle} 
          ${sizeStyles.translate} 
          pointer-events-none inline-block rounded-full bg-white shadow transform ring-0 transition duration-200 ease-in-out
        `}
      />
    </button>
  );
}