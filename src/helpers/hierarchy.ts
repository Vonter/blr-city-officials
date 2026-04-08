import type { Feature, FeatureCollection } from 'geojson';
import { layers } from '../assets/boundaries';
import { getOfficialDetails } from './helpers';
import { findParentBoundaryName } from './spatial';

export interface HierarchyLevel {
  deptKey: string;
  areaName: string;
  officials: any[];
}

export function resolveHierarchy(
  boundaryId: string,
  districtId: string,
  officials: any[],
  boundariesData: FeatureCollection | null
): HierarchyLevel[] {
  const levels: HierarchyLevel[] = [];

  const currentOfficials =
    getOfficialDetails(boundaryId, districtId, officials) || [];
  levels.push({
    deptKey: boundaryId,
    areaName: districtId,
    officials: currentOfficials
  });

  if (boundariesData) {
    const districtFeatures = boundariesData.features.filter(
      (f: Feature) =>
        f.properties?.['id'] === boundaryId &&
        f.properties?.['namecol'] === districtId
    );

    if (districtFeatures.length > 0) {
      let parentKey = layers[boundaryId]?.parentDepartment;
      let childFeature = districtFeatures[0]!;

      while (parentKey && layers[parentKey]) {
        const parentFeatures = boundariesData.features.filter(
          (f: Feature) => f.properties?.['id'] === parentKey
        );
        const parentName = findParentBoundaryName(childFeature, parentFeatures);

        if (parentName) {
          const parentOfficials =
            getOfficialDetails(parentKey, parentName, officials) || [];
          levels.push({
            deptKey: parentKey,
            areaName: parentName,
            officials: parentOfficials
          });

          const parentFeature = parentFeatures.find(
            (f: Feature) => f.properties?.['namecol'] === parentName
          );
          if (parentFeature) {
            childFeature = parentFeature;
          }
        }

        parentKey = layers[parentKey]?.parentDepartment;
      }
    }
  }

  return levels;
}
