import React from 'react';
import { AtmosphereType } from '../../types/home';

export const AtmosphereBackdrop: React.FC<{ atmosphere: AtmosphereType }> = ({ atmosphere }) => {
  switch (atmosphere) {
    case 'Midnight':
      return (
        <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden atmosphere-midnight">
          {/* Moonlit edge bleed */}
          <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-white/10 to-transparent" />
          {/* Subtle starlight motes */}
          <div className="absolute top-16 left-1/4 w-1.5 h-1.5 rounded-full bg-white/40 blur-[0.5px]" />
          <div className="absolute top-36 right-1/4 w-1 h-1 rounded-full bg-[#B9C3FF]/50" />
          <div className="absolute bottom-28 left-1/6 w-1 h-1 rounded-full bg-white/30" />
          <div className="absolute top-64 right-1/3 w-1.5 h-1.5 rounded-full bg-white/20" />
          <div className="absolute top-96 left-1/2 w-1 h-1 rounded-full bg-[#B9C3FF]/40" />
        </div>
      );

    case 'Clouds':
      return (
        <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden atmosphere-clouds">
          {/* Tropospheric warm sun glow */}
          <div className="absolute -top-12 -right-12 w-96 h-96 rounded-full bg-[#FFE7C2]/25 blur-3xl" />
          {/* Soft vapor pool */}
          <div className="absolute bottom-10 -left-16 w-[450px] h-64 rounded-full bg-white/60 blur-3xl" />
          {/* Subtle editorial radial gradient wash */}
          <div className="absolute top-1/3 right-10 w-72 h-72 rounded-full bg-[#DDE1FF]/15 blur-3xl" />
        </div>
      );

    case 'Sunset':
      return (
        <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden atmosphere-sunset">
          {/* Golden-hour rim light along top */}
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#D97736]/20 to-transparent" />
          {/* Calming dusk amber halo */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[550px] h-80 rounded-full bg-[#D97736]/10 blur-3xl" />
          <div className="absolute bottom-16 right-1/4 w-80 h-80 rounded-full bg-[#831843]/15 blur-3xl" />
        </div>
      );

    case 'Ocean':
      return (
        <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden atmosphere-ocean">
          {/* Bioluminescent cobalt caustic wash */}
          <div className="absolute top-12 left-10 w-96 h-96 rounded-full bg-[#0F4CFF]/15 blur-3xl" />
          <div className="absolute bottom-20 right-10 w-[500px] h-80 rounded-full bg-[#0284C7]/10 blur-3xl" />
          {/* Subsurface wave geometry */}
          <svg className="absolute inset-0 w-full h-full opacity-5 pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100">
            <path d="M0,30 Q25,45 50,30 T100,30 L100,100 L0,100 Z" fill="#DDE1FF" />
          </svg>
        </div>
      );

    case 'Aurora':
      return (
        <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden atmosphere-aurora">
          {/* Celestial ribbon wave 1 (cyan) */}
          <div className="absolute top-8 left-1/4 w-[600px] h-48 bg-[#0EA5E9]/12 blur-3xl -rotate-12" />
          {/* Celestial ribbon wave 2 (emerald) */}
          <div className="absolute top-28 right-1/6 w-[550px] h-44 bg-[#10B981]/10 blur-3xl rotate-6" />
          {/* Midnight starlight motes */}
          <div className="absolute top-20 left-10 w-1 h-1 rounded-full bg-white/40" />
          <div className="absolute top-72 right-20 w-1 h-1 rounded-full bg-cyan-200/40" />
        </div>
      );
  }
};
