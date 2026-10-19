/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { GlobeCanvas } from './components/Globe/GlobeCanvas';
import { TopNavbar, ActiveTab } from './components/Navigation/TopNavbar';
import { BottomDock } from './components/Navigation/BottomDock';
import { AddMemoryModal } from './components/Memory/AddMemoryModal';
import { MemoryDetailModal } from './components/Memory/MemoryDetailModal';
import { PhotoLightbox } from './components/Memory/PhotoLightbox';
import { JournalView } from './components/Journal/JournalView';
import { PassportView } from './components/Passport/PassportView';
import { CountrySearchModal } from './components/Search/CountrySearchModal';
import { GlobeSettings, TravelMemory, TravelPhoto } from './types/travel';
import { CountryInfo, findCountryByCode } from './data/countries';
import { loadMemoriesFromStorage, saveMemoriesToStorage } from './data/initialMemories';
import { MapPin, Plus } from 'lucide-react';

export default function App() {
  const [memories, setMemories] = useState<TravelMemory[]>([]);
  const [activeTab, setActiveTab] = useState<ActiveTab>('globe');
  const [settings, setSettings] = useState<GlobeSettings>({
    theme: 'satellite',
    autoRotate: true,
    showArcs: true,
    showAtmosphere: true,
    showPins: true,
  });

  // Selected memory & detail modal
  const [selectedMemory, setSelectedMemory] = useState<TravelMemory | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Add / Edit memory modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMemory, setEditingMemory] = useState<TravelMemory | null>(null);
  const [initialLocation, setInitialLocation] = useState<{
    lat: number;
    lng: number;
    countryCode: string;
  } | null>(null);

  // Search country modal
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // Lightbox
  const [lightboxPhoto, setLightboxPhoto] = useState<TravelPhoto | null>(null);
  const [lightboxPhotos, setLightboxPhotos] = useState<TravelPhoto[]>([]);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Camera Fly-To target
  const [flyToLocation, setFlyToLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Clicked location banner on 3D globe
  const [clickedLocationBanner, setClickedLocationBanner] = useState<{
    lat: number;
    lng: number;
    country: CountryInfo;
  } | null>(null);

  // Load initial memories from localStorage
  useEffect(() => {
    const loaded = loadMemoriesFromStorage();
    setMemories(loaded);
  }, []);

  // Save memories to storage whenever updated
  const handleUpdateMemories = (newMemories: TravelMemory[]) => {
    setMemories(newMemories);
    saveMemoriesToStorage(newMemories);
  };

  const handleSaveMemory = (memory: TravelMemory) => {
    setMemories((prev) => {
      const existsIndex = prev.findIndex((m) => m.id === memory.id);
      let updated: TravelMemory[];
      if (existsIndex >= 0) {
        updated = [...prev];
        updated[existsIndex] = memory;
      } else {
        updated = [memory, ...prev];
      }
      saveMemoriesToStorage(updated);
      return updated;
    });

    // Fly to newly added memory pin
    setFlyToLocation({ lat: memory.lat, lng: memory.lng });
    setClickedLocationBanner(null);
  };

  const handleDeleteMemory = (id: string) => {
    setMemories((prev) => {
      const updated = prev.filter((m) => m.id !== id);
      saveMemoriesToStorage(updated);
      return updated;
    });
    if (selectedMemory?.id === id) {
      setSelectedMemory(null);
      setIsDetailModalOpen(false);
    }
  };

  const handleGlobeClickLocation = (lat: number, lng: number, closestCountryCode: string) => {
    const country = findCountryByCode(closestCountryCode);
    if (country) {
      setClickedLocationBanner({ lat, lng, country });
    }
  };

  const handleFlyTo = (lat: number, lng: number) => {
    setFlyToLocation({ lat, lng });
    setActiveTab('globe');
  };

  const handleOpenPhotoLightbox = (photo: TravelPhoto, allPhotos: TravelPhoto[]) => {
    setLightboxPhoto(photo);
    setLightboxPhotos(allPhotos);
    setIsLightboxOpen(true);
  };

  const handleResetCamera = () => {
    setFlyToLocation({ lat: 20, lng: 0 });
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 font-sans text-slate-100">
      {/* 1. Top Navigation Bar */}
      <TopNavbar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setClickedLocationBanner(null);
        }}
        onOpenAddModal={() => {
          setEditingMemory(null);
          setInitialLocation(null);
          setIsAddModalOpen(true);
        }}
        onOpenSearchModal={() => setIsSearchModalOpen(true)}
      />

      {/* 2. Persistent 3D Globe Canvas (Remains live across tabs for instant seamless response) */}
      <div className="absolute inset-0 z-0">
        <GlobeCanvas
          memories={memories}
          settings={settings}
          selectedMemory={selectedMemory}
          onSelectMemory={(mem) => {
            setSelectedMemory(mem);
            setIsDetailModalOpen(true);
          }}
          onGlobeClickLocation={handleGlobeClickLocation}
          flyToLocation={flyToLocation}
        />
      </div>

      {/* 3. Clicked Globe Location Banner (Quick prompt to drop a pin) */}
      {activeTab === 'globe' && clickedLocationBanner && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20 animate-fade-in">
          <div className="flex items-center gap-3 px-4 py-2.5 bg-slate-900/95 border border-slate-700/80 rounded-xl shadow-2xl backdrop-blur-md text-xs">
            <span className="text-xl">{clickedLocationBanner.country.flag}</span>
            <div>
              <p className="font-semibold text-white">
                {clickedLocationBanner.country.nameJa} 付近を選択中
              </p>
              <p className="text-[11px] text-slate-400">
                緯度 {clickedLocationBanner.lat.toFixed(2)}°, 経度 {clickedLocationBanner.lng.toFixed(2)}°
              </p>
            </div>
            <button
              onClick={() => {
                setEditingMemory(null);
                setInitialLocation({
                  lat: clickedLocationBanner.lat,
                  lng: clickedLocationBanner.lng,
                  countryCode: clickedLocationBanner.country.code,
                });
                setIsAddModalOpen(true);
                setClickedLocationBanner(null);
              }}
              className="flex items-center gap-1 ml-2 px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold rounded-lg shadow-sm transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>ここにピンを立てる</span>
            </button>
            <button
              onClick={() => setClickedLocationBanner(null)}
              className="text-slate-400 hover:text-white ml-1 p-1"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* 4. Journal / Album Overlay View */}
      {activeTab === 'journal' && (
        <JournalView
          memories={memories}
          onSelectMemory={(mem) => {
            setSelectedMemory(mem);
            setIsDetailModalOpen(true);
          }}
          onFlyTo={handleFlyTo}
          onOpenAddModal={() => {
            setEditingMemory(null);
            setInitialLocation(null);
            setIsAddModalOpen(true);
          }}
          onOpenPhotoLightbox={handleOpenPhotoLightbox}
        />
      )}

      {/* 5. Passport & Statistics Overlay View */}
      {activeTab === 'passport' && (
        <PassportView
          memories={memories}
          onFlyTo={handleFlyTo}
          onSelectMemory={(mem) => {
            setSelectedMemory(mem);
            setIsDetailModalOpen(true);
          }}
          onUpdateMemories={handleUpdateMemories}
        />
      )}

      {/* 6. Consolidated Collapsible Bottom Dock (Visible in Globe View) */}
      {activeTab === 'globe' && (
        <BottomDock
          settings={settings}
          onUpdateSettings={setSettings}
          memories={memories}
          onResetCamera={handleResetCamera}
        />
      )}

      {/* 7. Modals */}
      <AddMemoryModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingMemory(null);
          setInitialLocation(null);
        }}
        onSave={handleSaveMemory}
        initialLocation={initialLocation}
        editingMemory={editingMemory}
      />

      <MemoryDetailModal
        isOpen={isDetailModalOpen}
        memory={selectedMemory}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedMemory(null);
        }}
        onEdit={(mem) => {
          setEditingMemory(mem);
          setIsAddModalOpen(true);
        }}
        onDelete={handleDeleteMemory}
        onFlyTo={handleFlyTo}
        onOpenPhotoLightbox={handleOpenPhotoLightbox}
      />

      <PhotoLightbox
        isOpen={isLightboxOpen}
        currentPhoto={lightboxPhoto}
        photos={lightboxPhotos}
        onClose={() => setIsLightboxOpen(false)}
      />

      <CountrySearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        memories={memories}
        onFlyToCountry={handleFlyTo}
        onAddMemoryForCountry={(country) => {
          setEditingMemory(null);
          setInitialLocation({
            lat: country.lat,
            lng: country.lng,
            countryCode: country.code,
          });
          setIsAddModalOpen(true);
        }}
      />
    </div>
  );
}
