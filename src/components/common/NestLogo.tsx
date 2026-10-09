import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

import primaryLogo from '../../assets/brand/NEST_Primary.png';
import symbolLogo from '../../assets/brand/NEST_Symbol.png';
import wordmarkDefault from '../../assets/brand/NEST_Wordmark.png';
import wordmarkDark from '../../assets/brand/NEST_Wordmark_Dark.png';
import wordmarkLight from '../../assets/brand/NEST_Wordmark_Light.png';
import wordmarkAccent from '../../assets/brand/NEST_Wordmark_Accent.png';
import appIconBlue from '../../assets/brand/NEST_AppIcon_Blue.png';
import appIconDark from '../../assets/brand/NEST_AppIcon_Dark.png';

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
  const [loadError, setLoadError] = useState(false);

  let resolvedSrc = wordmarkDefault;

  if (variant === 'primary') {
    resolvedSrc = primaryLogo;
  } else if (variant === 'symbol') {
    resolvedSrc = symbolLogo;
  } else if (variant === 'wordmark') {
    resolvedSrc = isDark ? wordmarkLight : wordmarkDark;
  } else if (variant === 'wordmark-dark') {
    resolvedSrc = wordmarkDark;
  } else if (variant === 'wordmark-light') {
    resolvedSrc = wordmarkLight;
  } else if (variant === 'wordmark-accent') {
    resolvedSrc = wordmarkAccent;
  } else if (variant === 'app-icon-blue') {
    resolvedSrc = appIconBlue;
  } else if (variant === 'app-icon-dark') {
    resolvedSrc = appIconDark;
  }

  const style: React.CSSProperties = {};
  if (height) {
    style.height = typeof height === 'number' ? `${height}px` : height;
  }

  // Pure SVG Fallback if image network fails
  if (loadError) {
    return (
      <span
        style={style}
        translate="no"
        className={`notranslate inline-flex items-center font-display font-extrabold tracking-tight select-none ${
          isDark ? 'text-white' : 'text-neutral-900'
        } ${className}`}
      >
        NEST
      </span>
    );
  }

  return (
    <span translate="no" className="notranslate inline-flex items-center">
      <img
        src={resolvedSrc}
        alt={alt}
        style={style}
        onError={() => setLoadError(true)}
        className={`select-none object-contain pointer-events-none transition-opacity duration-150 ${className}`}
        draggable={false}
      />
    </span>
  );
};
