import type { LngLat } from 'maplibre-gl';
import type maplibregl from 'maplibre-gl';
import { feature } from 'topojson-client';
import { readable, writable } from 'svelte/store';
import { browser } from '$app/environment';

import { layers } from './assets/boundaries';

const params = browser
  ? new URLSearchParams(window.location.search)
  : new URLSearchParams();

function getLngLatObjectFromUrl(
  lng: string | null,
  lat: string | null
): LngLat | null {
  if (!lng || !lat) {
    return null;
  }
  return {
    lat: parseFloat(lat),
    lng: parseFloat(lng)
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
export const mapStore = writable<maplibregl.Map>();

export const boundaries = readable(null, set => {
  if (browser) {
    fetch(`./boundaries.json`)
      .then(response => response.json())
      .then(topojson => feature(topojson, topojson.objects.boundaries))
      .then(geojson => set(geojson))
      .catch(error => {
        console.error('Error fetching boundaries:', error);
        set(null);
      });
  }

  return () => {};
});

export const isMapReady = writable<boolean>(false);

// Dark mode store with system preference detection
export const darkMode = writable<boolean>(false);

if (browser) {
  // Set initial value
  darkMode.set(window.matchMedia('(prefers-color-scheme: dark)').matches);
  
  // Listen for changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    darkMode.set(e.matches);
  });
}
