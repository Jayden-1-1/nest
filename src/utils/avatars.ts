export type AvatarGender = 'boy' | 'girl';

export interface AvatarPreset {
  id: string;
  name: string;
  url: string;
  gender: AvatarGender;
}

export const BOY_AVATARS: AvatarPreset[] = [
  {
    id: 'boy_alexey',
    name: 'Alexey',
    gender: 'boy',
    url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=240&auto=format&fit=crop&q=80',
  },
  {
    id: 'boy_leo',
    name: 'Leo',
    gender: 'boy',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=240&auto=format&fit=crop&q=80',
  },
  {
    id: 'boy_dmitry',
    name: 'Dmitry',
    gender: 'boy',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=240&auto=format&fit=crop&q=80',
  },
  {
    id: 'boy_felix',
    name: 'Felix',
    gender: 'boy',
    url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=240&auto=format&fit=crop&q=80',
  },
  {
    id: 'boy_sam',
    name: 'Sam',
    gender: 'boy',
    url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=240&auto=format&fit=crop&q=80',
  },
  {
    id: 'boy_julian',
    name: 'Julian',
    gender: 'boy',
    url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=240&auto=format&fit=crop&q=80',
  },
];

export const GIRL_AVATARS: AvatarPreset[] = [
  {
    id: 'girl_elena',
    name: 'Elena',
    gender: 'girl',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=240&auto=format&fit=crop&q=80',
  },
  {
    id: 'girl_maya',
    name: 'Maya',
    gender: 'girl',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&auto=format&fit=crop&q=80',
  },
  {
    id: 'girl_sophia',
    name: 'Sophia',
    gender: 'girl',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=240&auto=format&fit=crop&q=80',
  },
  {
    id: 'girl_chloe',
    name: 'Chloe',
    gender: 'girl',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=240&auto=format&fit=crop&q=80',
  },
  {
    id: 'girl_eva',
    name: 'Eva',
    gender: 'girl',
    url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=240&auto=format&fit=crop&q=80',
  },
  {
    id: 'girl_anna',
    name: 'Anna',
    gender: 'girl',
    url: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=240&auto=format&fit=crop&q=80',
  },
];

export const ALL_AVATARS: AvatarPreset[] = [...BOY_AVATARS, ...GIRL_AVATARS];

export const getDefaultAvatar = (gender: AvatarGender = 'boy'): string => {
  return gender === 'girl' ? GIRL_AVATARS[0].url : BOY_AVATARS[0].url;
};
