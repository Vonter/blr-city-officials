import type { Feature, FeatureCollection } from 'geojson';
import type { LngLat } from 'maplibre-gl';

interface BoundaryDetailsResponse {
  boundaryData: FeatureCollection;
  districts: Array<{
    id: string;
    name: string;
    properties: any;
  }>;
}

interface CoordinateDetailsResponse {
  coordinates: { lng: number; lat: number };
  districts: Array<{
    id: string;
    name: string;
    boundaryId: string;
    properties: any;
    geometry: any;
  }>;
}

interface DistrictDetailsResponse {
  boundaryId: string;
  districtId: string;
  officials: any[];
  hasOfficials: boolean;
}

class ApiService {
  private cache = new Map<string, any>();
  private cacheExpiry = new Map<string, number>();
  private readonly CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

  private getCacheKey(endpoint: string, params: Record<string, any>): string {
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}=${params[key]}`)
      .join('&');
    return `${endpoint}?${sortedParams}`;
  }

  private isExpired(key: string): boolean {
    const expiry = this.cacheExpiry.get(key);
    return !expiry || Date.now() > expiry;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, data);
    this.cacheExpiry.set(key, Date.now() + this.CACHE_DURATION);
  }

  private getCache(key: string): any | null {
    if (this.isExpired(key)) {
      this.cache.delete(key);
      this.cacheExpiry.delete(key);
      return null;
    }
    return this.cache.get(key) || null;
  }

  async getBoundaryDetails(
    boundaryId: string
  ): Promise<BoundaryDetailsResponse | null> {
    const cacheKey = this.getCacheKey('boundary-details', { boundaryId });
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetch(
        `/api/boundary-details?boundaryId=${encodeURIComponent(boundaryId)}`
      );
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      this.setCache(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Failed to fetch boundary details from API:', error);
      return null;
    }
  }

  async getCoordinateDetails(
    lngLat: LngLat
  ): Promise<CoordinateDetailsResponse | null> {
    const cacheKey = this.getCacheKey('coordinate-details', {
      lng: lngLat.lng,
      lat: lngLat.lat
    });
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetch(
        `/api/coordinate-details?lng=${lngLat.lng}&lat=${lngLat.lat}`
      );
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      this.setCache(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Failed to fetch coordinate details from API:', error);
      return null;
    }
  }

  async getDistrictDetails(
    boundaryId: string,
    districtId: string
  ): Promise<DistrictDetailsResponse | null> {
    const cacheKey = this.getCacheKey('district-details', {
      boundaryId,
      districtId
    });
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetch(
        `/api/district-details?boundaryId=${encodeURIComponent(boundaryId)}&districtId=${encodeURIComponent(districtId)}`
      );
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      this.setCache(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Failed to fetch district details from API:', error);
      return null;
    }
  }

  // Clear cache for testing or when needed
  clearCache(): void {
    this.cache.clear();
    this.cacheExpiry.clear();
  }
}

export const api = new ApiService();
