import { feature } from 'topojson-client';
import type { Feature, FeatureCollection } from 'geojson';
import { cityConfig } from '../configs/config';

// Load boundaries from static files
export async function loadBoundaries(baseUrl?: string): Promise<FeatureCollection> {
  try {
    const boundariesUrl = `${baseUrl}/${cityConfig.cityId}/boundaries.json`;
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

    return geojson;
  } catch (error) {
    console.error('Error loading boundaries:', error);
    throw error;
  }
}

// Load officials from static files
export async function loadOfficials(baseUrl?: string): Promise<any[]> {
  try {
    const officialsUrl = `${baseUrl}/${cityConfig.cityId}/officials.json`;
    const response = await fetch(officialsUrl);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch officials: ${response.status} ${response.statusText}`
      );
    }

    const officials = await response.json();
    return officials;
  } catch (error) {
    console.error('Error loading officials:', error);
    return [];
  }
}

export function sortedDistricts(features: Feature[]): Feature[] {
  return features.sort((a, b) => {
    const aName = a.properties?.['namecol'] || '';
    const bName = b.properties?.['namecol'] || '';

    const aNumber = parseInt(aName.split(':')[0]);
    const bNumber = parseInt(bName.split(':')[0]);

    if (!isNaN(aNumber) && !isNaN(bNumber)) {
      return aNumber - bNumber; // Sort numerical districts
    } else if (!isNaN(aNumber)) {
      return -1; // Put numerical districts first
    } else if (!isNaN(bNumber)) {
      return 1; // Put alphabetical districts after numerical
    } else {
      return aName.localeCompare(bName); // Sort alphabetical districts
    }
  });
}

export function getOfficialDetails(
  boundaryId: string | null,
  districtId: string | null,
  officials: any[]
) {
  if (!boundaryId || !districtId) return null;

  const matchingOfficials = officials.filter((official, index) => {
    if (
      official.Department.toLowerCase() === boundaryId.toLowerCase() &&
      official.Area.toLowerCase() === districtId.toLowerCase()
    ) {
      (official as any).cellRef = `A${index + 2}`;
      return true;
    }
    return false;
  });

  return matchingOfficials.length > 0 ? matchingOfficials : null;
}
