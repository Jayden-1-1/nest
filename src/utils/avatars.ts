export type AvatarGender = 'boy' | 'girl' | 'role' | 'style';

export interface AvatarPreset {
  id: string;
  name: string;
  url: string;
  category: 'role' | 'style';
  gender?: AvatarGender; // For backwards compatibility
}

// Generate sleek, high-definition SVG abstract avatars with zero human photos
const createSvgAvatar = (
  gradientFrom: string,
  gradientTo: string,
  symbolPath: string,
  accentColor: string = '#FFFFFF'
): string => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${gradientFrom}" />
      <stop offset="100%" stop-color="${gradientTo}" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="4" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>
  <rect width="120" height="120" rx="38" fill="url(#bgGrad)" />
  <circle cx="60" cy="60" r="46" fill="none" stroke="rgba(255,255,255,0.18)" stroke-width="1.5" />
  <g fill="${accentColor}" transform="translate(60,60)">
    ${symbolPath}
  </g>
</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

// 1. Crown / Crest for Home Creator (Owner)
const CREATOR_SYMBOL = `
  <path d="M-22,-6 L-14,14 L14,14 L22,-6 L10,2 L0,-16 L-10,2 Z" fill="#FFFFFF" />
  <circle cx="-22" cy="-8" r="2.5" fill="#FEF08A" />
  <circle cx="0" cy="-18" r="3" fill="#FEF08A" />
  <circle cx="22" cy="-8" r="2.5" fill="#FEF08A" />
  <rect x="-14" y="16" width="28" height="4" rx="2" fill="rgba(255,255,255,0.7)" />
`;

// 2. Compass & Heart Shield for Parent / Guide
const PARENT_SYMBOL = `
  <path d="M0,-20 L5,-5 L20,0 L5,5 L0,20 L-5,5 L-20,0 L-5,-5 Z" fill="#FFFFFF" />
  <circle cx="0" cy="0" r="5" fill="#C7D2FE" />
  <circle cx="0" cy="0" r="14" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="1.5" stroke-dasharray="2 3" />
`;

// 3. Dynamic Sparkle & Star for Member / Child
const MEMBER_SYMBOL = `
  <path d="M0,-22 C0,-8 8,0 22,0 C8,0 0,8 0,22 C0,8 -8,0 -22,0 C-8,0 0,-8 0,-22 Z" fill="#FFFFFF" />
  <circle cx="12" cy="-12" r="2.5" fill="#A7F3D0" />
  <circle cx="-12" cy="12" r="2" fill="#A7F3D0" />
`;

// 4. Wisdom Torch & Beacon for Mentor
const MENTOR_SYMBOL = `
  <path d="M-12,-16 C-12,-16 -16,-2 0,16 C16,-2 12,-16 12,-16 C12,-16 4,-10 0,-18 C-4,-10 -12,-16 -12,-16 Z" fill="#FFFFFF" />
  <circle cx="0" cy="-2" r="4" fill="#FECDD3" />
`;

// 5. Cosmic Orbit
const COSMOS_SYMBOL = `
  <circle cx="0" cy="0" r="12" fill="#FFFFFF" />
  <ellipse cx="0" cy="0" rx="22" ry="7" fill="none" stroke="#BAE6FD" stroke-width="2" transform="rotate(-25)" />
`;

// 6. Aurora Waves
const AURORA_SYMBOL = `
  <path d="M-20,-10 C-10,-18 10,-2 20,-10 C10,-2 -10,-18 -20,-10 Z" fill="#FFFFFF" opacity="0.9" />
  <path d="M-20,2 C-10,-6 10,10 20,2 C10,10 -10,-6 -20,2 Z" fill="#A7F3D0" />
  <path d="M-20,14 C-10,6 10,22 20,14 C10,22 -10,6 -20,14 Z" fill="#FFFFFF" opacity="0.7" />
`;

// 7. Blazing Sunset Horizon
const SUNSET_SYMBOL = `
  <path d="M-18,4 A18,18 0 0,1 18,4 Z" fill="#FFFFFF" />
  <line x1="-22" y1="8" x2="22" y2="8" stroke="#FED7AA" stroke-width="3" stroke-linecap="round" />
  <line x1="-16" y1="14" x2="16" y2="14" stroke="#FED7AA" stroke-width="2.5" stroke-linecap="round" />
`;

// 8. Cyber Diamond Prism
const CYBER_SYMBOL = `
  <polygon points="0,-22 18,-6 11,20 -11,20 -18,-6" fill="none" stroke="#FFFFFF" stroke-width="2.5" />
  <polygon points="0,-12 9,-3 6,11 -6,11 -9,-3" fill="#E9D5FF" />
`;

export const ROLE_AVATARS: AvatarPreset[] = [
  {
    id: 'avatar_creator',
    name: 'Создатель Дома',
    url: createSvgAvatar('#D97706', '#B45309', CREATOR_SYMBOL),
    category: 'role',
  },
  {
    id: 'avatar_parent',
    name: 'Родитель / Наставник',
    url: createSvgAvatar('#4F46E5', '#7C3AED', PARENT_SYMBOL),
    category: 'role',
  },
  {
    id: 'avatar_member',
    name: 'Участник / Ребёнок',
    url: createSvgAvatar('#0D9488', '#059669', MEMBER_SYMBOL),
    category: 'role',
  },
  {
    id: 'avatar_mentor',
    name: 'Хранитель Традиций',
    url: createSvgAvatar('#E11D48', '#BE123C', MENTOR_SYMBOL),
    category: 'role',
  },
];

export const STYLE_AVATARS: AvatarPreset[] = [
  {
    id: 'avatar_cosmos',
    name: 'Космос',
    url: createSvgAvatar('#2563EB', '#1E40AF', COSMOS_SYMBOL),
    category: 'style',
  },
  {
    id: 'avatar_aurora',
    name: 'Аврора',
    url: createSvgAvatar('#059669', '#0284C7', AURORA_SYMBOL),
    category: 'style',
  },
  {
    id: 'avatar_sunset',
    name: 'Закат',
    url: createSvgAvatar('#EA580C', '#C026D3', SUNSET_SYMBOL),
    category: 'style',
  },
  {
    id: 'avatar_cyber',
    name: 'Призма',
    url: createSvgAvatar('#7C3AED', '#DB2777', CYBER_SYMBOL),
    category: 'style',
  },
];

export const ALL_AVATARS: AvatarPreset[] = [...ROLE_AVATARS, ...STYLE_AVATARS];

// Backward compatibility mappings
export const BOY_AVATARS: AvatarPreset[] = ROLE_AVATARS;
export const GIRL_AVATARS: AvatarPreset[] = STYLE_AVATARS;

export const getDefaultAvatar = (roleOrStyle: string = 'avatar_creator'): string => {
  const found = ALL_AVATARS.find((a) => a.id === roleOrStyle);
  if (found) return found.url;
  if (roleOrStyle === 'OWNER' || roleOrStyle === 'creator') return ROLE_AVATARS[0].url;
  if (roleOrStyle === 'PARENT' || roleOrStyle === 'parent') return ROLE_AVATARS[1].url;
  if (roleOrStyle === 'MEMBER' || roleOrStyle === 'member') return ROLE_AVATARS[2].url;
  return ROLE_AVATARS[0].url;
};
