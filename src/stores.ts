import type { LngLat } from 'maplibre-gl';
import type maplibregl from 'maplibre-gl';
import type { Feature, FeatureCollection } from 'geojson';
import { feature } from 'topojson-client';
import { writable, get } from 'svelte/store';
import { browser } from '$app/environment';
import { MediaQuery } from 'svelte/reactivity';
import { cityConfig, onCityChange } from './configs/config';
import { findPolylabel, getWardName, getWardNumber } from './helpers/helpers';
import { scheduleIdle as scheduleIdleCb } from './helpers/scheduling';

export const selectedBoundaryMap = writable<string | null>(null);
export const selectedDistrict = writable<string | null>(null);
export const hoveredDistrictId = writable<string | number | undefined>();
export const addressMarker = writable<maplibregl.Marker>();
export const selectedCoordinates = writable<LngLat | null>(null);
export const coordinatesMarker = writable<maplibregl.Marker>();
export const officeMarker = writable<maplibregl.Marker>();
export const mapStore = writable<maplibregl.Map>();

// Officials data (fetched from static assets for optimal caching and parsing)
export const officialsData = writable<any[]>([]);

export async function loadOfficialsData(): Promise<void> {
  if (!browser) return;
  if (get(officialsData).length > 0) return;
  try {
    const response = await fetch(`/${cityConfig.cityId}/officials.json`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    officialsData.set(data);
  } catch (error) {
    console.error('Error loading officials data:', error);
  }
}

// Per-department boundary data (loaded on demand)
export const departmentBoundaries = writable<Map<string, FeatureCollection>>(
  new Map()
);

// Cached centerpoint FeatureCollections (polylabel results)
export const departmentCenterpoints = writable<Map<string, FeatureCollection>>(
  new Map()
);

// All boundaries combined — populated via monolithic file background prefetch
export const allBoundaries = writable<FeatureCollection | null>(null);

// Track whether all boundaries have been loaded
export const allBoundariesLoaded = writable(false);

function enrichWardProperties(geojson: FeatureCollection): void {
  for (const f of geojson.features) {
    if (f.properties) {
      const namecol = f.properties['namecol'] || '';
      f.properties['wardName'] = getWardName(namecol);
      f.properties['wardNumber'] = getWardNumber(namecol);
    }
  }
}

function computeCenterpoints(geojson: FeatureCollection): FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: geojson.features.map((f: Feature) => ({
      ...f,
      geometry: {
        type: 'Point' as const,
        coordinates: findPolylabel(f)
      }
    }))
  };
}

function storeBoundary(departmentId: string, geojson: FeatureCollection): void {
  departmentBoundaries.update(map => {
    const newMap = new Map(map);
    newMap.set(departmentId, geojson);
    return newMap;
  });
}

function computeAndStoreCenterpoints(
  departmentId: string,
  geojson: FeatureCollection
): void {
  const centerpoints = computeCenterpoints(geojson);
  departmentCenterpoints.update(map => {
    const newMap = new Map(map);
    newMap.set(departmentId, centerpoints);
    return newMap;
  });
}

function storeBoundaryWithCenterpoints(
  departmentId: string,
  geojson: FeatureCollection
): void {
  storeBoundary(departmentId, geojson);
  computeAndStoreCenterpoints(departmentId, geojson);
}

// Load a single department's per-department TopoJSON
export async function loadDepartmentBoundary(
  departmentId: string
): Promise<FeatureCollection | null> {
  if (!browser) return null;

  const current = get(departmentBoundaries);
  if (current.has(departmentId)) {
    return current.get(departmentId)!;
  }

  try {
    const response = await fetch(
      `/${cityConfig.cityId}/boundaries_${departmentId}.json`
    );
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const topojsonData = await response.json();
    const geojson = feature(
      topojsonData,
      topojsonData.objects.boundaries
    ) as unknown as FeatureCollection;
    enrichWardProperties(geojson);

    storeBoundaryWithCenterpoints(departmentId, geojson);

    return geojson;
  } catch (error) {
    console.error(`Error loading boundaries for ${departmentId}:`, error);
    return null;
  }
}

// Seed a department's data from SSR-prefetched TopoJSON (avoids a network fetch)
export function seedDepartmentBoundary(
  departmentId: string,
  topojsonData: any
): void {
  const current = get(departmentBoundaries);
  if (current.has(departmentId)) return;

  const geojson = feature(
    topojsonData,
    topojsonData.objects.boundaries
  ) as unknown as FeatureCollection;
  enrichWardProperties(geojson);

  storeBoundary(departmentId, geojson);

  scheduleIdleCb(() => computeAndStoreCenterpoints(departmentId, geojson));
}

// Background prefetch: fetch the monolithic boundaries.json for allBoundaries
export async function prefetchAllBoundaries(): Promise<void> {
  if (!browser) return;

  if (get(allBoundariesLoaded)) return;

  try {
    const response = await fetch(`/${cityConfig.cityId}/boundaries.json`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const topojsonData = await response.json();
    const geojson = feature(
      topojsonData,
      topojsonData.objects.boundaries
    ) as unknown as FeatureCollection;
    enrichWardProperties(geojson);

    allBoundaries.set(geojson);
    allBoundariesLoaded.set(true);
  } catch (error) {
    console.error('Error prefetching all boundaries:', error);
  }
}

export const selectedDepartmentGroup = writable<string | null>(null);
export const showCitySelector = writable<boolean>(false);
export const isMapReady = writable<boolean>(false);

// Dark mode store with system preference detection
export const darkMode = writable<boolean>(false);

if (browser) {
  const darkModeQuery = new MediaQuery('(prefers-color-scheme: dark)');
  darkMode.set(darkModeQuery.current);
}

// Reset city-specific stores when switching cities
export function resetCityStores() {
  selectedBoundaryMap.set(null);
  selectedDistrict.set(null);
  hoveredDistrictId.set(undefined);
  selectedCoordinates.set(null);
  selectedDepartmentGroup.set(null);
  officialsData.set([]);
  departmentBoundaries.set(new Map());
  departmentCenterpoints.set(new Map());
  allBoundaries.set(null);
  allBoundariesLoaded.set(false);
  isMapReady.set(false);
}

onCityChange(() => {
  resetCityStores();
});
