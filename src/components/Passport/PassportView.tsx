import React, { useRef } from 'react';
import { TravelMemory } from '../../types/travel';
import { TOTAL_WORLD_COUNTRIES, COUNTRIES } from '../../data/countries';
import { INITIAL_MEMORIES, saveMemoriesToStorage } from '../../data/initialMemories';
import { Award, Globe, Compass, Camera, Download, Upload, RotateCcw, CheckCircle } from 'lucide-react';

interface PassportViewProps {
  memories: TravelMemory[];
  onFlyTo: (lat: number, lng: number) => void;
  onSelectMemory: (memory: TravelMemory) => void;
  onUpdateMemories: (memories: TravelMemory[]) => void;
}

export const PassportView: React.FC<PassportViewProps> = ({
  memories,
  onFlyTo,
  onSelectMemory,
  onUpdateMemories,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Stats calculation
  const uniqueVisitedCodes = Array.from(new Set(memories.map((m) => m.countryCode)));
  const visitedCount = uniqueVisitedCodes.length;
  const worldPercentage = ((visitedCount / TOTAL_WORLD_COUNTRIES) * 100).toFixed(1);
  const totalPhotos = memories.reduce((acc, m) => acc + (m.photos?.length || 0), 0);

  // Continent breakdown
  const continentStats: Record<string, { total: number; visited: number; ja: string }> = {
    Asia: { total: 0, visited: 0, ja: 'アジア' },
    Europe: { total: 0, visited: 0, ja: 'ヨーロッパ' },
    'North America': { total: 0, visited: 0, ja: '北アメリカ' },
    'South America': { total: 0, visited: 0, ja: '南アメリカ' },
    Africa: { total: 0, visited: 0, ja: 'アフリカ' },
    Oceania: { total: 0, visited: 0, ja: 'オセアニア' },
  };

  COUNTRIES.forEach((c) => {
    if (continentStats[c.continent]) {
      continentStats[c.continent].total += 1;
    }
  });

  uniqueVisitedCodes.forEach((code) => {
    const c = COUNTRIES.find((item) => item.code === code);
    if (c && continentStats[c.continent]) {
      continentStats[c.continent].visited += 1;
    }
  });

  // Export JSON
  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(memories, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `GeoMemories_Backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import JSON
  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          onUpdateMemories(parsed);
          saveMemoriesToStorage(parsed);
          alert(`${parsed.length} 件の旅の記録をインポートしました！`);
        }
      } catch (err) {
        alert('ファイルの読み込みに失敗しました。正しいJSON形式かご確認ください。');
      }
    };
    reader.readAsText(file);
  };

  // Reset to initial sample data
  const handleResetSampleData = () => {
    if (window.confirm('旅の記録を初期サンプルデータ（7カ国の名所）にリセットしますか？')) {
      onUpdateMemories(INITIAL_MEMORIES);
      saveMemoriesToStorage(INITIAL_MEMORIES);
    }
  };

  return (
    <div className="relative z-10 w-full h-full overflow-y-auto bg-slate-950/90 backdrop-blur-md pt-20 pb-28 px-4 sm:px-8 max-w-6xl mx-auto text-slate-100">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Award className="w-7 h-7 text-amber-400" />
            <span>トラベルパスポート & 踏破統計</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            訪れた国ごとの入国スタンプと、地球全体の探索達成度
          </p>
        </div>

        {/* Data Management Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportJson}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded-lg hover:border-slate-700 transition-colors"
            title="旅のデータをJSONでバックアップ"
          >
            <Download className="w-3.5 h-3.5" />
            <span>エクスポート</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded-lg hover:border-slate-700 transition-colors"
            title="バックアップJSONを読み込む"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>インポート</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImportJson}
            className="hidden"
          />

          <button
            onClick={handleResetSampleData}
            className="p-1.5 text-slate-400 hover:text-amber-300 bg-slate-900 border border-slate-800 rounded-lg hover:border-slate-700 transition-colors"
            title="サンプルデータに復元"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>訪問国数</span>
            <Globe className="w-4 h-4 text-sky-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-bold text-amber-400 tabular-nums">
              {visitedCount}
            </span>
            <span className="text-xs text-slate-400">/ {TOTAL_WORLD_COUNTRIES} ヶ国</span>
          </div>
          <div className="mt-2 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-amber-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (visitedCount / TOTAL_WORLD_COUNTRIES) * 100)}%` }}
            />
          </div>
        </div>

        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>世界踏破率</span>
            <Compass className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-bold text-emerald-400 tabular-nums">
              {worldPercentage}
            </span>
            <span className="text-sm font-semibold text-slate-400">%</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1">全世界195カ国換算</span>
        </div>

        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>総旅の記録</span>
            <Award className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-bold text-purple-300 tabular-nums">
              {memories.length}
            </span>
            <span className="text-xs text-slate-400">スポット</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1">地球儀のピン総数</span>
        </div>

        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>旅の写真</span>
            <Camera className="w-4 h-4 text-sky-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-bold text-sky-300 tabular-nums">
              {totalPhotos}
            </span>
            <span className="text-xs text-slate-400">枚の思い出</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1">ローカル保存済み</span>
        </div>
      </div>

      {/* Continents Progress Bar Section */}
      <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-2xl mb-8 shadow-xl">
        <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <span>大陸別 踏破状況</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {Object.entries(continentStats).map(([key, stat]) => {
            const pct = stat.total > 0 ? ((stat.visited / stat.total) * 100).toFixed(0) : '0';
            return (
              <div key={key} className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                <span className="text-xs text-slate-400 font-medium">{stat.ja}</span>
                <div className="mt-1 flex items-baseline justify-between">
                  <span className="text-lg font-bold text-white tabular-nums">
                    {stat.visited}
                    <span className="text-xs text-slate-500 font-normal"> / {stat.total}</span>
                  </span>
                  <span className="text-xs text-sky-400 font-semibold tabular-nums">{pct}%</span>
                </div>
                <div className="mt-2 w-full bg-slate-800 rounded-full h-1 overflow-hidden">
                  <div
                    className="bg-sky-400 h-full rounded-full transition-all duration-300"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Collectible Passport Stamp Book */}
      <div className="p-6 sm:p-8 bg-amber-950/20 border-2 border-amber-900/40 rounded-3xl relative overflow-hidden shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-amber-900/30">
          <div>
            <h2 className="text-lg font-bold text-amber-200 tracking-wide font-serif">
              OFFICIAL PASSPORT ENTRY STAMPS
            </h2>
            <p className="text-xs text-amber-400/70 mt-0.5">
              各国の入国スタンプ（クリックすると3D地球儀がその国へフォーカスします）
            </p>
          </div>
          <span className="text-xs text-amber-300 font-mono">
            {uniqueVisitedCodes.length} STAMPS COLLECTED
          </span>
        </div>

        {/* Stamps Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {memories.map((mem) => {
            return (
              <div
                key={mem.id}
                onClick={() => {
                  onFlyTo(mem.lat, mem.lng);
                  onSelectMemory(mem);
                }}
                className="group relative cursor-pointer p-4 rounded-2xl bg-amber-950/30 border border-amber-700/40 hover:border-amber-500 hover:bg-amber-950/50 transition-all duration-300 flex flex-col items-center text-center shadow-lg transform hover:-translate-y-1"
              >
                {/* Vintage Circular Stamp Seal Graphic */}
                <div className="relative w-24 h-24 rounded-full border-2 border-dashed border-amber-500/70 p-2 flex flex-col items-center justify-center text-amber-300 group-hover:border-amber-400 transition-colors">
                  <span className="text-xs font-mono font-bold tracking-widest text-amber-400/80">
                    ★ {mem.countryCode} ★
                  </span>
                  <span className="text-xl my-0.5">{mem.flag}</span>
                  <span className="text-[10px] font-mono text-amber-300/90 font-semibold tracking-tighter uppercase">
                    ENTRY PASSED
                  </span>
                  <span className="text-[9px] font-mono text-amber-400/70">
                    {mem.visitDate}
                  </span>
                </div>

                <div className="mt-3">
                  <h4 className="text-sm font-bold text-amber-100 group-hover:text-amber-300 transition-colors">
                    {mem.countryNameJa}
                  </h4>
                  <p className="text-[11px] text-amber-400/80 truncate max-w-[140px] mt-0.5">
                    {mem.placeName}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
