import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GlobeSettings, TravelMemory } from '../../types/travel';
import { findClosestCountry } from '../../data/countries';
import { createFlightArc, latLngToVector3, vector3ToLatLng } from '../../utils/geoMath';
import { createGlobeTexture, createRoughnessTexture } from './globeTexture';

interface GlobeCanvasProps {
  memories: TravelMemory[];
  settings: GlobeSettings;
  selectedMemory: TravelMemory | null;
  onSelectMemory: (memory: TravelMemory | null) => void;
  onGlobeClickLocation: (lat: number, lng: number, closestCountryCode: string) => void;
  flyToLocation: { lat: number; lng: number } | null;
}

const GLOBE_RADIUS = 10;

// Reusable math helpers at module scope to avoid GC in animation loop
const _tempVec3 = new THREE.Vector3();
const _tempQuat = new THREE.Quaternion();

export const GlobeCanvas: React.FC<GlobeCanvasProps> = ({
  memories,
  settings,
  selectedMemory,
  onSelectMemory,
  onGlobeClickLocation,
  flyToLocation,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const globeMeshRef = useRef<THREE.Mesh | null>(null);
  const atmosphereRef = useRef<THREE.Mesh | null>(null);
  const pinsGroupRef = useRef<THREE.Group | null>(null);
  const arcsGroupRef = useRef<THREE.Group | null>(null);
  const arcPulsesRef = useRef<{ curve: THREE.CatmullRomCurve3; mesh: THREE.Mesh; speed: number; progress: number }[]>([]);

  // Orbit & Camera state
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const globeRotationRef = useRef({ x: 0.3, y: 0 });
  const cameraDistanceRef = useRef(26);
  const targetCameraDistanceRef = useRef(26);
  const targetRotationRef = useRef({ x: 0.3, y: 0 });

  // Hover state
  const hoveredPinRef = useRef<TravelMemory | null>(null);
  const [hoveredMemory, setHoveredMemory] = useState<TravelMemory | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  // Initialize Scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, cameraDistanceRef.current);
    cameraRef.current = camera;

    // 2. Renderer
    const isHeadless = navigator.webdriver || /HeadlessChrome/i.test(navigator.userAgent);
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isHeadless ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    rendererRef.current = renderer;

    container.appendChild(renderer.domElement);

    // 3. Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfffaed, 2.0);
    keyLight.position.set(30, 20, 25);
    scene.add(keyLight);

    const fillLight = new THREE.HemisphereLight(0x38bdf8, 0x0f172a, 0.6);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.2);
    rimLight.position.set(-30, -10, -25);
    scene.add(rimLight);

    // 4. Cosmos Starfield
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 1200;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      const radius = 120 + Math.random() * 80;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      starPositions[i] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      starPositions[i + 2] = radius * Math.cos(phi);
    }
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMaterial = new THREE.PointsMaterial({
      color: 0x94a3b8,
      size: 1.2,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.75,
    });
    const starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);

    // 5. Globe Mesh
    const globeGeometry = new THREE.SphereGeometry(GLOBE_RADIUS, 64, 64);
    const globeTexture = createGlobeTexture(settings.theme);
    const roughnessTexture = createRoughnessTexture();

    const globeMaterial = new THREE.MeshStandardMaterial({
      map: globeTexture,
      roughnessMap: roughnessTexture,
      roughness: settings.theme === 'neon' ? 0.4 : 0.65,
      metalness: settings.theme === 'neon' ? 0.3 : 0.1,
    });

    const globeMesh = new THREE.Mesh(globeGeometry, globeMaterial);
    globeMeshRef.current = globeMesh;
    scene.add(globeMesh);

    // 6. Atmosphere Glow Mesh
    const atmosphereGeometry = new THREE.SphereGeometry(GLOBE_RADIUS * 1.025, 48, 48);
    const atmosphereMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.2);
          gl_FragColor = vec4(0.22, 0.74, 0.97, 1.0) * intensity * 0.85;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false,
    });
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    atmosphereRef.current = atmosphere;
    scene.add(atmosphere);

    // 7. Groups for dynamic pins and arcs
    const pinsGroup = new THREE.Group();
    pinsGroupRef.current = pinsGroup;
    globeMesh.add(pinsGroup);

    const arcsGroup = new THREE.Group();
    arcsGroupRef.current = arcsGroup;
    globeMesh.add(arcsGroup);

    // 8. Animation Loop
    let animationFrameId: number;
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      // Auto rotation when not dragging
      if (settings.autoRotate && !isDraggingRef.current) {
        targetRotationRef.current.y += 0.15 * delta;
      }

      // Smooth camera and rotation damping
      globeRotationRef.current.x = THREE.MathUtils.damp(
        globeRotationRef.current.x,
        targetRotationRef.current.x,
        8,
        delta
      );
      globeRotationRef.current.y = THREE.MathUtils.damp(
        globeRotationRef.current.y,
        targetRotationRef.current.y,
        8,
        delta
      );

      cameraDistanceRef.current = THREE.MathUtils.damp(
        cameraDistanceRef.current,
        targetCameraDistanceRef.current,
        8,
        delta
      );

      if (globeMeshRef.current) {
        globeMeshRef.current.rotation.x = globeRotationRef.current.x;
        globeMeshRef.current.rotation.y = globeRotationRef.current.y;
      }

      if (cameraRef.current) {
        cameraRef.current.position.z = cameraDistanceRef.current;
      }

      // Animate flight arc pulse points
      if (arcPulsesRef.current.length > 0) {
        for (const pulse of arcPulsesRef.current) {
          pulse.progress = (pulse.progress + pulse.speed * delta) % 1;
          const pos = pulse.curve.getPointAt(pulse.progress);
          pulse.mesh.position.copy(pos);
        }
      }

      renderer.render(scene, camera);
    };

    animationFrameId = requestAnimationFrame(animate);

    // 9. Resize Observer
    const handleResize = () => {
      if (!container || !cameraRef.current || !rendererRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);

      // Clean up WebGL resources
      if (rendererRef.current && rendererRef.current.domElement) {
        container.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
      globeGeometry.dispose();
      globeMaterial.dispose();
      globeTexture.dispose();
      roughnessTexture.dispose();
      atmosphereGeometry.dispose();
      atmosphereMaterial.dispose();
      starGeometry.dispose();
      starMaterial.dispose();
    };
  }, []);

  // Update theme when changed
  useEffect(() => {
    if (!globeMeshRef.current) return;
    const material = globeMeshRef.current.material as THREE.MeshStandardMaterial;
    if (material) {
      if (material.map) material.map.dispose();
      material.map = createGlobeTexture(settings.theme);
      material.map.needsUpdate = true;
      material.roughness = settings.theme === 'neon' ? 0.35 : 0.65;
      material.metalness = settings.theme === 'neon' ? 0.4 : 0.1;
      material.needsUpdate = true;
    }
  }, [settings.theme]);

  // Update atmosphere visibility
  useEffect(() => {
    if (atmosphereRef.current) {
      atmosphereRef.current.visible = settings.showAtmosphere;
    }
  }, [settings.showAtmosphere]);

  // Re-build 3D Pins & Arcs when memories or settings change
  useEffect(() => {
    if (!pinsGroupRef.current || !arcsGroupRef.current) return;

    // Clear old pins
    while (pinsGroupRef.current.children.length > 0) {
      const obj = pinsGroupRef.current.children[0];
      pinsGroupRef.current.remove(obj);
      if (obj instanceof THREE.Mesh) {
        obj.geometry.dispose();
        if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
        else obj.material.dispose();
      }
    }

    // Clear old arcs
    while (arcsGroupRef.current.children.length > 0) {
      const obj = arcsGroupRef.current.children[0];
      arcsGroupRef.current.remove(obj);
      if (obj instanceof THREE.Mesh || obj instanceof THREE.Line) {
        obj.geometry.dispose();
        if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
        else obj.material.dispose();
      }
    }
    arcPulsesRef.current = [];

    if (!settings.showPins) return;

    // Procedural Pin Geometries & Materials (Reused for performance)
    const needleGeom = new THREE.CylinderGeometry(0.04, 0.04, 1.2, 12);
    const needleMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.95,
      roughness: 0.15,
    });

    const headGeom = new THREE.SphereGeometry(0.24, 20, 20);
    const groundRingGeom = new THREE.RingGeometry(0.2, 0.45, 24);

    memories.forEach((mem) => {
      const isSelected = selectedMemory?.id === mem.id;
      const surfacePos = latLngToVector3(mem.lat, mem.lng, GLOBE_RADIUS);
      const normal = surfacePos.clone().normalize();

      const pinGroup = new THREE.Group();
      pinGroup.position.copy(surfacePos);

      // Orient pin outward along globe normal
      pinGroup.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);

      // 1. Ground contact ring
      const ringMat = new THREE.MeshBasicMaterial({
        color: isSelected ? 0xf59e0b : 0x38bdf8,
        transparent: true,
        opacity: isSelected ? 0.9 : 0.6,
        side: THREE.DoubleSide,
      });
      const ringMesh = new THREE.Mesh(groundRingGeom, ringMat);
      ringMesh.rotation.x = Math.PI / 2;
      ringMesh.position.y = 0.03;
      pinGroup.add(ringMesh);

      // 2. Needle shaft
      const needleMesh = new THREE.Mesh(needleGeom, needleMat);
      needleMesh.position.y = 0.6;
      pinGroup.add(needleMesh);

      // 3. Glowing Jewel Head
      const headMat = new THREE.MeshStandardMaterial({
        color: isSelected ? 0xf59e0b : 0x0284c7,
        emissive: isSelected ? 0xf59e0b : 0x0284c7,
        emissiveIntensity: isSelected ? 0.9 : 0.5,
        roughness: 0.2,
        metalness: 0.8,
      });
      const headMesh = new THREE.Mesh(headGeom, headMat);
      headMesh.position.y = 1.25;
      (headMesh as any).userData = { memoryId: mem.id, memory: mem };
      pinGroup.add(headMesh);

      // Interactive hit area (invisible sphere for easier clicks)
      const hitGeom = new THREE.SphereGeometry(0.65, 8, 8);
      const hitMat = new THREE.MeshBasicMaterial({ visible: false });
      const hitMesh = new THREE.Mesh(hitGeom, hitMat);
      hitMesh.position.y = 0.9;
      (hitMesh as any).userData = { memoryId: mem.id, memory: mem };
      pinGroup.add(hitMesh);

      pinsGroupRef.current?.add(pinGroup);
    });

    // Flight Arcs between consecutive journeys
    if (settings.showArcs && memories.length >= 2) {
      // Sort chronologically
      const sorted = [...memories].sort((a, b) => new Date(a.visitDate).getTime() - new Date(b.visitDate).getTime());

      for (let i = 0; i < sorted.length - 1; i++) {
        const from = sorted[i];
        const to = sorted[i + 1];

        const arcPoints = createFlightArc(from.lat, from.lng, to.lat, to.lng, GLOBE_RADIUS, 50);
        const curve = new THREE.CatmullRomCurve3(arcPoints);

        const arcGeom = new THREE.BufferGeometry().setFromPoints(arcPoints);
        const arcMat = new THREE.LineBasicMaterial({
          color: 0xf59e0b,
          transparent: true,
          opacity: 0.55,
          linewidth: 2,
        });

        const arcLine = new THREE.Line(arcGeom, arcMat);
        arcsGroupRef.current?.add(arcLine);

        // Animated pulse particle
        const pulseGeom = new THREE.SphereGeometry(0.12, 12, 12);
        const pulseMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const pulseMesh = new THREE.Mesh(pulseGeom, pulseMat);
        arcsGroupRef.current?.add(pulseMesh);

        arcPulsesRef.current.push({
          curve,
          mesh: pulseMesh,
          speed: 0.25 + Math.random() * 0.1,
          progress: Math.random(),
        });
      }
    }
  }, [memories, settings.showPins, settings.showArcs, selectedMemory]);

  // Handle Fly To Target Lat/Lng smoothly
  useEffect(() => {
    if (!flyToLocation) return;
    const { lat, lng } = flyToLocation;

    // Convert target lat/lng into rotation angles for the globe so it faces camera
    // Target position: (0, 0, Z)
    const targetY = -((lng + 90) * (Math.PI / 180));
    const targetX = (lat * (Math.PI / 180));

    targetRotationRef.current = {
      x: Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, targetX)),
      y: targetY,
    };

    targetCameraDistanceRef.current = 19; // Zoom in slightly for focus
  }, [flyToLocation]);

  // Mouse & Touch Interaction Handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = true;
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const container = mountRef.current;
    if (!container || !cameraRef.current || !globeMeshRef.current || !pinsGroupRef.current) return;

    if (isDraggingRef.current) {
      const deltaX = e.clientX - previousMousePositionRef.current.x;
      const deltaY = e.clientY - previousMousePositionRef.current.y;

      targetRotationRef.current.y += deltaX * 0.005;
      targetRotationRef.current.x = Math.max(
        -Math.PI / 2.2,
        Math.min(Math.PI / 2.2, targetRotationRef.current.x + deltaY * 0.005)
      );

      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    }

    // Raycast for Pin Hovering
    const rect = container.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(mouseX, mouseY), cameraRef.current);

    const hitIntersects = raycaster.intersectObjects(pinsGroupRef.current.children, true);
    const pinHit = hitIntersects.find((hit) => (hit.object as any).userData?.memory);

    if (pinHit) {
      const mem = (pinHit.object as any).userData.memory as TravelMemory;
      hoveredPinRef.current = mem;
      setHoveredMemory(mem);
      setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      container.style.cursor = 'pointer';
    } else {
      hoveredPinRef.current = null;
      setHoveredMemory(null);
      setTooltipPos(null);
      container.style.cursor = isDraggingRef.current ? 'grabbing' : 'grab';
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const wasDragging = isDraggingRef.current;
    isDraggingRef.current = false;

    // Check if click was a tap without drag
    const moveDist = Math.hypot(
      e.clientX - previousMousePositionRef.current.x,
      e.clientY - previousMousePositionRef.current.y
    );

    if (moveDist < 6) {
      handleGlobeClick(e);
    }
  };

  const handleGlobeClick = (e: React.PointerEvent<HTMLDivElement>) => {
    const container = mountRef.current;
    if (!container || !cameraRef.current || !globeMeshRef.current || !pinsGroupRef.current) return;

    const rect = container.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(mouseX, mouseY), cameraRef.current);

    // 1. Check if hit a Pin first
    const pinIntersects = raycaster.intersectObjects(pinsGroupRef.current.children, true);
    const pinHit = pinIntersects.find((hit) => (hit.object as any).userData?.memory);

    if (pinHit) {
      const memory = (pinHit.object as any).userData.memory as TravelMemory;
      onSelectMemory(memory);
      return;
    }

    // 2. Check if hit the Globe surface
    const globeIntersects = raycaster.intersectObject(globeMeshRef.current, false);
    if (globeIntersects.length > 0) {
      const hitPoint = globeIntersects[0].point;
      // Convert world point to local sphere point based on globe rotation
      const inverseRotation = globeMeshRef.current.quaternion.clone().invert();
      const localPoint = hitPoint.clone().applyQuaternion(inverseRotation);

      const { lat, lng } = vector3ToLatLng(localPoint);
      const closest = findClosestCountry(lat, lng);
      onGlobeClickLocation(lat, lng, closest.code);
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    targetCameraDistanceRef.current = Math.max(
      14,
      Math.min(42, targetCameraDistanceRef.current + e.deltaY * 0.02)
    );
  };

  return (
    <div
      ref={mountRef}
      className="relative w-full h-full overflow-hidden cursor-grab active:cursor-grabbing select-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={() => {
        isDraggingRef.current = false;
        setHoveredMemory(null);
      }}
      onWheel={handleWheel}
    >
      {/* Pin Hover Tooltip (Quiet unboxed UI per anti-slop rules) */}
      {hoveredMemory && tooltipPos && (
        <div
          className="pointer-events-none absolute z-30 transition-opacity duration-150 transform -translate-x-1/2 -translate-y-full mb-3"
          style={{ left: `${tooltipPos.x}px`, top: `${tooltipPos.y - 12}px` }}
        >
          <div className="bg-slate-900/95 border border-slate-700/80 px-3.5 py-2 rounded-lg shadow-xl text-left min-w-[160px]">
            <div className="flex items-center gap-1.5 text-sm font-semibold text-white">
              <span>{hoveredMemory.flag}</span>
              <span>{hoveredMemory.countryNameJa}</span>
            </div>
            <p className="text-xs text-slate-300 truncate mt-0.5 max-w-[200px]">
              {hoveredMemory.placeName}
            </p>
            <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
              <span>{hoveredMemory.visitDate}</span>
              <span aria-hidden="true">·</span>
              <span className="text-amber-400">★ {hoveredMemory.rating}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
