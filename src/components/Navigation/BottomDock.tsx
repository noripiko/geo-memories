import React, { useState } from 'react';
import { GlobeSettings, TravelMemory } from '../../types/travel';
import { TOTAL_WORLD_COUNTRIES } from '../../data/countries';
import { ChevronDown, ChevronUp, RotateCw, Plane, Sun, RotateCcw } from 'lucide-react';

interface BottomDockProps {
  settings: GlobeSettings;
  onUpdateSettings: (updater: (prev: GlobeSettings) => GlobeSettings) => void;
  memories: TravelMemory[];
  onResetCamera: () => void;
}

export const BottomDock: React.FC<BottomDockProps> = ({
  settings,
  onUpdateSettings,
  memories,
  onResetCamera,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Calculate unique visited countries
  const uniqueVisitedCodes = new Set(memories.map((m) => m.countryCode));
  const visitedCount = uniqueVisitedCodes.size;
  const visitedPercent = ((visitedCount / TOTAL_WORLD_COUNTRIES) * 100).toFixed(1);
  const totalPhotos = memories.reduce((acc, m) => acc + (m.photos?.length || 0), 0);

  return (
    <div
      className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 w-[94vw] max-w-[860px] transition-transform duration-300 ease-out"
      style={{
        transform: isCollapsed ? 'translate(-50%, calc(100% - 32px))' : 'translate(-50%, 0)',
      }}
    >
      {/* Collapse / Expand Tab Button */}
      <div className="flex justify-center mb-1">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center gap-1.5 px-3 py-1 bg-slate-900/90 border border-slate-800 text-[11px] font-medium text-slate-300 hover:text-white rounded-t-lg backdrop-blur-sm transition-colors shadow-lg"
          title={isCollapsed ? '操作パネルを表示' : '全画面地球儀モード'}
        >
          {isCollapsed ? (
            <>
              <ChevronUp className="w-3.5 h-3.5" />
              <span>操作パネルを表示</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5" />
              <span>地球儀を全画面で楽しむ</span>
            </>
          )}
        </button>
      </div>

      {/* Dock Container */}
      <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-3.5 shadow-2xl backdrop-blur-md flex flex-wrap items-center justify-between gap-4 text-xs">
        {/* Left: Visited Statistics Snapshot */}
        <div className="flex items-center gap-3 text-slate-300">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-medium tracking-wide">訪問した国</span>
            <div className="flex items-baseline gap-1.5 font-bold text-white">
              <span className="text-base text-amber-400 tabular-nums">{visitedCount}</span>
              <span className="text-[11px] text-slate-400">/ {TOTAL_WORLD_COUNTRIES} ヶ国</span>
              <span className="text-[11px] text-sky-400 tabular-nums">({visitedPercent}%)</span>
            </div>
          </div>

          <div className="h-6 w-px bg-slate-800" />

          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-medium tracking-wide">写真・思い出</span>
            <div className="flex items-baseline gap-1.5 font-bold text-white">
              <span className="text-base text-sky-300 tabular-nums">{totalPhotos}</span>
              <span className="text-[11px] text-slate-400">枚の記録</span>
            </div>
          </div>
        </div>

        {/* Center: Globe Theme Switcher (Segmented Control) */}
        <div className="flex items-center p-1 bg-slate-950/60 border border-slate-800 rounded-lg">
          <button
            onClick={() => onUpdateSettings((s) => ({ ...s, theme: 'satellite' }))}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors whitespace-nowrap ${
              settings.theme === 'satellite'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            サテライト
          </button>
          <button
            onClick={() => onUpdateSettings((s) => ({ ...s, theme: 'vintage' }))}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors whitespace-nowrap ${
              settings.theme === 'vintage'
                ? 'bg-amber-900/40 text-amber-200 shadow-sm border border-amber-800/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            アンティーク
          </button>
          <button
            onClick={() => onUpdateSettings((s) => ({ ...s, theme: 'neon' }))}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors whitespace-nowrap ${
              settings.theme === 'neon'
                ? 'bg-cyan-950 text-cyan-300 shadow-sm border border-cyan-800/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            サイバーネオン
          </button>
        </div>

        {/* Right: Feature Toggles & Actions */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onUpdateSettings((s) => ({ ...s, autoRotate: !s.autoRotate }))}
            className={`p-2 rounded-lg border transition-colors ${
              settings.autoRotate
                ? 'bg-sky-500/20 border-sky-500/40 text-sky-300'
                : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:text-white'
            }`}
            title={settings.autoRotate ? '自動回転を停止' : '自動回転を開始'}
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onUpdateSettings((s) => ({ ...s, showArcs: !s.showArcs }))}
            className={`p-2 rounded-lg border transition-colors ${
              settings.showArcs
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:text-white'
            }`}
            title={settings.showArcs ? '旅の航路を非表示' : '旅の航路を表示'}
          >
            <Plane className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onUpdateSettings((s) => ({ ...s, showAtmosphere: !s.showAtmosphere }))}
            className={`p-2 rounded-lg border transition-colors ${
              settings.showAtmosphere
                ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300'
                : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:text-white'
            }`}
            title="地球の大気グロー表示切替"
          >
            <Sun className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onResetCamera}
            className="p-2 rounded-lg border border-slate-800 bg-slate-950/50 text-slate-400 hover:text-white transition-colors"
            title="視点を初期位置にリセット"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
