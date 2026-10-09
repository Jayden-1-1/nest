import React, { useState } from 'react';
import { useHome } from '../../context/HomeContext';
import { useTranslation } from '../../locales';
import { AtmosphereType, Home } from '../../types/home';
import { X, Sparkles, Key, Home as HomeIcon, Check } from 'lucide-react';

interface HomeCreateJoinModalProps {
  isOpen: boolean;
  initialMode?: 'create' | 'join';
  onClose: () => void;
  onHomeCreated?: (home: Home) => void;
  onHomeJoined?: (home: Home) => void;
}

export const HomeCreateJoinModal: React.FC<HomeCreateJoinModalProps> = ({
  isOpen,
  initialMode = 'create',
  onClose,
  onHomeCreated,
  onHomeJoined,
}) => {
  const { allHomes, createHome, joinHomeByCode } = useHome();
  const { t } = useTranslation();

  const [mode, setMode] = useState<'create' | 'join'>(initialMode);
  const [name, setName] = useState('');
  const [atmosphere, setAtmosphere] = useState<AtmosphereType>('Clouds');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const atmospheres: { type: AtmosphereType; label: string; desc: string; gradient: string }[] = [
    { type: 'Clouds', label: t.atmospheres.Clouds, desc: t.atmospheres.descClouds, gradient: 'from-[#FAF8F5] to-[#E8E5DC]' },
    { type: 'Midnight', label: t.atmospheres.Midnight, desc: t.atmospheres.descMidnight, gradient: 'from-[#1D202A] to-[#0C0D10]' },
    { type: 'Sunset', label: t.atmospheres.Sunset, desc: t.atmospheres.descSunset, gradient: 'from-[#1E1528] to-[#542B39]' },
    { type: 'Ocean', label: t.atmospheres.Ocean, desc: t.atmospheres.descOcean, gradient: 'from-[#172D47] to-[#0A131F]' },
    { type: 'Aurora', label: t.atmospheres.Aurora, desc: t.atmospheres.descAurora, gradient: 'from-[#151D2A] to-[#090B0F]' },
  ];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const newHome = createHome(name.trim(), atmosphere);
    onClose();
    onHomeCreated?.(newHome);
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    const targetCode = code.trim().toUpperCase();
    const target = allHomes.find((h) => h.inviteCode.toUpperCase() === targetCode);
    const res = joinHomeByCode(code.trim());
    if (res.success) {
      onClose();
      if (target) {
        onHomeJoined?.(target);
      }
    } else {
      setError(res.error || 'Failed to join home');
    }
  };

  return (
    <div 
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-lg bg-surface-container-lowest rounded-t-3xl sm:rounded-2xl shadow-modal border-t sm:border border-surface-container-highest overflow-hidden animate-bottom-sheet sm:animate-none">
        
        {/* iOS Drag Handle on Mobile */}
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1.5 bg-outline-variant/60 rounded-full" />
        </div>

        {/* Header Tabs */}
        <div className="flex items-center justify-between px-6 pt-3 sm:pt-6 pb-4 border-b border-surface-container-highest">
          <div className="flex items-center gap-4">
            <button
              onClick={() => { setMode('create'); setError(''); }}
              className={`font-label-caps text-xs tracking-wider uppercase pb-1 border-b-2 transition-colors ${
                mode === 'create'
                  ? 'border-primary text-primary font-bold'
                  : 'border-transparent text-secondary hover:text-on-surface'
              }`}
            >
              {t.homeModal.createNewHome}
            </button>
            <button
              onClick={() => { setMode('join'); setError(''); }}
              className={`font-label-caps text-xs tracking-wider uppercase pb-1 border-b-2 transition-colors ${
                mode === 'join'
                  ? 'border-primary text-primary font-bold'
                  : 'border-transparent text-secondary hover:text-on-surface'
              }`}
            >
              {t.homeModal.joinHome}
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-md text-secondary hover:text-on-surface hover:bg-surface-container transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Create Home Form */}
        {mode === 'create' ? (
          <form onSubmit={handleCreate} className="p-6 space-y-6">
            <div>
              <label className="font-label-caps text-[11px] uppercase text-secondary tracking-widest block mb-2">
                {t.homeModal.homeNameLabel}
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.homeModal.homeNamePlaceholder}
                className="w-full px-4 py-2.5 rounded-lg bg-surface-container-low border border-surface-container-highest focus:border-primary focus:outline-none text-on-surface font-body-md transition-colors"
              />
            </div>

            <div>
              <label className="font-label-caps text-[11px] uppercase text-secondary tracking-widest block mb-3">
                {t.homeModal.atmosphereLabel}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto pr-1">
                {atmospheres.map((atm) => (
                  <button
                    key={atm.type}
                    type="button"
                    onClick={() => setAtmosphere(atm.type)}
                    className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all ${
                      atmosphere === atm.type
                        ? 'border-primary bg-primary-fixed/20 ring-1 ring-primary'
                        : 'border-surface-container-highest hover:bg-surface-container-low'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${atm.gradient} border border-surface-container-highest shrink-0 flex items-center justify-center text-xs`}>
                      {atmosphere === atm.type && <Check className="w-4 h-4 text-primary" />}
                    </div>
                    <div className="min-w-0">
                      <div className="font-headline-sm text-body-sm font-bold text-on-surface">{atm.label}</div>
                      <div className="font-caption text-[11px] text-secondary line-clamp-1">{atm.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg font-label-caps text-xs uppercase tracking-wider text-secondary hover:text-on-surface"
              >
                {t.common.cancel}
              </button>
              <button
                type="submit"
                disabled={!name.trim()}
                className="px-5 py-2.5 rounded-lg bg-on-surface text-surface font-label-caps text-xs uppercase tracking-wider font-semibold hover:bg-primary transition-colors disabled:opacity-50"
              >
                {t.homeModal.createBtn}
              </button>
            </div>
          </form>
        ) : (
          /* Join Home Form */
          <form onSubmit={handleJoin} className="p-6 space-y-6">
            <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container-highest flex items-center gap-3">
              <Key className="w-5 h-5 text-primary shrink-0" />
              <p className="font-body-sm text-body-sm text-secondary">
                {t.homeModal.joinSubtitle}
              </p>
            </div>

            <div>
              <label className="font-label-caps text-[11px] uppercase text-secondary tracking-widest block mb-2">
                {t.homeModal.enterCode}
              </label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => { setCode(e.target.value.toUpperCase()); setError(''); }}
                placeholder="NEST01"
                className="w-full px-4 py-3 rounded-lg bg-surface-container-low border border-surface-container-highest focus:border-primary focus:outline-none text-on-surface font-mono text-center text-lg tracking-widest uppercase font-bold"
              />
              {error && (
                <p className="mt-2 text-xs text-error font-body-sm">{error}</p>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg font-label-caps text-xs uppercase tracking-wider text-secondary hover:text-on-surface"
              >
                {t.common.cancel}
              </button>
              <button
                type="submit"
                disabled={!code.trim()}
                className="px-5 py-2.5 rounded-lg bg-primary text-white font-label-caps text-xs uppercase tracking-wider font-semibold hover:bg-primary-container transition-colors disabled:opacity-50"
              >
                {t.homeModal.joinBtn}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
