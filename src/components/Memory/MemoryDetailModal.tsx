import React from 'react';
import { TravelMemory, TravelPhoto } from '../../types/travel';
import { formatDateJapanese } from '../../utils/geoMath';
import { X, Calendar, Users, Tag, Star, Navigation, Edit, Trash2, ZoomIn } from 'lucide-react';

interface MemoryDetailModalProps {
  memory: TravelMemory | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (memory: TravelMemory) => void;
  onDelete: (id: string) => void;
  onFlyTo: (lat: number, lng: number) => void;
  onOpenPhotoLightbox: (photo: TravelPhoto, allPhotos: TravelPhoto[]) => void;
}

export const MemoryDetailModal: React.FC<MemoryDetailModalProps> = ({
  memory,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onFlyTo,
  onOpenPhotoLightbox,
}) => {
  if (!isOpen || !memory) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">{memory.flag}</span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-sky-400">
                  {memory.countryNameJa} ({memory.countryName})
                </span>
                <span className="text-slate-600">·</span>
                <div className="flex items-center gap-0.5 text-amber-400 text-xs">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${
                        i < memory.rating ? 'fill-amber-400' : 'text-slate-700'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white leading-tight">
                {memory.placeName}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-sm">
          {/* Metadata Bar (Clean unboxed text per anti-slop rules) */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-400 pb-3 border-b border-slate-800/80">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{formatDateJapanese(memory.visitDate)}</span>
              {memory.returnDate && (
                <span> ~ {formatDateJapanese(memory.returnDate)}</span>
              )}
            </div>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span>{memory.companion}</span>
            </div>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <div className="flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-slate-400" />
              <span>{memory.category}</span>
            </div>
          </div>

          {/* Photo Gallery Grid */}
          {memory.photos && memory.photos.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-slate-300 mb-2.5">
                写真ギャラリー ({memory.photos.length} 枚)
              </h3>
              <div
                className={`grid gap-3 ${
                  memory.photos.length === 1
                    ? 'grid-cols-1'
                    : memory.photos.length === 2
                    ? 'grid-cols-2'
                    : 'grid-cols-2 sm:grid-cols-3'
                }`}
              >
                {memory.photos.map((photo) => (
                  <div
                    key={photo.id}
                    onClick={() => onOpenPhotoLightbox(photo, memory.photos)}
                    className="group relative cursor-pointer bg-slate-950 border border-slate-800 rounded-xl overflow-hidden hover:border-sky-500/60 transition-all shadow-md"
                  >
                    <div className="relative aspect-video w-full overflow-hidden">
                      <img
                        src={photo.url}
                        alt={photo.caption || memory.placeName}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/0 transition-colors" />
                      <div className="absolute bottom-2 right-2 p-1.5 bg-slate-900/80 rounded-md text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        <ZoomIn className="w-3.5 h-3.5" />
                      </div>
                    </div>
                    {photo.caption && (
                      <p className="px-2.5 py-1.5 text-xs text-slate-300 truncate bg-slate-950/90 border-t border-slate-800/80">
                        {photo.caption}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Memoir / Travel Notes */}
          <div>
            <h3 className="text-xs font-semibold text-slate-300 mb-2">旅の思い出メモ</h3>
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 text-slate-300 leading-relaxed whitespace-pre-wrap">
              {memory.notes || '旅の記録はまだ登録されていません。'}
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-slate-800 bg-slate-950/60">
          <button
            onClick={() => {
              onFlyTo(memory.lat, memory.lng);
              onClose();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-sky-400 hover:text-sky-300 hover:bg-sky-950/40 rounded-lg transition-colors"
          >
            <Navigation className="w-4 h-4" />
            <span>地球儀でこの場所を見る</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (window.confirm('この旅の記録とピンを削除しますか？')) {
                  onDelete(memory.id);
                  onClose();
                }
              }}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded-lg transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>削除</span>
            </button>

            <button
              onClick={() => {
                onEdit(memory);
                onClose();
              }}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>編集</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
