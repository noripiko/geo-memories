import { TravelMemory } from '../types/travel';

// SVG data URLs for instant, zero-dependency, crystal-clear sample travel photos
function createPhotoDataUrl(
  title: string,
  subtitle: string,
  skyGradient: [string, string],
  groundGradient: [string, string],
  iconType: 'monument' | 'nature' | 'urban' | 'temple' | 'pyramid' | 'aurora'
): string {
  let shapeSvg = '';

  if (iconType === 'monument') {
    // Eiffel / Tower shape
    shapeSvg = `
      <polygon points="190,260 210,260 203,140 197,140" fill="#334155" />
      <polygon points="196,140 204,140 201,80 199,80" fill="#1e293b" />
      <line x1="200" y1="80" x2="200" y2="50" stroke="#0f172a" stroke-width="2" />
      <path d="M 180 260 Q 200 240 220 260" fill="none" stroke="#334155" stroke-width="6" />
      <ellipse cx="200" cy="180" rx="20" ry="4" fill="#64748b" />
    `;
  } else if (iconType === 'temple') {
    // Temple / Shinto shrine / pagoda
    shapeSvg = `
      <path d="M 150 140 Q 200 120 250 140 L 245 150 L 155 150 Z" fill="#dc2626" />
      <path d="M 160 170 Q 200 155 240 170 L 235 180 L 165 180 Z" fill="#991b1b" />
      <rect x="175" y="180" width="12" height="80" fill="#b91c1c" />
      <rect x="213" y="180" width="12" height="80" fill="#b91c1c" />
      <rect x="187" y="200" width="26" height="60" fill="#450a0a" />
      <circle cx="280" cy="90" r="28" fill="#f87171" opacity="0.8" />
    `;
  } else if (iconType === 'pyramid') {
    // Pyramids
    shapeSvg = `
      <polygon points="130,260 270,260 200,120" fill="#d97706" />
      <polygon points="200,120 270,260 250,260 190,140" fill="#b45309" />
      <polygon points="70,260 170,260 120,160" fill="#f59e0b" opacity="0.9" />
      <circle cx="260" cy="80" r="22" fill="#fbbf24" />
    `;
  } else if (iconType === 'nature') {
    // Machu Picchu / Mountains
    shapeSvg = `
      <polygon points="80,260 160,110 240,260" fill="#15803d" />
      <polygon points="180,260 260,140 340,260" fill="#166534" />
      <polygon points="20,260 100,160 180,260" fill="#14532d" />
      <path d="M 100 220 L 140 220 L 140 230 L 100 230 Z" fill="#78716c" />
      <path d="M 120 235 L 160 235 L 160 245 L 120 245 Z" fill="#a8a29e" />
    `;
  } else if (iconType === 'aurora') {
    // Northern Lights & Glaciers
    shapeSvg = `
      <path d="M 30 110 Q 120 40 200 90 T 370 70" fill="none" stroke="#34d399" stroke-width="16" opacity="0.75" filter="blur(8px)" />
      <path d="M 50 130 Q 150 70 240 120 T 380 90" fill="none" stroke="#22d3ee" stroke-width="14" opacity="0.65" filter="blur(10px)" />
      <polygon points="40,260 120,180 200,260" fill="#0f172a" />
      <polygon points="160,260 260,160 360,260" fill="#1e293b" />
      <circle cx="80" cy="60" r="2" fill="#ffffff" />
      <circle cx="150" cy="40" r="2" fill="#ffffff" />
      <circle cx="310" cy="50" r="1.5" fill="#ffffff" />
      <circle cx="270" cy="85" r="2" fill="#ffffff" />
    `;
  } else {
    // Colosseum / Ancient Architecture
    shapeSvg = `
      <ellipse cx="200" cy="220" rx="90" ry="40" fill="#78716c" />
      <path d="M 110 220 L 110 160 Q 200 130 290 160 L 290 220 Z" fill="#a8a29e" />
      <rect x="130" y="165" width="12" height="24" rx="6" fill="#44403c" />
      <rect x="155" y="160" width="12" height="26" rx="6" fill="#44403c" />
      <rect x="180" y="157" width="12" height="28" rx="6" fill="#44403c" />
      <rect x="205" y="157" width="12" height="28" rx="6" fill="#44403c" />
      <rect x="230" y="160" width="12" height="26" rx="6" fill="#44403c" />
      <rect x="255" y="165" width="12" height="24" rx="6" fill="#44403c" />
    `;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
    <defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${skyGradient[0]}"/>
        <stop offset="100%" stop-color="${skyGradient[1]}"/>
      </linearGradient>
      <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${groundGradient[0]}"/>
        <stop offset="100%" stop-color="${groundGradient[1]}"/>
      </linearGradient>
    </defs>
    <rect width="400" height="300" fill="url(#sky)"/>
    ${shapeSvg}
    <rect y="245" width="400" height="55" fill="url(#ground)"/>
    <rect x="16" y="16" width="368" height="40" rx="6" fill="rgba(15, 23, 42, 0.65)" />
    <text x="28" y="36" fill="#f8fafc" font-size="14" font-family="sans-serif" font-weight="600">${title}</text>
    <text x="28" y="49" fill="#94a3b8" font-size="10" font-family="sans-serif">${subtitle}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const INITIAL_MEMORIES: TravelMemory[] = [
  {
    id: 'mem-1',
    countryCode: 'FR',
    countryName: 'France',
    countryNameJa: 'フランス',
    flag: '🇫🇷',
    placeName: 'パリ・エッフェル塔とセーヌ河畔',
    lat: 48.8584,
    lng: 2.2945,
    visitDate: '2025-05-18',
    returnDate: '2025-05-25',
    rating: 5,
    companion: 'パートナー',
    category: '都市散策・アート',
    notes:
      '夕暮れ時にシャン・ド・マルス公園から眺めるエッフェル塔のライトアップが息をのむほど美しかった。セーヌ川のクルーズ船から見る歴史的建造物と、サンジェルマン・デ・プレのカフェで飲んだエスプレッソの香りが今でも鮮明です。ルーヴル美術館ではモナ・リザとミロのヴィーナスをじっくり鑑賞できました。',
    photos: [
      {
        id: 'p-fr-1',
        url: createPhotoDataUrl('Eiffel Tower at Twilight', 'Paris, France', ['#1e1b4b', '#4338ca'], ['#0f172a', '#1e293b'], 'monument'),
        caption: '夕暮れのエッフェル塔とシャン・ド・マルス公園',
      },
    ],
    createdAt: 1747641600000,
  },
  {
    id: 'mem-2',
    countryCode: 'IT',
    countryName: 'Italy',
    countryNameJa: 'イタリア',
    flag: '🇮🇹',
    placeName: 'ローマ・コロッセオとトレビの泉',
    lat: 41.8902,
    lng: 12.4922,
    visitDate: '2024-09-12',
    returnDate: '2024-09-20',
    rating: 5,
    companion: '友人',
    category: '世界遺産・歴史',
    notes:
      '古代ローマ帝国の圧倒的なスケールを誇るコロッセオに足を踏み入れた瞬間の鳥肌は忘れられません。トレビの泉にコインを投げ入れて「またローマに戻ってこられますように」と祈願。トラステヴェレ地区の小さなトラットリアで食べた本場カルボナーラとピスタチオジェラートは人生最高の味でした。',
    photos: [
      {
        id: 'p-it-1',
        url: createPhotoDataUrl('Colosseo Romano', 'Rome, Italy', ['#0284c7', '#38bdf8'], ['#78716c', '#44403c'], 'urban'),
        caption: '2000年の時を超える古代遺跡コロッセオ',
      },
    ],
    createdAt: 1726128000000,
  },
  {
    id: 'mem-3',
    countryCode: 'PE',
    countryName: 'Peru',
    countryNameJa: 'ペルー',
    flag: '🇵🇪',
    placeName: '天空の都市 マチュピチュ遺跡',
    lat: -13.1631,
    lng: -72.545,
    visitDate: '2024-03-05',
    returnDate: '2024-03-14',
    rating: 5,
    companion: '一人旅',
    category: '絶景・自然',
    notes:
      '早朝、霧が晴れて姿を現したマチュピチュの全景はまるで神話の世界。アンデスの険しい峰々に囲まれたインカ帝国の高度な石組み建築にただただ圧倒されました。クスコの高地順応でコカ茶を飲みながら地元の人々の温かさに触れたのも最高の思い出。一生に一度は訪れるべき場所です。',
    photos: [
      {
        id: 'p-pe-1',
        url: createPhotoDataUrl('Machu Picchu Citadel', 'Cusco, Peru', ['#065f46', '#10b981'], ['#14532d', '#052e16'], 'nature'),
        caption: '霧の中から現れたインカの空中都市',
      },
    ],
    createdAt: 1709625600000,
  },
  {
    id: 'mem-4',
    countryCode: 'JP',
    countryName: 'Japan',
    countryNameJa: '日本',
    flag: '🇯🇵',
    placeName: '京都・伏見稲荷大社と嵐山',
    lat: 34.9671,
    lng: 135.7727,
    visitDate: '2024-11-22',
    returnDate: '2024-11-25',
    rating: 5,
    companion: '家族',
    category: '世界遺産・歴史',
    notes:
      '紅葉のピークを迎えた京都へ。千本鳥居が朝露に輝く神秘的な光景と、渡月橋から望む嵐山の色彩グラデーション。老舗の湯豆腐料理をいただき、静寂に包まれた苔寺で写経体験をして心が洗われました。四季の美しさを改めて実感した特別な秋旅。',
    photos: [
      {
        id: 'p-jp-1',
        url: createPhotoDataUrl('Fushimi Inari Taisha', 'Kyoto, Japan', ['#7f1d1d', '#f87171'], ['#450a0a', '#1c1917'], 'temple'),
        caption: '朱色の千本鳥居と秋の紅葉',
      },
    ],
    createdAt: 1732262400000,
  },
  {
    id: 'mem-5',
    countryCode: 'TH',
    countryName: 'Thailand',
    countryNameJa: 'タイ',
    flag: '🇹🇭',
    placeName: 'バンコク・ワットアルンと水上マーケット',
    lat: 13.7437,
    lng: 100.4888,
    visitDate: '2023-12-28',
    returnDate: '2024-01-03',
    rating: 4,
    companion: '友人',
    category: 'グルメ探求',
    notes:
      'チャオプラヤー川のほとりにそびえる暁の寺（ワット・アルン）の陶器モザイク装飾の緻密さに感動。ナイトマーケットでは屋台のパッタイ、トムヤムクン、マンゴースティッキーライスを堪能。活気あるトゥクトゥクの風を感じながら駆け抜けた年越し旅行でした。',
    photos: [
      {
        id: 'p-th-1',
        url: createPhotoDataUrl('Wat Arun Temple of Dawn', 'Bangkok, Thailand', ['#ca8a04', '#fde047'], ['#713f12', '#451a03'], 'temple'),
        caption: '夕日に輝く暁の寺ワット・アルン',
      },
    ],
    createdAt: 1703750400000,
  },
  {
    id: 'mem-6',
    countryCode: 'EG',
    countryName: 'Egypt',
    countryNameJa: 'エジプト',
    flag: '🇪🇬',
    placeName: 'ギザ・大ピラミッドとスフィンクス',
    lat: 29.9792,
    lng: 31.1342,
    visitDate: '2023-08-10',
    returnDate: '2023-08-18',
    rating: 5,
    companion: '一人旅',
    category: '世界遺産・歴史',
    notes:
      '砂漠の地平線にそびえ立つクフ王の大ピラミッド。4500年以上前に巨大な石を積み上げた古代人の知恵と労力に言葉を失いました。ラクダの背に揺られながら眺めるスフィンクス越しの夕陽は黄金色に輝き、まさに歴史の鼓動を感じる体験でした。',
    photos: [
      {
        id: 'p-eg-1',
        url: createPhotoDataUrl('Great Pyramids of Giza', 'Giza, Egypt', ['#b45309', '#fcd34d'], ['#78350f', '#451a03'], 'pyramid'),
        caption: '黄金の砂漠にそびえるクフ王の大ピラミッド',
      },
    ],
    createdAt: 1691654400000,
  },
  {
    id: 'mem-7',
    countryCode: 'IS',
    countryName: 'Iceland',
    countryNameJa: 'アイスランド',
    flag: '🇮🇸',
    placeName: 'ブルーラグーンとオーロラ観測',
    lat: 63.8804,
    lng: -22.4495,
    visitDate: '2023-02-14',
    returnDate: '2023-02-21',
    rating: 5,
    companion: 'パートナー',
    category: 'アウトドア・冒険',
    notes:
      '溶岩台地に広がるミルキーブルーの温泉「ブルーラグーン」で極寒の中温まる至福のひととき。夜には満天の星空を横切るように緑と紫のオーロラが揺らめき、自然の神秘に涙が出そうになりました。氷河ハイキングや滝の迫力も唯一無二でした。',
    photos: [
      {
        id: 'p-is-1',
        url: createPhotoDataUrl('Northern Lights & Lagoon', 'Grindavik, Iceland', ['#064e3b', '#06b6d4'], ['#022c22', '#0f172a'], 'aurora'),
        caption: '夜空を舞う神秘のエメラルドオーロラ',
      },
    ],
    createdAt: 1676361600000,
  },
];

export const STORAGE_KEY = 'geomemories_travel_records_v1';

export function loadMemoriesFromStorage(): TravelMemory[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveMemoriesToStorage(INITIAL_MEMORIES);
      return INITIAL_MEMORIES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_MEMORIES;
  } catch (err) {
    console.error('Failed to load memories from localStorage', err);
    return INITIAL_MEMORIES;
  }
}

export function saveMemoriesToStorage(memories: TravelMemory[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(memories));
  } catch (err) {
    console.error('Failed to save memories to localStorage', err);
  }
}
