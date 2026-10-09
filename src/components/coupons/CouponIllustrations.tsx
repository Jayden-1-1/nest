import React from 'react';
import { CouponThemeId } from '../../types/coupon';

interface IllustrationProps {
  className?: string;
  alt?: string;
}

/**
 * 1. Play All Night — Играть всю ночь
 * Deep midnight-blue background, large crescent moon, scattered stars,
 * stylish gamepad controller, glowing purple-blue horizon, sparkles.
 */
export const PlayAllNightIllustration: React.FC<IllustrationProps> = ({ className = 'w-full h-full', alt }) => (
  <svg
    viewBox="0 0 280 160"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
    aria-label={alt || 'Play All Night illustration'}
  >
    <defs>
      <linearGradient id="nightSkyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0B1026" />
        <stop offset="50%" stopColor="#151A3E" />
        <stop offset="100%" stopColor="#1E1B4B" />
      </linearGradient>
      <linearGradient id="neonHorizon" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#4338CA" stopOpacity="0.8" />
        <stop offset="50%" stopColor="#6366F1" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#818CF8" stopOpacity="0.9" />
      </linearGradient>
      <linearGradient id="controllerBody" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1E293B" />
        <stop offset="50%" stopColor="#0F172A" />
        <stop offset="100%" stopColor="#020617" />
      </linearGradient>
      <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#818CF8" stopOpacity="0.35" />
        <stop offset="100%" stopColor="#818CF8" stopOpacity="0" />
      </radialGradient>
      <filter id="neonBlur" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    {/* Background canvas */}
    <rect width="280" height="160" rx="12" fill="url(#nightSkyGrad)" />

    {/* Neon Horizon Glow */}
    <ellipse cx="140" cy="165" rx="130" ry="45" fill="url(#neonHorizon)" opacity="0.45" />

    {/* Moon Glow Halo */}
    <circle cx="215" cy="48" r="42" fill="url(#moonGlow)" />

    {/* Large Crescent Moon */}
    <path
      d="M216 22C200 22 187 35 187 51C187 67 200 80 216 80C222 80 227 78 231 75C220 74 211 65 211 53C211 41 219 31 230 27C226 24 221 22 216 22Z"
      fill="#EEF2FF"
    />
    <circle cx="218" cy="46" r="1.5" fill="#C7D2FE" opacity="0.6" />
    <circle cx="212" cy="56" r="2" fill="#C7D2FE" opacity="0.5" />

    {/* Constellation Stars */}
    <g fill="#A5B4FC" opacity="0.85">
      <circle cx="36" cy="32" r="1.5" />
      <circle cx="68" cy="24" r="1.2" />
      <circle cx="95" cy="42" r="1.8" />
      <circle cx="50" cy="58" r="1.2" />
      <circle cx="142" cy="28" r="1.5" />
      <circle cx="168" cy="46" r="1.2" />
      <circle cx="248" cy="40" r="1.5" />
      <circle cx="260" cy="78" r="1.2" />
      <line x1="36" y1="32" x2="68" y2="24" stroke="#818CF8" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.4" />
      <line x1="68" y1="24" x2="95" y2="42" stroke="#818CF8" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.4" />
      <line x1="95" y1="42" x2="50" y2="58" stroke="#818CF8" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.4" />
    </g>

    {/* Big 4-pointed Sparkles */}
    <path d="M120 40 L122 45 L127 47 L122 49 L120 54 L118 49 L113 47 L118 45 Z" fill="#E0E7FF" opacity="0.9" />
    <path d="M246 95 L247 98 L250 99 L247 100 L246 103 L245 100 L242 99 L245 98 Z" fill="#818CF8" opacity="0.75" />
    <path d="M42 92 L43 94 L46 95 L43 96 L42 99 L41 96 L38 95 L41 94 Z" fill="#C7D2FE" opacity="0.8" />

    {/* Gaming Controller Underglow */}
    <ellipse cx="138" cy="112" rx="72" ry="24" fill="#6366F1" opacity="0.4" filter="url(#neonBlur)" />

    {/* Stylish Game Controller */}
    <g transform="translate(68, 62)">
      {/* Outer Glow Outline */}
      <path
        d="M24 38 C 24 20, 42 16, 70 16 C 98 16, 116 20, 116 38 C 116 56, 126 78, 112 88 C 100 96, 88 78, 76 74 C 72 73, 68 73, 64 74 C 52 78, 40 96, 28 88 C 14 78, 24 56, 24 38 Z"
        fill="url(#controllerBody)"
        stroke="#6366F1"
        strokeWidth="2.5"
      />
      {/* Inner Horizon Accent Trim */}
      <path
        d="M42 28 C 54 24, 86 24, 98 28"
        stroke="#818CF8"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* D-Pad on Left */}
      <g transform="translate(42, 40)">
        <path d="M6 0 H12 V6 H18 V12 H12 V18 H6 V12 H0 V6 H6 Z" fill="#334155" stroke="#475569" strokeWidth="0.8" />
        <circle cx="9" cy="9" r="1.5" fill="#64748B" />
      </g>

      {/* ABXY Action Buttons on Right */}
      <g transform="translate(86, 38)">
        <circle cx="11" cy="4" r="3.2" fill="#38BDF8" /> {/* Y - Cyan */}
        <circle cx="4" cy="11" r="3.2" fill="#F43F5E" /> {/* X - Rose */}
        <circle cx="18" cy="11" r="3.2" fill="#34D399" /> {/* B - Mint */}
        <circle cx="11" cy="18" r="3.2" fill="#FBBF24" /> {/* A - Amber */}
      </g>

      {/* Analog Thumbsticks */}
      <g transform="translate(56, 52)">
        <circle cx="6" cy="6" r="7.5" fill="#1E293B" stroke="#4F46E5" strokeWidth="1.2" />
        <circle cx="6" cy="6" r="4" fill="#0F172A" />
      </g>
      <g transform="translate(74, 52)">
        <circle cx="6" cy="6" r="7.5" fill="#1E293B" stroke="#4F46E5" strokeWidth="1.2" />
        <circle cx="6" cy="6" r="4" fill="#0F172A" />
      </g>

      {/* Center Home Logo / Light */}
      <circle cx="70" cy="38" r="3" fill="#A855F7" />
      <circle cx="70" cy="38" r="1.2" fill="#FFFFFF" />
    </g>
  </svg>
);

