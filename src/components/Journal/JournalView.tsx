import React, { useState } from 'react';
import { ContinentJa, TravelMemory, TravelPhoto } from '../../types/travel';
import { formatDateJapanese } from '../../utils/geoMath';
import { Search, Star, Calendar, MapPin, Navigation, Eye, Plus, BookOpen } from 'lucide-react';

interface JournalViewProps {
  memories: TravelMemory[];
  onSelectMemory: (memory: TravelMemory) => void;
  onFlyTo: (lat: number, lng: number) => void;
  onOpenAddModal: () => void;
  onOpenPhotoLightbox: (photo: TravelPhoto, allPhotos: TravelPhoto[]) => void;
}

export const JournalView: React.FC<JournalViewProps> = ({
  memories,
  onSelectMemory,
  onFlyTo,
  onOpenAddModal,
  onOpenPhotoLightbox,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'rating-desc'>('date-desc');

  // Filter memories
  const filtered = memories.filter((mem) => {
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      mem.countryNameJa.includes(q) ||
      mem.countryName.toLowerCase().includes(q) ||
      mem.placeName.toLowerCase().includes(q) ||
      mem.notes.toLowerCase().includes(q);

    const matchesCat = selectedCategory === 'ALL' || mem.category === selectedCategory;

    return matchesSearch && matchesCat;
  });

  // Sort memories
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'date-desc') {
      return new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime();
    }
    if (sortBy === 'date-asc') {
      return new Date(a.visitDate).getTime() - new Date(b.visitDate).getTime();
    }
    if (sortBy === 'rating-desc') {
      return b.rating - a.rating;
    }
    return 0;
  });

  const categories = [
    'ALL',
    '世界遺産・歴史',
    '絶景・自然',
    'グルメ探求',
    '都市散策・アート',
    'ビーチ・リゾート',
    'アウトドア・冒険',
  ];

  return (
    <div className="relative z-10 w-full h-full overflow-y-auto bg-slate-950/90 backdrop-blur-md pt-20 pb-28 px-4 sm:px-8 max-w-7xl mx-auto text-slate-100">
      {/* Page Title & Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <BookOpen className="w-7 h-7 text-sky-400" />
            <span>旅のアルバム & ジャーナル</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            訪れた国や地域の大切な瞬間、写真、記録を振り返るスクラップブック
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="flex items-center gap-1.5 self-start sm:self-auto px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-md transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>新しい思い出を追加</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-8 p-4 bg-slate-900/80 border border-slate-800 rounded-2xl shadow-lg">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="国名、都市名、メモのキーワードで検索..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
          />
        </div>

        {/* Category & Sort controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-sky-500"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === 'ALL' ? 'すべてのテーマ' : c}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-sky-500"
          >
            <option value="date-desc">訪問日が新しい順</option>
            <option value="date-asc">訪問日が古い順</option>
            <option value="rating-desc">満足度が高い順</option>
          </select>
        </div>
      </div>

      {/* Memory Cards Grid */}
      {sorted.length === 0 ? (
        <div className="py-20 text-center bg-slate-900/40 rounded-2xl border border-slate-800/80">
          <MapPin className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-base font-semibold text-slate-300">
            該当する旅の思い出が見つかりません
          </p>
          <p className="text-xs text-slate-500 mt-1 mb-4">
            検索条件を変更するか、新しい旅の記録を追加してみてください。
          </p>
          <button
            onClick={onOpenAddModal}
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors"
          >
            思い出を記録する
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sorted.map((mem) => {
            const coverPhoto = mem.photos && mem.photos.length > 0 ? mem.photos[0] : null;

            return (
              <div
                key={mem.id}
                className="group relative bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all duration-300 flex flex-col shadow-xl"
              >
                {/* Photo Header */}
                <div
                  className="relative aspect-video w-full bg-slate-950 cursor-pointer overflow-hidden"
                  onClick={() => {
                    if (coverPhoto) onOpenPhotoLightbox(coverPhoto, mem.photos);
                    else onSelectMemory(mem);
                  }}
                >
                  {coverPhoto ? (
                    <img
                      src={coverPhoto.url}
                      alt={coverPhoto.caption || mem.placeName}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950 text-slate-600">
                      <MapPin className="w-8 h-8 mb-1 text-slate-500" />
                      <span className="text-xs">{mem.placeName}</span>
                    </div>
                  )}

                  {/* Scrim overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

                  {/* Flag & Country Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 bg-slate-950/80 border border-slate-800/80 rounded-lg backdrop-blur-sm">
                    <span className="text-base">{mem.flag}</span>
                    <span className="text-xs font-bold text-white">
                      {mem.countryNameJa}
                    </span>
                  </div>

                  {/* Photo count indicator */}
                  {mem.photos && mem.photos.length > 1 && (
                    <div className="absolute top-3 right-3 px-2 py-0.5 bg-slate-950/80 rounded-md text-[11px] font-medium text-slate-300">
                      +{mem.photos.length - 1} 枚
                    </div>
                  )}

                  {/* Rating stars */}
                  <div className="absolute bottom-2.5 right-3 flex items-center gap-0.5 text-amber-400 text-xs">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < mem.rating ? 'fill-amber-400' : 'text-slate-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="flex-1 p-5 flex flex-col">
                  {/* Clean unboxed metadata per anti-slop rules */}
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDateJapanese(mem.visitDate)}</span>
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{mem.companion}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-sky-400">{mem.category}</span>
                  </div>

                  <h3
                    onClick={() => onSelectMemory(mem)}
                    className="text-base font-bold text-white mb-2 cursor-pointer hover:text-sky-300 transition-colors line-clamp-1"
                  >
                    {mem.placeName}
                  </h3>

                  <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed mb-4 flex-1">
                    {mem.notes || '思い出のメモはありません。'}
                  </p>

                  {/* Card Actions */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <button
                      onClick={() => onFlyTo(mem.lat, mem.lng)}
                      className="flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300 transition-colors font-medium"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>地球儀で見る</span>
                    </button>

                    <button
                      onClick={() => onSelectMemory(mem)}
                      className="flex items-center gap-1 text-xs text-slate-300 hover:text-white transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>詳細を開く</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
