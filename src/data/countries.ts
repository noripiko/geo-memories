import { CountryInfo } from '../types/travel';
export type { CountryInfo };

export const COUNTRIES: CountryInfo[] = [
  // アジア
  { code: 'JP', name: 'Japan', nameJa: '日本', continent: 'Asia', continentJa: 'アジア', capital: 'Tokyo', capitalJa: '東京', lat: 35.6762, lng: 139.6503, flag: '🇯🇵' },
  { code: 'KR', name: 'South Korea', nameJa: '韓国', continent: 'Asia', continentJa: 'アジア', capital: 'Seoul', capitalJa: 'ソウル', lat: 37.5665, lng: 126.978, flag: '🇰🇷' },
  { code: 'CN', name: 'China', nameJa: '中国', continent: 'Asia', continentJa: 'アジア', capital: 'Beijing', capitalJa: '北京', lat: 39.9042, lng: 116.4074, flag: '🇨🇳' },
  { code: 'TW', name: 'Taiwan', nameJa: '台湾', continent: 'Asia', continentJa: 'アジア', capital: 'Taipei', capitalJa: '台北', lat: 25.033, lng: 121.5654, flag: '🇹🇼' },
  { code: 'HK', name: 'Hong Kong', nameJa: '香港', continent: 'Asia', continentJa: 'アジア', capital: 'Hong Kong', capitalJa: '香港', lat: 22.3193, lng: 114.1694, flag: '🇭🇰' },
  { code: 'TH', name: 'Thailand', nameJa: 'タイ', continent: 'Asia', continentJa: 'アジア', capital: 'Bangkok', capitalJa: 'バンコク', lat: 13.7563, lng: 100.5018, flag: '🇹🇭' },
  { code: 'VN', name: 'Vietnam', nameJa: 'ベトナム', continent: 'Asia', continentJa: 'アジア', capital: 'Hanoi', capitalJa: 'ハノイ', lat: 21.0285, lng: 105.8542, flag: '🇻🇳' },
  { code: 'SG', name: 'Singapore', nameJa: 'シンガポール', continent: 'Asia', continentJa: 'アジア', capital: 'Singapore', capitalJa: 'シンガポール', lat: 1.3521, lng: 103.8198, flag: '🇸🇬' },
  { code: 'MY', name: 'Malaysia', nameJa: 'マレーシア', continent: 'Asia', continentJa: 'アジア', capital: 'Kuala Lumpur', capitalJa: 'クアラルンプール', lat: 3.139, lng: 101.6869, flag: '🇲🇾' },
  { code: 'ID', name: 'Indonesia', nameJa: 'インドネシア', continent: 'Asia', continentJa: 'アジア', capital: 'Jakarta', capitalJa: 'ジャカルタ', lat: -6.2088, lng: 106.8456, flag: '🇮🇩' },
  { code: 'PH', name: 'Philippines', nameJa: 'フィリピン', continent: 'Asia', continentJa: 'アジア', capital: 'Manila', capitalJa: 'マニラ', lat: 14.5995, lng: 120.9842, flag: '🇵🇭' },
  { code: 'IN', name: 'India', nameJa: 'インド', continent: 'Asia', continentJa: 'アジア', capital: 'New Delhi', capitalJa: 'ニューデリー', lat: 28.6139, lng: 77.209, flag: '🇮🇳' },
  { code: 'NP', name: 'Nepal', nameJa: 'ネパール', continent: 'Asia', continentJa: 'アジア', capital: 'Kathmandu', capitalJa: 'カトマンズ', lat: 27.7172, lng: 85.324, flag: '🇳🇵' },
  { code: 'LK', name: 'Sri Lanka', nameJa: 'スリランカ', continent: 'Asia', continentJa: 'アジア', capital: 'Colombo', capitalJa: 'コロンボ', lat: 6.9271, lng: 79.8612, flag: '🇱🇰' },
  { code: 'MV', name: 'Maldives', nameJa: 'モルディブ', continent: 'Asia', continentJa: 'アジア', capital: 'Male', capitalJa: 'マレ', lat: 4.1755, lng: 73.5093, flag: '🇲🇻' },
  { code: 'AE', name: 'United Arab Emirates', nameJa: 'アラブ首長国連邦 (UAE)', continent: 'Asia', continentJa: 'アジア', capital: 'Abu Dhabi', capitalJa: 'アブダビ', lat: 24.4539, lng: 54.3773, flag: '🇦🇪' },
  { code: 'TR', name: 'Turkey', nameJa: 'トルコ', continent: 'Asia', continentJa: 'アジア', capital: 'Ankara', capitalJa: 'アンカラ', lat: 39.9334, lng: 32.8597, flag: '🇹🇷' },
  { code: 'IL', name: 'Israel', nameJa: 'イスラエル', continent: 'Asia', continentJa: 'アジア', capital: 'Jerusalem', capitalJa: 'エルサレム', lat: 31.7683, lng: 35.2137, flag: '🇮🇱' },
  { code: 'UZ', name: 'Uzbekistan', nameJa: 'ウズベキスタン', continent: 'Asia', continentJa: 'アジア', capital: 'Tashkent', capitalJa: 'タシュケント', lat: 41.2995, lng: 69.2401, flag: '🇺🇿' },
  { code: 'MN', name: 'Mongolia', nameJa: 'モンゴル', continent: 'Asia', continentJa: 'アジア', capital: 'Ulaanbaatar', capitalJa: 'ウランバートル', lat: 47.8864, lng: 106.9057, flag: '🇲🇳' },
  { code: 'KH', name: 'Cambodia', nameJa: 'カンボジア', continent: 'Asia', continentJa: 'アジア', capital: 'Phnom Penh', capitalJa: 'プノンペン', lat: 11.5564, lng: 104.9282, flag: '🇰🇭' },
  { code: 'LA', name: 'Laos', nameJa: 'ラオス', continent: 'Asia', continentJa: 'アジア', capital: 'Vientiane', capitalJa: 'ヴィエンチャン', lat: 17.9757, lng: 102.6331, flag: '🇱🇦' },

  // ヨーロッパ
  { code: 'FR', name: 'France', nameJa: 'フランス', continent: 'Europe', continentJa: 'ヨーロッパ', capital: 'Paris', capitalJa: 'パリ', lat: 48.8566, lng: 2.3522, flag: '🇫🇷' },
  { code: 'IT', name: 'Italy', nameJa: 'イタリア', continent: 'Europe', continentJa: 'ヨーロッパ', capital: 'Rome', capitalJa: 'ローマ', lat: 41.9028, lng: 12.4964, flag: '🇮🇹' },
  { code: 'ES', name: 'Spain', nameJa: 'スペイン', continent: 'Europe', continentJa: 'ヨーロッパ', capital: 'Madrid', capitalJa: 'マドリード', lat: 40.4168, lng: -3.7038, flag: '🇪🇸' },
  { code: 'GB', name: 'United Kingdom', nameJa: 'イギリス', continent: 'Europe', continentJa: 'ヨーロッパ', capital: 'London', capitalJa: 'ロンドン', lat: 51.5074, lng: -0.1278, flag: '🇬🇧' },
  { code: 'DE', name: 'Germany', nameJa: 'ドイツ', continent: 'Europe', continentJa: 'ヨーロッパ', capital: 'Berlin', capitalJa: 'ベルリン', lat: 52.52, lng: 13.405, flag: '🇩🇪' },
  { code: 'CH', name: 'Switzerland', nameJa: 'スイス', continent: 'Europe', continentJa: 'ヨーロッパ', capital: 'Bern', capitalJa: 'ベルン', lat: 46.948, lng: 7.4474, flag: '🇨🇭' },
  { code: 'AT', name: 'Austria', nameJa: 'オーストリア', continent: 'Europe', continentJa: 'ヨーロッパ', capital: 'Vienna', capitalJa: 'ウィーン', lat: 48.2082, lng: 16.3738, flag: '🇦🇹' },
  { code: 'NL', name: 'Netherlands', nameJa: 'オランダ', continent: 'Europe', continentJa: 'ヨーロッパ', capital: 'Amsterdam', capitalJa: 'アムステルダム', lat: 52.3676, lng: 4.9041, flag: '🇳🇱' },
  { code: 'BE', name: 'Belgium', nameJa: 'ベルギー', continent: 'Europe', continentJa: 'ヨーロッパ', capital: 'Brussels', capitalJa: 'ブリュッセル', lat: 50.8503, lng: 4.3517, flag: '🇧🇪' },
  { code: 'PT', name: 'Portugal', nameJa: 'ポルトガル', continent: 'Europe', continentJa: 'ヨーロッパ', capital: 'Lisbon', capitalJa: 'リスボン', lat: 38.7223, lng: -9.1393, flag: '🇵🇹' },
  { code: 'GR', name: 'Greece', nameJa: 'ギリシャ', continent: 'Europe', continentJa: 'ヨーロッパ', capital: 'Athens', capitalJa: 'アテネ', lat: 37.9838, lng: 23.7275, flag: '🇬🇷' },
  { code: 'CZ', name: 'Czech Republic', nameJa: 'チェコ', continent: 'Europe', continentJa: 'ヨーロッパ', capital: 'Prague', capitalJa: 'プラハ', lat: 50.0755, lng: 14.4378, flag: '🇨🇿' },
  { code: 'HU', name: 'Hungary', nameJa: 'ハンガリー', continent: 'Europe', continentJa: 'ヨーロッパ', capital: 'Budapest', capitalJa: 'ブダペスト', lat: 47.4979, lng: 19.0402, flag: '🇭🇺' },
  { code: 'SE', name: 'Sweden', nameJa: 'スウェーデン', continent: 'Europe', continentJa: 'ヨーロッパ', capital: 'Stockholm', capitalJa: 'ストックホルム', lat: 59.3293, lng: 18.0686, flag: '🇸🇪' },
  { code: 'NO', name: 'Norway', nameJa: 'ノルウェー', continent: 'Europe', continentJa: 'ヨーロッパ', capital: 'Oslo', capitalJa: 'オスロ', lat: 59.9139, lng: 10.7522, flag: '🇳🇴' },
  { code: 'FI', name: 'Finland', nameJa: 'フィンランド', continent: 'Europe', continentJa: 'ヨーロッパ', capital: 'Helsinki', capitalJa: 'ヘルシンキ', lat: 60.1699, lng: 24.9384, flag: '🇫🇮' },
  { code: 'DK', name: 'Denmark', nameJa: 'デンマーク', continent: 'Europe', continentJa: 'ヨーロッパ', capital: 'Copenhagen', capitalJa: 'コペンハーゲン', lat: 55.6761, lng: 12.5683, flag: '🇩🇰' },
  { code: 'IS', name: 'Iceland', nameJa: 'アイスランド', continent: 'Europe', continentJa: 'ヨーロッパ', capital: 'Reykjavik', capitalJa: 'レイキャビク', lat: 64.1466, lng: -21.9426, flag: '🇮🇸' },
  { code: 'IE', name: 'Ireland', nameJa: 'アイルランド', continent: 'Europe', continentJa: 'ヨーロッパ', capital: 'Dublin', capitalJa: 'ダブリン', lat: 53.3498, lng: -6.2603, flag: '🇮🇪' },
  { code: 'HR', name: 'Croatia', nameJa: 'クロアチア', continent: 'Europe', continentJa: 'ヨーロッパ', capital: 'Zagreb', capitalJa: 'ザグレブ', lat: 45.815, lng: 15.9819, flag: '🇭🇷' },
  { code: 'PL', name: 'Poland', nameJa: 'ポーランド', continent: 'Europe', continentJa: 'ヨーロッパ', capital: 'Warsaw', capitalJa: 'ワルシャワ', lat: 52.2297, lng: 21.0122, flag: '🇵🇱' },

  // 北アメリカ
  { code: 'US', name: 'United States', nameJa: 'アメリカ合衆国', continent: 'North America', continentJa: '北アメリカ', capital: 'Washington D.C.', capitalJa: 'ワシントンD.C.', lat: 38.9072, lng: -77.0369, flag: '🇺🇸' },
  { code: 'CA', name: 'Canada', nameJa: 'カナダ', continent: 'North America', continentJa: '北アメリカ', capital: 'Ottawa', capitalJa: 'オタワ', lat: 45.4215, lng: -75.6972, flag: '🇨🇦' },
  { code: 'MX', name: 'Mexico', nameJa: 'メキシコ', continent: 'North America', continentJa: '北アメリカ', capital: 'Mexico City', capitalJa: 'メキシコシティ', lat: 19.4326, lng: -99.1332, flag: '🇲🇽' },
  { code: 'CU', name: 'Cuba', nameJa: 'キューバ', continent: 'North America', continentJa: '北アメリカ', capital: 'Havana', capitalJa: 'ハバナ', lat: 23.1136, lng: -82.3666, flag: '🇨🇺' },
  { code: 'JM', name: 'Jamaica', nameJa: 'ジャマイカ', continent: 'North America', continentJa: '北アメリカ', capital: 'Kingston', capitalJa: 'キングストン', lat: 17.9712, lng: -76.7936, flag: '🇯🇲' },
  { code: 'CR', name: 'Costa Rica', nameJa: 'コスタリカ', continent: 'North America', continentJa: '北アメリカ', capital: 'San Jose', capitalJa: 'サンホセ', lat: 9.9281, lng: -84.0907, flag: '🇨🇷' },

  // 南アメリカ
  { code: 'BR', name: 'Brazil', nameJa: 'ブラジル', continent: 'South America', continentJa: '南アメリカ', capital: 'Brasilia', capitalJa: 'ブラジリア', lat: -15.8267, lng: -47.9218, flag: '🇧🇷' },
  { code: 'AR', name: 'Argentina', nameJa: 'アルゼンチン', continent: 'South America', continentJa: '南アメリカ', capital: 'Buenos Aires', capitalJa: 'ブエノスアイレス', lat: -34.6037, lng: -58.3816, flag: '🇦🇷' },
  { code: 'PE', name: 'Peru', nameJa: 'ペルー', continent: 'South America', continentJa: '南アメリカ', capital: 'Lima', capitalJa: 'リマ', lat: -12.0464, lng: -77.0428, flag: '🇵🇪' },
  { code: 'CL', name: 'Chile', nameJa: 'チリ', continent: 'South America', continentJa: '南アメリカ', capital: 'Santiago', capitalJa: 'サンティアゴ', lat: -33.4489, lng: -70.6693, flag: '🇨🇱' },
  { code: 'CO', name: 'Colombia', nameJa: 'コロンビア', continent: 'South America', continentJa: '南アメリカ', capital: 'Bogota', capitalJa: 'ボゴタ', lat: 4.711, lng: -74.0721, flag: '🇨🇴' },
  { code: 'BO', name: 'Bolivia', nameJa: 'ボリビア', continent: 'South America', continentJa: '南アメリカ', capital: 'La Paz', capitalJa: 'ラパス', lat: -16.5, lng: -68.15, flag: '🇧🇴' },
  { code: 'EC', name: 'Ecuador', nameJa: 'エクアドル', continent: 'South America', continentJa: '南アメリカ', capital: 'Quito', capitalJa: 'キト', lat: -0.1807, lng: -78.4678, flag: '🇪🇨' },

  // オセアニア
  { code: 'AU', name: 'Australia', nameJa: 'オーストラリア', continent: 'Oceania', continentJa: 'オセアニア', capital: 'Canberra', capitalJa: 'キャンベラ', lat: -35.2809, lng: 149.13, flag: '🇦🇺' },
  { code: 'NZ', name: 'New Zealand', nameJa: 'ニュージーランド', continent: 'Oceania', continentJa: 'オセアニア', capital: 'Wellington', capitalJa: 'ウェリントン', lat: -41.2865, lng: 174.7762, flag: '🇳🇿' },
  { code: 'FJ', name: 'Fiji', nameJa: 'フィジー', continent: 'Oceania', continentJa: 'オセアニア', capital: 'Suva', capitalJa: 'スバ', lat: -18.1416, lng: 178.4419, flag: '🇫🇯' },

  // アフリカ
  { code: 'EG', name: 'Egypt', nameJa: 'エジプト', continent: 'Africa', continentJa: 'アフリカ', capital: 'Cairo', capitalJa: 'カイロ', lat: 30.0444, lng: 31.2357, flag: '🇪🇬' },
  { code: 'MA', name: 'Morocco', nameJa: 'モロッコ', continent: 'Africa', continentJa: 'アフリカ', capital: 'Rabat', capitalJa: 'ラバト', lat: 34.0209, lng: -6.8416, flag: '🇲🇦' },
  { code: 'ZA', name: 'South Africa', nameJa: '南アフリカ', continent: 'Africa', continentJa: 'アフリカ', capital: 'Pretoria', capitalJa: 'プレトリア', lat: -25.7479, lng: 28.2293, flag: '🇿🇦' },
  { code: 'KE', name: 'Kenya', nameJa: 'ケニア', continent: 'Africa', continentJa: 'アフリカ', capital: 'Nairobi', capitalJa: 'ナイロビ', lat: -1.2921, lng: 36.8219, flag: '🇰🇪' },
  { code: 'TZ', name: 'Tanzania', nameJa: 'タンザニア', continent: 'Africa', continentJa: 'アフリカ', capital: 'Dodoma', capitalJa: 'ドドマ', lat: -6.163, lng: 35.7516, flag: '🇹🇿' },
  { code: 'MG', name: 'Madagascar', nameJa: 'マダガスカル', continent: 'Africa', continentJa: 'アフリカ', capital: 'Antananarivo', capitalJa: 'アンタナナリボ', lat: -18.8792, lng: 47.5079, flag: '🇲🇬' },
];

export const TOTAL_WORLD_COUNTRIES = 195;

export function findCountryByCode(code: string): CountryInfo | undefined {
  return COUNTRIES.find((c) => c.code.toUpperCase() === code.toUpperCase());
}

export function findCountryByNameOrQuery(query: string): CountryInfo[] {
  const q = query.trim().toLowerCase();
  if (!q) return COUNTRIES;
  return COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.nameJa.includes(q) ||
      c.capital.toLowerCase().includes(q) ||
      c.capitalJa.includes(q) ||
      c.continent.toLowerCase().includes(q) ||
      c.continentJa.includes(q) ||
      c.code.toLowerCase() === q
  );
}

// Find closest country to a given latitude and longitude
export function findClosestCountry(lat: number, lng: number): CountryInfo {
  let closest = COUNTRIES[0];
  let minDistance = Number.POSITIVE_INFINITY;

  for (const country of COUNTRIES) {
    const dLat = (country.lat - lat) * (Math.PI / 180);
    const dLng = (country.lng - lng) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat * (Math.PI / 180)) *
        Math.cos(country.lat * (Math.PI / 180)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    if (c < minDistance) {
      minDistance = c;
      closest = country;
    }
  }

  return closest;
}