/**
 * 2. Favorite Snacks — Любимые снеки
 * Open snack bag, several flying chips, sparkles, dynamic motion lines.
 * Palette: orange, sunny yellow, warm cream.
 */
export const FavoriteSnacksIllustration: React.FC<IllustrationProps> = ({ className = 'w-full h-full', alt }) => (
  <svg
    viewBox="0 0 280 160"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
    aria-label={alt || 'Favorite Snacks illustration'}
  >
    <defs>
      <linearGradient id="snackBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#451A03" />
        <stop offset="60%" stopColor="#7C2D12" />
        <stop offset="100%" stopColor="#9A3412" />
      </linearGradient>
      <linearGradient id="bagGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#EA580C" />
        <stop offset="50%" stopColor="#F97316" />
        <stop offset="100%" stopColor="#FB923C" />
      </linearGradient>
      <linearGradient id="chipGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FDE047" />
        <stop offset="100%" stopColor="#F59E0B" />
      </linearGradient>
    </defs>

    {/* Background */}
    <rect width="280" height="160" rx="12" fill="url(#snackBg)" />

    {/* Warm glow */}
    <circle cx="150" cy="85" r="70" fill="#F97316" opacity="0.25" filter="blur(20px)" />

    {/* Hand-drawn dynamic motion lines */}
    <path d="M125 75 Q150 45 175 40" stroke="#FDE68A" strokeWidth="2" strokeDasharray="4 4" strokeLinecap="round" />
    <path d="M135 60 Q180 30 210 50" stroke="#FDBA74" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M100 65 Q115 30 140 25" stroke="#FDE68A" strokeWidth="1.5" strokeDasharray="3 3" strokeLinecap="round" />

    {/* Sparkles */}
    <path d="M220 30 L222 34 L226 36 L222 38 L220 42 L218 38 L214 36 L218 34 Z" fill="#FEF08A" />
    <path d="M175 22 L176 25 L179 26 L176 27 L175 30 L174 27 L171 26 L174 25 Z" fill="#FDE047" />
    <path d="M70 45 L71 48 L74 49 L71 50 L70 53 L69 50 L66 49 L69 48 Z" fill="#FDBA74" />
    <circle cx="238" cy="62" r="2.5" fill="#FEF08A" />
    <circle cx="85" cy="30" r="2" fill="#FEF08A" />

    {/* Flying crispy chips */}
    {/* Chip 1 */}
    <path
      d="M178 36 C190 32, 204 42, 196 52 C188 60, 172 50, 178 36 Z"
      fill="url(#chipGrad)"
      stroke="#D97706"
      strokeWidth="1.5"
    />
    <path d="M182 42 Q188 44 192 48" stroke="#B45309" strokeWidth="1" strokeLinecap="round" />

    {/* Chip 2 */}
    <path
      d="M138 22 C148 18, 160 26, 154 36 C146 44, 132 34, 138 22 Z"
      fill="url(#chipGrad)"
      stroke="#D97706"
      strokeWidth="1.5"
    />
    <path d="M142 27 Q147 29 150 32" stroke="#B45309" strokeWidth="1" strokeLinecap="round" />

    {/* Chip 3 (smaller) */}
    <path
      d="M214 62 C222 58, 230 65, 226 72 C220 78, 210 70, 214 62 Z"
      fill="url(#chipGrad)"
      stroke="#D97706"
      strokeWidth="1.2"
    />

    {/* Crunchy Crumbs */}
    <circle cx="160" cy="52" r="2" fill="#FBBF24" />
    <circle cx="170" cy="65" r="1.5" fill="#FDE047" />
    <circle cx="205" cy="48" r="1.8" fill="#F59E0B" />
    <circle cx="132" cy="42" r="2.2" fill="#FBBF24" />

    {/* Open Snack Bag */}
    <g transform="translate(70, 52)">
      {/* Bag Body */}
      <path
        d="M20 38 L30 92 C31 96, 35 98, 40 98 H82 C87 98, 91 96, 92 92 L102 38 Z"
        fill="url(#bagGrad)"
        stroke="#C2410C"
        strokeWidth="2"
      />
      {/* Ripped Open Top Edge (Sawtooth / Crinkled) */}
      <path
        d="M18 38 L24 32 L32 38 L40 30 L48 37 L58 29 L68 37 L78 30 L86 37 L94 31 L102 38"
        fill="#FFEDD5"
        stroke="#EA580C"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Snack Bag Graphic / Banner */}
      <rect x="36" y="52" width="50" height="26" rx="6" fill="#FEF08A" />
      <path d="M42 65 Q61 58 80 65" stroke="#C2410C" strokeWidth="3" strokeLinecap="round" />
      <circle cx="61" cy="65" r="3.5" fill="#EA580C" />
      {/* Light highlights on foil packaging */}
      <path d="M28 46 L35 88" stroke="#FFEDD5" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
    </g>
  </svg>
);

