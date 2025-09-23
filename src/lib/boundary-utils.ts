import { feature } from 'topojson-client';
import type { Feature, FeatureCollection } from 'geojson';
import { readFileSync } from 'fs';
import { join } from 'path';
import { cityConfig } from '../configs/config';

// Load boundaries from file system
export async function loadBoundaries(): Promise<FeatureCollection> {
  try {
    const boundariesPath = join(
      process.cwd(),
      'static',
      cityConfig.cityId,
      'boundaries.json'
    );
    const topojsonData = JSON.parse(readFileSync(boundariesPath, 'utf-8'));
    const geojson = feature(
      topojsonData,
      topojsonData.objects.boundaries
    ) as unknown as FeatureCollection;

    return geojson;
  } catch (error) {
    console.error('Error loading boundaries from file:', error);
    throw error;
  }
}

// Load officials from file system
export async function loadOfficials(): Promise<any[]> {
  try {
    const officialsPath = join(
      process.cwd(),
      'static',
      cityConfig.cityId,
      'officials.json'
    );
    const officials = JSON.parse(readFileSync(officialsPath, 'utf-8'));
    return officials;
  } catch (error) {
    console.error('Error loading officials from file:', error);
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
