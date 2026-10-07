import React from 'react';

/**
 * Hand-drawn dynamic underline SVG with organic 1.5px baseline deflection.
 */
export const PenUnderline: React.FC<{ className?: string; color?: string }> = ({
  className = "w-full h-3 text-primary",
  color = "currentColor",
}) => (
  <svg
    className={`overflow-visible pointer-events-none ${className}`}
    fill="none"
    viewBox="0 0 180 12"
    preserveAspectRatio="none"
  >
    <path
      d="M2 4.5 C 50 6.5, 120 7.2, 178 3.5"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Alternative baseline bow underline used in the desktop dashboard hero header.
 */
export const HeroPenUnderline: React.FC<{ className?: string; color?: string }> = ({
  className = "w-44 h-3 text-primary",
  color = "currentColor",
}) => (
  <svg
    className={`overflow-visible pointer-events-none ${className}`}
    fill="none"
    viewBox="0 0 176 12"
  >
    <path
      d="M2 8.5C38 3.5 110 2.2 174 7.2"
      stroke={color}
      strokeWidth="1.75"
      strokeLinecap="round"
    />
  </svg>
);

/**
 * Hand-drawn circle with intentional open loop aperture (breathing terminal).
 */
export const PenCircle: React.FC<{ className?: string; color?: string }> = ({
  className = "absolute inset-0 w-full h-full text-primary",
  color = "currentColor",
}) => (
  <svg
    className={`overflow-visible pointer-events-none ${className}`}
    fill="none"
    viewBox="0 0 96 96"
  >
    <path
      d="M 48 8 C 74 7, 91 26, 89 52 C 87 75, 68 89, 45 88 C 22 87, 8 70, 9 46 C 10 23, 29 9, 52 9.5"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Architectural drafting arrow with 2-tick open barb.
 */
export const PenArrow: React.FC<{ className?: string; color?: string }> = ({
  className = "w-16 h-5 text-on-surface",
  color = "currentColor",
}) => (
  <svg
    className={`overflow-visible pointer-events-none ${className}`}
    fill="none"
    viewBox="0 0 80 24"
  >
    <path
      d="M 2 12 C 24 11.2, 52 13.1, 74 12"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M 64 6 L 75 12 L 65 18"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Diminutive 4-point/8-point spark star mirroring the NEST brand motif core.
 */
export const PenStar: React.FC<{ className?: string; color?: string }> = ({
  className = "w-4 h-4 text-primary",
  color = "currentColor",
}) => (
  <svg
    className={`overflow-visible pointer-events-none ${className}`}
    fill="none"
    viewBox="0 0 24 24"
  >
    <path
      d="M 12 3 L 12 21 M 3 12 L 21 12 M 6 6 L 18 18 M 18 6 L 6 18"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);

/**
 * Confident notation cross / triage tick for checklists and verification.
 */
export const PenCross: React.FC<{ className?: string; color?: string }> = ({
  className = "w-4 h-4 text-on-surface",
  color = "currentColor",
}) => (
  <svg
    className={`overflow-visible pointer-events-none ${className}`}
    fill="none"
    viewBox="0 0 16 16"
  >
    <path
      d="M 3.5 3.5 L 12.5 12.5 M 12.5 3.5 L 3.5 12.5"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);

/**
 * Translucent marker highlight wash for words in editorial headlines.
 */
export const MarkerHighlight: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => (
  <span className={`relative inline-block ${className}`}>
    <span className="relative z-10">{children}</span>
    <span className="absolute inset-x-[-4px] top-2 bottom-1 bg-primary/15 rounded-[2px] transform -rotate-1 pointer-events-none" />
  </span>
);