/**
 * 3. Choose the Movie — Выбор фильма
 * Cinema ticket, popcorn bucket, film strip, cinema star.
 * Palette: deep red, cream, dark burgundy.
 */
export const ChooseMovieIllustration: React.FC<IllustrationProps> = ({ className = 'w-full h-full', alt }) => (
  <svg
    viewBox="0 0 280 160"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
    aria-label={alt || 'Choose the Movie illustration'}
  >
    <defs>
      <linearGradient id="movieBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#450A0A" />
        <stop offset="60%" stopColor="#7F1D1D" />
        <stop offset="100%" stopColor="#991B1B" />
      </linearGradient>
    </defs>

    {/* Background */}
    <rect width="280" height="160" rx="12" fill="url(#movieBg)" />

    {/* Soft red glow */}
    <circle cx="140" cy="80" r="75" fill="#EF4444" opacity="0.2" filter="blur(25px)" />

    {/* Curving 35mm Film Strip */}
    <path
      d="M20 120 C60 140, 110 40, 160 30 C200 20, 240 50, 265 60"
      stroke="#18181B"
      strokeWidth="24"
      strokeLinecap="round"
    />
    <path
      d="M20 120 C60 140, 110 40, 160 30 C200 20, 240 50, 265 60"
      stroke="#FEF3C7"
      strokeWidth="1.5"
      strokeDasharray="4 6"
      strokeLinecap="round"
    />

    {/* Cinema Star */}
    <g transform="translate(225, 25)">
      <path
        d="M12 0 L15.5 8 L24 9.5 L17.5 15.5 L19.5 24 L12 19.5 L4.5 24 L6.5 15.5 L0 9.5 L8.5 8 Z"
        fill="#FBBF24"
      />
    </g>
    <circle cx="48" cy="38" r="2.5" fill="#FDE68A" />
    <circle cx="240" cy="115" r="2" fill="#FDE68A" />

    {/* Golden Cinema Ticket */}
    <g transform="translate(50, 48) rotate(-14)">
      <rect x="0" y="0" width="84" height="48" rx="6" fill="#F59E0B" stroke="#78350F" strokeWidth="2" />
      {/* Perforated Semicircle Cutouts */}
      <circle cx="0" cy="24" r="6" fill="#7F1D1D" />
      <circle cx="84" cy="24" r="6" fill="#7F1D1D" />
      {/* Dashed line */}
      <line x1="28" y1="4" x2="28" y2="44" stroke="#78350F" strokeWidth="1.5" strokeDasharray="3 3" />
      {/* Text Lines & Star */}
      <rect x="36" y="14" width="36" height="5" rx="2.5" fill="#78350F" />
      <rect x="36" y="24" width="26" height="4" rx="2" fill="#78350F" />
      <path d="M14 18 L15.5 22 L20 23 L16.5 26 L17.5 30 L14 28 L10.5 30 L11.5 26 L8 23 L12.5 22 Z" fill="#FEF3C7" />
    </g>

    {/* Popcorn Bucket */}
    <g transform="translate(142, 45)">
      {/* Fluffy Popcorn Tops */}
      <circle cx="22" cy="14" r="9" fill="#FEF3C7" stroke="#FDE68A" strokeWidth="1" />
      <circle cx="36" cy="8" r="10" fill="#FFFBEB" stroke="#FDE68A" strokeWidth="1" />
      <circle cx="50" cy="12" r="9" fill="#FEF3C7" stroke="#FDE68A" strokeWidth="1" />
      <circle cx="28" cy="22" r="8" fill="#FFFBEB" />
      <circle cx="44" cy="20" r="8" fill="#FEF3C7" />
      <circle cx="36" cy="18" r="7" fill="#FDE047" />

      {/* Bucket Body */}
      <path
        d="M14 26 L22 84 C23 88, 27 90, 31 90 H43 C47 90, 51 88, 52 84 L60 26 Z"
        fill="#FFFFFF"
        stroke="#991B1B"
        strokeWidth="2"
      />
      {/* Red Stripes on Bucket */}
      <path d="M24 26 L29 88 H35 L32 26 Z" fill="#DC2626" />
      <path d="M42 26 L39 88 H45 L49 26 Z" fill="#DC2626" />
    </g>
  </svg>
);

