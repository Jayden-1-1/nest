import React, { useState } from 'react';

export interface AvatarProps {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  shape?: 'circle' | 'squircle';
  ring?: boolean;
  className?: string;
}

const SIZE_MAP = {
  xs: 'w-5 h-5 text-[9px]',
  sm: 'w-7 h-7 text-[10px]',
  md: 'w-9 h-9 text-xs',
  lg: 'w-12 h-12 text-sm font-semibold',
  xl: 'w-16 h-16 text-base font-bold',
  '2xl': 'w-20 h-20 text-xl font-bold',
};

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'Avatar',
  name = '',
  size = 'md',
  shape = 'circle',
  ring = true,
  className = '',
}) => {
  const [imgError, setImgError] = useState(false);

  const sizeClass = SIZE_MAP[size] || SIZE_MAP.md;
  const shapeClass = shape === 'squircle' ? 'rounded-2xl' : 'rounded-full';
  const ringClass = ring ? 'ring-1 ring-surface-container-highest shadow-xs' : '';

  // Get up to 2 initials
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join('') || '?';

  if (!src || imgError) {
    return (
      <div
        className={`relative inline-flex items-center justify-center shrink-0 select-none overflow-hidden bg-gradient-to-tr from-surface-container to-surface-container-high text-on-surface-variant font-mono ${sizeClass} ${shapeClass} ${ringClass} ${className}`}
        title={name || alt}
        aria-label={name || alt}
      >
        <span>{initials}</span>
      </div>
    );
  }

  return (
    <div
      className={`relative inline-block shrink-0 overflow-hidden select-none ${sizeClass} ${shapeClass} ${ringClass} ${className}`}
      title={name || alt}
    >
      <img
        src={src}
        alt={name || alt}
        onError={() => setImgError(true)}
        className="w-full h-full object-cover"
        loading="lazy"
      />
    </div>
  );
};
