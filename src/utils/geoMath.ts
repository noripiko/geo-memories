import * as THREE from 'three';

// Convert Latitude and Longitude to 3D Cartesian coordinates on sphere of radius R
// Three.js convention: Y is up, X/Z are equatorial plane
export function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
}

// Convert 3D Cartesian point on a sphere back to Latitude and Longitude
export function vector3ToLatLng(point: THREE.Vector3): { lat: number; lng: number } {
  const norm = point.clone().normalize();
  const lat = 90 - Math.acos(norm.y) * (180 / Math.PI);
  // atan2(z, -x) corresponds to theta
  let lng = (Math.atan2(norm.z, -norm.x) * (180 / Math.PI)) - 180;
  if (lng < -180) lng += 360;
  if (lng > 180) lng -= 360;

  return {
    lat: Math.max(-90, Math.min(90, lat)),
    lng: Math.max(-180, Math.min(180, lng)),
  };
}

// Generate 3D curved flight arc points between two coordinates
export function createFlightArc(
  startLat: number,
  startLng: number,
  endLat: number,
  endLng: number,
  radius: number,
  numPoints: number = 60
): THREE.Vector3[] {
  const startVec = latLngToVector3(startLat, startLng, radius);
  const endVec = latLngToVector3(endLat, endLng, radius);

  // Angular distance between points
  const angle = startVec.angleTo(endVec);

  // Maximum arc elevation above surface (higher for longer distances)
  const maxAltitude = Math.min(radius * 0.45, Math.max(radius * 0.08, radius * 0.3 * (angle / Math.PI)));

  const points: THREE.Vector3[] = [];

  for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints;
    // Slerp interpolation on unit sphere
    const interpolated = new THREE.Vector3();
    interpolated.lerpVectors(startVec, endVec, t).normalize();

    // Altitude profile (parabolic elevation sine curve)
    const altitude = Math.sin(t * Math.PI) * maxAltitude;
    interpolated.multiplyScalar(radius + altitude);

    points.push(interpolated);
  }

  return points;
}

export function formatDateJapanese(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[0]}年${parseInt(parts[1], 10)}月${parseInt(parts[2], 10)}日`;
  }
  if (parts.length === 2) {
    return `${parts[0]}年${parseInt(parts[1], 10)}月`;
  }
  return dateStr;
}
