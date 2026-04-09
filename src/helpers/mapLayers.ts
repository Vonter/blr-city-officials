import type { Map as MaplibreMap } from 'maplibre-gl';
import type { Feature, FeatureCollection } from 'geojson';
import { findPolylabel } from './helpers';
import { getBoundaryColor } from './colors';

export const wardLabelExpression: any = [
  'case',
  ['!=', ['get', 'boundaryNumber'], ''],
  [
    'concat',
    ['get', 'boundaryNumber'],
    ': ',
    ['coalesce', ['get', 'wardName'], ['get', 'namecol']]
  ],
  ['coalesce', ['get', 'wardName'], ['get', 'namecol']]
];

export interface MapLayerGroup {
  render: (features: Feature[], deptKey: string, dark: boolean) => void;
  remove: () => void;
}

export function createBoundaryLayerGroup(
  map: MaplibreMap,
  prefix: string
): MapLayerGroup {
  const sourceId = `${prefix}-source`;
  const cpSourceId = `${prefix}-centerpoints`;
  const strokeId = `${prefix}-stroke`;
  const labelId = `${prefix}-label`;

  function remove() {
    if (map.getLayer(labelId)) map.removeLayer(labelId);
    if (map.getLayer(strokeId)) map.removeLayer(strokeId);
    if (map.getSource(cpSourceId)) map.removeSource(cpSourceId);
    if (map.getSource(sourceId)) map.removeSource(sourceId);
  }

  function render(features: Feature[], deptKey: string, dark: boolean) {
    if (features.length === 0) return;

    const color = getBoundaryColor(deptKey, dark);

    const fc: FeatureCollection = {
      type: 'FeatureCollection',
      features
    };

    const cpFc: FeatureCollection = {
      type: 'FeatureCollection',
      features: features.map(f => ({
        ...f,
        geometry: { type: 'Point' as const, coordinates: findPolylabel(f) }
      }))
    };

    if (map.getSource(sourceId)) {
      (map.getSource(sourceId) as any).setData(fc);
      (map.getSource(cpSourceId) as any).setData(cpFc);
    } else {
      map.addSource(sourceId, { type: 'geojson', data: fc });
      map.addSource(cpSourceId, { type: 'geojson', data: cpFc });

      map.addLayer({
        id: strokeId,
        type: 'line',
        source: sourceId,
        paint: {
          'line-color': color,
          'line-width': dark ? 1 : 1.5
        }
      });

      map.addLayer({
        id: labelId,
        type: 'symbol',
        source: cpSourceId,
        paint: {
          'text-color': color,
          'text-halo-color': dark
            ? 'rgba(0,0,0,0.4)'
            : 'rgba(255,255,255,0.95)',
          'text-halo-width': dark ? 2 : 2.5
        },
        layout: {
          'text-field': wardLabelExpression,
          'text-size': ['interpolate', ['linear'], ['zoom'], 11, 12.5, 32, 60]
        }
      });
    }
  }

  return { render, remove };
}
