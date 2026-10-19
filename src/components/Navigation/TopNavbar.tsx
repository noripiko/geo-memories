import React from 'react';
import { Globe, BookOpen, Award, Plus, Compass } from 'lucide-react';

export type ActiveTab = 'globe' | 'journal' | 'passport';

interface TopNavbarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onOpenAddModal: () => void;
  onOpenSearchModal: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  activeTab,
  onSelectTab,
  onOpenAddModal,
  onOpenSearchModal,
}) => {
  return (
    <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between gap-8 px-6 py-3.5 bg-slate-950/80 border-b border-slate-800/80 backdrop-blur-md">
      {/* Zone 1: Single text element wordmark */}
      <a
        href="#globe"
        onClick={(e) => {
          e.preventDefault();
          onSelectTab('globe');
        }}
        className="flex items-center gap-2 text-base md:text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 hover:text-sky-300 transition-colors"
      >
        <Globe className="w-5 h-5 text-sky-400 shrink-0" />
        <span>GeoMemories</span>
      </a>

      {/* Zone 2: Concise single-line text navigation links */}
      <nav className="flex items-center gap-2 md:gap-6 text-sm font-medium text-slate-400">
        <button
          onClick={() => onSelectTab('globe')}
          className={`flex items-center gap-1.5 py-1 transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'globe'
              ? 'text-white font-semibold border-b-2 border-sky-400'
              : 'hover:text-slate-200'
          }`}
        >
          <Globe className="w-4 h-4 shrink-0" />
          <span>3D地球儀</span>
        </button>

        <button
          onClick={() => onSelectTab('journal')}
          className={`flex items-center gap-1.5 py-1 transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'journal'
              ? 'text-white font-semibold border-b-2 border-sky-400'
              : 'hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4 shrink-0" />
          <span>旅のアルバム</span>
        </button>

        <button
          onClick={() => onSelectTab('passport')}
          className={`flex items-center gap-1.5 py-1 transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'passport'
              ? 'text-white font-semibold border-b-2 border-sky-400'
              : 'hover:text-slate-200'
          }`}
        >
          <Award className="w-4 h-4 shrink-0" />
          <span>パスポート・統計</span>
        </button>

        <button
          onClick={onOpenSearchModal}
          className="hidden sm:flex items-center gap-1.5 py-1 text-slate-400 hover:text-slate-200 transition-colors whitespace-nowrap shrink-0"
        >
          <Compass className="w-4 h-4 shrink-0" />
          <span>国を探す</span>
        </button>
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onOpenAddModal}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0 active:scale-95"
        >
          <Plus className="w-4 h-4 shrink-0" />
          <span>旅の記録を追加</span>
        </button>
      </div>
    </header>
  );
};
