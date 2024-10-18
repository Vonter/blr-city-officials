import type { LngLat } from 'maplibre-gl';
import type maplibregl from 'maplibre-gl';
import { feature } from 'topojson-client';
import { readable, writable } from 'svelte/store';

const params = new URLSearchParams(window.location.search);

function getLngLatObjectFromUrl(
  lng: string | null,
  lat: string | null
): LngLat | null {
  if (!lng || !lat) {
    return null;
  }
  return {
    lng: parseFloat(lng).toFixed(5),
    lat: parseFloat(lat).toFixed(5)
  } as LngLat;
}

export const selectedBoundaryMap = writable<string | null>(params.get('map'));
export const selectedDistrict = writable<string | null>(params.get('dist'));
export const hoveredDistrictId = writable<string | number | undefined>();
export const addressMarker = writable<maplibregl.Marker>();
export const selectedCoordinates = writable<LngLat | null>(
  getLngLatObjectFromUrl(params.get('lng'), params.get('lat'))
);
export const coordinatesMarker = writable<maplibregl.Marker>();
export const isSelectingCoordinates = writable<boolean>(false);
export const mapStore = writable<maplibregl.Map>();

export const boundaries = readable(null, set => {
  fetch(`./boundaries.json`)
    .then(response => response.json())
    .then(topojson => feature(topojson, topojson.objects.Clipped))
    .then(geojson => set(geojson))
    .catch(error => {
      console.error('Error fetching boundaries:', error);
      set(null);
    });

  return () => {};
});

export const isMapReady = writable<boolean>(false);
