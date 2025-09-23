import polylabel from '@mapbox/polylabel';
import type { Feature, Position } from 'geojson';
import turfArea from '@turf/area';
import * as turf from '@turf/bbox';
import type maplibregl from 'maplibre-gl';
import officials from '../officials.json';
import type { LngLat } from 'maplibre-gl';
import { cityConfig } from '../configs/config';

export const defaultZoom: Partial<maplibregl.MapOptions> = {
  zoom: cityConfig.map.defaultZoom,
  center: cityConfig.map.defaultCenter
};

export function findPolylabel(feature: Feature) {
  let output: number[] = [];
  if (feature.geometry.type === 'Polygon') {
    output = polylabel(feature.geometry.coordinates);
  }

  if (feature.geometry.type === 'MultiPolygon') {
    let maxArea = 0,
      maxPolygon: Position[][] = [];
    for (let i = 0, l = feature.geometry.coordinates.length; i < l; i++) {
      const p = feature.geometry.coordinates[i];
      if (p) {
        const area = turfArea({ type: 'Polygon', coordinates: p });
        if (area > maxArea) {
          maxPolygon = p;
          maxArea = area;
        }
      }
    }
    output = polylabel(maxPolygon);
  }

  return output;
}

export function sortedDistricts(features: Feature[]) {
  return (
    features &&
    features.sort((a, b) => {
      const aName = a.properties?.['namecol'];
      const bName = b.properties?.['namecol'];

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
    })
  );
}

export function zoomToBound(map: maplibregl.Map, bounds: turf.BBox) {
  const [x1, y1, x2, y2] = bounds;

  map.fitBounds([x1, y1, x2, y2], {
    padding: { top: 72, bottom: 24, left: 16, right: 16 },
    maxZoom: 15
  });
}

export function resetZoom(map: maplibregl.Map) {
  map.flyTo(defaultZoom);
}

export function getOfficialDetails(
  boundaryId: string | null,
  districtId: string | null
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

export function getLngLat(params: URLSearchParams): LngLat | null {
  const lng = params.get('lng');
  const lat = params.get('lat');
  return lng && lat ? ({ lng: +lng, lat: +lat } as LngLat) : null;
}
