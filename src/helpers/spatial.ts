import type { Feature, FeatureCollection } from 'geojson';
import PolygonLookup from 'polygon-lookup';
import { findPolylabel } from './helpers';

export function findParentBoundaryName(
  childFeature: Feature,
  parentFeatures: Feature[]
): string | null {
  const centroid = findPolylabel(childFeature);
  if (!centroid || centroid.length < 2) return null;

  const lookup = new PolygonLookup({
    type: 'FeatureCollection',
    features: parentFeatures
  } as FeatureCollection);

  const result = lookup.search(centroid[0]!, centroid[1]!);
  return result?.properties?.['namecol'] || null;
}
