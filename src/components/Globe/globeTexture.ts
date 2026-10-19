import * as THREE from 'three';
import { GlobeTheme } from '../../types/travel';

// Geographic polygon coordinate clusters [lng, lat]
// Equirectangular projection: x = (lng + 180) / 360 * width, y = (90 - lat) / 180 * height
interface LandmassPolygon {
  name: string;
  points: [number, number][]; // [lng, lat]
  desertPoints?: [number, number][]; // specific arid zones
}

const LANDMASSES: LandmassPolygon[] = [
  // North America
  {
    name: 'North America',
    points: [
      [-168, 65], [-160, 71], [-140, 70], [-130, 69], [-110, 69], [-95, 70],
      [-85, 66], [-75, 62], [-65, 59], [-60, 50], [-66, 44], [-70, 42],
      [-75, 36], [-80, 26], [-82, 25], [-84, 30], [-90, 30], [-97, 26],
      [-97, 20], [-90, 16], [-84, 10], [-78, 8], [-80, 9], [-85, 12],
      [-95, 17], [-105, 23], [-115, 32], [-124, 40], [-124, 48], [-130, 54],
      [-140, 60], [-150, 60], [-165, 54], [-168, 65],
    ],
  },
  // Greenland
  {
    name: 'Greenland',
    points: [
      [-44, 60], [-35, 65], [-20, 72], [-18, 78], [-25, 82], [-45, 83],
      [-55, 81], [-60, 76], [-52, 70], [-48, 63], [-44, 60],
    ],
  },
  // South America
  {
    name: 'South America',
    points: [
      [-77, 8], [-72, 12], [-60, 10], [-50, 2], [-40, -2], [-35, -7],
      [-37, -13], [-40, -22], [-48, -28], [-55, -34], [-65, -45], [-70, -53],
      [-75, -50], [-74, -40], [-72, -30], [-78, -15], [-81, -5], [-77, 8],
    ],
  },
  // Eurasia (Europe + Asia)
  {
    name: 'Eurasia',
    points: [
      [-9, 36], [-9, 43], [0, 45], [5, 53], [8, 57], [20, 64], [25, 71],
      [45, 68], [70, 73], [100, 76], [140, 72], [170, 68], [178, 65],
      [160, 55], [142, 50], [130, 42], [122, 38], [120, 32], [118, 25],
      [108, 20], [105, 10], [100, 4], [98, 12], [88, 22], [80, 14],
      [73, 20], [68, 24], [58, 25], [50, 28], [42, 16], [44, 12],
      [36, 27], [35, 34], [28, 41], [15, 41], [12, 45], [2, 49],
      [-4, 48], [-9, 36],
    ],
  },
  // Scandinavia
  {
    name: 'Scandinavia',
    points: [
      [5, 58], [10, 60], [15, 65], [25, 71], [30, 70], [28, 65],
      [22, 60], [14, 56], [10, 54], [5, 58],
    ],
  },
  // British Isles
  {
    name: 'UK & Ireland',
    points: [
      [-10, 51], [-6, 50], [1, 52], [0, 58], [-4, 59], [-8, 55], [-10, 51],
    ],
  },
  // Japan
  {
    name: 'Japan',
    points: [
      [130, 31], [132, 34], [136, 35], [141, 38], [145, 44], [141, 45],
      [140, 41], [136, 37], [132, 33], [129, 31], [130, 31],
    ],
  },
  // Africa
  {
    name: 'Africa',
    points: [
      [-5, 36], [10, 37], [25, 32], [32, 31], [34, 28], [43, 12],
      [51, 10], [42, -5], [40, -15], [35, -25], [30, -32], [20, -34],
      [15, -28], [12, -18], [10, -5], [2, 5], [-12, 5], [-17, 14],
      [-15, 22], [-10, 30], [-5, 36],
    ],
  },
  // Madagascar
  {
    name: 'Madagascar',
    points: [
      [44, -12], [50, -15], [48, -24], [44, -25], [43, -17], [44, -12],
    ],
  },
  // Australia
  {
    name: 'Australia',
    points: [
      [114, -22], [122, -16], [135, -12], [142, -11], [146, -18],
      [153, -28], [150, -37], [138, -35], [128, -32], [115, -34],
      [113, -26], [114, -22],
    ],
  },
  // New Zealand
  {
    name: 'New Zealand',
    points: [
      [168, -46], [172, -43], [175, -37], [178, -38], [174, -42],
      [170, -46], [168, -46],
    ],
  },
  // Indonesia & Philippines islands archipelago
  {
    name: 'Indonesia-Sumatra-Java',
    points: [
      [96, 4], [102, 1], [106, -5], [114, -8], [110, -7],
      [104, -4], [98, 2], [96, 4],
    ],
  },
  {
    name: 'Borneo',
    points: [
      [110, 1], [116, 6], [118, 4], [116, -3], [112, -2], [110, 1],
    ],
  },
  {
    name: 'Philippines',
    points: [
      [120, 18], [123, 14], [125, 9], [122, 7], [120, 13], [120, 18],
    ],
  },
  // Antarctica
  {
    name: 'Antarctica',
    points: [
      [-180, -65], [-120, -72], [-60, -65], [-40, -65], [0, -68],
      [60, -66], [120, -65], [160, -70], [180, -65], [180, -90],
      [-180, -90], [-180, -65],
    ],
  },
];

