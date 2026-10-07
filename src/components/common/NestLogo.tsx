import React from 'react';
import { useTheme } from '../../context/ThemeContext';

export type LogoVariant = 
  | 'primary'          // Full stacked lockup (Symbol + Wordmark)
  | 'symbol'           // Standalone woven nest motif with star
  | 'wordmark'         // Auto-adjusts: Light on dark, Dark on light
  | 'wordmark-dark'    // Master dark wordmark on light surfaces
  | 'wordmark-light'   // Crisp light wordmark on dark surfaces
  | 'wordmark-accent'  // Vibrant electric cobalt blue wordmark
  | 'app-icon-blue'    // Vibrant cobalt blue squircle
  | 'app-icon-dark';   // Charcoal / Midnight squircle

interface NestLogoProps {
  variant?: LogoVariant;
  className?: string;
  alt?: string;
  height?: number | string;
}

export const NestLogo: React.FC<NestLogoProps> = ({
  variant = 'wordmark',
  className = '',
  alt = 'NEST',
  height,
}) => {
  const { isDark } = useTheme();

  let resolvedSrc = '/brand/NEST_Wordmark.png';

  if (variant === 'primary') {
    resolvedSrc = '/brand/NEST_Primary.png';
  } else if (variant === 'symbol') {
    resolvedSrc = '/brand/NEST_Symbol.png';
  } else if (variant === 'wordmark') {
    resolvedSrc = isDark ? '/brand/NEST_Wordmark_Light.png' : '/brand/NEST_Wordmark_Dark.png';
  } else if (variant === 'wordmark-dark') {
    resolvedSrc = '/brand/NEST_Wordmark_Dark.png';
  } else if (variant === 'wordmark-light') {
    resolvedSrc = '/brand/NEST_Wordmark_Light.png';
  } else if (variant === 'wordmark-accent') {
    resolvedSrc = '/brand/NEST_Wordmark_Accent.png';
  } else if (variant === 'app-icon-blue') {
    resolvedSrc = '/brand/NEST_AppIcon_Blue.png';
  } else if (variant === 'app-icon-dark') {
    resolvedSrc = '/brand/NEST_AppIcon_Dark.png';
  }

  const style: React.CSSProperties = {};
  if (height) {
    style.height = typeof height === 'number' ? `${height}px` : height;
  }

  return (
    <img
      src={resolvedSrc}
      alt={alt}
      style={style}
      className={`select-none object-contain pointer-events-none transition-opacity duration-150 ${className}`}
      draggable={false}
    />
  );
};
