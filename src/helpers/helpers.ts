import polylabel from '@mapbox/polylabel';
import type { Feature, Position } from 'geojson';
import turfArea from '@turf/area';
import * as turf from '@turf/bbox';
import turfUnion from '@turf/union';
import type maplibregl from 'maplibre-gl';

export const defaultZoom: Partial<maplibregl.MapOptions> = {
  zoom: 9.6,
  center: [77.6, 12.974]
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
      const area = turfArea({ type: 'Polygon', coordinates: p });
      if (area > maxArea) {
        maxPolygon = p;
        maxArea = area;
      }
    }
    output = polylabel(maxPolygon);
  }

  return output;
}

export function sortedDistricts(features: Feature[]) {
  return (
    features &&
    features
      .sort(
        (a, b) => a.properties?.namecol.localeCompare(b.properties?.namecol) // Sort alphabetical districts
      )
      .sort(
        (a, b) => a.properties?.namecol - b.properties?.namecol // Sort numerical districts
      )
  );
}

export function zoomToBound(map: maplibregl.Map, bounds: turf.BBox) {
  // Turf's bbox can return either Box2D (4-item array) or Box3D (6-item array)
  // fitBounds() only accepts a 4-item array, so we need to save the output before using it
  // See https://github.com/Turfjs/turf/issues/1807

  const [x1, y1, x2, y2] = bounds;

  map.fitBounds([x1, y1, x2, y2], {
    padding: { top: 72, bottom: 24, left: 16, right: 16 },
    maxZoom: 13
  });
}

export function resetZoom(map: maplibregl.Map) {
  map.flyTo(defaultZoom);
}

export function getDownloadableUrl(content: Object, geojson: boolean) {
  if (geojson) {
    const jsonContent = JSON.stringify(content, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    return URL.createObjectURL(blob);
  } else {
    const blob = new Blob([content]);
    return URL.createObjectURL(blob);
  }
}
