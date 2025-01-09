const EARTH_RADIUS_KM = 6371;

export function calculateDistance(loc1: [number, number], loc2: [number, number]): number {
  const dLat = toRad(loc2[0] - loc1[0]);
  const dLon = toRad(loc2[1] - loc1[1]);
  const lat1 = toRad(loc1[0]);
  const lat2 = toRad(loc2[0]);

  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return EARTH_RADIUS_KM * c;
}

function toRad(value: number): number {
  return value * Math.PI / 180;
}