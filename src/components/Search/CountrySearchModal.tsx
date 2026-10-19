import React, { useState } from 'react';
import { COUNTRIES, CountryInfo } from '../../data/countries';
import { ContinentJa, TravelMemory } from '../../types/travel';
import { Search, X, MapPin, CheckCircle, Navigation, Plus } from 'lucide-react';

interface CountrySearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  memories: TravelMemory[];
  onFlyToCountry: (lat: number, lng: number) => void;
  onAddMemoryForCountry: (country: CountryInfo) => void;
}

const CONTINENT_TABS: { label: string; value: ContinentJa | 'ALL' }[] = [
  { label: 'すべて', value: 'ALL' },
  { label: 'アジア', value: 'アジア' },
  { label: 'ヨーロッパ', value: 'ヨーロッパ' },
  { label: '北アメリカ', value: '北アメリカ' },
  { label: '南アメリカ', value: '南アメリカ' },
  { label: 'アフリカ', value: 'アフリカ' },
  { label: 'オセアニア', value: 'オセアニア' },
];

export const CountrySearchModal: React.FC<CountrySearchModalProps> = ({
  isOpen,
  onClose,
  memories,
  onFlyToCountry,
  onAddMemoryForCountry,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContinent, setSelectedContinent] = useState<ContinentJa | 'ALL'>('ALL');

  if (!isOpen) return null;

  const visitedCodeSet = new Set(memories.map((m) => m.countryCode.toUpperCase()));

  const filteredCountries = COUNTRIES.filter((c) => {
    const matchesContinent =
      selectedContinent === 'ALL' || c.continentJa === selectedContinent;
    const q = searchQuery.trim().toLowerCase();
    const matchesQuery =
      !q ||
      c.nameJa.includes(q) ||
      c.name.toLowerCase().includes(q) ||
      c.capitalJa.includes(q) ||
      c.capital.toLowerCase().includes(q) ||
      c.code.toLowerCase() === q;

    return matchesContinent && matchesQuery;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[85vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* Header with Search Input */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-sky-400" />
              <span>世界中の国を探す</span>
            </h2>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="国名、首都名で検索 (例: フランス, パリ, France, JP)..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
            />
          </div>

          {/* Continent Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto mt-3 py-1 no-scrollbar text-xs">
            {CONTINENT_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setSelectedContinent(tab.value)}
                className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  selectedContinent === tab.value
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredCountries.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-sm">
              一致する国が見つかりませんでした。別のキーワードでお試しください。
            </div>
          ) : (
            filteredCountries.map((country) => {
              const isVisited = visitedCodeSet.has(country.code.toUpperCase());
              const visitCount = memories.filter(
                (m) => m.countryCode.toUpperCase() === country.code.toUpperCase()
              ).length;

              return (
                <div
                  key={country.code}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{country.flag}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white text-sm">
                          {country.nameJa}
                        </span>
                        <span className="text-xs text-slate-400">
                          {country.name}
                        </span>
                        {isVisited && (
                          <span className="flex items-center gap-1 text-[11px] text-amber-400 font-medium">
                            <CheckCircle className="w-3 h-3 text-amber-400" />
                            <span>訪問済 ({visitCount}回)</span>
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                        <span>首都: {country.capitalJa || country.capital}</span>
                        <span aria-hidden="true">·</span>
                        <span>{country.continentJa}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        onFlyToCountry(country.lat, country.lng);
                        onClose();
                      }}
                      className="p-2 text-sky-400 hover:text-sky-300 hover:bg-sky-950/40 rounded-lg transition-colors"
                      title="3D地球儀で表示"
                    >
                      <Navigation className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        onAddMemoryForCountry(country);
                        onClose();
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition-colors whitespace-nowrap"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>ピンを立てる</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
