import { feature } from 'topojson-client';
import type { FeatureCollection } from 'geojson';
import { allCityIds } from '../configs/config';

export { sortedDistricts, getOfficialDetails } from '../helpers/helpers';

const boundariesCache = new Map<string, FeatureCollection>();
const officialsCache = new Map<string, any[]>();

export function isValidCity(cityId: string): boolean {
  return allCityIds.includes(cityId);
}

export async function loadBoundaries(
  baseUrl: string,
  cityId: string
): Promise<FeatureCollection> {
  const cached = boundariesCache.get(cityId);
  if (cached) return cached;

  try {
    const boundariesUrl = `${baseUrl}/${cityId}/boundaries.json`;
    const response = await fetch(boundariesUrl);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch boundaries: ${response.status} ${response.statusText}`
      );
    }

    const topojsonData = await response.json();
    const geojson = feature(
      topojsonData,
      topojsonData.objects.boundaries
    ) as unknown as FeatureCollection;

    boundariesCache.set(cityId, geojson);
    return geojson;
  } catch (error) {
    console.error('Error loading boundaries:', error);
    throw error;
  }
}

export async function loadOfficials(
  baseUrl: string,
  cityId: string
): Promise<any[]> {
  const cached = officialsCache.get(cityId);
  if (cached) return cached;

  try {
    const officialsUrl = `${baseUrl}/${cityId}/officials.json`;
    const response = await fetch(officialsUrl);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch officials: ${response.status} ${response.statusText}`
      );
    }

    const officials = await response.json();
    officialsCache.set(cityId, officials);
    return officials;
  } catch (error) {
    console.error('Error loading officials:', error);
    return [];
  }
}
