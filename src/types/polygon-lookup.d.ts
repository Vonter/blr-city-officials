declare module 'polygon-lookup' {
  import type { FeatureCollection, Feature } from 'geojson';

  interface SearchResult {
    features: Feature[];
  }

  class PolygonLookup {
    constructor(featureCollection: FeatureCollection);
    search(longitude: number, latitude: number, limit?: number): SearchResult;
  }

  export = PolygonLookup;
}