// Helper to project lon/lat to canvas coordinates
function toCanvasX(lng: number, width: number): number {
  return ((lng + 180) / 360) * width;
}

function toCanvasY(lat: number, height: number): number {
  return ((90 - lat) / 180) * height;
}

// Generate the high-res equirectangular canvas texture procedurally
export function createGlobeTexture(
  theme: GlobeTheme,
  highlightedCodes: string[] = []
): THREE.CanvasTexture {
  const width = 2048;
  const height = 1024;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { alpha: false });

  if (!ctx) {
    const fallback = new THREE.CanvasTexture(canvas);
    return fallback;
  }

  // 1. Draw Oceans and background
  if (theme === 'satellite') {
    // Deep rich oceanic gradient
    const oceanGrad = ctx.createLinearGradient(0, 0, 0, height);
    oceanGrad.addColorStop(0, '#0c223c');
    oceanGrad.addColorStop(0.2, '#081c36');
    oceanGrad.addColorStop(0.5, '#051833');
    oceanGrad.addColorStop(0.8, '#081c36');
    oceanGrad.addColorStop(1, '#0c223c');
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(0, 0, width, height);

    // Oceanic bathymetry currents / subtle shelves
    ctx.fillStyle = 'rgba(14, 116, 144, 0.08)';
    ctx.fillRect(0, height * 0.35, width, height * 0.3);
  } else if (theme === 'vintage') {
    // Antique parchment
    const oceanGrad = ctx.createLinearGradient(0, 0, width, height);
    oceanGrad.addColorStop(0, '#e5d7bd');
    oceanGrad.addColorStop(0.5, '#deb887');
    oceanGrad.addColorStop(1, '#cfaf81');
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(0, 0, width, height);

    // Subtle parchment texture noise
    ctx.fillStyle = 'rgba(120, 80, 40, 0.04)';
    for (let i = 0; i < 400; i++) {
      const rx = Math.random() * width;
      const ry = Math.random() * height;
      ctx.fillRect(rx, ry, Math.random() * 4 + 1, Math.random() * 4 + 1);
    }
  } else {
    // Neon Midnight
    ctx.fillStyle = '#030712';
    ctx.fillRect(0, 0, width, height);

    // Deep grid lines
    ctx.strokeStyle = 'rgba(30, 41, 59, 0.4)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= width; x += width / 24) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y <= height; y += height / 12) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  }

  // 2. Draw Latitude & Longitude Graticules
  ctx.lineWidth = 1;
  if (theme === 'satellite') {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
  } else if (theme === 'vintage') {
    ctx.strokeStyle = 'rgba(139, 94, 60, 0.18)';
  } else {
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)';
  }

  // Parallels (every 30 deg)
  for (let lat = -60; lat <= 60; lat += 30) {
    const y = toCanvasY(lat, height);
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // Meridians (every 30 deg)
  for (let lng = -150; lng <= 180; lng += 30) {
    const x = toCanvasX(lng, width);
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  // Equator & Prime Meridian highlight
  if (theme === 'vintage') {
    ctx.strokeStyle = 'rgba(120, 53, 15, 0.45)';
  } else if (theme === 'neon') {
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
  } else {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  }
  ctx.lineWidth = 1.5;
  const equatorY = toCanvasY(0, height);
  ctx.beginPath();
  ctx.moveTo(0, equatorY);
  ctx.lineTo(width, equatorY);
  ctx.stroke();

  // 3. Draw Continental Landmasses
  for (const land of LANDMASSES) {
    const pts = land.points;
    if (pts.length < 3) continue;

    ctx.beginPath();
    const startX = toCanvasX(pts[0][0], width);
    const startY = toCanvasY(pts[0][1], height);
    ctx.moveTo(startX, startY);

    for (let i = 1; i < pts.length; i++) {
      const cx = toCanvasX(pts[i][0], width);
      const cy = toCanvasY(pts[i][1], height);
      ctx.lineTo(cx, cy);
    }
    ctx.closePath();

    if (theme === 'satellite') {
      if (land.name === 'Antarctica' || land.name === 'Greenland') {
        ctx.fillStyle = '#f1f5f9';
      } else {
        // Lush green/earth tone
        ctx.fillStyle = '#1e3a24';
      }
      ctx.fill();

      // Coastline rim
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    } else if (theme === 'vintage') {
      ctx.fillStyle = '#f5ecd7';
      ctx.fill();

      ctx.strokeStyle = '#85582c';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Vintage coastline hatching
      ctx.strokeStyle = 'rgba(133, 88, 44, 0.2)';
      ctx.lineWidth = 4;
      ctx.stroke();
    } else {
      // Neon Midnight
      ctx.fillStyle = '#091528';
      ctx.fill();

      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Inner glow outline
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
      ctx.lineWidth = 5;
      ctx.stroke();
    }
  }

  // 4. Draw Arid Deserts / Topographical variation on continents
  if (theme === 'satellite') {
    // Sahara & Arabian desert
    ctx.fillStyle = '#5c4827';
    ctx.beginPath();
    ctx.ellipse(toCanvasX(20, width), toCanvasY(24, height), width * 0.08, height * 0.06, 0, 0, Math.PI * 2);
    ctx.fill();

    // Australian Outback
    ctx.beginPath();
    ctx.ellipse(toCanvasX(133, width), toCanvasY(-25, height), width * 0.04, height * 0.04, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // 5. Compass Rose for Vintage Mode
  if (theme === 'vintage') {
    const cx = toCanvasX(-130, width);
    const cy = toCanvasY(-20, height);
    ctx.save();
    ctx.translate(cx, cy);
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, 0, 36, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-45, 0); ctx.lineTo(45, 0);
    ctx.moveTo(0, -45); ctx.lineTo(0, 45);
    ctx.stroke();
    ctx.fillStyle = '#78350f';
    ctx.font = 'bold 12px serif';
    ctx.fillText('N', -4, -48);
    ctx.fillText('S', -3, 58);
    ctx.fillText('E', 50, 4);
    ctx.fillText('W', -60, 4);
    ctx.restore();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;

  return texture;
}

// Generate ocean roughness map procedurally
export function createRoughnessTexture(): THREE.CanvasTexture {
  const width = 1024;
  const height = 512;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // Oceans are glossy (low roughness = dark)
    ctx.fillStyle = '#222222';
    ctx.fillRect(0, 0, width, height);

    // Continents are matte (high roughness = light)
    for (const land of LANDMASSES) {
      const pts = land.points;
      if (pts.length < 3) continue;
      ctx.beginPath();
      ctx.moveTo(toCanvasX(pts[0][0], width), toCanvasY(pts[0][1], height));
      for (let i = 1; i < pts.length; i++) {
        ctx.lineTo(toCanvasX(pts[i][0], width), toCanvasY(pts[i][1], height));
      }
      ctx.closePath();
      ctx.fillStyle = '#bbbbbb';
      ctx.fill();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}