/**
 * 4. Favorite Dinner — Любимый ужин
 * Appetizing dinner plate, fork, hand-drawn heart, subtle lines.
 * Palette: leafy green, warm cream.
 */
export const FavoriteDinnerIllustration: React.FC<IllustrationProps> = ({ className = 'w-full h-full', alt }) => (
  <svg
    viewBox="0 0 280 160"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
    aria-label={alt || 'Favorite Dinner illustration'}
  >
    <defs>
      <linearGradient id="dinnerBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#064E3B" />
        <stop offset="60%" stopColor="#065F46" />
        <stop offset="100%" stopColor="#047857" />
      </linearGradient>
    </defs>

    <rect width="280" height="160" rx="12" fill="url(#dinnerBg)" />

    <circle cx="140" cy="80" r="75" fill="#34D399" opacity="0.15" filter="blur(25px)" />

    {/* Cozy decorative table ring */}
    <circle cx="140" cy="82" r="62" stroke="#A7F3D0" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />

    {/* Dinner Plate */}
    <g transform="translate(95, 36)">
      <circle cx="45" cy="45" r="44" fill="#F0FDF4" stroke="#6EE7B7" strokeWidth="2.5" />
      <circle cx="45" cy="45" r="34" fill="#FFFFFF" stroke="#A7F3D0" strokeWidth="1.5" />
      
      {/* Savory Dish presentation */}
      <path d="M30 46 C32 36, 58 36, 60 46 C60 56, 30 56, 30 46 Z" fill="#D97706" />
      <circle cx="45" cy="43" r="5" fill="#DC2626" /> {/* Cherry tomato garnish */}
      {/* Fresh basil / herb leaf */}
      <path d="M47 38 C54 34, 56 42, 47 43 Z" fill="#15803D" />
      <path d="M42 38 C36 34, 34 42, 42 43 Z" fill="#16A34A" />

      {/* Hand-drawn love heart above dish */}
      <path
        d="M45 23 C42 18, 35 18, 35 23 C35 28, 45 33, 45 33 C45 33, 55 28, 55 23 C55 18, 48 18, 45 23 Z"
        fill="#EF4444"
      />
    </g>

    {/* Fork on Left */}
    <g transform="translate(62, 44)">
      <path d="M12 72 V36" stroke="#FEF3C7" strokeWidth="3" strokeLinecap="round" />
      {/* Fork Prongs */}
      <path d="M5 14 V26 C5 32, 19 32, 19 26 V14" stroke="#FEF3C7" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M12 14 V28" stroke="#FEF3C7" strokeWidth="2" strokeLinecap="round" />
    </g>

    {/* Knife on Right */}
    <g transform="translate(196, 44)">
      <path d="M8 72 V14 C14 16, 16 28, 14 38 L8 42" stroke="#FEF3C7" strokeWidth="2.5" fill="#FEF3C7" strokeLinecap="round" strokeLinejoin="round" />
    </g>

    {/* Warm aroma swirls */}
    <path d="M132 24 Q138 14 135 6" stroke="#FDE68A" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
    <path d="M148 24 Q154 16 150 8" stroke="#FDE68A" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
  </svg>
);

/**
 * 5. Special Surprise — Особенный сюрприз
 * Large gift box, ribbon, confetti, glowing sparkles.
 * Palette: teal, coral, soft cream.
 */
