import type { Map as MaplibreMap } from 'maplibre-gl';

export function setHoverState(
  map: MaplibreMap | undefined,
  sourceId: string,
  featureId: string | number | undefined,
  hover: boolean
): void {
  if (!map || featureId == null) return;
  if (!map.getSource(sourceId)) return;
  map.setFeatureState({ source: sourceId, id: featureId }, { hover });
}

export function updateHoverFeature(
  map: MaplibreMap | undefined,
  sourceId: string,
  currentId: string | number | undefined,
  newId: string | number | undefined
): void {
  if (newId === currentId) return;
  setHoverState(map, sourceId, currentId, false);
  setHoverState(map, sourceId, newId, true);
}
