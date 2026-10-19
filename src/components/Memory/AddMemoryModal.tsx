import React, { useState, useEffect } from 'react';
import { COUNTRIES, findCountryByCode } from '../../data/countries';
import { CompanionType, TravelCategory, TravelMemory, TravelPhoto } from '../../types/travel';
import { X, Star, Upload, Trash2, ImagePlus, MapPin, Sparkles } from 'lucide-react';

interface AddMemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (memory: TravelMemory) => void;
  initialLocation?: { lat: number; lng: number; countryCode: string } | null;
  editingMemory?: TravelMemory | null;
}

const COMPANIONS: CompanionType[] = [
  '一人旅',
  '友人',
  'パートナー',
  '家族',
  '卒業旅行',
  '出張・ワーケーション',
];

const CATEGORIES: TravelCategory[] = [
  '世界遺産・歴史',
  '絶景・自然',
  'グルメ探求',
  '都市散策・アート',
  'ビーチ・リゾート',
  'アウトドア・冒険',
];

export const AddMemoryModal: React.FC<AddMemoryModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialLocation,
  editingMemory,
}) => {
  const [selectedCountryCode, setSelectedCountryCode] = useState('FR');
  const [placeName, setPlaceName] = useState('');
  const [lat, setLat] = useState(48.8566);
  const [lng, setLng] = useState(2.3522);
  const [visitDate, setVisitDate] = useState(new Date().toISOString().split('T')[0]);
  const [returnDate, setReturnDate] = useState('');
  const [rating, setRating] = useState(5);
  const [companion, setCompanion] = useState<CompanionType>('友人');
  const [category, setCategory] = useState<TravelCategory>('世界遺産・歴史');
  const [notes, setNotes] = useState('');
  const [photos, setPhotos] = useState<TravelPhoto[]>([]);
  const [countrySearch, setCountrySearch] = useState('');

  // Pre-fill when editing or clicking globe
  useEffect(() => {
    if (editingMemory) {
      setSelectedCountryCode(editingMemory.countryCode);
      setPlaceName(editingMemory.placeName);
      setLat(editingMemory.lat);
      setLng(editingMemory.lng);
      setVisitDate(editingMemory.visitDate);
      setReturnDate(editingMemory.returnDate || '');
      setRating(editingMemory.rating);
      setCompanion(editingMemory.companion);
      setCategory(editingMemory.category);
      setNotes(editingMemory.notes);
      setPhotos(editingMemory.photos || []);
    } else if (initialLocation) {
      setSelectedCountryCode(initialLocation.countryCode);
      setLat(initialLocation.lat);
      setLng(initialLocation.lng);
      const c = findCountryByCode(initialLocation.countryCode);
      setPlaceName(c ? `${c.capitalJa || c.capital} 周辺` : '');
    } else {
      // Default to Japan or current selection
      const defaultC = findCountryByCode(selectedCountryCode) || COUNTRIES[0];
      setLat(defaultC.lat);
      setLng(defaultC.lng);
      setPlaceName(`${defaultC.nameJa}の思い出`);
    }
  }, [editingMemory, initialLocation, isOpen]);

  // Update Lat/Lng when country selection changes (if user didn't click exact point)
  const handleCountryChange = (code: string) => {
    setSelectedCountryCode(code);
    const country = findCountryByCode(code);
    if (country) {
      setLat(country.lat);
      setLng(country.lng);
      if (!placeName || placeName.endsWith('周辺') || placeName.endsWith('の思い出')) {
        setPlaceName(`${country.capitalJa || country.capital}周辺`);
      }
    }
  };

  // Handle Photo File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const newPhoto: TravelPhoto = {
            id: `photo-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            url: event.target.result as string,
            caption: file.name.replace(/\.[^/.]+$/, ''),
          };
          setPhotos((prev) => [...prev, newPhoto]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Add a procedural artistic travel stamp / destination illustration photo
  const handleAddSampleArtPhoto = () => {
    const country = findCountryByCode(selectedCountryCode);
    const cName = country ? country.nameJa : '旅先';
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#0f172a"/>
          <stop offset="100%" stop-color="#1e293b"/>
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill="url(#bg)"/>
      <circle cx="200" cy="140" r="70" fill="none" stroke="#f59e0b" stroke-width="2" stroke-dasharray="6,4" />
      <text x="200" y="130" fill="#38bdf8" font-size="36" text-anchor="middle" font-family="sans-serif">${country?.flag || '✈️'}</text>
      <text x="200" y="165" fill="#f8fafc" font-size="16" font-weight="bold" text-anchor="middle" font-family="sans-serif">${placeName || cName}</text>
      <text x="200" y="185" fill="#94a3b8" font-size="12" text-anchor="middle" font-family="sans-serif">${visitDate} · MEMORY OF TRAVEL</text>
    </svg>`;
    const sampleUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

    const newPhoto: TravelPhoto = {
      id: `sample-${Date.now()}`,
      url: sampleUrl,
      caption: `${country?.nameJa || '旅'}の記念ショット`,
    };
    setPhotos((prev) => [...prev, newPhoto]);
  };

  const handleRemovePhoto = (id: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  const handleUpdateCaption = (id: string, caption: string) => {
    setPhotos((prev) => prev.map((p) => (p.id === id ? { ...p, caption } : p)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const country = findCountryByCode(selectedCountryCode) || COUNTRIES[0];

    const newMemory: TravelMemory = {
      id: editingMemory ? editingMemory.id : `mem-${Date.now()}`,
      countryCode: country.code,
      countryName: country.name,
      countryNameJa: country.nameJa,
      flag: country.flag,
      placeName: placeName.trim() || `${country.nameJa}への旅`,
      lat,
      lng,
      visitDate,
      returnDate: returnDate || undefined,
      rating,
      companion,
      category,
      notes: notes.trim(),
      photos,
      createdAt: editingMemory ? editingMemory.createdAt : Date.now(),
    };

    onSave(newMemory);
    onClose();
  };

  if (!isOpen) return null;

  const currentCountry = findCountryByCode(selectedCountryCode);
  const filteredCountries = countrySearch.trim()
    ? COUNTRIES.filter(
        (c) =>
          c.nameJa.includes(countrySearch.trim()) ||
          c.name.toLowerCase().includes(countrySearch.trim().toLowerCase())
      )
    : COUNTRIES;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-2">
            <span className="text-xl">{currentCountry?.flag || '📍'}</span>
            <h2 className="text-base font-bold text-white">
              {editingMemory ? '旅の記録を編集' : '新しい旅の記録を追加'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 text-sm">
          {/* Country Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                国を選択 <span className="text-amber-400">*</span>
              </label>
              <select
                value={selectedCountryCode}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-sky-500 transition-colors"
              >
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.nameJa} ({c.name})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                訪れた場所・都市・スポット <span className="text-amber-400">*</span>
              </label>
              <input
                type="text"
                required
                value={placeName}
                onChange={(e) => setPlaceName(e.target.value)}
                placeholder="例: エッフェル塔、サグラダファミリア"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
              />
            </div>
          </div>

          {/* Coordinates display & verification */}
          <div className="flex items-center gap-3 text-xs text-slate-400 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
            <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
            <span>
              ピン位置: 緯度 {lat.toFixed(4)}°, 経度 {lng.toFixed(4)}°
            </span>
            <span className="text-slate-500 text-[11px] ml-auto">
              (地球儀をクリックしてピンを直接指定することも可能です)
            </span>
          </div>

          {/* Travel Dates & Rating */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                旅行日・訪問日 <span className="text-amber-400">*</span>
              </label>
              <input
                type="date"
                required
                value={visitDate}
                onChange={(e) => setVisitDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-sky-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                帰国日 (任意)
              </label>
              <input
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-sky-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                旅の満足度
              </label>
              <div className="flex items-center gap-1.5 h-10 px-3 bg-slate-950 border border-slate-800 rounded-lg">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        star <= rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-600'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Category & Companions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                旅のテーマ・カテゴリー
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TravelCategory)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-sky-500 transition-colors"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                同行者
              </label>
              <select
                value={companion}
                onChange={(e) => setCompanion(e.target.value as CompanionType)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-sky-500 transition-colors"
              >
                {COMPANIONS.map((comp) => (
                  <option key={comp} value={comp}>
                    {comp}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Notes / Memoir Journal */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              旅の思い出・エピソード
            </label>
            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="心に残った景色、美味しかった料理、出会った人々、ハプニングなど自由に記録しましょう..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors leading-relaxed"
            />
          </div>

          {/* Photos Upload Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-300">
                写真・思い出の一枚 ({photos.length} 枚)
              </label>
              <button
                type="button"
                onClick={handleAddSampleArtPhoto}
                className="flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>記念カードを生成</span>
              </button>
            </div>

            {/* Photo preview list */}
            {photos.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
                {photos.map((photo) => (
                  <div
                    key={photo.id}
                    className="group relative bg-slate-950 border border-slate-800 rounded-lg overflow-hidden flex flex-col"
                  >
                    <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                      <img
                        src={photo.url}
                        alt={photo.caption || '旅の写真'}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(photo.id)}
                        className="absolute top-1.5 right-1.5 p-1 bg-red-600/80 hover:bg-red-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                        title="写真を削除"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={photo.caption || ''}
                      onChange={(e) => handleUpdateCaption(photo.id, e.target.value)}
                      placeholder="キャプション"
                      className="w-full bg-transparent px-2 py-1 text-[11px] text-slate-300 border-t border-slate-800/80 focus:outline-none focus:bg-slate-900"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Upload Area */}
            <label className="flex flex-col items-center justify-center p-4 border border-dashed border-slate-700 hover:border-sky-500 rounded-xl cursor-pointer bg-slate-950/40 hover:bg-slate-950/80 transition-all text-center">
              <Upload className="w-5 h-5 text-slate-400 mb-1" />
              <span className="text-xs text-slate-300 font-medium">
                画像ファイルを選択またはドラッグ＆ドロップ
              </span>
              <span className="text-[11px] text-slate-500 mt-0.5">
                JPEG, PNG, WebP対応 · 複数枚の追加が可能です
              </span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition-colors"
            >
              {editingMemory ? '変更を保存する' : '地球儀にピンを立てる'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