export const SpecialSurpriseIllustration: React.FC<IllustrationProps> = ({ className = 'w-full h-full', alt }) => (
  <svg
    viewBox="0 0 280 160"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
    aria-label={alt || 'Special Surprise illustration'}
  >
    <defs>
      <linearGradient id="surpriseBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#115E59" />
        <stop offset="60%" stopColor="#0F766E" />
        <stop offset="100%" stopColor="#0D9488" />
      </linearGradient>
      <linearGradient id="boxGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FDA4AF" />
        <stop offset="50%" stopColor="#FB7185" />
        <stop offset="100%" stopColor="#F43F5E" />
      </linearGradient>
    </defs>

    <rect width="280" height="160" rx="12" fill="url(#surpriseBg)" />

    <circle cx="140" cy="85" r="75" fill="#2DD4BF" opacity="0.2" filter="blur(25px)" />

    {/* Bursting Confetti */}
    <g>
      <rect x="52" y="32" width="6" height="3" rx="1.5" fill="#FDE047" transform="rotate(25 52 32)" />
      <rect x="80" y="24" width="7" height="3" rx="1.5" fill="#38BDF8" transform="rotate(-35 80 24)" />
      <rect x="195" y="28" width="6" height="3" rx="1.5" fill="#F43F5E" transform="rotate(45 195 28)" />
      <rect x="225" y="38" width="7" height="3.5" rx="1.5" fill="#FDE047" transform="rotate(-20 225 38)" />
      <circle cx="64" cy="58" r="2.5" fill="#A7F3D0" />
      <circle cx="218" cy="65" r="3" fill="#FED7AA" />
      <circle cx="140" cy="18" r="2.5" fill="#FEF08A" />

      {/* Sparkles */}
      <path d="M102 36 L103 40 L107 41 L103 42 L102 46 L101 42 L97 41 L101 40 Z" fill="#FEF9C3" />
      <path d="M178 30 L179 34 L183 35 L179 36 L178 40 L177 36 L173 35 L177 34 Z" fill="#FEF9C3" />
    </g>

    {/* Large Gift Box */}
    <g transform="translate(100, 48)">
      {/* Box base */}
      <rect x="8" y="32" width="64" height="54" rx="4" fill="url(#boxGrad)" stroke="#BE123C" strokeWidth="2" />
      {/* Box lid */}
      <rect x="4" y="22" width="72" height="15" rx="3" fill="#FB7185" stroke="#BE123C" strokeWidth="2" />

      {/* Golden Vertical Ribbon */}
      <rect x="34" y="22" width="12" height="64" fill="#FDE047" stroke="#CA8A04" strokeWidth="1" />
      {/* Golden Horizontal Ribbon */}
      <rect x="8" y="52" width="64" height="12" fill="#FDE047" stroke="#CA8A04" strokeWidth="1" />

      {/* Grand Satin Bow on Top */}
      <path
        d="M40 22 C26 6, 18 16, 36 22 Z"
        fill="#FEF08A"
        stroke="#CA8A04"
        strokeWidth="1.5"
      />
      <path
        d="M40 22 C54 6, 62 16, 44 22 Z"
        fill="#FEF08A"
        stroke="#CA8A04"
        strokeWidth="1.5"
      />
      <circle cx="40" cy="22" r="5" fill="#EAB308" />
    </g>
  </svg>
);

/**
 * 6. Massage for Mom — Массаж маме
 * Elegant abstract hands and relaxed shoulders, lavender sprig, calming lines.
 * Palette: muted rose, burgundy, warm ivory.
 */
export const MassageMomIllustration: React.FC<IllustrationProps> = ({ className = 'w-full h-full', alt }) => (
  <svg
    viewBox="0 0 280 160"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
    aria-label={alt || 'Massage for Mom illustration'}
  >
    <defs>
      <linearGradient id="massageBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4C0519" />
        <stop offset="60%" stopColor="#881337" />
        <stop offset="100%" stopColor="#9F1239" />
      </linearGradient>
    </defs>

    <rect width="280" height="160" rx="12" fill="url(#massageBg)" />

    <circle cx="140" cy="80" r="75" fill="#FB7185" opacity="0.2" filter="blur(25px)" />

    {/* Calming zen wave lines */}
    <path d="M30 110 C80 90, 120 120, 180 100 C220 85, 250 105, 270 95" stroke="#FECDD3" strokeWidth="1.5" opacity="0.4" strokeLinecap="round" />
    <path d="M40 125 C90 105, 130 135, 190 115 C230 100, 260 120, 275 110" stroke="#FECDD3" strokeWidth="1" opacity="0.3" strokeLinecap="round" />

    {/* Relaxed Shoulders & Neck Silhouette */}
    <path
      d="M80 120 C95 95, 120 80, 140 80 C160 80, 185 95, 200 120"
      stroke="#FFF1F2"
      strokeWidth="3.5"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M130 80 V62 C130 52, 150 52, 150 62 V80"
      stroke="#FFF1F2"
      strokeWidth="3"
      strokeLinecap="round"
      fill="none"
    />

    {/* Elegant Caring Hands Resting Gently on Shoulders */}
    {/* Left Hand */}
    <g transform="translate(100, 68)">
      <path
        d="M2 18 C10 8, 24 10, 30 18 C26 24, 14 26, 2 18 Z"
        fill="#FFE4E6"
        stroke="#E11D48"
        strokeWidth="1.5"
      />
    </g>
    {/* Right Hand */}
    <g transform="translate(150, 68)">
      <path
        d="M28 18 C20 8, 6 10, 0 18 C4 24, 16 26, 28 18 Z"
        fill="#FFE4E6"
        stroke="#E11D48"
        strokeWidth="1.5"
      />
    </g>

    {/* Lavender Sprig with delicate florets */}
    <g transform="translate(42, 35) rotate(-18)">
      {/* Stem */}
      <path d="M15 70 Q20 35 24 6" stroke="#4ADE80" strokeWidth="1.5" strokeLinecap="round" />
      {/* Florets */}
      <ellipse cx="23" cy="10" rx="3.5" ry="5" fill="#C084FC" />
      <ellipse cx="20" cy="18" rx="4" ry="5.5" fill="#A855F7" />
      <ellipse cx="27" cy="22" rx="4" ry="5.5" fill="#C084FC" />
      <ellipse cx="19" cy="28" rx="4.5" ry="6" fill="#A855F7" />
      <ellipse cx="28" cy="32" rx="4.5" ry="6" fill="#C084FC" />
      <ellipse cx="18" cy="40" rx="4" ry="5.5" fill="#A855F7" />
      {/* Small leaf */}
      <path d="M19 50 C12 46, 10 52, 18 54 Z" fill="#4ADE80" />
    </g>
  </svg>
);

