import type { LngLat } from 'maplibre-gl';
import { cityConfig } from '../configs/config';

interface BoundaryDistrict {
  namecol: string;
  wardName: string;
  boundaryNumber: string;
}

interface BoundaryDetailsResponse {
  districts: BoundaryDistrict[];
}

interface CoordinateDistrict {
  id: string;
  namecol: string;
  wardName: string;
  boundaryNumber: string;
}

interface CoordinateDetailsResponse {
  districts: CoordinateDistrict[];
}

interface DistrictDetailsResponse {
  officials: any[];
}

class ApiService {
  private cache = new Map<string, any>();
  private cacheExpiry = new Map<string, number>();
  private readonly CACHE_DURATION = 30 * 60 * 1000;
  private readonly MAX_ENTRIES = 100;

  private getCacheKey(endpoint: string, params: Record<string, any>): string {
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}=${params[key]}`)
      .join('&');
    return `${endpoint}?${sortedParams}`;
  }

  private getCache(key: string): any | null {
    const expiry = this.cacheExpiry.get(key);
    if (!expiry || Date.now() > expiry) {
      this.cache.delete(key);
      this.cacheExpiry.delete(key);
      return null;
    }
    return this.cache.get(key) || null;
  }

  private setCache(key: string, data: any): void {
    if (this.cache.size >= this.MAX_ENTRIES) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey !== undefined) {
        this.cache.delete(oldestKey);
        this.cacheExpiry.delete(oldestKey);
      }
    }
    this.cache.set(key, data);
    this.cacheExpiry.set(key, Date.now() + this.CACHE_DURATION);
  }

  private async fetchCachedApi<T>(
    endpoint: string,
    params: Record<string, string | number>
  ): Promise<T | null> {
    const cacheKey = this.getCacheKey(endpoint, params);
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    try {
      const queryString = Object.entries(params)
        .map(
          ([k, v]) =>
            `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`
        )
        .join('&');
      const response = await fetch(`/api/${endpoint}?${queryString}`);
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      this.setCache(cacheKey, data);
      return data;
    } catch (error) {
      console.error(`Failed to fetch ${endpoint}:`, error);
      return null;
    }
  }

  async getBoundaryDetails(
    boundaryId: string
  ): Promise<BoundaryDetailsResponse | null> {
    return this.fetchCachedApi('boundary-details', {
      city: cityConfig.cityId,
      boundaryId
    });
  }

  async getCoordinateDetails(
    lngLat: LngLat
  ): Promise<CoordinateDetailsResponse | null> {
    return this.fetchCachedApi('coordinate-details', {
      city: cityConfig.cityId,
      lng: lngLat.lng,
      lat: lngLat.lat
    });
  }

  async getDistrictDetails(
    boundaryId: string,
    districtId: string
  ): Promise<DistrictDetailsResponse | null> {
    return this.fetchCachedApi('district-details', {
      city: cityConfig.cityId,
      boundaryId,
      districtId
    });
  }

  clearCache(): void {
    this.cache.clear();
    this.cacheExpiry.clear();
  }
}

export const api = new ApiService();
