export type Continent =
  | 'Asia'
  | 'Europe'
  | 'North America'
  | 'South America'
  | 'Africa'
  | 'Oceania'
  | 'Antarctica';

export type ContinentJa =
  | 'アジア'
  | 'ヨーロッパ'
  | '北アメリカ'
  | '南アメリカ'
  | 'アフリカ'
  | 'オセアニア'
  | '南極';

export interface CountryInfo {
  code: string; // ISO 2-letter
  name: string;
  nameJa: string;
  continent: Continent;
  continentJa: ContinentJa;
  capital: string;
  capitalJa: string;
  lat: number;
  lng: number;
  flag: string;
}

export interface TravelPhoto {
  id: string;
  url: string;
  caption?: string;
}

export type CompanionType =
  | '一人旅'
  | '友人'
  | '家族'
  | 'パートナー'
  | '卒業旅行'
  | '出張・ワーケーション';

export type TravelCategory =
  | '世界遺産・歴史'
  | '絶景・自然'
  | 'グルメ探求'
  | '都市散策・アート'
  | 'ビーチ・リゾート'
  | 'アウトドア・冒険';

export interface TravelMemory {
  id: string;
  countryCode: string;
  countryName: string;
  countryNameJa: string;
  flag: string;
  placeName: string; // e.g. "エッフェル塔 & ルーヴル美術館"
  lat: number;
  lng: number;
  visitDate: string; // YYYY-MM-DD or YYYY-MM
  returnDate?: string;
  rating: number; // 1-5
  companion: CompanionType;
  category: TravelCategory;
  notes: string;
  photos: TravelPhoto[];
  createdAt: number;
}

export type GlobeTheme = 'satellite' | 'vintage' | 'neon';

export interface GlobeSettings {
  theme: GlobeTheme;
  autoRotate: boolean;
  showArcs: boolean;
  showAtmosphere: boolean;
  showPins: boolean;
}