/**
 * 7. Coffee and a Break — Кофе и отдых
 * Ceramic coffee cup, steam curls, tiny sun, organic lines.
 * Palette: coffee brown, terracotta, ivory.
 */
export const CoffeeBreakIllustration: React.FC<IllustrationProps> = ({ className = 'w-full h-full', alt }) => (
  <svg
    viewBox="0 0 280 160"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
    aria-label={alt || 'Coffee and a Break illustration'}
  >
    <defs>
      <linearGradient id="coffeeBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#451A03" />
        <stop offset="60%" stopColor="#78350F" />
        <stop offset="100%" stopColor="#92400E" />
      </linearGradient>
    </defs>

    <rect width="280" height="160" rx="12" fill="url(#coffeeBg)" />

    <circle cx="140" cy="85" r="70" fill="#EA580C" opacity="0.2" filter="blur(25px)" />

    {/* Warm morning sun */}
    <g transform="translate(205, 25)">
      <circle cx="16" cy="16" r="14" fill="#FDE047" opacity="0.9" />
      <path d="M16 0 V-4 M16 32 V36 M0 16 H-4 M32 16 H36 M5 5 L2 2 M27 27 L30 30 M5 27 L2 30 M27 5 L30 2" stroke="#FDE047" strokeWidth="1.5" strokeLinecap="round" />
    </g>

    {/* Steam curls */}
    <g stroke="#FED7AA" strokeWidth="2" strokeLinecap="round" opacity="0.75">
      <path d="M130 46 C124 38, 134 30, 128 20" />
      <path d="M145 42 C139 34, 150 24, 144 14" />
      <path d="M158 46 C152 38, 162 30, 156 20" />
    </g>

    {/* Ceramic Saucer */}
    <ellipse cx="142" cy="115" rx="55" ry="12" fill="#FEF3C7" stroke="#D97706" strokeWidth="2" />
    <ellipse cx="142" cy="113" rx="42" ry="7" fill="#FDE68A" />

    {/* Ceramic Coffee Cup */}
    <g transform="translate(112, 54)">
      {/* Cup handle */}
      <path
        d="M56 16 C68 16, 70 36, 56 42"
        stroke="#FEF3C7"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Cup body */}
      <path
        d="M6 8 H56 C56 8, 54 48, 31 48 C8 48, 6 8, 6 8 Z"
        fill="#FFFBEB"
        stroke="#D97706"
        strokeWidth="2"
      />
      {/* Rich Espresso / Crema Surface */}
      <ellipse cx="31" cy="12" rx="22" ry="6" fill="#78350F" />
      {/* Heart foam art */}
      <path
        d="M31 15 C29 12, 25 12, 25 15 C25 18, 31 20, 31 20 C31 20, 37 18, 37 15 C37 12, 33 12, 31 15 Z"
        fill="#FEF3C7"
      />
    </g>
  </svg>
);

/**
 * 8. Dinner Without Cooking — Ужин без готовки
 * Covered cloche serving dish, cutlery, refined sparkles.
 * Palette: forest green, muted gold, cream.
 */
