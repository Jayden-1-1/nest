import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useHome } from '../context/HomeContext';
import { useTranslation } from '../locales';
import { User, Mail, Shield, Check, Camera, Sparkles } from 'lucide-react';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
];

export const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { currentHome, currentUserRole } = useHome();
  const { t } = useTranslation();

  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [username, setUsername] = useState(user?.username || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!user) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      displayName: displayName.trim(),
      username: username.trim().replace('@', ''),
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleAvatarSelect = (url: string) => {
    updateProfile({ avatarUrl: url });
  };

  return (
    <div className="w-full space-y-space-xl max-w-3xl">
      
      {/* Top Header */}
      <section className="pb-space-md border-b border-surface-container-highest">
        <span className="font-label-caps text-xs text-primary font-bold uppercase tracking-widest block mb-1">
          SANCTUARY CITIZEN // PROFILE
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-on-surface">
          {t.nav.profile}
        </h1>
      </section>

      {/* Main Profile Card */}
      <div className="p-space-xl bg-surface-container-lowest rounded-2xl border border-surface-container-highest shadow-card space-y-space-lg">
        
        {/* Avatar Section */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-space-lg pb-space-lg border-b border-surface-container-highest">
          <div className="relative w-20 h-20 rounded-full overflow-hidden ring-2 ring-primary/20 shrink-0">
            <img src={user.avatarUrl} alt={user.displayName} className="w-full h-full object-cover" />
          </div>

          <div className="space-y-2">
            <span className="font-label-caps text-xs uppercase text-secondary tracking-widest block">
              {t.profile.predefinedAvatars}
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {PRESET_AVATARS.map((av, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleAvatarSelect(av)}
                  className={`w-9 h-9 rounded-full overflow-hidden border-2 transition-all ${
                    user.avatarUrl === av ? 'border-primary ring-2 ring-primary/30 scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={av} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-label-caps text-xs uppercase text-secondary tracking-widest block mb-1.5">
                {t.auth.displayName}
              </label>
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container-low border border-surface-container-highest focus:border-primary focus:outline-none text-sm text-on-surface"
              />
            </div>

            <div>
              <label className="font-label-caps text-xs uppercase text-secondary tracking-widest block mb-1.5">
                {t.auth.username}
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container-low border border-surface-container-highest focus:border-primary focus:outline-none text-sm text-on-surface font-mono"
              />
            </div>
          </div>

          <div>
            <label className="font-label-caps text-xs uppercase text-secondary tracking-widest block mb-1.5">
              {t.auth.email}
            </label>
            <input
              type="email"
              disabled
              value={user.email}
              className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container-low border border-surface-container-highest text-sm text-secondary cursor-not-allowed font-mono opacity-80"
            />
          </div>

          {/* Current Home Role Info */}
          <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container-highest flex items-center justify-between">
            <div>
              <span className="font-label-caps text-[10px] uppercase text-secondary tracking-widest block">
                {t.profile.activeHomeRole}
              </span>
              <span className="font-headline text-base font-bold text-on-surface">
                {currentHome?.name}: {currentUserRole ? t.roles[currentUserRole] : t.roles.MEMBER}
              </span>
            </div>
            <Shield className="w-5 h-5 text-primary" />
          </div>

          <div className="flex items-center justify-between pt-2">
            {savedSuccess ? (
              <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold font-caption">
                <Check className="w-4 h-4" /> {t.profile.savedSuccess}
              </span>
            ) : <span />}

            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg bg-on-surface text-surface font-label-caps text-xs uppercase tracking-wider font-semibold hover:bg-primary transition-colors"
            >
              {t.common.save}
            </button>
          </div>
        </form>

      </div>

    </div>
  );
};
