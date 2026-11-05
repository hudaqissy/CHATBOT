import React from 'react';
import { Volume2, VolumeX, BookOpen, Utensils, Share2, Sparkles } from 'lucide-react';
import { playPop } from '../utils/audio';

interface HeaderProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenWordBank: () => void;
  onOpenLunchTray: () => void;
  onOpenEmbedModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  soundEnabled,
  onToggleSound,
  onOpenWordBank,
  onOpenLunchTray,
  onOpenEmbedModal,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b-2 border-indigo-100 shadow-xs">
      <div className="max-w-5xl mx-auto px-4 py-2.5 sm:py-3.5 flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Mascot */}
        <div className="flex items-center gap-3">
          <div className="relative group cursor-pointer" onClick={() => playPop()}>
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-pink-400 via-rose-300 to-amber-300 p-0.5 shadow-md flex items-center justify-center transition-transform hover:scale-105 active:scale-95">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-2xl sm:text-3xl shadow-inner">
                🍎
              </div>
            </div>
            {/* Friendly Little Badge */}
            <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white shadow-xs">
              AI
            </span>
          </div>

          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold font-['Fredoka',sans-serif] text-slate-800 tracking-wide flex items-center gap-1.5">
                Food Buddy <span className="text-rose-500">✨</span>
              </h1>
              <span className="hidden sm:inline-block bg-pink-100 text-pink-700 text-xs font-semibold px-2 py-0.5 rounded-full border border-pink-200">
                Let's Learn About Food!
              </span>
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-1 font-medium">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              The Food Future Lab • Year 4 ESL
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Word Bank Button */}
          <button
            onClick={() => {
              playPop();
              onOpenWordBank();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 active:scale-95 border-2 border-amber-200 rounded-xl transition-all shadow-xs"
            title="Open Picture Food Word Bank"
          >
            <BookOpen className="w-4 h-4 text-amber-600" />
            <span className="hidden md:inline">Word Bank</span>
            <span className="md:hidden">Words</span>
          </button>

          {/* Interactive Lunch Tray Activity */}
          <button
            onClick={() => {
              playPop();
              onOpenLunchTray();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 active:scale-95 border-2 border-emerald-200 rounded-xl transition-all shadow-xs"
            title="Make a Healthy School Lunch Tray"
          >
            <Utensils className="w-4 h-4 text-emerald-600" />
            <span className="hidden md:inline">Lunch Tray</span>
            <span className="md:hidden">Lunch</span>
          </button>

          {/* Google Sites Embed Guide */}
          <button
            onClick={() => {
              playPop();
              onOpenEmbedModal();
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs sm:text-sm font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 active:scale-95 border-2 border-indigo-200 rounded-xl transition-all shadow-xs"
            title="Embed Food Buddy in Google Sites"
          >
            <Share2 className="w-4 h-4 text-indigo-600" />
            <span className="hidden lg:inline">Google Sites</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => {
              playPop();
              onToggleSound();
            }}
            className={`p-2 rounded-xl border-2 transition-all shadow-xs active:scale-95 ${
              soundEnabled
                ? 'bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100'
                : 'bg-slate-100 border-slate-200 text-slate-400 hover:bg-slate-200'
            }`}
            title={soundEnabled ? 'Sound is ON (Click to Mute)' : 'Sound is OFF (Click to Turn ON)'}
            aria-label="Toggle sound"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