export const DinnerNoCookIllustration: React.FC<IllustrationProps> = ({ className = 'w-full h-full', alt }) => (
  <svg
    viewBox="0 0 280 160"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
    aria-label={alt || 'Dinner Without Cooking illustration'}
  >
    <defs>
      <linearGradient id="clocheBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#064E3B" />
        <stop offset="60%" stopColor="#14532D" />
        <stop offset="100%" stopColor="#166534" />
      </linearGradient>
      <linearGradient id="silverCloche" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F8FAFC" />
        <stop offset="50%" stopColor="#E2E8F0" />
        <stop offset="100%" stopColor="#94A3B8" />
      </linearGradient>
    </defs>

    <rect width="280" height="160" rx="12" fill="url(#clocheBg)" />

    <circle cx="140" cy="80" r="75" fill="#F59E0B" opacity="0.15" filter="blur(25px)" />

    {/* Sparkles of luxury */}
    <path d="M68 40 L70 44 L74 46 L70 48 L68 52 L66 48 L62 46 L66 44 Z" fill="#FDE047" />
    <path d="M210 35 L212 39 L216 41 L212 43 L210 47 L208 43 L204 41 L208 39 Z" fill="#FDE047" />
    <circle cx="196" cy="62" r="2.5" fill="#FEF9C3" />
    <circle cx="82" cy="74" r="2" fill="#FEF9C3" />

    {/* Silver Cloche Serving Platter */}
    <g transform="translate(90, 42)">
      {/* Platter tray */}
      <ellipse cx="50" cy="68" rx="60" ry="10" fill="#FEF3C7" stroke="#D97706" strokeWidth="2.5" />

      {/* Cloche Dome */}
      <path
        d="M8 68 C8 32, 92 32, 92 68 Z"
        fill="url(#silverCloche)"
        stroke="#CBD5E1"
        strokeWidth="2"
      />
      {/* Dome Top Handle */}
      <circle cx="50" cy="28" r="6" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
      {/* Specular curved reflection on dome */}
      <path d="M26 62 C26 40, 74 40, 74 62" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.75" />
    </g>

    {/* Cutlery Accents */}
    <g transform="translate(48, 55)">
      {/* Fork */}
      <path d="M12 55 V18 M7 18 V26 C7 29, 17 29, 17 26 V18" stroke="#FEF9C3" strokeWidth="2" strokeLinecap="round" />
    </g>
    <g transform="translate(216, 55)">
      {/* Spoon */}
      <path d="M10 55 V28 M10 18 C5 18, 5 28, 10 28 C15 28, 15 18, 10 18 Z" stroke="#FEF9C3" strokeWidth="2" strokeLinecap="round" />
    </g>
  </svg>
);

/**
 * 9. Relaxing Evening — Вечер отдыха
 * Cozy armchair, open book, crescent moon, warm ambient light.
 * Palette: plum, beige, muted lavender.
 */
export const RelaxingEveningIllustration: React.FC<IllustrationProps> = ({ className = 'w-full h-full', alt }) => (
  <svg
    viewBox="0 0 280 160"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
    aria-label={alt || 'Relaxing Evening illustration'}
  >
    <defs>
      <linearGradient id="eveningBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3B0764" />
        <stop offset="60%" stopColor="#581C87" />
        <stop offset="100%" stopColor="#6B21A8" />
      </linearGradient>
    </defs>

    <rect width="280" height="160" rx="12" fill="url(#eveningBg)" />

    <circle cx="140" cy="80" r="75" fill="#C084FC" opacity="0.2" filter="blur(25px)" />

    {/* Crescent Moon through window */}
    <g transform="translate(205, 20)">
      <circle cx="16" cy="16" r="14" stroke="#E9D5FF" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
      <path
        d="M20 6 C13 6, 8 11, 8 18 C8 25, 13 30, 20 30 C22 30, 24 29, 26 28 C21 27, 17 23, 17 18 C17 13, 21 9, 26 8 C24 7, 22 6, 20 6 Z"
        fill="#F3E8FF"
      />
      <circle cx="10" cy="8" r="1.5" fill="#E9D5FF" />
    </g>

    {/* Warm Floor Lamp Glow on Left */}
    <g transform="translate(58, 30)">
      {/* Lamp shade */}
      <path d="M12 28 L24 12 H36 L48 28 Z" fill="#FDE047" opacity="0.85" />
      <line x1="30" y1="28" x2="30" y2="95" stroke="#E9D5FF" strokeWidth="2.5" />
      <path d="M18 95 H42" stroke="#E9D5FF" strokeWidth="3" strokeLinecap="round" />
    </g>

    {/* Cozy Armchair */}
    <g transform="translate(112, 45)">
      {/* Chair Back Cushion */}
      <rect x="12" y="10" width="46" height="42" rx="12" fill="#A855F7" stroke="#7E22CE" strokeWidth="2" />
      {/* Chair Armrests */}
      <rect x="4" y="32" width="12" height="32" rx="6" fill="#9333EA" stroke="#6B21A8" strokeWidth="1.5" />
      <rect x="54" y="32" width="12" height="32" rx="6" fill="#9333EA" stroke="#6B21A8" strokeWidth="1.5" />
      {/* Seat Cushion */}
      <rect x="12" y="44" width="46" height="20" rx="8" fill="#C084FC" stroke="#7E22CE" strokeWidth="1.5" />
      {/* Chair legs */}
      <line x1="16" y1="64" x2="10" y2="78" stroke="#F3E8FF" strokeWidth="3" strokeLinecap="round" />
      <line x1="54" y1="64" x2="60" y2="78" stroke="#F3E8FF" strokeWidth="3" strokeLinecap="round" />
    </g>

    {/* Open Book Resting on Coffee Table */}
    <g transform="translate(180, 85)">
      <path
        d="M2 14 C12 8, 22 14, 22 14 C22 14, 32 8, 42 14 L40 28 C30 22, 22 28, 22 28 C22 28, 14 22, 4 28 Z"
        fill="#FEF3C7"
        stroke="#D97706"
        strokeWidth="1.5"
      />
      <line x1="22" y1="14" x2="22" y2="28" stroke="#B45309" strokeWidth="1.5" />
    </g>
  </svg>
);

/**
 * 10. Household Help — Помощь по дому (Reusable custom coupon)
 * Sponge, spray bottle, sparkling clean surface, motion lines.
 * Palette: mint, blue, cream.
 */
