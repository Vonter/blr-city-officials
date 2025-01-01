import { selectedBoundaryMap, selectedCoordinates, selectedDistrict } from '../stores';
import type { LngLat } from 'maplibre-gl';

// Helper to get LngLat from params
function getLngLat(params: URLSearchParams): LngLat | null {
  const lng = params.get('lng');
  const lat = params.get('lat');
  return lng && lat ? { lng: +lng, lat: +lat } as LngLat : null;
}

export function load({ url }) {
  const params = url.searchParams;
  const dist = params.get('dist');
  const map = params.get('map');
  const coords = getLngLat(params);

  if (dist) selectedDistrict.set(dist);
  if (map) selectedBoundaryMap.set(map);
  if (coords) selectedCoordinates.set(coords);

  return {};
}