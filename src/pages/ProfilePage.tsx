import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useHome } from '../context/HomeContext';
import { useToast } from '../context/ToastContext';
import { useTranslation } from '../locales';
import { Avatar } from '../components/common/Avatar';
import { BOY_AVATARS, GIRL_AVATARS, AvatarGender, getDefaultAvatar } from '../utils/avatars';
import { 
  User, 
  Mail, 
  Shield, 
  Check, 
  Camera, 
  Upload, 
  Trash2, 
  RefreshCw, 
  Sparkles 
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { currentHome, currentUserRole } = useHome();
  const toast = useToast();
  const { t, language } = useTranslation();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [username, setUsername] = useState(user?.username || '');
  const [selectedGender, setSelectedGender] = useState<AvatarGender>(user?.gender || 'boy');
  const [avatarShape, setAvatarShape] = useState<'circle' | 'squircle'>('circle');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!user) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      displayName: displayName.trim(),
      username: username.trim().replace('@', ''),
      gender: selectedGender,
    });
    setSavedSuccess(true);
    toast.success(t.profile.savedSuccess);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handlePresetSelect = (url: string) => {
    updateProfile({ avatarUrl: url, gender: selectedGender });
    toast.info(language === 'ru' ? 'Аватар успешно обновлён' : 'Avatar updated');
  };

  const handleGenderChange = (gender: AvatarGender) => {
    setSelectedGender(gender);
    const newAvatar = getDefaultAvatar(gender);
    updateProfile({ gender, avatarUrl: newAvatar });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error(language === 'ru' ? 'Размер файла должен быть до 5 МБ' : 'File size must be under 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      updateProfile({ avatarUrl: base64 });
      toast.success(language === 'ru' ? 'Фото профиля загружено!' : 'Profile photo uploaded!');
    };
    reader.onerror = () => {
      toast.error(language === 'ru' ? 'Не удалось прочитать файл' : 'Failed to read file');
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    const defaultAv = getDefaultAvatar(selectedGender);
    updateProfile({ avatarUrl: defaultAv });
    toast.info(language === 'ru' ? 'Фото удалено, восстановлен стандартный аватар' : 'Photo removed, default avatar restored');
  };

  const presets = selectedGender === 'girl' ? GIRL_AVATARS : BOY_AVATARS;
  const isCustomUploaded = user.avatarUrl.startsWith('data:');

  return (
    <div className="w-full space-y-space-xl max-w-3xl animate-in fade-in duration-300">
      
      {/* Top Header */}
      <section className="pb-space-md border-b border-surface-container-highest">
        <span className="font-label-caps text-xs text-primary font-bold uppercase tracking-widest block mb-1">
          {language === 'ru' ? 'ПРОФИЛЬ УЧАСТНИКА // ПРОФИЛЬ' : 'SANCTUARY CITIZEN // PROFILE'}
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-on-surface">
          {t.nav.profile}
        </h1>
      </section>

      {/* Main Profile & Avatar Studio Card */}
      <div className="p-6 sm:p-8 bg-surface-container-lowest/90 backdrop-blur-md rounded-3xl border border-surface-container-highest shadow-card space-y-8">
        
        {/* Avatar Studio Header */}
        <div className="space-y-6 pb-6 border-b border-surface-container-highest">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            
            {/* Primary Live Avatar Preview */}
            <div className="relative group shrink-0">
              <Avatar
                src={user.avatarUrl}
                name={user.displayName}
                size="2xl"
                shape={avatarShape}
                ring={true}
                className="shadow-md transition-all group-hover:ring-primary/40"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 p-2 rounded-full bg-primary text-white shadow-md hover:bg-primary-container transition-all active:scale-90"
                title={t.profile.uploadPhoto}
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>

            {/* Avatar Actions & Identity */}
            <div className="space-y-3 flex-1">
              <div>
                <h2 className="font-headline text-2xl font-bold text-on-surface">
                  {user.displayName}
                </h2>
                <span className="font-mono text-xs text-secondary">
                  @{user.username}
                </span>
              </div>

              {/* Upload / Replace / Remove Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high border border-surface-container-highest text-xs font-semibold text-on-surface flex items-center gap-1.5 transition-all active:scale-95"
                >
                  <Upload className="w-3.5 h-3.5 text-primary" />
                  <span>{isCustomUploaded ? t.profile.replacePhoto : t.profile.uploadPhoto}</span>
                </button>

                {isCustomUploaded && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="px-3 py-1.5 rounded-xl bg-surface-container-low hover:bg-error-container/20 text-error text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{t.profile.removePhoto}</span>
                  </button>
                )}

                {/* Shape Switcher */}
                <div className="flex items-center gap-1 ml-auto bg-surface-container-low p-1 rounded-lg border border-surface-container-highest text-[11px] font-label-caps uppercase text-secondary">
                  <button
                    type="button"
                    onClick={() => setAvatarShape('circle')}
                    className={`px-2 py-0.5 rounded ${avatarShape === 'circle' ? 'bg-surface-container font-bold text-primary shadow-xs' : 'hover:text-on-surface'}`}
                  >
                    Circle
                  </button>
                  <button
                    type="button"
                    onClick={() => setAvatarShape('squircle')}
                    className={`px-2 py-0.5 rounded ${avatarShape === 'squircle' ? 'bg-surface-container font-bold text-primary shadow-xs' : 'hover:text-on-surface'}`}
                  >
                    Squircle
                  </button>
                </div>
              </div>

              <p className="font-caption text-[11px] text-secondary">
                {t.profile.photoFormatHint}
              </p>
            </div>
          </div>

          {/* Curated Predefined Avatars Showcase */}
          <div className="space-y-3 pt-4">
            <div className="flex items-center justify-between">
              <span className="font-label-caps text-xs uppercase text-secondary tracking-widest font-bold">
                {t.profile.predefinedAvatars}
              </span>

              {/* Gender Category Switcher (Boy / Girl) */}
              <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-xl border border-surface-container-highest">
                <button
                  type="button"
                  onClick={() => handleGenderChange('boy')}
                  className={`px-3 py-1 rounded-lg text-xs font-label-caps uppercase tracking-wider font-semibold transition-all ${
                    selectedGender === 'boy'
                      ? 'bg-primary text-white shadow-xs'
                      : 'text-secondary hover:text-on-surface'
                  }`}
                >
                  {t.profile.boyCategory}
                </button>
                <button
                  type="button"
                  onClick={() => handleGenderChange('girl')}
                  className={`px-3 py-1 rounded-lg text-xs font-label-caps uppercase tracking-wider font-semibold transition-all ${
                    selectedGender === 'girl'
                      ? 'bg-primary text-white shadow-xs'
                      : 'text-secondary hover:text-on-surface'
                  }`}
                >
                  {t.profile.girlCategory}
                </button>
              </div>
            </div>

            {/* Presets Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 pt-1">
              {presets.map((preset) => {
                const isCurrent = user.avatarUrl === preset.url;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handlePresetSelect(preset.url)}
                    className={`group relative p-1.5 rounded-2xl border-2 transition-all flex flex-col items-center gap-1.5 ${
                      isCurrent
                        ? 'border-primary bg-primary-fixed/20 shadow-sm scale-105'
                        : 'border-surface-container-highest hover:border-primary/40 bg-surface-container-low'
                    }`}
                  >
                    <Avatar
                      src={preset.url}
                      name={preset.name}
                      size="lg"
                      shape={avatarShape}
                      ring={false}
                    />
                    <span className="font-caption text-[11px] text-on-surface font-medium truncate w-full text-center">
                      {preset.name}
                    </span>
                    {isCurrent && (
                      <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-primary text-white flex items-center justify-center shadow-xs">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Form Fields: Display Name & Username */}
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-label-caps text-xs uppercase text-secondary tracking-widest block mb-2 font-bold">
                {t.auth.displayName}
              </label>
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-surface-container-highest focus:border-primary focus:outline-none text-sm text-on-surface transition-colors"
              />
            </div>

            <div>
              <label className="font-label-caps text-xs uppercase text-secondary tracking-widest block mb-2 font-bold">
                {t.auth.username}
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-surface-container-highest focus:border-primary focus:outline-none text-sm text-on-surface font-mono transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="font-label-caps text-xs uppercase text-secondary tracking-widest block mb-2 font-bold">
              {t.auth.email}
            </label>
            <input
              type="email"
              disabled
              value={user.email}
              className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-surface-container-highest text-sm text-secondary cursor-not-allowed font-mono opacity-80"
            />
          </div>

          {/* Current Home Role Info */}
          <div className="p-4 rounded-2xl bg-surface-container-low border border-surface-container-highest flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="font-label-caps text-[10px] uppercase text-secondary tracking-widest font-bold block">
                {t.profile.activeHomeRole}
              </span>
              <span className="font-headline text-base font-bold text-on-surface">
                {currentHome?.name}: {currentUserRole ? t.roles[currentUserRole] : t.roles.MEMBER}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
              <Shield className="w-5 h-5" />
            </div>
          </div>

          {/* Save Action */}
          <div className="flex items-center justify-between pt-2">
            {savedSuccess ? (
              <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold font-caption">
                <Check className="w-4 h-4" /> {t.profile.savedSuccess}
              </span>
            ) : <span />}

            <button
              type="submit"
              className="px-8 py-3.5 rounded-xl bg-on-surface text-surface font-label-caps text-xs uppercase tracking-wider font-bold hover:bg-primary transition-all duration-200 active:scale-95 shadow-sm"
            >
              {t.common.save}
            </button>
          </div>
        </form>

      </div>

    </div>
  );
};