export const HouseholdHelpIllustration: React.FC<IllustrationProps> = ({ className = 'w-full h-full', alt }) => (
  <svg
    viewBox="0 0 280 160"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
    aria-label={alt || 'Household Help illustration'}
  >
    <defs>
      <linearGradient id="cleanBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#064E3B" />
        <stop offset="60%" stopColor="#047857" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
    </defs>

    <rect width="280" height="160" rx="12" fill="url(#cleanBg)" />

    <circle cx="140" cy="80" r="75" fill="#38BDF8" opacity="0.2" filter="blur(25px)" />

    {/* Polished Clean Surface Glints */}
    <g>
      <path d="M42 98 L45 104 L51 106 L45 108 L42 114 L39 108 L33 106 L39 104 Z" fill="#F0FDF4" />
      <path d="M228 85 L230 89 L234 91 L230 93 L228 97 L226 93 L222 91 L226 89 Z" fill="#F0FDF4" />
      <path d="M195 40 L197 44 L201 46 L197 48 L195 52 L193 48 L189 46 L193 44 Z" fill="#FEF08A" />
      <circle cx="85" cy="42" r="3" fill="#BAE6FD" />
      <circle cx="115" cy="30" r="2" fill="#E0F2FE" />
    </g>

    {/* Sparkling Mirror Surface line */}
    <line x1="30" y1="120" x2="250" y2="120" stroke="#E0F2FE" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
    <path d="M60 125 L100 125" stroke="#BAE6FD" strokeWidth="2" strokeLinecap="round" opacity="0.5" />

    {/* Spray Bottle on Left */}
    <g transform="translate(80, 42)">
      {/* Trigger & Nozzle */}
      <path d="M24 16 H36 V24 H28 L20 28" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="22" y="8" width="16" height="8" rx="2" fill="#0284C7" />
      {/* Bottle Body */}
      <path
        d="M26 24 L22 36 L16 80 C16 84, 19 86, 24 86 H42 C47 86, 50 84, 50 80 L44 36 L40 24 Z"
        fill="#E0F2FE"
        stroke="#0284C7"
        strokeWidth="2"
      />
      {/* Liquid inside bottle */}
      <path d="M19 55 L16 80 C16 84, 19 86, 24 86 H42 C47 86, 50 84, 50 80 L47 55 Z" fill="#38BDF8" opacity="0.6" />
      {/* Spray droplets */}
      <circle cx="48" cy="14" r="1.5" fill="#E0F2FE" />
      <circle cx="56" cy="12" r="2" fill="#E0F2FE" />
      <circle cx="64" cy="16" r="1.5" fill="#E0F2FE" />
    </g>

    {/* Cleaning Sponge with suds & bubbles on Right */}
    <g transform="translate(148, 62)">
      {/* Sponge base */}
      <rect x="8" y="24" width="56" height="26" rx="8" fill="#FDE047" stroke="#CA8A04" strokeWidth="2" />
      {/* Scouring pad layer */}
      <rect x="8" y="16" width="56" height="10" rx="4" fill="#10B981" stroke="#059669" strokeWidth="1.5" />
      {/* Foam suds bubbles */}
      <circle cx="20" cy="12" r="6" fill="#F0FDF4" stroke="#A7F3D0" strokeWidth="1.2" />
      <circle cx="34" cy="8" r="8" fill="#F0FDF4" stroke="#A7F3D0" strokeWidth="1.2" />
      <circle cx="48" cy="12" r="6" fill="#F0FDF4" stroke="#A7F3D0" strokeWidth="1.2" />
    </g>
  </svg>
);

/**
 * Helper to render appropriate vector artwork given a theme ID
 */
export const CouponIllustration: React.FC<{
  themeId: CouponThemeId;
  className?: string;
  alt?: string;
}> = ({ themeId, className, alt }) => {
  switch (themeId) {
    case 'play_all_night':
      return <PlayAllNightIllustration className={className} alt={alt} />;
    case 'favorite_snacks':
      return <FavoriteSnacksIllustration className={className} alt={alt} />;
    case 'choose_movie':
      return <ChooseMovieIllustration className={className} alt={alt} />;
    case 'favorite_dinner':
      return <FavoriteDinnerIllustration className={className} alt={alt} />;
    case 'special_surprise':
      return <SpecialSurpriseIllustration className={className} alt={alt} />;
    case 'massage_mom':
      return <MassageMomIllustration className={className} alt={alt} />;
    case 'coffee_break':
      return <CoffeeBreakIllustration className={className} alt={alt} />;
    case 'dinner_no_cook':
      return <DinnerNoCookIllustration className={className} alt={alt} />;
    case 'relaxing_evening':
      return <RelaxingEveningIllustration className={className} alt={alt} />;
    case 'household_help':
      return <HouseholdHelpIllustration className={className} alt={alt} />;
    default:
      return <PlayAllNightIllustration className={className} alt={alt} />;
  }
};
